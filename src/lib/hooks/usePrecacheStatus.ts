"use client";

import { getPrecacheStatus, subscribePrecacheStatus, type PrecacheUiState } from "@/lib/precacheStatus";
import { useSyncExternalStore } from "react";

const serverSnapshot: PrecacheUiState = { kind: "unknown" };

export function usePrecacheStatus(): PrecacheUiState {
  return useSyncExternalStore(subscribePrecacheStatus, getPrecacheStatus, () => serverSnapshot);
}
