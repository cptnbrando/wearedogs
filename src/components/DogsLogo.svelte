<script>
  import { audioCore } from "../lib/AudioCore.svelte.js";
  import dogSingLottie from "../assets/dog-sing.lottie?url";
  import dogSingMp4 from "../assets/dog-sing.mp4";
  import dogsLogoWebp from "../assets/dogs-logo-cropped.webp";
  import dogsLogoPng from "../assets/dogs-logo-cropped.png";

  let { size = "panel", class: customClass = "" } = $props();
</script>

{#if audioCore.isPlaying}
  <!-- dotLottie Web Component by default, falls back to video (MP4) and then picture -->
  <dotlottie-wc
    src={dogSingLottie}
    autoplay
    loop
    background="transparent"
    class="shrink-0 object-cover {size === 'panel' ? 'w-6 h-6' : 'w-10 h-10 md:w-12 h-12 lg:w-14 h-14'} {customClass}"
  >
    <video
      src={dogSingMp4}
      autoplay
      loop
      muted
      playsinline
      class="object-cover shrink-0 {size === 'panel' ? 'w-6 h-6' : 'w-10 h-10 md:w-12 h-12 lg:w-14 h-14'} {customClass}"
    >
      <picture>
        <source srcset={dogsLogoWebp} type="image/webp" />
        <img
          src={dogsLogoPng}
          alt="DOGS Logo"
          class="shrink-0 {size === 'panel' ? 'w-6 h-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'w-10 h-10 md:w-12 h-12 lg:w-14 h-14'} {customClass}"
        />
      </picture>
    </video>
  </dotlottie-wc>
{:else}
  <!-- Static Dog Face Logo -->
  <picture>
    <source srcset={dogsLogoWebp} type="image/webp" />
    <img
      src={dogsLogoPng}
      alt="DOGS Logo"
      class="shrink-0 {size === 'panel' ? 'w-6 h-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'w-10 h-10 md:w-12 h-12 lg:w-14 h-14'} {customClass}"
    />
  </picture>
{/if}

<style>
  /* Progressive enhancement: hide fallback elements if dotlottie-wc component is defined and running */
  dotlottie-wc:defined video,
  dotlottie-wc:defined picture,
  dotlottie-wc:defined img {
    display: none !important;
  }
</style>
