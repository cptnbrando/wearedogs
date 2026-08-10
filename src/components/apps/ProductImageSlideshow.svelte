<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<script>
  import { onMount, onDestroy } from "svelte";

  let {
    images = [],
    productTitle = "FIGHT THE CEO",
    // Reuse knobs (defaults preserve the store product page exactly):
    // accent: "emerald" | "red" — active dot / page number color family
    // aspectClass: Tailwind aspect class for the main frame
    // fit: "contain" | "cover" — how media fills the frame
    // showThumbnails: thumbnail strip under the frame
    // ribbon: campaign-style serrated position ribbon along the frame's
    //         bottom edge (replaces the dots overlay)
    accent = "emerald",
    aspectClass = "aspect-[896/1088]",
    fit = "contain",
    showThumbnails = true,
    ribbon = false,
  } = $props();

  let activeDotClass = $derived(
    accent === "red"
      ? "bg-red-400 scale-125 shadow-[0_0_10px_#f87171]"
      : "bg-emerald-400 scale-125 shadow-[0_0_10px_#10b981]"
  );
  let fitClass = $derived(
    fit === "cover" ? "object-cover" : "object-contain p-2"
  );

  const DEFAULT_BRANDO_IMAGES = [
    "https://data.wearedogs.net/img/people/brando/brando1.jpg",
    "https://data.wearedogs.net/img/people/brando/brando2.jpg",
    "https://data.wearedogs.net/img/people/brando/brando3.jpg",
    "https://data.wearedogs.net/img/people/brando/brando4.jpg",
    "https://data.wearedogs.net/img/people/brando/brando5.jpg",
  ];

  let displayImages = $derived(
    images && images.length > 0 ? images : DEFAULT_BRANDO_IMAGES
  );

  const VIDEO_EXT = /\.(mp4|webm|ogv|ogg|mov|m4v)(\?.*)?$/i;

  function isVideo(url) {
    return typeof url === "string" && VIDEO_EXT.test(url);
  }

  let activeIdx = $state(0);
  let activeIsVideo = $derived(isVideo(displayImages[activeIdx]));
  let scrollDirection = $state(1);
  let timerId = null;
  let isHovered = $state(false);

  // Swipe & Pointer drag tracking state
  let dragStartX = 0;
  let dragStartY = 0;
  let isDragging = $state(false);

  function slideIn(node, { duration = 350, direction = 1 }) {
    return {
      duration,
      css: (t) =>
        `transform: translate3d(${(1 - t) * 100 * direction}%, 0, 0); opacity: ${t};`,
    };
  }

  function slideOut(node, { duration = 350, direction = 1 }) {
    return {
      duration,
      css: (t) =>
        `transform: translate3d(${(1 - t) * -100 * direction}%, 0, 0); opacity: ${t};`,
    };
  }

  function startAutoScrollTimer() {
    stopAutoScrollTimer();
    timerId = setInterval(() => {
      // Let a video play out instead of yanking it away mid-clip
      if (!isHovered && !isDragging && !activeIsVideo) {
        scrollDirection = 1;
        activeIdx = (activeIdx + 1) % displayImages.length;
      }
    }, 5000);
  }

  function stopAutoScrollTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function goToNext() {
    scrollDirection = 1;
    activeIdx = (activeIdx + 1) % displayImages.length;
    startAutoScrollTimer();
  }

  function goToPrev() {
    scrollDirection = -1;
    activeIdx = (activeIdx - 1 + displayImages.length) % displayImages.length;
    startAutoScrollTimer();
  }

  function selectIndex(idx) {
    if (idx === activeIdx) return;
    scrollDirection = idx > activeIdx ? 1 : -1;
    activeIdx = idx;
    startAutoScrollTimer();
  }

  // Pointer & Touch Handlers
  // Don't hijack drags on the video element — scrubbing its controls would
  // otherwise read as a swipe and flip the slide.
  function isVideoTarget(e) {
    return e.target instanceof HTMLVideoElement;
  }

  function handlePointerDown(e) {
    if (isVideoTarget(e)) return;
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
  }

  function handlePointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;

    // Trigger swipe if horizontal drag > 30px and greater than vertical drag
    if (Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  }

  function handleTouchStart(e) {
    if (isVideoTarget(e)) return;
    if (e.touches.length === 1) {
      isDragging = true;
      dragStartX = e.touches[0].clientX;
      dragStartY = e.touches[0].clientY;
    }
  }

  function handleTouchEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    const touch = e.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - dragStartX;
    const deltaY = touch.clientY - dragStartY;

    if (Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  }

  onMount(() => {
    startAutoScrollTimer();
  });

  onDestroy(() => {
    stopAutoScrollTimer();
  });
</script>

<div
  class="flex flex-col gap-2 w-full h-full min-h-0 select-none justify-between"
  onmouseenter={() => (isHovered = true)}
  onmouseleave={() => (isHovered = false)}
>
  <!-- Main Display Showcase Area -->
  <div
    class="relative w-full flex-1 min-h-0 {aspectClass} bg-black/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl group flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
    onpointerdown={handlePointerDown}
    onpointerup={handlePointerUp}
    ontouchstart={handleTouchStart}
    ontouchend={handleTouchEnd}
  >
    {#key activeIdx}
      {#if isVideo(displayImages[activeIdx])}
        <!-- svelte-ignore a11y_media_has_caption -->
        <video
          in:slideIn={{ duration: 350, direction: scrollDirection }}
          out:slideOut={{ duration: 350, direction: scrollDirection }}
          src={displayImages[activeIdx]}
          class="absolute inset-0 w-full h-full {fitClass} z-10"
          controls
          playsinline
          autoplay
          muted
          loop
          preload="metadata"
          draggable="false"
        ></video>
      {:else}
        <img
          in:slideIn={{ duration: 350, direction: scrollDirection }}
          out:slideOut={{ duration: 350, direction: scrollDirection }}
          src={displayImages[activeIdx]}
          alt={`${productTitle} - Image ${activeIdx + 1}`}
          class="absolute inset-0 w-full h-full {fitClass} transition-transform duration-300 group-hover:scale-102"
          draggable="false"
        />
      {/if}
    {/key}

    <!-- Left & Right Clickable Navigation Chevrons -->
    {#if displayImages.length > 1}
      <button
        onclick={goToPrev}
        class="absolute left-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 border border-zinc-700 text-white rounded-full w-9 h-9 flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer z-20 shadow-lg hover:scale-110 active:scale-95"
        title="Previous Image"
      >
        ◀
      </button>
      <button
        onclick={goToNext}
        class="absolute right-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 border border-zinc-700 text-white rounded-full w-9 h-9 flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer z-20 shadow-lg hover:scale-110 active:scale-95"
        title="Next Image"
      >
        ▶
      </button>
    {/if}

    <!-- Indicator Dots Overlay (position ribbon takes over when enabled) -->
    {#if !ribbon}
      <div
        class="absolute left-1/2 -translate-x-1/2 flex gap-2 z-20 pointer-events-auto bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-xl transition-all duration-200 {activeIsVideo
          ? 'bottom-16'
          : 'bottom-6'}"
      >
        {#each displayImages as _, idx}
          <button
            type="button"
            onclick={() => selectIndex(idx)}
            class="w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-200 border-none p-0 flex-shrink-0 {activeIdx === idx
              ? activeDotClass
              : 'bg-white/40 hover:bg-white/70'}"
            title={`Go to image ${idx + 1}`}
          ></button>
        {/each}
      </div>
    {/if}

    <!-- Position ribbon: same serrated strip as the fundraiser campaigns —
         one skewed segment per slide, filled up to the current position. -->
    {#if ribbon && displayImages.length > 1}
      <div class="carousel-ribbon" aria-hidden="true">
        {#each displayImages as _, idx}
          <span class="ribbon-seg" class:filled={idx <= activeIdx}></span>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Clickable Thumbnails Row -->
  {#if showThumbnails && displayImages.length > 1}
    <div class="flex gap-2.5 overflow-x-auto pb-1 custom-scrollbar">
      {#each displayImages as imgUrl, idx}
        <button
          onclick={() => selectIndex(idx)}
          class="relative w-14 aspect-[896/1088] rounded-lg border overflow-hidden cursor-pointer transition-all duration-200 bg-zinc-950 shrink-0 hover:scale-105 shadow-md"
          class:border-emerald-500={activeIdx === idx}
          class:ring-2={activeIdx === idx}
          class:ring-emerald-500={activeIdx === idx}
          class:border-zinc-800={activeIdx !== idx}
          class:opacity-50={activeIdx !== idx}
          title={isVideo(imgUrl)
            ? `Play video ${idx + 1}`
            : `View image ${idx + 1}`}
        >
          {#if isVideo(imgUrl)}
            <!-- svelte-ignore a11y_media_has_caption -->
            <video
              src={imgUrl}
              class="w-full h-full object-contain p-0.5 pointer-events-none"
              muted
              playsinline
              preload="metadata"
            ></video>
            <span
              class="absolute inset-0 flex items-center justify-center text-white text-[10px] bg-black/40 pointer-events-none"
            >
              ▶
            </span>
          {:else}
            <img
              src={imgUrl}
              alt={`Thumbnail ${idx + 1}`}
              class="w-full h-full object-contain p-0.5"
            />
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  /* Carousel position ribbon — identical to the fundraiser campaign strip. */
  .carousel-ribbon {
    position: absolute;
    left: 8px;
    right: 8px;
    bottom: 0;
    height: 4px;
    display: flex;
    gap: 4px;
    z-index: 20;
    pointer-events: none;
  }

  /* Each slide is one skewed tooth; skew is the serration. */
  .ribbon-seg {
    flex: 1;
    transform: skewX(-24deg);
    border-radius: 1px;
    background: rgba(255, 255, 255, 0.16);
    transition:
      background-color 0.35s ease,
      box-shadow 0.35s ease;
  }

  .ribbon-seg.filled {
    background: #ef4444;
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.75);
  }
</style>
