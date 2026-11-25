<script>
  /**
   * The lines: every line and every word with its time, and the bar that
   * edits the selected word (its text, its time, and the line around it).
   */
  import { tick } from "svelte";
  import { Undo2, Scissors, Merge, Plus, Delete, ListPlus, ListX, Volume2, Crosshair } from "lucide-svelte";
  import { clock, lineStart, lineIndexAtTime } from "./captionsEdit.js";

  /** The nudge buttons, in seconds. */
  const NUDGES = [-0.05, -0.01, 0.01, 0.05];
  const MS_PER_SECOND = 1000;
  const SCROLL_INTO = { block: "nearest", inline: "nearest" };
  const BAR_BUTTON = "cap-btn px-2 py-2 text-xs md:text-sm 2xl:px-4 2xl:py-3 2xl:text-lg";

  /** @type {{ media: import("./captionsMedia.svelte.js").CaptionsMedia, project: import("./captionsProject.svelte.js").CaptionsProject }} */
  let { media, project } = $props();

  /** What can be done to the selected word and its line. On phones these are icons; their names show from tablets up. */
  const OPS = [
    { id: "split", label: "Split", title: "This word starts a new line", icon: Scissors, ready: () => !!project.sel && project.sel.wi > 0, run: () => project.split() },
    { id: "join", label: "Join", title: "Join this line with the next one", icon: Merge, ready: () => !!project.sel && project.sel.li < project.lines.length - 1, run: () => project.join() },
    { id: "add-word", label: "Word", title: "Add a word after this one", icon: Plus, ready: () => !!project.sel, run: () => project.addWord() },
    { id: "add-line", label: "Line", title: "Add a line at the playhead", icon: ListPlus, ready: () => true, run: () => project.addLine(media.now()) },
    { id: "delete-word", label: "Word", title: "Delete this word", icon: Delete, ready: () => !!project.sel, run: () => project.removeWord() },
    { id: "delete-line", label: "Line", title: "Delete this whole line", icon: ListX, ready: () => !!project.sel, run: () => project.removeLine() },
    { id: "undo", label: "Undo", title: "Undo (Ctrl+Z)", icon: Undo2, ready: () => project.canUndo, run: () => project.undo() },
  ];

  let listEl = $state(null);
  let activeLine = $derived(lineIndexAtTime(project.lines, media.time));

  const nudgeLabel = (delta) => `${delta > 0 ? "+" : "−"}${Math.round(Math.abs(delta) * MS_PER_SECOND)}`;

  /** Selects a word; outside tap along it is also played, from just before it. */
  function pick(li, wi) {
    project.select({ li, wi });
    if (project.tapping) return (project.cursor = project.sel);
    const word = project.selected;
    if (word && word.t !== null) media.playFrom(word.t);
  }

  function hearLine(li) {
    const start = lineStart(project.lines[li]);
    if (start !== null) media.playFrom(start);
  }

  // The line being said stays in view while it plays; so does the selected word
  $effect(() => {
    const li = activeLine;
    if (!media.playing || li < 0 || !listEl || project.tapping) return;
    const row = listEl.children[li];
    if (row) row.scrollIntoView(SCROLL_INTO);
  });

  $effect(() => {
    const sel = project.sel;
    if (!sel || !listEl) return;
    tick().then(() => {
      const chip = listEl.querySelector(".cap-word.is-sel");
      if (chip) chip.scrollIntoView(SCROLL_INTO);
    });
  });
</script>

<div class="cap-lines-panel flex h-full min-h-0 flex-col gap-2 md:gap-3 2xl:gap-4">
  <div class="cap-wordbar flex flex-col gap-2 p-2 md:p-3 2xl:gap-3 2xl:p-4">
    {#if project.selected}
      <div class="flex flex-row flex-wrap items-center gap-2">
        <input
          class="cap-input min-w-0 flex-1 px-2 py-2 text-sm md:text-base 2xl:px-4 2xl:py-3 2xl:text-xl"
          type="text"
          aria-label="The selected word"
          value={project.selected.x}
          oninput={(event) => project.setText(event.currentTarget.value)}
        />
        <span class="cap-clock text-sm md:text-base 2xl:text-xl">{clock(project.selected.t)}</span>
      </div>
      <div class="cap-nudges grid grid-cols-6 gap-1 sm:grid-cols-6 md:gap-2 lg:grid-cols-6 2xl:gap-3" role="group" aria-label="Move the word's time, in milliseconds">
        {#each NUDGES as delta}
          <button type="button" class={BAR_BUTTON} disabled={project.selected.t === null} aria-label="{nudgeLabel(delta)} milliseconds" onclick={() => project.nudge(delta)}>
            {nudgeLabel(delta)}
          </button>
        {/each}
        <button type="button" class={BAR_BUTTON} title="Set this word to where the playhead is (T)" onclick={() => project.setTime(media.now())}>
          <Crosshair size={14} /> <span class="hidden md:inline">Now</span>
        </button>
        <button type="button" class={BAR_BUTTON} title="Hear from just before this word (Enter)" disabled={project.selected.t === null} onclick={() => media.playFrom(project.selected.t)}>
          <Volume2 size={14} /> <span class="hidden md:inline">Hear</span>
        </button>
      </div>
    {:else}
      <p class="cap-muted text-xs md:text-sm 2xl:text-lg">
        {#if project.lines.length}
          Pick a word to edit it and hear it.
          <span class="hidden lg:inline">Space plays. Arrows move between words. Comma and full stop nudge 10 ms; with Shift, 50 ms.</span>
        {:else}
          No words yet. Paste them in Tap along, bring a file in Files, or add a line here.
        {/if}
      </p>
    {/if}
    <div class="cap-ops grid grid-cols-7 gap-1 sm:grid-cols-7 md:grid-cols-4 md:gap-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-7 2xl:gap-3">
      {#each OPS as op (op.id)}
        {@const Icon = op.icon}
        <button type="button" class={BAR_BUTTON} disabled={!op.ready()} title={op.title} aria-label={op.title} onclick={op.run}>
          <Icon size={14} /> <span class="hidden md:inline">{op.label}</span>
        </button>
      {/each}
    </div>
  </div>

  <ol class="cap-list min-h-0 flex-1 overflow-y-auto" bind:this={listEl}>
    {#each project.lines as line, li (line.id)}
      <li class="cap-line flex flex-row items-start gap-2 px-1 py-1 md:gap-3 md:py-2 2xl:gap-4 2xl:py-3" class:is-now={li === activeLine}>
        <button type="button" class="cap-line-time shrink-0 py-1 text-xs md:text-sm 2xl:text-lg" title="Hear this line" onclick={() => hearLine(li)}>
          {clock(lineStart(line), false)}
        </button>
        <span class="flex min-w-0 flex-1 flex-row flex-wrap gap-1 md:gap-2">
          {#each line.words as word, wi}
            <button
              type="button"
              class="cap-word flex flex-col items-start px-2 py-1 2xl:px-3 2xl:py-2"
              class:is-sel={project.sel !== null && project.sel.li === li && project.sel.wi === wi}
              class:is-untimed={word.t === null}
              class:is-cursor={project.tapping && project.cursor !== null && project.cursor.li === li && project.cursor.wi === wi}
              onclick={() => pick(li, wi)}
            >
              <span class="text-sm md:text-base 2xl:text-xl">{word.x || "·"}</span>
              <span class="cap-word-time text-[0.625rem] md:text-xs 2xl:text-sm">{clock(word.t)}</span>
            </button>
          {/each}
        </span>
      </li>
    {/each}
  </ol>
</div>
