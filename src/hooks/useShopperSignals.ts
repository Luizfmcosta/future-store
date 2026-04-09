"use client";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import {
  getVisitCount,
  incrementVisitCount,
  isReturningVisitor,
  readOrCaptureTraffic,
} from "@/lib/shopperSignalsStorage";
import type { ShopperSignals as ShopperSignalsType, TrafficChannel } from "@/types/shopperSignals";
import { useEffect, useMemo, useState } from "react";

export type ShopperSignals = ShopperSignalsType;

/**
 * Client-only funnel signals: visit recency, device class, traffic (UTM / referrer).
 * Visit count increments when hook mounts with `incrementOnMount` (use on home only).
 */
export function useShopperSignals(options: { incrementVisitOnMount?: boolean } = {}): ShopperSignals {
  const { incrementVisitOnMount = false } = options;
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [visitCount, setVisitCount] = useState(1);
  const [trafficChannel, setTrafficChannel] = useState<TrafficChannel>("direct");

  useEffect(() => {
    queueMicrotask(() => {
      const traffic = readOrCaptureTraffic();
      setTrafficChannel(traffic.channel);
      if (incrementVisitOnMount) {
        const v = incrementVisitCount();
        setVisitCount(v);
      } else {
        const v = getVisitCount();
        setVisitCount(v > 0 ? v : 1);
      }
    });
  }, [incrementVisitOnMount]);

  return useMemo(
    () => ({
      visitCount,
      isReturning: incrementVisitOnMount ? visitCount > 1 : isReturningVisitor(),
      device: isDesktop ? "desktop" : "mobile",
      trafficChannel,
    }),
    [visitCount, incrementVisitOnMount, isDesktop, trafficChannel],
  );
}
