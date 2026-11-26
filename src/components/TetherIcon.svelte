<script>
  /**
   * TetherIcon: the tether in a panel's top bar, beside the back button.
   * Connected in Air Train, it shows; while the connection is being found
   * again, it pulses; and on a device that has paired before, it says
   * "disconnected", so Air Train is one tap away. A device that never used
   * Air Train shows nothing. A tap opens Air Train (lib/tether.svelte.js holds
   * the connection).
   */
  import { Cable, Unplug } from "lucide-svelte";
  import { tether } from "../lib/tether.svelte.js";
  import { openDogsPage } from "../lib/openDogsPage.js";

  /** The Air Train app (ToolboxPanel's id for Data Train). */
  const AIR_TRAIN_APP = "dataflash";
  const OFF_TEXT = "disconnected";

  let peer = $derived(tether.peerName || "your other device");
  let label = $derived(
    tether.connected
      ? (tether.linked ? "Tethered to " : "Air Train: connected to ") + peer + ". Open Air Train."
      : tether.holding
        ? "Air Train: finding " + peer + " again. Open Air Train."
        : "Air Train: disconnected. Open Air Train to reconnect.",
  );
</script>

{#if tether.connected || tether.holding || tether.used}
  <button
    type="button"
    class="tether-icon flex shrink-0 items-center gap-1 rounded-full px-1.5 py-1 2xl:gap-2 2xl:px-3 2xl:py-2"
    class:is-on={tether.connected}
    class:is-holding={!tether.connected && tether.holding}
    aria-label={label}
    title={label}
    onclick={() => openDogsPage({ app: AIR_TRAIN_APP, force: true })}
  >
    {#if tether.connected || tether.holding}
      <Cable class="h-4 w-4 2xl:h-6 2xl:w-6" aria-hidden="true" />
    {:else}
      <Unplug class="h-4 w-4 2xl:h-6 2xl:w-6" aria-hidden="true" />
      <span class="tether-icon-text text-[0.625rem] md:text-xs 2xl:text-base" aria-hidden="true">{OFF_TEXT}</span>
    {/if}
  </button>
{/if}

<style lang="scss">
  @use "../styles/variables" as *;

  .tether-icon {
    border: 1px solid transparent;
    background: transparent;
    color: $color-tether-off;
    cursor: pointer;
    transition: color $transition-speed-fast ease, border-color $transition-speed-fast ease;

    &:hover,
    &:focus-visible {
      color: $color-blog-ink-strong;
      border-color: $border-light;
    }
  }

  .tether-icon-text {
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .is-on {
    color: $color-neon-green;
  }

  // The connection dropped and is being found again
  .is-holding {
    color: $color-tether-holding;
    animation: tether-icon-wait 1.6s ease-in-out infinite;
  }

  @keyframes tether-icon-wait {
    50% {
      opacity: 0.45;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .is-holding {
      animation: none;
    }
  }
</style>
