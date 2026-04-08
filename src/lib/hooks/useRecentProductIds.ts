"use client";

import { getRecentProductIds } from "@/lib/shopperSignalsStorage";
import { useEffect, useState } from "react";

/**
 * Recent PDP ids from sessionStorage. Initial render is always `[]` so SSR and
 * the first client pass match; storage is read after mount (post-hydration).
 * Subscribes to `fs:recent-product-ids` for same-tab updates from `recordProductView`.
 */
export function useRecentProductIds(): string[] {
  const [ids, setIds] = useState<string[]>(() => []);

  useEffect(() => {
    function sync() {
      setIds(getRecentProductIds());
    }
    sync();
    window.addEventListener("fs:recent-product-ids", sync);
    return () => window.removeEventListener("fs:recent-product-ids", sync);
  }, []);

  return ids;
}
