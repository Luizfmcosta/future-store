"use client";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import {
  STOREFRONT_FRAME_HEIGHT_DESKTOP,
  STOREFRONT_FRAME_HEIGHT_DESKTOP_SHELL_SCALED,
  STOREFRONT_FRAME_HEIGHT_PHONE,
  STOREFRONT_FRAME_HEIGHT_PHONE_SHELL_SCALED,
  STOREFRONT_PHONE_FRAME_MAX_WIDTH,
} from "@/lib/storefrontViewport";
import { useDemoStore } from "@/store/demoStore";

/**
 * Matches {@link AppShell} `data-storefront-container`: phone cap when the browser is narrow **or**
 * the dragged frame width is ≤ {@link STOREFRONT_PHONE_FRAME_MAX_WIDTH}.
 * When `shellViewportLayoutScale` in the demo store is above 1, uses scaled height tokens that divide
 * `100dvh` by `--shell-vp-scale` on the scaled shell wrapper.
 */
export function useStorefrontFrameHeightClass(): string {
  const isMd = useMediaQuery("(min-width: 768px)");
  const storefrontWidth = useDemoStore((s) => s.storefrontWidth);
  const shellScale = useDemoStore((s) => s.shellViewportLayoutScale);
  const scaled = shellScale > 1;
  if (!isMd || storefrontWidth <= STOREFRONT_PHONE_FRAME_MAX_WIDTH) {
    return scaled ? STOREFRONT_FRAME_HEIGHT_PHONE_SHELL_SCALED : STOREFRONT_FRAME_HEIGHT_PHONE;
  }
  return scaled ? STOREFRONT_FRAME_HEIGHT_DESKTOP_SHELL_SCALED : STOREFRONT_FRAME_HEIGHT_DESKTOP;
}
