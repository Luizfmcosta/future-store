import type { Product } from "@/types";

type PtPatch = Partial<
  Pick<
    Product,
    | "title"
    | "description"
    | "reviewStrengths"
    | "reviewWeaknesses"
    | "bestFor"
    | "returnPolicyShort"
    | "warrantyShort"
    | "deliveryETA"
  >
>;

const commonDelivery = "3 a 5 dias úteis";
const commonReturn = "30 dias";
const warranty24 = "24 meses do fabricante";

/** Portuguese copy for catalog fields shown in the storefront UI. */
export const productPtOverlay: Record<string, PtPatch> = {
  "sp-era-100": {
    title: "Horizon One — Caixa inteligente com som que preenche a sala",
    description:
      "Horizon One entrega estéreo equilibrado num cilindro compacto para cozinhas, mesas e criados-mudos. Transmita por Wi-Fi ou Bluetooth, ajuste à sala com Trueplay e expanda depois para par estéreo ou multiroom.",
    reviewStrengths: [
      "Som estéreo rico numa pegada compacta",
      "Wi-Fi + Bluetooth; voz e app companheiro",
      "Trueplay adapta o som à sua sala",
    ],
    reviewWeaknesses: [
      "Para canais de altura em home theater, considere Horizon Three ou uma soundbar",
    ],
    bestFor: ["Cozinhas", "Mesas de trabalho", "Pares estéreo em salas pequenas"],
    deliveryETA: commonDelivery,
    returnPolicyShort: commonReturn,
    warrantyShort: warranty24,
  },
  "sp-era-300": {
    title: "Horizon Three — Caixa inteligente com áudio espacial",
    description:
      "Horizon Three é a caixa flagship para salas amplas: música espacial e Dolby Atmos, saída forte e layout premium de drivers. O passo natural quando Horizon One não basta para o tamanho da sala ou nível de escuta.",
    reviewStrengths: [
      "Música Dolby Atmos e reprodução espacial",
      "Saída marcante em salas abertas",
      "Arquitetura acústica premium com vários drivers",
    ],
    reviewWeaknesses: ["Pegada maior que a Horizon One"],
    bestFor: ["Salas de estar", "Música espacial", "Flagship autônomo"],
    deliveryETA: commonDelivery,
    returnPolicyShort: commonReturn,
    warrantyShort: warranty24,
  },
  "sp-move-2": {
    title: "Trail Max — Caixa portátil Wi-Fi potente",
    description:
      "Trail Max é a caixa grande para pátio, festas e ir de cômodo a cômodo: bateria longa, estéreo num só gabinete e resistência à intempérie para uso externo. Wi-Fi em casa e Bluetooth na rua.",
    reviewStrengths: [
      "Até 24 h de bateria para uso interno/externo",
      "Estéreo numa única unidade",
      "Resistente à intempérie para pátio e viagem",
    ],
    reviewWeaknesses: ["Mais pesada que a Trail Mini para carregar todo dia"],
    bestFor: ["Pátio", "Festas portáteis", "Som entre cômodos"],
    deliveryETA: commonDelivery,
    returnPolicyShort: commonReturn,
    warrantyShort: warranty24,
  },
  "sp-roam-2": {
    title: "Trail Mini — Caixa inteligente ultra portátil",
    description:
      "Trail Mini cabe no bolso e é à prova d’água — viagem, presente e primeira caixa sem fio. Surpreende no tamanho para sessões casuais e Trueplay rápido no app quando muda de lugar.",
    reviewStrengths: [
      "Design pocketável com som claro e encorpado",
      "À prova d’água para piscina e banho",
      "Trueplay automático com o app",
    ],
    reviewWeaknesses: ["Não substitui caixas de sala cheia"],
    bestFor: ["Viagem", "Presentes", "Primeira caixa sem fio"],
    deliveryETA: commonDelivery,
    returnPolicyShort: commonReturn,
    warrantyShort: warranty24,
  },
  "sp-home-theater": {
    title: "Sistema Cinema Surround — Stage Ultra + satélites traseiros",
    description:
      "O kit Cinema Surround une Stage Ultra a satélites traseiros combinados para surround real e Dolby Atmos numa compra. Controle tudo num app só com timbre coerente da frente à traseira.",
    reviewStrengths: [
      "Barra Atmos imersiva com traseiras combinadas",
      "Controle único da sala no app",
      "Timbre coerente entre frente e surround",
    ],
    reviewWeaknesses: ["Planeje energia e posição das traseiras"],
    deliveryETA: "Entrega agendada",
    returnPolicyShort: "30 dias, white-glove disponível",
    warrantyShort: warranty24,
  },
  "sp-turntable-set": {
    title: "Kit Listening — Toca-discos + Horizon One",
    description:
      "O kit Listening une toca-discos de qualidade à Horizon One para levar vinil a qualquer ambiente do sistema sem fio. Pilha minimalista e entrada hi-fi credível com caminho para expandir.",
    reviewStrengths: [
      "Vinil transmitido para qualquer sala do sistema",
      "Pilha limpa com entrada de linha",
      "Ótima porta de entrada hi-fi",
    ],
    reviewWeaknesses: ["Toca-discos precisa de superfície nivelada e setup"],
    deliveryETA: "5 a 7 dias úteis",
    returnPolicyShort: commonReturn,
    warrantyShort: "24 meses nos eletrônicos",
  },
  "sp-era-pair": {
    title: "Kit 2 Ambientes — Horizon One ×2",
    description:
      "Duas Horizon One para estéreo numa sala ou uma caixa por cômodo na mesma conta. Economia frente à compra avulsa — ideal para escritório + quarto ou estéreo compacto na sala.",
    reviewStrengths: [
      "Imagem estéreo quando pareadas na mesma sala",
      "Ou uma em cada cômodo na mesma conta",
      "Economia em relação a comprar separado",
    ],
    reviewWeaknesses: ["Pareamento leva alguns minutos no app"],
    deliveryETA: commonDelivery,
    returnPolicyShort: commonReturn,
    warrantyShort: warranty24,
  },
  "sp-roam-pair": {
    title: "Kit Adventure — Trail Mini ×2",
    description:
      "Duas Trail Mini para estéreo na mesa externa ou posições flexíveis dentro de casa. Tamanho de viagem popular com estudantes e anfitriões que querem estéreo rápido sem equipamento grande.",
    reviewStrengths: [
      "Par estéreo para mesas ao ar livre e salas pequenas",
      "Tamanho de mochila para viagens",
      "Economia frente a duas unidades avulsas",
    ],
    reviewWeaknesses: ["Modo estéreo pede posição a poucos metros"],
    deliveryETA: commonDelivery,
    returnPolicyShort: commonReturn,
    warrantyShort: warranty24,
  },
  "tv-led-50-entry": {
    title: "Future View Entry 50\" — Smart LED 4K",
    description:
      "TV 4K 50\" com smart integrado para salas compactas: painel nítido, HDR básico e apps de streaming. Entrada confiável para filmes e séries com upgrade claro para soundbar.",
    reviewStrengths: ["Preço acessível em 4K 50\"", "Smart fluido para streaming", "Boa base para soundbar"],
    reviewWeaknesses: ["Brilho limitado em salas muito claras"],
    bestFor: ["Salas compactas", "Primeira smart TV", "Quarto"],
    deliveryETA: "5 a 10 dias úteis",
    returnPolicyShort: commonReturn,
    warrantyShort: "12 meses",
  },
  "tv-led-50-stream": {
    title: "Future View Stream 50\" — Smart LED 4K",
    description:
      "TV 50\" focada em streaming com painel equilibrado e áudio melhor que a linha entry. Ideal para quem assiste muito em apps e quer custo-benefício com mais polimento de imagem.",
    reviewStrengths: ["Painel equilibrado para séries", "Smart responsivo", "Melhor áudio que a entry"],
    reviewWeaknesses: ["Sem full array local dimming"],
    bestFor: ["Maratonas de streaming", "Salas médias"],
    deliveryETA: "5 a 10 dias úteis",
    returnPolicyShort: commonReturn,
    warrantyShort: "12 meses",
  },
  "tv-led-55-living": {
    title: "Future View Living 55\" — Smart LED 4K",
    description:
      "TV 55\" para sala de estar: mais área útil, HDR aprimorado e processamento de movimento melhor para esportes e filmes. Base sólida para soundbar premium e consoles.",
    reviewStrengths: ["Tamanho confortável para sala", "Movimento mais limpo em ação", "HDR mais expressivo"],
    reviewWeaknesses: ["Pede móvel ou parede preparados para 55\""],
    bestFor: ["Sala de estar", "Filmes e esportes", "Consoles"],
    deliveryETA: "5 a 10 dias úteis",
    returnPolicyShort: commonReturn,
    warrantyShort: "12 meses",
  },
  "sb-arc-ultra": {
    title: "Stage Ultra — Soundbar smart premium com Sound Motion™",
    description:
      "Stage Ultra é a soundbar flagship com canais de altura e sub integrado agressivo para filmes Dolby Atmos e música com presença. eARC e HDMI para encaixar na TV moderna sem complicação.",
    reviewStrengths: ["Atmos com altura convincente", "Sub integrado com impacto", "Controle e calibração no app"],
    reviewWeaknesses: ["Largura maior — confira o móvel"],
    deliveryETA: commonDelivery,
    returnPolicyShort: commonReturn,
    warrantyShort: warranty24,
  },
  "sb-beam-g2": {
    title: "Stage Compact (G2) — Soundbar smart compacta",
    description:
      "Stage Compact (Gen 2) traz virtualização de altura e diálogo mais claro numa barra que cabe em TVs médias e quartos. Doce spot entre Stage Essential pequena e Stage Ultra larga.",
    reviewStrengths: ["Altura virtualizada e voz mais clara", "Cabe em consoles médios", "Upgrade claro da Essential"],
    reviewWeaknesses: ["Sala muito grande pode pedir sub dedicado"],
    deliveryETA: commonDelivery,
    returnPolicyShort: commonReturn,
    warrantyShort: warranty24,
  },
  "sb-ray": {
    title: "Stage Essential — Soundbar compacta essencial",
    description:
      "Stage Essential é o upgrade acessível de diálogo para TVs menores e móveis apertados. ARC ou óptica simples e caminho claro para Stage Compact ou Ultra depois.",
    reviewStrengths: ["Diálogo mais claro com orçamento contido", "Encaixa em consoles apertados", "Expande para multiroom"],
    reviewWeaknesses: ["Sem Atmos — upgrade é Stage Compact ou Ultra"],
    deliveryETA: commonDelivery,
    returnPolicyShort: commonReturn,
    warrantyShort: warranty24,
  },
  "sp-five": {
    title: "Studio Reference — Caixa hi-fi wireless premium",
    description:
      "Studio Reference é a caixa hi-fi wireless para audição séria: aceita par estéreo, entrada de linha para toca-discos ou DJ e graves profundos sem sub na maioria das salas. Planeje profundidade de prateleira.",
    reviewStrengths: [
      "Pronta para par estéreo em salas de audição",
      "Entrada de linha para toca-discos ou DJ",
      "Graves limpos sem sub na maioria das salas",
    ],
    reviewWeaknesses: ["Maior que a linha Horizon — planeje a prateleira"],
    bestFor: ["Stacks hi-fi", "Rigs de vinil", "Cozinhas grandes"],
    deliveryETA: commonDelivery,
    returnPolicyShort: commonReturn,
    warrantyShort: warranty24,
  },
  "sp-sub-4": {
    title: "SubStage Pro — Subwoofer wireless premium",
    description:
      "SubStage Pro adiciona sub graves marcantes a Stage Ultra e Stage Compact com drivers force-canceling e pareamento sem fio. Esconda ao lado do sofá e ganhe impacto em filmes e música eletrônica.",
    reviewStrengths: [
      "Sub graves marcantes com cancelamento de força",
      "Pareamento sem fio — esconda ao lado do sofá",
      "Combina com Stage Ultra e Compact",
    ],
    reviewWeaknesses: ["Investimento premium — SubStage Mini cobre salas menores"],
    deliveryETA: "5 a 7 dias úteis",
    returnPolicyShort: commonReturn,
    warrantyShort: warranty24,
  },
  "hp-apex-shadow": {
    title: "Apex Shadow — Fone over-ear wireless com ANC",
    description:
      "Apex Shadow une ANC híbrido, drivers de 40 mm e multiponto Bluetooth 5.3 para laptop e celular juntos. USB-C com carga rápida e até ~50 h com ANC desligado.",
    reviewStrengths: [
      "ANC híbrido com modo ambiente",
      "Drivers 40 mm com extensão de graves",
      "Bluetooth 5.3 multiponto",
      "USB-C rápido; até ~50 h com ANC off",
    ],
    reviewWeaknesses: ["Over-ear aquece em climas quentes em uso longo"],
    deliveryETA: commonDelivery,
    returnPolicyShort: commonReturn,
    warrantyShort: warranty24,
  },
  "hp-aether-buds": {
    title: "Aether Buds — Fones true wireless com estojo de carga",
    description:
      "Aether Buds entrega cancelamento ativo leve, drivers balanceados e estojo compacto com carga rápida. Ideal para deslocamento e chamadas com ENC de duplo microfone.",
    reviewStrengths: [
      "ANC leve para trânsito e escritório",
      "ENC com dois microfones em chamadas",
      "Estojo compacto com carga rápida USB-C",
    ],
    reviewWeaknesses: ["ANC menos profundo que over-ear flagship"],
    deliveryETA: commonDelivery,
    returnPolicyShort: commonReturn,
    warrantyShort: warranty24,
  },
};

export function applyProductPt(product: Product): Product {
  const o = productPtOverlay[product.id];
  if (!o) return product;
  return {
    ...product,
    ...o,
    reviewStrengths: o.reviewStrengths ?? product.reviewStrengths,
    reviewWeaknesses: o.reviewWeaknesses ?? product.reviewWeaknesses,
    bestFor: o.bestFor ?? product.bestFor,
    compatibilityTags: product.compatibilityTags,
    gallery: product.gallery,
    colorOptions: product.colorOptions,
  };
}
