"use client";

import { scrollStorefrontMainToTop } from "@/lib/scrollStorefrontMain";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import type { ShopperProfileId } from "@/types";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Main scroll region. Search Chat: no bottom padding on `main` — the follow-up bar is `absolute`
 * to the panel bottom and must align with `FloatingSearchDock` (sibling outside `main`, `bottom-0` on the shell).
 * Safe area + row padding live on `ui.floatingSearchBarRowPad` in the composer / dock only.
 */
export function StorefrontMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeProfile = useDemoStore((s) => s.activeProfile);
  const prevProfileOnHomeRef = useRef<ShopperProfileId | null>(null);

  /** Home: switching Marina ↔ Ricardo (or any profile) should land on the hero, not mid-page scroll. */
  useEffect(() => {
    if (pathname !== "/") {
      prevProfileOnHomeRef.current = activeProfile;
      return;
    }
    const prev = prevProfileOnHomeRef.current;
    if (prev !== null && prev !== activeProfile) {
      scrollStorefrontMainToTop();
    }
    prevProfileOnHomeRef.current = activeProfile;
  }, [pathname, activeProfile]);
  const isSearchAiMode = pathname === "/search" && searchParams.get("view") === "ai";
  /** Search / PDP: `main` is `px-0` so footer can go edge-to-edge (negative margins are clipped otherwise). */
  const isSearch = pathname === "/search";
  /** PLP results: `HomeFooterBleed` supplies dock clearance on `#121212` — avoid white `pb-32` under the footer. */
  const isSearchResults = pathname === "/search" && !isSearchAiMode;
  /** PDP: inner column scrolls; dock clearance lives in `HomeFooterBleed` on the product page. */
  const isPdp = pathname.startsWith("/product/");

  const isHome = pathname === "/";
  /** TopBar is absolute (floating); non–hero pages need offset so content clears the bar. */
  const mainTopForFloatingBar = "pt-[3.25rem] sm:pt-[3.75rem]";

  return (
    <main
      key={pathname}
      {...(isPdp ? { "data-pdp-scroll": "" } : {})}
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-x-hidden",
        /* No rubber-band past scroll bounds — avoids black `#121212` shell showing above/below white routes. */
        "overscroll-y-none",
        isHome
          ? "bg-[#121212]"
          : isSearch
            ? "bg-white px-0"
            : isPdp
              ? "bg-white px-0"
              : "bg-white px-4 sm:px-6",
        isPdp
          ? "min-h-0 scroll-smooth overflow-y-auto scrollbar-none"
          : isSearchAiMode
            ? "min-h-0 overflow-hidden"
            : "scroll-smooth overflow-y-auto scrollbar-none",
        isHome ? "pt-0" : mainTopForFloatingBar,
        isSearchAiMode
          ? "pb-0"
          : isPdp || isSearchResults
            ? "pb-[max(0.5rem,env(safe-area-inset-bottom))]"
            : isHome
              ? "pb-0"
              : "pb-32 sm:pb-32"
      )}
    >
      {/* `min-h-full` so %-height and flex-1 stacks below the fold can fill one storefront viewport before the footer. */}
      <div className="flex min-h-full w-full min-w-0 flex-1 flex-col">{children}</div>
    </main>
  );
}
