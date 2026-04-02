"use client";

import { SearchCommandOverlay } from "@/components/search/SearchCommandOverlay";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { Search } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

const AI_FOLLOWUP_SELECTOR = "[data-ai-followup-input]";

/**
 * Bottom floating search pill. Opens centered command overlay.
 * On PDP the pill is inlined next to Add to cart — see product page.
 */
export function FloatingSearchDock() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const open = useDemoStore((s) => s.searchOverlayOpen);
  const setOpen = useDemoStore((s) => s.setSearchOverlayOpen);

  const hideFloatingPill = useMemo(
    () => pathname === "/search" && searchParams.get("view") === "ai",
    [pathname, searchParams],
  );

  const isPdp = pathname.startsWith("/product/");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (hideFloatingPill) {
          const el = document.querySelector<HTMLElement>(AI_FOLLOWUP_SELECTOR);
          el?.focus();
          return;
        }
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hideFloatingPill, setOpen]);

  return (
    <>
      {!hideFloatingPill && !isPdp ? (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[60] flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              ui.searchBar,
              "pointer-events-auto flex h-11 w-full max-w-xl items-center gap-2.5 rounded-full border-white/[0.08] bg-[#14161c]/95 px-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-[box-shadow,border-color] duration-200 hover:border-white/[0.1] hover:shadow-[0_12px_40px_rgba(0,0,0,0.55)]",
              "text-left",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/20",
            )}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            <Search className="size-[17px] shrink-0 text-[#9ca8b8]" strokeWidth={2} aria-hidden />
            <span className="truncate text-[14px] text-[#8b96a8]">Ask anything</span>
          </button>
        </div>
      ) : null}

      <SearchCommandOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
