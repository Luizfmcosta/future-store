import type { AgentSurface } from "@/types";
import type { Product } from "@/types";
import type { ShopperProfileId } from "@/types";

export function getAgentSurface(product: Product, profile: ShopperProfileId): AgentSurface {
  const base = 0.78;
  const profileBoost =
    profile === "marina" && product.marginTier === "high"
      ? 0.07
      : profile === "ricardo" && product.sponsored
        ? 0.05
        : 0;
  const stockBoost = Math.min(0.1, product.stock / 500);

  return {
    sku: product.sku,
    title: product.title,
    price: product.price,
    availability: product.stock,
    deliveryPromise: product.deliveryETA,
    returns: product.returnPolicyShort,
    compatibility: product.compatibilityTags,
    bundleEligible:
      product.category === "tv" || product.category === "soundbar" || product.category === "speaker",
    confidenceScore: Math.min(0.97, base + profileBoost + stockBoost),
  };
}
