import { products } from "@/data/products";
import type { Product } from "@/types";
import type { SearchIntent } from "@/types";
import type { ShopperProfileId } from "@/types";

function scoreAudioProduct(p: Product, intent: SearchIntent, profile: ShopperProfileId): number {
  if (p.category === "tv") {
    let s = 32;
    s += Math.max(0, (5000 - p.price) / 120);
    if (p.oldPrice) s += 18;
    if (profile === "ricardo") {
      s += 22;
      if (p.sponsored) s += 10;
      s += (p.stock / 250) * 1.2;
    }
    if (p.price <= (intent.budget ?? 8000)) s += 24;
    return s;
  }
  if (p.category !== "speaker" && p.category !== "soundbar") return -1e9;
  let s = 0;
  const budget = intent.budget ?? 8000;
  const premiumBias = profile === "marina" ? 1.15 : profile === "joana" ? 1.04 : 0.92;
  const valueBias = profile === "ricardo" ? 1.2 : profile === "joana" ? 1.08 : 1;
  const tvOrTheater =
    intent.priority === "cinema" ||
    intent.useCase?.includes("tv_audio") ||
    intent.useCase?.includes("spatial_audio");

  if (p.category === "soundbar") {
    if (tvOrTheater) s += 44;
    else if (intent.priority === "sports") s += 26;
    else s += 6;
  }

  if (p.marginTier === "high") s += 35 * premiumBias;
  if (p.marginTier === "mid") s += 22 * premiumBias;
  if (p.marginTier === "low") s += 14 * valueBias;

  if (p.price <= budget) s += 50;
  else s -= Math.min(80, (p.price - budget) / 50);

  if (intent.roomDistanceKey === "3m_listening") {
    s += profile === "marina" ? 20 : profile === "joana" ? 24 : 28;
    if (p.category === "soundbar") s += 12;
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
  if (profile === "joana") {
    s += (p.reviewStrengths.length + (p.gallery?.length ?? 0)) * 1.5;
    if (p.marginTier === "mid") s += 18;
    if (p.sponsored) s += 6;
  }

  return s;
}

export function getSearchResults(profile: ShopperProfileId, intent: SearchIntent): Product[] {
  const pool = products.filter(
    (p) => p.category === "speaker" || p.category === "soundbar" || p.category === "tv",
  );
  const ranked = [...pool].sort(
    (a, b) => scoreAudioProduct(b, intent, profile) - scoreAudioProduct(a, intent, profile),
  );
  return ranked;
}
