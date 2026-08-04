import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'
import shareCards from './scripts/vite-plugin-share-cards.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
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
    proxy: {
      '/vid': {
        target: 'https://data.wearedogs.net',
        changeOrigin: true,
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
