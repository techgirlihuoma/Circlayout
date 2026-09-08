import React from "react";
import { Circle } from "react-konva";
import { NetClass } from "@perfboard/core";

const NET_CLASS_COLOR: Record<NetClass, string> = {
  power: "#ef4444",
  ground: "#1e293b",
  signal: "#38bdf8",
  "high-current": "#f97316"
};

export interface PinHandleProps {
  x: number;
  y: number;
  netClass: NetClass;
  isPending: boolean;
  onTap: () => void;
}

export function PinHandle({ x, y, netClass, isPending, onTap }: PinHandleProps) {
  return (
    <Circle
      x={x}
      y={y}
      radius={isPending ? 7 : 5}
      fill={NET_CLASS_COLOR[netClass]}
      stroke={isPending ? "#facc15" : undefined}
      strokeWidth={isPending ? 2 : 0}
      onClick={onTap}
      onTap={onTap}
      hitStrokeWidth={16}
    />
  );
}
