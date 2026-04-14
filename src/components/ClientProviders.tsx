"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/shared/AppShell";
import { LocaleHtmlLang } from "@/components/shared/LocaleHtmlLang";
import { OfflineServiceWorkerRegister } from "@/components/OfflineServiceWorkerRegister";
import { ThemeSync } from "@/components/shared/ThemeSync";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delay={200}>
      <OfflineServiceWorkerRegister />
      <LocaleHtmlLang />
      <ThemeSync />
      <AppShell>{children}</AppShell>
    </TooltipProvider>
  );
}
