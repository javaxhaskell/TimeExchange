"use client";

import { formatHourlyRate, getVisibleListings } from "@/lib/market-selectors";
import { useMarketStore } from "@/lib/store";

export function LiveTicker() {
  const {
    selectedRegion,
    selectedLanguage,
    selectedCategoryId,
    selectedExpertise,
    searchQuery,
    availabilityFilter,
  } = useMarketStore();

  const liveListings = getVisibleListings({
    selectedRegion,
    selectedLanguage,
    selectedCategoryId,
    selectedExpertise,
    searchQuery,
    availabilityFilter,
  }).filter((listing) => listing.availabilityStatus === "live");

  if (liveListings.length === 0) {
    return (
      <div className="relative shrink-0 overflow-hidden border-b border-white/8 bg-black/10">
        <div className="flex w-full items-center px-4 py-2.5">
          <span className="text-sm text-muted-foreground">
            No live spot listings match the current market filters
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-11 shrink-0 items-center overflow-hidden border-b border-white/8 bg-black/20">
      <div className="z-10 flex shrink-0 items-center gap-2 border-r border-white/8 bg-background/60 px-4 py-2.5 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-live" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
          Live
        </span>
      </div>
      <div className="absolute inset-y-0 left-[72px] z-10 w-12 bg-gradient-to-r from-background/60 to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background via-background/80 to-transparent" />
      <div className="flex min-w-0 flex-1 items-center overflow-hidden">
        <div className="flex min-w-0 animate-ticker py-3">
          {liveListings.map((listing) => (
            <span
              key={`a-${listing.id}`}
              className="mx-4 inline-flex items-center gap-2 whitespace-nowrap text-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse-live" />
              <span className="font-medium text-foreground">
                {listing.name}
              </span>
              <span className="text-muted-foreground">
                {listing.expertise[0]} &middot; {formatHourlyRate(listing.hourlyRate)}
              </span>
            </span>
          ))}
          {liveListings.map((listing) => (
            <span
              key={`b-${listing.id}`}
              className="mx-4 inline-flex items-center gap-2 whitespace-nowrap text-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse-live" />
              <span className="font-medium text-foreground">
                {listing.name}
              </span>
              <span className="text-muted-foreground">
                {listing.expertise[0]} &middot; {formatHourlyRate(listing.hourlyRate)}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
