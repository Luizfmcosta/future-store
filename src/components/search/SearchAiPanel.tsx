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
import { DEFAULT_SEARCH_QUERY } from "@/lib/defaultSearchQuery";
import { assistantReplyForQuery, type AssistantSource } from "@/lib/chatAssistant";
import { fetchAssistantLlmReply, type ChatTurn } from "@/lib/fetchAssistantLlm";
import { getChatFollowUpSuggestions, getPromptSuggestionPool } from "@/lib/promptSuggestions";
import { ui } from "@/lib/ui-tokens";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import { getProductById } from "@/data/products";
import { mergePromptRefsIntoQuery } from "@/lib/promptProductRefs";
import { useDemoStore } from "@/store/demoStore";
import type { Product, PromptSubmitPageContext } from "@/types";
import { Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { useStickToBottomContext, type GetTargetScrollTop } from "use-stick-to-bottom";
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

/** Marks end of chat for search AI: stick-to-bottom caps scroll here. */
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
}: {
  variant?: "default" | "pdp";
} = {}) {
  const t = useT();
  const promptFileInputId = useId();
  const profile = useDemoStore((s) => s.activeProfile);
  const currentQuery = useDemoStore((s) => s.currentQuery);
  const parsedIntent = useDemoStore((s) => s.parsedIntent);
  const promptProductRefs = useDemoStore((s) => s.promptProductRefs);
  const clearPromptProductRefs = useDemoStore((s) => s.clearPromptProductRefs);
  const addPromptProductRef = useDemoStore((s) => s.addPromptProductRef);
  const pathname = usePathname();

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

  /**
   * Chat tab clears `currentQuery` on Results; PLP intent still holds the active query (`rawQuery`).
   * PDP: after submit, `runSearch` sets `currentQuery` to the merged prompt (About + ask).
   */
  const plpSeedQuery = useMemo(() => {
    const fromComposer = currentQuery.trim();
    const fromResults = parsedIntent?.rawQuery?.trim() ?? "";
    return fromComposer || fromResults || DEFAULT_SEARCH_QUERY;
  }, [currentQuery, parsedIntent]);

  const pdpAnchorProductId = useMemo(() => {
    if (variant !== "pdp" || !pathname?.startsWith("/product/")) return undefined;
    return pathname.slice("/product/".length).split("/")[0] || undefined;
  }, [variant, pathname]);

  const pdpAnchorProduct = useMemo(() => {
    if (!pdpAnchorProductId) return undefined;
    return getProductById(pdpAnchorProductId) ?? undefined;
  }, [pdpAnchorProductId]);

  const comparisonReplyOpts = useMemo(
    () => (pdpAnchorProductId ? { comparisonAnchorProductId: pdpAnchorProductId } : undefined),
    [pdpAnchorProductId],
  );

  const threadKey = `${variant}|${plpSeedQuery}|${profile}`;

  const bumpScroll = useCallback(() => {
    setScrollBump((n) => n + 1);
  }, []);

  useEffect(() => {
    seedAbortRef.current?.abort();
    const ac = new AbortController();
    seedAbortRef.current = ac;

    const run = async () => {
      const q = plpSeedQuery;
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

      const fallback = assistantReplyForQuery(q, profile, true, comparisonReplyOpts);
      let assistantText = fallback.text;
      try {
        const { reply } = await fetchAssistantLlmReply({
          message: q,
          profile,
          pageContext: ctxSnapshot,
          history: [],
          signal: ac.signal,
          responseStyle: variant === "pdp" ? "pdpComparison" : undefined,
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
  }, [comparisonReplyOpts, plpSeedQuery, profile, variant]);

  useEffect(() => {
    return () => {
      followUpAbortRef.current?.abort();
    };
  }, []);

  const onSend = useCallback(() => {
    const text = draft.trim();
    const refs = useDemoStore.getState().promptProductRefs;
    if ((!text && !refs.length) || replying) return;

    const merged = mergePromptRefsIntoQuery(text, refs);
    clearPromptProductRefs();
    if (variant === "pdp" && pathname?.startsWith("/product/")) {
      const pid = pathname.slice("/product/".length).split("/")[0] ?? "";
      const p = pid ? getProductById(pid) : undefined;
      if (p) addPromptProductRef({ productId: p.id, label: p.title });
    }

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
      const fallback = assistantReplyForQuery(merged, profile, true, comparisonReplyOpts);
      let assistantText = fallback.text;
      try {
        const { reply } = await fetchAssistantLlmReply({
          message: merged,
          profile,
          pageContext: threadOriginContextRef.current,
          history,
          signal: ac.signal,
          responseStyle: variant === "pdp" ? "pdpComparison" : undefined,
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
  }, [
    addPromptProductRef,
    bumpScroll,
    comparisonReplyOpts,
    clearPromptProductRefs,
    draft,
    pathname,
    profile,
    replying,
    variant,
  ]);

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
        <div className="flex min-h-[min(28dvh,200px)] w-full flex-1 flex-col items-center justify-center px-5 pb-96 sm:px-8 sm:pb-[33rem] lg:pb-[42rem]">
          <ReasoningLoading />
        </div>
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
                  <div
                    className={cn(
                      "pt-[max(0px,calc((3rem-1lh)/2))] text-stone-800",
                      variant === "pdp"
                        ? "space-y-3 text-[15px] leading-snug sm:leading-[1.45]"
                        : "space-y-5 text-[16px] leading-[1.45] sm:leading-[1.5]",
                    )}
                  >
                    <p className="whitespace-pre-wrap text-pretty">{m.content}</p>
                    {variant !== "pdp" ? <ChatAssistantSources sources={m.sources} /> : null}
                    <ChatProductResults
                      products={m.products}
                      profile={profile}
                      followUpSuggestions={chatFollowUps}
                      onFollowUp={setDraft}
                      followUpDisabled={replying}
                      showFollowUpSection={followUpChipsActive}
                      presentation={variant === "pdp" ? "pdpChat" : "default"}
                      anchorProduct={variant === "pdp" ? pdpAnchorProduct : undefined}
                    />
                  </div>
                </MessageContent>
              </Message>
            )}
          </div>
        );
      })}
      {replying ? (
        <div className="mb-96 flex w-full flex-col gap-1 sm:mb-[33rem] lg:mb-[42rem]">
          <ReasoningLoading />
        </div>
      ) : null}
    </>
  );

  const contentBottomPad =
    "pb-[calc(8.75rem+env(safe-area-inset-bottom,0px))] sm:pb-[calc(9.5rem+env(safe-area-inset-bottom,0px))]";

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
            <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col bg-white pt-10 sm:pt-12">
              <div
                className={cn(
                  "mx-auto flex min-h-0 w-full max-w-[1024px] flex-1 flex-col px-4 sm:px-6",
                  contentBottomPad,
                )}
              >
                <div
                  className={cn(
                    "flex min-h-0 w-full flex-1 flex-col",
                    variant === "pdp" ? "gap-4" : "gap-8",
                  )}
                >
                  {chatThread}
                </div>
              </div>
              <div
                className="h-px w-full shrink-0 scroll-mt-4"
                aria-hidden
                data-storefront-chat-scroll-cap=""
              />
              <ChatContainerScrollAnchor />
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
