import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'
import shareCards from './scripts/vite-plugin-share-cards.js'
import markdownData from './scripts/vite-plugin-md-data.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Frontmatter .md files import as { default: frontmatter, body } — the
    // correspondence letters compile straight into the bundle, one file each.
    markdownData(),
    tailwindcss(),
    svelte(),
    legacy({
      targets: ['defaults', 'chrome >= 40', 'not IE 11'],
      modernPolyfills: true,
    }),
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
    // build.target is owned by @vitejs/plugin-legacy (via its `targets` option
    // above) — setting it here just gets overridden with a warning.

    // Forces the CSS compiler to down-compile into safe fallbacks
    cssTarget: 'chrome40',

    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('tesseract.js')) return 'chunk-tesseract';
          if (id.includes('node_modules')) return 'vendor';
        }
      }
    }
  }
})
