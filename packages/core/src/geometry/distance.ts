import { Position } from "../types";

export function euclideanDistance(a: Position, b: Position): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
