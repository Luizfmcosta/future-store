"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/shared/AppShell";
import { ThemeSync } from "@/components/shared/ThemeSync";
import { LocaleProvider } from "@/context/LocaleContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <TooltipProvider delay={200}>
        <ThemeSync />
        <AppShell>{children}</AppShell>
      </TooltipProvider>
    </LocaleProvider>
  );
}
