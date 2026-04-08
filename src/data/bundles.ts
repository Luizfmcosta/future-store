export type BundleDef = {
  id: string;
  title: string;
  productIds: string[];
  savings: number;
  blurb: string;
};

export const bundles: BundleDef[] = [
  {
    id: "bnd-era-roam",
    title: "Shelf + portable — Horizon One + Trail Mini",
    productIds: ["sp-era-100", "sp-roam-2"],
    savings: 150,
    blurb: "Room-filling smart speaker plus an ultra-portable for everywhere else",
  },
  {
    id: "bnd-era-pair-roam",
    title: "Whole-home starter — 2-Room Horizon + Trail Mini",
    productIds: ["sp-era-pair", "sp-roam-2"],
    savings: 220,
    blurb: "Stereo or two rooms, plus a travel speaker in one bundle",
  },
  {
    id: "bnd-move-roam",
    title: "Outdoor duo — Trail Max + Trail Mini",
    productIds: ["sp-move-2", "sp-roam-2"],
    savings: 280,
    blurb: "Patio power and pocketable backup for trips",
  },
  {
    id: "bnd-era-move",
    title: "Indoor / outdoor — Horizon One + Trail Max",
    productIds: ["sp-era-100", "sp-move-2"],
    savings: 220,
    blurb: "Room speaker at home plus weather-ready power for patio and travel",
  },
  {
    id: "bnd-arc-sub",
    title: "Premium entertainment — Stage Ultra + SubStage Pro",
    productIds: ["sb-arc-ultra", "sp-sub-4"],
    savings: 420,
    blurb: "Flagship Atmos bar with deep low-end — home theater stack",
  },
  {
    id: "bnd-beam-roam",
    title: "TV + pocket — Stage Compact (Gen 2) + Trail Mini",
    productIds: ["sb-beam-g2", "sp-roam-2"],
    savings: 190,
    blurb: "Living room clarity plus an ultra-portable for everywhere else",
  },
  {
    id: "bnd-five-era300",
    title: "Hi-fi + spatial — Studio Reference + Horizon Three",
    productIds: ["sp-five", "sp-era-300"],
    savings: 320,
    blurb: "Stereo-capable flagship plus Atmos music for open plans",
  },
];
