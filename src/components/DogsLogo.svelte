<script>
  import { fade } from "svelte/transition";
  import { audioCore } from "../lib/AudioCore.svelte.js";
  import dogSingLottie from "../assets/dog-sing.lottie?url";
  import dogSingMp4 from "../assets/dog-sing.mp4";
  import dogsLogoWebp from "../assets/dogs-logo-cropped.webp";
  import dogsLogoPng from "../assets/dogs-logo-cropped.png";

  let { size = "panel", class: customClass = "" } = $props();

  let isLottieLoaded = $state(false);

  // Svelte action to handle Lottie element event listeners safely
  function setupLottie(node) {
    const handleLoad = () => {
      console.log("Lottie loaded successfully!");
      isLottieLoaded = true;
    };
    const handleError = () => {
      console.log("Lottie failed to load.");
      isLottieLoaded = false;
    };
    node.addEventListener("load", handleLoad);
    node.addEventListener("error", handleError);
    return {
      destroy() {
        node.removeEventListener("load", handleLoad);
        node.removeEventListener("error", handleError);
      },
    };
  }
</script>

<div
  class="relative shrink-0 overflow-visible {size === 'panel'
    ? 'w-6 h-6'
    : size === 'dict'
      ? 'w-8 h-8 md:w-12 h-12 lg:w-14 h-14'
      : 'w-10 h-10 md:w-12 h-12 lg:w-14 h-14'} {customClass}"
  class:logo-glow={size === "dict"}
>
  {#if audioCore.isPlaying}
    <!-- Left-aligned animation container that overflows horizontally to display notes over the text -->
    <div
      transition:fade={{ duration: 800 }}
      class="absolute top-1/2 -translate-y-1/2 w-auto aspect-[1.44/1] max-w-none overflow-visible flex items-center justify-start pointer-events-none {size ===
      'dict'
        ? 'h-[75%] -left-2 md:left-0'
        : 'h-full left-0'}"
      style="mix-blend-mode: screen;"
    >
      {#if !isLottieLoaded}
        <!-- Fallback video (MP4) -->
        <video
          src={dogSingMp4}
          autoplay
          loop
          muted
          playsinline
          class="h-full w-auto aspect-[1.44/1] max-w-none object-contain"
        >
          <picture class="w-full h-full block">
            <source srcset={dogsLogoWebp} type="image/webp" />
            <img
              src={dogsLogoPng}
              alt="DOGS Logo"
              class="w-full h-full object-contain"
            />
          </picture>
        </video>
      {/if}

      <!-- dotLottie Web Component (hidden unless loaded) -->
      <dotlottie-wc
        use:setupLottie
        src={dogSingLottie}
        autoplay
        loop
        background="transparent"
        activeAnimationId="animation_0"
        animationId="animation_0"
        active-animation-id="animation_0"
        class="h-full w-auto aspect-[1.44/1] max-w-none"
        style={isLottieLoaded ? "display: block;" : "display: none;"}
      ></dotlottie-wc>
    </div>
  {:else}
    <!-- Static Dog Face Logo -->
    <div transition:fade={{ duration: 800 }} class="w-full h-full block">
      <picture class="w-full h-full block">
        <source srcset={dogsLogoWebp} type="image/webp" />
        <img
          src={dogsLogoPng}
          alt="DOGS Logo"
          class="w-full h-full object-contain"
        />
      </picture>
    </div>
  {/if}
</div>

<style>
  /* Outline glow to make the black logo visible on dark backgrounds */
  .logo-glow img {
    filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.85))
      drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
  }

  /* Drop shadow for panel icons */
  div:not(.logo-glow) img {
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
  }
</style>
