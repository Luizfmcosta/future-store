import { products } from "@/data/products";
import type { Product } from "@/types";
import type { SearchIntent } from "@/types";
import type { ShopperProfileId } from "@/types";

export function getBestMatch(
  profile: ShopperProfileId,
  results: Product[],
  intent: SearchIntent
): Product | undefined {
  const tvs = results.filter((p) => p.category === "tv");
  if (!tvs.length) return undefined;
  if (profile === "marina") {
    const oled = tvs.find((p) => p.technology === "OLED" && (p.inches ?? 0) >= 55);
    return oled ?? tvs[0];
  }
  const under = tvs.filter((p) => !intent.budget || p.price <= intent.budget);
  const pool = under.length ? under : tvs;
  return [...pool].sort((a, b) => {
    const av = (a.oldPrice ? a.oldPrice - a.price : 0) + (a.sponsored ? 20 : 0);
    const bv = (b.oldPrice ? b.oldPrice - b.price : 0) + (b.sponsored ? 20 : 0);
    return bv - av || a.price - b.price;
  })[0];
}

export type ComparisonCardModel = {
  product: Product;
  pros: string[];
  tradeoffs: string[];
  fit: string;
};

export function getComparisonCards(profile: ShopperProfileId, results: Product[]): ComparisonCardModel[] {
  const tvs = results.filter((p) => p.category === "tv").slice(0, 6);
  const pick =
    profile === "marina"
      ? [tvs.find((p) => p.technology === "OLED"), tvs.find((p) => p.technology === "QLED"), tvs.find((p) => p.technology === "LED")]
      : [tvs[0], tvs[1], tvs[2]];

  const chosen = pick.filter(Boolean) as Product[];
  const uniq: Product[] = [];
  for (const p of chosen) {
    if (!uniq.find((x) => x.id === p.id)) uniq.push(p);
    if (uniq.length >= 3) break;
  }
  while (uniq.length < 3 && tvs[uniq.length]) {
    const next = tvs.find((p) => !uniq.includes(p));
    if (next) uniq.push(next);
    else break;
  }

  return uniq.slice(0, 3).map((product) => ({
    product,
    pros: product.reviewStrengths.slice(0, 2),
    tradeoffs: product.reviewWeaknesses.slice(0, 1),
    fit:
      profile === "marina"
        ? product.technology === "OLED"
          ? "Dark-room reference"
          : product.technology === "QLED"
            ? "Bright-room punch"
            : "Balanced value"
        : product.price < 3500
          ? "Budget-smart"
          : "Popular mid tier",
  }));
}

export function getLearningWidget(intent: SearchIntent): { title: string; body: string; tag: string } {
  if (intent.priority === "cinema" || intent.useCase?.some((u) => u.includes("OLED"))) {
    return {
      title: "OLED vs QLED",
      body: "OLED excels in contrast in dark rooms; QLED pushes higher sustained brightness for daytime sports.",
      tag: "2 min read",
    };
  }
  return {
    title: "OLED vs QLED",
    body: "For ~3m seating, 55–65\" is the common balance. OLED favors film; QLED favors bright spaces.",
    tag: "Decision primer",
  };
}

export function getPdpInsights(profile: ShopperProfileId, product: Product) {
  const alt =
    profile === "ricardo"
      ? products.find((p) => p.category === "tv" && p.id !== product.id && p.price < product.price)
      : products.find((p) => p.category === "tv" && p.id !== product.id && p.marginTier === "high");

  return {
    idealTitle: profile === "marina" ? "Why this fits your setup" : "Straight talk: is this the one?",
    idealBody:
      profile === "marina"
        ? `At ${product.inches}" and ${product.technology}, this aligns with research-heavy home theater use and ${product.compatibilityTags.slice(0, 2).join(", ")}.`
        : `Sized for most living rooms. ${product.installmentText}. Strong pick if you want simplicity and ${product.bestFor[0]?.toLowerCase() ?? "everyday viewing"}.`,
    compareTitle: "Compared to paths you might like",
    premiumAccessoryId: profile === "marina" ? "sb-nova-atmos-500" : "sb-echo-compact-210",
    valueAlt: alt,
  };
}
