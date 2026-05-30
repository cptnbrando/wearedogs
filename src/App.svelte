<script>
  import { we_are_dogs, currentLanguage, setLanguage, languages } from './lib/i18n.js';
</script>

<main class="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
  <article class="text-center">
    <h1 class="text-6xl font-bold text-white drop-shadow-lg mb-8">
      {we_are_dogs()}
    </h1>
    
    <div class="flex gap-2 flex-wrap justify-center">
      {#each languages as lang}
        <button
          on:click={() => setLanguage(lang)}
          class="px-4 py-2 rounded font-semibold transition {$currentLanguage === lang 
            ? 'bg-white text-blue-600' 
            : 'bg-white/20 text-white hover:bg-white/30'}"
        >
          {lang.toUpperCase()}
        </button>
      {/each}
    </div>
  </article>
</main>

<style>
  main {
    font-family: system-ui, -apple-system, sans-serif;
  }
</style>
