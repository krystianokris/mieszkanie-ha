import { createSignal, For, Show } from "solid-js";
import { defineTile, domainOf, fmt, isUnavailable, num, useHass, useMoreInfo, useService, useT } from "../sdk";
import { art, artLabel, visualFor } from "../app/art";
import { displayName } from "../app/names";
import { Glyph } from "../app/Glyph";
import type { LayoutItem } from "../app/model";
import { Toggle } from "../app/parts";
import { isToggleable } from "../app/pick";
import { stateLabel } from "../app/states";
import { visualState } from "../app/visual-state";

interface CanvasConfig {
  page: string;
  title: string;
  image?: string;
  devices: LayoutItem[];
  temperature?: string;
  humidity?: string;
}

/** The room's devices over its photo, like Luma's room canvas. */
export const CanvasTile = defineTile<CanvasConfig>({
  type: "canvas",
  sizes: { lg: { w: 12, h: 4 }, md: { w: 8, h: 5 }, sm: { w: 4, h: 7 } },
  component: (props) => {
    const hass = useHass();
    const call = useService();
    const moreInfo = useMoreInfo();
    const t = useT();
    const value = (id?: string) => (id ? num(hass()?.states[id]?.state) : undefined);
    const [broken, setBroken] = createSignal(false);
    return (
      <article class="k-tile k-canvas">
        <Show when={props.config.image && !broken()}>
          <img class="k-canvas-photo" src={props.config.image} alt="" draggable={false} onError={() => setBroken(true)} />
        </Show>
        <span class="k-canvas-shade" />
        <header class="k-canvas-head">
          <div>
            <span class="k-kicker">Krystal / {t("canvas")}</span>
            <h2>{props.config.title}</h2>
            <span class="k-canvas-metrics">
              <Show when={value(props.config.temperature) !== undefined}>
                <span>{fmt(value(props.config.temperature), 1, t.lang())} °C</span>
              </Show>
              <Show when={value(props.config.humidity) !== undefined}>
                <span>{fmt(value(props.config.humidity), 0, t.lang())}%</span>
              </Show>
            </span>
          </div>
          <span class="k-live">
            <i />
            {t("live")}
          </span>
        </header>
        <div class="k-canvas-grid">
          <For each={props.config.devices}>
            {(item) => {
              const e = () => hass()?.states[item.entity];
              const on = () => e()?.state === "on" || e()?.state === "playing";
              const canToggle = () => item.action === "toggle" && !!e() && isToggleable(e()!);
              const visual = () => visualFor(item.entity, e(), { ...item, name: item.name });
              const image = () => (visual().art ? art[visual().art!] : undefined);
              const name = () => {
                const n = displayName(item.entity, e(), item.name);
                return n.toLowerCase() === props.config.title.toLowerCase() ? artLabel(visual().art, t.lang()) ?? n : n;
              };
              const activate = () =>
                canToggle() ? call(domainOf(item.entity), "toggle", { entity_id: item.entity }) : moreInfo(item.entity);
              return (
                <div
                  class="k-device"
                  data-state={visualState(e())}
                  classList={{ on: on(), off: !on(), missing: isUnavailable(e()) }}
                  role="button"
                  tabindex="0"
                  onClick={activate}
                  onKeyDown={(ev) => (ev.key === "Enter" || ev.key === " ") && (ev.preventDefault(), activate())}
                >
                  <span class="k-device-art">
                    <Show when={image()} fallback={<Glyph icon={visual().glyph} category={visual().category} />}>
                      <img src={image()} alt="" draggable={false} />
                    </Show>
                  </span>
                  <span class="k-device-copy">
                    <b>{name()}</b>
                    <small>{stateLabel(t, e(), hass())}</small>
                  </span>
                  <Show when={canToggle()}>
                    <Toggle on={on()} label={name()} onToggle={activate} />
                  </Show>
                </div>
              );
            }}
          </For>
        </div>
      </article>
    );
  },
});
