"use client";

import { Card } from "@/components/shared/Card";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn, formatBRL, hasMediaUrl } from "@/lib/utils";
import type { BundleOption } from "@/lib/bundles";
import Image from "next/image";
import Link from "next/link";

export function BundleCard({ option, highlight }: { option: BundleOption; highlight?: boolean }) {
  const t = useT();

  return (
    <Card className={`overflow-hidden p-0 ${highlight ? "ring-1 ring-stone-300/90" : ""}`}>
      <div className="flex gap-4 p-4">
        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f5f5f5]">
          {hasMediaUrl(option.soundbar.heroImage) ? (
            <Image src={option.soundbar.heroImage} alt="" fill className="object-contain" sizes="96px" unoptimized />
          ) : (
            <EmptyMediaSlot className="absolute inset-0 rounded-xl" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">{t("cart.bundleEyebrow")}</p>
          <p className="mt-1 line-clamp-2 text-[14px] font-semibold leading-snug text-stone-900">{option.title}</p>
          <p className="mt-2 text-[12px] text-stone-600">{option.blurb}</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className={cn(ui.home.price, "text-[15px]")}>{formatBRL(option.comboPrice)}</span>
            <span className="text-[12px] text-stone-500">{t("cart.saveAmount", { amount: formatBRL(option.savings) })}</span>
          </div>
          <Link
            href={`/product/${option.soundbar.id}`}
            className="mt-2 inline-block rounded-md px-1 py-0.5 text-[12px] font-semibold text-stone-600 transition-colors duration-150 ease-out hover:bg-stone-100 hover:text-stone-900"
          >
            {t("cart.viewBundlePart")}
          </Link>
        </div>
      </div>
    </Card>
  );
}
