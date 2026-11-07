export interface PinInput {
  id: string;
  rank: number;
  /** True position in container pixels. */
  x: number;
  y: number;
}

export interface PinPlacement extends PinInput {
  /** Chip centre in container pixels. */
  cx: number;
  cy: number;
  moved: boolean;
}

interface Rect {
  l: number;
  t: number;
  r: number;
  b: number;
}

const CHIP_W = 92;
const CHIP_H = 28;
const LIFT = 26;
const RADII = [0, 26, 44, 64, 88, 116];
const ANGLES = [-90, -45, -135, 0, 180, 45, 135, 90];

const overlaps = (a: Rect, b: Rect) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;

/**
 * Greedy label placement: cheapest pins keep the spot right above their point;
 * later ones try 8 directions at growing radii until their chip is clear of
 * other chips, other anchor dots and the home marker.
 */
export function placePins(pins: PinInput[], width: number, height: number, home?: { x: number; y: number }): PinPlacement[] {
  const taken: Rect[] = [];
  if (home) taken.push({ l: home.x - 22, t: home.y - 22, r: home.x + 22, b: home.y + 22 });
  for (const p of pins) taken.push({ l: p.x - 9, t: p.y - 9, r: p.x + 9, b: p.y + 9 });

  const out: PinPlacement[] = [];
  for (const pin of [...pins].sort((a, b) => a.rank - b.rank)) {
    const others = taken.filter((r) => !(Math.abs((r.l + r.r) / 2 - pin.x) < 0.5 && Math.abs((r.t + r.b) / 2 - pin.y) < 0.5));
    let best: { cx: number; cy: number } | undefined;
    search: for (const radius of RADII) {
      for (const angle of radius === 0 ? [0] : ANGLES) {
        const rad = (angle * Math.PI) / 180;
        const cx = pin.x + Math.cos(rad) * radius;
        const cy = pin.y - LIFT + Math.sin(rad) * radius;
        const rect = { l: cx - CHIP_W / 2, t: cy - CHIP_H / 2, r: cx + CHIP_W / 2, b: cy + CHIP_H / 2 };
        if (rect.l < 2 || rect.t < 2 || rect.r > width - 2 || rect.b > height - 2) continue;
        if (others.some((r) => overlaps(r, rect))) continue;
        best = { cx, cy };
        taken.push(rect);
        break search;
      }
    }
    const fallback = {
      cx: Math.min(width - CHIP_W / 2 - 2, Math.max(CHIP_W / 2 + 2, pin.x)),
      cy: Math.max(CHIP_H / 2 + 2, pin.y - LIFT),
    };
    const spot = best ?? fallback;
    out.push({ ...pin, ...spot, moved: Math.hypot(spot.cx - pin.x, spot.cy - (pin.y - LIFT)) > 4 });
  }
  return out;
}
