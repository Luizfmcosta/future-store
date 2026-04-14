/**
 * Locale-aware UI copy. English lives in `./locales/en`, Portuguese in `./locales/pt-BR`.
 * `useT()` resolves the active locale from the demo store; `getMessage(path, locale?)` is for SSR or explicit locale.
 */
import { enMessages } from "@/lib/locales/en";
import { ptMessages } from "@/lib/locales/pt-BR";
import { DEFAULT_UI_LOCALE, type UiLocale } from "@/lib/locales/types";
import { useDemoStore } from "@/store/demoStore";

/** Same nested shape as English; values are translated strings. */
type MessagesTree = typeof enMessages;

const trees: Record<UiLocale, MessagesTree> = {
  en: enMessages,
  pt: ptMessages as unknown as MessagesTree,
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function resolveLocale(explicit?: UiLocale): UiLocale {
  if (explicit) return explicit;
  if (typeof window !== "undefined") {
    return useDemoStore.getState().uiLocale;
  }
  return DEFAULT_UI_LOCALE;
}

/** Dot-path lookup, e.g. `hero.marina.kicker` or `common.cart`. */
export function getMessage(path: string, locale?: UiLocale): string | undefined {
  const parts = path.split(".");
  let cur: unknown = trees[resolveLocale(locale)];

  for (const p of parts) {
    if (!isPlainObject(cur) || !(p in cur)) {
      return undefined;
    }
    cur = cur[p];
  }

  return typeof cur === "string" ? cur : undefined;
}

export function formatMessage(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  let s = template;
  for (const [k, v] of Object.entries(params)) {
    s = s.replaceAll(`{${k}}`, String(v));
  }
  return s;
}

/** @deprecated Prefer `getMessage(path)` — English-only tree for legacy imports. */
export const messages = enMessages;

export { enMessages, ptMessages };
