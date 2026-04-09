"use client";

import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { useT } from "@/lib/useT";
import type { Product } from "@/types";
import {
  AudioLines,
  Bluetooth,
  Cable,
  Headphones,
  Radio,
  Speaker,
  Tv,
  Usb,
  Wifi,
  type LucideIcon,
} from "lucide-react";

function iconForTag(tag: string): LucideIcon {
  const s = tag.toLowerCase();
  if (s.includes("wifi") || s.includes("wi-fi")) return Wifi;
  if (s.includes("bluetooth")) return Bluetooth;
  if (s.includes("airplay") || s.includes("cast")) return Radio;
  if (s.includes("hdmi") || s.includes("earc") || s.includes("arc")) return Cable;
  if (s.includes("usb")) return Usb;
  if (s.includes("spatial") || s.includes("atmos") || s.includes("dolby")) return Radio;
  if (s.includes("tv") || s.includes("4k")) return Tv;
  if (s.includes("headphone")) return Headphones;
  if (s.includes("stereo") || s.includes("pair") || s.includes("speaker")) return Speaker;
  return AudioLines;
}

export function ProductPdpFeatures({ product }: { product: Product }) {
  const t = useT();
  const tags = product.compatibilityTags;
  if (!tags.length) return null;

  return (
    <div>
      <EyebrowPill as="h2" className="mb-0">
        {t("pdp.featuresHeading")}
      </EyebrowPill>
      <ul className="mt-8 flex min-w-0 flex-nowrap gap-6 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] scrollbar-none touch-pan-x pb-1">
        {tags.map((tag) => {
          const Icon = iconForTag(tag);
          return (
            <li key={tag} className="flex w-[6.75rem] shrink-0 flex-col gap-3 sm:w-[7.25rem]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.06] bg-neutral-50 text-neutral-800">
                <Icon className="size-5" strokeWidth={1.5} aria-hidden />
              </span>
              <span className="text-[13px] font-medium leading-snug text-neutral-800 sm:text-[14px]">{tag}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
