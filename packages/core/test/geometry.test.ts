import { describe, it, expect } from "vitest";
import { segmentsIntersect } from "../src/geometry/intersection";
import { euclideanDistance } from "../src/geometry/distance";

describe("segmentsIntersect", () => {
  it("detects a simple X crossing", () => {
    const result = segmentsIntersect(
      { x: 0, y: 0 },
      { x: 2, y: 2 },
      { x: 0, y: 2 },
      { x: 2, y: 0 }
    );
    expect(result).toBe(true);
  });

  it("returns false for parallel non-touching segments", () => {
    const result = segmentsIntersect(
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 2, y: 1 }
    );
    expect(result).toBe(false);
  });
});

describe("euclideanDistance", () => {
  it("computes 3-4-5 triangle distance", () => {
    expect(euclideanDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });
});
