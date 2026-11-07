import { createSignal, Match, Show, Switch, type JSX } from "solid-js";

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "ha-icon": { icon?: string; class?: string };
    }
  }
}

function Svg(props: { children: JSX.Element }) {
  return (
    <svg class="k-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      {props.children}
    </svg>
  );
}

const has = (name: string, ...words: string[]) => words.some((w) => name.includes(w));

/** Hand-drawn stand-ins used only outside Home Assistant (demo, screenshots). */
function Fallback(props: { name: string }) {
  const n = () => props.name;
  return (
    <Switch fallback={<Svg><circle cx="12" cy="12" r="6.5" /><circle cx="12" cy="12" r="1.6" /></Svg>}>
      <Match when={has(n(), "view-dashboard", "view-grid")}>
        <Svg><rect x="4" y="4" width="7" height="9" rx="2" /><rect x="13" y="4" width="7" height="5" rx="2" /><rect x="4" y="15" width="7" height="5" rx="2" /><rect x="13" y="11" width="7" height="9" rx="2" /></Svg>
      </Match>
      <Match when={has(n(), "sofa")}>
        <Svg><path d="M5 11V8.5A2.5 2.5 0 0 1 7.5 6h9A2.5 2.5 0 0 1 19 8.5V11" /><path d="M3.5 12.5a1.8 1.8 0 0 1 3.5-.5v2h10v-2a1.8 1.8 0 0 1 3.5.5V17H3.5z" /><path d="M6 17v2M18 17v2" /></Svg>
      </Match>
      <Match when={has(n(), "countertop", "kitchen", "stove", "pot")}>
        <Svg><path d="M4 10h16" /><path d="M6 10v8.5h12V10" /><path d="M9 6.5c0-1 .8-2 2-2h2c1.2 0 2 1 2 2V10H9z" /><path d="M10 14h4" /></Svg>
      </Match>
      <Match when={has(n(), "bed")}>
        <Svg><path d="M3.5 18V7" /><path d="M3.5 13h17v5" /><path d="M20.5 13v-1.5A2.5 2.5 0 0 0 18 9h-6.5v4" /><circle cx="7.5" cy="10.5" r="1.8" /></Svg>
      </Match>
      <Match when={has(n(), "teddy", "baby", "child", "human-child")}>
        <Svg><circle cx="12" cy="13" r="5.5" /><circle cx="7" cy="7.5" r="2" /><circle cx="17" cy="7.5" r="2" /><path d="M10 14.5c1.2 1 2.8 1 4 0" /><circle cx="10" cy="12" r=".6" /><circle cx="14" cy="12" r=".6" /></Svg>
      </Match>
      <Match when={has(n(), "shower", "bath")}>
        <Svg><path d="M6 20V8a4 4 0 0 1 8 0" /><path d="M11 9h6" /><path d="M12 12.5v.5M15 12.5v.5M18 12.5v.5M13.5 15.5v.5M16.5 15.5v.5" /></Svg>
      </Match>
      <Match when={has(n(), "washing", "tumble", "laundry")}>
        <Svg><rect x="5" y="3.5" width="14" height="17" rx="2.5" /><circle cx="12" cy="13" r="4" /><path d="M8 6.5h2" /></Svg>
      </Match>
      <Match when={has(n(), "lightning", "flash", "bolt", "power-plug")}>
        <Svg><path d="M13 3 6 13.5h5.5L10.5 21 18 10h-5.5z" /></Svg>
      </Match>
      <Match when={has(n(), "lightbulb", "ceiling-light", "lamp", "led")}>
        <Svg><path d="M9 17.5h6M10 20.5h4" /><path d="M8.5 14.5A5.5 5.5 0 1 1 15.5 14.5c-.8.7-1 1.6-1 3h-5c0-1.4-.2-2.3-1-3z" /></Svg>
      </Match>
      <Match when={has(n(), "shield", "alarm", "security")}>
        <Svg><path d="M12 3.5 5 6v5.5c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9V6z" /><path d="m9 12 2.2 2.2L15.5 10" /></Svg>
      </Match>
      <Match when={has(n(), "weather", "cloud")}>
        <Svg><path d="M7.5 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17.5 9a4.5 4.5 0 0 1 0 9z" /></Svg>
      </Match>
      <Match when={has(n(), "music", "speaker", "television", "cast", "play")}>
        <Svg><path d="M9 18V6l10-2v12" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="16.5" cy="16" r="2.5" /></Svg>
      </Match>
      <Match when={has(n(), "flag")}>
        <Svg><path d="M5 21V4" /><path d="M5 4.5h12l-2.5 4 2.5 4H5" /></Svg>
      </Match>
      <Match when={has(n(), "sunny", "white-balance")}>
        <Svg><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" /></Svg>
      </Match>
      <Match when={has(n(), "thermometer", "thermostat", "heat")}>
        <Svg><path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z" /><path d="M12 9v7" /></Svg>
      </Match>
      <Match when={has(n(), "cog", "tune", "settings")}>
        <Svg><path d="M5 7h9M18 7h1M5 17h1M10 17h9" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></Svg>
      </Match>
      <Match when={has(n(), "door", "garage", "stairs", "toilet", "home")}>
        <Svg><path d="M6 20.5V4.5h12v16" /><path d="M4 20.5h16" /><circle cx="14.5" cy="12.5" r=".8" /></Svg>
      </Match>
      <Match when={has(n(), "air", "fan", "filter", "molecule")}>
        <Svg><circle cx="12" cy="12" r="1.8" /><path d="M12 10.2C11 6 13 3.5 15.5 4.5S16 9.5 12 10.2zM13.8 12c4.2-1 6.7 1 5.7 3.5s-5 .5-5.7-3.5zM10.2 12c-4.2 1-6.7-1-5.7-3.5s5-.5 5.7 3.5zM12 13.8c1 4.2-1 6.7-3.5 5.7s-.5-5 3.5-5.7z" /></Svg>
      </Match>
      <Match when={has(n(), "palette")}>
        <Svg><path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.2 0 1.8-.8 1.6-1.8-.3-1.3.6-2.2 1.9-2.2H17a3.5 3.5 0 0 0 3.5-3.5c0-5.2-3.8-9.5-8.5-9.5z" /><circle cx="8" cy="11" r="1.1" /><circle cx="11" cy="7.5" r="1.1" /><circle cx="15.5" cy="8.5" r="1.1" /></Svg>
      </Match>
      <Match when={has(n(), "window")}>
        <Svg><rect x="5" y="3.5" width="14" height="17" rx="1.5" /><path d="M12 3.5v17M5 12h14" /></Svg>
      </Match>
      <Match when={has(n(), "smoke")}>
        <Svg><circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="2.5" /><path d="M12 4.5v2M12 17.5v2" /></Svg>
      </Match>
      <Match when={has(n(), "motion", "cctv", "camera")}>
        <Svg><path d="M4 9.5 15 6l2 6-11 3.5z" /><path d="M17 9h3v3h-3" /><path d="M8 15.5V19H5" /></Svg>
      </Match>
      <Match when={has(n(), "radiator")}>
        <Svg><path d="M6 6v12M10 6v12M14 6v12M18 6v12" /><path d="M4 18h16M4 7h16" /></Svg>
      </Match>
      <Match when={has(n(), "recycle", "trash")}>
        <Svg><path d="M5.5 7h13M9 7V4.5h6V7" /><path d="M7 7l1 13h8l1-13" /><path d="M10.5 10.5v6M13.5 10.5v6" /></Svg>
      </Match>
      <Match when={has(n(), "leaf")}>
        <Svg><path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z" /><path d="M5 19 13 11" /></Svg>
      </Match>
      <Match when={has(n(), "fire", "flame")}>
        <Svg><path d="M12 21c-3.6 0-6-2.5-6-5.8 0-2.6 1.4-4.4 2.8-6 .2 1.6.9 2.7 2 3.3-.3-3.2.9-6 3.7-8.5.2 2.8 1.6 4.4 2.7 6 .9 1.3 1.8 2.8 1.8 5.2 0 3.3-2.4 5.8-7 5.8z" /><path d="M12 21c-1.6 0-2.7-1.1-2.7-2.6 0-1.4.9-2.4 2.2-3.6.4 1 1 1.6 1.8 1.9.1-.9.5-1.6 1.1-2.1.4 1 .8 1.8.8 2.9 0 2.1-1.4 3.5-3.2 3.5z" /></Svg>
      </Match>
      <Match when={has(n(), "snowflake")}>
        <Svg><path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" /><path d="M9.5 4.5 12 6l2.5-1.5M9.5 19.5 12 18l2.5 1.5" /></Svg>
      </Match>
      <Match when={has(n(), "power")}>
        <Svg><path d="M12 3.5v8" /><path d="M7.2 6.5a7 7 0 1 0 9.6 0" /></Svg>
      </Match>
      <Match when={has(n(), "water")}>
        <Svg><path d="M12 3.5c3.5 4.4 6 7.8 6 10.8a6 6 0 0 1-12 0c0-3 2.5-6.4 6-10.8z" /></Svg>
      </Match>
      <Match when={has(n(), "gas-station", "fuel")}>
        <Svg><path d="M5 20.5V5a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 14 5v15.5" /><path d="M3.5 20.5h12M7 7.5h5" /><path d="M14 10h2a1.5 1.5 0 0 1 1.5 1.5V16a1.3 1.3 0 0 0 2.5 0V8.5L17.5 6" /></Svg>
      </Match>
      <Match when={has(n(), "navigation", "directions")}>
        <Svg><path d="M12 3.5 19 20l-7-3.5L5 20z" /></Svg>
      </Match>
      <Match when={has(n(), "chart", "timeline")}>
        <Svg><path d="M4 20h16" /><path d="M7 17v-5M11 17V8M15 17v-3M19 17V6" /></Svg>
      </Match>
      <Match when={has(n(), "menu")}>
        <Svg><path d="M5 7h14M5 12h14M5 17h14" /></Svg>
      </Match>
    </Switch>
  );
}

/** MDI icon through Home Assistant's `<ha-icon>`, with a built-in fallback. */
export function Icon(props: { icon?: string }) {
  const name = () => props.icon ?? "mdi:circle-outline";
  return (
    <Show when={native()} fallback={<Fallback name={name()} />}>
      <ha-icon class="k-icon" icon={name()} />
    </Show>
  );
}

/** HA may register <ha-icon> after the panel first renders; switch to it once it exists. */
const hasRegistry = typeof customElements !== "undefined";
const [native, setNative] = createSignal(hasRegistry && !!customElements.get("ha-icon"));
if (hasRegistry && !native()) customElements.whenDefined("ha-icon").then(() => setNative(true));
