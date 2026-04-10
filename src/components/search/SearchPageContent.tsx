"use client";

import { HomeFooterBleed } from "@/components/home/HomeFooter";
import { BestMatchCard } from "@/components/search/BestMatchCard";
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
import { getSearchResults } from "@/lib/search";
import { getQuickSearchQueries } from "@/lib/searchCopy";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/useT";
import { useDemoStore } from "@/store/demoStore";
import { Package } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const DEFAULT_QUERY =
  "Wireless speaker for ~3 m living room, best value, up to R$ 5000";

function SearchPlpCoreSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex w-full min-w-0 flex-col gap-3">
        <div className="pt-12 sm:pt-14">
          <div className="h-8 w-[min(100%,22rem)] animate-pulse rounded-md bg-stone-200/80 sm:h-9" />
        </div>
        <div className="-mx-4 flex gap-2 px-4 sm:-mx-6 sm:px-6">
          <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-stone-200/80" />
          <div className="h-9 w-24 animate-pulse rounded-full bg-stone-200/70" />
          <div className="h-9 w-28 animate-pulse rounded-full bg-stone-200/70" />
          <div className="h-9 w-28 animate-pulse rounded-full bg-stone-200/70" />
        </div>
      </div>
      <div className="h-48 animate-pulse rounded-2xl bg-stone-100 sm:h-52" />
      <div>
        <div className="mb-2 h-4 w-28 animate-pulse rounded bg-stone-200/70" />
        <div className="flex gap-2.5">
          <div className="h-9 w-40 animate-pulse rounded-full bg-stone-200/70" />
          <div className="h-9 w-36 animate-pulse rounded-full bg-stone-200/70" />
          <div className="h-9 w-44 animate-pulse rounded-full bg-stone-200/70" />
        </div>
      </div>
      <div className="h-14 animate-pulse rounded-xl bg-stone-100" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-xl bg-stone-100" />
        ))}
      </div>
    </div>
  );
}

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

  useEffect(() => {
    if (!parsedIntent) {
      const q = currentQuery.trim() || DEFAULT_QUERY;
      if (!currentQuery.trim()) setQuery(q);
      setParsedIntent(parseIntent(q));
    }
  }, [parsedIntent, currentQuery, setParsedIntent, setQuery]);

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
    const q = currentQuery.trim();
    if (!q) {
      setPlpAdaptPending(false);
      return;
    }
    setPlpAdaptPending(true);
  }, [pathname, currentQuery, profile]);

  useEffect(() => {
    if (pathname !== "/search") return;
    const q = currentQuery.trim();
    if (!q) return;
    const ac = new AbortController();
    void (async () => {
      try {
        const res = await fetchPlpLlmAdaptation({ query: q, profile, signal: ac.signal });
        if (useDemoStore.getState().currentQuery.trim() !== q) return;
        if (!res.skipped) {
          setPlpLlmAdaptation(res.rankedProductIds, res.intentPatch, res.collectionTitle);
        }
      } catch {
        /* aborted or network */
      } finally {
        if (plpAdaptUnmountRef.current) return;
        if (useDemoStore.getState().currentQuery.trim() === q) {
          setPlpAdaptPending(false);
        }
      }
    })();
    return () => ac.abort();
  }, [currentQuery, profile, pathname, setPlpLlmAdaptation]);

  useLayoutEffect(() => {
    if (pathname !== "/search" || view !== "ai") return;
    const resetScroll = () => {
      const main = document.querySelector<HTMLElement>("[data-storefront-window] main");
      if (main) {
        main.scrollTop = 0;
        main.scrollLeft = 0;
      }
      const ai = document.querySelector<HTMLElement>("[data-storefront-ai-scroll]");
      if (ai) {
        ai.scrollTop = 0;
        ai.scrollLeft = 0;
      }
    };
    resetScroll();
    queueMicrotask(resetScroll);
    requestAnimationFrame(() => requestAnimationFrame(resetScroll));
  }, [pathname, view, mParam]);

  const intentBase = parsedIntent ?? parseIntent(currentQuery || DEFAULT_QUERY);
  const intent = useMemo(
    () => mergeSearchIntentWithLlmPatch(intentBase, plpLlmIntentPatch),
    [intentBase, plpLlmIntentPatch],
  );
  const results = getSearchResults(profile, intent);
  const displayResults = useMemo(
    () => applyLlmProductRankOrder(results, plpLlmRankIds),
    [results, plpLlmRankIds],
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
    },
    [pathname, router, runSearch, searchParams],
  );

  const trimmedQuery = currentQuery.trim();
  const serpAwaitingPlpAdapt =
    view === "results" && plpAdaptPending && trimmedQuery.length > 0;

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
