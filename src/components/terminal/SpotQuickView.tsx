"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Star, Zap } from "lucide-react";
import { STATIC_EXPERT_LISTINGS } from "@/lib/mock-data";
import { useTerminalStore } from "@/lib/terminal-store";
import { cn, getAvatarColor, getInitials } from "@/lib/utils";
import Link from "next/link";

export function SpotQuickView() {
  const { liveTick: _tick } = useTerminalStore();

  const liveExperts = useMemo(
    () =>
      STATIC_EXPERT_LISTINGS.filter((e) => e.availabilityStatus === "live")
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_tick]
  );

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/[0.06] bg-[#0a1018]/80 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/15">
            <Zap className="h-3 w-3 text-emerald-300" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/90">
            Spot — Live Now
          </span>
        </div>
        <Link
          href="/terminal/spot"
          className="flex items-center gap-1 text-[10px] font-medium text-primary hover:text-primary/80"
        >
          View all
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {liveExperts.map((expert, i) => {
          return (
            <motion.div
              key={expert.id}
              className="flex items-center gap-2.5 border-b border-white/[0.03] px-4 py-2 transition-colors hover:bg-white/[0.02]"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div
                className={cn(
                  "relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[9px] font-bold text-white",
                  getAvatarColor(expert.name)
                )}
              >
                {getInitials(expert.name)}
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-[#0a1018] bg-emerald-400 animate-pulse-live" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="truncate text-[11px] font-medium text-foreground">
                    {expert.name}
                  </span>
                  {expert.verified && (
                    <CheckCircle2 className="h-2.5 w-2.5 shrink-0 text-primary" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                  <span>{expert.expertise[0]}</span>
                  <Star className="h-2 w-2 fill-amber-300 text-amber-300" />
                  <span>{expert.rating}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold text-primary">
                  £{expert.hourlyRate}
                </div>
                <div className="text-[8px] text-emerald-300">LIVE</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
