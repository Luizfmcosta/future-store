import { products } from "@/data/products";
import { GEMINI_DEFAULT_MODEL, geminiModelCandidates } from "@/lib/server/geminiModels";
import type { SearchIntent } from "@/types";
import type { ShopperProfileId } from "@/types";
import { NextResponse } from "next/server";

const PROFILES: ShopperProfileId[] = ["marina", "ricardo", "aiAgent"];

function isProfile(v: unknown): v is ShopperProfileId {
  return typeof v === "string" && (PROFILES as string[]).includes(v);
}

type GeminiJson = {
  candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
  error?: { code?: number; message?: string; status?: string };
};

function extractGeminiReplyText(data: GeminiJson): string {
  const parts = data.candidates?.[0]?.content?.parts;
  return parts?.map((p) => p.text ?? "").join("").trim() ?? "";
}

const PRIORITIES = new Set<string>(["best-value", "premium", "cinema", "sports"]);
const ROOM_DISTANCE = new Set<string>(["3m_listening"]);
const ROOM_TYPE = new Set<string>(["living_room"]);
const SIZE_PREF = new Set<string>(["flexible", "compact_under_budget", "room_3m_speakers"]);
const DELIVERY = new Set<string>(["sooner"]);

function sanitizeCollectionTitle(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const s = raw.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
  if (s.length < 4) return null;
  return s.slice(0, 72);
}

function sanitizeIntentPatch(raw: unknown): Partial<SearchIntent> {
  if (!raw || typeof raw !== "object") return {};
  const o = raw as Record<string, unknown>;
  const patch: Partial<SearchIntent> = {};

  if (typeof o.budget === "number" && Number.isFinite(o.budget) && o.budget > 0) {
    patch.budget = Math.min(o.budget, 500_000);
  }
  if (typeof o.priority === "string" && PRIORITIES.has(o.priority)) {
    patch.priority = o.priority as SearchIntent["priority"];
  }
  if (typeof o.roomDistanceKey === "string" && ROOM_DISTANCE.has(o.roomDistanceKey)) {
    patch.roomDistanceKey = o.roomDistanceKey as SearchIntent["roomDistanceKey"];
  }
  if (typeof o.roomTypeKey === "string" && ROOM_TYPE.has(o.roomTypeKey)) {
    patch.roomTypeKey = o.roomTypeKey as SearchIntent["roomTypeKey"];
  }
  if (typeof o.sizePreferenceKey === "string" && SIZE_PREF.has(o.sizePreferenceKey)) {
    patch.sizePreferenceKey = o.sizePreferenceKey as SearchIntent["sizePreferenceKey"];
  }
  if (typeof o.deliveryNeedKey === "string" && DELIVERY.has(o.deliveryNeedKey)) {
    patch.deliveryNeedKey = o.deliveryNeedKey as SearchIntent["deliveryNeedKey"];
  }
  if (Array.isArray(o.useCase)) {
    const u = o.useCase.filter((x): x is string => typeof x === "string").slice(0, 12);
    if (u.length) patch.useCase = u;
  }
  return patch;
}

function catalogPoolIds(): string[] {
  return products
    .filter((p) => p.category === "speaker" || p.category === "soundbar" || p.category === "tv")
    .map((p) => p.id);
}

function buildCatalogLines(): string {
  const pool = products.filter(
    (p) => p.category === "speaker" || p.category === "soundbar" || p.category === "tv",
  );
  return pool
    .map((p) => {
      const hint = p.bestFor.slice(0, 2).join("; ");
      return `- ${p.id} | ${p.category} | ${p.title} | R$ ${p.price} | ${hint}`;
    })
    .join("\n");
}

function normalizeRankedIds(requested: string[], validIds: string[]): string[] {
  const valid = new Set(validIds);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of requested) {
    if (valid.has(id) && !seen.has(id)) {
      out.push(id);
      seen.add(id);
    }
  }
  for (const id of validIds) {
    if (!seen.has(id)) out.push(id);
  }
  return out;
}

async function callGeminiPlpOnce(
  apiKey: string,
  model: string,
  body: Record<string, unknown>,
): Promise<{ ok: true; text: string } | { ok: false; httpStatus: number }> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const raw = await res.text();
  let data: GeminiJson = {};
  try {
    data = JSON.parse(raw) as GeminiJson;
  } catch {
    return { ok: false, httpStatus: res.status };
  }
  if (data.error?.message || !res.ok) {
    return { ok: false, httpStatus: res.status };
  }
  const text = extractGeminiReplyText(data);
  if (!text) return { ok: false, httpStatus: res.status };
  return { ok: true, text };
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json", skipped: true }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid_body", skipped: true }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  const query = typeof b.query === "string" ? b.query.trim() : "";
  if (!query || query.length > 4000) {
    return NextResponse.json({ error: "invalid_query", skipped: true }, { status: 400 });
  }
  if (!isProfile(b.profile)) {
    return NextResponse.json({ error: "invalid_profile", skipped: true }, { status: 400 });
  }
  const profile = b.profile;

  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (!geminiKey) {
    return NextResponse.json({ skipped: true }, { status: 200 });
  }

  const validIds = catalogPoolIds();
  const catalog = buildCatalogLines();

  const systemInstruction = [
    "You adapt a product listing page (PLP) for a premium audio / home theater demo store.",
    "You MUST respond with JSON only (no markdown).",
    "",
    "Schema:",
    '{ "rankedProductIds": string[], "collectionTitle": string, "intentPatch": {',
    '  "budget": number | null,',
    '  "priority": "best-value" | "premium" | "cinema" | "sports" | null,',
    '  "roomDistanceKey": "3m_listening" | null,',
    '  "roomTypeKey": "living_room" | null,',
    '  "sizePreferenceKey": "flexible" | "compact_under_budget" | "room_3m_speakers" | null,',
    '  "deliveryNeedKey": "sooner" | null,',
    '  "useCase": string[] | null',
    "} }",
    "",
    "Rules:",
    "- rankedProductIds: reorder every catalog product id by relevance to the shopper query (best first). Include each valid id exactly once.",
    "- collectionTitle: 4–12 words. A short name for this curated set, as if the storefront built a collection from the query (e.g. \"Atmos soundbars for your living room TV\"). English. No quote characters.",
    "- intentPatch: refine structured signals implied by the query (budget in BRL, room ~3m, cinema vs sports vs value vs premium, tv/soundbar vs portable, spatial/Atmos interest). Omit or null fields you cannot infer.",
    "- useCase entries may include: spatial_audio, tv_audio, portable (and short free-form tags if helpful).",
    "- Shopper profile affects tone of ranking, not inventing products.",
  ].join("\n");

  const userText = [
    `Shopper profile: ${profile}`,
    "",
    "Catalog (id | category | title | price | hints):",
    catalog,
    "",
    "Query:",
    query,
  ].join("\n");

  const plpPreferred = process.env.GEMINI_PLP_MODEL?.trim() || "";
  const chatPreferred = process.env.GEMINI_CHAT_MODEL?.trim() || "";
  const modelCandidates =
    plpPreferred || chatPreferred
      ? geminiModelCandidates(plpPreferred || chatPreferred)
      : geminiModelCandidates(GEMINI_DEFAULT_MODEL);

  const generationConfig = {
    temperature: 0.25,
    maxOutputTokens: 2048,
    responseMimeType: "application/json",
  };

  let parsed: { rankedProductIds?: unknown; intentPatch?: unknown; collectionTitle?: unknown } | null =
    null;

  for (const model of modelCandidates) {
    const out = await callGeminiPlpOnce(geminiKey, model, {
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: [{ role: "user", parts: [{ text: userText }] }],
      generationConfig,
    });
    if (!out.ok) continue;
    try {
      const candidate = JSON.parse(out.text) as {
        rankedProductIds?: unknown;
        intentPatch?: unknown;
        collectionTitle?: unknown;
      };
      if (!Array.isArray(candidate.rankedProductIds)) continue;
      parsed = candidate;
      break;
    } catch {
      /* try next model */
    }
  }

  if (!parsed) {
    return NextResponse.json({ skipped: true }, { status: 200 });
  }

  const rankedList = parsed.rankedProductIds;
  if (!Array.isArray(rankedList)) {
    return NextResponse.json({ skipped: true }, { status: 200 });
  }

  const rankedRaw = rankedList.filter((id: unknown): id is string => typeof id === "string");
  const rankedProductIds = normalizeRankedIds(rankedRaw, validIds);
  const intentPatch = sanitizeIntentPatch(parsed.intentPatch);
  const collectionTitle = sanitizeCollectionTitle(parsed.collectionTitle);

  return NextResponse.json({
    skipped: false,
    rankedProductIds,
    intentPatch,
    collectionTitle,
  });
}
