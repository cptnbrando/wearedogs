import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import shareCards from './scripts/vite-plugin-share-cards.js'
import markdownData from './scripts/vite-plugin-md-data.js'
import staticData from './scripts/vite-plugin-static-data.js'

// The lowest Chromium that can load this build: <script type="module"> plus
// dynamic import() — Samsung Tizen 5.0 TVs (2019) ship exactly Chromium 63.
// Syntax newer than this is down-compiled natively by rolldown/oxc at ~zero
// build cost; missing built-ins are covered by src/lib/potato-polyfills.js.
// Browsers older than this (Samsung Internet 2.2 TV, Chrome < 61) can't run
// module scripts at all — index.html routes them to the static /lite/ page.
const POTATO_JS_TARGET = 'chrome63'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Frontmatter .md files import as { default: frontmatter, body } — the
    // correspondence letters compile straight into the bundle, one file each.
    markdownData(),
    // Runtime-fetched datasets live in src/data with everything else; this
    // serves/copies them at /data/fundraiser/* and /data/store/*.
    staticData(),
    tailwindcss(),
    svelte(),
    // Emits real HTML at each /store/campaign/<id> and /store/product/<id> so
    // shared links preview with that item's own image, title and description.
    shareCards({ origin: 'https://wearedogs.net' }),
  ],
  resolve: {
    conditions: ['browser'],
  },
  server: {
    // Honors a harness-assigned port (PORT env) so a second dev server can
    // run beside the default one; falls back to vite's usual 5173.
    port: Number(process.env.PORT) || 5173,
    proxy: {
      '/vid': {
        target: 'https://data.wearedogs.net',
        changeOrigin: true,
        // data.wearedogs.net now referer-gates assets behind Cloudflare; the
        // dev proxy forwards the browser's localhost referer, which gets a
        // 403 block page. Present the real site's referer instead.
        headers: { Referer: 'https://wearedogs.net/' },
      }
    }
  },
  build: {
    target: POTATO_JS_TARGET,

    // Forces the CSS compiler to down-compile into safe fallbacks
    cssTarget: 'chrome40',

    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Own chunk so the entry imports it before vendor — inlined into
          // the entry it would evaluate after the hoisted vendor import.
          if (id.includes('potato-polyfills')) return 'potato-polyfills';
          if (id.includes('tesseract.js')) return 'chunk-tesseract';
          if (id.includes('node_modules')) return 'vendor';
        }
      }
    }
  }
})
