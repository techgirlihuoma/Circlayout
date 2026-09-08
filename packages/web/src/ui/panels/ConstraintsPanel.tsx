import React from "react";
import { useAppStore } from "../../state/store";
import { pushHistory } from "../../state/history";
import { Orientation } from "@perfboard/core";

const ORIENTATIONS: Orientation[] = [0, 90, 180, 270];

export function ConstraintsPanel() {
  const selectedComponentId = useAppStore((s) => s.selectedComponentId);
  const component = useAppStore((s) =>
    s.selectedComponentId ? s.components[s.selectedComponentId] : null
  );
  const toggleFixed = useAppStore((s) => s.toggleFixed);
  const removeComponent = useAppStore((s) => s.removeComponent);
  const moveComponent = useAppStore((s) => s.moveComponent);

  if (!selectedComponentId || !component) {
    return (
      <div className="constraints-panel">
        <h3>Selected component</h3>
        <p className="hint">Select a component on the board to fix its position or orientation.</p>
      </div>
    );
  }

  return (
    <div className="constraints-panel">
      <h3>Selected: {component.footprintType}</h3>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={component.fixed}
          onChange={() => {
            toggleFixed(selectedComponentId);
            pushHistory();
          }}
        />
        Fixed (Arrange will not move or rotate this)
      </label>

      <div className="orientation-row">
        <span>Orientation:</span>
        {ORIENTATIONS.map((o) => (
          <button key={o} disabled={!component.fixed}>
            {o}°
          </button>
        ))}
      </div>
      <p className="hint">Orientation lock only applies while the component is fixed.</p>

      <button
        className="danger"
        onClick={() => {
          removeComponent(selectedComponentId);
          pushHistory();
        }}
      >
        Remove component
      </button>
    </div>
  );
}
