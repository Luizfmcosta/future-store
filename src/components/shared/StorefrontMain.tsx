"use client";

import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Main scroll region. Search Chat: no bottom padding on `main` — the follow-up bar is `absolute`
 * to the panel bottom and must align with `FloatingSearchDock` (sibling outside `main`, `bottom-0` on the shell).
 * Safe area + row padding live on `ui.floatingSearchBarRowPad` in the composer / dock only.
 */
export function StorefrontMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSearchAiMode = pathname === "/search" && searchParams.get("view") === "ai";
  /** PDP: inner column scrolls; bottom inset for floating prompt matches other white routes (see product page `pb-32`). */
  const isPdp = pathname.startsWith("/product/");

  const isHome = pathname === "/";
  /** TopBar is absolute (floating); non–hero pages need offset so content clears the bar. */
  const mainTopForFloatingBar = "pt-[3.25rem] sm:pt-[3.75rem]";

  return (
    <main
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-x-hidden overscroll-y-contain",
        /* Home: white column inside #121212 shell so corner pixels aren’t white-on-canvas. */
        isSearchAiMode
          ? "bg-white px-4 sm:px-6"
          : isHome
            ? "bg-white"
            : "bg-white px-4 sm:px-6",
        isPdp
          ? "min-h-0 overflow-hidden"
          : isSearchAiMode
            ? "min-h-0 overflow-hidden"
            : "scroll-smooth overflow-y-auto scrollbar-none",
        isHome ? "pt-0" : mainTopForFloatingBar,
        isSearchAiMode
          ? "pb-0"
          : isPdp
            ? "pb-[max(0.5rem,env(safe-area-inset-bottom))]"
            : isHome
              ? "pb-0"
              : "pb-32 sm:pb-32"
      )}
    >
      {children}
    </main>
  );
}
