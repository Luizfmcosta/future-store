import type { SearchIntent } from "@/types";

/** Deterministic NL → intent parsing for demo (rule-based), speaker-first catalog. */
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

  if (
    lower.includes("3m") ||
    lower.includes("3 m") ||
    lower.includes("three meter") ||
    lower.includes("3 metros")
  ) {
    intent.roomDistanceKey = "3m_listening";
  }

  if (lower.includes("living room") || lower.includes("sala")) {
    intent.roomTypeKey = "living_room";
  }

  if (
    lower.includes("best value") ||
    lower.includes("custo-benefício") ||
    lower.includes("custo beneficio") ||
    lower.includes("melhor custo") ||
    lower.includes("best-value") ||
    (lower.includes("valor") && !lower.includes("sob"))
  ) {
    intent.priority = "best-value";
  } else if (lower.includes("premium") || lower.includes("referência") || lower.includes("referencia") || lower.includes("flagship")) {
    intent.priority = "premium";
  } else if (
    lower.includes("cinema") ||
    lower.includes("filme") ||
    lower.includes("home theater") ||
    lower.includes("home-theater") ||
    lower.includes("imersão") ||
    lower.includes("imersao")
  ) {
    intent.priority = "cinema";
  } else if (lower.includes("sport") || lower.includes("esporte") || lower.includes("futebol")) {
    intent.priority = "sports";
  }

  if (
    lower.includes("atmos") ||
    lower.includes("espacial") ||
    lower.includes("dolby") ||
    lower.includes("surround")
  ) {
    intent.useCase = [...(intent.useCase ?? []), "spatial_audio"];
  }
  if (
    lower.includes("soundbar") ||
    lower.includes("barra de som") ||
    lower.includes("barradesom") ||
    /\btv\b/i.test(lower) ||
    lower.includes("televisão") ||
    lower.includes("televisao")
  ) {
    intent.useCase = [...(intent.useCase ?? []), "tv_audio"];
  }
  if (
    lower.includes("portátil") ||
    lower.includes("portatil") ||
    lower.includes("portable") ||
    lower.includes("externo") ||
    lower.includes("outdoor") ||
    lower.includes("varanda")
  ) {
    intent.useCase = [...(intent.useCase ?? []), "portable"];
  }

  if (intent.budget && intent.budget <= 3500) {
    intent.sizePreferenceKey = "compact_under_budget";
  } else if (intent.roomDistanceKey) {
    intent.sizePreferenceKey = "room_3m_speakers";
  } else {
    intent.sizePreferenceKey = "flexible";
  }

  if (
    lower.includes("fast") ||
    lower.includes("rápida") ||
    lower.includes("rápido") ||
    lower.includes("rapido") ||
    lower.includes("urgent") ||
    lower.includes("urgente")
  ) {
    intent.deliveryNeedKey = "sooner";
  }

  if (!intent.priority) intent.priority = "best-value";

  return intent;
}
