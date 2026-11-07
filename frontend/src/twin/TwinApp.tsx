import { createEffect, createMemo, createSignal, For, onCleanup, onMount, Show, type Accessor } from "solid-js";
import { KrystalProvider, type Hass, type PanelRoute } from "../sdk";
import { visualFor } from "../app/art";
import { resolveFeatures, type Features } from "../app/features";
import { Icon } from "../app/Icon";
import { displayName, setNameOverrides } from "../app/names";
import "../tiles";
import { Hud, ModeBar } from "./Hud";
import type { Mode, TwinLayout } from "./model";
import { RoomList } from "./RoomList";
import { RoomPanel } from "./RoomPanel";
import { APARTMENT, bbox, roomById, SCENE_H, SCENE_W } from "./scene";
import { Stage, type SceneBox, type Zoom } from "./Stage";
import { alarmOn, ent } from "./state";

export function TwinApp(props: {
  hass: Accessor<Hass | undefined>;
  layout: Accessor<TwinLayout | null | undefined>;
  demo: Accessor<boolean>;
  narrow: Accessor<boolean>;
  version: Accessor<string>;
  route: Accessor<PanelRoute | undefined>;
  host: HTMLElement;
}) {
  let root!: HTMLDivElement;
  const [size, setSize] = createSignal({ w: 1280, h: 800 });
  const [now, setNow] = createSignal(new Date());
  const [mode, setMode] = createSignal<Mode>("home");
  const [selected, setSelected] = createSignal<string>();
  /** Nobody has touched the panel for a while: animations rest (alarms keep pulsing). `?calm=10` sets seconds. */
  const [calm, setCalm] = createSignal(false);
  const params = new URLSearchParams(location.search);
  const CALM_AFTER_MS = (Number(params.get("calm")) || 120) * 1000;

  onMount(() => {
    const ro = new ResizeObserver(() => setSize({ w: root.clientWidth, h: root.clientHeight }));
    ro.observe(root);
    setSize({ w: root.clientWidth, h: root.clientHeight });
    const tick = setInterval(() => setNow(new Date()), 30_000);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(undefined);
    window.addEventListener("keydown", onKey);

    let idle: ReturnType<typeof setTimeout> | undefined;
    const wake = () => {
      setCalm(false);
      clearTimeout(idle);
      idle = setTimeout(() => setCalm(true), CALM_AFTER_MS);
    };
    // Capture phase + passive: waking never swallows or delays the tap, so the first touch
    // both resumes the animations and performs the tapped action.
    const events = ["pointerdown", "pointermove", "mousedown", "click", "keydown", "wheel", "touchstart"] as const;
    events.forEach((ev) => root.addEventListener(ev, wake, { passive: true, capture: true }));
    wake();

    onCleanup(() => {
      ro.disconnect();
      clearInterval(tick);
      clearTimeout(idle);
      window.removeEventListener("keydown", onKey);
      events.forEach((ev) => root.removeEventListener(ev, wake, { capture: true }));
    });
  });

  createEffect(() => setNameOverrides(props.layout()?.names));

  const rooms = () => props.layout()?.twin?.rooms ?? {};
  const hud = () => props.layout()?.twin?.hud ?? {};
  const phone = () => size().w < 720;

  /**
   * How dark it is outside, 0 (day) … 1 (night), from the sun's elevation: full day above +6°,
   * full night below −6° (civil dusk), a smooth crossfade in between. `?tod=day|night` forces it.
   */
  const dark = createMemo<number>(() => {
    const forced = params.get("tod");
    if (forced === "day") return 0;
    if (forced === "night") return 1;
    const sun = props.hass()?.states[hud().sun ?? "sun.sun"];
    const elevation = Number(sun?.attributes?.elevation);
    if (sun && Number.isFinite(elevation)) return Math.round(Math.min(1, Math.max(0, (6 - elevation) / 12)) * 100) / 100;
    if (sun) return sun.state === "above_horizon" ? 0 : 1;
    const h = now().getHours();
    return h >= 7 && h < 19 ? 0 : 1;
  });
  const tod = createMemo<"day" | "night">(() => (dark() >= 0.5 ? "night" : "day"));

  const features = createMemo<Features | undefined>(
    () => (props.hass() ? resolveFeatures(props.hass()!, props.layout()?.features, props.demo()) : undefined),
    undefined,
    { equals: (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null) },
  );
  const isAc = (id: string) => {
    const e = props.hass()?.states[id];
    return visualFor(id, e, { name: displayName(id, e) }).art === "ac";
  };

  const alarms = createMemo(() => {
    const h = props.hass();
    const out: { name: string; room: string; kind?: string }[] = [];
    for (const [rid, room] of Object.entries(rooms())) {
      for (const a of room.alarms ?? []) if (alarmOn(h, a)) out.push({ name: displayName(a.entity, ent(h, a.entity), a.name), room: rid, kind: a.kind });
    }
    return out;
  });
  const openWindows = () => Object.values(rooms()).flatMap((r) => r.windows ?? []).filter((w) => ent(props.hass(), w.entity)?.state === "on").length;

  const HUD_H = () => (phone() ? 62 : 84);
  const BAR_H = () => (phone() ? 70 : 92);
  const mobileDockTop = () => box().top + box().height * ((APARTMENT.y + APARTMENT.h) / SCENE_H) + 8;
  const panelW = () => (phone() ? 0 : Math.round(Math.min(480, Math.max(400, size().w * 0.31))));

  /** Base placement: fit the apartment (not the whole image) into the free area. */
  const box = createMemo<SceneBox>(() => {
    const { w, h } = size();
    const top = HUD_H();
    const availW = w;
    const availH = phone() ? Math.min(h - top - BAR_H(), w * 0.68) : h - top - BAR_H();
    const u = Math.min((availW * 0.96) / APARTMENT.w, (availH * 0.96) / APARTMENT.h);
    const cx = availW / 2;
    const cy = top + availH / 2;
    return {
      width: SCENE_W * u,
      height: SCENE_H * u,
      left: cx - (APARTMENT.x + APARTMENT.w / 2) * u,
      top: cy - (APARTMENT.y + APARTMENT.h / 2) * u,
    };
  });

  /** Zoom that centres the selected room in the area left of the panel (or above the sheet). */
  const zoom = createMemo<Zoom>(() => {
    const room = roomById(selected());
    if (!room) return { tx: 0, ty: 0, s: 1 };
    const b = box();
    const u = b.width / SCENE_W;
    const r = bbox(room.poly);
    const { w, h } = size();
    const area = phone()
      ? { x: 0, y: HUD_H(), w, h: Math.max(160, h * 0.4 - HUD_H()) }
      : { x: 0, y: HUD_H(), w: w - panelW() - 24, h: h - HUD_H() - 24 };
    const s = Math.max(1, Math.min((area.w * 0.84) / (r.w * u), (area.h * 0.8) / (r.h * u), 3.2));
    const lx = (r.x + r.w / 2) * u;
    const ly = (r.y + r.h / 2) * u;
    return { tx: area.x + area.w / 2 - b.left - s * lx, ty: area.y + area.h / 2 - b.top - s * ly, s };
  });

  const selectRoom = (id: string | undefined) => setSelected((cur) => (id && cur === id ? cur : id));

  return (
    <KrystalProvider
      value={{
        hass: props.hass,
        demo: props.demo,
        narrow: props.narrow,
        breakpoint: () => "sm",
        version: props.version,
        page: () => selected() ?? "home",
        navigate: (id) => setSelected(id),
        host: props.host,
      }}
    >
      <div
        class="tw-app"
        ref={root}
        data-tod={tod()}
        data-mode={mode()}
        data-calm={calm() ? "true" : "false"}
        classList={{ phone: phone(), zoomed: !!selected() }}
        style={{ "--panel-w": `${panelW()}px` }}
      >
        <div class="tw-backdrop" />
        <Stage rooms={rooms()} tod={tod()} dark={dark()} power={hud().power} mode={mode()} selected={selected()} box={box()} zoom={zoom()} onRoom={selectRoom} />
        <Hud hud={hud()} now={now()} tod={tod()} alerts={alarms().length} open={openWindows()} phone={phone()} />
        <Show when={alarms().length}>
          <div class="tw-banner" on:click={() => setSelected(alarms()[0].room)}>
            <Icon icon={alarms()[0].kind === "co" ? "mdi:molecule-co" : "mdi:water-alert"} />
            <b>{alarms()[0].kind === "co" ? "Alarm CO" : "Wyciek wody"}</b>
            <span>
              {alarms()
                .map((a) => {
                  const room = roomById(a.room)?.name ?? a.room;
                  return a.name.toLowerCase().includes(room.toLowerCase()) ? a.name : `${a.name} · ${room}`;
                })
                .join("  ·  ")}
            </span>
          </div>
        </Show>
        <Show when={phone() && !selected()}>
          <RoomList rooms={rooms()} onRoom={(id) => setSelected(id)} style={{ top: `${mobileDockTop() + 68}px`, bottom: "0" }} />
        </Show>
        <Show when={!(phone() && selected())}>
          <ModeBar mode={mode()} onMode={setMode} style={phone() ? { top: `${mobileDockTop()}px`, bottom: "auto" } : selected() && !phone() ? { left: `${(size().w - panelW()) / 2}px` } : {}} />
        </Show>
        <Show when={selected()} keyed>
          {(id) => <RoomPanel id={id} layout={props.layout()} features={features()} isAc={isAc} phone={phone()} onClose={() => setSelected(undefined)} />}
        </Show>
        <Show when={!props.layout() && props.layout() !== undefined}>
          <div class="tw-empty">
            <For each={["Brak pliku layout.json", "Uruchom tools/twin_layout.py i skopiuj wynik do integracji."]}>{(l) => <span>{l}</span>}</For>
          </div>
        </Show>
      </div>
    </KrystalProvider>
  );
}
