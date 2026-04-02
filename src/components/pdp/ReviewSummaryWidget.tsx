"use client";

import { Card } from "@/components/shared/Card";
import type { Product } from "@/types";
import type { ShopperProfileId } from "@/types";

export function ReviewSummaryWidget({ product, profile }: { product: Product; profile: ShopperProfileId }) {
  return (
    <Card className="p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7d869c]">Review summary</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{profile === "marina" ? "Quality and tradeoffs" : "Trust and popularity"}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-[12px] font-semibold text-[#a8b4d8]">Strengths</p>
          <ul className="mt-2 space-y-1.5 text-[13px] text-[#c5ccdf]">
            {product.reviewStrengths.map((s) => (
              <li key={s}>— {s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[12px] font-semibold text-[#a8b4d8]">Tradeoffs</p>
          <ul className="mt-2 space-y-1.5 text-[13px] text-[#9aa3b8]">
            {product.reviewWeaknesses.map((s) => (
              <li key={s}>— {s}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
