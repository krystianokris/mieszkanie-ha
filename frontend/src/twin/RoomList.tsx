import { For, Show } from "solid-js";
import { fmt, useHass, useT } from "../sdk";
import { Icon } from "../app/Icon";
import type { TwinRoom } from "./model";
import { ROOMS } from "./scene";
import { airflow, alarmOn, ent, litCount, roomTemp, tempColor } from "./state";

/** Phone overview: a compact card per room under the model. */
export function RoomList(props: { rooms: Record<string, TwinRoom>; onRoom: (id: string) => void; style?: Record<string, string> }) {
  const hass = useHass();
  const t = useT();
  return (
    <div class="tw-roomlist" style={props.style}>
      <For each={ROOMS.filter((r) => props.rooms[r.id])}>
        {(r) => {
          const room = () => props.rooms[r.id];
          const temp = () => roomTemp(hass(), room());
          const lit = () => litCount(hass(), room());
          const alarm = () => (room().alarms ?? []).some((a) => alarmOn(hass(), a));
          const flow = () => (room().climate ?? []).map((c) => airflow(ent(hass(), c.entity))).find(Boolean);
          return (
            <button type="button" class="tw-roomcard" classList={{ alarm: alarm(), lit: lit() > 0 }} on:click={() => props.onRoom(r.id)}>
              <b>{r.name}</b>
              <span>
                <Show when={temp() !== undefined}>
                  <em style={{ "--heat": tempColor(temp()!) }}>{fmt(temp(), 1, t.lang())}°</em>
                </Show>
                <Show when={lit() > 0}>
                  <Icon icon="mdi:lightbulb-on" />
                </Show>
                <Show when={flow()}>
                  <Icon icon={flow() === "cool" ? "mdi:snowflake" : "mdi:white-balance-sunny"} />
                </Show>
                <Show when={alarm()}>
                  <Icon icon="mdi:alert" />
                </Show>
              </span>
            </button>
          );
        }}
      </For>
    </div>
  );
}
