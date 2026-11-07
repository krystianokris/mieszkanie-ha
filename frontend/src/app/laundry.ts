import { num, type Hass, type TKey, type Translator } from "../sdk";
import type { ApplianceIds } from "./model";

/** Haier hOn reports numeric program phases. */
const WASHER_PHASE: Record<number, TKey> = {
  0: "phReady", 1: "phWash", 2: "phWash", 3: "phSpin", 4: "phRinse", 5: "phRinse", 6: "phRinse", 7: "phDry",
  9: "phSteam", 10: "phReady", 11: "phSpin", 12: "phWeigh", 13: "phWeigh", 14: "phWash", 15: "phWash", 16: "phWash",
  17: "phRinse", 18: "phRinse", 19: "phScheduled", 20: "phTumble", 24: "phRefresh", 25: "phWash", 26: "phHeat", 27: "phWash",
};

const DRYER_PHASE: Record<number, TKey> = {
  0: "phReady", 1: "phHeat", 2: "phDry", 3: "phCool", 13: "phCool", 14: "phHeat", 15: "phHeat", 16: "phCool",
  18: "phTumble", 19: "phDry", 20: "phDry",
};

export type ApplianceMode = "running" | "paused" | "done" | "alarm" | "idle" | "off" | "missing";

export interface ApplianceView {
  mode: ApplianceMode;
  status: string;
  phase?: string;
  remaining?: number;
  total?: number;
  progress?: number;
  finish?: Date;
  program?: string;
}

const STATUS_KEY: Record<ApplianceMode, TKey> = {
  running: "running",
  paused: "paused",
  done: "laundryDone",
  alarm: "alarm",
  idle: "standby",
  off: "applianceOff",
  missing: "unavailable",
};

/** Normalised view of a washer or dryer from its hOn-style sensors. */
export function applianceView(hass: Hass | undefined, ids: ApplianceIds, dryer: boolean, t: Translator): ApplianceView {
  const st = (id?: string) => (id ? hass?.states[id] : undefined);
  const raw = st(ids.status)?.state ?? "unavailable";
  const remaining = num(st(ids.remaining)?.state);
  const total = num(st(ids.total)?.state);
  const progressRaw = num(st(ids.progress)?.state);

  let mode: ApplianceMode;
  if (raw === "unavailable" || raw === "unknown") mode = "missing";
  else if (/run|wash|dry|spin|rinse|active|on$/.test(raw)) mode = "running";
  else if (/pause/.test(raw)) mode = "paused";
  else if (/finish|done|end|complete/.test(raw)) mode = "done";
  else if (/alarm|error|fault/.test(raw)) mode = "alarm";
  else if (raw === "off") mode = "off";
  else mode = "idle";

  const active = mode === "running" || mode === "paused";
  const progress =
    progressRaw !== undefined
      ? progressRaw / 100
      : active && remaining !== undefined && total
        ? Math.min(1, Math.max(0, (total - remaining) / total))
        : mode === "done"
          ? 1
          : undefined;

  const phaseRaw = st(ids.phase)?.state;
  const phaseNum = phaseRaw !== undefined && /^\d+$/.test(phaseRaw) ? Number(phaseRaw) : undefined;
  const map = dryer ? DRYER_PHASE : WASHER_PHASE;
  const phase =
    !active || phaseRaw === undefined || phaseRaw === "unavailable"
      ? undefined
      : phaseNum !== undefined
        ? map[phaseNum]
          ? t(map[phaseNum])
          : t("phaseN", { n: phaseNum })
        : phaseRaw;

  const finishRaw = st(ids.finish)?.state;
  const finish =
    finishRaw && !Number.isNaN(Date.parse(finishRaw))
      ? new Date(finishRaw)
      : active && remaining !== undefined
        ? new Date(Date.now() + remaining * 60_000)
        : undefined;

  const program = st(ids.program)?.state;
  return {
    mode,
    status: t(STATUS_KEY[mode]),
    phase,
    remaining: active ? remaining : undefined,
    total,
    progress,
    finish,
    program: program && program !== "unavailable" && program !== "unknown" ? program : undefined,
  };
}
