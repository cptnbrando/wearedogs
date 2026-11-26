<script>
  /**
   * Tap along: the pinpoint way to time words. Paste the words, press play,
   * and tap once per word as it is said. Each tap stamps the next word with
   * the audio's own clock, read at the moment of the tap.
   *
   * The big pad answers to pointerdown, not click, so nothing waits for the
   * finger to lift. Space taps too, and Backspace steps back (CaptionsApp.svelte).
   */
  import { Hand, Undo2, Square, RotateCcw, ClipboardPaste } from "lucide-svelte";
  import { linesFromText, spotBefore, wordAt } from "./captionsEdit.js";

  /** Starting part-way through, the sound backs up this far so the next word can be heard coming. */
  const RUN_UP_S = 2;
  const SHIFTS = [-0.05, -0.01, 0.01, 0.05];
  const MS_PER_SECOND = 1000;
  const SMALL_BUTTON = "cap-btn px-3 py-2 text-xs md:text-sm 2xl:px-5 2xl:py-3 2xl:text-lg";

  /** @type {{ media: import("./captionsMedia.svelte.js").CaptionsMedia, project: import("./captionsProject.svelte.js").CaptionsProject }} */
  let { media, project } = $props();

  let pasting = $state(false);
  let pasted = $state("");

  let timed = $derived(project.counts.words - project.counts.untimed);
  let cursorLine = $derived(project.cursor ? project.lines[project.cursor.li] : null);
  let nextLine = $derived(project.cursor ? project.lines[project.cursor.li + 1] || null : null);

  const shiftLabel = (delta) => `${delta > 0 ? "+" : "−"}${Math.round(Math.abs(delta) * MS_PER_SECOND)}`;

  function useWords() {
    const lines = linesFromText(pasted);
    if (!lines.length) return;
    project.replaceLines(lines);
    pasted = "";
    pasting = false;
  }

  function start(fromTop) {
    project.startTap(fromTop);
    if (!project.cursor) return;
    const before = spotBefore(project.lines, project.cursor);
    const word = before ? wordAt(project.lines, before) : null;
    if (fromTop) media.seek(0);
    else if (word && word.t !== null) media.seek(word.t - RUN_UP_S);
    media.play();
  }

  function stop() {
    project.stopTap();
    media.pause();
  }
</script>

<div class="cap-tap flex h-full min-h-0 flex-col gap-3 md:gap-4 2xl:gap-6">
  {#if pasting || !project.lines.length}
    <label class="cap-muted flex min-h-0 flex-1 flex-col gap-2 text-xs md:text-sm 2xl:text-lg">
      Paste the words. Each row becomes a line.
      <textarea class="cap-input min-h-24 flex-1 resize-none p-2 text-sm md:p-3 md:text-base 2xl:p-5 2xl:text-xl" bind:value={pasted} placeholder="First line of the song&#10;Second line of the song"></textarea>
    </label>
    <div class="flex flex-row flex-wrap gap-2 md:gap-3">
      <button type="button" class="cap-btn cap-btn-main px-4 py-3 text-sm md:text-base 2xl:px-6 2xl:py-4 2xl:text-xl" disabled={!pasted.trim()} onclick={useWords}>
        Use these words
      </button>
      {#if project.lines.length}
        <button type="button" class={SMALL_BUTTON} onclick={() => (pasting = false)}>Keep the words I have</button>
      {/if}
    </div>
  {:else if project.tapping}
    <div class="cap-tap-words flex flex-col gap-1 text-center" aria-live="off">
      <p class="cap-tap-line">
        {#if cursorLine}
          {#each cursorLine.words as word, wi}
            <span class:is-done={wi < project.cursor.wi} class:is-next={wi === project.cursor.wi}>{word.x}</span>{" "}
          {/each}
        {/if}
      </p>
      <p class="cap-tap-next cap-muted truncate">
        {#if nextLine}{nextLine.words.map((word) => word.x).join(" ")}{:else}&nbsp;{/if}
      </p>
    </div>
    <button
      type="button"
      class="cap-pad cap-pad-tap flex min-h-24 flex-1 flex-col items-center justify-center gap-1 md:gap-2 2xl:gap-3"
      onpointerdown={(event) => {
        event.preventDefault();
        project.tap(media.now());
      }}
    >
      <Hand class="cap-pad-icon" aria-hidden="true" />
      Tap
      <span class="cap-pad-hint cap-muted hidden md:block">or press Space. Backspace steps back.</span>
    </button>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-2 md:gap-3 lg:grid-cols-2 xl:grid-cols-2 2xl:gap-4">
      <button type="button" class={SMALL_BUTTON} onclick={() => project.tapBack()}>
        <Undo2 size={16} /> Back<span class="cap-tap-more">&nbsp;one word</span>
      </button>
      <button type="button" class={SMALL_BUTTON} onclick={stop}>
        <Square size={16} /> Stop
      </button>
    </div>
  {:else}
    <p class="cap-muted text-xs md:text-sm 2xl:text-lg">
      Press start, then tap once for every word as it is said. {timed} of {project.counts.words} words have a time.
      <span class="hidden md:inline">Slower playback (the speed buttons) makes fast verses easier, and the times stay true.</span>
    </p>
    <button type="button" class="cap-pad cap-pad-start flex min-h-20 flex-1 flex-col items-center justify-center gap-2 text-lg md:text-2xl 2xl:text-4xl" onclick={() => start(false)}>
      <Hand size={36} />
      {project.sel ? "Start from the selected word" : project.counts.untimed ? "Start tapping" : "Start from the first word"}
    </button>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-2 md:gap-3 lg:grid-cols-2 xl:grid-cols-2 2xl:gap-4">
      <button type="button" class={SMALL_BUTTON} title="Forget every time and tap the whole thing again" onclick={() => start(true)}>
        <RotateCcw size={16} /> From the top
      </button>
      <button type="button" class={SMALL_BUTTON} onclick={() => (pasting = true)}>
        <ClipboardPaste size={16} /> Replace the words
      </button>
    </div>
    <div class="flex flex-row flex-wrap items-center gap-2 md:gap-3" role="group" aria-label="Move every word, in milliseconds">
      <span class="cap-muted text-xs md:text-sm 2xl:text-lg">Every word, ms:</span>
      {#each SHIFTS as delta}
        <button type="button" class="cap-btn px-2 py-1 text-xs md:text-sm 2xl:px-4 2xl:py-2 2xl:text-lg" disabled={!timed} aria-label="Move every word {shiftLabel(delta)} milliseconds" onclick={() => project.shiftAll(delta)}>
          {shiftLabel(delta)}
        </button>
      {/each}
    </div>
  {/if}
</div>
