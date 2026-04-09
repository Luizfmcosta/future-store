"use client";

import { cn } from "@/lib/utils";

/**
 * Hue tint with `mix-blend-mode: hue`. When `maskImageSrc` is the same URL as the product
 * PNG beneath it, `mask-image` uses that asset’s alpha so the blend hits opaque pixels only
 * (transparent areas stay clear).
 */
export function ProductColorTintOverlay({
  hex,
  className,
  maskImageSrc,
  /** Match the underlying image: PDP heroes use `contain`, fixed-bar thumbs use `cover`. */
  maskFit = "contain",
}: {
  hex: string;
  className?: string;
  maskImageSrc?: string;
  maskFit?: "contain" | "cover";
}) {
  const maskUrl = maskImageSrc ? (`url(${JSON.stringify(maskImageSrc)})` as const) : undefined;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 z-[1]", className)}
      style={{
        backgroundColor: hex,
        mixBlendMode: "hue",
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
