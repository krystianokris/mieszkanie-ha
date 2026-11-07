import { createSignal, Show } from "solid-js";
import { defineTile, fmt, num, useHass, useKrystal, useT } from "../sdk";
import { Icon } from "../app/Icon";
import type { LayoutRoomCard } from "../app/model";

function hue(text: string): number {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
}

/** Room photo card on the overview; tapping opens the room page. */
export const RoomCardTile = defineTile<{ room: LayoutRoomCard }>({
  type: "roomcard",
  sizes: { lg: { w: 4, h: 3 }, md: { w: 4, h: 3 }, sm: { w: 2, h: 3 } },
  component: (props) => {
    const hass = useHass();
    const { navigate } = useKrystal();
    const t = useT();
    const room = () => props.config.room;
    const [broken, setBroken] = createSignal(false);
    const value = (id?: string) => (id ? num(hass()?.states[id]?.state) : undefined);
    const entities = () => (room().entities ?? []).filter((id) => hass()?.states[id]);
    const on = () => entities().filter((id) => hass()?.states[id]?.state === "on").length;
    return (
      <button
        type="button"
        class="k-tile k-roomcard"
        style={{ "--room-hue": String(hue(room().name)) }}
        disabled={!room().page}
        aria-label={`${t("openRoom")}: ${room().name}`}
        onClick={() => room().page && navigate(room().page!)}
      >
        <Show when={room().image && !broken()} fallback={<span class="k-roomcard-ambient" />}>
          <img class="k-roomcard-photo" src={room().image} alt="" loading="lazy" draggable={false} onError={() => setBroken(true)} />
        </Show>
        <span class="k-roomcard-shade" />
        <span class="k-roomcard-icon">
          <Icon icon={room().icon} />
        </span>
        <span class="k-roomcard-arrow" aria-hidden="true">
          ↗
        </span>
        <span class="k-roomcard-copy">
          <b>{room().name}</b>
          <span class="k-roomcard-metrics">
            <Show when={value(room().temperature) !== undefined}>
              <span>{fmt(value(room().temperature), 1, t.lang())} °C</span>
            </Show>
            <Show when={value(room().humidity) !== undefined}>
              <span>{fmt(value(room().humidity), 0, t.lang())}%</span>
            </Show>
          </span>
          <small>{entities().length ? t("roomCount", { n: on(), m: entities().length }) : room().detail ?? ""}</small>
        </span>
      </button>
    );
  },
});
