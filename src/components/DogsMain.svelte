<script>
  // Props mapping the flag colors toggle state
  let { isFlagColors = false } = $props();
</script>

<div
  class="w-full h-full relative flex flex-col justify-between overflow-hidden bg-white select-none"
  class:wad-colored={isFlagColors}
>
  <!-- Top 1/3 Section: Dark Theme background -->
  <div
    class="w-full h-[33.3vh] flex items-center justify-start px-8 md:px-16 lg:px-24 relative overflow-hidden z-10"
    style="background: var(--bg-main, #000000);"
  >
    <div class="dict-container z-30 max-w-[650px]">
      <h2
        class="dict-def text-white/90 text-lg md:text-xl lg:text-2xl font-light tracking-wide leading-relaxed transition-all duration-500"
        class:colored={isFlagColors}
      >
        <span
          class="dict-word font-black text-white tracking-widest uppercase text-xl md:text-2xl lg:text-3xl block mb-2 transition-colors duration-500"
        >
          DOGS (n)
        </span>
        &mdash; a carnivorous mammal (<em>Canis familiaris</em>) that has long
        been domesticated as a pet.
      </h2>
    </div>
  </div>

  <!-- Continuous Ink Drop & Ripple Animation -->
  <div
    class="ink-dripper absolute top-0 left-0 w-full h-full pointer-events-none z-[5]"
  >
    <div class="droplet"></div>
    <div class="ripple ripple-2"></div>
  </div>

  <!-- Bottom 2/3 Section: Modern Chic Company Info -->
  <div
    class="w-full h-[66.7vh] flex flex-col justify-center items-start px-8 md:px-16 lg:px-24 bg-white relative z-0"
  >
    <div
      class="company-section max-w-4xl w-full flex flex-col gap-6 md:gap-8 mt-12 md:mt-0"
    >
      <div class="company-header flex flex-col">
        <span
          class="company-label text-xs uppercase tracking-widest text-black/40 font-bold mb-1"
          >Company Profile</span
        >
        <h3
          class="company-title text-3xl md:text-4xl lg:text-5xl font-black text-black tracking-tight leading-none"
        >
          WEAREDOGS STUDIOS
        </h3>
        <div class="w-16 h-1 mt-3 bg-black"></div>
      </div>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-4 w-full"
      >
        <!-- Headquarters -->
        <div
          class="info-card flex flex-col p-6 rounded-2xl bg-[#f8f9fa] border border-black/5 hover:border-black/10 hover:shadow-lg transition-all duration-300"
        >
          <span
            class="card-title text-xs uppercase tracking-wider text-black/40 font-bold mb-3"
            >Headquarters</span
          >
          <span class="card-value text-lg md:text-xl font-bold text-black"
            >Dallas, TX</span
          >
        </div>

        <!-- Established -->
        <div
          class="info-card flex flex-col p-6 rounded-2xl bg-[#f8f9fa] border border-black/5 hover:border-black/10 hover:shadow-lg transition-all duration-300"
        >
          <span
            class="card-title text-xs uppercase tracking-wider text-black/40 font-bold mb-3"
            >Established</span
          >
          <span class="card-value text-lg md:text-xl font-bold text-black"
            >Formed in 2026</span
          >
        </div>

        <!-- Expertise -->
        <div
          class="info-card flex flex-col p-6 rounded-2xl bg-[#f8f9fa] border border-black/5 hover:border-black/10 hover:shadow-lg transition-all duration-300 lg:col-span-2"
        >
          <span
            class="card-title text-xs uppercase tracking-wider text-black/40 font-bold mb-3"
            >Specializing In</span
          >
          <div class="flex flex-wrap gap-2">
            <span
              class="badge px-3 py-1 bg-black text-white text-xs font-semibold rounded-full uppercase tracking-wider"
              >Web Design</span
            >
            <span
              class="badge px-3 py-1 bg-black text-white text-xs font-semibold rounded-full uppercase tracking-wider"
              >App Dev</span
            >
            <span
              class="badge px-3 py-1 bg-black text-white text-xs font-semibold rounded-full uppercase tracking-wider"
              >AI Consultation</span
            >
            <span
              class="badge px-3 py-1 bg-black/10 text-black text-xs font-bold rounded-full border border-black/10 uppercase tracking-wider"
              >Building for Tomorrow</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Dictionary Highlight & Theme transitions */
  .dict-def.colored {
    color: var(--color-neon-purple, var(--color-neon-red, #ff3344)) !important;
    text-shadow: 0 0 15px rgba(var(--color-neon-purple-rgb, 255, 51, 68), 0.35);
  }
  .dict-def.colored .dict-word {
    color: var(--color-neon-purple, var(--color-neon-red, #ff3344)) !important;
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
      var(--color-neon-red, #ff3344)
    ) !important;
    box-shadow: 0 12px 35px
      rgba(var(--color-neon-purple-rgb, 255, 51, 68), 0.12);
  }

  .wad-colored .badge {
    background-color: var(
      --color-neon-purple,
      var(--color-neon-red, #ff3344)
    ) !important;
  }
</style>
