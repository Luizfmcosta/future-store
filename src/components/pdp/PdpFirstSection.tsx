"use client";

import { PdpBackButton } from "@/components/pdp/PdpBackButton";
import { PdpLeadColumn } from "@/components/pdp/PdpLeadColumn";
import { PdpMediaGallery } from "@/components/pdp/PdpMediaGallery";
import type { Product } from "@/types";
import type { ShopperProfileId } from "@/types";

/**
 * PDP “above the fold”: back control, hero media (rounded card), lead column.
 * Capped at 1280px and centered; horizontal inset comes from the PDP scroll column (`px-4 sm:px-6`).
 */
export function PdpFirstSection({
  product,
  profile,
  selectedColorKey,
  onSelectedColorKeyChange,
  imageTintHex,
}: {
  product: Product;
  profile: ShopperProfileId;
  selectedColorKey: string;
  onSelectedColorKeyChange: (labelKey: string) => void;
  imageTintHex?: string;
}) {
  return (
    <section className="w-full min-w-0" aria-label="Product details">
      <div className="mx-auto w-full min-w-0 max-w-[1280px]">
        <header className="w-full pt-6 sm:pt-9">
          <div className="mb-3 flex w-full justify-start sm:mb-4">
            <PdpBackButton />
          </div>
        </header>

        {/* Mobile / small: stacked. lg+: image + title row to save vertical space. */}
        <div className="mt-4 flex w-full min-w-0 flex-col gap-8 lg:mt-6 lg:flex-row lg:items-start lg:gap-10 xl:gap-12">
          {/* flex-1: hero uses remaining row width after the capped lead column (wide frames were leaving empty space). */}
          <div className="min-w-0 w-full flex-1">
            <PdpMediaGallery
              product={product}
              tintHex={imageTintHex}
              selectedColorKey={selectedColorKey}
              onSelectedColorKeyChange={onSelectedColorKeyChange}
            />
          </div>
          <div className="mx-auto w-full min-w-0 max-w-2xl shrink-0 lg:mx-0 lg:max-w-lg xl:max-w-xl">
            <PdpLeadColumn
              product={product}
              profile={profile}
              className="lg:pt-0"
              selectedColorKey={selectedColorKey}
              onSelectedColorKeyChange={onSelectedColorKeyChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
