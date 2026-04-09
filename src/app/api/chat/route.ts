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
    return typeof p.pathname === "string" && typeof p.searchParamsSnapshot === "string";
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
    pageContext = rawCtx;
  }
  const history = isHistoryFixed(b.history) ? b.history : [];

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: null, skipped: true }, { status: 200 });
  }

  const model = process.env.OPENAI_CHAT_MODEL?.trim() || "gpt-4o-mini";
  const pageBlock = formatPromptPageContextForLlm(pageContext);

  const system = [
    "You are a concise, friendly shopping assistant for a premium audio and home-theater demo storefront (speakers, soundbars, TVs, accessories).",
    `Shopper profile id (tone hint only): ${b.profile}.`,
    "",
    "Current page context when the customer sent this message:",
    pageBlock,
    "",
    "Reply in the same language as the customer's message. Be helpful and specific to their question and the page context when relevant.",
    "If you lack product specs or prices, say the catalog page lists details and avoid inventing numbers.",
  ].join("\n");

  const openAiMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: system },
    ...history.map((h) => ({ role: h.role, content: h.content.slice(0, 8000) })),
    { role: "user", content: message },
  ];

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: openAiMessages,
        temperature: 0.65,
        max_tokens: 900,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error("[api/chat] OpenAI error", res.status, errText.slice(0, 500));
      return NextResponse.json({ reply: null, error: "upstream" }, { status: 502 });
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim() ?? "";
    if (!reply) {
      return NextResponse.json({ reply: null, error: "empty" }, { status: 502 });
    }
    return NextResponse.json({ reply });
  } catch (e) {
    console.error("[api/chat]", e);
    return NextResponse.json({ reply: null, error: "fetch_failed" }, { status: 502 });
  }
}
