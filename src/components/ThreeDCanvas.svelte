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

      // Easily set to test dog models & animations here
      // selectedModelId = "nintendog";

      // Dynamically fetch file sizes in the background
      models.forEach(async (model) => {
        if (model.path) {
          try {
            const headRes = await fetch(model.path, { method: "HEAD" });
            const size = headRes.headers.get("content-length");
            if (size) {
              const bytes = parseInt(size, 10);
              let sizeStr = "";
              if (bytes >= 1048576) {
                sizeStr = (bytes / 1048576).toFixed(1) + "mb";
              } else {
                sizeStr = Math.round(bytes / 1024) + "kb";
              }
              model.fileSize = sizeStr;
            }
          } catch (err) {
            console.warn(`Could not fetch size for ${model.name}:`, err);
          }
        }
      });
    } catch (err) {
      console.error("Failed to load models list:", err);
    }

    const handleGlobalKeydown = (e) => {
      if (
        document.activeElement &&
        (document.activeElement.tagName === "INPUT" ||
          document.activeElement.tagName === "TEXTAREA" ||
          document.activeElement.isContentEditable)
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        window.dispatchEvent(
          new CustomEvent("rotate-skeleton", {
            detail: { direction: "left" },
          }),
        );
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        window.dispatchEvent(
          new CustomEvent("rotate-skeleton", {
            detail: { direction: "right" },
          }),
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handleGlobalKeydown);

    return () => {
      window.removeEventListener("keydown", handleGlobalKeydown);
    };
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

  let startX = 0;
  let startY = 0;
  let startTime = 0;

  const handlePointerDown = (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startTime = Date.now();
  };

  const handlePointerUp = (e) => {
    isDragging = false;
    const diffX = Math.abs(e.clientX - startX);
    const diffY = Math.abs(e.clientY - startY);
    const duration = Date.now() - startTime;

    // Trigger spin only if it's a quick click/tap (minimal movement and duration)
    if (diffX < 5 && diffY < 5 && duration < 250) {
      window.dispatchEvent(new CustomEvent("spin-model"));
    }
  };
</script>

<div
  class="canvas-container w-full h-full select-none pointer-events-auto"
  class:dragging={isDragging}
  onpointerdown={handlePointerDown}
  onpointerup={handlePointerUp}
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
        {#if selectedModel.fileSize}
          <span
            class="file-size font-normal text-white/50"
            class:colored={isFlagColors}
          >
            ({selectedModel.fileSize})
          </span>
        {/if}
      </span>

      {#if selectedModel.attribution}
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

  .file-size {
    margin-left: 0.25rem;
    transition: color 0.3s ease;
  }
  .file-size.colored {
    color: var(--color-neon-purple, var(--color-neon-red, #ff3344)) !important;
    text-shadow: 0 0 10px rgba(var(--color-neon-purple-rgb, 255, 51, 68), 0.35);
  }
  :global(html[data-theme="default"]) .file-size.colored {
    color: #d61a2c !important;
    text-shadow: 0 0 10px rgba(214, 26, 44, 0.35) !important;
  }
</style>
