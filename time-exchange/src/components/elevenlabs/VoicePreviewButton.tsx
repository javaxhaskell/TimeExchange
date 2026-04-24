"use client";

import { Loader2, Square, Volume2, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useVoicePreview } from "@/lib/useVoicePreview";

interface VoicePreviewButtonProps {
  text: string;
  voiceId?: string;
  label?: string;
  compact?: boolean;
  className?: string;
}

export function VoicePreviewButton({
  text,
  voiceId,
  label = "Play AI Voice Intro",
  compact = false,
  className,
}: VoicePreviewButtonProps) {
  const {
    error,
    isLoading,
    isPlaying,
    play,
    stop,
  } = useVoicePreview();

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Button
        type="button"
        variant="outline"
        size={compact ? "sm" : "default"}
        className={cn(
          "border-primary/15 bg-white/[0.02] text-primary hover:bg-primary/10 hover:text-primary",
          compact ? "h-7 rounded-lg px-2.5 text-[10px]" : "rounded-xl px-3.5"
        )}
        onClick={() => {
          if (isPlaying) {
            stop();
            return;
          }

          void play({ text, voiceId });
        }}
      >
        {isLoading ? (
          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
        ) : isPlaying ? (
          <Square className="mr-1.5 h-3.5 w-3.5" />
        ) : compact ? (
          <Volume2 className="mr-1.5 h-3.5 w-3.5" />
        ) : (
          <Waves className="mr-1.5 h-3.5 w-3.5" />
        )}
        {isLoading ? "Generating..." : isPlaying ? "Stop Preview" : label}
      </Button>

      {error ? (
        <p className="text-[10px] text-rose-300/80">
          {error}
        </p>
      ) : null}
    </div>
  );
}
