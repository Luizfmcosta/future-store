"use client";

import { AskImageButton } from "@/components/shared/AskImageButton";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { homeStaggerParentMotionWide } from "@/lib/homeScrollReveal";
import { useOnline } from "@/lib/hooks/useOnline";
import { getProductByIdLocalized } from "@/lib/product-i18n";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
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

export function ContinueJourney() {
  const profile = useDemoStore((s) => s.activeProfile);
  const experienceCtx = useShopperExperienceOptional();
  const t = useT();
  const online = useOnline();
  const reveal = homeStaggerParentMotionWide(online);
  /* Marina copy is always Stage/soundbar editorial; don’t pair it with “recent PDP” IDs. */
  const id =
    profile === "marina"
      ? "sb-beam-g2"
      : (experienceCtx?.continueProductId ?? "sp-era-300");
  const product = getProductByIdLocalized(id);
  if (!product) return null;

  const heroSrc = hasMediaUrl(product.heroImage) ? product.heroImage : null;

  const isReturning = experienceCtx?.signals.isReturning ?? false;
  const useRicardoEntryCopy = profile === "ricardo" && (!experienceCtx || !isReturning);

  const headline = useRicardoEntryCopy
    ? t("continueJourney.ricardoEntryHeadline")
    : experienceCtx
      ? t(experienceCtx.experience.copy.continueHeadline)
      : profile === "marina"
        ? t("continueJourney.marinaHeadline")
        : t("continueJourney.headline");

  const body =
    useRicardoEntryCopy
      ? t("continueJourney.ricardoEntryBody")
      : experienceCtx
        ? t(experienceCtx.experience.copy.continueBody)
        : profile === "marina"
          ? t("continueJourney.marinaBody")
          : t("continueJourney.ricardoBody");

  const cta = useRicardoEntryCopy
    ? t("continueJourney.ricardoEntryCta")
    : experienceCtx
      ? t(experienceCtx.experience.copy.continueCta)
      : profile === "marina"
        ? t("continueJourney.marinaCta")
        : t("continueJourney.exploreBrand", { brand: product.brand });

  return (
    <section className={cn("bg-white", ui.home.whiteSectionOnDarkCanvas)}>
      <motion.div
        variants={{ hidden: {}, show: stagger }}
        {...reveal}
        className="mx-auto flex max-w-[1200px] flex-col gap-8 px-5 pt-10 pb-20 sm:px-6 sm:pt-12 sm:pb-24 @lg:flex-row @lg:items-center @lg:gap-10 @lg:pt-14 @lg:pb-28"
      >
        <div className="flex min-w-0 flex-1 flex-col items-start @lg:basis-1/2">
          <motion.div variants={fadeUp}>
            <EyebrowPill>
              {profile === "marina"
                ? t("continueJourney.marinaEyebrow")
                : useRicardoEntryCopy && profile === "ricardo"
                  ? t("continueJourney.ricardoEntryEyebrow")
                  : product.category === "speaker"
                    ? t("common.speakers")
                    : t("common.audio")}
            </EyebrowPill>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-2 w-full">
            <h2
              className={cn(
                "max-w-[min(100%,26ch)] text-left text-[clamp(1.2rem,3.8vw,1.85rem)] font-medium leading-[1.15] tracking-[-0.02em] text-[#1a1a1a]",
                profile === "marina" || (useRicardoEntryCopy && profile === "ricardo")
                  ? "text-balance whitespace-normal text-pretty"
                  : "whitespace-pre-line text-balance text-pretty",
              )}
            >
              {headline}
            </h2>
            <p className="mt-12 text-pretty text-[clamp(1.05rem,3.2vw,1.25rem)] font-medium leading-snug tracking-[-0.015em] text-[#444] sm:mt-14">
              {profile === "marina"
                ? t("continueJourney.marinaProductLine")
                : useRicardoEntryCopy && profile === "ricardo"
                  ? t("continueJourney.ricardoEntryProductLine")
                  : product.title.split("—")[0].trim()}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-2.5 w-full">
            <p className="max-w-[42ch] text-balance text-pretty text-left text-[15px] font-normal leading-[1.65] text-[#888] sm:text-[17px] sm:leading-[1.65]">
              {body}
            </p>

            <Link
              href={`/product/${product.id}`}
              className={cn(
                ui.home.focusRing,
                ui.home.ctaPrimaryFill,
                "mt-5 inline-flex h-11 w-fit items-center justify-center px-6 text-[15px] sm:text-[16px]",
              )}
            >
              {cta}
            </Link>
          </motion.div>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 1.04 },
            show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease } },
          }}
          className="w-full min-w-0 flex-1 @lg:basis-1/2"
        >
          <AskImageButton
            productLabel={product.title}
            productId={product.id}
            className="aspect-square w-full overflow-hidden rounded-xl bg-[#f5f5f5]"
          >
            {heroSrc ? (
              <div className="relative h-full w-full">
                <Image
                  src={heroSrc}
                  alt=""
                  fill
                  className="object-contain object-center p-5 sm:p-6"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                />
              </div>
            ) : (
              <EmptyMediaSlot className="relative min-h-[10rem]" variant="light" />
            )}
          </AskImageButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
