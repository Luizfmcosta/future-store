import { formatMessage, getMessage } from "@/lib/messages";
import type { AppLocale } from "@/lib/locale-types";
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

function priorityLabel(locale: AppLocale, priority: SearchIntent["priority"]): string {
  if (!priority) return "";
  const key =
    priority === "best-value"
      ? "searchSerp.intentPriorityBestValue"
      : priority === "premium"
        ? "searchSerp.intentPriorityPremium"
        : priority === "cinema"
          ? "searchSerp.intentPriorityCinema"
          : "searchSerp.intentPrioritySports";
  return getMessage(locale, key) ?? priority;
}

function roomLine(locale: AppLocale, intent: SearchIntent): string | null {
  const parts: string[] = [];
  if (intent.roomTypeKey === "living_room") {
    parts.push(getMessage(locale, "searchSerp.intentRoomLiving") ?? "");
  }
  if (intent.roomDistanceKey === "3m_listening") {
    parts.push(getMessage(locale, "searchSerp.intentRoomDistance3m") ?? "");
  }
  const s = parts.filter(Boolean).join(" · ");
  return s || null;
}

function intentContextLine(locale: AppLocale, intent: SearchIntent): string | null {
  const bits: string[] = [];
  if (intent.budget) {
    bits.push(
      formatMessage(getMessage(locale, "chatAssistant.ctxBudget") ?? "", {
        amount: formatBRL(intent.budget),
      }),
    );
  }
  const room = roomLine(locale, intent);
  if (room) bits.push(formatMessage(getMessage(locale, "chatAssistant.ctxRoom") ?? "", { room }));
  if (intent.priority) {
    bits.push(
      formatMessage(getMessage(locale, "chatAssistant.ctxPriority") ?? "", {
        priority: priorityLabel(locale, intent.priority),
      }),
    );
  }
  return bits.length ? bits.join(" · ") : null;
}

function trustedSourcesBase(locale: AppLocale): AssistantSource[] {
  return [
    {
      href: "https://www.tecmundo.com.br/",
      label: "TecMundo",
      title: getMessage(locale, "chatAssistant.sourceTecMundoTitle") ?? "TecMundo",
      description: getMessage(locale, "chatAssistant.sourceTecMundoDesc") ?? "",
    },
    {
      href: "https://www.techtudo.com.br/",
      label: "TechTudo",
      title: getMessage(locale, "chatAssistant.sourceTechTudoTitle") ?? "TechTudo",
      description: getMessage(locale, "chatAssistant.sourceTechTudoDesc") ?? "",
    },
    {
      href: "https://www.youtube.com/@LinusTechTips",
      label: "LTT",
      title: getMessage(locale, "chatAssistant.sourceLttTitle") ?? "LTT",
      description: getMessage(locale, "chatAssistant.sourceLttDesc") ?? "",
    },
    {
      href: "https://www.rtings.com/headphones/soundbar",
      label: "RTINGS",
      title: getMessage(locale, "chatAssistant.sourceRtingsTitle") ?? "RTINGS",
      description: getMessage(locale, "chatAssistant.sourceRtingsDesc") ?? "",
    },
  ];
}

/** Editorial sources; descriptions extend with catalog + intent context. */
export function buildAssistantSources(products: Product[], intent: SearchIntent, locale: AppLocale): AssistantSource[] {
  const ctx = intentContextLine(locale, intent);
  const suffix = ctx
    ? formatMessage(getMessage(locale, "chatAssistant.ctxSuffixAsk") ?? "", { ctx })
    : "";
  const catalogNote =
    products.length > 0
      ? (getMessage(locale, "chatAssistant.catalogNoteHasResults") ?? "")
      : (getMessage(locale, "chatAssistant.catalogNoteNoResults") ?? "");

  return trustedSourcesBase(locale).map((s) => ({
    ...s,
    description: `${s.description}${catalogNote}${suffix}`,
  }));
}

function narrativeForResults(
  userText: string,
  intent: SearchIntent,
  products: Product[],
  locale: AppLocale,
): string {
  const t = userText.trim();
  const preview = t.length > 120 ? `${t.slice(0, 117)}…` : t;

  if (products.length === 0) {
    return [
      getMessage(locale, "chatAssistant.narrativeEmptyIntro") ?? "",
      "",
      formatMessage(getMessage(locale, "chatAssistant.narrativeEmptyYourAsk") ?? "", { preview }),
      "",
      getMessage(locale, "chatAssistant.narrativeEmptyHint") ?? "",
    ].join("\n");
  }

  const lines: string[] = [
    formatMessage(getMessage(locale, "chatAssistant.narrativeIntro") ?? "", { count: String(products.length) }),
    "",
    formatMessage(getMessage(locale, "chatAssistant.narrativeAskLine") ?? "", { preview }),
  ];

  if (intent.budget) {
    lines.push(
      "",
      formatMessage(getMessage(locale, "chatAssistant.narrativeBudgetLine") ?? "", {
        amount: formatBRL(intent.budget),
      }),
    );
  }
  const room = roomLine(locale, intent);
  if (room) {
    lines.push(formatMessage(getMessage(locale, "chatAssistant.narrativeRoomLine") ?? "", { room }));
  }
  if (intent.priority) {
    lines.push(
      formatMessage(getMessage(locale, "chatAssistant.narrativePriorityLine") ?? "", {
        priority: priorityLabel(locale, intent.priority),
      }),
    );
  }

  lines.push("", getMessage(locale, "chatAssistant.narrativeFooter") ?? "");

  return lines.join("\n");
}

/** Demo assistant: same ranking as SERP, as chat + product cards + editorial sources. */
export function assistantReplyForQuery(
  userText: string,
  profile: ShopperProfileId,
  aiMode: boolean,
  locale: AppLocale,
): { text: string; products: Product[]; sources: AssistantSource[] } {
  const intent = parseIntent(userText);
  const results = getSearchResults(profile, intent);
  const ordered = aiMode ? results : [...results].sort((a, b) => a.title.localeCompare(b.title));
  const products = ordered.slice(0, MAX_PRODUCTS);
  const text = narrativeForResults(userText, intent, products, locale);
  const sources = buildAssistantSources(products, intent, locale);
  return { text, products, sources };
}
