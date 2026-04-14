/* eslint-disable no-restricted-globals */
/**
 * Offline-first: precaches build manifest (`precache-manifest.json`) on install, then
 * runtime caching. LLM: synthetic `/api/*` when network fails; app uses catalog fallbacks.
 */
const CACHE = "future-store-offline-v1";
const PRECACHE_CONCURRENCY = 8;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const manRes = await fetch(new Request("/precache-manifest.json", { cache: "reload" }));
        if (!manRes.ok) {
          self.skipWaiting();
          return;
        }
        const man = await manRes.json();
        const list = Array.isArray(man.urls) ? man.urls : [];
        const cache = await caches.open(CACHE);
        for (let c = 0; c < list.length; c += PRECACHE_CONCURRENCY) {
          const batch = list.slice(c, c + PRECACHE_CONCURRENCY);
          await Promise.all(
            batch.map(async (url) => {
              if (typeof url !== "string" || !url.startsWith("/")) return;
              try {
                const res = await fetch(
                  new Request(url, { cache: "reload", credentials: "same-origin" }),
                );
                if (res.ok) await cache.put(url, res);
              } catch {
                /* one URL failing must not abort the whole precache */
              }
            }),
          );
        }
      } catch {
        /* manifest missing in dev / first clone */
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
  return /\.(avif|webp|png|jpe?g|gif|svg|ico|woff2?|ttf|eot|js|css|map)$/i.test(pathname);
}

async function putCache(request, response) {
  if (!response || !response.ok) return;
  const cache = await caches.open(CACHE);
  await cache.put(request, response.clone());
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  try {
    const res = await fetch(request);
    await putCache(request, res);
    return res;
  } catch {
    return (
      (await cache.match(request)) ||
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
    const hit = await cache.match(request);
    if (hit) return hit;
    const root = await cache.match(self.location.origin + "/");
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
