import { ComponentInstance } from "../types";
import { PlacementState, evaluateCost } from "./costFunction";
import { RelativeConstraint, relativeConstraintPenalty } from "./constraints";

export interface AnnealingOptions {
  boardCols: number;
  boardRows: number;
  iterations?: number;
  initialTemperature?: number;
  coolingRate?: number;
  constraints?: RelativeConstraint[];
  onProgress?: (progress: number, bestCost: number) => void;
}

function cloneState(state: PlacementState): PlacementState {
  const components = new Map<string, ComponentInstance>();
  for (const [id, c] of state.components) {
    components.set(id, { ...c, position: { ...c.position } });
  }
  return { components, nets: state.nets };
}

function randomMovableComponent(state: PlacementState): ComponentInstance | null {
  const movable = Array.from(state.components.values()).filter((c) => !c.fixed);
  if (movable.length === 0) return null;
  return movable[Math.floor(Math.random() * movable.length)];
}

function totalCost(state: PlacementState, constraints: RelativeConstraint[]): number {
  return evaluateCost(state) + relativeConstraintPenalty(state.components, constraints);
}

/**
 * Simulated annealing placement + routing refinement. Fixed components are
 * never selected for a move. Overlap and crossover are effectively hard
 * constraints via their dominating weight in the cost function -- the
 * annealer will almost always reject a move that introduces either, but
 * final crossover cleanup still happens in crossoverClassifier.ts since a
 * fully crossing-free arrangement isn't always reachable.
 */
export function anneal(initial: PlacementState, options: AnnealingOptions): PlacementState {
  const {
    boardCols,
    boardRows,
    iterations = 5000,
    initialTemperature = 100,
    coolingRate = 0.995,
    constraints = [],
    onProgress
  } = options;

  let current = cloneState(initial);
  let currentCost = totalCost(current, constraints);

  let best = cloneState(current);
  let bestCost = currentCost;

  let temperature = initialTemperature;

  for (let i = 0; i < iterations; i++) {
    const candidate = cloneState(current);
    const target = randomMovableComponent(candidate);
    if (!target) break;

    const move = Math.random();
    if (move < 0.7) {
      // Positional jitter.
      target.position = {
        x: Math.min(Math.max(Math.round(target.position.x + (Math.random() - 0.5) * 4), 0), boardCols - 1),
        y: Math.min(Math.max(Math.round(target.position.y + (Math.random() - 0.5) * 4), 0), boardRows - 1)
      };
    } else {
      // Rotation in 90-degree steps.
      const steps: Array<0 | 90 | 180 | 270> = [0, 90, 180, 270];
      target.orientation = steps[Math.floor(Math.random() * steps.length)];
    }

    const candidateCost = totalCost(candidate, constraints);
    const delta = candidateCost - currentCost;

    if (delta < 0 || Math.random() < Math.exp(-delta / temperature)) {
      current = candidate;
      currentCost = candidateCost;

      if (currentCost < bestCost) {
        best = cloneState(current);
        bestCost = currentCost;
      }
    }

    temperature *= coolingRate;

    if (onProgress && i % 100 === 0) {
      onProgress(i / iterations, bestCost);
    }
  }

  return best;
}
