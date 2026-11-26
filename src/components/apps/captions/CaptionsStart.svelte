<script>
  /**
   * The Captions app's first screen: what it does, in a sentence, and the way
   * in: a file of your own. The owner, signed in (Settings, lib/admin), also
   * gets the second way: a song from the music player, to time the lyrics
   * everyone sees in the player.
   */
  import { FileAudio, Music, ArrowLeft } from "lucide-svelte";
  import { musicCatalog } from "../../../lib/musicCatalog.svelte.js";
  import { lyricSongs } from "./captionsSongs.js";
  import { admin } from "../../../lib/admin.svelte.js";
  import { listProjects, KIND_TRACK } from "./captionsStore.js";

  const MEDIA_ACCEPT = "audio/*,video/*,.mp3,.wav,.m4a,.flac,.ogg,.mp4,.mov,.webm,.mkv";
  const MAX_RECENT = 6;

  /** @type {{ onFile: (file: File) => void, onTrack: (track: object) => void, loading: boolean, error: string }} */
  let { onFile, onTrack, loading, error } = $props();

  let picking = $state(false);
  let dragging = $state(false);
  let fileInput = $state(null);

  let songs = $derived(lyricSongs());
  const kept = listProjects();
  // A song's saved work is the owner's: everyone else sees only their files
  let recent = $derived(kept.filter((entry) => admin.unlocked || entry.kind !== KIND_TRACK).slice(0, MAX_RECENT));

  // New songs arrive through the catalog; asking is safe and rare (lib/musicCatalog.svelte.js)
  musicCatalog.refresh();

  function drop(event) {
    event.preventDefault();
    dragging = false;
    const file = event.dataTransfer && event.dataTransfer.files[0];
    if (file) onFile(file);
  }

  function reopen(entry) {
    const track = songs.find((song) => song.id === entry.trackId);
    if (track) onTrack(track);
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="cap-start flex h-full min-h-0 flex-col gap-4 p-4 sm:gap-3 sm:p-3 md:gap-6 md:p-6 xl:mx-auto xl:max-w-7xl 2xl:gap-10 2xl:p-10"
  class:is-dragging={dragging}
  ondragover={(event) => {
    event.preventDefault();
    dragging = true;
  }}
  ondragleave={() => (dragging = false)}
  ondrop={drop}
>
  <p class="cap-lead text-sm sm:text-xs md:text-base xl:text-lg 2xl:text-2xl">
    Time captions and lyrics to sound, word by word, then export them for your video editor.
  </p>

  {#if picking}
    <button type="button" class="cap-btn self-start px-3 py-2 text-xs md:text-sm 2xl:text-lg" onclick={() => (picking = false)}>
      <ArrowLeft size={16} /> Back
    </button>
    <ul class="cap-songs grid min-h-0 flex-1 grid-cols-1 content-start gap-2 overflow-y-auto sm:grid-cols-2 md:grid-cols-3 md:gap-3 xl:grid-cols-4 2xl:gap-4">
      {#each songs as song (song.id)}
        <li>
          <button type="button" class="cap-song flex w-full flex-col px-3 py-2 text-left text-sm 2xl:px-5 2xl:py-4 2xl:text-xl" disabled={loading} onclick={() => onTrack(song)}>
            <span class="truncate font-bold">{song.title}</span>
            <span class="cap-muted truncate text-xs 2xl:text-base">{song.artist}</span>
          </button>
        </li>
      {/each}
    </ul>
  {:else}
    <div class="grid min-h-0 flex-1 grid-cols-1 gap-3 md:gap-6 2xl:gap-10 {admin.unlocked ? 'sm:grid-cols-2' : ''}">
      <button type="button" class="cap-choice flex flex-col items-center justify-center gap-2 p-4 md:gap-4 2xl:gap-6" disabled={loading} onclick={() => fileInput.click()}>
        <FileAudio size={36} />
        <span class="text-base font-bold md:text-xl 2xl:text-3xl">A file</span>
        <span class="cap-muted text-xs md:text-sm 2xl:text-lg">Audio or video. Pick it, or drop it here. It stays on this device.</span>
      </button>
      {#if admin.unlocked}
        <button type="button" class="cap-choice flex flex-col items-center justify-center gap-2 p-4 md:gap-4 2xl:gap-6" disabled={loading} onclick={() => (picking = true)}>
          <Music size={36} />
          <span class="text-base font-bold md:text-xl 2xl:text-3xl">A song</span>
          <span class="cap-muted text-xs md:text-sm 2xl:text-lg">From the music player, to time the lyrics everyone sees. Owner only.</span>
        </button>
      {/if}
    </div>
    <input
      bind:this={fileInput}
      class="hidden"
      type="file"
      accept={MEDIA_ACCEPT}
      onchange={(event) => {
        const file = event.currentTarget.files[0];
        if (file) onFile(file);
        event.currentTarget.value = "";
      }}
    />
  {/if}

  {#if loading}
    <p class="cap-muted text-xs md:text-sm 2xl:text-lg" aria-live="polite">Loading…</p>
  {:else if error}
    <p class="cap-error text-xs md:text-sm 2xl:text-lg" role="alert">{error}</p>
  {:else if recent.length && !picking}
    <p class="cap-muted flex flex-row flex-wrap items-center gap-2 text-xs md:text-sm 2xl:text-lg">
      Saved on this device:
      {#each recent as entry (entry.key)}
        {#if entry.kind === KIND_TRACK}
          <button type="button" class="cap-chip px-2 py-1" onclick={() => reopen(entry)}>{entry.name}</button>
        {:else}
          <span class="cap-chip px-2 py-1" title="Open the same file to carry on">{entry.name}</span>
        {/if}
      {/each}
    </p>
  {/if}
</div>
