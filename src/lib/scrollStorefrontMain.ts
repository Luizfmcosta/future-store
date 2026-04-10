/** Scroll parent for most routes — see {@link StorefrontMain}. */
const MAIN_SEL = "[data-storefront-window] main";

const AI_CHAT_SCROLL_SEL = "[data-storefront-ai-scroll]";

/**
 * Reset storefront `main` scroll position. Used when `router.push` keeps the same pathname
 * (e.g. `/search` → `/search`) so layout effects keyed on pathname do not run.
 */
export function scrollStorefrontMainToTop(): void {
  if (typeof window === "undefined") return;
  const run = () => {
    const main = document.querySelector<HTMLElement>(MAIN_SEL);
    if (main) {
      main.scrollTop = 0;
      main.scrollLeft = 0;
    }
  };
  run();
  queueMicrotask(run);
  requestAnimationFrame(() => requestAnimationFrame(run));
  window.setTimeout(run, 0);
}

/**
 * Reset the Search AI chat scroller. Retries because the node can mount one frame after `?view=ai`.
 */
export function scrollStorefrontAiChatToTop(): void {
  if (typeof window === "undefined") return;
  const run = () => {
    const el = document.querySelector<HTMLElement>(AI_CHAT_SCROLL_SEL);
    if (el) {
      el.scrollTop = 0;
      el.scrollLeft = 0;
    }
  };
  run();
  queueMicrotask(run);
  requestAnimationFrame(() => requestAnimationFrame(run));
  for (const ms of [0, 50, 100, 200]) {
    window.setTimeout(run, ms);
  }
}

/** After floating prompt submit: SERP uses `main`, Chat tab uses the AI column — both may apply. */
export function scrollSearchSubmitSurfacesToTop(): void {
  scrollStorefrontMainToTop();
  scrollStorefrontAiChatToTop();
  if (typeof window === "undefined") return;
  const runMain = () => scrollStorefrontMainToTop();
  const runAi = () => scrollStorefrontAiChatToTop();
  for (const ms of [50, 100, 200, 400, 600, 800]) {
    window.setTimeout(() => {
      runMain();
      runAi();
    }, ms);
  }
}
