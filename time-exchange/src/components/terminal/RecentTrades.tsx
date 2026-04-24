"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { STATIC_EXPERT_LISTINGS, CATEGORY_LABELS } from "@/lib/mock-data";
import { getTrades, MARKET_REFERENCE_TIMESTAMP } from "@/lib/seed-market-data";
import { useTradeStore } from "@/lib/trade-store";
import { cn } from "@/lib/utils";

function timeAgo(isoDate: string): string {
  const diff = MARKET_REFERENCE_TIMESTAMP - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function RecentTrades() {
  const executedTrades = useTradeStore((state) => state.trades);

  const trades = useMemo(
    () =>
      [...executedTrades, ...getTrades()]
        .sort(
          (a, b) =>
            new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime()
        )
        .slice(0, 15),
    [executedTrades]
  );

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/[0.06] bg-[#0a1018]/80 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/90">
          Recent Trades
        </span>
        <span className="text-[10px] text-muted-foreground">
          {trades.length} fills
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {trades.map((trade, i) => {
          const mentor = STATIC_EXPERT_LISTINGS.find((e) => e.id === trade.mentorId);
          const isSpot = trade.orderType === "spot";

          return (
            <motion.div
              key={trade.id}
              className="flex items-center gap-3 border-b border-white/[0.03] px-4 py-2 transition-colors hover:bg-white/[0.02]"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-md",
                  isSpot ? "bg-emerald-500/10" : "bg-sky-500/10"
                )}
              >
                {isSpot ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-sky-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-[11px] font-medium text-foreground">
                    {mentor?.name ?? "Unknown"}
                  </span>
                  <span
                    className={cn(
                      "rounded px-1 py-0.5 text-[8px] font-bold uppercase",
                      isSpot
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-sky-500/10 text-sky-300"
                    )}
                  >
                    {trade.orderType}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {CATEGORY_LABELS[trade.categoryId]} · {trade.durationMinutes}min
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-semibold text-primary">
                  £{trade.price}/hr
                </div>
                <div className="text-[9px] text-muted-foreground">
                  {timeAgo(trade.executedAt)}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
