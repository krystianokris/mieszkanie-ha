import { For } from "solid-js";

export type Phase = "night" | "dawn" | "day" | "dusk";

export function phaseOf(hour: number): Phase {
  if (hour >= 22 || hour < 5) return "night";
  if (hour < 8) return "dawn";
  if (hour < 17) return "day";
  return "dusk";
}

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface Building {
  x: number;
  w: number;
  h: number;
  lit: { x: number; y: number; warm: boolean }[];
}

function skyline(seed: number, count: number, minH: number, maxH: number, litChance: number): Building[] {
  const rand = rng(seed);
  const out: Building[] = [];
  let x = -20;
  for (let i = 0; i < count && x < 1640; i++) {
    const w = 38 + rand() * 70;
    const h = minH + rand() ** 1.6 * (maxH - minH);
    const lit: Building["lit"] = [];
    for (let wy = 14; wy < h - 10; wy += 13) {
      for (let wx = 7; wx < w - 7; wx += 11) {
        if (rand() < litChance) lit.push({ x: x + wx, y: 600 - h + wy, warm: rand() > 0.3 });
      }
    }
    out.push({ x, w, h, lit });
    x += w + rand() * 6;
  }
  return out;
}

const FAR = skyline(7, 60, 90, 300, 0.1);
const NEAR = skyline(31, 40, 60, 210, 0.16);

/** Ambient city backdrop: tint follows the time of day, haze/rain follow the weather. */
export function Wallpaper(props: { phase: Phase; condition?: string; image?: string }) {
  const weather = () => {
    const c = props.condition ?? "";
    if (["rainy", "pouring", "lightning-rainy", "snowy-rainy"].includes(c)) return "rain";
    if (["cloudy", "fog", "partlycloudy"].includes(c)) return "cloud";
    if (["snowy", "hail"].includes(c)) return "snow";
    return "clear";
  };
  return (
    <div class="k-wall" data-phase={props.phase} data-weather={weather()} aria-hidden="true">
      <div class="k-wall-sky" />
      <div class="k-wall-stars" />
      <svg class="k-wall-city far" viewBox="0 0 1600 600" preserveAspectRatio="xMidYMax slice">
        <For each={FAR}>{(b) => <rect x={b.x} y={600 - b.h} width={b.w} height={b.h} />}</For>
        <For each={FAR.flatMap((b) => b.lit)}>
          {(l) => <rect class={l.warm ? "w" : "c"} x={l.x} y={l.y} width="4" height="6" />}
        </For>
      </svg>
      <svg class="k-wall-city near" viewBox="0 0 1600 600" preserveAspectRatio="xMidYMax slice">
        <For each={NEAR}>{(b) => <rect x={b.x} y={600 - b.h} width={b.w} height={b.h} />}</For>
        <For each={NEAR.flatMap((b) => b.lit)}>
          {(l) => <rect class={l.warm ? "w" : "c"} x={l.x} y={l.y} width="5" height="7" />}
        </For>
      </svg>
      <div class="k-wall-glow" />
      <div class="k-wall-haze" />
      <div class="k-wall-rain" />
      <div
        class="k-wall-photo"
        classList={{ shown: !!props.image }}
        style={props.image ? { "background-image": `url("${props.image}")` } : undefined}
      />
      <div class="k-wall-vignette" />
    </div>
  );
}
