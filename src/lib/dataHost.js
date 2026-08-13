/**
 * data.wearedogs.net asset URLs, dev-aware.
 *
 * In dev, absolute data-host URLs are rewritten to their path (/vid/...,
 * /music/...) so requests go through vite's same-origin proxy: no CORS, no
 * preflight, and the proxy presents the production referer the edge expects.
 * This lets the bucket CORS policy stay production-origins-only.
 * In production builds the absolute URL passes through untouched.
 */
export const DATA_ORIGIN = "https://data.wearedogs.net";

export function dataUrl(url) {
  return import.meta.env.DEV && url.startsWith(DATA_ORIGIN)
    ? url.slice(DATA_ORIGIN.length)
    : url;
}
