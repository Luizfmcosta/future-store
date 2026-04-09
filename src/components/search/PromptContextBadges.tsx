"use client";

import { useDemoStore } from "@/store/demoStore";
import { cn } from "@/lib/utils";
import { MousePointer2, X } from "lucide-react";

/**
 * Minimal chips above the prompt for products picked via “Ask” on images — aligned with {@link ui.promptInputKit}.
 */
export function PromptContextBadges({ className }: { className?: string }) {
  const refs = useDemoStore((s) => s.promptProductRefs);
  const remove = useDemoStore((s) => s.removePromptProductRef);

  if (!refs.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-1.5 pb-1.5", className)}>
      {refs.map((r) => (
        <span
          key={r.key}
          className="inline-flex max-w-full items-center gap-1 rounded-full border border-stone-200/90 bg-white/70 px-2 py-0.5 pl-1.5 text-[15px] font-normal leading-snug text-stone-600 shadow-none backdrop-blur-[2px]"
        >
          <MousePointer2 className="size-3 shrink-0 text-stone-400" strokeWidth={2} aria-hidden />
          <span className="min-w-0 truncate tracking-normal">{r.label}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              remove(r.key);
            }}
            className="-mr-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-200/70 hover:text-stone-600"
            aria-label="Remove reference"
          >
            <X className="size-3" strokeWidth={2} />
          </button>
        </span>
      ))}
    </div>
  );
}
