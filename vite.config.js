import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    svelte(),
    legacy({
      targets: ['defaults', 'chrome >= 55', 'not IE 11'],
      modernPolyfills: true,
    })
  ],
  server: {
    proxy: {
      '/api-worldcup': {
        target: 'https://worldcup26.ir',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-worldcup/, '')
      }
    }
  },
  build: {
    target: 'modules',

    // Forces the CSS compiler to down-compile into safe fallbacks
    cssTarget: 'chrome55',

    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})
