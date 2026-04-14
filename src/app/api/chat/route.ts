import { formatCatalogForChatLlm } from "@/lib/server/catalogOverviewForLlm";
import { isChatLlmConfigured } from "@/lib/server/chatLlmConfigured";
import { geminiModelCandidates, GEMINI_DEFAULT_MODEL } from "@/lib/server/geminiModels";
import { formatPromptPageContextForLlm } from "@/lib/promptPageContext";
import type { PromptSubmitPageContext, ShopperProfileId } from "@/types";
import { NextResponse } from "next/server";

const PROFILES: ShopperProfileId[] = ["marina", "ricardo", "aiAgent"];

function isProfile(v: unknown): v is ShopperProfileId {
  return typeof v === "string" && (PROFILES as string[]).includes(v);
}

function isPageContext(v: unknown): v is PromptSubmitPageContext {
  if (!v || typeof v !== "object") return false;
  const k = (v as { kind?: unknown }).kind;
  if (k === "plp") {
    const p = v as { pathname?: unknown; searchParamsSnapshot?: unknown };
    if (typeof p.pathname !== "string") return false;
    /* Allow missing snapshot (older clients / JSON); normalize to "" when parsing. */
    return p.searchParamsSnapshot === undefined || typeof p.searchParamsSnapshot === "string";
  }
  if (k === "pdp") {
    const p = v as { pathname?: unknown; productId?: unknown };
    return typeof p.pathname === "string" && typeof p.productId === "string";
  }
  if (k === "cart") {
    const p = v as { pathname?: unknown; cartLineId?: unknown; cartQuantity?: unknown };
    return (
      typeof p.pathname === "string" &&
      (p.cartLineId === null || typeof p.cartLineId === "string") &&
      typeof p.cartQuantity === "number"
    );
  }
  return false;
}

function isHistoryFixed(v: unknown): v is { role: "user" | "assistant"; content: string }[] {
  if (!Array.isArray(v) || v.length > 20) return false;
  for (const x of v) {
    if (!x || typeof x !== "object") return false;
    const role = (x as { role?: unknown }).role;
    const content = (x as { content?: unknown }).content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return false;
    if (content.length > 8000) return false;
  }
  return true;
}

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const PDP_COMPARISON_MODE = [
  "",
  "PDP comparison mode:",
  "The customer is on a Future Store product detail page. Their message may include an \"About: …\" line naming the product they were viewing.",
  "Keep the entire reply about Future Store only — no other retailers or off-topic content.",
  "Alternatives in bullets MUST be products from the AUTHORITATIVE CATALOG in this system prompt (use their titles as shown there). Never name external or competitor products.",
  "Open with exactly this structure (adapt the viewed product name and priority to context):",
  "- Line 1: \"Here are 3 top matches ranked for Future Store vs [viewed product title].\"",
  "- Line 2: \"You asked for other options and based on your profile we are prioritizing [priority signal, e.g. best value / premium / cinema / sports].\"",
  "- Then at most 3 bullet lines naming alternatives with concrete trade-offs vs what they were viewing.",
  "When suggesting alternatives, prefer lower-priced or similar-tier options in the same product category — do not steer toward more expensive upgrades unless the shopper explicitly asks for premium or a step-up.",
  "If the viewed product is a room speaker or soundbar (not headphones), do not suggest headphones or earbuds — only comparable speakers, soundbars, or relevant home audio.",
  "Do not use the old SERP-style intro (\"Here are 4 top matches…\") or separate \"You asked:\" / \"Priority:\" lines.",
  "If you lack specs or prices, say the PDP lists details and avoid inventing numbers.",
].join("\n");

function buildMessages(
  profile: ShopperProfileId,
  pageContext: PromptSubmitPageContext | null,
  history: { role: "user" | "assistant"; content: string }[],
  message: string,
  responseStyle?: string,
): ChatMessage[] {
  const pageBlock = formatPromptPageContextForLlm(pageContext);
  const catalogBlock = formatCatalogForChatLlm();
  const system = [
    "You are the in-store assistant for Future Store only — a demo premium audio and home-theater storefront (speakers, soundbars, TVs, accessories on this website).",
    `Shopper profile id (tone hint only): ${profile}.`,
    "",
    catalogBlock,
    "",
    "Current page context when the customer sent this message:",
    pageBlock,
    "",
    "Reply in the same language as the customer's message. Be helpful, but only within Future Store: product guidance, comparisons, and how to use this site — not generic advice unrelated to shopping here.",
    "Only discuss, recommend, or compare products that appear in the AUTHORITATIVE CATALOG above. Never suggest or name products from outside that list.",
    "If you lack product specs or prices, say the catalog or PDP lists details and avoid inventing numbers.",
    responseStyle === "pdpComparison" ? PDP_COMPARISON_MODE : "",
  ]
    .filter(Boolean)
    .join("\n");

  return [
    { role: "system", content: system },
    ...history.map((h) => ({ role: h.role, content: h.content.slice(0, 8000) })),
    { role: "user", content: message },
  ];
}

async function callOpenAi(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  maxTokens?: number,
): Promise<{ ok: true; text: string } | { ok: false; status: number; detail: string }> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.65,
      max_tokens: maxTokens ?? 900,
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error("[api/chat] OpenAI error", res.status, errText.slice(0, 500));
    return { ok: false, status: 502, detail: "upstream" };
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim() ?? "";
  if (!text) return { ok: false, status: 502, detail: "empty" };
  return { ok: true, text };
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

async function callGeminiOnce(
  apiKey: string,
  model: string,
  body: Record<string, unknown>,
): Promise<{ ok: true; text: string } | { ok: false; status: number; httpStatus: number; detail: string }> {
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
    console.error("[api/chat] Gemini non-JSON", res.status, raw.slice(0, 200));
    return { ok: false, status: 502, httpStatus: res.status, detail: "upstream" };
  }
  if (data.error?.message) {
    console.error("[api/chat] Gemini error field", res.status, data.error.message.slice(0, 400));
    return { ok: false, status: 502, httpStatus: res.status, detail: "upstream" };
  }
  if (!res.ok) {
    console.error("[api/chat] Gemini HTTP error", res.status, raw.slice(0, 500));
    return { ok: false, status: 502, httpStatus: res.status, detail: "upstream" };
  }
  const text = extractGeminiReplyText(data);
  if (text) return { ok: true, text };
  const fr = data.candidates?.[0]?.finishReason;
  const br = data.promptFeedback?.blockReason;
  console.error("[api/chat] Gemini empty reply", { finishReason: fr, blockReason: br });
  return { ok: false, status: 502, httpStatus: res.status, detail: "empty" };
}

async function callGemini(
  apiKey: string,
  preferredModel: string,
  messages: ChatMessage[],
  opts?: { maxOutputTokens?: number },
): Promise<{ ok: true; text: string } | { ok: false; status: number; detail: string }> {
  const systemMsg = messages.find((m) => m.role === "system");
  const rest = messages.filter((m) => m.role !== "system");

  const generationConfig = {
    temperature: 0.65,
    maxOutputTokens: opts?.maxOutputTokens ?? 900,
  };

  const buildContents = (mergeSystemIntoFirstUser: boolean) => {
    let conv = rest;
    if (mergeSystemIntoFirstUser && systemMsg && conv.length > 0 && conv[0].role === "user") {
      conv = [
        {
          role: "user" as const,
          content: `${systemMsg.content}\n\n---\n\n${conv[0].content}`,
        },
        ...conv.slice(1),
      ];
    }
    return conv.map((m) => ({
      role: m.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.content }],
    }));
  };

  const modelCandidates = geminiModelCandidates(preferredModel);

  let lastFail: { ok: false; status: number; detail: string } | null = null;

  for (const model of modelCandidates) {
    for (const mergeSystem of [false, true]) {
      if (mergeSystem && !systemMsg) continue;
      const contents = buildContents(mergeSystem);
      const body: Record<string, unknown> = {
        contents,
        generationConfig,
      };
      if (systemMsg && !mergeSystem) {
        body.systemInstruction = { parts: [{ text: systemMsg.content }] };
      }

      const out = await callGeminiOnce(apiKey, model, body);
      if (out.ok) return out;

      lastFail = { ok: false, status: out.status, detail: out.detail };
      /* 404 = wrong model id; 429 = quota — try next model instead of alternate request shape. */
      if (out.httpStatus === 404 || out.httpStatus === 429) break;
    }
  }

  return lastFail ?? { ok: false, status: 502, detail: "upstream" };
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json", reply: null }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid_body", reply: null }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  const message = typeof b.message === "string" ? b.message.trim() : "";
  if (!message || message.length > 4000) {
    return NextResponse.json({ error: "invalid_message", reply: null }, { status: 400 });
  }
  if (!isProfile(b.profile)) {
    return NextResponse.json({ error: "invalid_profile", reply: null }, { status: 400 });
  }
  const rawCtx = b.pageContext;
  let pageContext: PromptSubmitPageContext | null = null;
  if (rawCtx !== null && rawCtx !== undefined) {
    if (!isPageContext(rawCtx)) {
      return NextResponse.json({ error: "invalid_page_context", reply: null }, { status: 400 });
    }
    const raw = rawCtx as Record<string, unknown>;
    pageContext =
      raw.kind === "plp"
        ? {
            kind: "plp",
            pathname: raw.pathname as string,
            searchParamsSnapshot:
              typeof raw.searchParamsSnapshot === "string" ? raw.searchParamsSnapshot : "",
          }
        : (rawCtx as PromptSubmitPageContext);
  }
  const history = isHistoryFixed(b.history) ? b.history : [];

  let responseStyle: string | undefined;
  if (b.responseStyle === undefined || b.responseStyle === null) {
    responseStyle = undefined;
  } else if (b.responseStyle === "pdpComparison") {
    responseStyle = "pdpComparison";
  } else {
    return NextResponse.json({ error: "invalid_response_style", reply: null }, { status: 400 });
  }

  if (!isChatLlmConfigured()) {
    return NextResponse.json({ reply: null, skipped: true }, { status: 200 });
  }

  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openAiKey = process.env.OPENAI_API_KEY?.trim();

  const chatMessages = buildMessages(b.profile, pageContext, history, message, responseStyle);

  try {
    if (geminiKey) {
      /* 1.5-flash is widely enabled on AI Studio keys; 2.0 is tried as fallback inside `callGemini`. */
      const model = process.env.GEMINI_CHAT_MODEL?.trim() || GEMINI_DEFAULT_MODEL;
      const out = await callGemini(
        geminiKey,
        model,
        chatMessages,
        responseStyle === "pdpComparison" ? { maxOutputTokens: 480 } : undefined,
      );
      if (!out.ok) {
        return NextResponse.json({ reply: null, error: out.detail }, { status: out.status });
      }
      return NextResponse.json({ reply: out.text });
    }

    const model = process.env.OPENAI_CHAT_MODEL?.trim() || "gpt-4o-mini";
    const out = await callOpenAi(
      openAiKey!,
      model,
      chatMessages,
      responseStyle === "pdpComparison" ? 450 : undefined,
    );
    if (!out.ok) {
      return NextResponse.json({ reply: null, error: out.detail }, { status: out.status });
    }
    return NextResponse.json({ reply: out.text });
  } catch (e) {
    console.error("[api/chat]", e);
    return NextResponse.json({ reply: null, error: "fetch_failed" }, { status: 502 });
  }
}
