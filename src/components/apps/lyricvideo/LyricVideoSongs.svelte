<script>
  /**
   * The music player's songs, searchable, for the owner to make a video of.
   * Picking one fetches its sound, and its lyrics come along (Captions' newer
   * work for it first, then this device's or the published ones).
   */
  import { session } from "./lyricVideoSession.svelte.js";
  import { lyricSongs } from "../captions/captionsSongs.js";
  import { musicCatalog } from "../../../lib/musicCatalog.svelte.js";
  import { lyrics } from "../../../lib/lyrics.svelte.js";

  let query = $state("");
  let songs = $derived(lyricSongs());
  let words = $derived(query.trim().toLowerCase().split(/\s+/).filter(Boolean));
  let shown = $derived(
    words.length ? songs.filter((song) => words.every((word) => `${song.title} ${song.artist}`.toLowerCase().includes(word))) : songs,
  );

  // New songs arrive through the catalog; asking is safe and rare
  musicCatalog.refresh();
  lyrics.refreshList();
</script>

<div class="flex min-h-0 flex-col gap-2 2xl:gap-4">
  <input class="lv-input px-3 py-2 text-sm 2xl:px-5 2xl:py-4 2xl:text-2xl" type="search" placeholder="Search songs" aria-label="Search songs" bind:value={query} />
  <ul class="lv-songs flex max-h-64 min-h-0 flex-col gap-1 overflow-y-auto md:max-h-80 2xl:max-h-[40vh] 2xl:gap-2">
    {#each shown as song (song.id)}
      <li>
        <button type="button" class="lv-song flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm 2xl:px-5 2xl:py-4 2xl:text-2xl" disabled={session.media.loading} onclick={() => session.openTrack(song)}>
          <span class="min-w-0 truncate">{song.title}<span class="lv-muted"> · {song.artist}</span></span>
          {#if lyrics.has(song.id)}<span class="lv-tag shrink-0 px-2 text-[0.625rem] 2xl:text-base">lyrics</span>{/if}
        </button>
      </li>
    {:else}
      <li class="lv-muted px-1 text-sm 2xl:text-xl">No songs match.</li>
    {/each}
  </ul>
</div>
