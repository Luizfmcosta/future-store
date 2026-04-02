"use client";

import { createContext, useContext } from "react";

/** DOM node inside the Future Store window for portaled UI (e.g. search overlay). */
const StorefrontPortalContext = createContext<HTMLElement | null>(null);

export function StorefrontPortalProvider({
  children,
  mountNode,
}: {
  children: React.ReactNode;
  mountNode: HTMLElement | null;
}) {
  return (
    <StorefrontPortalContext.Provider value={mountNode}>{children}</StorefrontPortalContext.Provider>
  );
}

export function useStorefrontPortal(): HTMLElement | null {
  return useContext(StorefrontPortalContext);
}
