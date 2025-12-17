import { create } from "zustand";

export interface Capture {
  id: string;
  title: string;
  thumbnail: string;
  status: "Processing" | "Finished" | "Failed";
  createdAt: string;
  taskId?: string;
  modelPath?: string;
  progress?: number;
}

interface Store {
  captures: Capture[];
  addCapture: (capture: Capture) => void;
  updateCapture: (id: string, updates: Partial<Capture>) => void;
  removeCapture: (id: string) => void;
  setCaptures: (captures: Capture[]) => void;
}

export const useStore = create<Store>((set) => ({
  captures: [],

  addCapture: (capture) =>
    set((state) => ({
      captures: [capture, ...state.captures],
    })),

  updateCapture: (id, updates) =>
    set((state) => ({
      captures: state.captures.map((capture) =>
        capture.id === id ? { ...capture, ...updates } : capture
      ),
    })),

  removeCapture: (id) =>
    set((state) => ({
      captures: state.captures.filter((capture) => capture.id !== id),
    })),

  setCaptures: (captures) => set({ captures }),
}));
