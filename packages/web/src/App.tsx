import React from "react";
import { Sidebar } from "./ui/Sidebar/Sidebar";
import { Toolbar } from "./ui/Toolbar/Toolbar";
import { BoardCanvas } from "./canvas/BoardCanvas";
import { useZoomPan } from "./hooks/useZoomPan";
import { useUndoRedo } from "./hooks/useUndoRedo";

export default function App() {
  const { view, stageRef, onWheel, onDragEnd } = useZoomPan();
  useUndoRedo();

  return (
    <div className="app-shell">
      <Toolbar getStage={() => stageRef.current} />
      <div className="app-body">
        <Sidebar />
        <main className="canvas-area">
          <BoardCanvas view={view} stageRef={stageRef} onWheel={onWheel} onDragEnd={onDragEnd} />
        </main>
      </div>
    </div>
  );
}
