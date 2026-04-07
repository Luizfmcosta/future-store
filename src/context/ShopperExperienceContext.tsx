"use client";

import { useShopperSignals } from "@/hooks/useShopperSignals";
import {
  buildHomeExperience,
  getCompareProductId,
  getContinueProductId,
  getSpotlightProductId,
  type HomeExperienceConfig,
} from "@/lib/personalization";
import { useDemoStore } from "@/store/demoStore";
import type { ShopperSignals } from "@/types/shopperSignals";
import { createContext, useContext, useMemo, type ReactNode } from "react";

export type ShopperExperienceValue = {
  signals: ShopperSignals;
  experience: HomeExperienceConfig;
  continueProductId: string;
  compareProductId: string;
  spotlightProductId: string;
};

const ShopperExperienceContext = createContext<ShopperExperienceValue | null>(null);

/**
 * Funnel personalization: module order, catalog bias, copy paths, and product slots.
 * Wrap the home route (or app) so modules can consume a single source of truth.
 */
export function ShopperExperienceProvider({
  children,
  incrementVisitOnMount,
}: {
  children: ReactNode;
  /** Set true only when rendering the home page (counts a “visit”). */
  incrementVisitOnMount?: boolean;
}) {
  const profile = useDemoStore((s) => s.activeProfile);
  const signals = useShopperSignals({ incrementVisitOnMount: !!incrementVisitOnMount });

  const value = useMemo((): ShopperExperienceValue => {
    const experience = buildHomeExperience(profile, signals);
    const segment = experience.segment;
    return {
      signals,
      experience,
      continueProductId: getContinueProductId(profile, segment),
      compareProductId: getCompareProductId(profile, segment),
      spotlightProductId: getSpotlightProductId(profile, segment),
    };
  }, [profile, signals]);

  return <ShopperExperienceContext.Provider value={value}>{children}</ShopperExperienceContext.Provider>;
}

export function useShopperExperience(): ShopperExperienceValue {
  const ctx = useContext(ShopperExperienceContext);
  if (!ctx) {
    throw new Error("useShopperExperience must be used within ShopperExperienceProvider");
  }
  return ctx;
}

/** Safe for components that may render outside the provider (e.g. search) — returns null. */
export function useShopperExperienceOptional(): ShopperExperienceValue | null {
  return useContext(ShopperExperienceContext);
}
