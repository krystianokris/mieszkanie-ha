import { createMemo, For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { getTile, useKrystal, type TileInstance } from "../sdk";
import { Safe } from "./Safe";

export function TileGrid(props: { tiles: TileInstance[] }) {
  const { breakpoint } = useKrystal();
  return (
    <div class="k-grid">
      <For each={props.tiles}>
        {(tile) => {
          const def = getTile(tile.type);
          const size = createMemo(() => (def ? tile.sizes?.[breakpoint()] ?? def.sizes[breakpoint()] : { w: 1, h: 1 }));
          return (
            <Show when={def}>
              <div
                class="k-cell"
                data-tile={tile.type}
                style={{ "grid-column": `span ${size().w}`, "grid-row": `span ${size().h}` }}
              >
                <Safe label={tile.type}>
                  <Dynamic component={def!.component} config={tile.config} size={size()} />
                </Safe>
              </div>
            </Show>
          );
        }}
      </For>
    </div>
  );
}
