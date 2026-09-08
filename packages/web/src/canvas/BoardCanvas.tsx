import React from "react";
import { Stage, Layer, Circle } from "react-konva";
import { useAppStore } from "../state/store";
import { pushHistory } from "../state/history";
import { generateGridDots } from "./gridRenderer";
import { ComponentNode } from "./ComponentNode";
import { LinkOverlay } from "./LinkOverlay";
import { ViewTransform } from "../hooks/useZoomPan";
import Konva from "konva";

export const HOLE_SIZE_PX = 24;

export interface BoardCanvasProps {
  view: ViewTransform;
  stageRef: React.MutableRefObject<Konva.Stage | null>;
  onWheel: (e: Konva.KonvaEventObject<WheelEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
}

export function BoardCanvas({ view, stageRef, onWheel, onDragEnd }: BoardCanvasProps) {
  const board = useAppStore((s) => s.board);
  const components = useAppStore((s) => s.components);
  const nets = useAppStore((s) => s.nets);
  const selectedComponentId = useAppStore((s) => s.selectedComponentId);
  const selectComponent = useAppStore((s) => s.selectComponent);
  const moveComponent = useAppStore((s) => s.moveComponent);

  const dots = generateGridDots(board, HOLE_SIZE_PX);

  const handleComponentDragEnd = (id: string, x: number, y: number) => {
    moveComponent(id, x, y);
    pushHistory();
  };

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
      scaleX={view.scale}
      scaleY={view.scale}
      x={view.x}
      y={view.y}
      draggable
      onWheel={onWheel}
      onDragEnd={onDragEnd}
      onClick={(e) => {
        if (e.target === e.target.getStage()) selectComponent(null);
      }}
      style={{ background: "#0f172a" }}
    >
      <Layer listening={false}>
        {dots.map((dot, i) => (
          <Circle key={i} x={dot.x} y={dot.y} radius={1.2} fill="#334155" />
        ))}
      </Layer>

      <Layer>
        <LinkOverlay nets={nets} components={components} holeSizePx={HOLE_SIZE_PX} />
      </Layer>

      <Layer>
        {Object.values(components).map((component) => (
          <ComponentNode
            key={component.id}
            component={component}
            holeSizePx={HOLE_SIZE_PX}
            isSelected={component.id === selectedComponentId}
            onSelect={selectComponent}
            onDragEnd={handleComponentDragEnd}
          />
        ))}
      </Layer>
    </Stage>
  );
}
