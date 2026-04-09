"use client";

import { PdpBackButton } from "@/components/pdp/PdpBackButton";
import { PdpLeadColumn } from "@/components/pdp/PdpLeadColumn";
import { PdpMediaGallery } from "@/components/pdp/PdpMediaGallery";
import type { Product } from "@/types";
import type { ShopperProfileId } from "@/types";

/**
 * PDP “above the fold”: back control, hero media (rounded card), lead column.
 * Lives inside `main` padding — no negative horizontal margins so hero rounding isn’t fighting the scroll strip.
 */
export function PdpFirstSection({
  product,
  profile,
}: {
  product: Product;
  profile: ShopperProfileId;
}) {
  return (
    <section className="w-full min-w-0" aria-label="Product details">
      <header className="mx-auto max-w-3xl pt-6 sm:pt-9">
        <div className="mb-3 sm:mb-4">
          <PdpBackButton />
        </div>
      </header>

      <div className="mt-4 w-full min-w-0">
        <PdpMediaGallery product={product} />
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        <PdpLeadColumn product={product} profile={profile} />
      </div>
    </section>
  );
}
