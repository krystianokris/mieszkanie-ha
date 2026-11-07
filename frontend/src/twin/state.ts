import { isUnavailable, num, type Hass, type HassEntity } from "../sdk";
import type { TwinEntry, TwinRoom } from "./model";

export const ent = (hass: Hass | undefined, id?: string): HassEntity | undefined => (id ? hass?.states[id] : undefined);

export const isOn = (e?: HassEntity) => !!e && !isUnavailable(e) && ["on", "playing", "open", "heat", "cool", "dry", "fan_only", "auto", "heat_cool"].includes(e.state);

export function litCount(hass: Hass | undefined, room: TwinRoom): number {
  return (room.lights ?? []).filter((l) => ent(hass, l.entity)?.state === "on").length;
}

/**
 * Room temperature: its own sensor, else the first running climate entity's current temperature.
 * A switched-off air conditioner (Gree) echoes its setpoint as "current", so it doesn't count.
 */
export function roomTemp(hass: Hass | undefined, room: TwinRoom): number | undefined {
  const t = num(ent(hass, room.temperature)?.state);
  if (t !== undefined) return t;
  for (const c of room.climate ?? []) {
    const e = ent(hass, c.entity);
    if (!e || e.state === "off" || isUnavailable(e)) continue;
    const v = num(e.attributes.current_temperature);
    if (v !== undefined) return v;
  }
  return undefined;
}

/** Safety sensor that stopped reporting (dead battery, out of Zigbee range). */
export const sensorOffline = (hass: Hass | undefined, a: TwinEntry) => {
  const e = ent(hass, a.entity);
  return !e || isUnavailable(e);
};

/** Heat-map colour: blue (cold) → green (comfort) → amber → red (hot). */
export function tempColor(t: number): string {
  const stops: [number, [number, number, number]][] = [
    [16, [77, 140, 255]],
    [19, [80, 210, 255]],
    [21, [80, 230, 150]],
    [23, [255, 196, 90]],
    [26, [255, 90, 80]],
  ];
  if (t <= stops[0][0]) return `rgb(${stops[0][1].join(",")})`;
  for (let i = 1; i < stops.length; i++) {
    const [t1, c1] = stops[i];
    const [t0, c0] = stops[i - 1];
    if (t <= t1) {
      const f = (t - t0) / (t1 - t0);
      return `rgb(${c0.map((v, k) => Math.round(v + (c1[k] - v) * f)).join(",")})`;
    }
  }
  return `rgb(${stops[stops.length - 1][1].join(",")})`;
}

/** Airflow tone for a climate entity that is blowing (AC heat/cool/dry/fan); undefined when idle/off. */
export function airflow(e?: HassEntity): "heat" | "cool" | "dry" | "fan" | undefined {
  if (!e || isUnavailable(e)) return undefined;
  const action = String(e.attributes.hvac_action ?? "");
  if (action === "idle" || action === "off") return undefined;
  if (e.state === "heat" || action === "heating") return "heat";
  if (e.state === "cool" || action === "cooling") return "cool";
  if (e.state === "dry" || action === "drying") return "dry";
  if (e.state === "fan_only" || action === "fan") return "fan";
  if (e.state === "auto" || e.state === "heat_cool") {
    const cur = num(e.attributes.current_temperature);
    const tgt = num(e.attributes.temperature);
    return cur !== undefined && tgt !== undefined && cur > tgt ? "cool" : "heat";
  }
  return undefined;
}

const RUNNING = /(run|wash|dry|spin|rinse|heat|cool|program|pranie|susz|wiro|płuk|pracuje|running|active)/i;

export const applianceRunning = (e?: HassEntity) => !!e && !isUnavailable(e) && RUNNING.test(e.state) && !/(off|idle|ready|finished|end|done|koniec|gotow)/i.test(e.state);

/** "38 min" / "1 h 05" from a remaining-time sensor (minutes, h:mm:ss or timestamp). */
export function remainingText(e?: HassEntity): string | undefined {
  if (!e || isUnavailable(e)) return undefined;
  let minutes: number | undefined;
  const unit = String(e.attributes.unit_of_measurement ?? "");
  const n = num(e.state);
  if (n !== undefined) minutes = unit === "h" ? n * 60 : unit === "s" ? n / 60 : n;
  else if (/^\d+:\d{2}(:\d{2})?$/.test(e.state)) {
    const [h, m] = e.state.split(":").map(Number);
    minutes = h * 60 + m;
  } else if (!Number.isNaN(Date.parse(e.state))) minutes = (Date.parse(e.state) - Date.now()) / 60000;
  if (minutes === undefined || minutes <= 0) return undefined;
  const m = Math.round(minutes);
  return m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}` : `${m} min`;
}

export const alarmOn = (hass: Hass | undefined, a: TwinEntry) => ent(hass, a.entity)?.state === "on";
