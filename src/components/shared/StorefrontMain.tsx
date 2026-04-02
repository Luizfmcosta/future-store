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

  return (
    <main
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-x-hidden overscroll-y-contain px-4 sm:px-6",
        isPdp ? "min-h-0 overflow-hidden" : "scroll-smooth overflow-y-auto",
        isSearchPage ? "pt-2 sm:pt-3" : "pt-5 sm:pt-6",
        isSearchAiMode
          ? "pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          : isPdp
            ? "pb-[max(0.5rem,env(safe-area-inset-bottom))]"
            : "pb-32 sm:pb-32"
      )}
    >
      {children}
    </main>
  );
}
