"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, Clock, DollarSign, TrendingUp, Users, Zap } from "lucide-react";
import { STATIC_EXPERT_LISTINGS } from "@/lib/mock-data";
import { getSpotOrders, getFuturesOrders, getTrades } from "@/lib/seed-market-data";
import { useTerminalStore } from "@/lib/terminal-store";
import { cn } from "@/lib/utils";

export function MarketOverviewBar() {
  const { liveTick: _tick } = useTerminalStore();

  const stats = useMemo(() => {
    const liveCount = STATIC_EXPERT_LISTINGS.filter(
      (e) => e.availabilityStatus === "live"
    ).length;
    const spotOpen = getSpotOrders().filter((o) => o.status === "open").length;
    const futuresOpen = getFuturesOrders().filter((o) => o.status === "open").length;
    const trades = getTrades();
    const recentTrades = trades.slice(0, 10);
    const avgPrice =
      recentTrades.length > 0
        ? Math.round(
            recentTrades.reduce((s, t) => s + t.price, 0) / recentTrades.length
          )
        : 0;
    const totalVolume = trades.reduce((s, t) => s + t.durationMinutes, 0);

    return [
      {
        label: "Live Mentors",
        value: liveCount,
        icon: Zap,
        color: "text-emerald-300",
        bgColor: "bg-emerald-500/10",
      },
      {
        label: "Spot Orders",
        value: spotOpen,
        icon: BarChart3,
        color: "text-primary",
        bgColor: "bg-primary/10",
      },
      {
        label: "Futures Orders",
        value: futuresOpen,
        icon: Clock,
        color: "text-sky-300",
        bgColor: "bg-sky-500/10",
      },
      {
        label: "Avg Price",
        value: `£${avgPrice}`,
        icon: DollarSign,
        color: "text-amber-300",
        bgColor: "bg-amber-500/10",
      },
      {
        label: "Total Volume",
        value: `${totalVolume}m`,
        icon: TrendingUp,
        color: "text-violet-300",
        bgColor: "bg-violet-500/10",
      },
      {
        label: "Active Experts",
        value: STATIC_EXPERT_LISTINGS.length,
        icon: Users,
        color: "text-rose-300",
        bgColor: "bg-rose-500/10",
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_tick]);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0a1018]/60 backdrop-blur-sm">
      <div className="grid grid-cols-2 gap-0 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className={cn(
              "flex items-center gap-2.5 px-4 py-3",
              i < stats.length - 1 && "border-r border-white/[0.04]"
            )}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <div className={cn("rounded-lg p-2", stat.bgColor)}>
              <stat.icon className={cn("h-3.5 w-3.5", stat.color)} />
            </div>
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
                {stat.label}
              </div>
              <div className="mt-0.5 text-[14px] font-bold tracking-[-0.03em] text-foreground">
                {stat.value}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
