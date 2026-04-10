import { products } from "@/data/products";

/**
 * Compact catalog snapshot for chat LLM prompts.
 * Keeps answers grounded in {@link products} and Future Store only.
 */
export function formatCatalogForChatLlm(): string {
  const lines = products.map((p) => {
    const title = p.title.replace(/\s+/g, " ").trim();
    return `- id: ${p.id} | category: ${p.category} | ${p.brand} | ${title} | ${p.price} BRL`;
  });
  return [
    "SCOPE — You are ONLY for the Future Store demo storefront (this site). Every answer must relate to Future Store: its products below, shopping on this site, or the shopper’s current page context.",
    "Do not answer unrelated topics (other stores, general life advice, or unrelated industries). If the question is off-topic, reply briefly that you only help with Future Store products and navigation, then offer one relevant catalog angle.",
    "Do not send shoppers to other retailers, marketplaces, or price-comparison sites. Stay inside Future Store.",
    "",
    "AUTHORITATIVE CATALOG — These are the ONLY products sold here.",
    "You MUST only name, compare, or recommend products from the lines below (match by id or title).",
    "Do not mention or recommend any real-world brand, retailer SKU, or product that does not appear in this list.",
    "Do not invent models. If the shopper asks for something not listed, say it is not in Future Store and suggest the closest option from the list.",
    "",
    ...lines,
  ].join("\n");
}
