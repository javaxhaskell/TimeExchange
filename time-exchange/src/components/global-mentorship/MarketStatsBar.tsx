"use client";

import { Globe2, TimerReset, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import {
  getForwardReadyCount,
  getVisibleListings,
  getVisibleRegionSummaries,
} from "@/lib/market-selectors";
import { useMarketStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function MarketStatsBar() {
  const {
    selectedRegion,
    selectedLanguage,
    selectedCategoryId,
    selectedExpertise,
    searchQuery,
    availabilityFilter,
  } = useMarketStore();

  const filters = {
    selectedRegion,
    selectedLanguage,
    selectedCategoryId,
    selectedExpertise,
    searchQuery,
    availabilityFilter,
  };

  const visibleListings = getVisibleListings(filters);
  const visibleRegions = getVisibleRegionSummaries(filters).filter(
    (region) => region.expertCount > 0
  );

  const stats = [
    {
      label: "Total experts",
      value: visibleListings.length,
      icon: Users,
      color: "text-slate-300",
      bgColor: "bg-slate-500/10",
    },
    {
      label: "Live now",
      value: visibleListings.filter((listing) => listing.availabilityStatus === "live")
        .length,
      icon: Zap,
      color: "text-emerald-300",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Forward-ready",
      value: getForwardReadyCount(visibleListings),
      icon: TimerReset,
      color: "text-sky-300",
      bgColor: "bg-sky-500/10",
    },
    {
      label: "Active regions",
      value: visibleRegions.length,
      icon: Globe2,
      color: "text-violet-300",
      bgColor: "bg-violet-500/10",
    },
  ];

  return (
    <div className="grid w-full gap-0 md:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={cn(
            "flex items-center gap-3 px-4 py-3",
            index < stats.length - 1 && "border-b border-white/8 md:border-b-0 md:border-r"
          )}
        >
          <div className={`rounded-[0.95rem] p-2.5 ${stat.bgColor}`}>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/75">
              {stat.label}
            </span>
            <span className="mt-1 text-[1.02rem] font-semibold tracking-[-0.04em] text-foreground">
              {stat.value}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
