import { create } from "zustand";
import type { TimeFrame } from "@/types/market";

export type TerminalView = "dashboard" | "spot" | "futures";

export interface TerminalStore {
  activeView: TerminalView;
  setActiveView: (view: TerminalView) => void;

  selectedMarket: string; // categoryId
  setSelectedMarket: (categoryId: string) => void;

  chartTimeframe: TimeFrame;
  setChartTimeframe: (tf: TimeFrame) => void;

  orderBookMarket: string;
  setOrderBookMarket: (categoryId: string) => void;

  showAIPanel: boolean;
  toggleAIPanel: () => void;

  // Simulated live tick for order book animation
  liveTick: number;
  bumpLiveTick: () => void;
}

export const useTerminalStore = create<TerminalStore>((set) => ({
  activeView: "dashboard",
  setActiveView: (view) => set({ activeView: view }),

  selectedMarket: "technology",
  setSelectedMarket: (categoryId) =>
    set({ selectedMarket: categoryId, orderBookMarket: categoryId }),

  chartTimeframe: "1H",
  setChartTimeframe: (tf) => set({ chartTimeframe: tf }),

  orderBookMarket: "technology",
  setOrderBookMarket: (categoryId) => set({ orderBookMarket: categoryId }),

  showAIPanel: true,
  toggleAIPanel: () => set((s) => ({ showAIPanel: !s.showAIPanel })),

  liveTick: 0,
  bumpLiveTick: () => set((s) => ({ liveTick: s.liveTick + 1 })),
}));
