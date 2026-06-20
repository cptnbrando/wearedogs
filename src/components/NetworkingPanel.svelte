<script>
  import { X, Play, RefreshCw, Radio, Terminal } from "lucide-svelte";
  import translations from "../lib/translations.js";

  let { isClosing = false, onClose } = $props();

  const langs = Object.keys(translations);

  // Networking statistics
  let latency = $state(12);
  let bandwidth = $state(4.8);
  let packetLoss = $state(0.00);
  let connectedPeers = $derived(langs.length);
  let isPinging = $state(false);

  // Log entries state
  let logs = $state([
    { id: 1, time: "08:12:04", type: "system", msg: "P2P network engine initialized." },
    { id: 2, time: "08:12:05", type: "connect", msg: "Connected to bootstrap peer [bootstrap.wearedogs.org]." },
    { id: 3, time: "08:12:05", type: "sync", msg: "Downloading language catalogs (247 locales loaded)." },
    { id: 4, time: "08:12:06", type: "info", msg: "Primary routing table synced. Status: OK." }
  ]);

  // Generate a random mock log
  const adjectives = ["Stable", "High-latency", "Encrypted", "Secondary", "Redundant"];
  const actions = ["synchronized", "validated", "pinged", "handshake completed", "metrics updated"];

  function generateRandomLog() {
    const timeStr = new Date().toLocaleTimeString();
    const randomCode = langs[Math.floor(Math.random() * langs.length)];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAct = actions[Math.floor(Math.random() * actions.length)];
    
    let type = "info";
    if (randomAct.includes("sync")) type = "sync";
    if (randomAct.includes("handshake")) type = "connect";
    
    return {
      id: Date.now(),
      time: timeStr,
      type,
      msg: `Node [${randomCode.toUpperCase()}] (${randomAdj}) ${randomAct}.`
    };
  }

  // Live simulation effect
  $effect(() => {
    const interval = setInterval(() => {
      // Simulate slight telemetry fluctuation
      latency = Math.max(8, Math.min(45, latency + (Math.random() * 4 - 2)));
      bandwidth = Math.max(2.1, Math.min(9.8, bandwidth + (Math.random() * 0.4 - 0.2)));
      
      // Randomly inject logs
      if (Math.random() > 0.4) {
        logs = [...logs.slice(-49), generateRandomLog()]; // Keep last 50
      }
    }, 1500);

    return () => clearInterval(interval);
  });

  // Action: Ping network
  function pingNetwork() {
    if (isPinging) return;
    isPinging = true;
    
    // Inject ping logs
    logs = [
      ...logs,
      { id: Date.now() + 1, time: new Date().toLocaleTimeString(), type: "system", msg: "Broadcasting multicast ping packet to all 247 peers..." }
    ];

    setTimeout(() => {
      logs = [
        ...logs,
        { id: Date.now() + 2, time: new Date().toLocaleTimeString(), type: "system", msg: `Multicast completed. 247/247 responses. Mean RTT: ${latency.toFixed(1)}ms.` }
      ];
      isPinging = false;
    }, 1000);
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="network-panel-backdrop" onclick={onClose}>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="network-panel-container"
    class:closing={isClosing}
    onclick={(e) => e.stopPropagation()}
  >
    <!-- Header -->
    <header class="panel-header">
      <div class="brand">
        <span class="pulse-dot"></span>
        <h1>Global Peer Syncer</h1>
        <span class="path-indicator">/ NETWORKING</span>
      </div>
      
      <button class="close-btn" onclick={onClose} aria-label="Close panel">
        <X size={20} />
      </button>
    </header>

    <!-- Content -->
    <div class="panel-body">
      <!-- Left side: Telemetry & Actions -->
      <div class="telemetry-col">
        <h2>Network Telemetry</h2>
        <p class="description">Live stats of local translation data propagation peers.</p>
        
        <div class="metrics-grid">
          <div class="telemetry-card">
            <span class="card-title">LATENCY</span>
            <span class="card-value">{latency.toFixed(0)} ms</span>
            <span class="card-trend text-green">⚡ OPTIMAL</span>
          </div>
          
          <div class="telemetry-card">
            <span class="card-title">BANDWIDTH</span>
            <span class="card-value">{bandwidth.toFixed(1)} MB/s</span>
            <span class="card-trend text-green">✦ STABLE</span>
          </div>

          <div class="telemetry-card">
            <span class="card-title">PACKET LOSS</span>
            <span class="card-value">{packetLoss.toFixed(2)}%</span>
            <span class="card-trend text-green">✓ SECURE</span>
          </div>

          <div class="telemetry-card">
            <span class="card-title">ACTIVE PEERS</span>
            <span class="card-value">{connectedPeers} / {connectedPeers}</span>
            <span class="card-trend text-green">● 100% ONLINE</span>
          </div>
        </div>

        <div class="actions-box">
          <h3>Network Actions</h3>
          <button class="action-btn" onclick={pingNetwork} disabled={isPinging}>
            <Radio size={16} class={isPinging ? "anim-pulse" : ""} />
            <span>{isPinging ? "PINGING PEERS..." : "PING ALL PEERS"}</span>
          </button>
          
          <button class="action-btn secondary" onclick={() => logs = []}>
            <RefreshCw size={16} />
            <span>CLEAR TERMINAL LOGS</span>
          </button>
        </div>

        <!-- Visual representation of nodes -->
        <div class="node-map-card">
          <h4>Peer Mesh Map</h4>
          <div class="mesh-grid">
            {#each Array(32) as _, i}
              <span
                class="node-dot"
                class:active={true}
                style="animation-delay: {i * 70}ms"
              ></span>
            {/each}
          </div>
        </div>
      </div>

      <!-- Right side: Terminal Logs -->
      <div class="terminal-col">
        <div class="terminal-header">
          <Terminal size={14} />
          <span>Sync Console Logs</span>
          <span class="terminal-indicator">● LIVE STREAMING</span>
        </div>
        
        <div class="terminal-body scroll-container">
          <div class="terminal-content">
            {#each logs as log (log.id)}
              <div class="log-line transition-log">
                <span class="log-time">[{log.time}]</span>
                <span class="log-tag tag-{log.type}">{log.type.toUpperCase()}</span>
                <span class="log-msg">{log.msg}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="panel-footer">
      <div class="sys-status">
        <span class="status-indicator-green"></span>
        <span>PEER MESH DISCOVERABLE</span>
      </div>
      <div class="stats-counter">
        <span>PORT: 5173</span>
        <span class="divider">|</span>
        <span>PROTOCOL: WAD-P2P/1.0</span>
      </div>
    </footer>
  </div>
</div>

<style>
  /* ── Backdrop ── */
  .network-panel-backdrop {
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
  .network-panel-container {
    width: 94vw;
    height: 90vh;
    max-width: 1280px;
    max-height: 850px;
    background: rgba(10, 10, 14, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    box-shadow: 0 32px 80px rgba(0, 0, 0, 0.7),
                inset 0 1px 0 rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    backdrop-filter: blur(15px) saturate(160%);
    -webkit-backdrop-filter: blur(15px) saturate(160%);
    animation: panelSlideUpIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transform-origin: center bottom;
  }

  .network-panel-container.closing {
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
    background: #00bfff;
    border-radius: 50%;
    box-shadow: 0 0 10px #00bfff;
    animation: pulseDot 2s infinite;
  }

  @keyframes pulseDot {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
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
    display: grid;
    grid-template-columns: 1.2fr 1.5fr;
    height: calc(100% - 64px - 40px);
    overflow: hidden;
  }

  /* Telemetry Column */
  .telemetry-col {
    padding: 24px;
    border-right: 1px solid rgba(255, 255, 255, 0.06);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.1);
  }

  .telemetry-col h2 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 700;
    color: white;
  }

  .description {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.45);
    margin: 4px 0 20px 0;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }

  .telemetry-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .card-title {
    font-size: 0.55rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.08em;
  }

  .card-value {
    font-size: 1.15rem;
    font-weight: 800;
    color: white;
    font-family: monospace;
  }

  .card-trend {
    font-size: 0.6rem;
    font-weight: 700;
  }

  .text-green {
    color: #00ff66;
    text-shadow: 0 0 8px rgba(0, 255, 102, 0.2);
  }

  .actions-box {
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .actions-box h3 {
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.85);
    margin: 0 0 4px 0;
    letter-spacing: 0.05em;
  }

  .action-btn {
    background: rgba(0, 191, 255, 0.15);
    border: 1px solid rgba(0, 191, 255, 0.3);
    color: #00bfff;
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.2s ease;
  }

  .action-btn:hover:not(:disabled) {
    background: rgba(0, 191, 255, 0.25);
    box-shadow: 0 0 15px rgba(0, 191, 255, 0.15);
  }

  .action-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .action-btn.secondary {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.7);
  }

  .action-btn.secondary:hover {
    background: rgba(255, 255, 255, 0.08);
    color: white;
  }

  .node-map-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 12px;
    padding: 16px;
    margin-top: auto;
  }

  .node-map-card h4 {
    margin: 0 0 12px 0;
    font-size: 0.8rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.85);
  }

  .mesh-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 8px;
    justify-items: center;
  }

  .node-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
  }

  .node-dot.active {
    background: #00bfff;
    box-shadow: 0 0 6px #00bfff;
    animation: blinkNode 2s infinite ease-in-out;
  }

  @keyframes blinkNode {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; transform: scale(1.1); }
  }

  .anim-pulse {
    animation: rotatePulse 1s infinite linear;
  }

  @keyframes rotatePulse {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
  }

  /* Terminal Column */
  .terminal-col {
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.3);
    height: 100%;
    overflow: hidden;
  }

  .terminal-header {
    height: 48px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    padding: 0 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: monospace;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.6);
  }

  .terminal-indicator {
    margin-left: auto;
    font-size: 0.65rem;
    color: #00ff66;
    font-weight: 700;
    letter-spacing: 0.05em;
  }

  .terminal-body {
    flex-grow: 1;
    overflow-y: auto;
    padding: 16px 20px;
  }

  .terminal-content {
    font-family: monospace;
    font-size: 0.78rem;
    display: flex;
    flex-direction: column;
    gap: 8px;
    line-height: 1.5;
  }

  .log-line {
    display: flex;
    gap: 8px;
    word-break: break-all;
  }

  .log-time {
    color: rgba(255, 255, 255, 0.25);
    flex-shrink: 0;
  }

  .log-tag {
    font-weight: bold;
    padding: 0 4px;
    border-radius: 3px;
    font-size: 0.68rem;
    flex-shrink: 0;
    line-height: 1.4;
  }

  .tag-system { background: rgba(0, 191, 255, 0.2); color: #00bfff; }
  .tag-connect { background: rgba(0, 255, 102, 0.2); color: #00ff66; }
  .tag-sync { background: rgba(255, 204, 0, 0.2); color: #ffcc00; }
  .tag-info { background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.6); }

  .log-msg {
    color: rgba(255, 255, 255, 0.85);
  }

  .transition-log {
    animation: logFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes logFadeIn {
    0% { transform: translateY(4px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
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
    font-family: system-ui, -apple-system, sans-serif;
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
</style>
