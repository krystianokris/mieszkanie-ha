import { createMemo, Show } from "solid-js";
import { defineTile, fmt, useHass, useMoreInfo, useT } from "../sdk";
import { art } from "../app/art";
import { applianceView } from "../app/laundry";
import type { ApplianceIds } from "../app/model";
import { Kicker } from "../app/parts";

const RING = 196;
const STROKE = 9;

/** Washer / dryer hero: 3D appliance inside a progress ring with time left and finish time. */
export const ApplianceTile = defineTile<{ ids: ApplianceIds; dryer: boolean }>({
  type: "appliance",
  sizes: { lg: { w: 6, h: 4 }, md: { w: 4, h: 6 }, sm: { w: 4, h: 6 } },
  component: (props) => {
    const hass = useHass();
    const moreInfo = useMoreInfo();
    const t = useT();
    const view = createMemo(() => applianceView(hass(), props.config.ids, props.config.dryer, t));
    const r = (RING - STROKE) / 2 - 4;
    const c = 2 * Math.PI * r;
    const clock = (d?: Date) => (d ? new Intl.DateTimeFormat(t.lang(), { hour: "2-digit", minute: "2-digit" }).format(d) : "");
    return (
      <article
        class="k-tile k-appliance"
        data-mode={view().mode}
        classList={{ dryer: props.config.dryer }}
        role="button"
        tabindex="0"
        onClick={() => props.config.ids.status && moreInfo(props.config.ids.status)}
      >
        <div class="k-appliance-ring">
          <svg viewBox={`0 0 ${RING} ${RING}`} aria-hidden="true">
            <defs>
              <linearGradient id="k-app-run" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#bff1ff" />
                <stop offset="0.55" stop-color="#5fdbff" />
                <stop offset="1" stop-color="#159dec" />
              </linearGradient>
              <linearGradient id="k-app-done" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#c9ffe3" />
                <stop offset="1" stop-color="#3fcf8e" />
              </linearGradient>
            </defs>
            <circle class="k-ring-track" cx={RING / 2} cy={RING / 2} r={r} stroke-width={STROKE} />
            <circle
              class="k-appliance-fill"
              cx={RING / 2}
              cy={RING / 2}
              r={r}
              stroke-width={STROKE}
              stroke={view().mode === "done" ? "url(#k-app-done)" : "url(#k-app-run)"}
              stroke-dasharray={`${c}`}
              stroke-dashoffset={`${c * (1 - (view().progress ?? 0))}`}
              transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
            />
          </svg>
          <span class="k-appliance-glow" />
          <img src={props.config.dryer ? art.dryer : art.washer} alt="" draggable={false} />
        </div>
        <div class="k-appliance-copy">
          <Kicker>{view().status}</Kicker>
          <h3>{props.config.dryer ? t("dryer") : t("washer")}</h3>
          <Show
            when={view().remaining !== undefined}
            fallback={<div class="k-appliance-big muted">{view().status}</div>}
          >
            <div class="k-appliance-big">
              {fmt(view().remaining, 0, t.lang())}
              <small> min</small>
            </div>
            <span class="k-appliance-finish">{t("finishAt", { t: clock(view().finish) })}</span>
          </Show>
          <div class="k-appliance-wells">
            <Show when={view().phase}>
              <div class="k-well k-metric sm">
                <span>{t("phase")}</span>
                <strong>{view().phase}</strong>
              </div>
            </Show>
            <Show when={view().progress !== undefined}>
              <div class="k-well k-metric sm">
                <span>{t("progress")}</span>
                <strong>{fmt((view().progress ?? 0) * 100, 0, t.lang())}%</strong>
              </div>
            </Show>
            <Show when={view().program}>
              <div class="k-well k-metric sm">
                <span>{t("program")}</span>
                <strong>{view().program}</strong>
              </div>
            </Show>
          </div>
        </div>
      </article>
    );
  },
});
