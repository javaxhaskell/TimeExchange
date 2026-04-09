"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  Globe,
  Loader2,
  Shield,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";
import { CATEGORY_LABELS, type ExpertListing } from "@/lib/mock-data";
import { getMentorQuality } from "@/lib/seed-market-data";
import { useTradeStore, type ExecutedTrade } from "@/lib/trade-store";
import { cn, getAvatarColor, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TradeConfirmationDialogProps {
  mentor: ExpertListing;
  open: boolean;
  onClose: () => void;
}

const DURATION_OPTIONS = [30, 45, 60, 90];

export function TradeConfirmationDialog({
  mentor,
  open,
  onClose,
}: TradeConfirmationDialogProps) {
  const [duration, setDuration] = useState(60);
  const [executing, setExecuting] = useState(false);
  const [executed, setExecuted] = useState(false);
  const addTrade = useTradeStore((s) => s.addTrade);

  const quality = getMentorQuality(mentor.id);
  const totalCost = Math.round((mentor.hourlyRate / 60) * duration * 100) / 100;
  const categoryLabel = CATEGORY_LABELS[mentor.categoryId] ?? "Market";

  function handleExecute() {
    setExecuting(true);

    // Simulate a brief network delay for realism
    setTimeout(() => {
      const trade: ExecutedTrade = {
        id: `trade-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        mentorId: mentor.id,
        mentorName: mentor.name,
        categoryId: mentor.categoryId,
        expertise: mentor.expertise.slice(0, 3),
        price: mentor.hourlyRate,
        durationMinutes: duration,
        executedAt: new Date().toISOString(),
        orderType: "spot",
      };

      addTrade(trade);
      setExecuting(false);
      setExecuted(true);
    }, 1200);
  }

  function handleClose() {
    setExecuted(false);
    setExecuting(false);
    setDuration(60);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Dialog */}
          <motion.div
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c1520] shadow-[0_25px_65px_rgba(0,0,0,0.5)]">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>

              {executed ? (
                /* ── Success state ── */
                <div className="p-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 15,
                      delay: 0.1,
                    }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15"
                  >
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-foreground">
                    Trade Executed
                  </h3>
                  <p className="mt-1.5 text-[12px] text-muted-foreground">
                    Your spot session with{" "}
                    <span className="font-semibold text-foreground">
                      {mentor.name}
                    </span>{" "}
                    has been matched successfully.
                  </p>

                  <div className="mt-4 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] p-3">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                          Rate
                        </div>
                        <div className="mt-0.5 text-[13px] font-bold text-primary">
                          £{mentor.hourlyRate}/hr
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                          Duration
                        </div>
                        <div className="mt-0.5 text-[13px] font-bold text-foreground">
                          {duration} min
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                          Total
                        </div>
                        <div className="mt-0.5 text-[13px] font-bold text-emerald-400">
                          £{totalCost.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="mt-5 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleClose}
                  >
                    Done
                  </Button>
                </div>
              ) : (
                /* ── Confirmation state ── */
                <>
                  {/* Header */}
                  <div className="border-b border-white/[0.06] px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/15">
                        <Zap className="h-3.5 w-3.5 text-emerald-300" />
                      </div>
                      <h3 className="text-[14px] font-bold text-foreground">
                        Confirm Spot Trade
                      </h3>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Review the details below before executing
                    </p>
                  </div>

                  {/* Mentor info */}
                  <div className="px-5 pt-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-white",
                          getAvatarColor(mentor.name)
                        )}
                      >
                        {getInitials(mentor.name)}
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0c1520] bg-emerald-400 animate-pulse-live" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[14px] font-semibold text-foreground">
                            {mentor.name}
                          </span>
                          {mentor.verified && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {mentor.headline}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                        {categoryLabel}
                      </span>
                      {mentor.expertise.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Trade details */}
                  <div className="mt-4 px-5">
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                            Hourly Rate
                          </div>
                          <div className="mt-1 text-[15px] font-bold text-primary">
                            £{mentor.hourlyRate}/hr
                          </div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                            Rating
                          </div>
                          <div className="mt-1 flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                            <span className="text-[15px] font-bold text-foreground">
                              {mentor.rating}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              ({mentor.sessionsCompleted} sessions)
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                            Response Time
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-[12px] text-foreground">
                            <Clock3 className="h-3 w-3 text-muted-foreground" />
                            {mentor.responseTime}
                          </div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                            Next Available
                          </div>
                          <div className="mt-1 text-[12px] text-foreground">
                            {mentor.nextOpenSlot}
                          </div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                            Region
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-[12px] text-foreground">
                            <Globe className="h-3 w-3 text-muted-foreground" />
                            {mentor.timezone}
                          </div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                            Quality Score
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-[12px] text-foreground">
                            <Shield className="h-3 w-3 text-emerald-400" />
                            {quality
                              ? `${Math.round(quality.completionRate * 100)}% completion`
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Duration selector */}
                  <div className="mt-4 px-5">
                    <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Session Duration
                    </div>
                    <div className="mt-2 flex gap-2">
                      {DURATION_OPTIONS.map((d) => (
                        <button
                          key={d}
                          onClick={() => setDuration(d)}
                          className={cn(
                            "flex-1 rounded-lg border py-2 text-center text-[12px] font-semibold transition-all",
                            duration === d
                              ? "border-primary/30 bg-primary/10 text-primary"
                              : "border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                          )}
                        >
                          {d} min
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Total cost */}
                  <div className="mt-4 mx-5 rounded-xl border border-primary/15 bg-primary/[0.04] p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                          Estimated Total
                        </div>
                        <div className="mt-0.5 text-[10px] text-muted-foreground">
                          £{mentor.hourlyRate}/hr × {duration} min
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[20px] font-bold text-primary">
                          £{totalCost.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Execute button */}
                  <div className="p-5">
                    <Button
                      className="w-full h-11 rounded-xl bg-emerald-600 text-[13px] font-bold text-white hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-60"
                      disabled={executing}
                      onClick={handleExecute}
                    >
                      {executing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Executing Trade...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Execute Trade — £{totalCost.toFixed(2)}
                        </>
                      )}
                    </Button>
                    <p className="mt-2 text-center text-[9px] text-muted-foreground">
                      By executing, you agree to match with this mentor at the
                      listed rate for the selected duration.
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
