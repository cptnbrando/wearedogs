<script>
  import WorldMap from "../WorldMap.svelte";

  let {
    activeColor,
    activeLangItem,
    activeCountries,
    enrichedCountryStats,
    countryColorsMap,
    countryLanguagesMap,
    handleCountrySelect,
  } = $props();
</script>

<div class="tab-pane animated-pane flex flex-col gap-5 h-full">
  <div class="map-view-header">
    <h2 class="text-base font-bold text-white uppercase tracking-wider">
      Planet Earth
    </h2>
    <p class="text-xs text-white/50 mt-1">
      Currently highlighting target countries for: <span
        class="font-bold text-white"
        style="color: {activeColor}">{activeLangItem.displayName}</span
      >. Hover over the map to view statistics overlay, or click any country to
      inspect stats dynamically.
    </p>
  </div>

  <div class="flex-1 min-h-[380px] w-full">
    <WorldMap
      {activeCountries}
      countryStats={enrichedCountryStats}
      countryColors={countryColorsMap}
      countryLanguages={countryLanguagesMap}
      highlightColor={activeColor}
      onCountrySelect={handleCountrySelect}
    />
  </div>
</div>
