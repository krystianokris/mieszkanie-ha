import { For, Show } from "solid-js";
import { defineTile, domainOf, useHass, useMoreInfo, useService, useT, type TKey } from "../sdk";
import { art, levelOf, visualFor } from "../app/art";
import { displayName } from "../app/names";
import { Glyph } from "../app/Glyph";
import type { LayoutSection } from "../app/model";
import { Toggle } from "../app/parts";
import { isToggleable } from "../app/pick";
import { stateLabel } from "../app/states";
import { visualState } from "../app/visual-state";
import { Icon } from "../app/Icon";

/** A titled group of item wells: hero art for devices, tinted glyph wells for readings. */
export const PanelTile = defineTile<{ section: LayoutSection }>({
  type: "panel",
  sizes: { lg: { w: 6, h: 3 }, md: { w: 8, h: 3 }, sm: { w: 4, h: 4 } },
  component: (props) => {
    const hass = useHass();
    const call = useService();
    const moreInfo = useMoreInfo();
    const t = useT();
    const section = () => props.config.section;
    return (
      <article class="k-tile k-panel" style={{ "--accent": section().accent ?? "#8cdbff" }}>
        <header class="k-panel-head">
          <div>
            <Show when={section().kicker}>
              <span class="k-panel-kicker">{section().kicker}</span>
            </Show>
            <h3>{section().title}</h3>
          </div>
          <Show when={section().icon}>
            <span class="k-panel-icon">
              <Icon icon={section().icon} />
            </span>
          </Show>
        </header>
        <div class="k-panel-grid">
          <For each={section().items}>
            {(item) => {
              const e = () => hass()?.states[item.entity];
              const name = () => displayName(item.entity, e(), item.name);
              const visual = () => visualFor(item.entity, e(), { ...item, name: item.name });
              const level = () => levelOf(item.entity, e(), item.name);
              const canToggle = () => item.action === "toggle" && !!e() && isToggleable(e()!);
              const activate = () =>
                canToggle() ? call(domainOf(item.entity), "toggle", { entity_id: item.entity }) : moreInfo(item.entity);
              return (
                <div
                  class="k-well k-item"
                  data-state={visualState(e())}
                  data-level={level() ? "" : undefined}
                  style={level() ? { "--level": level()!.color } : undefined}
                  role="button"
                  tabindex="0"
                  onClick={activate}
                  onKeyDown={(ev) => (ev.key === "Enter" || ev.key === " ") && (ev.preventDefault(), activate())}
                >
                  <span class="k-item-art">
                    <Show when={visual().art} fallback={<Glyph icon={visual().glyph} category={visual().category} />}>
                      <img src={art[visual().art!]} alt="" draggable={false} />
                    </Show>
                  </span>
                  <span class="k-item-copy">
                    <small>{name()}</small>
                    <b>
                      <Show
                        when={level()?.word && domainOf(item.entity) === "sensor"}
                        fallback={stateLabel(t, e(), hass())}
                      >
                        <Show when={Number.isFinite(Number(e()?.state))}>{stateLabel(t, e(), hass())} · </Show>
                        <em class="k-level-word">{t(level()!.word as TKey)}</em>
                      </Show>
                    </b>
                  </span>
                  <Show when={canToggle()}>
                    <Toggle on={e()?.state === "on"} label={name()} onToggle={activate} />
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
