import { createContext, createMemo, useContext, type Accessor, type JSX } from "solid-js";
import type { Hass, HassEntity } from "./types";

export type Breakpoint = "lg" | "md" | "sm";

export interface KrystalContext {
  hass: Accessor<Hass | undefined>;
  demo: Accessor<boolean>;
  narrow: Accessor<boolean>;
  breakpoint: Accessor<Breakpoint>;
  version: Accessor<string>;
  page: Accessor<string>;
  navigate: (pageId: string) => void;
  /** Element that dispatches Home Assistant UI events (more-info, menu). */
  host: HTMLElement;
}

const Ctx = createContext<KrystalContext>();

export function KrystalProvider(props: { value: KrystalContext; children: JSX.Element }) {
  return <Ctx.Provider value={props.value}>{props.children}</Ctx.Provider>;
}

export function useKrystal(): KrystalContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Krystal context is missing");
  return ctx;
}

export function useHass(): Accessor<Hass | undefined> {
  return useKrystal().hass;
}

/**
 * Reactive view of one entity. Home Assistant keeps the same state object
 * while an entity is unchanged, so dependants only re-run on real updates.
 */
export function useEntity(id: string | Accessor<string | undefined>): Accessor<HassEntity | undefined> {
  const hass = useHass();
  return createMemo(() => {
    const entityId = typeof id === "function" ? id() : id;
    return entityId ? hass()?.states[entityId] : undefined;
  });
}

export type ServiceCaller = (
  domain: string,
  service: string,
  data?: Record<string, unknown>,
) => Promise<boolean>;

/** Returns a caller that resolves to `false` instead of throwing. */
export function useService(): ServiceCaller {
  const hass = useHass();
  return async (domain, service, data) => {
    const h = hass();
    if (!h) return false;
    try {
      await h.callService(domain, service, data);
      return true;
    } catch (err) {
      console.warn(`[krystal] ${domain}.${service} failed`, err);
      return false;
    }
  };
}

/** Opens Home Assistant's own more-info dialog for an entity. */
export function useMoreInfo(): (entityId: string) => void {
  const { host } = useKrystal();
  return (entityId) =>
    host.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));
}
