import { For, Show } from "solid-js";
import { defineTile, fmt, isUnavailable, num, useEntity, useService, useT, type TKey } from "../sdk";
import { art, visualFor } from "../app/art";
import { displayName } from "../app/names";
import { useOptimisticChoice, useOptimisticTarget } from "../app/optimistic";
import { Glyph } from "../app/Glyph";
import { MODE_GLYPH, MODE_TONE } from "./ac";
import { Kicker } from "../app/parts";

const MODE_LABEL: Record<string, TKey> = {
  off: "modeOff",
  heat: "modeHeat",
  cool: "modeCool",
  dry: "modeDry",
  fan_only: "modeFan",
  auto: "modeAuto",
  heat_cool: "modeAuto",
};

const ACTION_LABEL: Record<string, TKey> = {
  heating: "heating",
  cooling: "cooling",
  drying: "drying",
  fan: "fan",
  idle: "idle",
  off: "off",
};

export const ClimateTile = defineTile<{ entity: string }>({
  type: "climate",
  sizes: { lg: { w: 4, h: 3 }, md: { w: 4, h: 3 }, sm: { w: 4, h: 3 } },
  component: (props) => {
    const e = useEntity(() => props.config.entity);
    const call = useService();
    const t = useT();
    const step = () => num(e()?.attributes.target_temp_step) ?? 0.5;
    const targetCtl = useOptimisticTarget({
      value: () => num(e()?.attributes.temperature),
      min: () => num(e()?.attributes.min_temp) ?? 7,
      max: () => num(e()?.attributes.max_temp) ?? 35,
      step,
      commit: (v) => call("climate", "set_temperature", { entity_id: props.config.entity, temperature: v }),
    });
    const choice = useOptimisticChoice(() => ({ hvac_mode: e()?.state }));
    const target = () => targetCtl.shown();
    const current = () => num(e()?.attributes.current_temperature);
    const action = () => String(e()?.attributes.hvac_action ?? (e()?.state === "off" ? "off" : "idle"));
    const modes = () =>
      ((e()?.attributes.hvac_modes as string[] | undefined) ?? []).filter((m) => m in MODE_LABEL);
    const digits = () => (step() < 1 ? 1 : 0);
    const name = () => displayName(props.config.entity, e());
    const artKey = () => visualFor(props.config.entity, e(), { name: name() }).art ?? "dial";

    const nudge = (dir: 1 | -1) => targetCtl.nudge(dir);
    const mode = () => choice.shown("hvac_mode");

    return (
      <article class="k-tile k-climate" data-action={action()} classList={{ off: e()?.state === "off" }}>
        <header class="k-head">
          <Kicker>{t(ACTION_LABEL[action()] ?? "idle")}</Kicker>
          <h3>{name()}</h3>
        </header>
        <div class="k-climate-hero" data-art={artKey()}>
          <div class="k-dial">
            <img src={art[artKey()]} alt="" draggable={false} />
            <div class="k-dial-read">
              <b>{fmt(current(), 1, t.lang())}°</b>
              <span>{t("now")}</span>
            </div>
          </div>
        </div>
        <div class="k-side">
          <div class="k-well k-metric">
            <span>{t("target")}</span>
            <strong>
              <Show when={mode() !== "off"} fallback={t("modeOff")}>
                {fmt(target(), digits(), t.lang())}°
              </Show>
            </strong>
          </div>
          <div class="k-steppers">
            <button type="button" class="k-btn" aria-label="-" disabled={isUnavailable(e()) || mode() === "off"} on:click={() => nudge(-1)}>
              −
            </button>
            <button type="button" class="k-btn" aria-label="+" disabled={isUnavailable(e()) || mode() === "off"} on:click={() => nudge(1)}>
              +
            </button>
          </div>
        </div>
        <Show when={modes().length > 1}>
          <div class="k-seg">
            <For each={modes()}>
              {(m) => (
                <button
                  type="button"
                  classList={{ selected: mode() === m }}
                  on:click={() => choice.choose("hvac_mode", m, () => call("climate", "set_hvac_mode", { entity_id: props.config.entity, hvac_mode: m }))}
                >
                  <Show when={MODE_GLYPH[m]}>
                    <Glyph icon={MODE_GLYPH[m]} category="climate" size="xs" accent={MODE_TONE[m]} />
                  </Show>
                  {t(MODE_LABEL[m])}
                </button>
              )}
            </For>
          </div>
        </Show>
      </article>
    );
  },
});
