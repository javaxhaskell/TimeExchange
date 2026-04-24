"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Sparkles, Volume2, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVoicePreview } from "@/lib/useVoicePreview";

const DEFAULT_DEMO_TEXT =
  "Hi, I’m James Whitfield. I can help you with quantitative research and trading systems. Book a live session through TimeExchange.";

export default function ElevenLabsDemoPage() {
  const [text, setText] = useState(DEFAULT_DEMO_TEXT);
  const [voiceId, setVoiceId] = useState("");
  const {
    audioUrl,
    error,
    isLoading,
    isPlaying,
    play,
    stop,
  } = useVoicePreview();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#050b13_0%,#09121d_100%)] px-4 py-10 text-foreground">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="overflow-hidden rounded-[1.8rem] border border-white/[0.08] bg-[#0b1520]/85 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl">
          <div className="border-b border-white/[0.06] px-6 py-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Volume2 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/70">
                  Voice AI powered by ElevenLabs
                </p>
                <h1 className="text-3xl font-semibold tracking-[-0.05em] text-foreground">
                  ElevenLabs Voice AI Integration
                </h1>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
              TimeExchange uses ElevenLabs to generate clean mentor voice previews and
              AI-assisted spoken experiences without exposing API keys to the browser.
              This demo page calls the live server-side TTS route and streams back
              MP3 audio for playback in the app.
            </p>
          </div>

          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1.2fr)_340px]">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="elevenlabs-demo-text"
                  className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Preview text
                </label>
                <textarea
                  id="elevenlabs-demo-text"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  maxLength={500}
                  className="min-h-44 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                  placeholder="Write the voice prompt you want ElevenLabs to speak."
                />
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Server-side TTS input is capped at 500 characters.</span>
                  <span>{text.length}/500</span>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="elevenlabs-demo-voice"
                  className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Voice override (optional)
                </label>
                <Input
                  id="elevenlabs-demo-voice"
                  value={voiceId}
                  onChange={(event) => setVoiceId(event.target.value)}
                  placeholder="Use ELEVENLABS_DEFAULT_VOICE_ID when left blank"
                  className="h-10 rounded-xl border-white/[0.08] bg-white/[0.03]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  className="rounded-xl bg-primary px-4 text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    if (isPlaying) {
                      stop();
                      return;
                    }

                    void play({
                      text,
                      voiceId: voiceId.trim() || undefined,
                    });
                  }}
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                      Generating voice...
                    </>
                  ) : isPlaying ? (
                    <>
                      <Waves className="mr-2 h-4 w-4" />
                      Stop playback
                    </>
                  ) : (
                    <>
                      <Volume2 className="mr-2 h-4 w-4" />
                      Generate voice
                    </>
                  )}
                </Button>

                <Link href="/terminal/spot">
                  <Button
                    variant="outline"
                    className="rounded-xl border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]"
                  >
                    Open product surface
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {error ? (
                <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              ) : null}

              {audioUrl ? (
                <div className="rounded-2xl border border-white/[0.08] bg-[#07111b] p-4">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70">
                    Latest generated audio
                  </p>
                  <audio controls src={audioUrl} className="w-full" />
                </div>
              ) : null}
            </div>

            <aside className="space-y-4 rounded-[1.4rem] border border-white/[0.08] bg-white/[0.02] p-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Product use case
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground/90">
                  Mentor cards in TimeExchange can surface a short AI voice intro so
                  buyers can hear a consistent, branded preview before booking a live
                  or forward session.
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Architecture
                </p>
                <ul className="mt-2 space-y-2 text-sm leading-6 text-muted-foreground">
                  <li>Server route signs requests with the ElevenLabs API key.</li>
                  <li>Browser only receives the MP3 response, never the API key.</li>
                  <li>Same reusable playback hook powers demo and product buttons.</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
