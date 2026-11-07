import { domainOf, fmt, isUnavailable, num, type Hass, type HassEntity, type TKey, type Translator } from "../sdk";

const BINARY_LABEL: Record<string, [TKey, TKey]> = {
  moisture: ["detected", "dry"],
  carbon_monoxide: ["detected", "clear"],
  smoke: ["detected", "clear"],
  gas: ["detected", "clear"],
  safety: ["problem", "clear"],
  problem: ["problem", "clear"],
  window: ["open", "closed"],
  door: ["open", "closed"],
  garage_door: ["open", "closed"],
  opening: ["open", "closed"],
  occupancy: ["present", "away"],
  motion: ["present", "away"],
  presence: ["present", "away"],
};

const APPLIANCE_STATE: Record<string, TKey> = {
  run: "running",
  running: "running",
  idle: "idle",
  pause: "paused",
  paused: "paused",
  finished: "finished",
  ready: "ready",
  drying: "drying",
  playing: "playing",
  standby: "standby",
};

/** Human label for an entity state; uses Home Assistant's own formatter when available. */
export function stateLabel(t: Translator, entity: HassEntity | undefined, hass?: Hass): string {
  if (!entity || isUnavailable(entity)) return t("unavailable");
  const domain = domainOf(entity.entity_id);
  if (domain === "binary_sensor") {
    const labels = BINARY_LABEL[String(entity.attributes.device_class)] ?? (["on", "off"] as [TKey, TKey]);
    return t(entity.state === "on" ? labels[0] : labels[1]);
  }
  if (domain === "climate") {
    const cur = num(entity.attributes.current_temperature);
    const target = num(entity.attributes.temperature);
    return `${fmt(cur, 1, t.lang())}° → ${entity.state === "off" || target === undefined ? "—" : `${fmt(target, 1, t.lang())}°`}`;
  }
  // Self-test style results read the same in every language.
  if (/^(success|succeeded|passed|pass|ok)$/i.test(entity.state)) return "OK";
  if (/^(fail|failed|failure)$/i.test(entity.state)) return t("testFailed");
  if (hass?.formatEntityState) {
    try {
      return hass.formatEntityState(entity);
    } catch {
      /* fall through to the local formatter */
    }
  }
  if (entity.state === "on") return t("on");
  if (entity.state === "off") return t("off");
  const key = APPLIANCE_STATE[entity.state];
  if (key) return t(key);
  const n = num(entity.state);
  const unit = entity.attributes.unit_of_measurement;
  if (n !== undefined && /^-?\d+(\.\d+)?$/.test(entity.state)) {
    const digits = Number.isInteger(n) ? 0 : Math.min(2, entity.state.split(".")[1]?.length ?? 1);
    return `${fmt(n, digits, t.lang())}${unit ? ` ${unit}` : ""}`;
  }
  return entity.state;
}

export function isAlertState(entity: HassEntity | undefined): boolean {
  if (!entity) return false;
  const domain = domainOf(entity.entity_id);
  if (domain === "alarm_control_panel") return entity.state === "triggered";
  if (domain !== "binary_sensor") return false;
  return entity.state === "on" && !["occupancy", "motion", "presence", "battery_charging", "plug", "power", "running", "connectivity"].includes(String(entity.attributes.device_class));
}

export function capitalize(text: string): string {
  return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}
