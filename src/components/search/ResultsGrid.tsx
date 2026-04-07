"use client";

import { Card } from "@/components/shared/Card";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { useLocale } from "@/context/LocaleContext";
import { localizeProduct } from "@/lib/product-i18n";
import { ui } from "@/lib/ui-tokens";
import { useT } from "@/lib/useT";
import { cn, formatBRL, hasMediaUrl } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import type { Product } from "@/types";
import type { ShopperProfileId } from "@/types";
import { SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ResultsGrid({ products, profile }: { products: Product[]; profile: ShopperProfileId }) {
  const { locale } = useLocale();
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
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-stone-200/90 bg-white px-3 py-1.5",
            "text-[12px] font-semibold text-stone-700 shadow-sm transition hover:border-stone-300/90 hover:bg-stone-50",
            ui.home.focusRing,
            "focus-visible:rounded-full",
          )}
          aria-label={t("searchSerp.refineGridAria")}
        >
          <SlidersHorizontal className="size-3.5 opacity-80" strokeWidth={2} aria-hidden />
          {t("searchSerp.refineGridButton")}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
        {products.map((product) => {
          const p = localizeProduct(product, locale);
          return (
            <Link key={p.id} href={`/product/${p.id}`}>
              <Card className="overflow-hidden p-0 transition hover:border-stone-300/90 hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.14)]">
                <div className="relative aspect-[16/10] w-full bg-[#f5f5f5]">
                  {hasMediaUrl(p.heroImage) ? (
                    <Image
                      src={p.heroImage}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="(max-width: 900px) 46vw, 400px"
                      unoptimized
                    />
                  ) : (
                    <EmptyMediaSlot className="absolute inset-0" variant="light" />
                  )}
                </div>
                <div className="space-y-1.5 p-2.5 sm:space-y-2 sm:p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[12px] font-medium text-stone-500">{p.brand}</p>
                    {p.sponsored ? (
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                        {t("searchSerp.sponsored")}
                      </span>
                    ) : null}
                  </div>
                  <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-stone-900 sm:text-[15px]">{p.title}</p>
                  <p className="line-clamp-2 text-[11px] text-stone-500 sm:text-[13px]">
                    {profile === "marina" ? p.bestFor[0] : p.deliveryETA}
                  </p>
                  <div className="flex flex-wrap items-baseline gap-1.5 pt-1 sm:gap-2">
                    <span className="text-[14px] font-semibold tabular-nums text-stone-900 sm:text-[16px]">
                      {formatBRL(p.price)}
                    </span>
                    {p.oldPrice ? (
                      <span className="text-[11px] tabular-nums text-stone-400 line-through sm:text-[13px]">
                        {formatBRL(p.oldPrice)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
