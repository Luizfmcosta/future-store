"use client";

import { Card } from "@/components/shared/Card";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { useLocale } from "@/context/LocaleContext";
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
  const { locale } = useLocale();
  const t = useT();
  if (!product) return null;

  const p = localizeProduct(product, locale);
  const detailMarina =
    p.technology && p.inches
      ? `${p.technology} · ${p.inches}" · ${p.compatibilityTags.slice(0, 2).join(" · ")}`
      : p.compatibilityTags.slice(0, 3).join(" · ");
  const detailRicardo = `${p.installmentText} · ${p.deliveryETA}`;
  const detailJoana =
    p.technology && p.inches
      ? `${p.technology} · ${p.inches}" · ${p.installmentText}`
      : `${p.bestFor[0] ?? p.compatibilityTags[0]} · ${p.deliveryETA}`;

  return (
    <motion.div layout>
      <Link href={`/product/${product.id}`}>
        <Card className="@container overflow-hidden p-0">
          <div className="grid grid-cols-1 @md:grid-cols-[1.1fr_1fr] @md:items-stretch @md:gap-0">
            <div className="relative w-full shrink-0 bg-[#f5f5f5] @md:min-h-[300px] @lg:min-h-[22rem]">
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
            <div className="flex flex-col items-start justify-center border-t border-stone-200/90 p-5 @md:border-t-0 @md:border-l @md:p-7">
              {aiMode ? (
                <p className={cn(ui.home.eyebrow)}>{t("searchSerp.bestMatchAiEyebrow")}</p>
              ) : (
                <p className={cn(ui.home.eyebrow)}>{t("searchSerp.bestMatchSerpEyebrow")}</p>
              )}
              <h3 className="mt-2 text-lg font-semibold leading-tight text-stone-900 sm:text-xl">{p.title}</h3>
              <p className="mt-3 text-[13px] leading-relaxed text-stone-600 sm:text-[14px]">
                {profile === "marina" ? detailMarina : profile === "joana" ? detailJoana : detailRicardo}
              </p>
              <div className="mt-4 flex flex-wrap items-baseline gap-3 sm:mt-5">
                <span className="text-xl font-semibold text-stone-900 sm:text-2xl">{formatBRL(p.price)}</span>
                {p.oldPrice ? (
                  <span className="text-sm text-stone-400 line-through">{formatBRL(p.oldPrice)}</span>
                ) : null}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
