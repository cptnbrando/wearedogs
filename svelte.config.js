import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import("@sveltejs/vite-plugin-svelte").SvelteConfig} */
export default {
  preprocess: vitePreprocess(),
  onwarn: (warning, handler) => {
    if (warning.code === 'css_unused_selector' || warning.code === 'css-unused-selector') return;
    handler(warning);
  }
}
