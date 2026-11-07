import type { KrystalLayout } from "../app/model";

/** One entity that drives an overlay, tied to an anchor of scene.json. */
export interface TwinEntry {
  entity: string;
  anchor?: string;
  name?: string;
  kind?: "leak" | "co" | string;
  /** Remaining-time sensor for appliances. */
  remaining?: string;
  /** Power sensor measuring this device when it isn't on the same HA device (e.g. a smart plug). */
  power?: string;
}

export interface TwinRoom {
  page?: string | null;
  lights?: TwinEntry[];
  climate?: TwinEntry[];
  media?: TwinEntry[];
  windows?: TwinEntry[];
  motion?: TwinEntry[];
  alarms?: TwinEntry[];
  appliances?: TwinEntry[];
  pets?: TwinEntry[];
  purifier?: TwinEntry[];
  fan?: TwinEntry[];
  temperature?: string;
  humidity?: string;
}

export interface TwinHud {
  weather?: string;
  power?: string;
  cost?: string;
  alerts?: string[];
  sun?: string;
}

export interface TwinLayout extends KrystalLayout {
  twin?: { rooms: Record<string, TwinRoom>; hud: TwinHud };
}

export type Mode = "home" | "heat" | "security" | "energy";
