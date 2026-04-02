"use client";

import { Card } from "@/components/shared/Card";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { ui } from "@/lib/ui-tokens";
import { cn, formatBRL, hasMediaUrl } from "@/lib/utils";
import type { BundleOption } from "@/lib/bundles";
import Image from "next/image";
import Link from "next/link";

export function BundleCard({ option, highlight }: { option: BundleOption; highlight?: boolean }) {
  return (
    <Card className={`overflow-hidden p-0 ${highlight ? "ring-1 ring-white/20" : ""}`}>
      <div className="flex gap-4 p-4">
        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-[#060708]">
          {hasMediaUrl(option.soundbar.heroImage) ? (
            <Image src={option.soundbar.heroImage} alt="" fill className="object-contain" sizes="96px" unoptimized />
          ) : (
            <EmptyMediaSlot className="absolute inset-0 rounded-xl" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7d869c]">Bundle</p>
          <p className="mt-1 line-clamp-2 text-[14px] font-semibold leading-snug text-[#f0f3fa]">{option.title}</p>
          <p className="mt-2 text-[12px] text-[#9aa3b8]">{option.blurb}</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className={cn(ui.price, "text-[15px] text-white")}>{formatBRL(option.comboPrice)}</span>
            <span className="text-[12px] text-[#9ca8b8]">Save {formatBRL(option.savings)}</span>
          </div>
          <Link
            href={`/product/${option.soundbar.id}`}
            className="mt-2 inline-block rounded-md px-1 py-0.5 text-[12px] font-semibold text-[#9ca8b8] transition-colors duration-150 ease-out hover:bg-white/[0.06] hover:text-[#eef1f6]"
          >
            View soundbar
          </Link>
        </div>
      </div>
    </Card>
  );
}
