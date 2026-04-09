"use client"

import Link from "next/link"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { buildAuthCallbackUrl } from "@/lib/auth/redirect"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

const dots: { x: number; y: number; c: number }[] = [
  { x: 169, y: 129, c: 0 },
  { x: 369, y: 189, c: 2 },
  { x: 689, y: 279, c: 1 },
  { x: 1089, y: 169, c: 3 },
  { x: 1309, y: 149, c: 0 },
  { x: 109, y: 669, c: 2 },
  { x: 569, y: 609, c: 0 },
  { x: 869, y: 729, c: 1 },
  { x: 1189, y: 679, c: 3 },
  { x: 469, y: 769, c: 2 },
]

const dotColors = [
  { ring: "rgba(74,222,204,0.30)", fill: "rgba(74,222,204,0.65)" },
  { ring: "rgba(96,165,250,0.30)", fill: "rgba(96,165,250,0.65)" },
  { ring: "rgba(133,237,181,0.30)", fill: "rgba(133,237,181,0.65)" },
  { ring: "rgba(167,139,250,0.30)", fill: "rgba(167,139,250,0.65)" },
]

function getDotMotion(i: number) {
  const t = i + 1
  const xA = 10 + (t * 4.1) % 15
  const yA = 8 + (t * 2.7) % 12
  const dur = 10 + (t * 1.8) % 9

  return {
    x: [0, xA * Math.cos(t * 0.9), -xA * 0.5, xA * 0.4 * Math.sin(t), 0],
    y: [0, -yA * 0.8, yA * Math.sin(t * 0.6), -yA * 0.35, 0],
    transition: {
      duration: dur,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: (i * 0.55) % 4,
    },
  }
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createSupabaseBrowserClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: buildAuthCallbackUrl("/update-password"),
    })

    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div
      className="relative flex items-center justify-center min-h-screen overflow-hidden"
      style={{ backgroundColor: "#08111a" }}
    >
      {/* Animated background dots */}
      {dots.map((d, i) => {
        const color = dotColors[d.c]
        const { x, y, transition } = getDotMotion(i)
        return (
          <motion.span
            key={i}
            className="absolute"
            style={{ left: d.x, top: d.y }}
            animate={{ x, y }}
            transition={transition}
          >
            <span
              className="absolute rounded-full"
              style={{ width: 22, height: 22, border: `1.5px solid ${color.ring}` }}
            />
            <span
              className="absolute rounded-full"
              style={{ left: 7, top: 7, width: 8, height: 8, backgroundColor: color.fill }}
            />
          </motion.span>
        )
      })}

      {/* Card */}
      <motion.div
        className="relative z-10 w-full max-w-[480px] rounded-3xl px-9 py-10"
        style={{
          backgroundColor: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.08 }}
      >
        {/* Mini branding */}
        <p
          className="text-[18px] font-bold tracking-[-1.1px] leading-none"
          style={{ color: "#ebf0f5" }}
        >
          TimeExchange
        </p>
        <p
          className="mt-[6px] text-[8.5px] font-medium tracking-[1.5px] uppercase"
          style={{ color: "rgba(128,143,158,0.5)" }}
        >
          GLOBAL EXPERTISE EXCHANGE
        </p>

        <div className="mt-6 mb-6 h-px" style={{ backgroundColor: "rgba(255,255,255,0.07)" }} />

        {/* Swap between form and confirmation with AnimatePresence */}
        <AnimatePresence mode="wait" initial={false}>
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <h1
                className="text-[22px] font-bold tracking-[-0.8px] leading-tight"
                style={{ color: "#ebf0f5" }}
              >
                Forgot your password?
              </h1>
              <p
                className="mt-3 text-[13px] leading-[1.55]"
                style={{ color: "rgba(128,143,158,0.65)" }}
              >
                Enter your email and we&apos;ll send you
                <br />a reset link within seconds.
              </p>

              {/* Error message */}
              {error && (
                <div
                  className="mt-4 rounded-[12px] px-4 py-3 text-[12px]"
                  style={{
                    backgroundColor: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "rgba(252,165,165,0.9)",
                  }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleReset}>
                <div className="mt-7 flex flex-col gap-[10px]">
                  <label
                    className="text-[10px] font-medium tracking-[0.4px] uppercase"
                    style={{ color: "rgba(128,143,158,0.65)" }}
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 rounded-[14px] px-4 text-[13px] outline-none transition-colors"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#ebf0f5",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(133,237,181,0.4)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="mt-5 w-full h-12 rounded-[14px] text-[14px] font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
                  style={{ backgroundColor: "#85edb5", color: "#08111a" }}
                  whileHover={loading ? {} : { opacity: 0.92, scale: 1.01 }}
                  whileTap={loading ? {} : { scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="py-6 text-center"
            >
              {/* Animated checkmark */}
              <motion.div
                className="mx-auto mb-5 flex items-center justify-center rounded-full"
                style={{
                  width: 52,
                  height: 52,
                  backgroundColor: "rgba(133,237,181,0.12)",
                  border: "1px solid rgba(133,237,181,0.25)",
                }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              >
                <motion.svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                >
                  <motion.path
                    d="M4 11.5l5 5 9-9"
                    stroke="#85edb5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
                  />
                </motion.svg>
              </motion.div>

              <p className="text-[22px] font-bold tracking-[-0.8px]" style={{ color: "#ebf0f5" }}>
                Check your email
              </p>
              <p
                className="mt-3 text-[13px] leading-[1.55]"
                style={{ color: "rgba(128,143,158,0.65)" }}
              >
                We&apos;ve sent a reset link to your inbox.
                <br />It may take a few seconds to arrive.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-7 h-px" style={{ backgroundColor: "rgba(255,255,255,0.07)" }} />

        <Link
          href="/login"
          className="mt-5 flex items-center justify-center text-[12px] font-medium transition-opacity hover:opacity-100"
          style={{ color: "rgba(133,237,181,0.85)" }}
        >
          ← Back to sign in
        </Link>
      </motion.div>
    </div>
  )
}
