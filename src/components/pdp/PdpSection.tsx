"use client";

import { cn } from "@/lib/utils";

/** Sonos-like long-scroll section: hairline divider + generous vertical rhythm */
export function PdpSection({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("border-b border-black/[0.06] py-12 sm:py-16", className)}>
      {children}
    </section>
  );
}
