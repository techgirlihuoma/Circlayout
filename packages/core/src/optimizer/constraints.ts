import { ComponentInstance } from "../types";

export interface RelativeConstraint {
  /** Component that must stay a fixed distance from a fixed reference component. */
  componentId: string;
  referenceComponentId: string;
  minDistance?: number;
  maxDistance?: number;
}

/**
 * Fixed components are never moved or rotated by the annealer (enforced by
 * simulatedAnnealing.ts checking `component.fixed` before proposing a move).
 * This module handles the softer "relative to a fixed component" case.
 */
export function relativeConstraintPenalty(
  components: Map<string, ComponentInstance>,
  constraints: RelativeConstraint[]
): number {
  let penalty = 0;

  for (const constraint of constraints) {
    const target = components.get(constraint.componentId);
    const reference = components.get(constraint.referenceComponentId);
    if (!target || !reference) continue;

    const dx = target.position.x - reference.position.x;
    const dy = target.position.y - reference.position.y;
    const distance = Math.hypot(dx, dy);

    if (constraint.minDistance !== undefined && distance < constraint.minDistance) {
      penalty += (constraint.minDistance - distance) * 10;
    }
    if (constraint.maxDistance !== undefined && distance > constraint.maxDistance) {
      penalty += (distance - constraint.maxDistance) * 10;
    }
  }

  return penalty;
}
