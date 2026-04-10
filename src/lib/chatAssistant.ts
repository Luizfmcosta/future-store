import { getProductById } from "@/data/products";
import { formatMessage, getMessage } from "@/lib/messages";
import { parseIntent } from "@/lib/parseIntent";
import { getSearchResults } from "@/lib/search";
import type { Product } from "@/types";
import type { SearchIntent } from "@/types";
import type { ShopperProfileId } from "@/types";
import { formatBRL } from "@/lib/utils";

const MAX_PRODUCTS = 4;
const MAX_PDP_COMPARISON_PRODUCTS = 3;

/** Headphone / earbuds SKUs in the demo catalog use `hp-*` ids while sharing `category: "speaker"`. */
function isHeadphoneProduct(p: Product): boolean {
  return p.id.startsWith("hp-");
}

/**
 * When comparing from a **room speaker / soundbar / TV** PDP, drop headphone SKUs so alternatives stay on-speaker.
 */
function poolForPdpComparison(anchor: Product, rankedPool: Product[]): Product[] {
  if (isHeadphoneProduct(anchor)) return rankedPool;
  return rankedPool.filter((p) => !isHeadphoneProduct(p));
}

/**
 * PDP comparison: prefer **cheaper** alternatives (same category first), then least expensive
 * step-ups — not SERP “premium” ranking, which skewed toward pricier SKUs.
 */
function pickPdpComparisonAlternatives(anchor: Product, rankedPool: Product[]): Product[] {
  const others = rankedPool.filter((p) => p.id !== anchor.id);
  const cat = anchor.category;

  const byAltPreference = (a: Product, b: Product) => {
    const aSame = a.category === cat ? 0 : 1;
    const bSame = b.category === cat ? 0 : 1;
    if (aSame !== bSame) return aSame - bSame;
    return a.price - b.price;
  };

  const cheaper = others.filter((p) => p.price < anchor.price).sort(byAltPreference);
  const rest = others.filter((p) => p.price >= anchor.price).sort(byAltPreference);
  return [...cheaper, ...rest].slice(0, MAX_PDP_COMPARISON_PRODUCTS);
}

export type AssistantSource = {
  href: string;
  title: string;
  description: string;
  label?: string;
};

function priorityLabel(priority: SearchIntent["priority"]): string {
  if (!priority) return "";
  const key =
    priority === "best-value"
      ? "searchSerp.intentPriorityBestValue"
      : priority === "premium"
        ? "searchSerp.intentPriorityPremium"
        : priority === "cinema"
          ? "searchSerp.intentPriorityCinema"
          : "searchSerp.intentPrioritySports";
  return getMessage(key) ?? priority;
}

function roomLine(intent: SearchIntent): string | null {
  const parts: string[] = [];
  if (intent.roomTypeKey === "living_room") {
    parts.push(getMessage("searchSerp.intentRoomLiving") ?? "");
  }
  if (intent.roomDistanceKey === "3m_listening") {
    parts.push(getMessage("searchSerp.intentRoomDistance3m") ?? "");
  }
  const s = parts.filter(Boolean).join(" · ");
  return s || null;
}

function intentContextLine(intent: SearchIntent): string | null {
  const bits: string[] = [];
  if (intent.budget) {
    bits.push(
      formatMessage(getMessage("chatAssistant.ctxBudget") ?? "", {
        amount: formatBRL(intent.budget),
      }),
    );
  }
  const room = roomLine(intent);
  if (room) bits.push(formatMessage(getMessage("chatAssistant.ctxRoom") ?? "", { room }));
  if (intent.priority) {
    bits.push(
      formatMessage(getMessage("chatAssistant.ctxPriority") ?? "", {
        priority: priorityLabel(intent.priority),
      }),
    );
  }
  return bits.length ? bits.join(" · ") : null;
}

function trustedSourcesBase(): AssistantSource[] {
  return [
    {
      href: "https://www.tecmundo.com.br/",
      label: "TecMundo",
      title: getMessage("chatAssistant.sourceTecMundoTitle") ?? "TecMundo",
      description: getMessage("chatAssistant.sourceTecMundoDesc") ?? "",
    },
    {
      href: "https://www.techtudo.com.br/",
      label: "TechTudo",
      title: getMessage("chatAssistant.sourceTechTudoTitle") ?? "TechTudo",
      description: getMessage("chatAssistant.sourceTechTudoDesc") ?? "",
    },
    {
      href: "https://www.youtube.com/@LinusTechTips",
      label: "LTT",
      title: getMessage("chatAssistant.sourceLttTitle") ?? "LTT",
      description: getMessage("chatAssistant.sourceLttDesc") ?? "",
    },
    {
      href: "https://www.rtings.com/headphones/soundbar",
      label: "RTINGS",
      title: getMessage("chatAssistant.sourceRtingsTitle") ?? "RTINGS",
      description: getMessage("chatAssistant.sourceRtingsDesc") ?? "",
    },
  ];
}

/** Editorial sources; descriptions extend with catalog + intent context. */
export function buildAssistantSources(products: Product[], intent: SearchIntent): AssistantSource[] {
  const ctx = intentContextLine(intent);
  const suffix = ctx
    ? formatMessage(getMessage("chatAssistant.ctxSuffixAsk") ?? "", { ctx })
    : "";
  const catalogNote =
    products.length > 0
      ? (getMessage("chatAssistant.catalogNoteHasResults") ?? "")
      : (getMessage("chatAssistant.catalogNoteNoResults") ?? "");

  return trustedSourcesBase().map((s) => ({
    ...s,
    description: `${s.description}${catalogNote}${suffix}`,
  }));
}

function narrativeForResults(
  userText: string,
  intent: SearchIntent,
  products: Product[],
): string {
  const t = userText.trim();
  const preview = t.length > 120 ? `${t.slice(0, 117)}…` : t;

  if (products.length === 0) {
    return [
      getMessage("chatAssistant.narrativeEmptyIntro") ?? "",
      "",
      formatMessage(getMessage("chatAssistant.narrativeEmptyYourAsk") ?? "", { preview }),
      "",
      getMessage("chatAssistant.narrativeEmptyHint") ?? "",
    ].join("\n");
  }

  const lines: string[] = [
    formatMessage(getMessage("chatAssistant.narrativeIntro") ?? "", { count: String(products.length) }),
    "",
    formatMessage(getMessage("chatAssistant.narrativeAskLine") ?? "", { preview }),
  ];

  if (intent.budget) {
    lines.push(
      "",
      formatMessage(getMessage("chatAssistant.narrativeBudgetLine") ?? "", {
        amount: formatBRL(intent.budget),
      }),
    );
  }
  const room = roomLine(intent);
  if (room) {
    lines.push(formatMessage(getMessage("chatAssistant.narrativeRoomLine") ?? "", { room }));
  }
  if (intent.priority) {
    lines.push(
      formatMessage(getMessage("chatAssistant.narrativePriorityLine") ?? "", {
        priority: priorityLabel(intent.priority),
      }),
    );
  }

  lines.push("", getMessage("chatAssistant.narrativeFooter") ?? "");

  return lines.join("\n");
}

function tradeoffVsAnchor(anchor: Product, alt: Product): string {
  const d = alt.price - anchor.price;
  const abs = Math.abs(d);
  let priceNote: string;
  if (abs < 1) {
    priceNote = getMessage("chatAssistant.pdpComparisonSamePrice") ?? "";
  } else if (d > 0) {
    priceNote = formatMessage(getMessage("chatAssistant.pdpComparisonPricier") ?? "", {
      amount: formatBRL(abs),
    });
  } else {
    priceNote = formatMessage(getMessage("chatAssistant.pdpComparisonCheaper") ?? "", {
      amount: formatBRL(abs),
    });
  }
  const role = alt.bestFor[0] ?? alt.reviewStrengths[0] ?? alt.deliveryETA;
  return [priceNote, role].filter(Boolean).join(" · ");
}

/** PDP comparison fallback: intro vs anchor, profile line, then up to 3 trade-off bullets. */
function narrativePdpComparison(anchor: Product, alternatives: Product[], intent: SearchIntent): string {
  if (alternatives.length === 0) {
    return getMessage("chatAssistant.pdpComparisonNoAlts") ?? "";
  }
  const intro = formatMessage(getMessage("chatAssistant.pdpComparisonIntro") ?? "", {
    title: anchor.title,
  });
  const priorityText = intent.priority
    ? priorityLabel(intent.priority)
    : (getMessage("chatAssistant.pdpComparisonPriorityFallback") ?? "best value");
  const profileLine = formatMessage(getMessage("chatAssistant.pdpComparisonProfileLine") ?? "", {
    priority: priorityText,
  });
  const bullets = alternatives.map((p) => {
    const line = tradeoffVsAnchor(anchor, p);
    return `• ${p.title} — ${line}`;
  });
  return [intro, "", profileLine, "", ...bullets].join("\n");
}

export type AssistantReplyOptions = {
  /** When set, reply is shaped as a PDP comparison vs this catalog product (fallback when LLM is off). */
  comparisonAnchorProductId?: string;
};

/** Demo assistant: same ranking as SERP, as chat + product cards + editorial sources. */
export function assistantReplyForQuery(
  userText: string,
  profile: ShopperProfileId,
  aiMode: boolean,
  opts?: AssistantReplyOptions,
): { text: string; products: Product[]; sources: AssistantSource[] } {
  const anchorId = opts?.comparisonAnchorProductId?.trim();
  if (anchorId) {
    const anchor = getProductById(anchorId);
    if (anchor) {
      const intent = parseIntent(userText);
      const results = getSearchResults(profile, intent);
      const pool = poolForPdpComparison(anchor, results);
      const products = pickPdpComparisonAlternatives(anchor, pool);
      const text = narrativePdpComparison(anchor, products, intent);
      const sources = buildAssistantSources(products, intent);
      return { text, products, sources };
    }
  }

  const intent = parseIntent(userText);
  const results = getSearchResults(profile, intent);
  const ordered = aiMode ? results : [...results].sort((a, b) => a.title.localeCompare(b.title));
  const products = ordered.slice(0, MAX_PRODUCTS);
  const text = narrativeForResults(userText, intent, products);
  const sources = buildAssistantSources(products, intent);
  return { text, products, sources };
}
