"use client";

import { useDemoStore } from "@/store/demoStore";
import { useEffect } from "react";

/** Syncs `<html lang>` with the UI locale (pt → `pt-BR`). */
export function LocaleHtmlLang() {
  const locale = useDemoStore((s) => s.uiLocale);
  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  }, [locale]);
  return null;
}
