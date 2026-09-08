import React from "react";
import { builtInParts } from "@perfboard/components";
import { ComponentInstance } from "@perfboard/core";
import { useAppStore, nextId } from "../../state/store";
import { pushHistory } from "../../state/history";

export function ComponentPalette() {
  const addComponent = useAppStore((s) => s.addComponent);
  const board = useAppStore((s) => s.board);

  const handleAdd = (footprintType: string) => {
    const part = builtInParts.find((p) => p.footprintType === footprintType || p.id === footprintType);
    if (!part) return;

    const component: ComponentInstance = {
      id: nextId(part.id),
      footprintType: part.id,
      pins: part.pins.map((p) => ({ id: p.id, name: p.name, netClass: p.netClass })),
      position: { x: Math.floor(board.cols / 2), y: Math.floor(board.rows / 2) },
      orientation: 0,
      fixed: false
    };

    addComponent(component);
    pushHistory();
  };

  return (
    <div className="palette">
      <h3>Components</h3>
      {builtInParts.map((part) => (
        <button key={part.id} className="palette-item" onClick={() => handleAdd(part.id)}>
          {part.displayName}
        </button>
      ))}
    </div>
  );
}
