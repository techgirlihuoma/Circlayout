import { describe, it, expect } from "vitest";
import { validatePart, PartDefinition } from "../src/partSchema";
import { builtInParts } from "../src/index";

describe("validatePart", () => {
  it("accepts a well-formed part", () => {
    const part: PartDefinition = {
      id: "test",
      displayName: "Test",
      footprintType: "test",
      size: { width: 1, height: 1 },
      pins: [{ id: "p1", name: "Pin 1", netClass: "signal", offset: { x: 0, y: 0 } }]
    };
    expect(validatePart(part)).toEqual([]);
  });

  it("flags duplicate pin ids", () => {
    const part: PartDefinition = {
      id: "test",
      displayName: "Test",
      footprintType: "test",
      size: { width: 1, height: 1 },
      pins: [
        { id: "p1", name: "Pin 1", netClass: "signal", offset: { x: 0, y: 0 } },
        { id: "p1", name: "Pin 1 dup", netClass: "signal", offset: { x: 1, y: 0 } }
      ]
    };
    expect(validatePart(part).length).toBeGreaterThan(0);
  });
});

describe("builtInParts", () => {
  it("all built-in parts are individually valid", () => {
    for (const part of builtInParts) {
      expect(validatePart(part)).toEqual([]);
    }
  });

  it("includes exactly the five specified parts", () => {
    const ids = builtInParts.map((p) => p.id).sort();
    expect(ids).toEqual(["capacitor", "dip-ic-8", "header-4pin", "led", "resistor"].sort());
  });
});
