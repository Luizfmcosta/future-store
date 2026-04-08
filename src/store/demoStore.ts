"use client";

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
  parsedIntent: SearchIntent | null;
  selectedProductId: string | null;
  cartDrawerOpen: boolean;
  presenterPanelOpen: boolean;
  refineOpen: boolean;
  compareSelection: string[];
  currentScreen: ScreenId;
  cartLineId: string | null;

  setParsedIntent: (intent: SearchIntent | null) => void;
  setProfile: (id: ShopperProfileId) => void;
  setAiMode: (v: boolean) => void;
  setColorMode: (m: ColorMode) => void;
  setRayX: (v: boolean) => void;
  setQuery: (q: string) => void;
  runSearch: (q?: string) => void;
  setSelectedProduct: (id: string | null) => void;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: string) => void;
  setPresenterOpen: (v: boolean) => void;
  togglePresenter: () => void;
  setRefineOpen: (v: boolean) => void;
  setCurrentScreen: (s: ScreenId) => void;
  setCompareSelection: (ids: string[]) => void;
  reset: () => void;
  presetSearch: () => void;
};

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
  activeProfile: "marina",
  aiMode: false,
  rayXMode: false,
  colorMode: "dark",
  currentQuery: "",
  parsedIntent: null,
  selectedProductId: null,
  cartDrawerOpen: false,
  presenterPanelOpen: false,
  refineOpen: false,
  compareSelection: [],
  currentScreen: "home",
  cartLineId: null,

  setParsedIntent: (intent) => set({ parsedIntent: intent }),
  setProfile: (id) => set({ activeProfile: id }),
  setAiMode: (v) => set({ aiMode: v }),
  setColorMode: (m) => set({ colorMode: m }),
  setRayX: (v) => set({ rayXMode: v }),
  setQuery: (q) => set({ currentQuery: q }),
  runSearch: (q) => {
    const query = q ?? get().currentQuery;
    set({
      currentQuery: query,
      parsedIntent: parseIntent(query),
      currentScreen: "search",
    });
  },
  setSelectedProduct: (id) => set({ selectedProductId: id, currentScreen: id ? "pdp" : get().currentScreen }),
  openCart: () => set({ cartDrawerOpen: true }),
  closeCart: () => set({ cartDrawerOpen: false }),
  addToCart: (productId) =>
    set({
      cartLineId: productId,
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
      parsedIntent: null,
      selectedProductId: null,
      cartDrawerOpen: false,
      presenterPanelOpen: false,
      refineOpen: false,
      compareSelection: [],
      currentScreen: "home",
      cartLineId: null,
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
