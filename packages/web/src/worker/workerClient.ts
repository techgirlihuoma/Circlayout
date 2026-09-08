import { ArrangeInput, ArrangeResult } from "@perfboard/core";

export interface ArrangeProgress {
  progress: number;
  bestCost: number;
}

/**
 * Runs the placement/routing optimizer off the main thread so drag/zoom/pan
 * stay responsive while annealing works, even on modest mobile hardware.
 */
export function runArrangeInWorker(
  input: ArrangeInput,
  onProgress?: (progress: ArrangeProgress) => void
): Promise<ArrangeResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./optimizerWorker.ts", import.meta.url), {
      type: "module"
    });

    worker.onmessage = (event: MessageEvent) => {
      const data = event.data;
      if (data.type === "progress" && onProgress) {
        onProgress({ progress: data.progress, bestCost: data.bestCost });
      } else if (data.type === "result") {
        resolve(data.payload as ArrangeResult);
        worker.terminate();
      }
    };

    worker.onerror = (err) => {
      reject(err);
      worker.terminate();
    };

    worker.postMessage({ type: "arrange", payload: input });
  });
}
