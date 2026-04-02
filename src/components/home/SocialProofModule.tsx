"use client";

import { proofTitle } from "@/lib/copy";
import { Card } from "@/components/shared/Card";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { StatPill } from "@/components/shared/StatPill";
import { WhySeeingThis } from "@/components/home/WhySeeingThis";
import { ui } from "@/lib/ui-tokens";
import { useDemoStore } from "@/store/demoStore";
import { motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";

export function SocialProofModule() {
  const profile = useDemoStore((s) => s.activeProfile);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <SectionTitle title={proofTitle(profile)} eyebrow="Proof" />
      <Card className="p-5 sm:p-6">
        <div className="space-y-4">
          {profile === "marina" ? (
            <>
              <p className={ui.body}>
                Owners frequently cite contrast stability, color accuracy, and HDMI headroom — especially paired with eARC soundbars.
              </p>
              <div className="flex flex-wrap gap-2">
                <StatPill icon={<Star className="h-3.5 w-3.5 text-[#b0b8c8]" />} label="Panel uniformity" />
                <StatPill icon={<Star className="h-3.5 w-3.5 text-[#b0b8c8]" />} label="HDR fidelity" />
                <StatPill label="eARC clarity" />
              </div>
            </>
          ) : (
            <>
              <p className={ui.body}>
                High sell-through this month on 50–55&quot; sets — strong financing adoption and fast delivery slots.
              </p>
              <div className="flex flex-wrap gap-2">
                <StatPill icon={<TrendingUp className="h-3.5 w-3.5 text-[#b0b8c8]" />} label="Volume leader · 55&quot;" />
                <StatPill label="Installment uptake" />
                <StatPill label="Sponsored · in-stock" />
              </div>
            </>
          )}
        </div>
        <WhySeeingThis />
      </Card>
    </motion.section>
  );
}
