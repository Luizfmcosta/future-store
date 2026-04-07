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

export type SocialProofMode = "technical" | "volume" | "none";

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
    socialHeadline: string;
    socialBody: string;
    socialCta: string;
  };
  curatedSort: CuratedSortMode;
  merchSort: MerchSortMode;
  socialProofMode: SocialProofMode;
  tone: "consultative" | "action";
};

const DEFAULT_MODULES: HomeModuleKey[] = ["hero", "continue", "compare", "curated", "spotlight", "strip"];

/**
 * Map profile + behavioral signals → segment.
 * - Marina + (returning OR desktop) → high-consideration research path.
 * - Marina + mobile + first visit → explore-first (comparatives before “continue”).
 * - Ricardo + (paid social OR first mobile) → speed / deal framing.
 * - Else Ricardo → value / popularity framing.
 */
export function resolveHomeSegment(profile: ShopperProfileId, signals: ShopperSignals): HomeSegmentId {
  if (profile === "marina") {
    if (signals.isReturning || signals.device === "desktop") return "marina_research";
    return "marina_explore";
  }
  if (!signals.isReturning && (signals.trafficChannel === "paid_social" || signals.device === "mobile")) {
    return "ricardo_speed";
  }
  return "ricardo_value";
}

function moduleOrderForSegment(segment: HomeSegmentId): HomeModuleKey[] {
  switch (segment) {
    case "marina_research":
      return ["hero", "continue", "compare", "proof", "curated", "spotlight", "strip"];
    case "marina_explore":
      return ["hero", "compare", "curated", "continue", "spotlight", "proof", "strip"];
    case "ricardo_speed":
      return ["hero", "strip", "curated", "spotlight", "compare", "continue", "proof"];
    case "ricardo_value":
      return ["hero", "continue", "strip", "curated", "spotlight", "compare", "proof"];
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

/** Copy paths under `messages[locale].experience.<camelSegment>.*` */
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
    socialHeadline: `${base}.socialHeadline`,
    socialBody: `${base}.socialBody`,
    socialCta: `${base}.socialCta`,
  };
}

function curatedSortForSegment(segment: HomeSegmentId): CuratedSortMode {
  if (segment === "marina_research" || segment === "marina_explore") return "price_desc";
  if (segment === "ricardo_speed") return "price_asc";
  return "profile_default";
}

function merchSortForSegment(segment: HomeSegmentId): MerchSortMode {
  if (segment === "ricardo_speed" || segment === "ricardo_value") return "price_asc";
  if (segment === "marina_research") return "price_desc";
  return "default";
}

function socialModeForSegment(segment: HomeSegmentId): SocialProofMode {
  if (segment === "marina_research" || segment === "marina_explore") return "technical";
  if (segment === "ricardo_speed" || segment === "ricardo_value") return "volume";
  return "none";
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
    moduleOrder: moduleOrderForSegment(segment),
    copy: copyForSegment(segment),
    curatedSort: curatedSortForSegment(segment),
    merchSort: merchSortForSegment(segment),
    socialProofMode: socialModeForSegment(segment),
    tone: toneForSegment(segment),
  };
}

/** Product slots — IDs from catalog; continue prefers recent PDP views when present. */
export function getContinueProductId(profile: ShopperProfileId, segment: HomeSegmentId): string {
  const recent = getRecentProductIds();
  if (recent[0]) return recent[0];
  if (profile === "marina") {
    return segment === "marina_explore" ? "sp-era-300" : "sp-era-300";
  }
  return segment === "ricardo_speed" ? "sp-era-100" : "sp-roam-2";
}

export function getCompareProductId(profile: ShopperProfileId, segment: HomeSegmentId): string {
  if (profile === "marina") return "sp-home-theater";
  return segment === "ricardo_speed" ? "sp-roam-2" : "sp-era-100";
}

export function getSpotlightProductId(profile: ShopperProfileId, segment: HomeSegmentId): string {
  if (profile === "marina") return segment === "marina_explore" ? "sp-era-300" : "sp-move-2";
  return segment === "ricardo_speed" ? "sp-era-100" : "sp-era-100";
}

/** @deprecated Use buildHomeExperience + config.moduleOrder */
export function getHomeModules(_profile: ShopperProfileId): HomeModuleKey[] {
  return DEFAULT_MODULES;
}
