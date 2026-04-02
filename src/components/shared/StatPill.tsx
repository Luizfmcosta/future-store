"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function StatPill({ icon, label, className }: { icon?: ReactNode; label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 text-[12px] text-[#cfd5e6]",
        className
      )}
    >
      {icon}
      {label}
    </span>
  );
}
