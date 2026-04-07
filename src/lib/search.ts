import { products } from "@/data/products";
import type { Product } from "@/types";
import type { SearchIntent } from "@/types";
import type { ShopperProfileId } from "@/types";

function scoreSpeaker(p: Product, intent: SearchIntent, profile: ShopperProfileId): number {
  if (p.category !== "speaker") return -1e9;
  let s = 0;
  const budget = intent.budget ?? 8000;
  const premiumBias = profile === "marina" ? 1.15 : 0.92;
  const valueBias = profile === "ricardo" ? 1.2 : 1;

  if (p.marginTier === "high") s += 35 * premiumBias;
  if (p.marginTier === "mid") s += 22 * premiumBias;
  if (p.marginTier === "low") s += 14 * valueBias;

  if (p.price <= budget) s += 50;
  else s -= Math.min(80, (p.price - budget) / 50);

  if (intent.roomDistance?.includes("3m")) {
    s += profile === "marina" ? 20 : 28;
  }

  if (intent.priority === "best-value") {
    s += (8000 - p.price) / 200;
    if (p.oldPrice) s += 15 * valueBias;
  }
  if (intent.priority === "premium") {
    s += p.marginTier === "high" ? 40 : 10;
  }

  if (profile === "ricardo") {
    if (p.sponsored) s += 12;
    s += (p.stock / 200) * valueBias;
  }
  if (profile === "marina") {
    s += (p.reviewStrengths.length + (p.gallery?.length ?? 0)) * 2;
    if (p.marginTier === "high") s += 20;
  }

  return s;
}

export function getSearchResults(profile: ShopperProfileId, intent: SearchIntent): Product[] {
  const speakers = products.filter((p) => p.category === "speaker");
  const ranked = [...speakers].sort(
    (a, b) => scoreSpeaker(b, intent, profile) - scoreSpeaker(a, intent, profile),
  );
  return ranked;
}
