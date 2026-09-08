import { Position } from "../types";

/**
 * Returns true if segment (p1,p2) crosses segment (p3,p4).
 * Used both inside the annealing loop (to penalize crossings) and in the
 * post-annealing pass that classifies links as solder-lead vs jumper-wire.
 * Shared endpoints (same pin) are not considered a crossing.
 */
export function segmentsIntersect(
  p1: Position,
  p2: Position,
  p3: Position,
  p4: Position
): boolean {
  const d = (a: Position, b: Position, c: Position) =>
    (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);

  const d1 = d(p3, p4, p1);
  const d2 = d(p3, p4, p2);
  const d3 = d(p1, p2, p3);
  const d4 = d(p1, p2, p4);

  return (
    ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
    ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
  );
}
