/**
 * Service worker: keeps music (and images) from data.wearedogs.net on the
 * device, so every replay is free — no R2 request, no signal needed.
 *
 * Songs: a song that plays is saved while it streams (the first request is
 * teed into the cache, so nothing downloads twice), then served from the
 * phone forever after, seeking included. Saved songs never expire.
 * Images: the saved copy shows instantly and is refreshed in the background.
 *
 * Lockup songs are passcode-gated (Authorization header) and never touched.
 */

const SONG_CACHE = "wearedogs-songs";
const IMAGE_CACHE = "wearedogs-images";
const DATA_HOST = "data.wearedogs.net";
const SONG_DIR = "/music/";
const LOCKED_DIR = "/music/lockup/";
const FROM_THE_TOP = "bytes=0-";
const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif|svg)$/i;
const RANGE_PATTERN = /bytes=(\d*)-(\d*)/;
const DEFAULT_AUDIO_TYPE = "audio/mpeg";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.hostname !== DATA_HOST) return;
  if (isSong(url)) return event.respondWith(song(event, req));
  if (IMAGE_EXT.test(url.pathname)) event.respondWith(image(event, req));
});

/** @param {URL} url */
function isSong(url) {
  if (!url.pathname.startsWith(SONG_DIR) || url.pathname.startsWith(LOCKED_DIR)) return false;
  return url.pathname.endsWith(".mp3");
}

/**
 * Saved copy if there is one; otherwise stream from R2 and keep it.
 * @param {FetchEvent} event
 * @param {Request} req
 */
async function song(event, req) {
  const cache = await caches.open(SONG_CACHE);
  const saved = await cache.match(req.url);
  const range = req.headers.get("range");
  if (saved) return withRange(saved, range);

  // Only a from-the-top request can be kept whole. A seek, or Safari's
  // two-byte probe, just goes to the network.
  if (range && range !== FROM_THE_TOP) return fetch(req);

  // Ask for the whole file; a 200 is a valid answer to "bytes=0-", and the
  // player streams it as it arrives while the other half fills the cache
  const res = await fetch(req.url, { mode: "cors", credentials: "omit" }).catch(() => null);
  // Anything unexpected: send the player's own request, exactly as it was
  if (!res || res.status !== 200) return fetch(req);
  event.waitUntil(cache.put(req.url, res.clone()).catch(() => {}));
  return res;
}

/**
 * Cut the requested bytes out of a saved song, like a server would.
 * @param {Response} saved
 * @param {string | null} range the request's Range header
 */
async function withRange(saved, range) {
  const blob = await saved.blob();
  const type = saved.headers.get("content-type") || DEFAULT_AUDIO_TYPE;
  const size = blob.size;
  const m = range && RANGE_PATTERN.exec(range);
  if (!m) {
    return new Response(blob, {
      status: 200,
      headers: { "Content-Type": type, "Content-Length": String(size), "Accept-Ranges": "bytes" },
    });
  }
  // "bytes=-500" means the last 500 bytes
  const start = Math.max(0, m[1] === "" ? size - Number(m[2]) : Number(m[1]));
  const end = Math.min(m[1] !== "" && m[2] !== "" ? Number(m[2]) : size - 1, size - 1);
  if (start > end) {
    return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + size } });
  }
  return new Response(blob.slice(start, end + 1), {
    status: 206,
    headers: {
      "Content-Type": type,
      "Content-Length": String(end - start + 1),
      "Content-Range": "bytes " + start + "-" + end + "/" + size,
      "Accept-Ranges": "bytes",
    },
  });
}

/**
 * Saved copy right away, refreshed in the background.
 * @param {FetchEvent} event
 * @param {Request} req
 */
async function image(event, req) {
  const cache = await caches.open(IMAGE_CACHE);
  let saved = await cache.match(req);
  // A plain <img> saves an opaque copy; a canvas/WebGL load (crossOrigin) can't
  // use one, so it goes to the network and its readable copy replaces it
  if (saved && saved.type === "opaque" && req.mode === "cors") saved = null;
  const update = fetch(req).then((res) => {
    if (res.ok || res.type === "opaque") event.waitUntil(cache.put(req, res.clone()).catch(() => {}));
    return res;
  });
  if (!saved) return update;
  event.waitUntil(update.catch(() => {}));
  return saved;
}
