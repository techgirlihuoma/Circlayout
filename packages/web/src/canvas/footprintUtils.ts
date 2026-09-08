import { builtInParts, PartDefinition } from "@perfboard/components";
import { Orientation } from "@perfboard/core";

const partsById = new Map<string, PartDefinition>(builtInParts.map((p) => [p.id, p]));

export function getPartDefinition(footprintType: string): PartDefinition | undefined {
  return partsById.get(footprintType);
}

/**
 * Rotates a pin offset (in grid holes, relative to component origin) by the
 * component's orientation. Perfboard holes are on a square grid so 90-degree
 * steps are exact integer rotations.
 */
export function rotateOffset(
  offset: { x: number; y: number },
  size: { width: number; height: number },
  orientation: Orientation
): { x: number; y: number } {
  switch (orientation) {
    case 0:
      return offset;
    case 90:
      return { x: size.height - offset.y, y: offset.x };
    case 180:
      return { x: size.width - offset.x, y: size.height - offset.y };
    case 270:
      return { x: offset.y, y: size.width - offset.x };
    default:
      return offset;
  }
}
