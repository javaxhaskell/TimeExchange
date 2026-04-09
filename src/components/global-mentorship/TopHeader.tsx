"use client";

import { useRouter } from "next/navigation";
import { Activity, Search, User } from "lucide-react";
import { motion } from "framer-motion";
import { useMarketStore } from "@/lib/store";
import { useAuth } from "@/lib/useAuth";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { FavoriteMentorNotifications } from "./FavoriteMentorNotifications";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function TopHeader() {
  const { searchQuery, setSearchQuery } = useMarketStore();
  const { user, loading } = useAuth();
  const router = useRouter();

  return (
    <header className="relative z-20 border-b border-white/8 bg-background/85 backdrop-blur-xl">
      <div className="flex w-full items-center justify-between gap-5 px-4 py-4">
        <div className="min-w-[180px]">
          <div className="text-[1.22rem] font-bold tracking-[-0.07em] text-foreground">
            TimeExchange
          </div>
          <div className="mt-0.5 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-muted-foreground/65">
            Global expertise exchange
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-3xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search experts, markets, disciplines, or regions..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-11 rounded-[1rem] border-white/10 bg-white/[0.045] pl-9 pr-3 text-sm shadow-none focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary/15"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {!loading && user && (
            <Button
              variant="ghost"
              className="h-10 rounded-[1rem] border border-primary/20 bg-primary/10 px-4 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary/20 hover:scale-105 hover:shadow-[0_0_14px_rgba(133,237,181,0.15)]"
              onClick={() => router.push("/terminal")}
            >
              <Activity className="mr-1.5 h-4 w-4" />
              Terminal
            </Button>
          )}
          {/* Bell only renders for confirmed authenticated users — avoids SSR/localStorage hydration mismatch */}
          {!loading && user && <FavoriteMentorNotifications />}
          {/* Authenticated state: only render once confirmed, fading in */}
          {!loading && user ? (
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-[1rem] border border-white/8 bg-white/[0.045] text-foreground transition-all duration-200 hover:bg-white/[0.09] hover:border-primary/30 hover:scale-105 hover:shadow-[0_0_14px_rgba(133,237,181,0.12)]"
                onClick={() => router.push("/account")}
              >
                <User className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            /* Show immediately — no waiting for auth to resolve */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="h-10 px-4 flex items-center rounded-[1rem] border border-white/8 bg-white/[0.045] text-sm font-medium text-foreground/80 transition-all duration-200 hover:bg-white/[0.09] hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="h-10 px-4 flex items-center rounded-[1rem] text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_14px_rgba(133,237,181,0.2)]"
                style={{ backgroundColor: "#85edb5", color: "#08111a" }}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
