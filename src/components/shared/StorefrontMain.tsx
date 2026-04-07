"use client";

import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Main scroll region: less bottom padding on AI search tab (floating dock hidden; follow-up bar is in-flow).
 */
export function StorefrontMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSearchPage = pathname === "/search";
  const isSearchAiMode = isSearchPage && searchParams.get("view") === "ai";
  /** PDP pins the cart bar to the bottom of the window; inner column scrolls (see product page). */
  const isPdp = pathname.startsWith("/product/");

  const isHome = pathname === "/";
  const isAbout = pathname === "/about";
  /** TopBar is absolute (floating); non–hero pages need offset so content clears the bar. */
  const mainTopForFloatingBar = "pt-[3.25rem] sm:pt-[3.75rem]";

  return (
    <main
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-x-hidden overscroll-y-contain",
        /* Home: white column inside #121212 shell so corner pixels aren’t white-on-canvas. */
        isHome ? "bg-white" : isAbout ? "bg-white px-0" : "bg-white px-4 sm:px-6",
        isPdp ? "min-h-0 overflow-hidden" : "scroll-smooth overflow-y-auto",
        isHome || isAbout ? "pt-0" : mainTopForFloatingBar,
        isSearchAiMode
          ? "pb-[max(0.75rem,env(safe-area-inset-bottom))]"
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
