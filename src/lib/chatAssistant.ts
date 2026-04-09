import { formatMessage, getMessage } from "@/lib/messages";
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

/** Demo assistant: same ranking as SERP, as chat + product cards + editorial sources. */
export function assistantReplyForQuery(
  userText: string,
  profile: ShopperProfileId,
  aiMode: boolean,
): { text: string; products: Product[]; sources: AssistantSource[] } {
  const intent = parseIntent(userText);
  const results = getSearchResults(profile, intent);
  const ordered = aiMode ? results : [...results].sort((a, b) => a.title.localeCompare(b.title));
  const products = ordered.slice(0, MAX_PRODUCTS);
  const text = narrativeForResults(userText, intent, products);
  const sources = buildAssistantSources(products, intent);
  return { text, products, sources };
}
