"use client";

import { ChevronDown, Filter, Layers3, X } from "lucide-react";
import { EXPERTISE_MARKETS, getRegionDefinitionById, type AvailabilityStatus } from "@/lib/mock-data";
import { getCategorySummary, getSubcategoriesForCategory } from "@/lib/market-selectors";
import { useMarketStore } from "@/lib/store";
import { ViewToggle } from "./ViewToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const availabilityOptions: {
  key: AvailabilityStatus | "all";
  label: string;
  color: string;
}[] = [
  { key: "all", label: "All listings", color: "" },
  { key: "live", label: "Live now", color: "text-emerald-300" },
  { key: "scheduled", label: "Forward slots", color: "text-sky-300" },
  { key: "offline", label: "Offline", color: "text-zinc-300" },
];

export function ControlBar() {
  const {
    selectedCategoryId,
    setSelectedCategoryId,
    selectedExpertise,
    toggleExpertise,
    clearExpertise,
    selectedLanguage,
    setSelectedLanguage,
    selectedRegion,
    setSelectedRegion,
    availabilityFilter,
    setAvailabilityFilter,
    clearFilters,
  } = useMarketStore();

  const availableSubcategories = getSubcategoriesForCategory(selectedCategoryId);
  const regionName = selectedRegion
    ? getRegionDefinitionById(selectedRegion)?.name ?? selectedRegion
    : null;

  const hasActiveFilters =
    selectedCategoryId !== null ||
    selectedExpertise.length > 0 ||
    selectedLanguage !== null ||
    selectedRegion !== null ||
    availabilityFilter !== null;

  function handleCategoryChange(categoryId: string | null) {
    if (categoryId !== selectedCategoryId && selectedExpertise.length > 0) {
      clearExpertise();
    }
    setSelectedCategoryId(categoryId);
  }

  return (
    <div className="bg-transparent">
      <div className="flex w-full flex-col gap-2.5 px-4 py-3">
        <div className="relative flex items-center gap-3">
          <ViewToggle />

          <div className="relative min-w-0 flex-1">
            <div className="absolute right-0 top-0 bottom-0 z-10 w-10 pointer-events-none bg-gradient-to-l from-card/60 to-transparent" />
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pl-2 pr-10">
            <span className="text-[10px] font-medium uppercase tracking-[0.26em] text-muted-foreground/80">
              Markets
            </span>

            <button
              onClick={() => handleCategoryChange(null)}
              className={cn(
                "rounded-[0.95rem] border px-3 py-1.5 text-xs font-medium transition-colors",
                selectedCategoryId === null
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "border-white/10 bg-white/[0.04] text-muted-foreground hover:text-foreground"
              )}
            >
              All markets
            </button>

            {EXPERTISE_MARKETS.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={cn(
                  "rounded-[0.95rem] border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
                  selectedCategoryId === category.id
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-white/10 bg-white/[0.04] text-muted-foreground hover:text-foreground"
                )}
              >
                {category.label}
              </button>
            ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-9 items-center gap-2 rounded-[0.95rem] border border-white/10 bg-white/[0.04] px-3 text-xs font-medium text-foreground transition-colors hover:bg-white/[0.07]">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    availabilityFilter === "live"
                      ? "bg-emerald-300"
                      : availabilityFilter === "scheduled"
                      ? "bg-sky-300"
                      : "bg-zinc-400"
                  )}
                />
                {availabilityFilter
                  ? availabilityOptions.find((option) => option.key === availabilityFilter)
                      ?.label
                  : "Availability"}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-2xl border-border/50 bg-card/95 p-1.5 backdrop-blur-xl">
                {availabilityOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.key}
                    onClick={() =>
                      setAvailabilityFilter(
                        option.key === "all" ? null : option.key
                      )
                    }
                    className={cn("rounded-xl px-2 py-1.5 text-sm", option.color)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-9 items-center gap-2 rounded-[0.95rem] border border-white/10 bg-white/[0.04] px-3 text-xs font-medium text-foreground transition-colors hover:bg-white/[0.07]">
                <Layers3 className="h-3.5 w-3.5 text-primary" />
                <span className="whitespace-nowrap">
                  {selectedCategoryId
                    ? `${getCategorySummary(selectedCategoryId)} disciplines`
                    : "All disciplines"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-72 rounded-2xl border-border/50 bg-card/95 p-1.5 backdrop-blur-xl">
                {availableSubcategories.map((subcategory) => (
                  <DropdownMenuItem
                    key={subcategory}
                    onClick={() => toggleExpertise(subcategory)}
                    className={cn(
                      "rounded-xl px-2 py-1.5 text-sm",
                      selectedExpertise.includes(subcategory) &&
                        "font-medium text-primary"
                    )}
                  >
                    <span className="flex-1">{subcategory}</span>
                    {selectedExpertise.includes(subcategory) && "✓"}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedCategoryId && (
              <Badge
                variant="secondary"
                className="h-8 rounded-[0.95rem] border border-primary/20 bg-primary/10 px-3 text-[11px] uppercase tracking-[0.18em] text-primary"
              >
                {getCategorySummary(selectedCategoryId)}
              </Badge>
            )}

            {selectedExpertise.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="h-8 cursor-pointer rounded-[0.95rem] border border-primary/15 bg-white/[0.05] px-3 text-xs text-foreground hover:bg-white/[0.08]"
                onClick={() => toggleExpertise(tag)}
              >
                <Filter className="mr-1 h-3 w-3 text-primary" />
                {tag}
                <X className="ml-1 h-3 w-3 text-muted-foreground" />
              </Badge>
            ))}

            {selectedLanguage && (
              <Badge
                variant="secondary"
                className="h-8 cursor-pointer rounded-[0.95rem] border border-sky-400/20 bg-sky-500/10 px-3 text-xs text-sky-100 hover:bg-sky-500/18"
                onClick={() => setSelectedLanguage(null)}
              >
                Language: {selectedLanguage}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            )}

            {regionName && (
              <Badge
                variant="secondary"
                className="h-8 cursor-pointer rounded-[0.95rem] border border-violet-400/20 bg-violet-500/10 px-3 text-xs text-violet-100 hover:bg-violet-500/18"
                onClick={() => setSelectedRegion(null)}
              >
                Region: {regionName}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            )}
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 rounded-[0.95rem] px-3 text-xs text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
              onClick={clearFilters}
            >
              Clear all
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
