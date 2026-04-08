"use client";

import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Home editorial label — rounded pill on `#f0f0f0` (matches ContinueJourney, MerchStrip, etc.). */
export function EyebrowPill({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <span id={id} className={cn(ui.home.eyebrowPill, className)}>
      {children}
    </span>
  );
}
