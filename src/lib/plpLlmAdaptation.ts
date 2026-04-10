import type { Product } from "@/types";
import type { SearchIntent } from "@/types";

const PRIORITIES = new Set<string>(["best-value", "premium", "cinema", "sports"]);
const ROOM_DISTANCE = new Set<string>(["3m_listening"]);
const ROOM_TYPE = new Set<string>(["living_room"]);
const SIZE_PREF = new Set<string>(["flexible", "compact_under_budget", "room_3m_speakers"]);
const DELIVERY = new Set<string>(["sooner"]);

/** Merge rule-based intent with a validated LLM patch (PLP only). */
export function mergeSearchIntentWithLlmPatch(
  base: SearchIntent,
  patch: Partial<SearchIntent> | null | undefined,
): SearchIntent {
  if (!patch) return base;
  const next: SearchIntent = { ...base, rawQuery: base.rawQuery };

  if (typeof patch.budget === "number" && Number.isFinite(patch.budget) && patch.budget > 0) {
    next.budget = Math.min(patch.budget, 500_000);
  }
  if (patch.priority && PRIORITIES.has(patch.priority)) {
    next.priority = patch.priority;
  }
  if (patch.roomDistanceKey && ROOM_DISTANCE.has(patch.roomDistanceKey)) {
    next.roomDistanceKey = patch.roomDistanceKey;
  }
  if (patch.roomTypeKey && ROOM_TYPE.has(patch.roomTypeKey)) {
    next.roomTypeKey = patch.roomTypeKey;
  }
  if (patch.sizePreferenceKey && SIZE_PREF.has(patch.sizePreferenceKey)) {
    next.sizePreferenceKey = patch.sizePreferenceKey;
  }
  if (patch.deliveryNeedKey && DELIVERY.has(patch.deliveryNeedKey)) {
    next.deliveryNeedKey = patch.deliveryNeedKey;
  }
  if (Array.isArray(patch.useCase) && patch.useCase.length > 0) {
    const u = patch.useCase.filter((x): x is string => typeof x === "string").slice(0, 12);
    if (u.length) next.useCase = u;
  }

  return next;
}

/** Reorder `results` using LLM id list; unknown ids ignored; missing ids appended in original order. */
export function applyLlmProductRankOrder(results: Product[], llmIds: string[] | null | undefined): Product[] {
  if (!llmIds?.length) return results;
  const byId = new Map(results.map((p) => [p.id, p] as const));
  const seen = new Set<string>();
  const ordered: Product[] = [];
  for (const id of llmIds) {
    if (seen.has(id)) continue;
    const p = byId.get(id);
    if (p) {
      ordered.push(p);
      seen.add(id);
    }
  }
  for (const p of results) {
    if (!seen.has(p.id)) ordered.push(p);
  }
  return ordered;
}
