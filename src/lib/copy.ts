import { getMessage } from "@/lib/messages";
import type { ShopperProfileId } from "@/types";

export function heroCopy(profile: ShopperProfileId) {
  const b = profile === "marina" ? "hero.marina" : "hero.ricardo";
  return {
    kicker: getMessage(`${b}.kicker`) ?? "",
    titleLine1: getMessage(`${b}.titleLine1`) ?? "",
    titleLine2: getMessage(`${b}.titleLine2`) ?? "",
    subtitle: getMessage(`${b}.subtitle`) ?? "",
    cta: getMessage(`${b}.cta`) ?? "",
    featuredEyebrow: getMessage(`${b}.featuredEyebrow`) ?? "",
  };
}

export function proofTitle(profile: ShopperProfileId): string {
  const key = profile === "marina" ? "proof.marina" : "proof.ricardo";
  return getMessage(key) ?? "";
}
