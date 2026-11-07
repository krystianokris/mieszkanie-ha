export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed?: string;
  last_updated?: string;
}

export interface HassArea {
  area_id: string;
  name: string;
}

export interface HassEntityRegistryEntry {
  entity_id: string;
  area_id?: string | null;
  device_id?: string | null;
  hidden?: boolean;
}

export interface HassDevice {
  id: string;
  area_id?: string | null;
}

/** The subset of Home Assistant's frontend `hass` object Krystal relies on. */
export interface Hass {
  states: Record<string, HassEntity>;
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ): Promise<unknown>;
  callWS?<T = unknown>(msg: Record<string, unknown>): Promise<T>;
  /** Localised state with unit, available since Home Assistant 2023.9. */
  formatEntityState?(entity: HassEntity, state?: string): string;
  connection?: { sendMessagePromise<T = unknown>(msg: Record<string, unknown>): Promise<T> };
  services?: Record<string, Record<string, unknown>>;
  language?: string;
  locale?: { language?: string };
  user?: { name?: string; is_admin?: boolean };
  config?: { location_name?: string; version?: string };
  areas?: Record<string, HassArea>;
  entities?: Record<string, HassEntityRegistryEntry>;
  devices?: Record<string, HassDevice>;
}

export interface PanelInfo {
  config?: { version?: string; build?: string; layout?: string | null };
  url_path?: string;
}

export interface PanelRoute {
  prefix?: string;
  path?: string;
}
