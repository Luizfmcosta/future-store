import { getMessage } from "@/lib/messages";
import type { AppLocale } from "@/lib/locale-types";
import type { ShopperProfileId } from "@/types";

export function heroCopy(profile: ShopperProfileId, locale: AppLocale) {
  const b =
    profile === "marina" ? "hero.marina" : profile === "ricardo" ? "hero.ricardo" : "hero.joana";
  return {
    kicker: getMessage(locale, `${b}.kicker`) ?? "",
    titleLine1: getMessage(locale, `${b}.titleLine1`) ?? "",
    titleLine2: getMessage(locale, `${b}.titleLine2`) ?? "",
    subtitle: getMessage(locale, `${b}.subtitle`) ?? "",
    cta: getMessage(locale, `${b}.cta`) ?? "",
    featuredEyebrow: getMessage(locale, `${b}.featuredEyebrow`) ?? "",
  };
}

export function proofTitle(profile: ShopperProfileId, locale: AppLocale): string {
  const key =
    profile === "marina" ? "proof.marina" : profile === "ricardo" ? "proof.ricardo" : "proof.joana";
  return getMessage(locale, key) ?? "";
}
