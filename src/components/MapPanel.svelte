<script>
  import BasePanel from "./BasePanel.svelte";
  import mapSpots from "../lib/mapSpots.json";
  import { spring } from "svelte/motion";
  import { Star, MapPin, ExternalLink, Coffee, Wine, UtensilsCrossed, Sparkles, Music } from "lucide-svelte";

  let { isClosing = false, onClose } = $props();

  const CITIES = [
    { name: "New York", x: 220, y: 110, zoomX: 160, zoomY: 70, zoomW: 120, zoomH: 90 },
    { name: "London", x: 390, y: 80, zoomX: 350, zoomY: 50, zoomW: 100, zoomH: 80 },
    { name: "Tokyo", x: 710, y: 120, zoomX: 660, zoomY: 80, zoomW: 100, zoomH: 80 },
    { name: "Sydney", x: 730, y: 360, zoomX: 680, zoomY: 310, zoomW: 120, zoomH: 90 },
    { name: "Rio de Janeiro", x: 260, y: 280, zoomX: 200, zoomY: 230, zoomW: 120, zoomH: 100 },
    { name: "Cape Town", x: 440, y: 360, zoomX: 390, zoomY: 310, zoomW: 120, zoomH: 100 }
  ];

  let selectedCity = $state(null);
  let activeCategory = $state("restaurants"); // 'restaurants' | 'concert-halls' | 'free-shit'
  let activeSubCategory = $state("Coffee Shops"); // only for restaurants: 'Coffee Shops', 'Bars', 'Italian', 'Mexican'

  // Map view springs
  const mapX = spring(0, { stiffness: 0.1, damping: 0.8 });
  const mapY = spring(0, { stiffness: 0.1, damping: 0.8 });
  const mapW = spring(800, { stiffness: 0.1, damping: 0.8 });
  const mapH = spring(450, { stiffness: 0.1, damping: 0.8 });

  function selectCity(city) {
    if (selectedCity?.name === city.name) {
      // Toggle back to default
      selectedCity = null;
      mapX.set(0);
      mapY.set(0);
      mapW.set(800);
      mapH.set(450);
    } else {
      selectedCity = city;
      mapX.set(city.zoomX);
      mapY.set(city.zoomY);
      mapW.set(city.zoomW);
      mapH.set(city.zoomH);
    }
  }

  // Filter listings based on active selections
  let filteredSpots = $derived.by(() => {
    return mapSpots.filter((spot) => {
      if (spot.category !== activeCategory) return false;
      if (activeCategory === "restaurants" && spot.subCategory !== activeSubCategory) return false;
      return true;
    });
  });
</script>

<BasePanel title="World Spots Explorer" {isClosing} {onClose}>
  <div class="map-explorer-layout">
    <!-- Map Canvas Side -->
    <div class="map-canvas-side">
      <div class="cities-bar">
        {#each CITIES as city}
          <button
            class="city-btn"
            class:active={selectedCity?.name === city.name}
            onclick={() => selectCity(city)}
          >
            <MapPin size={12} />
            <span>{city.name}</span>
          </button>
        {/each}
      </div>

      <div class="svg-container">
        <svg
          viewBox="{$mapX} {$mapY} {$mapW} {$mapH}"
          class="world-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Grid Overlay -->
          <defs>
            <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 51, 68, 0.05)" stroke-width="0.7" />
            </pattern>
          </defs>
          <rect width="800" height="450" fill="url(#map-grid)" />

          <!-- Stylized simple world borders outline -->
          <!-- Continents coordinates shapes -->
          <polygon points="50,60 120,40 180,30 250,50 260,80 200,100 210,130 230,140 170,160 140,190 120,180 110,140 70,110 40,80" class="continent-path" />
          <polygon points="190,190 230,190 260,220 280,260 250,330 210,410 190,410 180,330 170,250" class="continent-path" />
          <polygon points="360,50 420,40 470,50 480,90 450,120 460,150 400,160 380,130 350,110 340,70" class="continent-path" />
          <polygon points="350,180 430,170 470,200 500,240 480,310 440,360 410,370 380,320 370,280 340,230" class="continent-path" />
          <polygon points="480,50 580,30 700,40 750,70 760,120 720,160 740,210 680,240 600,260 560,270 490,240 470,160 490,120" class="continent-path" />
          <polygon points="630,280 660,270 680,300 740,320 760,360 720,380 670,350" class="continent-path" />

          <!-- Interactive Pins -->
          {#each CITIES as city}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
            <g
              class="city-pin"
              class:active={selectedCity?.name === city.name}
              onclick={() => selectCity(city)}
              role="button"
              tabindex="0"
              aria-label={city.name}
            >
              <circle cx={city.x} cy={city.y} r="10" class="pin-pulse" />
              <circle cx={city.x} cy={city.y} r="4" class="pin-dot" />
              <text x={city.x} y={city.y - 10} class="pin-text">{city.name}</text>
            </g>
          {/each}
        </svg>
      </div>
    </div>

    <!-- Directory Listings Side -->
    <div class="directory-side">
      <!-- Category Selection Tabs -->
      <div class="category-tabs">
        <button
          class="cat-tab"
          class:active={activeCategory === "restaurants"}
          onclick={() => { activeCategory = "restaurants"; activeSubCategory = "Coffee Shops"; }}
        >
          <UtensilsCrossed size={14} />
          <span>Restaurants</span>
        </button>
        <button
          class="cat-tab"
          class:active={activeCategory === "concert-halls"}
          onclick={() => activeCategory = "concert-halls"}
        >
          <Music size={14} />
          <span>Concert Halls</span>
        </button>
        <button
          class="cat-tab"
          class:active={activeCategory === "free-shit"}
          onclick={() => activeCategory = "free-shit"}
        >
          <Sparkles size={14} />
          <span>Free Shit</span>
        </button>
      </div>

      <!-- Sub-categories Row (only for restaurants) -->
      {#if activeCategory === "restaurants"}
        <div class="sub-category-row">
          {#each ["Coffee Shops", "Bars", "Italian", "Mexican"] as sub}
            <button
              class="sub-pill"
              class:active={activeSubCategory === sub}
              onclick={() => activeSubCategory = sub}
            >
              {#if sub === "Coffee Shops"}<Coffee size={10} />
              {:else if sub === "Bars"}<Wine size={10} />
              {/if}
              <span>{sub}</span>
            </button>
          {/each}
        </div>
      {/if}

      <!-- Directory List -->
      <div class="spots-list scroll-container">
        {#each filteredSpots as spot}
          <div class="spot-card animated-pane">
            <div class="spot-card-head">
              <h3>{spot.name}</h3>
              <a href={spot.mapsUrl} target="_blank" class="maps-link" aria-label="Open Google Maps">
                <ExternalLink size={12} />
              </a>
            </div>
            
            <!-- Custom 2.5 Stars Component -->
            <div class="star-rating-row">
              <Star size={12} fill="#ffcc00" stroke="none" />
              <Star size={12} fill="#ffcc00" stroke="none" />
              <!-- Half Star -->
              <span class="half-star-container">
                <Star size={12} stroke="none" fill="rgba(255,255,255,0.15)" />
                <span class="half-star-fill">
                  <Star size={12} fill="#ffcc00" stroke="none" />
                </span>
              </span>
              <Star size={12} fill="rgba(255,255,255,0.15)" stroke="none" />
              <Star size={12} fill="rgba(255,255,255,0.15)" stroke="none" />
              <span class="rating-val">{spot.rating} / 5</span>
            </div>

            <p class="spot-desc">{spot.description}</p>
          </div>
        {:else}
          <div class="no-spots">
            <p>No listings found in this category.</p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</BasePanel>

<style>
  .map-explorer-layout {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    height: 100%;
    gap: 1.5rem;
    padding: 1.2rem;
    box-sizing: border-box;
    overflow: hidden;
  }

  @media (max-width: 900px) {
    .map-explorer-layout {
      grid-template-columns: 1fr;
      grid-template-rows: 300px 1fr;
      overflow-y: auto;
    }
  }

  /* Map Side */
  .map-canvas-side {
    display: flex;
    flex-direction: column;
    height: 100%;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    background: rgba(5, 5, 8, 0.4);
    overflow: hidden;
  }

  .cities-bar {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.2);
    overflow-x: auto;
    scrollbar-width: none;
  }
  .cities-bar::-webkit-scrollbar {
    display: none;
  }

  .city-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.03);
    color: rgba(255, 255, 255, 0.6);
    border-radius: 6px;
    font-size: 0.75rem;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;
  }

  .city-btn:hover {
    color: white;
    background: rgba(255, 255, 255, 0.08);
  }

  .city-btn.active {
    color: #ff3344;
    border-color: rgba(255, 51, 68, 0.4);
    background: rgba(255, 51, 68, 0.08);
    box-shadow: 0 0 10px rgba(255, 51, 68, 0.15);
  }

  .svg-container {
    flex: 1;
    position: relative;
    width: 100%;
    height: 100%;
  }

  .world-svg {
    width: 100%;
    height: 100%;
    background: #040408;
  }

  .continent-path {
    fill: rgba(255, 255, 255, 0.02);
    stroke: rgba(255, 255, 255, 0.07);
    stroke-width: 1.2;
  }

  /* Pins */
  .city-pin {
    cursor: pointer;
    outline: none;
  }

  .pin-dot {
    fill: #ff3344;
    filter: drop-shadow(0 0 4px #ff3344);
  }

  .pin-pulse {
    fill: none;
    stroke: #ff3344;
    stroke-width: 1;
    opacity: 0.6;
    animation: pinRing 1.8s infinite ease-out;
    transform-origin: center;
  }

  @keyframes pinRing {
    0% {
      r: 4;
      opacity: 0.9;
    }
    100% {
      r: 20;
      opacity: 0;
    }
  }

  .pin-text {
    fill: rgba(255, 255, 255, 0.7);
    font-size: 8px;
    font-weight: bold;
    font-family: monospace;
    text-anchor: middle;
    pointer-events: none;
  }

  .city-pin:hover .pin-text, .city-pin.active .pin-text {
    fill: white;
  }

  /* Directory Side */
  .directory-side {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .category-tabs {
    display: flex;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 2px;
  }

  .cat-tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.45);
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .cat-tab:hover {
    color: white;
  }

  .cat-tab.active {
    color: white;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
  }

  .sub-category-row {
    display: flex;
    gap: 6px;
    padding: 0.6rem 0;
    overflow-x: auto;
  }

  .sub-pill {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(255,255,255,0.02);
    color: rgba(255,255,255,0.45);
    border-radius: 20px;
    font-size: 0.7rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .sub-pill:hover, .sub-pill.active {
    color: white;
    border-color: rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.06);
  }

  /* Spots List */
  .spots-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-right: 4px;
  }

  .spot-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .spot-card:hover {
    border-color: rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.04);
    transform: translateY(-2px);
  }

  .spot-card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .spot-card-head h3 {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 700;
    color: white;
  }

  .maps-link {
    color: rgba(255, 255, 255, 0.4);
    transition: color 0.2s ease;
  }

  .maps-link:hover {
    color: #ff3344;
  }

  /* Star ratings */
  .star-rating-row {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .half-star-container {
    position: relative;
    display: inline-flex;
  }

  .half-star-fill {
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    overflow: hidden;
  }

  .rating-val {
    font-size: 0.65rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.4);
    margin-left: 6px;
  }

  .spot-desc {
    margin: 0;
    font-size: 0.72rem;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.45);
  }

  .no-spots {
    padding: 2rem;
    text-align: center;
    color: rgba(255, 255, 255, 0.35);
    font-size: 0.8rem;
  }
</style>
