"use client";

import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Card({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: ReactNode;
  as?: "div" | "article" | "section";
}) {
  return (
    <Tag
      className={cn(
        "rounded-2xl bg-[#14161c]/90 backdrop-blur-xl",
        ui.hairline,
        "shadow-[0_12px_40px_-20px_rgba(0,0,0,0.5)]",
        className
      )}
    >
      {children}
    </Tag>
  );
}
