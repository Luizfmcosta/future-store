"use client";

import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { MousePointer2 } from "lucide-react";
import Link from "next/link";

const askPill =
  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-stone-200/90 bg-white px-3 text-[12px] font-medium text-stone-800 shadow-[0_4px_14px_rgba(15,23,42,0.12)] transition hover:bg-stone-50";

/** Cart upsell rows: opens PLP AI chat (`/search?view=ai`) with a seeded prompt via `m`. */
export function CartAccessoryTips({ onNavigate }: { onNavigate: () => void }) {
  const t = useT();

  const rows = [
    {
      titleKey: "cart.accessoryTipPortableTitle",
      bodyKey: "cart.accessoryTipPortableBody",
      seedKey: "cart.accessoryTipPortableAskSeed",
    },
    {
      titleKey: "cart.accessoryTipTvTitle",
      bodyKey: "cart.accessoryTipTvBody",
      seedKey: "cart.accessoryTipTvAskSeed",
    },
  ] as const;

  return (
    <div className="rounded-2xl border border-stone-200/90 bg-white/80 px-4 sm:px-5">
      {rows.map((row, i) => (
        <div
          key={row.titleKey}
          className={cn(
            "flex items-start justify-between gap-3 py-4",
            i > 0 && "border-t border-stone-200/60",
          )}
        >
          <div className="min-w-0 flex-1 pr-1">
            <p className="text-[15px] font-semibold text-stone-900">{t(row.titleKey)}</p>
            <p className="mt-1 text-[14px] leading-relaxed text-stone-600">{t(row.bodyKey)}</p>
          </div>
          <Link
            href={`/search?view=ai&m=${encodeURIComponent(t(row.seedKey))}`}
            scroll={false}
            onClick={onNavigate}
            className={cn(askPill, ui.home.focusRing, "focus-visible:rounded-full")}
          >
            <MousePointer2 className="size-[15px] text-stone-600" strokeWidth={2} aria-hidden />
            {t("common.askProduct")}
          </Link>
        </div>
      ))}
    </div>
  );
}
