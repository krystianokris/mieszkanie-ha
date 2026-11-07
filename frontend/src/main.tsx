import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { App } from "./app/App";
import { staticBase } from "./app/art";
import { isLayout, type KrystalLayout } from "./app/model";
import { demoLayout } from "./demo/demo-layout";
import { createMockHass } from "./demo/mock-hass";
import { setPreferredLang } from "./sdk/i18n";
import type { Hass, PanelInfo, PanelRoute } from "./sdk/types";
import styles from "./styles/app.css?inline";

const VERSION = "0.3.1";
const DEMO_AFTER_MS = 1500;
const LAYOUT_TIMEOUT_MS = 8000;
/** A panel detached for longer than this (navigated away) is torn down. */
const DISPOSE_AFTER_MS = 60_000;

/**
 * `<krystal-panel>`: Home Assistant sets `hass`, `narrow`, `route` and `panel`
 * on custom panels, in any order and possibly before the element is attached.
 * Opened without Home Assistant, it falls back to demo data.
 */
class KrystalPanel extends HTMLElement {
  private readonly hassSignal = createSignal<Hass | undefined>(undefined, { equals: false });
  private readonly layoutSignal = createSignal<KrystalLayout | null | undefined>(undefined);
  private readonly narrowSignal = createSignal(false);
  private readonly demoSignal = createSignal(false);
  private readonly versionSignal = createSignal(VERSION);
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
    const config = value?.config;
    if (config?.version) this.versionSignal[1](config.version);
    void this.loadLayout(config?.layout ?? null);
  }

  get panel(): PanelInfo | undefined {
    return this.panelInfo;
  }

  /**
   * layout.json sits next to the bundle; the integration passes its hash for
   * cache busting. Without a hash the file is still tried once, unversioned.
   */
  private async loadLayout(hash: string | null) {
    const key = hash ?? "";
    if (this.layoutRequested === key) return;
    this.layoutRequested = key;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), LAYOUT_TIMEOUT_MS);
    let layout: KrystalLayout | null = null;
    try {
      const url = `${staticBase}layout.json${hash ? `?v=${encodeURIComponent(hash)}` : ""}`;
      const res = await fetch(url, { credentials: "same-origin", cache: hash ? "default" : "no-cache", signal: controller.signal });
      const data: unknown = res.ok ? await res.json() : null;
      layout = isLayout(data) ? data : null;
    } catch (err) {
      console.warn("[krystal] layout.json could not be loaded, using automatic layout", err);
    } finally {
      clearTimeout(timer);
    }
    if (this.layoutRequested !== key) return;
    setPreferredLang(layout?.language);
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
    // Home Assistant may detach and re-attach the panel element; keep the running app
    // (and its in-flight taps, timers and scroll) instead of rebuilding it.
    clearTimeout(this.disposeTimer);
    if (this.dispose && this.shadowRoot?.querySelector(".k-mount")) return;
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      style.textContent = styles;
      shadow.append(style);
    }
    const shadow = this.shadowRoot!;
    shadow.querySelector(".k-mount")?.remove();
    const mount = document.createElement("div");
    mount.className = "k-mount";
    shadow.append(mount);
    try {
      this.dispose = render(
        () => (
          <App
            hass={this.hassSignal[0]}
            layout={this.layoutSignal[0]}
            demo={this.demoSignal[0]}
            narrow={this.narrowSignal[0]}
            version={this.versionSignal[0]}
            route={this.routeSignal[0]}
            host={this}
          />
        ),
        mount,
      );
    } catch (err) {
      console.error("[krystal] render failed", err);
      mount.innerHTML = "";
      const box = document.createElement("pre");
      box.className = "k-fatal";
      box.textContent = `Krystal could not start.\n${String((err as Error)?.stack ?? err)}`;
      mount.append(box);
    }

    const params = new URLSearchParams(location.search);
    if (!this.live) {
      this.demoTimer = setTimeout(() => void this.startDemo(params), params.has("demo") ? 0 : DEMO_AFTER_MS);
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
      this.shadowRoot?.querySelector(".k-mount")?.remove();
    }, DISPOSE_AFTER_MS);
  }

  /** `?auto` previews automatic rooms, `?layout` previews an installed layout.json against demo states. */
  private async startDemo(params: URLSearchParams) {
    if (this.live) return;
    this.demoSignal[1](true);
    if (params.has("layout")) await this.loadLayout(String(Date.now()));
    else this.layoutSignal[1](params.has("auto") ? null : demoLayout);
    const mock = createMockHass((next) => this.hassSignal[1](next));
    this.hassSignal[1](mock);
  }
}

// Animatable angle for the radar sweep (CSS @property does not apply inside shadow roots).
try {
  CSS.registerProperty?.({ name: "--k-sweep", syntax: "<angle>", inherits: false, initialValue: "0deg" });
} catch {
  /* already registered */
}

if (!customElements.get("krystal-panel")) {
  customElements.define("krystal-panel", KrystalPanel);
}
