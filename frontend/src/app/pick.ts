import { domainOf, isUnavailable, num, slug } from "../sdk/format";
import type { Hass, HassEntity } from "../sdk/types";

const SWITCH_NOISE = /(follow|prewash|steam|sleep|tryb|mode|child|lock|indicator|update|feeder|karmien|litter|czyszcz|zasilanie|camera|status_led|enabled|sync|motion_detection|privacy)/;
const INTERNAL_TEMP =
  /(_in_|_in$|\bin\b|chip|cpu|internal|device|esp|board|soc|processor|battery|nozzle|bed_|printer|chamber|core_temp|router|nas|disk|wifi|sensor_f1_|weather|forecast|track|outdoor|outside|zewn)/;

/** Binary sensor classes that belong to "home watch". */
export const WATCH_CLASSES = [
  "moisture",
  "smoke",
  "gas",
  "carbon_monoxide",
  "safety",
  "problem",
  "door",
  "garage_door",
  "window",
  "opening",
];

export function haystack(e: HassEntity): string {
  return `${slug(e.entity_id)} ${slug(String(e.attributes.friendly_name ?? ""))}`;
}

export function byDomain(hass: Hass, domain: string): HassEntity[] {
  return Object.values(hass.states).filter((e) => domainOf(e.entity_id) === domain);
}

export function isToggleable(e: HassEntity): boolean {
  const domain = domainOf(e.entity_id);
  if (domain === "light" || domain === "fan" || domain === "input_boolean") return true;
  return domain === "switch" && !SWITCH_NOISE.test(haystack(e));
}

/** Lights for counts and lists: only `light.*`, unless a layout lists them explicitly. */
export function lightIds(hass: Hass, explicit?: string[]): string[] {
  if (explicit?.length) return explicit.filter((id) => hass.states[id]);
  return byDomain(hass, "light")
    .filter((e) => e.state !== "unavailable")
    .map((e) => e.entity_id);
}

export function pickWeather(hass: Hass): HassEntity | undefined {
  const list = byDomain(hass, "weather").filter((e) => !isUnavailable(e));
  return list.find((e) => /home|dom/.test(e.entity_id)) ?? list[0];
}

export function isRoomTemperature(e: HassEntity): boolean {
  if (domainOf(e.entity_id) !== "sensor" || e.attributes.device_class !== "temperature") return false;
  const v = num(e.state);
  return v !== undefined && v >= 5 && v <= 35 && !INTERNAL_TEMP.test(haystack(e));
}

export function isRoomHumidity(e: HassEntity): boolean {
  if (domainOf(e.entity_id) !== "sensor" || e.attributes.device_class !== "humidity") return false;
  const v = num(e.state);
  return v !== undefined && v >= 0 && v <= 100 && !INTERNAL_TEMP.test(haystack(e));
}

export function pickPower(hass: Hass): HassEntity | undefined {
  const list = byDomain(hass, "sensor").filter(
    (e) =>
      (e.attributes.device_class === "power" || /^k?W$/.test(String(e.attributes.unit_of_measurement ?? ""))) &&
      num(e.state) !== undefined,
  );
  return list.find((e) => /demand|grid|house|home|total|pobor/.test(haystack(e))) ?? list[0];
}

export function watchIds(hass: Hass): string[] {
  const binaries = byDomain(hass, "binary_sensor")
    .filter((e) => WATCH_CLASSES.includes(String(e.attributes.device_class)))
    .sort(
      (a, b) =>
        WATCH_CLASSES.indexOf(String(a.attributes.device_class)) - WATCH_CLASSES.indexOf(String(b.attributes.device_class)),
    );
  return [...byDomain(hass, "alarm_control_panel"), ...binaries].map((e) => e.entity_id);
}
