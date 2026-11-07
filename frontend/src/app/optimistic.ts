import { createEffect, createSignal, onCleanup } from "solid-js";
import { clamp } from "../sdk/format";

/** How long a shown-but-unconfirmed value waits for Home Assistant before falling back to the entity. */
const SETTLE_MS = 8000;

/**
 * −/+ stepping with an optimistic value: every tap moves the shown target at once,
 * one service call goes out after `delay` ms of quiet, and the shown value stays
 * until the entity reports it back (or SETTLE_MS passes).
 */
export function useOptimisticTarget(opts: {
  value: () => number | undefined;
  min: () => number;
  max: () => number;
  step: () => number;
  commit: (value: number) => unknown;
  delay?: number;
}) {
  const [pending, setPending] = createSignal<number>();
  let debounce: ReturnType<typeof setTimeout> | undefined;
  let settle: ReturnType<typeof setTimeout> | undefined;
  let sent = false;
  onCleanup(() => {
    clearTimeout(debounce);
    clearTimeout(settle);
  });

  createEffect(() => {
    const p = pending();
    const v = opts.value();
    if (p !== undefined && sent && v !== undefined && Math.abs(v - p) < 1e-6) {
      sent = false;
      clearTimeout(settle);
      setPending(undefined);
    }
  });

  const nudge = (dir: 1 | -1) => {
    const base = pending() ?? opts.value();
    if (base === undefined) return;
    const step = opts.step();
    const next = clamp(Math.round((base + dir * step) / step) * step, opts.min(), opts.max());
    setPending(Number(next.toFixed(2)));
    sent = false;
    clearTimeout(debounce);
    clearTimeout(settle);
    debounce = setTimeout(() => {
      sent = true;
      opts.commit(pending()!);
      settle = setTimeout(() => {
        sent = false;
        setPending(undefined);
      }, SETTLE_MS);
    }, opts.delay ?? 600);
  };

  return { shown: () => pending() ?? opts.value(), nudge, pending };
}

/** A choice (mode, fan, swing, preset) shown as selected immediately, confirmed by the entity. */
export function useOptimisticChoice(actual: () => Record<string, string | undefined>) {
  const [picked, setPicked] = createSignal<Record<string, string>>({});
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  onCleanup(() => timers.forEach(clearTimeout));

  createEffect(() => {
    const now = actual();
    const p = picked();
    const confirmed = Object.keys(p).filter((k) => now[k] === p[k]);
    if (confirmed.length) setPicked(Object.fromEntries(Object.entries(p).filter(([k]) => !confirmed.includes(k))));
  });

  const choose = (field: string, value: string, commit: () => unknown) => {
    setPicked((p) => ({ ...p, [field]: value }));
    clearTimeout(timers.get(field));
    timers.set(field, setTimeout(() => setPicked(({ [field]: _, ...rest }) => rest), SETTLE_MS));
    commit();
  };
  /** The value to show: the pick until the entity agrees, then the entity's own value. */
  const shown = (field: string) => picked()[field] ?? actual()[field];
  return { choose, shown };
}
