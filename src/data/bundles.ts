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
    title: "Shelf + portable — Era 100 + Roam 2",
    productIds: ["sp-era-100", "sp-roam-2"],
    savings: 150,
    blurb: "Room-filling smart speaker plus an ultra-portable for everywhere else",
  },
  {
    id: "bnd-era-pair-roam",
    title: "Whole-home starter — 2-Room Era + Roam",
    productIds: ["sp-era-pair", "sp-roam-2"],
    savings: 220,
    blurb: "Stereo or two rooms, plus a travel speaker in one bundle",
  },
  {
    id: "bnd-move-roam",
    title: "Outdoor duo — Move 2 + Roam 2",
    productIds: ["sp-move-2", "sp-roam-2"],
    savings: 280,
    blurb: "Patio power and pocketable backup for trips",
  },
];
