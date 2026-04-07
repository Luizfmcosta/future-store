"use client";

import { Card } from "@/components/shared/Card";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import type { Product } from "@/types";

export function PolicySummaryWidget({ product }: { product: Product }) {
  return (
    <Card className="p-5 sm:p-6">
      <EyebrowPill>Policies</EyebrowPill>
      <h3 className="mt-2 text-lg font-semibold text-stone-900">Warranty and returns</h3>
      <dl className="mt-4 space-y-3 text-[14px]">
        <div>
          <dt className="text-stone-500">Returns</dt>
          <dd className="font-medium text-stone-900">{product.returnPolicyShort}</dd>
        </div>
        <div>
          <dt className="text-stone-500">Warranty</dt>
          <dd className="font-medium text-stone-900">{product.warrantyShort}</dd>
        </div>
      </dl>
    </Card>
  );
}
