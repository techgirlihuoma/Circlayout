import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore, nextId } from "../src/state/store";
import { ComponentInstance } from "@perfboard/core";

function makeComponent(id: string): ComponentInstance {
  return {
    id,
    footprintType: "resistor",
    pins: [
      { id: "p1", name: "Lead 1", netClass: "signal" },
      { id: "p2", name: "Lead 2", netClass: "signal" }
    ],
    position: { x: 5, y: 5 },
    orientation: 0,
    fixed: false
  };
}

describe("useAppStore", () => {
  beforeEach(() => {
    useAppStore.setState({
      components: {},
      nets: [],
      selectedComponentId: null,
      pendingLinkPin: null
    });
  });

  it("adds a component", () => {
    useAppStore.getState().addComponent(makeComponent("a"));
    expect(useAppStore.getState().components["a"]).toBeDefined();
  });

  it("does not move a fixed component", () => {
    const c = makeComponent("a");
    c.fixed = true;
    useAppStore.getState().addComponent(c);
    useAppStore.getState().moveComponent("a", 10, 10);
    expect(useAppStore.getState().components["a"].position).toEqual({ x: 5, y: 5 });
  });

  it("creates a net after two beginOrCompleteLink calls", () => {
    useAppStore.getState().addComponent(makeComponent("a"));
    useAppStore.getState().addComponent(makeComponent("b"));

    useAppStore.getState().beginOrCompleteLink("a", "p1", "signal");
    expect(useAppStore.getState().pendingLinkPin).toEqual({ componentId: "a", pinId: "p1" });

    useAppStore.getState().beginOrCompleteLink("b", "p1", "signal");
    expect(useAppStore.getState().pendingLinkPin).toBeNull();
    expect(useAppStore.getState().nets.length).toBe(1);
  });

  it("cancels a pending link when the same pin is tapped again", () => {
    useAppStore.getState().addComponent(makeComponent("a"));
    useAppStore.getState().beginOrCompleteLink("a", "p1", "signal");
    useAppStore.getState().beginOrCompleteLink("a", "p1", "signal");
    expect(useAppStore.getState().pendingLinkPin).toBeNull();
    expect(useAppStore.getState().nets.length).toBe(0);
  });
});
