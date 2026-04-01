"use client";

import { Card } from "@/components/shared/Card";
import { StatPill } from "@/components/shared/StatPill";
import type { Product } from "@/types";

export function CompatibilityWidget({ product }: { product: Product }) {
  return (
    <Card className="p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7d869c]">Compatibility</p>
      <h3 className="mt-2 text-lg font-semibold text-white">Works well with this setup</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {product.compatibilityTags.map((t) => (
          <StatPill key={t} label={t} />
        ))}
      </div>
    </Card>
  );
}
