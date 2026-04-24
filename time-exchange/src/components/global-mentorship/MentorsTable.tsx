"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { CATEGORY_LABELS, getRegionDefinitionById, type ExpertListing } from "@/lib/mock-data";
import { useAuth } from "@/lib/useAuth";
import {
  formatHourlyRate,
  getListingStatusMeta,
  getVisibleListings,
} from "@/lib/market-selectors";
import { useMarketStore, type SortField } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, getAvatarColor, getInitials } from "@/lib/utils";

interface ColumnHeader {
  key: SortField | "next-slot" | "actions";
  label: string;
  sortable: boolean;
  width: string;
}

const columns: ColumnHeader[] = [
  { key: "name", label: "Expert", sortable: true, width: "flex-[2.2]" },
  { key: "availability", label: "Status", sortable: true, width: "w-32" },
  { key: "rating", label: "Rating", sortable: true, width: "w-24" },
  { key: "sessions", label: "Sessions", sortable: true, width: "w-24" },
  { key: "price", label: "Hourly Ask", sortable: true, width: "w-28" },
  { key: "next-slot", label: "Next Slot", sortable: false, width: "w-36" },
  { key: "actions", label: "", sortable: false, width: "w-32" },
];

export function MentorsTable() {
  const {
    selectedRegion,
    selectedLanguage,
    selectedCategoryId,
    selectedExpertise,
    availabilityFilter,
    searchQuery,
    sortField,
    sortDirection,
    setSort,
  } = useMarketStore();
  const { user, loading } = useAuth();
  const router = useRouter();

  const filteredListings = useMemo(
    () =>
      getVisibleListings(
        {
          selectedRegion,
          selectedLanguage,
          selectedCategoryId,
          selectedExpertise,
          searchQuery,
          availabilityFilter,
        },
        sortField,
        sortDirection
      ),
    [
      selectedRegion,
      selectedLanguage,
      selectedCategoryId,
      selectedExpertise,
      availabilityFilter,
      searchQuery,
      sortField,
      sortDirection,
    ]
  );

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]">
      <div className="flex items-center px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground/85">
        {columns.map((column) => (
          <div
            key={column.key}
            className={cn(
              "flex items-center gap-1.5",
              column.width,
              column.sortable && "cursor-pointer select-none hover:text-foreground"
            )}
            onClick={() =>
              column.sortable &&
              column.key !== "actions" &&
              column.key !== "next-slot" &&
              setSort(column.key as SortField)
            }
          >
            {column.label}
            {column.sortable && column.key !== "actions" && (
              <span className="text-muted-foreground/60">
                {sortField === column.key ? (
                  sortDirection === "asc" ? (
                    <ArrowUp className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDown className="h-3.5 w-3.5" />
                  )
                ) : (
                  <ArrowUpDown className="h-3.5 w-3.5" />
                )}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-3">
        {filteredListings.length > 0 ? (
          filteredListings.map((mentor: ExpertListing, index: number) => {
            const status = getListingStatusMeta(mentor);
            const region = getRegionDefinitionById(mentor.region);

            return (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.015 }}
                className="group mb-2 flex items-center rounded-[1.35rem] border border-border/25 bg-card/30 px-4 py-3 transition-colors hover:border-primary/20 hover:bg-card/55"
              >
                <div className="flex min-w-0 flex-[2.2] items-center gap-3">
                  <div
                    className={cn(
                      "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-xs font-semibold text-white",
                      getAvatarColor(mentor.name)
                    )}
                  >
                    {getInitials(mentor.name)}
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                        status.dotClassName,
                        status.pulse && "animate-pulse-live"
                      )}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-semibold tracking-[-0.02em] text-foreground">
                        {mentor.name}
                      </span>
                      {mentor.verified && (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span>{region?.name}</span>
                      <span>•</span>
                      <span>{mentor.timezone}</span>
                      <span>•</span>
                      <span>{CATEGORY_LABELS[mentor.categoryId]}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {mentor.expertise.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="rounded-full bg-secondary/45 px-2 py-0.5 text-[10px] text-foreground"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-32">
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full text-[10px] uppercase tracking-[0.16em]",
                      status.className
                    )}
                  >
                    <span
                      className={cn(
                        "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
                        status.dotClassName,
                        status.pulse && "animate-pulse-live"
                      )}
                    />
                    {status.label}
                  </Badge>
                </div>

                <div className="flex w-24 items-center gap-1.5 text-sm">
                  <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  <span className="font-medium text-foreground">{mentor.rating}</span>
                </div>

                <div className="w-24 text-sm text-muted-foreground">
                  {mentor.sessionsCompleted}
                </div>

                <div className="w-28 text-sm font-semibold text-primary">
                  {formatHourlyRate(mentor.hourlyRate)}
                </div>

                <div className="flex w-36 items-center gap-1.5 text-sm text-foreground">
                  <Clock3 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{mentor.nextOpenSlot}</span>
                </div>

                <div className="flex w-32 justify-end">
                  <Button
                    size="sm"
                    className={cn(
                      "h-8 rounded-2xl px-3 text-xs opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-105 hover:shadow-lg",
                      mentor.availabilityStatus === "live"
                        ? "bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-emerald-500/25"
                        : "bg-primary text-primary-foreground hover:bg-primary/80 hover:shadow-primary/20"
                    )}
                    disabled={loading}
                    onClick={() => {
                      if (loading) {
                        return;
                      }

                      if (!user) {
                        router.push("/login?redirect=/terminal/spot");
                        return;
                      }
                    }}
                  >
                    {mentor.availabilityStatus === "live" ? "Match" : "Forward"}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="flex h-full min-h-[24rem] flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-foreground">
              No visible listings match the active filters
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Broaden the market scope or clear a filter to reopen depth.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border/20 px-5 py-3 text-xs text-muted-foreground">
        <span>{filteredListings.length} visible listings</span>
        <span>
          Sorted by {sortField} ({sortDirection === "asc" ? "ascending" : "descending"})
        </span>
      </div>
    </div>
  );
}
