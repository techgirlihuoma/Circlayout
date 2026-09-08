import { Net, ComponentInstance } from "../types";
import { segmentsIntersect } from "../geometry/intersection";
import { PlacementState } from "./costFunction";

/**
 * Post-annealing pass: any solder-lead net whose path still crosses another
 * net's path in the final arrangement cannot be a bent component lead --
 * on bare leads a crossing is a physical short. Those nets are reclassified
 * as jumper-wire so the image export renders them in a distinct color.
 *
 * A net that isn't touched by any crossing keeps the "solder-lead" default.
 */
export function classifyConnections(state: PlacementState): Net[] {
  const segmentsByNet = new Map<string, Array<[{ x: number; y: number }, { x: number; y: number }]>>();

  for (const net of state.nets) {
    const positions = net.pinRefs.map((ref) => {
      const component = state.components.get(ref.componentId);
      if (!component) throw new Error(`Unknown component ${ref.componentId}`);
      return component.position;
    });
    const segments: Array<[{ x: number; y: number }, { x: number; y: number }]> = [];
    for (let i = 0; i < positions.length - 1; i++) {
      segments.push([positions[i], positions[i + 1]]);
    }
    segmentsByNet.set(net.id, segments);
  }

  const crossingNetIds = new Set<string>();
  const netIds = Array.from(segmentsByNet.keys());

  for (let i = 0; i < netIds.length; i++) {
    for (let j = i + 1; j < netIds.length; j++) {
      const segsA = segmentsByNet.get(netIds[i])!;
      const segsB = segmentsByNet.get(netIds[j])!;
      for (const a of segsA) {
        for (const b of segsB) {
          if (segmentsIntersect(a[0], a[1], b[0], b[1])) {
            crossingNetIds.add(netIds[i]);
            crossingNetIds.add(netIds[j]);
          }
        }
      }
    }
  }

  return state.nets.map((net) => ({
    ...net,
    connectionType: crossingNetIds.has(net.id) ? "jumper-wire" : "solder-lead"
  }));
}
