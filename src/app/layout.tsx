import { ClientProviders } from "@/components/ClientProviders";
import type { Metadata } from "next";
import { Inter, Manrope, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

/** Narrative rail: Inter Medium 12 / −4% letter-spacing (Figma). */
const interSidebar = Inter({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-narrative-sidebar",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Future Store — AI-first storefront",
  description: "Premium, adaptive storefront prototype — interface-first commerce.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={cn("h-full", "antialiased", manrope.variable, "font-sans", geist.variable, interSidebar.variable)}
    >
      <body className="min-h-full bg-[var(--app-canvas)] font-sans text-[var(--foreground)]">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
