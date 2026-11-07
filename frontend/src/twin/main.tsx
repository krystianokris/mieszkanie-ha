import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { staticBase } from "../app/art";
import { createMockHass } from "../demo/mock-hass";
import { setPreferredLang } from "../sdk/i18n";
import type { Hass, PanelInfo, PanelRoute } from "../sdk/types";
import krystalStyles from "../styles/app.css?inline";
import twinStyles from "./twin.css?inline";
import { TwinApp } from "./TwinApp";
import type { TwinLayout } from "./model";

const VERSION = "0.1.0";
const DEMO_AFTER_MS = 1500;
const LAYOUT_TIMEOUT_MS = 8000;
/** A panel detached for longer than this (navigated away) is torn down. */
const DISPOSE_AFTER_MS = 60_000;

/**
 * `<krystal-twin-panel>`: Home Assistant sets `hass`, `narrow`, `route` and `panel`
 * in any order, possibly before the element is attached. Without Home Assistant
 * it falls back to demo states and the example layout.
 */
class KrystalTwinPanel extends HTMLElement {
  private readonly hassSignal = createSignal<Hass | undefined>(undefined, { equals: false });
  private readonly layoutSignal = createSignal<TwinLayout | null | undefined>(undefined);
  private readonly narrowSignal = createSignal(false);
  private readonly demoSignal = createSignal(false);
  private readonly routeSignal = createSignal<PanelRoute | undefined>(undefined);
  private panelInfo?: PanelInfo;
  private dispose?: () => void;
  private demoTimer?: ReturnType<typeof setTimeout>;
  private disposeTimer?: ReturnType<typeof setTimeout>;
  private live = false;
  private layoutRequested: string | null | undefined;

  set hass(value: Hass) {
    this.live = true;
    this.demoSignal[1](false);
    clearTimeout(this.demoTimer);
    this.hassSignal[1](value);
    if (this.layoutRequested === undefined) void this.loadLayout(this.panelInfo?.config?.layout ?? null);
  }

  get hass(): Hass | undefined {
    return this.hassSignal[0]();
  }

  set narrow(value: boolean) {
    this.narrowSignal[1](Boolean(value));
  }

  get narrow(): boolean {
    return this.narrowSignal[0]();
  }

  set route(value: PanelRoute | undefined) {
    this.routeSignal[1](value);
  }

  get route(): PanelRoute | undefined {
    return this.routeSignal[0]();
  }

  set panel(value: PanelInfo | undefined) {
    this.panelInfo = value;
    void this.loadLayout(value?.config?.layout ?? null);
  }

  get panel(): PanelInfo | undefined {
    return this.panelInfo;
  }

  private async loadLayout(hash: string | null) {
    const key = hash ?? "";
    if (this.layoutRequested === key) return;
    this.layoutRequested = key;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), LAYOUT_TIMEOUT_MS);
    let layout: TwinLayout | null = null;
    try {
      const url = `${staticBase}layout.json${hash ? `?v=${encodeURIComponent(hash)}` : ""}`;
      const res = await fetch(url, { credentials: "same-origin", cache: hash ? "default" : "no-cache", signal: controller.signal });
      const data = res.ok ? ((await res.json()) as TwinLayout) : null;
      layout = data && data.version === 1 ? data : null;
    } catch (err) {
      console.warn("[krystal-twin] layout.json could not be loaded", err);
    } finally {
      clearTimeout(timer);
    }
    if (this.layoutRequested !== key) return;
    setPreferredLang(layout?.language ?? "pl");
    this.layoutSignal[1](layout);
  }

  /** Properties set before the element was upgraded shadow the setters; replay them. */
  private upgradeProperties() {
    for (const prop of ["hass", "narrow", "route", "panel"] as const) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        const value = (this as Record<string, unknown>)[prop];
        delete (this as Record<string, unknown>)[prop];
        (this as Record<string, unknown>)[prop] = value;
      }
    }
  }

  connectedCallback() {
    this.upgradeProperties();
    // Keep the running app (taps, timers, zoom) when Home Assistant re-attaches the element.
    clearTimeout(this.disposeTimer);
    if (this.dispose && this.shadowRoot?.querySelector(".tw-mount")) return;
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      style.textContent = `${krystalStyles}\n${twinStyles}`;
      shadow.append(style);
    }
    const shadow = this.shadowRoot!;
    shadow.querySelector(".tw-mount")?.remove();
    const mount = document.createElement("div");
    mount.className = "tw-mount";
    shadow.append(mount);
    this.dispose = render(
      () => (
        <TwinApp
          hass={this.hassSignal[0]}
          layout={this.layoutSignal[0]}
          demo={this.demoSignal[0]}
          narrow={this.narrowSignal[0]}
          version={() => VERSION}
          route={this.routeSignal[0]}
          host={this}
        />
      ),
      mount,
    );
    if (!this.live) {
      this.demoTimer = setTimeout(() => this.startDemo(), new URLSearchParams(location.search).has("demo") ? 0 : DEMO_AFTER_MS);
    } else if (this.layoutRequested === undefined) {
      void this.loadLayout(this.panelInfo?.config?.layout ?? null);
    }
  }

  disconnectedCallback() {
    clearTimeout(this.disposeTimer);
    this.disposeTimer = setTimeout(() => {
      clearTimeout(this.demoTimer);
      this.dispose?.();
      this.dispose = undefined;
      this.shadowRoot?.querySelector(".tw-mount")?.remove();
    }, DISPOSE_AFTER_MS);
  }

  private startDemo() {
    if (this.live) return;
    this.demoSignal[1](true);
    void this.loadLayout(null);
    const mock = createMockHass((next) => this.hassSignal[1](next));
    this.hassSignal[1](mock);
  }
}

if (!customElements.get("krystal-twin-panel")) {
  customElements.define("krystal-twin-panel", KrystalTwinPanel);
}
