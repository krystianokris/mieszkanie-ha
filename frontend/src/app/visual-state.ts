import { domainOf, isUnavailable, type HassEntity } from "../sdk";
import { isAlertState } from "./states";

const ACTIVE = new Set(["on", "playing", "heat", "cool", "heat_cool", "auto", "dry", "fan_only", "run", "running", "open", "home", "cleaning"]);
const DIMMABLE = new Set(["light", "switch", "fan", "media_player", "climate", "input_boolean", "humidifier", "water_heater"]);

export type VisualState = "on" | "dim" | "alert" | "missing" | "plain";

/**
 * on = full colour + glow, dim = off/idle/standby, alert = red well edge,
 * missing = desaturated, plain = sensors that are simply reporting.
 */
export function visualState(e: HassEntity | undefined): VisualState {
  if (!e || isUnavailable(e)) return "missing";
  if (isAlertState(e)) return "alert";
  if (DIMMABLE.has(domainOf(e.entity_id))) return ACTIVE.has(e.state) ? "on" : "dim";
  if (domainOf(e.entity_id) === "sensor" && /(machine_status|program_phase|_status)$/.test(e.entity_id)) {
    return /(run|wash|dry|spin|rinse)/.test(e.state) ? "on" : "dim";
  }
  return "plain";
}
