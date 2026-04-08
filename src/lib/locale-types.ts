export type AppLocale = "pt-BR" | "en-US";

export const DEFAULT_LOCALE: AppLocale = "en-US";

export const LOCALE_STORAGE_KEY = "future-store-locale";

export const LOCALE_LABELS: Record<AppLocale, string> = {
  "pt-BR": "Português (Brasil)",
  "en-US": "English",
};
