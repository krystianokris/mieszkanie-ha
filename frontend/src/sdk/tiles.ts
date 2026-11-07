import type { Component } from "solid-js";
import type { Breakpoint } from "./context";

export interface TileSize {
  w: number;
  h: number;
}

export interface TileProps<C> {
  config: C;
  size: TileSize;
}

export interface TileDefinition<C = any> {
  type: string;
  /** Default footprint in grid units per breakpoint (12 / 8 / 4 columns, 70px rows). */
  sizes: Record<Breakpoint, TileSize>;
  component: Component<TileProps<C>>;
}

export interface TileInstance {
  id: string;
  type: string;
  config: Record<string, unknown>;
  sizes?: Partial<Record<Breakpoint, TileSize>>;
}

const registry = new Map<string, TileDefinition>();

export function defineTile<C>(definition: TileDefinition<C>): TileDefinition<C> {
  registry.set(definition.type, definition as TileDefinition);
  return definition;
}

export function getTile(type: string): TileDefinition | undefined {
  return registry.get(type);
}
