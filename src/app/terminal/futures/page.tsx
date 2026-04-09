"use client";

import { FuturesBoard } from "@/components/terminal/FuturesBoard";
import { CandlestickChart } from "@/components/terminal/CandlestickChart";
import { OrderBook } from "@/components/terminal/OrderBook";

export default function FuturesPage() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[linear-gradient(180deg,#060d16_0%,#0a141e_100%)]">
      <div className="flex flex-1 min-h-0">
        {/* Main futures content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <FuturesBoard />
        </div>

        {/* Right sidebar */}
        <div className="hidden w-[320px] flex-shrink-0 flex-col gap-3 border-l border-white/[0.06] p-3 lg:flex">
          <div style={{ height: "280px" }}>
            <CandlestickChart />
          </div>
          <div className="flex-1 min-h-0">
            <OrderBook />
          </div>
        </div>
      </div>
    </div>
  );
}
