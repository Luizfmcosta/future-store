"use client";

import { HomeFooterBleed } from "@/components/home/HomeFooter";
import { BestMatchCard } from "@/components/search/BestMatchCard";
import { SearchPlpCoreSkeleton } from "@/components/search/SearchPlpCoreSkeleton";
import { ComparisonStrip } from "@/components/search/ComparisonStrip";
import { IntentSummary } from "@/components/search/IntentSummary";
import { LearningWidget } from "@/components/search/LearningWidget";
import { ResultsGrid } from "@/components/search/ResultsGrid";
import { SearchAiPanel } from "@/components/search/SearchAiPanel";
import { getSearchViewParam } from "@/components/search/SearchViewTabs";
import { products } from "@/data/products";
import { getSearchResultsPath } from "@/lib/getSearchResultsPath";
import { parseIntent } from "@/lib/parseIntent";
import { localizeProducts } from "@/lib/product-i18n";
import { getComparisonCards, getBestMatch, getLearningWidgetVariant } from "@/lib/recommendations";
import { fetchPlpLlmAdaptation } from "@/lib/fetchPlpLlmAdaptation";
import { applyLlmProductRankOrder, mergeSearchIntentWithLlmPatch } from "@/lib/plpLlmAdaptation";
import { DEFAULT_SEARCH_QUERY } from "@/lib/defaultSearchQuery";
import { scrollSearchSubmitSurfacesToTop, scrollStorefrontMainToTop } from "@/lib/scrollStorefrontMain";
import { getSearchResults } from "@/lib/search";
import { getQuickSearchQueries } from "@/lib/searchCopy";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/useT";
import { useDemoStore } from "@/store/demoStore";
import { Package } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

export function SearchPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = getSearchViewParam(searchParams);
  const mParam = searchParams.get("m");
  const t = useT();

  const currentQuery = useDemoStore((s) => s.currentQuery);
  const parsedIntent = useDemoStore((s) => s.parsedIntent);
  const setParsedIntent = useDemoStore((s) => s.setParsedIntent);
  const setQuery = useDemoStore((s) => s.setQuery);
  const runSearch = useDemoStore((s) => s.runSearch);
  const profile = useDemoStore((s) => s.activeProfile);
  const aiMode = useDemoStore((s) => s.aiMode);
  const setPromptSubmitContext = useDemoStore((s) => s.setPromptSubmitContext);
  const plpLlmRankIds = useDemoStore((s) => s.plpLlmRankIds);
  const plpLlmIntentPatch = useDemoStore((s) => s.plpLlmIntentPatch);
  const plpLlmCollectionTitle = useDemoStore((s) => s.plpLlmCollectionTitle);
  const setPlpLlmAdaptation = useDemoStore((s) => s.setPlpLlmAdaptation);

  /** After clearing the floating composer on the Results tab, PLP still keys off `parsedIntent.rawQuery`. */
  const plpAnchorQuery = useMemo(
    () => currentQuery.trim() || parsedIntent?.rawQuery?.trim() || "",
    [currentQuery, parsedIntent],
  );

  /** True until `/api/plp-adapt` finishes for the current query+profile — avoids query headline then LLM swap + rank jump. */
  const [plpAdaptPending, setPlpAdaptPending] = useState(false);
  const plpAdaptUnmountRef = useRef(false);
  useEffect(() => {
    plpAdaptUnmountRef.current = false;
    return () => {
      plpAdaptUnmountRef.current = true;
    };
  }, []);

  /**
   * PLP chat seeds `/api/chat` with `pageContext`. That is set on floating-composer submit, but not when
   * the shopper switches to the AI tab or lands on `?view=ai` / `?m=` — then context stayed null and some
   * setups still worked, but we always attach PLP context here so Gemini gets listing + query string.
   */
  useEffect(() => {
    if (pathname !== "/search" || view !== "ai") return;
    if (useDemoStore.getState().lastPromptSubmitContext !== null) return;
    setPromptSubmitContext({
      kind: "plp",
      pathname,
      searchParamsSnapshot: searchParams.toString(),
    });
  }, [pathname, view, searchParams, setPromptSubmitContext]);

  /** Bootstrap `parsedIntent` without writing the demo default into `currentQuery` (floating composer). */
  useEffect(() => {
    if (!parsedIntent) {
      const q = currentQuery.trim() || DEFAULT_SEARCH_QUERY;
      setParsedIntent(parseIntent(q));
    }
  }, [parsedIntent, currentQuery, setParsedIntent]);

  /** Empty the shared floating prompt on the Results SERP; Chat (`?view=ai`) keeps `currentQuery` for seeding. */
  useEffect(() => {
    if (pathname !== "/search" || view !== "results") return;
    setQuery("");
  }, [pathname, view, setQuery]);

  useEffect(() => {
    const m = mParam?.trim();
    if (!m) return;
    runSearch(m);
    router.replace("/search?view=ai", { scroll: false });
  }, [mParam, runSearch, router]);

  useLayoutEffect(() => {
    if (pathname !== "/search") {
      setPlpAdaptPending(false);
      return;
    }
    const q = plpAnchorQuery;
    if (!q) {
      setPlpAdaptPending(false);
      return;
    }
    setPlpAdaptPending(true);
  }, [pathname, plpAnchorQuery, profile]);

  useEffect(() => {
    if (pathname !== "/search") return;
    const q = plpAnchorQuery;
    if (!q) return;
    const ac = new AbortController();
    void (async () => {
      try {
        const res = await fetchPlpLlmAdaptation({ query: q, profile, signal: ac.signal });
        const st = useDemoStore.getState();
        const still =
          (st.currentQuery.trim() || st.parsedIntent?.rawQuery?.trim() || "") === q;
        if (!still) return;
        if (!res.skipped) {
          setPlpLlmAdaptation(res.rankedProductIds, res.intentPatch, res.collectionTitle);
        }
      } catch {
        /* aborted or network */
      } finally {
        if (plpAdaptUnmountRef.current) return;
        const st = useDemoStore.getState();
        const still =
          (st.currentQuery.trim() || st.parsedIntent?.rawQuery?.trim() || "") === q;
        if (still) {
          setPlpAdaptPending(false);
        }
      }
    })();
    return () => ac.abort();
  }, [plpAnchorQuery, profile, pathname, setPlpLlmAdaptation]);

  /** SERP: `main` scrolls; reset on every entry to Results (same URL as before still re-lays out). */
  useLayoutEffect(() => {
    if (pathname !== "/search" || view !== "results") return;
    scrollStorefrontMainToTop();
  }, [pathname, view]);

  /** PLP skeleton → real grid changes height after our first scroll; pin top again when loading finishes. */
  useEffect(() => {
    if (pathname !== "/search" || view !== "results") return;
    if (plpAdaptPending) return;
    scrollStorefrontMainToTop();
    const ids = [0, 50, 100, 200, 400].map((ms) => window.setTimeout(() => scrollStorefrontMainToTop(), ms));
    return () => ids.forEach(clearTimeout);
  }, [pathname, view, plpAdaptPending]);

  useLayoutEffect(() => {
    if (pathname !== "/search" || view !== "ai") return;
    scrollSearchSubmitSurfacesToTop();
  }, [pathname, view, mParam]);

  const intentBase = parsedIntent ?? parseIntent(currentQuery || DEFAULT_SEARCH_QUERY);
  const intent = useMemo(
    () => mergeSearchIntentWithLlmPatch(intentBase, plpLlmIntentPatch),
    [intentBase, plpLlmIntentPatch],
  );
  const results = getSearchResults(profile, intent);
  const displayResults = useMemo(
    () => applyLlmProductRankOrder(results, plpLlmRankIds, intent),
    [results, plpLlmRankIds, intent],
  );
  const best = getBestMatch(profile, displayResults, intent);
  const compare = getComparisonCards(profile, displayResults);
  const learningVariant = getLearningWidgetVariant(intent);

  const quickSearches = useMemo(() => getQuickSearchQueries(), []);
  const trendingProducts = useMemo(() => localizeProducts(products.slice(0, 4)), []);

  const applyDiscoveryQuery = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      runSearch(trimmed);
      router.push(getSearchResultsPath(pathname, searchParams));
      setQuery("");
      scrollSearchSubmitSurfacesToTop();
    },
    [pathname, router, runSearch, searchParams, setQuery],
  );

  const serpAwaitingPlpAdapt =
    view === "results" && plpAdaptPending && plpAnchorQuery.length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div
        id="search-panel-regular"
        role="tabpanel"
        aria-labelledby="tab-regular-search"
        hidden={view !== "results"}
        className="flex min-h-0 flex-1 flex-col px-4 pb-0 sm:px-6"
      >
        <div className="mx-auto flex w-full max-w-[1024px] flex-1 flex-col space-y-8">
          {serpAwaitingPlpAdapt ? (
            <div role="status" aria-busy="true" aria-label={t("searchSerp.plpLoadingAria")}>
              <SearchPlpCoreSkeleton />
            </div>
          ) : (
            <>
              <IntentSummary
                intent={intent}
                profile={profile}
                aiMode={aiMode}
                resultsCount={displayResults.length}
                curatedListingTitle={plpLlmCollectionTitle}
              />

              <BestMatchCard product={best} profile={profile} aiMode={aiMode} />

              <section aria-labelledby="search-refine-heading" className="min-w-0">
                <h2 id="search-refine-heading" className={cn(ui.searchSerpSectionKicker, "mb-2")}>
                  {t("searchOverlay.refineSearch")}
                </h2>
                <div className="-mx-4 min-w-0 sm:-mx-6">
                  <ul
                    className="flex flex-nowrap gap-2.5 overflow-x-auto overscroll-x-contain px-4 pb-1 pt-0.5 scrollbar-none sm:px-6"
                    role="list"
                  >
                    {quickSearches.map((q) => (
                      <li key={q} className="shrink-0">
                        <button
                          type="button"
                          onClick={() => applyDiscoveryQuery(q)}
                          className={cn(
                            ui.searchSerpFilterPill,
                            "max-w-[min(22rem,88vw)] truncate text-left",
                            ui.home.focusRing,
                            "focus-visible:rounded-full",
                          )}
                        >
                          {q.length > 42 ? `${q.slice(0, 40)}…` : q}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <ComparisonStrip items={compare} profile={profile} />

              {aiMode ? <LearningWidget variant={learningVariant} /> : null}

              <ResultsGrid products={displayResults} profile={profile} />
            </>
          )}

          <section aria-labelledby="search-trending-heading" className="border-t border-stone-200/80 pt-8">
            <h2 id="search-trending-heading" className={cn(ui.searchSerpSectionKicker, "mb-2")}>
              {t("searchOverlay.trendingNow")}
            </h2>
            <ul className="space-y-0.5">
              {trendingProducts.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => applyDiscoveryQuery(p.title)}
                    className="flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left text-[15px] text-stone-800 transition-colors hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-stone-300"
                  >
                    <Package className="mt-0.5 size-4 shrink-0 text-stone-400" strokeWidth={2} aria-hidden />
                    <span className="line-clamp-2 leading-snug">{p.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="shrink-0">
          <HomeFooterBleed className="mt-16 sm:mt-20" />
        </div>
      </div>

      <div
        id="search-panel-ai"
        role="tabpanel"
        aria-labelledby="tab-ai-mode"
        hidden={view !== "ai"}
        className="flex min-h-0 flex-1 flex-col"
      >
        {view === "ai" ? <SearchAiPanel /> : null}
      </div>
    </div>
  );
}
