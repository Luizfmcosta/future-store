export type BundleDef = {
  id: string;
  title: string;
  productIds: string[];
  savings: number;
  blurb: string;
};

export const bundles: BundleDef[] = [
  {
    id: "bnd-tv-sb-nova",
    title: "Cinema pair — OLED + Nova Atmos",
    productIds: ["tv-aurora-oled-65", "sb-nova-atmos-500"],
    savings: 350,
    blurb: "eARC single-remote control · Atmos height matched to panel size",
  },
  {
    id: "bnd-tv-sb-echo",
    title: "Living room set — TV + Echo 2.1",
    productIds: ["tv-pulse-led-55", "sb-echo-compact-210"],
    savings: 180,
    blurb: "Most chosen for mixed lighting rooms",
  },
  {
    id: "bnd-tv-sb-pulse",
    title: "Starter bundle — TV + Pulse Mini",
    productIds: ["tv-pulse-led-50", "sb-pulse-bar-mini"],
    savings: 120,
    blurb: "Campaign-friendly total monthly",
  },
];
