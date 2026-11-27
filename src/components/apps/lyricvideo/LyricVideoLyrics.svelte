<script>
  /**
   * The video's lyrics: where they came from, a caption file to read them
   * from, the Captions app to edit them, and how the line looks on the video.
   */
  import { FileText, PenLine, Trash2, Eye, EyeOff } from "lucide-svelte";
  import { session, PLACES } from "./lyricVideoSession.svelte.js";
  import { FROM_FILE, FROM_CAPTIONS, FROM_PUBLISHED } from "./lyricVideoLyrics.js";
  import { MODE_WORDS, MODE_LINE } from "./lyricDraw.js";
  import { LYRIC_FONTS } from "../../../lib/lyrics.svelte.js";

  const CAPTION_ACCEPT = ".srt,.vtt,.lrc,.json,text/vtt,application/x-subrip";
  const FROM_LABELS = { [FROM_FILE]: "a caption file", [FROM_CAPTIONS]: "Captions", [FROM_PUBLISHED]: "the music player" };
  const MODES = [
    { id: MODE_WORDS, name: "Word by word" },
    { id: MODE_LINE, name: "Whole line" },
  ];
  const SIZE_MIN = 0.5;
  const SIZE_MAX = 2.5;
  const SIZE_STEP = 0.05;
  const Y_MIN = 0.05;
  const Y_MAX = 0.95;
  const Y_STEP = 0.01;
  /** How close the slider must be to a quick pick for that pick to light up. */
  const PLACE_MATCH = 0.02;
  const BUTTON = "lv-btn gap-2 px-3 py-2 text-sm 2xl:px-5 2xl:py-4 2xl:text-xl";
  const CHIP = "lv-chip px-3 py-1.5 text-xs md:text-sm 2xl:px-5 2xl:py-3 2xl:text-xl";
  const LABEL = "lv-heading text-xs 2xl:text-lg";

  let fileInput = $state(null);

  let lineCount = $derived(session.lyrics ? session.lyrics.lines.length : 0);

  function picked(event) {
    const file = event.currentTarget.files[0];
    event.currentTarget.value = "";
    if (file) session.importCaptions(file);
  }

  function remove() {
    if (window.confirm("Take the lyrics off this video? The Captions app keeps its own copy.")) session.removeLyrics();
  }
</script>

<div class="flex flex-col gap-5 2xl:gap-10">
  <div class="flex flex-col gap-2 2xl:gap-4">
    <p class="text-sm md:text-base 2xl:text-2xl">
      {#if lineCount}
        {lineCount} lines, from {FROM_LABELS[session.lyricsFrom] || "earlier"}.
      {:else}
        No lyrics yet: the video is the visualizer alone.
      {/if}
    </p>
    <div class="flex flex-wrap gap-2 2xl:gap-4">
      <button type="button" class={BUTTON} disabled={session.recording} onclick={() => fileInput.click()}><FileText size={18} /> Caption file</button>
      <button type="button" class={BUTTON} disabled={session.recording} onclick={() => session.editInCaptions()} title="Time, fix or write the words in Captions, then come back here.">
        <PenLine size={18} /> {lineCount ? "Edit in Captions" : "Write in Captions"}
      </button>
      {#if lineCount}
        <button type="button" class={BUTTON} disabled={session.recording} onclick={remove}><Trash2 size={18} /> Remove</button>
      {/if}
    </div>
    <input bind:this={fileInput} type="file" accept={CAPTION_ACCEPT} class="hidden" onchange={picked} />
    <p class="lv-muted text-xs 2xl:text-lg">Takes .srt, .vtt, .lrc or Captions' .json. Edits made in Captions come back here on their own.</p>
    {#if session.error}<p class="lv-error text-sm 2xl:text-xl" role="alert">{session.error}</p>{/if}
    {#if session.note}<p class="lv-ok text-sm 2xl:text-xl">{session.note}</p>{/if}
  </div>

  {#if lineCount}
    <div class="flex flex-col gap-4 2xl:gap-8">
      <button type="button" class="{BUTTON} self-start" class:is-on={session.look.shown} aria-pressed={session.look.shown} onclick={() => session.setLook({ shown: !session.look.shown })}>
        {#if session.look.shown}<Eye size={18} /> Lyrics on the video{:else}<EyeOff size={18} /> Lyrics hidden{/if}
      </button>

      <div class="flex flex-col gap-2 2xl:gap-4">
        <span class={LABEL}>Where</span>
        <div class="flex flex-wrap gap-2 2xl:gap-4">
          {#each PLACES as place (place.id)}
            <button type="button" class={CHIP} class:is-on={Math.abs(session.look.y - place.y) < PLACE_MATCH} onclick={() => session.setLook({ y: place.y })}>{place.name}</button>
          {/each}
        </div>
        <input type="range" class="lv-range" min={Y_MIN} max={Y_MAX} step={Y_STEP} value={session.look.y} aria-label="Height on the video" oninput={(event) => session.setLook({ y: Number(event.currentTarget.value) })} />
      </div>

      <div class="flex flex-col gap-2 2xl:gap-4">
        <span class={LABEL}>Words arrive</span>
        <div class="flex flex-wrap gap-2 2xl:gap-4">
          {#each MODES as mode (mode.id)}
            <button type="button" class={CHIP} class:is-on={session.look.mode === mode.id} onclick={() => session.setLook({ mode: mode.id })}>{mode.name}</button>
          {/each}
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:gap-8">
        <label class="flex flex-col gap-2 2xl:gap-4">
          <span class={LABEL}>Font</span>
          <select class="lv-input px-3 py-2 text-sm 2xl:px-5 2xl:py-4 2xl:text-xl" value={session.look.font} onchange={(event) => session.setLook({ font: event.currentTarget.value })}>
            {#each LYRIC_FONTS as font (font.id)}
              <option value={font.id}>{font.name}</option>
            {/each}
          </select>
        </label>
        <label class="flex flex-col gap-2 2xl:gap-4">
          <span class={LABEL}>Colour</span>
          <input type="color" class="lv-color h-10 w-full 2xl:h-16" value={session.look.color} oninput={(event) => session.setLook({ color: event.currentTarget.value })} />
        </label>
      </div>

      <label class="flex flex-col gap-2 2xl:gap-4">
        <span class={LABEL}>Size</span>
        <input type="range" class="lv-range" min={SIZE_MIN} max={SIZE_MAX} step={SIZE_STEP} value={session.look.scale} oninput={(event) => session.setLook({ scale: Number(event.currentTarget.value) })} />
      </label>

      <div class="flex flex-wrap gap-2 2xl:gap-4">
        <button type="button" class={CHIP} class:is-on={session.look.caps} aria-pressed={session.look.caps} onclick={() => session.setLook({ caps: !session.look.caps })}>ALL CAPS</button>
        <button type="button" class={CHIP} class:is-on={session.look.shadow} aria-pressed={session.look.shadow} onclick={() => session.setLook({ shadow: !session.look.shadow })}>Shadow</button>
      </div>
    </div>
  {/if}
</div>
