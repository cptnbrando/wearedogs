<script>
  /**
   * SoundSwitch: the speaker switch in the player's bottom row, there while
   * the tether is on (lib/tether.svelte.js). The speaker faces this way when
   * the sound comes out of this device, and turns round when it comes out of
   * the other one. A tap moves it across, and the song plays on from where it is.
   */
  import { Volume1 } from "lucide-svelte";
  import { tether } from "../../lib/tether.svelte.js";

  const LOCKUP_HINT = "This song plays only where it is unlocked";

  let here = $derived(tether.soundHere);
  let canMove = $derived(tether.soundCanMove);
  let label = $derived(
    !canMove
      ? LOCKUP_HINT
      : here
        ? "Sound: this device. Tap to play it on " + (tether.peerName || "the other device")
        : "Sound: " + (tether.peerName || "the other device") + ". Tap to play it here",
  );
</script>

<button
  type="button"
  class="sound-switch"
  class:sound-away={!here}
  disabled={!canMove}
  aria-pressed={!here}
  aria-label={label}
  title={label}
  onclick={() => tether.moveSound()}
>
  <span class="sound-icon"><Volume1 size={14} /></span>
</button>

<style lang="scss">
  // Sized like the player's small round controls (.ctrl-xs in music-panel.scss)
  .sound-switch {
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
    color: rgb(var(--mp-accent-rgb, 255, 255, 255));
    cursor: pointer;
    transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);

    &:hover:not(:disabled) {
      transform: scale(1.1);
    }

    &:active:not(:disabled) {
      transform: scale(0.88);
    }

    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  }

  .sound-icon {
    display: flex;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  // The sound is on the other device: the speaker turns round to face it
  .sound-away .sound-icon {
    transform: scaleX(-1);
  }

  @media (prefers-reduced-motion: reduce) {
    .sound-icon {
      transition: none;
    }
  }
</style>
