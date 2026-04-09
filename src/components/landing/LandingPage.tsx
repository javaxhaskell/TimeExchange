"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Globe, TrendingUp, Zap, Shield, BarChart2,
  Users, Clock, ChevronRight, Star, Activity, Search,
} from "lucide-react";

// ─── Shared helpers ────────────────────────────────────────────────────────────

const dotColors = [
  { ring: "rgba(74,222,204,0.22)", fill: "rgba(74,222,204,0.5)" },
  { ring: "rgba(96,165,250,0.22)", fill: "rgba(96,165,250,0.5)" },
  { ring: "rgba(133,237,181,0.22)", fill: "rgba(133,237,181,0.5)" },
  { ring: "rgba(167,139,250,0.22)", fill: "rgba(167,139,250,0.5)" },
];

function getDotMotion(i: number) {
  const t = i + 1;
  return {
    animate: {
      x: [0, (8 + (t * 3.7) % 13) * Math.sin(t * 1.1), -(8 + (t * 3.7) % 13) * 0.55, 0],
      y: [0, -(10 + (t * 2.3) % 11) * 0.75, (10 + (t * 2.3) % 11) * 0.5, 0],
    },
    transition: { duration: 9 + (t * 1.6) % 8, repeat: Infinity, ease: "easeInOut" as const, delay: (i * 0.45) % 3.5 },
  };
}

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98], delay }}
    >{children}</motion.div>
  );
}

// Typewriter hook for hero text
function useTypewriter(text: string, speed: number = 50) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed]);

  return { displayText, isComplete };
}

// ─── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-[62px]"
      style={{
        backgroundColor: scrolled ? "rgba(8,17,26,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.055)" : "none",
        transition: "all 0.25s ease",
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <div className="flex items-center gap-3">
        <span className="font-bold text-[16px] tracking-[-0.7px]" style={{ color: "#ebf0f5" }}>TimeExchange</span>
        <span className="hidden sm:block text-[7.5px] font-semibold tracking-[2px] uppercase mt-px" style={{ color: "rgba(133,237,181,0.45)" }}>Global Expertise Exchange</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {[{ label: "Discover", href: "/discover" }, { label: "How it works", href: "#how-it-works" }, { label: "Markets", href: "#markets" }].map(({ label, href }) => (
          <a key={label} href={href} className="text-[13px] font-medium transition-colors duration-150" style={{ color: "rgba(160,178,194,0.7)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#ebf0f5")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(160,178,194,0.7)")}
          >{label}</a>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Link href="/login" className="text-[13px] font-medium px-4 py-2 rounded-xl transition-colors duration-150"
          style={{ color: "rgba(160,178,194,0.8)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#ebf0f5")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(160,178,194,0.8)")}
        >Log in</Link>
        <Link href="/signup"
          className="text-[13px] font-semibold px-4 py-2 rounded-xl transition-all duration-150 hover:brightness-110"
          style={{ backgroundColor: "#85edb5", color: "#08111a" }}
        >Get started</Link>
      </div>
    </motion.nav>
  );
}

// ─── Hero product mockup ───────────────────────────────────────────────────────
const mockExperts = [
  { name: "Dr. Sarah Chen", role: "ML / AI Systems", rate: "£420", change: "+2.4%", pos: true, available: true },
  { name: "James Okafor", role: "Web3 Architecture", rate: "£285", change: "+0.8%", pos: true, available: true },
  { name: "Priya Mehta", role: "Series A Strategy", rate: "£510", change: "-1.2%", pos: false, available: false },
  { name: "Lars Eriksson", role: "Quantitative Finance", rate: "£390", change: "+3.1%", pos: true, available: true },
];

const mockOrderBook = [
  { price: "428.00", size: "2", side: "ask" },
  { price: "426.50", size: "5", side: "ask" },
  { price: "424.00", size: "1", side: "ask" },
  { price: "422.75", size: "8", side: "ask" },
  { price: "420.00", size: "3", side: "bid" },
  { price: "418.50", size: "6", side: "bid" },
  { price: "416.00", size: "4", side: "bid" },
  { price: "414.25", size: "9", side: "bid" },
];

function ProductMockup() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1800);
    return () => clearInterval(id);
  }, []);

  const spread = [420.0, 421.5, 419.0, 422.0, 420.5][tick % 5];

  return (
    <div
      className="relative w-full max-w-[780px] rounded-2xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.07)]"
      style={{ backgroundColor: "#0b1620" }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "#0d1a24" }}>
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "rgba(255,95,87,0.7)" }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "rgba(255,189,68,0.7)" }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "rgba(40,201,64,0.7)" }} />
        <span className="ml-3 text-[11px] font-medium" style={{ color: "rgba(120,138,154,0.6)" }}>TimeExchange — Trading Terminal</span>
        <span className="ml-auto flex items-center gap-1.5 text-[10px] font-medium" style={{ color: "#85edb5" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-live" style={{ backgroundColor: "#85edb5" }} />
          LIVE
        </span>
      </div>

      {/* Inner layout */}
      <div className="flex h-[400px]">
        {/* Left: expert list */}
        <div className="w-[240px] border-r flex flex-col" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="px-3 py-2.5 border-b flex items-center gap-2" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <Search className="w-3.5 h-3.5" style={{ color: "rgba(120,138,154,0.5)" }} />
            <span className="text-[11px]" style={{ color: "rgba(120,138,154,0.5)" }}>Search experts…</span>
          </div>
          <div className="flex-1 overflow-hidden">
            {mockExperts.map((e, i) => (
              <motion.div
                key={e.name}
                className="flex items-center gap-2.5 px-3 py-2.5 border-b cursor-pointer"
                style={{ borderColor: "rgba(255,255,255,0.04)", backgroundColor: i === 0 ? "rgba(133,237,181,0.06)" : "transparent" }}
                animate={{ opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: ["rgba(133,237,181,0.15)", "rgba(96,165,250,0.15)", "rgba(167,139,250,0.15)", "rgba(74,222,204,0.15)"][i], color: ["#85edb5", "#60a5fa", "#a78bfa", "#4adecc"][i] }}>
                    {e.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  {e.available && <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#0b1620]" style={{ backgroundColor: "#85edb5" }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold truncate" style={{ color: "#ebf0f5" }}>{e.name.split(" ")[1]}</div>
                  <div className="text-[10px] truncate" style={{ color: "rgba(120,138,154,0.65)" }}>{e.role}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[11px] font-mono font-semibold" style={{ color: "#ebf0f5" }}>{e.rate}</div>
                  <div className="text-[10px] font-mono" style={{ color: e.pos ? "#85edb5" : "#f87171" }}>{e.change}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Center: chart area */}
        <div className="flex-1 flex flex-col">
          {/* Ticker bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div>
              <span className="text-[13px] font-bold" style={{ color: "#ebf0f5" }}>Dr. Sarah Chen</span>
              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "rgba(133,237,181,0.12)", color: "#85edb5" }}>ML / AI</span>
            </div>
            <div className="flex items-center gap-3">
              <motion.span className="text-[20px] font-bold font-mono tabular-nums" style={{ color: "#ebf0f5" }}
                animate={{ opacity: [1, 0.7, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
              >
                {"£"}{spread.toFixed(2)}
              </motion.span>
              <span className="text-[12px] font-semibold" style={{ color: "#85edb5" }}>+2.4%</span>
            </div>
          </div>

          {/* Fake chart */}
          <div className="flex-1 relative overflow-hidden px-4 pt-4">
            <svg viewBox="0 0 420 160" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#85edb5" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#85edb5" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Area fill */}
              <path d="M0,120 C30,115 50,100 80,95 S120,80 150,75 S190,85 220,70 S260,55 290,60 S330,50 360,42 S400,38 420,32 L420,160 L0,160 Z" fill="url(#chartGrad)" />
              {/* Line */}
              <path d="M0,120 C30,115 50,100 80,95 S120,80 150,75 S190,85 220,70 S260,55 290,60 S330,50 360,42 S400,38 420,32" fill="none" stroke="#85edb5" strokeWidth="1.5" />
              {/* Dot at end */}
              <circle cx="420" cy="32" r="3" fill="#85edb5" />
            </svg>

            {/* Grid lines */}
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "100% 40px" }} />
          </div>

          {/* Time selector */}
          <div className="flex items-center gap-1 px-4 pb-3">
            {["1H", "4H", "1D", "1W", "1M"].map((t, i) => (
              <span key={t} className="text-[10px] font-medium px-2 py-1 rounded-md cursor-pointer"
                style={{ backgroundColor: i === 2 ? "rgba(133,237,181,0.12)" : "transparent", color: i === 2 ? "#85edb5" : "rgba(120,138,154,0.6)" }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right: order book */}
        <div className="w-[130px] border-l flex flex-col" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="px-3 py-2.5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <span className="text-[10px] font-semibold tracking-[0.5px] uppercase" style={{ color: "rgba(120,138,154,0.55)" }}>Order Book</span>
          </div>
          <div className="flex-1 overflow-hidden">
            {mockOrderBook.map((row, i) => (
              <motion.div
                key={i}
                className="flex items-center justify-between px-3 py-1 relative"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5 + i * 0.2, repeat: Infinity, delay: i * 0.15 }}
              >
                <div className="absolute inset-0" style={{
                  backgroundColor: row.side === "ask" ? "rgba(248,113,113,0.05)" : "rgba(133,237,181,0.05)",
                  width: `${20 + parseInt(row.size) * 8}%`,
                  right: row.side === "ask" ? 0 : "auto",
                  left: row.side === "bid" ? 0 : "auto",
                }} />
                <span className="text-[10px] font-mono relative z-10" style={{ color: row.side === "ask" ? "#f87171" : "#85edb5" }}>{row.price}</span>
                <span className="text-[10px] font-mono relative z-10" style={{ color: "rgba(120,138,154,0.7)" }}>{row.size}</span>
              </motion.div>
            ))}
            <div className="px-3 py-1.5 border-y flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(133,237,181,0.04)" }}>
              <span className="text-[11px] font-mono font-bold" style={{ color: "#85edb5" }}>{spread.toFixed(2)}</span>
              <span className="text-[9px]" style={{ color: "rgba(133,237,181,0.6)" }}>SPOT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  
  const { displayText, isComplete } = useTypewriter("Expert time, traded like a market.", 35);

  const dotsLeft = [
    { x: 40, y: 100, c: 0 }, { x: 120, y: 220, c: 2 }, { x: 200, y: 340, c: 1 },
    { x: 60, y: 460, c: 3 }, { x: 160, y: 560, c: 0 }, { x: 30, y: 660, c: 2 },
  ];
  const dotsRight = [
    { x: 60, y: 130, c: 1 }, { x: 170, y: 260, c: 0 }, { x: 90, y: 400, c: 3 },
    { x: 220, y: 320, c: 2 }, { x: 30, y: 530, c: 0 }, { x: 150, y: 620, c: 1 },
  ];

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center overflow-hidden" style={{ backgroundColor: "#08111a" }}>
      {/* Background dots */}
      <div className="absolute top-0 left-0 h-full w-[280px] pointer-events-none overflow-hidden">
        {dotsLeft.map((d, i) => { const { animate, transition } = getDotMotion(i); const color = dotColors[d.c]; return (
          <motion.span key={i} className="absolute" style={{ left: d.x, top: d.y }} animate={animate} transition={transition}>
            <span className="absolute rounded-full" style={{ width: 20, height: 20, border: `1.5px solid ${color.ring}` }} />
            <span className="absolute rounded-full" style={{ left: 6, top: 6, width: 8, height: 8, backgroundColor: color.fill }} />
          </motion.span>
        ); })}
      </div>
      <div className="absolute top-0 right-0 h-full w-[280px] pointer-events-none overflow-hidden">
        {dotsRight.map((d, i) => { const { animate, transition } = getDotMotion(i + 6); const color = dotColors[d.c]; return (
          <motion.span key={i} className="absolute" style={{ left: d.x, top: d.y }} animate={animate} transition={transition}>
            <span className="absolute rounded-full" style={{ width: 20, height: 20, border: `1.5px solid ${color.ring}` }} />
            <span className="absolute rounded-full" style={{ left: 6, top: 6, width: 8, height: 8, backgroundColor: color.fill }} />
          </motion.span>
        ); })}
      </div>

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 45% at 50% 30%, rgba(133,237,181,0.07) 0%, transparent 65%)" }} />

      {/* Text content */}
      <motion.div className="relative z-10 flex flex-col items-center text-center px-6 pt-40 pb-16 max-w-4xl" style={{ y: heroY, opacity: heroOpacity }}>
        {/* Badge */}
        <motion.div
          className="flex items-center gap-2 mb-7 px-3.5 py-1.5 rounded-full border text-[11px] font-semibold tracking-[0.6px] uppercase"
          style={{ borderColor: "rgba(133,237,181,0.2)", backgroundColor: "rgba(133,237,181,0.06)", color: "#85edb5" }}
          initial={{ opacity: 0, scale: 0.9, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-live" style={{ backgroundColor: "#85edb5" }} />
          Markets open · 147 countries
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-bold leading-[1.03] tracking-[-2.8px] mb-5"
          style={{ color: "#ebf0f5", fontSize: "clamp(42px, 6.5vw, 78px)" }}
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.18 }}
        >
          {displayText.includes(',') ? (
            <>
              <span>{displayText.split(',')[0]},</span>
              <br />
              <span style={{ color: "#85edb5" }}>{displayText.split(',')[1]}</span>
            </>
          ) : (
            <span>{displayText}</span>
          )}
                  </motion.h1>

        {/* Sub */}
        <motion.p
          className="text-[18px] leading-[1.6] max-w-lg mb-9"
          style={{ color: "rgba(150,168,184,0.8)" }}
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.3 }}
        >
          Discover, price, and book sessions with the world&apos;s top professionals — using the same mechanics as financial markets.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3 mb-10"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.44 }}
        >
          <Link href="/signup" className="group flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[15px] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_32px_rgba(133,237,181,0.25)]" style={{ backgroundColor: "#85edb5", color: "#08111a" }}>
            Start for free
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <Link href="/discover" className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-medium text-[15px] border transition-all duration-200 hover:border-white/[0.18] hover:bg-white/[0.04]" style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(190,210,228,0.9)" }}>
            Browse the marketplace
            <ChevronRight className="w-4 h-4 opacity-60" />
          </Link>
        </motion.div>

        <motion.p className="text-[12px]" style={{ color: "rgba(100,118,134,0.6)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.65 }}
        >
          Free to browse · No subscription · Pay per session
        </motion.p>
      </motion.div>

      {/* Product mockup */}
      <motion.div
        className="relative z-10 w-full flex justify-center px-6 pb-0"
        style={{ y: mockupY }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.55 }}
      >
        <ProductMockup />
      </motion.div>

      {/* Fade-to-next gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #08111a)" }} />
    </section>
  );
}

// ─── Use cases ─────────────────────────────────────────────────────────────────
const useCases = [
  {
    eyebrow: "For buyers",
    title: "Find the right expert, right now.",
    body: "Browse a live order book of available professionals. Filter by discipline, region, or availability. Book a spot session in under 60 seconds — or lock in a forward contract at today's rate.",
    cta: "Browse experts",
    href: "/discover",
    items: ["Real-time availability feed", "Transparent session pricing", "Instant spot booking"],
    accent: "#85edb5",
    mockup: "buyer",
  },
  {
    eyebrow: "For experts",
    title: "Your time is an asset. Price it accordingly.",
    body: "List your expertise on the exchange. Set a dynamic pricing curve, define availability windows, and let demand fill your calendar — without the overhead of traditional consulting platforms.",
    cta: "List your time",
    href: "/signup",
    items: ["Set your own rate", "Forward booking support", "Demand-driven pricing"],
    accent: "#60a5fa",
    mockup: "expert",
  },
  {
    eyebrow: "For teams",
    title: "Source expert time at scale.",
    body: "Build a diversified portfolio of advisory relationships. Use our trading terminal to monitor session volume, track spending, and execute bulk forward contracts for ongoing advisory coverage.",
    cta: "Open terminal",
    href: "/signup",
    items: ["Portfolio view", "Bulk forward contracts", "Session analytics"],
    accent: "#a78bfa",
    mockup: "team",
  },
];

function UseCaseMockup({ type, accent }: { type: string; accent: string }) {
  const cards = {
    buyer: (
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "#0b1620" }}>
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <span className="text-[11px] font-semibold" style={{ color: "#ebf0f5" }}>Available now</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "rgba(133,237,181,0.1)", color: "#85edb5" }}>12 online</span>
        </div>
        {[{ n: "Dr. Sarah Chen", r: "AI/ML", p: "£420/hr", avail: true }, { n: "James Okafor", r: "Web3", p: "£285/hr", avail: true }, { n: "Priya Mehta", r: "Strategy", p: "£510/hr", avail: false }].map((e, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0" style={{ backgroundColor: `${accent}18`, color: accent }}>
              {e.n.split(" ").map(x => x[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold truncate" style={{ color: "#ebf0f5" }}>{e.n}</div>
              <div className="text-[10px]" style={{ color: "rgba(120,138,154,0.65)" }}>{e.r}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-semibold" style={{ color: "#ebf0f5" }}>{e.p}</span>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: e.avail ? "#85edb5" : "rgba(120,138,154,0.3)" }} />
            </div>
          </div>
        ))}
        <div className="px-4 py-3">
          <div className="w-full py-2 rounded-lg text-center text-[12px] font-semibold cursor-pointer" style={{ backgroundColor: `${accent}18`, color: accent }}>
            Book spot session →
          </div>
        </div>
      </div>
    ),
    expert: (
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "#0b1620" }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="text-[11px] font-semibold mb-1" style={{ color: "#ebf0f5" }}>Your pricing curve</div>
          <div className="text-[10px]" style={{ color: "rgba(120,138,154,0.6)" }}>Next 7 days</div>
        </div>
        <div className="p-4">
          <svg viewBox="0 0 280 80" className="w-full h-20">
            <defs>
              <linearGradient id="expertGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity="0.2" />
                <stop offset="100%" stopColor={accent} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,60 C40,55 60,45 100,40 S150,30 180,25 S230,20 280,15 L280,80 L0,80 Z" fill="url(#expertGrad)" />
            <path d="M0,60 C40,55 60,45 100,40 S150,30 180,25 S230,20 280,15" fill="none" stroke={accent} strokeWidth="1.5" />
          </svg>
        </div>
        {[{ label: "This week earnings", val: "£2,840" }, { label: "Upcoming sessions", val: "6" }, { label: "Forward booked", val: "3 weeks" }].map((row, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2.5 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            <span className="text-[11px]" style={{ color: "rgba(120,138,154,0.65)" }}>{row.label}</span>
            <span className="text-[12px] font-semibold font-mono" style={{ color: "#ebf0f5" }}>{row.val}</span>
          </div>
        ))}
      </div>
    ),
    team: (
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "#0b1620" }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <span className="text-[11px] font-semibold" style={{ color: "#ebf0f5" }}>Advisory portfolio</span>
        </div>
        {[{ cat: "Technology", sessions: 12, spend: "£4,820", fill: 75 }, { cat: "Finance", sessions: 8, spend: "£3,200", fill: 50 }, { cat: "Strategy", sessions: 5, spend: "£2,100", fill: 35 }, { cat: "Legal", sessions: 3, spend: "£1,440", fill: 22 }].map((row, i) => (
          <div key={i} className="px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium" style={{ color: "#ebf0f5" }}>{row.cat}</span>
              <span className="text-[11px] font-mono font-semibold" style={{ color: "#ebf0f5" }}>{row.spend}</span>
            </div>
            <div className="w-full h-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
              <motion.div className="h-1 rounded-full" style={{ backgroundColor: accent, width: `${row.fill}%` }}
                initial={{ width: 0 }} animate={{ width: `${row.fill}%` }} transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
              />
            </div>
            <div className="mt-1 text-[10px]" style={{ color: "rgba(120,138,154,0.55)" }}>{row.sessions} sessions this quarter</div>
          </div>
        ))}
      </div>
    ),
  };
  return cards[type as keyof typeof cards] ?? null;
}

function UseCases() {
  return (
    <section className="py-24" style={{ backgroundColor: "#08111a" }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-28">
        {useCases.map((uc, i) => (
          <FadeUp key={uc.eyebrow} delay={0.05}>
            <div className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12 lg:gap-20`}>
              {/* Text */}
              <div className="flex-1 max-w-lg">
                <p className="text-[11px] font-semibold tracking-[2px] uppercase mb-4" style={{ color: `${uc.accent}99` }}>{uc.eyebrow}</p>
                <h2 className="font-bold text-[30px] md:text-[36px] tracking-[-1.2px] leading-[1.12] mb-4" style={{ color: "#ebf0f5" }}>{uc.title}</h2>
                <p className="text-[15px] leading-[1.7] mb-7" style={{ color: "rgba(145,163,179,0.85)" }}>{uc.body}</p>
                <ul className="flex flex-col gap-2.5 mb-8">
                  {uc.items.map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-[13px]" style={{ color: "rgba(160,178,194,0.8)" }}>
                      <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${uc.accent}18` }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: uc.accent }} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href={uc.href} className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-semibold transition-all duration-200 hover:brightness-110"
                  style={{ backgroundColor: `${uc.accent}18`, color: uc.accent }}>
                  {uc.cta}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* Mockup */}
              <div className="flex-1 w-full max-w-md">
                <UseCaseMockup type={uc.mockup} accent={uc.accent} />
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

// ─── Discover CTA strip ────────────────────────────────────────────────────────
function DiscoverStrip() {
  return (
    <FadeUp>
      <div className="mx-6 md:mx-auto max-w-6xl rounded-2xl overflow-hidden relative" style={{ backgroundColor: "#0d1821", border: "1px solid rgba(133,237,181,0.12)" }}>
        {/* glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 80% at 20% 50%, rgba(133,237,181,0.06) 0%, transparent 60%)" }} />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-8">
          <div>
            <p className="font-bold text-[22px] tracking-[-0.8px] mb-1" style={{ color: "#ebf0f5" }}>Ready to explore the market?</p>
            <p className="text-[14px]" style={{ color: "rgba(140,158,174,0.8)" }}>18,400+ verified experts across every discipline. Browse live.</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/signup" className="text-[13px] font-medium px-5 py-2.5 rounded-xl border transition-all duration-200 hover:bg-white/[0.05]"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(190,210,228,0.85)" }}>
              Create account
            </Link>
            <Link href="/discover" className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_20px_rgba(133,237,181,0.2)]"
              style={{ backgroundColor: "#85edb5", color: "#08111a" }}>
              Open marketplace
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

// ─── How it works ──────────────────────────────────────────────────────────────
const steps = [
  { n: "01", icon: Search, title: "Browse the live market", body: "Filter experts by discipline, region, language, or availability. See real-time pricing and session depth — just like reading a stock screener." },
  { n: "02", icon: BarChart2, title: "Read the order book", body: "View bid/ask spreads, session depth, and historical rate charts. Spot pricing opportunities or wait for a dip before booking." },
  { n: "03", icon: Clock, title: "Book spot or forward", body: "Lock in an immediate session or place a forward contract at today's price. Set alerts for when your preferred expert's rate moves." },
  { n: "04", icon: Star, title: "Execute and rate", body: "Run your session. Leave verified feedback and build a on-platform track record that benefits the whole community." },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 border-t" style={{ backgroundColor: "#0a151f", borderColor: "rgba(255,255,255,0.055)" }}>
      <div className="max-w-5xl mx-auto px-6">
        <FadeUp className="text-center mb-20">
          <p className="text-[11px] font-semibold tracking-[2px] uppercase mb-4" style={{ color: "rgba(133,237,181,0.65)" }}>How it works</p>
          <h2 className="font-bold text-[34px] md:text-[46px] tracking-[-1.6px] leading-[1.08]" style={{ color: "#ebf0f5" }}>
            From discovery to<br /><span style={{ color: "#85edb5" }}>execution in minutes.</span>
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((s, i) => (
            <FadeUp key={s.n} delay={i * 0.08}>
              <div className="flex gap-5 p-6 rounded-2xl border" style={{ backgroundColor: "#0d1821", borderColor: "rgba(255,255,255,0.07)" }}>
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(133,237,181,0.08)" }}>
                  <s.icon className="w-5 h-5" style={{ color: "#85edb5" }} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold tracking-[1px]" style={{ color: "rgba(133,237,181,0.5)" }}>{s.n}</span>
                    <h3 className="font-semibold text-[15px] tracking-[-0.3px]" style={{ color: "#ebf0f5" }}>{s.title}</h3>
                  </div>
                  <p className="text-[13px] leading-[1.65]" style={{ color: "rgba(128,143,158,0.75)" }}>{s.body}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Markets ───────────────────────────────────────────────────────────────────
const markets = [
  { label: "Technology", sub: "AI, Eng, Infra, Security", count: "4,200+", color: "#85edb5" },
  { label: "Finance", sub: "VC, PE, Public markets", count: "2,800+", color: "#60a5fa" },
  { label: "Healthcare", sub: "Clinical, Bio, MedTech", count: "1,900+", color: "#4adecc" },
  { label: "Education", sub: "K-12, Higher Ed, Tutoring", count: "3,100+", color: "#a78bfa" },
  { label: "Strategy", sub: "GTM, Ops, M&A", count: "1,600+", color: "#fb923c" },
  { label: "Creative", sub: "Design, Brand, Content", count: "2,300+", color: "#f472b6" },
  { label: "Legal", sub: "IP, Corp, Compliance", count: "1,200+", color: "#facc15" },
  { label: "Science", sub: "Research, R&D, Climate", count: "940+", color: "#34d399" },
];

function Markets() {
  return (
    <section id="markets" className="py-24" style={{ backgroundColor: "#08111a" }}>
      <div className="max-w-5xl mx-auto px-6">
        <FadeUp className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[2px] uppercase mb-3" style={{ color: "rgba(133,237,181,0.65)" }}>Markets</p>
            <h2 className="font-bold text-[30px] md:text-[38px] tracking-[-1.4px] leading-[1.1]" style={{ color: "#ebf0f5" }}>
              Every discipline,<br /><span style={{ color: "#85edb5" }}>one exchange.</span>
            </h2>
          </div>
          <Link href="/discover" className="group flex items-center gap-1.5 text-[13px] font-medium transition-colors duration-150 hover:opacity-100" style={{ color: "rgba(133,237,181,0.75)" }}>
            Explore all <ChevronRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </FadeUp>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {markets.map((m, i) => (
            <FadeUp key={m.label} delay={i * 0.04}>
              <Link href="/discover">
                <div className="group flex flex-col p-5 rounded-2xl border cursor-pointer transition-all duration-200 hover:border-white/[0.13]" style={{ backgroundColor: "#0d1821", borderColor: "rgba(255,255,255,0.07)" }}>
                  <div className="w-2 h-2 rounded-full mb-4" style={{ backgroundColor: m.color }} />
                  <span className="font-semibold text-[14px] tracking-[-0.2px] mb-0.5" style={{ color: "#ebf0f5" }}>{m.label}</span>
                  <span className="text-[11px] mb-2 leading-snug" style={{ color: "rgba(120,138,154,0.6)" }}>{m.sub}</span>
                  <span className="text-[11px] font-semibold mt-auto" style={{ color: m.color }}>{m.count} experts</span>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Social proof ──────────────────────────────────────────────────────────────
const testimonials = [
  { quote: "The order book mechanic completely changed how I think about advisory time. I watch for dips and book forward — locked in three months at a fraction of spot.", name: "Marcus T.", role: "Growth lead, Series B" },
  { quote: "I've listed on every advisory platform. TimeExchange is the only one that feels like a real market. My calendar fills itself — I just set my pricing curve.", name: "Dr. Priya R.", role: "ML researcher & advisor" },
  { quote: "Had an expert on a call within 20 minutes of a term sheet hitting our desk. The spot market is genuinely instant.", name: "Sarah W.", role: "Partner, early-stage VC" },
];

function Testimonials() {
  return (
    <section className="py-24 border-t" style={{ backgroundColor: "#0a151f", borderColor: "rgba(255,255,255,0.055)" }}>
      <div className="max-w-5xl mx-auto px-6">
        <FadeUp className="text-center mb-14">
          <h2 className="font-bold text-[30px] md:text-[38px] tracking-[-1.3px]" style={{ color: "#ebf0f5" }}>What traders say.</h2>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="flex flex-col p-6 rounded-2xl border h-full" style={{ backgroundColor: "#0d1821", borderColor: "rgba(255,255,255,0.07)" }}>
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-current" style={{ color: "#85edb5" }} />)}
                </div>
                <p className="text-[13.5px] leading-[1.7] flex-1 mb-6" style={{ color: "rgba(165,183,199,0.85)" }}>&ldquo;{t.quote}&rdquo;</p>
                <div className="border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <p className="font-semibold text-[13px]" style={{ color: "#ebf0f5" }}>{t.name}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "rgba(120,138,154,0.65)" }}>{t.role}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ─────────────────────────────────────────────────────────────────
function FinalCTA() {
  const dotsC = [
    { x: 60, y: 40, c: 0 }, { x: 160, y: 100, c: 2 }, { x: 80, y: 180, c: 1 },
    { x: 200, y: 60, c: 3 }, { x: 40, y: 240, c: 2 }, { x: 240, y: 160, c: 0 },
  ];
  return (
    <section className="py-32 relative overflow-hidden" style={{ backgroundColor: "#08111a" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 55% 65% at 50% 50%, rgba(133,237,181,0.08) 0%, transparent 65%)" }} />
      <div className="absolute top-0 right-0 w-[300px] h-full pointer-events-none overflow-hidden opacity-40">
        {dotsC.map((d, i) => { const { animate, transition } = getDotMotion(i); const color = dotColors[d.c]; return (
          <motion.span key={i} className="absolute" style={{ left: d.x, top: d.y }} animate={animate} transition={transition}>
            <span className="absolute rounded-full" style={{ width: 20, height: 20, border: `1.5px solid ${color.ring}` }} />
            <span className="absolute rounded-full" style={{ left: 6, top: 6, width: 8, height: 8, backgroundColor: color.fill }} />
          </motion.span>
        ); })}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <FadeUp>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-semibold tracking-[0.6px] uppercase mb-8" style={{ borderColor: "rgba(133,237,181,0.2)", backgroundColor: "rgba(133,237,181,0.06)", color: "#85edb5" }}>
            <Users className="w-3.5 h-3.5" />
            18,400+ experts listed
          </div>
          <h2 className="font-bold tracking-[-2.2px] leading-[1.05] mb-5" style={{ color: "#ebf0f5", fontSize: "clamp(34px, 5vw, 58px)" }}>
            Your expertise is<br /><span style={{ color: "#85edb5" }}>a tradeable asset.</span>
          </h2>
          <p className="text-[16px] leading-[1.65] mb-10 max-w-lg mx-auto" style={{ color: "rgba(145,163,179,0.8)" }}>
            Join the exchange. Set your pricing, define your market, and let demand come to you — or start as a buyer and access the world&apos;s best minds on demand.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup" className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-[15px] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_36px_rgba(133,237,181,0.25)]" style={{ backgroundColor: "#85edb5", color: "#08111a" }}>
              Create free account
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link href="/discover" className="flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-[15px] border transition-all duration-200 hover:border-white/[0.2] hover:bg-white/[0.04]" style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(190,210,228,0.9)" }}>
              <Globe className="w-4 h-4 opacity-70" />
              Explore marketplace
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { heading: "Platform", links: ["Discover", "Trading terminal", "Markets", "Pricing"] },
    { heading: "Company", links: ["About", "Blog", "Careers", "Press"] },
    { heading: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
  ];
  return (
    <footer className="pt-16 pb-10 border-t" style={{ backgroundColor: "#070f17", borderColor: "rgba(255,255,255,0.055)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          <div className="col-span-2">
            <p className="font-bold text-[18px] tracking-[-0.8px] mb-1.5" style={{ color: "#ebf0f5" }}>TimeExchange</p>
            <p className="text-[8px] font-semibold tracking-[2px] uppercase mb-5" style={{ color: "rgba(133,237,181,0.35)" }}>Global Expertise Exchange</p>
            <p className="text-[13px] leading-[1.65] max-w-xs" style={{ color: "rgba(115,132,148,0.7)" }}>
              The world&apos;s first real-time marketplace for expert time — priced, discovered, and traded like any other asset.
            </p>
          </div>
          {cols.map(col => (
            <div key={col.heading}>
              <p className="text-[10px] font-bold tracking-[1.5px] uppercase mb-4" style={{ color: "rgba(115,132,148,0.5)" }}>{col.heading}</p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(l => (
                  <li key={l}><a href="#" className="text-[13px] transition-colors duration-150 hover:text-white" style={{ color: "rgba(145,163,179,0.6)" }}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "rgba(255,255,255,0.055)" }}>
          <p className="text-[12px]" style={{ color: "rgba(95,113,129,0.55)" }}>© 2026 TimeExchange. All rights reserved.</p>
          <p className="text-[12px]" style={{ color: "rgba(95,113,129,0.4)" }}>Not financial advice. Expert sessions are not regulated instruments.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────
export function LandingPage() {
  return (
    <div className="dark" style={{ fontFamily: "Inter, SF Pro Display, sans-serif" }}>
      <Navbar />
      <Hero />
      <UseCases />
      <DiscoverStrip />
      <HowItWorks />
      <Markets />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}
