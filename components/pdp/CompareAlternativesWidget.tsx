"use client";

import { Card } from "@/components/shared/Card";
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
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7d869c]">Worth considering too</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{profile === "marina" ? "Compared to a path you might like" : "Lower monthly alternative"}</h3>
      <Link href={`/product/${alt.id}`} className="mt-4 flex gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3 transition hover:bg-white/[0.05]">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-[#060708]">
          {hasMediaUrl(alt.heroImage) ? (
            <Image src={alt.heroImage} alt="" fill className="object-contain" sizes="112px" unoptimized />
          ) : (
            <EmptyMediaSlot className="absolute inset-0 rounded-xl" />
          )}
        </div>
        <div className="min-w-0">
          <p className="line-clamp-2 text-[14px] font-semibold leading-snug text-[#eef1f7]">{alt.title}</p>
          <p className="mt-2 text-sm font-semibold text-[#dce1ed]">{formatBRL(alt.price)}</p>
          <p className="mt-1 text-[12px] text-[#8b93a7]">
            {profile === "marina"
              ? `What changes: ${alt.technology} vs ${product.technology} — ${alt.reviewStrengths[0]}`
              : `What changes: simpler HDR stack — ${alt.installmentText}`}
          </p>
        </div>
      </Link>
    </Card>
  );
}
