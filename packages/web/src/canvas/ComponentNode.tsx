import React from "react";
import { Group, Rect, Text } from "react-konva";
import Konva from "konva";
import { ComponentInstance } from "@perfboard/core";
import { PinHandle } from "./PinHandle";
import { getPartDefinition, rotateOffset } from "./footprintUtils";
import { usePointerLinking } from "../hooks/usePointerLinking";

export interface ComponentNodeProps {
  component: ComponentInstance;
  holeSizePx: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
}

export function ComponentNode({
  component,
  holeSizePx,
  isSelected,
  onSelect,
  onDragEnd
}: ComponentNodeProps) {
  const part = getPartDefinition(component.footprintType);
  const { onPinTap, isPending } = usePointerLinking();

  if (!part) return null;

  const widthPx = part.size.width * holeSizePx;
  const heightPx = part.size.height * holeSizePx;

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const gridX = Math.round(e.target.x() / holeSizePx);
    const gridY = Math.round(e.target.y() / holeSizePx);
    onDragEnd(component.id, gridX, gridY);
  };

  return (
    <Group
      x={component.position.x * holeSizePx}
      y={component.position.y * holeSizePx}
      draggable={!component.fixed}
      onDragEnd={handleDragEnd}
      onClick={() => onSelect(component.id)}
      onTap={() => onSelect(component.id)}
    >
      <Rect
        width={widthPx}
        height={heightPx}
        fill={component.fixed ? "#334155" : "#475569"}
        stroke={isSelected ? "#facc15" : "#94a3b8"}
        strokeWidth={isSelected ? 2 : 1}
        cornerRadius={3}
      />
      <Text
        text={part.displayName}
        fontSize={10}
        fill="#e2e8f0"
        x={4}
        y={4}
        listening={false}
      />
      {component.fixed && (
        <Text text="🔒" fontSize={12} x={widthPx - 16} y={2} listening={false} />
      )}
      {part.pins.map((pinDef) => {
        const rotated = rotateOffset(pinDef.offset, part.size, component.orientation);
        return (
          <PinHandle
            key={pinDef.id}
            x={rotated.x * holeSizePx}
            y={rotated.y * holeSizePx}
            netClass={pinDef.netClass}
            isPending={isPending(component.id, pinDef.id)}
            onTap={() => onPinTap(component.id, pinDef.id, pinDef.netClass)}
          />
        );
      })}
    </Group>
  );
}
