"use client";

import { AskImageButton } from "@/components/shared/AskImageButton";
import { Card } from "@/components/shared/Card";
import { ProductBuyNowButton, ProductExploreLink } from "@/components/shared/ProductCtas";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { localizeProduct } from "@/lib/product-i18n";
import { ui } from "@/lib/ui-tokens";
import { useT } from "@/lib/useT";
import { cn, formatBRL, hasMediaUrl } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import type { Product } from "@/types";
import type { ShopperProfileId } from "@/types";
import { SlidersHorizontal } from "lucide-react";
import Image from "next/image";

export function ResultsGrid({ products, profile }: { products: Product[]; profile: ShopperProfileId }) {
  const t = useT();
  const setRefineOpen = useDemoStore((s) => s.setRefineOpen);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="min-w-0 text-lg font-semibold text-stone-900">{t("searchSerp.resultsAllMatches")}</h3>
        <button
          type="button"
          onClick={() => setRefineOpen(true)}
          className={cn(
            ui.searchSerpFilterPill,
            "gap-1.5 font-semibold text-stone-700 hover:border-stone-300/90",
            ui.home.focusRing,
            "focus-visible:rounded-full",
          )}
          aria-label={t("searchSerp.refineGridAria")}
        >
          <SlidersHorizontal className="size-3.5 opacity-80" strokeWidth={2} aria-hidden />
          {t("searchSerp.refineGridButton")}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-5 @md:grid-cols-2">
        {products.map((product) => {
          const p = localizeProduct(product);
          return (
            <Card
              key={p.id}
              className="flex h-full flex-col overflow-hidden p-0 transition hover:border-stone-300/90 hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.14)]"
            >
              <AskImageButton productLabel={p.title} productId={p.id} className="aspect-[16/10] w-full shrink-0 bg-[#f5f5f5]">
                <div className="relative h-full min-h-0 w-full">
                  {hasMediaUrl(p.heroImage) ? (
                    <Image
                      src={p.heroImage}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="(max-width: 767px) min(100vw, 36rem), (max-width: 900px) 46vw, 400px"
                      unoptimized
                    />
                  ) : (
                    <EmptyMediaSlot className="absolute inset-0" variant="light" />
                  )}
                </div>
              </AskImageButton>
              <div className="flex min-h-0 flex-1 flex-col space-y-1.5 p-2.5 sm:space-y-2 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[15px] font-medium text-stone-500">{p.brand}</p>
                  {p.sponsored ? (
                    <span className="rounded-full bg-stone-100 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[15px] font-medium leading-none text-stone-600">
                      {t("searchSerp.sponsored")}
                    </span>
                  ) : null}
                </div>
                <p className="line-clamp-2 text-[15px] font-semibold leading-snug text-stone-900 sm:text-[17px]">{p.title}</p>
                <p className="line-clamp-2 text-[15px] text-stone-500 sm:text-[16px]">
                  {profile === "marina" ? p.bestFor[0] : p.deliveryETA}
                </p>
                <div className="flex flex-wrap items-baseline gap-1.5 pt-1 sm:gap-2">
                  <span className="text-[15px] font-semibold tabular-nums text-stone-900 sm:text-[17px]">
                    {formatBRL(p.price)}
                  </span>
                  {p.oldPrice ? (
                    <span className="text-[15px] tabular-nums text-stone-400 line-through sm:text-[16px]">
                      {formatBRL(p.oldPrice)}
                    </span>
                  ) : null}
                </div>
                <div className="mt-auto flex flex-col gap-2.5 pt-2 sm:flex-row sm:pt-3">
                  <ProductExploreLink
                    productId={p.id}
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
                    productId={p.id}
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
        })}
      </div>
    </section>
  );
}
