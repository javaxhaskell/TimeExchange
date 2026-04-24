"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Calendar,
  Clock,
  Globe,
} from "lucide-react";
import { STATIC_EXPERT_LISTINGS, EXPERTISE_MARKETS, CATEGORY_LABELS } from "@/lib/mock-data";
import { getFuturesOrders, MARKET_REFERENCE_TIMESTAMP } from "@/lib/seed-market-data";
import { useTerminalStore } from "@/lib/terminal-store";
import { cn, getAvatarColor, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { FuturesOrder } from "@/types/market";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function getDaysFromNow(dateStr: string): number {
  const now = new Date(MARKET_REFERENCE_TIMESTAMP);
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

export function FuturesBoard() {
  const { selectedMarket, setSelectedMarket } = useTerminalStore();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const orders = useMemo(() => {
    const all = getFuturesOrders().filter(
      (o) =>
        o.status === "open" &&
        (selectedMarket === "all" || o.categoryId === selectedMarket)
    );

    if (selectedDate) {
      return all.filter((o) => o.scheduledDate === selectedDate);
    }

    return all.sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
    );
  }, [selectedMarket, selectedDate]);

  // Get unique dates for calendar dots
  const allOrders = useMemo(() => getFuturesOrders().filter((o) => o.status === "open"), []);
  const uniqueDates = useMemo(
    () => [...new Set(allOrders.map((o) => o.scheduledDate))].sort(),
    [allOrders]
  );

  const asks = orders.filter((o) => o.side === "ask");
  const bids = orders.filter((o) => o.side === "bid");

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/15">
            <Calendar className="h-3.5 w-3.5 text-sky-300" />
          </div>
          <div>
            <h2 className="text-[13px] font-bold text-foreground">
              Futures Market — Forward Booking
            </h2>
            <p className="text-[10px] text-muted-foreground">
              {orders.length} open orders across {uniqueDates.length} dates
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            className="h-8 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 text-[11px] text-foreground outline-none"
          >
            <option value="all" className="bg-[#0a1018]">All markets</option>
            {EXPERTISE_MARKETS.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-[#0a1018]">
                {cat.label}
              </option>
            ))}
          </select>

          {selectedDate && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-[10px] text-muted-foreground"
              onClick={() => setSelectedDate(null)}
            >
              Clear date
            </Button>
          )}
        </div>
      </div>

      {/* Date selector strip */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-white/[0.04] px-5 py-2.5 scrollbar-thin">
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
          Dates
        </span>
        {uniqueDates.map((date) => {
          const daysOut = getDaysFromNow(date);
          const ordersOnDate = allOrders.filter(
            (o) => o.scheduledDate === date
          ).length;
          return (
            <button
              key={date}
              onClick={() =>
                setSelectedDate(selectedDate === date ? null : date)
              }
              className={cn(
                "flex flex-col items-center rounded-lg border px-3 py-1.5 transition-colors",
                selectedDate === date
                  ? "border-primary/25 bg-primary/10"
                  : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
              )}
            >
              <span
                className={cn(
                  "text-[10px] font-semibold",
                  selectedDate === date
                    ? "text-primary"
                    : "text-foreground"
                )}
              >
                {formatDate(date)}
              </span>
              <span className="text-[8px] text-muted-foreground">
                {ordersOnDate} orders · {daysOut}d out
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {orders.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No open futures orders{selectedDate ? " on this date" : ""}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Asks (Mentor availability) */}
            {asks.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-300/80">
                    Mentor Availability (Asks)
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {asks.length}
                  </span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {asks.map((order, i) => (
                    <FuturesOrderCard key={order.id} order={order} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Bids (Buyer requests) */}
            {bids.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300/80">
                    Buyer Requests (Bids)
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {bids.length}
                  </span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {bids.map((order, i) => (
                    <FuturesOrderCard key={order.id} order={order} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FuturesOrderCard({ order, index }: { order: FuturesOrder; index: number }) {
  const mentor = order.mentorId
    ? STATIC_EXPERT_LISTINGS.find((e) => e.id === order.mentorId)
    : null;
  const isAsk = order.side === "ask";
  const daysOut = getDaysFromNow(order.scheduledDate);

  return (
    <motion.div
      className={cn(
        "rounded-xl border p-3 transition-all hover:border-white/[0.12]",
        isAsk
          ? "border-red-500/10 bg-red-500/[0.03]"
          : "border-emerald-500/10 bg-emerald-500/[0.03]"
      )}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {mentor && (
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br text-[9px] font-bold text-white",
                getAvatarColor(mentor.name)
              )}
            >
              {getInitials(mentor.name)}
            </div>
          )}
          <div>
            <div className="text-[11px] font-semibold text-foreground">
              {mentor?.name ?? "Open Request"}
            </div>
            <div className="text-[9px] text-muted-foreground">
              {CATEGORY_LABELS[order.categoryId]}
            </div>
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-[8px] uppercase",
            isAsk
              ? "border-red-500/20 text-red-300"
              : "border-emerald-500/20 text-emerald-300"
          )}
        >
          {isAsk ? "ASK" : "BID"}
        </Badge>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-2 rounded-lg border border-white/[0.04] bg-white/[0.01] p-2">
        <div>
          <div className="text-[8px] text-muted-foreground">Date</div>
          <div className="flex items-center gap-1 text-[10px] font-medium text-foreground">
            <Calendar className="h-2.5 w-2.5 text-sky-300" />
            {formatDate(order.scheduledDate)}
          </div>
        </div>
        <div>
          <div className="text-[8px] text-muted-foreground">Time</div>
          <div className="flex items-center gap-1 text-[10px] font-medium text-foreground">
            <Clock className="h-2.5 w-2.5 text-sky-300" />
            {order.scheduledTime}
          </div>
        </div>
        <div>
          <div className="text-[8px] text-muted-foreground">Duration</div>
          <div className="text-[10px] font-medium text-foreground">
            {order.durationMinutes} min
          </div>
        </div>
        <div>
          <div className="text-[8px] text-muted-foreground">Price</div>
          <div className="text-[10px] font-bold text-primary">
            £{order.price}/hr
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
          <Globe className="h-2.5 w-2.5" />
          {order.timezone} · {daysOut}d out
        </div>
        <Button
          size="sm"
          className={cn(
            "h-6 rounded-md px-2.5 text-[9px] font-semibold",
            isAsk
              ? "bg-primary/15 text-primary hover:bg-primary/25"
              : "bg-emerald-600/80 text-white hover:bg-emerald-500"
          )}
        >
          {isAsk ? "Book Slot" : "Fill Bid"}
          <ArrowUpRight className="ml-0.5 h-2.5 w-2.5" />
        </Button>
      </div>
    </motion.div>
  );
}
