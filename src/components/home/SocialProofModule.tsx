"use client";

import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { useShopperExperienceOptional } from "@/context/ShopperExperienceContext";
import { useDemoStore } from "@/store/demoStore";
import { useT } from "@/lib/useT";
import { motion } from "framer-motion";
import Link from "next/link";

const ease = [0.76, 0, 0.24, 1] as const;
const stagger = { staggerChildren: 0.1 };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export function SocialProofModule() {
  const profile = useDemoStore((s) => s.activeProfile);
  const experienceCtx = useShopperExperienceOptional();
  const t = useT();

  return (
    <section className="flex flex-col bg-white">
      <motion.div
        variants={{ hidden: {}, show: stagger }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="flex w-full flex-col items-start px-4 pb-6 pt-8 text-left sm:px-6 sm:pb-7 sm:pt-9"
      >
        <motion.div variants={fadeUp}>
          <EyebrowPill>{t("socialProof.club")}</EyebrowPill>
        </motion.div>

        <motion.h2
          variants={fadeUp}
          className="mt-3.5 max-w-[min(100%,22rem)] whitespace-pre-line font-[family-name:var(--font-display)] text-[clamp(1.15rem,3.2vw,1.5rem)] font-medium leading-[1.2] tracking-[-0.015em] text-[#1a1a1a]"
        >
          {experienceCtx
            ? t(experienceCtx.experience.copy.socialHeadline)
            : profile === "marina"
              ? t("socialProof.marinaHeadline")
              : t("socialProof.ricardoHeadline")}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mt-2.5 max-w-[min(100%,26rem)] text-[11.5px] font-light leading-[1.65] text-stone-500 sm:text-[12px]"
        >
          {experienceCtx
            ? t(experienceCtx.experience.copy.socialBody)
            : profile === "marina"
              ? t("socialProof.marinaBody")
              : t("socialProof.ricardoBody")}
        </motion.p>

        <motion.div variants={fadeUp} className="self-start">
          <Link
            href="/search"
            className="mt-6 inline-flex h-10 min-h-[44px] items-center justify-center rounded-full bg-[#1a1a1a] px-6 text-[11px] font-medium text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97]"
          >
            {experienceCtx ? t(experienceCtx.experience.copy.socialCta) : t("common.explore")}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
