import Konva from "konva";

/**
 * Exports the final arranged layout as a single annotated PNG -- the whole
 * "build guide" is this one image, with solder-lead vs jumper-wire links
 * already color-coded by LinkOverlay before this is called.
 */
export function exportStageAsImage(stage: Konva.Stage, filename = "perfboard-layout.png"): void {
  const dataUrl = stage.toDataURL({ pixelRatio: 2 });
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
