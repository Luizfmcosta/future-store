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

  /** Fresh composer on home — query persists across search/PDP while the dock is hidden or other routes use it. */
  useEffect(() => {
    if (pathname !== "/") return;
    setQuery("");
    clearPromptProductRefs();
  }, [pathname, setQuery, clearPromptProductRefs]);

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
