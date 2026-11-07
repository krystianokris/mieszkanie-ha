import { For, Show } from "solid-js";
import { fmt, isUnavailable, num, useHass, useT } from "../sdk";
import { Icon } from "../app/Icon";
import type { Mode, TwinHud } from "./model";

const WEATHER: Record<string, [string, string]> = {
  sunny: ["mdi:weather-sunny", "Słonecznie"],
  "clear-night": ["mdi:weather-night", "Bezchmurnie"],
  partlycloudy: ["mdi:weather-partly-cloudy", "Częściowe zachmurzenie"],
  cloudy: ["mdi:weather-cloudy", "Pochmurno"],
  fog: ["mdi:weather-fog", "Mgła"],
  rainy: ["mdi:weather-rainy", "Deszcz"],
  pouring: ["mdi:weather-pouring", "Ulewa"],
  snowy: ["mdi:weather-snowy", "Śnieg"],
  "snowy-rainy": ["mdi:weather-snowy-rainy", "Deszcz ze śniegiem"],
  windy: ["mdi:weather-windy", "Wietrznie"],
  "windy-variant": ["mdi:weather-windy-variant", "Wietrznie"],
  lightning: ["mdi:weather-lightning", "Burza"],
  "lightning-rainy": ["mdi:weather-lightning-rainy", "Burza"],
  hail: ["mdi:weather-hail", "Grad"],
  exceptional: ["mdi:alert-circle-outline", "Uwaga"],
};

export function Hud(props: { hud: TwinHud; now: Date; tod: "day" | "night"; alerts: number; open: number; phone: boolean }) {
  const hass = useHass();
  const t = useT();
  const weather = () => (props.hud.weather ? hass()?.states[props.hud.weather] : undefined);
  const power = () => {
    const e = props.hud.power ? hass()?.states[props.hud.power] : undefined;
    const v = num(e?.state);
    if (v === undefined) return undefined;
    return String(e?.attributes.unit_of_measurement ?? "W") === "kW" ? v * 1000 : v;
  };
  const cost = () => {
    const e = props.hud.cost ? hass()?.states[props.hud.cost] : undefined;
    return isUnavailable(e) ? undefined : num(e?.state);
  };
  const time = () => new Intl.DateTimeFormat("pl", { hour: "2-digit", minute: "2-digit" }).format(props.now);
  const date = () => new Intl.DateTimeFormat("pl", { weekday: "long", day: "numeric", month: "long" }).format(props.now);
  return (
    <header class="tw-hud">
      <div class="tw-hud-brand">
        <span class="tw-hud-kicker">Mieszkanie na żywo</span>
        <b class="tw-hud-time">{time()}</b>
        <Show when={!props.phone}>
          <span class="tw-hud-date">{date()}</span>
        </Show>
      </div>
      <div class="tw-hud-chips">
        <Show when={weather()}>
          <span class="tw-pill">
            <Icon icon={WEATHER[weather()!.state]?.[0] ?? "mdi:weather-partly-cloudy"} />
            <b>{fmt(num(weather()!.attributes.temperature), 0, t.lang())}°</b>
            <Show when={!props.phone}>
              <small>{WEATHER[weather()!.state]?.[1] ?? weather()!.state}</small>
            </Show>
          </span>
        </Show>
        <Show when={power() !== undefined}>
          <span class="tw-pill energy">
            <Icon icon="mdi:lightning-bolt" />
            <b>{fmt(power(), 0, t.lang())} W</b>
            <Show when={cost() !== undefined && !props.phone}>
              <small>£{fmt(cost(), 2, t.lang())} dziś</small>
            </Show>
          </span>
        </Show>
        <span class="tw-pill" classList={{ alert: props.alerts > 0, warn: props.alerts === 0 && props.open > 0 }}>
          <Icon icon={props.alerts ? "mdi:alert" : "mdi:shield-home-outline"} />
          <b>{props.alerts ? `${props.alerts} alarm` : props.open ? `${props.open} otwarte` : "Spokój"}</b>
        </span>
        <Show when={!props.phone}>
          <span class="tw-pill subtle">
            <Icon icon={props.tod === "day" ? "mdi:white-balance-sunny" : "mdi:weather-night"} />
            <small>{props.tod === "day" ? "Dzień" : "Noc"}</small>
          </span>
        </Show>
      </div>
    </header>
  );
}

const MODES: [Mode, string, string][] = [
  ["home", "Cały dom", "mdi:home-outline"],
  ["heat", "Mapa ciepła", "mdi:thermometer"],
  ["security", "Bezpieczeństwo", "mdi:shield-home-outline"],
  ["energy", "Energia", "mdi:lightning-bolt"],
];

export function ModeBar(props: { mode: Mode; onMode: (m: Mode) => void; style?: Record<string, string> }) {
  return (
    <nav class="tw-modes" style={props.style}>
      <For each={MODES}>
        {([m, label, icon]) => (
          <button type="button" class="tw-mode" classList={{ selected: props.mode === m }} on:click={() => props.onMode(m)}>
            <Icon icon={icon} />
            <span>{label}</span>
          </button>
        )}
      </For>
    </nav>
  );
}
