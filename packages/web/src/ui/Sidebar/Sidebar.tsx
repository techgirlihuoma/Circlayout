import React from "react";
import { ComponentPalette } from "./ComponentPalette";
import { ConstraintsPanel } from "../panels/ConstraintsPanel";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <ComponentPalette />
      <ConstraintsPanel />
    </aside>
  );
}
