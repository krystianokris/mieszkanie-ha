import { createEffect, createMemo, createSignal, on, onCleanup, onMount, Show, type Accessor } from "solid-js";
import { KrystalProvider, pickLang, translate, type Breakpoint, type Hass, type PanelRoute, type TileInstance } from "../sdk";
import "../tiles";
import { buildAutoLayout } from "./autolayout";
import { Dock, SETTINGS_PAGE } from "./Dock";
import { FUEL_PAGE, isEnergyPage, resolveFeatures, STYLE_PAGE, type Features } from "./features";
import { TileGrid } from "./Grid";
import { Hero } from "./Hero";
import { Safe } from "./Safe";
import { f1Tiles } from "./f1-data";
import { displayName, setNameOverrides } from "./names";
import { visualFor } from "./art";
import { isF1Page, isSensorsPage, sensorTiles } from "./sensors";
import type { KrystalLayout, LayoutPage } from "./model";
import { pageKey, tilesForPage } from "./pages";
import { pickWeather } from "./pick";
import { phaseOf, Wallpaper } from "./Wallpaper";

function stable<T>(fn: () => T, key: (value: T) => string): Accessor<T> {
  let lastKey: string | undefined;
  let last: T;
  return createMemo(() => {
    const next = fn();
    const k = key(next);
    if (k !== lastKey) {
      lastKey = k;
      last = next;
    }
    return last;
  });
}

function pageFromPath(path: string | undefined): string | undefined {
  const id = path?.replace(/^\/+/, "").split("/")[0];
  return id ? decodeURIComponent(id) : undefined;
}

/** Home Assistant may not pass `route`; `/krystal/<page>` in the address bar is enough. */
function pageFromLocation(): string | undefined {
  const [panel, page] = location.pathname.replace(/^\/+/, "").split("/");
  return panel === "krystal" && page ? decodeURIComponent(page) : undefined;
}

export function App(props: {
  hass: Accessor<Hass | undefined>;
  layout: Accessor<KrystalLayout | null | undefined>;
  demo: Accessor<boolean>;
  narrow: Accessor<boolean>;
  version: Accessor<string>;
  route: Accessor<PanelRoute | undefined>;
  host: HTMLElement;
}) {
  const [width, setWidth] = createSignal(1280);
  const [now, setNow] = createSignal(new Date());
  const [page, setPage] = createSignal<string>(
    pageFromPath(props.route()?.path) ?? pageFromLocation() ?? new URLSearchParams(location.search).get("page") ?? "",
  );
  let root!: HTMLDivElement;
  let scroller: HTMLDivElement | undefined;

  onMount(() => {
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(root);
    const tick = setInterval(() => setNow(new Date()), 15_000);
    onCleanup(() => {
      ro.disconnect();
      clearInterval(tick);
    });
  });

  createEffect(
    on(
      () => props.route()?.path,
      (path) => {
        const id = pageFromPath(path);
        if (id) setPage(id);
      },
    ),
  );

  const breakpoint = createMemo<Breakpoint>(() => (width() >= 1000 ? "lg" : width() >= 640 ? "md" : "sm"));
  const phase = createMemo(() => phaseOf(now().getHours()));

  const layout = stable<KrystalLayout | undefined>(
    () => {
      const given = props.layout();
      if (given) return given;
      if (given === undefined || !props.hass()) return undefined;
      return buildAutoLayout(props.hass()!, pickLang(props.hass()));
    },
    (l) => {
      setNameOverrides(l?.names);
      return l ? JSON.stringify(l) : "";
    },
  );

  const features = stable<Features | undefined>(
    () => (props.hass() ? resolveFeatures(props.hass()!, layout()?.features, props.demo()) : undefined),
    (f) => JSON.stringify(f ?? null),
  );

  const withFuel = createMemo<LayoutPage[]>(() => {
    const list = layout()?.pages ?? [];
    if (!list.length || !features()?.fuel || list.some((p) => p.id === FUEL_PAGE)) return list;
    const lang = pickLang(props.hass());
    const fuelPage: LayoutPage = {
      id: FUEL_PAGE,
      title: translate(lang, "fuelTitle"),
      heading: translate(lang, "fuelKicker"),
      subtitle: translate(lang, "fuelSubtitle", { r: 10 }),
      icon: "mdi:gas-station",
      kind: "page",
      accent: "#a8e7c8",
    };
    const at = list.findIndex((p) => isEnergyPage(p.id, p.title));
    const index = at >= 0 ? at + 1 : list.length;
    return [...list.slice(0, index), fuelPage, ...list.slice(index)];
  });

  const pages = createMemo<LayoutPage[]>(() => {
    const list = withFuel();
    if (!list.length || list.some((p) => p.id === STYLE_PAGE)) return list;
    const lang = pickLang(props.hass());
    return [
      ...list,
      {
        id: STYLE_PAGE,
        title: translate(lang, "styleTitle"),
        heading: translate(lang, "styleHeading"),
        subtitle: translate(lang, "styleSubtitle"),
        icon: "mdi:palette-outline",
        kind: "page",
        accent: "#c3b3ff",
      },
    ];
  });
  const current = createMemo<LayoutPage | undefined>(() => {
    const id = page();
    if (id === SETTINGS_PAGE) return pages()[0];
    return pages().find((p) => p.id === id) ?? pages()[0];
  });
  const settings = () => page() === SETTINGS_PAGE;
  const activeId = () => (settings() ? SETTINGS_PAGE : current()?.id ?? "");

  /** Climate entities drawn as air conditioners get the AC tile; thermostats keep the dial. */
  const isAc = (id: string) => {
    const e = props.hass()?.states[id];
    return visualFor(id, e, { name: displayName(id, e) }).art === "ac";
  };

  const tiles = stable<TileInstance[]>(
    () => {
      if (settings()) {
        return [
          { id: "about", type: "about", config: { source: layout()?.source ?? "auto", pages: pages().length } },
          { id: "roadmap", type: "roadmap", config: {} },
        ];
      }
      const p = current();
      if (p?.id === STYLE_PAGE) {
        const room = pages().find((x) => x.kind === "overview")?.rooms?.[0];
        return [
          { id: "style-gallery", type: "style-gallery", config: {} },
          { id: "style-glyphs", type: "style-glyphs", config: {} },
          ...(room ? [{ id: "style-room", type: "roomcard", config: { room } }] : []),
          { id: "style-devices", type: "style-devices", config: {} },
          { id: "style-chips", type: "style-chips", config: {} },
          { id: "style-feeds", type: "style-feeds", config: {} },
        ];
      }
      if (p && props.hass() && isSensorsPage(p.id, p.title)) return sensorTiles(props.hass()!, p, pickLang(props.hass()));
      if (p && props.hass() && isF1Page(p.id, p.title)) {
        return [...f1Tiles(props.hass()!, features()?.f1 ?? {}), ...tilesForPage({ ...p, sections: [] }, features())];
      }
      return p ? tilesForPage(p, features(), isAc) : [];
    },
    (list) =>
      `${activeId()}|${settings() ? "" : pageKey(current())}|${list.map((t) => `${t.id}${JSON.stringify(t.sizes ?? "")}`).join(",")}|${JSON.stringify(features() ?? null)}`,
  );

  const navigate = (id: string) => {
    setPage(id);
    scroller?.scrollTo({ top: 0, behavior: "smooth" });
    const prefix = props.route()?.prefix ?? (location.pathname.startsWith("/krystal") ? "/krystal" : undefined);
    if (prefix && !props.demo() && id !== SETTINGS_PAGE) {
      history.pushState(null, "", `${prefix}/${encodeURIComponent(id)}`);
      window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
    }
  };

  const condition = createMemo(() => {
    const h = props.hass();
    if (!h) return undefined;
    const id = layout()?.summary.weather;
    return (id ? h.states[id] : pickWeather(h))?.state;
  });

  return (
    <KrystalProvider
      value={{
        hass: props.hass,
        demo: props.demo,
        narrow: props.narrow,
        breakpoint,
        version: props.version,
        page: activeId,
        navigate,
        host: props.host,
      }}
    >
      <div class="k-app" ref={root} data-bp={breakpoint()}>
        <Wallpaper phase={phase()} condition={condition()} image={settings() ? undefined : current()?.image} />
        <Show when={props.hass() && layout() && current()} fallback={<div class="k-loading">Krystal</div>}>
          <div class="k-scroll" ref={scroller}>
            <Safe label="hero">
              <Hero page={current()!} summary={layout()?.summary ?? {}} now={now()} settings={settings()} features={features()} />
            </Safe>
            <main class="k-page">
              <TileGrid tiles={tiles()} />
            </main>
          </div>
          <Safe label="dock">
            <Dock pages={pages()} active={activeId()} onSelect={navigate} />
          </Safe>
        </Show>
      </div>
    </KrystalProvider>
  );
}
