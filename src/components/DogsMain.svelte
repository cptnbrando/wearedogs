<script>
  import { onMount } from "svelte";
  import { Mail } from "lucide-svelte";
  import BinaryBackground from "./BinaryBackground.svelte";

  // Props mapping the flag colors toggle state
  let { isFlagColors = false } = $props();

  let activeLandscapeTab = $state('cards'); // 'cards' or 'skeleton'

  // Lazy load the 3D canvas component to maintain initial speed
  let ThreeDCanvas = $state(null);
  onMount(async () => {
    try {
      const module = await import("./ThreeDCanvas.svelte");
      ThreeDCanvas = module.default;
    } catch (err) {
      console.error("Failed to lazy load Threlte canvas:", err);
    }
  });
</script>

<div
  class="w-full h-full relative flex flex-col lg:flex-row justify-between overflow-hidden select-none bg-[linear-gradient(180deg,_var(--bg-main,_#000000)_0%,_var(--bg-main,_#000000)_45%,_#f5f5f7_70%,_#f5f5f7_100%)] landscape:bg-[linear-gradient(90deg,_var(--bg-main,_#000000)_0%,_var(--bg-main,_#000000)_45%,_#f5f5f7_55%,_#f5f5f7_100%)] lg:bg-[conic-gradient(from_0deg_at_90%_33.3%,_var(--bg-main,_#000000)_35deg,_#f5f5f7_145deg,_#f5f5f7_262deg,_var(--bg-main,_#000000)_277deg)]"
  class:wad-colored={isFlagColors}
>
  <!-- Background Animated Matrix Binary Rain -->
  <BinaryBackground {isFlagColors} />

  <!-- Left UI Layer (High z-index to remain interactable) -->
  <div
    class="w-full lg:w-[60%] h-full flex flex-col max-lg:landscape:flex-row lg:flex-col justify-between max-lg:landscape:justify-between lg:justify-between max-lg:landscape:items-stretch lg:items-stretch p-6 md:p-12 lg:p-24 relative z-10 pointer-events-none gap-4 max-lg:landscape:gap-8 lg:gap-0"
  >
    <!-- Top Section: Dictionary entry -->
    <div class="dict-container w-full max-lg:landscape:w-[46%] lg:w-full max-w-[650px] mt-4 max-lg:landscape:mt-0 lg:mt-0 pointer-events-auto max-lg:landscape:my-auto">
      <div class="flex items-baseline gap-2.5 md:gap-3.5">
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
        a carnivorous mammal (<span class="italic">Canis familiaris</span>)
        that has long been domesticated as a dog.
      </p>

      <!-- Inline 3D Canvas for mobile portrait viewports -->
      <div class="block landscape:hidden lg:hidden w-full h-[34vh] relative z-0">
        {#if ThreeDCanvas}
          <ThreeDCanvas {isFlagColors} />
        {:else}
          <div class="w-full h-full flex items-center justify-center bg-transparent pointer-events-none">
            <div class="text-white/20 text-xs font-mono tracking-widest uppercase animate-pulse">
              Initializing 3D Visualizer...
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- Bottom Section: Info Cards & Mailto button -->
    <div
      class="company-section w-full max-lg:landscape:w-[48%] lg:w-full flex flex-col justify-between max-lg:landscape:h-full gap-3 max-lg:landscape:gap-0 md:gap-6 mb-4 landscape:mb-0 lg:mb-0 pointer-events-none"
    >
      <!-- Info content wrapper: hidden when skeleton is active on mobile landscape -->
      <div
        class="flex flex-col gap-3 max-lg:landscape:gap-1.5 md:gap-6 w-full max-lg:landscape:my-auto pointer-events-auto"
        class:landscape:max-lg:hidden={activeLandscapeTab === 'skeleton'}
      >
        <div
          class="cards-grid"
        >
          <!-- Headquarters -->
          <div
            class="info-card flex flex-col rounded-xl md:rounded-2xl bg-[#f8f9fa] border border-black/5 hover:border-black/10 hover:shadow-lg transition-all duration-300"
          >
            <span
              class="card-title text-[10px] md:text-xs uppercase tracking-wider text-black/40 font-bold mb-1 md:mb-2"
              >Headquarters</span
            >
            <span
              class="card-value text-base md:text-lg lg:text-xl font-bold text-black"
              >Dallas, TX</span
            >
          </div>

          <!-- Established -->
          <div
            class="info-card flex flex-col rounded-xl md:rounded-2xl bg-[#f8f9fa] border border-black/5 hover:border-black/10 hover:shadow-lg transition-all duration-300"
          >
            <span
              class="card-title text-[10px] md:text-xs uppercase tracking-wider text-black/40 font-bold mb-1 md:mb-2"
              >Established</span
            >
            <span
              class="card-value text-base md:text-lg lg:text-xl font-bold text-black"
              >Formed in 2026</span
            >
          </div>

          <!-- Expertise -->
          <div
            class="info-card specializing-card flex flex-col rounded-xl md:rounded-2xl bg-[#f8f9fa] border border-black/5 hover:border-black/10 hover:shadow-lg transition-all duration-300"
          >
            <span
              class="card-title text-[10px] md:text-xs uppercase tracking-wider text-black/40 font-bold mb-1 md:mb-2"
              >Specializing In</span
            >
            <div class="flex flex-wrap gap-1 md:gap-1.5">
              <span
                class="badge px-2 py-0.5 bg-black text-white text-[9px] md:text-[10px] font-semibold rounded-full uppercase tracking-wider"
                >Web Design</span
              >
              <span
                class="badge px-2 py-0.5 bg-black text-white text-[9px] md:text-[10px] font-semibold rounded-full uppercase tracking-wider"
                >App Dev</span
              >
              <span
                class="badge px-2 py-0.5 bg-black text-white text-[9px] md:text-[10px] font-semibold rounded-full uppercase tracking-wider"
                >AI Consultation</span
              >
            </div>
          </div>
        </div>

        <div class="flex justify-start">
          <a
            href="mailto:brando@wearedogs.net?subject=Hello%20There!&body=BARK%20BARK%20BARK%20BARK%20BARK%20BARK%20BARK"
            class="contact-btn"
          >
            <Mail size={16} />
            Contact Us Today
          </a>
        </div>
      </div>

      <!-- Toggle tab control (Only visible in mobile landscape viewports, positioned underneath cards/3D view) -->
      <div class="hidden landscape:max-lg:flex justify-center bg-black/10 p-0.5 rounded-lg mt-auto w-full max-w-[180px] mx-auto border border-black/5 pointer-events-auto">
        <button
          onclick={() => activeLandscapeTab = 'cards'}
          class="flex-1 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all duration-200"
          class:bg-black={activeLandscapeTab === 'cards'}
          class:text-white={activeLandscapeTab === 'cards'}
          class:shadow-sm={activeLandscapeTab === 'cards'}
          class:text-black={activeLandscapeTab !== 'cards'}
          class:opacity-50={activeLandscapeTab !== 'cards'}
        >
          Info
        </button>
        <button
          onclick={() => activeLandscapeTab = 'skeleton'}
          class="flex-1 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all duration-200"
          class:bg-black={activeLandscapeTab === 'skeleton'}
          class:text-white={activeLandscapeTab === 'skeleton'}
          class:shadow-sm={activeLandscapeTab === 'skeleton'}
          class:text-black={activeLandscapeTab !== 'skeleton'}
          class:opacity-50={activeLandscapeTab !== 'skeleton'}
        >
          3D View
        </button>
      </div>
    </div>
  </div>

  <!-- Right Side 3D Canvas Layer -->
  <div
    class="hidden landscape:block lg:block w-full max-lg:landscape:w-[50%] lg:w-[45%] h-[35vh] max-lg:landscape:h-full lg:h-full absolute bottom-0 max-lg:landscape:top-0 lg:top-0 right-0 z-0"
    class:landscape:max-lg:hidden={activeLandscapeTab === 'cards'}
  >
    {#if ThreeDCanvas}
      <ThreeDCanvas {isFlagColors} />
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
  /* Contact Button */
  .contact-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: #000000;
    color: #ffffff;
    font-weight: 700;
    border-radius: 0.75rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.75rem;
    cursor: pointer;
    text-decoration: none;
  }
  @media (min-width: 768px) {
    .contact-btn {
      font-size: 0.875rem;
    }
  }
  .contact-btn:hover {
    transform: scale(1.02);
    background: #111111;
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  /* Color highlights for active color mode */
  :global(.wad-colored) .contact-btn {
    background: var(
      --color-neon-purple,
      var(--color-neon-red, #ff3344)
    ) !important;
    border-color: transparent !important;
    box-shadow: 0 0 15px rgba(var(--color-neon-purple-rgb, 255, 51, 68), 0.35) !important;
  }
  :global(.wad-colored) .contact-btn:hover {
    background: var(
      --color-neon-purple,
      var(--color-neon-red, #ff3344)
    ) !important;
    opacity: 0.9;
    box-shadow: 0 0 25px rgba(var(--color-neon-purple-rgb, 255, 51, 68), 0.5) !important;
  }

  /* Default theme uses neon red scrollbar color when active */
  :global(html[data-theme="default"]) :global(.wad-colored) .contact-btn {
    background: #d61a2c !important;
    box-shadow: 0 0 15px rgba(214, 26, 44, 0.35) !important;
    border-color: transparent !important;
  }
  :global(html[data-theme="default"]) :global(.wad-colored) .contact-btn:hover {
    background: #d61a2c !important;
    opacity: 0.9;
    box-shadow: 0 0 25px rgba(214, 26, 44, 0.5) !important;
  }

  /* Default theme badges/chips use darker neon red when active */
  :global(html[data-theme="default"]) .wad-colored .badge {
    background-color: #d61a2c !important;
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

  /* Dripping Droplet Animation on the Right */
  .droplet {
    position: absolute;
    left: 90%;
    top: 33.3%;
    width: 14px;
    height: 14px;
    background: var(--bg-main, #000000);
    border-radius: 50% 0 50% 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    opacity: 0;
    animation: drop-fall-down 3.2s infinite cubic-bezier(0.5, 0, 0.85, 1);
  }

  .ripple {
    position: absolute;
    left: 90%;
    top: 90%;
    width: 70px;
    height: 18px;
    border: 2px solid var(--bg-main, #000000);
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    pointer-events: none;
  }

  .ripple-1 {
    animation: ripple-out 3.2s infinite cubic-bezier(0.1, 0.8, 0.3, 1);
  }

  .ripple-2 {
    animation: ripple-out 3.2s infinite cubic-bezier(0.1, 0.8, 0.3, 1);
    animation-delay: 0s;
  }

  @keyframes drop-fall-down {
    0% {
      top: 25.3%;
      transform: translate(-50%, -50%) rotate(-45deg) scale(0);
      opacity: 0;
    }
    2% {
      top: 25.3%;
      transform: translate(-50%, -50%) rotate(-45deg) scale(1.5, 0.4);
      opacity: 1;
    }
    8% {
      top: 25.3%;
      transform: translate(-50%, -50%) rotate(-45deg) scale(1.1, 0.9);
      opacity: 1;
    }
    13% {
      top: 31%;
      transform: translate(-50%, -50%) rotate(-45deg) scale(0.8, 1.5);
      opacity: 1;
    }
    16% {
      top: 32%;
      transform: translate(-50%, -50%) rotate(-45deg) scale(1, 1);
      opacity: 1;
    }
    40% {
      top: 90%;
      transform: translate(-50%, -50%) rotate(-45deg) scale(0.65, 1.35);
      opacity: 1;
    }
    41% {
      top: 90%;
      transform: translate(-50%, -50%) rotate(-45deg) scale(0, 0);
      opacity: 0;
    }
    42%,
    100% {
      top: 30.3%;
      transform: translate(-50%, -50%) rotate(-45deg) scale(0);
      opacity: 0;
    }
  }

  @keyframes ripple-out {
    0%,
    40% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
    }
    41% {
      transform: translate(-50%, -50%) scale(0.1);
      opacity: 0.8;
    }
    70% {
      transform: translate(-50%, -50%) scale(2.8);
      opacity: 0;
    }
    100% {
      transform: translate(-50%, -50%) scale(2.8);
      opacity: 0;
    }
  }

  /* Chic Card hover styling */
  .info-card {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .info-card:hover {
    transform: translateY(-5px);
    background: #ffffff;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
    border-color: rgba(0, 0, 0, 0.15);
  }

  /* Theme highlight integrated colors */
  .wad-colored .info-card:hover {
    border-color: var(
      --color-neon-purple,
      --color-neon-red,
      #ff3344
    ) !important;
    box-shadow: 0 12px 35px
      rgba(var(--color-neon-purple-rgb, 255, 51, 68), 0.12);
  }

  .wad-colored .badge {
    background-color: var(
      --color-neon-purple,
      --color-neon-red,
      #ff3344
    ) !important;
  }

  /* Grid layout rules with orientation override */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.625rem; /* gap-2.5 */
    width: 100%;
  }
  .specializing-card {
    grid-column: span 2 / span 2;
  }

  /* Cards padding and responsiveness */
  .info-card {
    padding: 0.75rem; /* p-3 */
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @media (min-width: 768px) {
    .cards-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
    }
    .specializing-card {
      grid-column: span 1 / span 1;
    }
    .info-card {
      padding: 1.5rem; /* p-6 */
    }
    .specializing-card {
      padding: 1.25rem; /* p-5 */
    }
  }

  @media (max-width: 1023px) and (orientation: landscape) {
    .cards-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.375rem; /* gap-1.5 */
    }
    .specializing-card {
      grid-column: span 2 / span 2;
    }
    .info-card {
      padding: 0.375rem 0.625rem; /* py-1.5 px-2.5 */
    }
    .info-card .card-title {
      margin-bottom: 0.125rem !important; /* mb-0.5 */
    }
  }

  @media (min-width: 1024px) {
    .cards-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .specializing-card {
      grid-column: span 2 / span 2;
    }
  }
</style>
