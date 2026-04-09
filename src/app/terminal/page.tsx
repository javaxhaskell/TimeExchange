"use client";

import { motion } from "framer-motion";
import { MarketOverviewBar } from "@/components/terminal/MarketOverviewBar";
import { CandlestickChart } from "@/components/terminal/CandlestickChart";
import { OrderBook } from "@/components/terminal/OrderBook";
import { RecentTrades } from "@/components/terminal/RecentTrades";
import { AIRecommendations } from "@/components/terminal/AIRecommendations";
import { MentorQualityPanel } from "@/components/terminal/MentorQualityPanel";
import { SessionIntelligence } from "@/components/terminal/SessionIntelligence";
import { SpotQuickView } from "@/components/terminal/SpotQuickView";

const SECTION_REVEAL = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] },
} as const;

export default function TerminalDashboard() {
  return (
    <div className="min-h-full bg-[linear-gradient(180deg,#060d16_0%,#0a141e_100%)] px-3 pb-10 pt-3">
      <MarketOverviewBar />

      <motion.section
        className="mt-4 space-y-3"
        {...SECTION_REVEAL}
      >
        <div className="flex items-end justify-between gap-3 px-1">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary/70">
              Terminal Overview
            </p>
            <h1 className="mt-2 text-[1.8rem] font-semibold tracking-[-0.06em] text-foreground">
              Live Market Terminal
            </h1>
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px_300px]">
          <div className="h-[min(68vh,640px)] min-h-[460px]">
            <CandlestickChart />
          </div>
          <div className="h-[min(68vh,640px)] min-h-[460px]">
            <OrderBook />
          </div>
          <div className="h-[min(68vh,640px)] min-h-[460px]">
            <RecentTrades />
          </div>
        </div>
      </motion.section>

      <motion.section
        className="mt-10 space-y-4"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.16 }}
        transition={{ duration: 0.48, delay: 0.04, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <motion.div
          className="h-[540px]"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: 0.42, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <AIRecommendations />
        </motion.div>

        <motion.div
          className="h-[360px]"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: 0.42, delay: 0.06, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <SpotQuickView />
        </motion.div>

        <motion.div
          className="h-[320px]"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: 0.42, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <MentorQualityPanel />
        </motion.div>
      </motion.section>

      <motion.section
        className="mt-10"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.14 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <SessionIntelligence />
      </motion.section>
    </div>
  );
}
