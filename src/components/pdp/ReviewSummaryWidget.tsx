"use client";

import { ReviewStars } from "@/components/pdp/ReviewStars";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { ui } from "@/lib/ui-tokens";
import { useT } from "@/lib/useT";
import type { Product } from "@/types";
import type { ShopperProfileId } from "@/types";

function formatReviewCount(count: number) {
  return new Intl.NumberFormat("en-US").format(count);
}

export function ReviewSummaryWidget({ product, profile }: { product: Product; profile: ShopperProfileId }) {
  const t = useT();
  const { average, count } = product.reviewRating;

  return (
    <div id="pdp-reviews" className="scroll-mt-8">
      <EyebrowPill>{t("pdp.reviewSummaryEyebrow")}</EyebrowPill>
      <div className="mt-6 flex flex-wrap items-end gap-x-3 gap-y-2">
        <ReviewStars rating={average} className="gap-1" />
        <span className="text-3xl font-light tabular-nums text-neutral-900">{average.toFixed(1)}</span>
        <span className="pb-0.5 text-[14px] text-neutral-600">
          {t("pdp.reviewsCount", { count: formatReviewCount(count) })}
        </span>
      </div>
      <h3 className="mt-8 text-xl font-light text-neutral-900 sm:text-2xl">
        {profile === "marina" ? t("pdp.reviewAngleMarina") : t("pdp.reviewAngleRicardo")}
      </h3>
      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
        <div>
          <p className={ui.home.label}>{t("pdp.reviewStrengthsLabel")}</p>
          <ul className="mt-4 space-y-3 text-[14px] leading-relaxed text-neutral-700">
            {product.reviewStrengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className={ui.home.label}>{t("pdp.reviewTradeoffsLabel")}</p>
          <ul className="mt-4 space-y-3 text-[14px] leading-relaxed text-neutral-500">
            {product.reviewWeaknesses.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
