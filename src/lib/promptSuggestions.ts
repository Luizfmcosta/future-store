import { getQuickSearchQueries } from "@/lib/searchCopy";

/**
 * Extra prompts merged with quick searches so typing filters a richer pool
 * (prompt-kit style: pills above the composer).
 */
const EXTRA_PROMPTS: string[] = [
  "Compare Horizon One and Trail Mini",
  "Best speaker for a small apartment",
  "Is Dolby Atmos worth it for music only?",
  "Waterproof options for patio or pool",
  "Cheapest way to start a multi-room setup",
  "What is Trueplay and when does it help?",
  "Soundbar or stereo pair for the living room",
  "Trail Max battery life vs Trail Mini",
];

/** Minimum typed length before showing chips (avoids noisy single-character matches). */
export const PROMPT_SUGGESTION_MIN_LENGTH = 2;

export function getPromptSuggestionPool(): string[] {
  return [...getQuickSearchQueries(), ...EXTRA_PROMPTS];
}

/** Short follow-up prompts shown under chat “top matches” (not filtered by composer text). */
const CHAT_FOLLOW_UP: string[] = [
  "Compare the top two for my room",
  "Best for movies vs music here?",
  "Any bundles that pair with these?",
  "Which has the strongest bass?",
  "Waterproof options at a similar price",
  "What’s the warranty on these models?",
];

export function getChatFollowUpSuggestions(): readonly string[] {
  return CHAT_FOLLOW_UP;
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
