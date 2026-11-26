<script>
  /**
   * Write: the lines as plain text, the way lyrics get written: a row per
   * line, a blank row between verses. Edit it like any text, then put it in:
   * the times move onto the new words (CaptionsProject.rewrite). The line
   * being sung shows above the text, so it can be followed while it plays.
   *
   * The text being edited lives on the project (draft), not here: it stays
   * through a switch to Words or another tab, the app closing and a reload.
   * Throwing it away is a small icon that asks first.
   */
  import { Check, RotateCcw, Volume2 } from "lucide-svelte";
  import { linesToText, lineStart, lineIndexAtTime, clock } from "./captionsEdit.js";

  const BUTTON = "cap-btn px-3 py-2 text-xs md:text-sm 2xl:px-5 2xl:py-3 2xl:text-lg";
  const PLACEHOLDER = "Write the words here, a row for each line.\n\nA blank row between verses.";
  const DISCARD_LABEL = "Throw away these changes";
  const DISCARD_ASK = "Throw away everything you changed here and show the lines as they are? This cannot be undone.";

  /** @type {{ media: import("./captionsMedia.svelte.js").CaptionsMedia, project: import("./captionsProject.svelte.js").CaptionsProject }} */
  let { media, project } = $props();

  let fieldEl = $state(null);
  /** The text as the lines are now. */
  let current = $derived((project.rev, linesToText(project.lines)));
  /** Being edited: the project holds a draft that differs from the text it started from. */
  let edited = $derived(project.draft !== project.draftBase);
  /** What the field shows: the edit while there is one, else the lines as they are now. */
  let shown = $derived(edited ? project.draft : current);
  let report = $state("");
  let activeLine = $derived(lineIndexAtTime(project.lines, media.time));
  let nowText = $derived(activeLine >= 0 ? project.lines[activeLine].words.map((word) => word.x).join(" ") : "");

  // While nothing is edited the field simply shows the lines, so it follows a change made somewhere else
  /** @param {Event & { currentTarget: HTMLTextAreaElement }} event */
  function onInput(event) {
    project.setDraft(event.currentTarget.value, edited ? project.draftBase : current);
    report = "";
  }

  function putIn() {
    const { kept, total, timed } = project.rewrite(project.draft);
    const placed = total - kept;
    report = !total
      ? "No words."
      : !timed
        ? `${total} words in, with no times yet: Tap along or Transcribe times them.`
        : placed
        ? `${kept} of ${total} words kept their times; ${placed} new ${placed === 1 ? "word was" : "words were"} placed between. Undo brings it back.`
        : `All ${total} words kept their times.`;
    project.setDraft("", "");
  }

  function discard() {
    if (!window.confirm(DISCARD_ASK)) return;
    project.setDraft("", "");
    report = "";
  }

  /** The line the cursor is on, counting written rows only (blank rows are not lines). */
  function cursorLine() {
    if (!fieldEl) return -1;
    const before = shown.slice(0, fieldEl.selectionStart).split("\n");
    return before.filter((row, i) => row.trim() || i === before.length - 1).length - 1;
  }

  function hearCursorLine() {
    const li = Math.min(cursorLine(), project.lines.length - 1);
    const start = li >= 0 ? lineStart(project.lines[li]) : null;
    if (start !== null) media.playFrom(start);
  }

  /** @param {KeyboardEvent} event */
  function onKeydown(event) {
    if (event.key !== "Enter" || !(event.ctrlKey || event.metaKey)) return;
    event.preventDefault();
    if (edited) putIn();
  }
</script>

<div class="cap-write flex h-full min-h-0 flex-col gap-2 md:gap-3 2xl:gap-4">
  <p class="cap-write-now truncate px-2 py-1 text-sm md:text-base 2xl:px-4 2xl:py-2 2xl:text-2xl" class:is-quiet={!nowText} aria-live="off">
    {nowText || (media.playing ? "…" : "Play it, and the line being sung shows here.")}
  </p>

  <textarea
    class="cap-input cap-write-text min-h-0 flex-1 resize-none px-3 py-2 text-sm leading-relaxed sm:text-sm md:text-base lg:text-base 2xl:px-5 2xl:py-4 2xl:text-2xl"
    bind:this={fieldEl}
    value={shown}
    oninput={onInput}
    placeholder={PLACEHOLDER}
    spellcheck="false"
    autocapitalize="off"
    aria-label="The lines, a row for each one, a blank row between verses"
    onkeydown={onKeydown}
  ></textarea>

  <div class="flex flex-row flex-wrap items-center gap-2 2xl:gap-3">
    <button type="button" class="{BUTTON} cap-btn-main" disabled={!edited} title="Put these lines in; the times move onto the new words (Ctrl+Enter)" onclick={putIn}>
      <Check size={14} /> Put it in
    </button>
    <button type="button" class={BUTTON} disabled={!project.lines.length} title="Hear the line the cursor is on" onclick={hearCursorLine}>
      <Volume2 size={14} /> <span class="hidden sm:inline">Hear this line</span>
    </button>
    {#if edited}
      <span class="cap-muted text-xs md:text-sm 2xl:text-lg">Changed. Put it in when you are ready.</span>
    {:else if report}
      <span class="cap-ok text-xs md:text-sm 2xl:text-lg" role="status">{report}</span>
    {/if}
    {#if edited}
      <!-- Tucked away at the far end and small, and it asks first: an edit is never lost to a stray tap -->
      <button type="button" class="cap-write-discard ml-auto p-1 2xl:p-2" title={DISCARD_LABEL} aria-label={DISCARD_LABEL} onclick={discard}>
        <RotateCcw size={11} />
      </button>
    {/if}
  </div>
</div>
