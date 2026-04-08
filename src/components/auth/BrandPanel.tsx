"use client"

import { motion } from "framer-motion"

const dots: { x: number; y: number; c: number }[] = [
  { x: 79, y: 159, c: 0 },
  { x: 159, y: 239, c: 2 },
  { x: 259, y: 299, c: 1 },
  { x: 129, y: 419, c: 0 },
  { x: 309, y: 469, c: 3 },
  { x: 69, y: 549, c: 2 },
  { x: 369, y: 279, c: 0 },
  { x: 439, y: 389, c: 1 },
  { x: 199, y: 189, c: 3 },
  { x: 459, y: 229, c: 2 },
  { x: 379, y: 559, c: 0 },
  { x: 519, y: 649, c: 3 },
  { x: 49, y: 699, c: 1 },
  { x: 349, y: 149, c: 2 },
  { x: 489, y: 509, c: 0 },
]

const dotColors = [
  { ring: "rgba(74,222,204,0.30)", fill: "rgba(74,222,204,0.65)" },
  { ring: "rgba(96,165,250,0.30)", fill: "rgba(96,165,250,0.65)" },
  { ring: "rgba(133,237,181,0.30)", fill: "rgba(133,237,181,0.65)" },
  { ring: "rgba(167,139,250,0.30)", fill: "rgba(167,139,250,0.65)" },
]

// Deterministic float keyframes per dot so each has a unique path
function getDotMotion(i: number) {
  const t = i + 1
  const xA = 8 + (t * 3.7) % 13   // x amplitude 8–21 px
  const yA = 10 + (t * 2.3) % 11  // y amplitude 10–21 px
  const dur = 9 + (t * 1.6) % 8   // duration 9–17 s

  return {
    x: [0, xA * Math.sin(t * 1.1), -xA * 0.55, xA * 0.3 * Math.cos(t), 0],
    y: [0, -yA * 0.75, yA * Math.cos(t * 0.8), -yA * 0.4, 0],
    transition: {
      duration: dur,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: (i * 0.45) % 3.5,
    },
  }
}

export function BrandPanel() {
  return (
    <div
      className="relative hidden lg:flex flex-col w-[600px] min-w-[600px] h-screen overflow-hidden"
      style={{ backgroundColor: "#08111a" }}
    >
      {/* Animated decorative dots */}
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
            {/* outer ring */}
            <span
              className="absolute rounded-full"
              style={{
                width: 22,
                height: 22,
                border: `1.5px solid ${color.ring}`,
              }}
            />
            {/* inner dot */}
            <span
              className="absolute rounded-full"
              style={{
                left: 7,
                top: 7,
                width: 8,
                height: 8,
                backgroundColor: color.fill,
              }}
            />
          </motion.span>
        )
      })}

      {/* Branding */}
      <motion.div
        className="absolute left-[56px] top-1/2 -translate-y-1/2 flex flex-col"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.1 }}
      >
        <p
          className="font-bold text-[28px] tracking-[-1.8px] leading-none"
          style={{ color: "#ebf0f5" }}
        >
          TimeExchange
        </p>
        <p
          className="mt-[6px] text-[9px] font-medium tracking-[1.8px] uppercase leading-none"
          style={{ color: "rgba(128,143,158,0.6)" }}
        >
          GLOBAL EXPERTISE EXCHANGE
        </p>
        <p
          className="mt-[32px] text-[20px] font-semibold leading-snug"
          style={{ color: "#ebf0f5" }}
        >
          Connect with the world&apos;s
        </p>
        <p
          className="text-[20px] font-semibold leading-snug"
          style={{ color: "#85edb5" }}
        >
          leading experts.
        </p>
        <p
          className="mt-[18px] text-[13px] font-normal leading-[1.55]"
          style={{ color: "rgba(128,143,158,0.65)" }}
        >
          Book time with verified professionals
          <br />
          across every discipline, anywhere.
        </p>
      </motion.div>

      {/* Right-edge separator */}
      <div
        className="absolute top-0 right-0 w-px h-full"
        style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
      />
    </div>
  )
}
