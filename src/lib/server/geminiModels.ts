/**
 * Default + fallbacks for Google AI Studio (`generativelanguage.googleapis.com`).
 * `gemini-1.5-flash` often 404s on v1beta; `gemini-2.0-flash` may 429 on free tier — lite 2.5 is a reliable default.
 */
export const GEMINI_DEFAULT_MODEL = "gemini-2.5-flash-lite";

export const GEMINI_MODEL_FALLBACKS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
] as const;

export function geminiModelCandidates(preferred: string): string[] {
  const trimmed = preferred.trim();
  const chain = [trimmed, ...GEMINI_MODEL_FALLBACKS];
  return chain.filter((m, i) => m.length > 0 && chain.indexOf(m) === i);
}
