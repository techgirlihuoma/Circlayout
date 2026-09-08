import React from "react";
import { useAppStore } from "../../state/store";
import { pushHistory } from "../../state/history";

export function BoardSizeControl() {
  const board = useAppStore((s) => s.board);
  const setBoardSize = useAppStore((s) => s.setBoardSize);

  return (
    <div className="board-size-control">
      <label>
        Cols
        <input
          type="number"
          min={2}
          value={board.cols}
          onChange={(e) => {
            setBoardSize(Number(e.target.value), board.rows);
            pushHistory();
          }}
        />
      </label>
      <label>
        Rows
        <input
          type="number"
          min={2}
          value={board.rows}
          onChange={(e) => {
            setBoardSize(board.cols, Number(e.target.value));
            pushHistory();
          }}
        />
      </label>
    </div>
  );
}
