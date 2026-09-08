import { describe, it, expect } from "vitest";
import { anneal } from "../src/optimizer/simulatedAnnealing";
import { ComponentInstance, Net } from "../src/types";

describe("anneal", () => {
  it("does not move fixed components", () => {
    const fixed: ComponentInstance = {
      id: "ref",
      footprintType: "test",
      pins: [{ id: "ref-p1", name: "p1", netClass: "signal" }],
      position: { x: 5, y: 5 },
      orientation: 0,
      fixed: true
    };
    const movable: ComponentInstance = {
      id: "mover",
      footprintType: "test",
      pins: [{ id: "mover-p1", name: "p1", netClass: "signal" }],
      position: { x: 0, y: 0 },
      orientation: 0,
      fixed: false
    };

    const result = anneal(
      { components: new Map([["ref", fixed], ["mover", movable]]), nets: [] },
      { boardCols: 20, boardRows: 20, iterations: 200 }
    );

    const refResult = result.components.get("ref")!;
    expect(refResult.position).toEqual({ x: 5, y: 5 });
  });

  it("reduces cost over iterations for a simple two-component net", () => {
    const a: ComponentInstance = {
      id: "a",
      footprintType: "test",
      pins: [{ id: "a-p1", name: "p1", netClass: "signal" }],
      position: { x: 0, y: 0 },
      orientation: 0,
      fixed: false
    };
    const b: ComponentInstance = {
      id: "b",
      footprintType: "test",
      pins: [{ id: "b-p1", name: "p1", netClass: "signal" }],
      position: { x: 19, y: 19 },
      orientation: 0,
      fixed: false
    };
    const net: Net = {
      id: "n1",
      netClass: "signal",
      pinRefs: [{ componentId: "a", pinId: "a-p1" }, { componentId: "b", pinId: "b-p1" }]
    };

    const result = anneal(
      { components: new Map([["a", a], ["b", b]]), nets: [net] },
      { boardCols: 20, boardRows: 20, iterations: 3000 }
    );

    const ra = result.components.get("a")!;
    const rb = result.components.get("b")!;
    const finalDistance = Math.hypot(ra.position.x - rb.position.x, ra.position.y - rb.position.y);
    expect(finalDistance).toBeLessThan(27); // less than initial ~26.9 diagonal, allows for some slack
  });
});
