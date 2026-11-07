export interface Room3d {
  id: string;
  name: string;
  image: string;
  path: string;
}

const BASE = "/mieszkanie-pokoje/pokoje";
const IMG = "/krystal_twin_static/rooms/";

/** Twin room id -> room on that dashboard (WC lives under "Korytarz i WC"). */
const MAP: Record<string, { id: string; name?: string }> = {
  salon: { id: "salon" },
  kuchnia: { id: "kuchnia" },
  sypialnia: { id: "sypialnia" },
  gabinet: { id: "gabinet" },
  lazienka: { id: "lazienka" },
  korytarz: { id: "korytarz", name: "Korytarz i WC" },
  wc: { id: "korytarz", name: "Korytarz i WC" },
  pralnia: { id: "pralnia" },
};

export function room3d(twinId: string): Room3d | undefined {
  const m = MAP[twinId];
  if (!m) return undefined;
  return { id: m.id, name: m.name ?? "", image: `${IMG}${m.id}.webp`, path: `${BASE}#${m.id}` };
}

/** Extra shortcuts shown in a room's panel. */
export const EXTRAS: Record<string, { name: string; kicker: string; image: string; path: string }[]> = {
  gabinet: [{ name: "Kocia strefa", kicker: "Kuweta i karmnik", image: "/krystal_twin_static/cats/day.webp", path: "/mieszkanie-pokoje/koty" }],
};

/** Navigate inside Home Assistant without reloading the page. */
export function haNavigate(path: string) {
  history.pushState(null, "", path);
  window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
}
