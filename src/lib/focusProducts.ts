import { products } from "@/data/products";
import { splitAboutQuery } from "@/lib/promptProductRefs";

function titleStem(title: string): string {
  return title.split("—")[0]?.trim().toLowerCase() ?? title.toLowerCase();
}

/** Catalog name without generation suffix — e.g. "Stage Compact (Gen 2)" → "stage compact". */
function productShortName(title: string): string {
  return titleStem(title).split("(")[0]?.trim() ?? "";
}

export function isCompareAsk(text: string): boolean {
  return /\b(vs\.?|versus|compar)/i.test(text);
}

function matchProductFromLabel(label: string) {
  const lower = label.toLowerCase().trim();
  if (!lower) return undefined;
  return (
    products.find((p) => p.title.toLowerCase() === lower) ??
    products.find((p) => {
      const stem = titleStem(p.title);
      const shortName = productShortName(p.title);
      return (
        (stem.length >= 4 && (lower.includes(stem) || stem.includes(lower))) ||
        (shortName.length >= 4 && (lower.includes(shortName) || shortName.includes(lower)))
      );
    })
  );
}

/** Match Ask chip labels / `About:` lines / named compare asks to catalog ids (mention order). */
export function resolveFocusProductIds(rawQuery: string, hintIds: string[] = []): string[] {
  const ids: string[] = [];
  const seen = new Set<string>();

  for (const id of hintIds) {
    if (!id || seen.has(id)) continue;
    if (!products.some((p) => p.id === id)) continue;
    ids.push(id);
    seen.add(id);
  }

  const { aboutLabels, ask } = splitAboutQuery(rawQuery);

  if (aboutLabels) {
    for (const label of aboutLabels.split("·").map((s) => s.trim()).filter(Boolean)) {
      const match = matchProductFromLabel(label);
      if (match && !seen.has(match.id)) {
        ids.push(match.id);
        seen.add(match.id);
      }
    }
  }

  const scanText = `${aboutLabels} ${ask || rawQuery}`.toLowerCase();
  if (isCompareAsk(scanText)) {
    const hits: { id: string; index: number }[] = [];
    for (const p of products) {
      if (seen.has(p.id)) continue;
      const shortName = productShortName(p.title);
      if (shortName.length < 4) continue;
      const idx = scanText.indexOf(shortName);
      if (idx < 0) continue;
      hits.push({ id: p.id, index: idx });
      seen.add(p.id);
    }
    hits.sort((a, b) => a.index - b.index);
    for (const h of hits) {
      if (ids.length >= 4) break;
      ids.push(h.id);
    }
  }

  return ids;
}

/** Two or more named catalog products in a compare / vs ask. */
export function isCatalogCompareQuery(rawQuery: string): boolean {
  return isCompareAsk(rawQuery) && resolveFocusProductIds(rawQuery).length >= 2;
}

/**
 * True when the shopper is asking a product/feature question (not browsing for picks).
 * Informational asks should not surface “Top matches” product cards in Chat.
 */
export function isInformationalProductQuery(rawQuery: string): boolean {
  const { ask, aboutLabels } = splitAboutQuery(rawQuery);
  const text = (ask || rawQuery).trim().toLowerCase();
  if (!text) return false;

  if (
    /\b(show|find|recommend|compare|cheapest|under|budget|buy|price|options|alternatives|\bvs\b|versus|suggest|looking for|preciso de|quero|mostrar|comparar|barato|op[cç][oõ]es|mais barato)\b/i.test(
      text,
    )
  ) {
    return false;
  }

  if (
    /^(what|what's|whats|how|when|why|does|is|can|could|should|explain|tell me|o que|como|quando|por que|porque|explica)\b/i.test(
      text,
    )
  ) {
    return true;
  }

  if (
    /\b(what is|how does|when does|how do|tell me about|o que [eé]|como funciona|pra que serve|para que serve)\b/i.test(
      text,
    )
  ) {
    return true;
  }

  if (aboutLabels && /\?\s*$/.test(text)) return true;

  return false;
}
