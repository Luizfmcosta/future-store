import { getProductById, products } from "@/data/products";
import type { AppLocale } from "@/lib/locale-types";
import type { Product } from "@/types";

/** Portuguese copy layered over canonical English `products` data. */
const ptBrOverrides: Partial<Record<string, Partial<Product>>> = {
  "sp-era-100": {
    title: "Horizon One — Som estéreo inteligente",
    deliveryETA: "3–5 dias úteis",
    reviewStrengths: [
      "Som rico em um formato compacto",
      "WiFi + Bluetooth; app própria e assistentes de voz",
      "Trueplay ajusta o som ao ambiente",
    ],
    reviewWeaknesses: [
      "Para home theater com altura, considere Horizon Three ou soundbar",
    ],
    returnPolicyShort: "30 dias",
    warrantyShort: "24 meses fabricante",
    bestFor: ["Cozinhas", "Mesas", "Pares estéreo em salas menores"],
  },
  "sp-era-300": {
    title: "Horizon Three — Som espacial e inteligente",
    deliveryETA: "3–5 dias úteis",
    reviewStrengths: [
      "Música em Dolby Atmos e áudio espacial",
      "Pressão sonora para salas abertas",
      "Arquitetura acústica premium com vários drivers",
    ],
    reviewWeaknesses: ["Maior que Horizon One — planeje o móvel"],
    returnPolicyShort: "30 dias",
    warrantyShort: "24 meses fabricante",
    bestFor: ["Salas de estar", "Música espacial", "Referência standalone"],
  },
  "sp-move-2": {
    title: "Trail Max — Caixa portátil potente",
    deliveryETA: "3–5 dias úteis",
    reviewStrengths: [
      "Até 24 h de bateria para dentro e fora de casa",
      "Estéreo em um único corpo",
      "Resistente à intempérie para varanda e viagem",
    ],
    reviewWeaknesses: ["Mais pesado que o Trail Mini para carregar todo dia"],
    returnPolicyShort: "30 dias",
    warrantyShort: "24 meses fabricante",
    bestFor: ["Varanda", "Festas portáteis", "Som entre cômodos"],
  },
  "sp-roam-2": {
    title: "Trail Mini — Caixa inteligente ultra portátil",
    deliveryETA: "3–5 dias úteis",
    reviewStrengths: [
      "Design pocket com som claro e encorpado",
      "À prova d'água para piscina e banho",
      "Auto Trueplay com app",
    ],
    reviewWeaknesses: ["Não substitui caixas de sala inteira"],
    returnPolicyShort: "30 dias",
    warrantyShort: "24 meses fabricante",
    bestFor: ["Viagem", "Presente", "Primeira caixa wireless"],
  },
  "sp-home-theater": {
    title: "Cinema Surround System — Stage Ultra + satélites traseiros",
    deliveryETA: "Entrega agendada",
    reviewStrengths: [
      "Soundbar Atmos com surrounds combinados",
      "Controle único pelo app",
      "Timbre coerente entre frente e traseira",
    ],
    reviewWeaknesses: ["Preveja tomada e posição das traseiras"],
    returnPolicyShort: "30 dias, white-glove disponível",
    warrantyShort: "24 meses fabricante",
    bestFor: ["Home theater", "Filmes", "Games no console"],
  },
  "sp-turntable-set": {
    title: "Listening Set — Toca-discos + Horizon One",
    deliveryETA: "5–7 dias úteis",
    reviewStrengths: [
      "Vinil transmitido para qualquer cômodo do sistema",
      "Conjunto minimalista com line-in",
      "Ótima entrada no hi-fi",
    ],
    reviewWeaknesses: ["Toca-discos pede superfície nivelada"],
    returnPolicyShort: "30 dias",
    warrantyShort: "24 meses em eletrônicos",
    bestFor: ["Vinil", "Salas de estar", "Ambientes com design"],
  },
  "sp-era-pair": {
    title: "2 cômodos — Horizon One ×2",
    deliveryETA: "3–5 dias úteis",
    reviewStrengths: [
      "Imagem estéreo quando emparelhadas",
      "Ou uma em cada cômodo na mesma conta",
      "Economia vs comprar separado",
    ],
    reviewWeaknesses: ["Emparelhamento leva alguns minutos no app"],
    returnPolicyShort: "30 dias",
    warrantyShort: "24 meses fabricante",
    bestFor: ["Estéreo", "Dois cômodos", "Escritório + quarto"],
  },
  "sp-roam-pair": {
    title: "Adventure Set — Trail Mini ×2",
    deliveryETA: "3–5 dias úteis",
    reviewStrengths: [
      "Par estéreo para mesas e áreas pequenas",
      "Tamanho de mochila para viagens",
      "Economia vs duas unidades avulsas",
    ],
    reviewWeaknesses: ["Modo estéreo pede distância curta entre as caixas"],
    returnPolicyShort: "30 dias",
    warrantyShort: "24 meses fabricante",
    bestFor: ["Externo", "Dupla viagem", "Estúdios compactos"],
  },
  "tv-samsung-crystal-50": {
    title: "Samsung Crystal UHD 50\" — Smart TV LED 4K",
    deliveryETA: "5–10 dias úteis",
    reviewStrengths: [
      "Painel 4K com bom contraste em salas claras",
      "Tizen com streaming e espelhamento",
      "3 HDMI para console e soundbar",
    ],
    reviewWeaknesses: ["Sem dimming local dos QLED topo de linha"],
    returnPolicyShort: "7 dias (lacrado)",
    warrantyShort: "12 meses fabricante",
    bestFor: ["Salas compactas", "Primeiro 4K", "Séries"],
  },
  "tv-tcl-led-50": {
    title: "TCL P755 50\" — Google TV LED 4K",
    deliveryETA: "4–8 dias úteis",
    reviewStrengths: [
      "Google TV com busca por voz",
      "Ótima relação polegada/preço",
      "Modo jogo com baixa latência",
    ],
    reviewWeaknesses: ["Som embutido básico — som de sala com soundbar"],
    returnPolicyShort: "7 dias (lacrado)",
    warrantyShort: "12 meses fabricante",
    bestFor: ["Streaming", "Games casuais", "Quarto"],
  },
  "tv-lg-uhd-55": {
    title: "LG UHD 55\" — Smart TV LED 4K",
    deliveryETA: "5–10 dias úteis",
    reviewStrengths: [
      "WebOS rápido com controle mágico",
      "55\" confortável a ~2,5 m",
      "Filmmaker Mode para cor natural",
    ],
    reviewWeaknesses: ["IPS — contraste menor que OLED no escuro"],
    returnPolicyShort: "7 dias (lacrado)",
    warrantyShort: "12 meses fabricante",
    bestFor: ["Sala de estar", "Esportes", "Família"],
  },
  "sb-arc-ultra": {
    title: "Stage Ultra — Soundbar smart premium com Sound Motion™",
    deliveryETA: "5–7 dias úteis",
    reviewStrengths: [
      "Dolby Atmos imersivo com arquitetura Sound Motion",
      "eARC e HDMI para TVs atuais",
      "Combina com SubStage Pro e Horizon como surround",
    ],
    reviewWeaknesses: ["Barra larga — meça o rack antes"],
    returnPolicyShort: "30 dias",
    warrantyShort: "24 meses fabricante",
    bestFor: ["TV na sala", "Cinema em casa", "Games no console"],
  },
  "sb-beam-g2": {
    title: "Stage Compact (Gen 2) — Soundbar smart compacta",
    deliveryETA: "3–5 dias úteis",
    reviewStrengths: [
      "Atmos virtualizado em formato pequeno",
      "Ideal para quartos e TVs médias",
      "Voz e áudio multiambiente em toda a casa",
    ],
    reviewWeaknesses: ["Salas muito abertas pedem Stage Ultra"],
    returnPolicyShort: "30 dias",
    warrantyShort: "24 meses fabricante",
    bestFor: ["TV no quarto", "Apartamentos", "Streaming do dia a dia"],
  },
  "sb-ray": {
    title: "Stage Essential — Soundbar compacta essencial",
    deliveryETA: "3–5 dias úteis",
    reviewStrengths: [
      "Diálogos mais claros com investimento acessível",
      "Encaixa em racks estreitos e parede",
      "Cresce para um sistema multiambiente completo",
    ],
    reviewWeaknesses: ["Sem Atmos — upgrade natural é Stage Compact ou Stage Ultra"],
    returnPolicyShort: "30 dias",
    warrantyShort: "24 meses fabricante",
    bestFor: ["TVs menores", "Primeira soundbar", "Escritórios"],
  },
  "sp-five": {
    title: "Studio Reference — Caixa wireless hi-fi premium",
    deliveryETA: "3–5 dias úteis",
    reviewStrengths: [
      "Aceita par estéreo para sala de audição séria",
      "Entrada line-in para toca-discos ou mesa",
      "Graves limpos sem sub separado na maioria das salas",
    ],
    reviewWeaknesses: ["Maior que a linha Horizon — confira profundidade do móvel"],
    returnPolicyShort: "30 dias",
    warrantyShort: "24 meses fabricante",
    bestFor: ["Hi-fi", "Setup com vinil", "Cozinhas amplas"],
  },
  "sp-sub-4": {
    title: "SubStage Pro — Subwoofer wireless premium",
    deliveryETA: "5–7 dias úteis",
    reviewStrengths: [
      "Transforma Stage Ultra e Stage Compact com graves de verdade",
      "Drivers force-canceling, pouca vibração no móvel",
      "Pareamento wireless — esconde atrás do sofá",
    ],
    reviewWeaknesses: ["Investimento alto — SubStage Mini atende salas menores"],
    returnPolicyShort: "30 dias",
    warrantyShort: "24 meses fabricante",
    bestFor: ["Sets com Stage Ultra", "Filmes de ação", "Música eletrônica"],
  },
};

export function localizeProduct(product: Product, locale: AppLocale): Product {
  if (locale === "en-US") return product;
  const patch = ptBrOverrides[product.id];
  if (!patch) return product;
  return { ...product, ...patch };
}

export function localizeProducts(list: Product[], locale: AppLocale): Product[] {
  return list.map((p) => localizeProduct(p, locale));
}

export function getProductByIdLocalized(
  id: string,
  locale: AppLocale,
): Product | undefined {
  const p = getProductById(id);
  return p ? localizeProduct(p, locale) : undefined;
}

export function getAllProductsLocalized(locale: AppLocale): Product[] {
  return localizeProducts(products, locale);
}
