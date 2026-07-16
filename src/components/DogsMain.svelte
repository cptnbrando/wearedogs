<script>
  import { onMount } from "svelte";
  import { Mail } from "lucide-svelte";
  import BinaryBackground from "./BinaryBackground.svelte";
  import DogsLogo from "./DogsLogo.svelte";
  import { audioCore } from "../lib/AudioCore.svelte.js";

  // Props mapping the flag colors toggle state
  let { isFlagColors = false, active = false, activePage = null } = $props();

  let activeLandscapeTab = $state("cards"); // 'cards' or 'skeleton'

  // Lazy load the 3D canvas component to maintain initial speed
  let ThreeDCanvas = $state(null);
  let isDesktopOrLandscape = $state(false);

  // Lazy load the 3D canvas component ONLY when the page is active/visible
  $effect(() => {
    if (active && !ThreeDCanvas) {
      import("./ThreeDCanvas.svelte")
        .then((module) => {
          ThreeDCanvas = module.default;
        })
        .catch((err) => {
          console.error("Failed to lazy load Threlte canvas:", err);
        });
    }
  });

  onMount(() => {
    const media = window.matchMedia(
      "(min-width: 1024px), (orientation: landscape)",
    );
    isDesktopOrLandscape = media.matches;
    const listener = (e) => {
      isDesktopOrLandscape = e.matches;
    };
    media.addEventListener("change", listener);

    return () => {
      media.removeEventListener("change", listener);
    };
  });
</script>

<div
  class="w-full h-full relative flex flex-col lg:flex-row justify-between overflow-hidden select-none"
  class:wad-colored={isFlagColors}
  class:page-active={active}
>
  <!-- Animated Background Gradient Layer -->
  <div class="page-background-gradient pointer-events-none"></div>

  <!-- Background Animated Matrix Binary Rain -->
  <div
    class="matrix-layer absolute inset-0 z-0 pointer-events-none overflow-hidden"
  >
    <BinaryBackground {isFlagColors} />
  </div>

  <!-- Left UI Layer (High z-index to remain interactable) -->
  <div
    class="w-full lg:w-[60%] h-full flex flex-col max-lg:landscape:flex-row lg:flex-col justify-between max-lg:landscape:justify-between lg:justify-between max-lg:landscape:items-stretch lg:items-stretch p-6 md:p-12 lg:p-24 relative z-10 pointer-events-none gap-4 max-lg:landscape:gap-8 lg:gap-0"
  >
    <!-- Top Section: Dictionary entry -->
    <div
      class="dict-container w-full max-lg:landscape:w-[46%] lg:w-full max-w-[650px] mt-2 max-sm:mt-0 max-lg:landscape:mt-0 lg:mt-0 pointer-events-auto max-lg:landscape:my-auto"
    >
      <div class="flex items-center gap-2.5 md:gap-3.5">
        <button
          class="logo-btn pointer-events-auto focus:outline-none"
          onclick={() =>
            window.dispatchEvent(
              new CustomEvent(
                audioCore.isPlaying ? "open-music-panel" : "open-info-panel",
              ),
            )}
          aria-label="DOGS Logo"
        >
          <DogsLogo size="dict" />
        </button>
        <h2
          class="dict-word font-black text-white tracking-tight uppercase text-3xl md:text-4xl lg:text-5xl transition-colors duration-500"
          class:colored={isFlagColors}
        >
          DOGS
        </h2>
        <span
          class="phonetic text-white/50 font-mono text-sm md:text-base lg:text-lg"
        >
          /dôɡz/
        </span>
        <span
          class="part-of-speech text-white/40 italic text-xs md:text-sm lg:text-base font-serif"
        >
          n.
        </span>
      </div>
      <p
        class="dict-def text-white/80 text-sm md:text-lg lg:text-xl font-light tracking-wide leading-relaxed mt-2 transition-all duration-500"
        class:colored={isFlagColors}
      >
        a carnivorous mammal (<span class="italic">Canis Familiaris</span>) that
        has long been domesticated as a pet.
      </p>

      <!-- Inline 3D Canvas for mobile portrait viewports -->
      <div
        class="block landscape:hidden lg:hidden w-full h-[40vh] relative z-0"
      >
        {#if !isDesktopOrLandscape && ThreeDCanvas && activePage === null}
          <ThreeDCanvas {isFlagColors} {active} />
        {:else}
          <div class="w-full h-full bg-transparent pointer-events-none">
            <div
              class="text-white/20 text-xs font-mono tracking-widest uppercase animate-pulse"
            >
              Initializing 3D Visualizer...
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- Bottom Section: Info Cards & Mailto button -->
    <div
      class="company-section w-full max-lg:landscape:w-[48%] lg:w-full flex flex-col justify-between max-lg:landscape:h-full gap-2 max-lg:landscape:gap-0 md:gap-6 mb-2 max-sm:mb-16 landscape:mb-0 lg:mb-0 pointer-events-none"
    >
      <!-- Info content wrapper: hidden when skeleton is active on mobile landscape -->
      <div
        class="flex flex-col gap-2 max-lg:landscape:gap-1.5 md:gap-6 w-full max-lg:landscape:my-auto pointer-events-auto"
        class:landscape:max-lg:hidden={activeLandscapeTab === "skeleton"}
      >
        <div class="cards-grid">
          <!-- Founding Info Card -->
          <div
            class="info-card flex items-center justify-center gap-2.5 rounded-xl md:rounded-2xl bg-[#f8f9fa] border border-black/5 hover:border-black/10 hover:shadow-lg transition-all duration-300"
          >
            <span class="text-base md:text-lg pointer-events-none">📅</span>
            <span
              class="card-value text-xs sm:text-sm md:text-base font-bold text-black"
              >formed in 2026</span
            >
          </div>

          <!-- Email Link Card -->
          <a
            href="mailto:brando@wearedogs.net?subject=Hello%20There!&body=BARK%20BARK%20BARK%20BARK%20BARK%20BARK%20BARK"
            class="info-card contact-card flex items-center justify-center gap-2 rounded-xl md:rounded-2xl bg-[#f8f9fa] border border-black/5 hover:border-black/10 hover:shadow-lg transition-all duration-300"
          >
            <Mail size={16} class="text-black" />
            <span
              class="card-value text-xs sm:text-sm md:text-base font-bold text-black"
              >email us</span
            >
          </a>

          <!-- Location Info Box (spans full width underneath) -->
          <div
            class="info-card full-width-card flex items-center justify-center gap-2.5 rounded-xl md:rounded-2xl bg-[#f8f9fa] border border-black/5 hover:border-black/10 hover:shadow-lg transition-all duration-300"
          >
            <span class="text-base md:text-lg pointer-events-none">🏙️</span>
            <span
              class="card-value text-xs sm:text-sm md:text-base font-bold text-black"
              >somewhere between Oklahoma and Texas</span
            >
          </div>
        </div>
      </div>

      <!-- Toggle tab control (Only visible in mobile landscape viewports, positioned underneath cards/3D view) -->
      <div
        class="hidden landscape:max-lg:flex justify-center bg-black/10 p-0.5 rounded-lg mt-auto w-full max-w-[180px] mx-auto border border-black/5 pointer-events-auto"
      >
        <button
          onclick={() => (activeLandscapeTab = "cards")}
          class="flex-1 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all duration-200"
          class:bg-black={activeLandscapeTab === "cards"}
          class:text-white={activeLandscapeTab === "cards"}
          class:shadow-sm={activeLandscapeTab === "cards"}
          class:text-black={activeLandscapeTab !== "cards"}
          class:opacity-50={activeLandscapeTab !== "cards"}
        >
          Info
        </button>
        <button
          onclick={() => (activeLandscapeTab = "skeleton")}
          class="flex-1 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all duration-200"
          class:bg-black={activeLandscapeTab === "skeleton"}
          class:text-white={activeLandscapeTab === "skeleton"}
          class:shadow-sm={activeLandscapeTab === "skeleton"}
          class:text-black={activeLandscapeTab !== "skeleton"}
          class:opacity-50={activeLandscapeTab !== "skeleton"}
        >
          3D View
        </button>
      </div>
    </div>
  </div>

  <!-- Right Side 3D Canvas Layer -->
  <div
    class="canvas-layer hidden landscape:block lg:block w-full max-lg:landscape:w-[50%] lg:w-[45%] h-[35vh] max-lg:landscape:h-full lg:h-full absolute bottom-0 max-lg:landscape:top-0 lg:top-0 right-0 z-0"
    class:landscape:max-lg:hidden={activeLandscapeTab === "cards"}
  >
    {#if isDesktopOrLandscape && ThreeDCanvas && activePage === null}
      <ThreeDCanvas {isFlagColors} {active} />
    {:else}
      <!-- Minimal CSS skeleton fallback loading states -->
      <div
        class="w-full h-full flex items-center justify-center bg-transparent pointer-events-none"
      >
        <div
          class="text-white/20 text-xs font-mono tracking-widest uppercase animate-pulse"
        >
          Initializing 3D Visualizer...
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Contact Card */
  .contact-card {
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .contact-card :global(svg) {
    stroke: #000000;
    transition: stroke 0.3s ease;
  }

  /* Color highlights for active color mode on contact-card */
  :global(.wad-colored) .contact-card {
    background: var(
      --color-neon-purple,
      var(--color-neon-red, #ff3344)
    ) !important;
    border-color: transparent !important;
    box-shadow: 0 0 15px rgba(var(--color-neon-purple-rgb, 255, 51, 68), 0.35) !important;
  }
  :global(.wad-colored) .contact-card .card-value {
    color: #ffffff !important;
  }
  :global(.wad-colored) .contact-card :global(svg) {
    stroke: #ffffff !important;
  }

  :global(.wad-colored) .contact-card:hover {
    background: var(
      --color-neon-purple,
      var(--color-neon-red, #ff3344)
    ) !important;
    opacity: 0.9;
    box-shadow: 0 0 25px rgba(var(--color-neon-purple-rgb, 255, 51, 68), 0.5) !important;
  }

  /* Default theme uses neon red scrollbar color when active */
  :global(html[data-theme="default"]) :global(.wad-colored) .contact-card {
    background: #d61a2c !important;
    box-shadow: 0 0 15px rgba(214, 26, 44, 0.35) !important;
    border-color: transparent !important;
  }
  :global(html[data-theme="default"])
    :global(.wad-colored)
    .contact-card:hover {
    background: #d61a2c !important;
    opacity: 0.9;
    box-shadow: 0 0 25px rgba(214, 26, 44, 0.5) !important;
  }

  /* Dictionary Highlight & Theme transitions */
  .dict-def.colored,
  .dict-word.colored {
    color: var(--color-neon-purple, var(--color-neon-red, #ff3344)) !important;
    text-shadow: 0 0 15px rgba(var(--color-neon-purple-rgb, 255, 51, 68), 0.35);
  }

  /* Override to use neon red in default theme when active */
  :global(html[data-theme="default"]) .dict-def.colored,
  :global(html[data-theme="default"]) .dict-word.colored {
    color: #d61a2c !important;
    text-shadow: 0 0 15px rgba(214, 26, 44, 0.35) !important;
  }

  /* Chic Card hover styling */
  .info-card {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    text-decoration: none;
    text-align: center;
  }

  .info-card:hover {
    transform: translateY(-5px);
    background: #ffffff;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
    border-color: rgba(0, 0, 0, 0.15);
  }

  /* Theme highlight integrated colors */
  .wad-colored .info-card:hover {
    border-color: var(--color-neon-red, #ff3344) !important;
    box-shadow: 0 12px 35px
      rgba(var(--color-neon-purple-rgb, 255, 51, 68), 0.12);
  }

  /* Grid layout rules with orientation override */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.625rem; /* gap-2.5 */
    width: 100%;
  }

  .full-width-card {
    grid-column: span 2 / span 2;
  }

  /* Cards padding and responsiveness */
  .info-card {
    padding: 1.125rem 0.75rem;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @media (min-width: 768px) {
    .cards-grid {
      gap: 1rem;
    }
    .info-card {
      padding: 1.75rem 1.5rem;
    }
  }

  @media (max-width: 1023px) and (orientation: landscape) {
    .cards-grid {
      gap: 0.375rem; /* gap-1.5 */
    }
    .info-card {
      padding: 0.75rem 0.625rem;
    }
  }

  /* Futuristic stagger entry/exit transitions - Default (Exit State) is swift */
  .dict-container,
  .company-section,
  .canvas-layer {
    opacity: 0;
    transition:
      transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
      filter 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, opacity, filter;
  }

  .dict-container {
    transform: translate3d(-50px, 0, 0) skewX(-4deg);
    filter: blur(8px);
  }

  .canvas-layer {
    transform: scale(0.82) translate3d(60px, 0, 0);
    filter: blur(10px);
  }

  .company-section {
    transform: translate3d(0, 50px, 0) scale(0.95);
    filter: blur(6px);
  }

  /* Active/visible page states - Entry State is longer and smoother */
  .page-active .dict-container,
  .page-active .company-section,
  .page-active .canvas-layer {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1) skewX(0);
    filter: blur(0px);
    transition:
      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
      filter 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Delays for entry transitions to create visual sequence */
  .page-active .dict-container {
    transition-delay: 0.1s;
  }

  .page-active .canvas-layer {
    transition-delay: 0.25s;
  }

  .page-active .company-section {
    transition-delay: 0.38s;
  }

  /* Animated background gradient layer rules - Exit is swift */
  .page-background-gradient {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: linear-gradient(
      180deg,
      var(--bg-main, #000000) 0%,
      var(--bg-main, #000000) 45%,
      #f5f5f7 70%,
      #f5f5f7 100%
    );
    transition: transform 0.38s cubic-bezier(0.16, 1, 0.3, 1);
    transform: translate3d(0, 100%, 0); /* Swipe up from bottom */
    will-change: transform;
  }

  @media (orientation: landscape) {
    .page-background-gradient {
      background: linear-gradient(
        90deg,
        var(--bg-main, #000000) 0%,
        var(--bg-main, #000000) 45%,
        #f5f5f7 55%,
        #f5f5f7 100%
      );
      transform: translate3d(100%, 0, 0); /* Swipe in from right */
    }
  }

  @media (min-width: 1024px) {
    .page-background-gradient {
      background: conic-gradient(
        from 0deg at 90% 33.3%,
        var(--bg-main, #000000) 35deg,
        #f5f5f7 145deg,
        #f5f5f7 262deg,
        var(--bg-main, #000000) 277deg
      );
    }
  }

  /* Entry transition has longer easing */
  .page-active .page-background-gradient {
    transform: translate3d(0, 0, 0);
    transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Animated background matrix rain canvas container rules - Exit is swift */
  .matrix-layer {
    transition: transform 0.38s cubic-bezier(0.16, 1, 0.3, 1);
    transform: translate3d(0, -100%, 0); /* Swipe down from top */
    will-change: transform;
  }

  @media (orientation: landscape) {
    .matrix-layer {
      transform: translate3d(-100%, 0, 0); /* Swipe in from left */
    }
  }

  /* Entry transition has longer easing */
  .page-active .matrix-layer {
    transform: translate3d(0, 0, 0);
    transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
  }
</style>
