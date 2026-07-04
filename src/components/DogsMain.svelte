<script>
  import { onMount } from "svelte";
  import { Mail } from "lucide-svelte";
  import BinaryBackground from "./BinaryBackground.svelte";

  // Props mapping the flag colors toggle state
  let { isFlagColors = false } = $props();

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
  class="w-full h-full relative flex flex-col lg:flex-row justify-between overflow-hidden select-none"
  class:wad-colored={isFlagColors}
  style="background: conic-gradient(from 0deg at 90% 33.3%, var(--bg-main, #000000) 35deg, #f5f5f7 145deg, #f5f5f7 262deg, var(--bg-main, #000000) 277deg);"
>
  <!-- Background Animated Matrix Binary Rain -->
  <BinaryBackground {isFlagColors} />

  <!-- Left UI Layer (High z-index to remain interactable) -->
  <div
    class="w-full lg:w-[60%] h-full flex flex-col justify-between p-6 md:p-12 lg:p-24 relative z-10 pointer-events-none"
  >
    <!-- Top Section: Dictionary entry -->
    <div class="dict-container max-w-[650px] mt-8 lg:mt-0 pointer-events-auto">
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
        a carnivorous mammal (<em>Canis familiaris</em>) that has long been
        domesticated as a pet.
      </p>
    </div>

    <!-- Bottom Section: Info Cards & Mailto button -->
    <div
      class="company-section w-full flex flex-col gap-4 md:gap-6 mb-8 lg:mb-0 pointer-events-auto"
    >
      <div
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 w-full"
      >
        <!-- Headquarters -->
        <div
          class="info-card flex flex-col p-4 md:p-6 rounded-xl md:rounded-2xl bg-[#f8f9fa] border border-black/5 hover:border-black/10 hover:shadow-lg transition-all duration-300"
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
          class="info-card flex flex-col p-4 md:p-6 rounded-xl md:rounded-2xl bg-[#f8f9fa] border border-black/5 hover:border-black/10 hover:shadow-lg transition-all duration-300"
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
          class="info-card col-span-2 flex flex-col p-4 md:p-5 rounded-xl md:rounded-2xl bg-[#f8f9fa] border border-black/5 hover:border-black/10 hover:shadow-lg transition-all duration-300 md:col-span-1 lg:col-span-2"
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
  </div>

  <!-- Right Side 3D Canvas Layer -->
  <div
    class="w-full lg:w-[45%] h-[50vh] lg:h-full absolute bottom-0 lg:top-0 right-0 z-0"
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

  <!-- Continuous Ink Drop & Ripple Animation (Maintains visual continuity) -->
  <div
    class="ink-dripper absolute top-0 left-0 w-full h-full pointer-events-none z-[5]"
  >
    <div class="droplet"></div>
    <div class="ripple ripple-2"></div>
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

  /* Default theme keeps it black/white */
  :global(html[data-theme="default"]) :global(.wad-colored) .contact-btn {
    background: #000000 !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
  }
  :global(html[data-theme="default"]) :global(.wad-colored) .contact-btn:hover {
    background: #111111 !important;
  }

  /* Dictionary Highlight & Theme transitions */
  .dict-def.colored,
  .dict-word.colored {
    color: var(--color-neon-purple, var(--color-neon-red, #ff3344)) !important;
    text-shadow: 0 0 15px rgba(var(--color-neon-purple-rgb, 255, 51, 68), 0.35);
  }

  /* Override to keep text white in default theme */
  :global(html[data-theme="default"]) .dict-def.colored,
  :global(html[data-theme="default"]) .dict-word.colored {
    color: #ffffff !important;
    text-shadow: none !important;
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
</style>
