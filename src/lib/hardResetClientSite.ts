/**
 * Best-effort wipe of same-origin client state, then a full navigation reload.
 * HttpOnly cookies cannot be cleared from JavaScript; everything else is cleared when the browser allows it.
 */
export async function hardResetSiteAndReload(): Promise<void> {
  if ("serviceWorker" in navigator) {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    } catch {
      /* ignore */
    }
  }

  if ("caches" in globalThis && typeof caches?.keys === "function") {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch {
      /* ignore */
    }
  }

  try {
    localStorage.clear();
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.clear();
  } catch {
    /* ignore */
  }

  await clearCookiesBestEffort();

  if (typeof indexedDB?.databases === "function") {
    try {
      const dbs = await indexedDB.databases();
      await Promise.all(
        (dbs ?? []).map(
          (db) =>
            new Promise<void>((resolve) => {
              if (!db.name) {
                resolve();
                return;
              }
              const req = indexedDB.deleteDatabase(db.name);
              req.onsuccess = () => resolve();
              req.onerror = () => resolve();
              req.onblocked = () => resolve();
            }),
        ),
      );
    } catch {
      /* ignore */
    }
  }

  const { origin } = globalThis.location;
  globalThis.location.replace(`${origin}/`);
}

async function clearCookiesBestEffort(): Promise<void> {
  const w = globalThis as unknown as {
    cookieStore?: {
      getAll: () => Promise<{ name: string; domain?: string | null; path?: string | null }[]>;
      delete: (options: { name: string; domain?: string; path?: string }) => Promise<void>;
    };
  };

  if (w.cookieStore?.getAll && w.cookieStore.delete) {
    try {
      const all = await w.cookieStore.getAll();
      for (const c of all) {
        await w.cookieStore
          .delete({
            name: c.name,
            ...(c.domain ? { domain: c.domain } : {}),
            ...(c.path ? { path: c.path } : {}),
          })
          .catch(() => undefined);
      }
    } catch {
      /* ignore */
    }
  }

  try {
    const { hostname, pathname } = globalThis.location;
    const segments = document.cookie.split(";");
    for (const raw of segments) {
      const trimmed = raw.trim();
      if (!trimmed) continue;
      const eq = trimmed.indexOf("=");
      const name = (eq === -1 ? trimmed : trimmed.slice(0, eq)).trim();
      if (!name) continue;
      const expired = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = `${name}=;${expired};path=/`;
      document.cookie = `${name}=;${expired};path=${pathname || "/"}`;
      if (hostname) {
        document.cookie = `${name}=;${expired};path=/;domain=${hostname}`;
      }
      if (hostname.startsWith("www.")) {
        const bare = hostname.slice(4);
        document.cookie = `${name}=;${expired};path=/;domain=${bare}`;
        document.cookie = `${name}=;${expired};path=/;domain=.${bare}`;
      }
    }
  } catch {
    /* ignore */
  }
}
