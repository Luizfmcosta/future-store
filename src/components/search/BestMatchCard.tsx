"use client";

import { Card } from "@/components/shared/Card";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { formatBRL, hasMediaUrl } from "@/lib/utils";
import type { Product } from "@/types";
import type { ShopperProfileId } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function BestMatchCard({
  product,
  profile,
  aiMode,
}: {
  product: Product | undefined;
  profile: ShopperProfileId;
  aiMode: boolean;
}) {
  if (!product) return null;

  return (
    <motion.div layout>
      <Link href={`/product/${product.id}`}>
        <Card className="@container overflow-hidden p-0">
          {/*
            Stacked when the card is narrow; two columns from @md on the container (~28rem) so wide
            storefronts get image | copy without viewport-only breakpoints fighting the column width.
          */}
          <div className="grid grid-cols-1 @md:grid-cols-[1.1fr_1fr] @md:items-stretch @md:gap-0">
            <div className="relative w-full shrink-0 bg-[#060708] @md:min-h-[300px] @lg:min-h-[22rem]">
              <div className="relative aspect-[16/10] w-full @md:absolute @md:inset-0 @md:aspect-auto @md:h-full @md:min-h-0">
                {hasMediaUrl(product.heroImage) ? (
                  <Image
                    src={product.heroImage}
                    alt=""
                    fill
                    className="object-contain object-center p-3 @md:p-4"
                    sizes="(max-width: 900px) 100vw, min(100vw, 640px)"
                    unoptimized
                  />
                ) : (
                  <EmptyMediaSlot className="absolute inset-0" />
                )}
              </div>
            </div>
            <div className="flex flex-col items-start justify-center border-t border-white/[0.06] p-5 @md:border-t-0 @md:border-l @md:p-7">
              {aiMode ? (
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b93a7]">
                  Best choice for your space and budget
                </p>
              ) : (
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b93a7]">Top result</p>
              )}
              <h3 className="mt-2 text-lg font-semibold leading-tight text-white sm:text-xl">{product.title}</h3>
              <p className="mt-3 text-[13px] leading-relaxed text-[#b4bcd1] sm:text-[14px]">
                {profile === "marina"
                  ? `${product.technology} · ${product.inches}" · ${product.compatibilityTags.slice(0, 2).join(" · ")}`
                  : `${product.installmentText} · ${product.deliveryETA}`}
              </p>
              <div className="mt-4 flex flex-wrap items-baseline gap-3 sm:mt-5">
                <span className="text-xl font-semibold text-[#f2f4f8] sm:text-2xl">{formatBRL(product.price)}</span>
                {product.oldPrice ? (
                  <span className="text-sm text-[#7d869c] line-through">{formatBRL(product.oldPrice)}</span>
                ) : null}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
