"use client"

import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import { BrandPanel } from "@/components/auth/BrandPanel"

type Role = "Expert" | "Learner" | "Both"
const roles: Role[] = ["Expert", "Learner", "Both"]

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<Role>("Expert")

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
                placeholder="Dr. Jane Smith"
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
              <label
                className="text-[10px] font-medium tracking-[0.4px] uppercase"
                style={{ color: "rgba(128,143,158,0.65)" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
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
            className="mt-7 w-full h-12 rounded-[14px] text-[14px] font-semibold"
            style={{ backgroundColor: "#85edb5", color: "#08111a" }}
            whileHover={{ opacity: 0.92, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            Create account
          </motion.button>

          {/* Footer link */}
          <p className="mt-6 text-center text-[12px]" style={{ color: "rgba(128,143,158,0.55)" }}>
            Already have an account?{" "}
            <Link
              href="/login"
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
