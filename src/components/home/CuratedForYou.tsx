"use client";

import { getTvs } from "@/data/products";
import { Card } from "@/components/shared/Card";
import { HorizontalScroll } from "@/components/shared/HorizontalScroll";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { ui } from "@/lib/ui-tokens";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { cn, formatBRL, hasMediaUrl } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const cardMotion = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

export function CuratedForYou() {
  const profile = useDemoStore((s) => s.activeProfile);
  const tvs = getTvs();
  const sorted =
    profile === "marina"
      ? [...tvs].sort((a, b) => b.price - a.price || (b.inches ?? 0) - (a.inches ?? 0))
      : [...tvs].sort((a, b) => a.price - b.price);

  const label = profile === "marina" ? "Premium TVs · 55\" and above" : "Cost-benefit TVs · clearest value";

  return (
    <motion.section {...cardMotion}>
      <SectionTitle title="Curated for you" eyebrow="Merchandising" />
      <p className={cn(ui.body, "mb-4")}>{label}</p>
      <HorizontalScroll>
        {sorted.slice(0, 4).map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            className="flex-[0_0_85%] max-w-[280px] shrink-0 snap-start sm:flex-[0_0_260px]"
          >
            <Card className="flex h-full flex-col overflow-hidden p-0">
              <div className="relative aspect-[4/3] w-full shrink-0 bg-[#060708]">
                {hasMediaUrl(p.heroImage) ? (
                  <Image
                    src={p.heroImage}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="(max-width: 440px) 85vw, 260px"
                    unoptimized
                  />
                ) : (
                  <EmptyMediaSlot className="absolute inset-0" />
                )}
              </div>
              <div className="flex min-h-[112px] flex-col p-4">
                <p className={ui.label}>{p.brand}</p>
                <p className={cn(ui.cardTitle, "mt-1 line-clamp-2 min-h-[2.5rem]")}>{p.title}</p>
                <div className="mt-auto flex items-baseline gap-2 pt-2">
                  <span className={ui.price}>{formatBRL(p.price)}</span>
                  {p.oldPrice ? <span className={ui.priceMuted}>{formatBRL(p.oldPrice)}</span> : null}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </HorizontalScroll>
    </motion.section>
  );
}
