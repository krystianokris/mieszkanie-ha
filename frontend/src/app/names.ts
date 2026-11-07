import type { HassEntity } from "../sdk";

/**
 * Display names for a Polish (or English) dashboard: layout.json `names` overrides
 * first, then the layout item name, then the HA friendly name, each cleaned of
 * model codes, underscores and English room words.
 */
let overrides: Record<string, string> = {};

export function setNameOverrides(map: Record<string, string> | undefined): void {
  overrides = map ?? {};
}

export type NameKind = "temperature" | "humidity" | "battery" | "climate" | "leak" | "presence" | "window" | "co" | "coLevel" | "generic";

/** Room and object words seen in English entity names; matched on whole words, case-insensitive. */
const WORDS: [RegExp, string][] = [
  [/\bliving[\s_-]*room\b/gi, "Salon"],
  [/\bfamily[\s_-]*room\b/gi, "Salon"],
  [/\blounge\b/gi, "Salon"],
  [/\bkitchen\b/gi, "Kuchnia"],
  [/\bbedroom\b/gi, "Sypialnia"],
  [/\bbathroom\b/gi, "Łazienka"],
  [/\blazienka\b/gi, "Łazienka"],
  [/\bhallway\b|\bhall\b|\bcorridor\b/gi, "Korytarz"],
  [/\btoilet\b|\bkibelek\b|\bwc\b/gi, "WC"],
  [/\bgarage\b/gi, "Garaż"],
  [/\bstairs\b/gi, "Schody"],
  [/\boffice\b/gi, "Biuro"],
  [/\bfloor\b/gi, "podłoga"],
  [/\bpokoj\b/gi, "pokój"],
  [/\bsalon\b/gi, "Salon"],
  [/\bkuchnia\b/gi, "Kuchnia"],
  [/\bsypialnia\b/gi, "Sypialnia"],
  [/\bgabinet\b/gi, "Gabinet"],
  [/\bpralnia\b/gi, "Pralnia"],
  [/\bpralka\b/gi, "Pralka"],
  [/\bprysznic\b/gi, "Prysznic"],
  [/\bwashing[\s_-]*machine\b/gi, "Pralka"],
  [/\bdryer\b/gi, "Suszarka"],
  [/\bair[\s_-]*conditioner\b/gi, "Klimatyzacja"],
];

/** Integration phrases, applied before model codes are stripped (so "Core 300S" becomes a word, not a code). */
const PHRASES: [RegExp, string][] = [
  [/\bcore\s?\d{3}s?\b|\bvital\s?\d{3}s?\b/gi, "Oczyszczacz"],
  [/\bpm\s?2[\s.,_]?5\b/gi, "PM2.5"],
  [/\bpm\s?10\b/gi, "PM10"],
  [/\bfilter[\s_]*life(time)?\b/gi, "filtr"],
  [/\bair[\s_]*quality\b/gi, "jakość powietrza"],
  [/\bwater[\s_]*box[\s_]*full\b/gi, "pojemnik na wodę"],
  [/\bclean[\s_]*filter\b/gi, "filtr do czyszczenia"],
  [/\bdetergent(\s+state)?\b/gi, "detergent"],
  [/\bsoftener(\s+state)?\b/gi, "zmiękczacz"],
  [/\bdoor\b/gi, "drzwi"],
  [/\bwindow\b/gi, "okno"],
  [/\bself[\s_-]*test(\s+result)?\b/gi, "autotest"],
  [/\bnowy\b|\bnew\b/gi, ""],
];

/** Device prefixes in ids/names and the Polish object they stand for. */
const DEVICE: [RegExp, string, NameKind[]][] = [
  [/\bwater[\s_]*sensor\b|\bleak[\s_]*sensor\b/gi, "Czujnik zalania", []],
  [/\bczujnik[\s_]*co\b/gi, "Czujnik CO", ["co", "coLevel"]],
  [/\btemp(?:erature)?[\s_]*sensor\b|^temp\b/gi, "Termometr", ["temperature", "humidity"]],
  [/\bokno\b/gi, "Okno", []],
  [/\bsensor\b/gi, "Czujnik", ["presence"]],
];

/** Trailing kind words the tile already shows through its art or value. */
const KIND_WORDS =
  /\s*\b(thermostat|termostat|temperature|temperatura|humidity|wilgotnosc|wilgotność|battery|bateria|moisture|water[\s_]*leak|contact|occupancy|presence|carbon[\s_]*monoxide)\s*$/i;

/** Whole English labels from device integrations. */
const SHORT: Record<string, string> = {
  sleep: "Tryb nocny",
  clean: "Czyszczenie",
  power: "Zasilanie",
  quick: "Szybkie karmienie",
  slow: "Wolne karmienie",
  manual: "Ręczne karmienie",
  status: "Status",
  "air conditioner": "Klimatyzacja",
};

/** Model codes: MTS200-5727, SNZB-06P, TS0601, 06p, long hex ids, bare numbers. */
const MODEL = /\b(?=[a-z0-9-]*\d)(?=[a-z0-9-]*[a-z])[a-z0-9]+(?:-[a-z0-9]+)+\b|\b[a-z]{2,5}\d{3,}[a-z0-9]*\b|\b\d{2}[a-z]\b|\b[0-9a-f]{10,}\b|\b\d{3,}\b/gi;

const KIND_LABEL: Partial<Record<NameKind, string>> = {
  temperature: "Temperatura",
  humidity: "Wilgotność",
  battery: "Bateria",
  climate: "Termostat",
  co: "Alarm CO",
  coLevel: "Poziom CO",
};

function titleCase(s: string): string {
  return s ? s.charAt(0).toLocaleUpperCase("pl") + s.slice(1) : s;
}

/** Cleans one raw name; `kind` decides which device prefix and trailing word are redundant. */
export function cleanName(raw: string | undefined, kind: NameKind = "generic"): string {
  if (!raw) return "";
  const whole = SHORT[raw.trim().toLowerCase()];
  if (whole) return whole;
  let s = raw.replace(/_/g, " ").replace(/\s+/g, " ").trim();
  // "(plug)", "(R4)": hardware notes, not names.
  s = s.replace(/\s*\((plug|socket|gniazdko|relay|przekaźnik|r\d+)\)/gi, "");
  for (const [re, word] of PHRASES) s = s.replace(re, word);
  s = s.replace(MODEL, " ");

  let device = "";
  for (const [re, label, kinds] of DEVICE) {
    if (re.test(s)) {
      s = s.replace(re, " ");
      if (!kinds.includes(kind)) device = label;
      break;
    }
  }
  if (kind !== "generic") for (let i = 0; i < 2; i++) s = s.replace(KIND_WORDS, "");
  if (kind === "co" || kind === "coLevel") s = s.replace(/^\s*(alarm\s+)?co\s*$/i, "");
  for (const [re, word] of WORDS) s = s.replace(re, word);
  s = s.replace(/\s+/g, " ").replace(/^[\s·,-]+|[\s·,-]+$/g, "").trim();

  // "Salon podłoga" reads better than "podłoga Salon".
  s = s.replace(/^podłoga\s+(\S+)$/i, "$1 podłoga");
  if (device) s = s ? `${device} · ${s}` : device;
  else s = titleCase(s);
  return s || KIND_LABEL[kind] || raw.trim();
}

/** The kind a tile shows for an entity, so its name can drop the matching words. */
export function nameKind(e: HassEntity | undefined, id = e?.entity_id ?? ""): NameKind {
  const domain = id.split(".")[0];
  const dc = String(e?.attributes.device_class ?? "");
  if (domain === "climate") return "climate";
  if (dc === "temperature") return "temperature";
  if (dc === "humidity") return "humidity";
  if (dc === "battery") return "battery";
  if (dc === "moisture") return "leak";
  if (["occupancy", "presence", "motion"].includes(dc)) return "presence";
  if (["window", "opening", "door"].includes(dc)) return "window";
  if (dc === "carbon_monoxide") return domain === "binary_sensor" ? "co" : "coLevel";
  if (/_co_co$/.test(id)) return "coLevel";
  if (/_battery$/.test(id)) return "battery";
  if (/_temperature$|_temperatura$/.test(id)) return "temperature";
  if (/_humidity$|_wilgotnosc$/.test(id)) return "humidity";
  return "generic";
}

/** Name to show for an entity: override → layout item name → friendly name → id. */
export function displayName(id: string, e?: HassEntity, itemName?: string, kind?: NameKind): string {
  if (overrides[id]) return overrides[id];
  const k = kind ?? nameKind(e, id);
  if (itemName) return cleanName(itemName, k);
  const friendly = e?.attributes.friendly_name ? String(e.attributes.friendly_name) : id.split(".")[1] ?? id;
  return cleanName(friendly, k);
}
