/** Client-side mirror of SW precache / audit messages (`public/sw.js`). */

export type PrecacheUiState =
  | { kind: "unknown" }
  | { kind: "unsupported" }
  | { kind: "disabled" }
  | { kind: "starting" }
  | { kind: "checking" }
  | { kind: "installing"; done: number; total: number; ok: number; failed: number }
  | { kind: "complete"; total: number; ok: number; failed: number }
  | { kind: "ready"; total: number; cached: number }
  | { kind: "no-manifest" }
  | { kind: "error" };

let state: PrecacheUiState = { kind: "unknown" };
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function getPrecacheStatus(): PrecacheUiState {
  return state;
}

export function setPrecacheStatus(next: PrecacheUiState) {
  state = next;
  emit();
}

export function subscribePrecacheStatus(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function applySwPrecacheMessage(data: unknown) {
  if (!data || typeof data !== "object") return;
  const m = data as Record<string, unknown>;
  if (m.type === "precache-progress") {
    setPrecacheStatus({
      kind: "installing",
      done: Number(m.done) || 0,
      total: Number(m.total) || 0,
      ok: Number(m.ok) || 0,
      failed: Number(m.failed) || 0,
    });
    return;
  }
  if (m.type === "precache-complete") {
    setPrecacheStatus({
      kind: "complete",
      total: Number(m.total) || 0,
      ok: Number(m.ok) || 0,
      failed: Number(m.failed) || 0,
    });
    return;
  }
  if (m.type === "precache-status") {
    if (m.state === "ready") {
      setPrecacheStatus({
        kind: "ready",
        total: Number(m.total) || 0,
        cached: Number(m.cached) || 0,
      });
      return;
    }
    if (m.state === "no-manifest") {
      setPrecacheStatus({ kind: "no-manifest" });
      return;
    }
    if (m.state === "error") {
      setPrecacheStatus({ kind: "error" });
      return;
    }
  }
}

/** Asks the active service worker to count manifest URLs present in the offline cache. */
export function requestPrecacheAuditFromSw() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  const c = navigator.serviceWorker.controller;
  if (!c) return;
  setPrecacheStatus({ kind: "checking" });
  try {
    c.postMessage({ type: "get-precache-status" });
  } catch {
    setPrecacheStatus({ kind: "error" });
  }
}

export type PrecacheTooltipTranslate = (
  path: string,
  params?: Record<string, string | number>,
) => string;

export function formatPrecacheTooltip(s: PrecacheUiState, t: PrecacheTooltipTranslate): string {
  switch (s.kind) {
    case "unknown":
      return t("homeWelcome.precacheTooltipUnknown");
    case "unsupported":
      return t("homeWelcome.precacheTooltipUnsupported");
    case "disabled":
      return t("homeWelcome.precacheTooltipDisabled");
    case "starting":
      return t("homeWelcome.precacheTooltipStarting");
    case "checking":
      return t("homeWelcome.precacheTooltipChecking");
    case "installing":
      return t("homeWelcome.precacheTooltipInstalling", {
        done: s.done,
        total: s.total,
      });
    case "complete":
      if (s.failed > 0) {
        return t("homeWelcome.precacheTooltipInstallPartial", {
          ok: s.ok,
          total: s.total,
          failed: s.failed,
        });
      }
      return t("homeWelcome.precacheTooltipInstallDone", { ok: s.ok, total: s.total });
    case "ready":
      if (s.total <= 0) return t("homeWelcome.precacheTooltipNoManifest");
      if (s.cached >= s.total) {
        return t("homeWelcome.precacheTooltipInstallDone", { ok: s.cached, total: s.total });
      }
      return t("homeWelcome.precacheTooltipAuditPartial", { cached: s.cached, total: s.total });
    case "no-manifest":
      return t("homeWelcome.precacheTooltipNoManifest");
    case "error":
      return t("homeWelcome.precacheTooltipError");
    default:
      return t("homeWelcome.precacheTooltipUnknown");
  }
}
