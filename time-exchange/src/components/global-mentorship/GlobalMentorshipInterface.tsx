"use client";

import { useMarketStore } from "@/lib/store";
import { useLiveSimulation } from "@/lib/use-live-simulation";
import { TopHeader } from "./TopHeader";
import { ControlBar } from "./ControlBar";
import { MarketStatsBar } from "./MarketStatsBar";
import { LiveTicker } from "./LiveTicker";
import { WorldMapPanel } from "./WorldMapPanel";
import { MentorsTable } from "./MentorsTable";

export function GlobalMentorshipInterface() {
  const { viewMode } = useMarketStore();
  useLiveSimulation();

  return (
    <div className="relative min-h-screen bg-[linear-gradient(180deg,#08111a_0%,#0d1821_100%)]">
      <div className="sticky top-0 z-30">
        <TopHeader />
        <LiveTicker />
      </div>

      <div className="relative z-10 w-full px-4 pb-4 pt-2">
        <div className="mb-2 rounded-[1.35rem] border border-white/8 bg-black/10 px-2 shadow-[0_10px_28px_rgba(0,0,0,0.14)] backdrop-blur-md">
          <MarketStatsBar />
        </div>

        <div className="mb-2 rounded-[1.35rem] border border-white/8 bg-black/10 shadow-[0_10px_28px_rgba(0,0,0,0.14)] backdrop-blur-md">
          <ControlBar />
        </div>

        <div className="relative h-[70vh] overflow-hidden rounded-[1.85rem] border border-white/10 bg-[#0b1620] shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
          {viewMode === "map" ? <WorldMapPanel /> : <MentorsTable />}
        </div>
      </div>
    </div>
  );
}
