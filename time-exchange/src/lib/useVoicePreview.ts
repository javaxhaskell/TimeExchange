"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface VoicePreviewRequest {
  text: string;
  voiceId?: string;
}

type VoicePreviewStatus = "idle" | "loading" | "playing" | "error";

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unable to generate voice preview right now.";
}

export function useVoicePreview() {
  const [status, setStatus] = useState<VoicePreviewStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestKeyRef = useRef<string | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setStatus("idle");
  }, []);

  const play = useCallback(async ({ text, voiceId }: VoicePreviewRequest) => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      setStatus("error");
      setError("Voice preview text is empty.");
      return;
    }

    const requestKey = JSON.stringify({
      text: trimmedText,
      voiceId: voiceId?.trim() || null,
    });

    try {
      setError(null);

      if (audioUrl && requestKeyRef.current === requestKey) {
        if (!audioRef.current) {
          audioRef.current = new Audio(audioUrl);
        }

        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        setStatus("playing");
        return;
      }

      setStatus("loading");

      const response = await fetch("/api/elevenlabs/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          text: trimmedText,
          voiceId: voiceId?.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;

        throw new Error(
          payload?.error || "Unable to generate voice preview right now."
        );
      }

      const blob = await response.blob();
      const nextAudioUrl = URL.createObjectURL(blob);

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      audioRef.current?.pause();

      const audio = new Audio(nextAudioUrl);
      audio.onended = () => setStatus("idle");
      audio.onerror = () => {
        setStatus("error");
        setError("The generated audio could not be played.");
      };

      audioRef.current = audio;
      requestKeyRef.current = requestKey;
      setAudioUrl(nextAudioUrl);

      await audio.play();
      setStatus("playing");
    } catch (nextError) {
      setStatus("error");
      setError(getErrorMessage(nextError));
    }
  }, [audioUrl]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return {
    status,
    error,
    audioUrl,
    play,
    stop,
    isIdle: status === "idle",
    isLoading: status === "loading",
    isPlaying: status === "playing",
    hasError: status === "error",
  };
}
