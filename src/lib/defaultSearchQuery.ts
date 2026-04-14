import type { UiLocale } from "@/lib/locales/types";

export const DEFAULT_SEARCH_QUERY_EN =
  "Wireless speaker for ~3 m living room, best value, up to R$ 5000";

export const DEFAULT_SEARCH_QUERY_PT =
  "Caixa de som para sala de ~3 m, melhor custo-benefício, até R$ 5000";

export function defaultSearchQuery(locale: UiLocale): string {
  return locale === "pt" ? DEFAULT_SEARCH_QUERY_PT : DEFAULT_SEARCH_QUERY_EN;
}

/** @deprecated Use `defaultSearchQuery(locale)` — kept as pt-BR default for older imports. */
export const DEFAULT_SEARCH_QUERY = DEFAULT_SEARCH_QUERY_PT;
