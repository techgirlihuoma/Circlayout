export type NetClass = "power" | "ground" | "signal" | "high-current";

export interface Pin {
  id: string;
  name: string;
  netClass: NetClass;
}
