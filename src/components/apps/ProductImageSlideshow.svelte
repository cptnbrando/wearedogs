<script>
  import { onMount, onDestroy } from "svelte";

  let {
    images = [],
    productTitle = "FIGHT THE CEO",
  } = $props();

  const DEFAULT_BRANDO_IMAGES = [
    "https://data.wearedogs.net/img/people/brando/brando1.png",
    "https://data.wearedogs.net/img/people/brando/brando2.png",
    "https://data.wearedogs.net/img/people/brando/brando3.png",
    "https://data.wearedogs.net/img/people/brando/brando4.png",
    "https://data.wearedogs.net/img/people/brando/brando5.png",
  ];

  let displayImages = $derived(
    images && images.length > 0 ? images : DEFAULT_BRANDO_IMAGES
  );

  let activeIdx = $state(0);
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
      if (!isHovered && !isDragging) {
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
  function handlePointerDown(e) {
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
  class="flex flex-col gap-3 w-full h-full select-none"
  onmouseenter={() => (isHovered = true)}
  onmouseleave={() => (isHovered = false)}
>
  <!-- Main Display Showcase Area -->
  <div
    class="relative w-full aspect-square bg-black/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl group flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
    onpointerdown={handlePointerDown}
    onpointerup={handlePointerUp}
    ontouchstart={handleTouchStart}
    ontouchend={handleTouchEnd}
  >
    {#key activeIdx}
      <img
        in:slideIn={{ duration: 350, direction: scrollDirection }}
        out:slideOut={{ duration: 350, direction: scrollDirection }}
        src={displayImages[activeIdx]}
        alt={`${productTitle} - Image ${activeIdx + 1}`}
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
        draggable="false"
      />
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

    <!-- Indicator Dots Overlay -->
    <div
      class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 pointer-events-auto bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10"
    >
      {#each displayImages as _, idx}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <span
          onclick={() => selectIndex(idx)}
          class="w-2 h-2 rounded-full cursor-pointer transition-all duration-200 {activeIdx === idx
            ? 'bg-emerald-400 scale-125 shadow-[0_0_8px_#10b981]'
            : 'bg-white/40 hover:bg-white/70'}"
        ></span>
      {/each}
    </div>
  </div>

  <!-- Clickable Thumbnails Row -->
  {#if displayImages.length > 1}
    <div class="flex gap-2.5 overflow-x-auto pb-1 custom-scrollbar">
      {#each displayImages as imgUrl, idx}
        <button
          onclick={() => selectIndex(idx)}
          class="relative w-16 aspect-square rounded-xl border overflow-hidden cursor-pointer transition-all duration-200 bg-zinc-950 shrink-0 hover:scale-105 shadow-md"
          class:border-emerald-500={activeIdx === idx}
          class:ring-2={activeIdx === idx}
          class:ring-emerald-500={activeIdx === idx}
          class:border-zinc-800={activeIdx !== idx}
          class:opacity-50={activeIdx !== idx}
          title={`View image ${idx + 1}`}
        >
          <img
            src={imgUrl}
            alt={`Thumbnail ${idx + 1}`}
            class="w-full h-full object-cover"
          />
        </button>
      {/each}
    </div>
  {/if}
</div>
