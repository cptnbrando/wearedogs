<script>
  /**
   * StrikeToggle: an icon button that is on or off. Off, a line is drawn
   * through the icon corner to corner; on, the line draws itself back out.
   * The player's TV (visualizer) and lyrics buttons are these.
   */

  /**
   * @type {{
   *   on: boolean,
   *   label: string,
   *   onclick: (e: MouseEvent) => void,
   *   dim?: boolean,
   *   accent?: boolean,
   *   class?: string,
   *   children: import("svelte").Snippet,
   * }}
   * dim: on, but with nothing to show right now (a song with no lyrics);
   * accent: on takes the player's accent colour
   */
  let { on, label, onclick, dim = false, accent = false, class: className = "", children } = $props();
</script>

<button
  type="button"
  class="strike-toggle {className}"
  class:is-off={!on}
  class:is-accent={on && accent && !dim}
  class:is-dim={on && dim}
  aria-pressed={on}
  aria-label={label}
  title={label}
  {onclick}
>
  {@render children()}
  <span class="strike" aria-hidden="true"></span>
</button>

<style lang="scss">
  // Sized like the player's small round controls (.ctrl-xs in music-panel.scss);
  // a parent can restyle it through the class it passes.
  .strike-toggle {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 26px;
    height: 26px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition:
      color 0.2s ease,
      opacity 0.2s ease,
      transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);

    &:hover {
      color: rgba(255, 255, 255, 0.9);
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.88);
    }
  }

  .is-accent,
  .is-accent:hover {
    color: rgb(var(--mp-accent-rgb, 255, 255, 255));
  }

  .is-off {
    opacity: 0.7;
  }

  .is-dim {
    opacity: 0.75;
  }

  // The line: as wide as the icon's diagonal, drawn from its middle outwards.
  .strike {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 22px;
    height: 2px;
    margin: -1px 0 0 -11px;
    border-radius: 1px;
    background: currentColor;
    // A dark edge either side, so the line reads as cutting the icon
    box-shadow: 0 0 0 1.5px rgba(5, 5, 8, 0.9);
    transform: rotate(-45deg) scaleX(0);
    transition: transform 0.26s cubic-bezier(0.34, 1.56, 0.64, 1);
    pointer-events: none;
  }

  .is-off .strike {
    transform: rotate(-45deg) scaleX(1);
  }

  @media (prefers-reduced-motion: reduce) {
    .strike,
    .strike-toggle {
      transition: none;
    }
  }
</style>
