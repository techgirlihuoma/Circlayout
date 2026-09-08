export interface Keepout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PerfboardConfig {
  holePitchMm: number;
  rows: number;
  cols: number;
  keepouts: Keepout[];
}
