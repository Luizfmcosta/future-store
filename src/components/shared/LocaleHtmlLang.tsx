"use client";

import { getMessage } from "@/lib/messages";
import { useDemoStore } from "@/store/demoStore";
import { useEffect } from "react";

/** Syncs `<html lang>` and `document.title` with the UI locale (pt → `pt-BR`). */
export function LocaleHtmlLang() {
  const locale = useDemoStore((s) => s.uiLocale);
  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
    const title = getMessage("metaTitle", locale);
    if (title) document.title = title;
  }, [locale]);
  return null;
}
