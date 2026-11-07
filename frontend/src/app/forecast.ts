import { createEffect, createSignal, on, onCleanup, type Accessor } from "solid-js";
import { useHass, useKrystal } from "../sdk";

export interface ForecastDay {
  datetime: string;
  condition?: string;
  temperature?: number;
  templow?: number;
}

/** Daily forecast via `weather.get_forecasts`, refreshed every 30 minutes. */
export function useForecast(entityId: Accessor<string | undefined>): Accessor<ForecastDay[]> {
  const hass = useHass();
  const { demo } = useKrystal();
  const [days, setDays] = createSignal<ForecastDay[]>([]);

  const load = async (id: string) => {
    const h = hass();
    if (!h) return;
    if (demo() || !h.callWS) {
      setDays((h.states[id]?.attributes.forecast as ForecastDay[] | undefined) ?? []);
      return;
    }
    try {
      const res = await h.callWS<{ response?: Record<string, { forecast?: ForecastDay[] }> }>({
        type: "call_service",
        domain: "weather",
        service: "get_forecasts",
        service_data: { type: "daily" },
        target: { entity_id: id },
        return_response: true,
      });
      setDays(res?.response?.[id]?.forecast ?? []);
    } catch {
      setDays([]);
    }
  };

  createEffect(
    on(entityId, (id) => {
      if (!id) return setDays([]);
      void load(id);
      const timer = setInterval(() => void load(id), 30 * 60_000);
      onCleanup(() => clearInterval(timer));
    }),
  );
  return days;
}
