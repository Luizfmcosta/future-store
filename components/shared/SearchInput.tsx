"use client";

import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useDemoStore } from "@/store/demoStore";

export function SearchInput({ className, compact }: { className?: string; compact?: boolean }) {
  const router = useRouter();
  const currentQuery = useDemoStore((s) => s.currentQuery);
  const setQuery = useDemoStore((s) => s.setQuery);
  const runSearch = useDemoStore((s) => s.runSearch);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      runSearch(currentQuery);
      router.push("/search");
    },
    [currentQuery, runSearch, router]
  );

  return (
    <form onSubmit={onSubmit} className={cn("w-full min-w-0", className)}>
      <div
        className={cn(
          ui.searchBar,
          "group flex w-full items-center gap-1 px-2",
          compact ? "min-h-[34px] py-0.5" : "min-h-[40px] px-2.5"
        )}
      >
        <button
          type="submit"
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#9ca8b8]",
            "transition-colors hover:bg-white/[0.08] hover:text-[#eef1f6]",
            ui.focusRing,
            "focus-visible:rounded-full",
            !compact && "h-8 w-8"
          )}
          aria-label="Search"
        >
          <Search className={cn("h-[15px] w-[15px]", !compact && "h-4 w-4")} strokeWidth={2} aria-hidden />
        </button>
        <input
          value={currentQuery}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe what you need…"
          className={cn(
            "min-w-0 flex-1 border-0 bg-transparent py-2 pr-2 text-[15px] text-[#eef1f6] outline-none ring-0",
            "placeholder:text-[#9ca8b8]",
            compact && "py-1.5 text-[13px]"
          )}
          aria-label="Search query"
        />
      </div>
    </form>
  );
}
