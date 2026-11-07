import { Show } from "solid-js";
import { defineTile, friendlyName, isUnavailable, useEntity, useMoreInfo, useService, useT } from "../sdk";
import { art, visualFor } from "../app/art";
import { Kicker } from "../app/parts";
import { stateLabel } from "../app/states";
import { visualState } from "../app/visual-state";

const SUPPORT_PAUSE = 1;
const SUPPORT_VOLUME_STEP = 1024;
const SUPPORT_PREVIOUS = 16;
const SUPPORT_NEXT = 32;

export const MediaTile = defineTile<{ entity: string; name?: string }>({
  type: "media",
  sizes: { lg: { w: 4, h: 3 }, md: { w: 4, h: 3 }, sm: { w: 4, h: 3 } },
  component: (props) => {
    const e = useEntity(() => props.config.entity);
    const call = useService();
    const moreInfo = useMoreInfo();
    const t = useT();
    const features = () => Number(e()?.attributes.supported_features ?? 0);
    const supports = (flag: number) => (features() & flag) === flag;
    const playing = () => e()?.state === "playing";
    const send = (service: string) => call("media_player", service, { entity_id: props.config.entity });
    const title = () => e()?.attributes.media_title ?? stateLabel(t, e());
    const artist = () => e()?.attributes.media_artist ?? e()?.attributes.app_name ?? "";
    return (
      <article class="k-tile k-media" classList={{ playing: playing() }}>
        <header class="k-head">
          <Kicker>{stateLabel(t, e())}</Kicker>
          <h3>{props.config.name ?? friendlyName(e())}</h3>
        </header>
        <button type="button" class="k-media-body" onClick={() => moreInfo(props.config.entity)}>
          <span class="k-well k-media-art" data-state={visualState(e())}>
            <Show
              when={playing() && e()?.attributes.entity_picture}
              fallback={<img class="k-media-device" src={art[visualFor(props.config.entity, e()).art ?? "speaker"]} alt="" draggable={false} />}
            >
              <img src={e()!.attributes.entity_picture} alt="" draggable={false} />
            </Show>
          </span>
          <span class="k-media-copy">
            <b>{title()}</b>
            <small>{artist()}</small>
          </span>
        </button>
        <div class="k-media-controls">
          <button type="button" class="k-btn" disabled={isUnavailable(e()) || !supports(SUPPORT_PREVIOUS)} onClick={() => send("media_previous_track")} aria-label="previous">
            ⏮
          </button>
          <button type="button" class="k-btn primary" disabled={isUnavailable(e()) || !supports(SUPPORT_PAUSE)} onClick={() => send("media_play_pause")} aria-label="play/pause">
            {playing() ? "⏸" : "▶"}
          </button>
          <button type="button" class="k-btn" disabled={isUnavailable(e()) || !supports(SUPPORT_NEXT)} onClick={() => send("media_next_track")} aria-label="next">
            ⏭
          </button>
          <span class="k-media-gap" />
          <button type="button" class="k-btn" disabled={isUnavailable(e()) || !supports(SUPPORT_VOLUME_STEP)} onClick={() => send("volume_down")} aria-label="volume down">
            −
          </button>
          <button type="button" class="k-btn" disabled={isUnavailable(e()) || !supports(SUPPORT_VOLUME_STEP)} onClick={() => send("volume_up")} aria-label="volume up">
            +
          </button>
        </div>
      </article>
    );
  },
});
