"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bell,
  Brain,
  Calendar,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useTerminalStore } from "@/lib/terminal-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TerminalLiveTicker } from "./TerminalLiveTicker";

interface TerminalShellProps {
  userEmail: string;
  userName: string | null;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { id: "dashboard" as const, label: "Terminal", icon: Activity, href: "/terminal" },
  { id: "spot" as const, label: "Spot", icon: Zap, href: "/terminal/spot" },
  { id: "futures" as const, label: "Futures", icon: Calendar, href: "/terminal/futures" },
];

export function TerminalShell({ userEmail, userName, children }: TerminalShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { bumpLiveTick } = useTerminalStore();

  // Live simulation tick
  useEffect(() => {
    const id = setInterval(() => bumpLiveTick(), 2500);
    return () => clearInterval(id);
  }, [bumpLiveTick]);

  const activeNav =
    pathname === "/terminal"
      ? "dashboard"
      : pathname.startsWith("/terminal/spot")
        ? "spot"
        : pathname.startsWith("/terminal/futures")
          ? "futures"
          : "dashboard";

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : userEmail[0]?.toUpperCase() ?? "U";

  return (
    <div className="flex h-screen flex-col bg-[#060d16] text-foreground overflow-hidden">
      {/* ── Top terminal header ── */}
      <header className="relative z-30 flex-shrink-0 border-b border-white/[0.06] bg-[#080f19]/90 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-2.5">
          {/* Brand */}
          <Link href="/terminal" className="flex items-center gap-3 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary transition-colors group-hover:bg-primary/25">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[0.95rem] font-bold tracking-[-0.05em] text-foreground">
                TimeExchange
              </div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-primary/70">
                Trading Terminal
              </div>
            </div>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <Link key={item.id} href={item.href}>
                  <motion.div
                    className={cn(
                      "relative flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-medium transition-colors",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-xl border border-white/10 bg-white/[0.04]"
                        layoutId="terminal-nav"
                        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
            <Link
              href="/discover"
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground"
            >
              Discovery
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg border border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
            >
              <Brain className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg border border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
            >
              <Bell className="h-3.5 w-3.5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex h-8 items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 text-xs hover:bg-white/[0.06] transition-colors"
              >
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/20 text-[10px] font-bold text-primary">
                    {initials}
                  </div>
                  <span className="hidden text-foreground sm:inline">
                    {userName ?? userEmail.split("@")[0]}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 rounded-xl border-white/10 bg-[#0c1520]/95 p-1.5 backdrop-blur-xl"
              >
                <div className="px-2.5 py-2">
                  <div className="text-xs font-medium text-foreground">
                    {userName ?? "User"}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{userEmail}</div>
                </div>
                <DropdownMenuSeparator className="bg-white/[0.06]" />
                <DropdownMenuItem
                  className="rounded-lg text-xs"
                  onClick={() => router.push("/account")}
                >
                  <User className="mr-2 h-3.5 w-3.5" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-lg text-xs"
                  onClick={() => router.push("/terminal")}
                >
                  <Settings className="mr-2 h-3.5 w-3.5" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/[0.06]" />
                <DropdownMenuItem
                  className="rounded-lg text-xs text-destructive focus:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Live ticker */}
        <TerminalLiveTicker />
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
