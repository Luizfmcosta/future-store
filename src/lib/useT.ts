"use client";

import { formatMessage, getMessage } from "@/lib/messages";
import type { UiLocale } from "@/lib/locales/types";
import { useDemoStore } from "@/store/demoStore";
import { useCallback } from "react";

export type TranslateFn = (
  path: string,
  params?: Record<string, string | number>,
) => string;

export function useT(): TranslateFn {
  const locale = useDemoStore((s) => s.uiLocale);
  return useCallback(
    (path: string, params?: Record<string, string | number>) => {
      const raw = getMessage(path, locale) ?? path;
      return params ? formatMessage(raw, params) : raw;
    },
    [locale],
  );
}

/** For non-React modules / server if needed */
export function translate(
  path: string,
  params?: Record<string, string | number>,
  locale?: UiLocale,
): string {
  const raw = getMessage(path, locale) ?? path;
  return params ? formatMessage(raw, params) : raw;
}
