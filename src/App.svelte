<script>
  import {
    we_are_dogs,
    currentLanguage,
    setLanguage,
    languages,
  } from "./lib/i18n.js";
</script>

<main
  class="flex flex-col items-center justify-center w-screen h-screen bg-black text-white gap-8"
>
  <h1 class="text-8xl font-black text-center">
    {we_are_dogs()}
  </h1>
  <button
    class="btn btn-primary cursor-pointer"
    onclick={() => setLanguage(currentLanguage === "en" ? "es" : "en")}
  >
    Switch Language
  </button>
</main>
