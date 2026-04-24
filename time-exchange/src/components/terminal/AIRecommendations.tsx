"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ChevronRight,
  Crown,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { STATIC_EXPERT_LISTINGS } from "@/lib/mock-data";
import { getDiversifiedRecommendations } from "@/lib/ai-matching";
import { formatHourlyRate, getListingStatusMeta } from "@/lib/market-selectors";
import { useTerminalStore } from "@/lib/terminal-store";
import { cn, getAvatarColor, getInitials } from "@/lib/utils";
import type { MatchScore } from "@/types/market";

const MATCH_TYPE_META: Record<
  MatchScore["matchType"],
  { label: string; icon: typeof Zap; color: string; bgColor: string }
> = {
  best_match: {
    label: "Best Match",
    icon: Sparkles,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  best_value: {
    label: "Best Value",
    icon: TrendingUp,
    color: "text-amber-300",
    bgColor: "bg-amber-500/10",
  },
  fastest_fill: {
    label: "Fastest Fill",
    icon: Zap,
    color: "text-emerald-300",
    bgColor: "bg-emerald-500/10",
  },
  highest_rated: {
    label: "Highest Rated",
    icon: Crown,
    color: "text-violet-300",
    bgColor: "bg-violet-500/10",
  },
  rising_star: {
    label: "Rising Star",
    icon: Star,
    color: "text-sky-300",
    bgColor: "bg-sky-500/10",
  },
};

function ScoreBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 text-[9px] text-muted-foreground">{label}</span>
      <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <span className="w-6 text-right text-[9px] font-mono text-foreground/70">
        {value}
      </span>
    </div>
  );
}

export function AIRecommendations() {
  const { selectedMarket } = useTerminalStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const recommendations = useMemo(
    () =>
      getDiversifiedRecommendations({
        userId: "current-user",
        categoryId: selectedMarket,
        preferInstant: true,
      }),
    [selectedMarket]
  );

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/[0.06] bg-[#0a1018]/80 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-violet-500/15">
            <Brain className="h-3 w-3 text-violet-300" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/90">
            AI Recommendations
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-md bg-violet-500/10 px-2 py-0.5">
          <Sparkles className="h-2.5 w-2.5 text-violet-300" />
          <span className="text-[9px] font-semibold text-violet-300">
            {recommendations.length} matches
          </span>
        </div>
      </div>

      {/* Recommendations list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {recommendations.map((match, i) => {
          const mentor = STATIC_EXPERT_LISTINGS.find((e) => e.id === match.mentorId);
          if (!mentor) return null;

          const meta = MATCH_TYPE_META[match.matchType];
          const status = getListingStatusMeta(mentor);
          const isExpanded = expandedId === match.mentorId;

          return (
            <motion.div
              key={match.mentorId}
              className="border-b border-white/[0.03] px-3 py-2.5 transition-colors hover:bg-white/[0.02]"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <button
                className="flex w-full items-center gap-2.5 text-left"
                onClick={() =>
                  setExpandedId(isExpanded ? null : match.mentorId)
                }
              >
                {/* Rank */}
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/[0.04] text-[10px] font-bold text-muted-foreground">
                  {i + 1}
                </div>

                {/* Avatar */}
                <div
                  className={cn(
                    "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[10px] font-semibold text-white",
                    getAvatarColor(mentor.name)
                  )}
                >
                  {getInitials(mentor.name)}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-[#0a1018]",
                      status.dotClassName,
                      status.pulse && "animate-pulse-live"
                    )}
                  />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-[11px] font-semibold text-foreground">
                      {mentor.name}
                    </span>
                    <div
                      className={cn(
                        "flex items-center gap-0.5 rounded px-1 py-0.5 text-[8px] font-bold uppercase",
                        meta.bgColor,
                        meta.color
                      )}
                    >
                      <meta.icon className="h-2 w-2" />
                      {meta.label}
                    </div>
                  </div>
                  <div className="mt-0.5 text-[9px] text-muted-foreground line-clamp-1">
                    {match.reason}
                  </div>
                </div>

                {/* Score + expand */}
                <div className="flex items-center gap-1.5">
                  <div className="text-right">
                    <div className="text-[12px] font-bold text-primary">
                      {match.overallScore}
                    </div>
                    <div className="text-[8px] text-muted-foreground">score</div>
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-3 w-3 text-muted-foreground transition-transform",
                      isExpanded && "rotate-90"
                    )}
                  />
                </div>
              </button>

              {/* Expanded breakdown */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2.5 rounded-xl border border-white/[0.04] bg-white/[0.015] p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Score Breakdown
                        </span>
                        <span className="text-[9px] text-muted-foreground">
                          Confidence: {(match.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <ScoreBar value={match.breakdown.topicFit} label="Topic fit" />
                        <ScoreBar value={match.breakdown.availabilityFit} label="Availability" />
                        <ScoreBar value={match.breakdown.mentorRating} label="Rating" />
                        <ScoreBar value={match.breakdown.priceFit} label="Price fit" />
                        <ScoreBar value={match.breakdown.responseSpeed} label="Speed" />
                        <ScoreBar value={match.breakdown.fulfillmentQuality} label="Fulfillment" />
                        <ScoreBar value={match.breakdown.languageFit} label="Language" />
                        <ScoreBar value={match.breakdown.timezoneFit} label="Timezone" />
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-primary">
                          {formatHourlyRate(mentor.hourlyRate)}
                        </span>
                        <button className="rounded-lg bg-primary/15 px-3 py-1 text-[10px] font-semibold text-primary transition-colors hover:bg-primary/25">
                          Match Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
