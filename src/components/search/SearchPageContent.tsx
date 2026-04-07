"use client";

import { BestMatchCard } from "@/components/search/BestMatchCard";
import { ComparisonStrip } from "@/components/search/ComparisonStrip";
import { IntentSummary } from "@/components/search/IntentSummary";
import { LearningWidget } from "@/components/search/LearningWidget";
import { ResultsGrid } from "@/components/search/ResultsGrid";
import { SearchAiPanel } from "@/components/search/SearchAiPanel";
import { SearchModeTabs } from "@/components/search/SearchModeTabs";
import { getSearchViewParam } from "@/components/search/SearchViewTabs";
import { parseIntent } from "@/lib/parseIntent";
import { getComparisonCards, getBestMatch, getLearningWidget } from "@/lib/recommendations";
import { getSearchResults } from "@/lib/search";
import { useDemoStore } from "@/store/demoStore";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

const DEFAULT_QUERY = "TV for a 3m living room, best value, up to 5000";

export function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = getSearchViewParam(searchParams);
  const mParam = searchParams.get("m");

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
  const learn = getLearningWidget(intent);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <SearchModeTabs active={view} />
      </motion.div>

      <div
        id="search-panel-regular"
        role="tabpanel"
        aria-labelledby="tab-regular-search"
        hidden={view !== "results"}
        className="space-y-8"
      >
        <IntentSummary intent={intent} profile={profile} aiMode={aiMode} />

        <BestMatchCard product={best} profile={profile} aiMode={aiMode} />

        <ComparisonStrip items={compare} profile={profile} />

        {aiMode ? <LearningWidget title={learn.title} body={learn.body} tag={learn.tag} /> : null}

        <ResultsGrid products={displayResults} profile={profile} />
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
