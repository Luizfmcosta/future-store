"use client";

import type { SearchView } from "@/components/search/SearchViewTabs";
import { useStorefrontMinWidth } from "@/lib/hooks/useStorefrontMinWidth";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MessageCircle, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

/**
 * Tailwind container `@md` default = 28rem (448px). Labels use `@md:*` so they follow the
 * storefront frame width, not the browser viewport (wide screen + narrow preview was showing text).
 */
const STOREFRONT_LABEL_MIN_PX = 448;

type SearchModeTabsProps = {
  active: SearchView;
  className?: string;
};

const thumbSpring = {
  type: "spring" as const,
  stiffness: 520,
  damping: 34,
  mass: 0.7,
};

export function SearchModeTabs({ active, className }: SearchModeTabsProps) {
  const searchParams = useSearchParams();
  const t = useT();
  const showLabels = useStorefrontMinWidth(STOREFRONT_LABEL_MIN_PX);

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

  const segmentClass = (isOn: boolean) =>
    cn(
      "relative z-10 flex h-full min-h-0 min-w-0 flex-1 items-center justify-center gap-1 rounded-full px-2.5 py-1 text-[15px] font-medium leading-none transition-colors duration-200 @md:gap-2 @md:px-3.5 @md:py-1.5 @md:text-[16px]",
      /* Colors align with `ui.home` label / card title (search lives on the same light storefront). */
      isOn ? "font-semibold text-stone-900" : "text-stone-600",
    );

  const iconClass = (isOn: boolean) =>
    cn("size-[17px] shrink-0 @md:size-[19px]", isOn ? "text-stone-900" : "text-stone-400");

  return (
    <div className={cn("flex w-full items-center justify-center px-0.5", className)}>
      <nav
        role="tablist"
        aria-label={t("searchSerp.modeAria")}
        className="relative w-full max-w-[11.75rem] @md:max-w-[21rem]"
      >
        <div
          className={cn(
            "relative flex h-12 min-h-12 w-full items-stretch rounded-full p-1",
            /* Same gray family as eyebrow label text / editorial chips on white. */
            "bg-[#f0f0f0] shadow-[inset_0_1px_0_rgba(0,0,0,0.05)]",
          )}
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1 top-1 z-0 h-[calc(100%-8px)] rounded-full border border-stone-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
            style={{ width: "calc((100% - 8px) / 2)" }}
            initial={false}
            animate={{ x: active === "results" ? 0 : "100%" }}
            transition={thumbSpring}
          />
          <Link
            href={hrefFor("results")}
            scroll={false}
            role="tab"
            id="tab-regular-search"
            aria-label={showLabels ? undefined : t("searchSerp.modeRegular")}
            aria-controls="search-panel-regular"
            aria-selected={active === "results"}
            tabIndex={active === "results" ? 0 : -1}
            className={cn(
              segmentClass(active === "results"),
              "outline-none focus-visible:ring-2 focus-visible:ring-stone-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
            )}
          >
            <Search className={iconClass(active === "results")} strokeWidth={2} aria-hidden />
            <span className="hidden truncate leading-none @md:inline">{t("searchSerp.modeRegular")}</span>
          </Link>
          <Link
            href={hrefFor("ai")}
            scroll={false}
            role="tab"
            id="tab-ai-mode"
            aria-label={showLabels ? undefined : t("searchSerp.modeAi")}
            aria-controls="search-panel-ai"
            aria-selected={active === "ai"}
            tabIndex={active === "ai" ? 0 : -1}
            className={cn(
              segmentClass(active === "ai"),
              "outline-none focus-visible:ring-2 focus-visible:ring-stone-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
            )}
          >
            <MessageCircle className={iconClass(active === "ai")} strokeWidth={2} aria-hidden />
            <span className="hidden truncate leading-none @md:inline">{t("searchSerp.modeAi")}</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
