import { products } from "@/data/products";
import type { Product } from "@/types";
import type { SearchIntent } from "@/types";
import type { ShopperProfileId } from "@/types";

export function getBestMatch(
  profile: ShopperProfileId,
  results: Product[],
  intent: SearchIntent,
): Product | undefined {
  const speakers = results.filter((p) => p.category === "speaker");
  if (!speakers.length) return undefined;
  if (profile === "marina") {
    const flagship = speakers.find((p) => p.marginTier === "high" && p.price >= 4500);
    return flagship ?? speakers[0];
  }
  const under = speakers.filter((p) => !intent.budget || p.price <= intent.budget);
  const pool = under.length ? under : speakers;
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
  const speakers = results.filter((p) => p.category === "speaker").slice(0, 6);
  const pick =
    profile === "marina"
      ? [
          speakers.find((p) => p.id === "sp-home-theater"),
          speakers.find((p) => p.id === "sp-era-300"),
          speakers.find((p) => p.id === "sp-move-2"),
        ]
      : [speakers[0], speakers[1], speakers[2]];

  const chosen = pick.filter(Boolean) as Product[];
  const uniq: Product[] = [];
  for (const p of chosen) {
    if (!uniq.find((x) => x.id === p.id)) uniq.push(p);
    if (uniq.length >= 3) break;
  }
  while (uniq.length < 3 && speakers[uniq.length]) {
    const next = speakers.find((p) => !uniq.includes(p));
    if (next) uniq.push(next);
    else break;
  }

  return uniq.slice(0, 3).map((product) => ({
    product,
    pros: product.reviewStrengths.slice(0, 2),
    tradeoffs: product.reviewWeaknesses.slice(0, 1),
    fit:
      profile === "marina"
        ? product.marginTier === "high"
          ? "Flagship listening"
          : product.id.includes("roam")
            ? "Portable & outdoor"
            : "Balanced room sound"
        : product.price < 3500
          ? "Budget-smart"
          : "Popular mid tier",
  }));
}

export function getLearningWidget(intent: SearchIntent): { title: string; body: string; tag: string } {
  if (intent.priority === "cinema" || intent.useCase?.some((u) => u.includes("Atmos"))) {
    return {
      title: "Surround vs stereo",
      body: "A home theater set adds rear channels; stereo pairs shine for music in one room.",
      tag: "2 min read",
    };
  }
  return {
    title: "Portable vs room",
    body: "Roam and Move are built to move; Era models anchor a room with fuller output.",
    tag: "Decision primer",
  };
}

export function getPdpInsights(profile: ShopperProfileId, product: Product) {
  const alt =
    profile === "ricardo"
      ? products.find((p) => p.category === "speaker" && p.id !== product.id && p.price < product.price)
      : products.find((p) => p.category === "speaker" && p.id !== product.id && p.marginTier === "high");

  const techLine =
    product.category === "speaker"
      ? `${product.brand} with ${product.compatibilityTags.slice(0, 2).join(" and ")}`
      : `${product.technology} at ${product.inches}"`;

  return {
    idealTitle: profile === "marina" ? "Why this fits your setup" : "Straight talk: is this the one?",
    idealBody:
      profile === "marina"
        ? product.category === "speaker"
          ? `This ${product.title.split("—")[0].trim()} fits research-heavy listening: ${techLine}.`
          : `At ${product.inches}" and ${product.technology}, this aligns with home theater use and ${product.compatibilityTags.slice(0, 2).join(", ")}.`
        : `Sized for most rooms. ${product.installmentText}. Strong pick if you want ${product.bestFor[0]?.toLowerCase() ?? "everyday listening"}.`,
    compareTitle: "Compared to paths you might like",
    premiumAccessoryId: profile === "marina" ? "sp-era-300" : "sp-roam-2",
    valueAlt: alt,
  };
}
