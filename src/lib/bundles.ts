import { bundles as bundleDefs } from "@/data/bundles";
import { getProductById } from "@/data/products";
import type { Product } from "@/types";
import type { ShopperProfileId } from "@/types";

export type BundleOption = {
  bundleId: string;
  title: string;
  soundbar: Product;
  savings: number;
  blurb: string;
  comboPrice: number;
};

export function getBundleOptions(profile: ShopperProfileId, tv: Product): {
  primary: BundleOption | null;
  premium: BundleOption | null;
  cheaper: BundleOption | null;
} {
  const related = bundleDefs.filter((b) => b.productIds[0] === tv.id);
  const primary = related[0];
  const sbPremium = getProductById("sp-era-300");
  const sbEcho = getProductById("sp-era-100");
  const sbPulse = getProductById("sp-roam-2");

  const make = (def: typeof bundleDefs[0] | undefined, sb: Product | undefined): BundleOption | null => {
    if (!def || !sb) return null;
    return {
      bundleId: def.id,
      title: def.title,
      soundbar: sb,
      savings: def.savings,
      blurb: def.blurb,
      comboPrice: tv.price + sb.price - def.savings,
    };
  };

  let primaryOpt = primary ? make(primary, getProductById(primary.productIds[1]) ?? undefined) : null;

  if (!primaryOpt && sbEcho) {
    const def = bundleDefs.find((b) => b.productIds[0] === tv.id && b.productIds[1] === sbEcho.id);
    primaryOpt = def ? make(def, sbEcho) : null;
  }

  const premiumOpt =
    profile === "marina" && sbPremium
      ? ({
          bundleId: "virtual-premium",
          title: "Spatial upgrade — Era 300",
          soundbar: sbPremium,
          savings: Math.min(400, Math.round(tv.price * 0.04)),
          blurb: "Add flagship spatial audio to your setup",
          comboPrice: tv.price + sbPremium.price - Math.min(400, Math.round(tv.price * 0.04)),
        } satisfies BundleOption)
      : sbPremium
        ? ({
            bundleId: "virtual-premium",
            title: "Upgrade path — Era 300",
            soundbar: sbPremium,
            savings: 280,
            blurb: "Step-up clarity for open rooms",
            comboPrice: tv.price + sbPremium.price - 280,
          } satisfies BundleOption)
        : null;

  const cheaperSb = profile === "ricardo" ? sbPulse ?? sbEcho : sbEcho ?? sbPulse;
  const cheaperOpt =
    cheaperSb && cheaperSb.id !== primaryOpt?.soundbar.id
      ? ({
          bundleId: "virtual-value",
          title: "Lean add-on — Roam 2",
          soundbar: cheaperSb,
          savings: 120,
          blurb: profile === "ricardo" ? "Keeps monthly payment lower" : "Portable speaker to extend your system",
          comboPrice: tv.price + cheaperSb.price - 120,
        } satisfies BundleOption)
      : null;

  return { primary: primaryOpt, premium: premiumOpt, cheaper: cheaperOpt };
}
