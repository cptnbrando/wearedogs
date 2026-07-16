<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<script>
  import { onMount } from "svelte";
  import worldMapSvg from "../assets/world-map.svg?raw";

  let {
    activeCountries = [],
    highlightColor = "#EF4444",
    countryStats = {},
    countryColors = {},
    countryLanguages = {},
    onCountrySelect,
  } = $props();

  let containerEl = $state();
  let showMapKey = $state(false);

  // Tooltip & Mouse state
  let hoveredCountry = $state(null);
  let mouseX = $state(0);
  let mouseY = $state(0);
  let tooltipOnLeft = $state(false);
  let tooltipOnTop = $state(false);

  // Helper calculations for tooltip
  function calculateTotalMortality(stats) {
    if (!stats) return 0;
    return (
      Math.round(
        (stats.cancer +
          stats.old_age +
          stats.auto +
          stats.suicide +
          stats.gun_violence +
          stats.knife_violence +
          stats.police_brutality +
          stats.food_poisoning +
          stats.overdose_heroin +
          stats.overdose_meth +
          stats.overdose_cocaine +
          stats.overdose_alcohol) *
          10,
      ) / 10
    );
  }

  function calculateLifeExpectancy(stats) {
    if (!stats) return 75;
    const base = 75;
    const acBonus = (stats.ac_adoption / 100) * 3.5;
    const vacBonus = (stats.vaccines / 100) * 4.2;
    const hcBonus = (stats.gov_healthcare / 100) * 5.0;
    const totalMortality = calculateTotalMortality(stats);
    const mortalityPenalty = totalMortality / 75;
    return (
      Math.round(
        (base + acBonus + vacBonus + hcBonus - mortalityPenalty) * 10,
      ) / 10
    );
  }

  // Track map labels and highlights in effect
  $effect(() => {
    if (!containerEl) return;

    // Append labels if not present
    addLabels();

    // Clear previous active highlights
    containerEl.querySelectorAll(".highlighted").forEach((el) => {
      el.classList.remove("highlighted");
    });

    // Set styles on each covered country dynamically using color variables
    for (const [code, color] of Object.entries(countryColors)) {
      const el = containerEl.querySelector(`#${code.toLowerCase()}`);
      if (el) {
        el.classList.add("covered");
        el.style.setProperty("--c-color", color);

        const isActive = activeCountries.includes(code);
        if (isActive) {
          el.classList.add("highlighted");
        } else {
          el.classList.remove("highlighted");
        }
      }
    }
  });

  function addLabels() {
    const svg = containerEl.querySelector("svg");
    if (!svg) return;
    if (svg.querySelector(".map-labels")) return;

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "map-labels");

    const labels = [
      { text: "NORTH AMERICA", x: 180, y: 395, type: "continent" },
      { text: "SOUTH AMERICA", x: 295, y: 590, type: "continent" },
      { text: "EUROPE", x: 440, y: 375, type: "continent" },
      { text: "AFRICA", x: 460, y: 535, type: "continent" },
      { text: "ASIA", x: 620, y: 385, type: "continent" },
      { text: "AUSTRALIA", x: 720, y: 620, type: "continent" },
      { text: "PACIFIC OCEAN", x: 90, y: 460, type: "ocean" },
      { text: "ATLANTIC OCEAN", x: 330, y: 450, type: "ocean" },
      { text: "INDIAN OCEAN", x: 580, y: 550, type: "ocean" },
      { text: "ARCTIC OCEAN", x: 400, y: 260, type: "ocean" },
    ];

    labels.forEach((l) => {
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      text.setAttribute("x", l.x);
      text.setAttribute("y", l.y);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("class", `map-label ${l.type}`);
      text.textContent = l.text;
      g.appendChild(text);
    });

    svg.appendChild(g);
  }

  function handleClick(e) {
    const el = e.target.closest("path[id], g[id]");
    if (!el) return;
    const countryId = el.id;
    if (countryId && onCountrySelect) {
      onCountrySelect(countryId.toLowerCase());
    }
  }

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    // Shift tooltip to the left if the mouse is on the right half of the map
    tooltipOnLeft = mouseX > rect.width / 2;
    // Shift tooltip to top if the mouse is on the bottom half of the map
    tooltipOnTop = mouseY > rect.height / 2;

    const el = e.target.closest("path[id], g[id]");
    if (el && el.id) {
      const countryId = el.id.toLowerCase();
      // Only set hoveredCountry if statistics exist for it
      if (countryStats[countryId]) {
        hoveredCountry = countryId;
        return;
      }
    }
    hoveredCountry = null;
  }

  function handleMouseLeave() {
    hoveredCountry = null;
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="world-map-container" onmouseleave={handleMouseLeave}>
  <div class="map-controls">
    <button class="map-btn" onclick={() => (showMapKey = !showMapKey)}>
      {showMapKey ? "Hide Map Key" : "Show Map Key"}
    </button>
  </div>

  {#if showMapKey}
    <div class="map-key-overlay">
      <h4>NATION OVERLAY KEY</h4>
      <div class="key-items">
        <div class="key-item">
          <span
            class="color-box highlighted-box"
            style="background: {highlightColor}"
          ></span>
          <span>Selected Language Countries</span>
        </div>
        <div class="key-item">
          <span class="color-box covered-box"></span>
          <span>Represented Locales (Click to inspect)</span>
        </div>
        <div class="key-item">
          <span class="color-box default-box"></span>
          <span>Other Countries / Regions</span>
        </div>
      </div>
    </div>
  {/if}

  <div
    bind:this={containerEl}
    class="world-map-wrapper"
    onclick={handleClick}
    onmousemove={handleMouseMove}
  >
    {@html worldMapSvg}

    {#if hoveredCountry && countryStats[hoveredCountry]}
      {@const stats = countryStats[hoveredCountry]}
      {@const life = calculateLifeExpectancy(stats)}
      {@const deaths = calculateTotalMortality(stats)}
      <div
        class="map-tooltip"
        style="left: {tooltipOnLeft ? mouseX : mouseX + 16}px;
          top: {tooltipOnTop ? mouseY : mouseY + 16}px;
          transform: translate({tooltipOnLeft ? '-105%' : '0px'}, {tooltipOnTop ? '-105%' : '0px'});"
      >
        <div
          class="tooltip-header font-bold text-white mb-1 flex items-center gap-1.5"
        >
          <span class="w-1.5 h-3 rounded-sm bg-orange-400"></span>
          <span
            >{stats.name}
            {#if countryLanguages[hoveredCountry]}<span
                class="text-white/50 font-normal"
                >({countryLanguages[hoveredCountry]})</span
              >{/if}</span
          >
        </div>
        <div
          class="tooltip-row flex justify-between gap-4 text-[10px] text-white/70"
        >
          <span>Life Expectancy:</span>
          <strong class="text-green-400 font-mono">{life} yrs</strong>
        </div>
        <div
          class="tooltip-row flex justify-between gap-4 text-[10px] text-white/70"
        >
          <span>Mortality Index:</span>
          <strong class="text-red-400 font-mono">{deaths}</strong>
        </div>
        <div
          class="tooltip-details mt-1 pt-1 border-t border-white/5 flex gap-2 text-[9px] text-white/40"
        >
          <span>🚗 Auto: {stats.auto}</span>
          <span>🔫 Gun: {stats.gun_violence}</span>
          <span>❄️ A/C: {stats.ac_adoption}%</span>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .world-map-container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 380px;
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    overflow: hidden;
  }

  .map-controls {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    gap: 8px;
    z-index: 20;
  }

  .map-btn {
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.72rem;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    backdrop-filter: blur(4px);
    transition: all 0.2s ease;
  }

  .map-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border-color: rgba(255, 255, 255, 0.2);
  }

  .map-key-overlay {
    position: absolute;
    bottom: 12px;
    left: 12px;
    background: rgba(10, 10, 15, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 12px;
    border-radius: 8px;
    backdrop-filter: blur(8px);
    z-index: 20;
    max-width: 250px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  }

  .map-key-overlay h4 {
    margin: 0 0 8px 0;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.5);
  }

  .key-items {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .key-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.8);
  }

  .color-box {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    flex-shrink: 0;
    border: 1px solid rgba(255, 255, 255, 0.15);
  }

  .highlighted-box {
    box-shadow: 0 0 6px var(--country-stroke);
  }

  .covered-box {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.12);
  }

  .default-box {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.12);
  }

  /* Floating hover stats tooltip */
  .map-tooltip {
    position: absolute;
    background: rgba(10, 10, 15, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    padding: 8px 12px;
    pointer-events: none;
    z-index: 1000;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    gap: 2.5px;
    min-width: 170px;
  }

  .world-map-wrapper {
    position: relative;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .world-map-wrapper :global(svg) {
    width: 100%;
    height: 100%;
    max-height: 500px;
    overflow: hidden;
  }

  /* Default base country paths */
  .world-map-wrapper :global(path) {
    fill: rgba(255, 255, 255, 0.04);
    stroke: rgba(255, 255, 255, 0.1);
    stroke-width: 0.5px;
    transition:
      fill 0.25s ease,
      stroke 0.25s ease;
    cursor: pointer;
  }

  .world-map-wrapper :global(path:hover) {
    fill: rgba(255, 255, 255, 0.08);
    stroke: rgba(255, 255, 255, 0.15);
  }

  /* Mild dim border & fill for covered languages/represented locales */
  .world-map-wrapper :global(path.covered),
  .world-map-wrapper :global(g.covered path) {
    stroke: var(--c-color) !important;
    stroke-width: 0.8px !important;
    fill: color-mix(in srgb, var(--c-color) 10%, transparent) !important;
    transition:
      fill 0.2s ease,
      stroke 0.2s ease;
  }

  .world-map-wrapper :global(path.covered:hover),
  .world-map-wrapper :global(g.covered path:hover) {
    fill: color-mix(in srgb, var(--c-color) 23%, transparent) !important;
    stroke-width: 1.1px !important;
  }

  /* Active highlight overrides covered styles */
  .world-map-wrapper :global(path.highlighted),
  .world-map-wrapper :global(g.highlighted path) {
    fill: color-mix(in srgb, var(--c-color) 60%, transparent) !important;
    stroke: var(--c-color) !important;
    stroke-width: 1.4px !important;
  }

  /* map labels positioning */
  .world-map-wrapper :global(.map-label) {
    font-family: "Outfit", "Inter", sans-serif;
    pointer-events: none;
    user-select: none;
    paint-order: stroke fill;
  }

  .world-map-wrapper :global(.map-label.continent) {
    fill: #ffffff;
    stroke: rgba(10, 10, 15, 0.85);
    stroke-width: 3.5px;
    font-weight: 900;
    font-size: 11px;
    letter-spacing: 0.25em;
  }

  .world-map-wrapper :global(.map-label.ocean) {
    fill: rgba(255, 255, 255, 0.55);
    stroke: rgba(10, 10, 15, 0.7);
    stroke-width: 2.5px;
    font-weight: 700;
    font-size: 9px;
    letter-spacing: 0.2em;
    font-style: italic;
  }
</style>
