import { buildHomeExperience, type HomeSegmentId } from "@/lib/personalization";
import type { Product } from "@/types";
import { shopperDisplayName } from "@/lib/shopperPortraits";
import type { ShopperProfileId } from "@/types";
import type { ShopperSignals } from "@/types/shopperSignals";
import type { AIExplanation } from "@/types/aiExplanation";
import type { SearchIntent } from "@/types";

export type PageKind = "home" | "search" | "pdp" | "chat";

/** Stable inputs shared across routes — always derived from real store + signals. */
export type AIExplanationUserContext = {
  profile: ShopperProfileId;
  signals: ShopperSignals;
};

/** Route-specific slice — no hardcoded page IDs; callers pass pathname-derived kind. */
export type AIExplanationPageContext = {
  kind: PageKind;
  pathname: string;
  /** PDP only — product id from the route. */
  productId?: string;
  /** Search only — active query / intent. */
  searchQuery?: string;
  intent?: SearchIntent | null;
  /** PDP only — when available for price/tier copy. */
  product?: Product | null;
};

function segmentLabel(segment: HomeSegmentId): string {
  const m: Record<HomeSegmentId, string> = {
    marina_research: "Premium consideration (Marina + returning/desktop)",
    marina_explore: "Discovery-first (Marina + first visit on mobile)",
    ricardo_speed: "Deal velocity (Ricardo + paid social or mobile)",
    ricardo_value: "Value framing (Ricardo + popularity)",
  };
  return m[segment];
}

function trafficLabel(ch: ShopperSignals["trafficChannel"]): string {
  const map: Record<ShopperSignals["trafficChannel"], string> = {
    direct: "Direct",
    organic: "Organic",
    paid_social: "Paid social",
    paid_search: "Paid search",
    other: "Other",
  };
  return map[ch];
}

function curatedSortLabel(mode: ReturnType<typeof buildHomeExperience>["curatedSort"]): string {
  const m: Record<typeof mode, string> = {
    price_desc: "Curation biases toward premium picks in this view.",
    price_asc: "Curation biases toward entry-level picks for faster decisions.",
    profile_default: "Curation balances catalog with the active profile.",
  };
  return m[mode];
}

function merchSortLabel(mode: ReturnType<typeof buildHomeExperience>["merchSort"]): string {
  const m: Record<typeof mode, string> = {
    price_desc: "Price ordering emphasizes higher tiers first.",
    price_asc: "Price ordering emphasizes accessible tiers first.",
    default: "Merch highlights follow the segment’s default catalog ordering.",
  };
  return m[mode];
}

function formatModuleOrder(order: string[]): string {
  const labels: Record<string, string> = {
    hero: "Hero",
    continue: "Continue",
    compare: "Compare",
    curated: "Curated",
    spotlight: "Spotlight",
    strip: "Merch strip",
  };
  return order
    .slice(0, 6)
    .map((k) => labels[k] ?? k)
    .join(" → ");
}

/**
 * Builds contextual explanations from real profile, signals, and route —
 * reusable on Home, Search, and PDP without duplicating page-specific strings.
 */
export function generateAIExplanation(
  userContext: AIExplanationUserContext,
  pageContext: AIExplanationPageContext,
): AIExplanation[] {
  const { profile, signals } = userContext;
  const experience = buildHomeExperience(profile, signals);
  const { segment, moduleOrder, curatedSort, merchSort, tone } = experience;
  const visitLine = signals.isReturning
    ? `Visit #${signals.visitCount} detected. Preferences informed by your local session history.`
    : "First visit on this device. Content weighted for fast discovery.";

  const deviceLine =
    signals.device === "desktop"
      ? "Desktop layout: more room for compare blocks and specs."
      : "Mobile layout: short paths and thumb-friendly CTAs.";

  const cards: AIExplanation[] = [];

  if (pageContext.kind === "home") {
    cards.push({
      id: "content-modules",
      type: "content",
      title: "Content organization",
      description: `Module order for this segment: ${formatModuleOrder(moduleOrder)}. Tone is ${tone === "consultative" ? "consultative" : "action-oriented"} for the active profile.`,
    });
  } else if (pageContext.kind === "search") {
    const raw = pageContext.searchQuery?.trim() || pageContext.intent?.rawQuery || "";
    cards.push({
      id: "content-search",
      type: "content",
      title: "Content organization",
      description: raw
        ? `Layered results: intent summary, best match, grid — active query: “${raw.slice(0, 120)}${raw.length > 120 ? "…" : ""}”.`
        : "Layered results: summary, best match, and grid — refine via the floating search dock.",
    });
  } else if (pageContext.kind === "pdp") {
    const p = pageContext.product;
    cards.push({
      id: "content-pdp",
      type: "content",
      title: "Content organization",
      description: p
        ? `PDP stacks hero, ${shopperDisplayName(profile)}-aware fit, reviews, and policies — ordered for consideration stage.`
        : "Product page follows the storefront editorial model for this profile.",
    });
  } else {
    cards.push({
      id: "content-chat",
      type: "content",
      title: "Content organization",
      description: "Chat keeps storefront context and prioritizes helpful follow-ups.",
    });
  }

  cards.push({
    id: "curation-segment",
    type: "curation",
    title: "Product curation",
    description: `Active segment: ${segmentLabel(segment)}. Compare, continue, and curated rails share this funnel signal.`,
  });

  cards.push({
    id: "pricing-strategy",
    type: "pricing",
    title: "Pricing strategy",
    description: `${curatedSortLabel(curatedSort)} ${merchSortLabel(merchSort)}`,
  });

  if (pageContext.kind === "search" && pageContext.intent) {
    const b = pageContext.intent.budget;
    cards.push({
      id: "ranking-search",
      type: "ranking",
      title: "Ranking logic",
      description: b
        ? `Best match blends ${shopperDisplayName(profile)} profile, parsed intent, and a budget cap of ${b.toLocaleString("en-US")}.`
        : `Ranking weights ${shopperDisplayName(profile)} fit and savings signals from the query.`,
    });
  } else {
    cards.push({
      id: "ranking-modules",
      type: "ranking",
      title: "Prioritization",
      description: `Home block order reflects segment (${segment}) — not a static generic layout.`,
    });
  }

  const productTier =
    pageContext.product?.marginTier === "high"
      ? "high margin tier"
      : pageContext.product?.marginTier === "mid"
        ? "mid margin tier"
        : pageContext.product?.marginTier === "low"
          ? "entry margin tier"
          : null;

  const dataDescription = `${visitLine} Channel: ${trafficLabel(signals.trafficChannel)}. ${deviceLine}${
    productTier && pageContext.kind === "pdp"
      ? ` Shown price follows local catalog; commercial tier: ${productTier}.`
      : ""
  }`;

  cards.push({
    id: "data-model",
    type: "data",
    title: "Data model",
    description: dataDescription,
  });

  return cards;
}
