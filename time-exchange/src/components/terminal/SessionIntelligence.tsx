"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  CheckCircle,
  Eye,
  FileText,
  Lock,
  Shield,
  Sparkles,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConsentOption {
  id: string;
  label: string;
  description: string;
  icon: typeof Brain;
  enabled: boolean;
}

export function SessionIntelligence() {
  const [consents, setConsents] = useState<ConsentOption[]>([
    {
      id: "transcript_analysis",
      label: "Session Transcript Analysis",
      description:
        "AI analyses session transcripts to extract key topics and insights. Data is processed securely and never shared.",
      icon: FileText,
      enabled: false,
    },
    {
      id: "topic_extraction",
      label: "Topic Extraction & Tagging",
      description:
        "Automatically tag sessions with discussed topics to improve future mentor matching and recommendations.",
      icon: Tag,
      enabled: false,
    },
    {
      id: "quality_assessment",
      label: "Delivery Quality Signals",
      description:
        "Generate assistive quality metrics from session outcomes to help the matching engine improve over time.",
      icon: Sparkles,
      enabled: false,
    },
  ]);

  function toggleConsent(id: string) {
    setConsents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  }

  const enabledCount = consents.filter((c) => c.enabled).length;

  return (
    <div className="flex flex-col rounded-2xl border border-white/[0.06] bg-[#0a1018]/80 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/15">
            <Shield className="h-3.5 w-3.5 text-amber-300" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/90">
              Session Intelligence
            </span>
            <span className="ml-2 text-[9px] text-muted-foreground">
              Opt-in AI features
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-md bg-white/[0.04] px-2 py-0.5">
          <Lock className="h-2.5 w-2.5 text-amber-300" />
          <span className="text-[9px] text-amber-300">
            {enabledCount}/{consents.length} active
          </span>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="mx-4 mt-3 rounded-xl border border-amber-500/10 bg-amber-500/[0.03] px-3 py-2.5">
        <div className="flex items-start gap-2">
          <Eye className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300/70" />
          <div>
            <p className="text-[10px] font-medium text-amber-200/80">
              Your data, your choice
            </p>
            <p className="mt-0.5 text-[9px] text-amber-200/50 leading-relaxed">
              Session intelligence features are entirely opt-in. No session data
              is ever analysed without your explicit consent. You can enable or
              disable each feature at any time. All processing is transparent
              and explainable.
            </p>
          </div>
        </div>
      </div>

      {/* Consent toggles */}
      <div className="space-y-2.5 p-4">
        {consents.map((consent) => (
          <motion.div
            key={consent.id}
            className={cn(
              "rounded-xl border p-3.5 transition-all",
              consent.enabled
                ? "border-primary/20 bg-primary/[0.04]"
                : "border-white/[0.06] bg-white/[0.015]"
            )}
            whileHover={{ scale: 1.005 }}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                  consent.enabled
                    ? "bg-primary/15 text-primary"
                    : "bg-white/[0.04] text-muted-foreground"
                )}
              >
                <consent.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-foreground">
                    {consent.label}
                  </span>
                  <button
                    onClick={() => toggleConsent(consent.id)}
                    className={cn(
                      "relative h-5 w-9 rounded-full transition-colors",
                      consent.enabled ? "bg-primary" : "bg-white/[0.1]"
                    )}
                  >
                    <motion.div
                      className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
                      animate={{ left: consent.enabled ? 18 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
                <p className="mt-1 text-[9px] leading-relaxed text-muted-foreground">
                  {consent.description}
                </p>
                {consent.enabled && (
                  <motion.div
                    className="mt-2 flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <CheckCircle className="h-2.5 w-2.5 text-primary" />
                    <span className="text-[8px] font-medium text-primary">
                      Active — data will be processed
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
