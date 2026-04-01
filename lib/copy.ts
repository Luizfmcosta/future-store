import type { ShopperProfileId } from "@/types";

export function heroCopy(profile: ShopperProfileId) {
  if (profile === "marina") {
    return {
      title: "Build a better home cinema",
      subtitle: "Curated panels and sound for controlled light, accurate color, and calm upgrades.",
      cta: "Compare before deciding",
    };
  }
  return {
    title: "Top TV deals this weekend",
    subtitle: "Straight prices, clear installments, fast-moving sizes — picked for real living rooms.",
    cta: "Shop popular picks",
  };
}

export function proofTitle(profile: ShopperProfileId): string {
  return profile === "marina" ? "What owners cite in reviews" : "Most chosen right now";
}

export function intentSummaryIntro(profile: ShopperProfileId): string {
  return profile === "marina"
    ? "Interpreted for your research style — technical fit first."
    : "Interpreted for quick decisions — value and clarity first.";
}
