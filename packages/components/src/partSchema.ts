export type NetClass = "power" | "ground" | "signal" | "high-current";

export interface PartPinDefinition {
  id: string;
  name: string;
  netClass: NetClass;
  /** Offset in grid holes from the component's origin, at 0-degree orientation. */
  offset: { x: number; y: number };
}

export interface PartDefinition {
  id: string;
  displayName: string;
  footprintType: string;
  /** Bounding box size in grid holes, at 0-degree orientation. */
  size: { width: number; height: number };
  pins: PartPinDefinition[];
}

export function validatePart(part: PartDefinition): string[] {
  const errors: string[] = [];
  if (!part.id) errors.push("part.id is required");
  if (!part.pins || part.pins.length === 0) errors.push("part must define at least one pin");
  const pinIds = new Set<string>();
  for (const pin of part.pins ?? []) {
    if (pinIds.has(pin.id)) errors.push(`duplicate pin id: ${pin.id}`);
    pinIds.add(pin.id);
  }
  return errors;
}
