import { describe, it, expect } from "vitest";
import { evaluateCost, PlacementState } from "../src/optimizer/costFunction";
import { ComponentInstance, Net } from "../src/types";

function makeComponent(id: string, x: number, y: number): ComponentInstance {
  return {
    id,
    footprintType: "test",
    pins: [{ id: `${id}-p1`, name: "p1", netClass: "signal" }],
    position: { x, y },
    orientation: 0,
    fixed: false
  };
}

describe("evaluateCost", () => {
  it("increases with wire length", () => {
    const short: PlacementState = {
      components: new Map([
        ["a", makeComponent("a", 0, 0)],
        ["b", makeComponent("b", 1, 0)]
      ]),
      nets: [
        { id: "n1", netClass: "signal", pinRefs: [{ componentId: "a", pinId: "a-p1" }, { componentId: "b", pinId: "b-p1" }] }
      ]
    };

    const long: PlacementState = {
      components: new Map([
        ["a", makeComponent("a", 0, 0)],
        ["b", makeComponent("b", 10, 0)]
      ]),
      nets: short.nets
    };

    expect(evaluateCost(long)).toBeGreaterThan(evaluateCost(short));
  });

  it("heavily penalizes overlapping components", () => {
    const overlapping: PlacementState = {
      components: new Map([
        ["a", makeComponent("a", 0, 0)],
        ["b", makeComponent("b", 0.1, 0)]
      ]),
      nets: []
    };
    expect(evaluateCost(overlapping)).toBeGreaterThan(500);
  });
});
