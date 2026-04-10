"use client";

import { HomeFooterBleed } from "@/components/home/HomeFooter";
import { CompareAlternativesWidget } from "@/components/pdp/CompareAlternativesWidget";
import { CompatibilityWidget } from "@/components/pdp/CompatibilityWidget";
import { PdpChatOverlay } from "@/components/pdp/PdpChatOverlay";
import { PdpSearchResultsOverlay } from "@/components/pdp/PdpSearchResultsOverlay";
import { FitInsightWidget } from "@/components/pdp/FitInsightWidget";
import { PdpFirstSection } from "@/components/pdp/PdpFirstSection";
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
import { useEffect, useMemo, useState } from "react";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const t = useT();
  const id = typeof params?.id === "string" ? params.id : "";
  const product = id ? getProductById(id) : undefined;
  const profile = useDemoStore((s) => s.activeProfile);
  const aiMode = useDemoStore((s) => s.aiMode);
  const setSelected = useDemoStore((s) => s.setSelectedProduct);
  const addPromptProductRef = useDemoStore((s) => s.addPromptProductRef);
  const closePdpChatOverlay = useDemoStore((s) => s.closePdpChatOverlay);
  const closePdpSearchOverlay = useDemoStore((s) => s.closePdpSearchOverlay);
  useEffect(() => {
    closePdpChatOverlay();
    closePdpSearchOverlay();
  }, [id, closePdpChatOverlay, closePdpSearchOverlay]);

  useEffect(() => {
    return () => {
      closePdpChatOverlay();
      closePdpSearchOverlay();
    };
  }, [closePdpChatOverlay, closePdpSearchOverlay]);

  useEffect(() => {
    if (!id) return;
    const p = getProductById(id);
    if (p) setSelected(p.id);
  }, [id, setSelected]);

  /** Keep the current PDP product chip in the prompt for the whole session on this page. */
  useEffect(() => {
    if (!product) return;
    addPromptProductRef({ productId: product.id, label: product.title });
  }, [product, addPromptProductRef]);

  useEffect(() => {
    if (product?.id) recordProductView(product.id);
  }, [product?.id]);

  const [colorChoice, setColorChoice] = useState<string | null>(null);

  const selectedColorKey = useMemo(() => {
    if (!product?.colorOptions?.length) return "";
    if (colorChoice && product.colorOptions.some((o) => o.labelKey === colorChoice)) {
      return colorChoice;
    }
    return product.colorOptions[0]?.labelKey ?? "";
  }, [product, colorChoice]);

  const imageTintHex = useMemo(
    () => product?.colorOptions?.find((o) => o.labelKey === selectedColorKey)?.swatchHex,
    [product?.colorOptions, selectedColorKey],
  );

  if (!product) {
    return (
      <div className="w-full min-w-0 bg-[#121212]">
        <div className="min-w-0 bg-white px-4 sm:px-6">
          <div className="space-y-16 sm:space-y-20">
            <div className="rounded-2xl border border-stone-200/90 bg-stone-50 p-10 text-center text-stone-600">
              {t("pdp.notFound")}
            </div>
          </div>
        </div>
        <HomeFooterBleed className="mt-16 sm:mt-20" bleed={false} dockClearance={false} />
      </div>
    );
  }

  const insights = getPdpInsights(profile, product);

  return (
    <div className="relative w-full min-w-0 bg-[#121212]">
      <div className="min-w-0 overflow-x-hidden bg-white px-4 sm:px-6">
        <PdpFirstSection
          product={product}
          profile={profile}
          selectedColorKey={selectedColorKey}
          onSelectedColorKeyChange={setColorChoice}
          imageTintHex={imageTintHex}
        />

        <PdpSection className="mt-6 border-t border-black/[0.06] sm:mt-10">
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

      <HomeFooterBleed className="mt-16 sm:mt-20" bleed={false} dockClearance={false} />

      <PdpChatOverlay />
      <PdpSearchResultsOverlay />
    </div>
  );
}
