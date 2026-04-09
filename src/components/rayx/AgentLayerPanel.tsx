"use client";

import { getProductById } from "@/data/products";
import { getAgentSurface } from "@/lib/agentSurface";
import { formatBRL } from "@/lib/utils";
import type { ShopperProfileId } from "@/types";

export function AgentLayerPanel({ skuId, profile }: { skuId: string | null; profile: ShopperProfileId }) {
  const p = skuId ? getProductById(skuId) : getProductById("sp-era-300");
  if (!p) return null;
  const a = getAgentSurface(p, profile);

  const rows: { k: string; v: string }[] = [
    { k: "sku", v: a.sku },
    { k: "title", v: a.title },
    { k: "price", v: formatBRL(a.price) },
    { k: "availability", v: String(a.availability) },
    { k: "deliveryPromise", v: a.deliveryPromise },
    { k: "returns", v: a.returns },
    { k: "warranty", v: p.warrantyShort },
    { k: "compatibility", v: a.compatibility.join(", ") },
    { k: "bundleEligible", v: a.bundleEligible ? "true" : "false" },
    { k: "confidenceScore", v: a.confidenceScore.toFixed(2) },
  ];

  return (
    <div className="rounded-2xl border border-white/[0.1] bg-white/[0.03] p-4 font-sans text-[11px] tabular-nums text-[#c5ccdf]">
      <pre className="overflow-x-auto whitespace-pre-wrap scrollbar-none">
        {JSON.stringify(
          Object.fromEntries(rows.map((r) => [r.k, r.v])),
          null,
          2
        )}
      </pre>
    </div>
  );
}
