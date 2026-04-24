"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  Minus,
  Shield,
  Star,
  TrendingUp,
} from "lucide-react";
import { STATIC_EXPERT_LISTINGS, CATEGORY_LABELS } from "@/lib/mock-data";
import { getQualityMetrics } from "@/lib/seed-market-data";
import { cn, getAvatarColor, getInitials } from "@/lib/utils";

const TREND_META = {
  improving: { icon: TrendingUp, color: "text-emerald-400", label: "Improving" },
  stable: { icon: Minus, color: "text-amber-300", label: "Stable" },
  declining: { icon: ArrowDown, color: "text-red-400", label: "Declining" },
};

export function MentorQualityPanel() {
  const metrics = useMemo(() => {
    const all = getQualityMetrics();
    return [...all]
      .sort(
        (a, b) =>
          b.averageRating * b.completionRate -
          a.averageRating * a.completionRate
      )
      .slice(0, 12);
  }, []);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/[0.06] bg-[#0a1018]/80 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/15">
            <Shield className="h-3 w-3 text-emerald-300" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/90">
            Mentor Quality Index
          </span>
        </div>
        <span className="text-[9px] text-muted-foreground">
          Explainable quality signals
        </span>
      </div>

      {/* Column labels */}
      <div className="grid grid-cols-[1fr_60px_60px_60px_60px_60px] gap-1 px-4 py-1.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/50">
        <span>Mentor</span>
        <span className="text-center">Rating</span>
        <span className="text-center">Complete</span>
        <span className="text-center">Repeat</span>
        <span className="text-center">Dispute</span>
        <span className="text-center">Trend</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {metrics.map((m, i) => {
          const mentor = STATIC_EXPERT_LISTINGS.find((e) => e.id === m.mentorId);
          if (!mentor) return null;
          const trend = TREND_META[m.recentTrend];

          return (
            <motion.div
              key={m.mentorId}
              className="grid grid-cols-[1fr_60px_60px_60px_60px_60px] items-center gap-1 border-b border-white/[0.02] px-4 py-2 hover:bg-white/[0.02]"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              {/* Mentor */}
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-[8px] font-bold text-white",
                    getAvatarColor(mentor.name)
                  )}
                >
                  {getInitials(mentor.name)}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[10px] font-medium text-foreground">
                    {mentor.name}
                  </div>
                  <div className="text-[8px] text-muted-foreground">
                    {CATEGORY_LABELS[m.categoryId]} · {m.totalSessions} sessions
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center gap-0.5">
                <Star className="h-2.5 w-2.5 fill-amber-300 text-amber-300" />
                <span className="text-[10px] font-semibold text-foreground">
                  {m.averageRating.toFixed(1)}
                </span>
              </div>

              {/* Completion */}
              <div className="text-center">
                <span
                  className={cn(
                    "text-[10px] font-semibold",
                    m.completionRate >= 0.95
                      ? "text-emerald-400"
                      : m.completionRate >= 0.85
                        ? "text-foreground"
                        : "text-amber-300"
                  )}
                >
                  {Math.round(m.completionRate * 100)}%
                </span>
              </div>

              {/* Repeat */}
              <div className="text-center">
                <span className="text-[10px] font-medium text-foreground">
                  {Math.round(m.repeatBookingRate * 100)}%
                </span>
              </div>

              {/* Dispute */}
              <div className="text-center">
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    m.disputeRate <= 0.01
                      ? "text-emerald-400"
                      : m.disputeRate <= 0.03
                        ? "text-foreground"
                        : "text-red-400"
                  )}
                >
                  {(m.disputeRate * 100).toFixed(1)}%
                </span>
              </div>

              {/* Trend */}
              <div className="flex items-center justify-center gap-0.5">
                <trend.icon className={cn("h-3 w-3", trend.color)} />
                <span className={cn("text-[8px] font-medium", trend.color)}>
                  {trend.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
