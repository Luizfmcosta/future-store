"use client";

import { PromptContextBadges } from "@/components/search/PromptContextBadges";
import { PromptSuggestionRow } from "@/components/search/PromptSuggestionRow";
import { PromptInput, PromptInputTextarea } from "@/components/ui/prompt-input";
import { PromptInputChatToolbar } from "@/components/search/PromptInputChatToolbar";
import { products } from "@/data/products";
import { getSearchResultsPath } from "@/lib/getSearchResultsPath";
import { shouldOpenAiSearchTab } from "@/lib/promptPageContext";
import { getPromptSuggestionPool } from "@/lib/promptSuggestions";
import { getSearchViewParam } from "@/components/search/SearchViewTabs";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import type { PromptSubmitPageContext } from "@/types";
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
  const cartDrawerOpen = useDemoStore((s) => s.cartDrawerOpen);
  const cartLineId = useDemoStore((s) => s.cartLineId);
  const cartQuantity = useDemoStore((s) => s.cartQuantity);
  const setQuery = useDemoStore((s) => s.setQuery);
  const runSearch = useDemoStore((s) => s.runSearch);
  const setPromptSubmitContext = useDemoStore((s) => s.setPromptSubmitContext);

  const showPromptSuggestions = pathname !== "/search";

  /** Same frosted shell as the cart control (`TopBar`) on every route, including home over `#121212`. */
  const promptKit = ui.promptInputKit;

  const suggestionPool = useMemo(() => getPromptSuggestionPool(), []);

  const submitSearch = useCallback(() => {
    const q = currentQuery.trim();
    if (!q && !useDemoStore.getState().promptProductRefs.length) return;

    const view = getSearchViewParam(searchParams);
    const openAiTab = shouldOpenAiSearchTab({ pathname, searchView: view, cartDrawerOpen });

    let pageCtx: PromptSubmitPageContext | null = null;
    if (openAiTab) {
      if (cartDrawerOpen) {
        const line = cartLineId;
        const p = line ? products.find((x) => x.id === line) : undefined;
        pageCtx = {
          kind: "cart",
          pathname,
          cartLineId: line,
          cartQuantity,
          cartProductTitle: p?.title,
        };
      } else if (pathname.startsWith("/product/")) {
        const productId = pathname.slice("/product/".length).split("/")[0] ?? "";
        const p = products.find((x) => x.id === productId);
        pageCtx = {
          kind: "pdp",
          pathname,
          productId,
          productTitle: p?.title,
        };
      } else if (pathname === "/search" && view === "results") {
        pageCtx = {
          kind: "plp",
          pathname,
          searchParamsSnapshot: searchParams.toString(),
        };
      }
    }

    setPromptSubmitContext(openAiTab ? pageCtx : null);
    runSearch(q || undefined);
    router.push(openAiTab ? "/search?view=ai" : getSearchResultsPath(pathname, searchParams));
  }, [
    cartDrawerOpen,
    cartLineId,
    cartQuantity,
    currentQuery,
    pathname,
    router,
    runSearch,
    searchParams,
    setPromptSubmitContext,
  ]);

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
        className={cn(promptKit, "w-full")}
      >
        <PromptContextBadges />
        <PromptInputTextarea
          data-storefront-search-field=""
          placeholder={t("floatingSearch.placeholder")}
          className="text-stone-800 placeholder:text-stone-600"
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
