import { ClientProviders } from "@/components/ClientProviders";
import type { Metadata } from "next";
import { Manrope, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ALTA Vision — AI-first storefront",
  description: "Premium, adaptive storefront prototype — interface-first commerce.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" className={cn("h-full", "antialiased", manrope.variable, "font-sans", geist.variable)}>
      <body className="min-h-full bg-[var(--app-canvas)] font-sans text-[var(--foreground)]">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
