"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function StatPill({ icon, label, className }: { icon?: ReactNode; label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-stone-200/90 bg-stone-50 px-2.5 py-1 text-[12px] text-stone-700",
        className
      )}
    >
      {icon}
      {label}
    </span>
  );
}
