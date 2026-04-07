"use client";

import { ChatAssistantSources } from "@/components/chat/ChatAssistantSources";
import { ChatProductResults } from "@/components/chat/ChatProductResults";
import {
  ChatContainerContent,
  ChatContainerRoot,
  ChatContainerScrollAnchor,
} from "@/components/ui/chat-container";
import { Message, MessageAvatar, MessageContent, MessageMeta } from "@/components/ui/message";
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
import { useStickToBottomContext } from "use-stick-to-bottom";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

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
  const profile = useDemoStore((s) => s.activeProfile);
  const currentQuery = useDemoStore((s) => s.currentQuery);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [replying, setReplying] = useState(false);
  const [composerExpanded, setComposerExpanded] = useState(false);
  const [scrollBump, setScrollBump] = useState(0);
  const lastSeedKeyRef = useRef<string | null>(null);
  const replyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const threadKey =
    currentQuery.trim().length > 0 ? `${currentQuery.trim()}|${profile}|${locale}` : "empty";

  const bumpScroll = useCallback(() => {
    setScrollBump((n) => n + 1);
  }, []);

  useLayoutEffect(() => {
    const el = document.querySelector<HTMLTextAreaElement>("[data-ai-followup-input]");
    if (!el) return;
    const sync = () => {
      setComposerExpanded(el.offsetHeight > 42);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [draft, replying]);

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
    if (!text || replying) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setDraft("");
    setReplying(true);
    bumpScroll();

    if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
    replyTimerRef.current = setTimeout(() => {
      const { text: reply, products, sources } = assistantReplyForQuery(text, profile, true, locale);
      setMessages((prev) => [...prev, { role: "assistant", content: reply, products, sources }]);
      setReplying(false);
      replyTimerRef.current = null;
      bumpScroll();
    }, REASONING_MIN_MS);
  }, [draft, profile, replying, locale, bumpScroll]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="absolute inset-0 z-0 flex min-h-0 min-w-0 flex-col overflow-x-hidden bg-white">
        <ChatContainerRoot
          key={threadKey}
          data-storefront-ai-scroll=""
          className="h-full min-h-[min(36dvh,280px)]"
          stickInitial={false}
        >
          <ChatContainerContent className="gap-8 pt-6 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]">
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
          <PromptInput
            value={draft}
            onValueChange={setDraft}
            onSubmit={onSend}
            maxHeight={200}
            disabled={replying}
            className={cn(
              "cursor-text border-0 border-transparent bg-transparent p-0 shadow-none ring-0 outline-none rounded-none",
              "transition-opacity duration-200",
              replying && "pointer-events-none opacity-60",
            )}
          >
            <div
              className={cn(
                ui.floatingSearchPill,
                !composerExpanded && "h-10",
                composerExpanded ? "items-end" : "items-center",
                "overflow-hidden",
              )}
            >
              <PromptInputTextarea
                data-ai-followup-input=""
                data-storefront-search-field=""
                placeholder={replying ? t("searchAiPanel.placeholderReasoning") : t("searchAiPanel.placeholderAsk")}
                disabled={replying}
                className={cn(
                  ui.floatingSearchPillText,
                  "min-h-10 flex-1 border-0 bg-transparent py-2 pl-0 pr-1 placeholder:text-white/70 focus-visible:ring-0 focus-visible:ring-offset-0",
                )}
                aria-label={t("searchAiPanel.ariaMessage")}
              />
              <PromptInputActions className="shrink-0 pr-0">
                <button
                  type="button"
                  disabled={replying}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSend();
                  }}
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-stone-900",
                    "transition-[transform,background-color] hover:bg-white/90 active:scale-[0.98]",
                    "disabled:pointer-events-none disabled:opacity-40",
                    ui.home.focusRing,
                    "focus-visible:rounded-full",
                  )}
                  aria-label={t("searchAiPanel.sendAria")}
                >
                  <ArrowUp className="size-4 text-stone-900" strokeWidth={2.5} aria-hidden />
                </button>
              </PromptInputActions>
            </div>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
