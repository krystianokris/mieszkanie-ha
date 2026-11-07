import { domainOf, isUnavailable, num, translate, type Hass, type HassEntity, type Lang, type TKey } from "../sdk";
import { CATEGORY, type ArtCategory } from "./art";
import type { LayoutPage } from "./model";
import { panelSizes } from "./pages";
import { isRoomHumidity, isRoomTemperature } from "./pick";
import { isAlertState } from "./states";
import type { TileInstance } from "../sdk/tiles";

interface Group {
  id: string;
  title: TKey;
  icon: string;
  category: ArtCategory;
  match: (e: HassEntity) => boolean;
  /** Lower comes first. */
  rank?: (e: HassEntity) => number;
  limit: number;
}

const SECURITY = ["window", "door", "garage_door", "opening", "motion", "occupancy", "presence", "smoke", "gas", "carbon_monoxide", "safety", "problem", "tamper"];
const AIR = ["pm25", "pm10", "pm1", "carbon_dioxide", "volatile_organic_compounds", "aqi", "nitrogen_dioxide"];

const dc = (e: HassEntity) => String(e.attributes.device_class ?? "");
const WATER_NAME = /(water|wod[aey]|zbiornik|pojemnik|tank|leak|wyciek|zalan)/i;
/** Appliance status sensors (door, detergent, filter) live on the laundry page, not in home security. */
const APPLIANCE = /(washing|pralk|suszar|dryer|dishwasher|zmywark)/i;
const nameOf = (e: HassEntity) => `${e.entity_id} ${e.attributes.friendly_name ?? ""}`;

const GROUPS: Group[] = [
  {
    id: "security",
    title: "grpSecurity",
    icon: "mdi:shield-home-outline",
    category: "security",
    limit: 12,
    match: (e) =>
      (domainOf(e.entity_id) === "binary_sensor" &&
        SECURITY.includes(dc(e)) &&
        !APPLIANCE.test(nameOf(e)) &&
        !(dc(e) === "problem" && WATER_NAME.test(nameOf(e)))) ||
      (domainOf(e.entity_id) === "sensor" && (["carbon_monoxide", "smoke"].includes(dc(e)) || (/self_test/.test(e.entity_id) && !APPLIANCE.test(nameOf(e))))) ||
      ["alarm_control_panel", "camera"].includes(domainOf(e.entity_id)),
  },
  {
    id: "water",
    title: "grpWater",
    icon: "mdi:water-alert-outline",
    category: "water",
    limit: 10,
    match: (e) =>
      (domainOf(e.entity_id) === "binary_sensor" && (dc(e) === "moisture" || (dc(e) === "problem" && WATER_NAME.test(nameOf(e))))) ||
      isRoomHumidity(e),
  },
  {
    id: "air",
    title: "grpAir",
    icon: "mdi:air-filter",
    category: "air",
    limit: 8,
    match: (e) =>
      (domainOf(e.entity_id) === "sensor" && (AIR.includes(dc(e)) || /(pm2_5|pm25|air_quality|filter_life)/.test(e.entity_id))) ||
      (domainOf(e.entity_id) === "fan" && /(purif|core_|oczyszcz)/.test(e.entity_id)),
  },
  {
    id: "climate",
    title: "grpClimate",
    icon: "mdi:home-thermometer-outline",
    category: "climate",
    limit: 12,
    match: (e) => isRoomTemperature(e),
  },
  {
    id: "battery",
    title: "grpBattery",
    icon: "mdi:battery-heart-variant",
    category: "battery",
    limit: 12,
    match: (e) => domainOf(e.entity_id) === "sensor" && dc(e) === "battery" && num(e.state) !== undefined,
    rank: (e) => num(e.state) ?? 100,
  },
];

/** Czujniki page: one panel per category, alerts and missing sensors first. */
export function sensorTiles(hass: Hass, page: LayoutPage, lang: Lang): TileInstance[] {
  const fromLayout = new Set((page.sections ?? []).flatMap((s) => s.items.map((i) => i.entity)));
  const states = Object.values(hass.states);
  const tiles: TileInstance[] = [];
  for (const g of GROUPS) {
    const picked = states
      .filter((e) => g.match(e) || (fromLayout.has(e.entity_id) && g.match(e)))
      .sort((a, b) => {
        const alert = Number(isAlertState(b)) - Number(isAlertState(a));
        if (alert) return alert;
        const missing = Number(isUnavailable(b)) - Number(isUnavailable(a));
        if (g.rank) return g.rank(a) - g.rank(b);
        if (missing) return missing;
        return Number(fromLayout.has(b.entity_id)) - Number(fromLayout.has(a.entity_id));
      })
      .slice(0, g.limit);
    if (!picked.length) continue;
    tiles.push({
      id: `sensors-${g.id}`,
      type: "panel",
      config: {
        section: {
          id: `sensors-${g.id}`,
          kicker: translate(lang, "sensorsKicker").toUpperCase(),
          title: translate(lang, g.title),
          icon: g.icon,
          accent: CATEGORY[g.category].accent,
          items: picked.map((e) => ({ entity: e.entity_id, action: "info" as const })),
        },
      },
      sizes: panelSizes(picked.length),
    });
  }
  return tiles;
}

export const isSensorsPage = (id: string, title: string) => /(czujnik|sensor|sensoren)/i.test(`${id} ${title}`);
export const isF1Page = (id: string, title: string) => /(^f1$|formu)/i.test(id) || /(^f1$|formu)/i.test(title);
