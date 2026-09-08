/// <reference lib="webworker" />
import { arrange, ArrangeInput, ArrangeResult } from "@perfboard/core";

export interface OptimizerRequest {
  type: "arrange";
  payload: ArrangeInput;
}

export interface OptimizerProgressMessage {
  type: "progress";
  progress: number;
  bestCost: number;
}

export interface OptimizerResultMessage {
  type: "result";
  payload: ArrangeResult;
}

self.onmessage = (event: MessageEvent<OptimizerRequest>) => {
  const { type, payload } = event.data;
  if (type !== "arrange") return;

  const result = arrange({
    ...payload,
    onProgress: (progress, bestCost) => {
      const message: OptimizerProgressMessage = { type: "progress", progress, bestCost };
      (self as unknown as Worker).postMessage(message);
    }
  });

  const message: OptimizerResultMessage = { type: "result", payload: result };
  (self as unknown as Worker).postMessage(message);
};
