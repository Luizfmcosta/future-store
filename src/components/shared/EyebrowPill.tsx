"use client";

import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type EyebrowPillAs = "span" | "h2" | "h3" | "p" | "div";

/**
 * Editorial kicker — small gray label text only (`ui.home.eyebrowPill`, no chip background).
 * Use on light storefront surfaces (home, PDP, search). Prefer this over ad-hoc
 * `uppercase tracking-[0.2em]` eyebrow strings.
 */
export function EyebrowPill({
  as = "span",
  children,
  className,
  id,
}: {
  as?: EyebrowPillAs;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const Comp = as;
  return (
    <Comp id={id} className={cn(ui.home.eyebrowPill, className)}>
      {children}
    </Comp>
  );
}
