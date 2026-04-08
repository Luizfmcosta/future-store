/**
 * Session-scoped shopper signals (no PII). Used for funnel personalization.
 * Safe to call only in the browser.
 */

const NS = "fs";

export const STORAGE_KEYS = {
  visitCount: `${NS}:visitCount`,
  lastProductIds: `${NS}:lastProductIds`,
  traffic: `${NS}:traffic`,
} as const;

const MAX_RECENT_PRODUCTS = 6;

import type { TrafficChannel } from "@/types/shopperSignals";

export type PersistedTraffic = {
  channel: TrafficChannel;
  utmSource: string | null;
  utmMedium: string | null;
  capturedAt: number;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof sessionStorage !== "undefined";
}

export function getVisitCount(): number {
  if (!canUseStorage()) return 1;
  const raw = sessionStorage.getItem(STORAGE_KEYS.visitCount);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Increment on each full home load (call from HomeView mount). */
export function incrementVisitCount(): number {
  if (!canUseStorage()) return 1;
  const next = getVisitCount() + 1;
  sessionStorage.setItem(STORAGE_KEYS.visitCount, String(next));
  return next;
}

export function isReturningVisitor(): boolean {
  return getVisitCount() > 1;
}

/** Parse UTM / referrer once; sticky for the session. */
export function resolveTrafficChannel(search: string, referrer: string): TrafficChannel {
  const params = new URLSearchParams(search);
  const utmSource = params.get("utm_source")?.toLowerCase() ?? "";
  const utmMedium = params.get("utm_medium")?.toLowerCase() ?? "";
  const utmCampaign = params.get("utm_campaign")?.toLowerCase() ?? "";

  const paidSocialHints = ["instagram", "ig", "facebook", "fb", "tiktok", "social", "paid-social"];
  const paidSearchHints = ["google", "bing", "cpc", "ppc", "paid-search"];

  if (
    paidSocialHints.some((h) => utmSource.includes(h) || utmMedium.includes(h) || utmCampaign.includes(h)) ||
    /instagram|facebook|tiktok/i.test(referrer)
  ) {
    return "paid_social";
  }
  if (paidSearchHints.some((h) => utmSource.includes(h) || utmMedium.includes("cpc") || utmMedium.includes("ppc"))) {
    return "paid_search";
  }
  if (utmMedium.includes("organic") || referrer.includes("google.") && !utmSource) {
    return "organic";
  }
  if (!utmSource && !referrer) return "direct";
  return "other";
}

export function readOrCaptureTraffic(): PersistedTraffic {
  if (!canUseStorage()) {
    return { channel: "direct", utmSource: null, utmMedium: null, capturedAt: Date.now() };
  }
  const existing = sessionStorage.getItem(STORAGE_KEYS.traffic);
  if (existing) {
    try {
      return JSON.parse(existing) as PersistedTraffic;
    } catch {
      /* fall through */
    }
  }
  const search = window.location.search ?? "";
  const referrer = document.referrer ?? "";
  const params = new URLSearchParams(search);
  const channel = resolveTrafficChannel(search, referrer);
  const payload: PersistedTraffic = {
    channel,
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    capturedAt: Date.now(),
  };
  sessionStorage.setItem(STORAGE_KEYS.traffic, JSON.stringify(payload));
  return payload;
}

export function getRecentProductIds(): string[] {
  if (!canUseStorage()) return [];
  const raw = sessionStorage.getItem(STORAGE_KEYS.lastProductIds);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** Push product id to front; dedupe; cap length. */
export function recordProductView(productId: string): void {
  if (!canUseStorage() || !productId) return;
  const prev = getRecentProductIds().filter((id) => id !== productId);
  const next = [productId, ...prev].slice(0, MAX_RECENT_PRODUCTS);
  sessionStorage.setItem(STORAGE_KEYS.lastProductIds, JSON.stringify(next));
  window.dispatchEvent(new Event("fs:recent-product-ids"));
}
