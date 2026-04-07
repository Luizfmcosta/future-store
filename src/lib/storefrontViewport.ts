/** Width of the demo storefront frame on md+ (drag handle + quick presets). */
export const STOREFRONT_WIDTH = {
  /** Below this the frame feels unusably narrow; drag + presets respect this floor. */
  min: 340,
  max: 960,
  /** Initial frame width on md+ — matches mobile preset so the demo loads in “phone” mode. */
  default: 390,
  /** ~iPhone 14 Pro width */
  presetMobile: 390,
  /** Wide desktop preview */
  presetDesktop: 900,
} as const;

export function clampStorefrontWidth(w: number): number {
  return Math.min(STOREFRONT_WIDTH.max, Math.max(STOREFRONT_WIDTH.min, Math.round(w)));
}
