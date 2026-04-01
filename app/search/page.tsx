"use client";

import { BestMatchCard } from "@/components/search/BestMatchCard";
import { ComparisonStrip } from "@/components/search/ComparisonStrip";
import { IntentSummary } from "@/components/search/IntentSummary";
import { LearningWidget } from "@/components/search/LearningWidget";
import { ResultsGrid } from "@/components/search/ResultsGrid";
import { SmartChips } from "@/components/search/SmartChips";
import { parseIntent } from "@/lib/parseIntent";
import { getComparisonCards, getBestMatch, getLearningWidget } from "@/lib/recommendations";
import { getSearchResults } from "@/lib/search";
import { useDemoStore } from "@/store/demoStore";
import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";

const DEFAULT_QUERY = "TV for a 3m living room, best value, up to 5000";

export default function SearchPage() {
  const currentQuery = useDemoStore((s) => s.currentQuery);
  const parsedIntent = useDemoStore((s) => s.parsedIntent);
  const setParsedIntent = useDemoStore((s) => s.setParsedIntent);
  const setQuery = useDemoStore((s) => s.setQuery);
  const profile = useDemoStore((s) => s.activeProfile);
  const aiMode = useDemoStore((s) => s.aiMode);
  const setRefineOpen = useDemoStore((s) => s.setRefineOpen);

  useEffect(() => {
    if (!parsedIntent) {
      const q = currentQuery.trim() || DEFAULT_QUERY;
      if (!currentQuery.trim()) setQuery(q);
      setParsedIntent(parseIntent(q));
    }
  }, [parsedIntent, currentQuery, setParsedIntent, setQuery]);

  const intent = parsedIntent ?? parseIntent(currentQuery || DEFAULT_QUERY);
  const results = getSearchResults(profile, intent);
  const displayResults = useMemo(() => {
    if (aiMode) return results;
    return [...results].sort((a, b) => a.title.localeCompare(b.title));
  }, [aiMode, results]);
  const best = getBestMatch(profile, results, intent);
  const compare = getComparisonCards(profile, results);
  const learn = getLearningWidget(intent);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-[clamp(1.25rem,4vw,1.5rem)] font-semibold leading-tight tracking-tight text-[#eef1f6]">
              Search
            </h1>
            <p className="mt-1 text-[13px] leading-relaxed text-[#9ca8b8] sm:text-[14px]">
              Intent-driven results, not just a grid.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRefineOpen(true)}
            className="inline-flex min-h-[36px] shrink-0 items-center justify-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold leading-tight tracking-tight text-[#e8ecf4] transition-colors duration-150 ease-out hover:border-white/[0.09] hover:bg-white/[0.1] active:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/20"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#b8c4d0]" strokeWidth={2.25} />
            Refine
          </button>
        </div>
      </motion.div>

      <IntentSummary intent={intent} profile={profile} aiMode={aiMode} />

      {aiMode ? (
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8b96a8]">Smart chips</p>
          <SmartChips intent={intent} />
        </div>
      ) : null}

      {aiMode ? <BestMatchCard product={best} profile={profile} aiMode={aiMode} /> : null}

      {aiMode ? <ComparisonStrip items={compare} profile={profile} /> : null}

      {aiMode ? <LearningWidget title={learn.title} body={learn.body} tag={learn.tag} /> : null}

      <ResultsGrid products={displayResults} profile={profile} />
    </div>
  );
}
