import { parseIntent } from "@/lib/parseIntent";
import { getSearchResults } from "@/lib/search";
import type { Product } from "@/types";
import type { SearchIntent } from "@/types";
import type { ShopperProfileId } from "@/types";
import { formatBRL } from "@/lib/utils";

const MAX_PRODUCTS = 4;

export type AssistantSource = {
  href: string;
  title: string;
  description: string;
  /** Short chip label (prompt-kit SourceTrigger) */
  label?: string;
};

/**
 * Trusted editorial outlets whose TV reviews & comparisons inform Future Store ranking
 * (demo framing — same deterministic catalog logic, sources explain the “why”).
 */
const TRUSTED_REVIEW_SOURCES: AssistantSource[] = [
  {
    href: "https://www.tecmundo.com.br/",
    label: "TecMundo",
    title: "TecMundo — reviews & comparativos",
    description:
      "Brazilian reviews and roundups we use to weigh specs, price-to-performance, and everyday TV use.",
  },
  {
    href: "https://www.techtudo.com.br/",
    label: "TechTudo",
    title: "TechTudo — reviews e guias",
    description:
      "Editorial comparisons and buying angles that inform how we balance picture quality, size, and budget.",
  },
  {
    href: "https://www.youtube.com/@LinusTechTips",
    label: "LTT",
    title: "Linus Tech Tips",
    description:
      "Hands-on testing and panel talk that shape how we treat HDR, motion, gaming inputs, and panel tech.",
  },
  {
    href: "https://www.rtings.com/tv",
    label: "RTINGS",
    title: "RTINGS — TV reviews & tests",
    description:
      "Measurement-led TV reviews aligned with the signals we use for contrast, uniformity, and viewing angles.",
  },
];

function intentContextLine(intent: SearchIntent): string | null {
  const bits: string[] = [];
  if (intent.budget) bits.push(`budget ~${formatBRL(intent.budget)}`);
  if (intent.roomDistance) bits.push(intent.roomDistance);
  if (intent.priority) bits.push(intent.priority.replace("-", " "));
  return bits.length ? bits.join(" · ") : null;
}

/** Editorial sources that ground product advice; descriptions reflect parsed intent and whether we have matches. */
export function buildAssistantSources(products: Product[], intent: SearchIntent): AssistantSource[] {
  const ctx = intentContextLine(intent);
  const suffix = ctx ? ` Your ask maps to: ${ctx}.` : "";
  const catalogNote =
    products.length > 0
      ? " Future Store’s top matches below are ranked using signals consistent with this editorial coverage."
      : " Once your intent is clear, we’ll rank catalog picks using signals consistent with this editorial coverage.";

  return TRUSTED_REVIEW_SOURCES.map((s) => ({
    ...s,
    description: `${s.description}${catalogNote}${suffix}`,
  }));
}

function narrativeForResults(userText: string, intent: SearchIntent, products: Product[]): string {
  const t = userText.trim();
  const preview = t.length > 120 ? `${t.slice(0, 117)}…` : t;

  if (products.length === 0) {
    return [
      "I couldn’t rank TVs from the catalog for that yet.",
      "",
      `Your message: “${preview}”`,
      "",
      "Try adding a budget (e.g. up to 5000), room size (e.g. 3m), or OLED/QLED preference. The sources below still reflect how TecMundo, TechTudo, LTT, RTINGS, and peers evaluate TVs — we’ll match products once your intent is clearer.",
    ].join("\n");
  }

  const lines: string[] = [
    `Here are ${products.length} top matches ranked for Future Store — informed by the same kind of TV reviews and comparisons you’ll find on TecMundo, TechTudo, Linus Tech Tips, RTINGS, and similar trusted outlets.`,
    "",
    `You asked: “${preview}”`,
  ];

  if (intent.budget) {
    lines.push("", `Budget signal: around ${formatBRL(intent.budget)}.`);
  }
  if (intent.roomDistance) {
    lines.push(`Room: ${intent.roomDistance}.`);
  }
  if (intent.priority) {
    lines.push(`Priority: ${intent.priority.replace("-", " ")}.`);
  }

  lines.push(
    "",
    "The source chips cite those editorial standards; the product cards are Future Store picks aligned with them.",
    "",
    "Open a card for the full PDP, or refine your ask below."
  );

  return lines.join("\n");
}

/** Demo assistant: same ranking as SERP, surfaced as chat + product cards + editorial sources. */
export function assistantReplyForQuery(
  userText: string,
  profile: ShopperProfileId,
  aiMode: boolean
): { text: string; products: Product[]; sources: AssistantSource[] } {
  const intent = parseIntent(userText);
  const results = getSearchResults(profile, intent);
  const ordered = aiMode ? results : [...results].sort((a, b) => a.title.localeCompare(b.title));
  const products = ordered.slice(0, MAX_PRODUCTS);
  const text = narrativeForResults(userText, intent, products);
  const sources = buildAssistantSources(products, intent);
  return { text, products, sources };
}
