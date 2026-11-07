import { domainOf, friendlyName } from "../sdk/format";
import type { Lang } from "../sdk/i18n";
import type { Hass } from "../sdk/types";
import type { KrystalLayout, LayoutItem, LayoutPage } from "./model";
import { byDomain, isToggleable, lightIds, pickPower, pickWeather, watchIds } from "./pick";
import { buildRooms } from "./rooms";

const TITLES: Record<Lang, { overview: string; watch: string; comfort: string }> = {
  en: { overview: "Overview", watch: "Home watch", comfort: "Comfort" },
  pl: { overview: "Przegląd", watch: "Dom pod opieką", comfort: "Komfort w domu" },
  de: { overview: "Übersicht", watch: "Hausüberwachung", comfort: "Komfort" },
};

function asItem(hass: Hass, id: string): LayoutItem {
  const e = hass.states[id];
  const domain = domainOf(id);
  const kind =
    domain === "light" ? "light" : domain === "switch" ? "plug" : domain === "climate" ? "climate" : domain === "media_player" ? "media" : domain === "binary_sensor" ? "binary" : domain;
  return {
    entity: id,
    kind,
    art: domain === "light" || domain === "switch" ? "bulb" : domain === "climate" ? "dial" : undefined,
    action: e && isToggleable(e) ? "toggle" : "info",
  };
}

/** Fallback when no layout.json is installed: rooms from areas and names. */
export function buildAutoLayout(hass: Hass, lang: Lang): KrystalLayout {
  const t = TITLES[lang];
  const rooms = buildRooms(hass, lang);
  const watch = watchIds(hass);
  const climates = byDomain(hass, "climate").filter((e) => e.state !== "unavailable").slice(0, 6);

  const overview: LayoutPage = {
    id: "overview",
    title: t.overview,
    icon: "mdi:view-dashboard-outline",
    kind: "overview",
    rooms: rooms.map((r) => ({
      page: r.id,
      name: r.name,
      icon: r.icon,
      temperature: r.temperature,
      humidity: r.humidity,
      entities: r.entities.filter((id) => ["light", "switch", "fan"].includes(domainOf(id))),
    })),
    sections: [
      ...(climates.length
        ? [{ id: "comfort", kicker: "", title: t.comfort, icon: "mdi:home-thermometer-outline", items: climates.map((e) => asItem(hass, e.entity_id)) }]
        : []),
      ...(watch.length
        ? [{ id: "watch", kicker: "", title: t.watch, icon: "mdi:shield-check-outline", items: watch.slice(0, 8).map((id) => asItem(hass, id)) }]
        : []),
    ],
  };

  const roomPages: LayoutPage[] = rooms.map((r) => ({
    id: r.id,
    title: r.name,
    icon: r.icon,
    kind: "room",
    temperature: r.temperature,
    humidity: r.humidity,
    devices: r.entities
      .filter((id) => ["light", "switch", "fan", "media_player"].includes(domainOf(id)))
      .map((id) => ({ ...asItem(hass, id), name: friendlyName(hass.states[id]) })),
    sections: [
      {
        id: `${r.id}-details`,
        title: r.name,
        items: r.entities.filter((id) => !["light", "switch", "fan", "media_player"].includes(domainOf(id))).map((id) => asItem(hass, id)),
      },
    ].filter((s) => s.items.length),
  }));

  return {
    version: 1,
    source: "auto",
    summary: {
      weather: pickWeather(hass)?.entity_id,
      power: pickPower(hass)?.entity_id,
      lights: lightIds(hass),
      alerts: watch,
    },
    pages: [overview, ...roomPages],
  };
}
