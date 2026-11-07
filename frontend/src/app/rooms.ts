import { domainOf, isUnavailable, slug } from "../sdk/format";
import type { Lang } from "../sdk/i18n";
import type { Hass, HassEntity } from "../sdk/types";
import { haystack, isRoomHumidity, isRoomTemperature, isToggleable, WATCH_CLASSES } from "./pick";

export interface Room {
  id: string;
  name: string;
  icon: string;
  entities: string[];
  temperature?: string;
  humidity?: string;
}

interface BuiltinRoom {
  id: string;
  icon: string;
  name: Record<Lang, string>;
  tokens: string[];
}

/** Common room words; an HA area that matches one inherits its synonyms and icon. */
const BUILTIN: BuiltinRoom[] = [
  { id: "living", icon: "mdi:sofa-outline", name: { en: "Living room", pl: "Salon", de: "Wohnzimmer" }, tokens: ["salon", "living", "lounge", "wohnzimmer"] },
  { id: "kitchen", icon: "mdi:countertop-outline", name: { en: "Kitchen", pl: "Kuchnia", de: "Küche" }, tokens: ["kuchnia", "kitchen", "kuche"] },
  { id: "bedroom", icon: "mdi:bed-king-outline", name: { en: "Bedroom", pl: "Sypialnia", de: "Schlafzimmer" }, tokens: ["sypialnia", "bedroom", "schlafzimmer"] },
  { id: "bathroom", icon: "mdi:shower-head", name: { en: "Bathroom", pl: "Łazienka", de: "Bad" }, tokens: ["lazienka", "bathroom", "prysznic", "shower", "badezimmer"] },
  { id: "toilet", icon: "mdi:toilet", name: { en: "Toilet", pl: "WC", de: "WC" }, tokens: ["kibelek", "toilet", "wc"] },
  { id: "laundry", icon: "mdi:washing-machine", name: { en: "Laundry", pl: "Pralnia", de: "Waschküche" }, tokens: ["pralnia", "laundry", "washing", "pralka", "suszarka", "dryer"] },
  { id: "hall", icon: "mdi:door-open", name: { en: "Hallway", pl: "Korytarz", de: "Flur" }, tokens: ["hall", "korytarz", "stairs", "schody", "flur"] },
  { id: "garage", icon: "mdi:garage", name: { en: "Garage", pl: "Garaż", de: "Garage" }, tokens: ["garage", "garaz"] },
  { id: "office", icon: "mdi:desk", name: { en: "Office", pl: "Biuro", de: "Büro" }, tokens: ["office", "biuro", "gabinet", "buro"] },
  { id: "kids", icon: "mdi:teddy-bear", name: { en: "Kids room", pl: "Pokój dziecka", de: "Kinderzimmer" }, tokens: ["kids", "child", "dziecka", "kinderzimmer"] },
];

const STOP_WORDS = new Set(["room", "pokoj", "the", "default"]);
const ROOM_DOMAINS = new Set(["light", "switch", "fan", "climate", "media_player", "sensor", "binary_sensor", "cover", "lock"]);

function stem(token: string): string {
  return token.length > 5 ? token.slice(0, -1) : token;
}

function relevant(e: HassEntity): boolean {
  const domain = domainOf(e.entity_id);
  if (!ROOM_DOMAINS.has(domain) || isUnavailable(e)) return false;
  if (domain === "switch") return isToggleable(e);
  if (domain === "sensor") return isRoomTemperature(e) || isRoomHumidity(e) || /machine_status|program_phase/.test(e.entity_id);
  if (domain === "binary_sensor") return [...WATCH_CLASSES, "occupancy", "motion", "presence"].includes(e.attributes.device_class);
  return true;
}

function registryArea(hass: Hass, entityId: string): string | undefined {
  const entry = hass.entities?.[entityId];
  if (!entry) return undefined;
  if (entry.area_id) return entry.area_id;
  return entry.device_id ? hass.devices?.[entry.device_id]?.area_id ?? undefined : undefined;
}

/**
 * Rooms come from HA areas first. Entities without an area are matched by
 * name against area names and common room words.
 */
export function buildRooms(hass: Hass, lang: Lang): Room[] {
  const candidates: { room: Room; tokens: string[] }[] = [];
  const claimed = new Set<string>();

  for (const area of Object.values(hass.areas ?? {})) {
    const areaSlug = slug(area.name);
    if (!areaSlug || areaSlug.startsWith("default")) continue;
    const tokens = new Set([areaSlug, slug(area.area_id), ...areaSlug.split("_")].filter((w) => w.length >= 3 && !STOP_WORDS.has(w)));
    let icon = "mdi:texture-box";
    for (const builtin of BUILTIN) {
      if (builtin.tokens.some((t) => tokens.has(t))) {
        builtin.tokens.forEach((t) => tokens.add(t));
        claimed.add(builtin.id);
        icon = builtin.icon;
      }
    }
    candidates.push({ room: { id: slug(area.area_id), name: area.name, icon, entities: [] }, tokens: [...tokens] });
  }
  for (const builtin of BUILTIN) {
    if (!claimed.has(builtin.id)) {
      candidates.push({ room: { id: builtin.id, name: builtin.name[lang], icon: builtin.icon, entities: [] }, tokens: builtin.tokens });
    }
  }
  const byId = new Map(candidates.map((c) => [c.room.id, c]));

  for (const e of Object.values(hass.states)) {
    if (!relevant(e)) continue;
    const areaId = registryArea(hass, e.entity_id);
    let target = areaId ? byId.get(slug(areaId)) : undefined;
    if (!target) {
      const text = haystack(e);
      let best = 0;
      for (const c of candidates) {
        for (const token of c.tokens) {
          const s = stem(token);
          if (s.length > best && text.includes(s)) {
            best = s.length;
            target = c;
          }
        }
      }
    }
    if (!target) continue;
    const room = target.room;
    if (isRoomTemperature(e)) room.temperature ??= e.entity_id;
    else if (isRoomHumidity(e)) room.humidity ??= e.entity_id;
    else room.entities.push(e.entity_id);
  }

  return candidates
    .map((c) => c.room)
    .filter((r) => r.entities.length > 0)
    .sort((a, b) => b.entities.length - a.entities.length);
}
