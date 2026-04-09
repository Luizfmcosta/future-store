"use client";

import { AskImageButton } from "@/components/shared/AskImageButton";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { useT } from "@/lib/useT";
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
  const t = useT();
  if (!alt) return null;

  return (
    <div>
      <EyebrowPill>{t("pdp.compareEyebrow")}</EyebrowPill>
      <h3 className="mt-4 text-xl font-light text-neutral-900 sm:text-2xl">
        {profile === "marina" ? "Compared to a path you might like" : "Lower monthly alternative"}
      </h3>
      <div className="mt-8 flex gap-4 border border-black/[0.06] bg-[#fafafa] p-4 sm:p-5">
        <AskImageButton
          productLabel={alt.title}
          productId={alt.id}
          className="h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-[#f5f5f5] sm:h-28 sm:w-36"
        >
          <div className="relative h-full w-full">
            {hasMediaUrl(alt.heroImage) ? (
              <Image src={alt.heroImage} alt="" fill className="object-contain" sizes="144px" unoptimized />
            ) : (
              <EmptyMediaSlot className="absolute inset-0" />
            )}
          </div>
        </AskImageButton>
        <Link href={`/product/${alt.id}`} className="min-w-0 flex-1 transition-opacity hover:opacity-90">
          <p className="line-clamp-2 text-[15px] font-medium leading-snug text-neutral-900">{alt.title}</p>
          <p className="mt-3 text-base font-semibold tabular-nums text-neutral-900">{formatBRL(alt.price)}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-neutral-600">
            {profile === "marina"
              ? alt.technology && product.technology
                ? `What changes: ${alt.technology} vs ${product.technology} — ${alt.reviewStrengths[0]}`
                : `What changes: ${alt.compatibilityTags[0]} vs ${product.compatibilityTags[0]} — ${alt.reviewStrengths[0]}`
              : `What changes: different price tier — ${alt.installmentText}`}
          </p>
        </Link>
      </div>
    </div>
  );
}
