"use client";

import { AskImageButton } from "@/components/shared/AskImageButton";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { formatBRL, hasMediaUrl } from "@/lib/utils";
import type { Product, ShopperProfileId } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";

export function ProductHero({ product, profile }: { product: Product; profile: ShopperProfileId }) {
  const [idx, setIdx] = useState(0);
  const imgs = useMemo(() => {
    const g = product.gallery.filter(hasMediaUrl);
    if (g.length) return g;
    return hasMediaUrl(product.heroImage) ? [product.heroImage] : [];
  }, [product.gallery, product.heroImage]);

  return (
    <div className="space-y-4">
      <motion.div layout className="overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-[#f5f5f5]">
        <AskImageButton
          productLabel={product.title}
          productId={product.id}
          className="aspect-[4/3] w-full sm:aspect-[16/9]"
        >
          {imgs.length > 0 ? (
            <div className="relative h-full w-full">
              <Image
                src={imgs[idx] ?? imgs[0]!}
                alt=""
                fill
                className="object-contain p-4 sm:p-6"
                sizes="100vw"
                priority
                unoptimized
              />
            </div>
          ) : (
            <EmptyMediaSlot className="relative min-h-[12rem] sm:min-h-[16rem]" variant="light" />
          )}
        </AskImageButton>
      </motion.div>
      {imgs.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {imgs.map((src, i) => (
            <button
              key={src + String(i)}
              type="button"
              onClick={() => setIdx(i)}
              className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-black/10 bg-[#f5f5f5] ${idx === i ? "ring-2 ring-black/15" : ""}`}
            >
              <Image src={src} alt="" fill className="object-contain" sizes="80px" unoptimized />
            </button>
          ))}
        </div>
      ) : null}
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-wider text-stone-500">{product.brand}</p>
        <h1 className="mt-1 text-2xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-3xl">{product.title}</h1>
        <div className="mt-4 flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-semibold text-stone-900">{formatBRL(product.price)}</span>
          {product.oldPrice ? (
            <span className="text-base text-stone-400 line-through">{formatBRL(product.oldPrice)}</span>
          ) : null}
        </div>
        <p className="mt-2 text-[14px] text-stone-600">{product.installmentText}</p>
        <p className="mt-1 text-[13px] text-stone-500">
          {profile === "ricardo"
            ? `${product.deliveryETA} · Stock: ${product.stock}`
            : `${product.deliveryETA} · ${product.stock} in regional pool`}
        </p>
      </div>
    </div>
  );
}
