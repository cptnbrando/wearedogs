<script>
  let { allLangItems = [], onSelectLang } = $props();

  function handleSelect(code) {
    if (onSelectLang) {
      onSelectLang(code);
    }
  }
</script>

<div class="tab-pane animated-pane">
  <h2 class="text-base font-bold text-white uppercase tracking-wider">
    Flag Color Palettes
  </h2>
  <p class="description text-xs text-white/50 mt-1 mb-6">
    Each language features a signature tri-color gradient sweep based
    on national flags or HSL hash values.
  </p>

  <div class="palettes-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {#each allLangItems.slice(0, 36) as item}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="palette-card p-2 bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.06] rounded-xl cursor-pointer hover:-translate-y-0.5 transition-all duration-300"
        onclick={() => handleSelect(item.code)}
      >
        <div class="palette-swatch-box h-12 rounded-lg overflow-hidden flex border border-white/10">
          <div class="flex-grow" style="background: {item.colors[0]}"></div>
          <div class="flex-grow" style="background: {item.colors[1]}"></div>
          <div class="flex-grow" style="background: {item.colors[2]}"></div>
        </div>
        <div class="palette-card-meta flex flex-col mt-2 px-1">
          <span class="p-name text-xs font-bold text-white/85 truncate">
            {item.displayName}
          </span>
          <span class="p-code text-[9px] uppercase tracking-wider font-mono text-white/30">
            {item.code}
          </span>
        </div>
      </div>
    {/each}
  </div>
</div>
