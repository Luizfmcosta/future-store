"use client";

import { useStorefrontPortal } from "@/components/shared/StorefrontPortalContext";
import { createPortal } from "react-dom";

/** Renders children into the storefront device frame (not the full viewport). */
export function StorefrontOverlayPortal({ children }: { children: React.ReactNode }) {
  const host = useStorefrontPortal();
  if (!host) return null;
  return createPortal(children, host);
}
