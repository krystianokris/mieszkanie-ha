import { createMemo, createSignal, For, Index, Show } from "solid-js";
import { defineTile, domainOf, fmt, isUnavailable, num, slug, useEntity, useHass, useService, useT, type HassEntity } from "../sdk";
import { art } from "../app/art";
import { Glyph } from "../app/Glyph";
import { cleanName, displayName } from "../app/names";
import { useOptimisticChoice, useOptimisticTarget } from "../app/optimistic";
import { Toggle } from "../app/parts";

/** climate.* feature bits (homeassistant.components.climate.ClimateEntityFeature). */
const FEATURE = { target: 1, fan: 8, preset: 16, swing: 32, swingH: 512 };

type Mode = "off" | "heat" | "cool" | "heat_cool" | "auto" | "dry" | "fan_only";

export const MODE_GLYPH: Record<string, string> = {
  off: "mdi:power",
  // A sun reads as "heat" at chip size; mdi:fire renders like a droplet next to mdi:water-percent.
  heat: "mdi:white-balance-sunny",
  cool: "mdi:snowflake",
  heat_cool: "mdi:sun-snowflake-variant",
  auto: "mdi:thermostat-auto",
  dry: "mdi:water-percent",
  fan_only: "mdi:fan",
};

/** Mode accents: amber heat, ice cool, teal dry; the tile edge, ring and art glow use it. */
export const MODE_TONE: Record<string, string> = {
  off: "#8a98aa",
  heat: "#ffae62",
  cool: "#5fdbff",
  heat_cool: "#b9a6ff",
  auto: "#b9a6ff",
  dry: "#4fe0c8",
  fan_only: "#a8d4f0",
};

const COPY: Record<string, Record<string, string>> = {
  pl: {
    off: "Wył.", heat: "Grzanie", cool: "Chłodzenie", heat_cool: "Auto", auto: "Auto", dry: "Osuszanie", fan_only: "Wentylator",
    heating: "Grzeje", cooling: "Chłodzi", drying: "Osusza", fan: "Wentyluje", idle: "Bezczynny", offState: "Wyłączony",
    holding: "Utrzymuje", above: "Powyżej celu", below: "Poniżej celu", now: "Teraz", target: "Cel", settings: "Ustawienia", close: "Zamknij",
    fanModes: "Wentylator", swing: "Klapa pion", swingH: "Klapa poziom", presets: "Presety", extras: "Dodatki",
    mode: "Tryb", unavailable: "Niedostępny",
  },
  en: {
    off: "Off", heat: "Heat", cool: "Cool", heat_cool: "Auto", auto: "Auto", dry: "Dry", fan_only: "Fan",
    heating: "Heating", cooling: "Cooling", drying: "Drying", fan: "Fan running", idle: "Idle", offState: "Off",
    holding: "Holding", above: "Above target", below: "Below target", now: "Now", target: "Target", settings: "Settings", close: "Close",
    fanModes: "Fan", swing: "Vertical swing", swingH: "Horizontal swing", presets: "Presets", extras: "Extras",
    mode: "Mode", unavailable: "Unavailable",
  },
};

/** Option labels across Gree, Tuya, Midea, Daikin… (fan speeds, louvre positions, presets). */
const OPTION_PL: Record<string, string> = {
  auto: "Auto", low: "Niski", "medium low": "Średnio-niski", medium_low: "Średnio-niski", medium: "Średni", "medium high": "Średnio-wysoki",
  medium_high: "Średnio-wysoki", high: "Wysoki", quiet: "Cichy", silent: "Cichy", turbo: "Turbo", strong: "Mocny", middle: "Średni",
  on: "Wł.", off: "Wył.", default: "Domyślnie", full_swing: "Pełny ruch", both: "Oba", vertical: "Pion", horizontal: "Poziom",
  fixed_upper: "Stała · góra", fixed_upper_middle: "Stała · góra-środek", fixed_middle: "Stała · środek", fixed_lower_middle: "Stała · dół-środek",
  fixed_lower: "Stała · dół", swing_upper: "Ruch · góra", swing_upper_middle: "Ruch · góra-środek", swing_middle: "Ruch · środek",
  swing_lower_middle: "Ruch · dół-środek", swing_lower: "Ruch · dół", left: "Lewo", left_center: "Lewo-środek", center: "Środek",
  right_center: "Prawo-środek", right: "Prawo", eco: "Eko", away: "Poza domem", boost: "Boost", none: "Brak", sleep: "Sen",
  comfort: "Komfort", home: "Dom", activity: "Aktywność", frost: "Przeciwmrozowy",
};

/** Device switches (Gree, Tuya, Midea) and their Polish names. */
const EXTRA_PL: [RegExp, string][] = [
  [/panel[\s_]*light|display|wyswietl|light|led/, "Podświetlenie panelu"],
  [/quiet|silent|cichy/, "Tryb cichy"],
  [/fresh[\s_]*air/, "Świeże powietrze"],
  [/x[\s_-]*fan|xfan|dry[\s_]*clean/, "X-Fan (suszenie wymiennika)"],
  [/health|anion|ionizer|jonizator/, "Jonizator"],
  [/sleep|sen/, "Tryb nocny"],
  [/turbo|powerful|boost/, "Turbo"],
  [/beep|buzzer|sound|dzwiek/, "Dźwięk"],
  [/eco/, "Eko"],
  [/anti[\s_]*mildew|mildew|self[\s_]*clean/, "Samoczyszczenie"],
];

function optionLabel(lang: string, v: string): string {
  if (lang !== "pl") return v.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
  return OPTION_PL[v.toLowerCase()] ?? v.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}

function extraLabel(lang: string, e: HassEntity, prefixes: string[]): string {
  const raw = slug(String(e.attributes.friendly_name ?? e.entity_id.split(".")[1]));
  let rest = raw;
  for (const p of prefixes) if (p && rest.startsWith(p)) rest = rest.slice(p.length).replace(/^_/, "");
  if (lang === "pl") for (const [re, label] of EXTRA_PL) if (re.test(rest)) return label;
  return cleanName(rest || raw);
}

interface AcConfig {
  entity: string;
  /** Related switches/selects of the same device (layout.json features.climateExtras). */
  extras?: string[];
}

/*
 * Buttons use native `on:click` listeners (not Solid's document-level delegation):
 * Home Assistant's mobile layout can stop click propagation before it reaches document.
 */
export const AcTile = defineTile<AcConfig>({
  type: "ac",
  sizes: { lg: { w: 8, h: 5 }, md: { w: 8, h: 5 }, sm: { w: 4, h: 9 } },
  component: (props) => {
    const e = useEntity(() => props.config.entity);
    const hass = useHass();
    const call = useService();
    const t = useT();
    const lang = () => (t.lang() === "pl" ? "pl" : "en");
    const tr = (k: string) => COPY[lang()][k] ?? COPY.en[k] ?? k;
    const [sheet, setSheet] = createSignal(false);

    const a = () => e()?.attributes ?? {};
    const features = () => Number(a().supported_features ?? 0);
    const supports = (bit: number, list: unknown) => (features() & bit) !== 0 && Array.isArray(list) && list.length > 0;
    const choice = useOptimisticChoice(() => ({
      hvac_mode: e()?.state,
      fan_mode: a().fan_mode,
      swing_mode: a().swing_mode,
      swing_horizontal_mode: a().swing_horizontal_mode,
      preset_mode: a().preset_mode,
    }));
    /** The mode the user picked (shown at once); status below still follows the entity. */
    const mode = () => String(choice.shown("hvac_mode") ?? "off") as Mode;
    const modes = () => ((a().hvac_modes as string[] | undefined) ?? []).filter((m) => m in MODE_GLYPH);
    const step = () => num(a().target_temp_step) ?? 1;
    const targetCtl = useOptimisticTarget({
      value: () => num(a().temperature),
      min: () => num(a().min_temp) ?? 16,
      max: () => num(a().max_temp) ?? 31,
      step,
      commit: (v) => call("climate", "set_temperature", { entity_id: props.config.entity, temperature: v }),
    });
    const target = () => targetCtl.shown();
    const current = () => num(a().current_temperature);
    const tone = () => MODE_TONE[mode()] ?? MODE_TONE.off;
    const off = () => mode() === "off" || isUnavailable(e());

    /** hvac_action when the integration reports it; otherwise derived from the entity's mode and temperatures. */
    const status = createMemo(() => {
      if (isUnavailable(e())) return { text: tr("unavailable"), active: false };
      const action = a().hvac_action as string | undefined;
      if (action) {
        const key = action === "off" ? "offState" : action;
        return { text: tr(key), active: action === "heating" || action === "cooling" || action === "drying" };
      }
      const state = String(e()?.state ?? "off");
      if (state === "off") return { text: tr("offState"), active: false };
      const cur = current();
      const tgt = num(a().temperature);
      if (state === "heat" && cur !== undefined && tgt !== undefined) return cur < tgt - 0.3 ? { text: tr("heating"), active: true } : { text: tr(cur > tgt + 0.5 ? "above" : "holding"), active: false };
      if (state === "cool" && cur !== undefined && tgt !== undefined) return cur > tgt + 0.3 ? { text: tr("cooling"), active: true } : { text: tr(cur < tgt - 0.5 ? "below" : "holding"), active: false };
      if (state === "dry") return { text: tr("drying"), active: true };
      if (state === "fan_only") return { text: tr("fan"), active: true };
      return { text: tr(state), active: false };
    });

    const nudge = (dir: 1 | -1) => targetCtl.nudge(dir);
    const set = (service: string, field: string, value: string) =>
      choice.choose(field, value, () => call("climate", service, { entity_id: props.config.entity, [field]: value }));

    const groups = () =>
      [
        { key: "fanModes", list: a().fan_modes, value: choice.shown("fan_mode"), ok: supports(FEATURE.fan, a().fan_modes), service: "set_fan_mode", field: "fan_mode" },
        { key: "swing", list: a().swing_modes, value: choice.shown("swing_mode"), ok: supports(FEATURE.swing, a().swing_modes), service: "set_swing_mode", field: "swing_mode" },
        {
          key: "swingH",
          list: a().swing_horizontal_modes,
          value: choice.shown("swing_horizontal_mode"),
          ok: supports(FEATURE.swingH, a().swing_horizontal_modes) || (Array.isArray(a().swing_horizontal_modes) && a().swing_horizontal_modes.length > 0),
          service: "set_swing_horizontal_mode",
          field: "swing_horizontal_mode",
        },
        { key: "presets", list: a().preset_modes, value: choice.shown("preset_mode"), ok: supports(FEATURE.preset, a().preset_modes), service: "set_preset_mode", field: "preset_mode" },
      ].filter((g) => g.ok) as { key: string; list: string[]; value?: string; service: string; field: string }[];

    /** Layout-bound extras plus switches/selects sharing the climate's object id or name prefix. */
    const prefixes = () => [props.config.entity.split(".")[1], slug(String(a().friendly_name ?? ""))].filter(Boolean);
    const extras = createMemo(() => {
      const states = hass()?.states ?? {};
      const ids = new Set(props.config.extras ?? []);
      for (const id of Object.keys(states)) {
        const [domain, obj] = id.split(".");
        if (!["switch", "select"].includes(domain)) continue;
        if (prefixes().some((p) => p.length > 3 && obj.startsWith(`${p}_`))) ids.add(id);
      }
      return [...ids].map((id) => states[id]).filter((x): x is HassEntity => !!x && !isUnavailable(x));
    });

    /** Stable keys for <For>: hass sends new objects every update, which would recreate the buttons. */
    const groupKeys = createMemo(() => groups().map((g) => g.key).join(","), "", { equals: (x, y) => x === y });
    const groupKeysList = () => (groupKeys() ? groupKeys().split(",") : []);
    const extraIdsKey = createMemo(() => extras().map((x) => x.entity_id).join(","), "", { equals: (x, y) => x === y });
    const extraIds = () => (extraIdsKey() ? extraIdsKey().split(",") : []);

    const chips = () =>
      groups()
        .filter((g) => g.value !== undefined && g.value !== null && g.value !== "")
        .map((g) => ({ label: tr(g.key), value: optionLabel(lang(), String(g.value)) }));

    return (
      <article
        class="k-tile k-ac"
        classList={{ off: off(), active: status().active }}
        data-mode={mode()}
        style={{ "--mode": tone() }}
      >
        <header class="k-ac-head">
          <div>
            <span class="k-kicker">{displayName(props.config.entity, e())}</span>
            <h3 class="k-ac-status">{status().text}</h3>
            <span class="k-ac-temps">
              {fmt(current(), 1, t.lang())}° <i>→</i> <b>{off() ? "—" : `${fmt(target(), step() < 1 ? 1 : 0, t.lang())}°`}</b>
            </span>
          </div>
          <button type="button" class="k-btn k-ac-gear" aria-label={tr("settings")} on:click={() => setSheet(true)}>
            <Glyph icon="mdi:tune-variant" category="climate" size="sm" />
            <span>{tr("settings")}</span>
          </button>
        </header>

        <div class="k-ac-body">
          <div class="k-ac-hero">
            <span class="k-ac-ring" />
            <img src={art.ac} alt="" draggable={false} />
          </div>
          <div class="k-ac-side">
            <div class="k-well k-metric">
              <span>{tr("now")}</span>
              <strong>{fmt(current(), 1, t.lang())}°</strong>
            </div>
            <div class="k-well k-metric k-ac-target">
              <span>{tr("target")}</span>
              <strong>{off() ? tr("off") : `${fmt(target(), step() < 1 ? 1 : 0, t.lang())}°`}</strong>
              <div class="k-steppers">
                <button type="button" class="k-btn" aria-label="−" disabled={off()} on:click={() => nudge(-1)}>
                  −
                </button>
                <button type="button" class="k-btn" aria-label="+" disabled={off()} on:click={() => nudge(1)}>
                  +
                </button>
              </div>
            </div>
            <Show when={chips().length}>
              <div class="k-ac-chips">
                <Index each={chips()}>
                  {(c) => (
                    <span class="k-ac-chip">
                      <small>{c().label}</small>
                      {c().value}
                    </span>
                  )}
                </Index>
              </div>
            </Show>
          </div>
        </div>

        <div class="k-ac-modes" role="radiogroup" aria-label={tr("mode")} style={{ "--n": String(Math.max(1, modes().length)) }}>
          <For each={modes()}>
            {(m) => (
              <button
                type="button"
                role="radio"
                aria-checked={mode() === m}
                class="k-ac-mode"
                classList={{ selected: mode() === m }}
                style={{ "--tone": MODE_TONE[m] }}
                disabled={isUnavailable(e())}
                on:click={() => set("set_hvac_mode", "hvac_mode", m)}
              >
                <span class="k-ac-mode-well">
                  <Glyph icon={MODE_GLYPH[m]} category="climate" size="xs" accent={MODE_TONE[m]} />
                </span>
                {tr(m)}
              </button>
            )}
          </For>
        </div>

        <Show when={sheet()}>
          <div class="k-ac-sheet">
            <header>
              <b>{tr("settings")}</b>
              <button type="button" class="k-btn" on:click={() => setSheet(false)}>
                {tr("close")}
              </button>
            </header>
            <div class="k-ac-sheet-body">
              <For each={groupKeysList()}>
                {(key) => {
                  const g = () => groups().find((x) => x.key === key)!;
                  const options = createMemo(() => (g()?.list ?? []).join("\u0000"), "", { equals: (a, b) => a === b });
                  return (
                    <Show when={g()}>
                      <section>
                        <span class="k-f1-label">{tr(key)}</span>
                        <div class="k-ac-options">
                          <For each={options() ? options().split("\u0000") : []}>
                            {(v) => (
                              <button
                                type="button"
                                class="k-ac-option"
                                classList={{ selected: String(g()?.value) === v }}
                                on:click={() => set(g().service, g().field, v)}
                              >
                                {optionLabel(lang(), v)}
                              </button>
                            )}
                          </For>
                        </div>
                      </section>
                    </Show>
                  );
                }}
              </For>
              <Show when={extras().length}>
                <section>
                  <span class="k-f1-label">{tr("extras")}</span>
                  <div class="k-ac-extras">
                    <For each={extraIds()}>
                      {(id) => {
                        const x = () => hass()!.states[id];
                        return (
                          <Show when={x()}>
                            <div class="k-well k-ac-extra">
                              <span>{extraLabel(lang(), x(), prefixes())}</span>
                              <Show
                                when={domainOf(id) === "switch"}
                                fallback={
                                  <select value={x().state} onChange={(ev) => call("select", "select_option", { entity_id: id, option: ev.currentTarget.value })}>
                                    <For each={(x().attributes.options as string[] | undefined) ?? []}>{(o) => <option value={o}>{optionLabel(lang(), o)}</option>}</For>
                                  </select>
                                }
                              >
                                <Toggle on={x().state === "on"} label={extraLabel(lang(), x(), prefixes())} onToggle={() => call("switch", "toggle", { entity_id: id })} />
                              </Show>
                            </div>
                          </Show>
                        );
                      }}
                    </For>
                  </div>
                </section>
              </Show>
            </div>
          </div>
        </Show>
      </article>
    );
  },
});
