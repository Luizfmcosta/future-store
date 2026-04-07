"use client";

import { Card } from "@/components/shared/Card";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { HorizontalScroll } from "@/components/shared/HorizontalScroll";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { useLocale } from "@/context/LocaleContext";
import type { ComparisonCardModel, ComparisonFitKey } from "@/lib/recommendations";
import { localizeProduct } from "@/lib/product-i18n";
import { useT } from "@/lib/useT";
import { hasMediaUrl } from "@/lib/utils";
import type { ShopperProfileId } from "@/types";
import Image from "next/image";
import Link from "next/link";

const FIT_KEY_TO_MSG: Record<ComparisonFitKey, string> = {
  marina_flagship: "searchSerp.compareFitMarinaFlagship",
  marina_portable: "searchSerp.compareFitMarinaPortable",
  marina_balanced: "searchSerp.compareFitMarinaBalanced",
  ricardo_budget: "searchSerp.compareFitRicardoBudget",
  ricardo_mid: "searchSerp.compareFitRicardoMid",
};

function ComparisonCard({ row }: { row: ComparisonCardModel }) {
  const { locale } = useLocale();
  const t = useT();
  const p = localizeProduct(row.product, locale);

  return (
    <Link href={`/product/${row.product.id}`} className="block h-full min-w-0">
      <Card className="flex h-full flex-col overflow-hidden p-0 transition hover:border-stone-300/90 hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.14)]">
        <div className="relative aspect-[16/10] w-full bg-[#f5f5f5]">
          {hasMediaUrl(row.product.heroImage) ? (
            <Image
              src={row.product.heroImage}
              alt=""
              fill
              className="object-contain"
              sizes="(max-width: 640px) 90vw, 320px"
              unoptimized
            />
          ) : (
            <EmptyMediaSlot className="absolute inset-0" variant="light" />
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">{t(FIT_KEY_TO_MSG[row.fitKey])}</p>
          <p className="mt-2 text-[15px] font-semibold leading-snug text-stone-900">{p.title}</p>
          <ul className="mt-3 space-y-1.5 text-[12px] leading-relaxed text-stone-600">
            {row.pros.map((x) => (
              <li key={x}>+ {x}</li>
            ))}
            {row.tradeoffs.map((x) => (
              <li key={x} className="text-stone-500">
                Δ {x}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </Link>
  );
}

export function ComparisonStrip({ items, profile }: { items: ComparisonCardModel[]; profile: ShopperProfileId }) {
  const t = useT();
  const title = profile === "marina" ? t("searchSerp.compareTitleMarina") : t("searchSerp.compareTitleRicardo");

  return (
    <section aria-label={`${t("searchSerp.compareEyebrow")} — ${title}`} className="min-w-0">
      <SectionTitle variant="editorial" eyebrow={t("searchSerp.compareEyebrow")} title={title} />
      <HorizontalScroll className="pb-0.5">
        {items.map((row) => (
          <div
            key={row.product.id}
            className="w-[min(100%,19rem)] shrink-0 snap-start sm:w-[min(100%,20rem)]"
          >
            <ComparisonCard row={row} />
          </div>
        ))}
      </HorizontalScroll>
    </section>
  );
}
