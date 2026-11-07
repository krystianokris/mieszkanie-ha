import { createMemo, For, Show } from "solid-js";
import { defineTile, domainOf, fmt, num, useHass, useT, type Hass, type Translator } from "../sdk";
import { Icon } from "../app/Icon";
import type { EnergyIds } from "../app/model";
import { Kicker, Ring } from "../app/parts";
import { Nexus } from "./nexus";

interface Slot {
  start: Date;
  end: Date;
  p: number;
}

const SLOT_WINDOW = 4;

/** Upcoming half-hour rates (pence/kWh) from Octopus' current/next day rate events. */
export function upcomingSlots(hass: Hass | undefined, ids: EnergyIds, max = 48): Slot[] {
  if (!hass) return [];
  const now = Date.now();
  const raw = [ids.ratesToday, ids.ratesTomorrow].flatMap(
    (id) => ((id && hass.states[id]?.attributes.rates) as { start: string; end: string; value_inc_vat: number }[] | undefined) ?? [],
  );
  return raw
    .map((r) => ({ start: new Date(r.start), end: new Date(r.end), p: Number(r.value_inc_vat) * 100 }))
    .filter((s) => s.end.getTime() > now && Number.isFinite(s.p))
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, max);
}

export function cheapestWindow(slots: Slot[], size = SLOT_WINDOW): { index: number; size: number; avg: number } | undefined {
  const k = Math.min(size, slots.length);
  if (!k) return undefined;
  let best = { index: 0, sum: Number.POSITIVE_INFINITY };
  for (let i = 0; i + k <= slots.length; i++) {
    const sum = slots.slice(i, i + k).reduce((a, s) => a + s.p, 0);
    if (sum < best.sum) best = { index: i, sum };
  }
  return { index: best.index, size: k, avg: best.sum / k };
}

export const pence = (v: number | undefined, lang: string) => fmt(v, v !== undefined && Math.abs(v) < 10 ? 2 : 1, lang);
const clock = (d: Date | string | undefined, lang: string) =>
  d ? new Intl.DateTimeFormat(lang, { hour: "2-digit", minute: "2-digit" }).format(new Date(d)) : "";

function priceTone(t: Translator, p: number | undefined, avg: number | undefined): { tone: string; label: string } {
  if (p === undefined) return { tone: "normal", label: "" };
  if (p < 0) return { tone: "negative", label: t("negative") };
  const ref = avg ?? 25;
  if (p <= ref * 0.75) return { tone: "cheap", label: t("cheap") };
  if (p >= ref * 1.25) return { tone: "pricey", label: t("pricey") };
  return { tone: "normal", label: t("normal") };
}

function money(hass: Hass | undefined, id: string | undefined, lang: string): string | undefined {
  const e = id ? hass?.states[id] : undefined;
  const v = num(e?.state);
  if (v === undefined) return undefined;
  const currency = String(e?.attributes.unit_of_measurement ?? "GBP");
  try {
    return new Intl.NumberFormat(lang, { style: "currency", currency }).format(v);
  } catch {
    return `${fmt(v, 2, lang)} ${currency}`;
  }
}

function amount(hass: Hass | undefined, id: string | undefined, lang: string): string | undefined {
  const e = id ? hass?.states[id] : undefined;
  const v = num(e?.state);
  return v === undefined ? undefined : `${fmt(v, v < 10 ? 2 : 1, lang)} ${e?.attributes.unit_of_measurement ?? ""}`.trim();
}

export const EnergyHeroTile = defineTile<{ ids: EnergyIds }>({
  type: "energy-hero",
  sizes: { lg: { w: 12, h: 4 }, md: { w: 8, h: 6 }, sm: { w: 4, h: 12 } },
  component: (props) => {
    const hass = useHass();
    const t = useT();
    const ids = () => props.config.ids;
    const state = (id?: string) => (id ? hass()?.states[id] : undefined);
    const rateP = () => {
      const v = num(state(ids().elecRate)?.state);
      return v === undefined ? undefined : v * 100;
    };
    const avgP = () => {
      const v = num(state(ids().elecRate)?.attributes.current_day_average_rate ?? state(ids().ratesToday)?.attributes.average_rate);
      return v === undefined ? undefined : v * 100;
    };
    const next = () => state(ids().elecNext);
    const nextP = () => {
      const v = num(next()?.state);
      return v === undefined ? undefined : v * 100;
    };
    const gasP = () => {
      const v = num(state(ids().gasRate)?.state);
      return v === undefined ? undefined : v * 100;
    };
    const demand = () => {
      const e = state(ids().demand);
      const v = num(e?.state);
      return v !== undefined && e?.attributes.unit_of_measurement === "kW" ? v * 1000 : v;
    };
    const tone = () => priceTone(t, rateP(), avgP());
    const heating = createMemo(() =>
      Object.values(hass()?.states ?? {}).some((e) => domainOf(e.entity_id) === "climate" && e.attributes.hvac_action === "heating"),
    );
    return (
      <article class="k-tile k-energy-hero" data-tone={tone().tone}>
        <section class="k-energy-prices">
          <Kicker>{t("energyNow")}</Kicker>
          <div class="k-energy-big">
            <b>{pence(rateP(), t.lang())}</b>
            <span>p/kWh</span>
          </div>
          <Show when={tone().label}>
            <span class="k-tone-pill">{tone().label}</span>
          </Show>
          <div class="k-energy-wells">
            <Show when={nextP() !== undefined}>
              <div class="k-well k-metric sm">
                <span>{t("nextRate", { t: clock(next()?.attributes.start, t.lang()) })}</span>
                <strong>{pence(nextP(), t.lang())} p</strong>
              </div>
            </Show>
            <Show when={gasP() !== undefined}>
              <div class="k-well k-metric sm gas">
                <span>{t("gasPrice")}</span>
                <strong>{pence(gasP(), t.lang())} p</strong>
              </div>
            </Show>
          </div>
        </section>

        <Nexus ids={ids()} demand={demand()} rateP={rateP()} heating={heating()} />

        <section class="k-energy-ring">
          <Kicker>{t("demandNow")}</Kicker>
          <Ring value={demand()} min={0} max={3000} size={150} tone={(demand() ?? 0) > 2000 ? "warm" : "ice"}>
            <b>
              {fmt(demand(), 0, t.lang())}
              <small> W</small>
            </b>
          </Ring>
        </section>
      </article>
    );
  },
});

export const EnergySlotsTile = defineTile<{ ids: EnergyIds }>({
  type: "energy-slots",
  sizes: { lg: { w: 8, h: 3 }, md: { w: 8, h: 3 }, sm: { w: 4, h: 4 } },
  component: (props) => {
    const hass = useHass();
    const t = useT();
    const slots = createMemo(() => upcomingSlots(hass(), props.config.ids));
    const best = createMemo(() => cheapestWindow(slots()));
    const range = () => {
      const values = slots().map((s) => s.p);
      return { min: Math.min(0, ...values), max: Math.max(1, ...values) };
    };
    const height = (p: number) => {
      const { min, max } = range();
      return `${Math.max(6, ((p - min) / (max - min)) * 100)}%`;
    };
    const inBest = (i: number) => !!best() && i >= best()!.index && i < best()!.index + best()!.size;
    const hint = () => {
      const b = best();
      if (!b) return "";
      const from = slots()[b.index].start;
      const to = slots()[b.index + b.size - 1].end;
      return t("cheapestHint", { from: clock(from, t.lang()), to: clock(to, t.lang()), v: pence(b.avg, t.lang()) });
    };
    return (
      <article class="k-tile k-slots">
        <header class="k-panel-head">
          <div>
            <span class="k-panel-kicker" style={{ color: "#86e6ec" }}>
              {t("slotsKicker")}
            </span>
            <h3>{t("slotsTitle")}</h3>
          </div>
          <span class="k-panel-icon" style={{ color: "#86e6ec" }}>
            <Icon icon="mdi:chart-timeline-variant" />
          </span>
        </header>
        <Show when={slots().length} fallback={<p class="k-sub">—</p>}>
          <div class="k-bars" role="img" aria-label={hint()}>
            <For each={slots()}>
              {(slot, i) => (
                <div class="k-bar-col" classList={{ best: inBest(i()), now: i() === 0, neg: slot.p < 0 }} title={`${clock(slot.start, t.lang())} · ${pence(slot.p, t.lang())} p`}>
                  <i style={{ height: height(slot.p) }} />
                  <Show when={i() % 6 === 0}>
                    <small>{i() === 0 ? t("nowMarker") : clock(slot.start, t.lang())}</small>
                  </Show>
                </div>
              )}
            </For>
          </div>
          <p class="k-slots-hint">
            <Icon icon="mdi:washing-machine" />
            {hint()}
          </p>
        </Show>
      </article>
    );
  },
});

export const EnergyTodayTile = defineTile<{ ids: EnergyIds }>({
  type: "energy-today",
  sizes: { lg: { w: 4, h: 3 }, md: { w: 8, h: 2 }, sm: { w: 4, h: 3 } },
  component: (props) => {
    const hass = useHass();
    const t = useT();
    const ids = () => props.config.ids;
    const rows = () =>
      [
        { label: t("elecCost"), value: money(hass(), ids().elecCost, t.lang()), gas: false },
        { label: t("elecUse"), value: amount(hass(), ids().elecUse, t.lang()), gas: false },
        { label: t("gasCost"), value: money(hass(), ids().gasCost, t.lang()), gas: true },
        { label: t("gasUse"), value: amount(hass(), ids().gasUse, t.lang()), gas: true },
      ].filter((r) => r.value !== undefined);
    return (
      <article class="k-tile k-energy-today">
        <header class="k-panel-head">
          <div>
            <span class="k-panel-kicker" style={{ color: "#86e6ec" }}>
              {t("todayKicker")}
            </span>
            <h3>{t("todayTitle")}</h3>
          </div>
        </header>
        <div class="k-today-grid">
          <For each={rows()}>
            {(r) => (
              <div class="k-well k-metric sm" classList={{ gas: r.gas }}>
                <span>{r.label}</span>
                <strong>{r.value}</strong>
              </div>
            )}
          </For>
        </div>
      </article>
    );
  },
});
