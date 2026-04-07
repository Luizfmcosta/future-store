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
import { useLocale } from "@/context/LocaleContext";
import { assistantReplyForQuery, type AssistantSource } from "@/lib/chatAssistant";
import { ui } from "@/lib/ui-tokens";
import { useT } from "@/lib/useT";
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
  const t = useT();
  return (
    <div className="w-full max-w-full space-y-0" role="status" aria-live="polite" aria-busy="true">
      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
        <span className="inline-flex size-5 items-center justify-center rounded-md bg-stone-100">
          <Bot className="size-3 text-violet-600" strokeWidth={2} aria-hidden />
        </span>
        {t("searchAiPanel.reasoning")}
      </div>
      <div className="text-[13px] leading-relaxed text-stone-600 sm:text-[14px]">
        <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <span>{t("searchAiPanel.matchingLine")}</span>
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
  const { locale } = useLocale();
  const t = useT();
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
    const key = `${q}|${profile}|${locale}`;
    if (lastSeedKeyRef.current === key) return;
    lastSeedKeyRef.current = key;
    const { text, products, sources } = assistantReplyForQuery(q, profile, true, locale);
    setMessages([
      { role: "user", content: q },
      { role: "assistant", content: text, products, sources },
    ]);
  }, [currentQuery, profile, locale]);

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
      const { text: reply, products, sources } = assistantReplyForQuery(text, profile, true, locale);
      setMessages((prev) => [...prev, { role: "assistant", content: reply, products, sources }]);
      setReplying(false);
      replyTimerRef.current = null;
    }, REASONING_MIN_MS);
  }, [draft, profile, replying, locale]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-0">
      <ChatContainerRoot className="min-h-[min(36dvh,280px)] flex-1">
        <ChatContainerContent className="gap-6 py-2">
          {messages.length === 0 ? (
            <p className="text-center text-[13px] leading-relaxed text-stone-600">{t("searchAiPanel.emptyState")}</p>
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
                <div className="max-w-[min(100%,520px)] text-[13px] leading-relaxed text-stone-900 sm:text-[14px]">
                  <p className="whitespace-pre-wrap text-pretty">{m.content}</p>
                </div>
              ) : (
                <div className="w-full max-w-full space-y-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
                    <span className="inline-flex size-5 items-center justify-center rounded-md bg-stone-100">
                      <Bot className="size-3 text-violet-600" strokeWidth={2} aria-hidden />
                    </span>
                    {t("searchAiPanel.assistant")}
                  </div>
                  <div className="space-y-4 text-[13px] leading-relaxed text-stone-700 sm:text-[14px]">
                    <p className="whitespace-pre-wrap font-sans text-pretty">{m.content}</p>
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
          "sticky bottom-0 z-40 mt-6 shrink-0 border-t border-stone-200/80 bg-white/90 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-md supports-[backdrop-filter]:bg-white/75"
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
                placeholder={replying ? t("searchAiPanel.placeholderReasoning") : t("searchAiPanel.placeholderAsk")}
                disabled={replying}
                className="min-h-[44px] flex-1 py-2.5 pl-1 pr-1 text-[15px] text-stone-900 placeholder:text-stone-400"
                aria-label={t("searchAiPanel.ariaMessage")}
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
                  aria-label={t("searchAiPanel.sendAria")}
                >
                  <ArrowUp className="size-[18px]" strokeWidth={2.5} aria-hidden />
                </button>
              </PromptInputActions>
            </div>
            <p className="px-1 pb-0.5 text-[11px] text-stone-500">{t("searchAiPanel.hints")}</p>
          </div>
        </PromptInput>
      </div>
    </div>
  );
}
