<script>
  import {
    X,
    Undo,
    Award,
    Volume2,
    Paintbrush,
    Watch,
    Video,
    QrCode,
  } from "lucide-svelte";
  import SnakeApp from "./apps/SnakeApp.svelte";
  import SoundboardApp from "./apps/SoundboardApp.svelte";
  import PaintApp from "./apps/PaintApp.svelte";
  import StopwatchApp from "./apps/StopwatchApp.svelte";
  import GoPro from "./apps/GoPro.svelte";
  import QRFlash from "./apps/QRFlash.svelte";

  let { isClosing = false, onClose } = $props();

  // Active App state: null | 'snake' | 'soundboard' | 'paint' | 'stopwatch' | 'gopro' | 'qrflash'
  let activeApp = $state(null);

  function handleBack() {
    activeApp = null;
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="toolbox-panel-backdrop" onclick={onClose}>
  <div
    class="toolbox-panel-container"
    class:closing={isClosing}
    onclick={(e) => e.stopPropagation()}
  >
    <!-- Header -->
    <header class="panel-header">
      <div class="brand">
        <span class="pulse-dot"></span>
        {#if activeApp}
          <button class="back-btn" onclick={handleBack}>
            <Undo size={14} />
            <span>App Launcher</span>
          </button>
          <span class="path-indicator">/ {activeApp.toUpperCase()}</span>
        {:else}
          <h1>Dash</h1>
          <span class="path-indicator">/ APPS</span>
        {/if}
      </div>

      <button class="close-btn" onclick={onClose} aria-label="Close panel">
        <X size={20} />
      </button>
    </header>

    <!-- Main Content App Canvas -->
    <div class="panel-body">
      {#if activeApp === null}
        <!-- APPS LAUNCHER GRID VIEW -->
        <div class="launcher-view animated-pane">
          <h2>util</h2>
          <p class="description">
            Select a gadget or mini-app hosted inside this panel session.
          </p>

          <div class="apps-grid">
            <!-- App 1: GoPro Player -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="app-card border-neon-purple"
              onclick={() => {
                activeApp = "gopro";
              }}
            >
              <div class="app-visual">
                <div class="video-preview-mini">
                  <span class="lens"></span>
                  <span class="tape t1"></span>
                  <span class="tape t2"></span>
                </div>
              </div>
              <div class="app-meta">
                <span class="app-title"><Video size={14} /> GoPro Cinema</span>
                <span class="app-desc"
                  >Stream retro TV series and clip custom audio loops.</span
                >
              </div>
            </div>

            <!-- App 2: QRFlash Visual Transfer -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="app-card border-neon-cyan"
              onclick={() => {
                activeApp = "qrflash";
              }}
            >
              <div class="app-visual">
                <div class="qr-preview-mini">
                  <span class="corner c1"></span>
                  <span class="corner c2"></span>
                  <span class="corner c3"></span>
                  <span class="scan-bar"></span>
                </div>
              </div>
              <div class="app-meta">
                <span class="app-title"><QrCode size={14} /> QRFlash Link</span>
                <span class="app-desc"
                  >Visual file transfer protocol over flashing QR codes.</span
                >
              </div>
            </div>

            <!-- App 3: Dog Soundboard -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="app-card border-neon-pink"
              onclick={() => {
                activeApp = "soundboard";
              }}
            >
              <div class="app-visual">
                <div class="wave-preview">
                  <span></span><span></span><span></span><span></span><span
                  ></span>
                </div>
              </div>
              <div class="app-meta">
                <span class="app-title"
                  ><Volume2 size={14} /> Dog Soundboard</span
                >
                <span class="app-desc"
                  >Play high fidelity dog bark synthesizers.</span
                >
              </div>
            </div>

            <!-- App 4: Snake Game -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="app-card border-neon-blue"
              onclick={() => {
                activeApp = "snake";
              }}
            >
              <div class="app-visual">
                <div class="snake-mini-preview">
                  <span class="dot d1"></span>
                  <span class="dot d2"></span>
                  <span class="dot d3"></span>
                  <span class="dot d4"></span>
                </div>
              </div>
              <div class="app-meta">
                <span class="app-title"><Award size={14} /> Playable Snake</span
                >
                <span class="app-desc"
                  >Retro snake game, runs inside grid. Use Arrow Keys.</span
                >
              </div>
            </div>

            <!-- App 5: Sketch Canvas -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="app-card border-neon-yellow"
              onclick={() => {
                activeApp = "paint";
              }}
            >
              <div class="app-visual">
                <div class="brush-preview">
                  <Paintbrush size={32} />
                  <span class="drip"></span>
                </div>
              </div>
              <div class="app-meta">
                <span class="app-title"
                  ><Paintbrush size={14} /> Sketch Canvas</span
                >
                <span class="app-desc"
                  >Draw and paint illustrations on a canvas.</span
                >
              </div>
            </div>

            <!-- App 6: Stopwatch -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="app-card border-neon-green"
              onclick={() => {
                activeApp = "stopwatch";
              }}
            >
              <div class="app-visual">
                <div class="stopwatch-preview">
                  <Watch size={32} />
                </div>
              </div>
              <div class="app-meta">
                <span class="app-title"><Watch size={14} /> Chronometer</span>
                <span class="app-desc"
                  >Track elapsed lap times with sub-millisecond precision.</span
                >
              </div>
            </div>
          </div>
        </div>
      {:else if activeApp === "snake"}
        <SnakeApp />
      {:else if activeApp === "soundboard"}
        <SoundboardApp />
      {:else if activeApp === "paint"}
        <PaintApp />
      {:else if activeApp === "stopwatch"}
        <StopwatchApp />
      {:else if activeApp === "gopro"}
        <GoPro />
      {:else if activeApp === "qrflash"}
        <QRFlash />
      {/if}
    </div>

    <!-- Footer -->
    <footer class="panel-footer">
      <div class="sys-status">
        <span class="status-indicator-green"></span>
        <span>UTILITY GRID STABLE</span>
      </div>
      <div class="stats-counter">
        <span>APPS LOADED: 6</span>
        <span class="divider">|</span>
        <span>ACTIVE APP: {activeApp ? activeApp.toUpperCase() : "NONE"}</span>
      </div>
    </footer>
  </div>
</div>

<style>
  /* ── Backdrop ── */
  .toolbox-panel-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  /* ── Container ── */
  .toolbox-panel-container {
    width: 94vw;
    height: 90vh;
    max-width: 1280px;
    max-height: 850px;
    background: rgba(10, 10, 14, 0.45); /* Slightly transparent mandatory */
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    box-shadow:
      0 32px 80px rgba(0, 0, 0, 0.7),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    backdrop-filter: blur(15px) saturate(160%);
    -webkit-backdrop-filter: blur(15px) saturate(160%);
    animation: panelSlideUpIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transform-origin: center bottom;
  }

  .toolbox-panel-container.closing {
    animation: panelSlideUpDown 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes panelSlideUpIn {
    0% {
      opacity: 0;
      transform: translateY(30px) scale(0.97);
      backdrop-filter: blur(0px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      backdrop-filter: blur(15px) saturate(160%);
    }
  }

  @keyframes panelSlideUpDown {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
      backdrop-filter: blur(15px) saturate(160%);
    }
    100% {
      opacity: 0;
      transform: translateY(20px) scale(0.97);
      backdrop-filter: blur(0px);
    }
  }

  /* ── Header ── */
  .panel-header {
    height: 64px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(0, 0, 0, 0.2);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .pulse-dot {
    width: 8px;
    height: 8px;
    background: #ff55bb;
    border-radius: 50%;
    box-shadow: 0 0 10px #ff55bb;
    animation: pulseDot 2s infinite;
  }

  @keyframes pulseDot {
    0%,
    100% {
      opacity: 0.6;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  .brand h1 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.95);
    font-family: "Outfit", "Inter", sans-serif;
  }

  .back-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    color: rgba(255, 255, 255, 0.85);
    padding: 6px 12px;
    font-size: 0.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .back-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
  }

  .path-indicator {
    font-size: 0.75rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.3);
    font-family: monospace;
  }

  .close-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.5);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    transform: rotate(90deg);
  }

  /* ── Body Layout ── */
  .panel-body {
    flex-grow: 1;
    height: calc(100% - 64px - 40px);
    overflow: hidden;
    background: rgba(0, 0, 0, 0.15);
  }

  .animated-pane {
    animation: paneFadeIn 0.3s ease forwards;
  }

  @keyframes paneFadeIn {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ── Launcher View ── */
  .launcher-view {
    padding: 24px;
    overflow-y: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .launcher-view h2 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 700;
    color: white;
  }

  .description {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.4);
    margin: 4px 0 20px 0;
  }

  .apps-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .app-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 20px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .app-card:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: scale(1.01) translateY(-2px);
  }

  /* Neon Borders */
  .border-neon-blue:hover {
    border-color: rgba(0, 191, 255, 0.6);
    box-shadow: 0 8px 30px rgba(0, 191, 255, 0.1);
  }
  .border-neon-pink:hover {
    border-color: rgba(255, 85, 187, 0.6);
    box-shadow: 0 8px 30px rgba(255, 85, 187, 0.1);
  }
  .border-neon-yellow:hover {
    border-color: rgba(255, 204, 0, 0.6);
    box-shadow: 0 8px 30px rgba(255, 204, 0, 0.1);
  }
  .border-neon-green:hover {
    border-color: rgba(0, 255, 102, 0.6);
    box-shadow: 0 8px 30px rgba(0, 255, 102, 0.1);
  }
  .border-neon-purple:hover {
    border-color: rgba(180, 85, 255, 0.6);
    box-shadow: 0 8px 30px rgba(180, 85, 255, 0.1);
  }
  .border-neon-cyan:hover {
    border-color: rgba(0, 191, 255, 0.6);
    box-shadow: 0 8px 30px rgba(0, 191, 255, 0.1);
  }

  .app-visual {
    width: 64px;
    height: 64px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .app-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .app-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: white;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .app-desc {
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.45);
    line-height: 1.3;
  }

  /* App Previews */
  .snake-mini-preview {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
    width: 32px;
    height: 32px;
  }

  .snake-mini-preview .dot {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1px;
    width: 6px;
    height: 6px;
  }

  .snake-mini-preview .dot.d1 {
    background: #00ff66;
    animation: snakeMove1 1.6s infinite step-end;
  }
  .snake-mini-preview .dot.d2 {
    background: #00ff66;
    animation: snakeMove2 1.6s infinite step-end;
  }
  .snake-mini-preview .dot.d3 {
    background: #00ff66;
    animation: snakeMove3 1.6s infinite step-end;
  }
  .snake-mini-preview .dot.d4 {
    background: #ff3344;
    animation: snakeFood 1.6s infinite step-end;
  }

  @keyframes snakeMove1 {
    0% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(8px, 0);
    }
    50% {
      transform: translate(8px, 8px);
    }
    75% {
      transform: translate(0, 8px);
    }
  }
  @keyframes snakeMove2 {
    0% {
      transform: translate(0, 8px);
    }
    25% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(8px, 0);
    }
    75% {
      transform: translate(8px, 8px);
    }
  }
  @keyframes snakeMove3 {
    0% {
      transform: translate(8px, 8px);
    }
    25% {
      transform: translate(0, 8px);
    }
    50% {
      transform: translate(0, 0);
    }
    75% {
      transform: translate(8px, 0);
    }
  }
  @keyframes snakeFood {
    0%,
    50% {
      transform: translate(16px, 8px);
      opacity: 1;
    }
    51%,
    100% {
      transform: translate(0px, 16px);
      opacity: 1;
    }
  }

  .wave-preview {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 24px;
  }

  .wave-preview span {
    width: 3px;
    background: #ff55bb;
    border-radius: 1.5px;
    animation: barBounce 1s infinite ease-in-out;
  }

  .wave-preview span:nth-child(1) {
    height: 8px;
    animation-delay: 0.1s;
  }
  .wave-preview span:nth-child(2) {
    height: 16px;
    animation-delay: 0.2s;
  }
  .wave-preview span:nth-child(3) {
    height: 24px;
    animation-delay: 0.3s;
  }
  .wave-preview span:nth-child(4) {
    height: 14px;
    animation-delay: 0.4s;
  }
  .wave-preview span:nth-child(5) {
    height: 6px;
    animation-delay: 0.5s;
  }

  @keyframes barBounce {
    0%,
    100% {
      transform: scaleY(0.4);
    }
    50% {
      transform: scaleY(1);
    }
  }

  .brush-preview {
    position: relative;
    color: #ffcc00;
  }
  .brush-preview .drip {
    position: absolute;
    width: 6px;
    height: 6px;
    background: #ffcc00;
    border-radius: 50%;
    bottom: -6px;
    left: 8px;
    animation: paintDrip 2s infinite ease-in;
  }

  @keyframes paintDrip {
    0% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    80% {
      transform: translateY(12px) scale(0.6);
      opacity: 0.8;
    }
    100% {
      transform: translateY(18px) scale(0.2);
      opacity: 0;
    }
  }

  .stopwatch-preview {
    color: #00ff66;
    animation: radarScan 4s infinite linear;
  }

  @keyframes radarScan {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* ── Footer ── */
  .panel-footer {
    height: 40px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(0, 0, 0, 0.3);
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.35);
    font-weight: 500;
    letter-spacing: 0.05em;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .sys-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: monospace;
  }

  .status-indicator-green {
    width: 6px;
    height: 6px;
    background: #00ff66;
    border-radius: 50%;
    display: inline-block;
  }

  .stats-counter {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .divider {
    color: rgba(255, 255, 255, 0.15);
  }

  /* Custom App Previews */
  .video-preview-mini {
    position: relative;
    width: 24px;
    height: 24px;
    border: 2px solid #ff55bb;
    border-radius: 4px;
    color: #ff55bb;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .video-preview-mini .lens {
    width: 6px;
    height: 6px;
    background: #ff55bb;
    border-radius: 50%;
  }
  .video-preview-mini .tape {
    position: absolute;
    width: 10px;
    height: 10px;
    border: 2px solid #ff55bb;
    border-radius: 50%;
    top: -8px;
  }
  .video-preview-mini .tape.t1 {
    left: -3px;
    animation: tapeRoll 2s infinite linear;
  }
  .video-preview-mini .tape.t2 {
    right: -3px;
    animation: tapeRoll 2s infinite linear;
  }

  @keyframes tapeRoll {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .qr-preview-mini {
    position: relative;
    width: 20px;
    height: 20px;
    color: #00bfff;
  }
  .qr-preview-mini .corner {
    position: absolute;
    width: 5px;
    height: 5px;
    border: 2px solid #00bfff;
  }
  .qr-preview-mini .corner.c1 {
    top: 0;
    left: 0;
  }
  .qr-preview-mini .corner.c2 {
    top: 0;
    right: 0;
  }
  .qr-preview-mini .corner.c3 {
    bottom: 0;
    left: 0;
  }
  .qr-preview-mini .scan-bar {
    position: absolute;
    width: 100%;
    height: 2px;
    background: #00bfff;
    box-shadow: 0 0 6px #00bfff;
    top: 2px;
    animation: qrScanMini 1.5s infinite alternate ease-in-out;
  }

  @keyframes qrScanMini {
    0% {
      top: 2px;
    }
    100% {
      top: 16px;
    }
  }
</style>
