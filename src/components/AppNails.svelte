<script>
  import {
    Smile,
    Zap,
    Paintbrush,
    Radio,
    Settings,
    Hourglass,
    Scissors,
    Trophy,
    RefreshCw,
    FileText,
    Gamepad,
    Eye,
    Mic,
    Film,
  } from "lucide-svelte";

  let { appId } = $props();
</script>

{#if appId === "gopro"}
  <div class="video-preview-mini">
    <span class="lens"></span>
    <span class="tape t1"></span>
    <span class="tape t2"></span>
  </div>
{:else if appId === "dataflash"}
  <Zap
    size={28}
    style="color: var(--color-neon-cyan, #00d7ff); filter: drop-shadow(0 0 6px rgba(0, 215, 255, 0.4));"
  />
{:else if appId === "qrgenerator"}
  <div class="qr-preview-mini">
    <span class="corner c1"></span>
    <span class="corner c2"></span>
    <span class="corner c3"></span>
    <div
      style="width: 4px; height: 4px; background: #00d7ff; border-radius: 50%; box-shadow: 0 0 6px #00d7ff;"
    ></div>
  </div>
{:else if appId === "soundboard"}
  <div class="wave-preview">
    <span></span><span></span><span></span><span></span><span></span>
  </div>
{:else if appId === "snake"}
  <div class="snake-mini-preview">
    <span class="dot d1"></span>
    <span class="dot d2"></span>
    <span class="dot d3"></span>
    <span class="dot d4"></span>
  </div>
{:else if appId === "paint"}
  <div class="brush-preview">
    <Paintbrush size={32} />
    <span class="drip"></span>
  </div>
{:else if appId === "stopwatch"}
  <div class="stopwatch-preview">
    <Hourglass size={32} />
  </div>
{:else if appId === "rescue"}
  <div class="rescue-preview">
    <Radio size={32} />
  </div>
{:else if appId === "memes"}
  <div class="memes-preview">
    <Smile size={32} />
  </div>
{:else if appId === "worldcup"}
  <div class="wc-bracket-preview">
    <Trophy size={32} />
  </div>
{:else if appId === "blog"}
  <div class="blog-preview-mini">
    <span class="line l1"></span>
    <span class="line l2"></span>
    <span class="line l3"></span>
  </div>
{:else if appId === "soundstripper"}
  <div class="flex items-center justify-center h-full">
    <Scissors
      size={28}
      style="color: var(--color-neon-pink, #ff007f); filter: drop-shadow(0 0 6px rgba(255, 0, 127, 0.4));"
    />
  </div>
{:else if appId === "converter"}
  <div class="flex items-center justify-center h-full">
    <RefreshCw
      size={28}
      style="color: var(--color-neon-orange, #ff5e00); filter: drop-shadow(0 0 6px rgba(255, 94, 0, 0.4));"
      class="animate-spin-slow"
    />
  </div>
{:else if appId === "windshieldwiper"}
  <div class="flex items-center justify-center h-full relative overflow-hidden">
    <div class="wiper-icon-container">
      <svg viewBox="0 0 100 100" class="w-12 h-12">
        <path
          d="M 15 80 A 45 45 0 0 1 85 80"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          stroke-width="6"
          stroke-linecap="round"
        />
        <line
          x1="50"
          y1="85"
          x2="50"
          y2="40"
          stroke="#00ffff"
          stroke-width="4"
          stroke-linecap="round"
          class="wiper-blade-animate"
        />
      </svg>
    </div>
  </div>
{:else if appId === "changelog"}
  <div class="terminal-preview-mini">
    <span class="prompt-symbol">&gt;_</span>
    <span class="cursor-blink"></span>
  </div>
{:else if appId === "settings"}
  <div class="settings-preview-mini">
    <Settings size={28} class="animate-spin-slow text-white/50" />
  </div>
{:else if appId === "reader"}
  <div class="flex items-center justify-center h-full">
    <FileText
      size={28}
      style="color: var(--color-neon-red, #ff3344); filter: drop-shadow(0 0 6px rgba(255, 51, 68, 0.4));"
    />
  </div>
{:else if appId === "arcade"}
  <div class="flex items-center justify-center h-full">
    <Gamepad
      size={28}
      style="color: var(--color-neon-gold, #e6b900); filter: drop-shadow(0 0 6px rgba(230, 185, 0, 0.4));"
    />
  </div>
{:else if appId === "missingcreatures"}
  <div class="flex items-center justify-center h-full animate-pulse">
    <Eye
      size={28}
      style="color: #22c55e; filter: drop-shadow(0 0 6px rgba(34, 197, 94, 0.4));"
    />
  </div>
{:else if appId === "wiretap"}
  <div class="flex items-center justify-center h-full">
    <Mic
      size={28}
      style="color: var(--color-neon-green, #00d75f); filter: drop-shadow(0 0 6px rgba(0, 215, 95, 0.4));"
    />
  </div>
{:else if appId === "frames"}
  <div class="flex items-center justify-center h-full">
    <Film
      size={28}
      style="color: var(--color-neon-orange, #ff5e00); filter: drop-shadow(0 0 6px rgba(255, 94, 0, 0.4));"
    />
  </div>
{/if}

<style>
  :global(.snake-mini-preview) {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
    width: 32px;
    height: 32px;
  }

  :global(.snake-mini-preview .dot) {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1px;
    width: 6px;
    height: 6px;
  }

  :global(.snake-mini-preview .dot.d1) {
    background: #00ff66;
    animation: snakeMove1 1.6s infinite step-end;
  }
  :global(.snake-mini-preview .dot.d2) {
    background: #00ff66;
    animation: snakeMove2 1.6s infinite step-end;
  }
  :global(.snake-mini-preview .dot.d3) {
    background: #00ff66;
    animation: snakeMove3 1.6s infinite step-end;
  }
  :global(.snake-mini-preview .dot.d4) {
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

  :global(.wave-preview) {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 24px;
  }

  :global(.wave-preview span) {
    width: 3px;
    background: #ff55bb;
    border-radius: 1.5px;
    animation: barBounce 1s infinite ease-in-out;
  }

  :global(.wave-preview span:nth-child(1)) {
    height: 8px;
    animation-delay: 0.1s;
  }
  :global(.wave-preview span:nth-child(2)) {
    height: 16px;
    animation-delay: 0.2s;
  }
  :global(.wave-preview span:nth-child(3)) {
    height: 24px;
    animation-delay: 0.3s;
  }
  :global(.wave-preview span:nth-child(4)) {
    height: 14px;
    animation-delay: 0.4s;
  }
  :global(.wave-preview span:nth-child(5)) {
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

  :global(.brush-preview) {
    position: relative;
    color: #ffcc00;
  }
  :global(.brush-preview .drip) {
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

  :global(.stopwatch-preview) {
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

  :global(.rescue-preview) {
    color: #00bfff;
    animation: signalPing 2s infinite ease-in-out;
  }

  @keyframes signalPing {
    0%,
    100% {
      transform: scale(0.9);
      filter: drop-shadow(0 0 0px rgba(0, 191, 255, 0));
    }
    50% {
      transform: scale(1.15);
      filter: drop-shadow(0 0 10px rgba(0, 191, 255, 0.7));
    }
  }

  :global(.memes-preview) {
    color: #ff55bb;
    animation: dogLaugh 0.8s infinite ease-in-out;
  }

  @keyframes dogLaugh {
    0%,
    100% {
      transform: rotate(0deg) scale(1);
    }
    25% {
      transform: rotate(-8deg) scale(1.08);
    }
    75% {
      transform: rotate(8deg) scale(1.08);
    }
  }

  :global(.wc-bracket-preview) {
    color: #e6b900;
    animation: trophyFloat 3s ease-in-out infinite alternate;
  }

  @keyframes trophyFloat {
    0% {
      transform: translateY(0) scale(1);
    }
    100% {
      transform: translateY(-4px) scale(1.08);
    }
  }

  :global(.video-preview-mini) {
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
  :global(.video-preview-mini .lens) {
    width: 6px;
    height: 6px;
    background: #ff55bb;
    border-radius: 50%;
  }
  :global(.video-preview-mini .tape) {
    position: absolute;
    width: 10px;
    height: 10px;
    border: 2px solid #ff55bb;
    border-radius: 50%;
    top: -8px;
  }
  :global(.video-preview-mini .tape.t1) {
    left: -3px;
    animation: tapeRoll 2s infinite linear;
  }
  :global(.video-preview-mini .tape.t2) {
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

  :global(.qr-preview-mini) {
    position: relative;
    width: 20px;
    height: 20px;
    color: #00bfff;
  }
  :global(.qr-preview-mini .corner) {
    position: absolute;
    width: 5px;
    height: 5px;
    border: 2px solid #00bfff;
  }
  :global(.qr-preview-mini .corner.c1) {
    top: 0;
    left: 0;
  }
  :global(.qr-preview-mini .corner.c2) {
    top: 0;
    right: 0;
  }
  :global(.qr-preview-mini .corner.c3) {
    bottom: 0;
    left: 0;
  }

  :global(.terminal-preview-mini) {
    position: relative;
    width: 24px;
    height: 24px;
    background: #000;
    border: 1px solid #00ff66;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: monospace;
    font-size: 10px;
    color: #00ff66;
    overflow: hidden;
  }
  :global(.terminal-preview-mini .prompt-symbol) {
    margin-right: 2px;
  }
  :global(.terminal-preview-mini .cursor-blink) {
    width: 4px;
    height: 8px;
    background: #00ff66;
    animation: terminalCursorBlink 1s infinite steps(2);
  }
  @keyframes terminalCursorBlink {
    0%,
    100% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }

  :global(.blog-preview-mini) {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 28px;
    height: 28px;
    justify-content: center;
  }
  :global(.blog-preview-mini .line) {
    height: 2px;
    background: rgba(180, 85, 255, 0.4);
    border-radius: 1px;
    transition: all 0.3s ease;
  }
  :global(.blog-preview-mini .line.l1) {
    width: 24px;
    background: rgba(180, 85, 255, 0.9);
  }
  :global(.blog-preview-mini .line.l2) {
    width: 18px;
  }
  :global(.blog-preview-mini .line.l3) {
    width: 22px;
  }

  :global(.settings-preview-mini) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    transition: all 0.3s ease;
  }

  :global(.wiper-icon-container) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
  }
  :global(.wiper-blade-animate) {
    transform-origin: 50px 85px;
    animation: wiper-sweep 2.5s ease-in-out infinite alternate;
  }
  @keyframes wiper-sweep {
    0% {
      transform: rotate(-55deg);
    }
    100% {
      transform: rotate(55deg);
    }
  }

  /* ── Interactive hover / focused states mapped from parent .app-card ── */
  :global(.app-card:hover) :global(.blog-preview-mini .line),
  :global(.app-card.focused) :global(.blog-preview-mini .line) {
    background: #b455ff;
    box-shadow: 0 0 8px rgba(180, 85, 255, 0.8);
  }

  :global(.app-card:hover) :global(.settings-preview-mini svg),
  :global(.app-card.focused) :global(.settings-preview-mini svg) {
    color: var(--color-neon-red, #ff3344);
    filter: drop-shadow(
      0 0 8px rgba(var(--color-neon-red-rgb, 255, 51, 68), 0.8)
    );
  }

  :global(.app-card:hover) :global(.wiper-blade-animate),
  :global(.app-card.focused) :global(.wiper-blade-animate) {
    stroke: #00ffff;
    filter: drop-shadow(0 0 4px rgba(0, 255, 255, 0.8));
  }

  :global(.animate-spin-slow) {
    animation: spin-slow 8s linear infinite;
  }
  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
