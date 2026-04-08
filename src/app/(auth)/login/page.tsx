"use client"

import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import { BrandPanel } from "@/components/auth/BrandPanel"

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M15.68 8.18c0-.57-.05-1.11-.14-1.64H8v3.1h4.3a3.67 3.67 0 0 1-1.6 2.41v2h2.58c1.51-1.39 2.4-3.44 2.4-5.87Z" fill="#4285F4"/>
    <path d="M8 16c2.16 0 3.97-.72 5.29-1.94l-2.58-2a4.83 4.83 0 0 1-2.71.75c-2.08 0-3.84-1.4-4.47-3.29H.87v2.06A8 8 0 0 0 8 16Z" fill="#34A853"/>
    <path d="M3.53 9.52A4.8 4.8 0 0 1 3.28 8c0-.53.09-1.04.25-1.52V4.42H.87A8 8 0 0 0 0 8c0 1.29.31 2.51.87 3.58l2.66-2.06Z" fill="#FBBC05"/>
    <path d="M8 3.18c1.17 0 2.22.4 3.05 1.2l2.28-2.28C11.96.72 10.16 0 8 0A8 8 0 0 0 .87 4.42l2.66 2.06C4.16 4.59 5.92 3.18 8 3.18Z" fill="#EA4335"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect width="16" height="16" rx="2" fill="#0A66C2"/>
    <path d="M3.5 6H5.5V12.5H3.5V6ZM4.5 5.2C3.84 5.2 3.3 4.66 3.3 4S3.84 2.8 4.5 2.8 5.7 3.34 5.7 4 5.16 5.2 4.5 5.2ZM12.5 12.5H10.5V9.3C10.5 8.44 10.48 7.33 9.3 7.33 8.1 7.33 7.92 8.27 7.92 9.24V12.5H5.92V6H7.84V6.96h.03c.26-.5.9-1.02 1.86-1.02 2 0 2.36 1.31 2.36 3.02V12.5Z" fill="white"/>
  </svg>
)

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

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
            Welcome back
          </h1>
          <p
            className="mt-[14px] text-[13px]"
            style={{ color: "rgba(128,143,158,0.65)" }}
          >
            Sign in to your account
          </p>

          <div className="mt-8 flex flex-col gap-5">
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
                placeholder="your@email.com"
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
              <div className="flex items-center justify-between">
                <label
                  className="text-[10px] font-medium tracking-[0.4px] uppercase"
                  style={{ color: "rgba(128,143,158,0.65)" }}
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[12px] font-medium transition-opacity hover:opacity-100"
                  style={{ color: "rgba(133,237,181,0.9)" }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
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
          </div>

          {/* Sign in button */}
          <motion.button
            className="mt-7 w-full h-12 rounded-[14px] text-[14px] font-semibold"
            style={{ backgroundColor: "#85edb5", color: "#08111a" }}
            whileHover={{ opacity: 0.92, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            Sign in
          </motion.button>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
            <span className="text-[12px]" style={{ color: "rgba(128,143,158,0.45)" }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* OAuth buttons */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { icon: <GoogleIcon />, label: "Continue with Google" },
              { icon: <LinkedInIcon />, label: "Continue with LinkedIn" },
            ].map(({ icon, label }) => (
              <motion.button
                key={label}
                className="flex items-center justify-center gap-2 h-11 rounded-[14px] text-[12px] font-medium"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(235,240,245,0.75)",
                }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                {icon}
                {label}
              </motion.button>
            ))}
          </div>

          {/* Footer link */}
          <p className="mt-6 text-center text-[12px]" style={{ color: "rgba(128,143,158,0.55)" }}>
            New to TimeExchange?{" "}
            <Link
              href="/signup"
              className="font-medium transition-opacity hover:opacity-100"
              style={{ color: "rgba(133,237,181,0.9)" }}
            >
              Create account →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
