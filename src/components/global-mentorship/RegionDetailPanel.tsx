"use client";

import { Clock3, Globe2, PanelRightClose, TimerReset, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { getRegionDefinitionById } from "@/lib/mock-data";
import { getVisibleListings } from "@/lib/market-selectors";
import { useMarketStore } from "@/lib/store";
import { MentorCard } from "./MentorCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function RegionDetailPanel() {
  const {
    selectedRegion,
    setSelectedRegion,
    selectedLanguage,
    selectedCategoryId,
    selectedExpertise,
    availabilityFilter,
    searchQuery,
  } = useMarketStore();

  const region = selectedRegion ? getRegionDefinitionById(selectedRegion) : null;

  const regionListings = useMemo(() => {
    if (!selectedRegion) {
      return [];
    }

    return getVisibleListings({
      selectedRegion,
      selectedLanguage,
      selectedCategoryId,
      selectedExpertise,
      searchQuery,
      availabilityFilter,
    });
  }, [
    selectedRegion,
    selectedLanguage,
    selectedCategoryId,
    selectedExpertise,
    searchQuery,
    availabilityFilter,
  ]);

  const liveCount = regionListings.filter(
    (listing) => listing.availabilityStatus === "live"
  ).length;
  const forwardCount = regionListings.filter(
    (listing) => listing.supportsForwardOrders
  ).length;

  return (
    <AnimatePresence>
      {selectedRegion && region && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", bounce: 0.08, duration: 0.45 }}
          className="absolute bottom-0 right-0 top-0 z-20 flex w-[420px] flex-col border-l border-white/8 bg-background/90 backdrop-blur-2xl"
        >
          <div className="border-b border-border/25 px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80">
                  Regional Market
                </div>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-foreground">
                  {region.name}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Visible depth for spot access and forward slot routing in{" "}
                  {region.timezone}.
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-2xl border border-transparent hover:border-border/50 hover:bg-card/55"
                onClick={() => setSelectedRegion(null)}
              >
                <PanelRightClose className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-border/25 bg-card/35 p-3">
                <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
                  Visible Listings
                </div>
                <div className="mt-1 text-lg font-semibold tracking-[-0.04em] text-foreground">
                  {regionListings.length}
                </div>
              </div>
              <div className="rounded-2xl border border-border/25 bg-card/35 p-3">
                <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
                  Live now
                </div>
                <div className="mt-1 text-lg font-semibold tracking-[-0.04em] text-primary">
                  {liveCount}
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge
                variant="outline"
                className="rounded-full border-emerald-400/20 bg-emerald-500/10 text-[10px] uppercase tracking-[0.18em] text-emerald-100"
              >
                <Zap className="mr-1 h-3 w-3 text-emerald-300" />
                {liveCount} live now
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full border-sky-400/20 bg-sky-500/10 text-[10px] uppercase tracking-[0.18em] text-sky-100"
              >
                <TimerReset className="mr-1 h-3 w-3 text-sky-300" />
                {forwardCount} forward-ready
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full border-border/30 bg-card/40 text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                <Clock3 className="mr-1 h-3 w-3" />
                {region.timezone}
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full border-border/30 bg-card/40 text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                <Globe2 className="mr-1 h-3 w-3" />
                Cross-border coverage
              </Badge>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-3 p-4">
              {regionListings.length > 0 ? (
                regionListings.map((mentor) => (
                  <MentorCard key={mentor.id} mentor={mentor} compact />
                ))
              ) : (
                <div className="flex min-h-[18rem] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-border/25 bg-card/25 px-6 text-center">
                  <p className="text-sm font-medium text-foreground">
                    No visible listings in {region.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    This region currently has no depth under the active market
                    filters. Clear a filter or switch market scope to reopen
                    supply.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-border/25 px-5 py-3 text-[11px] text-muted-foreground">
            Showing {regionListings.length} visible listings in {region.name}.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
