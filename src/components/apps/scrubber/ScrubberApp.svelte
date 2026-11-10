<script>
  import { onDestroy } from "svelte";
  import { Plane, Upload, Download, RotateCcw, ShieldCheck, AlertCircle, Zap } from "lucide-svelte";
  import {
    ScrubberEngine,
    isSupported,
    notableTones,
    BAND_LOW_HZ,
    BAND_HIGH_HZ,
    MAX_MINUTES,
    KIND_FALLING,
    KIND_STEADY,
  } from "./scrubberEngine.js";

  const STAGE_IDLE = "idle";
  const STAGE_READING = "reading";
  const STAGE_CHECKING = "checking";
  const STAGE_READY = "ready";
  const STAGE_SCRUBBING = "scrubbing";
  const STAGE_DONE = "done";
  const BUSY_LABELS = {
    [STAGE_READING]: "Reading the audio…",
    [STAGE_CHECKING]: "Looking for long tones…",
    [STAGE_SCRUBBING]: "Scrubbing…",
  };
  const KIND_LABELS = {
    [KIND_FALLING]: "falling",
    [KIND_STEADY]: "steady",
    rising: "rising",
  };
  const FILE_TYPES = "audio/*,video/*";
  const OUTPUT_SUFFIX = "-scrubbed.wav";
  const TONES_LISTED = 8;
  // Narrow layouts list only the first few, so the panel fits without scrolling
  const TONES_LISTED_NARROW = 3;
  const CHANNEL_NAMES = { 1: "mono", 2: "stereo" };
  const SUPPORTED = isSupported();

  // Chart: time across, pitch up on a log scale so the low tones get room
  const CHART_W = 1000;
  const CHART_H = 400;
  const GRID_HZ = [50, 100, 200, 500, 1000];
  const LOG_SPAN = Math.log(BAND_HIGH_HZ / BAND_LOW_HZ);
  const SECONDS_PER_MINUTE = 60;
  const PERCENT = 100;

  const engine = new ScrubberEngine();
  let stage = STAGE_IDLE;
  let error = "";
  let fileEl = null;
  let fileName = "";
  let audio = null;
  let found = null;
  let cleaned = null;
  let tones = [];
  let progress = 0;
  let keepHum = false;
  let isDragging = false;
  let downloadUrl = "";

  $: isBusy = stage in BUSY_LABELS;
  $: fallingCount = tones.filter((tone) => tone.kind === KIND_FALLING).length;

  /** @param {number} hz */
  const pitchY = (hz) => CHART_H * (1 - Math.log(Math.min(BAND_HIGH_HZ, Math.max(BAND_LOW_HZ, hz)) / BAND_LOW_HZ) / LOG_SPAN);
  /** @param {number} t seconds */
  const timeX = (t) => (audio ? (CHART_W * t) / audio.seconds : 0);
  /** @param {number} t seconds */
  const clock = (t) => `${Math.floor(t / SECONDS_PER_MINUTE)}:${String(Math.floor(t % SECONDS_PER_MINUTE)).padStart(2, "0")}`;

  function reset() {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    stage = STAGE_IDLE;
    error = "";
    fileName = "";
    audio = null;
    found = null;
    cleaned = null;
    tones = [];
    progress = 0;
    downloadUrl = "";
    if (fileEl) fileEl.value = "";
  }

  /** @param {unknown} err */
  function fail(err) {
    reset();
    error = (err && err.message) || "Something went wrong reading that file.";
  }

  /** @param {File | undefined} file */
  async function load(file) {
    if (!file || isBusy) return;
    reset();
    fileName = file.name;
    stage = STAGE_READING;
    try {
      audio = await engine.decode(file);
      stage = STAGE_CHECKING;
      found = await engine.inspect(audio);
      tones = notableTones(found.report);
      stage = STAGE_READY;
    } catch (err) {
      fail(err);
    }
  }

  async function scrub() {
    if (stage !== STAGE_READY) return;
    stage = STAGE_SCRUBBING;
    progress = 0;
    try {
      cleaned = await engine.scrub(audio, keepHum, (fraction) => (progress = fraction));
      downloadUrl = URL.createObjectURL(engine.toWav(cleaned.channels, audio.sampleRate, cleaned.report.peak));
      stage = STAGE_DONE;
    } catch (err) {
      fail(err);
    }
  }

  /** @param {DragEvent} e */
  function handleDrop(e) {
    e.preventDefault();
    isDragging = false;
    load(e.dataTransfer && e.dataTransfer.files[0]);
  }

  /** @param {DragEvent} e */
  function handleDragOver(e) {
    e.preventDefault();
    isDragging = true;
  }

  onDestroy(() => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    engine.dispose();
  });
</script>

<!-- Sized by @container queries: the Toolbox shell caps its own width, so
     viewport breakpoints would misjudge how much room there really is -->
<div class="scrubber @container relative flex h-full w-full flex-col overflow-hidden">
  <input
    bind:this={fileEl}
    class="hidden"
    type="file"
    accept={FILE_TYPES}
    onchange={(e) => load(e.currentTarget.files[0])}
    aria-label="Choose a video or audio file"
  />

  {#if !SUPPORTED}
    <p class="scrub-note m-auto max-w-md px-6 text-center text-sm @6xl:text-lg">
      This browser can't run the scrubber. It needs WebAssembly and Web Audio, which newer browsers have.
    </p>
  {:else if stage === STAGE_IDLE}
    <div
      class="mx-auto flex min-h-0 w-full max-w-7xl grow flex-col gap-3 p-4 @3xl:p-6 @6xl:gap-5 @6xl:p-10 [@media(max-height:500px)]:flex-row [@media(max-height:500px)]:p-3"
    >
      <button
        class="drop-zone flex min-h-0 grow flex-col items-center justify-center gap-3 px-6 py-8 text-center @6xl:gap-5 [@media(max-height:500px)]:py-3"
        class:dragging={isDragging}
        onclick={() => fileEl.click()}
        ondragover={handleDragOver}
        ondragleave={() => (isDragging = false)}
        ondrop={handleDrop}
      >
        <Upload size={36} />
        <span class="text-base font-bold @3xl:text-lg @6xl:text-3xl">Choose a video or audio file</span>
        <span class="scrub-note max-w-md text-xs @3xl:text-sm @6xl:max-w-2xl @6xl:text-xl">
          or drop one here. Up to {MAX_MINUTES} minutes. Nothing is uploaded: it all runs on this device.
        </span>
      </button>
      <div
        class="flex shrink-0 flex-col gap-2 @3xl:flex-row @3xl:gap-3 [@media(max-height:500px)]:w-2/5 [@media(max-height:500px)]:flex-col [@media(max-height:500px)]:justify-center"
      >
        {#if error}
          <p class="scrub-error flex items-center gap-2 px-3 py-2 text-xs @3xl:text-sm @6xl:text-lg" role="alert">
            <AlertCircle size={16} class="shrink-0" />
            {error}
          </p>
        {/if}
        <p class="scrub-card grow px-3 py-2 text-xs @3xl:text-sm @6xl:px-5 @6xl:py-4 @6xl:text-lg">
          <strong>Why:</strong> a plane passing overhead leaves a falling tone in a recording, often too faint to hear.
          Matched against public flight tracks, it can show where the recording was made.
        </p>
        <p class="scrub-card grow px-3 py-2 text-xs @3xl:text-sm @6xl:px-5 @6xl:py-4 @6xl:text-lg [@media(max-height:500px)]:hidden">
          <strong>What this does:</strong> rebuilds the quiet part of the 20–2000 Hz band from fresh noise and removes long
          steady or gliding tones. Speech and music stay.
        </p>
      </div>
    </div>
  {:else}
    <div
      class="mx-auto grid min-h-0 w-full max-w-7xl grow grid-cols-1 grid-rows-[auto_minmax(0,1fr)] gap-3 p-3 @3xl:grid-cols-[minmax(0,1fr)_20rem] @3xl:grid-rows-1 @3xl:gap-4 @3xl:p-5 @6xl:grid-cols-[minmax(0,1fr)_26rem] @6xl:gap-5 @6xl:p-6 [@media(max-height:500px)]:grid-cols-[minmax(0,1fr)_19rem] [@media(max-height:500px)]:grid-rows-1 [@media(max-height:500px)]:p-2"
    >
      <section class="scrub-card flex min-h-0 min-w-0 flex-col gap-2 p-3 @6xl:gap-3 @6xl:p-4 [@media(max-height:500px)]:p-2" aria-label="Tones found">
        <div class="flex min-w-0 items-baseline gap-2">
          <span class="min-w-0 truncate text-xs font-bold @3xl:text-sm @6xl:text-lg">{fileName}</span>
          {#if audio}
            <span class="scrub-note shrink-0 text-[0.65rem] @3xl:text-xs @6xl:text-base">
              {clock(audio.seconds)} · {CHANNEL_NAMES[audio.channels.length] || `${audio.channels.length} channels`}
            </span>
          {/if}
        </div>
        <div class="chart relative h-32 min-h-0 [@media(max-height:650px)_and_(max-width:500px)]:h-24 @lg:h-48 @3xl:h-auto @3xl:grow [@media(max-height:500px)]:h-auto [@media(max-height:500px)]:grow">
          <svg class="absolute inset-0 h-full w-full" viewBox="0 0 {CHART_W} {CHART_H}" preserveAspectRatio="none" aria-hidden="true">
            {#each GRID_HZ as hz (hz)}
              <line class="grid-line" x1="0" x2={CHART_W} y1={pitchY(hz)} y2={pitchY(hz)} />
            {/each}
            {#each tones as tone, i (i)}
              <line
                class="tone {tone.kind}"
                class:removed={stage === STAGE_DONE && !(keepHum && tone.kind === KIND_STEADY)}
                x1={timeX(tone.tStart)}
                x2={timeX(tone.tEnd)}
                y1={pitchY(tone.fFirst)}
                y2={pitchY(tone.fLast)}
              />
            {/each}
          </svg>
          {#each GRID_HZ as hz (hz)}
            <span class="grid-label absolute left-1 text-[0.55rem] @6xl:text-sm" style="top: {(PERCENT * pitchY(hz)) / CHART_H}%">
              {hz} Hz
            </span>
          {/each}
          {#if found && !tones.length}
            <span class="scrub-note absolute inset-0 flex items-center justify-center text-xs @6xl:text-lg">No long tones stand out</span>
          {/if}
        </div>
        <div class="scrub-note flex shrink-0 flex-wrap gap-x-3 gap-y-1 text-[0.65rem] @3xl:text-xs @6xl:text-base">
          <span class="legend falling">Falling: a pass overhead</span>
          <span class="legend steady">Steady: hum, fans</span>
          <span class="legend rising">Rising</span>
        </div>
      </section>

      <section class="flex min-h-0 min-w-0 flex-col gap-2 overflow-x-hidden overflow-y-auto @6xl:gap-3" aria-live="polite">
        {#if isBusy}
          <div class="scrub-card flex flex-col gap-2 p-3 @6xl:p-4">
            <span class="text-sm font-bold @6xl:text-lg">{BUSY_LABELS[stage]}</span>
            <div class="bar" class:unknown={stage !== STAGE_SCRUBBING}>
              <span class="bar-fill block h-full" style="transform: scaleX({stage === STAGE_SCRUBBING ? progress : 1})"></span>
            </div>
          </div>
        {/if}

        {#if found && stage !== STAGE_DONE}
          <div class="scrub-card flex flex-col gap-2 p-3 text-xs @3xl:text-sm @6xl:p-4 @6xl:text-base [@media(max-height:500px)]:gap-1 [@media(max-height:500px)]:p-2 [@media(max-height:500px)]:text-[0.68rem]">
            <span class="text-sm font-bold @6xl:text-lg">
              {tones.length ? `${tones.length} long tone${tones.length === 1 ? "" : "s"} found` : "No long tones found"}
            </span>
            {#if fallingCount}
              <span class="finding falling [@media(max-height:500px)]:hidden">{fallingCount} fall in pitch, as a passing aircraft or vehicle does.</span>
            {/if}
            <ul class="flex flex-col gap-1 [@media(max-height:500px)]:hidden">
              {#each tones.slice(0, TONES_LISTED) as tone, i (i)}
                <li class="tone-row items-center gap-2 {i < TONES_LISTED_NARROW ? 'flex' : 'hidden @3xl:flex'}">
                  <span class="dot {tone.kind} shrink-0"></span>
                  <span class="min-w-0 grow truncate">{clock(tone.tStart)}–{clock(tone.tEnd)} · {Math.round(tone.fFirst)}→{Math.round(tone.fLast)} Hz</span>
                  <span class="scrub-note shrink-0">{KIND_LABELS[tone.kind]}</span>
                </li>
              {/each}
            </ul>
            <span class="finding" class:steady={found.hum.present}>
              <Zap size={14} class="inline shrink-0" />
              {found.hum.present
                ? `Mains hum from a ${found.hum.nominalHz} Hz grid. It can date a recording.`
                : "No mains hum found."}
            </span>
            <span class="scrub-note">
              A clean check doesn't mean safe: faint flyovers hide below the noise. Scrub anyway if location matters.
            </span>
          </div>
        {/if}

        {#if stage === STAGE_READY}
          <label class="scrub-card flex shrink-0 cursor-pointer items-center gap-2 px-3 py-2 text-xs @3xl:text-sm @6xl:px-4 @6xl:py-3 @6xl:text-base [@media(max-height:500px)]:py-1.5">
            <input type="checkbox" bind:checked={keepHum} />
            Keep steady hum (leaves mains hum in)
          </label>
        {/if}

        {#if stage === STAGE_DONE}
          <div class="scrub-card done flex flex-col gap-2 p-3 text-xs @3xl:text-sm @6xl:p-4 @6xl:text-base [@media(max-height:500px)]:gap-1 [@media(max-height:500px)]:p-2 [@media(max-height:500px)]:text-[0.68rem]">
            <span class="flex items-center gap-2 text-sm font-bold @6xl:text-lg"><ShieldCheck size={18} /> Scrubbed</span>
            <span>
              {Math.round(PERCENT * cleaned.report.replacedFraction)}% of the {BAND_LOW_HZ}–{BAND_HIGH_HZ} Hz band was rebuilt
              from fresh noise. Anything louder than the background was kept.
            </span>
            {#if tones.length}
              <span>{keepHum ? "Gliding tones were removed; steady ones were kept." : "The long tones on the chart were removed."}</span>
            {/if}
            {#if found.hum.present}
              <span>{cleaned.hum.present ? "Mains hum is still there." : "Mains hum is gone."}</span>
            {/if}
            <audio class="w-full shrink-0 [@media(max-height:500px)]:hidden" controls src={downloadUrl}></audio>
            <span class="scrub-note">
              Audio only for now: put it back on the video in an editor and strip the file's metadata. This is evidence
              against the known attack, not a guarantee.
            </span>
          </div>
        {/if}

        {#if !isBusy}
          <div class="flex shrink-0 gap-2">
            {#if stage === STAGE_READY}
              <button class="scrub-btn primary flex min-w-0 grow items-center justify-center gap-2 px-4 py-3 text-sm font-bold @6xl:text-lg [@media(max-height:500px)]:py-2" onclick={scrub}>
                <Plane size={18} class="shrink-0" /> Scrub the audio
              </button>
            {:else}
              <a
                class="scrub-btn primary flex min-w-0 grow items-center justify-center gap-2 px-4 py-3 text-sm font-bold @6xl:text-lg [@media(max-height:500px)]:py-2"
                href={downloadUrl}
                download={fileName.replace(/\.[^.]+$/, "") + OUTPUT_SUFFIX}
              >
                <Download size={18} class="shrink-0" /> Download WAV
              </a>
            {/if}
            <button class="scrub-btn flex shrink-0 items-center justify-center gap-2 px-3 py-3 text-xs font-bold @6xl:text-base [@media(max-height:500px)]:py-2" onclick={reset}>
              <RotateCcw size={14} class="shrink-0" /> Another file
            </button>
          </div>
        {/if}
      </section>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "../../../styles/variables" as *;

  .scrubber {
    background: $bg-app-dark;
    color: $color-scrub-ink-strong;
    font-family: $font-primary;
  }

  .scrub-note {
    color: $color-scrub-ink-dim;
    line-height: 1.45;
  }

  .scrub-card {
    background: $bg-card-dark;
    border: 1px solid $border-light;
    border-radius: 12px;
    color: $color-scrub-ink;
    line-height: 1.45;

    strong {
      color: $color-scrub;
    }

    &.done {
      border-color: $color-scrub-line;
    }

    // Phone on its side: every line of height counts
    @media (max-height: 500px) {
      line-height: 1.3;
    }
  }

  .scrub-error {
    background: $color-scrub-falling-soft;
    border: 1px solid $color-scrub-falling;
    border-radius: 12px;
    color: $color-scrub-falling;
  }

  .drop-zone {
    background: $color-scrub-soft;
    border: 2px dashed $color-scrub-line;
    border-radius: 16px;
    color: $color-scrub;
    cursor: pointer;
    font-family: inherit;
    transition:
      border-color $transition-speed-fast,
      box-shadow $transition-speed-normal;

    &:hover,
    &:focus-visible,
    &.dragging {
      border-color: $color-scrub;
      box-shadow: 0 0 24px $color-scrub-glow;
      outline: none;
    }
  }

  .chart {
    background: $bg-input-dark;
    border: 1px solid $border-light;
    border-radius: 8px;
    overflow: hidden;
  }

  .grid-line {
    stroke: $border-light;
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
  }

  .grid-label {
    color: $color-scrub-ink-dim;
    transform: translateY(-50%);
    pointer-events: none;
  }

  // Tone colours: one rule each for the chart lines, the list dots and the legend
  .tone {
    stroke-width: 3;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
    transition: opacity $transition-speed-normal;

    &.falling {
      stroke: $color-scrub-falling;
    }
    &.steady {
      stroke: $color-scrub-steady;
    }
    &.rising {
      stroke: $color-scrub-rising;
    }
    &.removed {
      opacity: 0.25;
      stroke-dasharray: 4 6;
    }
  }

  .dot,
  .legend::before {
    width: 0.6em;
    height: 0.6em;
    border-radius: 50%;
    background: $color-scrub-rising;
  }

  .legend {
    display: inline-flex;
    align-items: center;
    gap: 0.4em;

    &::before {
      content: "";
    }
    &.falling::before {
      background: $color-scrub-falling;
    }
    &.steady::before {
      background: $color-scrub-steady;
    }
  }

  .dot {
    &.falling {
      background: $color-scrub-falling;
    }
    &.steady {
      background: $color-scrub-steady;
    }
  }

  .tone-row {
    font-variant-numeric: tabular-nums;
  }

  .finding {
    &.falling {
      color: $color-scrub-falling;
    }
    &.steady {
      color: $color-scrub-steady;
    }
  }

  .bar {
    height: 6px;
    background: $bg-input-dark;
    border-radius: 3px;
    overflow: hidden;

    // No measure of progress while reading or checking: pulse instead
    &.unknown .bar-fill {
      animation: scrubPulse 1.2s ease-in-out infinite;
    }
  }

  // Grows on transform only, so the bar never reflows the panel
  .bar-fill {
    background: $color-scrub;
    transform-origin: left;
    transition: transform $transition-speed-fast linear;
  }

  .scrub-btn {
    background: $bg-card-dark;
    border: 1px solid $border-light;
    border-radius: 10px;
    color: $color-scrub-ink;
    cursor: pointer;
    font-family: inherit;
    text-decoration: none;
    transition:
      border-color $transition-speed-fast,
      box-shadow $transition-speed-normal;

    &:hover,
    &:focus-visible {
      border-color: $color-scrub-line;
      outline: none;
    }

    &.primary {
      background: $color-scrub-soft;
      border-color: $color-scrub-line;
      color: $color-scrub;

      &:hover,
      &:focus-visible {
        border-color: $color-scrub;
        box-shadow: 0 0 18px $color-scrub-glow;
      }
    }
  }

  input[type="checkbox"] {
    accent-color: $color-scrub;
  }

  @keyframes scrubPulse {
    0%,
    100% {
      opacity: 0.25;
    }
    50% {
      opacity: 1;
    }
  }
</style>
