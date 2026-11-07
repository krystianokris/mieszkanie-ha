import type { Hass, HassArea, HassEntity } from "../sdk/types";
import { f1DemoStates } from "./mock-f1";

type Attrs = Record<string, unknown>;

function entity(entity_id: string, state: string, attributes: Attrs = {}): HassEntity {
  const now = new Date().toISOString();
  return { entity_id, state, attributes, last_changed: now, last_updated: now };
}

const light = (id: string, name: string, on: boolean, brightness = 180) =>
  entity(id, on ? "on" : "off", { friendly_name: name, supported_color_modes: ["brightness"], brightness: on ? brightness : null });

const sw = (id: string, name: string, on: boolean) => entity(id, on ? "on" : "off", { friendly_name: name });

const sensor = (id: string, name: string, value: string | number, unit?: string, deviceClass?: string) =>
  entity(id, String(value), {
    friendly_name: name,
    ...(unit ? { unit_of_measurement: unit } : {}),
    ...(deviceClass ? { device_class: deviceClass, state_class: "measurement" } : {}),
  });

const binary = (id: string, name: string, deviceClass: string, state: "on" | "off" | "unavailable" = "off") =>
  entity(id, state, { friendly_name: name, device_class: deviceClass });

function climate(id: string, name: string, state: string, current: number, target: number, action: string, modes = ["off", "heat"]): HassEntity {
  return entity(id, state, {
    friendly_name: name,
    hvac_modes: modes,
    hvac_action: action,
    current_temperature: current,
    temperature: target,
    min_temp: 7,
    max_temp: 30,
    target_temp_step: 0.5,
  });
}

function forecast(): Attrs[] {
  const days: [string, number, number][] = [
    ["rainy", 14, 7],
    ["partlycloudy", 12, 8],
    ["rainy", 16, 7],
    ["cloudy", 16, 11],
    ["partlycloudy", 14, 9],
  ];
  return days.map(([condition, high, low], i) => ({
    datetime: new Date(Date.now() + (i + 1) * 86_400_000).toISOString(),
    condition,
    temperature: high,
    templow: low,
  }));
}

/** Agile-style half-hour prices (GBP/kWh): cheap night, a sunny midday dip, an evening peak. */
function agileRates(dayOffset: number, count: number): Attrs[] {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + dayOffset);
  return Array.from({ length: count }, (_, i) => {
    const h = i / 2;
    const night = h < 6 ? 0.11 + 0.02 * Math.sin(h) : 0;
    const day = h >= 6 && h < 16 ? 0.17 - 0.16 * Math.exp(-((h - 13.5) ** 2) / 2.2) : 0;
    const peak = h >= 16 && h < 19 ? 0.33 + 0.03 * Math.sin(h * 2) : 0;
    const evening = h >= 19 ? 0.21 - (h - 19) * 0.012 : 0;
    const value = Math.round((night + day + peak + evening + (dayOffset ? 0.01 : 0)) * 10000) / 10000;
    const s = new Date(start.getTime() + i * 30 * 60_000);
    return { start: s.toISOString(), end: new Date(s.getTime() + 30 * 60_000).toISOString(), value_inc_vat: value, is_capped: false };
  });
}

function rateAt(rates: Attrs[], at = Date.now()): Attrs | undefined {
  return rates.find((r) => Date.parse(String(r.start)) <= at && at < Date.parse(String(r.end)));
}

const DEMO_FUEL_CENTRE = { label: "Dom", latitude: 51.752, longitude: -1.258, mode: "home" };

const DEMO_STATIONS = [
  { brand: "JET", address: "RIVERSIDE SERVICE STATION, 12, MILL LANE, NORTHGATE, RIVERTON, RV1 2AB", lat: 51.7585, lng: -1.2505, B7: 152.9, E10: 139.9 },
  { brand: "TESCO", address: "MEADOW PARK SHOPPING CENTRE, RIVERTON, RV7 8CD", lat: 51.702, lng: -1.291, B7: 153.9, E10: 137.9 },
  { brand: "ASDA", address: "ORCHARD WAY, HILLCREST, RIVERTON, RV3 4EF", lat: 51.81, lng: -1.19, B7: 154.7, E10: 138.7 },
  { brand: "Shell", address: "STATION ROAD, EASTFIELD, RIVERTON, RV2 9GH", lat: 51.739, lng: -1.142, B7: 156.9, E10: 141.9 },
  { brand: "Esso", address: "LONDON ROAD SERVICE STATION, LONDON ROAD, RIVERTON, RV5 1JK", lat: 51.731, lng: -1.37, B7: 157.9, E10: 140.9 },
  { brand: "MORRISONS", address: "CANAL STREET, WESTBROOK, RIVERTON, RV6 3LM", lat: 51.7592, lng: -1.2489, B7: 155.9, E10: 139.4 },
  { brand: "BP", address: "RING ROAD, SOUTHLEIGH, RIVERTON, RV8 5NP", lat: 51.668, lng: -1.22, B7: 158.9, E10: 142.9 },
];

const MAP_SIZE = 640;
const PX_PER_MILE = 26;

/** A light street-map look-alike so demo screenshots resemble the Google static map. */
function demoMapImage(): string {
  const roads = [
    "M0 300 C 160 280, 300 330, 640 290",
    "M310 0 C 300 180, 350 420, 330 640",
    "M0 520 C 200 470, 420 560, 640 500",
    "M90 0 C 140 200, 60 420, 140 640",
    "M520 0 C 480 220, 560 430, 500 640",
  ];
  const lanes = Array.from({ length: 14 }, (_, i) => {
    const o = 40 + i * 44;
    return `<path d="M0 ${o} L640 ${o + (i % 2 ? 30 : -24)}" /><path d="M${o} 0 L${o + (i % 2 ? -26 : 22)} 640" />`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${MAP_SIZE}" height="${MAP_SIZE}" viewBox="0 0 640 640">
<rect width="640" height="640" fill="#ebe8e1"/>
<g fill="#cfe7c4"><ellipse cx="170" cy="150" rx="90" ry="60"/><ellipse cx="470" cy="430" rx="110" ry="70"/><rect x="380" y="70" width="120" height="80" rx="20"/></g>
<path d="M-20 420 C 120 380, 220 470, 360 420 S 560 330, 660 370" fill="none" stroke="#aad3f4" stroke-width="22"/>
<g fill="none" stroke="#ffffff" stroke-width="3" opacity="0.9">${lanes}</g>
<g fill="none" stroke="#f6d27a" stroke-width="9" stroke-linecap="round">${roads.map((d) => `<path d="${d}"/>`).join("")}</g>
<g fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round">${roads.map((d) => `<path d="${d}"/>`).join("")}</g>
</svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function demoMap(data: Record<string, unknown>) {
  const home = data.home as { latitude: number; longitude: number } | undefined;
  const stations = (data.stations as { id: string; latitude: number; longitude: number }[] | undefined) ?? [];
  if (!home || !stations.length) throw new Error("demo map: home and stations are required");
  const k = Math.cos((home.latitude * Math.PI) / 180);
  const project = (lat: number, lng: number) => ({
    x: MAP_SIZE / 2 + (lng - home.longitude) * 69.17 * k * PX_PER_MILE,
    y: MAP_SIZE / 2 - (lat - home.latitude) * 69.17 * PX_PER_MILE,
  });
  return {
    width: MAP_SIZE,
    height: MAP_SIZE,
    zoom: 11,
    centre: home,
    home: { x: MAP_SIZE / 2, y: MAP_SIZE / 2 },
    pins: stations.map((s) => ({ id: String(s.id), ...project(s.latitude, s.longitude) })),
    radiusPixels: Number(data.radius ?? 10) * PX_PER_MILE,
    image: demoMapImage(),
  };
}

function demoFuel(fuel: string) {
  const k = Math.cos((DEMO_FUEL_CENTRE.latitude * Math.PI) / 180);
  const stations = DEMO_STATIONS.map((s, i) => ({
    id: `demo-${i}`,
    brand: s.brand,
    address: s.address,
    latitude: s.lat,
    longitude: s.lng,
    distance: Math.hypot((s.lat - DEMO_FUEL_CENTRE.latitude) * 69.17, (s.lng - DEMO_FUEL_CENTRE.longitude) * 69.17 * k),
    prices: { B7: s.B7, E10: s.E10 },
    price: fuel === "B7" ? s.B7 : s.E10,
  }))
    .sort((a, b) => a.price - b.price)
    .slice(0, 5);
  return {
    fuel,
    cheapest: stations[0].price,
    priceUnit: "p/L",
    radius: 10,
    centre: DEMO_FUEL_CENTRE,
    fetchedAt: new Date().toISOString(),
    source: "Demo",
    stations,
  };
}

/** Generic sample home; ids are illustrative and match demo-layout.ts. */
function initialStates(): HassEntity[] {
  const today = agileRates(0, 48);
  const tomorrow = agileRates(1, 46);
  const current = rateAt(today);
  const next = rateAt(today, Date.now() + 30 * 60_000) ?? tomorrow[0];
  const elec = "octopus_energy_electricity_demo_meter";
  const gas = "octopus_energy_gas_demo_meter";
  return [
    entity(`sensor.${elec}_current_rate`, String(current?.value_inc_vat ?? 0.2), {
      friendly_name: "Prąd · cena teraz",
      unit_of_measurement: "GBP/kWh",
      current_day_average_rate: today.reduce((a, r) => a + Number(r.value_inc_vat), 0) / today.length,
      is_export: false,
      end: current?.end,
    }),
    entity(`sensor.${elec}_next_rate`, String(next?.value_inc_vat ?? 0.2), {
      friendly_name: "Prąd · następna cena",
      unit_of_measurement: "GBP/kWh",
      start: next?.start,
      end: next?.end,
    }),
    sensor(`sensor.${elec}_current_accumulative_cost`, "Prąd · koszt dziś", 1.42, "GBP", "monetary"),
    sensor(`sensor.${elec}_current_accumulative_consumption`, "Prąd · zużycie dziś", 7.84, "kWh", "energy"),
    sensor(`sensor.${elec}_current_demand`, "Prąd · pobór", 818, "W", "power"),
    entity(`event.${elec}_current_day_rates`, new Date().toISOString(), { friendly_name: "Stawki dziś", rates: today }),
    entity(`event.${elec}_next_day_rates`, new Date().toISOString(), { friendly_name: "Stawki jutro", rates: tomorrow }),
    sensor(`sensor.${gas}_current_rate`, "Gaz · cena", 0.0742, "GBP/kWh"),
    sensor(`sensor.${gas}_current_accumulative_cost`, "Gaz · koszt dziś", 2.16, "GBP", "monetary"),
    sensor(`sensor.${gas}_current_accumulative_consumption_kwh`, "Gaz · zużycie dziś", 24.3, "kWh", "energy"),
    sensor("sensor.demo_water_meter_yesterday_s_usage", "Woda · wczoraj", 162, "L", "water"),
    sensor("sensor.demo_water_meter_yesterday_s_water_cost", "Woda · koszt wczoraj", 0.45, "GBP", "monetary"),

    sensor("sensor.pralka_machine_status", "Pralka · status", "running"),
    sensor("sensor.pralka_current_program_phase", "Pralka · faza", "4"),
    sensor("sensor.pralka_remaining_time_of_selected_program", "Pralka · pozostało", 38, "min", "duration"),
    sensor("sensor.pralka_selected_program_total_time", "Pralka · czas programu", 109, "min", "duration"),
    sensor("sensor.pralka_selected_program", "Pralka · program", "Bawełna 40°"),
    sensor("sensor.suszarka_demo_machine_status", "Suszarka · status", "standby"),
    sensor("sensor.suszarka_demo_remaining_time_of_selected_program", "Suszarka · pozostało", 0, "min", "duration"),
    sensor("sensor.suszarka_demo_selected_program_total_time", "Suszarka · czas programu", 0, "min", "duration"),

    entity("weather.demo_1", "cloudy", {
      friendly_name: "Forecast Home",
      temperature: 8.1,
      humidity: 80,
      wind_speed: 31,
      temperature_unit: "°C",
      wind_speed_unit: "km/h",
      forecast: forecast(),
    }),

    light("light.salon_sufit", "Salon · LED sufit", true, 176),
    sw("switch.salon_lampa", "Salon · lampa podłogowa", false),
    sw("switch.salon_meble", "Salon · meble (plug)", true),
    sw("switch.salon_tv", "Salon · światło TV", false),
    sw("switch.salon_sofa", "Salon · światło sofa", false),
    entity("fan.salon_oczyszczacz", "off", { friendly_name: "Oczyszczacz Salon", percentage: 0 }),
    sensor("sensor.salon_temperatura", "Salon · temperatura", 24.2, "°C", "temperature"),
    sensor("sensor.salon_wilgotnosc", "Salon · wilgotność", 49, "%", "humidity"),
    sensor("sensor.salon_pm25", "Salon · PM2.5", 5, "µg/m³", "pm25"),
    sensor("sensor.salon_filtr", "Oczyszczacz · filtr", 71, "%"),
    climate("climate.salon_termostat", "Termostat · salon", "heat", 23.8, 23.9, "heating"),
    climate("climate.salon_podloga", "Podłoga · salon", "off", 24.2, 22, "off"),

    sw("switch.kuchnia_swiatlo", "Kuchnia · światło", true),
    sw("switch.kuchnia_stol", "Kuchnia · stół + grill", false),
    sw("switch.kuchnia_zlew", "Kuchnia · zlew (plug)", true),
    sw("switch.kuchnia_szafki", "Kuchnia · szafki LED", false),
    light("light.kuchnia_led", "Kuchnia · LED", true, 128),
    sensor("sensor.kuchnia_temperatura", "Kuchnia · temperatura", 24.7, "°C", "temperature"),
    sensor("sensor.kuchnia_wilgotnosc", "Kuchnia · wilgotność", 44.1, "%", "humidity"),
    climate("climate.kuchnia_podloga", "Podłoga · kuchnia", "off", 25.1, 22, "off"),
    entity("media_player.kuchnia_glosnik", "playing", {
      friendly_name: "Głośnik · kuchnia",
      media_title: "Nocturne in E-flat",
      media_artist: "Chopin",
      supported_features: 1 | 16 | 32 | 1024 | 16384,
    }),
    entity("media_player.kuchnia_tv", "idle", { friendly_name: "TV · kuchnia", supported_features: 1 | 1024 }),

    sw("switch.sypialnia_swiatlo", "Sypialnia · światło", false),
    sw("switch.sypialnia_tv", "Sypialnia · TV", false),
    light("light.sypialnia_led", "Sypialnia · LED", false),
    climate("climate.sypialnia_klima", "Klimatyzacja · sypialnia", "off", 21.4, 22, "off", ["off", "cool", "heat", "auto"]),

    sw("switch.dziecko_swiatlo", "Pokój dziecka · światło", false),
    light("light.dziecko_led", "Pokój dziecka · LED", true, 90),
    sensor("sensor.dziecko_temperatura", "Pokój dziecka · temperatura", 25.6, "°C", "temperature"),
    climate("climate.dziecko_termostat", "Termostat · pokój dziecka", "heat", 25.6, 21, "idle"),

    sw("switch.lazienka_swiatlo", "Łazienka · światło", false),
    sw("switch.lazienka_wentylator", "Łazienka · wentylator", false),
    sensor("sensor.lazienka_temperatura", "Łazienka · temperatura", 23.1, "°C", "temperature"),
    sensor("sensor.lazienka_wilgotnosc", "Łazienka · wilgotność", 61, "%", "humidity"),
    binary("binary_sensor.lazienka_obecnosc", "Łazienka · obecność", "occupancy", "on"),

    sensor("sensor.pralka_status", "Pralka", "run"),
    sensor("sensor.pralka_pozostalo", "Pralka · pozostało", 38, "min"),
    entity("select.pralka_temperatura", "40", { friendly_name: "Pralka · temperatura", options: ["20", "30", "40", "60"] }),
    sw("switch.pralka_para", "Pralka · para wodna", false),
    sensor("sensor.pralka_energia", "Pralka · energia", 820, "Wh", "energy"),
    sensor("sensor.suszarka_status", "Suszarka", "idle"),
    sensor("sensor.suszarka_pozostalo", "Suszarka · pozostało", 0, "min"),
    binary("binary_sensor.suszarka_pojemnik", "Suszarka · pojemnik na wodę", "problem"),

    sensor("sensor.prad_pobor", "Prąd · pobór", 818, "W", "power"),
    sensor("sensor.prad_koszt_dzis", "Prąd · koszt dziś", 2.59, "GBP", "monetary"),
    sensor("sensor.prad_zuzycie_dzis", "Prąd · zużycie dziś", 6.578, "kWh", "energy"),
    sensor("sensor.prad_cena", "Prąd · cena teraz", 0.245, "GBP/kWh"),
    sensor("sensor.gaz_koszt_dzis", "Gaz · koszt dziś", 1.12, "GBP", "monetary"),
    sensor("sensor.gaz_zuzycie_dzis", "Gaz · zużycie dziś", 18.2, "kWh", "energy"),
    sensor("sensor.woda_wczoraj", "Woda · wczoraj", 162, "L"),
    sensor("sensor.paliwo_e10", "Benzyna E10", 1.329, "GBP"),

    binary("binary_sensor.wyciek_kuchnia", "Wyciek · kuchnia", "moisture"),
    binary("binary_sensor.wyciek_pralka", "Wyciek · pralka", "moisture"),
    binary("binary_sensor.wyciek_prysznic", "Wyciek · prysznic", "moisture", "unavailable"),
    binary("binary_sensor.czujnik_co", "Czujnik CO", "carbon_monoxide"),
    binary("binary_sensor.okno_kuchnia", "Okno · kuchnia", "window"),
    binary("binary_sensor.okno_dziecko", "Okno · pokój dziecka", "window", "on"),
    sw("switch.korytarz_swiatlo", "Korytarz", false),
    sw("switch.schody_swiatlo", "Schody", true),
    sw("switch.wc_swiatlo", "Światło WC", false),
    binary("binary_sensor.wc_obecnosc", "Obecność · WC", "presence"),

    ...f1DemoStates(entity),
    sensor("sensor.okno_kuchnia_bateria", "Okno · kuchnia · bateria", 82, "%", "battery"),
    sensor("sensor.ruch_wc_bateria", "Obecność · WC · bateria", 14, "%", "battery"),
    sensor("sensor.wyciek_pralka_bateria", "Wyciek · pralka · bateria", 50, "%", "battery"),
  ];
}

const demoAreas: HassArea[] = [
  { area_id: "salon", name: "Salon" },
  { area_id: "kuchnia", name: "Kuchnia" },
  { area_id: "sypialnia", name: "Sypialnia" },
];

/** In-memory `hass` stand-in that applies service calls locally. */
export function createMockHass(onChange: (hass: Hass) => void): Hass {
  let states: Record<string, HassEntity> = Object.fromEntries(initialStates().map((e) => [e.entity_id, e]));

  const update = (id: string, patch: { state?: string; attributes?: Attrs }) => {
    const prev = states[id];
    if (!prev) return;
    states = {
      ...states,
      [id]: { ...prev, state: patch.state ?? prev.state, attributes: { ...prev.attributes, ...patch.attributes }, last_updated: new Date().toISOString() },
    };
  };

  const ids = (data?: Record<string, unknown>): string[] => {
    const raw = data?.entity_id;
    return Array.isArray(raw) ? raw.map(String) : raw ? [String(raw)] : [];
  };

  const build = (): Hass => ({
    states,
    language: "pl",
    locale: { language: "pl" },
    user: { name: "Krystian", is_admin: true },
    config: { location_name: "Dom", version: "2026.10.2" },
    areas: Object.fromEntries(demoAreas.map((a) => [a.area_id, a])),
    entities: {},
    devices: {},
    services: { glasshome_fuel: { search: {}, map: {} } },
    connection: {
      sendMessagePromise: async <T,>(msg: Record<string, unknown>): Promise<T> => {
        const data = (msg.service_data ?? {}) as Record<string, unknown>;
        if (msg.domain === "glasshome_fuel" && msg.service === "search") {
          return { response: demoFuel(String(data.fuel ?? "B7")) } as T;
        }
        if (msg.domain === "glasshome_fuel" && msg.service === "map") {
          return { response: demoMap(data) } as T;
        }
        throw new Error(`demo: ${String(msg.domain)}.${String(msg.service)} is not available`);
      },
    },
    callService: async (domain, service, data) => {
      for (const id of ids(data)) {
        const current = states[id];
        if (!current) continue;
        if (domain === "media_player" && service === "media_play_pause") {
          update(id, { state: current.state === "playing" ? "paused" : "playing" });
        } else if (service === "toggle" || service === "turn_on" || service === "turn_off") {
          const on = service === "toggle" ? current.state !== "on" : service === "turn_on";
          update(id, {
            state: on ? "on" : "off",
            attributes: domain === "light" ? { brightness: on ? current.attributes.brightness ?? 180 : null } : {},
          });
        } else if (domain === "climate" && service === "set_temperature") {
          update(id, { attributes: { temperature: Number(data?.temperature) } });
        } else if (domain === "climate" && service === "set_hvac_mode") {
          const mode = String(data?.hvac_mode);
          update(id, { state: mode, attributes: { hvac_action: mode === "off" ? "off" : "idle" } });
        }
      }
      onChange(build());
      return undefined;
    },
  });

  return build();
}
