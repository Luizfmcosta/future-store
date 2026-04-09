"use client";

import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { useT } from "@/lib/useT";
import type { Product } from "@/types";

export function PolicySummaryWidget({ product }: { product: Product }) {
  const t = useT();
  return (
    <div>
      <EyebrowPill>{t("pdp.policyHeading")}</EyebrowPill>
      <dl className="mt-8 space-y-6 text-[15px]">
        <div>
          <dt className="text-[15px] text-neutral-500">{t("pdp.policyReturnsLabel")}</dt>
          <dd className="mt-1 font-medium text-neutral-900">{product.returnPolicyShort}</dd>
        </div>
        <div>
          <dt className="text-[15px] text-neutral-500">{t("pdp.policyWarrantyLabel")}</dt>
          <dd className="mt-1 font-medium text-neutral-900">{product.warrantyShort}</dd>
        </div>
      </dl>
    </div>
  );
}
