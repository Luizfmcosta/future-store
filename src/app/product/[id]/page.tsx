"use client";

import { CompareAlternativesWidget } from "@/components/pdp/CompareAlternativesWidget";
import { CompatibilityWidget } from "@/components/pdp/CompatibilityWidget";
import { FitInsightWidget } from "@/components/pdp/FitInsightWidget";
import { PolicySummaryWidget } from "@/components/pdp/PolicySummaryWidget";
import { ProductHero } from "@/components/pdp/ProductHero";
import { ReviewSummaryWidget } from "@/components/pdp/ReviewSummaryWidget";
import { useLocale } from "@/context/LocaleContext";
import { getProductById } from "@/data/products";
import { getProductByIdLocalized } from "@/lib/product-i18n";
import { recordProductView } from "@/lib/shopperSignalsStorage";
import { getPdpInsights } from "@/lib/recommendations";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, Search } from "lucide-react";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { locale } = useLocale();
  const t = useT();
  const id = typeof params?.id === "string" ? params.id : "";
  const product = id ? getProductByIdLocalized(id, locale) : undefined;
  const profile = useDemoStore((s) => s.activeProfile);
  const aiMode = useDemoStore((s) => s.aiMode);
  const setSelected = useDemoStore((s) => s.setSelectedProduct);
  const addToCart = useDemoStore((s) => s.addToCart);
  useEffect(() => {
    if (!id) return;
    const p = getProductById(id);
    if (p) setSelected(p.id);
  }, [id, setSelected]);

  useEffect(() => {
    if (product?.id) recordProductView(product.id);
  }, [product?.id]);

  if (!product) {
    return (
      <div className="rounded-2xl border border-stone-200/90 bg-stone-50 p-10 text-center text-stone-600">
        {t("pdp.notFound")}
      </div>
    );
  }

  const insights = getPdpInsights(profile, product);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden scroll-smooth pb-4">
        <div className="flex flex-col space-y-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-lg px-1 py-1 text-[13px] font-semibold text-stone-600 transition-colors duration-150 ease-out hover:bg-stone-100 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-stone-400/40"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("pdp.back")}
            </button>
          </motion.div>

          <ProductHero product={product} profile={profile} />

          {aiMode ? (
            <FitInsightWidget title={insights.idealTitle} body={insights.idealBody} />
          ) : (
            <div className="rounded-[1.75rem] border border-stone-200/90 bg-stone-50/90 p-5 text-[14px] text-stone-600">
              <span className="font-medium text-stone-800">{t("pdp.recommendedFor")}</span>{" "}
              {product.bestFor[0] ?? "—"}
            </div>
          )}

          {aiMode ? (
            <CompareAlternativesWidget product={product} alt={insights.valueAlt} profile={profile} />
          ) : null}

          <ReviewSummaryWidget product={product} profile={profile} />

          <PolicySummaryWidget product={product} />

          <CompatibilityWidget product={product} />
        </div>
      </div>

      <div className="relative z-20 shrink-0 border-t border-stone-200/90 bg-white/95 px-1 py-4 backdrop-blur-xl supports-[backdrop-filter]:bg-white/90 sm:px-2">
        <div className="flex min-h-0 items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/search")}
            className={cn(
              "inline-flex h-11 shrink-0 items-center justify-center gap-1 rounded-full border border-stone-200/90 bg-stone-50 text-[11px] font-semibold leading-none text-stone-700 shadow-sm transition hover:border-stone-300/90 hover:bg-stone-100",
              locale === "pt-BR" ? "w-[6.75rem] px-3" : "w-[5.25rem] px-2.5",
            )}
          >
            <Search className="size-3.5 shrink-0 opacity-90" strokeWidth={2} aria-hidden />
            <span className="leading-none">{t("pdp.ask")}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (product.category === "tv" || product.category === "speaker") {
                addToCart(product.id);
              } else {
                router.push(`/product/sp-era-100`);
              }
            }}
            className="inline-flex h-11 min-w-0 flex-1 items-center justify-center rounded-full bg-stone-900 px-4 text-[12px] font-semibold leading-none tracking-tight text-white transition hover:bg-stone-800"
          >
            {product.category === "tv" || product.category === "speaker"
              ? t("pdp.addToCart")
              : t("pdp.pairSpeakers")}
          </button>
        </div>
      </div>
    </div>
  );
}
