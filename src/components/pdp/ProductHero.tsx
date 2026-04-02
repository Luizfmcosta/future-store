"use client";

import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { formatBRL, hasMediaUrl } from "@/lib/utils";
import type { Product } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";

export function ProductHero({ product, profile }: { product: Product; profile: "marina" | "ricardo" }) {
  const [idx, setIdx] = useState(0);
  const imgs = useMemo(() => {
    const g = product.gallery.filter(hasMediaUrl);
    if (g.length) return g;
    return hasMediaUrl(product.heroImage) ? [product.heroImage] : [];
  }, [product.gallery, product.heroImage]);

  return (
    <div className="space-y-4">
      <motion.div layout className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-white/[0.06] bg-[#060708] sm:aspect-[16/9]">
        {imgs.length > 0 ? (
          <Image
            src={imgs[idx] ?? imgs[0]!}
            alt=""
            fill
            className="object-contain"
            sizes="100vw"
            priority
            unoptimized
          />
        ) : (
          <EmptyMediaSlot className="absolute inset-0" />
        )}
      </motion.div>
      {imgs.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imgs.map((src, i) => (
            <button
              key={src + String(i)}
              type="button"
              onClick={() => setIdx(i)}
              className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border bg-[#060708] ${idx === i ? "border-white/[0.18]" : "border-white/[0.06]"}`}
            >
              <Image src={src} alt="" fill className="object-contain" sizes="80px" unoptimized />
            </button>
          ))}
        </div>
      ) : null}
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[#8b93a7]">{product.brand}</p>
        <h1 className="mt-1 text-2xl font-semibold leading-tight tracking-tight text-[#f6f7fb] sm:text-3xl">{product.title}</h1>
        <div className="mt-4 flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-semibold text-white">{formatBRL(product.price)}</span>
          {product.oldPrice ? (
            <span className="text-base text-[#7d869c] line-through">{formatBRL(product.oldPrice)}</span>
          ) : null}
        </div>
        <p className="mt-2 text-[14px] text-[#b4bcd1]">{product.installmentText}</p>
        <p className="mt-1 text-[13px] text-[#8b93a7]">
          {profile === "ricardo" ? `${product.deliveryETA} · Stock: ${product.stock}` : `${product.deliveryETA} · ${product.stock} in regional pool`}
        </p>
      </div>
    </div>
  );
}
