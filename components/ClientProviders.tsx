"use client";

import { AppShell } from "@/components/shared/AppShell";
import { ThemeSync } from "@/components/shared/ThemeSync";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeSync />
      <AppShell>{children}</AppShell>
    </>
  );
}
