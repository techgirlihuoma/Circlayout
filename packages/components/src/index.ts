export * from "./partSchema";

import resistor from "./parts/resistor.json";
import led from "./parts/led.json";
import capacitor from "./parts/capacitor.json";
import dipIC from "./parts/dipIC.json";
import header from "./parts/header.json";
import { PartDefinition } from "./partSchema";

export const builtInParts: PartDefinition[] = [
  resistor as PartDefinition,
  led as PartDefinition,
  capacitor as PartDefinition,
  dipIC as PartDefinition,
  header as PartDefinition
];
