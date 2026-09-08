import { ComponentInstance, Net } from "../types";
import { PlacementState } from "./costFunction";

/**
 * Rough starting layout: nets act as attraction springs pulling connected
 * components together, giving simulated annealing a reasonable seed instead
 * of starting from a fully random placement.
 */
export function forceDirectedInitial(
  components: ComponentInstance[],
  nets: Net[],
  boardCols: number,
  boardRows: number,
  iterations = 200
): PlacementState {
  const map = new Map(components.map((c) => [c.id, { ...c }]));

  // Random-ish initial scatter for movable components.
  let seed = 0;
  for (const c of map.values()) {
    if (c.fixed) continue;
    seed += 1;
    c.position = {
      x: (seed * 7) % boardCols,
      y: (seed * 13) % boardRows
    };
  }

  const springStrength = 0.05;

  for (let iter = 0; iter < iterations; iter++) {
    for (const net of nets) {
      for (let i = 0; i < net.pinRefs.length - 1; i++) {
        const a = map.get(net.pinRefs[i].componentId);
        const b = map.get(net.pinRefs[i + 1].componentId);
        if (!a || !b) continue;

        const dx = b.position.x - a.position.x;
        const dy = b.position.y - a.position.y;

        if (!a.fixed) {
          a.position = { x: a.position.x + dx * springStrength, y: a.position.y + dy * springStrength };
        }
        if (!b.fixed) {
          b.position = { x: b.position.x - dx * springStrength, y: b.position.y - dy * springStrength };
        }
      }
    }
  }

  for (const c of map.values()) {
    c.position = {
      x: Math.min(Math.max(Math.round(c.position.x), 0), boardCols - 1),
      y: Math.min(Math.max(Math.round(c.position.y), 0), boardRows - 1)
    };
  }

  return { components: map, nets };
}
