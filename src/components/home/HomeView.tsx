"use client";

import { AdaptiveHero } from "@/components/home/AdaptiveHero";
import { CompareModule } from "@/components/home/CompareModule";
import { ContinueJourney } from "@/components/home/ContinueJourney";
import { CuratedForYou } from "@/components/home/CuratedForYou";
import { HomeFooter } from "@/components/home/HomeFooter";
import { HomeLoadingReveal } from "@/components/home/HomeLoadingReveal";
import { HomeWelcomeGate } from "@/components/home/HomeWelcomeGate";
import { MerchStrip } from "@/components/home/MerchStrip";
import { ProductSpotlight } from "@/components/home/ProductSpotlight";
import { RicardoTikTokCarousel } from "@/components/home/RicardoTikTokCarousel";
import { useShopperExperience } from "@/context/ShopperExperienceContext";
import type { HomeModuleKey } from "@/types";
import type { ReactNode } from "react";

const map: Record<HomeModuleKey, ReactNode> = {
  hero: <AdaptiveHero key="hero" />,
  continue: <ContinueJourney key="continue" />,
  curated: <CuratedForYou key="curated" />,
  compare: <CompareModule key="compare" />,
  spotlight: <ProductSpotlight key="spotlight" />,
  strip: <MerchStrip key="strip" />,
  tiktok: <RicardoTikTokCarousel key="tiktok" />,
};

export function HomeView() {
  const { experience } = useShopperExperience();
  const order = experience.moduleOrder;

  return (
    <div className="relative flex min-h-full flex-col">
      <div className="flex flex-col">
        <HomeWelcomeGate />
        <HomeLoadingReveal />
        {order.map((key) => {
          const node = map[key];
          return node ? <div key={key}>{node}</div> : null;
        })}
      </div>
      <div className="shrink-0">
        <HomeFooter />
      </div>
    </div>
  );
}
