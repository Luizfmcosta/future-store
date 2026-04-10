"use client";

import { AskImageButton } from "@/components/shared/AskImageButton";
import { Card } from "@/components/shared/Card";
import { ProductBuyNowButton, ProductExploreLink } from "@/components/shared/ProductCtas";
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

  return (
    <motion.div layout>
      <Card className="@container overflow-hidden p-0">
        <div className="grid grid-cols-1 @md:grid-cols-[minmax(0,12.5rem)_minmax(0,1fr)] @md:items-stretch @md:gap-0">
          <AskImageButton
            productLabel={p.title}
            productId={product.id}
            className="flex w-full shrink-0 items-center justify-center bg-[#f5f5f5] @md:h-full @md:min-h-0"
          >
            <div className="relative mx-auto aspect-square w-full max-w-[min(100%,20rem)] @md:max-w-none">
              {hasMediaUrl(product.heroImage) ? (
                <Image
                  src={product.heroImage}
                  alt=""
                  fill
                  className="object-contain object-center p-3 @md:p-3"
                  sizes="(max-width: 900px) 100vw, 200px"
                  unoptimized
                />
              ) : (
                <EmptyMediaSlot className="absolute inset-0" variant="light" />
              )}
            </div>
          </AskImageButton>
          <div className="flex min-h-0 min-w-0 flex-col items-stretch border-t border-stone-200/90 p-5 @md:h-full @md:min-h-0 @md:border-t-0 @md:border-l @md:px-6 @md:pt-4 @md:pb-6">
            <div className="min-w-0 shrink-0">
              {aiMode ? (
                <EyebrowPill>{t("searchSerp.bestMatchAiEyebrow")}</EyebrowPill>
              ) : (
                <EyebrowPill>{t("searchSerp.bestMatchSerpEyebrow")}</EyebrowPill>
              )}
              <h3 className="mt-1.5 text-lg font-semibold leading-snug text-stone-900 sm:text-xl">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-snug text-stone-600 @md:mt-1.5 sm:text-[16px] sm:leading-relaxed">
                {profile === "marina" ? detailMarina : detailRicardo}
              </p>
            </div>
            <div className="mt-8 flex min-w-0 shrink-0 flex-col gap-3 @md:mt-10 @md:flex-row @md:items-center @md:justify-between @md:gap-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-xl font-semibold tabular-nums text-stone-900 @md:text-lg @lg:text-2xl">
                  {formatBRL(p.price)}
                </span>
                {p.oldPrice ? (
                  <span className="text-[14px] text-stone-400 line-through">{formatBRL(p.oldPrice)}</span>
                ) : null}
              </div>
              <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:gap-2.5 @md:flex-1 @md:justify-end">
                <ProductExploreLink
                  productId={product.id}
                  className={cn(
                    ui.home.ctaSecondaryOutline,
                    "flex h-10 min-h-0 flex-1 items-center justify-center text-[15px] @md:max-w-[11rem] @md:flex-none @md:px-4 sm:h-11 sm:text-[16px]",
                    ui.home.focusRing,
                    "focus-visible:rounded-full",
                  )}
                >
                  {t("common.explore")}
                </ProductExploreLink>
                <ProductBuyNowButton
                  productId={product.id}
                  className={cn(
                    ui.home.ctaPrimaryFill,
                    "flex h-10 min-h-0 flex-1 items-center justify-center text-[15px] @md:max-w-[11rem] @md:flex-none @md:px-4 sm:h-11 sm:text-[16px]",
                    ui.home.focusRing,
                    "focus-visible:rounded-full",
                  )}
                >
                  {t("common.buyNow")}
                </ProductBuyNowButton>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
