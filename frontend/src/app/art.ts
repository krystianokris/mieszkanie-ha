import { domainOf, slug, type HassEntity } from "../sdk";
import type { LayoutItem } from "./model";

/**
 * Static files live next to the bundle (`/krystal_static/...` inside Home
 * Assistant). The module URL carries a `?v=` query, so trim from the last slash.
 */
export const staticBase = import.meta.env.DEV ? "/" : import.meta.url.slice(0, import.meta.url.lastIndexOf("/") + 1);

const ART_KEYS = [
  "dial", "bulb", "plug", "washer", "dryer", "bolt", "bin-blue", "bin-black", "bin-green", "pump-diesel", "pump-petrol",
  "purifier", "air", "humidity", "window", "door", "leak", "motion", "smoke", "speaker", "tv", "camera", "radiator",
  "flame", "watermeter", "f1", "shield", "ac", "parcel", "printer", "feeder", "litter", "battery", "network", "calendar",
  "thermometer", "extractor-fan", "floor-lamp", "co",
] as const;

export type ArtKey = (typeof ART_KEYS)[number];

export const art: Record<string, string> = Object.fromEntries(ART_KEYS.map((k) => [k, `${staticBase}art/soft-${k}.webp`]));

export type ArtCategory =
  | "light" | "climate" | "air" | "energy" | "water" | "gas" | "security" | "media" | "laundry" | "fuel" | "f1" | "bins" | "home" | "pets" | "battery";

/** One accent per category; hero art glows in it and small glyph wells are tinted with it. */
export const CATEGORY: Record<ArtCategory, { accent: string; pl: string; en: string }> = {
  light: { accent: "#ffc47a", pl: "Światło", en: "Lighting" },
  climate: { accent: "#5fdbff", pl: "Klimat", en: "Climate" },
  air: { accent: "#7ff0d0", pl: "Powietrze", en: "Air" },
  energy: { accent: "#df75ff", pl: "Prąd", en: "Electricity" },
  water: { accent: "#61ddff", pl: "Woda", en: "Water" },
  gas: { accent: "#ffae62", pl: "Gaz", en: "Gas" },
  security: { accent: "#4be39a", pl: "Bezpieczeństwo", en: "Security" },
  media: { accent: "#6aa8ff", pl: "Media", en: "Media" },
  laundry: { accent: "#8debff", pl: "Pralnia", en: "Laundry" },
  fuel: { accent: "#a8e7c8", pl: "Paliwo", en: "Fuel" },
  f1: { accent: "#ff5a5a", pl: "F1", en: "F1" },
  bins: { accent: "#c3cfdf", pl: "Odpady", en: "Bins" },
  home: { accent: "#c3d5e9", pl: "Dom", en: "Home" },
  pets: { accent: "#ffb98a", pl: "Zwierzęta", en: "Pets" },
  battery: { accent: "#9fe870", pl: "Baterie", en: "Batteries" },
};

export interface ArtEntry {
  key: ArtKey;
  category: ArtCategory;
  pl: string;
  en: string;
  glyph: string;
  fresh?: boolean;
}

/** Every hero object Krystal uses, with its category and matching small glyph. */
export const ART_CATALOG: ArtEntry[] = [
  { key: "bulb", category: "light", pl: "Światło / lampa", en: "Light", glyph: "mdi:lightbulb-outline" },
  { key: "floor-lamp", category: "light", pl: "Lampa podłogowa", en: "Floor lamp", glyph: "mdi:floor-lamp-outline", fresh: true },
  { key: "plug", category: "light", pl: "Gniazdko", en: "Smart plug", glyph: "mdi:power-socket-uk" },
  { key: "dial", category: "climate", pl: "Termostat", en: "Thermostat", glyph: "mdi:thermostat" },
  { key: "thermometer", category: "climate", pl: "Termometr", en: "Thermometer", glyph: "mdi:thermometer", fresh: true },
  { key: "extractor-fan", category: "air", pl: "Wentylator łazienkowy", en: "Extractor fan", glyph: "mdi:fan", fresh: true },
  { key: "radiator", category: "climate", pl: "Grzejnik / głowica", en: "Radiator / TRV", glyph: "mdi:radiator" },
  { key: "ac", category: "climate", pl: "Klimatyzator", en: "Air conditioner", glyph: "mdi:air-conditioner" },
  { key: "purifier", category: "air", pl: "Oczyszczacz", en: "Purifier", glyph: "mdi:air-purifier" },
  { key: "air", category: "air", pl: "Jakość powietrza", en: "Air quality", glyph: "mdi:air-filter", fresh: true },
  { key: "humidity", category: "water", pl: "Wilgotność", en: "Humidity", glyph: "mdi:water-percent" },
  { key: "bolt", category: "energy", pl: "Prąd", en: "Electricity", glyph: "mdi:lightning-bolt" },
  { key: "flame", category: "gas", pl: "Gaz / kocioł", en: "Gas / boiler", glyph: "mdi:fire" },
  { key: "watermeter", category: "water", pl: "Licznik wody", en: "Water meter", glyph: "mdi:water" },
  { key: "leak", category: "water", pl: "Czujnik zalania", en: "Leak sensor", glyph: "mdi:water-alert-outline" },
  { key: "window", category: "security", pl: "Okno", en: "Window", glyph: "mdi:window-closed-variant" },
  { key: "door", category: "security", pl: "Drzwi", en: "Door", glyph: "mdi:door" },
  { key: "motion", category: "security", pl: "Ruch / obecność", en: "Motion", glyph: "mdi:motion-sensor" },
  { key: "smoke", category: "security", pl: "Czujnik dymu", en: "Smoke detector", glyph: "mdi:smoke-detector-variant", fresh: true },
  { key: "co", category: "security", pl: "Czujnik CO", en: "CO detector", glyph: "mdi:molecule-co", fresh: true },
  { key: "shield", category: "security", pl: "Alarm", en: "Alarm", glyph: "mdi:shield-home-outline" },
  { key: "camera", category: "security", pl: "Kamera", en: "Camera", glyph: "mdi:cctv" },
  { key: "speaker", category: "media", pl: "Głośnik", en: "Speaker", glyph: "mdi:speaker" },
  { key: "tv", category: "media", pl: "Telewizor", en: "TV", glyph: "mdi:television" },
  { key: "washer", category: "laundry", pl: "Pralka", en: "Washer", glyph: "mdi:washing-machine" },
  { key: "dryer", category: "laundry", pl: "Suszarka", en: "Dryer", glyph: "mdi:tumble-dryer" },
  { key: "pump-diesel", category: "fuel", pl: "Diesel", en: "Diesel", glyph: "mdi:gas-station" },
  { key: "pump-petrol", category: "fuel", pl: "Benzyna", en: "Petrol", glyph: "mdi:gas-station-outline" },
  { key: "f1", category: "f1", pl: "Bolid F1", en: "F1 car", glyph: "mdi:flag-checkered" },
  { key: "parcel", category: "home", pl: "Paczka", en: "Parcel", glyph: "mdi:package-variant-closed" },
  { key: "printer", category: "home", pl: "Drukarka 3D", en: "3D printer", glyph: "mdi:printer-3d" },
  { key: "network", category: "media", pl: "Sieć / Zigbee", en: "Network / Zigbee", glyph: "mdi:zigbee" },
  { key: "calendar", category: "home", pl: "Kalendarz / wywóz", en: "Calendar / bin day", glyph: "mdi:calendar-month-outline" },
  { key: "feeder", category: "pets", pl: "Karmnik", en: "Pet feeder", glyph: "mdi:food-drumstick-outline" },
  { key: "litter", category: "pets", pl: "Kuweta", en: "Litter box", glyph: "mdi:cat" },
  { key: "battery", category: "battery", pl: "Bateria", en: "Battery", glyph: "mdi:battery-high" },
  { key: "bin-blue", category: "bins", pl: "Kosz · recykling", en: "Recycling bin", glyph: "mdi:recycle" },
  { key: "bin-black", category: "bins", pl: "Kosz · zmieszane", en: "General waste", glyph: "mdi:trash-can-outline" },
  { key: "bin-green", category: "bins", pl: "Kosz · bio", en: "Garden waste", glyph: "mdi:leaf" },
];

const ENTRY = new Map(ART_CATALOG.map((e) => [e.key, e]));

export interface Visual {
  /** Hero art key when the entity is a device/measured thing worth an object. */
  art?: ArtKey;
  /** Glyph for wells; always present. */
  glyph: string;
  category: ArtCategory;
}

const has = (text: string, re: RegExp) => re.test(text);

const LAMP = /(lamp|swiatl|light|led|sufit|ceiling|kinkiet|wall_light)/;
const FLOOR_LAMP = /(podlog|floor_lamp|floorlamp|lampa_stojac|stojac)/;
const EXTRACTOR = /(wentyl|wyciag|extract|exhaust|bathroom_fan|_fan_|\bfan\b|fan_\d|wiatrak)/;
const PURIFIER = /(purif|oczyszcz|core_\d|vital|levoit|vesync|air_cleaner|winix|dyson)/;
const AIR_WORDS = /(pm2|pm_2|pm1|pm10|pyl|air_quality|jakosc_powietrza|czyste_powietrze|co2|carbon_dioxide|voc|aqi|tvoc)/;
const SMOKE_WORDS = /(smoke|dym|gas_detector|detektor_gazu)/;
const CO_WORDS = /(czad|carbon_monoxide|czujnik_co|_co_co|_co$|alarm_co)/;
const AC_WORDS = /(air_?cond|klima|split|aircon|_ac_|\bac\b|\bac$)/;

/** Lamp art for lights and for plugs/relays that drive a lamp; floor lamps get their own object. */
const lampArt = (text: string): ArtKey => (has(text, FLOOR_LAMP) ? "floor-lamp" : "bulb");

/** Device-level art by domain, device class and PL/EN name keywords (id, friendly name and layout name). */
function artKeyOf(id: string, e: HassEntity | undefined, kind?: string, name?: string): ArtKey | undefined {
  const domain = domainOf(id);
  const dc = String(e?.attributes.device_class ?? "");
  const text = `${slug(id)} ${slug(String(e?.attributes.friendly_name ?? ""))} ${slug(name ?? "")}`;

  if (domain === "climate") {
    const modes = (e?.attributes.hvac_modes as string[] | undefined) ?? [];
    if (has(text, AC_WORDS) || modes.some((m) => m === "cool" || m === "dry" || m === "fan_only")) return "ac";
    if (has(text, /(radiator|trv|grzejnik|kaloryfer|glowic)/)) return "radiator";
    return "dial";
  }
  if (domain === "switch" || domain === "input_boolean") {
    if (has(text, /(washing|pralk)/)) return "washer";
    if (has(text, /(suszar|dryer)/)) return "dryer";
    if (has(text, /(litter|kuwet)/)) return "litter";
    if (has(text, /(feeder|karm)/)) return "feeder";
    if (has(text, AC_WORDS)) return "ac";
    if (has(text, PURIFIER)) return "purifier";
    if (has(text, EXTRACTOR) && !has(text, LAMP)) return "extractor-fan";
  }
  if (kind === "purifier" || (domain === "fan" && has(text, PURIFIER))) return "purifier";
  if (kind === "fan" || domain === "fan") return has(text, PURIFIER) ? "purifier" : "extractor-fan";
  if (kind === "light" || domain === "light") return has(text, FLOOR_LAMP) ? "floor-lamp" : "bulb";
  if (kind === "plug") return has(text, LAMP) || has(text, FLOOR_LAMP) ? lampArt(text) : "plug";

  switch (domain) {
    case "switch":
    case "input_boolean":
      if (has(text, /(washing|pralk)/)) return "washer";
      if (has(text, /(suszar|dryer)/)) return "dryer";
      if (has(text, /(litter|kuwet)/)) return "litter";
      if (has(text, /(feeder|karm)/)) return "feeder";
      if (has(text, PURIFIER)) return "purifier";
      if (has(text, EXTRACTOR)) return "extractor-fan";
      if (has(text, LAMP) || has(text, FLOOR_LAMP) || has(text, /(_in_\d|hall|stairs|schody)/)) return lampArt(text);
      return "plug";
    case "water_heater":
      return "flame";
    case "media_player":
      if (has(text, /(tv|telewiz|television|streamer|fire_tv|projekt|webos|oled|chromecast|shield|roku|apple_tv)/)) return "tv";
      return "speaker";
    case "camera":
      return "camera";
    case "alarm_control_panel":
      return "shield";
    case "lock":
      return "door";
    case "cover":
      return has(text, /(garage|brama|gate)/) ? "door" : "window";
    case "calendar":
      return "calendar";
    case "binary_sensor":
      if (dc === "window" || dc === "opening" || has(text, /(okno|window)/)) return "window";
      if (dc === "door" || dc === "garage_door" || has(text, /(drzwi|door|brama)/)) return "door";
      if (dc === "moisture" || has(text, /(wyciek|leak|water_sensor|zalan)/)) return "leak";
      if (dc === "carbon_monoxide" || has(text, CO_WORDS)) return "co";
      if (dc === "smoke" || dc === "gas" || has(text, SMOKE_WORDS)) return "smoke";
      if (["motion", "occupancy", "presence"].includes(dc) || has(text, /(obecno|presence|occupancy|motion|ruch)/)) return "motion";
      if (dc === "battery") return "battery";
      if (dc === "connectivity") return "network";
      if (has(text, /(suszar|dryer)/)) return "dryer";
      if (has(text, /(washing|pralk)/)) return "washer";
      if (["safety", "problem", "tamper"].includes(dc)) return "shield";
      return undefined;
    default:
      break;
  }

  // Sensors, selects, numbers, events: device class first, then name keywords.
  if (dc === "battery" || has(text, /(battery|bateri)/)) return "battery";
  if (["pm25", "pm10", "pm1", "carbon_dioxide", "volatile_organic_compounds", "volatile_organic_compounds_parts", "aqi", "nitrogen_dioxide", "ozone"].includes(dc))
    return "air";
  if (dc === "carbon_monoxide") return "co";
  if (dc === "smoke") return "smoke";
  if (dc === "humidity") return "humidity";
  if (dc === "temperature") return "thermometer";
  if (dc === "monetary") {
    if (has(text, /(_gas_|gaz)/)) return "flame";
    if (has(text, /(water|woda|sewer|scieki)/)) return "watermeter";
    if (has(text, /(fuel|paliw|benzyn|diesel)/)) return "pump-petrol";
    return "bolt";
  }
  if (has(text, /\bf1_|formula/)) return "f1";
  if (has(text, /(fuel|paliw|benzyn|diesel|_e10|_b7)/)) return has(text, /(diesel|b7)/) ? "pump-diesel" : "pump-petrol";
  if (has(text, /(washing|pralk)/)) return "washer";
  if (has(text, /(suszar|dryer)/)) return "dryer";
  if (has(text, /(litter|kuwet)/)) return "litter";
  if (has(text, /(feeder|karmnik|karmien)/)) return "feeder";
  if (has(text, /(parcel|paczk|package|delivery|dostaw|evri|dpd|royal_mail)/)) return "parcel";
  if (has(text, /(printer|drukark|bambu|nozzle|a1_\d)/)) return "printer";
  if (has(text, /(zigbee|lqi|linkquality|z2m|coordinator)/)) return "network";
  if (has(text, /(\bbin\b|_bin_|bins|waste|kosz(?!t)|odpad|recycl|smieci)/)) return "calendar";
  if (has(text, /(filter|filtr)/)) return "purifier";
  if (has(text, AIR_WORDS)) return "air";
  if (has(text, CO_WORDS)) return "co";
  if (has(text, SMOKE_WORDS)) return "smoke";
  if (has(text, /(temperatur|_temp_|^temp_|termometr)/)) return "thermometer";
  if (has(text, /(humidity|wilgotn)/)) return "humidity";
  if (dc === "gas" || has(text, /(_gas_|gaz)/)) return "flame";
  if (dc === "water" || has(text, /(water|woda|sewer|scieki|g22xu)/)) return "watermeter";
  if (["power", "energy", "current", "voltage", "power_factor"].includes(dc) || has(text, /(octopus|electric|prad|demand|tariff|rate)/))
    return "bolt";
  return undefined;
}

/** Readings that describe a device rather than being one (time left, program, settings). */
function isSecondary(id: string, e: HassEntity | undefined): boolean {
  const domain = domainOf(id);
  if (domain === "select" || domain === "number" || domain === "text" || domain === "button") return true;
  if (/(machine_status|program_phase|_status$|_state$)/.test(id)) return false;
  const dc = String(e?.attributes.device_class ?? "");
  const unit = String(e?.attributes.unit_of_measurement ?? "");
  if (dc === "duration" || dc === "timestamp" || unit === "min" || unit === "h" || unit === "s") return true;
  return /(remaining|pozostal|czas|_time|program|detergent|softener|zmiekcz|level|poziom|steam|para|prewash|wstepn|energy_estimate|_wh$)/.test(slug(id));
}

const DEFAULT_GLYPH: Record<string, string> = {
  sensor: "mdi:gauge",
  binary_sensor: "mdi:checkbox-blank-circle-outline",
  select: "mdi:tune-variant",
  number: "mdi:tune-variant",
  switch: "mdi:toggle-switch-outline",
};

/** Layout art hints from older converters that a better rule now replaces. */
const SOFT_HINTS = new Set(["bulb", "dial", "plug", "purifier"]);

/**
 * Central visual for any entity: hero art for devices and measured things,
 * an accent-tinted glyph for secondary readings and anything unknown.
 */
export function visualFor(id: string, e?: HassEntity, hint?: { art?: string; kind?: string; icon?: string; name?: string }): Visual {
  const ruled = artKeyOf(id, e, hint?.kind, hint?.name);
  const given = hint?.art && art[hint.art] ? (hint.art as ArtKey) : undefined;
  const forced = given && !(SOFT_HINTS.has(given) && ruled && ruled !== given) ? given : undefined;
  const key = forced ?? ruled;
  const entry = key ? ENTRY.get(key) : undefined;
  const category: ArtCategory = entry?.category ?? "home";
  const icon = hint?.icon && hint.icon !== "mdi:circle-outline" ? hint.icon : undefined;
  const glyph = icon ?? entry?.glyph ?? String(e?.attributes.icon ?? DEFAULT_GLYPH[domainOf(id)] ?? "mdi:circle-outline");
  const secondary = !forced && isSecondary(id, e);
  return { art: secondary ? undefined : key, glyph, category };
}

/* ---------- Level colours (air quality, CO, battery) ---------- */

export interface Level {
  color: string;
  /** Translation key of the level word (airGood, airModerate, ...), when it has one. */
  word?: string;
}

const GREEN = "#4be39a";
const YELLOW = "#ffd34d";
const ORANGE = "#ff9f4d";
const RED = "#ff5a64";
const PURPLE = "#c77dff";

const LIME = "#a6e35a";

/** Text air-quality states, best first (excellent → Doskonała … very poor → Zła). */
const AIR_WORDS_SCALE: [RegExp, string, string][] = [
  [/^(excellent|very_good|doskonal)/, GREEN, "airExcellent"],
  [/^(good|dobr)/, LIME, "airGood"],
  [/^(moderate|fair|medium|umiark)/, YELLOW, "airModerate"],
  [/^(poor|slab|unhealthy_for)/, ORANGE, "airPoor"],
  [/^(very_poor|very_bad|bad|unhealthy|hazard|zl)/, RED, "airBad"],
];

const band = (v: number, steps: [number, string, string][], last: [string, string]): Level => {
  for (const [max, color, word] of steps) if (v <= max) return { color, word };
  return { color: last[0], word: last[1] };
};

/** Colour (and word) for readings whose value has a health meaning; undefined for everything else. */
export function levelOf(id: string, e: HassEntity | undefined, name?: string): Level | undefined {
  if (!e) return undefined;
  const dc = String(e.attributes.device_class ?? "");
  const unit = String(e.attributes.unit_of_measurement ?? "").toLowerCase();
  const text = `${slug(id)} ${slug(String(e.attributes.friendly_name ?? ""))} ${slug(name ?? "")}`;
  const v = Number(e.state);
  const numeric = e.state !== "" && Number.isFinite(v);
  const domain = domainOf(id);

  if (domain === "sensor" && (dc === "battery" || (has(text, /(battery|bateri)/) && unit === "%")) && numeric) {
    return v >= 50 ? { color: GREEN } : v >= 20 ? { color: YELLOW } : { color: RED };
  }
  if (domain === "binary_sensor" && (["smoke", "gas", "carbon_monoxide"].includes(dc) || has(text, SMOKE_WORDS) || has(text, CO_WORDS))) {
    return e.state === "on" ? { color: RED, word: "coAlarm" } : e.state === "off" ? { color: GREEN, word: "coClear" } : undefined;
  }
  if (domain !== "sensor") return undefined;
  if ((dc === "carbon_monoxide" || has(text, /(czujnik_co_co|carbon_monoxide|_co$)/)) && numeric) {
    return band(v, [[9, GREEN, "airGood"], [35, YELLOW, "airModerate"]], [RED, "airBad"]);
  }
  if (dc === "carbon_dioxide" || has(text, /co2/)) {
    if (!numeric) return undefined;
    return v < 800 ? { color: GREEN, word: "airGood" } : v < 1200 ? { color: YELLOW, word: "airModerate" } : { color: RED, word: "airBad" };
  }
  if (dc === "pm10" || has(text, /pm10/)) {
    if (!numeric) return undefined;
    return band(v, [[54, GREEN, "airGood"], [154, YELLOW, "airModerate"], [254, ORANGE, "airPoor"], [354, RED, "airBad"]], [PURPLE, "airVeryBad"]);
  }
  if (dc === "pm25" || dc === "pm1" || has(text, /(pm2|pm_2|pm1)/)) {
    if (!numeric) return undefined;
    return band(v, [[12, GREEN, "airGood"], [35, YELLOW, "airModerate"], [55, ORANGE, "airPoor"], [150, RED, "airBad"]], [PURPLE, "airVeryBad"]);
  }
  if (dc === "aqi" || has(text, /(aqi|air_quality|jakosc_powietrza)/)) {
    // VeSync-style words (excellent .. very_poor) or its 1..4 scale; otherwise a US AQI number.
    const s = slug(String(e.state));
    const word = AIR_WORDS_SCALE.find(([re]) => re.test(s));
    if (word) return { color: word[1], word: word[2] };
    if (!numeric) return undefined;
    if (v >= 1 && v <= 4 && Number.isInteger(v)) {
      const [, color, w] = AIR_WORDS_SCALE[v - 1];
      return { color, word: w };
    }
    return band(v, [[50, GREEN, "airGood"], [100, YELLOW, "airModerate"], [150, ORANGE, "airPoor"], [200, RED, "airBad"]], [PURPLE, "airVeryBad"]);
  }
  if (dc === "volatile_organic_compounds" || dc === "volatile_organic_compounds_parts" || has(text, /voc/)) {
    if (!numeric) return undefined;
    return band(v, [[300, GREEN, "airGood"], [1000, YELLOW, "airModerate"]], [RED, "airBad"]);
  }
  return undefined;
}

/** Photoreal art for an item, or undefined when only a glyph fits. */
export function artFor(item: Pick<LayoutItem, "entity" | "kind" | "art"> & { icon?: string }, entity?: HassEntity): string | undefined {
  const key = visualFor(item.entity, entity, item).art;
  return key ? art[key] : undefined;
}

/** Catalog name of an art object ("Wentylator łazienkowy"), for devices named only after their room. */
export function artLabel(key: ArtKey | undefined, lang: string): string | undefined {
  const entry = key ? ENTRY.get(key) : undefined;
  return entry ? (lang === "pl" ? entry.pl : entry.en) : undefined;
}

export function accentOf(category: ArtCategory): string {
  return CATEGORY[category].accent;
}
