<script>
  /**
   * Lyric Video: any song (or a video's sound) made into a MilkDrop visualizer
   * video with its lyrics, in the browser. Nothing is uploaded.
   *
   * Everything being worked on lives in lyricVideoSession.svelte.js, outside
   * this window, so a trip to Captions to edit the words (or anywhere else)
   * leaves it all as it was. This file lays the panels out and owns the keys.
   */
  import { onMount, onDestroy } from "svelte";
  import { Music, Captions, Sparkles, Clapperboard } from "lucide-svelte";
  import { session } from "./lyricVideoSession.svelte.js";
  import LyricVideoStart from "./LyricVideoStart.svelte";
  import LyricVideoPreview from "./LyricVideoPreview.svelte";
  import LyricVideoSound from "./LyricVideoSound.svelte";
  import LyricVideoLyrics from "./LyricVideoLyrics.svelte";
  import LyricVideoVisuals from "./LyricVideoVisuals.svelte";
  import LyricVideoMake from "./LyricVideoMake.svelte";
  import "./lyricvideo.scss";

  const TAB_SOUND = "sound";
  const TAB_LYRICS = "lyrics";
  const TAB_VISUALS = "visuals";
  const TAB_MAKE = "make";
  const TABS = [
    { id: TAB_SOUND, label: "Sound", icon: Music },
    { id: TAB_LYRICS, label: "Lyrics", icon: Captions },
    { id: TAB_VISUALS, label: "Visuals", icon: Sparkles },
    { id: TAB_MAKE, label: "Make", icon: Clapperboard },
  ];
  const TYPING_TAGS = ["INPUT", "TEXTAREA", "SELECT"];
  const TAB_BUTTON = "lv-tab flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[0.625rem] sm:flex-row sm:gap-1 sm:text-xs md:text-sm 2xl:gap-2 2xl:py-3 2xl:text-lg";

  let tab = $state(TAB_MAKE);

  /** Space plays and pauses, outside a field. */
  function onKeydown(event) {
    if (event.key !== " " || !session.media.kind || event.altKey || event.ctrlKey || event.metaKey) return;
    const tag = event.target && event.target.tagName;
    if (TYPING_TAGS.includes(tag) || (event.target && event.target.isContentEditable)) return;
    event.preventDefault();
    if (event.repeat || session.recording) return;
    if (session.stage) session.stage.wake();
    session.media.toggle();
  }

  onMount(async () => {
    await session.restore();
    // Back from Captions: its newer words come with us
    session.pullFromCaptions();
    session.show();
  });

  // A file opened here (or brought back) starts its visualizer
  $effect(() => {
    if (session.media.kind && session.ready) session.show();
  });

  window.addEventListener("keydown", onKeydown);
  onDestroy(() => {
    window.removeEventListener("keydown", onKeydown);
    session.hide();
  });
</script>

<div class="lv-app flex h-full min-h-0 w-full flex-col">
  {#if !session.ready}
    <p class="lv-muted m-auto text-sm 2xl:text-2xl">Opening…</p>
  {:else if session.unsupported}
    <p class="lv-error m-auto max-w-md p-6 text-center text-sm md:text-base 2xl:max-w-2xl 2xl:text-2xl">{session.unsupported}</p>
  {:else if !session.media.kind}
    <LyricVideoStart />
  {:else}
    <div class="lv-editor h-full min-h-0 gap-2 p-2 sm:gap-2 sm:p-2 md:gap-3 md:p-3 xl:mx-auto xl:w-full xl:max-w-7xl 2xl:max-w-none 2xl:gap-6 2xl:p-6">
      <section class="lv-stage-col flex min-h-0 min-w-0 flex-col gap-2 md:gap-3 2xl:gap-5">
        <LyricVideoPreview />
      </section>

      <section class="lv-side flex min-h-0 min-w-0 flex-col gap-2 md:gap-3 2xl:gap-5">
        <nav class="lv-tabs flex flex-row gap-1 2xl:gap-2" aria-label="Lyric Video">
          {#each TABS as item (item.id)}
            {@const Icon = item.icon}
            <button type="button" class={TAB_BUTTON} class:is-on={tab === item.id} aria-pressed={tab === item.id} onclick={() => (tab = item.id)}>
              <Icon size={18} /> {item.label}
            </button>
          {/each}
        </nav>
        <div class="lv-panel min-h-0 flex-1 overflow-y-auto p-3 md:p-4 2xl:p-6">
          {#if tab === TAB_SOUND}
            <LyricVideoSound />
          {:else if tab === TAB_LYRICS}
            <LyricVideoLyrics />
          {:else if tab === TAB_VISUALS}
            <LyricVideoVisuals />
          {:else}
            <LyricVideoMake />
          {/if}
        </div>
      </section>
    </div>
  {/if}
</div>
