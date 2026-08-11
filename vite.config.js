import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import shareCards from './scripts/vite-plugin-share-cards.js'
import markdownData from './scripts/vite-plugin-md-data.js'
import staticData from './scripts/vite-plugin-static-data.js'

// Dev-only: resolve directory indexes for the static lite pages so
// /gopro/ and /lite/ behave like they do on gh-pages/Cloudflare (the SPA
// html fallback would otherwise swallow them in dev).
function liteDirIndex() {
  return {
    name: 'wad-lite-dir-index',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = (req.url || '').split('?')[0];
        if (url === '/gopro' || url === '/gopro/') req.url = '/gopro/index.html';
        if (url === '/lite' || url === '/lite/') req.url = '/lite/index.html';
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    liteDirIndex(),
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
    // Bind every interface so the LAN URL (http://<machine-ip>:5173) works
    // alongside localhost. Pinning a literal IP here breaks whenever DHCP
    // hands the machine a new address — bind-all is the stable option.
    host: true,
    // Honors a harness-assigned port (PORT env) so a second dev server can
    // run beside the default one; falls back to vite's usual 5173.
    port: Number(process.env.PORT) || 5173,
    // Never silently bump to 5174 when the port is taken — fail loudly so
    // the network URL stays the same every launch.
    strictPort: true,
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
    // plugin-legacy is gone (it doubled build time to ship SystemJS bundles
    // that old TVs still couldn't really run — Svelte 5 needs Proxy). Old
    // browsers are served by the static ES5 pages in public/ via the
    // index.html gate. This target keeps the modern bundle parseable across
    // the mid-old band (Chrome 84+ ≈ the flex-gap CSS floor).
    target: ['chrome84', 'firefox79', 'safari14'],

    // Forces the CSS compiler to down-compile into safe fallbacks
    cssTarget: 'chrome40',

    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // No blanket node_modules → 'vendor' chunk: that forced every heavy
        // lazily-used dependency (three.js, transformers, lamejs, …) into one
        // preloaded bundle the landing page barely executes — Lighthouse
        // measured it 82% unused. Letting Rollup split along the import graph
        // keeps each dependency inside the lazy chunk that actually needs it.
        manualChunks(id) {
          if (id.includes('tesseract.js')) return 'chunk-tesseract';
        }
      }
    }
  }
})
