import { create } from "zustand";

export interface ExecutedTrade {
  id: string;
  mentorId: string;
  mentorName: string;
  categoryId: string;
  expertise: string[];
  price: number;
  durationMinutes: number;
  executedAt: string;
  orderType: "spot" | "futures";
}

interface TradeStore {
  trades: ExecutedTrade[];
  addTrade: (trade: ExecutedTrade) => void;
}

function loadTrades(): ExecutedTrade[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("tx-executed-trades");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTrades(trades: ExecutedTrade[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("tx-executed-trades", JSON.stringify(trades));
  } catch {
    // storage full or unavailable
  }
}

export const useTradeStore = create<TradeStore>((set) => ({
  trades: loadTrades(),
  addTrade: (trade) =>
    set((state) => {
      const next = [trade, ...state.trades];
      saveTrades(next);
      return { trades: next };
    }),
}));
