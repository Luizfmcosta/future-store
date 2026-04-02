/** Merchant-visible rule labels for X-Ray / narrative */
export const merchantRules = [
  { id: "mr-1", label: "Merchandising zones", detail: "Hero, strip, and compare slots ranked by segment + margin tier caps." },
  { id: "mr-2", label: "Pricing & bundles", detail: "Combo savings computed from category affinity; warranty attach rules by price band." },
  { id: "mr-3", label: "Campaign eligibility", detail: "Sponsored placements flagged; frequency caps per session in demo." },
  { id: "mr-4", label: "Delivery promise", detail: "ETA strings surfaced by SKU stock + carrier profile (mocked deterministic)." },
  { id: "mr-5", label: "Compatibility enrichment", detail: "Tags merged from product + accessory graph for PDP and agents." },
  { id: "mr-6", label: "Social proof type", detail: "Technical excerpts vs. volume sold — selected by shopper proof preference." },
];
