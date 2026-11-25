<script>
  /**
   * Transcribe: let a speech-to-text model find the words and their times.
   *
   * Online (the default) sends the sound to Cloudflare's Whisper model through
   * the API Worker, after a plain warning the first time. In this browser
   * sends nothing: a small model runs on the device, slower and rougher.
   *
   * Either way, known words can be pasted: they are kept exactly as written,
   * with only the times taken from what the model heard (captionsAlign.js),
   * and online they go along as hints too.
   */
  import { untrack } from "svelte";
  import { CloudUpload, Cpu, Square } from "lucide-svelte";
  import { linesFromWords } from "../../../lib/lyricsFormat.js";
  import { admin } from "../../../lib/admin.svelte.js";
  import { linesFromLyrics } from "./captionsEdit.js";
  import { timeWrittenWords } from "./captionsAlign.js";
  import { OnlineTranscriber, PHASE_READING } from "./captionsOnline.svelte.js";
  import { LocalTranscriber } from "./captionsLocal.svelte.js";

  const AGREED_KEY = "captions_online_ok_v1";
  const MODE_ONLINE = "online";
  const MODE_LOCAL = "local";
  const MODES = [
    { id: MODE_ONLINE, label: "Online", icon: CloudUpload },
    { id: MODE_LOCAL, label: "In this browser", icon: Cpu },
  ];
  const SECONDS_PER_MINUTE = 60;
  const PRIVACY_URL = "/privacy.html#captions";
  /** Whisper tells the language by itself; naming it helps on short or noisy clips. */
  const LANGUAGES = [
    { code: "", name: "Any language" },
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "pt", name: "Portuguese" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
  ];
  const NOTHING_HEARD = "No words were heard in that sound.";
  const ACTION_BUTTON = "px-3 py-2 text-xs md:text-sm 2xl:px-5 2xl:py-3 2xl:text-lg";

  /** @type {{ media: import("./captionsMedia.svelte.js").CaptionsMedia, project: import("./captionsProject.svelte.js").CaptionsProject }} */
  let { media, project } = $props();

  const online = new OnlineTranscriber();
  const local = new LocalTranscriber();

  const agreedBefore = readAgreed();
  let agreed = $state(agreedBefore);
  let mode = $state(MODE_ONLINE);
  // The words already here when the panel opens (pasted for tap along, say) are the words to keep
  let known = $state(untrack(() => project.lines.map((line) => line.words.map((word) => word.x).join(" ")).join("\n")));
  let language = $state("");
  let note = $state("");

  let isOnline = $derived(mode === MODE_ONLINE);
  let running = $derived(online.running || local.running);
  let failure = $derived(isOnline ? online.error : local.error);
  let minutesLeft = $derived(online.left ? Math.floor(online.left.mine / SECONDS_PER_MINUTE) : null);

  function readAgreed() {
    try {
      return localStorage.getItem(AGREED_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function agree() {
    agreed = true;
    try {
      localStorage.setItem(AGREED_KEY, "1");
    } catch (e) {
      // Storage is blocked: the warning shows again next time
    }
    online.refreshAllowance(admin.token);
  }

  // Asking what is left today sends nothing about the file; it waits for the warning to be accepted
  if (agreedBefore) online.refreshAllowance(admin.token);

  /** Puts heard words into the editor: as the pasted words with heard times, or as heard. */
  function useWords(words) {
    if (!words.length) return (note = NOTHING_HEARD);
    const written = known.split(/\r?\n/).map((row) => row.trim().split(/\s+/).filter(Boolean)).filter((row) => row.length);
    const timed = written.length ? timeWrittenWords(written, words) : null;
    if (timed) {
      project.replaceLines(timed.lines);
      note = `Your words are kept. ${timed.matched} of ${timed.total} were heard and timed; the rest sit between their neighbours. Check them in Lines.`;
      return;
    }
    project.replaceLines(linesFromLyrics(linesFromWords(words)));
    note = `${words.length} words heard. Check them in Lines: Undo brings back what was here.`;
  }

  async function transcribe() {
    note = "";
    const words = isOnline
      ? await online.run(media.blob, project.name, { lyrics: known, language, token: admin.token })
      : await local.run(media.blob, project.name);
    if (words) useWords(words);
  }

  function stop() {
    if (isOnline) online.stop();
    else local.stop();
  }
</script>

<div class="cap-transcribe flex h-full min-h-0 flex-col gap-3 md:gap-4 2xl:gap-6">
  <div class="grid grid-cols-2 gap-2 sm:grid-cols-2 md:gap-3 lg:grid-cols-2 xl:grid-cols-2 2xl:gap-4" role="group" aria-label="Where the transcribing happens">
    {#each MODES as option (option.id)}
      {@const Icon = option.icon}
      <button type="button" class="cap-btn {ACTION_BUTTON}" class:is-on={mode === option.id} aria-pressed={mode === option.id} disabled={running} onclick={() => (mode = option.id)}>
        <Icon size={16} /> {option.label}
      </button>
    {/each}
  </div>

  {#if isOnline && !agreed}
    <h3 class="cap-heading text-xs md:text-sm 2xl:text-lg">Before the sound leaves this device</h3>
    <p class="cap-muted text-xs md:text-sm 2xl:text-lg">
      Online transcription sends this file's sound through our server to Cloudflare's Whisper speech model. The sound
      is not stored: the words come back and that is all. A tally of the seconds you used today is kept under a
      salted hash of your network address and deleted the next day. You get up to 20 free minutes a day, while the
      day's shared minutes last.
      <a class="cap-link" href={PRIVACY_URL} target="_blank" rel="noopener">Privacy</a>
    </p>
    <p class="cap-muted text-xs md:text-sm 2xl:text-lg">Nothing is sent until you press Transcribe. Tap along and In this browser send nothing at all.</p>
    <button type="button" class="cap-btn cap-btn-main self-start px-4 py-3 text-sm md:text-base 2xl:px-6 2xl:py-4 2xl:text-xl" onclick={agree}>
      I understand
    </button>
  {:else}
    {#if !isOnline}
      <p class="cap-muted text-xs md:text-sm 2xl:text-lg">
        Nothing is uploaded. A small English-only model (about 40 MB, downloaded once from Hugging Face) runs on this
        device. Honestly: it is slower, it mishears more, and it times phrases, not words. Good for a first pass.
      </p>
    {/if}
    <label class="cap-muted flex min-h-0 flex-1 flex-col gap-2 text-xs md:text-sm 2xl:text-lg">
      Know the words? Paste them. They are kept as written and only the times are taken from what is heard.
      <textarea
        class="cap-input min-h-16 flex-1 resize-none p-2 text-sm md:p-3 md:text-base 2xl:p-5 2xl:text-xl"
        bind:value={known}
        disabled={running}
        placeholder="The lyrics, a line per row. Or leave this empty."
      ></textarea>
    </label>

    <div class="grid grid-cols-2 items-center gap-2 sm:grid-cols-2 md:gap-3 lg:grid-cols-2 xl:grid-cols-2 2xl:gap-4">
      {#if isOnline}
        <select class="cap-input px-2 py-2 text-xs md:text-sm 2xl:px-4 2xl:py-3 2xl:text-lg" aria-label="The language spoken" bind:value={language} disabled={running}>
          {#each LANGUAGES as option (option.code)}
            <option value={option.code}>{option.name}</option>
          {/each}
        </select>
      {:else}
        <span class="cap-muted text-xs md:text-sm 2xl:text-lg">English only</span>
      {/if}
      {#if running}
        <button type="button" class="cap-btn {ACTION_BUTTON}" onclick={stop}>
          <Square size={16} /> Stop
        </button>
      {:else}
        <button type="button" class="cap-btn cap-btn-main {ACTION_BUTTON}" disabled={isOnline && minutesLeft === 0} onclick={transcribe}>
          {#if isOnline}<CloudUpload size={16} />{:else}<Cpu size={16} />{/if} Transcribe
        </button>
      {/if}
    </div>

    <p class="text-xs md:text-sm 2xl:text-lg" class:cap-error={!!failure} class:cap-muted={!failure} role="status">
      {#if failure}
        {failure}
      {:else if online.running}
        {online.phase === PHASE_READING ? "Reading the sound on this device…" : `Piece ${Math.min(online.done + 1, online.total)} of ${online.total} is with the model…`}
      {:else if local.running}
        {local.status}
      {:else if note}
        {note}
      {:else if !isOnline}
        Everything stays on this device.
      {:else if minutesLeft !== null}
        {minutesLeft} free minutes left today. The sound goes to Cloudflare's Whisper; nothing is stored.
      {:else}
        The sound goes to Cloudflare's Whisper; nothing is stored.
      {/if}
    </p>
  {/if}
</div>
