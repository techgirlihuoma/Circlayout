import { create } from "zustand";
import { ComponentInstance, Net, PerfboardConfig, createPerfboardConfig } from "@perfboard/core";

export interface AppState {
  board: PerfboardConfig;
  components: Record<string, ComponentInstance>;
  nets: Net[];
  selectedComponentId: string | null;
  pendingLinkPin: { componentId: string; pinId: string } | null;

  setBoardSize: (cols: number, rows: number) => void;
  addComponent: (component: ComponentInstance) => void;
  moveComponent: (id: string, x: number, y: number) => void;
  removeComponent: (id: string) => void;
  toggleFixed: (id: string) => void;
  selectComponent: (id: string | null) => void;

  beginOrCompleteLink: (componentId: string, pinId: string, netClass: Net["netClass"]) => void;

  applyArrangeResult: (components: ComponentInstance[], nets: Net[]) => void;

  loadState: (state: { board: PerfboardConfig; components: ComponentInstance[]; nets: Net[] }) => void;
}

let idCounter = 0;
export function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export const useAppStore = create<AppState>((set, get) => ({
  board: createPerfboardConfig(20, 30),
  components: {},
  nets: [],
  selectedComponentId: null,
  pendingLinkPin: null,

  setBoardSize: (cols, rows) =>
    set((state) => ({ board: { ...state.board, cols, rows } })),

  addComponent: (component) =>
    set((state) => ({ components: { ...state.components, [component.id]: component } })),

  moveComponent: (id, x, y) =>
    set((state) => {
      const existing = state.components[id];
      if (!existing || existing.fixed) return state;
      return {
        components: {
          ...state.components,
          [id]: { ...existing, position: { x, y } }
        }
      };
    }),

  removeComponent: (id) =>
    set((state) => {
      const rest = { ...state.components };
      delete rest[id];
      return {
        components: rest,
        nets: state.nets.filter((n) => !n.pinRefs.some((p) => p.componentId === id))
      };
    }),

  toggleFixed: (id) =>
    set((state) => {
      const existing = state.components[id];
      if (!existing) return state;
      return {
        components: { ...state.components, [id]: { ...existing, fixed: !existing.fixed } }
      };
    }),

  selectComponent: (id) => set({ selectedComponentId: id }),

  beginOrCompleteLink: (componentId, pinId, netClass) =>
    set((state) => {
      if (!state.pendingLinkPin) {
        return { pendingLinkPin: { componentId, pinId } };
      }

      // Tapping the same pin again cancels the pending link.
      if (state.pendingLinkPin.componentId === componentId && state.pendingLinkPin.pinId === pinId) {
        return { pendingLinkPin: null };
      }

      const newNet: Net = {
        id: nextId("net"),
        netClass,
        pinRefs: [state.pendingLinkPin, { componentId, pinId }]
      };

      return { nets: [...state.nets, newNet], pendingLinkPin: null };
    }),

  applyArrangeResult: (components, nets) =>
    set(() => ({
      components: Object.fromEntries(components.map((c) => [c.id, c])),
      nets
    })),

  loadState: (loaded) =>
    set(() => ({
      board: loaded.board,
      components: Object.fromEntries(loaded.components.map((c) => [c.id, c])),
      nets: loaded.nets,
      selectedComponentId: null,
      pendingLinkPin: null
    }))
}));
