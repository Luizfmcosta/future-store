import { ClientProviders } from "@/components/ClientProviders";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { DEFAULT_UI_LOCALE } from "@/lib/locales/types";
import { getMessage } from "@/lib/messages";

const metaTitle = getMessage("metaTitle", DEFAULT_UI_LOCALE) ?? "";
const metaDescription = getMessage("metaDescription", DEFAULT_UI_LOCALE) ?? "";

const socialPreviewImage = "/branding/Social%20Preview.png";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase:
    typeof process.env.VERCEL_URL === "string"
      ? new URL(`https://${process.env.VERCEL_URL}`)
      : new URL("http://localhost:3000"),
  title: metaTitle,
  description: metaDescription,
  icons: {
    icon: [
      {
        url: "/branding/favicon-os-light.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/branding/favicon-os-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
      /* Fallback when `prefers-color-scheme` is not set — dark gray on light chrome. */
      { url: "/branding/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/branding/apple-touch-icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    images: [socialPreviewImage],
  },
  twitter: {
    card: "summary_large_image",
    title: metaTitle,
    description: metaDescription,
    images: [socialPreviewImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-theme="dark"
      className={cn(
        "h-full overflow-hidden scrollbar-none",
        "antialiased",
        "font-sans",
        geist.variable,
      )}
    >
      <body className="h-full min-h-0 overflow-hidden bg-[var(--app-canvas)] font-sans text-[var(--foreground)] scrollbar-none">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
