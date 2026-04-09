"use client";

import { ProductColorTintOverlay } from "@/components/pdp/ProductColorTintOverlay";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { useT } from "@/lib/useT";
import { cn, hasMediaUrl } from "@/lib/utils";
import type { Product } from "@/types";
import Image from "next/image";
import { useMemo, useState } from "react";

/**
 * Hero image: a single `overflow-hidden rounded-2xl` shell clips the photo.
 * The `<img>` is `absolute inset-0` + `object-contain` inside padded box — parent clips square corners.
 * (clip-path / bg-image / Next `fill` were all flaky here.)
 *
 * When the product has 2+ color options, thumbnail strip shows the same hero with each finish tint
 * (aligned with swatches). Otherwise thumbnails come from `gallery`.
 */
export function PdpMediaGallery({
  product,
  tintHex,
  selectedColorKey,
  onSelectedColorKeyChange,
}: {
  product: Product;
  /** Selected color swatch — blended over the hero for a finish preview */
  tintHex?: string;
  /** Required when `colorOptions.length >= 2` — keeps thumbs in sync with swatches */
  selectedColorKey?: string;
  onSelectedColorKeyChange?: (labelKey: string) => void;
}) {
  const t = useT();
  const [galleryIdx, setGalleryIdx] = useState(0);

  const colorOptions = product.colorOptions ?? [];
  const useColorThumbs = colorOptions.length >= 2 && hasMediaUrl(product.heroImage);

  const galleryImgs = useMemo(() => {
    const g = product.gallery.filter(hasMediaUrl);
    if (g.length) return g;
    return hasMediaUrl(product.heroImage) ? [product.heroImage] : [];
  }, [product.gallery, product.heroImage]);

  const heroSrc = useColorThumbs
    ? product.heroImage
    : (galleryImgs[galleryIdx] ?? galleryImgs[0]);

  const colorAria = (labelKey: string) =>
    t(`pdp.colors.${labelKey}` as `pdp.colors.${string}`) || labelKey;

  return (
    <div className="w-full min-w-0">
      {heroSrc && hasMediaUrl(heroSrc) ? (
        <figure className="relative w-full overflow-hidden rounded-2xl bg-[#f5f5f5] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
          <div
            className={cn(
              "relative aspect-[5/6] w-full sm:aspect-[4/5] sm:min-h-[min(70vh,560px)]",
              "lg:min-h-0 lg:max-h-[min(520px,52vh)]",
            )}
          >
            <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10">
              {/* `isolate` keeps `mix-blend-mode: hue` scoped to photo + tint (see ProductColorTintOverlay). */}
              <span className="relative isolate inline-block max-h-full max-w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroSrc}
                  alt=""
                  className="relative z-0 block max-h-full max-w-full object-contain"
                  loading="eager"
                  decoding="async"
                  draggable={false}
                />
                {tintHex ? <ProductColorTintOverlay hex={tintHex} maskImageSrc={heroSrc} maskFit="contain" /> : null}
              </span>
            </div>
          </div>
        </figure>
      ) : (
        <figure className="relative w-full overflow-hidden rounded-2xl bg-[#f5f5f5] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
          <div
            className={cn(
              "relative flex aspect-[5/6] w-full min-h-0 flex-col sm:aspect-[4/5] sm:min-h-[min(70vh,560px)]",
              "lg:min-h-0 lg:max-h-[min(520px,52vh)]",
            )}
          >
            <EmptyMediaSlot className="relative min-h-[20rem] w-full flex-1 sm:min-h-[28rem]" variant="light" />
          </div>
        </figure>
      )}

      {useColorThumbs && onSelectedColorKeyChange ? (
        <div className="mt-4 flex min-w-0 touch-pan-x gap-2 overflow-x-auto overscroll-x-contain scroll-smooth [-webkit-overflow-scrolling:touch] scrollbar-none">
          <div className="flex shrink-0 flex-nowrap gap-2">
            {colorOptions.map((opt) => {
              const active = opt.labelKey === selectedColorKey;
              return (
                <button
                  key={opt.labelKey}
                  type="button"
                  onClick={() => onSelectedColorKeyChange(opt.labelKey)}
                  aria-label={colorAria(opt.labelKey)}
                  aria-pressed={active}
                  className={cn(
                    "relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f5] transition-opacity sm:h-[4.5rem] sm:w-[5.5rem]",
                    active ? "opacity-100 ring-1 ring-inset ring-black/25" : "opacity-70 hover:opacity-100",
                  )}
                >
                  <span className="relative isolate block h-full w-full p-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.heroImage}
                      alt=""
                      className="relative z-0 block h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                    <ProductColorTintOverlay
                      hex={opt.swatchHex}
                      maskImageSrc={product.heroImage}
                      maskFit="contain"
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : galleryImgs.length > 1 ? (
        <div className="mt-4 flex min-w-0 touch-pan-x gap-2 overflow-x-auto overscroll-x-contain scroll-smooth [-webkit-overflow-scrolling:touch] scrollbar-none">
          <div className="flex shrink-0 flex-nowrap gap-2">
            {galleryImgs.map((thumbSrc, i) => (
              <button
                key={thumbSrc + String(i)}
                type="button"
                onClick={() => setGalleryIdx(i)}
                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f5] transition-opacity sm:h-[4.5rem] sm:w-[5.5rem] ${
                  galleryIdx === i
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
