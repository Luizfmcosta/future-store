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
        <Card className="overflow-hidden p-0">
          <div className="grid sm:grid-cols-[1.1fr_1fr]">
            <div className="relative aspect-[5/4] bg-[#060708] sm:aspect-auto sm:min-h-[280px]">
              {hasMediaUrl(product.heroImage) ? (
                <Image
                  src={product.heroImage}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="(max-width:768px) 100vw, 50vw"
                  unoptimized
                />
              ) : (
                <EmptyMediaSlot className="absolute inset-0" />
              )}
            </div>
            <div className="flex flex-col items-start justify-center p-6 sm:p-8">
              {aiMode ? (
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b93a7]">Best choice for your space and budget</p>
              ) : (
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b93a7]">Top result</p>
              )}
              <h3 className="mt-2 text-xl font-semibold leading-tight text-white sm:text-2xl">{product.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[#b4bcd1]">
                {profile === "marina"
                  ? `${product.technology} · ${product.inches}" · ${product.compatibilityTags.slice(0, 2).join(" · ")}`
                  : `${product.installmentText} · ${product.deliveryETA}`}
              </p>
              <div className="mt-5 flex flex-wrap items-baseline gap-3">
                <span className="text-2xl font-semibold text-[#f2f4f8]">{formatBRL(product.price)}</span>
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
