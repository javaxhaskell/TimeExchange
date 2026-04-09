"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Star,
  Zap,
} from "lucide-react";
import { STATIC_EXPERT_LISTINGS, EXPERTISE_MARKETS } from "@/lib/mock-data";
import { getListingStatusMeta } from "@/lib/market-selectors";
import { getMentorQuality } from "@/lib/seed-market-data";
import { useTerminalStore } from "@/lib/terminal-store";
import { cn, getAvatarColor, getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type SortKey = "price" | "rating" | "response" | "sessions";

export function SpotMentors() {
  const { selectedMarket, setSelectedMarket, liveTick: _tick } = useTerminalStore();
  const [sortBy, setSortBy] = useState<SortKey>("rating");

  const mentors = useMemo(() => {
    const filtered = STATIC_EXPERT_LISTINGS.filter(
      (e) =>
        (selectedMarket === "all" || e.categoryId === selectedMarket) &&
        (e.availabilityStatus === "live" || e.supportsInstant)
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.hourlyRate - b.hourlyRate;
        case "rating":
          return b.rating - a.rating;
        case "sessions":
          return b.sessionsCompleted - a.sessionsCompleted;
        case "response":
          return (
            parseInt(a.responseTime) - parseInt(b.responseTime)
          );
        default:
          return 0;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMarket, sortBy, _tick]);

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15">
            <Zap className="h-3.5 w-3.5 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-[13px] font-bold text-foreground">
              Spot Market — Available Now
            </h2>
            <p className="text-[10px] text-muted-foreground">
              {mentors.length} mentors available for instant sessions
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

          <div className="flex items-center rounded-lg border border-white/[0.06] bg-white/[0.02]">
            {(["rating", "price", "response", "sessions"] as SortKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={cn(
                  "px-2.5 py-1.5 text-[10px] font-medium capitalize transition-colors",
                  sortBy === key
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mentors grid */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {mentors.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No mentors available in this market right now
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {mentors.map((mentor, i) => {
              const status = getListingStatusMeta(mentor);
              const quality = getMentorQuality(mentor.id);

              return (
                <motion.div
                  key={mentor.id}
                  className="group rounded-2xl border border-white/[0.06] bg-[#0c1520]/60 p-4 transition-all hover:border-primary/20 hover:bg-[#0c1520]/90"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  {/* Top row */}
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white",
                        getAvatarColor(mentor.name)
                      )}
                    >
                      {getInitials(mentor.name)}
                      <span
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0c1520]",
                          status.dotClassName,
                          status.pulse && "animate-pulse-live"
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-[12px] font-semibold text-foreground">
                          {mentor.name}
                        </span>
                        {mentor.verified && (
                          <CheckCircle2 className="h-3 w-3 shrink-0 text-primary" />
                        )}
                      </div>
                      <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-1">
                        {mentor.headline}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "shrink-0 text-[8px] uppercase tracking-[0.14em]",
                        status.className
                      )}
                    >
                      {status.shortLabel}
                    </Badge>
                  </div>

                  {/* Tags */}
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {mentor.expertise.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats row */}
                  <div className="mt-3 grid grid-cols-4 gap-2 rounded-xl border border-white/[0.04] bg-white/[0.015] p-2">
                    <div className="text-center">
                      <div className="text-[9px] text-muted-foreground">Ask</div>
                      <div className="mt-0.5 text-[11px] font-bold text-primary">
                        £{mentor.hourlyRate}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[9px] text-muted-foreground">Rating</div>
                      <div className="mt-0.5 flex items-center justify-center gap-0.5">
                        <Star className="h-2.5 w-2.5 fill-amber-300 text-amber-300" />
                        <span className="text-[11px] font-semibold text-foreground">
                          {mentor.rating}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[9px] text-muted-foreground">Speed</div>
                      <div className="mt-0.5 text-[11px] font-medium text-foreground">
                        {mentor.responseTime}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[9px] text-muted-foreground">Quality</div>
                      <div className="mt-0.5 text-[11px] font-medium text-foreground">
                        {quality
                          ? `${Math.round(quality.completionRate * 100)}%`
                          : "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock3 className="h-3 w-3" />
                      Next: {mentor.nextOpenSlot}
                    </div>
                    <Button
                      size="sm"
                      className="h-7 rounded-lg bg-emerald-600 px-3 text-[10px] font-semibold text-white hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20"
                    >
                      Match Now
                      <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
