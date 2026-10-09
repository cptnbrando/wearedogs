/**
 * "Kill cache": wipes everything this origin has stored in the browser so a
 * stale or broken local copy can't outlive a change on the server.
 *
 * The HTTP disk cache itself is out of JS reach — the reload that follows
 * revalidates the page, and media files revalidate against R2 on next play.
 */

const COOKIE_EXPIRED = "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

/**
 * Deletes every IndexedDB database the browser will list. Older browsers
 * without indexedDB.databases() keep theirs; the rest still gets wiped.
 * @returns {Promise<void>}
 */
async function wipeIndexedDb() {
  if (!window.indexedDB || typeof indexedDB.databases !== "function") return;
  const dbs = await indexedDB.databases();
  await Promise.all(
    dbs.map(
      (db) =>
        new Promise((resolve) => {
          const req = indexedDB.deleteDatabase(db.name);
          req.onsuccess = req.onerror = req.onblocked = resolve;
        }),
    ),
  );
}

/** @returns {Promise<void>} */
async function wipeCacheStorage() {
  if (!window.caches) return;
  const keys = await caches.keys();
  await Promise.all(keys.map((key) => caches.delete(key)));
}

/** @returns {Promise<void>} */
async function unregisterServiceWorkers() {
  if (!navigator.serviceWorker || !navigator.serviceWorker.getRegistrations) return;
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.all(regs.map((reg) => reg.unregister()));
}

function wipeCookies() {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    if (name) document.cookie = name + COOKIE_EXPIRED;
  });
}

/**
 * Destroys all site data for this origin, then reloads from the network.
 * Each store is wiped independently so one failure can't block the others.
 * @returns {Promise<void>}
 */
export async function killCache() {
  try { localStorage.clear(); } catch (e) { console.warn("localStorage wipe failed:", e); }
  try { sessionStorage.clear(); } catch (e) { console.warn("sessionStorage wipe failed:", e); }
  try { wipeCookies(); } catch (e) { console.warn("Cookie wipe failed:", e); }

  const attempt = (wipe) => wipe().catch((e) => console.warn("Site data wipe step failed:", e));
  // The service worker goes first, so it stops taking on new songs to save
  // into the caches about to be wiped
  await attempt(unregisterServiceWorkers);
  await Promise.all([wipeIndexedDb, wipeCacheStorage].map(attempt));
  window.location.reload();
}
