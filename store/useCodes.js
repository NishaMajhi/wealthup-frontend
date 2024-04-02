import { create } from "zustand";

export const useCodes = create((set) => ({
  codes: [],
  setCodes: (data) => {
    set({ codes: data });
  },
}));
