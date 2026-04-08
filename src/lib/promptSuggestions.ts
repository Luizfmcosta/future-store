import type { AppLocale } from "@/lib/locale-types";
import { getQuickSearchQueries } from "@/lib/searchCopy";

/**
 * Extra prompts merged with quick searches so typing filters a richer pool
 * (prompt-kit style: pills above the composer).
 */
const EXTRA_PROMPTS: Record<AppLocale, string[]> = {
  "en-US": [
    "Compare Horizon One and Trail Mini",
    "Best speaker for a small apartment",
    "Is Dolby Atmos worth it for music only?",
    "Waterproof options for patio or pool",
    "Cheapest way to start a multi-room setup",
    "What is Trueplay and when does it help?",
    "Soundbar or stereo pair for the living room",
    "Trail Max battery life vs Trail Mini",
  ],
  "pt-BR": [
    "Comparar Horizon One e Trail Mini",
    "Melhor caixa para apartamento pequeno",
    "Dolby Atmos vale a pena só para música?",
    "Opções à prova d'água para área externa",
    "Forma mais acessível de começar um setup multiambiente",
    "O que é Trueplay e quando ajuda?",
    "Soundbar ou par estéreo na sala",
    "Autonomia Trail Max vs Trail Mini",
  ],
};

/** Minimum typed length before showing chips (avoids noisy single-character matches). */
export const PROMPT_SUGGESTION_MIN_LENGTH = 2;

export function getPromptSuggestionPool(locale: AppLocale): string[] {
  return [...getQuickSearchQueries(locale), ...EXTRA_PROMPTS[locale]];
}

/**
 * Returns suggestions whose text contains `query` (case-insensitive), best matches first.
 * Empty until the trimmed query is at least {@link PROMPT_SUGGESTION_MIN_LENGTH} characters.
 */
export function filterPromptSuggestionsByQuery(
  pool: readonly string[],
  query: string,
  limit = 8,
): string[] {
  const q = query.trim().toLowerCase();
  if (q.length < PROMPT_SUGGESTION_MIN_LENGTH) return [];

  const seen = new Set<string>();
  const ranked = pool
    .filter((s) => s.trim().length > 0)
    .map((s) => {
      const lower = s.toLowerCase();
      const idx = lower.indexOf(q);
      return { s, idx, starts: idx === 0 };
    })
    .filter((x) => x.idx >= 0)
    .sort((a, b) => {
      if (a.starts !== b.starts) return a.starts ? -1 : 1;
      if (a.idx !== b.idx) return a.idx - b.idx;
      return a.s.length - b.s.length;
    });

  const out: string[] = [];
  for (const row of ranked) {
    if (out.length >= limit) break;
    if (!seen.has(row.s)) {
      seen.add(row.s);
      out.push(row.s);
    }
  }
  return out;
}
