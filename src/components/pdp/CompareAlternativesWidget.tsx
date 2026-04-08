"use client";

import { AskImageButton } from "@/components/shared/AskImageButton";
import { Card } from "@/components/shared/Card";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { formatBRL, hasMediaUrl } from "@/lib/utils";
import type { Product } from "@/types";
import type { ShopperProfileId } from "@/types";
import Image from "next/image";
import Link from "next/link";

export function CompareAlternativesWidget({
  product,
  alt,
  profile,
}: {
  product: Product;
  alt?: Product;
  profile: ShopperProfileId;
}) {
  if (!alt) return null;

  return (
    <Card className="p-5 sm:p-6">
      <EyebrowPill>Worth considering too</EyebrowPill>
      <h3 className="mt-2 text-lg font-semibold text-stone-900">
        {profile === "marina" ? "Compared to a path you might like" : "Lower monthly alternative"}
      </h3>
      <div className="mt-4 flex gap-4 rounded-2xl border border-stone-200/90 bg-stone-50/90 p-3">
        <AskImageButton
          productLabel={alt.title}
          productId={alt.id}
          className="h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-[#f5f5f5]"
        >
          <div className="relative h-full w-full">
            {hasMediaUrl(alt.heroImage) ? (
              <Image src={alt.heroImage} alt="" fill className="object-contain" sizes="112px" unoptimized />
            ) : (
              <EmptyMediaSlot className="absolute inset-0 rounded-xl" />
            )}
          </div>
        </AskImageButton>
        <Link
          href={`/product/${alt.id}`}
          className="min-w-0 flex-1 rounded-xl transition-colors hover:bg-stone-100/80"
        >
          <p className="line-clamp-2 text-[14px] font-semibold leading-snug text-stone-900">{alt.title}</p>
          <p className="mt-2 text-sm font-semibold text-stone-900">{formatBRL(alt.price)}</p>
          <p className="mt-1 text-[12px] text-stone-500">
            {profile === "marina"
              ? alt.technology && product.technology
                ? `What changes: ${alt.technology} vs ${product.technology} — ${alt.reviewStrengths[0]}`
                : `What changes: ${alt.compatibilityTags[0]} vs ${product.compatibilityTags[0]} — ${alt.reviewStrengths[0]}`
              : `What changes: different price tier — ${alt.installmentText}`}
          </p>
        </Link>
      </div>
    </Card>
  );
}
