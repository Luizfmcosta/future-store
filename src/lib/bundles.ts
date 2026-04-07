import { bundles as bundleDefs } from "@/data/bundles";
import { getProductById } from "@/data/products";
import { formatMessage, getMessage } from "@/lib/messages";
import type { AppLocale } from "@/lib/locale-types";
import { localizeProduct } from "@/lib/product-i18n";
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

const BUNDLE_DEF_I18N: Record<string, { titleKey: string; bodyKey: string }> = {
  "bnd-era-roam": { titleKey: "cart.bundleDefBndEraRoamTitle", bodyKey: "cart.bundleDefBndEraRoamBody" },
  "bnd-era-pair-roam": { titleKey: "cart.bundleDefBndEraPairRoamTitle", bodyKey: "cart.bundleDefBndEraPairRoamBody" },
  "bnd-move-roam": { titleKey: "cart.bundleDefBndMoveRoamTitle", bodyKey: "cart.bundleDefBndMoveRoamBody" },
  "bnd-era-move": { titleKey: "cart.bundleDefBndEraMoveTitle", bodyKey: "cart.bundleDefBndEraMoveBody" },
  "bnd-arc-sub": { titleKey: "cart.bundleDefBndArcSubTitle", bodyKey: "cart.bundleDefBndArcSubBody" },
  "bnd-beam-roam": { titleKey: "cart.bundleDefBndBeamRoamTitle", bodyKey: "cart.bundleDefBndBeamRoamBody" },
  "bnd-five-era300": { titleKey: "cart.bundleDefBndFiveEra300Title", bodyKey: "cart.bundleDefBndFiveEra300Body" },
};

function T(locale: AppLocale, path: string, params?: Record<string, string | number>): string {
  const raw = getMessage(locale, path) ?? "";
  return params ? formatMessage(raw, params) : raw;
}

export function getBundleOptions(
  profile: ShopperProfileId,
  tv: Product,
  locale: AppLocale,
): {
  primary: BundleOption | null;
  premium: BundleOption | null;
  cheaper: BundleOption | null;
} {
  const related = bundleDefs.filter((b) => b.productIds[0] === tv.id);
  const primary = related[0];
  const sbPremium = getProductById("sp-era-300");
  const sbEcho = getProductById("sp-era-100");
  const sbPulse = getProductById("sp-roam-2");

  const make = (def: (typeof bundleDefs)[0] | undefined, sb: Product | undefined): BundleOption | null => {
    if (!def || !sb) return null;
    const keys = BUNDLE_DEF_I18N[def.id];
    const title = keys ? T(locale, keys.titleKey) : def.title;
    const blurb = keys ? T(locale, keys.bodyKey) : def.blurb;
    return {
      bundleId: def.id,
      title,
      soundbar: sb,
      savings: def.savings,
      blurb,
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
          title: T(locale, "cart.virtualPremiumMarinaTitle"),
          soundbar: sbPremium,
          savings: Math.min(400, Math.round(tv.price * 0.04)),
          blurb: T(locale, "cart.virtualPremiumMarinaBlurb"),
          comboPrice: tv.price + sbPremium.price - Math.min(400, Math.round(tv.price * 0.04)),
        } satisfies BundleOption)
      : profile === "joana" && sbPremium
        ? ({
            bundleId: "virtual-premium",
            title: T(locale, "cart.virtualPremiumJoanaTitle"),
            soundbar: sbPremium,
            savings: Math.min(320, Math.round(tv.price * 0.035)),
            blurb: T(locale, "cart.virtualPremiumJoanaBlurb"),
            comboPrice: tv.price + sbPremium.price - Math.min(320, Math.round(tv.price * 0.035)),
          } satisfies BundleOption)
        : sbPremium
          ? ({
              bundleId: "virtual-premium",
              title: T(locale, "cart.virtualPremiumRicardoTitle"),
              soundbar: sbPremium,
              savings: 280,
              blurb: T(locale, "cart.virtualPremiumRicardoBlurb"),
              comboPrice: tv.price + sbPremium.price - 280,
            } satisfies BundleOption)
          : null;

  const cheaperSb =
    profile === "ricardo" ? sbPulse ?? sbEcho : profile === "joana" ? sbEcho ?? sbPulse : sbEcho ?? sbPulse;
  const cheaperSbLoc = cheaperSb ? localizeProduct(cheaperSb, locale) : undefined;
  const cheaperName = cheaperSbLoc?.title.split("—")[0].trim() ?? "Roam 2";
  const cheaperOpt =
    cheaperSb && cheaperSb.id !== primaryOpt?.soundbar.id
      ? ({
          bundleId: "virtual-value",
          title: T(locale, "cart.virtualCheaperTitle", { name: cheaperName }),
          soundbar: cheaperSb,
          savings: 120,
          blurb: T(
            locale,
            profile === "ricardo"
              ? "cart.virtualCheaperBlurbRicardo"
              : profile === "joana"
                ? "cart.virtualCheaperBlurbJoana"
                : "cart.virtualCheaperBlurbMarina",
          ),
          comboPrice: tv.price + cheaperSb.price - 120,
        } satisfies BundleOption)
      : null;

  return { primary: primaryOpt, premium: premiumOpt, cheaper: cheaperOpt };
}
