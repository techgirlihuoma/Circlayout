import { useRef, useState } from "react";
import Konva from "konva";

export interface ViewTransform {
  scale: number;
  x: number;
  y: number;
}

const MIN_SCALE = 0.25;
const MAX_SCALE = 4;

export function useZoomPan() {
  const [view, setView] = useState<ViewTransform>({ scale: 1, x: 0, y: 0 });
  const stageRef = useRef<Konva.Stage | null>(null);

  const onWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scaleBy = 1.05;
    const oldScale = view.scale;
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = Math.min(
      MAX_SCALE,
      Math.max(MIN_SCALE, direction > 0 ? oldScale * scaleBy : oldScale / scaleBy)
    );

    const mousePointTo = {
      x: (pointer.x - view.x) / oldScale,
      y: (pointer.y - view.y) / oldScale
    };

    setView({
      scale: newScale,
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale
    });
  };

  const onDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setView((prev) => ({ ...prev, x: e.target.x(), y: e.target.y() }));
  };

  return { view, stageRef, onWheel, onDragEnd };
}
