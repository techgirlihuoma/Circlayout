import { describe, it, expect } from "vitest";
import { classifyConnections } from "../src/optimizer/crossoverClassifier";
import { ComponentInstance, Net } from "../src/types";

function comp(id: string, x: number, y: number): ComponentInstance {
  return {
    id,
    footprintType: "test",
    pins: [{ id: `${id}-p1`, name: "p1", netClass: "signal" }],
    position: { x, y },
    orientation: 0,
    fixed: false
  };
}

describe("classifyConnections", () => {
  it("marks crossing nets as jumper-wire", () => {
    const components = new Map([
      ["a", comp("a", 0, 0)],
      ["b", comp("b", 2, 2)],
      ["c", comp("c", 0, 2)],
      ["d", comp("d", 2, 0)]
    ]);
    const nets: Net[] = [
      { id: "n1", netClass: "signal", pinRefs: [{ componentId: "a", pinId: "a-p1" }, { componentId: "b", pinId: "b-p1" }] },
      { id: "n2", netClass: "signal", pinRefs: [{ componentId: "c", pinId: "c-p1" }, { componentId: "d", pinId: "d-p1" }] }
    ];

    const result = classifyConnections({ components, nets });
    expect(result.find((n) => n.id === "n1")!.connectionType).toBe("jumper-wire");
    expect(result.find((n) => n.id === "n2")!.connectionType).toBe("jumper-wire");
  });

  it("leaves non-crossing nets as solder-lead", () => {
    const components = new Map([
      ["a", comp("a", 0, 0)],
      ["b", comp("b", 1, 0)],
      ["c", comp("c", 0, 5)],
      ["d", comp("d", 1, 5)]
    ]);
    const nets: Net[] = [
      { id: "n1", netClass: "signal", pinRefs: [{ componentId: "a", pinId: "a-p1" }, { componentId: "b", pinId: "b-p1" }] },
      { id: "n2", netClass: "signal", pinRefs: [{ componentId: "c", pinId: "c-p1" }, { componentId: "d", pinId: "d-p1" }] }
    ];

    const result = classifyConnections({ components, nets });
    expect(result.find((n) => n.id === "n1")!.connectionType).toBe("solder-lead");
    expect(result.find((n) => n.id === "n2")!.connectionType).toBe("solder-lead");
  });
});
