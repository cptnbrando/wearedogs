<script>
  /**
   * Lyric Video's first screen: drop in any audio file, or a video to use its
   * sound. The owner, signed in (Settings, lib/admin), also picks from the
   * music player's songs, whose lyrics come along.
   */
  import { FileAudio, Search } from "lucide-svelte";
  import { session } from "./lyricVideoSession.svelte.js";
  import LyricVideoSongs from "./LyricVideoSongs.svelte";
  import { admin } from "../../../lib/admin.svelte.js";

  const MEDIA_ACCEPT = "audio/*,video/*,.mp3,.wav,.m4a,.aac,.flac,.ogg,.opus,.mp4,.mov,.m4v,.webm,.mkv";

  let dragging = $state(false);
  let fileInput = $state(null);

  function drop(event) {
    event.preventDefault();
    dragging = false;
    const file = event.dataTransfer && event.dataTransfer.files[0];
    if (file) session.openFile(file);
  }

  function picked(event) {
    const file = event.currentTarget.files[0];
    event.currentTarget.value = "";
    if (file) session.openFile(file);
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="lv-start flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-4 sm:gap-3 sm:p-3 md:gap-6 md:p-6 xl:mx-auto xl:w-full xl:max-w-7xl 2xl:gap-10 2xl:p-10"
  class:is-dragging={dragging}
  ondragover={(event) => {
    event.preventDefault();
    dragging = true;
  }}
  ondragleave={() => (dragging = false)}
  ondrop={drop}
>
  <p class="lv-lead text-sm sm:text-xs md:text-base xl:text-lg 2xl:text-3xl">
    Make a visualizer video with lyrics from any song, or play it full screen. Everything happens in your browser.
  </p>

  <div class="grid grid-cols-1 gap-3 md:gap-4 2xl:gap-8 {admin.unlocked ? 'sm:grid-cols-2' : 'xl:max-w-3xl'}">
    <button type="button" class="lv-choice flex flex-col items-start gap-2 p-4 text-left md:p-6 2xl:gap-4 2xl:p-10" disabled={session.media.loading} onclick={() => fileInput.click()}>
      <FileAudio class="h-7 w-7 2xl:h-12 2xl:w-12" aria-hidden="true" />
      <span class="lv-choice-title text-base md:text-lg 2xl:text-3xl">Open a file</span>
      <span class="lv-muted text-xs md:text-sm 2xl:text-xl">An MP3 or any audio file. A video works too: its sound is used. Or drop it anywhere here.</span>
    </button>
    {#if admin.unlocked}
      <div class="lv-choice flex min-h-0 flex-col gap-2 p-4 md:p-6 2xl:gap-4 2xl:p-10">
        <span class="lv-choice-title flex items-center gap-2 text-base md:text-lg 2xl:text-3xl"><Search class="h-5 w-5 2xl:h-9 2xl:w-9" aria-hidden="true" /> A song from the player</span>
        <LyricVideoSongs />
      </div>
    {/if}
  </div>
  <input bind:this={fileInput} type="file" accept={MEDIA_ACCEPT} class="hidden" onchange={picked} />

  {#if session.media.loading}
    <p class="lv-muted text-sm 2xl:text-2xl">Loading…</p>
  {/if}
  {#if session.media.error}
    <p class="lv-error text-sm 2xl:text-2xl" role="alert">{session.media.error}</p>
  {/if}
</div>
