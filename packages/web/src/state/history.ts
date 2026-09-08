import { useAppStore } from "./store";

interface Snapshot {
  board: ReturnType<typeof useAppStore.getState>["board"];
  components: ReturnType<typeof useAppStore.getState>["components"];
  nets: ReturnType<typeof useAppStore.getState>["nets"];
}

const undoStack: Snapshot[] = [];
const redoStack: Snapshot[] = [];
const MAX_HISTORY = 100;

function snapshot(): Snapshot {
  const state = useAppStore.getState();
  return {
    board: state.board,
    components: state.components,
    nets: state.nets
  };
}

/**
 * Call after any user-initiated mutation (place, move, link, arrange, delete)
 * to push a checkpoint onto the undo stack. Not called from undo/redo
 * themselves, to avoid poisoning the stacks.
 */
export function pushHistory(): void {
  undoStack.push(snapshot());
  if (undoStack.length > MAX_HISTORY) undoStack.shift();
  redoStack.length = 0;
}

export function undo(): void {
  const previous = undoStack.pop();
  if (!previous) return;
  redoStack.push(snapshot());
  useAppStore.setState(previous);
}

export function redo(): void {
  const next = redoStack.pop();
  if (!next) return;
  undoStack.push(snapshot());
  useAppStore.setState(next);
}

export function canUndo(): boolean {
  return undoStack.length > 0;
}

export function canRedo(): boolean {
  return redoStack.length > 0;
}
