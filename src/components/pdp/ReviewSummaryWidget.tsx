"use client";

import { Card } from "@/components/shared/Card";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import type { Product } from "@/types";
import type { ShopperProfileId } from "@/types";

export function ReviewSummaryWidget({ product, profile }: { product: Product; profile: ShopperProfileId }) {
  return (
    <Card className="p-5 sm:p-6">
      <EyebrowPill>Review summary</EyebrowPill>
      <h3 className="mt-2 text-lg font-semibold text-stone-900">
        {profile === "marina" ? "Quality and tradeoffs" : profile === "joana" ? "Balance and real-world use" : "Trust and popularity"}
      </h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-[12px] font-semibold text-stone-600">Strengths</p>
          <ul className="mt-2 space-y-1.5 text-[13px] text-stone-700">
            {product.reviewStrengths.map((s) => (
              <li key={s}>— {s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[12px] font-semibold text-stone-600">Tradeoffs</p>
          <ul className="mt-2 space-y-1.5 text-[13px] text-stone-500">
            {product.reviewWeaknesses.map((s) => (
              <li key={s}>— {s}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
