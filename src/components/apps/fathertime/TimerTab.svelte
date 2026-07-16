<script>
  import { onDestroy } from "svelte";
  import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-svelte";

  let hoursInput = $state(0);
  let minutesInput = $state(5);
  let secondsInput = $state(0);

  let timeRemaining = $state(0); // ms
  let totalDuration = $state(0); // ms
  let timerActive = $state(false);
  let timerInterval = null;
  let audioMuted = $state(false);
  let soundInterval = null;

  // Derive progress fraction (0 to 1) for Hourglass sand
  let progress = $derived.by(() => {
    if (totalDuration === 0) return 0;
    return (totalDuration - timeRemaining) / totalDuration;
  });

  function startTimer() {
    if (timerActive) return;

    if (timeRemaining === 0) {
      const ms = (hoursInput * 3600 + minutesInput * 60 + secondsInput) * 1000;
      if (ms === 0) return;
      timeRemaining = ms;
      totalDuration = ms;
    }

    timerActive = true;
    const tickTime = 100; // Tick every 100ms for responsiveness
    let lastTime = Date.now();

    timerInterval = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTime;
      lastTime = now;

      timeRemaining = Math.max(0, timeRemaining - delta);
      if (timeRemaining <= 0) {
        triggerAlarm();
      }
    }, tickTime);
  }

  function pauseTimer() {
    timerActive = false;
    clearInterval(timerInterval);
  }

  function resetTimer() {
    timerActive = false;
    clearInterval(timerInterval);
    clearInterval(soundInterval);
    timeRemaining = 0;
    totalDuration = 0;
  }

  function triggerAlarm() {
    timerActive = false;
    clearInterval(timerInterval);
    playAlarmSound();
  }

  function playAlarmSound() {
    if (audioMuted) return;

    // Web Audio synthesizer chime
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      let count = 0;

      soundInterval = setInterval(() => {
        if (count >= 5 || audioMuted) {
          clearInterval(soundInterval);
          ctx.close();
          return;
        }

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
          1200,
          ctx.currentTime + 0.15,
        );
        gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + 0.3,
        );

        osc.start();
        osc.stop(ctx.currentTime + 0.35);

        count++;
      }, 500);
    } catch (e) {
      console.error(e);
    }
  }

  function formatDisplayTime(ms) {
    const totalSecs = Math.ceil(ms / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  function handleQuickSet(mins) {
    resetTimer();
    minutesInput = mins;
    hoursInput = 0;
    secondsInput = 0;
    timeRemaining = mins * 60 * 1000;
    totalDuration = timeRemaining;
  }

  onDestroy(() => {
    clearInterval(timerInterval);
    clearInterval(soundInterval);
  });
</script>

<div
  class="timer-tab animated-pane flex flex-col md:flex-row items-center gap-8 justify-around h-full p-4 md:p-6 w-full max-w-4xl mx-auto"
>
  <!-- Left Side: Progress Ring -->
  <div
    class="flex flex-col items-center justify-center relative w-48 h-48 select-none"
  >
    <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="rgba(255, 255, 255, 0.05)"
        stroke-width="5"
      />
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="#f59e0b"
        stroke-width="5"
        stroke-dasharray="251.2"
        stroke-dashoffset={251.2 * (1 - progress)}
        stroke-linecap="round"
        class="transition-all duration-150 ease-out"
        style="filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.45));"
      />
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      {#if timeRemaining > 0 || timerActive}
        <span class="font-mono text-2xl font-black text-amber-400"
          >{formatDisplayTime(timeRemaining)}</span
        >
      {:else}
        <span class="font-mono text-2xl font-black text-white/20">00:00:00</span
        >
      {/if}
      <span
        class="text-[8px] text-white/30 uppercase tracking-widest font-bold mt-1"
        >TIMER ACTIVE</span
      >
    </div>
  </div>

  <!-- Right Side: Settings & Countdown Controls -->
  <div class="flex flex-col items-center justify-center flex-1 max-w-md w-full">
    <div class="w-full text-center md:text-left mb-4">
      <h2
        class="text-xs uppercase tracking-widest text-amber-400 font-bold mb-1"
      >
        Countdown Timer
      </h2>
      <p class="text-[10px] text-white/40">
        Set custom durations and track split intervals
      </p>
    </div>

    <!-- Mode Selector or Digital Display -->
    {#if timeRemaining > 0 || timerActive}
      <!-- Active Timer Digital Countdown (only visible on mobile, hidden on desktop since it is inside the dial) -->
      <div
        class="timer-display md:hidden font-mono text-5xl font-black text-amber-400 tracking-wider my-6 select-none"
      >
        {formatDisplayTime(timeRemaining)}
      </div>
    {:else}
      <!-- Input Selectors -->
      <div class="flex items-center gap-3 my-6 font-mono text-white/80">
        <div class="flex flex-col items-center">
          <input
            type="number"
            min="0"
            max="23"
            bind:value={hoursInput}
            class="input-wheel"
            aria-label="Hours"
          />
          <span class="text-[9px] text-white/30 mt-1 uppercase">HRS</span>
        </div>
        <span class="text-2xl font-bold self-start mt-1">:</span>
        <div class="flex flex-col items-center">
          <input
            type="number"
            min="0"
            max="59"
            bind:value={minutesInput}
            class="input-wheel"
            aria-label="Minutes"
          />
          <span class="text-[9px] text-white/30 mt-1 uppercase">MIN</span>
        </div>
        <span class="text-2xl font-bold self-start mt-1">:</span>
        <div class="flex flex-col items-center">
          <input
            type="number"
            min="0"
            max="59"
            bind:value={secondsInput}
            class="input-wheel"
            aria-label="Seconds"
          />
          <span class="text-[9px] text-white/30 mt-1 uppercase">SEC</span>
        </div>
      </div>
    {/if}

    <!-- Quick Presets -->
    {#if timeRemaining === 0 && !timerActive}
      <div class="flex flex-wrap justify-center gap-2 mb-6">
        {#each [1, 5, 10, 15, 30] as mins}
          <button
            class="px-2.5 py-1 text-[10px] font-bold border border-white/5 bg-white/2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors"
            onclick={() => handleQuickSet(mins)}
          >
            +{mins}m
          </button>
        {/each}
      </div>
    {/if}

    <!-- Control Buttons -->
    <div class="flex items-center gap-3 w-full justify-center">
      <button
        class="control-btn bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
        onclick={resetTimer}
        aria-label="Reset timer"
      >
        <RotateCcw size={15} />
        <span class="text-xs font-semibold ml-1.5">RESET</span>
      </button>

      {#if timerActive}
        <button
          class="control-btn play-btn active"
          onclick={pauseTimer}
          aria-label="Pause timer"
        >
          <Pause size={16} fill="currentColor" />
          <span class="text-xs font-bold ml-1.5">PAUSE</span>
        </button>
      {:else}
        <button
          class="control-btn play-btn"
          disabled={hoursInput === 0 &&
            minutesInput === 0 &&
            secondsInput === 0 &&
            timeRemaining === 0}
          onclick={startTimer}
          aria-label="Start timer"
        >
          <Play size={16} fill="currentColor" />
          <span class="text-xs font-bold ml-1.5">START</span>
        </button>
      {/if}

      <button
        class="control-btn bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
        onclick={() => (audioMuted = !audioMuted)}
        aria-label={audioMuted ? "Unmute alarm sound" : "Mute alarm sound"}
      >
        {#if audioMuted}
          <VolumeX size={15} />
          <span class="text-xs font-semibold ml-1.5">MUTED</span>
        {:else}
          <Volume2 size={15} />
          <span class="text-xs font-semibold ml-1.5">SOUND</span>
        {/if}
      </button>
    </div>
  </div>
</div>

<style>
  .timer-display {
    text-shadow: 0 0 25px rgba(245, 158, 11, 0.25);
  }

  .input-wheel {
    width: 60px;
    height: 50px;
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    color: #f59e0b;
    outline: none;
    transition: all 0.2s ease;
  }

  .input-wheel:focus {
    border-color: #f59e0b;
    background: rgba(255, 255, 255, 0.06);
    box-shadow: 0 0 10px rgba(245, 158, 11, 0.15);
  }

  /* Hide input spinners */
  .input-wheel::-webkit-outer-spin-button,
  .input-wheel::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .input-wheel {
    -moz-appearance: textfield;
  }

  .control-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    padding: 10px 16px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .play-btn {
    background: rgba(245, 158, 11, 0.15);
    border: 1px solid rgba(245, 158, 11, 0.35);
    color: #f59e0b;
    min-width: 100px;
  }

  .play-btn:hover {
    background: rgba(245, 158, 11, 0.25);
    box-shadow: 0 0 15px rgba(245, 158, 11, 0.25);
  }

  .play-btn.active {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.35);
    color: #ef4444;
  }
</style>
