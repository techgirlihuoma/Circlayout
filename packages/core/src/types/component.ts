import { Pin } from "./pin";

export interface Position {
  x: number;
  y: number;
}

export type Orientation = 0 | 90 | 180 | 270;

export interface ComponentInstance {
  id: string;
  footprintType: string;
  pins: Pin[];
  position: Position;
  orientation: Orientation;
  /** If true, the optimizer must not move or rotate this component. */
  fixed: boolean;
}
