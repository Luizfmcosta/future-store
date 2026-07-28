"use client";

import { cn } from "@/lib/utils";
import type { ProductColorTintBlend } from "@/types";

/**
 * Color finish preview over product PNGs. When `maskImageSrc` is the same URL as the image
 * beneath it, `mask-image` uses that asset’s alpha so the blend hits opaque pixels only
 * (transparent areas stay clear).
 *
 * - `hue` — legacy; keeps source luminosity (weak for black/white on light wood).
 * - `multiply` — darkens toward the swatch; matches dark finishes on pale cabinets.
 * - `color` — hue + saturation from the swatch, luminosity from the photo.
 */
export function ProductColorTintOverlay({
  hex,
  className,
  maskImageSrc,
  /** Match the underlying image: PDP heroes use `contain`, fixed-bar thumbs use `cover`. */
  maskFit = "contain",
  blendMode = "hue",
}: {
  hex: string;
  className?: string;
  maskImageSrc?: string;
  maskFit?: "contain" | "cover";
  blendMode?: ProductColorTintBlend;
}) {
  const maskUrl = maskImageSrc ? (`url(${JSON.stringify(maskImageSrc)})` as const) : undefined;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 z-[1]", className)}
      style={{
        backgroundColor: hex,
        mixBlendMode: blendMode,
        ...(maskUrl
          ? {
              WebkitMaskImage: maskUrl,
              maskImage: maskUrl,
              WebkitMaskSize: maskFit,
              maskSize: maskFit,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              maskMode: "alpha" as const,
            }
          : {}),
      }}
    />
  );
}
