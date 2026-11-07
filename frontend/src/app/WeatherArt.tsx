import { Show } from "solid-js";

/** Volumetric CSS sun/moon/cloud composition for a weather condition. */
export function WeatherArt(props: { condition: string | undefined; night: boolean }) {
  const c = () => props.condition ?? "cloudy";
  const hasSun = () => ["sunny", "partlycloudy", "clear-night", "windy", "windy-variant"].includes(c());
  const hasCloud = () => c() !== "sunny" && c() !== "clear-night";
  const second = () => ["cloudy", "fog", "rainy", "pouring", "lightning", "lightning-rainy", "snowy", "snowy-rainy", "hail"].includes(c());
  const rain = () => ["rainy", "pouring", "lightning-rainy", "snowy-rainy"].includes(c());
  const snow = () => ["snowy", "snowy-rainy", "hail"].includes(c());
  return (
    <div class="k-wx-art" data-condition={c()} aria-hidden="true">
      <Show when={hasSun() || !hasCloud()}>
        <div class="k-orb" classList={{ moon: props.night || c() === "clear-night" }} />
      </Show>
      <Show when={second()}>
        <div class="k-cloud back" />
      </Show>
      <Show when={hasCloud()}>
        <div class="k-cloud" />
      </Show>
      <Show when={rain() || snow()}>
        <div class="k-drops" classList={{ snow: snow() && !rain() }}>
          <i />
          <i />
          <i />
          <i />
        </div>
      </Show>
    </div>
  );
}
