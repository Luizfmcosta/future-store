"use client";

import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { useT } from "@/lib/useT";
import type { Product } from "@/types";

export function CompatibilityWidget({ product }: { product: Product }) {
  const t = useT();

  return (
    <div>
      <EyebrowPill>{t("pdp.compatibilityEyebrow")}</EyebrowPill>
      <h3 className="mt-4 text-2xl font-normal leading-tight text-neutral-900 sm:text-3xl">{t("pdp.compatibilityTitle")}</h3>
      <p className="mt-4 max-w-[40rem] text-[15px] leading-relaxed text-neutral-600 sm:text-[16px]">{t("pdp.compatibilityBody")}</p>
      <ul className="mt-8 flex flex-wrap gap-2">
        {product.compatibilityTags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-black/[0.06] bg-neutral-50 px-3 py-1.5 text-[15px] font-medium text-neutral-800"
          >
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
}
