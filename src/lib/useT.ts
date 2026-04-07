"use client";

import { useLocale } from "@/context/LocaleContext";
import { formatMessage, getMessage } from "@/lib/messages";
import type { AppLocale } from "@/lib/locale-types";
import { useCallback } from "react";

export type TranslateFn = (
  path: string,
  params?: Record<string, string | number>,
) => string;

export function useT(): TranslateFn {
  const { locale } = useLocale();
  return useCallback(
    (path: string, params?: Record<string, string | number>) => {
      const raw = getMessage(locale, path) ?? path;
      return params ? formatMessage(raw, params) : raw;
    },
    [locale],
  );
}

/** For non-React modules / server if needed */
export function translate(
  locale: AppLocale,
  path: string,
  params?: Record<string, string | number>,
): string {
  const raw = getMessage(locale, path) ?? path;
  return params ? formatMessage(raw, params) : raw;
}
