"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { BrandPanel } from "@/components/auth/BrandPanel"
import { buildAuthCallbackUrl, getPostAuthRedirectPath } from "@/lib/auth/redirect"
import { useAuth } from "@/lib/useAuth"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type Role = "Expert" | "Learner" | "Both"
const roles: Role[] = ["Expert", "Learner", "Both"]

function SignUpPageFallback() {
  return (
    <div className="flex h-screen" style={{ backgroundColor: "#08111a" }}>
      <BrandPanel />
      <div className="flex-1" style={{ backgroundColor: "#0a141e" }} />
    </div>
  )
}

function SignUpPageContent() {
  const searchParams = useSearchParams()
  const redirectTo = getPostAuthRedirectPath(searchParams.get("redirect"), "/terminal")
  const { user, loading: authLoading } = useAuth()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<Role>("Expert")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      window.location.assign(redirectTo)
    }
  }, [authLoading, redirectTo, user])

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createSupabaseBrowserClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          role,
        },
        emailRedirectTo: buildAuthCallbackUrl(redirectTo),
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.session) {
      window.location.assign(redirectTo)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="flex h-screen" style={{ backgroundColor: "#08111a" }}>
        <BrandPanel />
        <div
          className="flex-1 flex items-center justify-center px-8"
          style={{ backgroundColor: "#0a141e" }}
        >
          <motion.div
            className="w-full max-w-[440px] rounded-3xl px-9 py-10 text-center"
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.08 }}
          >
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

            <h1
              className="text-[22px] font-bold tracking-[-0.8px]"
              style={{ color: "#ebf0f5" }}
            >
              Check your email
            </h1>
            <p
              className="mt-3 text-[13px] leading-[1.55]"
              style={{ color: "rgba(128,143,158,0.65)" }}
            >
              We&apos;ve sent a confirmation link to <strong style={{ color: "#ebf0f5" }}>{email}</strong>.
              <br />Click it to activate your account.
            </p>

            <Link
              href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
              className="mt-6 inline-flex items-center justify-center text-[12px] font-medium transition-opacity hover:opacity-100"
              style={{ color: "rgba(133,237,181,0.85)" }}
            >
              ← Back to sign in
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: "#08111a" }}>
      <BrandPanel />

      {/* Form panel */}
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
          {/* Header */}
          <h1
            className="text-[26px] font-bold tracking-[-1px] leading-none"
            style={{ color: "#ebf0f5" }}
          >
            Create account
          </h1>
          <p
            className="mt-[14px] text-[13px]"
            style={{ color: "rgba(128,143,158,0.65)" }}
          >
            Join the global expertise exchange
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

          <form onSubmit={handleSignUp}>
            <div className="mt-8 flex flex-col gap-5">
              {/* Full name */}
              <div className="flex flex-col gap-[10px]">
                <label
                  className="text-[10px] font-medium tracking-[0.4px] uppercase"
                  style={{ color: "rgba(128,143,158,0.65)" }}
                >
                  Full name
                </label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Dr. Jane Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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

              {/* Email */}
              <div className="flex flex-col gap-[10px]">
                <label
                  className="text-[10px] font-medium tracking-[0.4px] uppercase"
                  style={{ color: "rgba(128,143,158,0.65)" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
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

              {/* Password */}
              <div className="flex flex-col gap-[10px]">
                <label
                  className="text-[10px] font-medium tracking-[0.4px] uppercase"
                  style={{ color: "rgba(128,143,158,0.65)" }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-100"
                    style={{ color: "rgba(128,143,158,0.5)" }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Role selector */}
              <div className="flex flex-col gap-[10px]">
                <label
                  className="text-[10px] font-medium tracking-[0.4px] uppercase"
                  style={{ color: "rgba(128,143,158,0.65)" }}
                >
                  I am a...
                </label>
                <div
                  className="flex h-11 rounded-[14px] p-[2px]"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {roles.map((r) => (
                    <motion.button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className="flex-1 rounded-[12px] text-[13px] font-medium relative"
                      animate={
                        role === r
                          ? { color: "#85edb5" }
                          : { color: "rgba(128,143,158,0.6)" }
                      }
                      transition={{ duration: 0.2 }}
                      style={{ fontWeight: role === r ? 600 : 400 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      {role === r && (
                        <motion.span
                          layoutId="role-pill"
                          className="absolute inset-0 rounded-[12px]"
                          style={{ backgroundColor: "rgba(133,237,181,0.15)" }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{r}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Create account button */}
            <motion.button
              type="submit"
              disabled={loading || authLoading}
              className="mt-7 w-full h-12 rounded-[14px] text-[14px] font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
              style={{ backgroundColor: "#85edb5", color: "#08111a" }}
              whileHover={loading ? {} : { opacity: 0.92, scale: 1.01 }}
              whileTap={loading ? {} : { scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
            </motion.button>
          </form>

          {/* Footer link */}
          <p className="mt-6 text-center text-[12px]" style={{ color: "rgba(128,143,158,0.55)" }}>
            Already have an account?{" "}
            <Link
              href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
              className="font-medium transition-opacity hover:opacity-100"
              style={{ color: "rgba(133,237,181,0.9)" }}
            >
              Sign in →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<SignUpPageFallback />}>
      <SignUpPageContent />
    </Suspense>
  )
}
