"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

function StarSlot({ fill }: { fill: number }) {
  const f = Math.min(1, Math.max(0, fill));
  return (
    <span className="relative inline-block size-[1.05rem] shrink-0 sm:size-5">
      <Star className="absolute size-[1.05rem] text-stone-300 sm:size-5" strokeWidth={1.5} />
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${f * 100}%` }}>
        <Star
          className="size-[1.05rem] fill-amber-500 text-amber-500 sm:size-5"
          strokeWidth={1.5}
        />
      </span>
    </span>
  );
}

function fillForStar(index: number, rating: number) {
  return Math.min(1, Math.max(0, rating - index));
}

export function ReviewStars({ rating, className }: { rating: number; className?: string }) {
  const r = Math.min(5, Math.max(0, rating));
  return (
    <div className={cn("inline-flex items-center gap-0.5", className)} aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <StarSlot key={i} fill={fillForStar(i, r)} />
      ))}
    </div>
  );
}
