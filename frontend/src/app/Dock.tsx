import { createEffect, For, on } from "solid-js";
import { useT } from "../sdk";
import { Icon } from "./Icon";
import type { LayoutPage } from "./model";

export const SETTINGS_PAGE = "__settings";

/** Floating glass dock: one button per page, scrolls sideways when it does not fit. */
export function Dock(props: { pages: LayoutPage[]; active: string; onSelect: (id: string) => void }) {
  const t = useT();
  let scroller!: HTMLDivElement;

  createEffect(
    on(
      () => props.active,
      (id) => {
        const el = scroller?.querySelector<HTMLElement>(`[data-page="${CSS.escape(id)}"]`);
        el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      },
    ),
  );

  return (
    <nav class="k-dock" aria-label="Krystal">
      <div class="k-dock-scroll" ref={scroller}>
        <For each={props.pages}>
          {(p) => (
            <button
              type="button"
              data-page={p.id}
              classList={{ selected: props.active === p.id }}
              aria-current={props.active === p.id ? "page" : undefined}
              onClick={() => props.onSelect(p.id)}
            >
              <Icon icon={p.icon} />
              <span>{p.title}</span>
            </button>
          )}
        </For>
      </div>
      <span class="k-dock-sep" />
      <button
        type="button"
        class="k-dock-settings"
        classList={{ selected: props.active === SETTINGS_PAGE }}
        aria-label={t("settings")}
        onClick={() => props.onSelect(SETTINGS_PAGE)}
      >
        <Icon icon="mdi:tune-variant" />
      </button>
    </nav>
  );
}
