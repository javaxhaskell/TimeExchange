"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { BrandPanel } from "@/components/auth/BrandPanel"
import { useAuth } from "@/lib/useAuth"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export default function UpdatePasswordPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recoveryError =
    !authLoading && !user
      ? "This password reset link is invalid or has expired. Request a new reset email."
      : null
  const activeError = error ?? recoveryError

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()

    if (!user) {
      setError("This password reset link is invalid or has expired. Request a new reset email.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setError(null)
    setLoading(true)

    const supabase = createSupabaseBrowserClient()
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.replace("/account")
    router.refresh()
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: "#08111a" }}>
      <BrandPanel />

      <div
        className="flex-1 flex items-center justify-center px-8"
        style={{ backgroundColor: "#0a141e" }}
      >
        <motion.div
          className="w-full max-w-[440px] rounded-3xl px-9 py-10"
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.08 }}
        >
          <h1
            className="text-[26px] font-bold tracking-[-1px] leading-none"
            style={{ color: "#ebf0f5" }}
          >
            Set a new password
          </h1>
          <p
            className="mt-[14px] text-[13px]"
            style={{ color: "rgba(128,143,158,0.65)" }}
          >
            Choose a new password for your TimeExchange account.
          </p>

          {activeError && (
            <div
              className="mt-4 rounded-[12px] px-4 py-3 text-[12px]"
              style={{
                backgroundColor: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "rgba(252,165,165,0.9)",
              }}
            >
              {activeError}
            </div>
          )}

          <form onSubmit={handleUpdatePassword}>
            <div className="mt-8 flex flex-col gap-5">
              <div className="flex flex-col gap-[10px]">
                <label
                  className="text-[10px] font-medium tracking-[0.4px] uppercase"
                  style={{ color: "rgba(128,143,158,0.65)" }}
                >
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a new password"
                    className="w-full h-11 rounded-[14px] px-4 pr-11 text-[13px] outline-none transition-colors"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#ebf0f5",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(133,237,181,0.4)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-100"
                    style={{ color: "rgba(128,143,158,0.5)" }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-[10px]">
                <label
                  className="text-[10px] font-medium tracking-[0.4px] uppercase"
                  style={{ color: "rgba(128,143,158,0.65)" }}
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat the new password"
                    className="w-full h-11 rounded-[14px] px-4 pr-11 text-[13px] outline-none transition-colors"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#ebf0f5",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(133,237,181,0.4)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-100"
                    style={{ color: "rgba(128,143,158,0.5)" }}
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading || authLoading || !user}
              className="mt-7 w-full h-12 rounded-[14px] text-[14px] font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
              style={{ backgroundColor: "#85edb5", color: "#08111a" }}
              whileHover={loading ? {} : { opacity: 0.92, scale: 1.01 }}
              whileTap={loading ? {} : { scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-[12px]" style={{ color: "rgba(128,143,158,0.55)" }}>
            Need a new reset link?{" "}
            <Link
              href="/forgot-password"
              className="font-medium transition-opacity hover:opacity-100"
              style={{ color: "rgba(133,237,181,0.9)" }}
            >
              Request another one →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
