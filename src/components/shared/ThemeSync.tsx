"use client";

import { useDemoStore } from "@/store/demoStore";
import { useEffect } from "react";

/** Syncs `data-theme` on `<html>` for global CSS and future `dark:` variants. */
export function ThemeSync() {
  const colorMode = useDemoStore((s) => s.colorMode);

  useEffect(() => {
    document.documentElement.dataset.theme = colorMode;
  }, [colorMode]);

  return null;
}
