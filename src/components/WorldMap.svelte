<script>
  import { onMount } from "svelte";
  import worldMapSvg from "../assets/world-map.svg?raw";

  let {
    activeCountries = [],
    highlightColor = "#EF4444",
    onCountrySelect,
    onHoverCountry
  } = $props();

  let containerEl = $state();
  let showMapKey = $state(false);

  // Default world viewBox bounds
  const defaultVB = { x: 30.767, y: 241.591, w: 784.077, h: 458.627 };
  let currentVB = $state({ ...defaultVB });
  let targetVB = { ...defaultVB };
  let animating = false;

  // Track map labels and highlights in effect
  $effect(() => {
    if (!containerEl) return;

    // Append labels if not present
    addLabels();

    // Clear previous highlights
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

    // Zoom to fit active countries
    if (activeCountries.length > 0) {
      zoomToCountries(activeCountries);
    } else {
      resetZoom();
    }
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

  function zoomToCountries(codes) {
    if (!containerEl) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let found = false;

    codes.forEach((code) => {
      const el = containerEl.querySelector(`#${code.toLowerCase()}`);
      if (el && typeof el.getBBox === "function") {
        try {
          const bbox = el.getBBox();
          if (bbox.width > 0 && bbox.height > 0) {
            minX = Math.min(minX, bbox.x);
            minY = Math.min(minY, bbox.y);
            maxX = Math.max(maxX, bbox.x + bbox.width);
            maxY = Math.max(maxY, bbox.y + bbox.height);
            found = true;
          }
        } catch (e) {
          console.warn("BBox calculation failed", e);
        }
      }
    });

    if (found) {
      let w = maxX - minX;
      let h = maxY - minY;

      // Apply padding (25%)
      const padX = w * 0.25;
      const padY = h * 0.25;
      let targetX = minX - padX;
      let targetY = minY - padY;
      let targetW = w + padX * 2;
      let targetH = h + padY * 2;

      // Prevent zooming in too deep (for tiny nations)
      const minDimension = 90;
      if (targetW < minDimension) {
        targetX -= (minDimension - targetW) / 2;
        targetW = minDimension;
      }
      if (targetH < minDimension * 0.6) {
        targetY -= (minDimension * 0.6 - targetH) / 2;
        targetH = minDimension * 0.6;
      }

      // Constrain within bounds
      targetVB = { x: targetX, y: targetY, w: targetW, h: targetH };
      startViewBoxAnimation();
    } else {
      resetZoom();
    }
  }

  function resetZoom() {
    targetVB = { ...defaultVB };
    startViewBoxAnimation();
  }

  function startViewBoxAnimation() {
    if (!animating) {
      animating = true;
      requestAnimationFrame(animateViewBox);
    }
  }

  function animateViewBox() {
    if (!containerEl) return;
    const ease = 0.09;
    const dx = targetVB.x - currentVB.x;
    const dy = targetVB.y - currentVB.y;
    const dw = targetVB.w - currentVB.w;
    const dh = targetVB.h - currentVB.h;

    if (
      Math.abs(dx) < 0.05 &&
      Math.abs(dy) < 0.05 &&
      Math.abs(dw) < 0.05 &&
      Math.abs(dh) < 0.05
    ) {
      currentVB = { ...targetVB };
      animating = false;
      updateSVGViewBox();
      return;
    }

    currentVB.x += dx * ease;
    currentVB.y += dy * ease;
    currentVB.w += dw * ease;
    currentVB.h += dh * ease;

    updateSVGViewBox();
    requestAnimationFrame(animateViewBox);
  }

  function updateSVGViewBox() {
    const svg = containerEl.querySelector("svg");
    if (svg) {
      svg.setAttribute(
        "viewBox",
        `${currentVB.x} ${currentVB.y} ${currentVB.w} ${currentVB.h}`
      );
    }
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
    const path = e.target.closest("path");
    if (!path) return;
    const countryId = path.id;
    if (countryId && onHoverCountry) {
      onHoverCountry(countryId.toLowerCase());
    }
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="world-map-container">
  <div class="map-controls">
    <button class="map-btn" onclick={resetZoom}>Reset Zoom</button>
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
          <span>Active / Selected Language Countries</span>
        </div>
        <div class="key-item">
          <span class="color-box default-box"></span>
          <span>Other Countries (Click to Explore)</span>
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

  .default-box {
    background: rgba(255, 255, 255, 0.06);
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

  /* Stylize country paths */
  .world-map-wrapper :global(path) {
    fill: rgba(255, 255, 255, 0.06);
    stroke: rgba(255, 255, 255, 0.12);
    stroke-width: 0.6px;
    transition: fill 0.3s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s ease;
    cursor: pointer;
  }

  .world-map-wrapper :global(path:hover) {
    fill: rgba(255, 255, 255, 0.16);
    stroke: rgba(255, 255, 255, 0.3);
  }

  /* highlighted colors */
  .world-map-wrapper :global(path.highlighted) {
    fill: var(--country-fill) !important;
    stroke: var(--country-stroke) !important;
    stroke-width: 1px !important;
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
    fill: rgba(255, 255, 255, 0.3);
    font-size: 8px;
  }

  .world-map-wrapper :global(.map-label.ocean) {
    fill: rgba(255, 255, 255, 0.12);
    font-size: 6px;
    font-style: italic;
  }
</style>
