"use client";

import { HomeFooterBleed } from "@/components/home/HomeFooter";
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
import { assistantReplyForQuery, type AssistantSource } from "@/lib/chatAssistant";
import { fetchAssistantLlmReply, type ChatTurn } from "@/lib/fetchAssistantLlm";
import { getChatFollowUpSuggestions, getPromptSuggestionPool } from "@/lib/promptSuggestions";
import { ui } from "@/lib/ui-tokens";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import { mergePromptRefsIntoQuery } from "@/lib/promptProductRefs";
import { useDemoStore } from "@/store/demoStore";
import type { Product, PromptSubmitPageContext } from "@/types";
import { Sparkles } from "lucide-react";
import { createPortal } from "react-dom";
import { useStickToBottomContext, type GetTargetScrollTop } from "use-stick-to-bottom";
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

/** Marks end of chat for PLP AI: stick-to-bottom caps here so the footer can live below the fold. */
const PLP_CHAT_SCROLL_CAP_SEL = "[data-storefront-chat-scroll-cap]";

const plpChatTargetScrollTop: GetTargetScrollTop = (fullTarget, { scrollElement, contentElement }) => {
  const end = contentElement.querySelector<HTMLElement>(PLP_CHAT_SCROLL_CAP_SEL);
  if (!end) return fullTarget;
  const scrollEl = scrollElement;
  const endTopInContent =
    scrollEl.scrollTop + (end.getBoundingClientRect().top - scrollEl.getBoundingClientRect().top);
  const endBottomInContent = endTopInContent + end.offsetHeight;
  const maxScroll = endBottomInContent - scrollEl.clientHeight;
  return Math.min(fullTarget, Math.max(0, maxScroll));
};

type Msg =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; products: Product[]; sources: AssistantSource[] };

function messagesToApiHistory(msgs: Msg[]): ChatTurn[] {
  return msgs.map((m) =>
    m.role === "user"
      ? { role: "user" as const, content: m.content }
      : { role: "assistant" as const, content: m.content },
  );
}

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
        <Sparkles className="size-5 text-violet-500/90" strokeWidth={2} aria-hidden />
      </MessageAvatar>
      <MessageContent className="space-y-3">
        <MessageMeta>{t("searchAiPanel.reasoning")}</MessageMeta>
        <div className="text-[15px] leading-[1.65] text-stone-600 sm:text-[16px]">
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

export function SearchAiPanel({
  variant = "default",
  composerHostEl,
}: {
  /** `pdp`: thread stays in the assistant card; composer is portaled to `composerHostEl` below the card. */
  variant?: "default" | "pdp";
  composerHostEl?: HTMLDivElement | null;
} = {}) {
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
  const messagesRef = useRef<Msg[]>([]);
  const threadOriginContextRef = useRef<PromptSubmitPageContext | null>(null);
  const prevSeedQRef = useRef<string | null>(null);
  const seedAbortRef = useRef<AbortController | null>(null);
  const followUpAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const suggestionPool = useMemo(() => getPromptSuggestionPool(), []);
  const chatFollowUps = useMemo(() => getChatFollowUpSuggestions(), []);

  const threadKey =
    currentQuery.trim().length > 0 ? `${currentQuery.trim()}|${profile}` : "empty";

  const bumpScroll = useCallback(() => {
    setScrollBump((n) => n + 1);
  }, []);

  useEffect(() => {
    seedAbortRef.current?.abort();
    const ac = new AbortController();
    seedAbortRef.current = ac;

    const run = async () => {
      const q = currentQuery.trim();
      if (!q) {
        prevSeedQRef.current = null;
        threadOriginContextRef.current = null;
        setMessages([]);
        setReplying(false);
        setScrollBump(0);
        return;
      }

      const qChanged = prevSeedQRef.current !== q;
      prevSeedQRef.current = q;
      const ctxSnapshot = useDemoStore.getState().lastPromptSubmitContext;
      if (qChanged) {
        threadOriginContextRef.current = ctxSnapshot;
      } else if (ctxSnapshot) {
        threadOriginContextRef.current = ctxSnapshot;
      }

      setScrollBump(0);
      setMessages([{ role: "user", content: q }]);
      setReplying(true);

      const fallback = assistantReplyForQuery(q, profile, true);
      let assistantText = fallback.text;
      try {
        const { reply } = await fetchAssistantLlmReply({
          message: q,
          profile,
          pageContext: ctxSnapshot,
          history: [],
          signal: ac.signal,
        });
        if (!ac.signal.aborted && reply) assistantText = reply;
      } catch {
        /* demo: offline / API error → catalog narrative */
      }

      if (ac.signal.aborted) return;

      if (ctxSnapshot) {
        useDemoStore.getState().setPromptSubmitContext(null);
      }

      setMessages([
        { role: "user", content: q },
        {
          role: "assistant",
          content: assistantText,
          products: fallback.products,
          sources: fallback.sources,
        },
      ]);
      setReplying(false);
      /* No scroll bump: instant scrollToBottom felt like a jump when loading margins collapsed / user had scrolled up. ResizeObserver still follows growth if already pinned to bottom. */
    };

    void run();
    return () => ac.abort();
  }, [currentQuery, profile]);

  useEffect(() => {
    return () => {
      followUpAbortRef.current?.abort();
    };
  }, []);

  const isPdp = variant === "pdp";

  const onSend = useCallback(() => {
    const text = draft.trim();
    const refs = useDemoStore.getState().promptProductRefs;
    if ((!text && !refs.length) || replying) return;

    const merged = mergePromptRefsIntoQuery(text, refs);
    clearPromptProductRefs();

    followUpAbortRef.current?.abort();
    const ac = new AbortController();
    followUpAbortRef.current = ac;

    const prev = messagesRef.current;
    const history = messagesToApiHistory(prev);

    setMessages((p) => [...p, { role: "user", content: merged }]);
    setDraft("");
    setReplying(true);
    bumpScroll();

    const run = async () => {
      const fallback = assistantReplyForQuery(merged, profile, true);
      let assistantText = fallback.text;
      try {
        const { reply } = await fetchAssistantLlmReply({
          message: merged,
          profile,
          pageContext: threadOriginContextRef.current,
          history,
          signal: ac.signal,
        });
        if (!ac.signal.aborted && reply) assistantText = reply;
      } catch {
        /* fallback narrative */
      }
      if (ac.signal.aborted) return;
      setMessages((p) => [
        ...p,
        {
          role: "assistant",
          content: assistantText,
          products: fallback.products,
          sources: fallback.sources,
        },
      ]);
      setReplying(false);
    };

    void run();
  }, [draft, profile, replying, bumpScroll, clearPromptProductRefs]);

  const composerInner = (
    <>
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
            isPdp && "text-[15px] md:text-[15px]",
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
    </>
  );

  const chatThread = (
    <>
      <ScrollToBottomOnBump bump={scrollBump} threadKey={threadKey} />
      {messages.length === 0 ? (
        isPdp ? (
          <div className="flex min-h-[min(32dvh,220px)] w-full flex-1 flex-col items-center justify-center px-5 sm:px-8">
            <p className="max-w-[22rem] text-balance text-pretty text-center text-[15px] leading-[1.65] tracking-tight text-stone-600 sm:text-[16px] sm:leading-[1.7]">
              {t("searchAiPanel.emptyState")}
            </p>
          </div>
        ) : (
          <div className="flex w-full flex-1 flex-col items-center justify-start pt-2 pb-96 sm:pb-[33rem] lg:pb-[42rem] sm:pt-4">
            <p className="text-balance text-pretty text-center text-[15px] leading-relaxed tracking-tight text-stone-600 sm:text-[16px]">
              {t("searchAiPanel.emptyState")}
            </p>
          </div>
        )
      ) : null}
      {messages.map((m, i) => {
        const followUpChipsActive = m.role === "assistant" && i === messages.length - 1;
        return (
          <div
            key={`${m.role}-${i}`}
            className={cn("flex w-full flex-col", m.role === "user" ? "items-end" : "items-stretch")}
          >
            {m.role === "user" ? (
              <div className="max-w-[min(100%,85%)] rounded-2xl rounded-br-md bg-stone-100 px-4 py-3 text-[15px] leading-[1.55] text-stone-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:text-[16px] sm:leading-[1.6]">
                <p className="whitespace-pre-wrap text-pretty">{m.content}</p>
              </div>
            ) : (
              <Message className="items-start">
                <MessageAvatar aria-hidden>
                  <Sparkles className="size-5 text-violet-500/90" strokeWidth={2} aria-hidden />
                </MessageAvatar>
                <MessageContent>
                  <div className="space-y-5 pt-[max(0px,calc((3rem-1lh)/2))] text-[16px] leading-[1.45] text-stone-800 sm:leading-[1.5]">
                    <p className="whitespace-pre-wrap text-pretty">{m.content}</p>
                    <ChatAssistantSources sources={m.sources} />
                    <ChatProductResults
                      products={m.products}
                      profile={profile}
                      followUpSuggestions={chatFollowUps}
                      onFollowUp={setDraft}
                      followUpDisabled={replying}
                      showFollowUpSection={followUpChipsActive}
                    />
                  </div>
                </MessageContent>
              </Message>
            )}
          </div>
        );
      })}
      {replying ? (
        <div
          className={cn(
            "flex w-full flex-col gap-1",
            !isPdp && "mb-96 sm:mb-[33rem] lg:mb-[42rem]",
          )}
        >
          <ReasoningLoading />
        </div>
      ) : null}
    </>
  );

  const contentBottomPad = isPdp
    ? "pb-5 sm:pb-6"
    : "pb-[calc(6.25rem+0.5rem+env(safe-area-inset-bottom,0px))]";

  if (isPdp) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="relative z-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden bg-transparent">
          <ChatContainerRoot
            key={threadKey}
            data-storefront-ai-scroll=""
            className="h-full min-h-[min(28dvh,200px)]"
            stickInitial={false}
          >
            <ChatContainerContent className={cn("mx-auto w-full max-w-[1024px] gap-8 pt-10 sm:pt-12", contentBottomPad)}>
              {chatThread}
              <ChatContainerScrollAnchor />
            </ChatContainerContent>
          </ChatContainerRoot>
        </div>
        {composerHostEl
          ? createPortal(
              <div className="w-full max-w-xl rounded-[1.25rem] bg-white/95 p-0.5 shadow-[0_8px_32px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.06] backdrop-blur-sm">
                <div className="pointer-events-auto w-full px-0">{composerInner}</div>
              </div>,
              composerHostEl,
            )
          : null}
      </div>
    );
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="absolute inset-0 z-0 flex min-h-0 min-w-0 flex-col overflow-x-hidden bg-[#121212]">
        <ChatContainerRoot
          key={threadKey}
          data-storefront-ai-scroll=""
          className="h-full min-h-0 w-full flex-1"
          stickInitial={false}
          targetScrollTop={plpChatTargetScrollTop}
        >
          <ChatContainerContent className="flex min-h-full w-full min-w-0 flex-col pb-0">
            {/*
              Shell-colored panel + white thread column: footer's rounded-b used to AA against white,
              leaving thin white fringes at the device corners. Footer sits in a clipped #121212 block
              matching the storefront inner radius (AppShell).
            */}
            <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col bg-white pt-10 sm:pt-12">
              <div
                className={cn(
                  "mx-auto flex min-h-0 w-full max-w-[1024px] flex-1 flex-col px-4 sm:px-6",
                  "mb-60 sm:mb-[21rem] lg:mb-[27rem]",
                  contentBottomPad,
                )}
              >
                <div className="flex min-h-0 w-full flex-1 flex-col gap-8">{chatThread}</div>
              </div>
              <div
                className="h-px w-full shrink-0 scroll-mt-4"
                aria-hidden
                data-storefront-chat-scroll-cap=""
              />
              <ChatContainerScrollAnchor />
            </div>
            <div className="shrink-0 overflow-hidden rounded-b-[calc(1.75rem-2px)] bg-[#121212]">
              <HomeFooterBleed className="mt-16 sm:mt-20" bleed={false} dockClearance={false} />
            </div>
          </ChatContainerContent>
        </ChatContainerRoot>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 z-40 flex justify-center",
          ui.floatingSearchBarRowPad,
          "bottom-2",
        )}
      >
        <div className="pointer-events-auto w-full max-w-xl px-0">{composerInner}</div>
      </div>
    </div>
  );
}
