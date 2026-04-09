"use client";

import { ArrowUpRight, Bell, Bookmark, Clock3, Zap } from "lucide-react";
import { EXPERT_LISTINGS } from "@/lib/mock-data";
import { useFavoritesStore } from "@/lib/favorites-store";
import { formatHourlyRate } from "@/lib/market-selectors";
import { cn, getAvatarColor, getInitials } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

function FavoriteMentorRow({
  mentor,
  tone,
}: {
  mentor: (typeof EXPERT_LISTINGS)[number];
  tone: "live" | "forward";
}) {
  return (
    <div className="flex items-center gap-3 rounded-[1rem] border border-white/6 bg-white/[0.03] px-3 py-2.5 transition-colors hover:bg-white/[0.05]">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-xs font-semibold text-white",
          getAvatarColor(mentor.name)
        )}
      >
        {getInitials(mentor.name)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-foreground">
            {mentor.name}
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]",
              tone === "live"
                ? "bg-emerald-500/12 text-emerald-200"
                : "bg-sky-500/12 text-sky-200"
            )}
          >
            {tone === "live" ? "Live" : "Forward"}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="truncate">{mentor.expertise[0]}</span>
          <span>•</span>
          <span>{formatHourlyRate(mentor.hourlyRate)}</span>
          <span>•</span>
          <span>{mentor.nextOpenSlot}</span>
        </div>
      </div>

      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/70" />
    </div>
  );
}

export function FavoriteMentorNotifications() {
  const favoriteMentorIds = useFavoritesStore((state) => state.favoriteMentorIds);

  const favoriteMentors = EXPERT_LISTINGS.filter((mentor) =>
    favoriteMentorIds.includes(mentor.id)
  );
  const liveMentors = favoriteMentors.filter(
    (mentor) => mentor.availabilityStatus === "live"
  );
  const forwardMentors = favoriteMentors.filter(
    (mentor) =>
      mentor.supportsForwardOrders && mentor.availabilityStatus !== "live"
  );
  const activeCount = liveMentors.length + forwardMentors.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative inline-flex h-10 w-10 items-center justify-center rounded-[1rem] border border-white/8 bg-white/[0.03] text-muted-foreground transition-all duration-200 hover:bg-white/[0.08] hover:text-foreground hover:border-white/15 hover:scale-105 hover:shadow-[0_0_12px_rgba(133,237,181,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
        <Bell className="h-4 w-4" />
        {activeCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full border border-background bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
            {activeCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="!w-[380px] max-w-[calc(100vw-1rem)] rounded-[1.35rem] border border-white/10 bg-[#0b121b]/96 p-0 text-foreground shadow-[0_22px_60px_rgba(0,0,0,0.42)] backdrop-blur-2xl"
      >
        <div className="px-4 py-3.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/80">
                Favorite Mentors
              </div>
              <div className="mt-1 text-sm text-foreground">
                Live and forward availability for mentors you bookmarked
              </div>
            </div>
            <div className="rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              {activeCount} active
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="mx-0 my-0 bg-white/6" />

        {favoriteMentors.length === 0 ? (
          <div className="px-4 py-5">
            <div className="rounded-[1.1rem] border border-dashed border-white/10 bg-white/[0.025] px-4 py-5 text-center">
              <Bookmark className="mx-auto h-5 w-5 text-muted-foreground/70" />
              <div className="mt-2 text-sm font-medium text-foreground">
                No favorites yet
              </div>
              <div className="mt-1 text-xs leading-5 text-muted-foreground">
                Save mentors from the market cards and this bell will surface the
                ones that are live now or open for forward.
              </div>
            </div>
          </div>
        ) : (
          <ScrollArea className="max-h-[420px]">
            <div className="px-4 py-3">
              <DropdownMenuLabel className="px-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200/85">
                <span className="inline-flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5" />
                  Live Now
                </span>
              </DropdownMenuLabel>

              {liveMentors.length > 0 ? (
                <div className="space-y-2">
                  {liveMentors.map((mentor) => (
                    <FavoriteMentorRow key={mentor.id} mentor={mentor} tone="live" />
                  ))}
                </div>
              ) : (
                <div className="rounded-[1rem] border border-white/6 bg-white/[0.025] px-3 py-3 text-xs text-muted-foreground">
                  None of your favorites are live right now.
                </div>
              )}

              <DropdownMenuLabel className="mt-4 px-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-200/85">
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-3.5 w-3.5" />
                  Open For Forward
                </span>
              </DropdownMenuLabel>

              {forwardMentors.length > 0 ? (
                <div className="space-y-2">
                  {forwardMentors.map((mentor) => (
                    <FavoriteMentorRow
                      key={mentor.id}
                      mentor={mentor}
                      tone="forward"
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-[1rem] border border-white/6 bg-white/[0.025] px-3 py-3 text-xs text-muted-foreground">
                  No saved mentors are currently open for forward booking.
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
