"use client";

import { AskImageButton } from "@/components/shared/AskImageButton";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { hasMediaUrl } from "@/lib/utils";
import type { Product } from "@/types";
import Image from "next/image";
import { useMemo, useState } from "react";

export function PdpMediaGallery({ product }: { product: Product }) {
  const [idx, setIdx] = useState(0);
  const imgs = useMemo(() => {
    const g = product.gallery.filter(hasMediaUrl);
    if (g.length) return g;
    return hasMediaUrl(product.heroImage) ? [product.heroImage] : [];
  }, [product.gallery, product.heroImage]);

  return (
    <div className="w-full min-w-0">
      <div className="relative w-full overflow-hidden rounded-xl bg-[#f5f5f5]">
        <AskImageButton
          productLabel={product.title}
          productId={product.id}
          className="relative flex aspect-[4/5] w-full items-center justify-center sm:aspect-[3/4] sm:min-h-[min(70vh,560px)]"
        >
          {imgs.length > 0 ? (
            <div className="relative h-full w-full">
              <Image
                src={imgs[idx] ?? imgs[0]!}
                alt=""
                fill
                className="object-contain p-6 sm:p-10"
                sizes="100vw"
                priority
                unoptimized
              />
            </div>
          ) : (
            <EmptyMediaSlot className="relative min-h-[20rem] w-full sm:min-h-[28rem]" variant="light" />
          )}
        </AskImageButton>
      </div>
      {imgs.length > 1 ? (
        <div className="mt-4 flex min-w-0 touch-pan-x gap-2 overflow-x-auto overscroll-x-contain scroll-smooth [-webkit-overflow-scrolling:touch] scrollbar-none">
          <div className="flex shrink-0 flex-nowrap gap-2 px-4 sm:px-6">
            {imgs.map((src, i) => (
              <button
                key={src + String(i)}
                type="button"
                onClick={() => setIdx(i)}
                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f5] transition-opacity sm:h-[4.5rem] sm:w-[5.5rem] ${
                  idx === i
                    ? "opacity-100 ring-1 ring-inset ring-black/25"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-contain p-1.5"
                  sizes="88px"
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
