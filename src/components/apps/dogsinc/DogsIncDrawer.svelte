<script>
  /** @type {boolean} */
  export let open = false;
  /** @type {() => void} */
  export let onClose;

  /** An upward swipe this long (px) on the drawer closes it. */
  const SWIPE_CLOSE_PX = 48;
  let touchStartY = null;

  const handleTouchStart = (event) => {
    touchStartY = event.touches[0].clientY;
  };

  /** Closes on a clear upward flick; ignores taps and scrolls inside the list. */
  function handleTouchEnd(event) {
    if (touchStartY === null) return;
    const delta = touchStartY - event.changedTouches[0].clientY;
    touchStartY = null;
    if (delta > SWIPE_CLOSE_PX) onClose();
  }

  const handleKey = (event) => {
    if (open && event.key === 'Escape') onClose();
  };
</script>

<svelte:window onkeydown={handleKey} />

<div class="dogsinc-drawer-layer" class:is-open={open} aria-hidden={!open}>
  <button type="button" class="dogsinc-scrim" tabindex="-1" aria-label="Close upgrades" onclick={onClose}></button>
  <div
    id="dogsinc-upgrades"
    class="dogsinc-drawer"
    role="dialog"
    tabindex="-1"
    aria-label="Upgrades"
    inert={!open}
    ontouchstart={handleTouchStart}
    ontouchend={handleTouchEnd}
  >
    <slot />
    <span class="dogsinc-grip" aria-hidden="true"></span>
  </div>
</div>

<style lang="scss">
  @use "../../../styles/dogsinc-variables" as *;

  // Sits under the fixed-height topbar and floats over the stage: opening it never moves
  // the tower or the click box.
  .dogsinc-drawer-layer {
    position: absolute;
    top: $dogsinc-topbar-h;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 5;
    overflow: hidden;
    pointer-events: none;
  }

  .dogsinc-scrim {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    border: 0;
    padding: 0;
    background: $dogsinc-scrim;
    opacity: 0;
    transition: opacity $dogsinc-drawer-ms ease-out;
    cursor: default;
  }

  .dogsinc-drawer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    max-height: 82%;
    padding: 12px 12px 20px;
    overflow-y: auto;
    overscroll-behavior: contain;
    background: $dogsinc-drawer-bg;
    border-bottom: 2px solid $dogsinc-gold;
    border-radius: 0 0 14px 14px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6), 0 2px 18px $dogsinc-gold-glow;
    transform: translateY(-105%);
    transition: transform $dogsinc-drawer-ms ease-out;
  }

  .dogsinc-grip {
    position: absolute;
    bottom: 7px;
    left: 50%;
    width: 40px;
    height: 4px;
    margin-left: -20px;
    border-radius: 2px;
    background: $dogsinc-gold;
    opacity: 0.6;
  }

  .is-open {
    pointer-events: auto;

    .dogsinc-scrim {
      opacity: 1;
    }

    .dogsinc-drawer {
      transform: translateY(0);
    }
  }

  // Landscape phones: a centered sheet so the cards don't stretch across the whole width.
  @media (orientation: landscape) and (max-height: 500px) {
    .dogsinc-drawer {
      left: 8%;
      right: 8%;
      max-height: 92%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .dogsinc-drawer,
    .dogsinc-scrim {
      transition: none;
    }
  }
</style>
