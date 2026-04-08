/**
 * Panel slide uses pixel `x` (not `%`): Motion resolves `%` against the element’s own width,
 * which can be 0 before layout and look like a “pop”.
 */
export const storefrontSheetBackdropTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1] as const,
};

export const storefrontSheetBackdropExitTransition = {
  duration: 0.22,
  ease: [0.4, 0, 1, 1] as const,
};

export const storefrontSheetPanelTransition = {
  duration: 0.48,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const storefrontSheetPanelExitTransition = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1] as const,
};

/** Tailwind `max-w-md` (28rem) — slide distance matches panel max width. */
export const STOREFRONT_SHEET_PANEL_MAX_SLIDE_PX = 28 * 16;

/** RayX panel uses `max-w-lg` (32rem). */
export const STOREFRONT_RAYX_PANEL_MAX_SLIDE_PX = 32 * 16;
