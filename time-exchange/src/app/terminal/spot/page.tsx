"use client";

import { SpotMentors } from "@/components/terminal/SpotMentors";
import { OrderBook } from "@/components/terminal/OrderBook";
import { AIRecommendations } from "@/components/terminal/AIRecommendations";

export default function SpotPage() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[linear-gradient(180deg,#060d16_0%,#0a141e_100%)]">
      <div className="flex flex-1 min-h-0">
        {/* Main spot content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <SpotMentors />
        </div>

        {/* Right sidebar */}
        <div className="hidden w-[300px] flex-shrink-0 flex-col gap-3 border-l border-white/[0.06] p-3 lg:flex">
          <div className="flex-1 min-h-0">
            <OrderBook />
          </div>
          <div className="flex-1 min-h-0">
            <AIRecommendations />
          </div>
        </div>
      </div>
    </div>
  );
}
