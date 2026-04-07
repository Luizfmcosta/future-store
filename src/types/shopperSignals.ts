export type TrafficChannel = "direct" | "organic" | "paid_social" | "paid_search" | "other";

export type ShopperSignals = {
  visitCount: number;
  isReturning: boolean;
  device: "desktop" | "mobile";
  trafficChannel: TrafficChannel;
};
