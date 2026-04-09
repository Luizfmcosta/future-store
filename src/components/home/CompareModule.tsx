"use client";

import { AskImageButton } from "@/components/shared/AskImageButton";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { getProductByIdLocalized } from "@/lib/product-i18n";
import { useT } from "@/lib/useT";
import { cn, hasMediaUrl } from "@/lib/utils";
import { useShopperExperienceOptional } from "@/context/ShopperExperienceContext";
import { useDemoStore } from "@/store/demoStore";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const ease = [0.76, 0, 0.24, 1] as const;
const stagger = { staggerChildren: 0.08 };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export function CompareModule() {
  const profile = useDemoStore((s) => s.activeProfile);
  const experienceCtx = useShopperExperienceOptional();
  const t = useT();
  const id =
    experienceCtx?.compareProductId ??
    (profile === "marina" ? "sb-arc-ultra" : "sb-ray");
  const product = getProductByIdLocalized(id);
  if (!product) return null;

  const heroSrc = hasMediaUrl(product.heroImage) ? product.heroImage : null;

  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-5 py-10 sm:px-6 sm:py-12 @lg:flex-row @lg:items-center @lg:gap-10 @lg:py-14">
        <motion.div
          variants={{ hidden: {}, show: stagger }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="flex min-w-0 flex-1 flex-col items-start @lg:basis-1/2 @lg:py-2"
        >
          <motion.div variants={fadeUp}>
            <EyebrowPill>
              {profile === "marina" ? t("compare.marinaEyebrow") : t("compare.ricardoEyebrow")}
            </EyebrowPill>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mt-3.5 whitespace-pre-line text-balance text-pretty text-left text-[clamp(1.3rem,4vw,1.8rem)] font-medium leading-[1.2] tracking-[-0.02em] text-[#1a1a1a]"
          >
            {profile === "marina" ? t("compare.marinaHeadline") : t("compare.ricardoHeadline")}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-3 max-w-[40ch] text-left text-[15px] font-light leading-[1.65] text-[#888] sm:text-[17px] sm:leading-[1.65]"
          >
            {profile === "marina" ? t("compare.marinaBody") : t("compare.ricardoBody")}
          </motion.p>

          <motion.div variants={fadeUp}>
            <Link
              href={`/product/${product.id}`}
              className="mt-5 inline-flex h-11 w-fit items-center justify-center rounded-full bg-[#1a1a1a] px-6 text-[15px] font-medium text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97] sm:text-[16px]"
            >
              {experienceCtx
                ? t(experienceCtx.experience.copy.compareCta)
                : profile === "marina"
                  ? t("compare.marinaCta")
                  : t("compare.ricardoCta")}
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease }}
          className="w-full min-w-0 flex-1 @lg:basis-1/2"
        >
          <AskImageButton
            productLabel={product.title}
            productId={product.id}
            className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#f5f5f5]"
          >
            {heroSrc ? (
              <div className="relative h-full w-full">
                <Image
                  src={heroSrc}
                  alt=""
                  fill
                  className={cn(
                    profile === "ricardo" ? "object-cover object-center" : "object-contain p-5 sm:p-6",
                  )}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                />
              </div>
            ) : (
              <EmptyMediaSlot className="relative min-h-[10rem]" variant="light" />
            )}
          </AskImageButton>
        </motion.div>
      </div>
    </section>
  );
}
