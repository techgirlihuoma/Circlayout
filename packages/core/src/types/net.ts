import { NetClass } from "./pin";

export type ConnectionType = "solder-lead" | "jumper-wire";

export interface PinRef {
  componentId: string;
  pinId: string;
}

export interface Net {
  id: string;
  pinRefs: PinRef[];
  netClass: NetClass;
  /**
   * Set by the post-annealing crossover classification pass.
   * Undefined until "Arrange" has run at least once.
   */
  connectionType?: ConnectionType;
}
