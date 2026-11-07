/** Shape of `layout.json` (written by tools/luma_to_layout.py or built automatically). */

export type ItemKind =
  | "light"
  | "plug"
  | "fan"
  | "purifier"
  | "climate"
  | "media"
  | "binary"
  | "sensor"
  | "setting"
  | string;

export interface LayoutItem {
  entity: string;
  name?: string;
  kind?: ItemKind;
  art?: string;
  action?: "toggle" | "info";
  icon?: string;
}

export interface LayoutSection {
  id: string;
  kicker?: string;
  title?: string;
  icon?: string;
  accent?: string;
  items: LayoutItem[];
}

export interface LayoutRoomCard {
  page?: string;
  name: string;
  icon?: string;
  image?: string;
  temperature?: string;
  humidity?: string;
  entities?: string[];
  detail?: string;
}

export interface LayoutPage {
  id: string;
  title: string;
  icon?: string;
  kind: "overview" | "room" | "page";
  kicker?: string;
  heading?: string;
  subtitle?: string;
  accent?: string;
  image?: string;
  temperature?: string;
  humidity?: string;
  devices?: LayoutItem[];
  media?: { entity: string; name?: string }[];
  sections?: LayoutSection[];
  rooms?: LayoutRoomCard[];
}

export interface LayoutSummary {
  kicker?: string;
  title?: string;
  subtitle?: string;
  weather?: string;
  power?: string;
  lights?: string[];
  alerts?: string[];
}

export interface EnergyIds {
  elecRate?: string;
  elecNext?: string;
  elecCost?: string;
  elecUse?: string;
  demand?: string;
  ratesToday?: string;
  ratesTomorrow?: string;
  gasRate?: string;
  gasCost?: string;
  gasUse?: string;
  waterUse?: string;
  waterCost?: string;
  waterReading?: string;
}

export interface ApplianceIds {
  status?: string;
  phase?: string;
  remaining?: string;
  total?: string;
  program?: string;
  progress?: string;
  finish?: string;
}

export interface LayoutFeatures {
  energy?: EnergyIds;
  laundry?: { washer?: ApplianceIds; dryer?: ApplianceIds };
  fuel?: { fuel?: string; radius?: number; unit?: string };
  /** f1_sensor entity per role (see F1Ids in f1-data.ts). */
  f1?: Record<string, string>;
  /** AC climate id → switches/selects of the same device (quiet, panel light, sleep…). */
  climateExtras?: Record<string, string[]>;
}

export interface KrystalLayout {
  version: 1;
  source: string;
  summary: LayoutSummary;
  pages: LayoutPage[];
  features?: LayoutFeatures;
  /** Display-name overrides by entity id (cleaned Polish names written by the converter). */
  names?: Record<string, string>;
  /** UI language the layout was written in; wins over the HA user language. */
  language?: string;
}

export function isLayout(value: unknown): value is KrystalLayout {
  const v = value as KrystalLayout | null;
  return !!v && v.version === 1 && Array.isArray(v.pages) && v.pages.length > 0;
}
