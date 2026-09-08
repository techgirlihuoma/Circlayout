import React, { useState } from "react";
import { useAppStore } from "../../state/store";
import { pushHistory } from "../../state/history";
import { runArrangeInWorker } from "../../worker/workerClient";

export function ArrangeButton() {
  const components = useAppStore((s) => s.components);
  const nets = useAppStore((s) => s.nets);
  const board = useAppStore((s) => s.board);
  const applyArrangeResult = useAppStore((s) => s.applyArrangeResult);

  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleArrange = async () => {
    setRunning(true);
    setProgress(0);

    try {
      const result = await runArrangeInWorker(
        {
          components: Object.values(components),
          nets,
          boardCols: board.cols,
          boardRows: board.rows
        },
        (p) => setProgress(p.progress)
      );

      applyArrangeResult(result.components, result.nets);
      pushHistory();
    } finally {
      setRunning(false);
    }
  };

  return (
    <button className="arrange-button" onClick={handleArrange} disabled={running}>
      {running ? `Arranging… ${Math.round(progress * 100)}%` : "Arrange"}
    </button>
  );
}
