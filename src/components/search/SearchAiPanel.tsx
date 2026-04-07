"use client";

import { ChatAssistantSources } from "@/components/chat/ChatAssistantSources";
import { ChatProductResults } from "@/components/chat/ChatProductResults";
import {
  ChatContainerContent,
  ChatContainerRoot,
  ChatContainerScrollAnchor,
} from "@/components/ui/chat-container";
import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { assistantReplyForQuery, type AssistantSource } from "@/lib/chatAssistant";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import type { Product } from "@/types";
import { ArrowUp, Bot } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Msg =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; products: Product[]; sources: AssistantSource[] };

const REASONING_MIN_MS = 1400;

function ReasoningLoading() {
  return (
    <div className="w-full max-w-full space-y-0" role="status" aria-live="polite" aria-busy="true">
      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
        <span className="inline-flex size-5 items-center justify-center rounded-md bg-stone-100">
          <Bot className="size-3 text-violet-600" strokeWidth={2} aria-hidden />
        </span>
        Reasoning
      </div>
      <div
        className={cn(
          "rounded-[1.25rem] rounded-tl-md border border-stone-200/90 bg-stone-50 px-3.5 py-3 shadow-sm",
          "text-[13px] leading-relaxed text-stone-600 sm:text-[14px]"
        )}
      >
        <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <span>Matching intent to products and editorial sources</span>
          <span className="inline-flex gap-0.5" aria-hidden>
            <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-violet-500 [animation-delay:-0.2s]" />
            <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-violet-500 [animation-delay:-0.1s]" />
            <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-violet-500" />
          </span>
        </p>
        <div className="mt-3 space-y-2" aria-hidden>
          <div className="h-2 w-full rounded bg-stone-200/80 animate-pulse" />
          <div className="h-2 w-[92%] rounded bg-stone-200/70 animate-pulse" />
          <div className="h-2 w-[78%] rounded bg-stone-200/60 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function SearchAiPanel() {
  const profile = useDemoStore((s) => s.activeProfile);
  const currentQuery = useDemoStore((s) => s.currentQuery);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [replying, setReplying] = useState(false);
  const lastSeedKeyRef = useRef<string | null>(null);
  const replyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const q = currentQuery.trim();
    if (!q) {
      setMessages([]);
      lastSeedKeyRef.current = null;
      return;
    }
    const key = `${q}|${profile}`;
    if (lastSeedKeyRef.current === key) return;
    lastSeedKeyRef.current = key;
    const { text, products, sources } = assistantReplyForQuery(q, profile, true);
    setMessages([
      { role: "user", content: q },
      { role: "assistant", content: text, products, sources },
    ]);
  }, [currentQuery, profile]);

  useEffect(() => {
    return () => {
      if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
    };
  }, []);

  const onSend = useCallback(() => {
    const text = draft.trim();
    if (!text || replying) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setDraft("");
    setReplying(true);

    if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
    replyTimerRef.current = setTimeout(() => {
      const { text: reply, products, sources } = assistantReplyForQuery(text, profile, true);
      setMessages((prev) => [...prev, { role: "assistant", content: reply, products, sources }]);
      setReplying(false);
      replyTimerRef.current = null;
    }, REASONING_MIN_MS);
  }, [draft, profile, replying]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-0">
      <ChatContainerRoot className="min-h-[min(36dvh,320px)] flex-1 rounded-2xl border border-stone-200/90 bg-white shadow-[inset_0_1px_0_rgba(0,0,0,0.04)]">
        <ChatContainerContent className="gap-5 px-3 py-4 sm:px-4">
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-200/90 bg-stone-50/80 px-4 py-8 text-center">
              <p className="text-[13px] leading-relaxed text-stone-600">
                Type a question in the composer below, or run a search from the top bar. We’ll ground picks in trusted
                reviews and surface matching products.
              </p>
            </div>
          ) : null}
          {messages.map((m, i) => (
            <div
              key={`${m.role}-${i}`}
              className={cn(
                "flex w-full flex-col gap-1",
                m.role === "user" ? "items-end" : "items-stretch"
              )}
            >
              {m.role === "user" ? (
                <div
                  className={cn(
                    "max-w-[min(100%,520px)] rounded-[1.25rem] rounded-br-md border border-stone-200/90",
                    "bg-gradient-to-b from-stone-100 to-stone-50 px-3.5 py-2.5",
                    "text-[13px] leading-relaxed text-stone-900 shadow-sm sm:text-[14px]"
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              ) : (
                <div className="w-full max-w-full space-y-0">
                  <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
                    <span className="inline-flex size-5 items-center justify-center rounded-md bg-stone-100">
                      <Bot className="size-3 text-violet-600" strokeWidth={2} aria-hidden />
                    </span>
                    Assistant
                  </div>
                  <div
                    className={cn(
                      "rounded-[1.25rem] rounded-tl-md border border-stone-200/90 bg-stone-50 px-3.5 py-3",
                      "text-[13px] leading-relaxed text-stone-700 shadow-sm sm:text-[14px]"
                    )}
                  >
                    <p className="whitespace-pre-wrap font-sans">{m.content}</p>
                    <ChatAssistantSources sources={m.sources} />
                    <ChatProductResults products={m.products} profile={profile} />
                  </div>
                </div>
              )}
            </div>
          ))}
          {replying ? (
            <div className="flex w-full flex-col gap-1">
              <ReasoningLoading />
            </div>
          ) : null}
          <ChatContainerScrollAnchor />
        </ChatContainerContent>
      </ChatContainerRoot>

      <div
        className={cn(
            "sticky bottom-0 z-40 -mx-4 mt-4 shrink-0 border-t border-stone-200/90 bg-white/95 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:-mx-6 sm:px-6"
        )}
      >
        <PromptInput
          value={draft}
          onValueChange={setDraft}
          onSubmit={onSend}
          maxHeight={200}
          disabled={replying}
          className={cn(
            ui.searchBarOnLight,
            "!rounded-[1.35rem] p-2",
            "transition-[box-shadow,border-color] duration-200",
            replying && "pointer-events-none opacity-60"
          )}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-end gap-2">
              <PromptInputTextarea
                data-ai-followup-input=""
                placeholder={replying ? "Reasoning…" : "Ask a follow-up…"}
                disabled={replying}
                className="min-h-[44px] flex-1 py-2.5 pl-1 pr-1 text-[15px] text-stone-900 placeholder:text-stone-400"
                aria-label="AI mode message"
              />
              <PromptInputActions className="shrink-0 pb-1.5 pr-0.5">
                <button
                  type="button"
                  disabled={replying}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSend();
                  }}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full bg-stone-900 text-white",
                    "transition-[transform,background-color] hover:bg-stone-800 active:scale-[0.98]",
                    "disabled:pointer-events-none disabled:opacity-40",
                    ui.home.focusRing,
                    "focus-visible:rounded-full"
                  )}
                  aria-label="Send message"
                >
                  <ArrowUp className="size-[18px]" strokeWidth={2.5} aria-hidden />
                </button>
              </PromptInputActions>
            </div>
            <p className="px-1 pb-0.5 text-[11px] text-stone-500">
              Enter to send · Shift+Enter for a new line · ⌘K focuses this field
            </p>
          </div>
        </PromptInput>
      </div>
    </div>
  );
}
