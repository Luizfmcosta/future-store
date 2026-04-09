"use client";

import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/** PDP back control — glassy pill, icon + label; sits above the gallery with tight spacing to the hero. */
export function PdpBackButton() {
  const t = useT();
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-white/85 px-3.5 py-2 text-[13px] font-medium text-neutral-800 shadow-[0_1px_3px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-[transform,background-color,border-color,box-shadow,color]",
        "hover:border-stone-300/95 hover:bg-stone-50/95 hover:text-neutral-950 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
        "active:scale-[0.98]",
        ui.home.focusRing,
        "focus-visible:ring-offset-2 focus-visible:ring-offset-white",
      )}
    >
      <ArrowLeft
        className="size-[15px] shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
        strokeWidth={1.75}
        aria-hidden
      />
      {t("pdp.back")}
    </button>
  );
}
