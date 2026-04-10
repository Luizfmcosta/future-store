"use client";

import { FloatingPromptDock } from "@/components/search/FloatingPromptDock";
import { StorefrontOverlayPortal } from "@/components/shared/StorefrontOverlayPortal";
import { useDemoStore } from "@/store/demoStore";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

const AI_FOLLOWUP_SELECTOR = "[data-ai-followup-input]";

export function FloatingSearchDock() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cartDrawerOpen = useDemoStore((s) => s.cartDrawerOpen);
  const setQuery = useDemoStore((s) => s.setQuery);
  const clearPromptProductRefs = useDemoStore((s) => s.clearPromptProductRefs);

  const hideFloatingPill = useMemo(
    () => pathname === "/search" && searchParams.get("view") === "ai",
    [pathname, searchParams],
  );

  /** Context badges are page-scoped — clear when the route changes (any page). */
  useEffect(() => {
    clearPromptProductRefs();
  }, [pathname, clearPromptProductRefs]);

  /** Fresh composer text on home; query still persists across search/PDP when not on home. */
  useEffect(() => {
    if (pathname !== "/") return;
    setQuery("");
  }, [pathname, setQuery]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (hideFloatingPill) {
          const el = document.querySelector<HTMLElement>(AI_FOLLOWUP_SELECTOR);
          el?.focus();
          return;
        }
        document.querySelector<HTMLElement>("[data-storefront-search-field]")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hideFloatingPill]);

  if (hideFloatingPill) return null;
  /** Prompt is rendered below the cart bottom sheet inside {@link StorefrontCartOverlay} (same z layer). */
  if (cartDrawerOpen) return null;

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
