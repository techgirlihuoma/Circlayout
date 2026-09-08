import { ComponentInstance, Net, PerfboardConfig } from "@perfboard/core";
import { useAppStore } from "./store";

const STORAGE_KEY = "perfboard-layout-tool:project";

interface SavedProject {
  version: 1;
  board: PerfboardConfig;
  components: ComponentInstance[];
  nets: Net[];
}

export function saveProject(): void {
  const state = useAppStore.getState();
  const payload: SavedProject = {
    version: 1,
    board: state.board,
    components: Object.values(state.components),
    nets: state.nets
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadProject(): boolean {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;

  try {
    const parsed: SavedProject = JSON.parse(raw);
    useAppStore.getState().loadState({
      board: parsed.board,
      components: parsed.components,
      nets: parsed.nets
    });
    return true;
  } catch {
    return false;
  }
}

export function exportProjectAsFile(): void {
  const state = useAppStore.getState();
  const payload: SavedProject = {
    version: 1,
    board: state.board,
    components: Object.values(state.components),
    nets: state.nets
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "perfboard-project.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function importProjectFromFile(file: File): Promise<void> {
  return file.text().then((text) => {
    const parsed: SavedProject = JSON.parse(text);
    useAppStore.getState().loadState({
      board: parsed.board,
      components: parsed.components,
      nets: parsed.nets
    });
  });
}
