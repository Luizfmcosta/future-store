import { formatMessage, getMessage } from "@/lib/messages";
import { splitAboutQuery } from "@/lib/promptProductRefs";

const MAX_FOLLOW_UPS = 6;

type FollowUpKey =
  | "trueplayHow"
  | "trueplayRerun"
  | "trueplayMusicMovies"
  | "trueplayWhich"
  | "trueplayPlacement"
  | "spatialWorthIt"
  | "spatialVsSoundbar"
  | "spatialVsStereo"
  | "spatialRoom"
  | "portableBattery"
  | "portablePair"
  | "portableVsRoom"
  | "waterproofPatio"
  | "compareDiff"
  | "compareRoom"
  | "compareValue"
  | "budgetUnder"
  | "budgetTradeoff"
  | "budgetInstallments"
  | "warrantyReturns"
  | "warrantyService"
  | "cinemaSetup"
  | "cinemaDialogue"
  | "cinemaExpand"
  | "bassStrongest"
  | "bassSub"
  | "productVsHorizonOne"
  | "productPairsWith"
  | "productWhoFor"
  | "productAlternatives"
  | "defaultCompareTop"
  | "defaultMoviesMusic"
  | "defaultBundles"
  | "defaultBass"
  | "defaultWarranty";

function msg(key: FollowUpKey, product: string): string {
  const template = getMessage(`searchAiPanel.followUps.${key}`) ?? "";
  if (!template) return "";
  const label = product || (getMessage("searchAiPanel.followUps.productFallback") ?? "this speaker");
  return formatMessage(template, { product: label });
}

/** Short product name from Ask chip / `About:` line. */
export function followUpProductLabel(rawQuery: string): string {
  const { aboutLabels } = splitAboutQuery(rawQuery);
  if (!aboutLabels) return "";
  const first = aboutLabels.split("·")[0]?.trim() ?? "";
  return first.split("—")[0]?.trim() || first;
}

function normalizeForOverlap(s: string): string[] {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);
}

/** Drop chips that mostly repeat the shopper’s current ask. */
function isTooSimilarToAsk(suggestion: string, ask: string): boolean {
  const askWords = new Set(normalizeForOverlap(ask));
  if (askWords.size < 2) return false;
  const sWords = normalizeForOverlap(suggestion);
  if (sWords.length < 2) return false;
  const overlap = sWords.filter((w) => askWords.has(w)).length;
  return overlap >= Math.min(4, Math.ceil(sWords.length * 0.7));
}

function pickKeys(rawQuery: string): FollowUpKey[] {
  const { ask, aboutLabels } = splitAboutQuery(rawQuery);
  const text = `${aboutLabels} ${ask || rawQuery}`.toLowerCase();
  const askText = (ask || rawQuery).toLowerCase();
  const hasProduct = Boolean(aboutLabels.trim());

  if (/\btrueplay\b/i.test(text)) {
    return [
      "trueplayHow",
      "trueplayRerun",
      "trueplayMusicMovies",
      "trueplayWhich",
      "trueplayPlacement",
      hasProduct ? "productPairsWith" : "spatialWorthIt",
    ];
  }

  if (
    /\b(atmos|spatial|espacial|dolby)\b/i.test(text) ||
    /\bhorizon three\b/i.test(text)
  ) {
    return [
      "spatialWorthIt",
      "spatialVsSoundbar",
      "spatialVsStereo",
      "spatialRoom",
      hasProduct ? "productVsHorizonOne" : "cinemaSetup",
      hasProduct ? "bassSub" : "defaultBass",
    ];
  }

  if (
    /\b(waterproof|à prova|a prova|patio|varanda|outdoor|portátil|portatil|portable|battery|bateria|trail)\b/i.test(
      text,
    )
  ) {
    return [
      "portableBattery",
      "waterproofPatio",
      "portablePair",
      "portableVsRoom",
      "budgetTradeoff",
      "defaultWarranty",
    ];
  }

  if (/\b(vs\.?|versus|compar|diferen)/i.test(askText)) {
    return [
      "compareDiff",
      "compareRoom",
      "compareValue",
      "defaultMoviesMusic",
      "bassStrongest",
      "defaultBundles",
    ];
  }

  if (
    /\b(budget|barato|cheap|under|até|ate|preço|preco|parcel|installment|valor)\b/i.test(
      askText,
    )
  ) {
    return [
      "budgetUnder",
      "budgetTradeoff",
      "budgetInstallments",
      "compareValue",
      "defaultMoviesMusic",
      "defaultWarranty",
    ];
  }

  if (/\b(warrant|garantia|return|devoluç|devoluc|troca)\b/i.test(askText)) {
    return [
      "warrantyReturns",
      "warrantyService",
      hasProduct ? "productWhoFor" : "defaultCompareTop",
      hasProduct ? "productPairsWith" : "defaultBundles",
      "budgetTradeoff",
      "defaultMoviesMusic",
    ];
  }

  if (
    /\b(movie|filme|cinema|theater|theatre|tv|soundbar|di[áa]logo|dialogo|immers)/i.test(
      askText,
    )
  ) {
    return [
      "cinemaSetup",
      "cinemaDialogue",
      "cinemaExpand",
      "spatialVsSoundbar",
      "bassStrongest",
      "defaultBundles",
    ];
  }

  if (/\b(bass|grave|subwoofer|sub\b)/i.test(askText)) {
    return [
      "bassStrongest",
      "bassSub",
      "cinemaSetup",
      hasProduct ? "productAlternatives" : "defaultCompareTop",
      "budgetTradeoff",
      "defaultMoviesMusic",
    ];
  }

  if (hasProduct) {
    return [
      "productWhoFor",
      "productVsHorizonOne",
      "productPairsWith",
      "spatialRoom",
      "bassSub",
      "productAlternatives",
    ];
  }

  return [
    "defaultCompareTop",
    "defaultMoviesMusic",
    "defaultBundles",
    "defaultBass",
    "defaultWarranty",
    "budgetUnder",
  ];
}

/**
 * Follow-up chips under the latest assistant reply — chosen from the shopper’s ask
 * (and Ask chip product when present), not a fixed global list.
 */
export function getChatFollowUpSuggestions(userQuery = ""): readonly string[] {
  const product = followUpProductLabel(userQuery);
  const { ask } = splitAboutQuery(userQuery);
  const askForOverlap = ask || userQuery;
  const keys = pickKeys(userQuery.trim() || "");

  const out: string[] = [];
  const seen = new Set<string>();
  for (const key of keys) {
    if (out.length >= MAX_FOLLOW_UPS) break;
    const text = msg(key, product).trim();
    if (!text || seen.has(text)) continue;
    if (askForOverlap && isTooSimilarToAsk(text, askForOverlap)) continue;
    seen.add(text);
    out.push(text);
  }

  if (out.length > 0) return out;

  /* Fallback if locale keys missing. */
  return [
    msg("defaultCompareTop", product),
    msg("defaultMoviesMusic", product),
    msg("defaultBundles", product),
    msg("defaultBass", product),
    msg("defaultWarranty", product),
  ].filter(Boolean);
}
