import { products } from "@/data/products";
import type { Product } from "@/types";
import type { SearchIntent } from "@/types";
import type { ShopperProfileId } from "@/types";

function scoreTv(p: Product, intent: SearchIntent, profile: ShopperProfileId): number {
  if (p.category !== "tv") return -1e9;
  let s = 0;
  const budget = intent.budget ?? 8000;
  const premiumBias = profile === "marina" ? 1.15 : 0.92;
  const valueBias = profile === "ricardo" ? 1.2 : 1;

  if (p.technology === "OLED") s += 40 * premiumBias;
  if (p.technology === "QLED") s += 28 * premiumBias;
  if (p.technology === "LED") s += 18 * valueBias;

  if (p.price <= budget) s += 50;
  else s -= Math.min(80, (p.price - budget) / 50);

  const inches = p.inches ?? 55;
  if (intent.roomDistance?.includes("3m")) {
    if (inches >= 55 && inches <= 65) s += profile === "marina" ? 35 : 45;
    if (inches >= 75) s += profile === "marina" ? 25 : 5;
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
  const tvs = products.filter((p) => p.category === "tv");
  const ranked = [...tvs].sort((a, b) => scoreTv(b, intent, profile) - scoreTv(a, intent, profile));
  return ranked;
}
