<script>
  /**
   * The visualizer's presets for the video: changing on their own every so
   * often, or one held for the whole video. Hearts, presets turned down and
   * "favourites only" are the music player's own lists: a change here is a
   * change there, and the other way round.
   */
  import { ChevronLeft, ChevronRight, Shuffle, Heart, ThumbsDown } from "lucide-svelte";
  import { session, AUTO_SECONDS, PRESETS_AUTO, PRESETS_ONE } from "./lyricVideoSession.svelte.js";
  import { presetDeck } from "../../../lib/visualizer/presetDeck.svelte.js";

  const BUTTON = "lv-btn gap-2 px-3 py-2 text-sm 2xl:px-5 2xl:py-4 2xl:text-xl";
  const CHIP = "lv-chip px-3 py-1.5 text-xs md:text-sm 2xl:px-5 2xl:py-3 2xl:text-xl";
  const LABEL = "lv-heading text-xs 2xl:text-lg";

  let liked = $derived(presetDeck.favorites.includes(session.presetOn));
  let disliked = $derived(presetDeck.disliked.includes(session.presetOn));
</script>

<div class="flex flex-col gap-5 2xl:gap-10">
  <div class="flex flex-col gap-2 2xl:gap-4">
    <span class={LABEL}>On screen</span>
    <p class="truncate text-sm md:text-base 2xl:text-2xl" title={session.presetOn}>{session.presetOn || "Loading the visualizer…"}</p>
    <div class="flex flex-wrap gap-2 2xl:gap-4">
      <button type="button" class={BUTTON} aria-label="Previous preset" onclick={() => session.stepPreset("previous")}><ChevronLeft size={18} /></button>
      <button type="button" class={BUTTON} aria-label="Random preset" onclick={() => session.stepPreset("random")}><Shuffle size={18} /></button>
      <button type="button" class={BUTTON} aria-label="Next preset" onclick={() => session.stepPreset("next")}><ChevronRight size={18} /></button>
      <button type="button" class={BUTTON} class:is-on={liked} aria-pressed={liked} title="Heart it: here and in the music player" onclick={() => session.likePreset()}><Heart size={18} /></button>
      <button type="button" class={BUTTON} class:is-on={disliked} aria-pressed={disliked} title="Turn it down: never shown again, here or in the player" onclick={() => session.dislikePreset()}><ThumbsDown size={18} /></button>
    </div>
  </div>

  <div class="flex flex-col gap-2 2xl:gap-4">
    <span class={LABEL}>During the video</span>
    <div class="flex flex-wrap gap-2 2xl:gap-4">
      <button type="button" class={CHIP} class:is-on={session.settings.presets === PRESETS_AUTO} onclick={() => session.setSettings({ presets: PRESETS_AUTO })}>Change on their own</button>
      <button type="button" class={CHIP} class:is-on={session.settings.presets === PRESETS_ONE} onclick={() => session.setSettings({ presets: PRESETS_ONE, preset: session.presetOn })}>Keep this one</button>
    </div>
  </div>

  {#if session.settings.presets === PRESETS_AUTO}
    <div class="flex flex-col gap-2 2xl:gap-4">
      <span class={LABEL}>Every</span>
      <div class="flex flex-wrap gap-2 2xl:gap-4">
        {#each AUTO_SECONDS as seconds (seconds)}
          <button type="button" class={CHIP} class:is-on={session.settings.autoSeconds === seconds} onclick={() => session.setSettings({ autoSeconds: seconds })}>{seconds} s</button>
        {/each}
      </div>
      <button type="button" class="{CHIP} self-start" class:is-on={presetDeck.favoritesOnly} aria-pressed={presetDeck.favoritesOnly} disabled={!presetDeck.favorites.length} onclick={() => session.setFavoritesOnly(!presetDeck.favoritesOnly)}>
        Hearted only ({presetDeck.favorites.length})
      </button>
    </div>
  {/if}
  <p class="lv-muted text-xs 2xl:text-lg">Hearts and turned-down presets are shared with the music player.</p>
</div>
