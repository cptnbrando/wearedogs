<script>
  /**
   * What the video is made from: the open file or song, a way to swap it, and
   * (for the owner) the player's songs.
   */
  import { FileAudio, FileVideo, Music, X } from "lucide-svelte";
  import { session } from "./lyricVideoSession.svelte.js";
  import LyricVideoSongs from "./LyricVideoSongs.svelte";
  import { KIND_TRACK } from "../captions/captionsStore.js";
  import { admin } from "../../../lib/admin.svelte.js";

  const MEDIA_ACCEPT = "audio/*,video/*,.mp3,.wav,.m4a,.aac,.flac,.ogg,.opus,.mp4,.mov,.m4v,.webm,.mkv";
  const BUTTON = "lv-btn gap-2 px-3 py-2 text-sm 2xl:px-5 2xl:py-4 2xl:text-xl";

  let fileInput = $state(null);

  let icon = $derived(session.source && session.source.kind === KIND_TRACK ? Music : session.media.kind === "video" ? FileVideo : FileAudio);

  function picked(event) {
    const file = event.currentTarget.files[0];
    event.currentTarget.value = "";
    if (file) session.openFile(file);
  }
</script>

<div class="flex flex-col gap-4 2xl:gap-8">
  {#if session.source}
    {@const Icon = icon}
    <div class="flex items-center gap-3 2xl:gap-5">
      <Icon class="lv-accent h-8 w-8 shrink-0 2xl:h-14 2xl:w-14" aria-hidden="true" />
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold md:text-base 2xl:text-2xl">{session.source.name}</p>
        <p class="lv-muted text-xs md:text-sm 2xl:text-xl">
          {session.source.kind === KIND_TRACK ? "From the music player" : session.media.kind === "video" ? "A video: its sound is used" : "An audio file"}
        </p>
      </div>
    </div>
  {/if}

  <div class="flex flex-wrap gap-2 2xl:gap-4">
    <button type="button" class={BUTTON} disabled={session.recording} onclick={() => fileInput.click()}><FileAudio size={18} /> Open another file</button>
    <button type="button" class={BUTTON} disabled={session.recording} onclick={() => session.clear()}><X size={18} /> Close</button>
  </div>
  <input bind:this={fileInput} type="file" accept={MEDIA_ACCEPT} class="hidden" onchange={picked} />

  {#if admin.unlocked}
    <div class="flex flex-col gap-2 2xl:gap-4">
      <h3 class="lv-heading text-xs 2xl:text-lg">A song from the player</h3>
      <LyricVideoSongs />
    </div>
  {/if}

  {#if session.media.error}
    <p class="lv-error text-sm 2xl:text-xl" role="alert">{session.media.error}</p>
  {/if}
  <p class="lv-muted text-xs 2xl:text-lg">Your file stays in this browser while you use other apps, and after a reload. Nothing is uploaded.</p>
</div>
