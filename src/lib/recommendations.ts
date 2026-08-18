import { products } from "@/data/products";
import { isCatalogCompareQuery } from "@/lib/focusProducts";
import { getMessage } from "@/lib/messages";
import type { Product } from "@/types";
import type { SearchIntent } from "@/types";
import type { ShopperProfileId } from "@/types";

export function getBestMatch(
  profile: ShopperProfileId,
  results: Product[],
  intent: SearchIntent,
): Product | undefined {
  const audio = results.filter((p) => p.category === "speaker" || p.category === "soundbar");
  if (!audio.length) return undefined;

  const focusId = intent.focusProductIds?.[0];
  if (focusId) {
    const focused = audio.find((p) => p.id === focusId) ?? results.find((p) => p.id === focusId);
    if (focused) return focused;
  }

  if (profile === "marina") {
    const theater =
      intent.priority === "cinema" ||
      intent.useCase?.includes("tv_audio") ||
      intent.useCase?.includes("spatial_audio");
    if (theater) {
      const bar = audio.find((p) => p.category === "soundbar" && p.marginTier === "high");
      if (bar) return bar;
    }
    const flagship = audio.find((p) => p.marginTier === "high" && p.price >= 4500);
    return flagship ?? audio[0];
  }
  const under = audio.filter((p) => !intent.budget || p.price <= intent.budget);
  const pool = under.length ? under : audio;
  return [...pool].sort((a, b) => {
    const av = (a.oldPrice ? a.oldPrice - a.price : 0) + (a.sponsored ? 20 : 0);
    const bv = (b.oldPrice ? b.oldPrice - b.price : 0) + (b.sponsored ? 20 : 0);
    return bv - av || a.price - b.price;
  })[0];
}

export type ComparisonFitKey =
  | "marina_flagship"
  | "marina_portable"
  | "marina_balanced"
  | "ricardo_budget"
  | "ricardo_mid"
  | "named_room"
  | "named_tv"
  | "named_portable";

export type ComparisonCardModel = {
  product: Product;
  pros: string[];
  tradeoffs: string[];
  fitKey: ComparisonFitKey;
};

function msgList(...keys: string[]): string[] {
  return keys.map((k) => getMessage(k) ?? "").filter(Boolean);
}

function isPortableSpeaker(p: Product): boolean {
  return (
    p.id.includes("move") ||
    p.id.includes("roam") ||
    p.bestFor.some((x) => /patio|portable|outdoor|pátio|portátil/i.test(x))
  );
}

function namedCompareCard(product: Product): ComparisonCardModel {
  if (product.id === "sb-beam-g2" || product.category === "soundbar") {
    return {
      product,
      fitKey: "named_tv",
      pros: msgList("searchSerp.compareNamedTvPro1", "searchSerp.compareNamedTvPro2"),
      tradeoffs: msgList("searchSerp.compareNamedTvTradeoff"),
    };
  }
  if (product.id === "sp-move-2" || isPortableSpeaker(product)) {
    return {
      product,
      fitKey: "named_portable",
      pros: msgList("searchSerp.compareNamedPortablePro1", "searchSerp.compareNamedPortablePro2"),
      tradeoffs: msgList("searchSerp.compareNamedPortableTradeoff"),
    };
  }
  return {
    product,
    fitKey: "named_room",
    pros: msgList("searchSerp.compareNamedRoomPro1", "searchSerp.compareNamedRoomPro2"),
    tradeoffs: msgList("searchSerp.compareNamedRoomTradeoff"),
  };
}

export function getComparisonCards(
  profile: ShopperProfileId,
  results: Product[],
  intent?: SearchIntent | null,
): ComparisonCardModel[] {
  const focusIds = (intent?.focusProductIds ?? []).filter(Boolean);
  if (focusIds.length >= 2) {
    const named: Product[] = [];
    const seen = new Set<string>();
    for (const id of focusIds) {
      if (seen.has(id)) continue;
      const p = results.find((x) => x.id === id) ?? products.find((x) => x.id === id);
      if (!p) continue;
      named.push(p);
      seen.add(id);
      if (named.length >= 3) break;
    }
    if (named.length >= 2) return named.map(namedCompareCard);
  }

  const catalog = results.filter((p) => p.category === "speaker" || p.category === "soundbar");
  const pick =
    profile === "marina"
      ? [
          catalog.find((p) => p.id === "sb-arc-ultra"),
          catalog.find((p) => p.id === "sp-home-theater"),
          catalog.find((p) => p.id === "sp-era-300"),
        ]
      : [
          catalog.find((p) => p.id === "sb-ray"),
          catalog.find((p) => p.id === "sp-roam-2"),
          catalog.find((p) => p.id === "sp-era-100"),
        ];

  const chosen = pick.filter(Boolean) as Product[];
  const uniq: Product[] = [];
  for (const p of chosen) {
    if (!uniq.find((x) => x.id === p.id)) uniq.push(p);
    if (uniq.length >= 3) break;
  }
  while (uniq.length < 3 && catalog[uniq.length]) {
    const next = catalog.find((p) => !uniq.includes(p));
    if (next) uniq.push(next);
    else break;
  }

  return uniq.slice(0, 3).map((product) => {
    let fitKey: ComparisonFitKey;
    if (profile === "marina") {
      if (product.marginTier === "high" || product.category === "soundbar") fitKey = "marina_flagship";
      else if (product.id.includes("roam") || product.id.includes("move")) fitKey = "marina_portable";
      else fitKey = "marina_balanced";
    } else if (product.price < 3500) fitKey = "ricardo_budget";
    else fitKey = "ricardo_mid";

    return {
      product,
      pros: product.reviewStrengths.slice(0, 2),
      tradeoffs: product.reviewWeaknesses.slice(0, 1),
      fitKey,
    };
  });
}

export type LearningWidgetVariant = "surround" | "portable" | "setups";

export function getLearningWidgetVariant(intent: SearchIntent): LearningWidgetVariant {
  if (isCatalogCompareQuery(intent.rawQuery)) return "setups";
  if (intent.priority === "cinema" || intent.useCase?.includes("spatial_audio")) {
    return "surround";
  }
  return "portable";
}

export function getPdpInsights(profile: ShopperProfileId, product: Product) {
  const audio = (p: Product) => p.category === "speaker" || p.category === "soundbar";
  const alt =
    profile === "ricardo"
      ? products.find((p) => audio(p) && p.id !== product.id && p.price < product.price)
      : products.find((p) => audio(p) && p.id !== product.id && p.marginTier === "high");

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
    premiumAccessoryId:
      product.category === "soundbar"
        ? profile === "marina"
          ? "sp-sub-4"
          : "sp-roam-2"
        : profile === "marina"
          ? "sp-era-300"
          : "sp-roam-2",
    valueAlt: alt,
  };
}
