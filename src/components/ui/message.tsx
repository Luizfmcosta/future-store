"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

/** Layout inspired by prompt-kit Message — conversation row with avatar + content. */
export function Message({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("group/message flex w-full gap-3", className)} {...props} />;
}

export function MessageAvatar({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full border border-stone-200/90 bg-gradient-to-b from-stone-50 to-stone-100/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
        className,
      )}
      {...props}
    />
  );
}

export function MessageContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("min-w-0 flex-1 space-y-4", className)} {...props} />;
}

export function MessageMeta({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-[14px] font-medium leading-snug tracking-tight text-stone-500",
        className,
      )}
      {...props}
    />
  );
}
