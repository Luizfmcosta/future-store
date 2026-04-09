"use client";

import { useT } from "@/lib/useT";
import { cn, hasMediaUrl } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import type { Product } from "@/types";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

/** Prefer short catalog-style name before em dash, like Sonos product line in the bar. */
function barTitle(full: string): string {
  const i = full.indexOf(" — ");
  return i !== -1 ? full.slice(0, i).trim() : full;
}

/**
 * Sticky to the storefront window bottom (not the browser viewport): parent must be `relative`.
 * Layout: thumbnail + title (left) · Ask pill (center) · Buy now (right) — aligned with Sonos PDP bar.
 */
export function PdpFixedBar({ product }: { product: Product }) {
  const t = useT();
  const router = useRouter();
  const addToCart = useDemoStore((s) => s.addToCart);
  const clearPromptProductRefs = useDemoStore((s) => s.clearPromptProductRefs);
  const setQuery = useDemoStore((s) => s.setQuery);
  const openPdpChatOverlay = useDemoStore((s) => s.openPdpChatOverlay);

  const thumbSrc = useMemo(() => {
    if (hasMediaUrl(product.heroImage)) return product.heroImage;
    const g = product.gallery.find(hasMediaUrl);
    return g ?? "";
  }, [product.gallery, product.heroImage]);

  const onAsk = () => {
    clearPromptProductRefs();
    setQuery("");
    openPdpChatOverlay();
  };

  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-0 z-30",
        "border-t border-neutral-200/90 bg-white",
        "shadow-[0_-4px_24px_rgba(0,0,0,0.04)]",
      )}
    >
      <div
        className={cn(
          "px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pt-3.5",
        )}
      >
        <div className="mx-auto flex w-full max-w-2xl items-center gap-2 sm:gap-4">
          {/* Left: product name; thumbnail only from `sm` — hidden on narrow phones to save space */}
          <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
            <div className="relative hidden size-10 shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:block sm:size-11">
              {thumbSrc ? (
                <Image
                  src={thumbSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="44px"
                  unoptimized
                />
              ) : null}
            </div>
            <p className="min-w-0 truncate text-[13px] font-medium leading-tight tracking-tight text-neutral-900 sm:text-[14px]">
              {barTitle(product.title)}
            </p>
          </div>

          {/* Center: Ask — soft pill like Sonos nav cluster */}
          <button
            type="button"
            onClick={onAsk}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full bg-neutral-100 px-3.5 text-[12px] font-semibold tracking-tight text-neutral-800 transition-colors hover:bg-neutral-200/90 sm:h-11 sm:px-5 sm:text-[13px]"
          >
            <MessageCircle className="size-[15px] shrink-0 sm:size-[17px]" strokeWidth={1.75} aria-hidden />
            {t("pdp.ask")}
          </button>

          {/* Right: primary CTA */}
          <button
            type="button"
            onClick={() => {
              if (product.category === "tv" || product.category === "speaker") {
                addToCart(product.id);
              } else {
                router.push(`/product/sp-era-100`);
              }
            }}
            className="inline-flex h-10 min-w-0 shrink-0 items-center justify-center rounded-full bg-neutral-900 px-4 text-[12px] font-semibold tracking-tight text-white transition hover:bg-neutral-800 sm:h-11 sm:min-w-[7.5rem] sm:px-6 sm:text-[13px]"
          >
            {t("pdp.buyNow")}
          </button>
        </div>
      </div>
    </div>
  );
}
