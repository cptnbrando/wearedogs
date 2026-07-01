<script>
  let { allLangItems = [] } = $props();

  // Top 8 languages by speakers for the charts tab
  const topSpeakers = $derived(
    [...allLangItems]
      .filter((item) => item.speakersNum > 0)
      .sort((a, b) => b.speakersNum - a.speakersNum)
      .slice(0, 8)
  );

  // Top 8 regions by dog populations for the dogs tab
  const topDogs = $derived(
    [...allLangItems]
      .filter((item) => item.dogsNum > 0)
      .sort((a, b) => b.dogsNum - a.dogsNum)
      .slice(0, 8)
  );
</script>

<div class="tab-pane animated-pane flex flex-col gap-8">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Section 1: Speakers (Humans) -->
    <div class="flex flex-col gap-4">
      <div>
        <h2 class="text-base font-bold text-white uppercase tracking-wider">
          Speakers Distribution
        </h2>
        <p class="description text-xs text-white/50 mt-1 mb-4">
          A breakdown of the top cataloged languages by approximate L1
          speaker counts worldwide.
        </p>
      </div>

      <div class="speakers-chart-container flex flex-col gap-4 bg-white/[0.01] border border-white/5 p-5 rounded-2xl">
        {#each topSpeakers as item}
          <div class="chart-row flex flex-col gap-1.5">
            <div class="chart-row-lbl flex justify-between text-xs font-semibold">
              <span class="chart-lang-name text-white/90">{item.displayName}</span>
              <span class="chart-lang-val font-mono text-white/40">{item.speakersText}</span>
            </div>
            <div class="chart-bar-outer h-2 w-full bg-white/[0.02] rounded-full overflow-hidden">
              <div
                class="chart-bar-inner h-full rounded-full transition-[width] duration-1000 ease-out"
                style="width: {topSpeakers[0] ? (item.speakersNum / topSpeakers[0].speakersNum) * 100 : 0}%; background: linear-gradient(90deg, {item.colors[0]}, {item.colors[1] || item.colors[0]})"
              ></div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Section 2: Dog Populations -->
    <div class="flex flex-col gap-4">
      <div>
        <h2 class="text-base font-bold text-white uppercase tracking-wider">
          Dog Populations by Region
        </h2>
        <p class="description text-xs text-white/50 mt-1 mb-4">
          Analysis of domestic dog populations estimated within the
          primary geographic regions of each language.
        </p>
      </div>

      <div class="speakers-chart-container flex flex-col gap-4 bg-white/[0.01] border border-white/5 p-5 rounded-2xl">
        {#each topDogs as item}
          <div class="chart-row flex flex-col gap-1.5">
            <div class="chart-row-lbl flex justify-between text-xs font-semibold">
              <span class="chart-lang-name text-white/90">
                {item.displayName} ({item.country.split("&")[0].trim()})
              </span>
              <span class="chart-lang-val font-mono text-white/40">{item.dogsText}</span>
            </div>
            <div class="chart-bar-outer h-2 w-full bg-white/[0.02] rounded-full overflow-hidden">
              <div
                class="chart-bar-inner h-full rounded-full transition-[width] duration-1000 ease-out"
                style="width: {topDogs[0] ? (item.dogsNum / topDogs[0].dogsNum) * 100 : 0}%; background: linear-gradient(90deg, {item.colors[1] || item.colors[0]}, {item.colors[2] || item.colors[0]})"
              ></div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
