<script>
  /**
   * Transcribe: let a speech-to-text model find the words and their times.
   *
   * Online (the default) sends the sound to Cloudflare's Whisper model through
   * the API Worker, after a plain warning the first time. Known words can be
   * pasted: they go along as hints, and they are kept exactly as written, with
   * only the times taken from what the model heard (captionsAlign.js).
   */
  import { CloudUpload, Square } from "lucide-svelte";
  import { linesFromWords } from "../../../lib/lyricsFormat.js";
  import { admin } from "../../../lib/admin.svelte.js";
  import { linesFromLyrics } from "./captionsEdit.js";
  import { timeWrittenWords } from "./captionsAlign.js";
  import { OnlineTranscriber, PHASE_READING } from "./captionsOnline.svelte.js";

  const AGREED_KEY = "captions_online_ok_v1";
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

  /** @type {{ media: import("./captionsMedia.svelte.js").CaptionsMedia, project: import("./captionsProject.svelte.js").CaptionsProject }} */
  let { media, project } = $props();

  const online = new OnlineTranscriber();

  let agreed = $state(readAgreed());
  // The words already here (pasted for tap along, say) are the words to keep
  let known = $state(project.lines.map((line) => line.words.map((word) => word.x).join(" ")).join("\n"));
  let language = $state("");
  let note = $state("");

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
  if (agreed) online.refreshAllowance(admin.token);

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
    const words = await online.run(media.blob, project.name, { lyrics: known, language, token: admin.token });
    if (words) useWords(words);
  }
</script>

<div class="cap-transcribe flex h-full min-h-0 flex-col gap-3 md:gap-4 2xl:gap-6">
  {#if !agreed}
    <h3 class="cap-heading text-xs md:text-sm 2xl:text-lg">Before the sound leaves this device</h3>
    <p class="cap-muted text-xs md:text-sm 2xl:text-lg">
      Online transcription sends this file's sound through our server to Cloudflare's Whisper speech model. The sound
      is not stored: the words come back and that is all. A tally of the seconds you used today is kept under a
      salted hash of your network address and deleted the next day. You get up to 20 free minutes a day, while the
      day's shared minutes last.
      <a class="cap-link" href={PRIVACY_URL} target="_blank" rel="noopener">Privacy</a>
    </p>
    <p class="cap-muted text-xs md:text-sm 2xl:text-lg">Nothing is sent until you press Transcribe. Tap along sends nothing at all.</p>
    <button type="button" class="cap-btn cap-btn-main self-start px-4 py-3 text-sm md:text-base 2xl:px-6 2xl:py-4 2xl:text-xl" onclick={agree}>
      I understand
    </button>
  {:else}
    <label class="cap-muted flex min-h-0 flex-1 flex-col gap-2 text-xs md:text-sm 2xl:text-lg">
      Know the words? Paste them. They are kept as written and only the times are taken from what is heard.
      <textarea
        class="cap-input min-h-16 flex-1 resize-none p-2 text-sm md:p-3 md:text-base 2xl:p-5 2xl:text-xl"
        bind:value={known}
        disabled={online.running}
        placeholder="The lyrics, a line per row. Or leave this empty."
      ></textarea>
    </label>

    <div class="grid grid-cols-2 items-center gap-2 sm:grid-cols-2 md:gap-3 lg:grid-cols-2 xl:grid-cols-2 2xl:gap-4">
      <select class="cap-input px-2 py-2 text-xs md:text-sm 2xl:px-4 2xl:py-3 2xl:text-lg" aria-label="The language spoken" bind:value={language} disabled={online.running}>
        {#each LANGUAGES as option (option.code)}
          <option value={option.code}>{option.name}</option>
        {/each}
      </select>
      {#if online.running}
        <button type="button" class="cap-btn px-3 py-2 text-xs md:text-sm 2xl:px-5 2xl:py-3 2xl:text-lg" onclick={() => online.stop()}>
          <Square size={16} /> Stop
        </button>
      {:else}
        <button type="button" class="cap-btn cap-btn-main px-3 py-2 text-xs md:text-sm 2xl:px-5 2xl:py-3 2xl:text-lg" disabled={minutesLeft === 0} onclick={transcribe}>
          <CloudUpload size={16} /> Transcribe
        </button>
      {/if}
    </div>

    <p class="text-xs md:text-sm 2xl:text-lg" class:cap-error={!!online.error} class:cap-muted={!online.error} role="status">
      {#if online.error}
        {online.error}
      {:else if online.running}
        {online.phase === PHASE_READING ? "Reading the sound on this device…" : `Piece ${Math.min(online.done + 1, online.total)} of ${online.total} is with the model…`}
      {:else if note}
        {note}
      {:else if minutesLeft !== null}
        {minutesLeft} free minutes left today. The sound goes to Cloudflare's Whisper; nothing is stored.
      {:else}
        The sound goes to Cloudflare's Whisper; nothing is stored.
      {/if}
    </p>
  {/if}
</div>
