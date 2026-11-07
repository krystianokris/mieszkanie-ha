import { For } from "solid-js";
import { defineTile, useHass, useKrystal, useT, type TKey } from "../sdk";
import { Kicker } from "../app/parts";

export const AboutTile = defineTile<{ source: string; pages: number }>({
  type: "about",
  sizes: { lg: { w: 6, h: 4 }, md: { w: 8, h: 4 }, sm: { w: 4, h: 5 } },
  component: (props) => {
    const hass = useHass();
    const { demo, version } = useKrystal();
    const t = useT();
    const facts: [TKey, () => string][] = [
      ["version", () => version()],
      ["mode", () => (demo() ? t("demo") : t("live"))],
      ["language", () => t.lang().toUpperCase()],
      ["entities", () => String(Object.keys(hass()?.states ?? {}).length)],
      ["layoutSource", () => (props.config.source === "auto" ? t("layoutAuto") : `${t("layoutFile")} · ${props.config.pages}`)],
    ];
    return (
      <article class="k-tile k-about">
        <Kicker>{t("settings")}</Kicker>
        <h3 class="k-room-name">{t("aboutTitle")}</h3>
        <p class="k-sub">{t("aboutLead")}</p>
        <div class="k-facts">
          <For each={facts}>
            {([key, value]) => (
              <div class="k-well k-metric sm">
                <span>{t(key)}</span>
                <strong>{value()}</strong>
              </div>
            )}
          </For>
        </div>
      </article>
    );
  },
});

export const RoadmapTile = defineTile<Record<string, never>>({
  type: "roadmap",
  sizes: { lg: { w: 6, h: 4 }, md: { w: 8, h: 3 }, sm: { w: 4, h: 4 } },
  component: () => {
    const t = useT();
    const items: TKey[] = ["next1", "next2", "next3", "next4"];
    return (
      <article class="k-tile k-roadmap">
        <Kicker>{t("next")}</Kicker>
        <ul class="k-list">
          <For each={items}>
            {(key, i) => (
              <li class="k-row">
                <span class="k-thumb k-well">
                  <b class="k-step-no">{i() + 1}</b>
                </span>
                <span class="k-row-copy">
                  <b>{t(key)}</b>
                </span>
              </li>
            )}
          </For>
        </ul>
      </article>
    );
  },
});
