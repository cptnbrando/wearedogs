<script>
  import TitlePage from "./components/TitlePage.svelte";
  import { themeManager } from "./lib/themeManager.svelte.js";
</script>

<main
  class="relative flex items-center justify-center w-screen h-dvh overflow-hidden"
  style="background: var(--bg-radial-overlay, #050508); color: var(--color-text, #ffffff); font-family: var(--font-primary, inherit);"
>
  <TitlePage />
</main>
