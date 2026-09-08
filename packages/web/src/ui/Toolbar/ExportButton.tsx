import React from "react";
import Konva from "konva";
import { exportStageAsImage } from "../../export/imageExport";

export interface ExportButtonProps {
  getStage: () => Konva.Stage | null;
}

export function ExportButton({ getStage }: ExportButtonProps) {
  return (
    <button
      onClick={() => {
        const stage = getStage();
        if (stage) exportStageAsImage(stage);
      }}
    >
      Export image
    </button>
  );
}
