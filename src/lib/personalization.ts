/**
 * Home funnel personalization: maps `ShopperProfileId` + `ShopperSignals` → segment,
 * module order, catalog sort modes, message key prefixes, and product slots.
 *
 * Add a segment: extend `HomeSegmentId`, `SEGMENT_MSG_KEY`, `messages.*.experience.*`,
 * and the `*ForSegment` helpers below. UI stays unchanged; copy lives in `messages`.
 */
import type { HomeModuleKey } from "@/types";
import type { ShopperProfileId } from "@/types";
import type { MerchSortMode } from "@/lib/catalogSort";
import type { ShopperSignals } from "@/types/shopperSignals";
import { getRecentProductIds } from "@/lib/shopperSignalsStorage";

/** Resolved funnel segment — drives module order, copy keys, and catalog bias. */
export type HomeSegmentId = "marina_research" | "marina_explore" | "ricardo_speed" | "ricardo_value";

export type CuratedSortMode = "price_desc" | "price_asc" | "profile_default";

export type HomeExperienceConfig = {
  segment: HomeSegmentId;
  moduleOrder: HomeModuleKey[];
  /** Message paths (getMessage / useT) — optional fallbacks in components */
  copy: {
    continueHeadline: string;
    continueBody: string;
    continueCta: string;
    compareCta: string;
    spotlightCta: string;
    merchEyebrow: string;
    merchLine1: string;
    merchLine2: string;
  };
  curatedSort: CuratedSortMode;
  merchSort: MerchSortMode;
  tone: "consultative" | "action";
};

const DEFAULT_MODULES: HomeModuleKey[] = ["hero", "continue", "compare", "curated", "spotlight", "strip"];

/**
 * Map profile + behavioral signals → segment.
 * - Marina + (returning OR desktop) → high-consideration research path.
 * - Marina + mobile + first visit → explore-first (comparatives before “continue”).
 * - Ricardo + first visit → deal / feed speed (Instagram promo, sem histórico).
 * - Ricardo + returning → value / popularity framing (“continue” faz sentido).
 */
export function resolveHomeSegment(profile: ShopperProfileId, signals: ShopperSignals): HomeSegmentId {
  if (profile === "aiAgent") return "marina_research";
  if (profile === "marina") {
    if (signals.isReturning || signals.device === "desktop") return "marina_research";
    return "marina_explore";
  }
  if (profile === "ricardo") {
    if (!signals.isReturning) return "ricardo_speed";
    return "ricardo_value";
  }
  return "ricardo_value";
}

function moduleOrderForSegment(
  segment: HomeSegmentId,
  profile: ShopperProfileId,
  signals: ShopperSignals,
): HomeModuleKey[] {
  switch (segment) {
    case "marina_research":
      return ["hero", "continue", "compare", "curated", "spotlight", "strip"];
    case "marina_explore":
      return ["hero", "compare", "curated", "continue", "spotlight", "strip"];
    case "ricardo_speed":
      /* Primeira visita: sem “continue” nem comparativo editorial — feed de ofertas + vitrine. */
      if (profile === "ricardo" && !signals.isReturning) {
        return ["hero", "strip", "tiktok", "curated", "spotlight"];
      }
      return ["hero", "strip", "tiktok", "curated", "spotlight", "compare", "continue"];
    case "ricardo_value":
      return ["hero", "continue", "strip", "tiktok", "curated", "spotlight", "compare"];
    default:
      return DEFAULT_MODULES;
  }
}

/** Maps segment id → nested message key (camelCase). */
const SEGMENT_MSG_KEY: Record<HomeSegmentId, string> = {
  marina_research: "marinaResearch",
  marina_explore: "marinaExplore",
  ricardo_speed: "ricardoSpeed",
  ricardo_value: "ricardoValue",
};

/** Copy paths under `messages.experience.<camelSegment>.*` */
function copyForSegment(segment: HomeSegmentId): HomeExperienceConfig["copy"] {
  const base = `experience.${SEGMENT_MSG_KEY[segment]}`;
  return {
    continueHeadline: `${base}.continueHeadline`,
    continueBody: `${base}.continueBody`,
    continueCta: `${base}.continueCta`,
    compareCta: `${base}.compareCta`,
    spotlightCta: `${base}.spotlightCta`,
    merchEyebrow: `${base}.merchEyebrow`,
    merchLine1: `${base}.merchLine1`,
    merchLine2: `${base}.merchLine2`,
  };
}

function curatedSortForSegment(segment: HomeSegmentId): CuratedSortMode {
  if (segment === "marina_research" || segment === "marina_explore") return "price_desc";
  if (segment === "ricardo_speed") return "price_asc";
  return "profile_default";
}

function merchSortForSegment(segment: HomeSegmentId): MerchSortMode {
  /**
   * Ricardo “Browse the line” matches production: fixed catalog order in `products` (editorial lineup),
   * not price-sorted — `price_asc` surfaced headphones / entry SKUs first and diverged from live.
   */
  if (segment === "ricardo_speed" || segment === "ricardo_value") return "default";
  if (segment === "marina_research") return "price_desc";
  return "default";
}

function toneForSegment(segment: HomeSegmentId): "consultative" | "action" {
  return segment === "marina_research" || segment === "marina_explore" ? "consultative" : "action";
}

export function buildHomeExperience(
  profile: ShopperProfileId,
  signals: ShopperSignals,
): HomeExperienceConfig {
  const segment = resolveHomeSegment(profile, signals);
  return {
    segment,
    moduleOrder: moduleOrderForSegment(segment, profile, signals),
    copy: copyForSegment(segment),
    curatedSort: curatedSortForSegment(segment),
    merchSort: merchSortForSegment(segment),
    tone: toneForSegment(segment),
  };
}

/**
 * Product slots — IDs from catalog.
 * Marina: prefers the most recent PDP view when present (then Stage Compact fallback).
 * Ricardo: always use segment defaults — recent views could surface a TV with “speaker” hero art
 * and clash with “Standout value on display” copy; returning shoppers should see Trail Mini (`sp-roam-2`) on value.
 */
export function getContinueProductId(
  profile: ShopperProfileId,
  segment: HomeSegmentId,
  recentIds: string[] = getRecentProductIds(),
): string {
  const recent = recentIds;
  if (profile !== "ricardo" && recent[0]) return recent[0];
  if (profile === "marina") {
    return "sb-beam-g2";
  }
  if (profile === "ricardo" && segment === "ricardo_speed") {
    return "sp-era-300";
  }
  return segment === "ricardo_speed" ? "sp-era-100" : "sp-roam-2";
}

export function getCompareProductId(profile: ShopperProfileId, _segment: HomeSegmentId): string {
  if (profile === "marina") {
    /* Copy: “standalone speaker vs soundbar” — feature a flagship speaker, not a bar. */
    return "sp-era-300";
  }
  /* Copy: “full range of speakers” — wireless speaker lead-in. */
  return "sp-era-100";
}

export function getSpotlightProductId(profile: ShopperProfileId, segment: HomeSegmentId): string {
  if (profile === "marina") {
    return segment === "marina_explore" ? "sp-five" : "sp-move-2";
  }
  if (profile === "ricardo") {
    /* Era 100 hero repeats in MerchStrip; Studio Reference uses a distinct asset. */
    return "sp-five";
  }
  return segment === "ricardo_speed" ? "sb-ray" : "sp-era-100";
}

/** @deprecated Use buildHomeExperience + config.moduleOrder */
export function getHomeModules(_profile: ShopperProfileId): HomeModuleKey[] {
  return DEFAULT_MODULES;
}
