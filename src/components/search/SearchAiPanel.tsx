"use client";

import { ChatAssistantSources } from "@/components/chat/ChatAssistantSources";
import { ChatProductResults } from "@/components/chat/ChatProductResults";
import {
  ChatContainerContent,
  ChatContainerRoot,
  ChatContainerScrollAnchor,
} from "@/components/ui/chat-container";
import { Message, MessageAvatar, MessageContent, MessageMeta } from "@/components/ui/message";
import { PromptContextBadges } from "@/components/search/PromptContextBadges";
import { PromptSuggestionRow } from "@/components/search/PromptSuggestionRow";
import { PromptInputChatToolbar } from "@/components/search/PromptInputChatToolbar";
import { PromptInput, PromptInputTextarea } from "@/components/ui/prompt-input";
import { useLocale } from "@/context/LocaleContext";
import { assistantReplyForQuery, type AssistantSource } from "@/lib/chatAssistant";
import { getPromptSuggestionPool } from "@/lib/promptSuggestions";
import { ui } from "@/lib/ui-tokens";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import { mergePromptRefsIntoQuery } from "@/lib/promptProductRefs";
import { useDemoStore } from "@/store/demoStore";
import type { Product } from "@/types";
import { Bot } from "lucide-react";
import { useStickToBottomContext } from "use-stick-to-bottom";
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

type Msg =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; products: Product[]; sources: AssistantSource[] };

const REASONING_MIN_MS = 1400;

/** Must render inside ChatContainerContent. Bumps scroll to latest when the user sends or a reply lands (initial=false would otherwise skip resize auto-scroll). */
function ScrollToBottomOnBump({ bump, threadKey }: { bump: number; threadKey: string }) {
  const { scrollToBottom } = useStickToBottomContext();
  const prev = useRef({ threadKey, bump: 0 });
  useLayoutEffect(() => {
    if (prev.current.threadKey !== threadKey) {
      prev.current = { threadKey, bump };
      return;
    }
    if (bump < prev.current.bump) {
      prev.current.bump = bump;
      return;
    }
    if (bump > prev.current.bump) {
      prev.current.bump = bump;
      void scrollToBottom({ animation: "instant" });
    }
  }, [bump, threadKey, scrollToBottom]);
  return null;
}

function ReasoningLoading() {
  const t = useT();
  return (
    <Message className="items-start" role="status" aria-live="polite" aria-busy="true">
      <MessageAvatar aria-hidden>
        <Bot className="size-4 text-zinc-600" strokeWidth={2} />
      </MessageAvatar>
      <MessageContent className="space-y-3">
        <MessageMeta>{t("searchAiPanel.reasoning")}</MessageMeta>
        <div className="text-[14px] leading-[1.65] text-stone-600 sm:text-[15px]">
          <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <span>{t("searchAiPanel.matchingLine")}</span>
            <span className="inline-flex gap-0.5" aria-hidden>
              <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.2s]" />
              <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.1s]" />
              <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-zinc-500" />
            </span>
          </p>
          <div className="mt-3 space-y-2" aria-hidden>
            <div className="h-2 w-full rounded bg-stone-200/80 animate-pulse" />
            <div className="h-2 w-[92%] rounded bg-stone-200/70 animate-pulse" />
            <div className="h-2 w-[78%] rounded bg-stone-200/60 animate-pulse" />
          </div>
        </div>
      </MessageContent>
    </Message>
  );
}

export function SearchAiPanel() {
  const { locale } = useLocale();
  const t = useT();
  const promptFileInputId = useId();
  const profile = useDemoStore((s) => s.activeProfile);
  const currentQuery = useDemoStore((s) => s.currentQuery);
  const promptProductRefs = useDemoStore((s) => s.promptProductRefs);
  const clearPromptProductRefs = useDemoStore((s) => s.clearPromptProductRefs);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [replying, setReplying] = useState(false);
  const [scrollBump, setScrollBump] = useState(0);
  const lastSeedKeyRef = useRef<string | null>(null);
  const replyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const suggestionPool = useMemo(() => getPromptSuggestionPool(locale), [locale]);

  const threadKey =
    currentQuery.trim().length > 0 ? `${currentQuery.trim()}|${profile}|${locale}` : "empty";

  const bumpScroll = useCallback(() => {
    setScrollBump((n) => n + 1);
  }, []);

  useEffect(() => {
    const q = currentQuery.trim();
    if (!q) {
      setMessages([]);
      lastSeedKeyRef.current = null;
      setScrollBump(0);
      return;
    }
    const key = `${q}|${profile}|${locale}`;
    if (lastSeedKeyRef.current === key) return;
    lastSeedKeyRef.current = key;
    setScrollBump(0);
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
    const refs = useDemoStore.getState().promptProductRefs;
    if ((!text && !refs.length) || replying) return;

    const merged = mergePromptRefsIntoQuery(text, refs);
    clearPromptProductRefs();

    setMessages((prev) => [...prev, { role: "user", content: merged }]);
    setDraft("");
    setReplying(true);
    bumpScroll();

    if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
    replyTimerRef.current = setTimeout(() => {
      const { text: reply, products, sources } = assistantReplyForQuery(merged, profile, true, locale);
      setMessages((prev) => [...prev, { role: "assistant", content: reply, products, sources }]);
      setReplying(false);
      replyTimerRef.current = null;
      bumpScroll();
    }, REASONING_MIN_MS);
  }, [draft, profile, replying, locale, bumpScroll, clearPromptProductRefs]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="absolute inset-0 z-0 flex min-h-0 min-w-0 flex-col overflow-x-hidden bg-white">
        <ChatContainerRoot
          key={threadKey}
          data-storefront-ai-scroll=""
          className="h-full min-h-[min(36dvh,280px)]"
          stickInitial={false}
        >
          <ChatContainerContent className="gap-8 pt-6 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]">
            <ScrollToBottomOnBump bump={scrollBump} threadKey={threadKey} />
            {messages.length === 0 ? (
              <p className="text-center text-[14px] leading-relaxed tracking-tight text-stone-600 sm:text-[15px]">
                {t("searchAiPanel.emptyState")}
              </p>
            ) : null}
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={cn("flex w-full flex-col", m.role === "user" ? "items-end" : "items-stretch")}
              >
                {m.role === "user" ? (
                  <div className="max-w-[min(100%,85%)] rounded-2xl rounded-br-md border border-[rgba(245,245,245,0.9)] bg-gray-100 px-4 py-3 text-[14px] leading-[1.55] text-[rgba(41,41,41,1)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:text-[15px] sm:leading-[1.6]">
                    <p className="whitespace-pre-wrap text-pretty">{m.content}</p>
                  </div>
                ) : (
                  <Message className="items-start">
                    <MessageAvatar aria-hidden>
                      <Bot className="size-4 text-zinc-600" strokeWidth={2} />
                    </MessageAvatar>
                    <MessageContent>
                      <div className="space-y-7 text-[15px] leading-[1.65] text-stone-800 sm:leading-[1.7]">
                        <p className="whitespace-pre-wrap text-pretty">{m.content}</p>
                        <ChatAssistantSources sources={m.sources} />
                        <ChatProductResults products={m.products} profile={profile} />
                      </div>
                    </MessageContent>
                  </Message>
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
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center",
          ui.floatingSearchBarRowPad,
        )}
      >
        <div className="pointer-events-auto w-full max-w-xl px-0">
          <PromptSuggestionRow
            query={draft}
            pool={suggestionPool}
            onSelect={setDraft}
            disabled={replying}
          />
          <PromptInput
            value={draft}
            onValueChange={setDraft}
            onSubmit={onSend}
            maxHeight={160}
            disabled={replying}
            className={cn(
              ui.promptInputKit,
              "transition-opacity duration-200",
              replying && "pointer-events-none opacity-60",
            )}
          >
            <PromptContextBadges />
            <PromptInputTextarea
              data-ai-followup-input=""
              data-storefront-search-field=""
              placeholder={replying ? t("searchAiPanel.placeholderReasoning") : t("searchAiPanel.placeholderAsk")}
              disabled={replying}
              className={cn(
                ui.floatingSearchPillText,
                "max-h-[160px] text-stone-800 placeholder:text-stone-400",
              )}
              aria-label={t("searchAiPanel.ariaMessage")}
            />
            <PromptInputChatToolbar
              fileInputId={promptFileInputId}
              disabled={replying}
              onSend={onSend}
              sendDisabled={!draft.trim() && promptProductRefs.length === 0}
              sendLabel={t("searchAiPanel.sendAria")}
              onMicClick={() => {
                /* demo: entrada por voz */
              }}
            />
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
