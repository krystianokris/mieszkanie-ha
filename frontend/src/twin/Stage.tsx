import { createEffect, createMemo, createResource, createSignal, For, Show, type JSX } from "solid-js";
import { durationText, reasonText, uptimeOf } from "./uptime";
import { domainOf, fmt, num, useHass, useService, useT } from "../sdk";
import { staticBase } from "../app/art";
import { Icon } from "../app/Icon";
import { displayName } from "../app/names";
import type { Mode, TwinEntry, TwinRoom } from "./model";
import { clipPath, pct, ROOMS, SCENE_H, SCENE_W, svgPoints, type Point, type SceneRoom } from "./scene";
import { airflow, alarmOn, applianceRunning, ent, isOn, litCount, remainingText, roomTemp, sensorOffline, tempColor } from "./state";
import { consumers, lineWidth, METER, METER_SCALE_W, meterRadius, totalWatts, wire, type Consumer } from "./power";

export interface SceneBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface Zoom {
  tx: number;
  ty: number;
  s: number;
}

// Bump RENDERS when the renders change: the static path has no cache busting, so browsers keep old pictures.
const RENDERS = "2026-11-06";
const img = (name: string) => `${staticBase}twin/${name}.webp?v=${RENDERS}`;

/** Light hotspots sit on the room's glow points; extra lights fan out around the last one. */
function lightPoint(room: SceneRoom, i: number): Point {
  const g = room.glow;
  if (i < g.length) return g[i];
  const [x, y] = g[g.length - 1];
  const k = i - g.length + 1;
  return [x + 16 * k, y + 10 * (k % 2 ? 1 : -1)];
}

function anchorOf(room: SceneRoom, a?: string): Point | undefined {
  return a ? room.anchors[a] : undefined;
}

/** Entries sharing one anchor (two thermostats, two TVs) step down so their chips don't overlap. */
function stacked(room: SceneRoom, list: TwinEntry[], i: number): Point | undefined {
  const e = list[i];
  const at = anchorOf(room, e.anchor);
  if (!at) return undefined;
  const k = list.slice(0, i).filter((x) => x.anchor === e.anchor).length;
  return [at[0] + k * 6, at[1] + k * 22];
}

export function Stage(props: {
  rooms: Record<string, TwinRoom>;
  tod: "day" | "night";
  /** 0 = full day … 1 = full night (sun elevation). */
  dark: number;
  /** Whole-home demand sensor (HUD power), drives the speed of the energy flow. */
  power?: string;
  mode: Mode;
  selected?: string;
  box: SceneBox;
  zoom: Zoom;
  onRoom: (id: string | undefined) => void;
}) {
  const hass = useHass();
  const call = useService();
  const t = useT();
  const twin = (id: string): TwinRoom => props.rooms[id] ?? {};

  /** Energia: active consumers, and the one whose details card is open. */
  const live = createMemo(() => (props.mode === "energy" ? consumers(hass(), props.rooms) : []));
  const [picked, setPicked] = createSignal<string>();
  const pickedConsumer = () => live().find((c) => c.id === picked());
  createEffect(() => props.mode !== "energy" && setPicked(undefined));

  const clock = (iso?: string) => (iso ? new Intl.DateTimeFormat("pl", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso)) : "");
  /** The entity of a consumer that has been on the longest (by its, possibly re-stamped, last_changed). */
  const longestOn = (c: Consumer) =>
    c.entities
      .map((id) => ({ id, lc: ent(hass(), id)?.last_changed }))
      .filter((x): x is { id: string; lc: string } => !!x.lc && !sensorOffline(hass(), { entity: x.id }))
      .sort((a, b) => a.lc.localeCompare(b.lc))[0];
  const STATE_PL: Record<string, string> = { on: "włączone", off: "wyłączone", playing: "odtwarza", paused: "pauza", idle: "czuwa", heat: "grzanie", cool: "chłodzenie", dry: "osuszanie", fan_only: "wentylacja", auto: "auto", running: "pracuje", unavailable: "niedostępne" };
  const stateText = (id: string) => {
    const e = ent(hass(), id);
    if (!e) return "—";
    return STATE_PL[e.state] ?? hass()?.formatEntityState?.(e) ?? e.state;
  };

  const PowerCard = (p: { c: Consumer }) => {
    const room = () => ROOMS.find((r) => r.id === p.c.room)?.name ?? p.c.room;
    const climate = () => (p.c.kind === "heat" || p.c.kind === "cool" ? ent(hass(), p.c.entities[0]) : undefined);
    return (
      <div class={`tw-powercard ${p.c.kind}`} style={pct(p.c.at)} on:click={(ev: MouseEvent) => ev.stopPropagation()}>
        <header>
          <div>
            <small>{room()}</small>
            <b>{p.c.label}</b>
          </div>
          <button type="button" aria-label="Zamknij" on:click={() => setPicked(undefined)}>
            ✕
          </button>
        </header>
        <div class="tw-powercard-watts" classList={{ measured: p.c.watts !== undefined }}>
          <Show when={p.c.watts !== undefined} fallback={<><b>Brak pomiaru mocy</b><span>Linia pokazuje tylko, że urządzenie pracuje.</span></>}>
            <b>{fmt(p.c.watts, 0, t.lang())} W</b>
            <span>zmierzone</span>
          </Show>
        </div>
        <Show when={climate()}>
          {(e) => (
            <p>
              Temperatura {fmt(num(e().attributes.current_temperature), 1, t.lang())}° → {fmt(num(e().attributes.temperature), 1, t.lang())}°
            </p>
          )}
        </Show>
        <Show when={remainingText(ent(hass(), p.c.remaining))}>{(left) => <p>Do końca: {left()}</p>}</Show>
        <ul>
          <For each={p.c.entities}>
            {(id) => (
              <li>
                <span>{displayName(id, ent(hass(), id), p.c.names[id])}</span>
                <em>{stateText(id)}</em>
              </li>
            )}
          </For>
        </ul>
        {/* Keyed by a plain "entity|last_changed" string: the history check runs once per real change,
            not on every Home Assistant state update (that re-render made the card blink). */}
        <Show when={(() => { const f = longestOn(p.c); return f ? `${f.id}|${f.lc}` : undefined; })()} keyed>
          {(key) => {
            const [id, lc] = key.split("|");
            const first = { id, lc };
            // Only an off → on transition in the recorder makes the start time exact.
            const [up] = createResource(() => `${first.id}|${first.lc}`, () => uptimeOf(hass()!, first.id));
            const start = clock(first.lc);
            return (
              <small class="tw-powercard-since">
                <Show when={!up.loading} fallback={<>Włączone od {start} · sprawdzam historię…</>}>
                  <Show
                    when={up()?.kind === "exact"}
                    fallback={
                      <>
                        Włączone co najmniej od {start} (≥ {durationText(Date.now() - Date.parse(first.lc))})
                        <i>{reasonText[(up() as { reason: "restart" | "outage" | "history" } | undefined)?.reason ?? "history"]}</i>
                      </>
                    }
                  >
                    Włączone od {start} · {durationText(Date.now() - Date.parse(first.lc))}
                  </Show>
                </Show>
              </small>
            );
          }}
        </Show>
      </div>
    );
  };

  const toggle = (e: TwinEntry) => {
    const d = domainOf(e.entity);
    if (["light", "switch", "fan", "input_boolean"].includes(d)) void call(d, "toggle", { entity_id: e.entity });
  };

  const Hot = (p: { at: Point; icon: string; cls?: string; on?: boolean; label: string; onClick: () => void; children?: JSX.Element }) => (
    <button
      type="button"
      class={`tw-hot ${p.cls ?? ""}`}
      classList={{ on: !!p.on }}
      style={pct(p.at)}
      aria-label={p.label}
      title={p.label}
      on:click={(ev: MouseEvent) => {
        ev.stopPropagation();
        p.onClick();
      }}
    >
      <span class="tw-hot-dot">
        <Icon icon={p.icon} />
      </span>
      {p.children}
    </button>
  );

  return (
    <div
      class="tw-stage"
      on:click={() => {
        setPicked(undefined);
        props.onRoom(undefined);
      }}
    >
      <div
        class="tw-scene"
        classList={{ zoomed: !!props.selected }}
        style={{
          left: `${props.box.left}px`,
          top: `${props.box.top}px`,
          width: `${props.box.width}px`,
          height: `${props.box.height}px`,
          transform: `translate(${props.zoom.tx}px, ${props.zoom.ty}px) scale(${props.zoom.s})`,
          "--zoom": String(props.zoom.s),
          "--dark": String(props.dark),
        }}
      >
        {/* Living dusk: day render underneath, night render fades in with the sun; lit rooms glow in both. */}
        <img class="tw-base" src={img("day")} alt="" draggable={false} />
        <img class="tw-night" src={img("night")} alt="" draggable={false} style={{ opacity: String(props.dark) }} />
        <For each={ROOMS}>
          {(r) => <img class="tw-lit" classList={{ on: litCount(hass(), twin(r.id)) > 0 }} src={img("lit")} alt="" draggable={false} style={{ "clip-path": clipPath(r.poly) }} />}
        </For>
        <For each={ROOMS}>
          {(r) => <For each={r.glow}>{(g) => <span class="tw-daylight" classList={{ on: litCount(hass(), twin(r.id)) > 0 }} style={pct(g)} />}</For>}
        </For>

        <svg class="tw-svg" viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} preserveAspectRatio="none">
          <For each={ROOMS}>
            {(r) => {
              const temp = () => roomTemp(hass(), twin(r.id));
              return (
                <polygon
                  class="tw-room"
                  classList={{ selected: props.selected === r.id, heat: props.mode === "heat" && temp() !== undefined }}
                  points={svgPoints(r.poly)}
                  style={{ "--heat": temp() !== undefined ? tempColor(temp()!) : "transparent" }}
                  on:click={(ev: MouseEvent) => {
                    ev.stopPropagation();
                    props.onRoom(r.id);
                  }}
                />
              );
            }}
          </For>
          <For each={ROOMS}>
            {(r) => (
              <For each={twin(r.id).climate ?? []}>
                {(c) => {
                  const at = anchorOf(r, c.anchor === "ac" ? "ac" : undefined);
                  const flow = () => airflow(ent(hass(), c.entity));
                  return (
                    <Show when={at && flow()}>
                      <g class={`tw-flow ${flow()}`}>
                        <For each={[-16, 0, 16]}>
                          {(dx, i) => (
                            <path
                              d={`M ${at![0] + dx * 0.6} ${at![1] + 6} q ${dx * 0.4} 18 ${dx} 40`}
                              style={{ "animation-delay": `${i() * 0.35}s` }}
                            />
                          )}
                        </For>
                      </g>
                    </Show>
                  );
                }}
              </For>
            )}
          </For>
          <For each={ROOMS}>
            {(r) => (
              <For each={twin(r.id).alarms ?? []}>
                {(a) => {
                  const at = anchorOf(r, a.anchor);
                  return (
                    <Show when={at && alarmOn(hass(), a)}>
                      <circle class="tw-pulse" cx={at![0]} cy={at![1]} r="14" />
                      <circle class="tw-pulse late" cx={at![0]} cy={at![1]} r="14" />
                    </Show>
                  );
                }}
              </For>
            )}
          </For>
          {/* Energia: calm, constant-speed pulses from the meter to everything that is ON.
              Thickness only for devices with a real power measurement; the whole-home load lives at the meter. */}
          <Show when={props.mode === "energy"}>
            <g class="tw-power">
              <For each={live()}>
                {(c, i) => (
                  <g class={`tw-wire ${c.kind}`} classList={{ measured: c.watts !== undefined, picked: picked() === c.id }}>
                    <path class="tw-wire-glow" d={wire(METER, c.at)} style={{ "stroke-width": `${c.watts !== undefined ? lineWidth(c) + 3 : lineWidth(c)}` }} />
                    <path class="tw-wire-flow" d={wire(METER, c.at)} style={{ "stroke-width": `${lineWidth(c)}`, "animation-delay": `${-((i() * 0.83) % 4)}s` }} />
                    <path
                      class="tw-wire-hit"
                      d={wire(METER, c.at)}
                      on:click={(ev: MouseEvent) => {
                        ev.stopPropagation();
                        setPicked(picked() === c.id ? undefined : c.id);
                      }}
                    />
                    <circle class="tw-wire-end" cx={c.at[0]} cy={c.at[1]} r="5" />
                    {/* Finger-sized invisible target (~44 px) over the end dot. */}
                    <circle
                      class="tw-wire-endhit"
                      cx={c.at[0]}
                      cy={c.at[1]}
                      r="20"
                      on:click={(ev: MouseEvent) => {
                        ev.stopPropagation();
                        setPicked(picked() === c.id ? undefined : c.id);
                      }}
                    />
                  </g>
                )}
              </For>
              {/* Whole-home load on a fixed, labelled 0–6 kW scale (not a share of the installation's capacity). */}
              <circle class="tw-meter-scale" cx={METER[0]} cy={METER[1]} r={meterRadius(METER_SCALE_W)} />
              <circle
                class="tw-meter-load"
                classList={{ over: (totalWatts(hass(), props.power) ?? 0) > METER_SCALE_W }}
                cx={METER[0]}
                cy={METER[1]}
                r={meterRadius(totalWatts(hass(), props.power))}
              />
              <circle class="tw-meter-ring" cx={METER[0]} cy={METER[1]} r="8" />
            </g>
          </Show>
        </svg>

        <div class="tw-layer">
          <Show when={props.mode === "energy"}>
            <span class="tw-meter" style={pct(METER)}>
              <Icon icon="mdi:lightning-bolt" />
              <b>{totalWatts(hass(), props.power) !== undefined ? `${fmt(totalWatts(hass(), props.power), 0, t.lang())} W` : "licznik"}</b>
              <small>
                cały dom · {live().length} aktywnych · pierścień 0–{METER_SCALE_W / 1000} kW
              </small>
            </span>
            {/* Not keyed: the card is created once and its contents update in place, so it never blinks. */}
            <Show when={pickedConsumer()}>
              {(c) => <PowerCard c={c()} />}
            </Show>
          </Show>
          <For each={ROOMS}>
            {(r) => {
              const room = () => twin(r.id);
              const temp = () => roomTemp(hass(), room());
              const lit = () => litCount(hass(), room());
              return (
                <>
                  <span class="tw-label" classList={{ heat: props.mode === "heat", active: props.selected === r.id }} style={pct(r.label)}>
                    <b>{r.name}</b>
                    <Show when={(props.mode === "heat" || props.mode === "home") && temp() !== undefined}>
                      <em style={{ "--heat": tempColor(temp()!) }}>{fmt(temp(), 1, t.lang())}°</em>
                    </Show>
                    <Show when={props.mode === "energy" && lit() > 0}>
                      <em class="lit">{lit()} × światło</em>
                    </Show>
                  </span>

                  <Show when={props.mode === "home" || props.mode === "energy" || props.selected === r.id}>
                    <For each={room().lights ?? []}>
                      {(l, i) => (
                        <Hot
                          at={lightPoint(r, i())}
                          icon={ent(hass(), l.entity)?.state === "on" ? "mdi:lightbulb-on" : "mdi:lightbulb-outline"}
                          cls="light"
                          on={ent(hass(), l.entity)?.state === "on"}
                          label={displayName(l.entity, ent(hass(), l.entity), l.name)}
                          onClick={() => toggle(l)}
                        />
                      )}
                    </For>
                  </Show>

                  <For each={room().climate ?? []}>
                    {(c, i) => {
                      const at = stacked(r, room().climate ?? [], i());
                      const e = () => ent(hass(), c.entity);
                      const flow = () => airflow(e());
                      return (
                        <Show when={at}>
                          <Hot
                            at={at!}
                            icon={c.anchor === "ac" ? "mdi:air-conditioner" : "mdi:thermostat"}
                            cls={`climate ${flow() ?? "idle"}`}
                            on={isOn(e())}
                            label={displayName(c.entity, e(), c.name)}
                            onClick={() => props.onRoom(r.id)}
                          >
                            <span class="tw-chip">
                              {c.anchor === "ac" && e()?.state === "off" ? "wył." : `${fmt(num(e()?.attributes.current_temperature), 1, t.lang())}°`}
                              <Show when={e()?.state !== "off" && num(e()?.attributes.temperature) !== undefined}>
                                <i>→ {fmt(num(e()?.attributes.temperature), Number(e()?.attributes.target_temp_step ?? 1) < 1 ? 1 : 0, t.lang())}°</i>
                              </Show>
                            </span>
                          </Hot>
                        </Show>
                      );
                    }}
                  </For>

                  <For each={room().media ?? []}>
                    {(m, i) => {
                      const at = stacked(r, room().media ?? [], i());
                      const playing = () => ent(hass(), m.entity)?.state === "playing";
                      const on = () => !["off", "unavailable", "standby", "unknown"].includes(String(ent(hass(), m.entity)?.state ?? "off"));
                      return (
                        <Show when={at && (i() === 0 || on())}>
                          <Show when={playing()}>
                            <span class="tw-screen" style={pct(at!)} />
                          </Show>
                          <Hot
                            at={at!}
                            icon={m.anchor === "speaker" ? "mdi:speaker" : "mdi:television"}
                            cls="media"
                            on={on()}
                            label={displayName(m.entity, ent(hass(), m.entity), m.name)}
                            onClick={() => props.onRoom(r.id)}
                          />
                        </Show>
                      );
                    }}
                  </For>

                  <For each={room().purifier ?? []}>
                    {(p) => {
                      const at = anchorOf(r, p.anchor);
                      const on = () => isOn(ent(hass(), p.entity));
                      return (
                        <Show when={at}>
                          <Show when={on()}>
                            <span class="tw-particles" style={pct(at!)}>
                              <i />
                              <i />
                              <i />
                            </span>
                          </Show>
                          <Hot at={at!} icon="mdi:air-purifier" cls="air" on={on()} label={displayName(p.entity, ent(hass(), p.entity), p.name)} onClick={() => toggle(p)} />
                        </Show>
                      );
                    }}
                  </For>

                  <For each={room().fan ?? []}>
                    {(f) => {
                      const at = anchorOf(r, f.anchor);
                      return (
                        <Show when={at}>
                          <Hot at={at!} icon="mdi:fan" cls="fan" on={isOn(ent(hass(), f.entity))} label={displayName(f.entity, ent(hass(), f.entity), f.name)} onClick={() => toggle(f)} />
                        </Show>
                      );
                    }}
                  </For>

                  <For each={room().appliances ?? []}>
                    {(a) => {
                      const at = anchorOf(r, a.anchor);
                      const e = () => ent(hass(), a.entity);
                      const running = () => applianceRunning(e());
                      const left = () => remainingText(ent(hass(), a.remaining));
                      return (
                        <Show when={at}>
                          <Hot
                            at={at!}
                            icon={a.anchor === "dryer" ? "mdi:tumble-dryer" : "mdi:washing-machine"}
                            cls="appliance"
                            on={running()}
                            label={displayName(a.entity, e(), a.name)}
                            onClick={() => props.onRoom(r.id)}
                          >
                            <Show when={running()}>
                              <span class="tw-chip">{left() ?? "pracuje"}</span>
                            </Show>
                          </Hot>
                        </Show>
                      );
                    }}
                  </For>

                  <For each={room().windows ?? []}>
                    {(w) => {
                      const at = anchorOf(r, w.anchor);
                      const open = () => ent(hass(), w.entity)?.state === "on";
                      return (
                        <Show when={at && (open() || props.mode === "security")}>
                          <Hot
                            at={at!}
                            icon={open() ? "mdi:window-open-variant" : "mdi:window-closed-variant"}
                            cls={open() ? "warn" : "ok"}
                            on={open()}
                            label={`${displayName(w.entity, ent(hass(), w.entity), w.name)}: ${open() ? "otwarte" : "zamknięte"}`}
                            onClick={() => props.onRoom(r.id)}
                          >
                            <Show when={open()}>
                              <span class="tw-chip">otwarte</span>
                            </Show>
                          </Hot>
                        </Show>
                      );
                    }}
                  </For>

                  <For each={room().alarms ?? []}>
                    {(a) => {
                      const at = anchorOf(r, a.anchor);
                      const on = () => alarmOn(hass(), a);
                      const offline = () => sensorOffline(hass(), a);
                      return (
                        <Show when={at && (on() || offline() || props.mode === "security")}>
                          <Hot
                            at={at!}
                            icon={offline() ? "mdi:battery-alert-variant-outline" : a.kind === "co" ? "mdi:molecule-co" : "mdi:water-alert"}
                            cls={on() ? "alarm" : offline() ? "offline" : "ok"}
                            on={on()}
                            label={`${displayName(a.entity, ent(hass(), a.entity), a.name)}${offline() ? ": czujnik nie odpowiada" : ""}`}
                            onClick={() => props.onRoom(r.id)}
                          >
                            <Show when={offline()}>
                              <span class="tw-chip">offline</span>
                            </Show>
                          </Hot>
                        </Show>
                      );
                    }}
                  </For>

                  <For each={room().motion ?? []}>
                    {(m) => {
                      const at = anchorOf(r, m.anchor);
                      const on = () => ent(hass(), m.entity)?.state === "on";
                      return (
                        <Show when={at && (on() || props.mode === "security")}>
                          <span class="tw-motion" classList={{ on: on() }} style={pct(at!)} title={displayName(m.entity, ent(hass(), m.entity), m.name)} />
                        </Show>
                      );
                    }}
                  </For>
                </>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
}
