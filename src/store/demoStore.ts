"use client";

import { mergePromptRefsIntoQuery, type PromptProductRef } from "@/lib/promptProductRefs";
import { parseIntent } from "@/lib/parseIntent";
import { clampStorefrontWidth, STOREFRONT_WIDTH } from "@/lib/storefrontViewport";
import type { PromptSubmitPageContext, SearchIntent, ScreenId, ShopperProfileId } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const DEFAULT_QUERY =
  "Wireless speaker for ~3 m living room, best value, up to R$ 5000";

/** Older releases used 1440 as default / desktop preset; persisted values stay until rehydration merge. */
const LEGACY_DESKTOP_STOREFRONT_WIDTH = 1440;

export type ColorMode = "dark" | "light";

type DemoState = {
  activeProfile: ShopperProfileId;
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

  /** Bump to re-open welcome gate from the Reset control (session key cleared in `triggerHomeWelcomeReset`). */
  homeWelcomeResetNonce: number;
  /** Bump so `TopBarProfileCluster` expands when Start / profile change requests it. */
  profileClusterExpandNonce: number;
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

  setParsedIntent: (intent: SearchIntent | null) => void;
  setProfile: (id: ShopperProfileId) => void;
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
  setPromptSubmitContext: (ctx: PromptSubmitPageContext | null) => void;
  setPlpLlmAdaptation: (
    rankIds: string[] | null,
    intentPatch: Partial<SearchIntent> | null,
    collectionTitle?: string | null,
  ) => void;
};

export type { PromptProductRef } from "@/lib/promptProductRefs";

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
  activeProfile: "marina",
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
  homeWelcomeResetNonce: 0,
  profileClusterExpandNonce: 0,
  lastPromptSubmitContext: null,
  plpLlmRankIds: null,
  plpLlmIntentPatch: null,
  plpLlmCollectionTitle: null,

  setParsedIntent: (intent) => set({ parsedIntent: intent }),
  setProfile: (id) => set({ activeProfile: id }),
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
    set({
      /** Mesma string que o intent e o painel Chat — senão “Ask” só com chip deixava `currentQuery` vazio e o Chat em branco. */
      currentQuery: merged,
      promptProductRefs: [],
      parsedIntent: parseIntent(merged),
      plpLlmRankIds: null,
      plpLlmIntentPatch: null,
      plpLlmCollectionTitle: null,
      currentScreen: stayOnPdp ? "pdp" : "search",
    });
  },
  openPdpChatOverlay: () => set({ pdpChatOverlayOpen: true }),
  closePdpChatOverlay: () => set({ pdpChatOverlayOpen: false }),
  setSelectedProduct: (id) => set({ selectedProductId: id, currentScreen: id ? "pdp" : get().currentScreen }),
  openCart: () => set({ cartDrawerOpen: true }),
  closeCart: () => set({ cartDrawerOpen: false }),
  addToCart: (productId, quantity = 1) =>
    set((state) => {
      const add = Math.min(99, Math.max(1, Math.floor(quantity)));
      if (state.cartLineId === productId) {
        return {
          cartLineId: productId,
          cartQuantity: Math.min(99, state.cartQuantity + add),
          cartDrawerOpen: true,
          selectedProductId: productId,
        };
      }
      return {
        cartLineId: productId,
        cartQuantity: add,
        cartDrawerOpen: true,
        selectedProductId: productId,
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
      lastPromptSubmitContext: null,
      plpLlmRankIds: null,
      plpLlmIntentPatch: null,
      plpLlmCollectionTitle: null,
    }),
  presetSearch: () => {
    const query = DEFAULT_QUERY;
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
  setPromptSubmitContext: (ctx) => set({ lastPromptSubmitContext: ctx }),
  setPlpLlmAdaptation: (rankIds, intentPatch, collectionTitle = null) =>
    set({
      plpLlmRankIds: rankIds,
      plpLlmIntentPatch: intentPatch,
      plpLlmCollectionTitle: collectionTitle?.trim() || null,
    }),
}),
    {
      name: "future-store-demo",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        aiMode: state.aiMode,
        activeProfile: state.activeProfile,
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
        const w = merged.storefrontWidth;
        if (typeof w !== "number") return merged;
        const clamped = clampStorefrontWidth(w);
        const storefrontWidth =
          clamped === LEGACY_DESKTOP_STOREFRONT_WIDTH
            ? STOREFRONT_WIDTH.default
            : clamped;
        return { ...merged, storefrontWidth };
      },
    },
  ),
);
