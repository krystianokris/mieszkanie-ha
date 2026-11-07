import type { Breakpoint } from "../sdk/context";
import { domainOf } from "../sdk/format";
import type { TileInstance, TileSize } from "../sdk/tiles";
import { FUEL_PAGE, isEnergyPage, isLaundryPage, type Features } from "./features";
import type { LayoutItem, LayoutPage, LayoutSection } from "./model";

const ROW = 70;
const GAP = 16;

function rowsFor(px: number): number {
  return Math.max(2, Math.ceil((px + GAP) / (ROW + GAP)));
}

/** Per-breakpoint footprint of a panel section with `n` item wells. */
export function panelSizes(n: number): Record<Breakpoint, TileSize> {
  const h = (cols: number) => rowsFor(28 + 44 + Math.ceil(n / cols) * 64 + (Math.ceil(n / cols) - 1) * 8);
  return { lg: { w: 6, h: h(2) }, md: { w: 8, h: h(3) }, sm: { w: 4, h: h(2) } };
}

function canvasSizes(n: number): Record<Breakpoint, TileSize> {
  const h = (cols: number) => rowsFor(28 + 118 + Math.ceil(n / cols) * 84 + (Math.ceil(n / cols) - 1) * 10);
  return { lg: { w: 12, h: h(3) }, md: { w: 8, h: h(3) }, sm: { w: 4, h: h(1) } };
}

const CLIMATE_DOMAINS = new Set(["climate", "water_heater"]);

/** Turns one layout page into grid tiles; `features` adds the live energy/laundry/fuel tiles. */
export function tilesForPage(page: LayoutPage, features?: Features, isAc?: (id: string) => boolean): TileInstance[] {
  const tiles: TileInstance[] = [];
  const devices = page.devices ?? [];
  const deviceIds = new Set(devices.map((d) => d.entity));

  if (page.id === FUEL_PAGE) {
    return [
      { id: "fuelstations", type: "fuelstations", config: {} },
      { id: "fuelmap", type: "fuelmap", config: {} },
    ];
  }

  if (page.kind === "overview") {
    for (const room of page.rooms ?? []) {
      tiles.push({ id: `room-${room.page ?? room.name}`, type: "roomcard", config: { room } });
    }
    if (features?.fuel) tiles.push({ id: "fuelcard", type: "fuelcard", config: { link: true } });
  }

  const energy = features?.energy;
  if (energy && isEnergyPage(page.id, page.title)) {
    tiles.push({ id: "energy-hero", type: "energy-hero", config: { ids: energy } });
    if (energy.ratesToday) tiles.push({ id: "energy-slots", type: "energy-slots", config: { ids: energy } });
    if (energy.elecCost || energy.gasCost) tiles.push({ id: "energy-today", type: "energy-today", config: { ids: energy } });
  }

  if (isLaundryPage(page.id, page.title)) {
    if (features?.washer) tiles.push({ id: "washer", type: "appliance", config: { ids: features.washer, dryer: false } });
    if (features?.dryer) tiles.push({ id: "dryer", type: "appliance", config: { ids: features.dryer, dryer: true } });
  }

  if (page.kind === "room" && devices.length) {
    tiles.push({
      id: `canvas-${page.id}`,
      type: "canvas",
      config: { page: page.id, title: page.title, image: page.image, devices, temperature: page.temperature, humidity: page.humidity },
      sizes: canvasSizes(devices.length),
    });
  }

  const sections = page.sections ?? [];
  const climates: string[] = [];
  if (page.kind !== "overview") {
    for (const s of sections) for (const i of s.items) if (CLIMATE_DOMAINS.has(domainOf(i.entity)) && !climates.includes(i.entity)) climates.push(i.entity);
    for (const d of devices) if (CLIMATE_DOMAINS.has(domainOf(d.entity)) && !climates.includes(d.entity)) climates.push(d.entity);
  }
  for (const id of climates.slice(0, 4)) {
    if (isAc?.(id)) tiles.push({ id: `ac-${id}`, type: "ac", config: { entity: id, extras: features?.climateExtras?.[id] ?? [] } });
    else tiles.push({ id: `climate-${id}`, type: "climate", config: { entity: id } });
  }

  if (page.kind === "room") {
    if (page.temperature) tiles.push({ id: `t-${page.id}`, type: "sensor", config: { entity: page.temperature, kind: "temperature" } });
    if (page.humidity) tiles.push({ id: `h-${page.id}`, type: "sensor", config: { entity: page.humidity, kind: "humidity" } });
  }

  for (const m of page.media ?? []) tiles.push({ id: `media-${m.entity}`, type: "media", config: { entity: m.entity, name: m.name } });

  const shown = new Set([...deviceIds, ...(page.kind === "overview" ? [] : climates)]);
  for (const section of sections) {
    const items = section.items.filter((i: LayoutItem) => !shown.has(i.entity));
    if (!items.length) continue;
    const trimmed: LayoutSection = { ...section, items };
    tiles.push({ id: `panel-${section.id}`, type: "panel", config: { section: trimmed }, sizes: panelSizes(items.length) });
  }
  return tiles;
}

export function pageKey(page: LayoutPage | undefined): string {
  return page ? JSON.stringify(page) : "";
}
