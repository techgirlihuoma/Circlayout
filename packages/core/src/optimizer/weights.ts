/**
 * Hardcoded cost-function weights for v1 (no user-facing sliders).
 * Overlap and avoidable crossovers are treated as hard constraints via a
 * dominating weight -- the annealer must never settle on a state that
 * violates either.
 */
export const WEIGHTS = {
  wireLength: 1.0,
  powerSignalProximity: 2.0,
  overlap: 1000,
  avoidableCrossover: 1000
} as const;
