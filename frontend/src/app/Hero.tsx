import { For, Show } from "solid-js";
import { fmt, isUnavailable, num, useHass, useKrystal, useT } from "../sdk";
import { FUEL_PAGE, type Features } from "./features";
import { useForecast } from "./forecast";
import { stationsFor, useFuel, type FuelCode } from "./fuel";
import { applianceView } from "./laundry";
import { Glyph } from "./Glyph";
import { Icon } from "./Icon";
import type { LayoutPage, LayoutSummary } from "./model";
import { lightIds, pickPower, pickWeather } from "./pick";
import { isAlertState } from "./states";
import { WeatherArt } from "./WeatherArt";

function LaundryChips(props: { features?: Features }) {
  const hass = useHass();
  const t = useT();
  const items = () =>
    (
      [
        [props.features?.washer, false],
        [props.features?.dryer, true],
      ] as const
    )
      .filter(([ids]) => !!ids)
      .map(([ids, dryer]) => ({ dryer, view: applianceView(hass(), ids!, dryer, t) }))
      .filter((x) => x.view.mode === "running" || x.view.mode === "paused");
  return (
    <For each={items()}>
      {(x) => (
        <span class="k-pill live">
          <Glyph icon={x.dryer ? "mdi:tumble-dryer" : "mdi:washing-machine"} category="laundry" size="xs" />
          {x.view.remaining !== undefined
            ? t("laundryChip", { name: x.dryer ? t("dryer") : t("washer"), m: fmt(x.view.remaining, 0, t.lang()) })
            : `${x.dryer ? t("dryer") : t("washer")} · ${x.view.status}`}
        </span>
      )}
    </For>
  );
}

function FuelChips() {
  const fuel = useFuel();
  const t = useT();
  const best = (code: FuelCode) => stationsFor(fuel(), code)[0];
  return (
    <For each={["B7", "E10"] as FuelCode[]}>
      {(code) => (
        <Show when={best(code)}>
          <span class="k-pill">
            <Glyph icon="mdi:gas-station" category="fuel" size="xs" />
            {code === "B7" ? t("dieselShort") : t("petrolShort")} {fmt(best(code)!.prices?.[code], 1, t.lang())}p · {(best(code)!.brand ?? "").trim()}
          </span>
        </Show>
      )}
    </For>
  );
}

export function Hero(props: { page: LayoutPage; summary: LayoutSummary; now: Date; settings?: boolean; features?: Features }) {
  const hass = useHass();
  const { demo, narrow, host } = useKrystal();
  const t = useT();
  const overview = () => props.page.kind === "overview" && !props.settings;

  const greeting = () => {
    const h = props.now.getHours();
    const key = h < 5 ? "night" : h < 12 ? "morning" : h < 18 ? "afternoon" : h < 22 ? "evening" : "night";
    const name = hass()?.user?.name?.split(" ")[0];
    return name ? `${t(key)}, ${name}` : t(key);
  };
  const heading = () => (props.settings ? t("settings") : overview() ? greeting() : props.page.heading ?? props.page.title);
  const subtitle = () =>
    props.settings
      ? ""
      : overview()
        ? [props.summary.title, props.summary.subtitle].filter(Boolean).join(" ")
        : props.page.subtitle ?? "";
  const kicker = () =>
    `Krystal / ${props.settings ? t("settings") : overview() ? props.summary.kicker ?? t("yourHome") : props.page.title}`;

  const time = () => new Intl.DateTimeFormat(t.lang(), { hour: "2-digit", minute: "2-digit" }).format(props.now);
  const date = () => new Intl.DateTimeFormat(t.lang(), { weekday: "long", day: "numeric", month: "long" }).format(props.now);

  const weatherId = () => props.summary.weather ?? (hass() ? pickWeather(hass()!)?.entity_id : undefined);
  const weather = () => (weatherId() ? hass()?.states[weatherId()!] : undefined);
  const forecast = useForecast(() => (overview() ? weatherId() : undefined));

  const lights = () => (hass() ? lightIds(hass()!, props.summary.lights) : []);
  const lightsOn = () => lights().filter((id) => hass()?.states[id]?.state === "on").length;
  const power = () => {
    const id = props.summary.power ?? (hass() ? pickPower(hass()!)?.entity_id : undefined);
    const e = id ? hass()?.states[id] : undefined;
    const v = num(e?.state);
    if (v === undefined) return undefined;
    const unit = String(e?.attributes.unit_of_measurement ?? "W");
    return unit === "kW" ? `${fmt(v * 1000, 0, t.lang())} W` : `${fmt(v, 0, t.lang())} ${unit}`;
  };
  const alerts = () => props.summary.alerts ?? [];
  const missing = () => alerts().filter((id) => isUnavailable(hass()?.states[id])).length;
  const triggered = () => alerts().filter((id) => isAlertState(hass()?.states[id])).length;

  const roomValue = (id?: string) => (id ? num(hass()?.states[id]?.state) : undefined);
  const roomDevices = () => (props.page.devices ?? []).map((d) => d.entity);
  const roomOn = () => roomDevices().filter((id) => hass()?.states[id]?.state === "on").length;

  const weekday = (iso: string) => new Intl.DateTimeFormat(t.lang(), { weekday: "short" }).format(new Date(iso));

  const openMenu = () => host.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true }));

  return (
    <section class="k-hero k-tile" classList={{ overview: overview() }} style={{ "--accent": props.page.accent ?? "#8cdbff" }}>
      <div class="k-hero-top">
        <div class="k-hero-main">
          <Show when={narrow()}>
            <button type="button" class="k-btn k-icon-btn" aria-label={t("menu")} onClick={openMenu}>
              <Icon icon="mdi:menu" />
            </button>
          </Show>
          <div class="k-hero-copy">
            <span class="k-hero-kicker">
              {kicker()}
              <Show when={demo()}>
                <em class="k-demo">{t("demo")}</em>
              </Show>
            </span>
            <h1>{heading()}</h1>
            <Show when={subtitle()}>
              <p>{subtitle()}</p>
            </Show>
          </div>
        </div>
        <div class="k-clock">
          <strong>{time()}</strong>
          <span>{date()}</span>
        </div>
      </div>

      <Show when={!props.settings}>
        <div class="k-pills">
          <Show
            when={props.page.kind === "room"}
            fallback={
              <>
                <Show when={lights().length}>
                  <span class="k-pill">
                    <Glyph icon="mdi:lightbulb-group-outline" category="light" size="xs" />
                    {t("lightsOn", { n: lightsOn(), m: lights().length })}
                  </span>
                </Show>
                <Show when={power()}>
                  <span class="k-pill">
                    <Glyph icon="mdi:lightning-bolt" category="energy" size="xs" />
                    {t("power", { v: power()! })}
                  </span>
                </Show>
              </>
            }
          >
            <Show when={roomValue(props.page.temperature) !== undefined}>
              <span class="k-pill">
                <Glyph icon="mdi:thermometer" category="climate" size="xs" />
                {fmt(roomValue(props.page.temperature), 1, t.lang())} °C
              </span>
            </Show>
            <Show when={roomValue(props.page.humidity) !== undefined}>
              <span class="k-pill">
                <Glyph icon="mdi:water-percent" category="water" size="xs" />
                {fmt(roomValue(props.page.humidity), 0, t.lang())}%
              </span>
            </Show>
            <Show when={roomDevices().length}>
              <span class="k-pill">
                <Glyph icon="mdi:lightbulb-group-outline" category="light" size="xs" />
                {t("roomCount", { n: roomOn(), m: roomDevices().length })}
              </span>
            </Show>
          </Show>
          <Show when={overview()}>
            <LaundryChips features={props.features} />
          </Show>
          <Show when={props.page.id === FUEL_PAGE}>
            <FuelChips />
          </Show>
          <Show when={weather()}>
            <span class="k-pill">
              <Glyph icon="mdi:weather-partly-cloudy" category="climate" size="xs" />
              {fmt(num(weather()!.attributes.temperature), 1, t.lang())}° · {t.condition(weather()!.state)}
            </span>
          </Show>
          <Show when={props.page.kind !== "room" && alerts().length}>
            <span class="k-pill" classList={{ warn: missing() > 0, alert: triggered() > 0 }}>
              <Glyph icon="mdi:shield-check-outline" category="security" size="xs" />
              {triggered() ? t("alarms", { n: triggered() }) : missing() ? t("sensorsMissing", { n: missing() }) : t("sensorsOk")}
            </span>
          </Show>
        </div>
      </Show>

      <Show when={overview() && forecast().length}>
        <span class="k-hero-label">{t("next5")}</span>
        <div class="k-forecast">
          <For each={forecast().slice(0, 5)}>
            {(day) => (
              <div class="k-well k-day">
                <b class="k-day-name">{weekday(day.datetime)}</b>
                <span class="k-wx-mini">
                  <WeatherArt condition={day.condition} night={false} />
                </span>
                <span class="k-day-temp">
                  <b>{fmt(num(day.temperature), 0, t.lang())}°</b>
                  <small>{fmt(num(day.templow), 0, t.lang())}°</small>
                </span>
              </div>
            )}
          </For>
        </div>
      </Show>
    </section>
  );
}
