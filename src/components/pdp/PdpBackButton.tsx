"use client";

import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/** PDP back control — text-style control; minimal fill on white PDP chrome. */
export function PdpBackButton() {
  const t = useT();
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-transparent bg-transparent px-3 py-2 text-[13px] font-medium text-neutral-500 transition-[transform,background-color,color]",
        "hover:bg-neutral-100/80 hover:text-neutral-900",
        "active:scale-[0.98] active:bg-neutral-100",
        ui.home.focusRing,
      )}
    >
      <ArrowLeft
        className="size-[15px] shrink-0 text-neutral-400 transition-[transform,color] duration-200 group-hover:-translate-x-0.5 group-hover:text-neutral-700"
        strokeWidth={1.75}
        aria-hidden
      />
      {t("pdp.back")}
    </button>
  );
}
