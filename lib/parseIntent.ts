import type { SearchIntent } from "@/types";

/** Deterministic NL → intent parsing for demo (rule-based). */
export function parseIntent(rawQuery: string): SearchIntent {
  const q = rawQuery.trim();
  const lower = q.toLowerCase();

  const intent: SearchIntent = { rawQuery: q };

  const budgetMatch = lower.match(/(?:up to|até|max|máx)\s*R?\$?\s*([\d.,]+)|([\d.,]+)\s*(?:reais|brl)?/i);
  if (budgetMatch) {
    const raw = (budgetMatch[1] ?? budgetMatch[2] ?? "").replace(/\./g, "").replace(",", ".");
    const n = parseFloat(raw);
    if (!Number.isNaN(n)) intent.budget = n > 1000 ? n : n * 1000;
  }
  if (!intent.budget && lower.match(/\b5000\b/)) intent.budget = 5000;

  if (lower.includes("3m") || lower.includes("3 m") || lower.includes("three meter")) {
    intent.roomDistance = "~3m viewing distance";
  }
  if (lower.includes("living room") || lower.includes("sala")) {
    intent.roomType = "Living room";
  }

  if (lower.includes("best value") || lower.includes("custo") || lower.includes("value")) {
    intent.priority = "best-value";
  } else if (lower.includes("premium") || lower.includes("flagship")) {
    intent.priority = "premium";
  } else if (lower.includes("cinema") || lower.includes("movie")) {
    intent.priority = "cinema";
  } else if (lower.includes("sport")) {
    intent.priority = "sports";
  }

  if (lower.includes("oled")) intent.useCase = [...(intent.useCase ?? []), "OLED preference"];
  if (lower.includes("qled")) intent.useCase = [...(intent.useCase ?? []), "QLED preference"];

  if (intent.budget && intent.budget <= 3500) {
    intent.sizePreference = "55\" class or smaller for best fit";
  } else if (intent.roomDistance) {
    intent.sizePreference = "55–65\" sweet spot at ~3m";
  } else {
    intent.sizePreference = "Flexible — ranked by intent";
  }

  if (lower.includes("fast") || lower.includes("rápida") || lower.includes("urgent")) {
    intent.deliveryNeed = "Sooner delivery preferred";
  }

  if (!intent.priority) intent.priority = "best-value";

  return intent;
}
