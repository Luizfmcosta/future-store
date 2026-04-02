"use client";

import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SectionTitle({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-center justify-between gap-3 sm:mb-5 sm:gap-4", className)}>
      <div className="min-w-0 flex-1">
        {eyebrow ? <p className={cn(ui.eyebrow)}>{eyebrow}</p> : null}
        <h2 className={cn("mt-1.5", ui.sectionTitle)}>{title}</h2>
      </div>
      {action ? <div className="flex shrink-0 items-center self-center">{action}</div> : null}
    </div>
  );
}
