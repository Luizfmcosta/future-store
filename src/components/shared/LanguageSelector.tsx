"use client";

import { useLocale } from "@/context/LocaleContext";
import { LOCALE_LABELS, type AppLocale } from "@/lib/locale-types";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const LOCALES: AppLocale[] = ["en-US", "pt-BR"];

export function LanguageSelector({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  const t = useT();

  return (
    <div className={cn("relative inline-flex w-full max-w-[min(100%,190px)]", className)}>
      <select
        aria-label={t("footer.languageLabel")}
        value={locale}
        onChange={(e) => setLocale(e.target.value as AppLocale)}
        className={cn(
          "h-8 w-full cursor-pointer appearance-none rounded-full pl-3 pr-8",
          "bg-white/90 text-[12px] font-medium text-black/90",
          "border border-white/25 shadow-none outline-none ring-0",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/35",
        )}
      >
        {LOCALES.map((id) => (
          <option key={id} value={id}>
            {LOCALE_LABELS[id]}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-black/75"
        strokeWidth={2}
        aria-hidden
      />
    </div>
  );
}
