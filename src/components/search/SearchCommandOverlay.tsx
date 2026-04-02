"use client";

import { PromptInput, PromptInputTextarea } from "@/components/ui/prompt-input";
import { getProductById, getSoundbars, getTvs, products } from "@/data/products";
import { getSearchViewParam } from "@/components/search/SearchViewTabs";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { useStorefrontPortal } from "@/components/shared/StorefrontPortalContext";
import { useDemoStore } from "@/store/demoStore";
import type { Product } from "@/types";
import { Package, Search, Tag, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useMemo } from "react";
import { createPortal } from "react-dom";

const CATEGORIES = [
  { key: "tv", label: "Televisions", hint: "OLED, QLED, room size" },
  { key: "soundbar", label: "Soundbars", hint: "Atmos, living room" },
  { key: "accessory", label: "Accessories", hint: "Mounts, HDMI" },
] as const;

const QUICK_SEARCHES = [
  "TV for a 3m living room, best value, up to 5000",
  "OLED under 5000",
  '75" TV bright living room',
  "Soundbar with eARC",
];

function searchPath(pathname: string, searchParams: URLSearchParams): string {
  const onSearch = pathname.startsWith("/search");
  const keepAi = onSearch && getSearchViewParam(searchParams) === "ai";
  return keepAi ? "/search?view=ai" : "/search";
}

function relatedForPdp(product: Product): Product[] {
  if (product.category === "tv") {
    return getTvs()
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

function pdpQuickChips(product: Product): string[] {
  const chips = [
    `Compare alternatives to ${product.title}`,
    product.technology
      ? `More ${product.technology} options like ${product.brand}`
      : `More from ${product.brand}`,
    `Delivery, install, and ${product.returnPolicyShort.toLowerCase()}`,
    `Soundbars and HDMI setup for ${product.title}`,
    product.bestFor[0] ? `Is this model right for ${product.bestFor[0].toLowerCase()}?` : "",
  ];
  return chips.filter(Boolean);
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

  const currentQuery = useDemoStore((s) => s.currentQuery);
  const setQuery = useDemoStore((s) => s.setQuery);
  const runSearch = useDemoStore((s) => s.runSearch);

  const pdpProduct = useMemo(() => {
    const m = pathname.match(/^\/product\/([^/]+)/);
    const id = m?.[1];
    return id ? getProductById(id) : undefined;
  }, [pathname]);

  const related = useMemo(
    () => (pdpProduct ? relatedForPdp(pdpProduct) : []),
    [pdpProduct],
  );

  const pdpChips = useMemo(
    () => (pdpProduct ? pdpQuickChips(pdpProduct) : []),
    [pdpProduct],
  );

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

  const trending = products.slice(0, 4);

  return createPortal(
    <div
      className="pointer-events-auto absolute inset-0 z-[1] flex items-start justify-center overflow-y-auto bg-[#030405]/75 px-3 py-6 pt-[max(1.5rem,env(safe-area-inset-top))] backdrop-blur-md sm:items-center sm:py-10"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close search"
        onClick={onClose}
      />

      <div
        className={cn(
          "relative z-10 flex w-full max-w-[min(100%-1.5rem,480px)] flex-col overflow-hidden rounded-2xl",
          "border border-white/[0.1] bg-[#101218] shadow-[0_24px_80px_rgba(0,0,0,0.65)]",
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="sr-only">
          {pdpProduct ? `Search — ${pdpProduct.title}` : "Search Future Store"}
        </h2>

        {pdpProduct ? (
          <p className="border-b border-white/[0.06] px-3 py-2 text-[11px] leading-snug text-[#8b96a8]">
            <span className="font-medium text-[#c8d0dc]">On this page · </span>
            {pdpProduct.title}
          </p>
        ) : null}

        <div className="flex items-center gap-2 border-b border-white/[0.08] px-3 py-2.5">
          <Search className="size-[18px] shrink-0 text-[#8b96a8]" strokeWidth={2} aria-hidden />
          <div className="min-w-0 flex-1">
            <PromptInput
              value={currentQuery}
              onValueChange={setQuery}
              onSubmit={submitAndGo}
              maxHeight={120}
              className="border-0 bg-transparent p-0 shadow-none"
            >
              <PromptInputTextarea
                autoFocus
                placeholder={
                  pdpProduct
                    ? `Ask about ${pdpProduct.brand}…`
                    : "Search Future Store…"
                }
                className="min-h-[40px] w-full resize-none border-0 bg-transparent py-1.5 text-[15px] text-[#eef1f6] placeholder:text-[#7d8898] focus-visible:ring-0"
                aria-label="Search query"
              />
            </PromptInput>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg text-[#9ca8b8] transition-colors hover:bg-white/[0.08] hover:text-[#eef1f6]",
              ui.focusRing,
              "focus-visible:rounded-lg",
            )}
            aria-label="Close"
          >
            <X className="size-[18px]" strokeWidth={2} />
          </button>
        </div>

        <div className="max-h-[min(55dvh,420px)] overflow-y-auto overscroll-contain px-2 py-3">
          {pdpProduct ? (
            <>
              <p className={cn(ui.eyebrow, "mb-2 px-2")}>Similar picks</p>
              <ul className="space-y-0.5">
                {related.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => applyQuery(p.title)}
                      className="flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left text-[13px] text-[#e8ecf4] transition-colors hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/20"
                    >
                      <Package className="mt-0.5 size-4 shrink-0 text-[#8b96a8]" strokeWidth={2} />
                      <span className="line-clamp-2 leading-snug">{p.title}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <p className={cn(ui.eyebrow, "mb-2 mt-4 px-2")}>Suggested questions</p>
              <ul className="flex flex-wrap gap-1.5 px-2">
                {pdpChips.map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      onClick={() => applyQuery(q)}
                      className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-left text-[11px] font-medium leading-snug text-[#c8d0dc] transition-colors hover:bg-white/[0.08]"
                    >
                      {q.length > 52 ? `${q.slice(0, 50)}…` : q}
                    </button>
                  </li>
                ))}
              </ul>

              <p className={cn(ui.eyebrow, "mb-2 mt-4 px-2")}>Warranty & policy</p>
              <button
                type="button"
                onClick={() =>
                  applyQuery(
                    `${pdpProduct.title} — ${pdpProduct.warrantyShort}. Returns: ${pdpProduct.returnPolicyShort}`,
                  )
                }
                className="mx-2 flex w-[calc(100%-1rem)] items-start gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-2 text-left text-[12px] text-[#aeb6ca] transition-colors hover:bg-white/[0.06]"
              >
                <span className="line-clamp-3">{pdpProduct.warrantyShort}</span>
              </button>
            </>
          ) : (
            <>
              <p className={cn(ui.eyebrow, "mb-2 px-2")}>Trending now</p>
              <ul className="space-y-0.5">
                {trending.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => applyQuery(p.title)}
                      className="flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left text-[13px] text-[#e8ecf4] transition-colors hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/20"
                    >
                      <Package className="mt-0.5 size-4 shrink-0 text-[#8b96a8]" strokeWidth={2} />
                      <span className="line-clamp-2 leading-snug">{p.title}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <p className={cn(ui.eyebrow, "mb-2 mt-4 px-2")}>Categories</p>
              <ul className="space-y-0.5">
                {CATEGORIES.map((c) => (
                  <li key={c.key}>
                    <button
                      type="button"
                      onClick={() => applyQuery(`Browse ${c.label} — ${c.hint}`)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/20"
                    >
                      <Tag className="size-4 shrink-0 text-[#8b96a8]" strokeWidth={2} />
                      <span>
                        <span className="block text-[13px] font-medium text-[#e8ecf4]">{c.label}</span>
                        <span className="block text-[11px] text-[#7d8898]">{c.hint}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <p className={cn(ui.eyebrow, "mb-2 mt-4 px-2")}>Quick searches</p>
              <ul className="flex flex-wrap gap-1.5 px-2">
                {QUICK_SEARCHES.map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      onClick={() => applyQuery(q)}
                      className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-[#c8d0dc] transition-colors hover:bg-white/[0.08]"
                    >
                      {q.length > 42 ? `${q.slice(0, 40)}…` : q}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-white/[0.08] px-3 py-2.5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={submitAndGo}
              className={cn(
                "min-h-[36px] rounded-full bg-[#eef1f6] px-5 text-[12px] font-semibold text-[#0a0c0e] transition-colors hover:bg-white",
                ui.focusRing,
                "focus-visible:rounded-full",
              )}
            >
              Search
            </button>
          </div>
          <p className="text-center text-[10px] text-[#5c6674]">
            <kbd className="rounded border border-white/[0.1] bg-white/[0.05] px-1 py-0.5 font-mono text-[10px]">⌘</kbd>
            <kbd className="ml-0.5 rounded border border-white/[0.1] bg-white/[0.05] px-1 py-0.5 font-mono text-[10px]">K</kbd>
            <span className="ml-1">to open · Enter to search</span>
          </p>
        </div>
      </div>
    </div>,
    storefrontPortal,
  );
}
