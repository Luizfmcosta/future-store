"use client";

import { AskImageButton } from "@/components/shared/AskImageButton";
import { Card } from "@/components/shared/Card";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { localizeProduct } from "@/lib/product-i18n";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn, formatBRL, hasMediaUrl } from "@/lib/utils";
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
  const t = useT();
  if (!product) return null;

  const p = localizeProduct(product);
  const detailMarina =
    p.technology && p.inches
      ? `${p.technology} · ${p.inches}" · ${p.compatibilityTags.slice(0, 2).join(" · ")}`
      : p.compatibilityTags.slice(0, 3).join(" · ");
  const detailRicardo = `${p.installmentText} · ${p.deliveryETA}`;

  const href = `/product/${product.id}`;

  return (
    <motion.div layout>
      <Card className="@container overflow-hidden p-0">
        <div className="grid grid-cols-1 @md:grid-cols-[1.1fr_1fr] @md:items-stretch @md:gap-0">
          <AskImageButton productLabel={p.title} productId={product.id} className="w-full shrink-0 bg-[#f5f5f5] @md:min-h-[300px] @lg:min-h-[22rem]">
            <div className="relative w-full @md:min-h-[300px] @lg:min-h-[22rem]">
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
                  <EmptyMediaSlot className="absolute inset-0" variant="light" />
                )}
              </div>
            </div>
          </AskImageButton>
          <div className="flex flex-col items-stretch justify-center border-t border-stone-200/90 p-5 @md:border-t-0 @md:border-l @md:p-7">
            {aiMode ? (
              <EyebrowPill>{t("searchSerp.bestMatchAiEyebrow")}</EyebrowPill>
            ) : (
              <EyebrowPill>{t("searchSerp.bestMatchSerpEyebrow")}</EyebrowPill>
            )}
            <h3 className="mt-2 text-lg font-semibold leading-tight text-stone-900 sm:text-xl">{p.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-stone-600 sm:text-[17px] sm:leading-[1.65]">
              {profile === "marina" ? detailMarina : detailRicardo}
            </p>
            <div className="mt-4 flex flex-wrap items-baseline gap-3 sm:mt-5">
              <span className="text-xl font-semibold text-stone-900 sm:text-2xl">{formatBRL(p.price)}</span>
              {p.oldPrice ? (
                <span className="text-[15px] text-stone-400 line-through">{formatBRL(p.oldPrice)}</span>
              ) : null}
            </div>
            <div className="mt-6 flex w-full max-w-md flex-col gap-2.5 sm:flex-row">
              <Link
                href={href}
                className={cn(
                  "flex h-11 min-h-0 flex-1 items-center justify-center rounded-full border border-stone-200/90 text-[15px] font-medium text-stone-800 transition-colors hover:border-stone-400 hover:bg-stone-50 sm:text-[16px]",
                  ui.home.focusRing,
                  "focus-visible:rounded-full",
                )}
              >
                {t("common.explore")}
              </Link>
              <Link
                href={href}
                className={cn(
                  "flex h-11 min-h-0 flex-1 items-center justify-center rounded-full bg-[#1a1a1a] text-[15px] font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98] sm:text-[16px]",
                  ui.home.focusRing,
                  "focus-visible:rounded-full",
                )}
              >
                {t("common.buyNow")}
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
