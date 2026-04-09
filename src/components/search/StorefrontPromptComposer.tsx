"use client";

import { PromptContextBadges } from "@/components/search/PromptContextBadges";
import { PromptSuggestionRow } from "@/components/search/PromptSuggestionRow";
import { PromptInput, PromptInputTextarea } from "@/components/ui/prompt-input";
import { PromptInputChatToolbar } from "@/components/search/PromptInputChatToolbar";
import { getSearchResultsPath } from "@/lib/getSearchResultsPath";
import { getPromptSuggestionPool } from "@/lib/promptSuggestions";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useId, useMemo } from "react";

function StorefrontPromptComposerInner({
  className,
  maxHeight = 120,
}: {
  className?: string;
  maxHeight?: number;
}) {
  const t = useT();
  const fileInputId = useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = useDemoStore((s) => s.currentQuery);
  const promptProductRefs = useDemoStore((s) => s.promptProductRefs);
  const setQuery = useDemoStore((s) => s.setQuery);
  const runSearch = useDemoStore((s) => s.runSearch);

  const showPromptSuggestions = pathname !== "/search";

  const suggestionPool = useMemo(() => getPromptSuggestionPool(), []);

  const submitSearch = useCallback(() => {
    const q = currentQuery.trim();
    if (!q && !useDemoStore.getState().promptProductRefs.length) return;
    runSearch(q || undefined);
    router.push(getSearchResultsPath(pathname, searchParams));
  }, [currentQuery, pathname, router, runSearch, searchParams]);

  return (
    <div className={cn("w-full", className)}>
      {showPromptSuggestions ? (
        <PromptSuggestionRow query={currentQuery} pool={suggestionPool} onSelect={setQuery} />
      ) : null}
      <PromptInput
        value={currentQuery}
        onValueChange={setQuery}
        onSubmit={submitSearch}
        maxHeight={maxHeight}
        className={cn(ui.promptInputKit, "w-full")}
      >
        <PromptContextBadges />
        <PromptInputTextarea
          data-storefront-search-field=""
          placeholder={t("floatingSearch.placeholder")}
          className="text-stone-800 placeholder:text-stone-400"
          aria-label={t("searchOverlay.ariaSearchQuery")}
        />
        <PromptInputChatToolbar
          fileInputId={fileInputId}
          onSend={submitSearch}
          sendDisabled={!currentQuery.trim() && promptProductRefs.length === 0}
          onMicClick={() => {
            /* demo */
          }}
        />
      </PromptInput>
    </div>
  );
}

/** Shared storefront prompt (floating dock, PDP inline, etc.). Wrapped in `Suspense` for `useSearchParams`. */
export function StorefrontPromptComposer(props: { className?: string; maxHeight?: number }) {
  return (
    <Suspense fallback={null}>
      <StorefrontPromptComposerInner {...props} />
    </Suspense>
  );
}
