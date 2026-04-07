"use client";

import { SearchModeTabs } from "@/components/search/SearchModeTabs";
import { getSearchViewParam } from "@/components/search/SearchViewTabs";
import { motion, useAnimationControls } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

/** Same easing as FloatingSearchDock — hide on scroll down, show on scroll up */
const ease = [0.76, 0, 0.24, 1] as [number, number, number, number];

const SEARCH_FIELD_SEL = "[data-storefront-search-field]";
const MAIN_SCROLL_SEL = "[data-storefront-window] main";
const AI_CHAT_SCROLL_SEL = "[data-storefront-ai-scroll]";

function getSearchTabScrollEl(view: "results" | "ai"): HTMLElement | null {
  if (view === "ai") {
    return document.querySelector<HTMLElement>(AI_CHAT_SCROLL_SEL);
  }
  return document.querySelector<HTMLElement>(MAIN_SCROLL_SEL);
}

function focusIsInSearchField(el: Element | null): boolean {
  return el instanceof Element && el.closest(SEARCH_FIELD_SEL) !== null;
}

export function SearchResultsFloatingTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = getSearchViewParam(searchParams);

  const show = useMemo(() => pathname === "/search", [pathname]);

  const [searchFieldFocused, setSearchFieldFocused] = useState(false);
  const searchFieldFocusedRef = useRef(false);
  useEffect(() => {
    searchFieldFocusedRef.current = searchFieldFocused;
  }, [searchFieldFocused]);

  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      if (focusIsInSearchField(e.target as Element)) setSearchFieldFocused(true);
    };
    const onFocusOut = () => {
      queueMicrotask(() => {
        setSearchFieldFocused(focusIsInSearchField(document.activeElement));
      });
    };
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  const controls = useAnimationControls();
  const lastScrollY = useRef(0);
  const hidden = useRef(false);

  const onScroll = useCallback(() => {
    if (!show || searchFieldFocusedRef.current) return;
    const scrollEl = getSearchTabScrollEl(view);
    if (!scrollEl) return;

    const y = scrollEl.scrollTop;
    const delta = y - lastScrollY.current;
    lastScrollY.current = y;

    if (delta > 8 && y > 200 && !hidden.current) {
      hidden.current = true;
      void controls.start({ y: 64, opacity: 0, transition: { duration: 0.35, ease } });
    } else if (delta < -4 && hidden.current) {
      hidden.current = false;
      void controls.start({ y: 0, opacity: 1, transition: { duration: 0.4, ease } });
    }
  }, [controls, show, view]);

  useEffect(() => {
    if (!show) return;
    const scrollEl = getSearchTabScrollEl(view);
    lastScrollY.current = scrollEl?.scrollTop ?? 0;
    hidden.current = false;
    void (async () => {
      if (searchFieldFocusedRef.current) {
        await controls.start({ opacity: 0, y: 18, transition: { duration: 0.2, ease } });
      } else {
        await controls.start({ y: 0, opacity: 1, transition: { duration: 0.35, ease } });
      }
    })();
  }, [show, view, controls]);

  useEffect(() => {
    if (!show) return;
    void (async () => {
      if (searchFieldFocused) {
        await controls.start({ opacity: 0, y: 18, transition: { duration: 0.2, ease } });
      } else {
        await controls.start({
          y: hidden.current ? 64 : 0,
          opacity: hidden.current ? 0 : 1,
          transition: { duration: hidden.current ? 0.35 : 0.4, ease },
        });
      }
    })();
  }, [searchFieldFocused, show, controls]);

  useLayoutEffect(() => {
    if (!show) return;
    const scrollEl = getSearchTabScrollEl(view);
    if (!scrollEl) return;
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", onScroll);
  }, [onScroll, show, view]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={controls}
      className="pointer-events-none absolute bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] left-0 right-0 z-[55] flex justify-center px-4 sm:px-6"
    >
      <div className="pointer-events-auto">
        <SearchModeTabs active={view} />
      </div>
    </motion.div>
  );
}
