import { createMemo, createSignal, For, onCleanup, Show } from "solid-js";
import { placePins } from "../app/pins";
import { defineTile, fmt, useKrystal, useT } from "../sdk";
import { art } from "../app/art";
import { Brand } from "../app/Brand";
import { FUEL_PAGE } from "../app/features";
import {
  fuelTab,
  hotStation,
  mapsLink,
  setFuelTab,
  setHotStation,
  stationLabel,
  stationsFor,
  useFuel,
  type FuelCode,
  type FuelStation,
} from "../app/fuel";
import { Icon } from "../app/Icon";

const price = (v: number | undefined, lang: string) => fmt(v, 1, lang);
const miles = (v: number | undefined, lang: string) => (v === undefined ? "" : `${fmt(v, 1, lang)} mi`);

function Best(props: { code: FuelCode; station?: FuelStation }) {
  const t = useT();
  return (
    <div class="k-well k-fuel-best" data-fuel={props.code}>
      <img src={props.code === "B7" ? art["pump-diesel"] : art["pump-petrol"]} alt="" draggable={false} />
      <div class="k-fuel-best-copy">
        <span class="k-fuel-label">{props.code === "B7" ? t("diesel") : t("petrol")}</span>
        <b>
          {price(props.station?.prices?.[props.code], t.lang())}
          <small>p</small>
        </b>
        <Show when={props.station}>
          <span class="k-fuel-where">
            <Brand brand={props.station!.brand} size="sm" />
            {miles(props.station!.distance, t.lang())}
          </span>
        </Show>
      </div>
    </div>
  );
}

/** Cheapest diesel and petrol nearby; on the overview it opens the fuel page. */
export const FuelCardTile = defineTile<{ link?: boolean }>({
  type: "fuelcard",
  sizes: { lg: { w: 6, h: 3 }, md: { w: 8, h: 3 }, sm: { w: 4, h: 4 } },
  component: (props) => {
    const fuel = useFuel();
    const { navigate } = useKrystal();
    const t = useT();
    const diesel = () => stationsFor(fuel(), "B7")[0];
    const petrol = () => stationsFor(fuel(), "E10")[0];
    const updated = () =>
      fuel().updated ? new Intl.DateTimeFormat(t.lang(), { hour: "2-digit", minute: "2-digit" }).format(fuel().updated) : "";
    return (
      <article
        class="k-tile k-fuelcard"
        classList={{ link: !!props.config.link }}
        role={props.config.link ? "button" : undefined}
        tabindex={props.config.link ? "0" : undefined}
        onClick={() => props.config.link && navigate(FUEL_PAGE)}
      >
        <header class="k-panel-head">
          <div>
            <span class="k-panel-kicker" style={{ color: "#a8e7c8" }}>
              {t("fuelKicker")}
            </span>
            <h3>{t("cheapestNearby")}</h3>
          </div>
          <span class="k-panel-icon" style={{ color: "#a8e7c8" }}>
            <Icon icon="mdi:gas-station" />
          </span>
        </header>
        <Show when={diesel() || petrol()} fallback={<p class="k-sub">{fuel().loading ? "…" : t("noFuel")}</p>}>
          <div class="k-fuel-pair">
            <Best code="B7" station={diesel()} />
            <Best code="E10" station={petrol()} />
          </div>
        </Show>
        <Show when={updated()}>
          <span class="k-fuel-foot">
            {t("updatedAt", { t: updated() })} · {fuel().B7?.radius ?? 10} mi
          </span>
        </Show>
      </article>
    );
  },
});

export const FuelStationsTile = defineTile<Record<string, never>>({
  type: "fuelstations",
  sizes: { lg: { w: 7, h: 6 }, md: { w: 8, h: 6 }, sm: { w: 4, h: 8 } },
  component: () => {
    const fuel = useFuel();
    const t = useT();
    const list = createMemo(() => stationsFor(fuel(), fuelTab()).slice(0, 5));
    return (
      <article class="k-tile k-stations">
        <header class="k-panel-head">
          <div>
            <span class="k-panel-kicker" style={{ color: "#a8e7c8" }}>
              {t("fuelKicker")}
            </span>
            <h3>{t("stations")}</h3>
          </div>
          <div class="k-seg k-fuel-tabs">
            <button type="button" classList={{ selected: fuelTab() === "B7" }} onClick={() => setFuelTab("B7")}>
              {t("dieselShort")}
            </button>
            <button type="button" classList={{ selected: fuelTab() === "E10" }} onClick={() => setFuelTab("E10")}>
              {t("petrolShort")}
            </button>
          </div>
        </header>
        <Show when={list().length} fallback={<p class="k-sub">{fuel().loading ? "…" : t("noFuel")}</p>}>
          <ol class="k-station-list">
            <For each={list()}>
              {(st, i) => {
                const label = () => stationLabel(st);
                return (
                  <li onMouseEnter={() => setHotStation(st.id)} onMouseLeave={() => setHotStation(undefined)}>
                    <a
                      class="k-well k-station"
                      classList={{ hot: hotStation() === st.id }}
                      href={mapsLink(st)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onFocus={() => setHotStation(st.id)}
                      onBlur={() => setHotStation(undefined)}
                      aria-label={`${t("directions")}: ${st.brand ?? ""}`}
                    >
                      <span class="k-station-rank">{i() + 1}</span>
                      <Brand brand={st.brand} />
                      <span class="k-station-copy">
                        <b>{(st.brand ?? "").trim()}</b>
                        <small>{[label().name, label().town].filter(Boolean).join(", ")}</small>
                      </span>
                      <span class="k-station-price" classList={{ active: fuelTab() === "B7" }}>
                        <small>{t("dieselShort")}</small>
                        <b>{price(st.prices?.B7, t.lang())}p</b>
                      </span>
                      <span class="k-station-price petrol" classList={{ active: fuelTab() === "E10" }}>
                        <small>{t("petrolShort")}</small>
                        <b>{price(st.prices?.E10, t.lang())}p</b>
                      </span>
                      <span class="k-station-dist">{miles(st.distance, t.lang())}</span>
                      <span class="k-station-go" aria-hidden="true">
                        <Icon icon="mdi:navigation-variant-outline" />
                      </span>
                    </a>
                  </li>
                );
              }}
            </For>
          </ol>
        </Show>
      </article>
    );
  },
});

interface MapPoint {
  station: FuelStation;
  rank: number;
  x: number;
  y: number;
}

/** Anchor dots at true positions, de-collided chips, and leader lines between them. */
function PinLayer(props: { points: MapPoint[]; width: number; height: number; home?: { x: number; y: number } }) {
  const t = useT();
  const placed = createMemo(() =>
    placePins(
      props.points.map((p) => ({ id: p.station.id, rank: p.rank, x: p.x, y: p.y })),
      props.width,
      props.height,
      props.home,
    ),
  );
  const station = (id: string) => props.points.find((p) => p.station.id === id)!.station;
  const back = () => [...placed()].sort((a, b) => b.rank - a.rank);
  return (
    <>
      <svg class="k-pin-leaders" width={props.width} height={props.height} aria-hidden="true">
        <For each={placed().filter((p) => p.moved)}>
          {(p) => <line x1={p.x} y1={p.y} x2={p.cx} y2={p.cy} classList={{ hot: hotStation() === p.id }} />}
        </For>
      </svg>
      <Show when={props.home}>
        <span class="k-radar-home" style={{ left: `${props.home!.x}px`, top: `${props.home!.y}px` }}>
          <Icon icon="mdi:home" />
        </span>
      </Show>
      <For each={back()}>
        {(p) => (
          <span class="k-pin-dot" data-rank={p.rank} classList={{ best: p.rank === 1, hot: hotStation() === p.id }} style={{ left: `${p.x}px`, top: `${p.y}px` }}>
            {p.rank}
          </span>
        )}
      </For>
      <For each={back()}>
        {(p) => (
          <a
            class="k-pin"
            data-rank={p.rank}
            classList={{ best: p.rank === 1, hot: hotStation() === p.id }}
            href={mapsLink(station(p.id))}
            target="_blank"
            rel="noopener noreferrer"
            style={{ left: `${p.cx}px`, top: `${p.cy}px` }}
            onMouseEnter={() => setHotStation(p.id)}
            onMouseLeave={() => setHotStation(undefined)}
            title={`${(station(p.id).brand ?? "").trim()} · ${price(station(p.id).prices?.[fuelTab()], t.lang())}p`}
          >
            <Brand brand={station(p.id).brand} size="sm" />
            <b>{price(station(p.id).prices?.[fuelTab()], t.lang())}</b>
          </a>
        )}
      </For>
    </>
  );
}

/** The bridge's Google static map with Krystal pins; a radar only if the map call fails. */
export const FuelMapTile = defineTile<Record<string, never>>({
  type: "fuelmap",
  sizes: { lg: { w: 5, h: 6 }, md: { w: 8, h: 6 }, sm: { w: 4, h: 5 } },
  component: () => {
    const fuel = useFuel();
    const t = useT();
    const stations = createMemo(() => stationsFor(fuel(), fuelTab()).slice(0, 5));
    const byId = createMemo(() => new Map(stationsFor(fuel(), fuelTab()).map((s) => [s.id, s])));
    const rank = (id: string) => stations().findIndex((s) => s.id === id) + 1;
    const map = () => fuel().map;

    const [size, setSize] = createSignal({ w: 0, h: 0 });
    const observe = (el: HTMLDivElement) => {
      const ro = new ResizeObserver(([entry]) => setSize({ w: entry.contentRect.width, h: entry.contentRect.height }));
      ro.observe(el);
      onCleanup(() => ro.disconnect());
    };

    /** object-fit: cover — scale and offset that map image pixels onto the frame. */
    const cover = createMemo(() => {
      const m = map();
      const { w, h } = size();
      if (!m || !w || !h) return undefined;
      const s = Math.max(w / m.width, h / m.height);
      return { s, ox: (w - m.width * s) / 2, oy: (h - m.height * s) / 2 };
    });
    const mapPoints = createMemo<MapPoint[]>(() => {
      const m = map();
      const c = cover();
      if (!m || !c) return [];
      return m.pins
        .map((pin) => ({ pin, station: byId().get(pin.id), rank: rank(pin.id) }))
        .filter((p) => p.station && p.rank > 0)
        .map((p) => ({ station: p.station!, rank: p.rank, x: p.pin.x * c.s + c.ox, y: p.pin.y * c.s + c.oy }));
    });
    const mapHome = () => {
      const m = map();
      const c = cover();
      return m?.home && c ? { x: m.home.x * c.s + c.ox, y: m.home.y * c.s + c.oy } : undefined;
    };

    const scale = createMemo(() => Math.max(1, Math.ceil(Math.max(0, ...stations().map((s) => s.distance ?? 0)) * 1.15)));
    const radarPoints = createMemo<MapPoint[]>(() => {
      const centre = fuel().B7?.centre ?? fuel().E10?.centre;
      const { w, h } = size();
      if (centre?.latitude === undefined || centre.longitude === undefined || !w || !h) return [];
      const k = Math.cos((centre.latitude * Math.PI) / 180);
      const r = (Math.min(w, h) / 2) * 0.88;
      return stations()
        .filter((s) => s.latitude !== undefined && s.longitude !== undefined)
        .map((s) => ({
          station: s,
          rank: rank(s.id),
          x: w / 2 + (((s.longitude! - centre.longitude!) * 69.17 * k) / scale()) * r,
          y: h / 2 - (((s.latitude! - centre.latitude!) * 69.17) / scale()) * r,
        }));
    });

    return (
      <article class="k-tile k-fuelmap">
        <header class="k-panel-head">
          <div>
            <span class="k-panel-kicker" style={{ color: "#a8e7c8" }}>
              {t("mapTitle")}
            </span>
            <h3>
              {fuel().B7?.centre?.label ?? t("home")} · {fuel().B7?.radius ?? 10} mi
            </h3>
          </div>
        </header>
        <Show
          when={map()}
          fallback={
            <Show when={fuel().mapError} fallback={<div class="k-mapimg loading" />}>
              <div class="k-radar" ref={observe}>
                <span class="k-radar-ring r1" />
                <span class="k-radar-ring r2" />
                <span class="k-radar-ring r3" />
                <span class="k-radar-scale">{scale()} mi</span>
                <PinLayer points={radarPoints()} width={size().w} height={size().h} home={{ x: size().w / 2, y: size().h / 2 }} />
              </div>
            </Show>
          }
        >
          <div class="k-mapimg">
            <div class="k-mapframe" ref={observe}>
              <img
                src={map()!.image}
                alt=""
                draggable={false}
                style={
                  cover()
                    ? { width: `${map()!.width * cover()!.s}px`, height: `${map()!.height * cover()!.s}px`, left: `${cover()!.ox}px`, top: `${cover()!.oy}px` }
                    : undefined
                }
              />
              <Show when={mapHome() && map()!.radiusPixels && cover()}>
                <span
                  class="k-map-radius"
                  style={{ left: `${mapHome()!.x}px`, top: `${mapHome()!.y}px`, width: `${map()!.radiusPixels! * 2 * cover()!.s}px` }}
                />
              </Show>
              <PinLayer points={mapPoints()} width={size().w} height={size().h} home={mapHome()} />
            </div>
          </div>
        </Show>
      </article>
    );
  },
});
