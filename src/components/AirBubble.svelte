<script>
  /**
   * AirBubble: while two of your devices are connected in Air Train and Air
   * Train is closed, a bubble floats over the site. Tap it for Air Train and
   * its files; drag it anywhere and it snaps to the nearer edge; drag it onto
   * the X at the bottom to put it away for this connection (or its own small
   * X, with a mouse; Escape or Delete, from the keyboard). A count says how
   * many files came in since Air Train was last open.
   */
  import { onMount } from "svelte";
  import { scale } from "svelte/transition";
  import { Radio, X, Cable } from "lucide-svelte";
  import { tether } from "../lib/tether.svelte.js";
  import { openDogsPage } from "../lib/openDogsPage.js";
  import { loadPlace, savePlace, placeToPoint, pointToPlace } from "./airBubble.js";

  /** The Air Train app (ToolboxPanel's id for Data Train). */
  const AIR_TRAIN_APP = "dataflash";
  /** A press that moves less than this is a tap. */
  const TAP_SLOP_PX = 8;
  /** Let go this close to the X at the bottom, and the bubble goes. */
  const BIN_REACH_PX = 80;
  const DISMISS_KEYS = ["Escape", "Delete"];
  const POP_MS = 180;
  const MAX_BADGE = 99;

  let wrapEl = $state(null);
  let binEl = $state(null);
  let place = loadPlace();
  let x = $state(0);
  let y = $state(0);
  let dragging = $state(false);
  /** Placed on its edge: until then it is not shown, so it never flashes in the corner first. */
  let ready = $state(false);
  let overBin = $state(false);
  /** The press being followed: its pointer, where it grabbed the bubble, and whether it has moved. */
  let press = null;
  /** A drag ends with a click on the bubble; that click must not open Air Train. */
  let swallowClick = false;

  // Only watched fields (tether's $state) decide it, so it shows the moment a connection comes up
  let shown = $derived((tether.connected || tether.holding) && !tether.viewOpen && !tether.bubbleDismissed);
  let fresh = $derived(Math.max(0, tether.received - tether.seen));
  let peer = $derived(tether.peerName || "your other device");
  let label = $derived(
    (tether.holding ? "Air Train: finding " + peer + " again." : "Air Train: connected to " + peer + ".") +
      (fresh ? " " + fresh + (fresh === 1 ? " new file." : " new files.") : "") +
      " Tap to open. Drag to move, or onto the X to hide.",
  );

  /** Put the bubble back on its edge, at its height, for this screen. */
  function settle() {
    if (!wrapEl) return;
    const point = placeToPoint(place, wrapEl.offsetWidth, window.innerWidth, window.innerHeight);
    x = point.x;
    y = point.y;
    ready = true;
  }

  $effect(() => {
    if (shown && wrapEl) settle();
    if (!shown) ready = false;
  });

  onMount(() => {
    window.addEventListener("resize", settle);
    return () => window.removeEventListener("resize", settle);
  });

  /** @param {PointerEvent} event */
  function grab(event) {
    if (event.button > 0) return;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch (e) {
      // Not a live pointer (or an old browser): the drag still follows while over the bubble
    }
    press = { id: event.pointerId, dx: event.clientX - x, dy: event.clientY - y, sx: event.clientX, sy: event.clientY, moved: false };
  }

  /** @param {PointerEvent} event */
  function follow(event) {
    if (!press || event.pointerId !== press.id) return;
    if (!press.moved && Math.hypot(event.clientX - press.sx, event.clientY - press.sy) < TAP_SLOP_PX) return;
    press.moved = true;
    dragging = true;
    x = event.clientX - press.dx;
    y = event.clientY - press.dy;
    overBin = nearBin(event.clientX, event.clientY);
  }

  /** @param {PointerEvent} event */
  function letGo(event) {
    if (!press || event.pointerId !== press.id) return;
    const moved = press.moved;
    press = null;
    dragging = false;
    if (!moved) return;
    swallowClick = true;
    if (overBin) {
      overBin = false;
      tether.bubbleDismissed = true;
      return;
    }
    place = pointToPlace(x, y, wrapEl.offsetWidth, window.innerWidth, window.innerHeight);
    savePlace(place);
    settle();
  }

  /** @param {number} px @param {number} py */
  function nearBin(px, py) {
    if (!binEl) return false;
    const box = binEl.getBoundingClientRect();
    return Math.hypot(px - (box.left + box.width / 2), py - (box.top + box.height / 2)) < BIN_REACH_PX;
  }

  function open() {
    if (swallowClick) {
      swallowClick = false;
      return;
    }
    openDogsPage({ app: AIR_TRAIN_APP, force: true });
  }

  /** @param {KeyboardEvent} event */
  function key(event) {
    if (DISMISS_KEYS.indexOf(event.key) === -1) return;
    event.preventDefault();
    tether.bubbleDismissed = true;
  }
</script>

{#if shown}
  <div
    class="air-bubble-wrap fixed left-0 top-0 h-[52px] w-[52px] md:h-[60px] md:w-[60px] 2xl:h-[80px] 2xl:w-[80px]"
    class:air-bubble-snapping={ready && !dragging}
    bind:this={wrapEl}
    style="transform: translate3d({x}px, {y}px, 0); visibility: {ready ? 'visible' : 'hidden'}"
    transition:scale={{ duration: POP_MS }}
  >
    <button
      type="button"
      class="air-bubble flex h-full w-full items-center justify-center rounded-full"
      class:air-bubble-holding={tether.holding}
      class:air-bubble-dragging={dragging}
      aria-label={label}
      title={label}
      onpointerdown={grab}
      onpointermove={follow}
      onpointerup={letGo}
      onpointercancel={letGo}
      onclick={open}
      onkeydown={key}
    >
      <Radio class="h-[22px] w-[22px] md:h-[26px] md:w-[26px] 2xl:h-[34px] 2xl:w-[34px]" aria-hidden="true" />
      {#if tether.linked}
        <span class="air-bubble-tether absolute flex items-center justify-center rounded-full" aria-hidden="true"><Cable size={10} /></span>
      {/if}
      {#if fresh}
        <span class="air-bubble-badge absolute flex items-center justify-center rounded-full text-[10px] font-bold 2xl:text-sm" aria-hidden="true">
          {fresh > MAX_BADGE ? MAX_BADGE + "+" : fresh}
        </span>
      {/if}
    </button>
    <button type="button" class="air-bubble-close absolute items-center justify-center rounded-full" aria-label="Hide the Air Train bubble" onclick={() => (tether.bubbleDismissed = true)}>
      <X size={11} />
    </button>
  </div>
{/if}

{#if dragging}
  <div
    class="air-bubble-bin fixed bottom-8 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full sm:bottom-4 md:bottom-10 md:h-16 md:w-16 2xl:bottom-16 2xl:h-24 2xl:w-24"
    class:air-bubble-bin-hot={overBin}
    bind:this={binEl}
    transition:scale={{ duration: POP_MS }}
    aria-hidden="true"
  >
    <X size={22} />
  </div>
{/if}

<style lang="scss">
  @use "../styles/variables" as *;

  .air-bubble-wrap {
    z-index: $z-air-bubble;
    touch-action: none;
  }

  // Let go: it glides to its edge. Dragged: it stays under the finger.
  .air-bubble-snapping {
    transition: transform 0.32s cubic-bezier(0.34, 1.4, 0.64, 1);
  }

  .air-bubble {
    position: relative;
    padding: 0;
    border: 1px solid $border-air-bubble;
    background: $bg-air-bubble;
    box-shadow: $shadow-air-bubble;
    color: $color-neon-green;
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: transform 0.15s ease;

    &:active {
      transform: scale(0.92);
    }

    &:focus-visible {
      outline: 2px solid $color-neon-green;
      outline-offset: 3px;
    }
  }

  .air-bubble-dragging {
    cursor: grabbing;
    transform: scale(1.08);
  }

  // The connection dropped and is being found again
  .air-bubble-holding {
    color: $color-blog-ink;
    animation: air-bubble-wait 1.6s ease-in-out infinite;
  }

  .air-bubble-tether {
    right: -2px;
    bottom: -2px;
    width: 18px;
    height: 18px;
    background: $bg-air-bubble;
    border: 1px solid $border-air-bubble;
    color: $color-neon-green;
  }

  .air-bubble-badge {
    left: -4px;
    top: -4px;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    background: $color-air-bubble-badge;
    color: $color-blog-ink-strong;
  }

  // Its own small X: for a mouse, on hover; for the keyboard, on focus. Touch drags it to the big X.
  .air-bubble-close {
    display: none;
    right: -6px;
    top: -6px;
    width: 20px;
    height: 20px;
    padding: 0;
    border: 1px solid $border-air-bubble;
    background: $bg-air-bubble;
    color: $color-blog-ink-strong;
    cursor: pointer;
  }

  @media (hover: hover) {
    .air-bubble-wrap:hover .air-bubble-close,
    .air-bubble-wrap:focus-within .air-bubble-close {
      display: flex;
    }
  }

  .air-bubble-bin {
    z-index: $z-air-bubble;
    background: $bg-air-bubble-bin;
    border: 2px solid $border-air-bubble;
    color: $color-blog-ink-strong;
    pointer-events: none;
    transition: transform 0.15s ease, border-color 0.15s ease;
  }

  .air-bubble-bin-hot {
    border-color: $color-air-bubble-badge;
    color: $color-air-bubble-badge;
    transform: translateX(-50%) scale(1.2);
  }

  @keyframes air-bubble-wait {
    50% {
      opacity: 0.55;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .air-bubble-snapping,
    .air-bubble,
    .air-bubble-bin {
      transition: none;
    }

    .air-bubble-holding {
      animation: none;
    }
  }
</style>
