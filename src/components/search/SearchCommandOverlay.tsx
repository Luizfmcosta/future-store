"use client";

import { PromptInput, PromptInputTextarea } from "@/components/ui/prompt-input";
import { getSearchViewParam } from "@/components/search/SearchViewTabs";
import { useStorefrontPortal } from "@/components/shared/StorefrontPortalContext";
import { useLocale } from "@/context/LocaleContext";
import { getProductById, getSoundbars, getSpeakers, products } from "@/data/products";
import { formatMessage, getMessage } from "@/lib/messages";
import { localizeProduct, localizeProducts } from "@/lib/product-i18n";
import {
  buildPdpQuickChips,
  getQuickSearchQueries,
  getSearchCategoryRows,
} from "@/lib/searchCopy";
import { ui } from "@/lib/ui-tokens";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import type { Product } from "@/types";
import { Package, Search, Tag, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useMemo } from "react";
import { createPortal } from "react-dom";

function searchPath(pathname: string, searchParams: URLSearchParams): string {
  const onSearch = pathname.startsWith("/search");
  const keepAi = onSearch && getSearchViewParam(searchParams) === "ai";
  return keepAi ? "/search?view=ai" : "/search";
}

function relatedForPdp(product: Product): Product[] {
  if (product.category === "speaker" || product.category === "tv") {
    return getSpeakers()
      .filter((p) => p.id !== product.id)
      .slice(0, 4);
  }
  if (product.category === "soundbar") {
    return getSoundbars()
      .filter((p) => p.id !== product.id)
      .slice(0, 4);
  }
  return products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
}

type SearchCommandOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export function SearchCommandOverlay({ open, onClose }: SearchCommandOverlayProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const titleId = useId();
  const storefrontPortal = useStorefrontPortal();
  const { locale } = useLocale();
  const t = useT();

  const currentQuery = useDemoStore((s) => s.currentQuery);
  const setQuery = useDemoStore((s) => s.setQuery);
  const runSearch = useDemoStore((s) => s.runSearch);

  const pdpProduct = useMemo(() => {
    const m = pathname.match(/^\/product\/([^/]+)/);
    const id = m?.[1];
    return id ? getProductById(id) : undefined;
  }, [pathname]);

  const pdpLocalized = useMemo(
    () => (pdpProduct ? localizeProduct(pdpProduct, locale) : undefined),
    [pdpProduct, locale],
  );

  const related = useMemo(
    () => (pdpProduct ? localizeProducts(relatedForPdp(pdpProduct), locale) : []),
    [pdpProduct, locale],
  );

  const pdpChips = useMemo(
    () => (pdpProduct ? buildPdpQuickChips(pdpProduct, locale) : []),
    [pdpProduct, locale],
  );

  const trending = useMemo(() => localizeProducts(products.slice(0, 4), locale), [locale]);

  const categories = useMemo(() => getSearchCategoryRows(locale), [locale]);

  const quickSearches = useMemo(() => getQuickSearchQueries(locale), [locale]);

  const submitAndGo = useCallback(() => {
    const q = currentQuery.trim();
    if (!q) return;
    runSearch(q);
    router.push(searchPath(pathname, searchParams));
    onClose();
  }, [currentQuery, onClose, pathname, runSearch, router, searchParams]);

  const applyQuery = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      runSearch(trimmed);
      router.push(searchPath(pathname, searchParams));
      onClose();
    },
    [onClose, pathname, runSearch, router, searchParams],
  );

  useEffect(() => {
    if (!open) return;
    const main = document.querySelector<HTMLElement>("[data-storefront-window] main");
    if (!main) return;
    const prev = main.style.overflow;
    main.style.overflow = "hidden";
    return () => {
      main.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !storefrontPortal) return null;

  return createPortal(
    <div
      className="pointer-events-auto absolute inset-0 z-[1] flex items-start justify-center overflow-y-auto bg-[#2a2a2a]/38 px-3 py-6 pt-[max(1.5rem,env(safe-area-inset-top))] backdrop-blur-sm sm:items-center sm:py-10"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label={t("searchOverlay.close")}
        onClick={onClose}
      />

      <div
        className={cn(
          "relative z-10 flex w-full max-w-[min(100%-1.5rem,480px)] flex-col overflow-hidden rounded-2xl",
          "border border-white/10 bg-[#2a2a2a] text-zinc-100 shadow-[0_24px_56px_-28px_rgba(0,0,0,0.45)]",
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="sr-only">
          {pdpLocalized
            ? t("searchOverlay.srSearchPdpTitle", { title: pdpLocalized.title })
            : t("searchOverlay.srSearchTitle")}
        </h2>

        {pdpLocalized ? (
          <p className="border-b border-white/10 bg-black/20 px-3 py-2 text-[11px] leading-snug text-white/70">
            <span className="font-medium text-white/90">{t("searchOverlay.onThisPage")}</span>
            {pdpLocalized.title}
          </p>
        ) : null}

        <div className="flex min-h-[44px] items-center gap-3 border-b border-white/10 bg-black/15 px-3 py-2">
          <Search className="size-[18px] shrink-0 self-center text-white/50" strokeWidth={2} aria-hidden />
          <div className="flex min-h-0 min-w-0 flex-1 items-center">
            <PromptInput
              value={currentQuery}
              onValueChange={setQuery}
              onSubmit={submitAndGo}
              maxHeight={120}
              className="flex w-full items-center border-0 bg-transparent p-0 shadow-none"
            >
              <PromptInputTextarea
                data-storefront-search-field=""
                autoFocus
                placeholder={
                  pdpProduct
                    ? formatMessage(t("searchOverlay.placeholderPdpBrand"), {
                        brand: pdpProduct.brand,
                      })
                    : t("searchOverlay.placeholderSearch")
                }
                className="!min-h-[24px] max-h-[120px] w-full resize-none border-0 bg-transparent py-1.5 text-[15px] leading-5 text-white placeholder:text-white/45 focus-visible:ring-0"
                aria-label={t("searchOverlay.ariaSearchQuery")}
              />
            </PromptInput>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "flex size-9 shrink-0 items-center justify-center self-center rounded-lg text-white/55 transition-colors hover:bg-white/10 hover:text-white",
              ui.home.focusRing,
              "focus-visible:rounded-lg",
            )}
            aria-label={t("searchOverlay.closeButton")}
          >
            <X className="size-[18px]" strokeWidth={2} />
          </button>
        </div>

        <div className="max-h-[min(55dvh,420px)] overflow-y-auto overscroll-contain px-2 py-3">
          {pdpProduct ? (
            <>
              <p className="mb-1.5 px-2 text-[11px] font-medium leading-snug tracking-tight text-white/50">
                {t("searchOverlay.similarPicks")}
              </p>
              <ul className="space-y-0.5">
                {related.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => applyQuery(p.title)}
                      className="flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left text-[13px] text-white/90 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/25"
                    >
                      <Package className="mt-0.5 size-4 shrink-0 text-white/45" strokeWidth={2} />
                      <span className="line-clamp-2 leading-snug">{p.title}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <p className="mb-1.5 mt-3 px-2 text-[11px] font-medium leading-snug tracking-tight text-white/50">
                {t("searchOverlay.suggestedQuestions")}
              </p>
              <ul className="flex flex-wrap gap-1.5 px-2">
                {pdpChips.map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      onClick={() => applyQuery(q)}
                      className="rounded-full border border-white/12 bg-white/5 px-2.5 py-1 text-left text-[11px] font-medium leading-snug text-white/90 transition-colors hover:bg-white/10"
                    >
                      {q.length > 52 ? `${q.slice(0, 50)}…` : q}
                    </button>
                  </li>
                ))}
              </ul>

              <p className="mb-1.5 mt-3 px-2 text-[11px] font-medium leading-snug tracking-tight text-white/50">
                {t("searchOverlay.warrantyPolicy")}
              </p>
              <button
                type="button"
                onClick={() =>
                  applyQuery(
                    `${pdpLocalized!.title} — ${pdpLocalized!.warrantyShort}. ${
                      locale === "pt-BR" ? "Devoluções" : "Returns"
                    }: ${pdpLocalized!.returnPolicyShort}`,
                  )
                }
                className="mx-2 flex w-[calc(100%-1rem)] items-start gap-2 rounded-lg border border-white/12 bg-white/5 px-2 py-2 text-left text-[12px] text-white/80 transition-colors hover:bg-white/10"
              >
                <span className="line-clamp-3">{pdpLocalized?.warrantyShort}</span>
              </button>
            </>
          ) : (
            <>
              <p className="mb-1.5 px-2 text-[11px] font-medium leading-snug tracking-tight text-white/50">
                {t("searchOverlay.trendingNow")}
              </p>
              <ul className="space-y-0.5">
                {trending.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => applyQuery(p.title)}
                      className="flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left text-[13px] text-white/90 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/25"
                    >
                      <Package className="mt-0.5 size-4 shrink-0 text-white/45" strokeWidth={2} />
                      <span className="line-clamp-2 leading-snug">{p.title}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <p className="mb-1.5 mt-3 px-2 text-[11px] font-medium leading-snug tracking-tight text-white/50">
                {t("searchOverlay.categoriesHint")}
              </p>
              <ul className="space-y-0.5">
                {categories.map((c) => (
                  <li key={c.key}>
                    <button
                      type="button"
                      onClick={() =>
                        applyQuery(
                          formatMessage(getMessage(locale, "searchOverlay.browseCategory") ?? "", {
                            label: c.label,
                            hint: c.hint,
                          }),
                        )
                      }
                      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/25"
                    >
                      <Tag className="size-4 shrink-0 text-white/45" strokeWidth={2} />
                      <span>
                        <span className="block text-[13px] font-medium text-white">{c.label}</span>
                        <span className="block text-[11px] text-white/50">{c.hint}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <p className="mb-1.5 mt-3 px-2 text-[11px] font-medium leading-snug tracking-tight text-white/50">
                {t("searchOverlay.quickSearches")}
              </p>
              <ul className="flex flex-wrap gap-1.5 px-2">
                {quickSearches.map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      onClick={() => applyQuery(q)}
                      className="rounded-full border border-white/12 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/90 transition-colors hover:bg-white/10"
                    >
                      {q.length > 42 ? `${q.slice(0, 40)}…` : q}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 bg-black/20 px-3 py-2.5">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={submitAndGo}
              className={cn(
                "min-h-[36px] rounded-full bg-white px-6 text-[12px] font-semibold text-[#1a1a1a] transition-colors hover:bg-white/90",
                ui.home.focusRing,
                "focus-visible:rounded-full",
              )}
            >
              {t("searchOverlay.searchButton")}
            </button>
          </div>
          <p className="hidden text-center text-[10px] text-white/45 @md:block">
            <kbd className="rounded border border-white/15 bg-white/10 px-1 py-0.5 font-mono text-[10px] text-white/85">⌘</kbd>
            <kbd className="ml-0.5 rounded border border-white/15 bg-white/10 px-1 py-0.5 font-mono text-[10px] text-white/85">K</kbd>
            <span className="ml-1">{t("searchOverlay.shortcutHint")}</span>
          </p>
        </div>
      </div>
    </div>,
    storefrontPortal,
  );
}
