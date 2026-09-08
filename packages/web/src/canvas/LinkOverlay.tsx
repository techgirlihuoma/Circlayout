import React from "react";
import { Line } from "react-konva";
import { ComponentInstance, Net } from "@perfboard/core";
import { getPartDefinition, rotateOffset } from "./footprintUtils";

const SOLDER_LEAD_COLOR = "#22c55e";
const JUMPER_WIRE_COLOR = "#f472b6";
const UNARRANGED_COLOR = "#64748b";

function pinAbsolutePosition(
  components: Record<string, ComponentInstance>,
  componentId: string,
  pinId: string,
  holeSizePx: number
): { x: number; y: number } | null {
  const component = components[componentId];
  if (!component) return null;
  const part = getPartDefinition(component.footprintType);
  if (!part) return null;
  const pinDef = part.pins.find((p) => p.id === pinId);
  if (!pinDef) return null;

  const rotated = rotateOffset(pinDef.offset, part.size, component.orientation);
  return {
    x: (component.position.x + rotated.x) * holeSizePx,
    y: (component.position.y + rotated.y) * holeSizePx
  };
}

export interface LinkOverlayProps {
  nets: Net[];
  components: Record<string, ComponentInstance>;
  holeSizePx: number;
}

/**
 * Renders every net as a chain of straight segments between its pins.
 * Color indicates whether "Arrange" classified the connection as a direct
 * solder lead (green) or an unavoidable jumper wire (pink) -- before the
 * first arrange, links are shown in neutral gray since crossovers haven't
 * been resolved yet.
 */
export function LinkOverlay({ nets, components, holeSizePx }: LinkOverlayProps) {
  return (
    <>
      {nets.map((net) => {
        const points: number[] = [];
        for (const ref of net.pinRefs) {
          const pos = pinAbsolutePosition(components, ref.componentId, ref.pinId, holeSizePx);
          if (!pos) return null;
          points.push(pos.x, pos.y);
        }

        const color =
          net.connectionType === "jumper-wire"
            ? JUMPER_WIRE_COLOR
            : net.connectionType === "solder-lead"
            ? SOLDER_LEAD_COLOR
            : UNARRANGED_COLOR;

        return (
          <Line
            key={net.id}
            points={points}
            stroke={color}
            strokeWidth={2}
            dash={net.connectionType === "jumper-wire" ? [6, 4] : undefined}
            listening={false}
          />
        );
      })}
    </>
  );
}
