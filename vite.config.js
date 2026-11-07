import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'
import shareCards from './scripts/vite-plugin-share-cards.js'
import markdownData from './scripts/vite-plugin-md-data.js'
import staticData from './scripts/vite-plugin-static-data.js'
import blogTimeline from './scripts/vite-plugin-blog-timeline.js'

const THREE_BUILD_MODULES = /[\\/]node_modules[\\/]three[\\/]build[\\/]/
const THREE_CORE_MODULE = /[\\/]node_modules[\\/]three[\\/]build[\\/]three\.core/

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Frontmatter .md files import as { default: frontmatter, body } — the
    // correspondence letters compile straight into the bundle, one file each.
    markdownData(),
    // Runtime-fetched datasets live in src/data with everything else; this
    // serves/copies them at /data/fundraiser/* and /data/store/*.
    staticData(),
    // Dates every line of every blog post from git history — the reader's
    // scrollbar is a timeline of when each stretch was written.
    blogTimeline(),
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
  optimizeDeps: {
    // Only the MP3 worker imports this, so the dev server's startup scan never
    // sees it. Discovered late, it gets re-bundled and the page force-reloads —
    // in the middle of someone's conversion. It is already plain ESM: serve it
    // as it is.
    exclude: ['wasm-media-encoders'],
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
    rolldownOptions: {
      output: {
        // Everything else splits automatically, so a library stays behind the
        // lazy import that needs it. A catch-all vendor chunk would modulepreload
        // all of them on the landing page. Only three is grouped: threlte imports
        // it whole, and as one chunk its legacy build passes the size limit.
        codeSplitting: {
          groups: [
            { name: 'three-core', test: THREE_CORE_MODULE, priority: 1 },
            { name: 'three', test: THREE_BUILD_MODULES },
          ],
        },
      },
    },
  }
})
