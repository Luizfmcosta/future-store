"use client";

import { PromptContextBadges } from "@/components/search/PromptContextBadges";
import { PromptSuggestionRow } from "@/components/search/PromptSuggestionRow";
import { PromptInput, PromptInputTextarea } from "@/components/ui/prompt-input";
import { PromptInputChatToolbar } from "@/components/search/PromptInputChatToolbar";
import { useLocale } from "@/context/LocaleContext";
import { getSearchResultsPath } from "@/lib/getSearchResultsPath";
import { getPromptSuggestionPool } from "@/lib/promptSuggestions";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useMemo } from "react";

const AI_FOLLOWUP_SELECTOR = "[data-ai-followup-input]";

export function FloatingSearchDock() {
  const t = useT();
  const { locale } = useLocale();
  const fileInputId = useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = useDemoStore((s) => s.currentQuery);
  const promptProductRefs = useDemoStore((s) => s.promptProductRefs);
  const setQuery = useDemoStore((s) => s.setQuery);
  const runSearch = useDemoStore((s) => s.runSearch);

  const hideFloatingPill = useMemo(
    () => pathname === "/search" && searchParams.get("view") === "ai",
    [pathname, searchParams],
  );

  const suggestionPool = useMemo(() => getPromptSuggestionPool(locale), [locale]);

  const isPdp = pathname.startsWith("/product/");
  /** Chips only on non-SERP routes; hide after submit / on results (same route). */
  const showPromptSuggestions = pathname !== "/search";

  const submitSearch = useCallback(() => {
    const q = currentQuery.trim();
    if (!q && !useDemoStore.getState().promptProductRefs.length) return;
    runSearch(q || undefined);
    router.push(getSearchResultsPath(pathname, searchParams));
  }, [currentQuery, pathname, router, runSearch, searchParams]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (hideFloatingPill) {
          const el = document.querySelector<HTMLElement>(AI_FOLLOWUP_SELECTOR);
          el?.focus();
          return;
        }
        document.querySelector<HTMLElement>("[data-storefront-search-field]")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hideFloatingPill]);

  return (
    <>
      {!hideFloatingPill && !isPdp ? (
        <div
          className={cn(
            "pointer-events-none absolute bottom-0 left-0 right-0 z-[60] flex justify-center px-4 sm:px-6",
            ui.floatingSearchBarRowPad,
          )}
        >
          <div className="pointer-events-auto w-full max-w-xl">
            {showPromptSuggestions ? (
              <PromptSuggestionRow
                query={currentQuery}
                pool={suggestionPool}
                onSelect={setQuery}
              />
            ) : null}
            <PromptInput
              value={currentQuery}
              onValueChange={setQuery}
              onSubmit={submitSearch}
              maxHeight={120}
              className={cn(ui.promptInputKit, "w-full max-w-xl")}
            >
              <PromptContextBadges />
              <PromptInputTextarea
                data-storefront-search-field=""
                placeholder={t("floatingSearch.placeholder")}
                className="max-h-[120px] text-stone-800 placeholder:text-stone-400"
                aria-label={t("searchOverlay.ariaSearchQuery")}
              />
              <PromptInputChatToolbar
                fileInputId={fileInputId}
                onSend={submitSearch}
                sendDisabled={!currentQuery.trim() && promptProductRefs.length === 0}
                onMicClick={() => {
                  /* demo: entrada por voz */
                }}
              />
            </PromptInput>
          </div>
        </div>
      ) : null}
    </>
  );
}
