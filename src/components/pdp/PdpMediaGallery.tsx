"use client";

import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { hasMediaUrl } from "@/lib/utils";
import type { Product } from "@/types";
import Image from "next/image";
import { useMemo, useState } from "react";

/**
 * Hero image: a single `overflow-hidden rounded-2xl` shell clips the photo.
 * The `<img>` is `absolute inset-0` + `object-contain` inside padded box — parent clips square corners.
 * (clip-path / bg-image / Next `fill` were all flaky here.)
 */
export function PdpMediaGallery({ product }: { product: Product }) {
  const [idx, setIdx] = useState(0);
  const imgs = useMemo(() => {
    const g = product.gallery.filter(hasMediaUrl);
    if (g.length) return g;
    return hasMediaUrl(product.heroImage) ? [product.heroImage] : [];
  }, [product.gallery, product.heroImage]);

  const src = imgs[idx] ?? imgs[0];

  return (
    <div className="w-full min-w-0">
      {imgs.length > 0 && src ? (
        <figure className="relative isolate w-full overflow-hidden rounded-2xl bg-[#f5f5f5] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
          <div className="relative aspect-[5/6] w-full sm:aspect-[4/5] sm:min-h-[min(70vh,560px)]">
            <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="max-h-full max-w-full object-contain"
                loading="eager"
                decoding="async"
                draggable={false}
              />
            </div>
          </div>
        </figure>
      ) : (
        <figure className="relative isolate w-full overflow-hidden rounded-2xl bg-[#f5f5f5] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
          <div className="relative flex aspect-[5/6] w-full min-h-0 flex-col sm:aspect-[4/5] sm:min-h-[min(70vh,560px)]">
            <EmptyMediaSlot className="relative min-h-[20rem] w-full flex-1 sm:min-h-[28rem]" variant="light" />
          </div>
        </figure>
      )}

      {imgs.length > 1 ? (
        <div className="mt-4 flex min-w-0 touch-pan-x gap-2 overflow-x-auto overscroll-x-contain scroll-smooth [-webkit-overflow-scrolling:touch] scrollbar-none">
          <div className="flex shrink-0 flex-nowrap gap-2">
            {imgs.map((thumbSrc, i) => (
              <button
                key={thumbSrc + String(i)}
                type="button"
                onClick={() => setIdx(i)}
                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f5] transition-opacity sm:h-[4.5rem] sm:w-[5.5rem] ${
                  idx === i
                    ? "opacity-100 ring-1 ring-inset ring-black/25"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={thumbSrc}
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
