"use client";

import { formatMessage, getMessage } from "@/lib/messages";
import { useCallback } from "react";

export type TranslateFn = (
  path: string,
  params?: Record<string, string | number>,
) => string;

export function useT(): TranslateFn {
  return useCallback((path: string, params?: Record<string, string | number>) => {
    const raw = getMessage(path) ?? path;
    return params ? formatMessage(raw, params) : raw;
  }, []);
}

/** For non-React modules / server if needed */
export function translate(path: string, params?: Record<string, string | number>): string {
  const raw = getMessage(path) ?? path;
  return params ? formatMessage(raw, params) : raw;
}
