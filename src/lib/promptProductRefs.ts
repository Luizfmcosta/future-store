export type PromptProductRef = {
  key: string;
  productId?: string;
  label: string;
};

/** Build the string used for intent parsing / assistant context while keeping the textarea as plain user text. */
export function mergePromptRefsIntoQuery(text: string, refs: PromptProductRef[]): string {
  const t = text.trim();
  if (!refs.length) return t;
  const labels = refs.map((r) => r.label).join(" · ");
  const prefix = `About: ${labels}`;
  if (!t) return prefix;
  return `${prefix}\n\n${t}`;
}

/** Focus the main storefront prompt (floating dock or AI follow-up). */
export function focusStorefrontPromptInput(): void {
  requestAnimationFrame(() => {
    document.querySelector<HTMLElement>("[data-storefront-search-field]")?.focus();
  });
}
