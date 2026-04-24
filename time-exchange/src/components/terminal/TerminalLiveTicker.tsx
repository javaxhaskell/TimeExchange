"use client";

import { STATIC_EXPERT_LISTINGS } from "@/lib/mock-data";
import { formatHourlyRate } from "@/lib/market-selectors";
import { cn } from "@/lib/utils";

export function TerminalLiveTicker() {
  const live = STATIC_EXPERT_LISTINGS.filter((e) => e.availabilityStatus === "live");
  const items = live.length > 0 ? live : STATIC_EXPERT_LISTINGS.slice(0, 8);

  return (
    <div
      className="relative flex h-8 items-center overflow-hidden border-t border-white/[0.04] bg-black/20"
    >
      <div className="z-10 flex shrink-0 items-center gap-1.5 border-r border-white/[0.06] bg-[#080f19]/80 px-3 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-live" />
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-300/80">
          Live
        </span>
      </div>
      <div className="absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#060d16] to-transparent" />
      <div className="flex min-w-0 flex-1 items-center overflow-hidden">
        <div
          className="flex animate-terminal-ticker items-center"
          style={{ animationDuration: "720s" }}
        >
          {[...items, ...items].map((expert, i) => (
            <span
              key={`${expert.id}-${i}`}
              className="mx-3 inline-flex items-center gap-1.5 whitespace-nowrap text-[11px]"
            >
              <span
                className={cn(
                  "h-1 w-1 rounded-full",
                  expert.availabilityStatus === "live"
                    ? "bg-emerald-400"
                    : "bg-sky-400"
                )}
              />
              <span className="font-medium text-foreground/90">
                {expert.name}
              </span>
              <span className="text-muted-foreground">
                {expert.expertise[0]}
              </span>
              <span className="font-semibold text-primary">
                {formatHourlyRate(expert.hourlyRate)}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
