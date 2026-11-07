// How long has a device been on — and can we actually know that?
//
// `last_changed` is re-stamped by Home Assistant on every restart (restored state) and whenever an
// entity comes back from `unavailable`/`unknown`. So it is only a real start time when the state
// right before it was a genuine, different state (e.g. off → on). We ask the recorder for that.
import type { Hass } from "../sdk";

export type Uptime =
  | { kind: "exact"; since: number }
  /** Start is at least this old; the real start is earlier but unknown (restart, outage, no history). */
  | { kind: "atLeast"; since: number; reason: "restart" | "outage" | "history" };

const UNKNOWN = ["unavailable", "unknown", ""];

interface HistoryRow {
  s: string;
  lc?: number;
  lu?: number;
}

/** State of the entity just before `changedAt` (ms), or undefined when the recorder has nothing. */
async function previousState(hass: Hass, entity: string, changedAt: number): Promise<string | undefined> {
  const msg = {
    type: "history/history_during_period",
    start_time: new Date(changedAt - 6 * 3600_000).toISOString(),
    end_time: new Date(changedAt + 1000).toISOString(),
    entity_ids: [entity],
    minimal_response: true,
    no_attributes: true,
    significant_changes_only: false,
    include_start_time_state: true,
  };
  const send = hass.callWS ? (m: Record<string, unknown>) => hass.callWS!(m) : hass.connection ? (m: Record<string, unknown>) => hass.connection!.sendMessagePromise(m) : undefined;
  if (!send) return undefined;
  const res = (await send(msg)) as Record<string, HistoryRow[]>;
  const rows = res?.[entity] ?? [];
  // Rows are oldest → newest; "lc" (or "lu" when unchanged) is in seconds.
  const before = rows.filter((r) => ((r.lc ?? r.lu ?? 0) * 1000) < changedAt - 500);
  return before.length ? before[before.length - 1].s : undefined;
}

/** Classify the uptime of an entity that is currently on. */
export async function uptimeOf(hass: Hass, entity: string): Promise<Uptime | undefined> {
  const e = hass.states[entity];
  if (!e?.last_changed || UNKNOWN.includes(e.state)) return undefined;
  const since = Date.parse(e.last_changed);
  try {
    const prev = await previousState(hass, entity, since);
    if (prev === undefined) return { kind: "atLeast", since, reason: "history" };
    if (UNKNOWN.includes(prev)) return { kind: "atLeast", since, reason: "outage" };
    // Same state before and after: the timestamp was re-stamped (restart / reload), not a real switch-on.
    if (prev === e.state) return { kind: "atLeast", since, reason: "restart" };
    return { kind: "exact", since };
  } catch {
    return { kind: "atLeast", since, reason: "history" };
  }
}

export const durationText = (ms: number) => {
  const min = Math.max(0, Math.round(ms / 60000));
  return min >= 60 ? `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, "0")} min` : `${min} min`;
};

export const reasonText: Record<"restart" | "outage" | "history", string> = {
  restart: "czas liczony od restartu Home Assistant — wcześniejszy start nieznany",
  outage: "urządzenie było chwilowo niedostępne — wcześniejszy start nieznany",
  history: "brak historii przed tą chwilą — dokładny start nieznany",
};
