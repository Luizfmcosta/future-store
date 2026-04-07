"use client";

import type { SearchView } from "@/components/search/SearchViewTabs";
import { cn } from "@/lib/utils";
import { LayoutGrid, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type SearchModeTabsProps = {
  active: SearchView;
  className?: string;
};

/**
 * Google-style mode switcher: Regular Search vs AI Mode (`?view=ai`).
 */
export function SearchModeTabs({ active, className }: SearchModeTabsProps) {
  const searchParams = useSearchParams();

  const hrefFor = (view: SearchView) => {
    const p = new URLSearchParams(searchParams.toString());
    if (view === "ai") {
      p.set("view", "ai");
    } else {
      p.delete("view");
    }
    const s = p.toString();
    return s ? `/search?${s}` : "/search";
  };

  return (
    <nav
      role="tablist"
      aria-label="Search mode"
      className={cn("flex w-full gap-0 border-b border-stone-200/90", className)}
    >
      <Link
        href={hrefFor("results")}
        scroll={false}
        role="tab"
        id="tab-regular-search"
        aria-controls="search-panel-regular"
        aria-selected={active === "results"}
        tabIndex={active === "results" ? 0 : -1}
        className={cn(
          "relative flex min-h-9 min-w-0 flex-1 items-center justify-center gap-2 border-b-2 border-transparent px-3 py-1.5 text-[13px] font-medium transition-colors sm:min-h-10 sm:gap-2.5 sm:px-4 sm:py-2",
          active === "results"
            ? "border-stone-900 text-stone-900"
            : "border-transparent text-stone-500 hover:text-stone-700"
        )}
      >
        <LayoutGrid className="size-4 shrink-0 opacity-90" strokeWidth={2} aria-hidden />
        <span className="truncate">Regular Search</span>
      </Link>
      <Link
        href={hrefFor("ai")}
        scroll={false}
        role="tab"
        id="tab-ai-mode"
        aria-controls="search-panel-ai"
        aria-selected={active === "ai"}
        tabIndex={active === "ai" ? 0 : -1}
        className={cn(
          "relative flex min-h-9 min-w-0 flex-1 items-center justify-center gap-2 border-b-2 border-transparent px-3 py-1.5 text-[13px] font-medium transition-colors sm:min-h-10 sm:gap-2.5 sm:px-4 sm:py-2",
          active === "ai"
            ? "border-stone-900 text-stone-900"
            : "border-transparent text-stone-500 hover:text-stone-700"
        )}
      >
        <Sparkles className="size-4 shrink-0 text-violet-600" strokeWidth={2} aria-hidden />
        <span className="truncate">AI Mode</span>
      </Link>
    </nav>
  );
}
