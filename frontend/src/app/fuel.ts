import { createEffect, createSignal, onCleanup, type Accessor } from "solid-js";
import { useHass } from "../sdk";
import type { Hass } from "../sdk/types";

export type FuelCode = "B7" | "E10";

export interface FuelStation {
  id: string;
  brand?: string;
  address?: string;
  postcode?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  price?: number;
  prices?: Partial<Record<string, number>>;
  priceUpdated?: string;
}

export interface FuelResult {
  fuel: string;
  cheapest?: number;
  priceUnit?: string;
  radius?: number;
  centre?: { label?: string; latitude?: number; longitude?: number };
  fetchedAt?: string;
  source?: string;
  stations: FuelStation[];
}

export interface FuelMap {
  image: string;
  width: number;
  height: number;
  zoom?: number;
  home?: { x: number; y: number };
  pins: { id: string; x: number; y: number }[];
  radiusPixels?: number;
}

interface FuelState {
  B7?: FuelResult;
  E10?: FuelResult;
  map?: FuelMap;
  mapError?: string;
  loading: boolean;
  error?: string;
  updated?: Date;
}

const REFRESH_MS = 15 * 60_000;
const SEARCH = { limit: 5, radius: 10, unit: "mi", sort: "price" };
const MAX_MAP_STATIONS = 20;

const [state, setState] = createSignal<FuelState>({ loading: false });
/** Fuel tab and hovered station are shared by the list, the map and the overview card. */
export const [fuelTab, setFuelTab] = createSignal<FuelCode>("B7");
export const [hotStation, setHotStation] = createSignal<string | undefined>();

let latestHass: Hass | undefined;
let timer: ReturnType<typeof setInterval> | undefined;
let users = 0;
let lastFetch = 0;
let mapKey = "";

async function call<T>(hass: Hass, domains: string[], service: string, data: Record<string, unknown>): Promise<T> {
  if (!hass.connection) throw new Error("no websocket connection");
  let last: unknown;
  for (const domain of domains) {
    try {
      const res = await hass.connection.sendMessagePromise<{ response?: T }>({
        type: "call_service",
        domain,
        service,
        service_data: data,
        return_response: true,
      });
      if (res?.response) return res.response;
      last = new Error(`${domain}.${service} returned no response`);
    } catch (err) {
      last = err;
    }
  }
  throw last ?? new Error(`${service} failed`);
}

const describe = (err: unknown) => (err as { message?: string })?.message ?? String(err);

async function search(hass: Hass, fuel: FuelCode): Promise<FuelResult | undefined> {
  try {
    return await call<FuelResult>(hass, ["glasshome_fuel", "fuel_prices"], "search", { ...SEARCH, fuel });
  } catch (err) {
    console.warn(`[krystal] fuel search ${fuel} failed`, err);
    return undefined;
  }
}

/** The bridge map wants `home` from the search centre and string ids; cached per station set. */
async function loadMap(hass: Hass, results: (FuelResult | undefined)[], force: boolean): Promise<Pick<FuelState, "map" | "mapError">> {
  const centre = results.find((r) => r?.centre?.latitude !== undefined)?.centre;
  const seen = new Map<string, { id: string; latitude: number; longitude: number }>();
  for (const r of results) {
    for (const st of (r?.stations ?? []).slice(0, 5)) {
      if (st.latitude === undefined || st.longitude === undefined) continue;
      const id = String(st.id);
      if (!seen.has(id)) seen.set(id, { id, latitude: st.latitude, longitude: st.longitude });
    }
  }
  const stations = [...seen.values()].slice(0, MAX_MAP_STATIONS);
  if (!centre || !stations.length) return { map: undefined, mapError: "no stations" };
  const key = `${centre.latitude},${centre.longitude}|${stations.map((s) => s.id).sort().join(",")}`;
  const current = state();
  if (!force && key === mapKey && current.map) return { map: current.map };
  try {
    const map = await call<FuelMap>(hass, ["glasshome_fuel"], "map", {
      home: { latitude: centre.latitude, longitude: centre.longitude },
      stations,
      radius: SEARCH.radius,
      unit: SEARCH.unit,
    });
    if (!map?.image) throw new Error("map response without image");
    mapKey = key;
    return { map: { ...map, pins: (map.pins ?? []).map((p) => ({ ...p, id: String(p.id) })) } };
  } catch (err) {
    console.warn("[krystal] fuel map failed, showing radar", err);
    mapKey = "";
    return { map: undefined, mapError: describe(err) };
  }
}

async function refresh(force = false) {
  const hass = latestHass;
  if (!hass || state().loading) return;
  if (!force && Date.now() - lastFetch < REFRESH_MS - 5_000) return;
  lastFetch = Date.now();
  setState((s) => ({ ...s, loading: true }));
  const [B7, E10] = await Promise.all([search(hass, "B7"), search(hass, "E10")]);
  const map = await loadMap(hass, [B7, E10], force);
  setState({ B7, E10, ...map, loading: false, updated: new Date(), error: B7 || E10 ? undefined : "empty" });
}

/** Shared, 15-minute cached fuel prices and map from the fuel bridge service. */
export function useFuel(): Accessor<FuelState> {
  const hass = useHass();
  createEffect(() => {
    latestHass = hass();
    if (latestHass) void refresh();
  });
  users += 1;
  if (!timer) timer = setInterval(() => void refresh(true), REFRESH_MS);
  onCleanup(() => {
    users -= 1;
    if (users <= 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  });
  return state;
}

/** Station list merged from both searches, ordered by the selected fuel. */
export function stationsFor(s: FuelState, fuel: FuelCode): FuelStation[] {
  const byId = new Map<string, FuelStation>();
  for (const result of [s.B7, s.E10]) {
    for (const st of result?.stations ?? []) {
      const id = String(st.id);
      const prev = byId.get(id);
      byId.set(id, { ...prev, ...st, id, prices: { ...prev?.prices, ...st.prices } });
    }
  }
  const price = (st: FuelStation) => st.prices?.[fuel] ?? Number.POSITIVE_INFINITY;
  return [...byId.values()].filter((st) => Number.isFinite(price(st))).sort((a, b) => price(a) - price(b));
}

export function mapsLink(st: FuelStation): string {
  const dest = st.latitude !== undefined && st.longitude !== undefined ? `${st.latitude},${st.longitude}` : encodeURIComponent(st.address ?? "");
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
}

const COUNTY = /(SHIRE|^ESSEX|^KENT|^SURREY|^NORFOLK|^SUFFOLK|^CORNWALL|^DEVON|^LONDON$|^GREATER )/;

function titleCase(text: string): string {
  return text.toLowerCase().replace(/(^|[\s-])\p{L}/gu, (m) => m.toUpperCase());
}

/** "Serpentine Green Shopping Centre, Peterborough" from a UK Fuel Finder address. */
export function stationLabel(st: FuelStation): { name: string; town: string } {
  const parts = (st.address ?? "").split(",").map((p) => p.trim()).filter(Boolean);
  const words = parts.filter((p) => !/\d/.test(p) && p.length > 2);
  const town = [...words].reverse().find((p) => !COUNTY.test(p)) ?? "";
  const brand = (st.brand ?? "").trim().toUpperCase();
  const first = words.find((p) => p !== town && p.toUpperCase() !== brand) ?? "";
  return { name: titleCase(first), town: titleCase(town) };
}
