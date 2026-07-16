<script>
  import { onDestroy } from "svelte";
  import { Play, Pause, RotateCcw, ListPlus } from "lucide-svelte";

  let { active = false } = $props();

  let timeElapsed = $state(0);
  let timerActive = $state(false);
  let laps = $state([]);
  let stopwatchInterval = null;
  let lastLapTime = 0;

  function toggleStopwatch() {
    timerActive = !timerActive;
    if (timerActive) {
      const startTime = Date.now() - timeElapsed;
      stopwatchInterval = setInterval(() => {
        timeElapsed = Date.now() - startTime;
      }, 10);
    } else {
      clearInterval(stopwatchInterval);
    }
  }

  function recordLap() {
    if (!timerActive) return;
    const currentLapDuration = timeElapsed - lastLapTime;
    laps.unshift({
      id: laps.length + 1,
      duration: currentLapDuration,
      total: timeElapsed,
    });
    lastLapTime = timeElapsed;
  }

  function resetStopwatch() {
    clearInterval(stopwatchInterval);
    timerActive = false;
    timeElapsed = 0;
    laps = [];
    lastLapTime = 0;
  }

  function formatTime(ms) {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const cent = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}.${cent.toString().padStart(2, "0")}`;
  }

  // Get index of fastest and slowest laps (only if 2 or more laps exist)
  let lapStats = $derived.by(() => {
    if (laps.length < 2) return { fastestId: null, slowestId: null };
    let fastest = laps[0];
    let slowest = laps[0];
    laps.forEach((l) => {
      if (l.duration < fastest.duration) fastest = l;
      if (l.duration > slowest.duration) slowest = l;
    });
    return { fastestId: fastest.id, slowestId: slowest.id };
  });

  onDestroy(() => {
    clearInterval(stopwatchInterval);
  });
</script>

<div
  class="stopwatch-tab animated-pane flex flex-col items-center justify-between h-full p-4 md:p-6 w-full max-w-2xl mx-auto"
>
  <div class="w-full text-center">
    <h2
      class="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-1"
    >
      Stopwatch
    </h2>
    <p class="text-[10px] text-white/40 mb-6">
      Lap & split time performance logger
    </p>
  </div>

  <!-- Giant Display -->
  <div
    class="stopwatch-display font-mono text-5xl sm:text-6xl md:text-7xl font-black text-emerald-400 tracking-wider my-6 select-none"
  >
    {formatTime(timeElapsed)}
  </div>

  <!-- Controls -->
  <div class="flex items-center gap-4 my-4 w-full justify-center">
    <button
      class="control-btn bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
      onclick={resetStopwatch}
      aria-label="Reset stopwatch"
    >
      <RotateCcw size={16} />
      <span class="hidden sm:inline text-xs font-semibold ml-1.5">RESET</span>
    </button>

    <button
      class="control-btn play-btn"
      class:active={timerActive}
      onclick={toggleStopwatch}
      aria-label={timerActive ? "Pause stopwatch" : "Start stopwatch"}
    >
      {#if timerActive}
        <Pause size={18} fill="currentColor" />
        <span class="text-xs font-bold ml-1.5">PAUSE</span>
      {:else}
        <Play size={18} fill="currentColor" />
        <span class="text-xs font-bold ml-1.5">START</span>
      {/if}
    </button>

    <button
      class="control-btn bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
      disabled={!timerActive}
      onclick={recordLap}
      class:opacity-50={!timerActive}
      aria-label="Record lap time"
    >
      <ListPlus size={16} />
      <span class="hidden sm:inline text-xs font-semibold ml-1.5">LAP</span>
    </button>
  </div>

  <!-- Laps Table -->
  <div
    class="flex-1 w-full overflow-y-auto mt-6 border border-white/5 bg-black/25 rounded-xl scroll-container relative min-h-[140px]"
  >
    {#if laps.length === 0}
      <div
        class="absolute inset-0 flex items-center justify-center text-xs text-white/30 italic"
      >
        No laps logged yet. Press START, then LAP.
      </div>
    {:else}
      <div class="w-full flex flex-col divide-y divide-white/5 text-xs">
        <div
          class="flex items-center py-2.5 px-4 font-bold text-white/40 border-b border-white/5 bg-white/2"
        >
          <span class="w-16">LAP</span>
          <span class="flex-1 text-right">LAP DURATION</span>
          <span class="flex-1 text-right">TOTAL TIME</span>
        </div>
        {#each laps as lap (lap.id)}
          <div
            class="flex items-center py-2.5 px-4 font-mono transition-colors duration-150 hover:bg-white/2"
            class:text-emerald-400={lap.id === lapStats.fastestId}
            class:text-red-400={lap.id === lapStats.slowestId}
          >
            <span class="w-16 font-bold text-white/50"
              >#{lap.id.toString().padStart(2, "0")}</span
            >
            <span class="flex-1 text-right font-medium">
              {formatTime(lap.duration)}
              {#if lap.id === lapStats.fastestId}
                <span
                  class="text-[9px] font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded ml-1.5"
                  >FASTEST</span
                >
              {:else if lap.id === lapStats.slowestId}
                <span
                  class="text-[9px] font-bold bg-red-500/10 px-1.5 py-0.5 rounded ml-1.5"
                  >SLOWEST</span
                >
              {/if}
            </span>
            <span class="flex-1 text-right text-white/60"
              >{formatTime(lap.total)}</span
            >
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .stopwatch-display {
    text-shadow: 0 0 25px rgba(16, 185, 129, 0.25);
  }

  .control-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    padding: 10px 18px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .play-btn {
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.35);
    color: #10b981;
    min-width: 110px;
  }

  .play-btn:hover {
    background: rgba(16, 185, 129, 0.25);
    box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
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

  .scroll-container {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
  }

  .scroll-container::-webkit-scrollbar {
    width: 5px;
  }
  .scroll-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
</style>
