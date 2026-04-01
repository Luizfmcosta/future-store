"use client";

import { CompareAlternativesWidget } from "@/components/pdp/CompareAlternativesWidget";
import { CompatibilityWidget } from "@/components/pdp/CompatibilityWidget";
import { FitInsightWidget } from "@/components/pdp/FitInsightWidget";
import { PolicySummaryWidget } from "@/components/pdp/PolicySummaryWidget";
import { ProductHero } from "@/components/pdp/ProductHero";
import { ReviewSummaryWidget } from "@/components/pdp/ReviewSummaryWidget";
import { getProductById } from "@/data/products";
import { getPdpInsights } from "@/lib/recommendations";
import { useDemoStore } from "@/store/demoStore";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "";
  const product = id ? getProductById(id) : undefined;
  const profile = useDemoStore((s) => s.activeProfile);
  const aiMode = useDemoStore((s) => s.aiMode);
  const setSelected = useDemoStore((s) => s.setSelectedProduct);
  const addToCart = useDemoStore((s) => s.addToCart);

  useEffect(() => {
    if (!id) return;
    const p = getProductById(id);
    if (p) setSelected(p.id);
  }, [id, setSelected]);

  if (!product) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-[#0f1118]/80 p-10 text-center text-[#9aa3b8]">
        Product not found.
      </div>
    );
  }

  const insights = getPdpInsights(profile, product);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-lg px-1 py-1 text-[13px] font-semibold text-[#9ca8b8] transition-colors duration-150 ease-out hover:bg-white/[0.06] hover:text-[#eef1f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/25"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <Link
          href="/search"
          className="rounded-lg px-2 py-1 text-[13px] font-semibold text-[#9ca8b8] transition-colors duration-150 ease-out hover:bg-white/[0.06] hover:text-[#eef1f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/25"
        >
          Open search
        </Link>
      </motion.div>

      <ProductHero product={product} profile={profile} />

      {aiMode ? (
        <FitInsightWidget title={insights.idealTitle} body={insights.idealBody} />
      ) : (
        <div className="rounded-[1.75rem] border border-white/[0.07] bg-[#0f1118]/80 p-5 text-[14px] text-[#aeb6ca]">
          {product.bestFor[0]}
        </div>
      )}

      {aiMode ? (
        <CompareAlternativesWidget product={product} alt={insights.valueAlt} profile={profile} />
      ) : null}

      <ReviewSummaryWidget product={product} profile={profile} />

      <PolicySummaryWidget product={product} />

      <CompatibilityWidget product={product} />

      <div className="sticky bottom-4 z-20 border-t border-white/[0.08] bg-[#060708]/92 py-4 backdrop-blur-xl supports-[backdrop-filter]:bg-[#060708]/85">
        <button
          type="button"
          onClick={() => {
            if (product.category === "tv") {
              addToCart(product.id);
            } else {
              router.push(`/product/tv-pulse-led-55`);
            }
          }}
          className="w-full min-h-[40px] rounded-full bg-[#eef1f7] py-2.5 text-[12px] font-semibold leading-tight tracking-tight text-[#0b0c0f] transition hover:bg-white"
        >
          {product.category === "tv" ? "Add to cart" : "View TVs to pair"}
        </button>
      </div>
    </div>
  );
}
