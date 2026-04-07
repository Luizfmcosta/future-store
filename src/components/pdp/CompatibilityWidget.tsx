"use client";

import { Card } from "@/components/shared/Card";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { StatPill } from "@/components/shared/StatPill";
import { useT } from "@/lib/useT";
import type { Product } from "@/types";

export function CompatibilityWidget({ product }: { product: Product }) {
  const t = useT();

  return (
    <Card className="p-5 sm:p-6">
      <EyebrowPill>{t("pdp.compatibilityEyebrow")}</EyebrowPill>
      <h3 className="mt-2 text-lg font-semibold text-stone-900">{t("pdp.compatibilityTitle")}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-stone-600 sm:text-[14px]">{t("pdp.compatibilityBody")}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {product.compatibilityTags.map((tag) => (
          <StatPill key={tag} label={tag} />
        ))}
      </div>
    </Card>
  );
}
