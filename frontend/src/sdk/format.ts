import type { HassEntity } from "./types";

export function num(value: unknown): number | undefined {
  const n = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(n) ? n : undefined;
}

export function fmt(value: number | undefined, digits: number, lang: string): string {
  if (value === undefined) return "—";
  return new Intl.NumberFormat(lang, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function isUnavailable(entity: HassEntity | undefined): boolean {
  return !entity || entity.state === "unavailable" || entity.state === "unknown";
}

export function friendlyName(entity: HassEntity | undefined): string {
  if (!entity) return "";
  return String(entity.attributes.friendly_name ?? entity.entity_id.split(".")[1].replace(/_/g, " "));
}

export function domainOf(entityId: string): string {
  return entityId.split(".")[0];
}

/** Lower-case ASCII slug used for name matching ("Łazienka" -> "lazienka"). */
export function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}
