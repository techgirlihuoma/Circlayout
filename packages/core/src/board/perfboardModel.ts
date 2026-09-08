import { PerfboardConfig } from "../types";

/**
 * Creates a default perfboard configuration.
 * Perfboard has isolated holes only -- no built-in copper connectivity,
 * unlike vero board (strips) or breadboard (bus rails). Every connection
 * must be an explicit solder-lead or jumper-wire link.
 */
export function createPerfboardConfig(
  rows: number,
  cols: number,
  holePitchMm = 2.54
): PerfboardConfig {
  return { holePitchMm, rows, cols, keepouts: [] };
}

export function isWithinBounds(
  board: PerfboardConfig,
  x: number,
  y: number
): boolean {
  return x >= 0 && x < board.cols && y >= 0 && y < board.rows;
}
