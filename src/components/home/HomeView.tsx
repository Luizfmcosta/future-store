"use client";

import { AdaptiveHero } from "@/components/home/AdaptiveHero";
import { CompareModule } from "@/components/home/CompareModule";
import { ContinueJourney } from "@/components/home/ContinueJourney";
import { CuratedForYou } from "@/components/home/CuratedForYou";
import { HomeFooter } from "@/components/home/HomeFooter";
import { HomeLoadingReveal } from "@/components/home/HomeLoadingReveal";
import { MerchStrip } from "@/components/home/MerchStrip";
import { ProductSpotlight } from "@/components/home/ProductSpotlight";
import { SocialProofModule } from "@/components/home/SocialProofModule";
import { useShopperExperience } from "@/context/ShopperExperienceContext";
import type { HomeModuleKey } from "@/types";
import type { ReactNode } from "react";

const map: Record<HomeModuleKey, ReactNode> = {
  hero: <AdaptiveHero key="hero" />,
  continue: <ContinueJourney key="continue" />,
  curated: <CuratedForYou key="curated" />,
  compare: <CompareModule key="compare" />,
  spotlight: <ProductSpotlight key="spotlight" />,
  proof: <SocialProofModule key="proof" />,
  strip: <MerchStrip key="strip" />,
};

export function HomeView() {
  const { experience } = useShopperExperience();
  const order = experience.moduleOrder;

  return (
    <div className="relative flex flex-col">
      <HomeLoadingReveal />
      {order.map((key) => {
        const node = map[key];
        return node ? <div key={key}>{node}</div> : null;
      })}
      <HomeFooter />
    </div>
  );
}
