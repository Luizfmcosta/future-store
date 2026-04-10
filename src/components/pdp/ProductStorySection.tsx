"use client";

import { useT } from "@/lib/useT";
import { hasMediaUrl } from "@/lib/utils";
import type { Product } from "@/types";
import Image from "next/image";

export function ProductStorySection({ product }: { product: Product }) {
  const t = useT();
  const gallery = product.gallery.filter(hasMediaUrl);
  const secondary = gallery.length > 1 ? gallery[1] : null;

  return (
    <div id="pdp-story" className="scroll-mt-8">
      <h2 className="max-w-[20ch] text-3xl font-normal leading-[1.15] tracking-tight text-neutral-900 sm:text-4xl sm:leading-[1.1]">
        {t("pdp.storyHeadline")}
      </h2>
      <p className="mt-8 max-w-[40rem] text-[15px] leading-relaxed text-neutral-600 sm:text-[16px] sm:leading-[1.7]">
        {product.description}
      </p>
      {secondary ? (
        <div className="relative mt-12 aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#f5f5f5] sm:aspect-[2/1]">
          <Image
            src={secondary}
            alt=""
            fill
            className="object-contain object-center"
            sizes="(max-width: 768px) 100vw, 720px"
            unoptimized
          />
        </div>
      ) : null}
    </div>
  );
}
