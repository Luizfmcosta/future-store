import type { SearchIntent } from "@/types";
import type { ShopperProfileId } from "@/types";

export type PlpLlmAdaptationPayload = {
  rankedProductIds: string[];
  intentPatch: Partial<SearchIntent>;
  collectionTitle: string | null;
};

export async function fetchPlpLlmAdaptation(args: {
  query: string;
  profile: ShopperProfileId;
  signal?: AbortSignal;
}): Promise<{ skipped: true } | ({ skipped: false } & PlpLlmAdaptationPayload)> {
  const res = await fetch("/api/plp-adapt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: args.query, profile: args.profile }),
    signal: args.signal,
  });
  if (!res.ok) return { skipped: true };
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return { skipped: true };
  }
  if (!data || typeof data !== "object") return { skipped: true };
  const o = data as Record<string, unknown>;
  if (o.skipped === true) return { skipped: true };
  const ranked = o.rankedProductIds;
  const patch =
    o.intentPatch && typeof o.intentPatch === "object" ? (o.intentPatch as Partial<SearchIntent>) : {};
  if (!Array.isArray(ranked)) {
    return { skipped: true };
  }
  const rankedProductIds = ranked.filter((id): id is string => typeof id === "string");
  const rawTitle = o.collectionTitle;
  const collectionTitle =
    typeof rawTitle === "string" && rawTitle.trim().length >= 4 ? rawTitle.trim().slice(0, 72) : null;
  return {
    skipped: false,
    rankedProductIds,
    intentPatch: patch,
    collectionTitle,
  };
}
