"use client";

import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Bookmark,
  CheckCircle2,
  Clock3,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { CATEGORY_LABELS, type ExpertListing } from "@/lib/mock-data";
import { useFavoritesStore } from "@/lib/favorites-store";
import { useAuth } from "@/lib/useAuth";
import {
  formatHourlyRate,
  getAccessModes,
  getListingStatusMeta,
} from "@/lib/market-selectors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, getAvatarColor, getInitials } from "@/lib/utils";

interface MentorCardProps {
  mentor: ExpertListing;
  compact?: boolean;
  onSelect?: (id: string) => void;
}

export function MentorCard({ mentor, compact, onSelect }: MentorCardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isFavorite = useFavoritesStore((state) => state.isFavoriteMentor(mentor.id));
  const toggleFavoriteMentor = useFavoritesStore(
    (state) => state.toggleFavoriteMentor
  );
  const status = getListingStatusMeta(mentor);
  const accessModes = getAccessModes(mentor);
  const categoryLabel = CATEGORY_LABELS[mentor.categoryId] ?? "Market";

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-border/35 bg-card/45 p-3.5 transition-colors hover:bg-card/70"
        onClick={() => onSelect?.(mentor.id)}
      >
        <div
          className={cn(
            "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-xs font-semibold text-white",
            getAvatarColor(mentor.name)
          )}
        >
          {getInitials(mentor.name)}
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
              status.dotClassName,
              status.pulse && "animate-pulse-live"
            )}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold tracking-[-0.02em] text-foreground">
              {mentor.name}
            </span>
            {mentor.verified && (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>{mentor.expertise[0]}</span>
            <span>•</span>
            <span>{formatHourlyRate(mentor.hourlyRate)}</span>
          </div>
        </div>

        <Badge
          variant="outline"
          className={cn("shrink-0 text-[10px] uppercase tracking-[0.16em]", status.className)}
        >
          {status.shortLabel}
        </Badge>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="group relative cursor-pointer rounded-[1.4rem] border border-border/35 bg-card/55 p-4 backdrop-blur-sm transition-all hover:border-primary/25 hover:bg-card/75"
      onClick={() => onSelect?.(mentor.id)}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-semibold text-white",
            getAvatarColor(mentor.name)
          )}
        >
          {getInitials(mentor.name)}
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card",
              status.dotClassName,
              status.pulse && "animate-pulse-live"
            )}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-primary/15 bg-primary/10 text-[10px] uppercase tracking-[0.2em] text-primary"
            >
              {categoryLabel}
            </Badge>
            {accessModes.map((mode) => (
              <Badge
                key={mode}
                variant="outline"
                className="border-border/40 bg-card/45 text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
              >
                {mode}
              </Badge>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <h3 className="truncate text-sm font-semibold tracking-[-0.03em] text-foreground">
              {mentor.name}
            </h3>
            {mentor.verified && (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
            )}
          </div>

          <p className="mt-1 text-xs text-foreground/90">{mentor.headline}</p>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {mentor.bio}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {mentor.expertise.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-full bg-secondary/55 px-2 py-1 text-[10px] text-foreground"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-white/6 bg-background/30 p-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
            Hourly Ask
          </div>
          <div className="mt-1 text-sm font-semibold tracking-[-0.03em] text-primary">
            {formatHourlyRate(mentor.hourlyRate)}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
            Next Slot
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
            <Clock3 className="h-3.5 w-3.5 text-muted-foreground" />
            {mentor.nextOpenSlot}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
            Status
          </div>
          <Badge
            variant="outline"
            className={cn(
              "mt-1 rounded-full text-[10px] uppercase tracking-[0.16em]",
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
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
            Track Record
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
              {mentor.rating}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {mentor.sessionsCompleted} sessions
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 pt-1">
        <div className="text-[11px] text-muted-foreground">
          Response window {mentor.responseTime}
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-2xl border transition-all hover:border-border/50 hover:bg-card/60",
              isFavorite
                ? "border-primary/20 bg-primary/10 text-primary opacity-100"
                : "border-transparent opacity-0 group-hover:opacity-100"
            )}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavoriteMentor(mentor.id);
            }}
          >
            <Bookmark
              className={cn("h-3.5 w-3.5", isFavorite && "fill-current")}
            />
          </Button>
          <Button
            size="sm"
            className={cn(
              "h-8 rounded-2xl px-3.5 text-xs transition-all duration-200 hover:scale-105 hover:shadow-lg",
              mentor.availabilityStatus === "live"
                ? "bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-emerald-500/25"
                : "bg-primary text-primary-foreground hover:bg-primary/80 hover:shadow-primary/20"
            )}
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              if (loading) {
                return;
              }

              if (!user) {
                router.push("/login?redirect=/terminal/spot");
                return;
              }
            }}
          >
            {mentor.availabilityStatus === "live" ? "Match Live" : "Queue Forward"}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
