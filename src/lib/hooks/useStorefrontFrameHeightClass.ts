"use client";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import {
  STOREFRONT_FRAME_HEIGHT_DESKTOP,
  STOREFRONT_FRAME_HEIGHT_PHONE,
  STOREFRONT_PHONE_FRAME_MAX_WIDTH,
} from "@/lib/storefrontViewport";
import { useDemoStore } from "@/store/demoStore";

/**
 * Matches {@link AppShell} `data-storefront-container`: phone cap when the browser is narrow **or**
 * the dragged frame width is ≤ {@link STOREFRONT_PHONE_FRAME_MAX_WIDTH}.
 */
export function useStorefrontFrameHeightClass(): string {
  const isMd = useMediaQuery("(min-width: 768px)");
  const storefrontWidth = useDemoStore((s) => s.storefrontWidth);
  if (!isMd || storefrontWidth <= STOREFRONT_PHONE_FRAME_MAX_WIDTH) {
    return STOREFRONT_FRAME_HEIGHT_PHONE;
  }
  return STOREFRONT_FRAME_HEIGHT_DESKTOP;
}
