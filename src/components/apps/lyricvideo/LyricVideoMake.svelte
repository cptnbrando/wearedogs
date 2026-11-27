<script>
  /**
   * Making the video: its shape and sharpness, the part of the song it takes,
   * the take itself (it plays the song through once, recording), and the
   * finished video to watch, save or share.
   */
  import { Circle, Square, Download, Share2, Volume2, VolumeX, MapPin } from "lucide-svelte";
  import { session, SHAPES, QUALITIES } from "./lyricVideoSession.svelte.js";
  import { clock } from "../captions/captionsEdit.js";

  const BUTTON = "lv-btn gap-2 px-3 py-2 text-sm 2xl:px-5 2xl:py-4 2xl:text-xl";
  const CHIP = "lv-chip px-3 py-1.5 text-xs md:text-sm 2xl:px-5 2xl:py-3 2xl:text-xl";
  const LABEL = "lv-heading text-xs 2xl:text-lg";
  const BYTES_PER_MB = 1024 * 1024;
  const PERCENT = 100;
  /** "1:23", "1:23.5" or "83": minutes and seconds, or seconds alone. */
  const TIME_PATTERN = /^\s*(?:(\d+):)?(\d+(?:\.\d+)?)\s*$/;
  const SECONDS_PER_MINUTE = 60;

  let size = $derived(session.size);
  let canShare = $derived(
    !!session.result && typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [new File([session.result.blob], session.result.name, { type: session.result.blob.type })] }),
  );

  /** @param {string} text @returns {number | null} seconds, or null when it is not a time */
  function parseTime(text) {
    const match = TIME_PATTERN.exec(text);
    if (!match) return null;
    return Number(match[1] || 0) * SECONDS_PER_MINUTE + Number(match[2]);
  }

  function setFrom(text) {
    const seconds = parseTime(text);
    if (seconds !== null) session.setRange(Math.min(seconds, session.media.duration), session.to);
  }

  function setTo(text) {
    const seconds = text.trim() ? parseTime(text) : 0;
    if (seconds !== null) session.setRange(session.from, Math.min(seconds, session.media.duration));
  }

  function save() {
    const link = document.createElement("a");
    link.href = session.result.url;
    link.download = session.result.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function share() {
    const file = new File([session.result.blob], session.result.name, { type: session.result.blob.type });
    navigator.share({ files: [file], title: session.result.name }).catch(() => {});
  }
</script>

<div class="flex flex-col gap-5 2xl:gap-10">
  <div class="flex flex-col gap-2 2xl:gap-4">
    <span class={LABEL}>Shape</span>
    <div class="flex flex-wrap gap-2 2xl:gap-4">
      {#each SHAPES as shape (shape.id)}
        <button type="button" class={CHIP} class:is-on={session.settings.shape === shape.id} disabled={session.recording} onclick={() => session.setSettings({ shape: shape.id })}>
          {shape.name} {shape.ratio}
        </button>
      {/each}
    </div>
  </div>

  <div class="flex flex-col gap-2 2xl:gap-4">
    <span class={LABEL}>Sharpness</span>
    <div class="flex flex-wrap items-center gap-2 2xl:gap-4">
      {#each QUALITIES as quality (quality.id)}
        <button type="button" class={CHIP} class:is-on={session.settings.quality === quality.id} disabled={session.recording} onclick={() => session.setSettings({ quality: quality.id })}>{quality.name}</button>
      {/each}
      <span class="lv-muted text-xs 2xl:text-lg">{size.width} × {size.height}</span>
    </div>
  </div>

  <div class="flex flex-col gap-2 2xl:gap-4">
    <span class={LABEL}>Part of the song</span>
    <div class="grid grid-cols-2 gap-2 2xl:gap-4">
      <label class="flex flex-col gap-1">
        <span class="lv-muted text-xs 2xl:text-lg">From</span>
        <div class="flex gap-1">
          <input class="lv-input min-w-0 flex-1 px-3 py-2 text-sm 2xl:px-5 2xl:py-4 2xl:text-xl" value={clock(session.from, false)} disabled={session.recording} onchange={(event) => setFrom(event.currentTarget.value)} />
          <button type="button" class="lv-btn px-2 2xl:px-4" title="From where the song is now" aria-label="From where the song is now" disabled={session.recording} onclick={() => session.setRange(session.media.time, session.to)}><MapPin size={16} /></button>
        </div>
      </label>
      <label class="flex flex-col gap-1">
        <span class="lv-muted text-xs 2xl:text-lg">To</span>
        <div class="flex gap-1">
          <input class="lv-input min-w-0 flex-1 px-3 py-2 text-sm 2xl:px-5 2xl:py-4 2xl:text-xl" value={session.to ? clock(session.to, false) : ""} placeholder="the end" disabled={session.recording} onchange={(event) => setTo(event.currentTarget.value)} />
          <button type="button" class="lv-btn px-2 2xl:px-4" title="To where the song is now" aria-label="To where the song is now" disabled={session.recording} onclick={() => session.setRange(session.from, session.media.time)}><MapPin size={16} /></button>
        </div>
      </label>
    </div>
    <p class="lv-muted text-xs 2xl:text-lg">{clock(session.end - session.from, false)} of video.</p>
  </div>

  <button type="button" class="{CHIP} self-start" class:is-on={session.settings.hear} aria-pressed={session.settings.hear} onclick={() => session.setSettings({ hear: !session.settings.hear })}>
    {#if session.settings.hear}<Volume2 size={16} class="inline" /> Hear it while it records{:else}<VolumeX size={16} class="inline" /> Silent while it records{/if}
  </button>

  {#if session.recording}
    <div class="flex flex-col gap-2 2xl:gap-4">
      <div class="lv-progress h-2 2xl:h-4" role="progressbar" aria-valuemin="0" aria-valuemax={PERCENT} aria-valuenow={Math.round(session.progress * PERCENT)}>
        <div class="lv-progress-bar h-full" style="width: {session.progress * PERCENT}%"></div>
      </div>
      <button type="button" class="{BUTTON} lv-btn-rec self-start" onclick={() => session.stopTake()}><Square size={18} /> Stop and keep</button>
      <p class="lv-muted text-xs 2xl:text-lg">It records as the song plays. Keep this tab in front: a hidden tab stops drawing.</p>
    </div>
  {:else}
    <button type="button" class="{BUTTON} lv-btn-rec self-start" disabled={!session.presetOn} onclick={() => session.startTake()}><Circle size={18} /> Make the video</button>
  {/if}
  {#if session.error}<p class="lv-error text-sm 2xl:text-xl" role="alert">{session.error}</p>{/if}

  {#if session.result}
    <div class="flex flex-col gap-2 2xl:gap-4">
      <span class={LABEL}>Your video</span>
      <!-- svelte-ignore a11y_media_has_caption -->
      <video class="lv-result max-h-64 w-full md:max-h-80 2xl:max-h-[40vh]" src={session.result.url} controls playsinline></video>
      <p class="lv-muted truncate text-xs 2xl:text-lg">{session.result.name} · {(session.result.size / BYTES_PER_MB).toFixed(1)} MB</p>
      <div class="flex flex-wrap gap-2 2xl:gap-4">
        <button type="button" class="{BUTTON} lv-btn-main" onclick={save}><Download size={18} /> Save</button>
        {#if canShare}<button type="button" class={BUTTON} onclick={share}><Share2 size={18} /> Share</button>{/if}
      </div>
    </div>
  {/if}
</div>
