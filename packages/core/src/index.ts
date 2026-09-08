export * from "./types";
export * from "./board/perfboardModel";
export * from "./geometry/distance";
export * from "./geometry/intersection";
export * from "./optimizer/weights";
export * from "./optimizer/costFunction";
export * from "./optimizer/forceDirectedInitial";
export * from "./optimizer/simulatedAnnealing";
export * from "./optimizer/constraints";
export * from "./optimizer/crossoverClassifier";

import { ComponentInstance, Net } from "./types";
import { forceDirectedInitial } from "./optimizer/forceDirectedInitial";
import { anneal } from "./optimizer/simulatedAnnealing";
import { classifyConnections } from "./optimizer/crossoverClassifier";
import { RelativeConstraint } from "./optimizer/constraints";

export interface ArrangeInput {
  components: ComponentInstance[];
  nets: Net[];
  boardCols: number;
  boardRows: number;
  relativeConstraints?: RelativeConstraint[];
  onProgress?: (progress: number, bestCost: number) => void;
}

export interface ArrangeResult {
  components: ComponentInstance[];
  nets: Net[];
}

/**
 * Full "Arrange" pipeline: force-directed seed -> simulated annealing
 * refinement -> post-annealing solder-lead/jumper-wire classification.
 * This is the single entry point the Web Worker calls.
 */
export function arrange(input: ArrangeInput): ArrangeResult {
  const seeded = forceDirectedInitial(
    input.components,
    input.nets,
    input.boardCols,
    input.boardRows
  );

  const annealed = anneal(seeded, {
    boardCols: input.boardCols,
    boardRows: input.boardRows,
    constraints: input.relativeConstraints ?? [],
    onProgress: input.onProgress
  });

  const classifiedNets = classifyConnections(annealed);

  return {
    components: Array.from(annealed.components.values()),
    nets: classifiedNets
  };
}
