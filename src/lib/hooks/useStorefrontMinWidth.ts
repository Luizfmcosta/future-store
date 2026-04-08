"use client";

import { useEffect, useState } from "react";

/**
 * True when the storefront **container** (the `@container` box that wraps the preview) is at
 * least `minPx` wide. Matches Tailwind container-query `@md` etc., not the browser viewport.
 */
export function useStorefrontMinWidth(minPx: number) {
  const [meets, setMeets] = useState(false);

  useEffect(() => {
    const el =
      document.querySelector<HTMLElement>("[data-storefront-container]") ??
      document.querySelector<HTMLElement>("[data-storefront-window]");
    if (!el) return;

    const sync = () => {
      setMeets(el.getBoundingClientRect().width >= minPx);
    };
    sync();

    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [minPx]);

  return meets;
}
