<script>
  import { onMount, onDestroy } from "svelte";
  import { Mic, MicOff, Radio } from "lucide-svelte";
  import { TuningFork } from "../../../lib/tuningFork.svelte.js";

  let tuner = $state(new TuningFork());
  let isTuning = $derived(tuner.isTuning);
  let frequency = $derived(tuner.frequency);
  let noteName = $derived(tuner.noteName);
  let noteOctave = $derived(tuner.noteOctave);
  let cents = $derived(tuner.cents);
  let rms = $derived(tuner.rms);

  let micError = $state(false);

  async function toggleTuning() {
    micError = false;
    if (isTuning) {
      tuner.stop();
    } else {
      try {
        await tuner.start();
      } catch (err) {
        micError = true;
      }
    }
  }

  // Calculate needle rotation angle: range -50 to +50 cents maps to -75 to +75 degrees rotation
  let needleAngle = $derived.by(() => {
    if (!isTuning || frequency === 0) return 0;
    return Math.min(Math.max((cents / 50) * 75, -75), 75);
  });

  // Check if note is perfectly in tune (within tolerance of 3 cents)
  let isInTune = $derived(isTuning && frequency > 0 && Math.abs(cents) <= 3);

  onDestroy(() => {
    tuner.stop();
  });
</script>

<div
  class="tuner-tab animated-pane flex flex-col items-center justify-between h-full p-4 md:p-6 w-full max-w-2xl mx-auto"
>
  <div class="w-full text-center">
    <h2 class="text-xs uppercase tracking-widest text-sky-400 font-bold mb-1">
      Chromatic Tuning Fork
    </h2>
    <p class="text-[10px] text-white/40">
      Calibrate instrumental strings using your microphone
    </p>
  </div>

  <!-- Analog Needle Dial Gauge -->
  <div
    class="relative w-64 h-36 flex items-end justify-center overflow-hidden my-4"
  >
    <!-- Dial face arc -->
    <svg class="w-full h-full text-white/10" viewBox="0 0 200 100">
      <!-- Outer curved tracks -->
      <path
        d="M 20,95 A 80,80 0 0,1 180,95"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-dasharray="2 4"
      />
      <!-- Reference ticks -->
      <line
        x1="20"
        y1="95"
        x2="28"
        y2="95"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <line
        x1="180"
        y1="95"
        x2="172"
        y2="95"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <line
        x1="100"
        y1="15"
        x2="100"
        y2="25"
        stroke={isInTune ? "#00ff66" : "currentColor"}
        stroke-width="2"
      />

      <!-- Markings for Flat / Sharp -->
      <text
        x="35"
        y="85"
        font-size="9"
        fill="currentColor"
        font-family="monospace"
        text-anchor="middle">FLAT</text
      >
      <text
        x="165"
        y="85"
        font-size="9"
        fill="currentColor"
        font-family="monospace"
        text-anchor="middle">SHARP</text
      >
    </svg>

    <!-- Glowing in-tune center tick background light -->
    <div
      class="absolute top-2 w-1.5 h-16 bg-emerald-400/20 blur-md transition-opacity duration-150"
      class:opacity-100={isInTune}
      class:opacity-0={!isInTune}
    ></div>

    <!-- Rotating Needle -->
    <div
      class="absolute bottom-0 w-1 bg-rose-500 origin-bottom shadow-lg transition-transform duration-75 {isInTune
        ? '!bg-emerald-400 !shadow-emerald-400/40'
        : ''}"
      style="height: 85px; transform: rotate({needleAngle}deg); transform-origin: bottom center; bottom: -5px;"
    >
      <!-- Glowing dot peak on needle -->
      <div
        class="w-2.5 h-2.5 rounded-full bg-rose-400 -translate-x-0.5 -translate-y-1 shadow"
        class:!bg-emerald-300={isInTune}
      ></div>
    </div>

    <!-- Pivot core center -->
    <div
      class="absolute bottom-0 w-6 h-3 rounded-t-full bg-[#1b1b24] border border-white/20 z-10"
    ></div>
  </div>

  <!-- Note Name Readout -->
  <div
    class="flex flex-col items-center justify-center min-h-[80px] my-2 select-none"
  >
    {#if isTuning && frequency > 0}
      <div class="flex items-baseline justify-center">
        <span
          class="font-mono text-6xl font-black text-white"
          class:text-emerald-400={isInTune}
        >
          {noteName}
        </span>
        <span
          class="font-mono text-2xl font-bold ml-1 {isInTune
            ? 'text-emerald-400/50'
            : 'text-white/50'}"
        >
          {noteOctave}
        </span>
      </div>
      <p
        class="font-mono text-xs text-white/40 mt-1 flex items-center gap-1.5 justify-center"
      >
        <span>{frequency.toFixed(1)} Hz</span>
        <span>|</span>
        <span
          class="font-bold"
          class:text-emerald-400={isInTune}
          class:text-rose-400={!isInTune && cents !== 0}
        >
          {cents === 0
            ? "IN TUNE"
            : cents > 0
              ? `+${cents} cents`
              : `${cents} cents`}
        </span>
      </p>
    {:else if isTuning}
      <div class="text-xs text-white/30 italic flex items-center gap-2">
        <Radio size={12} class="animate-pulse text-sky-400" />
        Listening... hum or pluck a string
      </div>
    {:else}
      <div class="text-xs text-white/30 italic">
        Tuning Fork Offline. Press START TUNER below.
      </div>
    {/if}
  </div>

  <!-- Signal volume indicator bar -->
  {#if isTuning}
    <div
      class="w-48 bg-white/5 h-1.5 rounded-full overflow-hidden mb-4 border border-white/5"
    >
      <div
        class="h-full bg-sky-400 transition-all duration-75"
        style="width: {Math.min(rms * 400, 100)}%;"
      ></div>
    </div>
  {/if}

  <!-- Error display -->
  {#if micError}
    <div
      class="w-full text-center p-3 border border-red-500/15 bg-red-500/5 text-[10px] text-red-400 font-semibold rounded-xl mb-4 flex items-center gap-1.5 justify-center"
    >
      <MicOff size={12} />
      Microphone permission was denied. Enable access in browser settings.
    </div>
  {/if}

  <!-- Toggle Buttons -->
  <div class="flex items-center gap-3 w-full justify-center">
    <button
      class="control-btn play-btn"
      class:active={isTuning}
      onclick={toggleTuning}
      aria-label={isTuning ? "Stop tuning" : "Start tuning"}
    >
      {#if isTuning}
        <MicOff size={15} />
        <span class="text-xs font-bold ml-1.5">STOP TUNING</span>
      {:else}
        <Mic size={15} />
        <span class="text-xs font-bold ml-1.5">START TUNING</span>
      {/if}
    </button>
  </div>
</div>

<style>
  .control-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    padding: 10px 20px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .play-btn {
    background: rgba(14, 165, 233, 0.15);
    border: 1px solid rgba(14, 165, 233, 0.35);
    color: #38bdf8;
    min-width: 140px;
  }

  .play-btn:hover {
    background: rgba(14, 165, 233, 0.25);
    box-shadow: 0 0 15px rgba(14, 165, 233, 0.2);
  }

  .play-btn.active {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.35);
    color: #ef4444;
  }

  .play-btn.active:hover {
    background: rgba(239, 68, 68, 0.25);
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.2);
  }
</style>
