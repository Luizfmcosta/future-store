"use client";

import { Card } from "@/components/shared/Card";
import { useT } from "@/lib/useT";

export function LoyaltyCard() {
  const t = useT();

  return (
    <Card className="p-4 sm:p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">{t("cart.loyaltyEyebrow")}</p>
      <h3 className="mt-2 text-[15px] font-semibold text-stone-900">{t("cart.loyaltyTitle")}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-stone-600">{t("cart.loyaltyBody")}</p>
      <button
        type="button"
        className="mt-4 w-full rounded-full border border-stone-200/90 bg-stone-50 py-2.5 text-[13px] font-semibold text-stone-800 hover:bg-stone-100"
      >
        {t("cart.loyaltyCta")}
      </button>
    </Card>
  );
}
