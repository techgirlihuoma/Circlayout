import { describe, it, expect } from "vitest";
import { generateGridDots } from "../src/canvas/gridRenderer";
import { createPerfboardConfig } from "@perfboard/core";

// Full Konva canvas rendering needs the native `canvas` package in jsdom,
// which isn't part of this lightweight test setup. The pure-logic pieces
// BoardCanvas depends on (grid generation) are covered directly here;
// component/link rendering is exercised visually via `npm run dev`.
describe("generateGridDots", () => {
  it("produces rows * cols dots", () => {
    const board = createPerfboardConfig(5, 4);
    const dots = generateGridDots(board, 24);
    expect(dots.length).toBe(20);
  });

  it("spaces dots by the given hole size", () => {
    const board = createPerfboardConfig(2, 2);
    const dots = generateGridDots(board, 24);
    const xs = Array.from(new Set(dots.map((d) => d.x))).sort((a, b) => a - b);
    expect(xs).toEqual([0, 24]);
  });
});
