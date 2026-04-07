"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Home editorial label — rounded pill on `#f0f0f0` (matches ContinueJourney, MerchStrip, etc.). */
export function EyebrowPill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full bg-[#f0f0f0] px-3 py-1 text-[10px] font-medium tracking-[0.06em] text-[#666]",
        className,
      )}
    >
      {children}
    </span>
  );
}
