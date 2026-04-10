import type { PromptSubmitPageContext, ShopperProfileId } from "@/types";

export type ChatTurn = { role: "user" | "assistant"; content: string };

export type AssistantLlmResult = {
  reply: string | null;
  /** API had no GEMINI_API_KEY / OPENAI_API_KEY (see `/api/chat`). */
  skipped?: boolean;
  /** Set when the request failed or the model returned no text (`upstream`, `empty`, etc.). */
  error?: string;
};

export async function fetchAssistantLlmReply(args: {
  message: string;
  profile: ShopperProfileId;
  pageContext: PromptSubmitPageContext | null;
  history: ChatTurn[];
  signal?: AbortSignal;
  /** When `pdpComparison`, the API uses a comparison-style system prompt for PDP assistant. */
  responseStyle?: "pdpComparison";
}): Promise<AssistantLlmResult> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    /** Required when the site uses Vercel Deployment Protection (password) so `/api/chat` gets the session cookie. */
    credentials: "include",
    body: JSON.stringify({
      message: args.message,
      profile: args.profile,
      pageContext: args.pageContext,
      history: args.history.slice(-12),
      ...(args.responseStyle ? { responseStyle: args.responseStyle } : {}),
    }),
    signal: args.signal,
  });
  let data: { reply?: string | null; skipped?: boolean; error?: string };
  try {
    data = (await res.json()) as { reply?: string | null; skipped?: boolean; error?: string };
  } catch {
    return { reply: null, error: "bad_json" };
  }
  const reply = typeof data.reply === "string" ? data.reply.trim() : "";
  if (reply) {
    return { reply };
  }
  if (res.ok && data.skipped === true) {
    return { reply: null, skipped: true };
  }
  if (!res.ok) {
    const err = typeof data.error === "string" ? data.error : "request_failed";
    return { reply: null, error: err };
  }
  return { reply: null, error: typeof data.error === "string" ? data.error : undefined };
}
