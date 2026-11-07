import { For } from "solid-js";
import { defineTile, useT } from "../sdk";
import { art, ART_CATALOG, CATEGORY } from "../app/art";
import { Glyph } from "../app/Glyph";
import { Toggle } from "../app/parts";

const name = (lang: string, e: { pl: string; en: string }) => (lang === "pl" ? e.pl : e.en);

function Header(props: { kicker: string; title: string; accent?: string }) {
  return (
    <header class="k-panel-head">
      <div>
        <span class="k-panel-kicker" style={{ color: props.accent ?? "#8cdbff" }}>
          {props.kicker}
        </span>
        <h3>{props.title}</h3>
      </div>
    </header>
  );
}


export const StyleGalleryTile = defineTile<Record<string, never>>({
  type: "style-gallery",
  sizes: { lg: { w: 12, h: 12 }, md: { w: 8, h: 17 }, sm: { w: 4, h: 42 } },
  component: () => {
    const t = useT();
    return (
      <article class="k-tile k-style">
        <Header kicker={t("styleKicker")} title={t("styleHeroArt")} />
        <p class="k-sub">{t("styleHeroHint")}</p>
        <div class="k-art-grid">
          <For each={ART_CATALOG}>
            {(entry) => (
              <figure class="k-art-card" style={{ "--accent": CATEGORY[entry.category].accent }}>
                <span class="k-well k-art-well">
                  <img src={art[entry.key]} alt="" draggable={false} loading="lazy" />
                </span>
                <figcaption>
                  <b>{name(t.lang(), entry)}</b>
                  <small>
                    <i />
                    {name(t.lang(), CATEGORY[entry.category])}
                    {entry.fresh ? ` · ${t("styleNew")}` : ""}
                  </small>
                </figcaption>
              </figure>
            )}
          </For>
        </div>
      </article>
    );
  },
});

export const StyleGlyphsTile = defineTile<Record<string, never>>({
  type: "style-glyphs",
  sizes: { lg: { w: 12, h: 4 }, md: { w: 8, h: 5 }, sm: { w: 4, h: 10 } },
  component: () => {
    const t = useT();
    return (
      <article class="k-tile k-style">
        <Header kicker={t("styleKicker")} title={t("styleGlyphs")} />
        <p class="k-sub">{t("styleGlyphHint")}</p>
        <div class="k-glyph-row">
          <For each={ART_CATALOG.filter((e, i, all) => all.findIndex((x) => x.glyph === e.glyph) === i)}>
            {(entry) => (
              <span class="k-glyph-item" title={name(t.lang(), entry)}>
                <Glyph icon={entry.glyph} category={entry.category} />
                <small>{name(t.lang(), entry)}</small>
              </span>
            )}
          </For>
        </div>
      </article>
    );
  },
});

/** Device tiles on and off with the new hero art. */
export const StyleDevicesTile = defineTile<Record<string, never>>({
  type: "style-devices",
  sizes: { lg: { w: 4, h: 3 }, md: { w: 4, h: 3 }, sm: { w: 4, h: 3 } },
  component: () => {
    const t = useT();
    const rows: { key: string; title: string; state: string; on: boolean }[] = [
      { key: "bulb", title: t("styleLamp"), state: t("on"), on: true },
      { key: "purifier", title: t("stylePurifier"), state: t("off"), on: false },
      { key: "speaker", title: t("styleSpeaker"), state: t("standby"), on: false },
    ];
    return (
      <article class="k-tile k-style">
        <Header kicker={t("styleSample")} title={t("styleDevices")} />
        <div class="k-style-devices">
          <For each={rows}>
            {(r) => (
              <div class="k-device" classList={{ on: r.on, off: !r.on }}>
                <span class="k-device-art">
                  <img src={art[r.key]} alt="" draggable={false} />
                </span>
                <span class="k-device-copy">
                  <b>{r.title}</b>
                  <small>{r.state}</small>
                </span>
                <Toggle on={r.on} label={r.title} onToggle={() => undefined} />
              </div>
            )}
          </For>
        </div>
      </article>
    );
  },
});

/** A sensor chip row: art thumbnail, name, state; alert tint only when something is wrong. */
export const StyleChipsTile = defineTile<Record<string, never>>({
  type: "style-chips",
  sizes: { lg: { w: 4, h: 3 }, md: { w: 4, h: 3 }, sm: { w: 4, h: 4 } },
  component: () => {
    const t = useT();
    const chips: { key: string; title: string; state: string; alert?: boolean }[] = [
      { key: "window", title: t("styleWindow"), state: t("closed") },
      { key: "leak", title: t("styleLeak"), state: t("dry") },
      { key: "motion", title: t("styleMotion"), state: t("present") },
      { key: "smoke", title: t("styleSmoke"), state: t("detected"), alert: true },
    ];
    return (
      <article class="k-tile k-style">
        <Header kicker={t("styleSample")} title={t("styleChips")} accent="#4be39a" />
        <div class="k-style-chips">
          <For each={chips}>
            {(c) => (
              <div class="k-well k-item" classList={{ alert: !!c.alert }}>
                <span class="k-item-art">
                  <img src={art[c.key]} alt="" draggable={false} />
                </span>
                <span class="k-item-copy">
                  <small>{c.title}</small>
                  <b>{c.state}</b>
                </span>
              </div>
            )}
          </For>
        </div>
      </article>
    );
  },
});

/** Energy feeds with hero art in the corner instead of a flat glyph. */
export const StyleFeedsTile = defineTile<Record<string, never>>({
  type: "style-feeds",
  sizes: { lg: { w: 12, h: 2 }, md: { w: 8, h: 2 }, sm: { w: 4, h: 5 } },
  component: () => {
    const t = useT();
    const feeds: { key: string; type: string; label: string; value: string; detail: string }[] = [
      { key: "bolt", type: "electric", label: t("nxElectric"), value: "818 W", detail: t("nxPriceNow", { v: "14,4" }) },
      { key: "watermeter", type: "water", label: t("nxWater"), value: "162 L", detail: `${t("nxYesterday")} · £0,45` },
      { key: "flame", type: "gas", label: t("nxGas"), value: "24,3 kWh", detail: `£2,16 ${t("nxToday")}` },
    ];
    return (
      <article class="k-tile k-style">
        <div class="k-style-feeds k-nexus">
          <For each={feeds}>
            {(f) => (
              <article class={`k-nx-feed ${f.type} k-style-feed`}>
                <img class="k-style-feed-art" src={art[f.key]} alt="" draggable={false} />
                <small>{f.label}</small>
                <strong>{f.value}</strong>
                <em>{f.detail}</em>
              </article>
            )}
          </For>
        </div>
      </article>
    );
  },
});
