// "Energia" mode: what in the flat is drawing electricity right now, and where it sits on the model.
//
// Honesty rule: a line only says "this is ON". Its thickness and a watt figure appear ONLY when Home
// Assistant has a real power measurement for that device (a power sensor on the same device, or an
// explicit `power` entity in layout.json). Everything else is drawn as a thin activity line.
import { isUnavailable, num, type Hass } from "../sdk";
import type { TwinEntry, TwinRoom } from "./model";
import { ROOMS, type Point } from "./scene";
import { airflow, applianceRunning, ent, isOn } from "./state";

export type PowerKind = "light" | "appliance" | "heat" | "cool" | "media" | "air";
export interface Consumer {
  id: string;
  room: string;
  at: Point;
  kind: PowerKind;
  label: string;
  /** Entities behind this line (all lights of a room, or one device). */
  entities: string[];
  /** Friendly names from layout.json, so the card doesn't show raw Zigbee ids. */
  names: Record<string, string | undefined>;
  /** Extra sensors worth showing in the details card (remaining time). */
  remaining?: string;
  /** Measured watts, only when a real power sensor reports. */
  watts?: number;
}

/** Electricity enters at the front door in the hallway. */
export const METER: Point = ROOMS.find((r) => r.id === "korytarz")?.anchors.door ?? [648, 292];

/** Only electric heat counts: MTS200 floor heating and air conditioners. Nest and TRV radiators run on gas. */
const electricClimate = (entity: string, anchor?: string) => anchor === "ac" || /mts200/.test(entity);

const MEDIA_OFF = ["off", "unavailable", "standby", "unknown", "idle"];

const toWatts = (hass: Hass | undefined, id: string): number | undefined => {
  const e = ent(hass, id);
  if (!e || isUnavailable(e)) return undefined;
  const v = num(e.state);
  if (v === undefined) return undefined;
  return String(e.attributes.unit_of_measurement ?? "W") === "kW" ? v * 1000 : v;
};

/** device_id → its power sensors, rebuilt only when the registry object changes. */
let indexFor: unknown;
let powerByDevice = new Map<string, string[]>();
function powerSensorsOf(hass: Hass | undefined, entity: string): string[] {
  const reg = hass?.entities;
  if (!reg) return [];
  if (indexFor !== reg) {
    powerByDevice = new Map();
    for (const r of Object.values(reg)) {
      if (!r.device_id || !r.entity_id.startsWith("sensor.")) continue;
      if (hass?.states[r.entity_id]?.attributes.device_class !== "power") continue;
      powerByDevice.set(r.device_id, [...(powerByDevice.get(r.device_id) ?? []), r.entity_id]);
    }
    indexFor = reg;
  }
  const dev = reg[entity]?.device_id;
  return dev ? powerByDevice.get(dev) ?? [] : [];
}

/** Sum of real measurements for these entries; undefined when none of them is measured. */
function measured(hass: Hass | undefined, entries: TwinEntry[]): number | undefined {
  let total: number | undefined;
  for (const e of entries) {
    const sensors = e.power ? [e.power] : powerSensorsOf(hass, e.entity);
    for (const s of sensors) {
      const w = toWatts(hass, s);
      if (w !== undefined) total = (total ?? 0) + w;
    }
  }
  return total;
}

const nameMap = (entries: TwinEntry[]) => Object.fromEntries(entries.map((e) => [e.entity, e.name]));

export function consumers(hass: Hass | undefined, rooms: Record<string, TwinRoom>): Consumer[] {
  const out: Consumer[] = [];
  for (const scene of ROOMS) {
    const room = rooms[scene.id];
    if (!room) continue;
    const litEntries = (room.lights ?? []).filter((l) => ent(hass, l.entity)?.state === "on");
    if (litEntries.length)
      out.push({ id: `${scene.id}:light`, room: scene.id, at: scene.glow[0], kind: "light", label: litEntries.length === 1 ? "Światło" : `${litEntries.length} × światło`, entities: litEntries.map((l) => l.entity), names: nameMap(litEntries), watts: measured(hass, litEntries) });
    for (const a of room.appliances ?? []) {
      const at = a.anchor ? scene.anchors[a.anchor] : undefined;
      if (at && applianceRunning(ent(hass, a.entity)))
        out.push({ id: `${scene.id}:${a.entity}`, room: scene.id, at, kind: "appliance", label: a.anchor === "dryer" ? "Suszarka" : "Pralka", entities: [a.entity], names: nameMap([a]), remaining: a.remaining, watts: measured(hass, [a]) });
    }
    for (const m of room.media ?? []) {
      const e = ent(hass, m.entity);
      const at = m.anchor ? scene.anchors[m.anchor] : undefined;
      if (at && e && !MEDIA_OFF.includes(String(e.state)))
        out.push({ id: `${scene.id}:${m.entity}`, room: scene.id, at, kind: "media", label: m.anchor === "speaker" ? "Głośnik" : "Telewizor", entities: [m.entity], names: nameMap([m]), watts: measured(hass, [m]) });
    }
    for (const c of room.climate ?? []) {
      if (!electricClimate(c.entity, c.anchor)) continue;
      const e = ent(hass, c.entity);
      const at = c.anchor ? scene.anchors[c.anchor === "thermostat" ? "floor" : c.anchor] ?? scene.anchors[c.anchor] : undefined;
      if (!at || !e || isUnavailable(e)) continue;
      const flow = c.anchor === "ac" ? airflow(e) : e.attributes.hvac_action === "heating" ? "heat" : undefined;
      if (flow)
        out.push({ id: `${scene.id}:${c.entity}`, room: scene.id, at, kind: flow === "cool" || flow === "dry" ? "cool" : "heat", label: c.anchor === "ac" ? "Klimatyzacja" : "Ogrzewanie podłogowe", entities: [c.entity], names: nameMap([c]), watts: measured(hass, [c]) });
    }
    for (const p of [...(room.purifier ?? []), ...(room.fan ?? [])]) {
      const at = p.anchor ? scene.anchors[p.anchor] : undefined;
      if (at && isOn(ent(hass, p.entity)))
        out.push({ id: `${scene.id}:${p.entity}`, room: scene.id, at, kind: "air", label: p.anchor === "fan" ? "Wentylator" : "Oczyszczacz", entities: [p.entity], names: nameMap([p]), watts: measured(hass, [p]) });
    }
  }
  return out;
}

/** Total demand in watts from the HUD power sensor (W or kW). */
export const totalWatts = (hass: Hass | undefined, entity?: string) => (entity ? toWatts(hass, entity) : undefined);

/** Measured lines grow with their load; activity-only lines stay thin. */
export const lineWidth = (c: Consumer) => (c.watts === undefined ? 1.6 : 2.2 + Math.min(4.2, c.watts / 350));

/**
 * The meter ring shows the measured whole-home demand on a fixed display scale of 0–6 kW, labelled
 * on screen. It is NOT a percentage of the supply's capacity (we don't know the fuse/contract limit).
 * Radius grows linearly from the inner ring (0 W) to the dashed scale circle (6 kW); above it stays full.
 */
export const METER_SCALE_W = 6000;
const R_MIN = 9;
const R_MAX = 27;
export const meterRadius = (watts?: number) => R_MIN + (R_MAX - R_MIN) * Math.min(1, Math.max(0, watts ?? 0) / METER_SCALE_W);

/** Arched wire from the meter to a device (quadratic curve, lifted over the walls). */
export function wire(from: Point, to: Point): string {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2;
  const my = Math.min(y1, y2) - 30 - Math.abs(x2 - x1) * 0.08;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}
