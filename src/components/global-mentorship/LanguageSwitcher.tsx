"use client";

import { Check, Globe } from "lucide-react";
import { useMarketStore } from "@/lib/store";
import { ALL_LANGUAGES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { selectedLanguage, setSelectedLanguage } = useMarketStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-10 items-center gap-2 rounded-2xl border border-border/40 bg-card/30 px-3 text-sm font-medium text-foreground transition-colors hover:bg-card/45">
        <Globe className="h-4 w-4 text-primary" />
        <span className="hidden sm:inline">
          {selectedLanguage || "All languages"}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52 rounded-2xl border-border/50 bg-card/95 p-1.5 backdrop-blur-xl"
      >
        <DropdownMenuItem
          onClick={() => setSelectedLanguage(null)}
          className={cn(
            "rounded-xl px-2 py-1.5 text-sm",
            !selectedLanguage && "text-primary"
          )}
        >
          <span className="flex-1">All languages</span>
          {!selectedLanguage && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {ALL_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language}
            onClick={() => setSelectedLanguage(language)}
            className={cn(
              "rounded-xl px-2 py-1.5 text-sm",
              selectedLanguage === language && "text-primary"
            )}
          >
            <span className="flex-1">{language}</span>
            {selectedLanguage === language && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
