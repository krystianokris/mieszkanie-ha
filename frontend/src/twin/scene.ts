import raw from "./scene.json";

export type Point = [number, number];

export interface SceneRoom {
  id: string;
  name: string;
  poly: Point[];
  label: Point;
  glow: Point[];
  anchors: Record<string, Point>;
}

export const SCENE_W = raw.size[0];
export const SCENE_H = raw.size[1];
export const ROOMS = raw.rooms as unknown as SceneRoom[];

/** Bounds of the apartment on the render (scene units); the stage fits this box, not the whole image. */
export const APARTMENT = { x: 63, y: 32, w: 897, h: 502 };

export const pct = ([x, y]: Point) => ({ left: `${(x / SCENE_W) * 100}%`, top: `${(y / SCENE_H) * 100}%` });

export const clipPath = (poly: Point[]) => `polygon(${poly.map(([x, y]) => `${(x / SCENE_W) * 100}% ${(y / SCENE_H) * 100}%`).join(", ")})`;

export const svgPoints = (poly: Point[]) => poly.map(([x, y]) => `${x},${y}`).join(" ");

export function bbox(poly: Point[]) {
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}

export const roomById = (id: string | undefined) => ROOMS.find((r) => r.id === id);
