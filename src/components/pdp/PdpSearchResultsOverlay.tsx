"use client";

import { StorefrontCartOverlay } from "@/components/cart/StorefrontCartOverlay";
import { BestMatchCard } from "@/components/search/BestMatchCard";
import { ComparisonStrip } from "@/components/search/ComparisonStrip";
import { IntentSummary } from "@/components/search/IntentSummary";
import { LearningWidget } from "@/components/search/LearningWidget";
import { ResultsGrid } from "@/components/search/ResultsGrid";
import { SearchPlpCoreSkeleton } from "@/components/search/SearchPlpCoreSkeleton";
import { StorefrontOverlayPortal } from "@/components/shared/StorefrontOverlayPortal";
import { products } from "@/data/products";
import { fetchPlpLlmAdaptation } from "@/lib/fetchPlpLlmAdaptation";
import { localizeProducts } from "@/lib/product-i18n";
import { applyLlmProductRankOrder, mergeSearchIntentWithLlmPatch } from "@/lib/plpLlmAdaptation";
import { parseIntent } from "@/lib/parseIntent";
import { scrollSearchSubmitSurfacesToTop } from "@/lib/scrollStorefrontMain";
import { getComparisonCards, getBestMatch, getLearningWidgetVariant } from "@/lib/recommendations";
import { getSearchResults } from "@/lib/search";
import { getQuickSearchQueries } from "@/lib/searchCopy";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { Package, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

function PdpSearchOverlayBody({
  titleId,
  onClose,
}: {
  titleId: string;
  onClose: () => void;
}) {
  const t = useT();
  const pathname = usePathname();
  const open = useDemoStore((s) => s.pdpSearchOverlayOpen);
  const currentQuery = useDemoStore((s) => s.currentQuery);
  const parsedIntent = useDemoStore((s) => s.parsedIntent);
  const setQuery = useDemoStore((s) => s.setQuery);
  const runSearch = useDemoStore((s) => s.runSearch);
  const profile = useDemoStore((s) => s.activeProfile);
  const aiMode = useDemoStore((s) => s.aiMode);
  const plpLlmRankIds = useDemoStore((s) => s.plpLlmRankIds);
  const plpLlmIntentPatch = useDemoStore((s) => s.plpLlmIntentPatch);
  const plpLlmCollectionTitle = useDemoStore((s) => s.plpLlmCollectionTitle);
  const setPlpLlmAdaptation = useDemoStore((s) => s.setPlpLlmAdaptation);

  const plpAnchorQuery = useMemo(
    () => currentQuery.trim() || parsedIntent?.rawQuery?.trim() || "",
    [currentQuery, parsedIntent],
  );

  const [plpAdaptPending, setPlpAdaptPending] = useState(false);
  const plpAdaptUnmountRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const onPdp = pathname.startsWith("/product/");

  useEffect(() => {
    plpAdaptUnmountRef.current = false;
    return () => {
      plpAdaptUnmountRef.current = true;
    };
  }, []);

  useLayoutEffect(() => {
    if (!open || !onPdp) {
      setPlpAdaptPending(false);
      return;
    }
    const q = plpAnchorQuery;
    if (!q) {
      setPlpAdaptPending(false);
      return;
    }
    setPlpAdaptPending(true);
  }, [open, onPdp, plpAnchorQuery, profile]);

  useEffect(() => {
    if (!open || !onPdp) return;
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
  }, [plpAnchorQuery, profile, open, onPdp, setPlpLlmAdaptation]);

  useLayoutEffect(() => {
    if (!open) return;
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [open]);

  useEffect(() => {
    if (!open || plpAdaptPending) return;
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    const ids = [0, 50, 100, 200, 400].map((ms) =>
      window.setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
      }, ms),
    );
    return () => ids.forEach(clearTimeout);
  }, [open, plpAdaptPending]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const intentBase = parsedIntent ?? parseIntent(currentQuery || "");
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
      runSearch(trimmed, { stayOnPdp: true });
      setQuery("");
      scrollSearchSubmitSurfacesToTop();
    },
    [runSearch, setQuery],
  );

  const serpAwaitingPlpAdapt = plpAdaptPending && plpAnchorQuery.length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 p-5 pb-3">
        <h2 id={titleId} className="min-w-0 flex-1 text-2xl font-semibold tracking-tight text-stone-900">
          {t("pdp.searchResultsOverlayTitle")}
        </h2>
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          className={cn(
            "inline-flex h-11 w-11 min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-900",
            ui.home.focusRing,
            "focus-visible:rounded-full",
          )}
          aria-label={t("pdp.chatCloseAria")}
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>
      <div
        ref={scrollRef}
        className="mx-auto flex w-full max-w-[1024px] min-h-0 flex-1 flex-col overflow-y-auto scrollbar-none px-4 pb-6 sm:px-6"
      >
        <div className="mx-auto flex w-full max-w-[1024px] flex-1 flex-col space-y-8 pb-4">
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

              <section aria-labelledby="pdp-search-refine-heading" className="min-w-0">
                <h2 id="pdp-search-refine-heading" className={cn(ui.searchSerpSectionKicker, "mb-2")}>
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

          <section aria-labelledby="pdp-search-trending-heading" className="border-t border-stone-200/80 pt-8">
            <h2 id="pdp-search-trending-heading" className={cn(ui.searchSerpSectionKicker, "mb-2")}>
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
      </div>
    </div>
  );
}

export function PdpSearchResultsOverlay() {
  const pathname = usePathname();
  const open = useDemoStore((s) => s.pdpSearchOverlayOpen);
  const close = useDemoStore((s) => s.closePdpSearchOverlay);
  const t = useT();
  const titleId = useId();

  if (!pathname.startsWith("/product/")) return null;

  return (
    <StorefrontOverlayPortal>
      <StorefrontCartOverlay
        open={open}
        modalKey="pdp-search"
        onDismiss={close}
        backdropLabel={t("pdp.chatCloseAria")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <PdpSearchOverlayBody titleId={titleId} onClose={close} />
      </StorefrontCartOverlay>
    </StorefrontOverlayPortal>
  );
}
