"use client";

import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";

/**
 * Two-row headline: each message line is forced to a single row (`whitespace-nowrap`) so the
 * first sentence never breaks after “serving…”. Font scales down on narrow viewports via `min()`
 * so both lines stay readable without a third wrap.
 */
export function AgentHeroHeadline({ className }: { className?: string }) {
  const t = useT();

  return (
    <h1
      className={cn(
        "flex flex-col gap-1 font-semibold leading-[1.15] tracking-tight text-white/95",
        /* ~55ch line 1: shrink type until one line fits; cap at 2rem on wide screens */
        "text-[length:min(2rem,calc((100vw-2rem)/26))] sm:text-[clamp(1.1rem,3vw,2rem)]",
        className,
      )}
    >
      <span className="block whitespace-nowrap text-center">{t("agentBento.heroLine1")}</span>
      <span className="block whitespace-nowrap text-center">{t("agentBento.heroLine2")}</span>
    </h1>
  );
}
