import type { KrystalLayout, LayoutItem, LayoutPage } from "../app/model";

/** Demo pages shaped like a Luma Home export (see tools/luma_to_layout.py). */

const bulb = (entity: string, name: string, kind: "light" | "plug" = "light"): LayoutItem => ({ entity, name, kind, art: "bulb", action: "toggle" });
const info = (entity: string, name: string, art?: string): LayoutItem => ({ entity, name, art, action: "info" });
const toggle = (entity: string, name: string, art?: string): LayoutItem => ({ entity, name, art, action: "toggle" });

const LIGHTS = [
  "switch.kuchnia_swiatlo",
  "switch.kuchnia_stol",
  "switch.kuchnia_zlew",
  "switch.kuchnia_szafki",
  "light.kuchnia_led",
  "switch.salon_tv",
  "switch.salon_sofa",
  "light.salon_sufit",
  "switch.salon_lampa",
  "switch.salon_meble",
  "switch.sypialnia_swiatlo",
  "switch.sypialnia_tv",
  "switch.korytarz_swiatlo",
  "switch.schody_swiatlo",
  "switch.lazienka_swiatlo",
  "switch.wc_swiatlo",
  "switch.dziecko_swiatlo",
];

const ALERTS = ["binary_sensor.wyciek_kuchnia", "binary_sensor.wyciek_pralka", "binary_sensor.wyciek_prysznic", "binary_sensor.czujnik_co"];

const overview: LayoutPage = {
  id: "home",
  title: "Przegląd",
  icon: "mdi:view-dashboard-outline",
  kind: "overview",
  accent: "#8cdbff",
  rooms: [
    { page: "salon", name: "Salon", icon: "mdi:sofa-outline", temperature: "sensor.salon_temperatura", humidity: "sensor.salon_wilgotnosc", entities: ["switch.salon_lampa", "switch.salon_meble", "light.salon_sufit", "switch.salon_tv", "switch.salon_sofa"] },
    { page: "kuchnia", name: "Kuchnia", icon: "mdi:countertop-outline", temperature: "sensor.kuchnia_temperatura", humidity: "sensor.kuchnia_wilgotnosc", entities: ["switch.kuchnia_swiatlo", "switch.kuchnia_stol", "switch.kuchnia_zlew", "switch.kuchnia_szafki", "light.kuchnia_led"] },
    { page: "sypialnia", name: "Sypialnia", icon: "mdi:bed-king-outline", entities: ["switch.sypialnia_swiatlo", "switch.sypialnia_tv", "light.sypialnia_led"] },
    { page: "dziecko", name: "Pokój dziecka", icon: "mdi:teddy-bear", temperature: "sensor.dziecko_temperatura", entities: ["switch.dziecko_swiatlo", "light.dziecko_led"] },
    { page: "lazienka", name: "Łazienka", icon: "mdi:shower-head", temperature: "sensor.lazienka_temperatura", humidity: "sensor.lazienka_wilgotnosc", entities: ["switch.lazienka_swiatlo", "switch.lazienka_wentylator"] },
    { page: "pralnia", name: "Pralnia", icon: "mdi:washing-machine", detail: "Pralka, suszarka i statusy cykli" },
  ],
  sections: [
    { id: "now", kicker: "POD KONTROLĄ", title: "Na bieżąco", icon: "mdi:home-clock-outline", items: [info("sensor.pralka_status", "Pralka", "washer"), info("sensor.suszarka_status", "Suszarka", "dryer"), info("sensor.salon_pm25", "PM2.5 · salon"), info("sensor.salon_filtr", "Filtr oczyszczacza")] },
    { id: "comfort", kicker: "POD KONTROLĄ", title: "Komfort w domu", icon: "mdi:home-thermometer-outline", items: [info("climate.salon_termostat", "Termostat · salon", "dial"), info("climate.salon_podloga", "Podłoga · salon", "dial"), info("climate.kuchnia_podloga", "Podłoga · kuchnia", "dial")] },
    { id: "watch", kicker: "CZUJNIKI ALARMOWE", title: "Dom pod opieką", icon: "mdi:shield-check-outline", accent: "#f7d89f", items: [info("binary_sensor.wyciek_kuchnia", "Wyciek kuchnia"), info("binary_sensor.wyciek_pralka", "Wyciek pralka"), info("binary_sensor.wyciek_prysznic", "Wyciek prysznic"), info("binary_sensor.czujnik_co", "Czujnik CO")] },
    { id: "energy", kicker: "POD KONTROLĄ", title: "Prąd i dom", icon: "mdi:chart-box-outline", accent: "#86e6ec", items: [info("sensor.prad_koszt_dzis", "Prąd · koszt dziś"), info("sensor.prad_zuzycie_dzis", "Prąd · zużycie dziś", "bolt"), info("sensor.woda_wczoraj", "Woda · wczoraj"), info("sensor.paliwo_e10", "Benzyna E10")] },
    { id: "hall", kicker: "POD KONTROLĄ", title: "Korytarz i WC", icon: "mdi:door-open", items: [toggle("switch.korytarz_swiatlo", "Korytarz", "bulb"), toggle("switch.schody_swiatlo", "Schody", "bulb"), toggle("switch.wc_swiatlo", "Światło WC", "bulb"), info("binary_sensor.wc_obecnosc", "Obecność · WC")] },
  ],
};

const room = (page: Omit<LayoutPage, "kind">): LayoutPage => ({ kind: "room", ...page });

const pages: LayoutPage[] = [
  overview,
  room({
    id: "salon",
    title: "Salon",
    icon: "mdi:sofa-outline",
    accent: "#ffc391",
    subtitle: "Ciepłe światło. Dobry odpoczynek.",
    temperature: "sensor.salon_temperatura",
    humidity: "sensor.salon_wilgotnosc",
    devices: [
      bulb("switch.salon_lampa", "Lampa podłogowa"),
      bulb("switch.salon_meble", "Meble (plug)", "plug"),
      bulb("light.salon_sufit", "LED sufit"),
      bulb("switch.salon_tv", "Światło TV"),
      bulb("switch.salon_sofa", "Światło sofa"),
      { entity: "fan.salon_oczyszczacz", name: "Oczyszczacz Salon", kind: "purifier", action: "toggle" },
    ],
    sections: [
      { id: "salon-climate", kicker: "POD KONTROLĄ", title: "Klimat i szczegóły", icon: "mdi:tune-variant", items: [info("climate.salon_termostat", "Termostat"), info("climate.salon_podloga", "Podłoga"), info("sensor.salon_pm25", "Pyły PM2.5"), info("sensor.salon_filtr", "Filtr")] },
    ],
  }),
  room({
    id: "kuchnia",
    title: "Kuchnia",
    icon: "mdi:countertop-outline",
    accent: "#9fe3c0",
    subtitle: "Światło nad blatem i muzyka do gotowania.",
    temperature: "sensor.kuchnia_temperatura",
    humidity: "sensor.kuchnia_wilgotnosc",
    devices: [bulb("switch.kuchnia_swiatlo", "Światło"), bulb("switch.kuchnia_stol", "Stół + grill"), bulb("switch.kuchnia_zlew", "Zlew (plug)", "plug"), bulb("switch.kuchnia_szafki", "Szafki LED"), bulb("light.kuchnia_led", "LED Kuchnia")],
    media: [{ entity: "media_player.kuchnia_glosnik", name: "Głośnik · kuchnia" }],
    sections: [{ id: "kuchnia-floor", kicker: "POD KONTROLĄ", title: "Ogrzewanie", icon: "mdi:thermometer-lines", items: [info("climate.kuchnia_podloga", "Podłoga")] }],
  }),
  room({
    id: "sypialnia",
    title: "Sypialnia",
    icon: "mdi:bed-king-outline",
    accent: "#c3b3ff",
    subtitle: "Cisza, chłód i dobry sen.",
    devices: [bulb("switch.sypialnia_swiatlo", "Światło"), bulb("switch.sypialnia_tv", "TV (plug)", "plug"), bulb("light.sypialnia_led", "LED Sypialnia")],
    sections: [{ id: "sypialnia-ac", kicker: "POD KONTROLĄ", title: "Klimatyzacja", icon: "mdi:air-conditioner", items: [info("climate.sypialnia_klima", "Klimatyzacja")] }],
  }),
  room({
    id: "dziecko",
    title: "Pokój dziecka",
    icon: "mdi:teddy-bear",
    accent: "#ffb3c7",
    subtitle: "Miękkie światło na wieczór.",
    temperature: "sensor.dziecko_temperatura",
    devices: [bulb("switch.dziecko_swiatlo", "Światło"), bulb("light.dziecko_led", "LED")],
    sections: [{ id: "dziecko-more", kicker: "POD KONTROLĄ", title: "Ciepło i okno", icon: "mdi:thermometer", items: [info("climate.dziecko_termostat", "Termostat"), info("binary_sensor.okno_dziecko", "Okno")] }],
  }),
  room({
    id: "lazienka",
    title: "Łazienka",
    icon: "mdi:shower-head",
    accent: "#97dcff",
    subtitle: "Świeże powietrze po prysznicu.",
    temperature: "sensor.lazienka_temperatura",
    humidity: "sensor.lazienka_wilgotnosc",
    devices: [bulb("switch.lazienka_swiatlo", "Światło"), { entity: "switch.lazienka_wentylator", name: "Wentylator", kind: "fan", action: "toggle" }],
    sections: [{ id: "lazienka-more", kicker: "POD KONTROLĄ", title: "Czujniki", icon: "mdi:shield-check-outline", items: [info("binary_sensor.lazienka_obecnosc", "Obecność"), info("binary_sensor.wyciek_prysznic", "Wyciek prysznic")] }],
  }),
  room({
    id: "pralnia",
    title: "Pralnia",
    icon: "mdi:washing-machine",
    accent: "#c3b3ff",
    subtitle: "Status cykli, programy i czas do końca — spokojnie, bez zgadywania.",
    sections: [
      { id: "pralka", kicker: "POD KONTROLĄ", title: "Pralka", icon: "mdi:washing-machine", items: [info("sensor.pralka_status", "Status", "washer"), info("sensor.pralka_pozostalo", "Czas pozostały"), info("select.pralka_temperatura", "Temperatura"), toggle("switch.pralka_para", "Para wodna"), info("sensor.pralka_energia", "Energia", "bolt")] },
      { id: "suszarka", kicker: "POD KONTROLĄ", title: "Suszarka", icon: "mdi:tumble-dryer", items: [info("sensor.suszarka_status", "Status", "dryer"), info("sensor.suszarka_pozostalo", "Czas pozostały")] },
      { id: "pralnia-alerts", kicker: "POD KONTROLĄ", title: "Alerty pralni", icon: "mdi:alert-circle-outline", accent: "#f7d89f", items: [info("binary_sensor.suszarka_pojemnik", "Pojemnik na wodę"), info("binary_sensor.wyciek_pralka", "Wyciek pralka")] },
    ],
  }),
  {
    id: "energia",
    title: "Energia",
    icon: "mdi:lightning-bolt",
    kind: "page",
    accent: "#86e6ec",
    subtitle: "Prąd, gaz i woda. Aktualne dane z Twoich liczników.",
    sections: [
      { id: "prad", kicker: "POD KONTROLĄ", title: "Energia elektryczna", icon: "mdi:lightning-bolt", items: [info("sensor.prad_koszt_dzis", "Koszt dziś"), info("sensor.prad_zuzycie_dzis", "Zużycie dziś", "bolt"), info("sensor.prad_pobor", "Pobór teraz", "bolt"), info("sensor.prad_cena", "Cena teraz")] },
      { id: "gaz", kicker: "POD KONTROLĄ", title: "Gaz", icon: "mdi:fire", accent: "#ffc391", items: [info("sensor.gaz_koszt_dzis", "Koszt gazu dziś"), info("sensor.gaz_zuzycie_dzis", "Zużycie dziś")] },
      { id: "woda", kicker: "POD KONTROLĄ", title: "Woda i paliwo", icon: "mdi:water", accent: "#97dcff", items: [info("sensor.woda_wczoraj", "Woda · wczoraj"), info("sensor.paliwo_e10", "Benzyna E10")] },
    ],
  },
  {
    id: "czujniki",
    title: "Czujniki",
    icon: "mdi:shield-home-outline",
    kind: "page",
    accent: "#f7d89f",
    subtitle: "Wycieki, czad i okna — wszystko w jednym miejscu.",
    sections: [
      { id: "alarm", kicker: "CZUJNIKI ALARMOWE", title: "Dom pod opieką", icon: "mdi:shield-check-outline", accent: "#f7d89f", items: [info("binary_sensor.wyciek_kuchnia", "Wyciek kuchnia"), info("binary_sensor.wyciek_pralka", "Wyciek pralka"), info("binary_sensor.wyciek_prysznic", "Wyciek prysznic"), info("binary_sensor.czujnik_co", "Czujnik CO")] },
      { id: "okna", kicker: "POD KONTROLĄ", title: "Okna i obecność", icon: "mdi:window-closed-variant", items: [info("binary_sensor.okno_kuchnia", "Okno kuchnia"), info("binary_sensor.okno_dziecko", "Okno pokój dziecka"), info("binary_sensor.wc_obecnosc", "Obecność WC"), info("binary_sensor.lazienka_obecnosc", "Obecność łazienka")] },
    ],
  },
  {
    id: "media",
    title: "Media",
    icon: "mdi:music-note-outline",
    kind: "page",
    accent: "#b4cdff",
    subtitle: "Muzyka w kuchni. Rozrywka w salonie i sypialni.",
    media: [
      { entity: "media_player.kuchnia_glosnik", name: "Głośnik · kuchnia" },
      { entity: "media_player.kuchnia_tv", name: "TV · kuchnia" },
    ],
  },
  {
    id: "f1",
    title: "F1",
    icon: "mdi:flag-checkered",
    kind: "page",
    accent: "#ff8f8f",
    subtitle: "Weekend, klasyfikacje i sesje na żywo.",
    sections: [],
  },
];

export const demoLayout: KrystalLayout = {
  version: 1,
  source: "demo",
  summary: {
    kicker: "Twój dom",
    title: "Dobrze być w domu.",
    subtitle: "Twój dom w jednym spojrzeniu. Wybierz pomieszczenie i zadbaj o swój komfort.",
    weather: "weather.demo_1",
    power: "sensor.prad_pobor",
    lights: LIGHTS,
    alerts: ALERTS,
  },
  pages,
};
