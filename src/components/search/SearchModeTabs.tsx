"use client";

import type { SearchView } from "@/components/search/SearchViewTabs";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type SearchModeTabsProps = {
  active: SearchView;
  className?: string;
};

/** Same spring as AppShell width presets — smooth segment slide */
const highlightSpring = {
  type: "spring" as const,
  stiffness: 520,
  damping: 34,
  mass: 0.7,
};

const tabLink =
  "relative z-10 flex min-h-[1.75rem] min-w-0 flex-1 shrink-0 items-center justify-center rounded-full px-3 py-0.5 text-center text-[11px] font-medium leading-none outline-none transition-colors duration-200 sm:min-h-8 sm:px-4 sm:py-1 sm:text-[12px] focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-0";

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
        "relative inline-flex min-h-8 w-max max-w-[min(100%,32rem)] items-stretch rounded-full bg-[#2a2a2a]/75 p-0.5 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xl",
        className,
      )}
    >
      <motion.div
        className="pointer-events-none absolute left-0.5 top-0.5 bottom-0.5 rounded-full bg-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
        style={{ width: "calc((100% - 4px) / 2)" }}
        initial={false}
        animate={{ x: active === "results" ? 0 : "100%" }}
        transition={highlightSpring}
      />
      <Link
        href={hrefFor("results")}
        scroll={false}
        role="tab"
        id="tab-regular-search"
        aria-controls="search-panel-regular"
        aria-selected={active === "results"}
        tabIndex={active === "results" ? 0 : -1}
        className={cn(
          tabLink,
          active === "results"
            ? "text-white"
            : "text-white/80 hover:bg-white/[0.08] hover:text-white",
        )}
      >
        <span className="whitespace-nowrap">{t("searchSerp.modeRegular")}</span>
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
          tabLink,
          active === "ai" ? "text-white" : "text-white/80 hover:bg-white/[0.08] hover:text-white",
        )}
      >
        <span className="whitespace-nowrap">{t("searchSerp.modeAi")}</span>
      </Link>
    </nav>
  );
}
