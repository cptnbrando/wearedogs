<script>
  /**
   * Files: bring captions in, take them out, and, for a song from the player,
   * put the lyrics into the player (on this device, or for everyone when the
   * owner is signed in).
   */
  import { Upload, Download, Smartphone, CloudUpload, CloudOff, Trash2, RefreshCw } from "lucide-svelte";
  import { lyrics } from "../../../lib/lyrics.svelte.js";
  import { cleanLyrics } from "../../../lib/lyricsFormat.js";
  import { callApi } from "../../../lib/dogsApi.js";
  import { admin } from "../../../lib/admin.svelte.js";
  import { linesFromLyrics } from "./captionsEdit.js";
  import { EXPORT_FORMATS, IMPORT_ACCEPT, readCaptionsFile, exportCaptions } from "./captionsFiles.js";
  import { KIND_TRACK } from "./captionsStore.js";

  const NOTHING_TIMED = "Nothing is timed yet. Tap along, or bring in a file with times.";
  const NOT_READ = "Nothing could be read from that file.";
  const ROW_BUTTON = "cap-btn cap-btn-row px-3 py-2 text-xs md:text-sm 2xl:px-5 2xl:py-3 2xl:text-lg";

  /** @type {{ project: import("./captionsProject.svelte.js").CaptionsProject }} */
  let { project } = $props();

  let note = $state("");
  let failed = $state(false);
  let busy = $state(false);
  let fileInput = $state(null);

  let isSong = $derived(project.kind === KIND_TRACK);
  let onDevice = $derived(lyrics.localIds.includes(project.trackId));
  let published = $derived(!!lyrics.published[project.trackId]);

  // Which songs have published lyrics: asked for rarely (lib/lyrics.svelte.js keeps the answer)
  lyrics.refreshList();

  function say(text, isError = false) {
    note = text;
    failed = isError;
  }

  /** @returns {import("../../../lib/lyricsFormat.js").Lyrics | null} what is timed, or null after saying nothing is */
  function timedLyrics() {
    const timed = project.lyrics();
    if (!timed) say(NOTHING_TIMED, true);
    return timed;
  }

  async function importFile(event) {
    const file = event.currentTarget.files[0];
    event.currentTarget.value = "";
    if (!file) return;
    const lines = readCaptionsFile(file.name, await file.text());
    if (!lines.length) return say(NOT_READ, true);
    project.replaceLines(lines);
    say(`Brought in ${lines.length} lines from ${file.name}.`);
  }

  function exportAs(format) {
    const timed = timedLyrics();
    if (!timed) return;
    exportCaptions(format, timed, project.name);
    say(`Saved as ${format.label}.`);
  }

  function useHere() {
    const timed = timedLyrics();
    if (!timed) return;
    if (lyrics.saveLocal(project.trackId, timed)) say("On this device now: the player shows these lyrics for this song.");
    else say("This browser would not store the lyrics.", true);
  }

  function removeHere() {
    lyrics.removeLocal(project.trackId);
    say("Removed from this device.");
  }

  /** The song's lyrics as the player has them: this device's, else the published ones. */
  async function loadCurrent() {
    busy = true;
    let current = lyrics.stored(project.trackId);
    const updatedAt = lyrics.published[project.trackId];
    if (!current && updatedAt) {
      const answer = await callApi("GET", `/lyrics/${encodeURIComponent(project.trackId)}?v=${updatedAt}`);
      current = answer.ok && answer.data ? cleanLyrics(answer.data.lyrics) : null;
    }
    busy = false;
    if (!current) return say("This song has no lyrics yet.", true);
    project.replaceLines(linesFromLyrics(current));
    say("Loaded the song's current lyrics.");
  }

  async function publish() {
    const timed = timedLyrics();
    if (!timed) return;
    busy = true;
    const answer = await lyrics.publish(project.trackId, timed, admin.token);
    busy = false;
    say(answer.ok ? "Published. Everyone's player shows these lyrics." : answer.error, !answer.ok);
  }

  async function takeDown() {
    busy = true;
    const answer = await lyrics.unpublish(project.trackId, admin.token);
    busy = false;
    say(answer.ok ? "Taken down." : answer.error, !answer.ok);
  }
</script>

<div class="cap-output flex h-full min-h-0 flex-col gap-3 overflow-y-auto md:gap-4 2xl:gap-6">
  {#if note}
    <p class="text-xs md:text-sm 2xl:text-lg" class:cap-error={failed} class:cap-ok={!failed} role="status">{note}</p>
  {/if}

  {#if isSong}
    <section class="flex flex-col gap-2 md:gap-3">
      <h3 class="cap-heading text-xs md:text-sm 2xl:text-lg">This song in the player</h3>
      <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-3 lg:grid-cols-1 xl:grid-cols-2 2xl:gap-4">
        <button type="button" class={ROW_BUTTON} onclick={useHere}>
          <Smartphone size={16} /> Use on this device
        </button>
        <button type="button" class={ROW_BUTTON} disabled={busy} onclick={loadCurrent}>
          <RefreshCw size={16} /> Load the song's current lyrics
        </button>
        {#if onDevice}
          <button type="button" class={ROW_BUTTON} onclick={removeHere}>
            <Trash2 size={16} /> Remove from this device
          </button>
        {/if}
        {#if admin.unlocked}
          <button type="button" class="{ROW_BUTTON} cap-btn-main" disabled={busy} onclick={publish}>
            <CloudUpload size={16} /> Publish for everyone
          </button>
          {#if published}
            <button type="button" class={ROW_BUTTON} disabled={busy} onclick={takeDown}>
              <CloudOff size={16} /> Take down
            </button>
          {/if}
        {/if}
      </div>
    </section>
  {/if}

  <section class="flex flex-col gap-2 md:gap-3">
    <h3 class="cap-heading text-xs md:text-sm 2xl:text-lg">Export</h3>
    <p class="cap-muted text-xs md:text-sm 2xl:text-lg">CapCut imports the .srt (on desktop: Text, Local captions, Import).</p>
    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-3 lg:grid-cols-1 xl:grid-cols-2 2xl:gap-4">
      {#each EXPORT_FORMATS as format (format.id)}
        <button type="button" class="{ROW_BUTTON} cap-btn-stack" onclick={() => exportAs(format)}>
          <span class="flex flex-row items-center gap-2 font-bold"><Download size={14} /> {format.label}</span>
          <span class="cap-muted normal-case">{format.note}</span>
        </button>
      {/each}
    </div>
  </section>

  <section class="flex flex-col gap-2 md:gap-3">
    <h3 class="cap-heading text-xs md:text-sm 2xl:text-lg">Import</h3>
    <p class="cap-muted text-xs md:text-sm 2xl:text-lg">
      .srt, .vtt, .lrc or .json with times. Plain text becomes lines ready for tap along. It replaces what is here; Undo brings it back.
    </p>
    <button type="button" class="{ROW_BUTTON} self-start" onclick={() => fileInput.click()}>
      <Upload size={16} /> Bring in a file
    </button>
    <input bind:this={fileInput} class="hidden" type="file" accept={IMPORT_ACCEPT} onchange={importFile} />
  </section>

  <p class="cap-muted text-xs 2xl:text-base">
    {project.stored ? "Your work is saved on this device as you go. The audio or video itself is not kept." : "This browser would not save your work: export it before you leave."}
  </p>
</div>
