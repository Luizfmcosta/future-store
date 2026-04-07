"use client";

import { LanguageSelector } from "@/components/shared/LanguageSelector";
import { useT } from "@/lib/useT";

function VtexLogo() {
  return (
    <div
      className="h-5 w-[min(96px,34vw)] shrink-0 bg-[#696969]"
      style={{
        maskImage: "url(/branding/vtex-logo.png)",
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskImage: "url(/branding/vtex-logo.png)",
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
      }}
      role="img"
      aria-label="VTEX"
    />
  );
}

export function HomeFooter() {
  const t = useT();

  return (
    <footer className="relative flex flex-col overflow-hidden rounded-b-[calc(1.75rem-2px)] bg-[#121212]">
      <div className="flex flex-col gap-3 px-5 pt-6 sm:px-6 sm:pt-8">
        <LanguageSelector />
      </div>

      {/* Giant watermark logo — #171717 on #121212 */}
      <div className="flex items-end justify-center pt-4 sm:pt-8" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/branding/fs-reduced.svg"
          alt=""
          className="h-auto w-[90%] max-w-none opacity-[0.03]"
        />
      </div>

      {/* Bottom bar — overlaps the logo */}
      <div className="relative z-10 -mt-12 flex flex-col gap-2.5 px-5 pb-5 sm:-mt-16 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:px-6 sm:pb-6">
        <p className="text-[12px] font-light text-[#696969]">{t("footer.rights")}</p>

        <VtexLogo />
      </div>
    </footer>
  );
}
