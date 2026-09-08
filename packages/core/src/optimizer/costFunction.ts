import { ComponentInstance, Net, Position } from "../types";
import { euclideanDistance } from "../geometry/distance";
import { segmentsIntersect } from "../geometry/intersection";
import { WEIGHTS } from "./weights";

export interface PlacementState {
  components: Map<string, ComponentInstance>;
  nets: Net[];
}

function pinPosition(state: PlacementState, componentId: string, pinId: string): Position {
  const component = state.components.get(componentId);
  if (!component) throw new Error(`Unknown component ${componentId}`);
  // Pin offsets from the component origin are resolved by the footprint
  // renderer; for cost evaluation we treat each net endpoint as anchored
  // to its component's placed position. A future footprint-aware offset
  // can be layered in here without changing the cost function's shape.
  return component.position;
}

function netEndpoints(state: PlacementState, net: Net): [Position, Position][] {
  const positions = net.pinRefs.map((ref) => pinPosition(state, ref.componentId, ref.pinId));
  const segments: [Position, Position][] = [];
  for (let i = 0; i < positions.length - 1; i++) {
    segments.push([positions[i], positions[i + 1]]);
  }
  return segments;
}

function isHighPowerNet(net: Net): boolean {
  return net.netClass === "power" || net.netClass === "high-current";
}

export function evaluateCost(state: PlacementState): number {
  let wireLength = 0;
  let overlapPenalty = 0;
  let crossoverPenalty = 0;
  let proximityPenalty = 0;

  const allSegments: { segment: [Position, Position]; net: Net }[] = [];

  for (const net of state.nets) {
    for (const segment of netEndpoints(state, net)) {
      wireLength += euclideanDistance(segment[0], segment[1]);
      allSegments.push({ segment, net });
    }
  }

  // Crossover check: any two segments belonging to different nets that
  // intersect are a hard violation for solder-lead connections.
  for (let i = 0; i < allSegments.length; i++) {
    for (let j = i + 1; j < allSegments.length; j++) {
      const a = allSegments[i];
      const b = allSegments[j];
      if (a.net.id === b.net.id) continue;
      const crosses = segmentsIntersect(
        a.segment[0],
        a.segment[1],
        b.segment[0],
        b.segment[1]
      );
      if (crosses) {
        crossoverPenalty += WEIGHTS.avoidableCrossover;
        // Power/signal proximity: a power or high-current net crossing
        // near a signal net is exactly the noise-coupling case the spec
        // calls out -- penalize independently of the crossover itself.
        if (isHighPowerNet(a.net) !== isHighPowerNet(b.net)) {
          proximityPenalty += WEIGHTS.powerSignalProximity;
        }
      }
    }
  }

  // Component overlap check.
  const components = Array.from(state.components.values());
  for (let i = 0; i < components.length; i++) {
    for (let j = i + 1; j < components.length; j++) {
      if (componentsOverlap(components[i], components[j])) {
        overlapPenalty += WEIGHTS.overlap;
      }
    }
  }

  return (
    WEIGHTS.wireLength * wireLength +
    proximityPenalty +
    overlapPenalty +
    crossoverPenalty
  );
}

function componentsOverlap(a: ComponentInstance, b: ComponentInstance): boolean {
  // Placeholder bounding-box check; real footprint bounds should replace
  // this fixed radius once footprint dimensions are wired in from
  // @perfboard/components.
  const radius = 1;
  return euclideanDistance(a.position, b.position) < radius;
}
