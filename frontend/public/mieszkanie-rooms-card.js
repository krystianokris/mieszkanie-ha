/* mieszkanie-rooms-card + mieszkanie-cats-card – based on Living House Card v0.4.0 (MIT) */
(() => {
"use strict";
/* ---------- Living House Card – shared helpers ---------- */
const LHC_VERSION = "0.4.0";
const LHC_BAD = ["unknown", "unavailable", undefined, null, ""];
const LHC_TV_ON = ["on", "playing", "paused", "buffering"];

const lhcEsc = (x) => String(x ?? "").replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
const lhcArr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
const lhcUniq = (a) => [...new Set(a.filter(Boolean))];

/* "#f59e0b" | "245,158,11" | [245,158,11] -> "245,158,11" */
function lhcRgb(c, fallback = "96,165,250") {
  if (!c) return fallback;
  if (Array.isArray(c)) return c.join(",");
  const s = String(c).trim();
  const m = s.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) {
    let h = m[1];
    if (h.length === 3) h = h.split("").map((x) => x + x).join("");
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(",");
  }
  return /^\d+\s*,\s*\d+\s*,\s*\d+$/.test(s) ? s.replace(/\s/g, "") : fallback;
}

/* ---------- i18n ---------- */
const lhcPlPlural = (n, one, few, many) => (n === 1 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? few : many);

const LHC_I18N = {
  en: {
    floor_up: "Floor up", floor_down: "Floor down",
    nav_home: "Home", nav_rooms: "Rooms", nav_energy: "Energy",
    search: "Search", settings: "Settings", add_scene: "Add scene",
    dn_auto: "Day/night: automatic", dn_day: "Forced day", dn_night: "Forced night",
    status_title: "Home status", all_ok: "All good", alarm_bang: "Alarm!",
    offline: (n) => `${n} ${n === 1 ? "device" : "devices"} offline`,
    lights: "Lights", lights_on: (n) => `${n} on`, all_off: "All off",
    heating: "Heating", heating_active: (n) => `${n} active`, inactive: "Inactive",
    ventilation: "Ventilation", running: "Running", off_f: "Off", no_data: "No data",
    security: "Security", air_quality: "Air quality",
    aq_good: "Good", aq_moderate: "Moderate", aq_unhealthy: "Unhealthy", aq_bad: "Poor",
    off_short: "off", heating_to: (t) => `heating → ${t}°`, target: (t) => `target ${t}°`, idle: "idle",
    air: "Air", purifier_off: "Off", none: "None", toggle_power: "Turn on / off",
    energy: "Energy", home_sfx: "(home)", today: "Today", cost_today: "Cost today",
    stale: "last known", stale_tip: "Weather service is not responding right now",
    occupied: "occupied", free: "free", n_on: (n) => `${n} on`,
    heatmap: "Heat map", lights_on_title: "Lights on", heating_tag: "heating",
    all_off_btn: "Turn all off", all_on_btn: "Turn all on", open_room: "Open room",
    no_entity: "missing entity", on_short: "on", detected: "detected", clear: "clear",
    no_devices: "No devices assigned to this room.",
    at_home: "inside", lights_count: (n) => (n === 1 ? "light" : "lights"), tap_return: "Tap to return",
    configure: "Add an image and rooms in the card configuration – or open the calibration mode.",
    // editor
    ed_title: "Calibration", ed_hint: "Drag labels to move them, drag the corner to resize. Select a room to draw its outline.",
    ed_shape: "Draw outline", ed_focus: "Zoom point", ed_screen: "TV screen", ed_undo: "Undo point", ed_done: "Finish",
    ed_copy: "Copy YAML", ed_copied: "Copied! Paste it into the card config (rooms:)", ed_close: "Close",
    ed_drawing: "Click on the image to add points. Finish when done.", ed_focus_hint: "Click the point the camera should zoom into.",
    ed_yaml_manual: "Copy the YAML below (Ctrl+C) and paste it into the card configuration:",
    // weather
    w: { "clear-night": "Clear", cloudy: "Cloudy", exceptional: "Exceptional", fog: "Fog", hail: "Hail", lightning: "Thunderstorm", "lightning-rainy": "Storm & rain", partlycloudy: "Partly cloudy", pouring: "Pouring", rainy: "Rain", snowy: "Snow", "snowy-rainy": "Sleet", sunny: "Sunny", windy: "Windy", "windy-variant": "Windy" },
    alarm: { armed_home: "Armed (home)", armed_away: "Armed", armed_night: "Armed (night)", armed_vacation: "Armed (vacation)", armed_custom_bypass: "Armed", disarmed: "Disarmed", arming: "Arming…", pending: "Pending…", triggered: "ALARM!" },
    media: { playing: "playing", paused: "paused", buffering: "buffering", on: "on", idle: "idle", off: "off", standby: "standby", unavailable: "offline" },
    // rooms card
    rooms_title: "Rooms", home: "Home", all_rooms: "All rooms",
    lights_n: (n) => `${n} ${n === 1 ? "light" : "lights"} on`, dark: "All dark", everything_ok: "Everything is fine",
    sec_lights: "Lights", sec_climate: "Climate", sec_media: "Media", sec_devices: "Devices", sec_sensors: "Sensors", sec_chart: "Last 24 hours",
    turn_off_all: "Turn all off", turn_on_all: "Turn all on",
    st_on: "On", st_off: "Off", st_running: "Running", st_offline: "offline",
    warm: "Warm", neutral: "Neutral", cool: "Cool",
    hvac: { heat: "Heat", cool: "Cool", auto: "Auto", heat_cool: "Auto", off: "Off", dry: "Dry", fan_only: "Fan" },
    action: { heating: "heating", cooling: "cooling", idle: "idle", off: "off", drying: "drying", fan: "fan" },
    now: (t) => `now ${t}°`, off_big: "Off",
    window_open: (n) => `${n} open`, open: "Open", closed: "Closed", leak: "LEAK!", dry: "Dry", co: "CO!", safe: "Safe",
    motion: "Motion", no_motion: "No motion", water_leak: "Water leak!", waterbox_full: "Water tank full",
    washer_alarm: "Washer: alarm", purifier: "Air purifier", manual: (p) => `Manual · ${p}%`, filter: "Filter",
    pm_unit: "PM2.5 µg/m³", feeder: "Pet feeder", feed_now: "Feed now", portions: (n) => (n === 1 ? "portion" : "portions"),
    feed_confirm: (n) => `Dispense ${n} ${n === 1 ? "portion" : "portions"}?`, litter: "Litter box", clean: "Clean",
    clean_confirm: "Start cleaning the litter box?", washer: "Washer", dryer: "Dryer",
    appl_offline: "Offline – unplugged or no Wi-Fi", min_left: "min left", empty_filter: "Clean the filter",
    loading_history: "Loading history…", no_history: "No history.", no_history_day: "No data from the last 24 h.",
    temperature: "Temperature", humidity: "Humidity", h24: "24 h ago", h18: "18 h", h12: "12 h", h6: "6 h", h0: "now",
    washer_st: { off: "Off", standby: "Standby", running: "Washing", paused: "Paused", alarm: "Alarm!" },
    dryer_st: { idle: "Idle", delay_start_waiting: "Delayed start", running: "Drying", anti_crease: "Anti-crease", finished: "Done" },
    feeder_st: { standby: "Ready", feeding: "Feeding…", feeding_complete: "Fed", fault: "Error" },
    litter_st: { standby: "Clean & ready", cleaning: "Cleaning…", working: "Working", full: "Full!", fault: "Error", caking: "Waiting to clean", occupied: "Cat inside", blocked: "Entrance blocked", off: "Off" },
    preset: { auto: "Auto", sleep: "Sleep", turbo: "Turbo", manual: "Manual" },
    aq_states: { excellent: "Excellent", good: "Good", moderate: "Moderate", poor: "Poor", very_poor: "Very poor" },
    dry_prog: { auto: "Auto", allergy_care: "Allergy care", refresh: "Refresh", sportswear: "Sportswear", towels: "Towels", time: "Timed", cotton: "Cotton", baby_care: "Baby care", synthetic: "Synthetics", wool: "Wool", delicates: "Delicates", quick_30: "Quick 30", shirts: "Shirts", bedding: "Bedding", down: "Down", eco: "Eco" },
    cold: "cold",
    printer: "3D printer", pr_model: "Model", pr_camera: "Camera", pr_layer: "Layer", pr_nozzle: "Nozzle", pr_bed: "Bed",
    pr_ends: (t) => `ends ${t}`, pr_left: "left", pr_pause: "Pause", pr_resume: "Resume", pr_stop: "Stop",
    pr_stop_confirm: "Stop the print? This cannot be undone.", pr_printing: (p) => `Printing ${p}%`, pr_failed: "Print failed!",
    pr_done: "Print done", pr_light: "Chamber light", pr_empty: "empty",
    pr_status: { running: "Printing", pause: "Paused", finish: "Done", failed: "Failed", idle: "Idle", prepare: "Preparing", slicing: "Slicing", init: "Starting", offline: "Offline", unknown: "—" },
    pr_stage: { heating_hotend: "Heating nozzle", heatbed_preheating: "Heating bed", auto_bed_leveling: "Bed levelling", changing_filament: "Changing filament", cleaning_nozzle_tip: "Cleaning nozzle", homing_toolhead: "Homing", filament_loading: "Loading filament", filament_unloading: "Unloading filament", inspecting_first_layer: "Checking first layer", calibrating_extrusion_flow: "Flow calibration", cooling_nozzle: "Cooling nozzle", paused_filament_runout: "Filament ran out!", paused_nozzle_clog: "Nozzle clogged!", paused_user: "Paused by user" },
    tv: "TV", tv_playing: "playing", washing: "Washing", drying: "Drying", clean_air: "Clean air", of_lights: "lights",
    // cats card
    cats_title: "Cat corner", cats_kicker: "Cat corner · live",
    scene_ok: "All good – clean and fed", scene_cleaning: "The litter box is cleaning itself…", scene_litter: (n) => `${n || "The cat"} is in the litter box`,
    scene_eating: (n) => `${n || "The cat"} is eating`, scene_full: "The litter bin is full – empty it", scene_problem: "Litter box problem – check it",
    scene_sleep: "Night mode – quiet", bin_full: "Bin full!", litter_problem: "Litter box problem", visits_today: "Visits today",
    cat_weight: "Cat weight", time_today: "Time today", last_portion: "Last meal", quick_feed: "Quick feed",
    quick_confirm: "Dispense a quick meal?", just_now: "just now", min_ago: (m) => `${m} min ago`, h_ago: (h) => `${h} h ago`,
  },
  pl: {
    floor_up: "Piętro wyżej", floor_down: "Piętro niżej",
    nav_home: "Dom", nav_rooms: "Pomieszczenia", nav_energy: "Energia",
    search: "Szukaj", settings: "Ustawienia", add_scene: "Dodaj scenę",
    dn_auto: "Dzień/noc: automatycznie", dn_day: "Wymuszony dzień", dn_night: "Wymuszona noc",
    status_title: "Status domu", all_ok: "Wszystko OK", alarm_bang: "Alarm!",
    offline: (n) => `${n} ${lhcPlPlural(n, "urządzenie", "urządzenia", "urządzeń")} offline`,
    lights: "Światła", lights_on: (n) => `${n} ${lhcPlPlural(n, "włączone", "włączone", "włączonych")}`, all_off: "Wszystkie wyłączone",
    heating: "Ogrzewanie", heating_active: (n) => `${n} ${lhcPlPlural(n, "aktywne", "aktywne", "aktywnych")}`, inactive: "Nieaktywne",
    ventilation: "Wentylacja", running: "Pracuje", off_f: "Wyłączona", no_data: "Brak danych",
    security: "Bezpieczeństwo", air_quality: "Jakość powietrza",
    aq_good: "Dobra", aq_moderate: "Umiarkowana", aq_unhealthy: "Niezdrowa", aq_bad: "Zła",
    off_short: "wył.", heating_to: (t) => `grzeje → ${t}°`, target: (t) => `cel ${t}°`, idle: "czuwa",
    air: "Powietrze", purifier_off: "Wyłączony", none: "Brak", toggle_power: "Włącz / wyłącz",
    energy: "Energia", home_sfx: "(dom)", today: "Dziś", cost_today: "Koszt dziś",
    stale: "ostatnie dane", stale_tip: "Serwis pogody chwilowo nie odpowiada",
    occupied: "zajęte", free: "wolne", n_on: (n) => `${n} wł.`,
    heatmap: "Mapa ciepła", lights_on_title: "Włączone światła", heating_tag: "grzeje",
    all_off_btn: "Zgaś wszystkie", all_on_btn: "Zapal wszystkie", open_room: "Otwórz pokój",
    no_entity: "brak encji", on_short: "wł.", detected: "wykryto", clear: "brak",
    no_devices: "Brak przypisanych urządzeń w tym pomieszczeniu.",
    at_home: "w domu", lights_count: (n) => lhcPlPlural(n, "światło", "światła", "świateł"), tap_return: "Dotknij, aby wrócić",
    configure: "Dodaj obraz i pokoje w konfiguracji karty – albo otwórz tryb kalibracji.",
    ed_title: "Kalibracja", ed_hint: "Przeciągaj plakietki, róg zmienia rozmiar. Wybierz pokój, żeby narysować jego obrys.",
    ed_shape: "Rysuj obrys", ed_focus: "Punkt przybliżenia", ed_screen: "Ekran TV", ed_undo: "Cofnij punkt", ed_done: "Zakończ",
    ed_copy: "Kopiuj YAML", ed_copied: "Skopiowano! Wklej do konfiguracji karty (rooms:)", ed_close: "Zamknij",
    ed_drawing: "Klikaj na obrazku, żeby dodawać punkty. Na koniec „Zakończ”.", ed_focus_hint: "Kliknij miejsce, które ma być przybliżane.",
    ed_yaml_manual: "Skopiuj YAML poniżej (Ctrl+C) i wklej do konfiguracji karty:",
    w: { "clear-night": "Bezchmurnie", cloudy: "Zachmurzenie", exceptional: "Nietypowo", fog: "Mgła", hail: "Grad", lightning: "Burza", "lightning-rainy": "Burza z deszczem", partlycloudy: "Częściowe zachmurzenie", pouring: "Ulewa", rainy: "Deszcz", snowy: "Śnieg", "snowy-rainy": "Deszcz ze śniegiem", sunny: "Słonecznie", windy: "Wietrznie", "windy-variant": "Wietrznie" },
    alarm: { armed_home: "Uzbrojone (w domu)", armed_away: "Uzbrojone", armed_night: "Uzbrojone (noc)", armed_vacation: "Uzbrojone (urlop)", armed_custom_bypass: "Uzbrojone", disarmed: "Rozbrojone", arming: "Uzbrajanie…", pending: "Oczekiwanie…", triggered: "ALARM!" },
    media: { playing: "odtwarza", paused: "pauza", buffering: "buforuje", on: "włączony", idle: "bezczynny", off: "wyłączony", standby: "czuwanie", unavailable: "offline" },
    rooms_title: "Pomieszczenia", home: "Dom", all_rooms: "Pomieszczenia",
    lights_n: (n) => `${n} ${lhcPlPlural(n, "światło", "światła", "świateł")}`, dark: "Ciemno", everything_ok: "Wszystko w porządku",
    sec_lights: "Światła", sec_climate: "Klimat", sec_media: "Multimedia", sec_devices: "Urządzenia", sec_sensors: "Czujniki", sec_chart: "Ostatnie 24 godziny",
    turn_off_all: "Zgaś wszystkie", turn_on_all: "Zapal wszystkie",
    st_on: "Włączone", st_off: "Wyłączone", st_running: "Pracuje", st_offline: "offline",
    warm: "Ciepłe", neutral: "Neutralne", cool: "Zimne",
    hvac: { heat: "Grzanie", cool: "Chłodzenie", auto: "Auto", heat_cool: "Auto", off: "Wył.", dry: "Osuszanie", fan_only: "Wiatrak" },
    action: { heating: "grzeje", cooling: "chłodzi", idle: "czuwa", off: "wyłączone", drying: "osusza", fan: "wentyluje" },
    now: (t) => `teraz ${t}°`, off_big: "Wył.",
    window_open: (n) => `${n} otwarte`, open: "Otwarte", closed: "Zamknięte", leak: "WYCIEK!", dry: "Sucho", co: "CZAD!", safe: "Bezpiecznie",
    motion: "Wykryto", no_motion: "Brak ruchu", water_leak: "Wyciek wody!", waterbox_full: "Pełny pojemnik",
    washer_alarm: "Pralka: alarm", purifier: "Oczyszczacz", manual: (p) => `Ręczny · ${p}%`, filter: "Filtr",
    pm_unit: "PM2.5 µg/m³", feeder: "Karmnik", feed_now: "Nakarm teraz", portions: (n) => lhcPlPlural(n, "porcja", "porcje", "porcji"),
    feed_confirm: (n) => `Podać ${n} ${lhcPlPlural(n, "porcję", "porcje", "porcji")}?`, litter: "Kuweta", clean: "Sprzątnij",
    clean_confirm: "Uruchomić sprzątanie kuwety?", washer: "Pralka", dryer: "Suszarka",
    appl_offline: "Offline – wyłączona z prądu lub Wi-Fi", min_left: "min do końca", empty_filter: "Wyczyść filtr",
    loading_history: "Wczytywanie historii…", no_history: "Brak historii.", no_history_day: "Brak danych z ostatniej doby.",
    temperature: "Temperatura", humidity: "Wilgotność", h24: "24 h temu", h18: "18 h", h12: "12 h", h6: "6 h", h0: "teraz",
    washer_st: { off: "Wyłączona", standby: "Czuwanie", running: "Pierze", paused: "Pauza", alarm: "Alarm!" },
    dryer_st: { idle: "Bezczynna", delay_start_waiting: "Opóźniony start", running: "Suszy", anti_crease: "Przeciw zagnieceniom", finished: "Gotowe" },
    feeder_st: { standby: "Gotowy", feeding: "Karmi…", feeding_complete: "Nakarmiony", fault: "Błąd" },
    litter_st: { standby: "Czysta, gotowa", cleaning: "Sprzątanie…", working: "Pracuje", full: "Pełna!", fault: "Błąd", caking: "Czeka na sprzątanie", occupied: "Kot w środku", blocked: "Wejście zablokowane", off: "Wyłączona" },
    preset: { auto: "Auto", sleep: "Sen", turbo: "Turbo", manual: "Ręczny" },
    aq_states: { excellent: "Doskonała", good: "Dobra", moderate: "Umiarkowana", poor: "Słaba", very_poor: "Bardzo słaba" },
    dry_prog: { auto: "Auto", allergy_care: "Antyalergiczny", refresh: "Odświeżanie", sportswear: "Sportowe", towels: "Ręczniki", time: "Czasowy", cotton: "Bawełna", baby_care: "Dziecięce", synthetic: "Syntetyki", wool: "Wełna", delicates: "Delikatne", quick_30: "Szybki 30", shirts: "Koszule", bedding: "Pościel", down: "Puch", eco: "Eco" },
    cold: "zimna",
    printer: "Drukarka 3D", pr_model: "Model", pr_camera: "Kamera", pr_layer: "Warstwa", pr_nozzle: "Dysza", pr_bed: "Stół",
    pr_ends: (t) => `koniec ${t}`, pr_left: "do końca", pr_pause: "Pauza", pr_resume: "Wznów", pr_stop: "Stop",
    pr_stop_confirm: "Przerwać wydruk? Tego nie da się cofnąć.", pr_printing: (p) => `Drukuje ${p}%`, pr_failed: "Wydruk nieudany!",
    pr_done: "Wydruk gotowy", pr_light: "Oświetlenie komory", pr_empty: "pusty",
    pr_status: { running: "Drukuje", pause: "Pauza", finish: "Gotowe", failed: "Błąd", idle: "Bezczynna", prepare: "Przygotowanie", slicing: "Przygotowanie pliku", init: "Start", offline: "Offline", unknown: "—" },
    pr_stage: { heating_hotend: "Nagrzewanie dyszy", heatbed_preheating: "Nagrzewanie stołu", auto_bed_leveling: "Poziomowanie stołu", changing_filament: "Zmiana filamentu", cleaning_nozzle_tip: "Czyszczenie dyszy", homing_toolhead: "Bazowanie", filament_loading: "Ładowanie filamentu", filament_unloading: "Wyładowanie filamentu", inspecting_first_layer: "Kontrola 1. warstwy", calibrating_extrusion_flow: "Kalibracja przepływu", cooling_nozzle: "Chłodzenie dyszy", paused_filament_runout: "Skończył się filament!", paused_nozzle_clog: "Zatkana dysza!", paused_user: "Wstrzymane" },
    tv: "TV", tv_playing: "gra", washing: "Pierze", drying: "Suszy", clean_air: "Czyste", of_lights: "świateł",
    cats_title: "Kocia strefa", cats_kicker: "Kocia strefa · na żywo",
    scene_ok: "Wszystko gra – czysto i pełna miska", scene_cleaning: "Kuweta się sprząta…", scene_litter: (n) => `${n || "Kot"} jest w kuwecie`,
    scene_eating: (n) => `${n || "Kot"} je`, scene_full: "Pojemnik kuwety pełny – opróżnij", scene_problem: "Problem z kuwetą – sprawdź",
    scene_sleep: "Tryb nocny – cisza", bin_full: "Pojemnik pełny!", litter_problem: "Problem z kuwetą", visits_today: "Wizyty dziś",
    cat_weight: "Waga kota", time_today: "Czas dziś", last_portion: "Ostatni posiłek", quick_feed: "Szybkie karmienie",
    quick_confirm: "Podać szybki posiłek?", just_now: "przed chwilą", min_ago: (m) => `${m} min temu`, h_ago: (h) => `${h} h temu`,
  },
};

function lhcLang(hass, cfg) {
  const l = String((cfg && cfg.language) || (hass && ((hass.locale && hass.locale.language) || hass.language)) || "en").slice(0, 2).toLowerCase();
  return LHC_I18N[l] ? l : "en";
}
function lhcT(lang, key, arg) {
  const v = (LHC_I18N[lang] && LHC_I18N[lang][key]) ?? LHC_I18N.en[key];
  if (typeof v === "function") return v(arg);
  return v ?? key;
}
function lhcMap(lang, group, key, fallback) {
  const g = (LHC_I18N[lang] && LHC_I18N[lang][group]) || LHC_I18N.en[group] || {};
  return g[key] ?? fallback ?? key;
}

/* ---------- akcje (sceny) ----------
 * actions: [{ action: "light.turn_off", target: { entity_id: [...] }, data: {...} }]
 * data.temperature może być względna: "+1" / "-0.5" (liczona od obecnego celu termostatu).
 */
async function lhcRunActions(hass, actions) {
  for (const a of lhcArr(actions)) {
    const name = a.action || a.service || a.perform_action;
    if (!name || !name.includes(".")) continue;
    const [domain, service] = name.split(".");
    const data = { ...(a.data || a.service_data || {}) };
    const target = a.target ? { ...a.target } : undefined;
    if (typeof data.temperature === "string" && /^[+-]/.test(data.temperature)) {
      const ent = lhcArr((target && target.entity_id) || data.entity_id)[0];
      const st = ent && hass.states[ent];
      const base = Number(st && st.attributes.temperature);
      if (Number.isFinite(base)) {
        let v = base + parseFloat(data.temperature);
        const mn = st.attributes.min_temp, mx = st.attributes.max_temp;
        if (Number.isFinite(mn)) v = Math.max(mn, v);
        if (Number.isFinite(mx)) v = Math.min(mx, v);
        data.temperature = Math.round(v * 10) / 10;
      } else delete data.temperature;
    }
    await hass.callService(domain, service, data, target);
  }
}

function lhcNavigate(path) {
  history.pushState(null, "", path);
  window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
}

/* ---------- prosty generator YAML (dla trybu kalibracji) ---------- */
function lhcScalar(x) {
  if (x === null || x === undefined) return "null";
  if (typeof x === "number" || typeof x === "boolean") return String(x);
  const s = String(x);
  const plain = /^[A-Za-z_/][\w.\-/+:#%]*( [\w.\-/+:#%]+)*$/.test(s) && !/:\s/.test(s) && !/^(true|false|null|yes|no|on|off)$/i.test(s);
  return plain ? s : JSON.stringify(s);
}
function lhcYaml(v, ind = 0) {
  const pad = "  ".repeat(ind);
  const flat = (o) => o && typeof o === "object" && !Array.isArray(o) && Object.values(o).every((y) => typeof y === "number");
  if (Array.isArray(v)) {
    return v.map((x) => {
      if (Array.isArray(x)) return `${pad}- [${x.map(lhcScalar).join(", ")}]`;
      if (x && typeof x === "object") return `${pad}- ${lhcYaml(x, ind + 1).trimStart()}`;
      return `${pad}- ${lhcScalar(x)}`;
    }).join("\n");
  }
  return Object.entries(v).filter(([, x]) => x !== undefined).map(([k, x]) => {
    if (Array.isArray(x)) {
      if (!x.length) return `${pad}${k}: []`;
      if (x.every((y) => y === null || typeof y !== "object")) return `${pad}${k}: [${x.map(lhcScalar).join(", ")}]`;
      return `${pad}${k}:\n${lhcYaml(x, ind + 1)}`;
    }
    if (flat(x)) return `${pad}${k}: {${Object.entries(x).map(([a, b]) => `${a}: ${b}`).join(", ")}}`;
    if (x && typeof x === "object") return `${pad}${k}:\n${lhcYaml(x, ind + 1)}`;
    return `${pad}${k}: ${lhcScalar(x)}`;
  }).join("\n");
}

/* czas pozostały (sensor w h / min / s) -> "1 h 12 min" */
function lhcDuration(st) {
  if (!st || LHC_BAD.includes(st.state)) return null;
  let v = Number(st.state);
  if (!Number.isFinite(v)) return null;
  const u = (st.attributes.unit_of_measurement || "min").toLowerCase();
  let m = u === "h" ? v * 60 : u === "s" ? v / 60 : u === "d" ? v * 1440 : v;
  m = Math.round(m);
  if (m <= 0) return null;
  const h = Math.floor(m / 60);
  return h ? `${h} h ${m % 60} min` : `${m} min`;
}
function lhcRemainingMin(st) {
  if (!st || LHC_BAD.includes(st.state)) return 0;
  const v = Number(st.state), u = (st.attributes.unit_of_measurement || "min").toLowerCase();
  return Number.isFinite(v) ? (u === "h" ? v * 60 : u === "s" ? v / 60 : v) : 0;
}


/* ---------- Living House Card – rooms hub + room views ----------
 * type: custom:living-rooms-card
 */
const LRC_PALETTE = ["245,158,11", "52,211,153", "244,114,182", "236,72,153", "56,189,248", "251,191,36", "167,139,250", "96,165,250", "248,113,113", "45,212,191"];
const LRC_HVAC_ICON = { heat: "mdi:fire", cool: "mdi:snowflake", auto: "mdi:autorenew", heat_cool: "mdi:sun-snowflake-variant", off: "mdi:power", dry: "mdi:water-percent", fan_only: "mdi:fan" };
const LRC_AQ_OK = ["excellent", "good"];
const LRC_SWATCHES = [[255, 180, 110], [255, 244, 229], [255, 92, 170], [168, 85, 247], [59, 130, 246], [16, 185, 129], [250, 204, 21], [239, 68, 68]];
const LRC_KELVIN = [[2700, "warm"], [4000, "neutral"], [6000, "cool"]];
/* style: krystal – mdi icon -> glass 3D picture (soft-<key>.webp in art_base); first match wins */
const LRC_ART = [
  ["floor-lamp", "floor-lamp"], ["air-purifier", "purifier"], ["air-conditioner", "ac"],
  ["lightbulb|ceiling-light|led|lamp|light|chandelier|sconce", "bulb"], ["power-socket|power-plug|outlet", "plug"],
  ["fan", "extractor-fan"], ["radiator", "radiator"], ["heating-coil|fire", "flame"], ["thermostat", "dial"], ["thermometer", "thermometer"],
  ["washing-machine", "washer"], ["tumble-dryer", "dryer"], ["printer-3d", "printer"], ["window", "window"], ["door", "door"],
  ["water-alert|water-check|pipe-leak", "leak"], ["molecule-co|shield-check", "co"], ["smoke", "smoke"], ["motion", "motion"],
  ["battery", "battery"], ["water-percent|humidity", "humidity"], ["molecule|leaf", "air"], ["speaker", "speaker"],
  ["television", "tv"], ["cctv|camera|webcam", "camera"],
].map(([re, k]) => [new RegExp(re), k]);
const LRC_SENSOR_KIND = { window: "window", door: "window", opening: "window", garage_door: "window", moisture: "leak", carbon_monoxide: "co", gas: "co", smoke: "co", motion: "motion", occupancy: "motion", presence: "motion", battery: "battery", pm25: "pm", aqi: "aq" };

class LivingRoomsCard extends HTMLElement {
  static getStubConfig() {
    return { home_path: "/lovelace/0", rooms: [{ id: "living", name: "Living room", icon: "mdi:sofa-outline", image: "/local/living-house/rooms/living.webp", lights: [] }] };
  }

  setConfig(config) {
    if (!config || !Array.isArray(config.rooms)) throw new Error("living-rooms-card: add a `rooms:` list");
    this._cfg = { home_path: null, title: null, fit: true, ...config };
    this._artBase = this._cfg.style === "krystal" ? String(this._cfg.art_base || "/krystal_twin_static/art/").replace(/\/?$/, "/") : null;
    this._pending = {};
    this._busy = {};
    this._hist = {};
    this._normalize();
    this._allIds = null;
    if (this._root) { this._root.innerHTML = ""; this._root = null; this.shadowRoot && (this.shadowRoot.innerHTML = ""); }
  }
  _t(k, a) { return lhcT(this._lang || "en", k, a); }
  _m(g, k, f) { return lhcMap(this._lang || "en", g, k, f); }

  _normalize() {
    const ent = (x) => (typeof x === "string" ? { entity: x } : x || {});
    this._rooms = this._cfg.rooms.map((r, i) => {
      const id = String(r.id || `room${i + 1}`).replace(/[^\w-]/g, "-");
      const t = r.temperature;
      return {
        id, name: r.name || id, icon: r.icon || "mdi:home-outline", image: r.image || "", subtitle: r.subtitle || "", link: r.link || null,
        accent: lhcRgb(r.accent, LRC_PALETTE[i % LRC_PALETTE.length]), size: r.size || (i === 0 ? "big" : "normal"),
        temp: t && !String(t).startsWith("climate.") ? t : null, tempClimate: t && String(t).startsWith("climate.") ? t : null,
        hum: r.humidity || null,
        lights: lhcArr(r.lights).map(ent).filter((x) => x.entity).map((x) => [x.entity, x.name || null, x.icon || null, x.type === "fan" ? "fan" : null]),
        climate: lhcArr(r.climate).map(ent).filter((x) => x.entity).map((x, k) => [x.entity, x.name || null, x.type || (k === 0 ? "main" : "trv")]),
        media: lhcArr(r.media).map(ent).filter((x) => x.entity).map((x) => [x.entity, x.name || null, x.volume_entity || null, !!x.speaker]),
        sensors: lhcArr(r.sensors).map(ent).filter((x) => x.entity).map((x) => [x.entity, x.name || null, x.type || null]),
        devices: lhcArr(r.devices).map((d) => this._normDevice(d)).filter(Boolean),
      };
    });
  }
  _img(r) {
    const v = r.image || "";
    if (/^(camera|image)\./.test(v)) { const st = this._hass && this._hass.states[v]; return st && st.attributes.entity_picture ? st.attributes.entity_picture : ""; }
    return v;
  }
  _normDevice(d) {
    if (!d || !d.type) return null;
    const sw = (l) => lhcArr(l).map((x) => (typeof x === "string" ? { entity: x } : x)).filter((x) => x.entity);
    switch (d.type) {
      case "purifier": return { type: "purifier", fan: d.entity || d.fan, pm: d.pm25, filter: d.filter, name: d.name };
      case "pet_feeder": case "feeder": return { type: "feeder", status: d.status, manual: d.portions || d.manual, switches: sw(d.switches), name: d.name };
      case "litter_box": case "litter": return { type: "litter", status: d.status, clean: d.clean, switches: sw(d.switches), name: d.name };
      case "washer": return { type: "washer", status: d.status, remaining: d.remaining, temp: d.temperature, name: d.name };
      case "printer": case "3d_printer": return {
        type: "printer", name: d.name, status: d.status, stage: d.stage, progress: d.progress, remaining: d.remaining, end_time: d.end_time,
        layer: d.layer, total_layers: d.total_layers, task: d.task, nozzle: d.nozzle, nozzle_target: d.nozzle_target, bed: d.bed, bed_target: d.bed_target,
        image: d.image, camera: d.camera, light: d.light, pause: d.pause, resume: d.resume, stop: d.stop,
        filaments: lhcArr(d.filaments).map((x) => (typeof x === "string" ? x : x && x.entity)).filter(Boolean),
      };
      case "dryer": return { type: "dryer", status: d.status, remaining: d.remaining, program: d.program, water: d.water_full, filter: d.filter, name: d.name };
      default: return null;
    }
  }
  getCardSize() { return 12; }

  connectedCallback() {
    this._onPop = this._onPop || (() => this._route());
    window.addEventListener("popstate", this._onPop);
    window.addEventListener("hashchange", this._onPop);
    this._onKey = this._onKey || ((e) => {
      if (!this._view) return;
      if (e.key === "Escape") this._goHub();
      if (e.key === "ArrowRight") this._step(1);
      if (e.key === "ArrowLeft") this._step(-1);
    });
    window.addEventListener("keydown", this._onKey);
    this._onResize = this._onResize || (() => this._fit());
    window.addEventListener("resize", this._onResize);
    if (!this._ro && window.ResizeObserver) this._ro = new ResizeObserver(() => { const w = this.clientWidth; if (w !== this._lastW && this._root) { this._lastW = w; this._fit(); } });
    if (this._ro) this._ro.observe(this);
    this._clock = setInterval(() => this._renderClock(), 15000);
    clearInterval(this._camT);
    this._camT = setInterval(() => {
      if (!this._view || document.hidden || !this._root) return;
      this._root.querySelectorAll("img[data-cam]").forEach((im) => {
        const st = this._hass && this._hass.states[im.dataset.cam];
        if (st && st.attributes.entity_picture) im.src = `${st.attributes.entity_picture}&_=${Date.now()}`;
      });
    }, 8000);
    if (this._root) { this._route(); this._fit(); }
  }
  disconnectedCallback() {
    window.removeEventListener("popstate", this._onPop);
    window.removeEventListener("hashchange", this._onPop);
    window.removeEventListener("keydown", this._onKey);
    window.removeEventListener("resize", this._onResize);
    if (this._ro) this._ro.disconnect();
    clearInterval(this._clock);
    clearInterval(this._camT);
  }

  set hass(h) {
    const old = this._hass;
    this._hass = h;
    this._lang = lhcLang(h, this._cfg);
    if (!this._root) { this._build(); this._route(); this._update(); return; }
    if (!old || this._changed(old, h)) this._update();
  }

  /* ---------- pomocnicze ---------- */
  _s(id) { return id ? this._hass.states[id] : undefined; }
  _ok(id) { const s = this._s(id); return !!s && !LHC_BAD.includes(s.state); }
  _on(id) { const s = this._s(id); return !!s && s.state === "on"; }
  _num(v, d = 1) { const n = Number(v); return v !== null && v !== "" && v !== undefined && Number.isFinite(n) ? n.toFixed(d) : "—"; }
  _icon(i, extra = "") { return `<ha-icon icon="${i}" ${extra}></ha-icon>`; }
  /* device icon: a glass 3D picture in style krystal, otherwise the mdi icon */
  _ic(i, cls = "", key = null) {
    const k = this._artBase && (key || (LRC_ART.find(([re]) => re.test(i)) || [])[1]);
    return k ? `<img class="art ${cls}" src="${this._artBase}soft-${k}.webp" alt="" draggable="false" loading="lazy">` : this._icon(i, cls ? `class="${cls}"` : "");
  }
  _call(d, s, data) { return this._hass.callService(d, s, data); }
  _name(id, name) { return lhcEsc(name || (this._s(id) && this._s(id).attributes.friendly_name) || id); }
  _ids(r) {
    const ids = [r.temp, r.hum, r.tempClimate];
    r.lights.forEach((l) => ids.push(l[0]));
    r.climate.forEach((c) => ids.push(c[0]));
    r.media.forEach((m) => ids.push(m[0], m[2]));
    r.sensors.forEach((s) => ids.push(s[0]));
    r.devices.forEach((d) => Object.entries(d).forEach(([k, v]) => {
      if (k === "switches") v.forEach((x) => ids.push(x.entity));
      else if (k === "filaments") v.forEach((x) => ids.push(x));
      else if (!["type", "name"].includes(k)) ids.push(v);
    }));
    return ids.filter(Boolean);
  }
  _changed(a, b) {
    if (!this._allIds) this._allIds = [...new Set(this._rooms.flatMap((r) => this._ids(r)))];
    return this._allIds.some((id) => a.states[id] !== b.states[id]);
  }
  _kind(id, kind) {
    if (kind) return kind;
    const s = this._s(id);
    const dc = s && s.attributes.device_class;
    return LRC_SENSOR_KIND[dc] || (id.startsWith("binary_sensor.") ? "binary" : "value");
  }
  _temp(r) {
    if (r.temp) return this._ok(r.temp) ? this._num(this._s(r.temp).state) : null;
    if (r.tempClimate) { const s = this._s(r.tempClimate); return s ? this._num(s.attributes.current_temperature) : null; }
    return null;
  }
  _lights(r) {
    const avail = r.lights.filter((l) => l[3] !== "fan" && this._ok(l[0]));
    return { on: avail.filter((l) => this._on(l[0])).length, total: avail.length };
  }
  _tvPlaying(r) { return r.media.some((m) => { const s = this._s(m[0]); return s && !m[3] && LHC_TV_ON.includes(s.state); }); }
  _alerts(r) {
    const out = [];
    r.sensors.forEach(([id, name, k]) => {
      const kind = this._kind(id, k), on = this._on(id);
      if (kind === "window" && on) out.push(["mdi:window-open-variant", this._t("window_open", this._name(id, name)), "warn"]);
      if (kind === "leak" && on) out.push(["mdi:water-alert", this._t("water_leak"), "bad"]);
      if (kind === "co" && on) out.push(["mdi:molecule-co", this._t("co"), "bad"]);
    });
    r.devices.forEach((d) => {
      if (d.type === "dryer" && this._on(d.water)) out.push(["mdi:cup-water", this._t("waterbox_full"), "warn"]);
      if (d.type === "washer" && this._s(d.status)?.state === "alarm") out.push(["mdi:alert", this._t("washer_alarm"), "bad"]);
      if (d.type === "printer" && this._s(d.status)?.state === "failed") out.push(["mdi:printer-3d-nozzle-alert", this._t("pr_failed"), "bad"]);
    });
    return out;
  }

  /* ---------- szkielet ---------- */
  _build() {
    this._root = this.shadowRoot || this.attachShadow({ mode: "open" });
    this._root.innerHTML = `<style>${LRC_STYLE}</style>
      <div class="page ${this._artBase ? "krystal" : ""}">
        <div class="bg"><div class="bg-img" id="bgimg"></div><i class="orb o1"></i><i class="orb o2"></i><div class="bg-dim"></div></div>
        <div class="stage">
          <div class="hub" id="hub"></div>
          <div class="room" id="room" hidden></div>
        </div>
      </div>`;
    if (!this._wired) {
      this._root.addEventListener("click", (e) => this._click(e));
      this._root.addEventListener("input", (e) => this._input(e));
      this._root.addEventListener("change", (e) => this._change(e));
      this._wired = true;
    }
    this._el = (id) => this._root.getElementById(id);
    this._view = null;
    this._buildHub();
    this._fit();
    requestAnimationFrame(() => this._fit());
    setTimeout(() => this._fit(), 300);
  }

  _route() {
    const id = decodeURIComponent((location.hash || "").slice(1));
    const r = this._rooms.find((x) => x.id === id && !x.link);
    if (r && this._view !== r.id) this._showRoom(r.id, null);
    else if (!r && this._view) this._showHub();
  }

  /* ---------- HUB ---------- */
  _layout() {
    const span = { big: 4, wide: 2, tall: 2, normal: 1 };
    const sizes = this._rooms.map((r) => (span[r.size] ? r.size : "normal"));
    let cells = sizes.reduce((a, s) => a + span[s], 0);
    const rows = Math.max(1, Math.ceil(cells / 4));
    let empty = rows * 4 - cells;
    for (let i = sizes.length - 1; i >= 0 && empty > 0; i--) if (sizes[i] === "normal") { sizes[i] = "wide"; empty--; }
    return { sizes, rows };
  }
  _buildHub() {
    const hub = this._el("hub");
    const { sizes, rows } = this._layout();
    const home = this._cfg.home_path;
    hub.innerHTML = `
      <header class="hhd rise">
        ${home ? `<button class="back home glass" data-nav="${lhcEsc(home)}" title="${this._t("home")}">${this._icon("mdi:home-outline")}<span>${this._t("home")}</span></button>` : ""}
        <div class="htitle"><div class="kicker" id="clock"></div><h1>${lhcEsc(this._cfg.title || this._t("rooms_title"))}</h1></div>
        <div class="hsum" id="hsum"></div>
      </header>
      <div class="bento" style="--rows:${rows}">
        ${this._rooms.map((r, i) => `
          <article class="tile t-${r.id} sz-${sizes[i]} rise" style="--d:${i + 1};--acc:${r.accent}" ${r.link ? `data-nav="${lhcEsc(r.link)}"` : `data-open="${r.id}"`}>
            <div class="t-img" style="${this._img(r) ? `background-image:url('${lhcEsc(this._img(r))}')` : ""}"></div>
            <div class="t-shade"></div><div class="t-glare"></div>
            <div class="t-top">
              <span class="t-ic glass">${this._icon(r.icon)}</span>
              <span class="t-badges" data-k="badges"></span>
              ${r.lights.length ? `<button class="t-bulb glass" data-roomlights="${r.id}" data-k="bulb">${this._icon("mdi:lightbulb-outline")}</button>` : ""}
            </div>
            <div class="t-bottom">
              <div class="t-name">${lhcEsc(r.name)}</div>
              ${r.subtitle ? `<div class="t-sub">${lhcEsc(r.subtitle)}</div>` : ""}
              <div class="t-chips" data-k="chips"></div>
            </div>
          </article>`).join("")}
      </div>`;
    this._setupTilt(hub);
    this._renderClock();
  }

  _renderClock() {
    const el = this._el && this._el("clock");
    if (!el || !this._hass) return;
    const tz = this._hass.config.time_zone, now = new Date(), loc = this._lang === "pl" ? "pl-PL" : undefined;
    try {
      const d = new Intl.DateTimeFormat(loc, { timeZone: tz, weekday: "long", day: "numeric", month: "long" }).format(now);
      const t = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
      el.textContent = `${d} · ${t}`;
    } catch (e) { el.textContent = now.toLocaleString(); }
  }

  _updateHub() {
    let lightsOn = 0;
    const alerts = [];
    this._rooms.forEach((r) => {
      const t = this._root.querySelector(`.t-${r.id}`);
      if (!t) return;
      const L = this._lights(r);
      lightsOn += L.on;
      const frac = L.total ? L.on / L.total : 1;
      t.style.setProperty("--lit", (r.lights.length ? (L.on ? 0.55 + 0.45 * frac : 0) : 0.8).toFixed(2));
      t.classList.toggle("lit", L.on > 0);
      t.classList.toggle("dark", r.lights.length > 0 && !L.on);
      const temp = this._temp(r), hum = r.hum && this._ok(r.hum) ? this._num(this._s(r.hum).state, 0) : null;
      const al = this._alerts(r);
      al.forEach((a) => alerts.push([r, ...a]));
      const chips = [];
      if (temp && temp !== "—") chips.push(`<span class="chip">${this._icon("mdi:thermometer", 'class="amber"')}${temp}°</span>`);
      if (hum) chips.push(`<span class="chip">${this._icon("mdi:water-outline", 'class="blue"')}${hum}%</span>`);
      if (L.total) chips.push(`<span class="chip ${L.on ? "on" : ""}">${this._icon(L.on ? "mdi:lightbulb-on" : "mdi:lightbulb-outline", `class="${L.on ? "yellow" : "grey"}"`)}${L.on}/${L.total}</span>`);
      if (this._tvPlaying(r)) chips.push(`<span class="chip tv">${this._icon("mdi:television-play")}${this._t("tv")}</span>`);
      r.devices.forEach((d) => {
        if (d.type === "washer" && this._s(d.status)?.state === "running") chips.push(`<span class="chip">${this._icon("mdi:washing-machine", 'class="violet spin"')}${this._t("washing")}</span>`);
        if (d.type === "dryer" && this._s(d.status)?.state === "running") chips.push(`<span class="chip">${this._icon("mdi:tumble-dryer", 'class="violet spin"')}${this._t("drying")}</span>`);
        if (d.type === "printer") {
          const pst = this._s(d.status), st = pst && pst.state, pr = Math.round(Number(this._s(d.progress)?.state) || 0);
          if (st === "running" || st === "prepare") chips.push(`<span class="chip pr">${this._icon("mdi:printer-3d-nozzle", 'class="cyan pulse-ic"')}${this._t("pr_printing", pr)}</span>`);
          if (st === "pause") chips.push(`<span class="chip">${this._icon("mdi:pause-circle-outline", 'class="amber"')}${this._m("pr_status", "pause")}</span>`);
          if (st === "finish" && Date.now() - new Date(pst.last_changed).getTime() < 6 * 3600e3) chips.push(`<span class="chip">${this._icon("mdi:check-circle-outline", 'class="green"')}${this._t("pr_done")}</span>`);
        }
        if (d.type === "purifier" && this._on(d.fan)) chips.push(`<span class="chip">${this._icon("mdi:air-purifier", 'class="green"')}${this._t("clean_air")}</span>`);
      });
      t.querySelector('[data-k="chips"]').innerHTML = chips.join("");
      t.querySelector('[data-k="badges"]').innerHTML = al.map((a) => `<span class="alert ${a[2]}">${this._icon(a[0])}<span>${a[1]}</span></span>`).join("");
      const b = t.querySelector('[data-k="bulb"]');
      if (b) { b.classList.toggle("on", L.on > 0); b.innerHTML = this._icon(L.on ? "mdi:lightbulb-on" : "mdi:lightbulb-outline"); }
    });
    const sum = [];
    sum.push(`<span class="pill glass">${this._icon(lightsOn ? "mdi:lightbulb-on" : "mdi:lightbulb-outline", `class="${lightsOn ? "yellow" : "grey"}"`)}${lightsOn ? this._t("lights_n", lightsOn) : this._t("dark")}</span>`);
    if (alerts.length) alerts.slice(0, 3).forEach(([r, ic, txt, lvl]) => sum.push(`<span class="pill glass ${lvl}" data-open="${r.id}">${this._icon(ic)}${lhcEsc(r.name)}: ${txt}</span>`));
    else sum.push(`<span class="pill glass ok">${this._icon("mdi:check-circle-outline")}${this._t("everything_ok")}</span>`);
    this._el("hsum").innerHTML = sum.join("");
  }

  _setupTilt(scope) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    scope.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const t = e.composedPath().find((n) => n.classList && n.classList.contains("tile"));
      if (!t) return;
      const r = t.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      t.style.setProperty("--rx", `${((0.5 - y) * 7).toFixed(2)}deg`);
      t.style.setProperty("--ry", `${((x - 0.5) * 9).toFixed(2)}deg`);
      t.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
      t.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
    });
    scope.addEventListener("pointerout", (e) => {
      const t = e.target.closest && e.target.closest(".tile");
      if (t && !t.contains(e.relatedTarget)) { t.style.removeProperty("--rx"); t.style.removeProperty("--ry"); }
    });
  }

  /* ---------- przejścia ---------- */
  _openFromTile(id, tile) {
    history.pushState({ lrc: id }, "", `${location.pathname}${location.search}#${id}`);
    this._showRoom(id, tile);
  }
  _goHub() {
    if (history.state && history.state.lrc) history.back();
    else { history.pushState(null, "", `${location.pathname}${location.search}`); this._showHub(); }
  }
  _step(dir) {
    const list = this._rooms.filter((r) => !r.link);
    const i = list.findIndex((r) => r.id === this._view);
    const n = list[(i + dir + list.length) % list.length];
    history.replaceState({ lrc: n.id }, "", `${location.pathname}${location.search}#${n.id}`);
    this._showRoom(n.id, null, dir);
  }

  _showHub() {
    const from = this._view;
    this._view = null;
    const room = this._el("room"), hub = this._el("hub");
    room.classList.add("leaving");
    setTimeout(() => {
      room.hidden = true; room.classList.remove("leaving"); room.innerHTML = "";
      hub.hidden = false; void hub.offsetWidth; hub.classList.add("back-in");
      this._el("bgimg").style.backgroundImage = "";
      this._updateHub();
      const t = from && this._root.querySelector(`.t-${from}`);
      if (t) { t.classList.add("pulse"); setTimeout(() => t.classList.remove("pulse"), 1200); }
      if (!this._isFit()) window.scrollTo({ top: 0 });
    }, 260);
  }

  _showRoom(id, tile, dir = 0) {
    const r = this._rooms.find((x) => x.id === id);
    if (!r) return;
    const hub = this._el("hub"), room = this._el("room");
    const startRect = tile ? tile.getBoundingClientRect() : null;
    this._view = id;
    this._lastStates = null;
    this._widgets = this._roomWidgets(r);
    room.innerHTML = this._roomHtml(r);
    room.hidden = false;
    hub.hidden = true;
    hub.classList.remove("back-in");
    this._el("bgimg").style.backgroundImage = this._img(r) ? `url('${lhcEsc(this._img(r))}')` : "";
    if (!this._isFit()) window.scrollTo({ top: 0 });
    room.classList.remove("enter", "slide-l", "slide-r");
    void room.offsetWidth;
    const hero = room.querySelector(".hero-img");
    if (startRect && hero && this._img(r) && !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
      const end = hero.getBoundingClientRect();
      const ghost = document.createElement("div");
      ghost.className = "ghost";
      ghost.style.backgroundImage = `url('${lhcEsc(this._img(r))}')`;
      this._root.querySelector(".page").appendChild(ghost);
      room.classList.add("enter-flip");
      const anim = ghost.animate([
        { left: `${startRect.left}px`, top: `${startRect.top}px`, width: `${startRect.width}px`, height: `${startRect.height}px`, borderRadius: "26px", filter: "brightness(.85)" },
        { left: `${end.left}px`, top: `${end.top}px`, width: `${end.width}px`, height: `${end.height}px`, borderRadius: "26px", filter: "brightness(1)" },
      ], { duration: 650, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" });
      anim.onfinish = () => {
        room.classList.remove("enter-flip");
        room.classList.add("enter");
        ghost.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" }).onfinish = () => ghost.remove();
      };
    } else {
      room.classList.add(dir > 0 ? "slide-l" : dir < 0 ? "slide-r" : "enter");
    }
    this._loadHistory(r);
    requestAnimationFrame(() => this._balance());
    setTimeout(() => this._balance(), 700);
  }

  /* przenosi sekcje z przepełnionej kolumny do kolumny z wolnym miejscem */
  _balance() {
    if (!this._isFit() || !this._view) return;
    const cols = [...this._root.querySelectorAll(".rgrid .col")];
    const used = (c) => [...c.children].reduce((sum, ch) => sum + ch.offsetHeight, 0) + 10 * Math.max(0, c.children.length - 1);
    const free = (c) => { const ch = c.querySelector(":scope > .s-chart"); return ch ? ch.offsetHeight - 190 : c.clientHeight - used(c); };
    for (let i = 0; i < 4; i++) {
      const o = cols.find((c) => c.scrollHeight - c.clientHeight > 4);
      if (!o) break;
      const secs = [...o.querySelectorAll(":scope > .sec:not(.s-chart)")];
      const s = secs[secs.length - 1];
      if (!s) break;
      const h = s.offsetHeight;
      const tgt = cols.filter((c) => c !== o).map((c) => ({ c, f: free(c) })).sort((a, b) => b.f - a.f)[0];
      if (!tgt || tgt.f < h + 12) break;
      const ch = tgt.c.querySelector(":scope > .s-chart");
      if (ch) tgt.c.insertBefore(s, ch); else tgt.c.appendChild(s);
    }
  }

  /* ---------- POKÓJ ---------- */
  _roomWidgets(r) {
    const w = [];
    w.push({ key: "stats", ids: [r.temp, r.hum, r.tempClimate, ...r.lights.map((l) => l[0]), ...r.sensors.map((s) => s[0]), ...r.media.map((m) => m[0])], render: () => this._wStats(r) });
    r.lights.forEach((l) => w.push({ key: `l:${l[0]}`, ids: [l[0]], render: () => this._wLight(l) }));
    r.climate.forEach((c) => w.push({ key: `c:${c[0]}`, ids: [c[0]], render: () => this._wClimate(c) }));
    r.media.forEach((m) => w.push({ key: `m:${m[0]}`, ids: [m[0], m[2]], render: () => this._wMedia(m) }));
    r.devices.forEach((d, i) => w.push({ key: `d:${i}`, ids: this._ids({ ...r, temp: null, hum: null, tempClimate: null, lights: [], climate: [], media: [], sensors: [], devices: [d] }), render: () => this._wDevice(d) }));
    if (r.sensors.length) w.push({ key: "sensors", ids: r.sensors.map((s) => s[0]), render: () => this._wSensors(r) });
    return w;
  }
  _slot(key) { const w = this._widgets.find((x) => x.key === key); return `<div class="slot" data-w="${lhcEsc(key)}">${w ? w.render() : ""}</div>`; }

  _roomHtml(r) {
    const ORDER = { lights: 1, climate: 2, media: 3, devices: 4, sensors: 5, chart: 6 };
    const sec = (k, title, icon, body, extra = "") => body ? `<section class="sec rise2 s-${k}" style="order:${ORDER[k]}"><div class="sec-hd">${this._icon(icon)}<span>${title}</span>${extra}</div>${body}</section>` : "";
    const L = this._lights(r);
    const mains = r.climate.filter((c) => c[2] === "main" || c[2] === "ac").length;
    const S = {
      lights: sec("lights", this._t("sec_lights"), "mdi:lightbulb-group-outline", r.lights.length ? `<div class="lgrid">${r.lights.map((l) => this._slot(`l:${l[0]}`)).join("")}</div>` : "",
        r.lights.length ? `<button class="mini glass" data-roomlights="${r.id}">${L.on ? this._t("turn_off_all") : this._t("turn_on_all")}</button>` : ""),
      climate: sec("climate", this._t("sec_climate"), "mdi:thermostat", r.climate.length ? `<div class="cgrid n${Math.min(mains, 2)} ${r.climate.length === 1 ? "c1" : ""}">${r.climate.map((c) => this._slot(`c:${c[0]}`)).join("")}</div>` : ""),
      media: sec("media", this._t("sec_media"), "mdi:play-box-multiple-outline", r.media.length ? `<div class="mgrid">${r.media.map((m) => this._slot(`m:${m[0]}`)).join("")}</div>` : ""),
      devices: sec("devices", this._t("sec_devices"), "mdi:devices", r.devices.length ? `<div class="dgrid">${r.devices.map((d, k) => this._slot(`d:${k}`)).join("")}</div>` : ""),
      sensors: sec("sensors", this._t("sec_sensors"), "mdi:access-point", r.sensors.length ? this._slot("sensors") : ""),
      chart: sec("chart", this._t("sec_chart"), "mdi:chart-bell-curve-cumulative", r.temp || r.hum ? `<div class="chart glass" id="chart"><div class="muted pad">${this._t("loading_history")}</div></div>` : ""),
    };
    let A = ["chart"], B = ["lights", "climate"], C = ["media", "devices", "sensors"];
    if (!S.climate && S.devices) { B = ["lights", "devices"]; C = ["media", "sensors"]; }
    if (!S.chart) { A = ["sensors"]; B = B.filter((k) => k !== "sensors"); C = C.filter((k) => k !== "sensors"); }
    const col = (keys) => keys.map((k) => S[k]).join("");
    const cC = col(C);
    const home = this._cfg.home_path;
    return `
      <div class="rtop" style="--acc:${r.accent}">
        ${home ? `<button class="back home glass" data-nav="${lhcEsc(home)}">${this._icon("mdi:home-outline")}<span>${this._t("home")}</span></button>` : ""}
        <button class="back glass" data-hub="1">${this._icon("mdi:view-grid-outline")}<span>${lhcEsc(this._cfg.title || this._t("all_rooms"))}</span></button>
        <nav class="rtabs">${this._rooms.filter((x) => !x.link).map((x) => `<button class="rtab ${x.id === r.id ? "on" : ""}" data-goto="${x.id}" style="--acc:${x.accent}">${this._icon(x.icon)}<span>${lhcEsc(x.name)}</span></button>`).join("")}</nav>
      </div>
      <div class="rgrid ${cC ? "" : "two"}">
        <div class="col colA">
          <div class="hero" style="--acc:${r.accent};order:0">
            <div class="hero-img" style="${this._img(r) ? `background-image:url('${lhcEsc(this._img(r))}')` : ""}"></div>
            <div class="hero-shade"></div>
            <div class="hero-body">
              <div class="hero-ic">${this._icon(r.icon)}</div>
              <h2>${lhcEsc(r.name)}</h2>
              ${r.subtitle ? `<p>${lhcEsc(r.subtitle)}</p>` : ""}
              ${this._slot("stats")}
            </div>
          </div>
          ${col(A)}
        </div>
        <div class="col colB">${col(B)}</div>
        ${cC ? `<div class="col colC">${cC}</div>` : ""}
      </div>`;
  }

  _fit() {
    const page = this._root && this._root.querySelector(".page");
    if (!page) return;
    const w = this.clientWidth || this.getBoundingClientRect().width;
    const top = Math.max(0, this.getBoundingClientRect().top + (window.scrollY || 0));
    const h = window.innerHeight - top;
    const fit = w >= 900 && h >= 460 && this._cfg.fit !== false;
    page.classList.toggle("fit", fit);
    if (fit) {
      const BW = 1440;
      const BH = Math.round(Math.max(760, Math.min(1000, BW * (h / w))));
      page.style.height = `${h}px`;
      page.style.setProperty("--z", Math.min(w / BW, h / BH).toFixed(4));
      page.style.setProperty("--bh", `${BH}px`);
      if (this._view) requestAnimationFrame(() => this._balance());
    } else {
      page.style.height = "";
      page.style.removeProperty("--z");
      page.style.removeProperty("--bh");
    }
  }
  _isFit() { const p = this._root && this._root.querySelector(".page"); return !!p && p.classList.contains("fit"); }

  _update() {
    if (!this._allIds) this._allIds = [...new Set(this._rooms.flatMap((r) => this._ids(r)))];
    if (!this._view) { this._updateHub(); this._lastStates = null; return; }
    const changed = new Set(this._lastStates ? this._allIds.filter((id) => this._lastStates[id] !== this._hass.states[id]) : this._allIds);
    this._lastStates = this._hass.states;
    (this._widgets || []).forEach((w) => {
      if (this._busy[w.key] && Date.now() < this._busy[w.key]) return;
      if (!w.ids.some((id) => changed.has(id))) return;
      const el = this._root.querySelector(`.slot[data-w="${CSS.escape(w.key)}"]`);
      if (el) el.innerHTML = w.render();
    });
    const r = this._rooms.find((x) => x.id === this._view);
    const btn = this._root.querySelector(".sec .mini[data-roomlights]");
    if (btn && r) btn.textContent = this._lights(r).on ? this._t("turn_off_all") : this._t("turn_on_all");
  }

  _wStats(r) {
    const t = this._temp(r), hum = r.hum && this._ok(r.hum) ? this._num(this._s(r.hum).state, 0) : null;
    const L = this._lights(r);
    const out = [];
    if (t && t !== "—") out.push(`<div class="stat">${this._icon("mdi:thermometer", 'class="amber"')}<b>${t}</b><span>°C</span></div>`);
    if (hum) out.push(`<div class="stat">${this._icon("mdi:water-outline", 'class="blue"')}<b>${hum}</b><span>%</span></div>`);
    if (L.total) out.push(`<div class="stat">${this._icon(L.on ? "mdi:lightbulb-on" : "mdi:lightbulb-outline", `class="${L.on ? "yellow" : "grey"}"`)}<b>${L.on}</b><span>/${L.total} ${this._t("of_lights")}</span></div>`);
    if (this._tvPlaying(r)) out.push(`<div class="stat tv">${this._icon("mdi:television-play")}<b>${this._t("tv")}</b><span>${this._t("tv_playing")}</span></div>`);
    this._alerts(r).forEach((a) => out.push(`<div class="stat ${a[2]}">${this._icon(a[0])}<span>${a[1]}</span></div>`));
    return `<div class="stats">${out.join("")}</div>`;
  }

  _wLight([id, nm, ic, kind]) {
    const s = this._s(id);
    const icon = ic || (id.startsWith("light.") ? "mdi:lightbulb-outline" : id.startsWith("fan.") ? "mdi:fan" : "mdi:ceiling-light-outline");
    const name = this._name(id, nm);
    if (!s) return `<div class="lt glass off-line">${this._ic(icon)}<div class="lt-name">${name}</div><div class="lt-state">${this._t("no_entity")}</div></div>`;
    const avail = !LHC_BAD.includes(s.state);
    const on = s.state === "on";
    const isLight = id.startsWith("light.");
    const modes = s.attributes.supported_color_modes || [];
    const dim = isLight && modes.some((m) => m !== "onoff");
    const color = isLight && modes.some((m) => ["rgb", "rgbw", "rgbww", "hs", "xy"].includes(m));
    const ct = isLight && modes.includes("color_temp");
    const pct = on && s.attributes.brightness != null ? Math.round(s.attributes.brightness / 2.55) : 0;
    const rgb = on && Array.isArray(s.attributes.rgb_color) ? s.attributes.rgb_color.join(",") : "255,196,120";
    const stTxt = !avail ? this._t("st_offline") : on ? (dim ? `${pct}%` : kind === "fan" ? this._t("st_running") : this._t("st_on")) : this._t("st_off");
    return `
      <div class="lt glass ${on ? "on" : ""} ${!avail ? "off-line" : ""} ${kind === "fan" && on ? "spin-ic" : ""}" style="--lc:${rgb}">
        <button class="lt-main" data-toggle="${lhcEsc(id)}" ${!avail ? "disabled" : ""}>
          <div class="bulb">${this._ic(on && icon === "mdi:ceiling-light-outline" ? "mdi:ceiling-light" : icon)}</div>
          <div class="lt-txt"><div class="lt-name">${name}</div><div class="lt-state">${stTxt}</div></div>
          <span class="sw ${on ? "on" : ""}"><i></i></span>
        </button>
        ${dim && avail ? `<input class="slider" type="range" min="1" max="100" value="${pct || 1}" data-bri="${lhcEsc(id)}" style="--p:${pct || 0}%">` : ""}
        ${color && avail ? `<div class="sws">${LRC_SWATCHES.map((c) => `<button class="swatch" style="--c:${c.join(",")}" data-rgb="${lhcEsc(id)}" data-v="${c.join(",")}"></button>`).join("")}</div>` : ""}
        ${!color && ct && avail ? `<div class="kel">${LRC_KELVIN.map(([k, n]) => `<button class="kchip" data-kelvin="${lhcEsc(id)}" data-v="${k}">${this._t(n)}</button>`).join("")}</div>` : ""}
      </div>`;
  }

  _wClimate([id, nm, kind]) {
    const s = this._s(id);
    if (!s) return "";
    const a = s.attributes;
    const name = this._name(id, nm);
    const avail = !LHC_BAD.includes(s.state);
    const off = s.state === "off";
    const cur = a.current_temperature;
    const pend = this._pending[`t:${id}`];
    const tgt = pend != null ? pend : a.temperature;
    const action = a.hvac_action;
    const modes = (a.hvac_modes || []).filter((m) => LRC_HVAC_ICON[m]);
    const modeChips = modes.map((m) => `<button class="mchip ${s.state === m ? "on" : ""}" data-hvac="${lhcEsc(id)}" data-v="${m}">${this._icon(LRC_HVAC_ICON[m])}${this._m("hvac", m)}</button>`).join("");
    const actTxt = !avail ? this._t("st_offline") : off ? this._m("action", "off") : action ? this._m("action", action, lhcEsc(action)) : this._m("hvac", s.state, s.state);
    const heating = action === "heating", cooling = action === "cooling";
    const hasT = tgt != null && Number.isFinite(Number(tgt));
    if (kind === "main" || kind === "ac") {
      const min = a.min_temp ?? 7, max = a.max_temp ?? 30;
      const ang = (t) => 135 + 270 * Math.max(0, Math.min(1, (t - min) / (max - min)));
      const pt = (r, deg) => [100 + r * Math.cos((deg * Math.PI) / 180), 100 + r * Math.sin((deg * Math.PI) / 180)];
      const arc = (r, a0, a1) => { const [x0, y0] = pt(r, a0), [x1, y1] = pt(r, a1); return `M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)},${y1.toFixed(1)}`; };
      const tA = hasT ? ang(Number(tgt)) : 135;
      const [cx, cy] = cur != null ? pt(80, ang(Number(cur))) : [0, 0];
      const [kx, ky] = pt(80, tA);
      const gid = `dg-${id.replace(/[^\w]/g, "")}`;
      return `
        <div class="dial glass ${heating ? "heating" : ""} ${cooling ? "cooling" : ""} ${off ? "is-off" : ""}">
          <div class="dial-hd"><span>${name}</span><span class="act">${this._icon(heating ? "mdi:fire" : cooling ? "mdi:snowflake" : "mdi:circle-small")}${actTxt}</span></div>
          <div class="dial-ring">
            <svg viewBox="0 0 200 200">
              <defs><linearGradient id="${gid}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#38bdf8"/><stop offset=".55" stop-color="#fbbf24"/><stop offset="1" stop-color="#f97316"/></linearGradient></defs>
              <path d="${arc(80, 135, 405)}" class="track"/>
              ${hasT && !off ? `<path d="${arc(80, 135, Math.max(135.5, tA))}" class="fill" stroke="url(#${gid})"/>` : ""}
              ${cur != null ? `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="4" class="curdot"/>` : ""}
              ${hasT && !off ? `<circle cx="${kx.toFixed(1)}" cy="${ky.toFixed(1)}" r="9" class="knob"/>` : ""}
            </svg>
            <div class="dial-c">
              <div class="dial-t">${off ? this._t("off_big") : hasT ? `${this._num(tgt)}<small>°</small>` : "—"}</div>
              <div class="dial-cur">${cur != null ? this._t("now", this._num(cur)) : ""}</div>
            </div>
            ${hasT && !off ? `<button class="dbtn minus glass" data-tstep="${lhcEsc(id)}" data-v="-1">${this._icon("mdi:minus")}</button><button class="dbtn plus glass" data-tstep="${lhcEsc(id)}" data-v="1">${this._icon("mdi:plus")}</button>` : ""}
          </div>
          <div class="mchips">${modeChips}</div>
        </div>`;
    }
    return `
      <div class="crow glass ${heating ? "heating" : ""} ${off ? "is-off" : ""}">
        <div class="crow-ic">${this._ic(kind === "floor" ? "mdi:heating-coil" : kind === "trv" ? "mdi:radiator" : "mdi:air-conditioner")}</div>
        <div class="crow-txt"><div class="crow-name">${name}</div><div class="crow-sub">${cur != null ? `${this._num(cur)}°C · ` : ""}${actTxt}</div></div>
        ${hasT && !off ? `<div class="stepper"><button class="sbtn" data-tstep="${lhcEsc(id)}" data-v="-1">${this._icon("mdi:minus")}</button><b>${this._num(tgt)}°</b><button class="sbtn" data-tstep="${lhcEsc(id)}" data-v="1">${this._icon("mdi:plus")}</button></div>` : ""}
        ${modes.includes("off") && (modes.includes("heat") || modes.includes("auto")) ? `<button class="sw big ${off ? "" : "on"}" data-hvac="${lhcEsc(id)}" data-v="${off ? (modes.includes("heat") ? "heat" : "auto") : "off"}"><i></i></button>` : ""}
      </div>`;
  }

  _wMedia([id, nm, volId, speaker]) {
    const s = this._s(id);
    if (!s) return "";
    const a = s.attributes;
    const vs = volId ? this._s(volId) : null;
    const volSrc = vs && vs.attributes.volume_level != null ? vs : s;
    const vol = volSrc.attributes.volume_level;
    const volEnt = volSrc === vs ? volId : id;
    const on = LHC_TV_ON.includes(s.state) || s.state === "idle";
    const playing = s.state === "playing";
    const pic = a.entity_picture;
    const title = a.media_title || (on ? a.app_name || "" : "");
    const sub = [a.media_artist || a.media_series_title, a.app_name && a.media_title ? a.app_name : ""].filter(Boolean).join(" · ");
    const vpct = Math.round((vol || 0) * 100);
    const st = this._m("media", s.state, lhcEsc(s.state));
    return `
      <div class="md glass ${playing ? "playing" : ""} ${!on ? "is-off" : ""}">
        ${pic ? `<div class="md-bg" style="background-image:url('${lhcEsc(pic)}')"></div>` : ""}
        <div class="md-row">
          <div class="md-art" ${pic ? `style="background-image:url('${lhcEsc(pic)}')"` : ""}>${pic ? "" : this._ic(speaker ? "mdi:speaker" : "mdi:television-classic")}${playing ? `<span class="eq"><i></i><i></i><i></i></span>` : ""}</div>
          <div class="md-txt">
            <div class="md-name">${this._name(id, nm)}</div>
            <div class="md-title">${lhcEsc(title) || st}</div>
            <div class="md-sub">${lhcEsc(sub) || (title ? st : "")}</div>
          </div>
          <button class="round glass sm" data-mpower="${lhcEsc(id)}" data-v="${on ? "off" : "on"}">${this._icon("mdi:power")}</button>
        </div>
        ${on ? `<div class="md-ctl">
          <button class="round glass sm" data-media="${lhcEsc(id)}" data-v="media_previous_track">${this._icon("mdi:skip-previous")}</button>
          <button class="round glass play" data-media="${lhcEsc(id)}" data-v="media_play_pause">${this._icon(playing ? "mdi:pause" : "mdi:play")}</button>
          <button class="round glass sm" data-media="${lhcEsc(id)}" data-v="media_next_track">${this._icon("mdi:skip-next")}</button>
          ${vol != null ? `<div class="vol">${this._icon(vpct ? "mdi:volume-high" : "mdi:volume-off")}<input class="slider" type="range" min="0" max="100" value="${vpct}" data-vol="${lhcEsc(volEnt)}" style="--p:${vpct}%"></div>` : ""}
        </div>` : ""}
      </div>`;
  }

  _wSensors(r) {
    return `<div class="sgrid">${r.sensors.map(([id, nm, k]) => {
      const s = this._s(id);
      if (!s) return "";
      const kind = this._kind(id, k);
      const avail = !LHC_BAD.includes(s.state);
      const on = s.state === "on";
      let icon = "mdi:access-point", val = avail ? `${lhcEsc(s.state)} ${s.attributes.unit_of_measurement || ""}` : this._t("st_offline"), cls = "";
      if (kind === "window") { icon = on ? "mdi:window-open-variant" : "mdi:window-closed-variant"; val = on ? this._t("open") : this._t("closed"); cls = on ? "warn" : "ok"; }
      if (kind === "leak") { icon = on ? "mdi:water-alert" : "mdi:water-check-outline"; val = on ? this._t("leak") : this._t("dry"); cls = on ? "bad" : "ok"; }
      if (kind === "co") { icon = on ? "mdi:molecule-co" : "mdi:shield-check-outline"; val = on ? this._t("co") : this._t("safe"); cls = on ? "bad" : "ok"; }
      if (kind === "motion") { icon = on ? "mdi:motion-sensor" : "mdi:motion-sensor-off"; val = on ? this._t("motion") : this._t("no_motion"); cls = on ? "mint" : ""; }
      if (kind === "binary") { icon = on ? "mdi:checkbox-blank-circle" : "mdi:checkbox-blank-circle-outline"; val = on ? this._t("detected") : this._t("clear"); }
      if (kind === "battery") { const n = Number(s.state); icon = n > 60 ? "mdi:battery-high" : n > 25 ? "mdi:battery-medium" : "mdi:battery-low"; val = `${this._num(s.state, 0)}%`; cls = n > 25 ? "ok" : "warn"; }
      if (kind === "pm") { const n = Number(s.state); icon = "mdi:molecule"; val = `${this._num(s.state, 0)} µg/m³`; cls = n <= 12 ? "ok" : n <= 35 ? "warn" : "bad"; }
      if (kind === "aq") { icon = "mdi:leaf"; val = this._m("aq_states", s.state, lhcEsc(s.state)); cls = LRC_AQ_OK.includes(s.state) ? "ok" : ""; }
      if (!avail) cls = "dim";
      return `<button class="sens glass ${cls}" data-more="${lhcEsc(id)}">${this._ic(icon)}<div><div class="s-name">${this._name(id, nm)}</div><div class="s-val">${val}</div></div></button>`;
    }).join("")}</div>`;
  }

  _wDevice(d) {
    const sws = (list) => list.map((x) => this._s(x.entity) ? `<button class="trow" data-toggle="${lhcEsc(x.entity)}"><span>${this._name(x.entity, x.name)}</span><span class="sw ${this._on(x.entity) ? "on" : ""}"><i></i></span></button>` : "").join("");
    if (d.type === "purifier") {
      const f = this._s(d.fan);
      if (!f) return "";
      const on = f.state === "on";
      const pct = f.attributes.percentage ?? 0;
      const pm = Number(this._s(d.pm)?.state);
      const flt = Number(this._s(d.filter)?.state);
      const presets = f.attributes.preset_modes || [];
      const pmCls = pm <= 12 ? "ok" : pm <= 35 ? "warn" : "bad";
      return `
        <div class="dev glass purifier ${on ? "on" : ""}">
          <div class="dev-hd">${this._ic("mdi:air-purifier", "dev-ic")}<div><div class="dev-name">${lhcEsc(d.name || this._t("purifier"))}</div><div class="dev-sub">${on ? (f.attributes.preset_mode ? this._m("preset", f.attributes.preset_mode, f.attributes.preset_mode) : this._t("manual", pct)) : this._t("st_off")}</div></div>
            <button class="power ${on ? "on" : ""}" data-toggle="${lhcEsc(d.fan)}">${this._icon("mdi:power")}</button></div>
          <div class="pur-body">
            ${d.pm ? `<div class="pm ${pmCls}"><b>${Number.isFinite(pm) ? pm.toFixed(0) : "—"}</b><span>${this._t("pm_unit")}</span></div>` : ""}
            <div class="pur-ctl">
              ${presets.length ? `<div class="mchips">${presets.map((p) => `<button class="mchip ${f.attributes.preset_mode === p ? "on" : ""}" data-preset="${lhcEsc(d.fan)}" data-v="${lhcEsc(p)}">${this._m("preset", p, p)}</button>`).join("")}</div>` : ""}
              <input class="slider" type="range" min="1" max="100" value="${pct || 1}" data-fanpct="${lhcEsc(d.fan)}" style="--p:${pct}%">
              ${d.filter ? `<div class="bar"><span>${this._t("filter")}</span><i style="--w:${Number.isFinite(flt) ? flt : 0}%"></i><b>${Number.isFinite(flt) ? flt + "%" : "—"}</b></div>` : ""}
            </div>
          </div>
        </div>`;
    }
    if (d.type === "feeder") {
      const st = this._s(d.status)?.state;
      const n = this._s(d.manual);
      const max = n ? n.attributes.max || 10 : 10;
      const portions = this._pending[`p:${d.manual}`] ?? 1;
      return `
        <div class="dev glass feeder">
          <div class="dev-hd">${this._ic("mdi:cat", "dev-ic", "feeder")}<div><div class="dev-name">${lhcEsc(d.name || this._t("feeder"))}</div><div class="dev-sub">${st ? this._m("feeder_st", st, lhcEsc(st)) : "—"}</div></div></div>
          ${d.manual ? `<div class="feed">
            <div class="stepper big"><button class="sbtn" data-portion="${lhcEsc(d.manual)}" data-v="-1" data-max="${max}">${this._icon("mdi:minus")}</button><b>${portions}</b><span>${this._t("portions", portions)}</span><button class="sbtn" data-portion="${lhcEsc(d.manual)}" data-v="1" data-max="${max}">${this._icon("mdi:plus")}</button></div>
            <button class="cta" data-feed="${lhcEsc(d.manual)}">${this._icon("mdi:food-drumstick-outline")}${this._t("feed_now")}</button>
          </div>` : ""}
          ${d.switches.length ? `<div class="toggles">${sws(d.switches)}</div>` : ""}
        </div>`;
    }
    if (d.type === "litter") {
      const st = this._s(d.status)?.state;
      return `
        <div class="dev glass litter">
          <div class="dev-hd">${this._ic("mdi:cat", "dev-ic", "litter")}<div><div class="dev-name">${lhcEsc(d.name || this._t("litter"))}</div><div class="dev-sub">${st ? this._m("litter_st", st, lhcEsc(st)) : "—"}</div></div>
            ${d.clean ? `<button class="cta sm" data-clean="${lhcEsc(d.clean)}">${this._icon("mdi:broom")}${this._t("clean")}</button>` : ""}</div>
          ${d.switches.length ? `<div class="toggles">${sws(d.switches)}</div>` : ""}
        </div>`;
    }
    if (d.type === "printer") return this._wPrinter(d);
    if (d.type === "washer" || d.type === "dryer") {
      const washer = d.type === "washer";
      const s = this._s(d.status);
      const avail = s && !LHC_BAD.includes(s.state);
      const running = avail && s.state === "running";
      const rem = Number(this._s(d.remaining)?.state);
      const extra = washer ? (this._ok(d.temp) ? (this._s(d.temp).state === "cold" ? this._t("cold") : this._s(d.temp).state + "°C") : "") : (this._ok(d.program) ? this._m("dry_prog", this._s(d.program).state, this._s(d.program).state.replace(/_/g, " ")) : "");
      const warns = !washer ? [[d.water, this._t("waterbox_full")], [d.filter, this._t("empty_filter")]].filter(([e]) => e && this._on(e)) : [];
      return `
        <div class="dev glass appl ${running ? "running" : ""} ${!avail ? "is-off" : ""}">
          <div class="dev-hd">${this._ic(washer ? "mdi:washing-machine" : "mdi:tumble-dryer", `dev-ic ${running ? "spin" : ""}`)}<div><div class="dev-name">${lhcEsc(d.name || this._t(washer ? "washer" : "dryer"))}</div><div class="dev-sub">${avail ? this._m(washer ? "washer_st" : "dryer_st", s.state, lhcEsc(s.state)) : this._t("appl_offline")}</div></div></div>
          ${avail ? `<div class="appl-body"><div class="rem"><b>${Number.isFinite(rem) && rem > 0 ? rem : "—"}</b><span>${this._t("min_left")}</span></div>${extra ? `<div class="tag">${this._icon(washer ? "mdi:thermometer" : "mdi:tune-variant")}${lhcEsc(extra)}</div>` : ""}</div>` : ""}
          ${warns.map(([, t]) => `<div class="warnrow">${this._icon("mdi:alert-outline")}${t}</div>`).join("")}
        </div>`;
    }
    return "";
  }

  _wPrinter(d) {
    const S = (id) => (id ? this._s(id) : undefined);
    const st = (S(d.status) && S(d.status).state) || "unknown";
    const avail = !!S(d.status) && !LHC_BAD.includes(st) && st !== "offline";
    const active = ["running", "prepare", "pause", "init", "slicing"].includes(st);
    const pr = Math.max(0, Math.min(100, Number(S(d.progress) && S(d.progress).state) || 0));
    const left = lhcDuration(S(d.remaining));
    const tz = this._hass.config.time_zone, loc = this._lang === "pl" ? "pl-PL" : undefined;
    let ends = "";
    try {
      const et = S(d.end_time);
      if (et && !LHC_BAD.includes(et.state)) ends = new Date(et.state).toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit", timeZone: tz });
      else if (active && lhcRemainingMin(S(d.remaining)) > 0) ends = new Date(Date.now() + lhcRemainingMin(S(d.remaining)) * 60000).toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit", timeZone: tz });
    } catch (e) { ends = ""; }
    const stage = S(d.stage) && S(d.stage).state;
    const stageTxt = active && stage && !["printing", "idle", "unknown", "offline"].includes(stage) ? this._m("pr_stage", stage, stage.replace(/_/g, " ")) : "";
    const pic = (id) => (S(id) && S(id).attributes.entity_picture) || "";
    const camPic = pic(d.camera), modelPic = pic(d.image);
    const view = this._prView || (st === "running" && camPic ? "camera" : "model");
    const showCam = view === "camera" && !!camPic;
    const imgSrc = showCam ? `${camPic}&_=${Math.floor(Date.now() / 8000)}` : modelPic || camPic;
    const R = 52, C = 2 * Math.PI * R;
    const temp = (cur, tgt, label, icon) => {
      if (!d[cur]) return "";
      const c = this._num(S(d[cur]) && S(d[cur]).state, 0);
      const t = d[tgt] ? this._num(S(d[tgt]) && S(d[tgt]).state, 0) : null;
      return `<div class="pr-temp ${Number(c) > 45 ? "hot" : ""}">${this._icon(icon)}<span>${label}</span><b>${c}°</b>${t && t !== "0" && t !== "—" ? `<small>/ ${t}°</small>` : ""}</div>`;
    };
    const fil = d.filaments.map((id) => {
      const f = S(id);
      if (!f) return "";
      const a = f.attributes, empty = a.empty || f.state === "Empty";
      const col = String(a.color || "#000000").slice(0, 7);
      return `<div class="fil ${a.active ? "on" : ""} ${empty ? "empty" : ""}" title="${lhcEsc(f.state)}"><i style="background:${empty ? "transparent" : col}"></i><span>${empty ? this._t("pr_empty") : lhcEsc(a.type || f.state)}</span></div>`;
    }).join("");
    const btn = (id, icon, label, cls = "") => (id && S(id) && S(id).state !== "unavailable" ? `<button class="mchip ${cls}" data-press="${lhcEsc(id)}" ${cls === "danger" ? 'data-confirm="1"' : ""}>${this._icon(icon)}${label}</button>` : "");
    const light = S(d.light);
    const task = S(d.task);
    return `
      <div class="dev glass printer ${active ? "printing" : ""} ${st === "failed" ? "failed" : ""} ${!avail ? "is-off" : ""}">
        <div class="dev-hd">${this._ic("mdi:printer-3d-nozzle", `dev-ic ${st === "running" ? "pulse-ic" : ""}`)}<div><div class="dev-name">${lhcEsc(d.name || this._t("printer"))}</div>
          <div class="dev-sub">${this._m("pr_status", st, lhcEsc(st))}${stageTxt ? ` · ${lhcEsc(stageTxt)}` : ""}</div></div>
          ${light ? `<button class="power ${light.state === "on" ? "on" : ""}" data-toggle="${lhcEsc(d.light)}" title="${this._t("pr_light")}">${this._icon(light.state === "on" ? "mdi:lightbulb-on" : "mdi:lightbulb-outline")}</button>` : ""}
        </div>
        <div class="pr-body">
          <div class="pr-media">
            ${imgSrc ? `<img src="${lhcEsc(imgSrc)}" alt="" ${showCam ? `data-cam="${lhcEsc(d.camera)}"` : ""} class="${showCam ? "cam" : "model"}">` : `<div class="pr-noimg">${this._icon("mdi:cube-outline")}</div>`}
            ${camPic && modelPic ? `<div class="pr-tabs"><button class="${!showCam ? "on" : ""}" data-prview="model">${this._t("pr_model")}</button><button class="${showCam ? "on" : ""}" data-prview="camera"><i class="live-dot"></i>${this._t("pr_camera")}</button></div>` : ""}
          </div>
          <div class="pr-ring">
            <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="${R}" class="pr-track"/><circle cx="60" cy="60" r="${R}" class="pr-fill" style="stroke-dasharray:${C.toFixed(1)};stroke-dashoffset:${(C * (1 - pr / 100)).toFixed(1)}"/></svg>
            <div class="pr-c"><b>${active || st === "finish" ? Math.round(pr) : "—"}<small>%</small></b>${left && active ? `<span>${left}</span>` : ""}</div>
          </div>
        </div>
        ${task && !LHC_BAD.includes(task.state) ? `<div class="pr-task">${this._icon("mdi:file-cad-box")}<span>${lhcEsc(task.state.replace(/\.(stl|3mf|gcode)$/i, "").replace(/_/g, " "))}</span></div>` : ""}
        <div class="pr-meta">
          ${d.layer && d.total_layers ? `<div>${this._icon("mdi:layers-triple-outline")}<span>${this._t("pr_layer")}</span><b>${this._num(S(d.layer) && S(d.layer).state, 0)} / ${this._num(S(d.total_layers) && S(d.total_layers).state, 0)}</b></div>` : ""}
          ${ends && active ? `<div>${this._icon("mdi:flag-checkered")}<span>${this._t("pr_ends", ends)}</span></div>` : ""}
        </div>
        <div class="pr-temps">${temp("nozzle", "nozzle_target", this._t("pr_nozzle"), "mdi:printer-3d-nozzle-heat-outline")}${temp("bed", "bed_target", this._t("pr_bed"), "mdi:radiator")}</div>
        ${fil ? `<div class="fils">${fil}</div>` : ""}
        ${active ? `<div class="mchips pr-ctl">${st === "pause" ? btn(d.resume, "mdi:play", this._t("pr_resume")) : btn(d.pause, "mdi:pause", this._t("pr_pause"))}${btn(d.stop, "mdi:stop", this._t("pr_stop"), "danger")}</div>` : ""}
      </div>`;
  }

  /* ---------- historia 24h ---------- */
  async _loadHistory(r) {
    const ids = [r.temp, r.hum].filter(Boolean);
    if (!ids.length) return;
    const cached = this._hist[r.id];
    if (cached && Date.now() - cached.t < 5 * 60 * 1000) { this._drawChart(r, cached.data); return; }
    try {
      const start = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
      const res = await this._hass.callWS({ type: "history/history_during_period", start_time: start, entity_ids: ids, minimal_response: true, no_attributes: true, significant_changes_only: false });
      this._hist[r.id] = { t: Date.now(), data: res };
      if (this._view === r.id) this._drawChart(r, res);
    } catch (e) {
      const c = this._el("chart");
      if (c) c.innerHTML = `<div class="muted pad">${this._t("no_history")}</div>`;
    }
  }
  _drawChart(r, res) {
    const c = this._el("chart");
    if (!c) return;
    const t0 = Date.now() - 24 * 3600 * 1000;
    const series = [[r.temp, "#fbbf24", "°C", this._t("temperature")], [r.hum, "#60a5fa", "%", this._t("humidity")]].filter(([id]) => id && res[id]).map(([id, col, unit, label]) => {
      const pts = res[id].map((p) => [((p.lu || p.lc) * 1000) || Date.parse(p.last_updated || p.last_changed), Number(p.s ?? p.state)]).filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]));
      return { col, unit, label, pts };
    }).filter((s) => s.pts.length > 1);
    if (!series.length) { c.innerHTML = `<div class="muted pad">${this._t("no_history_day")}</div>`; return; }
    const W = 1000, H = 220;
    const paths = series.map((s, k) => {
      const vals = s.pts.map((p) => p[1]);
      let min = Math.min(...vals), max = Math.max(...vals);
      const rmin = min, rmax = max;
      if (max - min < 1) { min -= 0.5; max += 0.5; }
      const X = (t) => ((Math.max(t, t0) - t0) / (24 * 3600 * 1000)) * W;
      const Y = (v) => H - 14 - ((v - min) / (max - min)) * (H - 40);
      let d = "";
      s.pts.forEach((p, i) => { d += `${i ? "L" : "M"}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)} `; });
      d += `L${W},${Y(s.pts[s.pts.length - 1][1]).toFixed(1)}`;
      return { s, d, min: rmin, max: rmax, last: s.pts[s.pts.length - 1][1], k };
    });
    c.innerHTML = `
      <div class="legend">${paths.map((p) => `<span><i style="background:${p.s.col}"></i>${p.s.label}<b>${p.last.toFixed(p.s.unit === "%" ? 0 : 1)}${p.s.unit}</b><small>min ${p.min.toFixed(1)} · max ${p.max.toFixed(1)}</small></span>`).join("")}</div>
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
        <defs>${paths.map((p) => `<linearGradient id="cg${p.k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.s.col}" stop-opacity=".28"/><stop offset="1" stop-color="${p.s.col}" stop-opacity="0"/></linearGradient>`).join("")}</defs>
        ${[0.25, 0.5, 0.75].map((f) => `<line x1="${W * f}" x2="${W * f}" y1="0" y2="${H}" class="gl"/>`).join("")}
        ${paths.map((p) => `<path d="${p.d} L${W},${H} L0,${H} Z" fill="url(#cg${p.k})"/><path d="${p.d}" class="cl" stroke="${p.s.col}" pathLength="1"/>`).join("")}
      </svg>
      <div class="axis"><span>${this._t("h24")}</span><span>${this._t("h18")}</span><span>${this._t("h12")}</span><span>${this._t("h6")}</span><span>${this._t("h0")}</span></div>`;
  }

  /* ---------- interakcje ---------- */
  _more(id) { this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: id }, bubbles: true, composed: true })); }
  _rerender(key) {
    const w = (this._widgets || []).find((x) => x.key === key);
    const el = this._root.querySelector(`.slot[data-w="${CSS.escape(key)}"]`);
    if (w && el) el.innerHTML = w.render();
  }

  _click(e) {
    const path = e.composedPath();
    const stop = path.indexOf(this._root);
    const keys = ["prview", "press", "open", "nav", "hub", "goto", "toggle", "roomlights", "rgb", "kelvin", "hvac", "tstep", "media", "mpower", "preset", "portion", "feed", "clean", "more"];
    const t = (stop >= 0 ? path.slice(0, stop) : path).find((n) => n.dataset && Object.keys(n.dataset).some((k) => keys.includes(k)));
    if (!t || t.tagName === "INPUT") return;
    const d = t.dataset;
    e.stopPropagation();
    if (d.prview) {
      this._prView = d.prview;
      (this._widgets || []).filter((w) => w.key.startsWith("d:")).forEach((w) => this._rerender(w.key));
      return;
    }
    if (d.press) {
      if (d.confirm && !confirm(this._t("pr_stop_confirm"))) return;
      return this._call("button", "press", { entity_id: d.press });
    }
    if (d.roomlights) {
      const r = this._rooms.find((x) => x.id === d.roomlights);
      const ids = r.lights.filter((l) => l[3] !== "fan" && this._ok(l[0])).map((l) => l[0]);
      const any = ids.some((id) => this._on(id));
      if (t.classList.contains("t-bulb")) { t.classList.add("bump"); setTimeout(() => t.classList.remove("bump"), 400); }
      return this._call("homeassistant", any ? "turn_off" : "turn_on", { entity_id: ids });
    }
    if (d.open) return this._openFromTile(d.open, t.classList.contains("tile") ? t : null);
    if (d.nav) return lhcNavigate(d.nav);
    if (d.hub) return this._goHub();
    if (d.goto) {
      if (d.goto === this._view) return;
      const dir = this._rooms.findIndex((x) => x.id === d.goto) > this._rooms.findIndex((x) => x.id === this._view) ? 1 : -1;
      history.replaceState({ lrc: d.goto }, "", `${location.pathname}${location.search}#${d.goto}`);
      return this._showRoom(d.goto, null, dir);
    }
    if (d.toggle) {
      const dom = d.toggle.split(".")[0];
      return this._call(["switch", "light", "fan", "input_boolean"].includes(dom) ? dom : "homeassistant", "toggle", { entity_id: d.toggle });
    }
    if (d.rgb) return this._call("light", "turn_on", { entity_id: d.rgb, rgb_color: d.v.split(",").map(Number) });
    if (d.kelvin) return this._call("light", "turn_on", { entity_id: d.kelvin, color_temp_kelvin: Number(d.v) });
    if (d.hvac) return this._call("climate", "set_hvac_mode", { entity_id: d.hvac, hvac_mode: d.v });
    if (d.tstep) {
      const id = d.tstep, s = this._s(id);
      const step = s.attributes.target_temp_step || 0.5;
      const base = this._pending[`t:${id}`] ?? Number(s.attributes.temperature);
      const min = s.attributes.min_temp ?? 5, max = s.attributes.max_temp ?? 35;
      this._pending[`t:${id}`] = Math.max(min, Math.min(max, Math.round((base + Number(d.v) * step) * 10) / 10));
      this._busy[`c:${id}`] = Date.now() + 2500;
      this._rerender(`c:${id}`);
      clearTimeout(this._tT);
      this._tT = setTimeout(async () => {
        const v = this._pending[`t:${id}`];
        try { await this._call("climate", "set_temperature", { entity_id: id, temperature: v }); } finally {
          setTimeout(() => { delete this._pending[`t:${id}`]; delete this._busy[`c:${id}`]; this._rerender(`c:${id}`); }, 1500);
        }
      }, 800);
      return;
    }
    if (d.media) return this._call("media_player", d.v, { entity_id: d.media });
    if (d.mpower) return this._call("media_player", d.v === "on" ? "turn_on" : "turn_off", { entity_id: d.mpower });
    if (d.preset) return this._call("fan", "set_preset_mode", { entity_id: d.preset, preset_mode: d.v });
    if (d.portion) {
      const k = `p:${d.portion}`;
      this._pending[k] = Math.max(1, Math.min(Number(d.max) || 10, (this._pending[k] ?? 1) + Number(d.v)));
      const dev = this._widgets.find((w) => w.ids.includes(d.portion));
      if (dev) this._rerender(dev.key);
      return;
    }
    if (d.feed) {
      const n = this._pending[`p:${d.feed}`] ?? 1;
      if (!confirm(this._t("feed_confirm", n))) return;
      return this._call("number", "set_value", { entity_id: d.feed, value: n });
    }
    if (d.clean) {
      if (!confirm(this._t("clean_confirm"))) return;
      const dom = d.clean.split(".")[0];
      return this._call(dom === "button" ? "button" : "homeassistant", dom === "button" ? "press" : "turn_on", { entity_id: d.clean });
    }
    if (d.more) return this._more(d.more);
  }

  _input(e) {
    const t = e.target, d = t.dataset;
    if (!d) return;
    t.style.setProperty("--p", `${t.value}%`);
    const id = d.bri || d.vol || d.fanpct;
    if (!id) return;
    const w = this._widgets.find((x) => x.ids.includes(id));
    if (w) this._busy[w.key] = Date.now() + 2500;
    if (d.bri) { const st = t.closest(".lt")?.querySelector(".lt-state"); if (st) st.textContent = `${t.value}%`; }
  }
  _change(e) {
    const t = e.target, d = t.dataset;
    if (!d) return;
    const v = Number(t.value);
    const done = (id) => { const w = this._widgets.find((x) => x.ids.includes(id)); if (w) setTimeout(() => { delete this._busy[w.key]; }, 1500); };
    if (d.bri) { this._call("light", "turn_on", { entity_id: d.bri, brightness_pct: v }); done(d.bri); }
    if (d.vol) { this._call("media_player", "volume_set", { entity_id: d.vol, volume_level: v / 100 }); done(d.vol); }
    if (d.fanpct) { this._call("fan", "set_percentage", { entity_id: d.fanpct, percentage: v }); done(d.fanpct); }
  }
}

const LRC_STYLE = `:host{display:block;--txt:#eef4ff;--dim:#9fb0cd;--line:rgba(255,255,255,.12);font-family:"Inter","Segoe UI",Roboto,system-ui,sans-serif;color:var(--txt)}
*{box-sizing:border-box}
button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
button:disabled{cursor:default}
ha-icon{--mdc-icon-size:20px;display:inline-flex}
h1,h2,p{margin:0}
.blue{color:#60a5fa}.amber{color:#f59e4c}.yellow{color:#facc15}.green{color:#4ade80}.grey{color:#64748b}.violet{color:#a78bfa}.mint{color:#5eead4}
.muted{color:var(--dim);font-size:13px}.pad{padding:14px}

.page{position:relative;min-height:calc(100vh - var(--header-height,56px));background:#040913;overflow:hidden}
.bg{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.bg>*{position:absolute;inset:0}
.bg-img{inset:-10%;background:radial-gradient(ellipse at 30% 20%,#1e3a8a,#0b1020 60%);filter:blur(70px) saturate(1.5) brightness(.4);transform:scale(1.1);transition:background-image .6s}
.bg-dim{background:radial-gradient(ellipse at 50% 0%,transparent 0%,rgba(4,9,19,.55) 70%)}
.orb{inset:auto;border-radius:50%;filter:blur(70px);opacity:.4;animation:drift 24s ease-in-out infinite alternate}
.o1{width:40%;height:50%;left:-8%;top:8%;background:#1d4ed8}.o2{width:34%;height:44%;right:-8%;bottom:-10%;background:#7c3aed;animation-delay:-10s;opacity:.3}

.glass{position:relative;background:linear-gradient(150deg,rgba(255,255,255,.12),rgba(255,255,255,.035) 45%,rgba(255,255,255,.02)),rgba(12,20,40,.4);
  border:1px solid rgba(255,255,255,.13);box-shadow:inset 0 1px 0 rgba(255,255,255,.22),0 14px 40px rgba(0,0,0,.4);
  backdrop-filter:blur(22px) saturate(160%);-webkit-backdrop-filter:blur(22px) saturate(160%)}

/* ---------- HUB ---------- */
.hub{position:relative;display:flex;flex-direction:column;gap:16px;padding:18px 22px 22px;min-height:calc(100vh - var(--header-height,56px))}
.hub[hidden],.room[hidden]{display:none}
.hub.back-in{animation:fade .5s ease both}
.hhd{display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.back{display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:999px;font-size:14.5px;transition:border-color .2s,transform .2s}
.back:hover{border-color:rgba(147,197,253,.55);transform:translateY(-1px)}
.htitle{flex:1;min-width:200px}
.kicker{font-size:12.5px;letter-spacing:.14em;text-transform:uppercase;color:#8fb4e8}
h1{font-size:34px;font-weight:600;letter-spacing:-.01em;background:linear-gradient(90deg,#fff,#a5c8ff);-webkit-background-clip:text;background-clip:text;color:transparent}
.hsum{display:flex;gap:10px;flex-wrap:wrap}
.pill{display:flex;align-items:center;gap:8px;padding:9px 14px;border-radius:999px;font-size:13.5px}
.pill ha-icon{--mdc-icon-size:18px}
.pill.ok ha-icon{color:#4ade80}.pill.warn{border-color:rgba(251,191,36,.55)}.pill.warn ha-icon{color:#fbbf24}
.pill.bad{border-color:rgba(248,113,113,.7);animation:alarm 1.4s ease-in-out infinite}.pill.bad ha-icon{color:#f87171}
.pill[data-open]{cursor:pointer}

.bento{flex:1;display:grid;gap:16px;grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(var(--rows,3),minmax(170px,1fr));grid-auto-flow:row dense;perspective:1400px}
.sz-big{grid-column:span 2;grid-row:span 2}.sz-wide{grid-column:span 2}.sz-tall{grid-row:span 2}
.tile{position:relative;border-radius:26px;overflow:hidden;cursor:pointer;isolation:isolate;
  transform:rotateX(var(--rx,0)) rotateY(var(--ry,0));transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .4s,border-color .4s;
  border:1px solid rgba(255,255,255,.12);box-shadow:0 18px 50px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.18)}
.tile:hover{box-shadow:0 26px 70px rgba(0,0,0,.55),0 0 0 1px rgba(var(--acc),.55),0 0 40px rgba(var(--acc),.25)}
.tile.lit{border-color:rgba(255,200,120,.38)}
.tile.lit::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;box-shadow:inset 0 0 60px rgba(255,180,90,.18);animation:breathe 5s ease-in-out infinite}
.tile.pulse{animation:pulseT 1.2s ease}
.t-img{position:absolute;inset:-4%;background-size:cover;background-position:center;z-index:-2;
  filter:brightness(calc(.38 + .62 * var(--lit,1))) saturate(calc(.55 + .45 * var(--lit,1)));transition:filter 1.4s ease,transform 8s ease;transform:scale(1.02)}
.tile:hover .t-img{transform:scale(1.12)}
.t-shade{position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(4,8,18,.15) 0%,rgba(4,8,18,0) 35%,rgba(4,8,18,.55) 70%,rgba(4,8,18,.88) 100%)}
.tile.dark .t-shade{background:linear-gradient(180deg,rgba(6,10,26,.45),rgba(6,10,26,.35) 40%,rgba(4,8,18,.92) 100%)}
.t-glare{position:absolute;inset:0;z-index:0;pointer-events:none;opacity:0;transition:opacity .4s;
  background:radial-gradient(circle at var(--gx,50%) var(--gy,50%),rgba(255,255,255,.22),transparent 45%)}
.tile:hover .t-glare{opacity:1}
.t-top{position:absolute;top:14px;left:14px;right:14px;display:flex;align-items:flex-start;gap:8px;z-index:1}
.t-ic{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;flex:none}
.t-ic ha-icon{--mdc-icon-size:23px;color:rgb(var(--acc))}
.t-badges{flex:1;display:flex;gap:6px;flex-wrap:wrap}
.alert{display:inline-flex;align-items:center;gap:5px;padding:5px 9px;border-radius:999px;font-size:12px;background:rgba(10,14,28,.6);backdrop-filter:blur(10px)}
.alert ha-icon{--mdc-icon-size:15px}
.alert.warn{border:1px solid rgba(251,191,36,.6);color:#fde68a}.alert.bad{border:1px solid rgba(248,113,113,.8);color:#fecaca;animation:alarm 1.4s infinite}
.t-bulb{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;flex:none;transition:.3s}
.t-bulb ha-icon{--mdc-icon-size:22px;color:#94a3b8}
.t-bulb.on{border-color:rgba(250,204,21,.7);box-shadow:0 0 18px rgba(250,204,21,.55),inset 0 1px 0 rgba(255,255,255,.3)}
.t-bulb.on ha-icon{color:#fde047;filter:drop-shadow(0 0 6px rgba(250,204,21,.9))}
.t-bulb.bump{transform:scale(.88)}
.t-bottom{position:absolute;left:18px;right:18px;bottom:16px;z-index:1}
.t-name{font-size:24px;font-weight:600;letter-spacing:-.01em;text-shadow:0 2px 12px rgba(0,0,0,.6)}
.sz-big .t-name{font-size:36px}
.t-sub{font-size:13px;color:#cbd5e1;margin:2px 0 10px;opacity:.85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.t-chips{display:flex;gap:6px;flex-wrap:wrap}
.chip{display:inline-flex;align-items:center;gap:5px;padding:5px 10px;border-radius:999px;font-size:13px;
  background:rgba(10,16,30,.5);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.chip ha-icon{--mdc-icon-size:15px}
.chip.on{border-color:rgba(250,204,21,.45)}
.chip.tv{border-color:rgba(167,139,250,.6)}.chip.tv ha-icon{color:#c4b5fd}

/* ---------- POKÓJ ---------- */
.room{position:relative;padding:0 0 30px}
.room.enter{animation:fade .45s ease both}
.room.enter-flip .hero-img{opacity:0}
.room.enter-flip .hero-body,.room.enter-flip .rbody,.room.enter-flip .hero-nav{opacity:0}
.room.enter .rise2{animation:rise .7s cubic-bezier(.2,.8,.2,1) both}
.room.enter .rise2:nth-child(2){animation-delay:.07s}.room.enter .rise2:nth-child(3){animation-delay:.14s}
.room.enter .rise2:nth-child(4){animation-delay:.21s}.room.enter .rise2:nth-child(5){animation-delay:.28s}.room.enter .rise2:nth-child(6){animation-delay:.35s}
.room.slide-l{animation:slideL .5s cubic-bezier(.2,.8,.2,1) both}.room.slide-r{animation:slideR .5s cubic-bezier(.2,.8,.2,1) both}
.room.leaving{animation:fadeOut .26s ease both}
.ghost{position:fixed;z-index:30;background-size:cover;background-position:center;pointer-events:none;box-shadow:0 30px 80px rgba(0,0,0,.6)}
.hero{position:relative;height:min(46vh,440px);min-height:300px;margin:14px 18px 0;border-radius:30px;overflow:hidden;isolation:isolate}
.hero-img{position:absolute;inset:0;background-size:cover;background-position:center;z-index:-2;animation:kb 30s ease-in-out infinite alternate}
.hero-shade{position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(4,8,18,.35) 0%,rgba(4,8,18,0) 30%,rgba(4,8,18,.55) 70%,rgba(4,9,19,.95) 100%),radial-gradient(ellipse at 15% 100%,rgba(var(--acc),.3),transparent 55%)}
.hero-nav{position:absolute;top:16px;left:16px;right:16px;display:flex;justify-content:space-between;align-items:center;transition:opacity .3s}
.hero-arrows{display:flex;gap:10px}
.round{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;transition:border-color .2s,transform .2s}
.round:hover{border-color:rgba(147,197,253,.6);transform:translateY(-1px)}
.round ha-icon{--mdc-icon-size:24px}
.round.sm{width:40px;height:40px}.round.sm ha-icon{--mdc-icon-size:20px}
.hero-body{position:absolute;left:28px;right:28px;bottom:24px;transition:opacity .3s}
.hero-ic ha-icon{--mdc-icon-size:34px;color:rgb(var(--acc));filter:drop-shadow(0 0 12px rgba(var(--acc),.7))}
h2{font-size:clamp(34px,5vw,58px);font-weight:700;letter-spacing:-.02em;line-height:1.05;text-shadow:0 4px 24px rgba(0,0,0,.6)}
.hero-body p{color:#cbd5e1;font-size:16px;margin:4px 0 14px}
.stats{display:flex;gap:10px;flex-wrap:wrap}
.stat{display:flex;align-items:baseline;gap:5px;padding:9px 14px;border-radius:16px;background:rgba(10,16,30,.5);border:1px solid rgba(255,255,255,.15);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
.stat ha-icon{--mdc-icon-size:20px;align-self:center}
.stat b{font-size:24px;font-weight:600}.stat span{color:var(--dim);font-size:13px}
.stat.warn{border-color:rgba(251,191,36,.6)}.stat.warn ha-icon{color:#fbbf24}
.stat.bad{border-color:rgba(248,113,113,.8);animation:alarm 1.4s infinite}.stat.bad ha-icon{color:#f87171}
.stat.tv{border-color:rgba(167,139,250,.6)}.stat.tv ha-icon{color:#c4b5fd}

.rbody{position:relative;display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:18px;padding:18px;transition:opacity .3s}
.sec{grid-column:span 12;min-width:0}
@media (min-width:1000px){.sec.half{grid-column:span 6}.sec.half .mgrid,.sec.half .dgrid{grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}}
.sec-hd{display:flex;align-items:center;gap:10px;font-size:18px;font-weight:600;margin:4px 4px 12px}
.sec-hd ha-icon{--mdc-icon-size:22px;color:#93c5fd}
.mini{margin-left:auto;padding:7px 14px;border-radius:999px;font-size:13px;font-weight:500}
.mini:hover{border-color:rgba(250,204,21,.6)}

.lgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:14px;align-items:start}
.lt{border-radius:22px;padding:14px;display:flex;flex-direction:column;gap:12px;transition:border-color .4s,box-shadow .4s}
.lt.on{border-color:rgba(var(--lc),.55);box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 14px 40px rgba(0,0,0,.4),0 0 30px rgba(var(--lc),.18)}
.lt.off-line{opacity:.5}
.lt-main{display:grid;grid-template-columns:auto 1fr auto;grid-template-areas:"b . s" "t t t";align-items:start;gap:12px;text-align:left;width:100%}
.lt-main .bulb{grid-area:b}.lt-main .sw{grid-area:s}.lt-main .lt-txt{grid-area:t}
.bulb{width:52px;height:52px;border-radius:16px;display:grid;place-items:center;flex:none;background:rgba(255,255,255,.06);transition:.4s}
.bulb ha-icon{--mdc-icon-size:28px;color:#64748b;transition:.4s}
.lt.on .bulb{background:radial-gradient(circle,rgba(var(--lc),.45),rgba(var(--lc),.08) 70%)}
.lt.on .bulb ha-icon{color:rgb(var(--lc));filter:drop-shadow(0 0 10px rgba(var(--lc),.95))}
.lt.spin-ic .bulb ha-icon{animation:spin 1.6s linear infinite}
.lt-txt{flex:1;min-width:0}
.lt-name{font-size:15px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lt-state{font-size:12.5px;color:var(--dim)}
.sw{width:42px;height:24px;border-radius:12px;background:rgba(100,116,139,.45);position:relative;flex:none;transition:.25s;border:1px solid var(--line)}
.sw i{position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:#cbd5e1;transition:.25s}
.sw.on{background:#2563eb;box-shadow:0 0 12px rgba(59,130,246,.6)}.sw.on i{left:20px;background:#fff}
.sw.big{width:50px;height:28px}.sw.big i{width:22px;height:22px}.sw.big.on i{left:24px}
.slider{-webkit-appearance:none;appearance:none;width:100%;height:10px;border-radius:6px;outline:none;cursor:pointer;
  background:linear-gradient(90deg,rgba(var(--lc,96,165,250),.9) 0 var(--p,0%),rgba(255,255,255,.12) var(--p,0%) 100%)}
.slider::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 0 0 4px rgba(255,255,255,.15),0 4px 10px rgba(0,0,0,.4)}
.slider::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:#fff;border:0}
.sws{display:flex;gap:7px;flex-wrap:wrap}
.swatch{width:24px;height:24px;border-radius:50%;background:rgb(var(--c));box-shadow:0 0 10px rgba(var(--c),.6),inset 0 0 0 2px rgba(255,255,255,.35);transition:transform .2s}
.swatch:hover{transform:scale(1.18)}
.kel{display:flex;gap:6px}
.kchip,.mchip{display:inline-flex;align-items:center;gap:5px;padding:6px 11px;border-radius:999px;font-size:12.5px;border:1px solid var(--line);background:rgba(255,255,255,.05);transition:.2s}
.kchip:hover,.mchip:hover{border-color:rgba(147,197,253,.6)}
.mchip ha-icon{--mdc-icon-size:15px}
.mchip.on{background:linear-gradient(180deg,rgba(59,130,246,.45),rgba(29,78,216,.2));border-color:#3b82f6;box-shadow:0 0 12px rgba(59,130,246,.45)}

.cgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;align-items:start}
.dial{border-radius:26px;padding:16px;display:flex;flex-direction:column;align-items:center;gap:10px}
.dial-hd{width:100%;display:flex;justify-content:space-between;align-items:center;font-size:16px;font-weight:600}
.act{display:flex;align-items:center;gap:4px;font-size:12.5px;font-weight:400;color:var(--dim)}
.act ha-icon{--mdc-icon-size:16px}
.dial.heating .act{color:#fdba74}.dial.heating .act ha-icon{color:#fb923c;animation:pulse 1.6s infinite}
.dial.cooling .act{color:#7dd3fc}
.dial-ring{position:relative;width:min(240px,100%);aspect-ratio:1}
.dial-ring svg{width:100%;height:100%;overflow:visible}
.track{fill:none;stroke:rgba(255,255,255,.1);stroke-width:14;stroke-linecap:round}
.fill{fill:none;stroke-width:14;stroke-linecap:round;filter:drop-shadow(0 0 8px rgba(251,146,60,.5));transition:d .4s}
.dial.is-off .track{stroke:rgba(255,255,255,.06)}
.knob{fill:#fff;filter:drop-shadow(0 2px 6px rgba(0,0,0,.5))}
.curdot{fill:#0f172a;stroke:#e2e8f0;stroke-width:2}
.dial.heating .dial-ring::before{content:"";position:absolute;inset:16%;border-radius:50%;background:radial-gradient(circle,rgba(251,146,60,.3),transparent 70%);animation:breathe 2.4s ease-in-out infinite}
.dial.cooling .dial-ring::before{content:"";position:absolute;inset:16%;border-radius:50%;background:radial-gradient(circle,rgba(56,189,248,.28),transparent 70%);animation:breathe 2.4s ease-in-out infinite}
.dial-c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none}
.dial-t{font-size:52px;font-weight:300;line-height:1}.dial-t small{font-size:26px}
.dial-cur{font-size:13px;color:var(--dim);margin-top:4px}
.dbtn{position:absolute;bottom:4%;width:46px;height:46px;border-radius:50%;display:grid;place-items:center}
.dbtn.minus{left:6%}.dbtn.plus{right:6%}
.dbtn:hover{border-color:rgba(251,146,60,.6)}
.mchips{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}
.crow{border-radius:20px;padding:12px 14px;display:flex;align-items:center;gap:12px}
.crow-ic{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:rgba(255,255,255,.06)}
.crow-ic ha-icon{--mdc-icon-size:24px;color:#f5a35c}
.crow.heating .crow-ic{background:radial-gradient(circle,rgba(251,146,60,.4),rgba(251,146,60,.05));}
.crow.heating .crow-ic ha-icon{color:#fb7a3c;animation:pulse 1.6s infinite}
.crow.is-off .crow-ic ha-icon{color:#64748b}
.crow-txt{flex:1;min-width:0}.crow-name{font-size:15px;font-weight:500}.crow-sub{font-size:12.5px;color:var(--dim)}
.stepper{display:flex;align-items:center;gap:6px}
.stepper b{min-width:52px;text-align:center;font-size:17px;font-weight:600}
.sbtn{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;border:1px solid var(--line);background:rgba(255,255,255,.06)}
.sbtn:hover{border-color:rgba(147,197,253,.6)}
.sbtn ha-icon{--mdc-icon-size:18px}

.mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px}
.md{border-radius:24px;padding:16px;overflow:hidden;display:flex;flex-direction:column;gap:14px}
.md-bg{position:absolute;inset:-20%;background-size:cover;background-position:center;filter:blur(40px) brightness(.5) saturate(1.4);z-index:-1;opacity:.85}
.md.is-off{opacity:.75}
.md-row{display:flex;align-items:center;gap:14px}
.md-art{position:relative;width:76px;height:76px;border-radius:18px;flex:none;display:grid;place-items:center;background:rgba(255,255,255,.07) center/cover;box-shadow:0 10px 24px rgba(0,0,0,.4)}
.md-art ha-icon{--mdc-icon-size:36px;color:#a78bfa}
.md.playing .md-art{box-shadow:0 10px 24px rgba(0,0,0,.4),0 0 24px rgba(167,139,250,.45)}
.eq{position:absolute;right:6px;bottom:6px;display:flex;gap:2px;align-items:flex-end;height:16px}
.eq i{width:3px;background:#c4b5fd;border-radius:2px;animation:eq .9s ease-in-out infinite}
.eq i:nth-child(2){animation-delay:-.3s}.eq i:nth-child(3){animation-delay:-.6s}
.md-txt{flex:1;min-width:0}
.md-name{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#c4b5fd}
.md-title{font-size:17px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.md-sub{font-size:13px;color:var(--dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.md-ctl{display:flex;align-items:center;gap:10px}
.round.play{width:52px;height:52px;background:linear-gradient(180deg,rgba(167,139,250,.5),rgba(124,58,237,.25));border-color:rgba(167,139,250,.7)}
.vol{flex:1;display:flex;align-items:center;gap:8px;--lc:167,139,250}
.vol ha-icon{color:var(--dim)}

.dgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px;align-items:start}
.dev{border-radius:24px;padding:16px;display:flex;flex-direction:column;gap:14px}
.dev-hd{display:flex;align-items:center;gap:12px}
.dev-hd>div{flex:1;min-width:0}
.dev-ic{--mdc-icon-size:34px;color:#a5b4fc}
.dev-ic.spin{animation:spin 2s linear infinite}
.dev-name{font-size:16px;font-weight:600}.dev-sub{font-size:13px;color:var(--dim)}
.dev.is-off{opacity:.6}
.power{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;color:#64748b;border:1px solid var(--line);transition:.25s}
.power.on{color:#4ade80;border-color:rgba(74,222,128,.55);box-shadow:0 0 14px rgba(74,222,128,.5)}
.pur-body{display:flex;gap:16px;align-items:center}
.pm{width:110px;height:110px;border-radius:50%;flex:none;display:flex;flex-direction:column;align-items:center;justify-content:center;
  background:radial-gradient(circle,rgba(74,222,128,.22),rgba(74,222,128,.03) 70%);border:2px solid rgba(74,222,128,.5)}
.pm b{font-size:36px;font-weight:500;line-height:1}.pm span{font-size:10.5px;color:var(--dim);text-align:center}
.pm.warn{background:radial-gradient(circle,rgba(250,204,21,.22),transparent 70%);border-color:rgba(250,204,21,.55)}
.pm.bad{background:radial-gradient(circle,rgba(248,113,113,.25),transparent 70%);border-color:rgba(248,113,113,.6)}
.dev.purifier.on .pm{animation:breathe 4s ease-in-out infinite}
.pur-ctl{flex:1;display:flex;flex-direction:column;gap:12px;--lc:74,222,128}
.pur-ctl .mchips{justify-content:flex-start}
.bar{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--dim)}
.bar i{flex:1;height:6px;border-radius:3px;background:linear-gradient(90deg,#4ade80 0 var(--w),rgba(255,255,255,.1) var(--w))}
.bar b{color:var(--txt);font-weight:500}
.feed{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.stepper.big b{font-size:26px;min-width:34px}.stepper.big span{color:var(--dim);font-size:13px;margin-right:4px}
.cta{display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:999px;font-weight:600;font-size:14px;
  background:linear-gradient(180deg,rgba(236,72,153,.55),rgba(190,24,93,.3));border:1px solid rgba(244,114,182,.7);box-shadow:0 0 18px rgba(236,72,153,.35);transition:transform .2s}
.cta:hover{transform:translateY(-1px)}
.cta.sm{padding:8px 13px;font-size:13px;background:linear-gradient(180deg,rgba(56,189,248,.45),rgba(2,132,199,.2));border-color:rgba(56,189,248,.6);box-shadow:0 0 14px rgba(56,189,248,.3)}
.toggles{display:flex;flex-direction:column;gap:4px}
.trow{display:flex;justify-content:space-between;align-items:center;padding:8px 2px;border-top:1px solid var(--line);font-size:14px}
.appl-body{display:flex;align-items:center;gap:14px}
.rem b{font-size:38px;font-weight:300}.rem span{color:var(--dim);font-size:13px;margin-left:6px}
.tag{display:inline-flex;align-items:center;gap:6px;padding:6px 11px;border-radius:999px;font-size:12.5px;border:1px solid var(--line);background:rgba(255,255,255,.05)}
.tag ha-icon{--mdc-icon-size:15px}
.warnrow{display:flex;align-items:center;gap:8px;color:#fde68a;font-size:13.5px}
.warnrow ha-icon{color:#fbbf24}
.dev.appl.running{border-color:rgba(167,139,250,.55);box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 0 30px rgba(167,139,250,.25)}

.sgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px}
.sens{border-radius:18px;padding:13px 14px;display:flex;align-items:center;gap:12px;text-align:left}
.sens ha-icon{--mdc-icon-size:28px;color:#94a3b8}
.s-name{font-size:13px;color:var(--dim)}.s-val{font-size:16px;font-weight:600}
.sens.ok ha-icon{color:#4ade80}.sens.warn{border-color:rgba(251,191,36,.6)}.sens.warn ha-icon{color:#fbbf24}
.sens.bad{border-color:rgba(248,113,113,.8);animation:alarm 1.4s infinite}.sens.bad ha-icon{color:#f87171}
.sens.mint ha-icon{color:#5eead4}.sens.dim{opacity:.5}

.chart{border-radius:24px;padding:16px 16px 10px}
.chart svg{width:100%;height:200px;display:block;overflow:visible}
.cl{fill:none;stroke-width:2.5;vector-effect:non-scaling-stroke;stroke-dasharray:1;stroke-dashoffset:1;animation:draw 1.8s ease-out forwards}
.gl{stroke:rgba(255,255,255,.07);vector-effect:non-scaling-stroke}
.legend{display:flex;gap:22px;flex-wrap:wrap;margin-bottom:8px;font-size:13px;color:var(--dim)}
.legend span{display:flex;align-items:center;gap:7px}
.legend i{width:10px;height:10px;border-radius:50%}
.legend b{color:var(--txt);font-size:16px;font-weight:600;margin-left:4px}
.legend small{font-size:11.5px}
.axis{display:flex;justify-content:space-between;font-size:11.5px;color:#64748b;margin-top:4px}

/* ---------- animacje ---------- */
.rise{animation:rise .7s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--d,0) * 70ms)}
@keyframes rise{from{opacity:0;transform:translateY(18px) scale(.98)}to{opacity:1;transform:none}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes fadeOut{to{opacity:0;transform:scale(.985)}}
@keyframes slideL{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:none}}
@keyframes slideR{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:none}}
@keyframes kb{from{transform:scale(1.02)}to{transform:scale(1.12) translate(-1.5%,-1%)}}
@keyframes breathe{50%{opacity:.55}}
@keyframes pulse{50%{opacity:.5}}
@keyframes alarm{50%{box-shadow:0 0 18px rgba(248,113,113,.6)}}
@keyframes pulseT{0%{box-shadow:0 0 0 0 rgba(147,197,253,.7)}100%{box-shadow:0 0 0 18px rgba(147,197,253,0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes eq{0%,100%{height:4px}50%{height:16px}}
@keyframes draw{to{stroke-dashoffset:0}}
@keyframes drift{to{transform:translate(8%,6%) scale(1.12)}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}

/* ---------- responsywność ---------- */
@media (max-width:1100px){
  .bento{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:none;grid-auto-rows:minmax(200px,auto)}
  .sz-big{grid-row:span 1;min-height:280px}.sz-tall{grid-row:span 1}
}
@media (max-width:600px){
  .hub{padding:12px}
  h1{font-size:28px}
  .bento{grid-template-columns:minmax(0,1fr);grid-auto-rows:minmax(190px,auto)}
  .sz-big,.sz-wide{grid-column:span 1}
  .sz-big .t-name{font-size:28px}
  .hero{margin:10px 10px 0;min-height:340px}
  .rbody{padding:12px;gap:14px}
  .pur-body{flex-direction:column;align-items:stretch}.pm{align-self:center}
}

/* ---------- pasek pokoju: Dom · Pomieszczenia · zakładki ---------- */
.rtop{position:sticky;top:0;z-index:5;display:flex;align-items:center;gap:10px;padding:12px 18px 0}
.back.home{background:linear-gradient(180deg,rgba(59,130,246,.5),rgba(29,78,216,.25));border-color:#3b82f6;box-shadow:0 0 18px rgba(59,130,246,.5),inset 0 1px 0 rgba(255,255,255,.3);font-weight:600}
.back ha-icon{--mdc-icon-size:20px}
.rtabs{flex:1;display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:4px 2px;justify-content:flex-end}
.rtabs::-webkit-scrollbar{display:none}
.rtab{display:flex;align-items:center;gap:7px;padding:9px 14px;border-radius:999px;white-space:nowrap;font-size:14px;color:#cbd5e1;
  border:1px solid rgba(255,255,255,.1);background:rgba(12,20,40,.35);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);transition:.2s}
.rtab ha-icon{--mdc-icon-size:18px;color:rgb(var(--acc))}
.rtab:hover{border-color:rgba(var(--acc),.6);color:#fff}
.rtab.on{color:#fff;font-weight:600;border-color:rgba(var(--acc),.9);background:linear-gradient(180deg,rgba(var(--acc),.35),rgba(var(--acc),.12));box-shadow:0 0 16px rgba(var(--acc),.4),inset 0 1px 0 rgba(255,255,255,.25)}

/* ---------- pokój: przewijany (telefon / wąskie okno) ---------- */
.rgrid{display:flex;flex-direction:column;gap:16px;padding:14px 18px 24px}
.rgrid .col{display:contents}
.rgrid .hero{margin:0}

/* ---------- dopasowanie do ekranu (laptop / tablet) ---------- */
.page.fit{display:flex;align-items:center;justify-content:center;min-height:0}
.page.fit .stage{position:relative;width:1440px;height:var(--bh,820px);zoom:var(--z,1);flex:none}
.page.fit .hub{height:100%;min-height:0;padding:16px 20px 18px}
.page.fit .bento{min-height:0;grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(var(--rows,3),minmax(0,1fr));grid-auto-rows:auto}
.page.fit .sz-big{grid-column:span 2;grid-row:span 2;min-height:0}.page.fit .sz-wide{grid-column:span 2}.page.fit .sz-tall{grid-row:span 2}
.page.fit .room{height:100%;padding:0;display:flex;flex-direction:column}
.page.fit .rtop{position:relative;padding:14px 18px 0}
.page.fit .rgrid{flex:1;min-height:0;display:grid;grid-template-columns:340px minmax(0,1fr) 380px;gap:16px;padding:10px 18px 12px}
.page.fit .rgrid.two{grid-template-columns:420px minmax(0,1fr)}
.page.fit .rgrid .col{display:flex;flex-direction:column;gap:10px;min-height:0;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.18) transparent;padding:2px}
.page.fit .rgrid .sec{order:0!important;flex:none}
.page.fit .hero{height:min(310px,40%);min-height:230px;flex:none;border-radius:26px}
.page.fit .hero-body{left:22px;right:22px;bottom:18px}
.page.fit h2{font-size:44px}
.page.fit .hero-body p{font-size:14px;margin:2px 0 10px}
.page.fit .stat{padding:7px 11px}.page.fit .stat b{font-size:20px}
.page.fit .colA .s-chart{flex:1 1 auto;display:flex;flex-direction:column;min-height:170px}
.page.fit .colA .s-chart>.chart{flex:1;min-height:0}
.page.fit .chart{display:flex;flex-direction:column}
.page.fit .chart svg{flex:1;height:auto;min-height:80px}
.page.fit .sec-hd{font-size:16px;margin:0 4px 6px}
.page.fit .lgrid{grid-template-columns:repeat(auto-fill,minmax(142px,1fr));gap:10px}
.page.fit .lt{padding:10px;gap:8px;border-radius:18px}
.page.fit .bulb{width:42px;height:42px;border-radius:13px}.page.fit .bulb ha-icon{--mdc-icon-size:24px}
.page.fit .lt-main{gap:8px}
.page.fit .lt-name{font-size:14px}
.page.fit .cgrid{grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-flow:row dense;gap:10px}
.page.fit .cgrid .slot:has(.dial){grid-row:span 3}
.page.fit .cgrid.c1{grid-template-columns:minmax(0,1fr)}
.page.fit .cgrid.c1 .dial{max-width:420px;margin:0 auto;width:100%}
.page.fit .dial{padding:10px 12px;gap:4px}
.page.fit .dial-ring{width:min(176px,100%)}
.page.fit .dial-t{font-size:42px}.page.fit .dial-t small{font-size:20px}
.page.fit .dbtn{width:40px;height:40px}
.page.fit .mgrid,.page.fit .dgrid{grid-template-columns:minmax(0,1fr);gap:10px}
.page.fit .md,.page.fit .dev{padding:13px;gap:11px;border-radius:20px}
.page.fit .md-art{width:60px;height:60px;border-radius:14px}
.page.fit .pm{width:92px;height:92px}.page.fit .pm b{font-size:30px}
.page.fit .sgrid{grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px}
.page.fit .sens{padding:10px 12px}
.page.fit .colA .sgrid{grid-template-columns:repeat(2,minmax(0,1fr))}

/* ---------- drukarka 3D ---------- */
.cyan{color:#22d3ee}
.pulse-ic{animation:pulse 1.6s ease-in-out infinite}
.chip.pr{border-color:rgba(34,211,238,.6)}
.dev.printer.printing{border-color:rgba(34,211,238,.5);box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 0 30px rgba(34,211,238,.18)}
.dev.printer.failed{border-color:rgba(248,113,113,.8);animation:alarm 1.4s infinite}
.dev.printer .dev-ic{color:#67e8f9}
.pr-body{display:flex;gap:14px;align-items:center}
.pr-media{position:relative;flex:1;min-width:0;aspect-ratio:16/10;max-height:300px;border-radius:16px;overflow:hidden;background:rgba(2,6,16,.6);border:1px solid var(--line)}
.pr-media img{width:100%;height:100%;display:block}
.pr-media img.model{object-fit:contain;padding:6px;filter:drop-shadow(0 6px 14px rgba(0,0,0,.6))}
.pr-media img.cam{object-fit:cover}
.pr-noimg{width:100%;height:100%;display:grid;place-items:center;color:#475569}
.pr-noimg ha-icon{--mdc-icon-size:46px}
.pr-tabs{position:absolute;left:8px;bottom:8px;display:flex;gap:4px;padding:3px;border-radius:999px;background:rgba(4,8,20,.7);backdrop-filter:blur(8px)}
.pr-tabs button{display:flex;align-items:center;gap:5px;padding:4px 10px;border-radius:999px;font-size:11.5px;color:#cbd5e1}
.pr-tabs button.on{background:rgba(34,211,238,.25);color:#fff}
.live-dot{width:7px;height:7px;border-radius:50%;background:#f43f5e;box-shadow:0 0 6px #f43f5e;animation:blink 1.4s infinite}
.pr-ring{position:relative;width:128px;height:128px;flex:none}
.pr-ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.pr-track{fill:none;stroke:rgba(255,255,255,.08);stroke-width:10}
.pr-fill{fill:none;stroke:#22d3ee;stroke-width:10;stroke-linecap:round;transition:stroke-dashoffset 1s ease;filter:drop-shadow(0 0 6px rgba(34,211,238,.7))}
.printer.printing .pr-fill{animation:prglow 2.4s ease-in-out infinite}
.pr-c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.pr-c b{font-size:30px;font-weight:600;line-height:1}.pr-c b small{font-size:15px;color:var(--dim)}
.pr-c span{font-size:12px;color:#a5f3fc;margin-top:4px}
.pr-task{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pr-task ha-icon{--mdc-icon-size:18px;color:#67e8f9;flex:none}
.pr-task span{overflow:hidden;text-overflow:ellipsis}
.pr-meta,.pr-temps{display:flex;gap:16px;flex-wrap:wrap;font-size:13px;color:var(--dim)}
.pr-meta>div,.pr-temp{display:flex;align-items:center;gap:6px}
.pr-meta ha-icon,.pr-temp ha-icon{--mdc-icon-size:17px}
.pr-meta b,.pr-temp b{color:var(--txt);font-weight:600}
.pr-temp small{color:var(--dim)}
.pr-temp.hot ha-icon{color:#fb923c}
.fils{display:flex;gap:8px;flex-wrap:wrap}
.fil{display:flex;align-items:center;gap:6px;padding:4px 10px 4px 5px;border-radius:999px;font-size:12px;border:1px solid var(--line);background:rgba(255,255,255,.04)}
.fil i{width:16px;height:16px;border-radius:50%;box-shadow:inset 0 0 0 2px rgba(255,255,255,.25)}
.fil.empty{opacity:.45}.fil.empty i{box-shadow:inset 0 0 0 2px rgba(255,255,255,.2);background:repeating-linear-gradient(45deg,transparent 0 3px,rgba(255,255,255,.15) 3px 5px)!important}
.fil.on{border-color:#22d3ee;box-shadow:0 0 10px rgba(34,211,238,.4)}
.mchip.danger{border-color:rgba(248,113,113,.55);color:#fecaca}
.mchip.danger:hover{background:rgba(248,113,113,.15)}
.page.fit .pr-ring{width:110px;height:110px}
.page.fit .pr-media{aspect-ratio:16/9;max-height:230px}
@keyframes prglow{50%{filter:drop-shadow(0 0 12px rgba(34,211,238,1))}}

/* ---------- style: krystal – look of the Mieszkanie (Krystal Twin) panel ---------- */
.page.krystal{background:#0a1324}
.page.krystal .bg-img{background:radial-gradient(ellipse at 30% 10%,#1b3150,#0a1324 62%);filter:blur(60px) saturate(1.2) brightness(.55)}
.page.krystal .o1{background:#2b6f8f;opacity:.28}.page.krystal .o2{background:#3a4f78;opacity:.22}
.page.krystal .glass{background:radial-gradient(ellipse at 15% 0%,#edf6ff24,transparent 65%),linear-gradient(145deg,#4a5d74e6,#2f4157e6 55%,#223246e6);
  border-color:#edf6ff2e;box-shadow:inset 0 1px 0 #ffffff2e,0 14px 34px #0008}
.page.krystal .back,.page.krystal .rtab,.page.krystal .pill{background:#0a1324cc;border-color:#edf6ff2e}
.page.krystal .kicker{color:#8debff}
.page.krystal .sec-hd ha-icon,.page.krystal .rtab ha-icon{color:#8debff}
.page.krystal .rtab.on{border-color:#8debff;background:linear-gradient(180deg,#8debff40,#8debff14);box-shadow:0 0 16px #8debff55,inset 0 1px 0 #ffffff40}
.page.krystal .sw.on,.page.krystal .mchip.on{background:linear-gradient(145deg,#ffe0a6,#ffc46a);border-color:#ffe3a8;box-shadow:0 0 12px #ffc46a80}
.page.krystal .mchip.on{color:#2a1a05}
.page.krystal .sw.on i{background:#fff}
.page.krystal .mini:hover,.page.krystal .back:hover{border-color:#8debff99}
.page.krystal .cta,.page.krystal .cta.sm{background:linear-gradient(145deg,#8debff,#4cc3e6);border-color:#b8f3ff;color:#04202b;box-shadow:0 0 16px #8debff55}
.page.krystal .stat{background:#0a1324b3;border-color:#edf6ff2e}
/* glass 3D pictures instead of flat icons */
.art{display:block;object-fit:contain;pointer-events:none;user-select:none;transition:filter .4s,transform .4s}
.page.krystal .bulb,.page.krystal .crow-ic{background:none;overflow:visible}
.page.krystal .bulb .art{width:60px;height:60px;filter:grayscale(.75) brightness(.6) drop-shadow(0 6px 10px #0009)}
.page.krystal .lt.on .bulb{background:radial-gradient(circle,rgba(var(--lc),.38),transparent 70%)}
.page.krystal .lt.on .bulb .art{filter:drop-shadow(0 0 14px rgba(var(--lc),.85)) drop-shadow(0 6px 10px #0008);transform:scale(1.06)}
.page.krystal .lt.spin-ic .bulb .art{animation:none}
.page.krystal .lt.spin-ic.on .bulb .art{animation:breathe 2.4s ease-in-out infinite}
.page.krystal .crow-ic .art{width:52px;height:52px;filter:drop-shadow(0 6px 10px #0009)}
.page.krystal .crow.is-off .crow-ic .art{filter:grayscale(.8) brightness(.6)}
.page.krystal .crow.heating .crow-ic .art{filter:drop-shadow(0 0 12px #fb923ccc)}
.page.krystal .md-art .art{width:62px;height:62px;filter:drop-shadow(0 6px 10px #0009)}
.page.krystal .dev-ic.art{width:64px;height:64px;flex:none;margin:-6px 0;filter:drop-shadow(0 8px 14px #000a)}
.page.krystal .dev-ic.art.spin{animation:none}
.page.krystal .dev.appl.running .dev-ic.art,.page.krystal .dev-ic.art.pulse-ic{animation:breathe 2.6s ease-in-out infinite;filter:drop-shadow(0 0 14px #8debffaa)}
.page.krystal .sens .art{width:42px;height:42px;flex:none;filter:drop-shadow(0 4px 8px #0009)}
.page.krystal .sens.dim .art{filter:grayscale(1)}
.page.krystal.fit .bulb .art{width:50px;height:50px}
`;

if (!customElements.get("mieszkanie-rooms-card")) {
  customElements.define("mieszkanie-rooms-card", class extends LivingRoomsCard {
    setConfig(c) { super.setConfig({ style: "krystal", ...c }); }
  });
}


/* ---------- Living House Card – cat corner ----------
 * type: custom:living-cats-card
 * A living picture of the cat corner: the scene follows the litter box and the feeder
 * (cat inside, cleaning, eating, day/night) and glass panels control both devices.
 */
const LCC_SCENES = ["night", "day", "litter", "eating", "cleaning"]; // DOM order = stacking order (night at the bottom)
const LCC_CDN = "https://cdn.jsdelivr.net/gh/krystianokris/living-house-card@" + (LHC_VERSION.includes("_") ? "main" : "v" + LHC_VERSION) + "/images/cats/";
const LCC_OCCUPIED = ["occupied", "defecation", "cat_inside", "in_use"];
const LCC_CLEANING = ["cleaning", "working", "leveling", "emptying"];
const LCC_FEEDING = ["feeding", "dispensing"];
const LCC_FED_RECENT_MS = 3 * 60 * 1000;
const LCC_SWITCH_ICONS = [[/uv/, "mdi:sun-wireless-outline"], [/sleep|nocn|night/, "mdi:weather-night"], [/deodor|dezodor/, "mdi:scent"],
  [/slow|woln/, "mdi:tortoise"], [/light|swiatl|display/, "mdi:lightbulb-outline"], [/power|zasil/, "mdi:power"], [/lock|blokad/, "mdi:lock-outline"]];

class LivingCatsCard extends HTMLElement {
  static getStubConfig() {
    return {
      litter: { status: "sensor.litter_box_status", clean: "button.litter_box_clean", bin_full: "binary_sensor.litter_box_bin_full", weight: "sensor.litter_box_cat_weight", visits: "sensor.litter_box_visits_today", switches: [] },
      feeder: { status: "sensor.pet_feeder_status", portions: "number.pet_feeder_manual_feed", last: "sensor.pet_feeder_last_portion", switches: [] },
    };
  }

  setConfig(config) {
    if (!config || (!config.litter && !config.feeder)) throw new Error("living-cats-card: add `litter:` and/or `feeder:`");
    const sw = (l) => lhcArr(l).map((x) => (typeof x === "string" ? { entity: x } : x)).filter((x) => x && x.entity);
    const litter = config.litter ? { ...config.litter, switches: sw(config.litter.switches) } : null;
    const feeder = config.feeder ? { ...config.feeder, switches: sw(config.feeder.switches) } : null;
    this._cfg = { sun: "sun.sun", title: null, cat_name: null, ...config, litter, feeder };
    this._portions = null;
    this._fedAt = 0;
    if (this.shadowRoot) this.shadowRoot.innerHTML = "";
    this._root = null;
  }
  getCardSize() { return 8; }
  getGridOptions() { return { columns: 12, min_columns: 6 }; }

  _t(k, a) { return lhcT(this._lang || "en", k, a); }
  _m(g, k, f) { return lhcMap(this._lang || "en", g, k, f); }
  _s(id) { return id && this._hass ? this._hass.states[id] : undefined; }
  _ok(id) { const s = this._s(id); return !!s && !LHC_BAD.includes(s.state); }
  _on(id) { const s = this._s(id); return !!s && s.state === "on"; }
  _icon(i, extra = "") { return `<ha-icon icon="${i}" ${extra}></ha-icon>`; }

  _img(k) {
    const own = this._cfg.images && this._cfg.images[k];
    if (own) return own;
    const base = this._cfg.image_base ? String(this._cfg.image_base).replace(/\/?$/, "/") : LCC_CDN;
    return base + k + ".webp";
  }

  set hass(h) {
    const old = this._hass;
    this._hass = h;
    this._lang = lhcLang(h, this._cfg);
    if (!this._root) { this._build(); this._update(); return; }
    if (!old || this._ids().some((id) => old.states[id] !== h.states[id])) this._update();
  }

  connectedCallback() {
    if (!this._ro && window.ResizeObserver) this._ro = new ResizeObserver(() => this._layout());
    if (this._ro) this._ro.observe(this);
    clearInterval(this._tick);
    this._tick = setInterval(() => this._root && this._update(), 30000);
  }
  disconnectedCallback() {
    if (this._ro) this._ro.disconnect();
    clearInterval(this._tick);
  }

  _ids() {
    const c = this._cfg, ids = [c.sun];
    [c.litter, c.feeder].filter(Boolean).forEach((d) => Object.entries(d).forEach(([k, v]) => {
      if (k === "switches") v.forEach((x) => ids.push(x.entity));
      else if (typeof v === "string" && v.includes(".")) ids.push(v);
    }));
    return ids.filter(Boolean);
  }

  /* ---------- state ---------- */
  _dayFactor() {
    const f = this._cfg.force;
    if (f === "day") return 1;
    if (f === "night") return 0;
    const s = this._s(this._cfg.sun);
    if (!s) return 1;
    const el = Number(s.attributes.elevation);
    if (!Number.isFinite(el)) return s.state === "above_horizon" ? 1 : 0;
    return Math.max(0, Math.min(1, (el + 5) / 13));
  }
  _state() {
    const L = this._cfg.litter || {}, F = this._cfg.feeder || {};
    const ls = this._s(L.status), fs = this._s(F.status);
    const lst = ls ? ls.state : null, fst = fs ? fs.state : null;
    const cleaning = LCC_CLEANING.includes(lst) || (L.clean && L.clean.startsWith("switch.") && this._on(L.clean));
    const occupied = LCC_OCCUPIED.includes(lst) || (L.presence && this._on(L.presence));
    const fedChanged = fs && fst === "feeding_complete" ? Date.parse(fs.last_changed) : 0;
    const eating = LCC_FEEDING.includes(fst) || (fedChanged && Date.now() - fedChanged < LCC_FED_RECENT_MS) || Date.now() - this._fedAt < 20000;
    const full = !!(L.bin_full && this._on(L.bin_full)) || lst === "full";
    const problem = !!(L.problem && this._on(L.problem)) || lst === "fault" || lst === "blocked" || fst === "fault";
    const sleep = L.switches.some((x) => /sleep|nocn|night/.test(x.entity) && this._on(x.entity));
    const scene = cleaning ? "cleaning" : occupied ? "litter" : eating ? "eating" : null;
    return { lst, fst, cleaning, occupied, eating, full, problem, sleep, scene };
  }

  /* ---------- build once, then only update ---------- */
  _build() {
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    const L = this._cfg.litter, F = this._cfg.feeder;
    this.shadowRoot.innerHTML = `<style>${LCC_STYLE}</style>
      <div class="wrap">
        <div class="scene glass">
          ${LCC_SCENES.map((k) => `<div class="layer" data-k="${k}" style="background-image:url('${lhcEsc(this._img(k))}')"></div>`).join("")}
          <div class="tint"></div>
          <div class="fx fx-uv"></div><div class="fx fx-clean"><i></i><i></i></div><div class="fx fx-full"></div><div class="fx fx-feed"></div>
          ${this._cfg.back_path ? `<button class="back glass" data-nav="${lhcEsc(this._cfg.back_path)}">${this._icon("mdi:arrow-left")}<span>${lhcEsc(this._cfg.back_name || this._t("rooms_title"))}</span></button>` : ""}
          <div class="head"><div class="kicker">${this._t("cats_kicker")}</div><h2>${lhcEsc(this._cfg.title || this._cfg.cat_name || this._t("cats_title"))}</h2><div class="say"></div></div>
          ${L ? `<button class="spot glass s-litter" data-more="${lhcEsc(L.status || "")}">${this._icon("mdi:cat")}<span class="sp-txt"></span></button>` : ""}
          ${F ? `<button class="spot glass s-feeder" data-more="${lhcEsc(F.status || "")}">${this._icon("mdi:bowl-mix-outline")}<span class="sp-txt"></span></button>` : ""}
        </div>
        <div class="side">
          ${L ? `<section class="panel glass p-litter"></section>` : ""}
          ${F ? `<section class="panel glass p-feeder"></section>` : ""}
        </div>
      </div>`;
    this._root = this.shadowRoot.querySelector(".wrap");
    this._root.addEventListener("click", (e) => this._click(e));
    this._layout();
  }

  _layout() {
    if (!this._root) return;
    const w = this.clientWidth || this._root.clientWidth;
    this._root.classList.toggle("narrow", w > 0 && w < 860);
    this._root.classList.toggle("tiny", w > 0 && w < 560);
  }

  _update() {
    if (!this._root || !this._hass) return;
    const st = this._state(), d = this._dayFactor();
    const sc = this._root.querySelector(".scene");
    sc.style.setProperty("--day", d.toFixed(3));
    sc.querySelectorAll(".layer").forEach((el) => {
      const k = el.dataset.k;
      el.classList.toggle("show", k === "night" || (k === "day" && !st.scene) || k === st.scene);
    });
    sc.classList.toggle("ev", !!st.scene);
    const uvOn = (this._cfg.litter?.switches || []).some((x) => /uv/.test(x.entity) && this._on(x.entity));
    sc.classList.toggle("uv", uvOn && !st.cleaning && !st.occupied);
    sc.classList.toggle("cleaning", st.cleaning);
    sc.classList.toggle("full", st.full || st.problem);
    sc.classList.toggle("eating", st.eating);
    sc.querySelector(".say").innerHTML = this._say(st);
    const sl = sc.querySelector(".s-litter .sp-txt"), sf = sc.querySelector(".s-feeder .sp-txt");
    if (sl) { sl.textContent = this._litterText(st); sc.querySelector(".s-litter").classList.toggle("bad", st.full || st.problem); }
    if (sf) sf.textContent = this._feederText(st);
    const pl = this._root.querySelector(".p-litter"), pf = this._root.querySelector(".p-feeder");
    if (pl) pl.innerHTML = this._litterPanel(st);
    if (pf) pf.innerHTML = this._feederPanel(st);
  }

  _say(st) {
    const n = lhcEsc(this._cfg.cat_name || "");
    if (st.problem) return `<span class="bad">${this._icon("mdi:alert-outline")}${this._t("scene_problem")}</span>`;
    if (st.full) return `<span class="bad">${this._icon("mdi:delete-alert-outline")}${this._t("scene_full")}</span>`;
    if (st.cleaning) return `${this._icon("mdi:autorenew", 'class="spin"')}${this._t("scene_cleaning")}`;
    if (st.occupied) return `${this._icon("mdi:cat")}${this._t("scene_litter", n)}`;
    if (st.eating) return `${this._icon("mdi:food-drumstick-outline")}${this._t("scene_eating", n)}`;
    if (st.sleep) return `${this._icon("mdi:weather-night")}${this._t("scene_sleep")}`;
    return `${this._icon("mdi:check-circle-outline", 'class="ok"')}${this._t("scene_ok")}`;
  }
  _litterText(st) {
    if (st.full) return this._t("bin_full");
    return st.lst && !LHC_BAD.includes(st.lst) ? this._m("litter_st", st.lst, st.lst) : this._t("st_offline");
  }
  _feederText(st) {
    return st.fst && !LHC_BAD.includes(st.fst) ? this._m("feeder_st", st.fst, st.fst) : this._t("st_offline");
  }

  _val(id, digits) {
    const s = this._s(id);
    if (!s || LHC_BAD.includes(s.state)) return null;
    const n = Number(s.state);
    const v = Number.isFinite(n) && digits != null ? n.toFixed(digits) : s.state;
    return { v, u: s.attributes.unit_of_measurement || "", s };
  }
  _stat(icon, label, val, unit) {
    return `<div class="stat">${this._icon(icon)}<b>${val == null ? "—" : lhcEsc(val)}<small>${lhcEsc(unit || "")}</small></b><span>${label}</span></div>`;
  }
  _ago(iso) {
    const m = Math.round((Date.now() - Date.parse(iso)) / 60000);
    if (!Number.isFinite(m) || m < 0) return "";
    if (m < 1) return this._t("just_now");
    if (m < 60) return this._t("min_ago", m);
    const h = Math.floor(m / 60);
    return h < 24 ? this._t("h_ago", h) : "";
  }
  _switches(list) {
    if (!list.length) return "";
    return `<div class="tgl">${list.map((x) => {
      const s = this._s(x.entity), on = s && s.state === "on", ok = s && !LHC_BAD.includes(s.state);
      const icon = x.icon || (LCC_SWITCH_ICONS.find(([re]) => re.test(x.entity)) || [0, "mdi:toggle-switch-outline"])[1];
      const name = x.name || (s && s.attributes.friendly_name) || x.entity;
      return `<button class="tg ${on ? "on" : ""}" ${ok ? "" : "disabled"} data-toggle="${lhcEsc(x.entity)}" title="${lhcEsc(name)}">${this._icon(icon)}<span>${lhcEsc(name)}</span><i></i></button>`;
    }).join("")}</div>`;
  }

  _litterPanel(st) {
    const L = this._cfg.litter;
    const w = this._val(L.weight, 1), vis = this._val(L.visits, 0), dur = this._val(L.duration, 0);
    let durTxt = null, durU = "";
    if (dur) { const sec = Number(dur.v) * (/min/.test(dur.u) ? 60 : 1); if (Number.isFinite(sec)) { durTxt = sec >= 120 ? Math.round(sec / 60) : Math.round(sec); durU = sec >= 120 ? "min" : "s"; } }
    const alert = st.problem ? this._t("litter_problem") : st.full ? this._t("bin_full") : "";
    return `
      <div class="ph"><img class="ph-ic art" src="/krystal_twin_static/art/soft-litter.webp" alt="" draggable="false"><div><div class="pt">${lhcEsc(L.name || this._t("litter"))}</div><div class="ps ${st.full || st.problem ? "bad" : ""}">${lhcEsc(this._litterText(st))}</div></div>
        ${L.clean ? `<button class="cta" data-clean="${lhcEsc(L.clean)}" ${st.cleaning ? "disabled" : ""}>${this._icon("mdi:broom")}${this._t("clean")}</button>` : ""}</div>
      ${alert ? `<div class="warn">${this._icon("mdi:alert-outline")}${lhcEsc(alert)}</div>` : ""}
      <div class="stats">
        ${L.visits ? this._stat("mdi:counter", this._t("visits_today"), vis && vis.v, "") : ""}
        ${L.weight ? this._stat("mdi:scale-bathroom", this._t("cat_weight"), w && w.v, w ? w.u.toLowerCase() : "kg") : ""}
        ${L.duration ? this._stat("mdi:timer-outline", this._t("time_today"), durTxt, durU) : ""}
      </div>
      ${this._switches(L.switches)}`;
  }

  _feederPanel(st) {
    const F = this._cfg.feeder;
    const n = this._s(F.portions);
    const max = n ? Number(n.attributes.max) || 10 : 10, min = n ? Math.max(1, Number(n.attributes.min) || 1) : 1;
    const p = Math.max(min, Math.min(max, this._portions ?? min));
    const last = this._val(F.last, null);
    const lastTxt = last ? `${last.v} ${this._t("portions", Number(last.v))}` : null;
    const when = last && last.s.last_changed ? this._ago(last.s.last_changed) : "";
    return `
      <div class="ph"><img class="ph-ic art" src="/krystal_twin_static/art/soft-feeder.webp" alt="" draggable="false"><div><div class="pt">${lhcEsc(F.name || this._t("feeder"))}</div><div class="ps">${lhcEsc(this._feederText(st))}</div></div>
        ${F.quick_feed ? `<button class="cta ghost" data-quick="${lhcEsc(F.quick_feed)}">${this._icon("mdi:lightning-bolt-outline")}${this._t("quick_feed")}</button>` : ""}</div>
      ${F.last ? `<div class="stats">${this._stat("mdi:food-drumstick-outline", this._t("last_portion") + (when ? ` · ${when}` : ""), lastTxt, "")}</div>` : ""}
      ${F.portions ? `<div class="feed">
        <div class="step"><button data-step="-1" ${p <= min ? "disabled" : ""}>${this._icon("mdi:minus")}</button><b>${p}</b><span>${this._t("portions", p)}</span><button data-step="1" data-max="${max}" ${p >= max ? "disabled" : ""}>${this._icon("mdi:plus")}</button></div>
        <button class="cta" data-feed="${lhcEsc(F.portions)}" data-n="${p}">${this._icon("mdi:food-drumstick-outline")}${this._t("feed_now")}</button>
      </div>` : ""}
      ${this._switches(F.switches)}`;
  }

  /* ---------- actions ---------- */
  _more(id) { if (id) this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: id }, bubbles: true, composed: true })); }
  _press(id) {
    const dom = id.split(".")[0];
    if (dom === "button") return this._hass.callService("button", "press", { entity_id: id });
    if (dom === "script") return this._hass.callService("script", "turn_on", { entity_id: id });
    return this._hass.callService("homeassistant", "turn_on", { entity_id: id });
  }
  _click(e) {
    const b = e.target.closest("button");
    if (!b || b.disabled) return;
    const d = b.dataset;
    if (d.nav) return lhcNavigate(d.nav);
    if (d.more !== undefined) return this._more(d.more);
    if (d.toggle) return this._hass.callService("homeassistant", "toggle", { entity_id: d.toggle });
    if (d.step) {
      const F = this._cfg.feeder, n = this._s(F.portions);
      const max = n ? Number(n.attributes.max) || 10 : 10, min = n ? Math.max(1, Number(n.attributes.min) || 1) : 1;
      this._portions = Math.max(min, Math.min(max, (this._portions ?? min) + Number(d.step)));
      return this._update();
    }
    if (d.feed) {
      const n = Number(d.n) || 1;
      if (!confirm(this._t("feed_confirm", n))) return;
      this._fedAt = Date.now();
      this._update();
      return this._hass.callService("number", "set_value", { entity_id: d.feed, value: n });
    }
    if (d.quick) {
      if (!confirm(this._t("quick_confirm"))) return;
      this._fedAt = Date.now();
      this._update();
      return this._press(d.quick);
    }
    if (d.clean) {
      if (!confirm(this._t("clean_confirm"))) return;
      return this._press(d.clean);
    }
  }
}

const LCC_STYLE = `:host{display:block;--txt:#eef4ff;--dim:#9fb0cd;font-family:"Inter","Segoe UI",Roboto,system-ui,sans-serif;color:var(--txt)}
*{box-sizing:border-box}
button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
button:disabled{cursor:default;opacity:.45}
ha-icon{--mdc-icon-size:20px;display:inline-flex}
h2{margin:0}

.glass{position:relative;background:linear-gradient(150deg,rgba(255,255,255,.12),rgba(255,255,255,.035) 45%,rgba(255,255,255,.02)),rgba(12,20,40,.45);
  border:1px solid rgba(255,255,255,.13);box-shadow:inset 0 1px 0 rgba(255,255,255,.22),0 14px 40px rgba(0,0,0,.4);
  backdrop-filter:blur(22px) saturate(160%);-webkit-backdrop-filter:blur(22px) saturate(160%)}

.wrap{display:grid;grid-template-columns:minmax(0,1.85fr) minmax(290px,1fr);gap:16px;padding:4px}
.wrap.narrow{grid-template-columns:1fr}

/* ---------- scene ---------- */
.scene{aspect-ratio:1585/992;border-radius:26px;overflow:hidden;isolation:isolate;background:#151b38}
.layer{position:absolute;inset:0;background-size:cover;background-position:center;opacity:0;transition:opacity 1.2s ease}
.layer[data-k="night"]{opacity:1}
.layer[data-k="day"].show{opacity:var(--day,1)}
.layer.show:not([data-k="day"]):not([data-k="night"]){opacity:1}
.tint{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity 1.2s ease;
  background:radial-gradient(ellipse at 30% 20%,rgba(255,170,90,.18),transparent 45%),linear-gradient(180deg,rgba(20,28,70,.55),rgba(10,14,40,.6));mix-blend-mode:multiply}
.scene.ev .tint{opacity:calc(1 - var(--day,1))}

.fx{position:absolute;pointer-events:none;opacity:0;transition:opacity .8s ease;border-radius:50%}
.fx-uv{left:25.5%;top:46%;width:12%;height:18%;background:radial-gradient(circle,rgba(167,139,250,.55),rgba(124,58,237,.18) 55%,transparent 72%);mix-blend-mode:screen}
.scene.uv .fx-uv{opacity:calc(.35 + .5 * (1 - var(--day,1)));animation:breathe 4s ease-in-out infinite}
.fx-clean{left:22%;top:40%;width:19%;height:30%;background:radial-gradient(circle,rgba(34,211,238,.55),rgba(14,165,233,.15) 55%,transparent 72%);mix-blend-mode:screen}
.fx-clean i{position:absolute;inset:18%;border-radius:50%;border:2px solid rgba(165,243,252,.55);animation:ripple 2.2s ease-out infinite}
.fx-clean i+i{animation-delay:1.1s}
.scene.cleaning .fx-clean{opacity:1}
.fx-full{left:11%;top:30%;width:28%;height:50%;box-shadow:0 0 0 3px rgba(248,113,113,.7),0 0 40px 10px rgba(248,113,113,.35);border-radius:46% 46% 18% 18%}
.scene.full .fx-full{opacity:1;animation:alarm 1.6s ease-in-out infinite}
.fx-feed{left:74%;top:60%;width:17%;height:20%;background:radial-gradient(circle,rgba(251,191,36,.5),rgba(245,158,11,.12) 55%,transparent 72%);mix-blend-mode:screen}
.scene.eating .fx-feed{opacity:1;animation:breathe 2.6s ease-in-out infinite}

.back{position:absolute;right:3%;top:4%;z-index:2;display:flex;align-items:center;gap:7px;padding:9px 15px;border-radius:999px;font-size:14px;transition:border-color .2s,transform .2s}
.back:hover{border-color:rgba(147,197,253,.55);transform:translateY(-1px)}
.back ha-icon{--mdc-icon-size:18px}
.tiny .back{padding:6px 10px;font-size:12px}.tiny .back span{display:none}
.head{position:absolute;left:3%;top:4%;max-width:46%;padding:12px 16px;border-radius:18px;background:rgba(8,12,28,.42);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.12)}
.kicker{font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:#8fb4e8}
.head h2{font-size:24px;font-weight:600;letter-spacing:-.01em;background:linear-gradient(90deg,#fff,#a5c8ff);-webkit-background-clip:text;background-clip:text;color:transparent}
.say{display:flex;align-items:center;gap:6px;margin-top:4px;font-size:14px;color:#dbe7ff}
.say>span{display:flex;align-items:center;gap:6px}
.say ha-icon{--mdc-icon-size:18px}
.say .ok{color:#4ade80}.say .bad{color:#fca5a5}
.spin{animation:spin 1.6s linear infinite}

.spot{position:absolute;display:flex;align-items:center;gap:7px;padding:7px 12px 7px 9px;border-radius:999px;font-size:13px;white-space:nowrap;transform:translate(-50%,-50%);transition:transform .25s,border-color .25s}
.spot:hover{transform:translate(-50%,-50%) scale(1.05);border-color:rgba(147,197,253,.6)}
.spot ha-icon{--mdc-icon-size:17px;color:#93c5fd}
.spot.bad{border-color:rgba(248,113,113,.75)}.spot.bad ha-icon{color:#f87171}
.s-litter{left:24.5%;top:29%}
.s-feeder{left:85%;top:35%}

.tiny .scene{border-radius:20px}
.tiny .head{left:3%;top:3%;max-width:64%;padding:7px 10px;border-radius:13px}
.tiny .kicker{display:none}
.tiny .head h2{font-size:16px}
.tiny .say{font-size:11.5px;margin-top:1px;gap:4px}
.tiny .say ha-icon{--mdc-icon-size:14px}
.tiny .spot{display:none}

/* ---------- panels ---------- */
.side{display:flex;flex-direction:column;gap:16px;min-width:0}
.wrap.narrow .side{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
.panel{border-radius:22px;padding:16px;display:flex;flex-direction:column;gap:14px}
.ph{display:flex;align-items:center;gap:12px}
.ph>div{flex:1;min-width:0}
.ph-ic{--mdc-icon-size:22px;width:42px;height:42px;border-radius:14px;display:grid;place-items:center;background:rgba(96,165,250,.14);color:#93c5fd;flex:none}
.pt{font-size:16px;font-weight:600}
.ps{font-size:13px;color:var(--dim)}.ps.bad{color:#fca5a5}
.cta{display:flex;align-items:center;gap:7px;padding:10px 15px;border-radius:14px;font-size:14px;font-weight:600;
  background:linear-gradient(135deg,#3b82f6,#6366f1);box-shadow:0 8px 24px rgba(59,130,246,.35);transition:transform .2s,box-shadow .2s;white-space:nowrap}
.cta:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 12px 30px rgba(59,130,246,.5)}
.cta ha-icon{--mdc-icon-size:18px}
.cta.ghost{background:rgba(255,255,255,.08);box-shadow:none;border:1px solid rgba(255,255,255,.14);font-weight:500}
.warn{display:flex;align-items:center;gap:8px;padding:9px 12px;border-radius:12px;font-size:13.5px;background:rgba(248,113,113,.14);border:1px solid rgba(248,113,113,.45);color:#fecaca}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:10px}
.stat{display:flex;flex-direction:column;gap:2px;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}
.stat ha-icon{--mdc-icon-size:17px;color:#93c5fd}
.stat b{font-size:20px;font-weight:600}
.stat b small{font-size:12px;font-weight:500;color:var(--dim);margin-left:3px}
.stat span{font-size:12px;color:var(--dim)}
.feed{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.step{flex:1;display:flex;align-items:center;justify-content:center;gap:10px;padding:6px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);min-width:150px}
.step button{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;background:rgba(255,255,255,.08)}
.step b{font-size:20px;min-width:22px;text-align:center}
.step span{font-size:13px;color:var(--dim);min-width:52px}
.tgl{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px}
.tg{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:14px;font-size:13px;text-align:left;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);transition:background .25s,border-color .25s}
.tg span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tg ha-icon{--mdc-icon-size:18px;color:var(--dim)}
.tg i{width:26px;height:15px;border-radius:999px;background:rgba(255,255,255,.18);position:relative;flex:none;transition:background .25s}
.tg i::after{content:"";position:absolute;top:2px;left:2px;width:11px;height:11px;border-radius:50%;background:#fff;transition:transform .25s}
.tg.on{background:rgba(96,165,250,.16);border-color:rgba(96,165,250,.45)}
.tg.on ha-icon{color:#93c5fd}.tg.on i{background:#3b82f6}.tg.on i::after{transform:translateX(11px)}

@keyframes breathe{0%,100%{filter:brightness(1)}50%{filter:brightness(1.35)}}
@keyframes ripple{0%{transform:scale(.5);opacity:.9}100%{transform:scale(1.5);opacity:0}}
@keyframes alarm{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}

/* ---------- Mieszkanie (Krystal) look ---------- */
.glass{background:radial-gradient(ellipse at 15% 0%,#edf6ff24,transparent 65%),linear-gradient(145deg,#4a5d74e6,#2f4157e6 55%,#223246e6);
  border-color:#edf6ff2e;box-shadow:inset 0 1px 0 #ffffff2e,0 14px 34px #0008}
.scene{background:#0a1324;border:1px solid #edf6ff2e}
.back,.spot{background:#0a1324cc;border-color:#edf6ff2e}
.back:hover,.spot:hover{border-color:#8debff99}
.head{background:#0a1324b3;border-color:#edf6ff2e}
.kicker{color:#8debff}
.head h2{background:linear-gradient(90deg,#fff,#8debff);-webkit-background-clip:text;background-clip:text}
.spot ha-icon,.stat ha-icon{color:#8debff}
.ph-ic.art{width:64px;height:64px;margin:-8px 0;background:none;border-radius:0;object-fit:contain;filter:drop-shadow(0 8px 14px #000a)}
.cta{background:linear-gradient(145deg,#8debff,#4cc3e6);color:#04202b;box-shadow:0 8px 22px #8debff40}
.cta:hover:not(:disabled){box-shadow:0 12px 28px #8debff66}
.cta.ghost{background:#ffffff0d;color:#eef4fb;border-color:#edf6ff2e}
.stat,.step,.tg{background:#0a132466;border-color:#edf6ff1f}
.step button{background:#ffffff12}
.tg.on{background:linear-gradient(145deg,#ffe0a6,#ffc46a);border-color:#ffe3a8;color:#2a1a05}
.tg.on ha-icon{color:#2a1a05}.tg.on i{background:#2a1a0566}
`;

if (!customElements.get("mieszkanie-cats-card")) customElements.define("mieszkanie-cats-card", class extends LivingCatsCard {});

})();
