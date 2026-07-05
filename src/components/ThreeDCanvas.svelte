<!-- svelte-ignore a11y_no_static_element_interactions -->
<script>
  import { Canvas } from "@threlte/core";
  import { onMount } from "svelte";
  import DogDisplay from "./DogDisplay.svelte";

  let { isFlagColors = false } = $props();

  let models = $state([]);
  let selectedModelId = $state("");
  let selectedModel = $derived(
    models.find((m) => m.id === selectedModelId) || models[0],
  );
  let isDragging = $state(false);

  // Fisher-Yates Shuffle algorithm
  function shuffle(array) {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  }

  onMount(async () => {
    try {
      const res = await fetch("/3d/models.json");
      const data = await res.json();
      if (data && data.length > 0) {
        models = shuffle(data);
        selectedModelId = models[0].id;
      }
    } catch (err) {
      console.error("Failed to load models list:", err);
    }
  });

  const handleNext = () => {
    if (models.length === 0) return;
    const currentIndex = models.findIndex((m) => m.id === selectedModelId);
    const nextIndex = (currentIndex + 1) % models.length;
    selectedModelId = models[nextIndex].id;
  };

  const handlePrev = () => {
    if (models.length === 0) return;
    const currentIndex = models.findIndex((m) => m.id === selectedModelId);
    const prevIndex = (currentIndex - 1 + models.length) % models.length;
    selectedModelId = models[prevIndex].id;
  };
</script>

<div
  class="canvas-container w-full h-full select-none pointer-events-auto"
  class:dragging={isDragging}
  onmousedown={() => (isDragging = true)}
  onmouseup={() => (isDragging = false)}
  onmouseleave={() => (isDragging = false)}
>
  <Canvas>
    <DogDisplay
      {isFlagColors}
      modelPath={selectedModel?.path}
      modelType={selectedModel?.type}
      scaleMultiplier={selectedModel?.scaleMultiplier ?? 1.0}
      centerOffset={selectedModel?.centerOffset ?? [0, 0, 0]}
    />
  </Canvas>

  <!-- Left Arrow Overlay Button -->
  {#if models.length > 1}
    <button
      onclick={handlePrev}
      class="arrow-btn absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-black/55 text-white/80 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-110 cursor-pointer z-10"
      aria-label="Previous Model"
    >
      <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M14 7l-5 5 5 5V7z" />
      </svg>
    </button>
  {/if}

  <!-- Right Arrow Overlay Button -->
  {#if models.length > 1}
    <button
      onclick={handleNext}
      class="arrow-btn absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-black/55 text-white/80 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-110 cursor-pointer z-10"
      aria-label="Next Model"
    >
      <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M10 17l5-5-5-5v10z" />
      </svg>
    </button>
  {/if}

  <!-- Attribution credits overlay at bottom-right of display -->
  {#if selectedModel}
    <div class="attribution-widget">
      <span
        class="name block text-[11px] text-white font-bold tracking-wide uppercase leading-none"
      >
        {selectedModel.name}
      </span>

      {#if selectedModel.attribution}
        <!-- <span
          class="label block text-[7px] text-white/50 uppercase tracking-widest font-bold mt-2"
        >
          Model Credit
        </span> -->
        <a
          href={selectedModel.attribution.link}
          target="_blank"
          rel="noopener noreferrer"
          class="creator block text-[10px] text-white hover:text-red-400 font-bold underline transition-colors mt-0.5 leading-tight"
        >
          {selectedModel.attribution.creator}
        </a>
      {/if}
    </div>
  {/if}
</div>

<style>
  .canvas-container {
    width: 100%;
    height: 100%;
    position: relative;
    background: transparent;
    touch-action: pan-y;
    cursor: grab;
  }
  .canvas-container.dragging {
    cursor: grabbing;
  }

  /* Style arrow button hover effects dynamically with theme variables */
  .arrow-btn:hover {
    color: var(--color-neon-purple, #d61a2c);
    border-color: var(--color-neon-purple, #d61a2c);
    box-shadow: 0 0 10px rgba(var(--color-neon-purple-rgb, 214, 26, 44), 0.25);
  }
  :global(html[data-theme="default"]) .arrow-btn:hover {
    color: #d61a2c;
    border-color: #d61a2c;
    box-shadow: 0 0 10px rgba(214, 26, 44, 0.25);
  }

  .attribution-widget {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    text-align: right;
    background: rgba(0, 0, 0, 0.6);
    padding: 0.625rem; /* 10px */
    border-radius: 0.25rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-width: 200px;
    z-index: 10;
    pointer-events: auto;
    backdrop-filter: blur(4px);
  }

  /* Mobile Landscape adjustments (orientation is landscape and viewport width is small) */
  @media (orientation: landscape) and (max-width: 950px) {
    .attribution-widget {
      bottom: auto;
      top: 1rem;
      right: 1rem;
      padding: 0.375rem; /* 6px */
      max-width: 150px;
    }
    .attribution-widget :global(span.name) {
      font-size: 9px !important;
    }
    .attribution-widget :global(span.label) {
      font-size: 6px !important;
      margin-top: 4px !important;
    }
    .attribution-widget :global(a.creator) {
      font-size: 8px !important;
    }
    .attribution-widget :global(span.license) {
      font-size: 6px !important;
    }
  }
</style>
