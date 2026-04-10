"use client";

import { AskImageButton } from "@/components/shared/AskImageButton";
import { Card } from "@/components/shared/Card";
import { ProductBuyNowButton, ProductExploreLink } from "@/components/shared/ProductCtas";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { HorizontalScroll } from "@/components/shared/HorizontalScroll";
import type { ComparisonCardModel, ComparisonFitKey } from "@/lib/recommendations";
import { localizeProduct } from "@/lib/product-i18n";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn, hasMediaUrl } from "@/lib/utils";
import type { ShopperProfileId } from "@/types";
import Image from "next/image";

const FIT_KEY_TO_MSG: Record<ComparisonFitKey, string> = {
  marina_flagship: "searchSerp.compareFitMarinaFlagship",
  marina_portable: "searchSerp.compareFitMarinaPortable",
  marina_balanced: "searchSerp.compareFitMarinaBalanced",
  ricardo_budget: "searchSerp.compareFitRicardoBudget",
  ricardo_mid: "searchSerp.compareFitRicardoMid",
};

function ComparisonCard({ row }: { row: ComparisonCardModel }) {
  const t = useT();
  const p = localizeProduct(row.product);
  return (
    <Card className="flex h-full min-w-0 flex-col overflow-hidden p-0 shadow-none transition hover:border-stone-300/90">
      <AskImageButton productLabel={p.title} productId={row.product.id} className="aspect-[16/10] w-full shrink-0 bg-[#f5f5f5]">
        <div className="relative h-full w-full">
          {hasMediaUrl(row.product.heroImage) ? (
            <Image
              src={row.product.heroImage}
              alt=""
              fill
              className="object-contain"
              sizes="(max-width: 640px) 90vw, (max-width: 28rem) 85vw, 33vw"
              unoptimized
            />
          ) : (
            <EmptyMediaSlot className="absolute inset-0" variant="light" />
          )}
        </div>
      </AskImageButton>
      <div className="flex min-h-0 flex-1 flex-col p-4">
        <EyebrowPill>{t(FIT_KEY_TO_MSG[row.fitKey])}</EyebrowPill>
        <p className="mt-2 text-[15px] font-semibold leading-snug text-stone-900">{p.title}</p>
        <ul className="mt-3 space-y-1.5 text-[15px] leading-relaxed text-stone-600">
          {row.pros.map((x) => (
            <li key={x}>+ {x}</li>
          ))}
          {row.tradeoffs.map((x) => (
            <li key={x} className="text-stone-500">
              Δ {x}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-col gap-2.5 pt-4 sm:flex-row">
          <ProductExploreLink
            productId={row.product.id}
            className={cn(
              ui.home.ctaSecondaryOutline,
              "flex h-11 min-h-0 flex-1 items-center justify-center text-[15px] sm:text-[16px]",
              ui.home.focusRing,
              "focus-visible:rounded-full",
            )}
          >
            {t("common.explore")}
          </ProductExploreLink>
          <ProductBuyNowButton
            productId={row.product.id}
            className={cn(
              ui.home.ctaPrimaryFill,
              "flex h-11 min-h-0 flex-1 items-center justify-center text-[15px] sm:text-[16px]",
              ui.home.focusRing,
              "focus-visible:rounded-full",
            )}
          >
            {t("common.buyNow")}
          </ProductBuyNowButton>
        </div>
      </div>
    </Card>
  );
}

export function ComparisonStrip({ items, profile }: { items: ComparisonCardModel[]; profile: ShopperProfileId }) {
  const t = useT();
  const title =
    profile === "marina" ? t("searchSerp.compareTitleMarina") : t("searchSerp.compareTitleRicardo");

  return (
    <section aria-label={`${t("searchSerp.compareEyebrow")} — ${title}`} className="min-w-0">
      <div className="mb-4 min-w-0 sm:mb-5">
        <p className={ui.searchSerpSectionKicker}>{t("searchSerp.compareEyebrow")}</p>
        <h2 className={cn("mt-2", ui.home.sectionTitle)}>{title}</h2>
      </div>
      <HorizontalScroll fillRowFromMd className="pb-0.5">
        {items.map((row) => (
          <div
            key={row.product.id}
            className="w-[min(100%,19rem)] shrink-0 snap-start sm:w-[min(100%,20rem)] @md:w-auto @md:min-w-0 @md:flex-1 @md:basis-0 @md:shrink @md:snap-none"
          >
            <ComparisonCard row={row} />
          </div>
        ))}
      </HorizontalScroll>
    </section>
  );
}
