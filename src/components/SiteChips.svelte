<script>
  // Chips around the landing tiles (TitlePage.svelte's .hieroglyphic-nav), shown only while the tiles are:
  // "subscribe to DOGS" (a Buy Me a Coffee membership) and the DOGS apps that live on their own sites.
  // Three layouts, all absolutely or fixed positioned so the WEAREDOGS letters never move:
  //   portrait (phones, tablets, tall desktops): under the tiles, subscribe tall on the left, the apps stacked right
  //   landscape with the tiles under the letters: the apps in the bottom-left corner, subscribe in the bottom-right
  //   short landscape, where the tiles dock to the right edge: the apps under the language card, subscribe bottom-left
  import { onMount } from "svelte";
  import { ArrowUpRight, Castle, Coffee, NotebookPen } from "lucide-svelte";

  /** Flag-colors mode: each chip takes its accent. */
  export let colored = false;

  const ICON_STROKE = 2;
  const STAGGER_MS = 70;
  // WeAreDogs.svelte's language card; the short-landscape layout hangs the app chips under it
  const LANG_CARD_SELECTOR = ".lang-display";
  const SUBSCRIBE = { id: "subscribe", name: "subscribe to DOGS", blurb: "", url: "https://buymeacoffee.com/dogsdogsdogs", icon: Coffee };
  // Same sites as their tiles in ToolboxPanel.svelte
  const APPS = [
    { id: "castle", name: "castle", blurb: "make your data yours", url: "https://castle.dogs.red/", icon: Castle },
    { id: "wordsmith", name: "wordsmith", blurb: "speak your truth", url: "https://wordsmith.dogs.red/", icon: NotebookPen },
  ];
  const GROUPS = [
    { id: "subscribe", label: "Support DOGS", chips: [SUBSCRIBE] },
    { id: "apps", label: "Other DOGS apps", chips: APPS },
  ];

  /** Bottom edge of the language card in px, for the short-landscape layout. */
  let cardBottom = 0;

  onMount(() => {
    const card = document.querySelector(LANG_CARD_SELECTOR);
    if (!card) return;
    const update = () => (cardBottom = Math.round(card.getBoundingClientRect().bottom));
    update();
    // The card grows open as the tiles appear and changes height with the language
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    if (observer) observer.observe(card);
    window.addEventListener("resize", update);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("resize", update);
    };
  });
</script>

<div
  class="site-chips flex flex-row sm:flex-row md:flex-row lg:flex-row xl:flex-row 2xl:flex-row max-lg:landscape:flex-col gap-3 md:gap-6 2xl:gap-10"
  class:colored
  style="--card-bottom: {cardBottom}px"
>
  {#each GROUPS as group, groupIndex (group.id)}
    <nav class="chip-group group-{group.id} flex flex-col gap-1.5 md:gap-2 2xl:gap-3 max-lg:landscape:gap-1" aria-label={group.label}>
      {#each group.chips as chip, index (chip.id)}
        <a
          class="site-chip chip-{chip.id} flex items-center gap-2 2xl:gap-3 rounded-lg 2xl:rounded-xl px-2.5 py-1.5 sm:px-3 md:px-3.5 md:py-2 lg:px-3.5 xl:px-4 2xl:px-5 2xl:py-3 max-lg:landscape:px-2.5 max-lg:landscape:py-1 text-[11px] sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-lg max-lg:landscape:text-[10px]"
          style="--chip-delay: {(groupIndex + index) * STAGGER_MS}ms"
          href={chip.url}
          target="_blank"
          rel="noopener noreferrer"
          title={chip.blurb ? `${chip.name}: ${chip.blurb}` : chip.name}
          on:click|stopPropagation
        >
          <chip.icon class="chip-icon shrink-0 w-3.5 h-3.5 md:w-4 md:h-4 2xl:w-6 2xl:h-6 max-lg:landscape:w-3 max-lg:landscape:h-3" strokeWidth={ICON_STROKE} />
          <span class="chip-text flex min-w-0 flex-col leading-tight">
            <span class="chip-name font-bold">{chip.name}</span>
            {#if chip.blurb}<span class="chip-blurb whitespace-nowrap text-[10px] sm:text-[11px] md:text-xs lg:text-xs xl:text-xs 2xl:text-base max-lg:landscape:text-[9px]">{chip.blurb}</span>{/if}
          </span>
          <ArrowUpRight class="chip-arrow ml-auto shrink-0 w-3.5 h-3.5 md:w-4 md:h-4 2xl:w-6 2xl:h-6 max-lg:landscape:w-3 max-lg:landscape:h-3" strokeWidth={ICON_STROKE} aria-hidden="true" />
        </a>
      {/each}
    </nav>
  {/each}
</div>

<style lang="scss">
  @use "../styles/variables" as vars;

  // Tile sizes and offsets from TitlePage.svelte's .hieroglyphic-nav, so the chips line up with the tile row.
  $TILE: 72px;
  $TILE_SMALL: 52px;
  $TILE_SHORT: 44px;
  $TILE_TINY: 36px;
  $NAV_TOP: 2.5rem;
  $GAP: 1.25rem;
  // Portrait: the chips spread a little wider than the tile row
  $SPREAD: min(90vw, 30rem);
  $SPREAD_TV: min(90vw, 44rem);
  // Landscape corners and the docked column sit this far from the screen edges, like the language card
  $EDGE: 0.75rem;
  $EDGE_WIDE: 1.5rem;
  $CARD_GAP: 0.5rem;
  $EASE: cubic-bezier(0.16, 1, 0.3, 1);

  // ── Portrait: under the tiles ──
  .site-chips {
    position: absolute;
    top: calc(100% + #{$NAV_TOP} + #{$TILE} + #{$GAP});
    left: 50%;
    z-index: 80;
    width: $SPREAD;
    justify-content: space-between;
    align-items: stretch;
    transform: translateX(-50%);
  }

  .group-subscribe .site-chip {
    flex: 1 1 auto;
  }

  // Two lines, "subscribe" over "to DOGS", so it stays as narrow as the chips beside it
  .chip-subscribe .chip-name {
    max-width: 6.5em;
  }

  .chip-castle,
  .chip-wordsmith {
    .chip-name {
      white-space: nowrap;
    }
  }

  // Portrait lists wordsmith first
  .chip-wordsmith {
    order: -1;
  }

  // ── Chip look ──
  .site-chip {
    color: vars.$color-chip-ink;
    background: vars.$color-chip-glass;
    backdrop-filter: blur(12px) saturate(160%);
    -webkit-backdrop-filter: blur(12px) saturate(160%);
    border: 1px solid vars.$color-chip-line;
    box-shadow: 0 4px 12px vars.$color-chip-shadow;
    text-decoration: none;
    pointer-events: auto;
    opacity: 0;
    animation: chip-in 0.4s $EASE var(--chip-delay) forwards;
    transition:
      transform 0.3s $EASE,
      border-color 0.3s ease,
      color 0.3s ease,
      background-color 0.3s ease;

    &:hover,
    &:focus-visible {
      color: vars.$color-chip-ink-hover;
      background-color: vars.$color-chip-glass-hover;
      border-color: var(--chip-accent, #{vars.$color-chip-ink-hover});
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0) scale(0.98);
    }

    &:focus-visible {
      outline: 2px solid var(--chip-accent, #{vars.$color-chip-ink-hover});
      outline-offset: 2px;
    }
  }

  .chip-subscribe {
    --chip-accent: #{vars.$color-chip-subscribe};
  }

  .chip-wordsmith {
    --chip-accent: #{vars.$color-chip-wordsmith};
  }

  .chip-castle {
    --chip-accent: #{vars.$color-chip-castle};
  }

  .chip-blurb {
    color: vars.$color-chip-muted;
  }

  .site-chip :global(.chip-arrow) {
    transition: transform 0.3s $EASE;
  }

  .site-chip:hover :global(.chip-arrow),
  .site-chip:focus-visible :global(.chip-arrow) {
    transform: translate(2px, -2px);
  }

  .colored .site-chip {
    border-color: var(--chip-accent);

    :global(.chip-icon),
    :global(.chip-arrow) {
      color: var(--chip-accent);
    }
  }

  @keyframes chip-in {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (min-width: 1536px) {
    .site-chips {
      width: $SPREAD_TV;
    }
  }

  // Same tiers as the tiles
  @media (max-width: 600px) {
    .site-chips {
      top: calc(100% + 3.5rem + #{$TILE_SMALL} + 1rem);
    }
  }

  // Short portrait phones (iPhone SE and smaller): closer to the tiles, one line per chip
  @media (orientation: portrait) and (max-height: 640px) {
    .site-chips {
      top: calc(100% + 3.5rem + #{$TILE_SMALL} + 0.5rem);
    }

    .chip-group {
      gap: 0.25rem;
    }

    .site-chip {
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
    }

    .chip-blurb {
      display: none;
    }
  }

  // ── Landscape with the tiles under the letters: the bottom corners, level with the tile row ──
  @media (orientation: landscape) and (min-height: 621px) {
    // A full-width band over the tile row; the two groups sit in its corners, bottoms level with the tiles
    .site-chips {
      top: calc(100% + #{$NAV_TOP});
      left: calc(50% - 50vw);
      width: 100vw;
      height: $TILE;
      pointer-events: none;
      transform: none;
    }

    .chip-group {
      position: absolute;
      bottom: 0;
    }

    .group-apps {
      left: max(#{$EDGE_WIDE}, env(safe-area-inset-left));
    }

    .group-subscribe {
      right: max(#{$EDGE_WIDE}, env(safe-area-inset-right));
    }

    .chip-subscribe .chip-name {
      max-width: none;
      white-space: nowrap;
    }

    // Castle over wordsmith
    .chip-wordsmith {
      order: 0;
    }
  }

  // ── Short landscape: the tiles dock to the right edge; the apps hang under the language card, subscribe bottom-left ──
  @media (orientation: landscape) and (max-height: 620px) {
    .site-chips {
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      transform: none;
    }

    .chip-group {
      position: fixed;
      left: max(#{$EDGE}, env(safe-area-inset-left));
    }

    .group-apps {
      top: calc(var(--card-bottom) + #{$CARD_GAP});
    }

    .group-subscribe {
      bottom: max(#{$EDGE}, env(safe-area-inset-bottom));
    }

    .chip-subscribe .chip-name {
      max-width: none;
      white-space: nowrap;
    }

    .chip-wordsmith {
      order: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .site-chip {
      opacity: 1;
      animation: none;
      transition: none;
    }

    .site-chip :global(.chip-arrow) {
      transition: none;
    }
  }
  // Phones in either orientation: the gallery on page two owns external links.
  @media (max-width: 767px), (orientation: landscape) and (max-height: 599px) and (max-width: 1023px) {
    .site-chips { display: none !important; }
  }
</style>
