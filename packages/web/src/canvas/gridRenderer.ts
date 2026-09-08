import { PerfboardConfig } from "@perfboard/core";

export interface GridDot {
  x: number;
  y: number;
}

/** Perfboard is a uniform grid of isolated holes -- no strip or bus lines to draw. */
export function generateGridDots(board: PerfboardConfig, holeSizePx: number): GridDot[] {
  const dots: GridDot[] = [];
  for (let row = 0; row < board.rows; row++) {
    for (let col = 0; col < board.cols; col++) {
      dots.push({ x: col * holeSizePx, y: row * holeSizePx });
    }
  }
  return dots;
}
