import type { HassEntity } from "../sdk/types";

/**
 * Demo f1_sensor entities. Attribute shapes follow the integration (Jolpica-style
 * standings/results, `*_start` session times); live timing shapes are approximations.
 */
type Make = (id: string, state: string, attributes: Record<string, unknown>) => HassEntity;

const H = 3_600_000;
const D = 24 * H;

const GRID: [string, string, string, string, string][] = [
  ["ANT", "12", "Andrea Kimi", "Antonelli", "mercedes"],
  ["RUS", "63", "George", "Russell", "mercedes"],
  ["HAM", "44", "Lewis", "Hamilton", "ferrari"],
  ["VER", "3", "Max", "Verstappen", "red_bull"],
  ["LEC", "16", "Charles", "Leclerc", "ferrari"],
  ["NOR", "1", "Lando", "Norris", "mclaren"],
  ["PIA", "81", "Oscar", "Piastri", "mclaren"],
  ["HAD", "6", "Isack", "Hadjar", "red_bull"],
  ["LAW", "30", "Liam", "Lawson", "rb"],
  ["GAS", "10", "Pierre", "Gasly", "alpine"],
  ["LIN", "41", "Arvid", "Lindblad", "rb"],
  ["COL", "43", "Franco", "Colapinto", "alpine"],
  ["BEA", "87", "Oliver", "Bearman", "haas"],
  ["HUL", "27", "Nico", "Hülkenberg", "audi"],
  ["BOR", "5", "Gabriel", "Bortoleto", "audi"],
  ["OCO", "31", "Esteban", "Ocon", "haas"],
  ["ALO", "14", "Fernando", "Alonso", "aston_martin"],
  ["SAI", "55", "Carlos", "Sainz", "williams"],
  ["ALB", "23", "Alexander", "Albon", "williams"],
  ["STR", "18", "Lance", "Stroll", "aston_martin"],
  ["BOT", "77", "Valtteri", "Bottas", "cadillac"],
  ["PER", "11", "Sergio", "Pérez", "cadillac"],
];

const TEAMS: Record<string, string> = {
  mercedes: "Mercedes",
  ferrari: "Ferrari",
  mclaren: "McLaren",
  red_bull: "Red Bull",
  rb: "RB F1 Team",
  alpine: "Alpine F1 Team",
  haas: "Haas F1 Team",
  audi: "Audi",
  williams: "Williams",
  aston_martin: "Aston Martin",
  cadillac: "Cadillac F1 Team",
};

const ROUNDS: [string, string, string, string, boolean][] = [
  ["albert_park", "Australian Grand Prix", "au", "Australia", false],
  ["shanghai", "Chinese Grand Prix", "cn", "China", true],
  ["suzuka", "Japanese Grand Prix", "jp", "Japan", false],
  ["bahrain", "Bahrain Grand Prix", "bh", "Bahrain", false],
  ["jeddah", "Saudi Arabian Grand Prix", "sa", "Saudi Arabia", false],
  ["miami", "Miami Grand Prix", "us", "USA", true],
  ["villeneuve", "Canadian Grand Prix", "ca", "Canada", true],
  ["monaco", "Monaco Grand Prix", "mc", "Monaco", false],
  ["catalunya", "Barcelona Grand Prix", "es", "Spain", false],
  ["red_bull_ring", "Austrian Grand Prix", "at", "Austria", false],
  ["silverstone", "British Grand Prix", "gb", "UK", true],
  ["spa", "Belgian Grand Prix", "be", "Belgium", false],
  ["hungaroring", "Hungarian Grand Prix", "hu", "Hungary", false],
  ["zandvoort", "Dutch Grand Prix", "nl", "Netherlands", true],
  ["monza", "Italian Grand Prix", "it", "Italy", false],
  ["madring", "Spanish Grand Prix", "es", "Spain", false],
  ["baku", "Azerbaijan Grand Prix", "az", "Azerbaijan", false],
  ["marina_bay", "Singapore Grand Prix", "sg", "Singapore", true],
  ["americas", "United States Grand Prix", "us", "USA", false],
  ["rodriguez", "Mexico City Grand Prix", "mx", "Mexico", false],
  ["interlagos", "Brazilian Grand Prix", "br", "Brazil", true],
  ["vegas", "Las Vegas Grand Prix", "us", "USA", false],
  ["losail", "Qatar Grand Prix", "qa", "Qatar", true],
  ["yas_marina", "Abu Dhabi Grand Prix", "ae", "UAE", false],
];

const NEXT = 19;
const POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

const driver = (g: (typeof GRID)[number]) => ({ code: g[0], permanentNumber: g[1], givenName: g[2], familyName: g[3] });
const team = (id: string) => ({ constructorId: id, name: TEAMS[id] });

function results(seed: number) {
  const order = GRID.map((g, i) => ({ g, k: (i * 7 + seed * 5) % 9 + i * 0.9 })).sort((a, b) => a.k - b.k);
  return order.map(({ g }, i) => ({
    position: String(i + 1),
    number: g[1],
    points: String(POINTS[i] ?? 0),
    grid: String(((i + seed) % 6) + i - 1 > 0 ? ((i + seed) % 6) + i - 1 : 1),
    laps: i < 19 ? "62" : "48",
    status: i < 19 ? "Finished" : "Retired",
    time: i === 0 ? "1:42:00.785" : i < 19 ? `+${(i * 5.31).toFixed(3)}` : undefined,
    driver: driver(g),
    constructor: team(g[4]),
  }));
}

export function f1DemoStates(make: Make): HassEntity[] {
  const now = Date.now();
  const raceAt = now + D + 4 * H;
  const iso = (t: number) => new Date(t).toISOString();
  const roundDate = (r: number) => raceAt + (r - NEXT) * 7 * D;
  const [cid, raceName, cc, country] = ROUNDS[NEXT - 1];

  const races = ROUNDS.map(([circuitId, name, code, ctry, sprint], i) => {
    const t = roundDate(i + 1);
    const day = (offset: number) => ({ date: iso(t + offset).slice(0, 10), time: iso(t + offset).slice(11, 19) + "Z" });
    return {
      round: String(i + 1),
      season: "2026",
      raceName: name,
      date: iso(t).slice(0, 10),
      time: iso(t).slice(11, 19) + "Z",
      country_code: code,
      Circuit: { circuitId, circuitName: name.replace("Grand Prix", "Circuit"), Location: { country: ctry } },
      FirstPractice: day(-2 * D),
      Qualifying: day(-D),
      ...(sprint ? { SprintQualifying: day(-2 * D + 4 * H), Sprint: day(-D - 4 * H) } : { SecondPractice: day(-2 * D + 4 * H), ThirdPractice: day(-D - 4 * H) }),
    };
  });

  const standings = GRID.map((g, i) => ({
    position: String(i + 1),
    positionText: String(i + 1),
    points: String(Math.round(340 * Math.pow(0.83, i))),
    wins: String([8, 3, 1, 2, 1, 2][i] ?? 0),
    Driver: { ...driver(g), driverId: g[3].toLowerCase(), nationality: "" },
    Constructors: [team(g[4])],
  }));
  const teamPoints = Object.keys(TEAMS)
    .map((id) => ({ id, points: standings.filter((s) => s.Constructors[0].constructorId === id).reduce((a, s) => a + Number(s.points), 0) }))
    .sort((a, b) => b.points - a.points);

  const podium = (seed: number) =>
    results(seed)
      .slice(0, 3)
      .map((r) => ({
        position: r.position,
        grid: r.grid,
        driver_code: r.driver.code,
        driver_name: `${r.driver.givenName} ${r.driver.familyName}`,
        constructor_id: r.constructor.constructorId,
        constructor_name: r.constructor.name,
      }));

  const live = GRID.slice(0, 20).map((g, i) => [g, i] as const);
  const compounds = ["SOFT", "MEDIUM", "HARD"];

  return [
    make("sensor.f1_demo_next_race", iso(raceAt), {
      friendly_name: "F1 · next race",
      device_class: "timestamp",
      season: "2026",
      round: String(NEXT),
      race_name: raceName,
      circuit_id: cid,
      circuit_name: "Circuit of the Americas",
      circuit_locality: "Austin",
      circuit_country: country,
      circuit_timezone: "America/Chicago",
      country_code: cc,
      first_practice_start: iso(raceAt - 2 * D - 2 * H),
      second_practice_start: iso(raceAt - 2 * D + 1.5 * H),
      third_practice_start: iso(now - 20 * 60_000),
      qualifying_start: iso(now + 3.5 * H),
      race_start: iso(raceAt),
      sprint_qualifying_start: null,
      sprint_start: null,
      races_held_here: 13,
      first_f1_race_here: { season: "2012", date: "2012-11-18" },
      dnf_rate_last_5: 26,
      pole_to_win_conversion_last_5: 40,
      last_year_podium: { season: "2025", date: "2025-10-19", podium: podium(3) },
      top_5_driver_wins_here: [
        { driver_code: "HAM", driver_name: "Lewis Hamilton", wins: 5, first_win_season: "2012", last_win_season: "2017" },
        { driver_code: "VER", driver_name: "Max Verstappen", wins: 4, first_win_season: "2021", last_win_season: "2025" },
        { driver_code: "LEC", driver_name: "Charles Leclerc", wins: 1, first_win_season: "2024", last_win_season: "2024" },
        { driver_code: "RAI", driver_name: "Kimi Räikkönen", wins: 1, first_win_season: "2018", last_win_season: "2018" },
      ],
      defending_winner: { season: "2025", driver_code: "VER", driver_name: "Max Verstappen", constructor_id: "red_bull" },
      defending_pole_sitter: { season: "2025", driver_code: "VER", q1: "1:33.207", q2: "1:32.701", q3: "1:32.510" },
    }),
    make("sensor.f1_demo_current_season", String(ROUNDS.length), { friendly_name: "F1 · season", season: "2026", races }),
    make("sensor.f1_demo_season_results", String(NEXT - 1), {
      friendly_name: "F1 · season results",
      races: races.slice(0, NEXT - 1).map((r, i) => ({ round: r.round, race_name: r.raceName, results: results(i).slice(0, 3) })),
    }),
    make("sensor.f1_demo_last_race_results", "Verstappen", {
      friendly_name: "F1 · last race",
      round: String(NEXT - 1),
      race_name: ROUNDS[NEXT - 2][1],
      circuit_name: "Marina Bay Street Circuit",
      race_start: iso(roundDate(NEXT - 1)),
      results: results(NEXT - 2),
    }),
    make("sensor.f1_demo_driver_standings", String(GRID.length), {
      friendly_name: "F1 · driver standings",
      season: "2026",
      round: String(NEXT - 1),
      driver_standings: standings,
    }),
    make("sensor.f1_demo_constructor_standings", String(teamPoints.length), {
      friendly_name: "F1 · constructor standings",
      season: "2026",
      round: String(NEXT - 1),
      constructor_standings: teamPoints.map((t, i) => ({
        position: String(i + 1),
        points: String(t.points),
        wins: String([11, 2, 2, 2][i] ?? 0),
        Constructor: { ...team(t.id), nationality: "" },
      })),
    }),
    make("sensor.f1_demo_current_session", "Practice 3", {
      friendly_name: "F1 · current session",
      active: true,
      live_status: "Started",
      name: "Practice 3",
      type: "Practice",
      meeting_name: raceName,
      meeting_country: "United States",
    }),
    make("sensor.f1_demo_session_status", "live", { friendly_name: "F1 · session status", track_grip: "normal" }),
    make("sensor.f1_demo_track_status", "YELLOW", { friendly_name: "F1 · track status" }),
    make("binary_sensor.f1_demo_safety_car", "off", { friendly_name: "F1 · safety car" }),
    make("binary_sensor.f1_demo_race_week", "on", { friendly_name: "F1 · race week", days_until_next_race: 1 }),
    make("sensor.f1_demo_session_time_remaining", "00:41:12", { friendly_name: "F1 · time remaining" }),
    make("sensor.f1_demo_track_weather", "28.3", {
      friendly_name: "F1 · track weather",
      air_temperature: 28.3,
      track_temperature: 41.8,
      humidity: 44.8,
      rainfall: 0,
      wind_speed: 2.6,
    }),
    make("sensor.f1_demo_weather", "27.1", {
      friendly_name: "F1 · race weather",
      current_temperature: 27.1,
      race_temperature: 27.5,
      race_precipitation_probability: 10,
      race_wind_speed: 5.1,
      race_wind_direction: "SE",
      race_weather_icon: "mdi:weather-cloudy",
    }),
    make("sensor.f1_demo_driver_positions", "20", {
      friendly_name: "F1 · driver positions",
      drivers: Object.fromEntries(
        live.map(([g, i]) => [
          g[1],
          {
            identity: { tla: g[0], name: `${g[2]} ${g[3]}`, team: TEAMS[g[4]] },
            timing: { position: i + 1, gap_to_leader: i ? `+${(i * 0.214).toFixed(3)}` : "", interval: i ? `+${(0.08 + (i % 4) * 0.061).toFixed(3)}` : "", last_lap: i ? undefined : "1:36.112" },
            in_pit: i === 13,
          },
        ]),
      ),
    }),
    make("sensor.f1_demo_current_tyres", "20", {
      friendly_name: "F1 · current tyres",
      drivers: Object.fromEntries(live.map(([g, i]) => [g[1], { compound: compounds[i % 3], tyre_age: (i * 3) % 11 }])),
    }),
    make("sensor.f1_demo_race_control", "Yellow in sector 2", {
      friendly_name: "F1 · race control",
      messages: [
        { message: "Green light - pit exit open", flag: "GREEN", utc: iso(now - 20 * 60_000) },
        { message: "Car 30 (LAW) time deleted - track limits at turn 19", utc: iso(now - 9 * 60_000) },
        { message: "Yellow in track sector 2", flag: "YELLOW", utc: iso(now - 2 * 60_000) },
      ],
    }),
  ];
}
