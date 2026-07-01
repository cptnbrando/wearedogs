<script>
  import { onMount } from "svelte";
  import worldMapSvg from "../assets/world-map.svg?raw";
  import countryStats from "../lib/countryStats.json" with { type: "json" };

  let {
    activeCountries = [],
    highlightColor = "#EF4444",
    onCountrySelect,
  } = $props();

  let containerEl = $state();
  let showMapKey = $state(false);

  // Tooltip & Mouse state
  let hoveredCountry = $state(null);
  let mouseX = $state(0);
  let mouseY = $state(0);

  // Set of all countries covered by at least one language
  const coveredCountries = new Set([
    "us", "gb", "ca", "au", "nz",
    "es", "mx", "ar", "co", "pe", "ve", "cl", "ec", "bo", "py", "uy", "gt", "hn", "sv", "ni", "cr", "pa", "do", "cu",
    "fr", "be", "ch", "sn", "ci", "cg", "cd", "cm", "mg", "ne", "ml", "bf", "tg", "bj", "ga", "dj", "gq", "cf", "km", "bi", "rw",
    "de", "at", "li", "lu",
    "jp",
    "cn", "tw", "hk", "mo", "sg",
    "pt", "br", "ao", "mz", "gw", "tl", "cv", "st",
    "it", "sm", "va",
    "ru", "by", "kz", "kg",
    "kr", "kp",
    "in",
    "eg", "sa", "ae", "dz", "ma", "sd", "iq", "ye", "sy", "td", "tn", "ly", "jo", "er", "lb", "mr", "kw", "om", "qa", "bh", "so", "ps",
    "bd",
    "pk",
    "id",
    "my", "bn",
    "vn",
    "th",
    "lk",
    "np",
    "mm",
    "kh",
    "la",
    "ph"
  ]);

  // Helper calculations for tooltip
  function calculateTotalMortality(stats) {
    if (!stats) return 0;
    return Math.round(
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
        stats.overdose_alcohol) * 10
    ) / 10;
  }

  function calculateLifeExpectancy(stats) {
    if (!stats) return 75;
    const base = 75;
    const acBonus = (stats.ac_adoption / 100) * 3.5;
    const vacBonus = (stats.vaccines / 100) * 4.2;
    const hcBonus = (stats.gov_healthcare / 100) * 5.0;
    const totalMortality = calculateTotalMortality(stats);
    const mortalityPenalty = totalMortality / 75;
    return Math.round((base + acBonus + vacBonus + hcBonus - mortalityPenalty) * 10) / 10;
  }

  // Track map labels and highlights in effect
  $effect(() => {
    if (!containerEl) return;

    // Append labels if not present
    addLabels();

    // Mark covered countries
    containerEl.querySelectorAll("path").forEach((el) => {
      const id = el.id ? el.id.toLowerCase() : "";
      if (id && coveredCountries.has(id)) {
        el.classList.add("covered");
      }
    });

    // Clear previous active highlights
    containerEl.querySelectorAll(".highlighted").forEach((el) => {
      el.classList.remove("highlighted");
      el.style.removeProperty("--country-fill");
      el.style.removeProperty("--country-stroke");
    });

    // Apply active highlights
    activeCountries.forEach((code) => {
      const el = containerEl.querySelector(`#${code.toLowerCase()}`);
      if (el) {
        el.classList.add("highlighted");
        el.style.setProperty("--country-fill", highlightColor + "55");
        el.style.setProperty("--country-stroke", highlightColor);
      }
    });
  });

  function addLabels() {
    const svg = containerEl.querySelector("svg");
    if (!svg) return;
    if (svg.querySelector(".map-labels")) return;

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "map-labels");

    const labels = [
      { text: "NORTH AMERICA", x: 190, y: 350, type: "continent" },
      { text: "SOUTH AMERICA", x: 280, y: 570, type: "continent" },
      { text: "EUROPE", x: 435, y: 365, type: "continent" },
      { text: "AFRICA", x: 450, y: 510, type: "continent" },
      { text: "ASIA", x: 610, y: 360, type: "continent" },
      { text: "AUSTRALIA", x: 720, y: 610, type: "continent" },
      { text: "PACIFIC OCEAN", x: 90, y: 460, type: "ocean" },
      { text: "ATLANTIC OCEAN", x: 330, y: 450, type: "ocean" },
      { text: "INDIAN OCEAN", x: 580, y: 550, type: "ocean" },
      { text: "ARCTIC OCEAN", x: 400, y: 260, type: "ocean" },
    ];

    labels.forEach((l) => {
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
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
    const path = e.target.closest("path");
    if (!path) return;
    const countryId = path.id;
    if (countryId && onCountrySelect) {
      onCountrySelect(countryId.toLowerCase());
    }
  }

  function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const path = e.target.closest("path");
    if (path && path.id) {
      const countryId = path.id.toLowerCase();
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
          <span class="color-box highlighted-box" style="background: {highlightColor}"></span>
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

  {#if hoveredCountry && countryStats[hoveredCountry]}
    {@const stats = countryStats[hoveredCountry]}
    {@const life = calculateLifeExpectancy(stats)}
    {@const deaths = calculateTotalMortality(stats)}
    <div class="map-tooltip" style="left: {mouseX + 16}px; top: {mouseY + 16}px;">
      <div class="tooltip-header font-bold text-white mb-1 flex items-center gap-1.5">
        <span class="w-1.5 h-3 rounded-sm bg-orange-400"></span>
        <span>{stats.name}</span>
      </div>
      <div class="tooltip-row flex justify-between gap-4 text-[10px] text-white/70">
        <span>Life Expectancy:</span>
        <strong class="text-green-400 font-mono">{life} yrs</strong>
      </div>
      <div class="tooltip-row flex justify-between gap-4 text-[10px] text-white/70">
        <span>Mortality Index:</span>
        <strong class="text-red-400 font-mono">{deaths}</strong>
      </div>
      <div class="tooltip-details mt-1 pt-1 border-t border-white/5 flex gap-2 text-[9px] text-white/40">
        <span>🚗 Auto: {stats.auto}</span>
        <span>🔫 Gun: {stats.gun_violence}</span>
        <span>❄️ A/C: {stats.ac_adoption}%</span>
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
    position: fixed;
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
    flex-grow: 1;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .world-map-wrapper :global(svg) {
    width: 100%;
    height: 100%;
    max-height: 500px;
  }

  /* Default base country paths */
  .world-map-wrapper :global(path) {
    fill: rgba(255, 255, 255, 0.04);
    stroke: rgba(255, 255, 255, 0.1);
    stroke-width: 0.5px;
    transition: fill 0.25s ease, stroke 0.25s ease;
    cursor: pointer;
  }

  .world-map-wrapper :global(path:hover) {
    fill: rgba(255, 255, 255, 0.08);
    stroke: rgba(255, 255, 255, 0.15);
  }

  /* Mild dim border & fill for covered languages/represented locales */
  .world-map-wrapper :global(path.covered) {
    stroke: rgba(255, 255, 255, 0.4) !important;
    stroke-width: 0.9px !important;
    fill: rgba(255, 255, 255, 0.12) !important;
  }

  .world-map-wrapper :global(path.covered:hover) {
    fill: rgba(255, 255, 255, 0.22) !important;
    stroke: rgba(255, 255, 255, 0.65) !important;
  }

  /* Active highlight overrides covered styles */
  .world-map-wrapper :global(path.highlighted) {
    fill: var(--country-fill) !important;
    stroke: var(--country-stroke) !important;
    stroke-width: 1.1px !important;
  }

  /* map labels positioning */
  .world-map-wrapper :global(.map-label) {
    font-family: "Outfit", "Inter", sans-serif;
    font-weight: 700;
    letter-spacing: 0.15em;
    pointer-events: none;
    user-select: none;
  }

  .world-map-wrapper :global(.map-label.continent) {
    fill: rgba(255, 255, 255, 0.28);
    font-size: 8px;
  }

  .world-map-wrapper :global(.map-label.ocean) {
    fill: rgba(255, 255, 255, 0.12);
    font-size: 6px;
    font-style: italic;
  }
</style>
