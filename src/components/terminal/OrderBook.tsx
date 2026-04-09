"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { EXPERTISE_MARKETS } from "@/lib/mock-data";
import { generateOrderBook } from "@/lib/seed-market-data";
import { useTerminalStore } from "@/lib/terminal-store";

export function OrderBook() {
  const { orderBookMarket, liveTick: _tick } = useTerminalStore();

  const book = useMemo(
    () => generateOrderBook(orderBookMarket),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderBookMarket, _tick]
  );

  const maxBidQty = Math.max(...book.bids.map((b) => b.totalMinutes), 1);
  const maxAskQty = Math.max(...book.asks.map((a) => a.totalMinutes), 1);
  const catLabel =
    EXPERTISE_MARKETS.find((c) => c.id === orderBookMarket)?.label ?? "Market";

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/[0.06] bg-[#0a1018]/80 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse-live" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/90">
            Order Book
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">{catLabel}</span>
      </div>

      {/* Spread info */}
      <div className="flex items-center justify-between border-b border-white/[0.04] px-4 py-2">
        <div className="text-[10px] text-muted-foreground">
          Spread: <span className="font-semibold text-amber-300">£{book.spread}</span>
        </div>
        <div className="text-[10px] text-muted-foreground">
          Last:{" "}
          <span className="font-semibold text-foreground">£{book.lastPrice}/hr</span>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-3 gap-1 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
        <span>Price</span>
        <span className="text-center">Orders</span>
        <span className="text-right">Depth (min)</span>
      </div>

      {/* Asks (reversed so lowest ask is at bottom) */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2">
        <div className="flex flex-col justify-end">
          {[...book.asks].reverse().map((level, i) => (
            <motion.div
              key={`ask-${i}`}
              className="group relative grid grid-cols-3 gap-1 rounded-lg px-2 py-[3px] text-[11px] hover:bg-red-500/[0.06]"
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <div
                className="absolute inset-y-0 right-0 rounded-r-lg bg-red-500/[0.06]"
                style={{ width: `${(level.totalMinutes / maxAskQty) * 100}%` }}
              />
              <span className="relative z-10 font-mono font-medium text-red-400">
                £{level.price}
              </span>
              <span className="relative z-10 text-center text-muted-foreground">
                {level.quantity}
              </span>
              <span className="relative z-10 text-right text-muted-foreground">
                {level.totalMinutes}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Mid-price divider */}
        <div className="my-1.5 flex items-center gap-2 px-2">
          <div className="h-px flex-1 bg-white/[0.08]" />
          <span className="text-[13px] font-bold text-foreground">
            £{book.lastPrice}
          </span>
          <div className="h-px flex-1 bg-white/[0.08]" />
        </div>

        {/* Bids */}
        <div>
          {book.bids.map((level, i) => (
            <motion.div
              key={`bid-${i}`}
              className="group relative grid grid-cols-3 gap-1 rounded-lg px-2 py-[3px] text-[11px] hover:bg-emerald-500/[0.06]"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-l-lg bg-emerald-500/[0.06]"
                style={{ width: `${(level.totalMinutes / maxBidQty) * 100}%` }}
              />
              <span className="relative z-10 font-mono font-medium text-emerald-400">
                £{level.price}
              </span>
              <span className="relative z-10 text-center text-muted-foreground">
                {level.quantity}
              </span>
              <span className="relative z-10 text-right text-muted-foreground">
                {level.totalMinutes}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
