/**
 * Phone-sized frame (narrow browser **or** `storefrontWidth` ≤ this on `md+`).
 * Keep in sync with `AppShell` `max-w-[440px]` on small viewports.
 */
export const STOREFRONT_PHONE_FRAME_MAX_WIDTH = 440;

/**
 * Narrow / phone preview: single **956px** cap (no `xl`/`2xl` ladder — that followed **browser** width,
 * so a phone preset on a large monitor wrongly became 1200px tall).
 */
export const STOREFRONT_FRAME_HEIGHT_PHONE =
  "h-[min(100dvh-2rem,956px)] min-h-[500px] max-h-[956px]";

/**
 * Wide desktop preview: full height ladder vs viewport (`md` / `xl` / `2xl`).
 */
export const STOREFRONT_FRAME_HEIGHT_DESKTOP =
  "h-[min(100dvh-2rem,880px)] min-h-[500px] max-h-[880px] md:h-[min(100dvh-4rem,960px)] md:max-h-[960px] xl:h-[min(100dvh-5rem,1080px)] xl:max-h-[1080px] 2xl:h-[min(100dvh-6rem,1200px)] 2xl:max-h-[1200px]";

/** Solid band under video heroes (`h-3` = 12px) — hides hairline before the first white module. */
export const STOREFRONT_HERO_BOTTOM_BLEED = "h-3 w-full shrink-0";

/**
 * Kicker + headline sit above {@link FloatingPromptDock}: 5rem (80px) gap + dock stack (rhythm with
 * `ui.floatingPromptDockClearance` — 7.75rem / 8rem) + safe area.
 */
export const STOREFRONT_HERO_COPY_BOTTOM_PAD =
  "pb-[max(13rem,calc(5rem+7.75rem+env(safe-area-inset-bottom,0px)))] sm:pb-[max(13.5rem,calc(5rem+8rem+env(safe-area-inset-bottom,0px)))]";

/** Width of the demo storefront frame on md+ (drag handle + quick presets). */
export const STOREFRONT_WIDTH = {
  /** Below this the frame feels unusably narrow; drag + presets respect this floor. */
  min: 340,
  /** Drag + CSS `max-w` on the frame (`AppShell`) — keep in sync. */
  max: 1920,
  /** Initial frame width on md+ — matches desktop preset so the demo loads wide by default. */
  default: 1920,
  /** Matches `AppShell` phone `max-w-[440px]` and {@link STOREFRONT_PHONE_FRAME_MAX_WIDTH}. */
  presetMobile: 440,
  /** Wide desktop preview (monitor preset) — comfortable on large monitors without browser zoom. */
  presetDesktop: 1920,
} as const;

export function clampStorefrontWidth(w: number): number {
  return Math.min(STOREFRONT_WIDTH.max, Math.max(STOREFRONT_WIDTH.min, Math.round(w)));
}
