"use client";

import { getRecentProductIds } from "@/lib/shopperSignalsStorage";
import { useSyncExternalStore } from "react";

const SERVER_SNAPSHOT: string[] = [];

let cachedKey = "";
let cachedIds: string[] = SERVER_SNAPSHOT;

function getClientSnapshot(): string[] {
  const ids = getRecentProductIds();
  const key = JSON.stringify(ids);
  if (key === cachedKey) return cachedIds;
  cachedKey = key;
  cachedIds = ids.length === 0 ? SERVER_SNAPSHOT : ids;
  return cachedIds;
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const fn = () => {
    cachedKey = "";
    onStoreChange();
  };
  window.addEventListener("fs:recent-product-ids", fn);
  return () => window.removeEventListener("fs:recent-product-ids", fn);
}

/**
 * Recent PDP ids from sessionStorage, safe for SSR/hydration: server and the
 * first client pass use an empty snapshot; real storage is read after hydrate.
 */
export function useRecentProductIds(): string[] {
  return useSyncExternalStore(subscribe, getClientSnapshot, () => SERVER_SNAPSHOT);
}
