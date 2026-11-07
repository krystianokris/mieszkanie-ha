import type { Hass } from "../sdk/types";
import { detectF1, type F1Ids } from "./f1-data";
import type { ApplianceIds, EnergyIds, LayoutFeatures } from "./model";

export interface Features {
  energy?: EnergyIds;
  washer?: ApplianceIds;
  dryer?: ApplianceIds;
  fuel: boolean;
  f1?: F1Ids;
  /** Device switches/selects bound to an AC climate entity by the converter. */
  climateExtras?: Record<string, string[]>;
}

const ELEC_RATE = /^sensor\.octopus_energy_electricity_(.+)_current_rate$/;
const GAS_RATE = /^sensor\.octopus_energy_gas_(.+)_current_rate$/;
/** Anglian Water style smart-meter sensors (`<meter>_yesterday_s_usage`). */
const WATER_USE = /^sensor\.(.+)_yesterday_s_usage$/;
const DRYER_WORDS = /(dryer|suszar|tumble|trockner)/;

function existing<T extends object>(hass: Hass, ids: T): T | undefined {
  const kept = Object.fromEntries(Object.entries(ids).filter(([, id]) => typeof id === "string" && hass.states[id]));
  return Object.keys(kept).length ? (kept as T) : undefined;
}

/** Octopus Energy entities share one meter prefix; detect it instead of shipping ids. */
function detectEnergy(hass: Hass): EnergyIds | undefined {
  const ids = Object.keys(hass.states);
  const elec = ids
    .map((id) => id.match(ELEC_RATE))
    .find((m) => m && !hass.states[m[0]].attributes.is_export);
  const gas = ids.map((id) => id.match(GAS_RATE)).find(Boolean);
  const water = ids.map((id) => id.match(WATER_USE)).find(Boolean);
  const e = elec?.[1];
  const g = gas?.[1];
  const w = water?.[1];
  const result: EnergyIds = {
    ...(e && {
      elecRate: `sensor.octopus_energy_electricity_${e}_current_rate`,
      elecNext: `sensor.octopus_energy_electricity_${e}_next_rate`,
      elecCost: `sensor.octopus_energy_electricity_${e}_current_accumulative_cost`,
      elecUse: `sensor.octopus_energy_electricity_${e}_current_accumulative_consumption`,
      demand: `sensor.octopus_energy_electricity_${e}_current_demand`,
      ratesToday: `event.octopus_energy_electricity_${e}_current_day_rates`,
      ratesTomorrow: `event.octopus_energy_electricity_${e}_next_day_rates`,
    }),
    ...(g && {
      gasRate: `sensor.octopus_energy_gas_${g}_current_rate`,
      gasCost: `sensor.octopus_energy_gas_${g}_current_accumulative_cost`,
      gasUse: `sensor.octopus_energy_gas_${g}_current_accumulative_consumption_kwh`,
    }),
    ...(w && {
      waterUse: `sensor.${w}_yesterday_s_usage`,
      waterCost: `sensor.${w}_yesterday_s_water_cost`,
      waterReading: `sensor.${w}_latest_reading`,
    }),
  };
  return existing(hass, result);
}

/** hOn-style appliances expose `<prefix>_machine_status` and friends. */
function detectAppliance(hass: Hass, dryer: boolean): ApplianceIds | undefined {
  const status = Object.keys(hass.states).find(
    (id) => /^sensor\..+_machine_status$/.test(id) && DRYER_WORDS.test(id) === dryer,
  );
  if (!status) return undefined;
  const p = status.replace(/_machine_status$/, "");
  return existing(hass, {
    status,
    phase: `${p}_current_program_phase`,
    remaining: `${p}_remaining_time_of_selected_program`,
    total: `${p}_selected_program_total_time`,
    program: `${p}_selected_program`,
    progress: `${p}_program_progress`,
    finish: `${p}_finish_time`,
  });
}

export function fuelAvailable(hass: Hass, demo: boolean): boolean {
  return demo ? !!hass.connection : !!(hass.services?.glasshome_fuel?.search || hass.services?.fuel_prices);
}

/** Layout features win; anything missing is detected from the live states. */
export function resolveFeatures(hass: Hass, layout: LayoutFeatures | undefined, demo: boolean): Features {
  const fromLayout = <T extends object>(ids: T | undefined) => (ids ? existing(hass, ids) : undefined);
  return {
    energy: fromLayout(layout?.energy) ?? detectEnergy(hass),
    washer: fromLayout(layout?.laundry?.washer) ?? detectAppliance(hass, false),
    dryer: fromLayout(layout?.laundry?.dryer) ?? detectAppliance(hass, true),
    fuel: fuelAvailable(hass, demo),
    f1: detectF1(hass, layout?.f1 as F1Ids | undefined),
    climateExtras: layout?.climateExtras,
  };
}

export const isEnergyPage = (id: string, title: string) => /energ/i.test(`${id} ${title}`);
export const isLaundryPage = (id: string, title: string) => /(pralni|laundr|wasch)/i.test(`${id} ${title}`);
export const FUEL_PAGE = "paliwo";
export const STYLE_PAGE = "styl";
