"use client";

import { Card } from "@/components/shared/Card";
import type { Product } from "@/types";

export function PolicySummaryWidget({ product }: { product: Product }) {
  return (
    <Card className="p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7d869c]">Policies</p>
      <h3 className="mt-2 text-lg font-semibold text-white">Warranty and returns</h3>
      <dl className="mt-4 space-y-3 text-[14px]">
        <div>
          <dt className="text-[#7d869c]">Returns</dt>
          <dd className="font-medium text-[#e8ecf4]">{product.returnPolicyShort}</dd>
        </div>
        <div>
          <dt className="text-[#7d869c]">Warranty</dt>
          <dd className="font-medium text-[#e8ecf4]">{product.warrantyShort}</dd>
        </div>
      </dl>
    </Card>
  );
}
