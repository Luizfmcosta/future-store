"use client";

import { getProductById } from "@/data/products";
import { defaultSearchQuery } from "@/lib/defaultSearchQuery";
import type { UiLocale } from "@/lib/locales/types";
import { mergePromptRefsIntoQuery, type PromptProductRef } from "@/lib/promptProductRefs";
import { parseIntent } from "@/lib/parseIntent";
import { clampStorefrontWidth, STOREFRONT_WIDTH } from "@/lib/storefrontViewport";
import type { PromptSubmitPageContext, SearchIntent, ScreenId, ShopperProfileId } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/** Older releases used 1440 as default / desktop preset; persisted values stay until rehydration merge. */
const LEGACY_DESKTOP_STOREFRONT_WIDTH = 1440;

export type ColorMode = "dark" | "light";

type DemoState = {
  activeProfile: ShopperProfileId;
  /** UI language — default pt-BR copy; English keeps legacy English strings. */
  uiLocale: UiLocale;
  /** Demo frame width on md+ (resize + presets); persisted across reloads. */
  storefrontWidth: number;
  aiMode: boolean;
  rayXMode: boolean;
  colorMode: ColorMode;
  currentQuery: string;
  /** Visual / logical refs merged into intent on submit without replacing the typed line. */
  promptProductRefs: PromptProductRef[];
  parsedIntent: SearchIntent | null;
  selectedProductId: string | null;
  cartDrawerOpen: boolean;
  presenterPanelOpen: boolean;
  refineOpen: boolean;
  compareSelection: string[];
  currentScreen: ScreenId;
  cartLineId: string | null;
  cartQuantity: number;
  /** PDP: AI chat sheet over the product page (not full-screen search). */
  pdpChatOverlayOpen: boolean;
  /** PDP: search results bottom sheet (same shell as cart). Mutually exclusive with {@link pdpChatOverlayOpen}. */
  pdpSearchOverlayOpen: boolean;

  /** Bump to re-open welcome gate from the Reset control (session key cleared in `triggerHomeWelcomeReset`). */
  homeWelcomeResetNonce: number;
  /** Bump so `TopBarProfileCluster` expands when Start / profile change requests it. */
  profileClusterExpandNonce: number;
  /**
   * Bump so `StorefrontMain` runs `scrollStorefrontHomeToTop` in `useLayoutEffect` on `/`
   * (welcome Start / exit — avoids racing the portal exit before `main` scroll applies).
   */
  homeScrollToTopNonce: number;
  /**
   * Set on floating prompt submit from PLP / PDP / cart; read by Search AI tab for LLM context.
   * Not persisted.
   */
  lastPromptSubmitContext: PromptSubmitPageContext | null;
  /** Gemini PLP adaptation for current query (ranking + intent patch). Not persisted. */
  plpLlmRankIds: string[] | null;
  plpLlmIntentPatch: Partial<SearchIntent> | null;
  /** Gemini PLP tab label when adaptation succeeded (English). */
  plpLlmCollectionTitle: string | null;
  /**
   * Mirrors `AppShell` wide-viewport scale (`1` = unscaled). Used by hero height utilities so `100dvh`
   * math matches the logical storefront. Not persisted.
   */
  shellViewportLayoutScale: number;

  setParsedIntent: (intent: SearchIntent | null) => void;
  setProfile: (id: ShopperProfileId) => void;
  /**
   * Profile pills / sidebar: switch shopper and land at that profile’s home start (scroll + route `/` from UI).
   */
  switchProfileFromSelector: (id: ShopperProfileId) => void;
  setUiLocale: (locale: UiLocale) => void;
  setStorefrontWidth: (value: number | ((prev: number) => number)) => void;
  setAiMode: (v: boolean) => void;
  setColorMode: (m: ColorMode) => void;
  setRayX: (v: boolean) => void;
  setQuery: (q: string) => void;
  addPromptProductRef: (ref: { productId?: string; label: string }) => void;
  removePromptProductRef: (key: string) => void;
  clearPromptProductRefs: () => void;
  runSearch: (q?: string, options?: { stayOnPdp?: boolean }) => void;
  openPdpChatOverlay: () => void;
  closePdpChatOverlay: () => void;
  openPdpSearchOverlay: () => void;
  closePdpSearchOverlay: () => void;
  setSelectedProduct: (id: string | null) => void;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: string, quantity?: number) => void;
  incrementCartQuantity: () => void;
  decrementCartQuantity: () => void;
  removeFromCart: () => void;
  setPresenterOpen: (v: boolean) => void;
  togglePresenter: () => void;
  setRefineOpen: (v: boolean) => void;
  setCurrentScreen: (s: ScreenId) => void;
  setCompareSelection: (ids: string[]) => void;
  reset: () => void;
  presetSearch: () => void;
  triggerHomeWelcomeReset: () => void;
  requestProfileClusterExpand: () => void;
  requestHomeScrollToTop: () => void;
  setPromptSubmitContext: (ctx: PromptSubmitPageContext | null) => void;
  setPlpLlmAdaptation: (
    rankIds: string[] | null,
    intentPatch: Partial<SearchIntent> | null,
    collectionTitle?: string | null,
  ) => void;
  setShellViewportLayoutScale: (scale: number) => void;
};

export type { PromptProductRef } from "@/lib/promptProductRefs";

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
  activeProfile: "marina",
  uiLocale: "pt",
  storefrontWidth: STOREFRONT_WIDTH.default,
  aiMode: false,
  rayXMode: false,
  colorMode: "dark",
  currentQuery: "",
  promptProductRefs: [],
  parsedIntent: null,
  selectedProductId: null,
  cartDrawerOpen: false,
  presenterPanelOpen: false,
  refineOpen: false,
  compareSelection: [],
  currentScreen: "home",
  cartLineId: null,
  cartQuantity: 1,
  pdpChatOverlayOpen: false,
  pdpSearchOverlayOpen: false,
  homeWelcomeResetNonce: 0,
  profileClusterExpandNonce: 0,
  homeScrollToTopNonce: 0,
  lastPromptSubmitContext: null,
  plpLlmRankIds: null,
  plpLlmIntentPatch: null,
  plpLlmCollectionTitle: null,
  shellViewportLayoutScale: 1,

  setParsedIntent: (intent) => set({ parsedIntent: intent }),
  setProfile: (id) => set({ activeProfile: id }),
  switchProfileFromSelector: (id) => {
    const s = get();
    if (s.activeProfile === id) return;
    set({
      activeProfile: id,
      currentScreen: "home",
      homeScrollToTopNonce: s.homeScrollToTopNonce + 1,
      cartDrawerOpen: false,
      pdpChatOverlayOpen: false,
      pdpSearchOverlayOpen: false,
    });
  },
  setUiLocale: (locale) => set({ uiLocale: locale }),
  setStorefrontWidth: (value) =>
    set((state) => {
      const next =
        typeof value === "function" ? value(state.storefrontWidth) : value;
      return { storefrontWidth: clampStorefrontWidth(next) };
    }),
  setAiMode: (v) => set({ aiMode: v }),
  setColorMode: (m) => set({ colorMode: m }),
  setRayX: (v) => set({ rayXMode: v }),
  setQuery: (q) => set({ currentQuery: q }),
  addPromptProductRef: ({ productId, label }) =>
    set((state) => {
      const key = productId ?? `label:${label}`;
      const next = state.promptProductRefs.filter((r) => r.key !== key);
      return {
        promptProductRefs: [...next, { key, productId, label: label.trim() }],
      };
    }),
  removePromptProductRef: (key) =>
    set((state) => ({
      promptProductRefs: state.promptProductRefs.filter((r) => r.key !== key),
    })),
  clearPromptProductRefs: () => set({ promptProductRefs: [] }),
  runSearch: (q, options) => {
    const text = (q ?? get().currentQuery).trim();
    const refs = get().promptProductRefs;
    if (!text && !refs.length) return;
    const merged = mergePromptRefsIntoQuery(text, refs);
    const stayOnPdp = Boolean(options?.stayOnPdp && get().selectedProductId);
    const pdpPin = stayOnPdp ? get().selectedProductId : null;
    const pdpProduct = pdpPin ? getProductById(pdpPin) : undefined;
    const nextRefs: PromptProductRef[] =
      pdpProduct ? [{ key: pdpProduct.id, productId: pdpProduct.id, label: pdpProduct.title }] : [];
    set({
      /** Mesma string que o intent e o painel Chat — senão “Ask” só com chip deixava `currentQuery` vazio e o Chat em branco. */
      currentQuery: merged,
      promptProductRefs: nextRefs,
      parsedIntent: parseIntent(merged),
      plpLlmRankIds: null,
      plpLlmIntentPatch: null,
      plpLlmCollectionTitle: null,
      currentScreen: stayOnPdp ? "pdp" : "search",
    });
  },
  openPdpChatOverlay: () => set({ pdpChatOverlayOpen: true, pdpSearchOverlayOpen: false }),
  /** Clears the floating prompt + PDP submit context so the bar is editable after the sheet closes. */
  closePdpChatOverlay: () =>
    set({
      pdpChatOverlayOpen: false,
      currentQuery: "",
      promptProductRefs: [],
      parsedIntent: null,
      lastPromptSubmitContext: null,
    }),
  openPdpSearchOverlay: () => set({ pdpSearchOverlayOpen: true, pdpChatOverlayOpen: false }),
  closePdpSearchOverlay: () => set({ pdpSearchOverlayOpen: false }),
  setSelectedProduct: (id) => set({ selectedProductId: id, currentScreen: id ? "pdp" : get().currentScreen }),
  openCart: () =>
    set((state) => ({
      cartDrawerOpen: true,
      pdpSearchOverlayOpen: false,
      pdpChatOverlayOpen: false,
      ...(state.currentScreen === "pdp"
        ? { promptProductRefs: [], parsedIntent: null }
        : {}),
    })),
  closeCart: () => set({ cartDrawerOpen: false }),
  addToCart: (productId, quantity = 1) =>
    set((state) => {
      const add = Math.min(99, Math.max(1, Math.floor(quantity)));
      const stripPdpPrompt =
        state.currentScreen === "pdp" ? { promptProductRefs: [], parsedIntent: null } : {};
      if (state.cartLineId === productId) {
        return {
          cartLineId: productId,
          cartQuantity: Math.min(99, state.cartQuantity + add),
          cartDrawerOpen: true,
          pdpSearchOverlayOpen: false,
          pdpChatOverlayOpen: false,
          selectedProductId: productId,
          ...stripPdpPrompt,
        };
      }
      return {
        cartLineId: productId,
        cartQuantity: add,
        cartDrawerOpen: true,
        pdpSearchOverlayOpen: false,
        pdpChatOverlayOpen: false,
        selectedProductId: productId,
        ...stripPdpPrompt,
      };
    }),
  incrementCartQuantity: () =>
    set((s) => (s.cartLineId ? { cartQuantity: Math.min(99, s.cartQuantity + 1) } : {})),
  decrementCartQuantity: () =>
    set((s) => {
      if (!s.cartLineId) return {};
      if (s.cartQuantity <= 1) {
        return { cartLineId: null, cartQuantity: 1 };
      }
      return { cartQuantity: s.cartQuantity - 1 };
    }),
  removeFromCart: () => set({ cartLineId: null, cartQuantity: 1 }),
  setPresenterOpen: (v) => set({ presenterPanelOpen: v }),
  togglePresenter: () => set((s) => ({ presenterPanelOpen: !s.presenterPanelOpen })),
  setRefineOpen: (v) => set({ refineOpen: v }),
  setCurrentScreen: (s) => set({ currentScreen: s }),
  setCompareSelection: (ids) => set({ compareSelection: ids }),
  reset: () =>
    set({
      activeProfile: "marina",
      uiLocale: "pt",
      storefrontWidth: STOREFRONT_WIDTH.default,
      aiMode: false,
      rayXMode: false,
      colorMode: "dark",
      currentQuery: "",
      promptProductRefs: [],
      parsedIntent: null,
      selectedProductId: null,
      cartDrawerOpen: false,
      presenterPanelOpen: false,
      refineOpen: false,
      compareSelection: [],
      currentScreen: "home",
      cartLineId: null,
      cartQuantity: 1,
      pdpChatOverlayOpen: false,
      pdpSearchOverlayOpen: false,
      lastPromptSubmitContext: null,
      plpLlmRankIds: null,
      plpLlmIntentPatch: null,
      plpLlmCollectionTitle: null,
      homeScrollToTopNonce: 0,
    }),
  presetSearch: () => {
    const query = defaultSearchQuery(get().uiLocale);
    set({
      currentQuery: query,
      parsedIntent: parseIntent(query),
      plpLlmRankIds: null,
      plpLlmIntentPatch: null,
      plpLlmCollectionTitle: null,
      currentScreen: "search",
    });
  },
  triggerHomeWelcomeReset: () => {
    try {
      sessionStorage.removeItem("fs-home-welcome-dismissed");
    } catch {
      /* private mode */
    }
    set((s) => ({ homeWelcomeResetNonce: s.homeWelcomeResetNonce + 1 }));
  },
  requestProfileClusterExpand: () =>
    set((s) => ({ profileClusterExpandNonce: s.profileClusterExpandNonce + 1 })),
  requestHomeScrollToTop: () =>
    set((s) => ({ homeScrollToTopNonce: s.homeScrollToTopNonce + 1 })),
  setPromptSubmitContext: (ctx) => set({ lastPromptSubmitContext: ctx }),
  setPlpLlmAdaptation: (rankIds, intentPatch, collectionTitle = null) =>
    set({
      plpLlmRankIds: rankIds,
      plpLlmIntentPatch: intentPatch,
      plpLlmCollectionTitle: collectionTitle?.trim() || null,
    }),
  setShellViewportLayoutScale: (scale) =>
    set({
      shellViewportLayoutScale: Number.isFinite(scale) && scale > 0 ? scale : 1,
    }),
}),
    {
      name: "future-store-demo",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        aiMode: state.aiMode,
        activeProfile: state.activeProfile,
        uiLocale: state.uiLocale,
        storefrontWidth: state.storefrontWidth,
      }),
      merge: (persistedState, currentState) => {
        const p =
          persistedState &&
          typeof persistedState === "object" &&
          !Array.isArray(persistedState)
            ? (persistedState as Partial<DemoState>)
            : {};
        const merged = { ...currentState, ...p };
        const uiLocale: UiLocale =
          merged.uiLocale === "en" || merged.uiLocale === "pt" ? merged.uiLocale : "pt";
        const w = merged.storefrontWidth;
        if (typeof w !== "number") return { ...merged, uiLocale };
        const clamped = clampStorefrontWidth(w);
        const storefrontWidth =
          clamped === LEGACY_DESKTOP_STOREFRONT_WIDTH
            ? STOREFRONT_WIDTH.default
            : clamped;
        return { ...merged, uiLocale, storefrontWidth };
      },
    },
  ),
);
