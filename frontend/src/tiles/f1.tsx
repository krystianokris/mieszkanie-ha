import { createMemo, createSignal, For, onCleanup, Show, type JSX } from "solid-js";
import { defineTile, fmt, useHass, useMoreInfo, useT, type HassEntity } from "../sdk";
import { art, staticBase } from "../app/art";
import {
  circuitFacts,
  constructorStandings,
  countryCode,
  driverStandings,
  f1t,
  hasLocalTrack,
  isLive,
  liveRows,
  pick,
  raceMessages,
  resultRows,
  seasonRounds,
  sessionCode,
  toDate,
  usable,
  weekendSessions,
  type F1Ids,
  type WeekendSession,
} from "../app/f1-data";
import { Glyph } from "../app/Glyph";
import { Icon } from "../app/Icon";

interface F1Config {
  ids: F1Ids;
}

const ACCENT = "#ff5a5a";

function useF1(config: F1Config) {
  const hass = useHass();
  const t = useT();
  const get = (role: keyof F1Ids): HassEntity | undefined => {
    const id = config.ids?.[role];
    return id ? hass()?.states[id] : undefined;
  };
  const lang = () => t.lang();
  const tr = (key: string, vars?: Record<string, string | number>) => f1t(lang(), key, vars);
  return { hass, get, lang, tr };
}

function useNow(ms: number) {
  const [now, setNow] = createSignal(Date.now());
  const timer = setInterval(() => setNow(Date.now()), ms);
  onCleanup(() => clearInterval(timer));
  return now;
}

const dayFmt = (lang: string, d: Date) => new Intl.DateTimeFormat(lang, { weekday: "short", day: "numeric", month: "numeric" }).format(d);
const timeFmt = (lang: string, d: Date) => new Intl.DateTimeFormat(lang, { hour: "2-digit", minute: "2-digit" }).format(d);
const dateFmt = (lang: string, d: Date, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(lang, opts).format(d);

function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

function shortLeft(ms: number, lang: string) {
  const { d, h, m } = split(ms);
  const u = lang === "pl" ? ["d", "godz.", "min"] : lang === "de" ? ["T", "Std.", "Min"] : ["d", "h", "min"];
  if (d) return `${d} ${u[0]} ${h} ${u[1]}`;
  if (h) return `${h} ${u[1]} ${m} ${u[2]}`;
  return `${m} ${u[2]}`;
}

const shortName = (name: string) => name.replace(/\s*Grand Prix\s*/i, " ").replace(/\s+/g, " ").trim() || name;

function Flag(props: { url?: string; code?: string }) {
  const [broken, setBroken] = createSignal(false);
  return (
    <Show
      when={props.url && !broken()}
      fallback={
        <Show when={props.code}>
          <span class="k-f1-cc">{props.code!.toUpperCase()}</span>
        </Show>
      }
    >
      <img class="k-f1-flag" src={props.url} alt={props.code ?? ""} onError={() => setBroken(true)} draggable={false} />
    </Show>
  );
}

function TeamDot(props: { color: string; label?: string }) {
  return (
    <span class="k-f1-dot" style={{ "--team": props.color }}>
      {props.label ?? ""}
    </span>
  );
}

function Ring(props: { value: number; label: string }) {
  const r = 24;
  const c = 2 * Math.PI * r;
  return (
    <div class="k-well k-f1-ring">
      <svg viewBox="0 0 60 60" aria-hidden="true">
        <circle class="track" cx="30" cy="30" r={r} />
        <circle class="bar" cx="30" cy="30" r={r} stroke-dasharray={`${(c * Math.max(0, Math.min(100, props.value))) / 100} ${c}`} transform="rotate(-90 30 30)" />
      </svg>
      <b>{Math.round(props.value)}%</b>
      <small>{props.label}</small>
    </div>
  );
}

function Fact(props: { label: string; value?: string | number; icon: string }) {
  return (
    <Show when={props.value !== undefined && props.value !== ""}>
      <div class="k-well k-item k-f1-fact" data-state="plain">
        <span class="k-item-art">
          <Glyph icon={props.icon} category="f1" size="sm" />
        </span>
        <span class="k-item-copy">
          <small>{props.label}</small>
          <b>{props.value}</b>
        </span>
      </div>
    </Show>
  );
}

function Head(props: { kicker: string; title: string; sub?: string; icon?: string; children?: JSX.Element }) {
  return (
    <header class="k-panel-head">
      <div>
        <span class="k-panel-kicker">{props.kicker}</span>
        <h3>{props.title}</h3>
        <Show when={props.sub}>
          <span class="k-sub">{props.sub}</span>
        </Show>
      </div>
      {props.children}
      <Show when={props.icon && !props.children}>
        <span class="k-panel-icon">
          <Icon icon={props.icon!} />
        </span>
      </Show>
    </header>
  );
}

const num = (v: unknown) => {
  const x = Number(v);
  return v === undefined || v === null || v === "" || !Number.isFinite(x) ? undefined : x;
};

/** Track weather first (live), then the race forecast sensor's current values. */
function weatherCells(tr: (k: string) => string, lang: string, live?: HassEntity, race?: HassEntity) {
  const a = live?.attributes ?? {};
  const r = race?.attributes ?? {};
  const deg = (v: unknown) => (num(v) === undefined ? undefined : `${fmt(num(v)!, 1, lang)}°`);
  const wind = num(a.wind_speed ?? r.current_wind_speed);
  const hum = num(a.humidity ?? r.current_humidity);
  const rain = num(a.rainfall ?? r.current_precipitation);
  return [
    { label: tr("air"), value: deg(a.air_temperature ?? r.current_temperature ?? (usable(race) ? race!.state : undefined)), icon: "mdi:thermometer" },
    { label: tr("asphalt"), value: deg(a.track_temperature), icon: "mdi:road-variant" },
    { label: tr("humidity"), value: hum === undefined ? undefined : `${Math.round(hum)}%`, icon: "mdi:water-percent" },
    { label: tr("wind"), value: wind === undefined ? undefined : `${fmt(wind, 1, lang)} m/s`, icon: "mdi:weather-windy" },
    { label: tr("rain"), value: rain === undefined ? undefined : `${fmt(rain, 1, lang)} mm`, icon: "mdi:weather-rainy" },
  ].filter((c) => c.value !== undefined);
}

function flagTone(state: string | undefined) {
  const s = String(state ?? "").toUpperCase();
  if (/RED/.test(s)) return "red";
  if (/VSC|SC|YELLOW/.test(s)) return "yellow";
  if (/CLEAR|GREEN/.test(s)) return "green";
  return "plain";
}

function sessionState(s: WeekendSession, now: number, liveCode?: string, nextCode?: string) {
  if (liveCode === s.code || (now >= s.start.getTime() && now < s.end.getTime())) return "live";
  if (now >= s.end.getTime()) return "done";
  return s.code === nextCode ? "next" : "later";
}

/* ---------- Hero ---------- */

export const F1HeroTile = defineTile<F1Config>({
  type: "f1-hero",
  sizes: { lg: { w: 12, h: 5 }, md: { w: 8, h: 6 }, sm: { w: 4, h: 10 } },
  component: (props) => {
    const { get, lang, tr } = useF1(props.config);
    const moreInfo = useMoreInfo();
    const now = useNow(1000);
    const next = () => get("nextRace");
    const a = () => next()?.attributes ?? {};
    const sessions = createMemo(() => weekendSessions(next()));
    const live = () => isLive(get("session"), get("sessionStatus"));
    const liveCode = () => (live() ? sessionCode(get("session")?.state ?? get("session")?.attributes?.name) : undefined);
    const upcoming = () => sessions().find((s) => s.start.getTime() > now());
    const race = () => sessions().find((s) => s.code === "R") ?? (toDate(next()?.state) ? { code: "R" as const, start: toDate(next()!.state)!, end: toDate(next()!.state)! } : undefined);
    const left = () => (upcoming() ? split(upcoming()!.start.getTime() - now()) : undefined);
    const name = () => String(pick(a(), "race_name", "raceName") ?? pick(get("session")?.attributes, "meeting_name") ?? tr("noData"));
    const place = () =>
      [pick(a(), "circuit_name"), [pick(a(), "circuit_locality"), pick(a(), "circuit_country")].filter(Boolean).join(", ")].filter(Boolean).join(" · ");
    const round = () =>
      [tr("kicker"), a().round ? tr("round", { n: a().round }) : undefined, a().season].filter(Boolean).join(" · ");
    const track = () => get("trackStatus");
    const status = () => get("sessionStatus");
    const sc = () => get("safetyCar")?.state === "on";
    const week = () => get("raceWeek");
    const wx = () => weatherCells(tr, lang(), get("trackWeather"), get("raceWeather"));
    return (
      <article class="k-tile k-f1-hero" classList={{ live: live() }} style={{ "--accent": ACCENT }}>
        <div class="k-f1-stage" role="button" tabindex="0" onClick={() => next() && moreInfo(next()!.entity_id)}>
          <img class="k-f1-car" src={art.f1} alt="" draggable={false} />
        </div>
        <div class="k-f1-copy">
          <span class="k-panel-kicker">{round()}</span>
          <h2>
            <Flag url={a().country_flag_url} code={countryCode(a().country_code, a().circuit_country)} />
            <span>{name()}</span>
          </h2>
          <span class="k-sub">{place()}</span>
          <Show when={live()}>
            <div class="k-f1-livebar">
              <i />
              {tr("liveNow")} · {tr(liveCode() ?? "") !== (liveCode() ?? "") ? tr(liveCode()!) : String(get("session")?.state ?? "")}
            </div>
          </Show>
          <Show when={left()}>
            <span class="k-f1-label">{tr("untilSession", { s: tr(upcoming()!.code) })}</span>
            <div class="k-f1-countdown">
              <For each={[["d", "days"], ["h", "hours"], ["m", "minutes"], ["s", "seconds"]] as const}>
                {([k, label]) => (
                  <div class="k-well k-metric">
                    <span>{tr(label)}</span>
                    <strong>{String(left()![k]).padStart(k === "d" ? 1 : 2, "0")}</strong>
                  </div>
                )}
              </For>
            </div>
            <span class="k-f1-when">
              {dateFmt(lang(), upcoming()!.start, { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
              <Show when={race() && upcoming()!.code !== "R" && race()!.start.getTime() > now()}>
                {" · "}
                {tr("untilRace", { t: shortLeft(race()!.start.getTime() - now(), lang()) })}
              </Show>
            </span>
          </Show>
          <div class="k-pills">
            <Show when={usable(status()) && !live()}>
              <span class="k-pill">
                <Glyph icon="mdi:timer-outline" category="f1" size="xs" />
                {tr(String(status()!.state).toLowerCase())}
              </span>
            </Show>
            <Show when={usable(track())}>
              <span class="k-pill k-f1-flagpill" data-tone={flagTone(track()!.state)}>
                <Glyph icon="mdi:flag-variant" category="f1" size="xs" />
                {tr(String(track()!.state).toUpperCase())}
              </span>
            </Show>
            <Show when={sc()}>
              <span class="k-pill k-f1-flagpill" data-tone="yellow">
                <Glyph icon="mdi:car-emergency" category="f1" size="xs" />
                {tr("safetyCar")}
              </span>
            </Show>
            <Show when={week()?.state === "on"}>
              <span class="k-pill">
                <Glyph icon="mdi:calendar-range" category="f1" size="xs" />
                {tr("raceWeek")}
              </span>
            </Show>
          </div>
        </div>
        <Show when={wx().length}>
          <div class="k-f1-wx">
            <span class="k-f1-label">{tr("atTrack")}</span>
            <For each={wx().slice(0, 4)}>{(c) => <Fact label={c.label} value={c.value} icon={c.icon} />}</For>
          </div>
        </Show>
      </article>
    );
  },
});

/* ---------- Live session ---------- */

const TYRE: Record<string, string> = { SOFT: "#ff4d4d", MEDIUM: "#ffd34d", HARD: "#eef4fb", INTERMEDIATE: "#47d16c", WET: "#4da3ff" };

export const F1LiveTile = defineTile<F1Config>({
  type: "f1-live",
  sizes: { lg: { w: 12, h: 3 }, md: { w: 8, h: 4 }, sm: { w: 4, h: 7 } },
  component: (props) => {
    const { hass, get, lang, tr } = useF1(props.config);
    const session = () => get("session");
    const code = () => sessionCode(session()?.state ?? session()?.attributes?.name);
    const track = () => get("trackStatus");
    const laps = () => {
      const e = get("lapCount");
      if (!e || !usable(e)) return undefined;
      const total = pick(e.attributes, "total_laps", "total", "max");
      return total ? `${e.state} / ${total}` : e.state;
    };
    const remaining = () => (usable(get("remaining")) ? get("remaining")!.state : undefined);
    const grip = () => pick(get("sessionStatus")?.attributes, "track_grip");
    const board = createMemo(() => liveRows(props.config.ids, hass()?.states ?? {}).slice(0, 20));
    const msgs = createMemo(() => raceMessages(get("raceControl")));
    const wx = () => weatherCells(tr, lang(), get("trackWeather"), get("raceWeather"));
    return (
      <article class="k-tile k-panel k-f1-live" classList={{ wide: !board().length }} style={{ "--accent": ACCENT }}>
        <Head kicker={tr("live")} title={code() ? tr(code()!) : String(session()?.state ?? tr("live"))} sub={pick(session()?.attributes, "meeting_name")}>
          <span class="k-f1-livebar">
            <i />
            {tr(String(get("sessionStatus")?.state ?? "started").toLowerCase())}
          </span>
        </Head>
        <div class="k-f1-live-body">
          <div class="k-f1-live-status">
            <div class="k-well k-f1-board" data-tone={flagTone(track()?.state)}>
              <small>{tr("flag")}</small>
              <b>{usable(track()) ? tr(String(track()!.state).toUpperCase()) : "—"}</b>
            </div>
            <Fact label={tr("lap")} value={laps()} icon="mdi:counter" />
            <Fact label={tr("remaining")} value={remaining()} icon="mdi:timer-sand" />
            <Fact label={tr("grip")} value={grip() ? tr(String(grip()).toLowerCase()) : undefined} icon="mdi:tire" />
            <For each={wx()}>{(c) => <Fact label={c.label} value={c.value} icon={c.icon} />}</For>
          </div>
          <Show when={board().length} fallback={<p class="k-sub k-f1-hint">{tr("noTiming")}</p>}>
            <ol class="k-f1-board-rows">
              <For each={board()}>
                {(r) => (
                  <li class="k-well" classList={{ out: r.out, pit: r.inPit }}>
                    <span class="k-f1-pos">{r.pos}</span>
                    <TeamDot color={r.color} />
                    <b>{r.code}</b>
                    <Show when={r.tyre} fallback={<span />}>
                      <span class="k-f1-tyre" style={{ "--tyre": TYRE[r.tyre!] ?? "#9fb3c8" }} title={r.tyre}>
                        {r.tyre!.slice(0, 1)}
                        <Show when={r.tyreAge !== undefined}>
                          <small>{r.tyreAge}</small>
                        </Show>
                      </span>
                    </Show>
                    <em>{r.pos === 1 ? r.lastLap ?? "" : r.interval ?? r.gap ?? ""}</em>
                    <small>{r.pits !== undefined ? `${r.pits} ${tr("pits")}` : ""}</small>
                  </li>
                )}
              </For>
            </ol>
          </Show>
          <Show when={msgs().length}>
            <div class="k-f1-rc">
              <span class="k-f1-label">{tr("raceControl")}</span>
              <For each={msgs()}>
                {(m) => (
                  <div class="k-well k-f1-msg" data-tone={flagTone(m.flag)}>
                    <small>{[m.lap ? `${tr("lap")} ${m.lap}` : undefined, m.at ? timeFmt(lang(), m.at) : undefined].filter(Boolean).join(" · ")}</small>
                    <span>{m.text}</span>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </div>
      </article>
    );
  },
});

/* ---------- Weekend schedule ---------- */

export const F1WeekendTile = defineTile<F1Config>({
  type: "f1-weekend",
  sizes: { lg: { w: 7, h: 6 }, md: { w: 8, h: 6 }, sm: { w: 4, h: 8 } },
  component: (props) => {
    const { get, lang, tr } = useF1(props.config);
    const now = useNow(30_000);
    const sessions = createMemo(() => weekendSessions(get("nextRace")));
    const liveCode = () => (isLive(get("session"), get("sessionStatus")) ? sessionCode(get("session")?.state) : undefined);
    const nextCode = () => sessions().find((s) => s.start.getTime() > now() && s.code !== liveCode())?.code;
    const forecast = () => {
      const r = get("raceWeather")?.attributes;
      if (!r) return [];
      const deg = num(r.race_temperature);
      return [
        { label: tr("air"), value: deg === undefined ? undefined : `${fmt(deg, 1, lang())}°`, icon: String(r.race_weather_icon ?? "mdi:thermometer") },
        { label: tr("rainChance"), value: num(r.race_precipitation_probability) === undefined ? undefined : `${r.race_precipitation_probability}%`, icon: "mdi:weather-rainy" },
        { label: tr("wind"), value: num(r.race_wind_speed) === undefined ? undefined : `${fmt(num(r.race_wind_speed)!, 1, lang())} m/s ${r.race_wind_direction ?? ""}`.trim(), icon: "mdi:weather-windy" },
      ].filter((c) => c.value !== undefined);
    };
    return (
      <article class="k-tile k-panel k-f1-weekend" style={{ "--accent": ACCENT }}>
        <Head kicker={tr("weekend")} title={tr("schedule")} icon="mdi:calendar-clock" />
        <ol class="k-f1-sessions">
          <For each={sessions()}>
            {(s) => {
              const state = () => sessionState(s, now(), liveCode(), nextCode());
              return (
                <li class="k-well" data-state={state()}>
                  <span class="k-f1-code">{s.code === "R" ? "GP" : s.code}</span>
                  <span class="k-f1-sname">
                    <b>{tr(s.code)}</b>
                    <small>
                      {dayFmt(lang(), s.start)} · {timeFmt(lang(), s.start)}
                    </small>
                  </span>
                  <span class="k-f1-sstate">
                    {state() === "live"
                      ? tr("live")
                      : state() === "done"
                        ? tr("done")
                        : state() === "next"
                          ? shortLeft(s.start.getTime() - now(), lang())
                          : ""}
                  </span>
                </li>
              );
            }}
          </For>
        </ol>
        <Show when={forecast().length}>
          <span class="k-f1-label">{tr("forecast")}</span>
          <div class="k-f1-facts three">
            <For each={forecast()}>{(c) => <Fact label={c.label} value={c.value} icon={c.icon} />}</For>
          </div>
        </Show>
      </article>
    );
  },
});

/* ---------- Circuit ---------- */

export const F1CircuitTile = defineTile<F1Config>({
  type: "f1-circuit",
  sizes: { lg: { w: 5, h: 6 }, md: { w: 8, h: 6 }, sm: { w: 4, h: 9 } },
  component: (props) => {
    const { get, lang, tr } = useF1(props.config);
    const a = () => get("nextRace")?.attributes ?? {};
    const id = () => String(a().circuit_id ?? "");
    const [broken, setBroken] = createSignal(false);
    const map = () => (hasLocalTrack(id()) ? `${staticBase}art/tracks/${id()}.svg` : a().circuit_outline_url ?? a().circuit_map_url);
    const facts = () => circuitFacts(id());
    const first = () => pick(a(), "first_f1_race_here.season");
    const dnf = () => num(a().dnf_rate_last_5);
    const poleWin = () => num(a().pole_to_win_conversion_last_5);
    return (
      <article class="k-tile k-panel k-f1-circuit" style={{ "--accent": ACCENT }}>
        <Head
          kicker={tr("circuit")}
          title={String(a().circuit_name ?? "—")}
          sub={[a().circuit_locality, a().circuit_country].filter(Boolean).join(", ")}
          icon="mdi:go-kart-track"
        />
        <div class="k-f1-circuit-body">
          <Show when={map() && !broken()}>
            <div class="k-well k-f1-map">
              <img src={map()} alt="" onError={() => setBroken(true)} draggable={false} />
            </div>
          </Show>
          <div class="k-f1-facts">
            <Fact label={tr("length")} value={facts() ? `${fmt(facts()!.km, 3, lang())} km` : undefined} icon="mdi:map-marker-distance" />
            <Fact label={tr("laps")} value={facts()?.laps} icon="mdi:counter" />
            <Fact label={tr("turns")} value={facts()?.turns} icon="mdi:sign-direction" />
            <Fact label={tr("held")} value={a().races_held_here} icon="mdi:history" />
            <Fact label={tr("firstGp")} value={first()} icon="mdi:flag-checkered" />
          </div>
        </div>
        <Show when={dnf() !== undefined || poleWin() !== undefined}>
          <div class="k-f1-rings">
            <Show when={poleWin() !== undefined}>
              <Ring value={poleWin()!} label={tr("poleWin")} />
            </Show>
            <Show when={dnf() !== undefined}>
              <Ring value={dnf()!} label={tr("dnf")} />
            </Show>
          </div>
        </Show>
      </article>
    );
  },
});

/* ---------- Standings ---------- */

function roundOf(e: HassEntity | undefined) {
  return e?.attributes?.round;
}

export const F1DriversTile = defineTile<F1Config>({
  type: "f1-drivers",
  sizes: { lg: { w: 7, h: 8 }, md: { w: 8, h: 9 }, sm: { w: 4, h: 11 } },
  component: (props) => {
    const { get, tr } = useF1(props.config);
    const [all, setAll] = createSignal(false);
    const rows = createMemo(() => driverStandings(get("drivers")));
    const leader = () => rows()[0]?.points ?? 0;
    const shown = () => (all() ? rows() : rows().slice(0, 10));
    return (
      <article class="k-tile k-panel k-f1-table" style={{ "--accent": ACCENT }}>
        <Head
          kicker={tr("championship", { s: get("drivers")?.attributes?.season ?? "" })}
          title={tr("drivers")}
          sub={roundOf(get("drivers")) ? tr("round", { n: roundOf(get("drivers")) }) : undefined}
          icon="mdi:account-multiple-check"
        />
        <ol class="k-f1-rows" classList={{ scroll: all() }}>
          <For each={shown()}>
            {(r) => (
              <li class="k-well" classList={{ podium: r.pos <= 3 }}>
                <span class="k-f1-pos">{r.pos}</span>
                <TeamDot color={r.color} />
                <span class="k-f1-who">
                  <b>{r.code}</b>
                  <small>{r.name}</small>
                </span>
                <small class="k-f1-team">{r.team ?? ""}</small>
                <span class="k-f1-wins">{r.wins ? `${r.wins} ${tr("wins")}` : ""}</span>
                <span class="k-f1-gap">{r.pos > 1 ? `−${leader() - r.points}` : ""}</span>
                <em>
                  {r.points}
                  <small> {tr("pts")}</small>
                </em>
              </li>
            )}
          </For>
        </ol>
        <Show when={rows().length > 10}>
          <button class="k-chip k-f1-more" onClick={() => setAll(!all())}>
            {all() ? tr("showTop") : tr("showAll", { n: rows().length })}
          </button>
        </Show>
      </article>
    );
  },
});

export const F1ConstructorsTile = defineTile<F1Config>({
  type: "f1-constructors",
  sizes: { lg: { w: 5, h: 8 }, md: { w: 8, h: 8 }, sm: { w: 4, h: 10 } },
  component: (props) => {
    const { get, tr } = useF1(props.config);
    const rows = createMemo(() => constructorStandings(get("constructors")));
    const leader = () => Math.max(1, rows()[0]?.points ?? 1);
    return (
      <article class="k-tile k-panel k-f1-table" style={{ "--accent": ACCENT }}>
        <Head kicker={tr("championship", { s: get("constructors")?.attributes?.season ?? "" })} title={tr("constructors")} icon="mdi:factory" />
        <ol class="k-f1-rows teams">
          <For each={rows()}>
            {(r) => (
              <li class="k-well" classList={{ podium: r.pos <= 3 }} style={{ "--team": r.color }}>
                <span class="k-f1-pos">{r.pos}</span>
                <TeamDot color={r.color} />
                <span class="k-f1-who">
                  <b>{r.name}</b>
                  <span class="k-f1-share">
                    <i style={{ width: `${(r.points / leader()) * 100}%` }} />
                  </span>
                </span>
                <span class="k-f1-wins">{r.wins ? `${r.wins} ${tr("wins")}` : ""}</span>
                <em>
                  {r.points}
                  <small> {tr("pts")}</small>
                </em>
              </li>
            )}
          </For>
        </ol>
      </article>
    );
  },
});

/* ---------- Last race ---------- */

export const F1ResultsTile = defineTile<F1Config>({
  type: "f1-results",
  sizes: { lg: { w: 7, h: 7 }, md: { w: 8, h: 8 }, sm: { w: 4, h: 11 } },
  component: (props) => {
    const { get, lang, tr } = useF1(props.config);
    const e = () => get("lastRace");
    const a = () => e()?.attributes ?? {};
    const rows = createMemo(() => resultRows(a().results));
    const podium = () => [rows()[1], rows()[0], rows()[2]].filter(Boolean);
    const rest = () => rows().slice(3, 10);
    const when = () => toDate(a().race_start);
    return (
      <article class="k-tile k-panel k-f1-results" style={{ "--accent": ACCENT }}>
        <Head
          kicker={[tr("lastRace"), a().round ? tr("round", { n: a().round }) : undefined].filter(Boolean).join(" · ")}
          title={String(a().race_name ?? "—")}
          sub={[a().circuit_name, when() ? dateFmt(lang(), when()!, { day: "numeric", month: "long" }) : undefined].filter(Boolean).join(" · ")}
          icon="mdi:trophy"
        />
        <div class="k-f1-podium">
          <For each={podium()}>
            {(r) => (
              <div class="k-well k-f1-step" data-pos={r.pos} style={{ "--team": r.color }}>
                <span class="k-f1-medal">P{r.pos}</span>
                <TeamDot color={r.color} label={r.code} />
                <b>{r.name}</b>
                <small>{r.team ?? ""}</small>
                <em>{r.time ?? r.status ?? ""}</em>
              </div>
            )}
          </For>
        </div>
        <ol class="k-f1-rows compact">
          <For each={rest()}>
            {(r) => {
              const delta = () => (r.grid ? r.grid - r.pos : 0);
              return (
                <li class="k-well">
                  <span class="k-f1-pos">{r.pos}</span>
                  <TeamDot color={r.color} />
                  <span class="k-f1-who">
                    <b>{r.code}</b>
                    <small>{r.team ?? ""}</small>
                  </span>
                  <span class="k-f1-delta" data-dir={delta() > 0 ? "up" : delta() < 0 ? "down" : "same"}>
                    {r.grid ? (delta() > 0 ? `▲${delta()}` : delta() < 0 ? `▼${-delta()}` : "=") : ""}
                  </span>
                  <span class="k-f1-gap">{r.time ?? r.status ?? ""}</span>
                  <em>{r.points ? `+${r.points}` : ""}</em>
                </li>
              );
            }}
          </For>
        </ol>
      </article>
    );
  },
});

/* ---------- Circuit history ---------- */

export const F1HistoryTile = defineTile<F1Config>({
  type: "f1-history",
  sizes: { lg: { w: 5, h: 7 }, md: { w: 8, h: 7 }, sm: { w: 4, h: 10 } },
  component: (props) => {
    const { get, tr } = useF1(props.config);
    const a = () => get("nextRace")?.attributes ?? {};
    const podium = () => resultRows(a().last_year_podium?.podium);
    const wins = () => (Array.isArray(a().top_5_driver_wins_here) ? (a().top_5_driver_wins_here as Record<string, any>[]).slice(0, 4) : []);
    const pole = () => a().defending_pole_sitter;
    const poleTime = () => pick(pole(), "q3", "q2", "q1");
    return (
      <article class="k-tile k-panel k-f1-history" style={{ "--accent": ACCENT }}>
        <Head kicker={tr("history")} title={String(a().circuit_name ?? a().race_name ?? "—")} icon="mdi:history" />
        <Show when={podium().length}>
          <span class="k-f1-label">{tr("lastYear", { y: a().last_year_podium?.season ?? "" })}</span>
          <ol class="k-f1-rows compact">
            <For each={podium()}>
              {(r) => (
                <li class="k-well podium">
                  <span class="k-f1-pos">{r.pos}</span>
                  <TeamDot color={r.color} />
                  <span class="k-f1-who">
                    <b>{r.code}</b>
                    <small>{r.name}</small>
                  </span>
                  <small class="k-f1-team">{r.team ?? ""}</small>
                  <em>{r.grid ? `P${r.grid}` : ""}</em>
                </li>
              )}
            </For>
          </ol>
        </Show>
        <Show when={wins().length}>
          <span class="k-f1-label">{tr("mostWins")}</span>
          <ol class="k-f1-rows compact">
            <For each={wins()}>
              {(w) => (
                <li class="k-well">
                  <span class="k-f1-pos">{w.wins}×</span>
                  <span />
                  <span class="k-f1-who">
                    <b>{w.driver_code ?? "—"}</b>
                    <small>{w.driver_name ?? ""}</small>
                  </span>
                  <small class="k-f1-team">{[w.first_win_season, w.last_win_season].filter(Boolean).join("–")}</small>
                </li>
              )}
            </For>
          </ol>
        </Show>
        <Show when={pole()}>
          <div class="k-f1-facts">
            <Fact label={tr("pole", { y: pole().season ?? "" })} value={[pole().driver_code, poleTime()].filter(Boolean).join(" · ")} icon="mdi:timer-outline" />
            <Fact label={tr("defending")} value={a().defending_winner?.driver_code} icon="mdi:trophy-outline" />
          </div>
        </Show>
      </article>
    );
  },
});

/* ---------- Season calendar ---------- */

export const F1CalendarTile = defineTile<F1Config>({
  type: "f1-calendar",
  sizes: { lg: { w: 12, h: 5 }, md: { w: 8, h: 7 }, sm: { w: 4, h: 14 } },
  component: (props) => {
    const { get, lang, tr } = useF1(props.config);
    const rounds = createMemo(() => seasonRounds(get("season"), get("seasonResults")));
    const nextRound = () => Number(get("nextRace")?.attributes?.round) || rounds().find((r) => r.date && r.date.getTime() > Date.now())?.round;
    return (
      <article class="k-tile k-panel k-f1-calendar" style={{ "--accent": ACCENT }}>
        <Head kicker={tr("kicker")} title={tr("calendar", { s: get("season")?.attributes?.season ?? "" })} icon="mdi:calendar-month" />
        <ol class="k-f1-rounds">
          <For each={rounds()}>
            {(r) => {
              const state = () => (r.round === nextRound() ? "next" : r.winner || (r.date && r.date.getTime() < Date.now()) ? "done" : "later");
              return (
                <li class="k-well" data-state={state()}>
                  <span class="k-f1-rnd">
                    R{r.round}
                    <Show when={r.sprint}>
                      <i>{tr("sprint")}</i>
                    </Show>
                  </span>
                  <span class="k-f1-rname">
                    <Flag url={r.flag} code={r.country} />
                    <b>{shortName(r.name)}</b>
                  </span>
                  <small>
                    {r.date ? dateFmt(lang(), r.date, { day: "numeric", month: "short" }) : ""}
                    <Show when={r.winner}>
                      {" · "}
                      <span class="k-f1-winner" style={{ "--team": r.winner!.color }}>
                        {r.winner!.code}
                      </span>
                    </Show>
                  </small>
                </li>
              );
            }}
          </For>
        </ol>
      </article>
    );
  },
});
