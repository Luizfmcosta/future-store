"use client";

import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SectionTitle({
  eyebrow,
  title,
  action,
  className,
  variant = "default",
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  className?: string;
  /** `editorial` = warm light home (Saki-like storefront) */
  variant?: "default" | "editorial";
}) {
  const e = variant === "editorial" ? ui.home : ui;
  return (
    <div className={cn("mb-4 flex items-center justify-between gap-3 sm:mb-5 sm:gap-4", className)}>
      <div className="min-w-0 flex-1">
        {eyebrow ? (
          variant === "editorial" ? (
            <EyebrowPill>{eyebrow}</EyebrowPill>
          ) : (
            <p className={cn(ui.eyebrow)}>{eyebrow}</p>
          )
        ) : null}
        <h2 className={cn(eyebrow ? "mt-1" : "mt-1.5", e.sectionTitle)}>{title}</h2>
      </div>
      {action ? <div className="flex shrink-0 items-center self-center">{action}</div> : null}
    </div>
  );
}
