import type { TileInstance } from "../sdk";
import type { Hass, HassEntity } from "../sdk/types";

/** Roles of the f1_sensor entities the F1 page reads; ids come from layout.json or detection. */
export interface F1Ids {
  nextRace?: string;
  season?: string;
  seasonResults?: string;
  lastRace?: string;
  sprintResults?: string;
  drivers?: string;
  constructors?: string;
  session?: string;
  sessionStatus?: string;
  trackStatus?: string;
  trackWeather?: string;
  raceWeather?: string;
  weather?: string;
  safetyCar?: string;
  raceWeek?: string;
  lapCount?: string;
  remaining?: string;
  positions?: string;
  driverList?: string;
  tyres?: string;
  pitStops?: string;
  raceControl?: string;
  p1?: string;
  p2?: string;
  p3?: string;
}

type Role = keyof F1Ids;

/** Same table as F1_ROLES in tools/luma_to_layout.py. */
const ROLES: [Role, RegExp, RegExp?][] = [
  ["nextRace", /^sensor\.f1_(.+_)?next_race$/],
  ["season", /^sensor\.f1_(.+_)?current_season$/],
  ["seasonResults", /^sensor\.f1_(.+_)?season_results$/],
  ["lastRace", /^sensor\.f1_(.+_)?last_race_results$/],
  ["sprintResults", /^sensor\.f1_(.+_)?sprint_results$/],
  ["drivers", /^sensor\.f1_(.+_)?driver_standings$/],
  ["constructors", /^sensor\.f1_(.+_)?constructor_standings$/],
  ["session", /^sensor\.f1_(.+_)?current_session$/],
  ["sessionStatus", /^sensor\.f1_(.+_)?session_status$/],
  ["trackStatus", /^sensor\.f1_(.+_)?track_status$/],
  ["trackWeather", /^sensor\.f1_(.+_)?track_weather$/],
  ["raceWeather", /^sensor\.f1_(.+_)?weather$/, /track_weather$/],
  ["weather", /^weather\.f1_/],
  ["safetyCar", /^binary_sensor\.f1_(.+_)?safety_car$/],
  ["raceWeek", /^binary_sensor\.f1_(.+_)?race_week$/],
  ["lapCount", /^sensor\.f1_(.+_)?race_lap_count$/],
  ["remaining", /^sensor\.f1_(.+_)?session_time_remaining$/],
  ["positions", /^sensor\.f1_(.+_)?driver_positions$/],
  ["driverList", /^sensor\.f1_(.+_)?driver_list$/],
  ["tyres", /^sensor\.f1_(.+_)?current_tyres$/],
  ["pitStops", /^sensor\.f1_(.+_)?pit_stops$/],
  ["raceControl", /^sensor\.f1_(.+_)?race_control$/],
  ["p1", /^sensor\.f1_(.+_)?top_three_p1$/],
  ["p2", /^sensor\.f1_(.+_)?top_three_p2$/],
  ["p3", /^sensor\.f1_(.+_)?top_three_p3$/],
];

export function detectF1(hass: Hass, fromLayout?: F1Ids): F1Ids | undefined {
  const ids = Object.keys(hass.states).sort();
  const out: F1Ids = {};
  for (const [role, re, not] of ROLES) {
    const given = fromLayout?.[role];
    const id = given && hass.states[given] ? given : ids.find((i) => re.test(i) && !(not && not.test(i)));
    if (id) out[role] = id;
  }
  return out.nextRace || out.session || out.drivers ? out : undefined;
}

export type Attrs = Record<string, any>;

export const usable = (e: HassEntity | undefined): boolean =>
  !!e && !["unavailable", "unknown", "none", ""].includes(String(e.state).toLowerCase());

export function pick(a: Attrs | undefined, ...keys: string[]): any {
  for (const k of keys) {
    let v: any = a;
    for (const p of k.split(".")) v = v?.[p];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
}

export function toDate(v: unknown): Date | undefined {
  if (!v) return undefined;
  const d = new Date(String(v));
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/* ---------- Weekend schedule ---------- */

export type SessionCode = "FP1" | "FP2" | "FP3" | "SQ" | "SPR" | "Q" | "R";

const SLOTS: [string, SessionCode, number][] = [
  ["first_practice", "FP1", 60],
  ["second_practice", "FP2", 60],
  ["third_practice", "FP3", 60],
  ["sprint_qualifying", "SQ", 45],
  ["sprint", "SPR", 60],
  ["qualifying", "Q", 60],
  ["race", "R", 120],
];

export interface WeekendSession {
  code: SessionCode;
  start: Date;
  end: Date;
}

export function weekendSessions(next: HassEntity | undefined): WeekendSession[] {
  const a = next?.attributes;
  if (!a) return [];
  return SLOTS.flatMap(([key, code, minutes]) => {
    const start = toDate(a[`${key}_start`] ?? a[`${key}_start_utc`]) ?? (code === "R" ? toDate(next!.state) : undefined);
    return start ? [{ code, start, end: new Date(start.getTime() + minutes * 60_000) }] : [];
  }).sort((x, y) => x.start.getTime() - y.start.getTime());
}

/** Maps f1_sensor's "Practice 3" / "Sprint Qualifying" session names to codes. */
export function sessionCode(name: unknown): SessionCode | undefined {
  const s = String(name ?? "").toLowerCase();
  if (!s) return undefined;
  if (/sprint.*(quali|shoot)/.test(s)) return "SQ";
  if (/sprint/.test(s)) return "SPR";
  if (/quali/.test(s)) return "Q";
  if (/race|wyścig/.test(s)) return "R";
  const fp = s.match(/(practice|trening|fp)\s*(\d)/);
  return fp ? (`FP${fp[2]}` as SessionCode) : undefined;
}

const LIVE_STATUS = new Set(["live", "started", "suspended", "break", "aborted"]);

export function isLive(session: HassEntity | undefined, status: HassEntity | undefined): boolean {
  const st = String(status?.state ?? "").toLowerCase();
  if (usable(status) && LIVE_STATUS.has(st)) return true;
  const a = session?.attributes;
  return usable(session) && (a?.active === true || /started|live/i.test(String(a?.live_status ?? ""))) && !["finished", "finalised", "ended"].includes(st);
}

/* ---------- Teams ---------- */

const TEAM: Record<string, string> = {
  mercedes: "#27f4d2",
  ferrari: "#e8002d",
  mclaren: "#ff8000",
  red_bull: "#3671c6",
  rb: "#6692ff",
  racing_bulls: "#6692ff",
  alpine: "#0093cc",
  haas: "#b6babd",
  audi: "#ff5a36",
  sauber: "#52e252",
  kick_sauber: "#52e252",
  williams: "#64c4ff",
  aston_martin: "#229971",
  cadillac: "#d4b36a",
};

const teamKey = (v: unknown) =>
  String(v ?? "")
    .toLowerCase()
    .replace(/\bf1 team\b|\bformula one team\b|\bteam\b/g, "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .replace(/^visa_cash_app_rb$|^rb_f1$|^racing_bulls.*$/, "rb")
    .replace(/^red_bull_racing$/, "red_bull");

export function teamColor(id?: unknown, name?: unknown, given?: unknown): string {
  const hex = String(given ?? "").replace(/^#/, "");
  if (/^[0-9a-f]{6}$/i.test(hex)) return `#${hex}`;
  return TEAM[teamKey(id)] ?? TEAM[teamKey(name)] ?? "#ff5a5a";
}

/* ---------- Circuits ---------- */

export interface CircuitFacts {
  km: number;
  turns: number;
  laps: number;
}

/** Public circuit facts keyed by Jolpica/Ergast circuit id. */
const CIRCUITS: Record<string, CircuitFacts> = {
  albert_park: { km: 5.278, turns: 14, laps: 58 },
  shanghai: { km: 5.451, turns: 16, laps: 56 },
  suzuka: { km: 5.807, turns: 18, laps: 53 },
  bahrain: { km: 5.412, turns: 15, laps: 57 },
  jeddah: { km: 6.174, turns: 27, laps: 50 },
  miami: { km: 5.412, turns: 19, laps: 57 },
  villeneuve: { km: 4.361, turns: 14, laps: 70 },
  monaco: { km: 3.337, turns: 19, laps: 78 },
  catalunya: { km: 4.657, turns: 14, laps: 66 },
  red_bull_ring: { km: 4.318, turns: 10, laps: 71 },
  silverstone: { km: 5.891, turns: 18, laps: 52 },
  spa: { km: 7.004, turns: 19, laps: 44 },
  hungaroring: { km: 4.381, turns: 14, laps: 70 },
  zandvoort: { km: 4.259, turns: 14, laps: 72 },
  monza: { km: 5.793, turns: 11, laps: 53 },
  madring: { km: 5.416, turns: 22, laps: 57 },
  baku: { km: 6.003, turns: 20, laps: 51 },
  marina_bay: { km: 4.94, turns: 19, laps: 62 },
  americas: { km: 5.513, turns: 20, laps: 56 },
  rodriguez: { km: 4.304, turns: 17, laps: 71 },
  interlagos: { km: 4.309, turns: 15, laps: 71 },
  vegas: { km: 6.201, turns: 17, laps: 50 },
  losail: { km: 5.419, turns: 16, laps: 57 },
  yas_marina: { km: 5.281, turns: 16, laps: 58 },
  imola: { km: 4.909, turns: 19, laps: 63 },
};

export const circuitFacts = (id: unknown): CircuitFacts | undefined => CIRCUITS[String(id ?? "")];
/** Local outlines (art/tracks/<id>.svg, F1DB, CC BY 4.0) exist for every id in CIRCUITS. */
export const hasLocalTrack = (id: unknown): boolean => String(id ?? "") in CIRCUITS;

const COUNTRY: Record<string, string> = {
  usa: "us", "united states": "us", uk: "gb", "united kingdom": "gb", britain: "gb", "great britain": "gb", italy: "it",
  netherlands: "nl", spain: "es", azerbaijan: "az", bahrain: "bh", malaysia: "my", singapore: "sg", japan: "jp", china: "cn",
  australia: "au", monaco: "mc", canada: "ca", austria: "at", belgium: "be", hungary: "hu", mexico: "mx", brazil: "br",
  qatar: "qa", "saudi arabia": "sa", uae: "ae", "united arab emirates": "ae", france: "fr", germany: "de", portugal: "pt",
};

export function countryCode(code: unknown, country?: unknown): string | undefined {
  const c = String(code ?? "").trim().toLowerCase();
  if (/^[a-z]{2}$/.test(c)) return c;
  return COUNTRY[String(country ?? "").trim().toLowerCase()];
}

/* ---------- Standings & results ---------- */

export interface StandingRow {
  pos: number;
  code: string;
  name: string;
  team?: string;
  color: string;
  points: number;
  wins: number;
}

/** Jolpica rows use `Constructor`, f1_sensor results use an own `constructor` key (not Object#constructor). */
const teamOf = (r: Attrs): Attrs =>
  r.Constructor ?? (Object.prototype.hasOwnProperty.call(r, "constructor") ? (r as any)["constructor"] : undefined) ?? {};

const n = (v: unknown) => {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
};

export function driverStandings(e: HassEntity | undefined): StandingRow[] {
  const list = e?.attributes?.driver_standings;
  if (!Array.isArray(list)) return [];
  return list.map((r: Attrs, i) => {
    const d = r.Driver ?? r.driver ?? {};
    const c = (r.Constructors ?? r.constructors)?.[0] ?? teamOf(r);
    const family = d.familyName ?? d.family_name ?? r.name ?? "";
    return {
      pos: n(r.position ?? i + 1),
      code: String(d.code ?? r.code ?? family.slice(0, 3).toUpperCase()),
      name: [d.givenName, family].filter(Boolean).join(" ") || String(r.name ?? "—"),
      team: c.name ?? r.team,
      color: teamColor(c.constructorId ?? c.constructor_id, c.name ?? r.team, r.team_color),
      points: n(r.points),
      wins: n(r.wins),
    };
  });
}

export function constructorStandings(e: HassEntity | undefined): StandingRow[] {
  const list = e?.attributes?.constructor_standings;
  if (!Array.isArray(list)) return [];
  return list.map((r: Attrs, i) => {
    const c = teamOf(r);
    const name = String(c.name ?? r.name ?? "—").replace(/\s+F1 Team$/, "");
    return {
      pos: n(r.position ?? i + 1),
      code: name.slice(0, 3).toUpperCase(),
      name,
      color: teamColor(c.constructorId ?? c.constructor_id, c.name, r.team_color),
      points: n(r.points),
      wins: n(r.wins),
    };
  });
}

export interface ResultRow {
  pos: number;
  code: string;
  name: string;
  team?: string;
  color: string;
  grid?: number;
  time?: string;
  status?: string;
  points?: number;
}

export function resultRows(list: unknown): ResultRow[] {
  if (!Array.isArray(list)) return [];
  return list.map((r: Attrs, i) => {
    const d = r.driver ?? r.Driver ?? {};
    const c = teamOf(r);
    return {
      pos: n(r.position ?? i + 1),
      code: String(d.code ?? r.driver_code ?? "—"),
      name: [d.givenName, d.familyName].filter(Boolean).join(" ") || String(r.driver_name ?? "—"),
      team: c.name ?? r.constructor_name,
      color: teamColor(c.constructorId ?? r.constructor_id, c.name ?? r.constructor_name),
      grid: r.grid !== undefined ? n(r.grid) : undefined,
      time: r.time?.time ?? r.Time?.time ?? (typeof r.time === "string" ? r.time : undefined),
      status: r.status,
      points: r.points !== undefined ? n(r.points) : undefined,
    };
  });
}

export interface SeasonRound {
  round: number;
  name: string;
  date?: Date;
  country?: string;
  flag?: string;
  sprint: boolean;
  circuit?: string;
  winner?: ResultRow;
}

export function seasonRounds(season: HassEntity | undefined, results: HassEntity | undefined): SeasonRound[] {
  const races = season?.attributes?.races;
  if (!Array.isArray(races)) return [];
  const winners = new Map<number, ResultRow>();
  for (const r of (results?.attributes?.races ?? []) as Attrs[]) {
    const top = resultRows(r.results).find((x) => x.pos === 1);
    if (top) winners.set(n(r.round), top);
  }
  return races.map((r: Attrs, i) => {
    const round = n(r.round ?? i + 1);
    return {
      round,
      name: String(r.raceName ?? r.race_name ?? `R${round}`),
      date: toDate(r.time ? `${r.date}T${r.time}` : r.date),
      country: countryCode(r.country_code, r.Circuit?.Location?.country),
      flag: r.country_flag_url,
      sprint: !!(r.Sprint ?? r.sprint),
      circuit: r.Circuit?.circuitId,
      winner: winners.get(round),
    };
  });
}

/* ---------- Live timing (f1_sensor live sensors; shapes vary by version) ---------- */

export interface LiveRow {
  num: string;
  pos: number;
  code: string;
  team?: string;
  color: string;
  gap?: string;
  interval?: string;
  lastLap?: string;
  tyre?: string;
  tyreAge?: number;
  pits?: number;
  inPit?: boolean;
  out?: boolean;
}

function flat(o: Attrs): Attrs {
  const out: Attrs = {};
  for (const [k, v] of Object.entries(o)) {
    if (v && typeof v === "object" && !Array.isArray(v)) Object.assign(out, flat(v), { [k]: v });
    else out[k] = v;
  }
  return out;
}

/** Driver records from an attribute that is a list or a map keyed by racing number. */
function driverMap(e: HassEntity | undefined): Map<string, Attrs> {
  const map = new Map<string, Attrs>();
  const a = e?.attributes;
  if (!a || !usable(e)) return map;
  for (const v of Object.values(a)) {
    if (Array.isArray(v) && v.length && typeof v[0] === "object") {
      v.forEach((r: Attrs, i) => {
        const f = flat(r);
        map.set(String(f.racing_number ?? f.driver_number ?? f.number ?? f.RacingNumber ?? i), f);
      });
      break;
    }
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const entries = Object.entries(v as Attrs).filter(([, x]) => x && typeof x === "object");
      if (entries.length >= 3) {
        for (const [k, x] of entries) map.set(String((x as Attrs).racing_number ?? k), flat(x as Attrs));
        break;
      }
    }
  }
  return map;
}

const text = (v: unknown) => (v === undefined || v === null || v === "" ? undefined : String(v));

export function liveRows(ids: F1Ids, states: Record<string, HassEntity>): LiveRow[] {
  const positions = driverMap(states[ids.positions ?? ""]);
  if (!positions.size) return [];
  const list = driverMap(states[ids.driverList ?? ""]);
  const tyres = driverMap(states[ids.tyres ?? ""]);
  const pits = driverMap(states[ids.pitStops ?? ""]);
  return [...positions.entries()]
    .map(([num, p]) => {
      const who = { ...list.get(num), ...p };
      const t = tyres.get(num) ?? {};
      const s = pits.get(num) ?? {};
      const stops = s.count ?? s.pit_count ?? s.total ?? (Array.isArray(s.stops) ? s.stops.length : undefined);
      return {
        num,
        pos: n(who.position ?? who.pos ?? who.Position),
        code: String(who.tla ?? who.code ?? who.abbreviation ?? who.Tla ?? who.last_name ?? who.name ?? num),
        team: who.team ?? who.team_name ?? who.TeamName,
        color: teamColor(undefined, who.team ?? who.team_name ?? who.TeamName, who.team_color ?? who.team_colour ?? who.TeamColour),
        gap: text(who.gap_to_leader ?? who.gap ?? who.GapToLeader ?? who.time),
        interval: text(who.interval ?? who.interval_to_ahead ?? who.IntervalToPositionAhead),
        lastLap: text(who.last_lap ?? who.last_lap_time ?? who.LastLapTime),
        tyre: text(t.compound ?? who.compound ?? who.tyre ?? who.Compound)?.toUpperCase(),
        tyreAge: t.tyre_age ?? t.age ?? t.laps ?? t.stint_laps ?? who.tyre_age,
        pits: stops !== undefined ? n(stops) : undefined,
        inPit: !!(who.in_pit ?? who.InPit ?? who.pit),
        out: !!(who.retired ?? who.Retired ?? who.stopped ?? who.dnf),
      };
    })
    .filter((r) => r.pos > 0)
    .sort((x, y) => x.pos - y.pos);
}

export interface RaceMessage {
  text: string;
  flag?: string;
  lap?: string;
  at?: Date;
}

export function raceMessages(e: HassEntity | undefined): RaceMessage[] {
  if (!e || !usable(e)) return [];
  const a = e.attributes ?? {};
  const arr = Object.values(a).find((v) => Array.isArray(v) && v.length && typeof v[0] === "object" && ("message" in v[0] || "Message" in v[0])) as
    | Attrs[]
    | undefined;
  const rows = arr ?? [{ message: a.message ?? e.state, flag: a.flag, lap: a.lap, utc: a.utc ?? a.date }];
  return rows
    .map((r) => ({ text: String(r.message ?? r.Message ?? ""), flag: text(r.flag ?? r.Flag), lap: text(r.lap ?? r.Lap), at: toDate(r.utc ?? r.Utc ?? r.date) }))
    .filter((m) => m.text)
    .sort((x, y) => (y.at?.getTime() ?? 0) - (x.at?.getTime() ?? 0))
    .slice(0, 6);
}

/* ---------- Page ---------- */

type Sizes = TileInstance["sizes"];
const size = (lg: [number, number], md: [number, number], sm: [number, number]): Sizes => ({
  lg: { w: lg[0], h: lg[1] },
  md: { w: md[0], h: md[1] },
  sm: { w: sm[0], h: sm[1] },
});
/** Grid rows (70px + 16px gap) needed for a tile of `px` pixels. */
const rows = (px: number) => Math.ceil((px + 16) / 86);

/** Tiles of the F1 hub; sections without data are left out. */
export function f1Tiles(hass: Hass, ids: F1Ids): TileInstance[] {
  const s = hass.states;
  const next = s[ids.nextRace ?? ""];
  const tiles: TileInstance[] = [];
  const add = (type: string, sizes: Sizes) => tiles.push({ id: type, type, config: { ids }, sizes });

  add("f1-hero", size([12, 5], [8, 6], [4, 10]));

  if (isLive(s[ids.session ?? ""], s[ids.sessionStatus ?? ""]) || liveRows(ids, s).length) {
    const board = Math.min(liveRows(ids, s).length, 20);
    const msgs = raceMessages(s[ids.raceControl ?? ""]).length;
    if (board) add("f1-live", size([12, rows(80 + Math.max(Math.ceil(board / 2) * 32, 330, msgs * 62 + 20))], [8, rows(420 + Math.ceil(board / 2) * 32 + msgs * 60)], [4, rows(640 + Math.ceil(board / 2) * 32 + msgs * 70)]));
    else add("f1-live", size([12, msgs ? 5 : 3], [8, msgs ? 8 : 4], [4, msgs ? 12 : 7]));
  }

  const hasWeekend = weekendSessions(next).length > 0;
  const hasCircuit = !!next && (usable(next) || !!next.attributes?.circuit_id);
  if (hasWeekend) add("f1-weekend", size(hasCircuit ? [7, 6] : [12, 5], [8, 6], [4, 8]));
  if (hasCircuit) add("f1-circuit", size(hasWeekend ? [5, 6] : [12, 5], [8, 6], [4, 9]));

  const drivers = driverStandings(s[ids.drivers ?? ""]).length;
  const teams = constructorStandings(s[ids.constructors ?? ""]).length;
  if (drivers) add("f1-drivers", size(teams ? [7, 7] : [12, 7], [8, 7], [4, 9]));
  if (teams) add("f1-constructors", size(drivers ? [5, 7] : [12, 7], [8, 7], [4, 8]));

  const results = resultRows(s[ids.lastRace ?? ""]?.attributes?.results).length;
  const history = !!(next?.attributes?.last_year_podium || next?.attributes?.top_5_driver_wins_here || next?.attributes?.last_5_winners);
  if (results) add("f1-results", size(history ? [7, 7] : [12, 7], [8, 8], [4, 11]));
  if (history) add("f1-history", size(results ? [5, 7] : [12, 5], [8, 7], [4, 10]));

  const rounds = seasonRounds(s[ids.season ?? ""], s[ids.seasonResults ?? ""]).length;
  const strip = (perRow: number) => rows(96 + Math.ceil(rounds / perRow) * 96);
  if (rounds) add("f1-calendar", size([12, strip(9)], [8, strip(5)], [4, strip(2)]));
  return tiles;
}

/* ---------- Copy ---------- */

const pl = {
  kicker: "Formuła 1",
  round: "Runda {n}",
  next: "Następny wyścig",
  untilSession: "Do sesji: {s}",
  untilRace: "Wyścig za {t}",
  liveNow: "Teraz na żywo",
  days: "dni",
  hours: "godz.",
  minutes: "min",
  seconds: "sek",
  raceWeek: "Tydzień wyścigowy",
  safetyCar: "Samochód bezpieczeństwa",
  weekend: "Weekend",
  schedule: "Harmonogram",
  done: "Zakończona",
  live: "Na żywo",
  upNext: "Następna",
  circuit: "Tor",
  length: "Długość",
  laps: "Okrążenia",
  turns: "Zakręty",
  held: "Edycje tutaj",
  firstGp: "Pierwsze GP",
  dnf: "DNF · 5 ost.",
  poleWin: "Pole → wygrana",
  drivers: "Kierowcy",
  constructors: "Konstruktorzy",
  championship: "Mistrzostwa {s}",
  pts: "pkt",
  wins: "zw.",
  showAll: "Pokaż wszystkich ({n})",
  showTop: "Pokaż top 10",
  lastRace: "Ostatni wyścig",
  fromGrid: "start P{g}",
  history: "Historia toru",
  lastYear: "Podium {y}",
  mostWins: "Najwięcej zwycięstw",
  defending: "Obrońca tytułu",
  pole: "Pole {y}",
  calendar: "Kalendarz {s}",
  sprint: "Sprint",
  forecast: "Prognoza na wyścig",
  atTrack: "Na torze",
  air: "Powietrze",
  asphalt: "Asfalt",
  humidity: "Wilgotność",
  wind: "Wiatr",
  rain: "Opady",
  rainChance: "Szansa deszczu",
  grip: "Przyczepność",
  lap: "Okrążenie",
  remaining: "Pozostało",
  positions: "Pozycje",
  raceControl: "Dyrekcja wyścigu",
  noTiming: "Pozycje na żywo pojawią się, gdy live timing f1_sensor będzie online.",
  pits: "pit",
  noData: "Brak danych F1",
  flag: "Flaga",
  FP1: "Trening 1",
  FP2: "Trening 2",
  FP3: "Trening 3",
  SQ: "Kwalifikacje sprintu",
  SPR: "Sprint",
  Q: "Kwalifikacje",
  R: "Wyścig",
  CLEAR: "Tor czysty",
  YELLOW: "Żółta flaga",
  VSC: "Wirtualny SC",
  SC: "Safety car",
  RED: "Czerwona flaga",
  pre: "Przed sesją",
  started: "Na żywo",
  suspended: "Wstrzymana",
  break: "Przerwa",
  finished: "Zakończona",
  finalised: "Wyniki oficjalne",
  ended: "Zakończona",
  aborted: "Przerwana",
  normal: "normalna",
  low: "niska",
  high: "wysoka",
};

type Key = keyof typeof pl;

const en: Record<Key, string> = {
  ...pl,
  kicker: "Formula 1",
  round: "Round {n}",
  next: "Next Grand Prix",
  untilSession: "Until {s}",
  untilRace: "Race in {t}",
  liveNow: "Live now",
  days: "days",
  hours: "hrs",
  minutes: "min",
  seconds: "sec",
  raceWeek: "Race week",
  safetyCar: "Safety car",
  schedule: "Schedule",
  done: "Done",
  live: "Live",
  upNext: "Next",
  circuit: "Circuit",
  length: "Length",
  laps: "Laps",
  turns: "Turns",
  held: "Races here",
  firstGp: "First GP",
  dnf: "DNF · last 5",
  poleWin: "Pole → win",
  drivers: "Drivers",
  constructors: "Constructors",
  championship: "{s} championship",
  pts: "pts",
  wins: "W",
  showAll: "Show all ({n})",
  showTop: "Show top 10",
  lastRace: "Last race",
  fromGrid: "from P{g}",
  history: "Circuit history",
  lastYear: "{y} podium",
  mostWins: "Most wins",
  defending: "Defending winner",
  pole: "{y} pole",
  calendar: "{s} calendar",
  forecast: "Race forecast",
  atTrack: "At the track",
  air: "Air",
  asphalt: "Track",
  humidity: "Humidity",
  wind: "Wind",
  rain: "Rain",
  rainChance: "Rain chance",
  grip: "Grip",
  lap: "Lap",
  remaining: "Remaining",
  positions: "Positions",
  raceControl: "Race control",
  noTiming: "Live positions appear once f1_sensor live timing is online.",
  noData: "No F1 data",
  flag: "Flag",
  FP1: "Practice 1",
  FP2: "Practice 2",
  FP3: "Practice 3",
  SQ: "Sprint qualifying",
  Q: "Qualifying",
  R: "Race",
  CLEAR: "Track clear",
  YELLOW: "Yellow flag",
  VSC: "Virtual SC",
  RED: "Red flag",
  pre: "Pre-session",
  started: "Live",
  suspended: "Suspended",
  break: "Break",
  finished: "Finished",
  finalised: "Final",
  ended: "Ended",
  aborted: "Aborted",
  normal: "normal",
  low: "low",
  high: "high",
};

const de: Record<Key, string> = {
  ...en,
  round: "Runde {n}",
  next: "Nächster Grand Prix",
  untilSession: "Bis {s}",
  untilRace: "Rennen in {t}",
  liveNow: "Jetzt live",
  days: "Tage",
  hours: "Std.",
  raceWeek: "Rennwoche",
  schedule: "Zeitplan",
  done: "Beendet",
  upNext: "Als Nächstes",
  circuit: "Strecke",
  length: "Länge",
  laps: "Runden",
  turns: "Kurven",
  held: "Rennen hier",
  drivers: "Fahrer",
  constructors: "Konstrukteure",
  championship: "WM {s}",
  pts: "Pkt.",
  wins: "S",
  showAll: "Alle zeigen ({n})",
  showTop: "Top 10 zeigen",
  lastRace: "Letztes Rennen",
  history: "Streckenhistorie",
  mostWins: "Meiste Siege",
  calendar: "Kalender {s}",
  forecast: "Rennprognose",
  atTrack: "An der Strecke",
  air: "Luft",
  asphalt: "Strecke",
  humidity: "Feuchte",
  rain: "Regen",
  rainChance: "Regenrisiko",
  lap: "Runde",
  remaining: "Verbleibend",
  positions: "Positionen",
  raceControl: "Rennleitung",
  FP1: "Training 1",
  FP2: "Training 2",
  FP3: "Training 3",
  SQ: "Sprint-Qualifying",
  R: "Rennen",
  CLEAR: "Strecke frei",
  YELLOW: "Gelbe Flagge",
  RED: "Rote Flagge",
  flag: "Flagge",
};

const COPY: Record<string, Record<Key, string>> = { pl, en, de };

export function f1t(lang: string, key: string, vars?: Record<string, string | number>): string {
  const dict = COPY[lang] ?? en;
  let s = (dict as Record<string, string>)[key] ?? (en as Record<string, string>)[key] ?? key;
  for (const [k, v] of Object.entries(vars ?? {})) s = s.replace(`{${k}}`, String(v));
  return s;
}
