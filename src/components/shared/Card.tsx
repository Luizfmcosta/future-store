"use client";

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
        "rounded-2xl border border-stone-200/90 bg-white shadow-[0_12px_40px_-28px_rgba(0,0,0,0.12)]",
        className
      )}
    >
      {children}
    </Tag>
  );
}
