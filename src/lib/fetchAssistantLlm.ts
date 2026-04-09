import type { PromptSubmitPageContext, ShopperProfileId } from "@/types";

export type ChatTurn = { role: "user" | "assistant"; content: string };

export async function fetchAssistantLlmReply(args: {
  message: string;
  profile: ShopperProfileId;
  pageContext: PromptSubmitPageContext | null;
  history: ChatTurn[];
  signal?: AbortSignal;
}): Promise<{ reply: string | null }> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: args.message,
      profile: args.profile,
      pageContext: args.pageContext,
      history: args.history.slice(-12),
    }),
    signal: args.signal,
  });
  let data: { reply?: string | null };
  try {
    data = (await res.json()) as { reply?: string | null };
  } catch {
    return { reply: null };
  }
  const reply = typeof data.reply === "string" ? data.reply.trim() : "";
  if (!res.ok || !reply) return { reply: null };
  return { reply };
}
