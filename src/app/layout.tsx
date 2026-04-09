import { ClientProviders } from "@/components/ClientProviders";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { messages } from "@/lib/messages";

const metaTitle =
  typeof messages.metaTitle === "string" ? messages.metaTitle : "";
const metaDescription =
  typeof messages.metaDescription === "string"
    ? messages.metaDescription
    : "";

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
    icon: "/branding/Favicon-Future.png",
    apple: "/branding/Favicon-Future.png",
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
      lang="en"
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
