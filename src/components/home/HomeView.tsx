"use client";

import { AdaptiveHero } from "@/components/home/AdaptiveHero";
import { CompareModule } from "@/components/home/CompareModule";
import { ContinueJourney } from "@/components/home/ContinueJourney";
import { CuratedForYou } from "@/components/home/CuratedForYou";
import { MerchStrip } from "@/components/home/MerchStrip";
import { SocialProofModule } from "@/components/home/SocialProofModule";
import { getHomeModules } from "@/lib/personalization";
import { useDemoStore } from "@/store/demoStore";
import type { HomeModuleKey } from "@/types";
import type { ReactNode } from "react";

const map: Record<HomeModuleKey, ReactNode> = {
  hero: <AdaptiveHero key="hero" />,
  continue: <ContinueJourney key="continue" />,
  curated: <CuratedForYou key="curated" />,
  compare: <CompareModule key="compare" />,
  proof: <SocialProofModule key="proof" />,
  strip: <MerchStrip key="strip" />,
};

export function HomeView() {
  const profile = useDemoStore((s) => s.activeProfile);
  const order = getHomeModules(profile);

  return (
    <div className="flex flex-col gap-10 sm:gap-14">
      {order.map((key) => (
        <div key={key}>{map[key]}</div>
      ))}
    </div>
  );
}
