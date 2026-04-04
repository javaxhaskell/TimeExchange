"use client";

import { Map, Table2 } from "lucide-react";
import { motion } from "framer-motion";
import { useMarketStore, type ViewMode } from "@/lib/store";
import { cn } from "@/lib/utils";

const modes: { key: ViewMode; label: string; icon: React.ReactNode }[] = [
  { key: "map", label: "Map", icon: <Map className="h-4 w-4" /> },
  { key: "table", label: "Table", icon: <Table2 className="h-4 w-4" /> },
];

export function ViewToggle() {
  const { viewMode, setViewMode } = useMarketStore();

  return (
    <div className="relative flex items-center rounded-2xl border border-border/40 bg-card/40 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      {modes.map((mode) => (
        <button
          key={mode.key}
          onClick={() => setViewMode(mode.key)}
          className={cn(
            "relative z-10 flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-sm font-medium transition-colors",
            viewMode === mode.key
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {viewMode === mode.key && (
            <motion.div
              layoutId="viewToggle"
              className="absolute inset-0 rounded-xl bg-primary shadow-[0_8px_26px_rgba(59,232,180,0.2)]"
              transition={{ type: "spring", bounce: 0.14, duration: 0.42 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            {mode.icon}
            {mode.label}
          </span>
        </button>
      ))}
    </div>
  );
}
