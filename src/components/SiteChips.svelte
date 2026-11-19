<script>
  // Chips around the landing tiles (TitlePage.svelte's .hieroglyphic-nav), shown only while the tiles are:
  // "subscribe to DOGS" (a Buy Me a Coffee membership) and the DOGS apps that live on their own sites.
  // Three layouts, all absolutely or fixed positioned so the WEAREDOGS letters never move:
  //   portrait (phones, tablets, tall desktops): under the tiles, subscribe tall on the left, the apps stacked right
  //     (two rows of two once they step down to one-line chips)
  //   landscape with the tiles under the letters: the apps in the bottom-left corner, subscribe in the bottom-right
  //   short landscape, where the tiles dock to the right edge: the apps two by two under the language card, subscribe bottom-left
  // Portrait measures the room under the tiles (siteChipsLayout.js) and steps down to one-line chips, then to the
  // corners, when a tall phrase like DOGS RUN THIS %#$@ leaves too little.
  import { onMount, tick } from "svelte";
  import { ArrowUpRight, CalendarCheck, Castle, ChartCandlestick, Coffee, NotebookPen } from "lucide-svelte";
  import { FIT_COMPACT, FIT_CORNERS, FIT_ROOMY, fitsBesideTiles, readAnchors, watchLayout } from "./siteChipsLayout.js";

  /** Flag-colors mode: each chip takes its accent. */
  export let colored = false;

  const ICON_STROKE = 2;
  const STAGGER_MS = 70;
  const PORTRAIT_QUERY = "(orientation: portrait)";
  // Keep this much screen below the lowest chip
  const BOTTOM_MARGIN_PX = 12;
  const SUBSCRIBE = { id: "subscribe", name: "subscribe to DOGS", blurb: "", url: "https://buymeacoffee.com/dogsdogsdogs", icon: Coffee };
  // Same sites as their tiles in ToolboxPanel.svelte
  const APPS = [
    { id: "castle", name: "castle", blurb: "make your data yours", url: "https://castle.dogs.red/", icon: Castle },
    { id: "wordsmith", name: "wordsmith", blurb: "speak your truth", url: "https://wordsmith.dogs.red/", icon: NotebookPen },
    { id: "money24", name: "money 24", blurb: "trade around the clock", url: "https://money24.dogs.red/", icon: ChartCandlestick },
    { id: "forty", name: "40", blurb: "track any habit", url: "https://40.dogs.red/", icon: CalendarCheck },
  ];
  const GROUPS = [
    { id: "subscribe", label: "Support DOGS", chips: [SUBSCRIBE] },
    { id: "apps", label: "Other DOGS apps", chips: APPS },
  ];

  /** @type {HTMLDivElement} */
  let root;
  let fit = FIT_ROOMY;
  /** @type {import("./siteChipsLayout.js").ChipAnchors} */
  let anchors = { navTop: 0, navBottom: 0, cardBottom: 0 };

  /** Re-reads the anchors, then picks the roomiest portrait layout whose chips stay on screen. Landscape is CSS only. */
  async function refit() {
    if (!root) return;
    anchors = readAnchors(root);
    fit = FIT_ROOMY;
    await tick();
    if (!matchMedia(PORTRAIT_QUERY).matches) return;
    if (root.getBoundingClientRect().bottom <= innerHeight - BOTTOM_MARGIN_PX) return;
    fit = FIT_COMPACT;
    await tick();
    if (root.getBoundingClientRect().bottom <= innerHeight - BOTTOM_MARGIN_PX) return;
    if (fitsBesideTiles(root)) fit = FIT_CORNERS;
  }

  onMount(() => {
    refit();
    return watchLayout(root, refit);
  });
</script>

<div
  bind:this={root}
  class="site-chips flex flex-row sm:flex-row md:flex-row lg:flex-row xl:flex-row 2xl:flex-row max-lg:landscape:flex-col gap-3 md:gap-6 2xl:gap-10"
  class:colored
  class:fit-compact={fit !== FIT_ROOMY}
  class:fit-corners={fit === FIT_CORNERS}
  style="--nav-top: {anchors.navTop}px; --nav-bottom: {anchors.navBottom}px; --card-bottom: {anchors.cardBottom}px"
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
  @use "../styles/site-chips" as vars;

  // The tile row's place comes from siteChipsLayout.js as --nav-top / --nav-bottom; these are TitlePage.svelte's
  // desktop defaults for the instant before it is measured.
  $NAV_TOP_FALLBACK: calc(100% + 2.5rem);
  $NAV_BOTTOM_FALLBACK: calc(100% + 2.5rem + 72px);
  $GAP: 1.25rem;
  $GAP_COMPACT: 0.5rem;
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
    top: calc(var(--nav-bottom, #{$NAV_BOTTOM_FALLBACK}) + #{$GAP});
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

  .group-apps .chip-name {
    white-space: nowrap;
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

  .chip-money24 {
    --chip-accent: #{vars.$color-chip-money24};
  }

  .chip-forty {
    --chip-accent: #{vars.$color-chip-forty};
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

  // ── One-line chips: chosen by refit() when two-line chips would run off the bottom ──
  .site-chips.fit-compact {
    top: calc(var(--nav-bottom, #{$NAV_BOTTOM_FALLBACK}) + #{$GAP_COMPACT});

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

  // Four apps in two rows of two, so the one-line chips stay as short as the tile row is from the bottom.
  // Subscribe keeps its two lines beside them; the arrows go, the chips are links either way.
  @mixin apps-grid($scope) {
    #{$scope} .group-apps {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, auto));
    }

    #{$scope} .group-apps :global(.chip-arrow) {
      display: none;
    }
  }

  @include apps-grid(".site-chips.fit-compact:not(.fit-corners)");

  // Give the longest app name enough room on narrow portrait phones.
  @media (max-width: 360px) and (orientation: portrait) {
    .site-chips.fit-compact:not(.fit-corners) {
      .group-subscribe { flex: 0 0 30%; }
      .group-apps { flex: 1; min-width: 0; }
      .site-chip { gap: 4px; padding-left: 6px; padding-right: 6px; font-size: 10px; }
      .chip-subscribe :global(.chip-arrow) { display: none; }
    }
  }

  // ── Corners: a full-width band over the tile row; the two groups sit in its corners, bottoms level with the tiles ──
  @mixin corner-layout($scope) {
    #{$scope} {
      top: var(--nav-top, #{$NAV_TOP_FALLBACK});
      left: calc(50% - 50vw);
      width: 100vw;
      height: calc(var(--nav-bottom, #{$NAV_BOTTOM_FALLBACK}) - var(--nav-top, #{$NAV_TOP_FALLBACK}));
      pointer-events: none;
      transform: none;
    }

    #{$scope} .chip-group {
      position: absolute;
      bottom: 0;
    }

    #{$scope} .group-apps {
      left: max(#{$EDGE_WIDE}, env(safe-area-inset-left));
    }

    #{$scope} .group-subscribe {
      right: max(#{$EDGE_WIDE}, env(safe-area-inset-right));
    }

    #{$scope} .chip-subscribe .chip-name {
      max-width: none;
      white-space: nowrap;
    }

    // Castle over wordsmith
    #{$scope} .chip-wordsmith {
      order: 0;
    }
  }

  // Landscape with the tiles under the letters
  @media (orientation: landscape) and (min-height: 621px) {
    @include corner-layout(".site-chips");
  }

  // Portrait when even one-line chips would run off the bottom
  @include corner-layout(".site-chips.fit-corners");

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

    @include apps-grid(".site-chips");

    .chip-blurb {
      display: none;
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
</style>
