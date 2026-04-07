import { AboutPage } from "@/components/about/AboutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre — Future Store",
  description:
    "Uma loja que se adapta a cada pessoa. Entenda como a IA organiza conteúdo, produtos e ofertas em tempo real.",
};

export default function About() {
  return <AboutPage />;
}
