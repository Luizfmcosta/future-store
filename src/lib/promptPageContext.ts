import type { PromptSubmitPageContext } from "@/types";

/** Human-readable block for the LLM system prompt. */
export function formatPromptPageContextForLlm(ctx: PromptSubmitPageContext | null): string {
  if (!ctx) {
    return "The customer opened the AI search tab directly or context was not recorded.";
  }
  switch (ctx.kind) {
    case "plp":
      return [
        "The customer was on the product listing / search results page (PLP) when they sent this message.",
        `Path: ${ctx.pathname}`,
        `URL query string: ${ctx.searchParamsSnapshot || "(none)"}`,
      ].join("\n");
    case "pdp":
      return [
        "The customer was on a product detail page (PDP) when they sent this message.",
        `Path: ${ctx.pathname}`,
        `Product id: ${ctx.productId}`,
        ctx.productTitle ? `Product title: ${ctx.productTitle}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    case "cart":
      return [
        "The customer had the shopping cart drawer open when they sent this message.",
        `Path: ${ctx.pathname}`,
        ctx.cartLineId
          ? `Cart line product id: ${ctx.cartLineId} (qty ${ctx.cartQuantity})`
          : "Cart appears empty (no line item).",
        ctx.cartProductTitle ? `Product in cart: ${ctx.cartProductTitle}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    default: {
      const _exhaustive: never = ctx;
      return _exhaustive;
    }
  }
}

/** Prompt submit always opens Chat first; Results stays available as a tab. */
export function shouldOpenAiSearchTab(_opts: {
  pathname: string;
  searchView: "results" | "ai";
  cartDrawerOpen: boolean;
}): boolean {
  return true;
}
