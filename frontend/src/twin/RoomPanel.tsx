import { createMemo, For, Show } from "solid-js";
import { fmt, num, useHass, useService, useT, type TileInstance } from "../sdk";
import { Icon } from "../app/Icon";
import { TileGrid } from "../app/Grid";
import type { Features } from "../app/features";
import type { LayoutPage } from "../app/model";
import { tilesForPage } from "../app/pages";
import type { TwinLayout, TwinRoom } from "./model";
import { roomById } from "./scene";
import { alarmOn, ent, litCount, roomTemp } from "./state";
import { EXTRAS, haNavigate, room3d } from "./rooms3d";

/** Photo banner that opens a room (or a related view) on the Pomieszczenia dashboard. */
function Portal(props: { image: string; kicker: string; title: string; path: string; small?: boolean }) {
  return (
    <button type="button" class="tw-portal" classList={{ small: props.small }} on:click={() => haNavigate(props.path)}>
      <img src={props.image} alt="" loading="lazy" draggable={false} />
      <span class="tw-portal-text">
        <span class="tw-hud-kicker">{props.kicker}</span>
        <b>{props.title}</b>
      </span>
      <span class="tw-portal-go">
        <Icon icon="mdi:arrow-right" />
      </span>
    </button>
  );
}

/** Krystal page for a room, or a small one built from the twin entries (hallway, WC). */
function pageFor(layout: TwinLayout | null | undefined, id: string, room: TwinRoom): LayoutPage {
  const found = layout?.pages.find((p) => p.id === room.page);
  if (found) return found;
  const name = roomById(id)?.name ?? id;
  const sensors = [...(room.motion ?? []), ...(room.windows ?? []), ...(room.alarms ?? [])];
  return {
    id,
    title: name,
    kind: "room",
    devices: (room.lights ?? []).map((l) => ({ entity: l.entity, name: l.name, kind: "light", art: "bulb", action: "toggle" as const })),
    sections: sensors.length ? [{ id: `${id}-sensors`, kicker: "POD KONTROLĄ", title: "Czujniki", items: sensors.map((s) => ({ entity: s.entity, name: s.name, action: "info" as const })) }] : [],
    temperature: room.temperature,
    humidity: room.humidity,
  };
}

export function RoomPanel(props: {
  id: string;
  layout: TwinLayout | null | undefined;
  features?: Features;
  isAc: (id: string) => boolean;
  phone: boolean;
  onClose: () => void;
}) {
  const hass = useHass();
  const call = useService();
  const t = useT();
  const room = () => props.layout?.twin?.rooms[props.id] ?? {};
  const scene = () => roomById(props.id);
  const page = createMemo(() => pageFor(props.layout, props.id, room()));
  const tiles = createMemo<TileInstance[]>(
    () =>
      tilesForPage({ ...page(), media: page().media ?? [] }, props.features, props.isAc)
        .filter((x) => x.type !== "fuelcard")
        .map((x) => {
          if (x.type !== "canvas") return x;
          // Canvas without its header: one device row (84 px + 10 px gap) per device, 70 px grid rows + 12 px gaps.
          const n = page().devices?.length ?? 1;
          const h = Math.max(2, Math.ceil((34 + n * 84 + (n - 1) * 10 + 12) / 82));
          return { ...x, sizes: { lg: { w: 4, h }, md: { w: 4, h }, sm: { w: 4, h } } };
        }),
    [],
    { equals: (a, b) => a.map((x) => x.id).join() === b.map((x) => x.id).join() },
  );
  const temp = () => roomTemp(hass(), room());
  const hum = () => num(ent(hass(), room().humidity)?.state);
  const lit = () => litCount(hass(), room());
  const lights = () => room().lights ?? [];
  const alarms = () => (room().alarms ?? []).filter((a) => alarmOn(hass(), a));
  const allLights = () =>
    void call("homeassistant", lit() > 0 ? "turn_off" : "turn_on", { entity_id: lights().map((l) => l.entity) });

  return (
    <aside class="tw-panel" classList={{ sheet: props.phone }} on:click={(e: MouseEvent) => e.stopPropagation()}>
      <header class="tw-panel-head">
        <div>
          <span class="tw-hud-kicker">Pomieszczenie</span>
          <h2>{scene()?.name ?? props.id}</h2>
          <span class="tw-panel-meta">
            <Show when={temp() !== undefined}>
              <span>
                <Icon icon="mdi:thermometer" /> {fmt(temp(), 1, t.lang())}°
              </span>
            </Show>
            <Show when={hum() !== undefined}>
              <span>
                <Icon icon="mdi:water-percent" /> {fmt(hum(), 0, t.lang())}%
              </span>
            </Show>
            <Show when={lights().length}>
              <span>
                <Icon icon="mdi:lightbulb-outline" /> {lit()}/{lights().length}
              </span>
            </Show>
          </span>
        </div>
        <div class="tw-panel-actions">
          <Show when={lights().length}>
            <button type="button" class="tw-action" classList={{ on: lit() > 0 }} on:click={allLights}>
              <Icon icon={lit() > 0 ? "mdi:lightbulb-group-off-outline" : "mdi:lightbulb-group-outline"} />
              <span>{lit() > 0 ? "Zgaś" : "Zapal"}</span>
            </button>
          </Show>
          <button type="button" class="tw-action close" aria-label="Zamknij" on:click={() => props.onClose()}>
            <Icon icon="mdi:close" />
          </button>
        </div>
      </header>
      <Show when={alarms().length}>
        <div class="tw-panel-alarm">
          <Icon icon="mdi:alert" />
          <For each={alarms()}>{(a) => <span>{a.name ?? a.entity}</span>}</For>
        </div>
      </Show>
      <div class="tw-panel-body">
        <Show when={room3d(props.id)}>
          {(r) => <Portal image={r().image} kicker="Pomieszczenia · widok 3D" title={`Wejdź do pokoju${r().name ? ` – ${r().name}` : ""}`} path={r().path} />}
        </Show>
        <For each={EXTRAS[props.id] ?? []}>{(x) => <Portal small image={x.image} kicker={x.kicker} title={x.name} path={x.path} />}</For>
        <div class="k-app tw-tiles" data-bp="sm">
          <TileGrid tiles={tiles()} />
        </div>
      </div>
    </aside>
  );
}
