"use client";

import { Bell, Search, User } from "lucide-react";
import { useMarketStore } from "@/lib/store";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TopHeader() {
  const { searchQuery, setSearchQuery } = useMarketStore();

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
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-[1rem] border border-white/8 bg-white/[0.03] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-[1rem] border border-white/8 bg-white/[0.045] text-foreground hover:bg-white/[0.07]"
          >
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
