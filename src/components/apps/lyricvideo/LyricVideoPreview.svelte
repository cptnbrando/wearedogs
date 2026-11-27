<script>
  /**
   * The video as it will come out (visualizer, lyric line, shape), live, with
   * play, seek and full screen. Full screen doubles as a plain player: open
   * any MP3, press play, and watch it there with nothing recorded.
   */
  import { onMount, onDestroy } from "svelte";
  import { Play, Pause, Maximize, Minimize } from "lucide-svelte";
  import { session } from "./lyricVideoSession.svelte.js";
  import { clock } from "../captions/captionsEdit.js";

  const SEEK_STEP_S = 0.01;

  let frame = $state(null);
  let holder = $state(null);
  let full = $state(false);

  function togglePlay() {
    if (session.recording) return;
    if (session.stage) session.stage.wake();
    session.media.toggle();
  }

  function toggleFull() {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else if (frame && frame.requestFullscreen) frame.requestFullscreen().catch(() => {});
  }

  const onFullChange = () => (full = document.fullscreenElement === frame);

  onMount(() => {
    holder.appendChild(session.canvas());
    document.addEventListener("fullscreenchange", onFullChange);
  });

  onDestroy(() => {
    const canvas = session.canvas();
    if (canvas.parentNode === holder) holder.removeChild(canvas);
    document.removeEventListener("fullscreenchange", onFullChange);
  });
</script>

<div bind:this={frame} class="lv-frame flex min-h-0 flex-1 items-center justify-center" class:is-full={full}>
  <!-- The canvas is the recorder's: it is moved in here, never re-created -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    bind:this={holder}
    class="lv-canvas"
    class:is-recording={session.recording}
    ondblclick={toggleFull}
  ></div>
  {#if full}
    <div class="lv-full-bar flex items-center gap-2 p-3 2xl:gap-4 2xl:p-6">
      <button type="button" class="lv-btn p-3 2xl:p-5" aria-label={session.media.playing ? "Pause" : "Play"} disabled={session.recording} onclick={togglePlay}>
        {#if session.media.playing}<Pause size={22} />{:else}<Play size={22} />{/if}
      </button>
      <button type="button" class="lv-btn p-3 2xl:p-5" aria-label="Leave full screen" onclick={toggleFull}><Minimize size={22} /></button>
    </div>
  {/if}
</div>

<div class="lv-transport flex items-center gap-2 md:gap-3 2xl:gap-5">
  <button type="button" class="lv-btn lv-btn-main shrink-0 p-2 md:p-3 2xl:p-5" aria-label={session.media.playing ? "Pause" : "Play"} disabled={session.recording} onclick={togglePlay}>
    {#if session.media.playing}<Pause size={20} />{:else}<Play size={20} />{/if}
  </button>
  <span class="lv-clock shrink-0 text-xs md:text-sm 2xl:text-xl">{clock(session.media.time, false)}</span>
  <input
    class="lv-seek min-w-0 flex-1"
    type="range"
    min="0"
    max={session.media.duration || 0}
    step={SEEK_STEP_S}
    value={session.media.time}
    aria-label="Where in the song"
    disabled={session.recording}
    oninput={(event) => session.media.seek(Number(event.currentTarget.value))}
  />
  <span class="lv-clock shrink-0 text-xs md:text-sm 2xl:text-xl">{clock(session.media.duration, false)}</span>
  <button type="button" class="lv-btn shrink-0 p-2 md:p-3 2xl:p-5" aria-label="Full screen" title="Full screen (or double-click the picture)" onclick={toggleFull}>
    <Maximize size={20} />
  </button>
</div>
