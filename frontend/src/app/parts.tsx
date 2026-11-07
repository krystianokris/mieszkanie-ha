import type { JSX } from "solid-js";
import { clamp } from "../sdk/format";

export function Ring(props: {
  value: number | undefined;
  min: number;
  max: number;
  size: number;
  tone?: "ice" | "warm" | "green";
  children: JSX.Element;
}) {
  const stroke = 7;
  const r = () => (props.size - stroke) / 2 - 3;
  const c = () => 2 * Math.PI * r();
  const frac = () => (props.value === undefined ? 0 : clamp((props.value - props.min) / (props.max - props.min), 0, 1));
  return (
    <div class="k-ring" data-tone={props.tone ?? "ice"} style={{ width: `${props.size}px`, height: `${props.size}px` }}>
      <svg viewBox={`0 0 ${props.size} ${props.size}`} aria-hidden="true">
        <defs>
          <linearGradient id="k-ring-ice" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#bff1ff" />
            <stop offset="0.5" stop-color="#5fdbff" />
            <stop offset="1" stop-color="#159dec" />
          </linearGradient>
          <linearGradient id="k-ring-warm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#ffe2a8" />
            <stop offset="1" stop-color="#f29a3c" />
          </linearGradient>
          <linearGradient id="k-ring-green" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#c9ffe3" />
            <stop offset="1" stop-color="#3fcf8e" />
          </linearGradient>
        </defs>
        <circle class="k-ring-track" cx={props.size / 2} cy={props.size / 2} r={r()} stroke-width={stroke} />
        <circle
          class="k-ring-fill"
          cx={props.size / 2}
          cy={props.size / 2}
          r={r()}
          stroke-width={stroke}
          stroke={`url(#k-ring-${props.tone ?? "ice"})`}
          stroke-dasharray={`${c()}`}
          stroke-dashoffset={`${c() * (1 - frac())}`}
          transform={`rotate(-90 ${props.size / 2} ${props.size / 2})`}
        />
      </svg>
      <div class="k-ring-label">{props.children}</div>
    </div>
  );
}

export function Toggle(props: { on: boolean; label: string; disabled?: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      class="k-toggle"
      classList={{ on: props.on }}
      role="switch"
      aria-checked={props.on}
      aria-label={props.label}
      disabled={props.disabled}
      on:click={(ev) => {
        ev.stopPropagation();
        props.onToggle();
      }}
    >
      <span />
    </button>
  );
}

export function Kicker(props: { children: JSX.Element }) {
  return <span class="k-kicker">{props.children}</span>;
}
