import { createEffect, createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import { clamp, fmt, num, useHass, useKrystal, useT, type Hass } from "../sdk";
import { art } from "../app/art";
import { Icon } from "../app/Icon";
import type { EnergyIds } from "../app/model";

type FeedType = "electric" | "water" | "gas";

interface Feed {
  type: FeedType;
  label: string;
  value: string;
  detail: string;
}

interface Wire {
  type: FeedType;
  x: number;
  y: number;
  length: number;
  angle: number;
}

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Where the segment from (x1,y1) towards (x2,y2) leaves/enters `box`. */
function edgePoint(box: Box, x1: number, y1: number, x2: number, y2: number) {
  const right = box.left + box.width;
  const bottom = box.top + box.height;
  const dx = x2 - x1;
  const dy = y2 - y1;
  let best = 2;
  let point = { x: x2, y: y2 };
  const consider = (t: number, x: number, y: number) => {
    if (t <= 0.001 || t >= 0.999 || t >= best) return;
    if (x < box.left - 1 || x > right + 1 || y < box.top - 1 || y > bottom + 1) return;
    best = t;
    point = { x, y };
  };
  if (Math.abs(dx) > 0.01) {
    for (const edge of [box.left, right]) {
      const t = (edge - x1) / dx;
      consider(t, edge, y1 + dy * t);
    }
  }
  if (Math.abs(dy) > 0.01) {
    for (const edge of [box.top, bottom]) {
      const t = (edge - y1) / dy;
      consider(t, x1 + dx * t, edge);
    }
  }
  return point;
}

function value(hass: Hass | undefined, id: string | undefined) {
  const e = id ? hass?.states[id] : undefined;
  const v = num(e?.state);
  return v === undefined ? undefined : { v, unit: String(e?.attributes.unit_of_measurement ?? "") };
}

function money(lang: string, amount: { v: number; unit: string } | undefined) {
  if (!amount) return "";
  try {
    return new Intl.NumberFormat(lang, { style: "currency", currency: amount.unit || "GBP" }).format(amount.v);
  } catch {
    return `${fmt(amount.v, 2, lang)} ${amount.unit}`;
  }
}

/**
 * Utility hub: electricity on the left, water over gas on the right, wires
 * from the home hub to each card with a glowing ball whose speed follows use.
 */
export function Nexus(props: { ids: EnergyIds; demand?: number; rateP?: number; heating: boolean }) {
  const hass = useHass();
  const { breakpoint } = useKrystal();
  const t = useT();
  const [wires, setWires] = createSignal<Wire[]>([]);
  let stage!: HTMLDivElement;

  const feeds = createMemo<Feed[]>(() => {
    const lang = t.lang();
    const list: Feed[] = [];
    if (props.demand !== undefined || props.rateP !== undefined) {
      list.push({
        type: "electric",
        label: t("nxElectric"),
        value: props.demand !== undefined ? `${fmt(props.demand, 0, lang)} W` : "—",
        detail: props.rateP !== undefined ? t("nxPriceNow", { v: fmt(props.rateP, Math.abs(props.rateP) < 10 ? 2 : 1, lang) }) : "",
      });
    }
    const water = value(hass(), props.ids.waterUse) ?? value(hass(), props.ids.waterReading);
    if (water) {
      const cost = money(lang, value(hass(), props.ids.waterCost));
      list.push({
        type: "water",
        label: t("nxWater"),
        value: `${fmt(water.v, water.v < 10 ? 2 : 0, lang)} ${water.unit}`.trim(),
        detail: [props.ids.waterUse && value(hass(), props.ids.waterUse) ? t("nxYesterday") : "", cost].filter(Boolean).join(" · "),
      });
    }
    const gasUse = value(hass(), props.ids.gasUse);
    const gasCost = value(hass(), props.ids.gasCost);
    if (gasUse || gasCost) {
      list.push({
        type: "gas",
        label: t("nxGas"),
        value: gasUse ? `${fmt(gasUse.v, gasUse.v < 10 ? 2 : 1, lang)} ${gasUse.unit}` : money(lang, gasCost),
        detail: [gasUse && gasCost ? `${money(lang, gasCost)} ${t("nxToday")}` : "", props.heating ? t("nxHeating") : t("nxIdle")].filter(Boolean).join(" · "),
      });
    }
    return list;
  });
  const left = () => feeds().filter((f) => f.type === "electric");
  const right = () => feeds().filter((f) => f.type !== "electric");

  const duration = (type: FeedType) => {
    if (type === "electric") return `${clamp(5.5 - (props.demand ?? 0) / 600, 1.1, 5.5).toFixed(2)}s`;
    if (type === "gas") return props.heating ? "2.4s" : "6s";
    return "4.2s";
  };

  const measure = () => {
    if (!stage) return;
    const origin = stage.getBoundingClientRect();
    const rel = (el: Element): Box => {
      const r = el.getBoundingClientRect();
      return { left: r.left - origin.left, top: r.top - origin.top, width: r.width, height: r.height };
    };
    const hubEl = stage.querySelector(".k-nx-hub");
    if (!hubEl) return;
    const hub = rel(hubEl);
    const hx = hub.left + hub.width / 2;
    const hy = hub.top + hub.height / 2;
    const next = [...stage.querySelectorAll<HTMLElement>("[data-feed]")].flatMap((card) => {
      const box = rel(card);
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      // Supply flows from the utility card into the home hub.
      const start = edgePoint(box, cx, cy, hx, hy);
      const end = edgePoint(hub, cx, cy, hx, hy);
      const length = Math.hypot(end.x - start.x, end.y - start.y);
      if (length < 8) return [];
      return [{ type: card.dataset.feed as FeedType, x: start.x, y: start.y - 1.5, length, angle: (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI }];
    });
    setWires(next);
  };

  onMount(() => {
    const ro = new ResizeObserver(() => measure());
    ro.observe(stage);
    measure();
    onCleanup(() => ro.disconnect());
  });
  createEffect(() => {
    feeds().length;
    breakpoint();
    queueMicrotask(measure);
  });

  return (
    <section class="k-nexus">
      <div class="k-nx-stage" ref={stage} classList={{ single: right().length === 0 }} style={{ "--stack": String(Math.max(right().length, 1)) }}>
        <For each={wires()}>
          {(w) => (
            <i
              class={`k-nx-wire ${w.type}`}
              style={{
                left: `${w.x}px`,
                top: `${w.y}px`,
                width: `${w.length}px`,
                transform: `rotate(${w.angle}deg)`,
                "--run": `${Math.max(0, w.length - 10)}px`,
                "--dur": duration(w.type),
              }}
              classList={{ idle: w.type === "gas" && !props.heating }}
            />
          )}
        </For>
        <div class="k-nx-col left">
          <For each={left()}>{(f) => <FeedCard feed={f} heating={props.heating} />}</For>
        </div>
        <div class="k-nx-hub">
          <Icon icon="mdi:home-outline" />
          <b>{t("nxHome")}</b>
          <small>{t("nxLive", { n: feeds().length, m: feeds().length })}</small>
        </div>
        <div class="k-nx-col right">
          <For each={right()}>{(f) => <FeedCard feed={f} heating={props.heating} />}</For>
        </div>
      </div>
      <footer class="k-nx-legend">
        <For each={feeds()}>
          {(f) => (
            <span class={f.type}>
              <i />
              {f.label}
            </span>
          )}
        </For>
      </footer>
    </section>
  );
}

function FeedCard(props: { feed: Feed; heating: boolean }) {
  return (
    <article class={`k-nx-feed ${props.feed.type}`} data-feed={props.feed.type} classList={{ heating: props.feed.type === "gas" && props.heating }}>
      <img
        class="k-nx-art"
        src={props.feed.type === "electric" ? art.bolt : props.feed.type === "water" ? art.watermeter : art.flame}
        alt=""
        draggable={false}
      />
      <small>{props.feed.label}</small>
      <strong>{props.feed.value}</strong>
      <em>{props.feed.detail}</em>
    </article>
  );
}
