"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Chip({
  children,
  active,
  onClick,
  className,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-[40px] items-center rounded-full border border-white/[0.06] px-3.5 py-1.5 text-[13px] font-medium tracking-tight",
        "bg-white/[0.06] text-[#eef2f8] transition-colors duration-150 ease-out",
        "hover:bg-white/[0.11] active:bg-white/[0.08]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060708]",
        active && "border-white/[0.1] bg-white/[0.1] text-white hover:bg-white/[0.14]",
        className
      )}
    >
      {children}
    </button>
  );
}
