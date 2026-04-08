"use client";

import { BestMatchCard } from "@/components/search/BestMatchCard";
import { ComparisonStrip } from "@/components/search/ComparisonStrip";
import { IntentSummary } from "@/components/search/IntentSummary";
import { LearningWidget } from "@/components/search/LearningWidget";
import { ResultsGrid } from "@/components/search/ResultsGrid";
import { SearchAiPanel } from "@/components/search/SearchAiPanel";
import { getSearchViewParam } from "@/components/search/SearchViewTabs";
import { useLocale } from "@/context/LocaleContext";
import { products } from "@/data/products";
import { getSearchResultsPath } from "@/lib/getSearchResultsPath";
import { parseIntent } from "@/lib/parseIntent";
import { localizeProducts } from "@/lib/product-i18n";
import { getComparisonCards, getBestMatch, getLearningWidgetVariant } from "@/lib/recommendations";
import { getSearchResults } from "@/lib/search";
import { getQuickSearchQueries } from "@/lib/searchCopy";
import { useT } from "@/lib/useT";
import { useDemoStore } from "@/store/demoStore";
import { Package } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

const DEFAULT_QUERY =
  "Wireless speaker for ~3 m living room, best value, up to R$ 5000";

export function SearchPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = getSearchViewParam(searchParams);
  const mParam = searchParams.get("m");
  const { locale } = useLocale();
  const t = useT();

  const currentQuery = useDemoStore((s) => s.currentQuery);
  const parsedIntent = useDemoStore((s) => s.parsedIntent);
  const setParsedIntent = useDemoStore((s) => s.setParsedIntent);
  const setQuery = useDemoStore((s) => s.setQuery);
  const runSearch = useDemoStore((s) => s.runSearch);
  const profile = useDemoStore((s) => s.activeProfile);
  const aiMode = useDemoStore((s) => s.aiMode);

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

  const intent = parsedIntent ?? parseIntent(currentQuery || DEFAULT_QUERY);
  const results = getSearchResults(profile, intent);
  const displayResults = useMemo(() => results, [results]);
  const best = getBestMatch(profile, results, intent);
  const compare = getComparisonCards(profile, results);
  const learningVariant = getLearningWidgetVariant(intent);

  const quickSearches = useMemo(() => getQuickSearchQueries(locale), [locale]);
  const trendingProducts = useMemo(() => localizeProducts(products.slice(0, 4), locale), [locale]);

  const applyDiscoveryQuery = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      runSearch(trimmed);
      router.push(getSearchResultsPath(pathname, searchParams));
    },
    [pathname, router, runSearch, searchParams],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div
        id="search-panel-regular"
        role="tabpanel"
        aria-labelledby="tab-regular-search"
        hidden={view !== "results"}
        className="space-y-8 pb-12 sm:pb-16"
      >
        <IntentSummary intent={intent} profile={profile} aiMode={aiMode} resultsCount={displayResults.length} />

        <BestMatchCard product={best} profile={profile} aiMode={aiMode} />

        <section aria-labelledby="search-refine-heading" className="min-w-0">
          <h2 id="search-refine-heading" className="mb-2 text-[11px] font-medium leading-snug tracking-tight text-stone-500">
            {t("searchOverlay.refineSearch")}
          </h2>
          <div className="-mx-4 min-w-0 sm:-mx-6">
            <ul
              className="flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain px-4 pb-1 pt-0.5 scrollbar-none sm:px-6"
              role="list"
            >
              {quickSearches.map((q) => (
                <li key={q} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => applyDiscoveryQuery(q)}
                    className="max-w-[min(20rem,85vw)] truncate rounded-full border border-stone-200/90 bg-white px-2.5 py-1 text-left text-[11px] font-medium text-stone-800 transition-colors hover:bg-stone-50"
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

        <section aria-labelledby="search-trending-heading" className="border-t border-stone-200/80 pt-8">
          <h2 id="search-trending-heading" className="mb-2 text-[11px] font-medium leading-snug tracking-tight text-stone-500">
            {t("searchOverlay.trendingNow")}
          </h2>
          <ul className="space-y-0.5">
            {trendingProducts.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => applyDiscoveryQuery(p.title)}
                  className="flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left text-[13px] text-stone-800 transition-colors hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-stone-300"
                >
                  <Package className="mt-0.5 size-4 shrink-0 text-stone-400" strokeWidth={2} aria-hidden />
                  <span className="line-clamp-2 leading-snug">{p.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
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
