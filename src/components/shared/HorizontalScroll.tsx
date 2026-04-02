"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type HorizontalScrollProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Horizontal carousel: bleeds to storefront edges with explicit leading padding so the
 * first card is never flush left in its initial scroll position.
 */
export function HorizontalScroll({ children, className }: HorizontalScrollProps) {
  return (
    <div className={cn("relative -mx-4 min-w-0 sm:-mx-6", className)}>
      <div
        className={cn(
          "flex w-full min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth touch-pan-x [-webkit-overflow-scrolling:touch]",
          /* Left inset for first card + snap alignment; right matches end spacer */
          "pl-5 pr-0 scroll-pl-5 scroll-pr-5 sm:pl-6 sm:scroll-pl-6 sm:scroll-pr-6",
          "pb-1 pt-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        {children}
        <span aria-hidden className="w-5 shrink-0 snap-none sm:w-6" />
      </div>
    </div>
  );
}
