import { Show } from "solid-js";
import { defineTile, fmt, num, useEntity, useT, type TKey } from "../sdk";
import { displayName } from "../app/names";
import { Kicker, Ring } from "../app/parts";

type Kind = "temperature" | "humidity" | "power" | "generic";

const RANGE: Record<Kind, [number, number]> = {
  temperature: [10, 30],
  humidity: [0, 100],
  power: [0, 3000],
  generic: [0, 100],
};

const LABEL: Record<Kind, TKey> = {
  temperature: "temperature",
  humidity: "humidity",
  power: "power",
  generic: "entities",
};

export const SensorTile = defineTile<{ entity: string; kind?: Kind }>({
  type: "sensor",
  sizes: { lg: { w: 2, h: 2 }, md: { w: 2, h: 2 }, sm: { w: 2, h: 2 } },
  component: (props) => {
    const e = useEntity(() => props.config.entity);
    const t = useT();
    const kind = () => props.config.kind ?? "generic";
    const unit = () => String(e()?.attributes.unit_of_measurement ?? "");
    const value = () => {
      const v = num(e()?.state);
      return kind() === "power" && unit() === "kW" && v !== undefined ? v * 1000 : v;
    };
    const digits = () => (kind() === "temperature" ? 1 : 0);
    const shownUnit = () => (kind() === "temperature" ? "°" : kind() === "power" ? "W" : unit());
    const room = () => displayName(props.config.entity, e()).split("·")[0].trim();
    return (
      <article class="k-tile k-sensor" data-kind={kind()}>
        <Kicker>{t(LABEL[kind()])}</Kicker>
        <Ring value={value()} min={RANGE[kind()][0]} max={RANGE[kind()][1]} size={92} tone={kind() === "power" ? "warm" : "ice"}>
          <b>
            {fmt(value(), digits(), t.lang())}
            {kind() === "temperature" ? "°" : <small>{shownUnit()}</small>}
          </b>
        </Ring>
        <Show when={kind() !== "temperature" && kind() !== "humidity"}>
          <span class="k-sensor-name">{room()}</span>
        </Show>
      </article>
    );
  },
});
