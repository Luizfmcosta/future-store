"use client";

import { mergePromptRefsIntoQuery, type PromptProductRef } from "@/lib/promptProductRefs";
import { parseIntent } from "@/lib/parseIntent";
import type { SearchIntent } from "@/types";
import type { ScreenId } from "@/types";
import type { ShopperProfileId } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const DEFAULT_QUERY =
  "Wireless speaker for ~3 m living room, best value, up to R$ 5000";

export type ColorMode = "dark" | "light";

type DemoState = {
  activeProfile: ShopperProfileId;
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

  setParsedIntent: (intent: SearchIntent | null) => void;
  setProfile: (id: ShopperProfileId) => void;
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
  setPresenterOpen: (v: boolean) => void;
  togglePresenter: () => void;
  setRefineOpen: (v: boolean) => void;
  setCurrentScreen: (s: ScreenId) => void;
  setCompareSelection: (ids: string[]) => void;
  reset: () => void;
  presetSearch: () => void;
};

export type { PromptProductRef } from "@/lib/promptProductRefs";

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
  activeProfile: "marina",
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

  setParsedIntent: (intent) => set({ parsedIntent: intent }),
  setProfile: (id) => set({ activeProfile: id }),
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
      currentScreen: stayOnPdp ? "pdp" : "search",
    });
  },
  openPdpChatOverlay: () => set({ pdpChatOverlayOpen: true }),
  closePdpChatOverlay: () => set({ pdpChatOverlayOpen: false }),
  setSelectedProduct: (id) => set({ selectedProductId: id, currentScreen: id ? "pdp" : get().currentScreen }),
  openCart: () => set({ cartDrawerOpen: true }),
  closeCart: () => set({ cartDrawerOpen: false }),
  addToCart: (productId, quantity = 1) =>
    set({
      cartLineId: productId,
      cartQuantity: Math.min(99, Math.max(1, Math.floor(quantity))),
      cartDrawerOpen: true,
      selectedProductId: productId,
    }),
  setPresenterOpen: (v) => set({ presenterPanelOpen: v }),
  togglePresenter: () => set((s) => ({ presenterPanelOpen: !s.presenterPanelOpen })),
  setRefineOpen: (v) => set({ refineOpen: v }),
  setCurrentScreen: (s) => set({ currentScreen: s }),
  setCompareSelection: (ids) => set({ compareSelection: ids }),
  reset: () =>
    set({
      activeProfile: "marina",
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
    }),
  presetSearch: () => {
    const query = DEFAULT_QUERY;
    set({
      currentQuery: query,
      parsedIntent: parseIntent(query),
      currentScreen: "search",
    });
  },
}),
    {
      name: "future-store-demo",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ aiMode: state.aiMode }),
    },
  ),
);
