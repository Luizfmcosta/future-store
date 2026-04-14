/** Scroll parent for most routes — see {@link StorefrontMain}. */
const STOREFRONT_WIN_SEL = "[data-storefront-window]";
const STOREFRONT_SCROLL_SEL = "[data-storefront-scroll]";

const AI_CHAT_SCROLL_SEL = "[data-storefront-ai-scroll]";

function zeroScrollTop(el: HTMLElement): void {
  const prev = el.style.scrollBehavior;
  el.style.scrollBehavior = "auto";
  el.scrollTop = 0;
  el.scrollLeft = 0;
  el.style.scrollBehavior = prev;
}

/** Every `main` / marked scroll region under the device frame. */
function forEachStorefrontScrollTarget(fn: (el: HTMLElement) => void): void {
  const marked = document.querySelectorAll<HTMLElement>(STOREFRONT_SCROLL_SEL);
  if (marked.length) {
    marked.forEach(fn);
    return;
  }
  const host = document.querySelector(STOREFRONT_WIN_SEL);
  host?.querySelectorAll<HTMLElement>("main").forEach(fn);
}

/** Ancestors of `el` that actually overflow vertically (covers non-`main` scrollports). */
function overflowScrollAncestors(el: Element | null): HTMLElement[] {
  const out: HTMLElement[] = [];
  let cur: Element | null = el;
  while (cur && cur !== document.documentElement) {
    if (cur instanceof HTMLElement) {
      const { overflowY } = getComputedStyle(cur);
      const canScrollY = overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay";
      if (canScrollY && cur.scrollHeight > cur.clientHeight + 2) {
        out.push(cur);
      }
    }
    cur = cur.parentElement;
  }
  return out;
}

/**
 * Reset storefront `main` scroll position. Used when `router.push` keeps the same pathname
 * (e.g. `/search` → `/search`) so layout effects keyed on pathname do not run.
 */
export function scrollStorefrontMainToTop(): void {
  if (typeof window === "undefined") return;
  const run = () => {
    forEachStorefrontScrollTarget(zeroScrollTop);
  };
  run();
  queueMicrotask(run);
  requestAnimationFrame(() => requestAnimationFrame(run));
  window.setTimeout(run, 0);
}

/**
 * Home: zero storefront scroll region(s), zero overflow ancestors of `#home-hero`, then align hero to top.
 */
export function scrollStorefrontHomeToTop(): void {
  if (typeof window === "undefined") return;
  const run = () => {
    forEachStorefrontScrollTarget(zeroScrollTop);
    const hero = document.getElementById("home-hero");
    if (hero) {
      for (const el of overflowScrollAncestors(hero)) {
        zeroScrollTop(el);
      }
      hero.scrollIntoView({ block: "start", inline: "nearest", behavior: "auto" });
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
