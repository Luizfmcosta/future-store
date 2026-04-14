"use client";

import { FloatingPromptDock } from "@/components/search/FloatingPromptDock";
import { StorefrontOverlayPortal } from "@/components/shared/StorefrontOverlayPortal";
import { useDemoStore } from "@/store/demoStore";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

const AI_FOLLOWUP_SELECTOR = "[data-ai-followup-input]";

export function FloatingSearchDock() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cartDrawerOpen = useDemoStore((s) => s.cartDrawerOpen);
  const pdpSearchOverlayOpen = useDemoStore((s) => s.pdpSearchOverlayOpen);
  const pdpChatOverlayOpen = useDemoStore((s) => s.pdpChatOverlayOpen);
  const setQuery = useDemoStore((s) => s.setQuery);
  const clearPromptProductRefs = useDemoStore((s) => s.clearPromptProductRefs);
  const prevPathnameRef = useRef<string | null>(null);
  /** PDP sets chips in `ProductPage` after navigation; clearing on every pathname (ancestor effect order) wiped them. */
  const prevPathnameForBadgesRef = useRef<string | null>(null);

  const hideFloatingPill = useMemo(
    () => pathname === "/search" && searchParams.get("view") === "ai",
    [pathname, searchParams],
  );

  /**
   * Context badges are page-scoped — clear when leaving PDP/PLP-style routes, but not when entering `/product/*`
   * (child layout adds the current SKU chip after this component’s effects run).
   */
  useEffect(() => {
    const prev = prevPathnameForBadgesRef.current;
    prevPathnameForBadgesRef.current = pathname;
    if (prev === null) {
      if (!pathname.startsWith("/product/")) {
        clearPromptProductRefs();
      }
      return;
    }
    if (pathname.startsWith("/product/")) return;
    clearPromptProductRefs();
  }, [pathname, clearPromptProductRefs]);

  /**
   * Clear the floating prompt when navigating away from `/search`.
   * Skip on first paint and when landing *on* `/search` so submit (`runSearch` + `router.push`) keeps the merged query.
   */
  useEffect(() => {
    const prev = prevPathnameRef.current;
    prevPathnameRef.current = pathname;
    if (prev === null) return;
    if (pathname === "/search") return;
    setQuery("");
  }, [pathname, setQuery]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (hideFloatingPill) {
          const el = document.querySelector<HTMLElement>(AI_FOLLOWUP_SELECTOR);
          el?.focus({ preventScroll: true });
          return;
        }
        document
          .querySelector<HTMLElement>("[data-storefront-search-field]")
          ?.focus({ preventScroll: true });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hideFloatingPill]);

  if (hideFloatingPill) return null;
  /** Prompt is rendered below the cart bottom sheet inside {@link StorefrontCartOverlay} (same z layer). */
  if (cartDrawerOpen) return null;
  if (pdpSearchOverlayOpen) return null;
  if (pdpChatOverlayOpen) return null;

  return (
    <StorefrontOverlayPortal>
      <div className="pointer-events-none absolute inset-0 z-[85]">
        <div className="pointer-events-none absolute bottom-0 left-0 right-0">
          <FloatingPromptDock />
        </div>
      </div>
    </StorefrontOverlayPortal>
  );
}
