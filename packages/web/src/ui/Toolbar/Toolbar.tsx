import React from "react";
import Konva from "konva";
import { ArrangeButton } from "./ArrangeButton";
import { BoardSizeControl } from "./BoardSizeControl";
import { ExportButton } from "./ExportButton";
import { undo, redo } from "../../state/history";
import { saveProject, loadProject, exportProjectAsFile, importProjectFromFile } from "../../state/persistence";

export interface ToolbarProps {
  getStage: () => Konva.Stage | null;
}

export function Toolbar({ getStage }: ToolbarProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <header className="toolbar">
      <BoardSizeControl />
      <ArrangeButton />
      <ExportButton getStage={getStage} />

      <div className="toolbar-group">
        <button onClick={undo} title="Undo (Ctrl+Z)">
          Undo
        </button>
        <button onClick={redo} title="Redo (Ctrl+Shift+Z)">
          Redo
        </button>
      </div>

      <div className="toolbar-group">
        <button onClick={saveProject}>Save</button>
        <button onClick={loadProject}>Load</button>
        <button onClick={exportProjectAsFile}>Export JSON</button>
        <button onClick={() => fileInputRef.current?.click()}>Import JSON</button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) importProjectFromFile(file);
            e.target.value = "";
          }}
        />
      </div>
    </header>
  );
}
