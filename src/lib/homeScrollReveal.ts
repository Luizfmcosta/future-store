/**
 * Home section reveal helpers.
 *
 * Prefer showing content immediately inside the storefront scrollport — Framer
 * `whileInView` / `useInView` (viewport root) has left `opacity: 0` stuck on
 * below-fold bands (see MerchStrip / Ricardo TikTok). Keep final visible state
 * without gating on intersection.
 */

type StaggerViewport = { once: true; amount: number; margin: string };

const staggerViewport: StaggerViewport = { once: true, amount: 0.08, margin: "0px 0px 280px 0px" };

const staggerViewportWide: StaggerViewport = { once: true, amount: 0.12, margin: "0px 0px 280px 0px" };

export function homeStaggerParentMotion(_online: boolean, _viewport: StaggerViewport = staggerViewport) {
  return {
    initial: "show" as const,
    animate: "show" as const,
  };
}

/** Compare / Continue journey blocks (slightly higher `amount` than curated grid). */
export function homeStaggerParentMotionWide(online: boolean) {
  return homeStaggerParentMotion(online, staggerViewportWide);
}

export function homeFadeUpBlockMotion(_online: boolean) {
  return {
    initial: { opacity: 1, y: 0 },
    animate: { opacity: 1, y: 0 },
  };
}

export function homeSpotlightSectionMotion(_online: boolean) {
  return {
    initial: "show" as const,
    animate: "show" as const,
  };
}
