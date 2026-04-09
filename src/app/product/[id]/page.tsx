"use client";

import { CompareAlternativesWidget } from "@/components/pdp/CompareAlternativesWidget";
import { CompatibilityWidget } from "@/components/pdp/CompatibilityWidget";
import { PdpChatOverlay } from "@/components/pdp/PdpChatOverlay";
import { PdpFixedBar } from "@/components/pdp/PdpFixedBar";
import { FitInsightWidget } from "@/components/pdp/FitInsightWidget";
import { PdpBackButton } from "@/components/pdp/PdpBackButton";
import { PdpLeadColumn } from "@/components/pdp/PdpLeadColumn";
import { PdpMediaGallery } from "@/components/pdp/PdpMediaGallery";
import { PdpSection } from "@/components/pdp/PdpSection";
import { PolicySummaryWidget } from "@/components/pdp/PolicySummaryWidget";
import { ProductPdpFeatures } from "@/components/pdp/ProductPdpFeatures";
import { ProductStorySection } from "@/components/pdp/ProductStorySection";
import { ReviewSummaryWidget } from "@/components/pdp/ReviewSummaryWidget";
import { getProductById } from "@/data/products";
import { recordProductView } from "@/lib/shopperSignalsStorage";
import { getPdpInsights } from "@/lib/recommendations";
import { useT } from "@/lib/useT";
import { useDemoStore } from "@/store/demoStore";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const t = useT();
  const id = typeof params?.id === "string" ? params.id : "";
  const product = id ? getProductById(id) : undefined;
  const profile = useDemoStore((s) => s.activeProfile);
  const aiMode = useDemoStore((s) => s.aiMode);
  const setSelected = useDemoStore((s) => s.setSelectedProduct);
  const closePdpChatOverlay = useDemoStore((s) => s.closePdpChatOverlay);

  useEffect(() => {
    closePdpChatOverlay();
  }, [id, closePdpChatOverlay]);

  useEffect(() => {
    return () => {
      closePdpChatOverlay();
    };
  }, [closePdpChatOverlay]);

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
    <div className="relative flex min-h-0 w-full flex-1 flex-col bg-white">
      <div
        data-pdp-scroll
        className="min-h-0 flex-1 overflow-y-auto overflow-x-clip scroll-smooth scrollbar-none"
      >
        <div className="pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] sm:pb-[calc(6rem+env(safe-area-inset-bottom,0px))]">
          <div className="max-w-3xl pt-6 sm:pt-9">
            <div className="mb-3 sm:mb-4">
              <PdpBackButton />
            </div>
          </div>

          <div className="-mx-4 sm:-mx-6">
            <PdpMediaGallery product={product} />
          </div>

          <div className="mx-auto mt-8 max-w-2xl">
            <PdpLeadColumn product={product} profile={profile} />
          </div>

          {!aiMode ? (
            <div className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-neutral-600">
              <span className="font-medium text-neutral-900">{t("pdp.recommendedFor")}</span>{" "}
              {product.bestFor[0] ?? "—"}
            </div>
          ) : null}

          <PdpSection>
            <div className="mx-auto max-w-2xl">
              <ProductPdpFeatures product={product} />
            </div>
          </PdpSection>

          <PdpSection>
            <div className="mx-auto max-w-2xl">
              <ProductStorySection product={product} />
            </div>
          </PdpSection>

          {aiMode ? (
            <PdpSection>
              <div className="mx-auto max-w-2xl">
                <FitInsightWidget title={insights.idealTitle} body={insights.idealBody} />
              </div>
            </PdpSection>
          ) : null}

          {aiMode ? (
            <PdpSection>
              <div className="mx-auto max-w-2xl">
                <CompareAlternativesWidget product={product} alt={insights.valueAlt} profile={profile} />
              </div>
            </PdpSection>
          ) : null}

          <PdpSection>
            <div className="mx-auto max-w-2xl">
              <ReviewSummaryWidget product={product} profile={profile} />
            </div>
          </PdpSection>

          <PdpSection>
            <div className="mx-auto max-w-2xl">
              <PolicySummaryWidget product={product} />
            </div>
          </PdpSection>

          <PdpSection className="border-b-0">
            <div className="mx-auto max-w-2xl">
              <CompatibilityWidget product={product} />
            </div>
          </PdpSection>
        </div>
      </div>

      <PdpFixedBar product={product} />
      <PdpChatOverlay product={product} />
    </div>
  );
}
