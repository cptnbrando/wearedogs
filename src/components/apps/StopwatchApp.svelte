<script>
  import { onDestroy } from "svelte";

  let timeElapsed = $state(0);
  let timerActive = $state(false);
  let stopwatchInterval = null;

  function toggleStopwatch() {
    timerActive = !timerActive;
    if (timerActive) {
      stopwatchInterval = setInterval(() => {
        timeElapsed += 10;
      }, 10);
    } else {
      clearInterval(stopwatchInterval);
    }
  }

  function resetStopwatch() {
    clearInterval(stopwatchInterval);
    timerActive = false;
    timeElapsed = 0;
  }

  function formatTime(ms) {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const cent = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}.${cent.toString().padStart(2, "0")}`;
  }

  onDestroy(() => {
    clearInterval(stopwatchInterval);
  });
</script>

<div class="stopwatch-layout animated-pane">
  <h2>Sleek Chronometer</h2>
  <p class="description">Lap duration tracker.</p>

  <div class="stopwatch-display">
    {formatTime(timeElapsed)}
  </div>

  <div class="stopwatch-controls">
    <button class="stopwatch-btn" class:active={timerActive} onclick={toggleStopwatch}>
      {timerActive ? "PAUSE" : "START"}
    </button>
    <button class="stopwatch-btn reset" onclick={resetStopwatch}>
      RESET
    </button>
  </div>
</div>

<style>
  .stopwatch-layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 20px;
    padding: 24px;
  }

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: white;
  }

  .description {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.45);
    margin: 4px 0 20px 0;
  }

  .stopwatch-display {
    font-size: 4rem;
    font-weight: 800;
    font-family: monospace;
    color: #00ff66;
    text-shadow: 0 0 20px rgba(0, 255, 102, 0.2);
    letter-spacing: 0.05em;
  }

  .stopwatch-controls {
    display: flex;
    gap: 16px;
  }

  .stopwatch-btn {
    background: rgba(0, 255, 102, 0.15);
    border: 1px solid rgba(0, 255, 102, 0.3);
    color: #00ff66;
    border-radius: 10px;
    padding: 12px 32px;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .stopwatch-btn:hover {
    background: rgba(0, 255, 102, 0.25);
    box-shadow: 0 0 15px rgba(0, 255, 102, 0.15);
  }

  .stopwatch-btn.active {
    background: rgba(255, 51, 68, 0.15);
    border-color: rgba(255, 51, 68, 0.3);
    color: #ff3344;
  }

  .stopwatch-btn.reset {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.7);
  }

  .stopwatch-btn.reset:hover {
    background: rgba(255, 255, 255, 0.08);
    color: white;
  }

  .animated-pane {
    animation: paneFadeIn 0.3s ease forwards;
  }

  @keyframes paneFadeIn {
    0% { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  }
</style>
