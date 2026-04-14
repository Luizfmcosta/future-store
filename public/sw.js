/* eslint-disable no-restricted-globals */
/**
 * Offline-first: precaches build manifest (`precache-manifest.json`) on install, then
 * runtime caching. LLM: synthetic `/api/*` when network fails; app uses catalog fallbacks.
 */
const CACHE = "future-store-offline-v1";
const PRECACHE_CONCURRENCY = 8;
/**
 * Precache / static assets: ignore query + Vary (chunk URLs, etc.).
 * Never use `ignoreSearch` for HTML navigations — same pathname can cache both full HTML (precache)
 * and `?_rsc=` Flight payloads; matching with ignoreSearch can return Flight as the document.
 */
const CACHE_MATCH_LOOSE = { ignoreSearch: true, ignoreVary: true };
const CACHE_MATCH_NAV = { ignoreVary: true };

async function cacheMatchLoose(cache, request) {
  let hit = await cache.match(request, CACHE_MATCH_LOOSE);
  if (hit) return hit;
  try {
    const u = new URL(request.url);
    if (u.origin === self.location.origin) {
      hit = await cache.match(u.origin + u.pathname, CACHE_MATCH_LOOSE);
      if (hit) return hit;
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

/** Same-pathname only; query string must match so `/page` does not pick `/page?_rsc=…` Flight. */
async function cacheMatchNavigateOrDocument(cache, request) {
  let hit = await cache.match(request, CACHE_MATCH_NAV);
  if (hit) return hit;
  try {
    const u = new URL(request.url);
    if (u.origin === self.location.origin) {
      hit = await cache.match(u.origin + u.pathname, CACHE_MATCH_NAV);
      if (hit) return hit;
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

async function broadcastToClients(payload) {
  try {
    const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    clients.forEach((client) => {
      try {
        client.postMessage(payload);
      } catch {
        /* ignore */
      }
    });
  } catch {
    /* ignore */
  }
}

self.addEventListener("message", (event) => {
  const d = event.data;
  if (!d || d.type !== "get-precache-status") return;
  const source = event.source;
  if (!source || typeof source.postMessage !== "function") return;
  event.waitUntil(
    (async () => {
      try {
        const manRes = await fetch(new Request("/precache-manifest.json", { cache: "reload" }));
        if (!manRes.ok) {
          source.postMessage({ type: "precache-status", state: "no-manifest" });
          return;
        }
        const man = await manRes.json();
        const urls = (Array.isArray(man.urls) ? man.urls : []).filter(
          (u) => typeof u === "string" && u.startsWith("/"),
        );
        const cache = await caches.open(CACHE);
        let cached = 0;
        for (const url of urls) {
          const hit = await cacheMatchLoose(cache, new Request(url, { credentials: "same-origin" }));
          if (hit && hit.ok) cached++;
        }
        source.postMessage({ type: "precache-status", state: "ready", total: urls.length, cached });
      } catch {
        source.postMessage({ type: "precache-status", state: "error" });
      }
    })(),
  );
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const manRes = await fetch(new Request("/precache-manifest.json", { cache: "reload" }));
        if (!manRes.ok) {
          await broadcastToClients({ type: "precache-status", state: "no-manifest" });
          self.skipWaiting();
          return;
        }
        const man = await manRes.json();
        const raw = Array.isArray(man.urls) ? man.urls : [];
        const list = raw.filter((u) => typeof u === "string" && u.startsWith("/"));
        const total = list.length;
        const cache = await caches.open(CACHE);
        let ok = 0;
        let failed = 0;
        for (let c = 0; c < list.length; c += PRECACHE_CONCURRENCY) {
          const batch = list.slice(c, c + PRECACHE_CONCURRENCY);
          const outcomes = await Promise.all(
            batch.map(async (url) => {
              try {
                const res = await fetch(
                  new Request(url, { cache: "reload", credentials: "same-origin" }),
                );
                if (res.ok) {
                  await cache.put(url, res);
                  return "ok";
                }
                return "fail";
              } catch {
                return "fail";
              }
            }),
          );
          for (const o of outcomes) {
            if (o === "ok") ok++;
            else failed++;
          }
          await broadcastToClients({
            type: "precache-progress",
            done: ok + failed,
            total,
            ok,
            failed,
          });
        }
        await broadcastToClients({ type: "precache-complete", total, ok, failed });
      } catch {
        await broadcastToClients({ type: "precache-status", state: "error" });
      }
      self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

function sameOrigin(url) {
  return url.origin === self.location.origin;
}

function isStaticAssetPath(pathname) {
  if (pathname.startsWith("/_next/")) return true;
  if (pathname.startsWith("/branding/")) return true;
  if (pathname.startsWith("/media/")) return true;
  if (pathname === "/favicon.ico") return true;
  return /\.(avif|webp|png|jpe?g|gif|svg|ico|woff2?|ttf|eot|js|css|map|mp4|webm|mov|m4v|ogv)$/i.test(
    pathname,
  );
}

async function putCache(request, response) {
  if (!response || !response.ok) return;
  const cache = await caches.open(CACHE);
  await cache.put(request, response.clone());
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const hit = await cacheMatchLoose(cache, request);
  if (hit) return hit;
  try {
    const res = await fetch(request);
    await putCache(request, res);
    return res;
  } catch {
    return (
      (await cacheMatchLoose(cache, request)) ||
      new Response("Offline", { status: 503, statusText: "Offline" })
    );
  }
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(request);
    await putCache(request, res);
    return res;
  } catch {
    const hit = await cacheMatchNavigateOrDocument(cache, request);
    if (hit) return hit;
    const root = await cacheMatchNavigateOrDocument(cache, new Request(self.location.origin + "/"));
    if (root) return root;
    return new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

function offlineApiResponse(pathname) {
  if (pathname === "/api/plp-adapt" || pathname.startsWith("/api/plp-adapt")) {
    return new Response(JSON.stringify({ skipped: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (pathname === "/api/chat" || pathname.startsWith("/api/chat")) {
    return new Response(JSON.stringify({ reply: null, skipped: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ error: "offline" }), {
    status: 503,
    headers: { "Content-Type": "application/json" },
  });
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (!sameOrigin(url)) return;

  if (request.method === "POST" && url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() => offlineApiResponse(url.pathname)),
    );
    return;
  }

  if (request.method !== "GET") return;

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() => offlineApiResponse(url.pathname)),
    );
    return;
  }

  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isStaticAssetPath(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});
