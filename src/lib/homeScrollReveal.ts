/**
 * Framer Motion props for home sections: `whileInView` can leave `initial="hidden"` stuck when
 * IntersectionObserver is flaky offline; when `online` is false, show final state immediately.
 */

type StaggerViewport = { once: true; amount: number; margin: string };

const staggerViewport: StaggerViewport = { once: true, amount: 0.08, margin: "0px 0px 280px 0px" };

const staggerViewportWide: StaggerViewport = { once: true, amount: 0.12, margin: "0px 0px 280px 0px" };

export function homeStaggerParentMotion(online: boolean, viewport: StaggerViewport = staggerViewport) {
  if (online) {
    return {
      initial: "hidden" as const,
      whileInView: "show" as const,
      viewport,
    };
  }
  return {
    initial: "show" as const,
    animate: "show" as const,
  };
}

/** Compare / Continue journey blocks (slightly higher `amount` than curated grid). */
export function homeStaggerParentMotionWide(online: boolean) {
  return homeStaggerParentMotion(online, staggerViewportWide);
}

const fadeViewport = { once: true as const, amount: 0.28 as const, margin: "0px 0px 240px 0px" as const };

export function homeFadeUpBlockMotion(online: boolean) {
  if (online) {
    return {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: fadeViewport,
    };
  }
  return {
    initial: { opacity: 1, y: 0 },
    animate: { opacity: 1, y: 0 },
  };
}

const spotlightViewport = { once: true as const, amount: 0.1 as const, margin: "0px 0px 260px 0px" as const };

export function homeSpotlightSectionMotion(online: boolean) {
  if (online) {
    return {
      initial: "hidden" as const,
      whileInView: "show" as const,
      viewport: spotlightViewport,
    };
  }
  return {
    initial: "show" as const,
    animate: "show" as const,
  };
}
