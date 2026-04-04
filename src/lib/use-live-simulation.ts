"use client";

import { useEffect } from "react";
import { EXPERT_LISTINGS, type AvailabilityStatus } from "@/lib/mock-data";
import { useMarketStore } from "@/lib/store";

const STATUSES: AvailabilityStatus[] = ["live", "scheduled", "offline"];
const INTERVAL_MS = 3_500;
const CHANGE_COUNT = 3; // how many experts flip per tick

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Periodically toggles random experts' availability status
 * to simulate a live marketplace. Mutates EXPERT_LISTINGS in place
 * and bumps the store tick so all consumers re-render.
 */
export function useLiveSimulation() {
  const bumpSimulation = useMarketStore((s) => s.bumpSimulation);

  useEffect(() => {
    const id = setInterval(() => {
      const indices = new Set<number>();
      while (indices.size < Math.min(CHANGE_COUNT, EXPERT_LISTINGS.length)) {
        indices.add(Math.floor(Math.random() * EXPERT_LISTINGS.length));
      }

      for (const idx of indices) {
        const expert = EXPERT_LISTINGS[idx];
        // Pick a different status than current
        const otherStatuses = STATUSES.filter((s) => s !== expert.availabilityStatus);
        expert.availabilityStatus = pickRandom(otherStatuses);
      }

      bumpSimulation();
    }, INTERVAL_MS);

    return () => clearInterval(id);
  }, [bumpSimulation]);
}
