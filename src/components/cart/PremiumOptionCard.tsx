"use client";

import { AskImageButton } from "@/components/shared/AskImageButton";
import { Card } from "@/components/shared/Card";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { useT } from "@/lib/useT";
import { formatBRL, hasMediaUrl } from "@/lib/utils";
import type { BundleOption } from "@/lib/bundles";
import Image from "next/image";
import Link from "next/link";

export function PremiumOptionCard({ option }: { option: BundleOption }) {
  const t = useT();

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex gap-4 p-4">
        <AskImageButton
          productLabel={option.soundbar.title}
          productId={option.soundbar.id}
          className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f5f5f5]"
        >
          <div className="relative h-full w-full">
            {hasMediaUrl(option.soundbar.heroImage) ? (
              <Image src={option.soundbar.heroImage} alt="" fill className="object-contain" sizes="96px" unoptimized />
            ) : (
              <EmptyMediaSlot className="absolute inset-0 rounded-xl" />
            )}
          </div>
        </AskImageButton>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-800/90">{t("cart.premiumPairing")}</p>
          <p className="mt-1 text-[14px] font-semibold text-stone-900">{option.title}</p>
          <p className="mt-1 text-[18px] font-semibold tabular-nums text-stone-900">{formatBRL(option.comboPrice)}</p>
          <Link href={`/product/${option.soundbar.id}`} className="mt-2 inline-block text-[12px] font-semibold text-stone-600 hover:text-stone-900">
            {t("cart.details")}
          </Link>
        </div>
      </div>
    </Card>
  );
}
