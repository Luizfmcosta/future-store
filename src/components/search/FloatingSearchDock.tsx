"use client";

import { SearchCommandOverlay } from "@/components/search/SearchCommandOverlay";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { motion, useAnimationControls } from "framer-motion";
import { Search } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";

const AI_FOLLOWUP_SELECTOR = "[data-ai-followup-input]";
const ease = [0.76, 0, 0.24, 1] as [number, number, number, number];

export function FloatingSearchDock() {
  const t = useT();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const open = useDemoStore((s) => s.searchOverlayOpen);
  const setOpen = useDemoStore((s) => s.setSearchOverlayOpen);

  const hideFloatingPill = useMemo(
    () => pathname === "/search" && searchParams.get("view") === "ai",
    [pathname, searchParams],
  );

  const isPdp = pathname.startsWith("/product/");

  const controls = useAnimationControls();
  const lastScrollY = useRef(0);
  const hidden = useRef(false);

  const onScroll = useCallback(() => {
    const scrollEl = document.querySelector<HTMLElement>(
      "[data-storefront-window] main",
    );
    if (!scrollEl) return;

    const y = scrollEl.scrollTop;
    const delta = y - lastScrollY.current;
    lastScrollY.current = y;

    if (delta > 8 && y > 200 && !hidden.current) {
      hidden.current = true;
      controls.start({ y: 80, opacity: 0, transition: { duration: 0.35, ease } });
    } else if (delta < -4 && hidden.current) {
      hidden.current = false;
      controls.start({ y: 0, opacity: 1, transition: { duration: 0.4, ease } });
    }
  }, [controls]);

  useEffect(() => {
    const scrollEl = document.querySelector<HTMLElement>(
      "[data-storefront-window] main",
    );
    if (!scrollEl) return;
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", onScroll);
  }, [onScroll]);

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
        <motion.div
          initial={{ y: 0, opacity: 1 }}
          animate={controls}
          className={cn(
            "pointer-events-none absolute bottom-0 left-0 right-0 z-[60] flex justify-center px-4 sm:px-6",
            ui.floatingSearchBarRowPad,
          )}
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              "pointer-events-auto flex h-10 w-full transition-all duration-200",
              ui.floatingSearchPill,
              ui.floatingSearchPillText,
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-stone-400/40",
            )}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            <Search className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
            <span className="truncate">
              {t("floatingSearch.placeholder")}
            </span>
          </button>
        </motion.div>
      ) : null}

      <SearchCommandOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
