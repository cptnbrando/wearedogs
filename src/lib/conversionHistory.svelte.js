/**
 * conversionHistory.svelte.js
 * Session-scoped history of Catalytic Converter conversions.
 * Lives in memory (with Blobs) and mirrors to sessionStorage (base64/text)
 * so entries survive in-app navigation and reloads until the browser closes.
 */

const KEY = "catalytic-conversion-history";
const MAX_ENTRIES = 20;
const MAX_PERSIST_BLOB = 1.5 * 1024 * 1024; // don't base64 blobs bigger than this
const MAX_PERSIST_TEXT = 2 * 1024 * 1024;

export const conversions = $state({ entries: [] });

let nextId = 1;

function loadFromSession() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.entries)) {
      conversions.entries = parsed.entries;
      nextId = (parsed.nextId ?? parsed.entries.length) + 1;
    }
  } catch (err) {
    console.warn("Failed to load conversion history:", err);
  }
}
loadFromSession();

function persist() {
  const serializable = {
    nextId,
    entries: conversions.entries.map((e) => ({
      ...e,
      items: e.items.map(({ blob, ...rest }) => rest),
    })),
  };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(serializable));
  } catch (err) {
    // Quota hit — strip payloads from oldest entries and retry once
    for (const e of serializable.entries.slice(0, -3)) {
      for (const it of e.items) {
        delete it.b64;
        delete it.data;
      }
    }
    try {
      sessionStorage.setItem(KEY, JSON.stringify(serializable));
    } catch (err2) {
      console.warn("Conversion history too large for sessionStorage:", err2);
    }
  }
}

async function blobToB64(blob) {
  const buf = new Uint8Array(await blob.arrayBuffer());
  let s = "";
  const CH = 0x8000;
  for (let i = 0; i < buf.length; i += CH) {
    s += String.fromCharCode(...buf.subarray(i, i + CH));
  }
  return btoa(s);
}

function b64ToBlob(b64, type) {
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return new Blob([buf], { type: type || "application/octet-stream" });
}

/**
 * Records a finished conversion. items: [{ blob, name, kind, text? }]
 * @returns {Promise<string>} entry id
 */
export async function saveConversion({ inputName, inputSize, items }) {
  const id = String(nextId++);
  const stored = [];
  for (const it of items) {
    const rec = {
      name: it.name,
      kind: it.kind,
      type: it.blob?.type || "",
      size: it.blob?.size || 0,
      blob: it.blob,
    };
    if (it.kind === "text" && it.blob && it.blob.size <= MAX_PERSIST_TEXT) {
      rec.data = await it.blob.text();
    } else if (it.blob && it.blob.size <= MAX_PERSIST_BLOB) {
      rec.b64 = await blobToB64(it.blob);
    }
    stored.push(rec);
  }
  conversions.entries.push({ id, ts: Date.now(), inputName, inputSize, items: stored });
  while (conversions.entries.length > MAX_ENTRIES) conversions.entries.shift();
  persist();
  return id;
}

/** Returns a restorable entry: items get live blobs rebuilt when possible. */
export function getConversion(id) {
  const entry = conversions.entries.find((e) => e.id === String(id));
  if (!entry) return null;
  return {
    ...entry,
    items: entry.items.map((it) => {
      let blob = it.blob ?? null;
      if (!blob && it.data != null) blob = new Blob([it.data], { type: it.type });
      if (!blob && it.b64) blob = b64ToBlob(it.b64, it.type);
      return { name: it.name, kind: it.kind, type: it.type, size: it.size, blob };
    }),
  };
}

export function clearConversions() {
  conversions.entries = [];
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
}
