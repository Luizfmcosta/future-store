"use client";

import type { SearchView } from "@/components/search/SearchViewTabs";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import { LayoutGrid, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type SearchModeTabsProps = {
  active: SearchView;
  className?: string;
};

const tabBase =
  "flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 text-center text-[12px] font-medium transition-[color,background-color,box-shadow] duration-200 sm:min-h-11 sm:gap-2.5 sm:px-4 sm:text-[13px]";

const tabInactive =
  "text-white/70 hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-white/35";

const tabActive =
  "bg-white text-stone-900 shadow-[0_2px_12px_rgba(0,0,0,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-stone-400/45";

export function SearchModeTabs({ active, className }: SearchModeTabsProps) {
  const searchParams = useSearchParams();
  const t = useT();

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
      aria-label={t("searchSerp.modeAria")}
      className={cn(
        "flex w-full gap-0.5 rounded-full bg-[#2a2a2a]/75 p-1 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xl",
        className,
      )}
    >
      <Link
        href={hrefFor("results")}
        scroll={false}
        role="tab"
        id="tab-regular-search"
        aria-controls="search-panel-regular"
        aria-selected={active === "results"}
        tabIndex={active === "results" ? 0 : -1}
        className={cn(tabBase, active === "results" ? tabActive : tabInactive)}
      >
        <LayoutGrid
          className={cn("size-4 shrink-0", active === "results" ? "text-stone-600" : "text-white/75")}
          strokeWidth={2}
          aria-hidden
        />
        <span className="truncate">{t("searchSerp.modeRegular")}</span>
      </Link>
      <Link
        href={hrefFor("ai")}
        scroll={false}
        role="tab"
        id="tab-ai-mode"
        aria-controls="search-panel-ai"
        aria-selected={active === "ai"}
        tabIndex={active === "ai" ? 0 : -1}
        className={cn(tabBase, active === "ai" ? tabActive : tabInactive)}
      >
        <Sparkles
          className={cn("size-4 shrink-0", active === "ai" ? "text-violet-600" : "text-violet-300/95")}
          strokeWidth={2}
          aria-hidden
        />
        <span className="truncate">{t("searchSerp.modeAi")}</span>
      </Link>
    </nav>
  );
}
