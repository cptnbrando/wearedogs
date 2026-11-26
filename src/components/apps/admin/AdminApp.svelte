<script>
  /**
   * Admin: the owner's desk, in the toolbox only while the owner is signed in
   * (Settings, lib/admin). For now it runs the lyrics everyone sees in the
   * music player: each song shows whether lyrics are live, and opens to pick
   * which captions become its lyrics (this device's, or a cloud project),
   * publish them, open them in Captions to edit, or take them down.
   * Where captions come from and how they turn into lyrics: adminLyrics.js.
   */
  import { untrack } from "svelte";
  import { ShieldCheck, CloudUpload, CloudOff, PenLine, RefreshCw, Search, ChevronDown } from "lucide-svelte";
  import { admin } from "../../../lib/admin.svelte.js";
  import { lyrics } from "../../../lib/lyrics.svelte.js";
  import { musicCatalog } from "../../../lib/musicCatalog.svelte.js";
  import { openDogsPage } from "../../../lib/openDogsPage.js";
  import { listCloudProjects } from "../captions/captionsCloud.js";
  import { lyricSongs, askCaptionsFor } from "../captions/captionsSongs.js";
  import { sourcesFor, lyricsFrom } from "./adminLyrics.js";

  const CAPTIONS_APP = "captions";
  const DATE_FORMAT = { day: "numeric", month: "short", year: "numeric" };
  const NO_SOURCE = "No captions for this song yet: open it in Captions and time it, or save a project to the cloud.";
  const BUTTON = "adm-btn px-3 py-2 text-xs md:text-sm 2xl:px-5 2xl:py-3 2xl:text-lg";

  let shelf = $state([]);
  let openId = $state("");
  /** Track id → the chosen source's id. */
  let choice = $state({});
  let busyId = $state("");
  /** Track id → { text, failed }: what came of the last action on that song. */
  let notes = $state({});
  let query = $state("");
  let loading = $state(false);

  let songs = $derived(lyricSongs());
  let words = $derived(query.trim().toLowerCase().split(/\s+/).filter(Boolean));
  let shown = $derived(
    words.length
      ? songs.filter((song) => words.every((word) => `${song.title} ${song.artist}`.toLowerCase().includes(word)))
      : songs,
  );
  let liveCount = $derived(songs.filter((song) => lyrics.published[song.id]).length);

  async function refresh() {
    loading = true;
    lyrics.refreshList(true);
    musicCatalog.refresh();
    const answer = await listCloudProjects(admin.token);
    if (answer.ok) shelf = answer.projects;
    loading = false;
  }

  // Asks once the owner is signed in (and again if they sign in later)
  $effect(() => {
    if (admin.unlocked) untrack(refresh);
  });

  /** @param {string} trackId @param {string} text @param {boolean} [failed] */
  function say(trackId, text, failed = false) {
    notes = { ...notes, [trackId]: { text, failed } };
  }

  const liveSince = (trackId) => new Date(lyrics.published[trackId]).toLocaleDateString([], DATE_FORMAT);

  async function publish(song, sources) {
    const source = sources.find((one) => one.id === (choice[song.id] || sources[0].id));
    if (!source) return;
    busyId = song.id;
    const made = await lyricsFrom(source, song.id, admin.token);
    if (!made.lyrics) {
      busyId = "";
      return say(song.id, made.error, true);
    }
    const answer = await lyrics.publish(song.id, made.lyrics, admin.token);
    busyId = "";
    say(song.id, answer.ok ? "Live: everyone's player shows these lyrics now." : answer.error, !answer.ok);
  }

  async function takeDown(song) {
    if (!window.confirm(`Take down the lyrics for "${song.title}"? Nobody's player will show them until you publish again.`)) return;
    busyId = song.id;
    const answer = await lyrics.unpublish(song.id, admin.token);
    busyId = "";
    say(song.id, answer.ok ? "Taken down." : answer.error, !answer.ok);
  }

  function editInCaptions(song) {
    askCaptionsFor(song.id);
    openDogsPage({ app: CAPTIONS_APP, force: true });
  }
</script>

<div class="adm-app flex h-full min-h-0 w-full flex-col gap-3 p-3 sm:gap-2 sm:p-2 md:gap-4 md:p-5 xl:mx-auto xl:max-w-7xl 2xl:max-w-none 2xl:gap-6 2xl:p-8">
  {#if !admin.unlocked}
    <div class="flex flex-1 flex-col items-center justify-center gap-3 text-center 2xl:gap-6">
      <ShieldCheck class="adm-lock h-10 w-10 2xl:h-16 2xl:w-16" aria-hidden="true" />
      <p class="adm-muted max-w-md text-sm md:text-base 2xl:max-w-2xl 2xl:text-2xl">Owner only. Sign in from Settings to use Admin.</p>
    </div>
  {:else}
    <header class="flex flex-col gap-2 sm:flex-row sm:items-center md:flex-row md:gap-4 2xl:gap-6">
      <div class="min-w-0 flex-1">
        <h2 class="adm-title text-base font-black uppercase tracking-wide md:text-lg xl:text-xl 2xl:text-3xl">Lyrics in the player</h2>
        <p class="adm-muted text-xs md:text-sm 2xl:text-lg">{liveCount} of {songs.length} songs have lyrics everyone sees.</p>
      </div>
      <div class="flex flex-row items-center gap-2 sm:flex-row md:gap-3 2xl:gap-4">
      <label class="adm-search flex min-w-0 flex-1 flex-row items-center gap-2 px-3 py-2 sm:w-56 sm:flex-none md:w-72 2xl:w-[28rem] 2xl:px-5 2xl:py-3">
        <Search size={14} class="shrink-0" aria-hidden="true" />
        <input bind:value={query} type="search" placeholder="Find a song" aria-label="Find a song" autocomplete="off" class="min-w-0 flex-1 bg-transparent text-sm outline-none 2xl:text-xl" />
      </label>
      <button type="button" class="{BUTTON} shrink-0" disabled={loading} aria-label="Refresh" title="Ask again which songs are live and what is in the cloud" onclick={refresh}>
        <RefreshCw size={14} class={loading ? "adm-spin" : ""} /> <span class="hidden md:inline">Refresh</span>
      </button>
      </div>
    </header>

    <ul class="adm-songs grid min-h-0 flex-1 grid-flow-row-dense grid-cols-1 content-start gap-2 overflow-y-auto sm:grid-cols-2 md:grid-cols-2 md:gap-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 2xl:gap-4">
      {#each shown as song (song.id)}
        {@const live = !!lyrics.published[song.id]}
        {@const isOpen = openId === song.id}
        <li class="adm-song flex flex-col {isOpen ? 'col-span-full' : ''}" class:is-open={isOpen}>
          <button
            type="button"
            class="adm-song-head flex w-full flex-row items-center gap-3 px-3 py-2 text-left 2xl:px-5 2xl:py-4"
            aria-expanded={isOpen}
            onclick={() => (openId = isOpen ? "" : song.id)}
          >
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-bold md:text-base 2xl:text-xl">{song.title}</span>
              <span class="adm-muted block truncate text-xs 2xl:text-base">{song.artist}</span>
            </span>
            <span class="adm-chip shrink-0 px-2 py-0.5 text-[0.625rem] md:text-xs 2xl:text-base" class:is-live={live}>
              {live ? `Live · ${liveSince(song.id)}` : "No lyrics"}
            </span>
            <ChevronDown size={16} class="adm-caret shrink-0" aria-hidden="true" />
          </button>

          {#if isOpen}
            {@const sources = sourcesFor(song.id, shelf)}
            <div class="adm-song-body flex flex-col gap-2 px-3 pb-3 md:gap-3 2xl:gap-4 2xl:px-5 2xl:pb-5">
              {#if sources.length}
                <label class="adm-muted flex flex-col gap-1 text-xs md:text-sm 2xl:text-lg">
                  Captions to use as this song's lyrics
                  <select
                    class="adm-select px-2 py-2 text-sm 2xl:px-4 2xl:py-3 2xl:text-xl"
                    value={choice[song.id] || sources[0].id}
                    onchange={(event) => (choice = { ...choice, [song.id]: event.currentTarget.value })}
                  >
                    {#each sources as source (source.id)}
                      <option value={source.id}>{source.label}</option>
                    {/each}
                  </select>
                </label>
              {:else}
                <p class="adm-muted text-xs md:text-sm 2xl:text-lg">{NO_SOURCE}</p>
              {/if}
              <div class="grid grid-cols-1 gap-2 sm:grid-cols-3 md:grid-cols-3 md:gap-3 lg:grid-cols-3 xl:grid-cols-3 2xl:gap-4">
                <button type="button" class="{BUTTON} adm-btn-main" disabled={!sources.length || busyId === song.id} onclick={() => publish(song, sources)}>
                  <CloudUpload size={16} /> {live ? "Publish over the live lyrics" : "Publish for everyone"}
                </button>
                <button type="button" class={BUTTON} onclick={() => editInCaptions(song)}>
                  <PenLine size={16} /> Edit in Captions
                </button>
                <button type="button" class={BUTTON} disabled={!live || busyId === song.id} onclick={() => takeDown(song)}>
                  <CloudOff size={16} /> Take down
                </button>
              </div>
              {#if notes[song.id]}
                <p class="text-xs md:text-sm 2xl:text-lg" class:adm-error={notes[song.id].failed} class:adm-ok={!notes[song.id].failed} role="status">
                  {notes[song.id].text}
                </p>
              {/if}
            </div>
          {/if}
        </li>
      {/each}
      {#if !shown.length}
        <li class="adm-muted col-span-full px-3 py-4 text-sm 2xl:text-xl">{songs.length ? "No song matches that." : "No songs yet."}</li>
      {/if}
    </ul>
  {/if}
</div>

<style lang="scss">
  @use "../../../styles/variables" as *;

  .adm-app {
    color: $color-blog-ink-strong;
  }

  .adm-muted {
    color: $color-blog-ink;
  }

  .adm-lock,
  .adm-title {
    color: $color-neon-red;
  }

  .adm-ok {
    color: $color-neon-green;
  }

  .adm-error {
    color: $color-alert-red;
  }

  .adm-search,
  .adm-select {
    border-radius: 8px;
    border: 1px solid $color-blog-line;
    background: $bg-input-dark;
    color: $color-blog-ink-strong;
  }

  .adm-select option {
    background: $bg-app-dark;
  }

  .adm-song {
    border-radius: 12px;
    border: 1px solid $color-blog-line;
    background: $bg-input-dark;

    &.is-open {
      border-color: $color-neon-red;
    }
  }

  .adm-song-head {
    border-radius: 12px;
    cursor: pointer;

    &:hover,
    &:focus-visible {
      background: $bg-blog-hover;
    }
  }

  .is-open :global(.adm-caret) {
    transform: rotate(180deg);
  }

  .adm-chip {
    border-radius: 9999px;
    border: 1px solid $color-blog-line;
    color: $color-blog-ink;
    white-space: nowrap;

    &.is-live {
      border-color: $color-neon-green;
      color: $color-neon-green;
    }
  }

  .adm-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border-radius: 8px;
    border: 1px solid $color-blog-line;
    background: $bg-input-dark;
    color: $color-blog-ink-strong;
    font-weight: 600;
    cursor: pointer;
    transition: border-color $transition-speed-fast ease, background $transition-speed-fast ease;

    :global(svg) {
      flex-shrink: 0;
    }

    &:hover:not(:disabled),
    &:focus-visible {
      border-color: $color-blog-ink;
    }

    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }

  .adm-btn-main {
    border-color: $color-neon-red;
    color: $color-neon-red;
  }

  :global(.adm-spin) {
    animation: adm-spin 0.9s linear infinite;
  }

  @keyframes adm-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.adm-spin) {
      animation: none;
    }
  }
</style>
