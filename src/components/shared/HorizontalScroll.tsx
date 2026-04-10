"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type HorizontalScrollProps = {
  children: ReactNode;
  className?: string;
  /**
   * From the storefront `@md` container width up, row fills parent width (no overflow scroll);
   * children should use `@md:flex-1 @md:basis-0 @md:min-w-0` (etc.) to share space.
   */
  fillRowFromMd?: boolean;
};

/**
 * Horizontal carousel: stays within the parent width (e.g. max-w editorial column) with
 * leading padding so the first card is not flush to the track edge at scroll rest.
 */
export function HorizontalScroll({ children, className, fillRowFromMd }: HorizontalScrollProps) {
  return (
    <div className={cn("relative min-w-0", className)}>
      <div
        className={cn(
          "flex w-full min-w-0 snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth touch-pan-x [-webkit-overflow-scrolling:touch]",
          /* Left inset for first card + snap alignment; right matches end spacer */
          "pl-5 pr-0 scroll-pl-5 scroll-pr-5 sm:pl-6 sm:scroll-pl-6 sm:scroll-pr-6",
          "pb-1 pt-0.5 scrollbar-none",
          fillRowFromMd &&
            "@md:overflow-x-visible @md:snap-none @md:pl-0 @md:pr-0 @md:scroll-pl-0 @md:scroll-pr-0"
        )}
      >
        {children}
        <span
          aria-hidden
          className={cn("w-5 shrink-0 snap-none sm:w-6", fillRowFromMd && "@md:hidden")}
        />
      </div>
    </div>
  );
}
