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
      <header className="w-full pt-6 sm:pt-9">
        <div className="mb-3 flex w-full justify-start sm:mb-4">
          <PdpBackButton />
        </div>
      </header>

      {/* Mobile / small: stacked. lg+: image + title row to save vertical space. */}
      <div className="mt-4 flex w-full min-w-0 flex-col gap-8 lg:mt-6 lg:flex-row lg:items-start lg:gap-10 xl:gap-12">
        <div className="min-w-0 w-full shrink-0 lg:max-w-[min(100%,30rem)] xl:max-w-[min(100%,36rem)] 2xl:max-w-[min(100%,42rem)]">
          <PdpMediaGallery product={product} />
        </div>
        <div className="mx-auto w-full min-w-0 max-w-2xl flex-1 lg:mx-0 lg:max-w-lg xl:max-w-xl">
          <PdpLeadColumn product={product} profile={profile} className="lg:pt-0" />
        </div>
      </div>
    </section>
  );
}
