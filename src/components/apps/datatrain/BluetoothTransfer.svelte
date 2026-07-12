<script>
  import { onMount } from "svelte";
  import { Bluetooth, RefreshCw, Smartphone, CheckCircle, AlertCircle, Play, Square, Loader } from "lucide-svelte";

  // App States: 'idle' | 'scanning' | 'pairing' | 'connected' | 'transmitting' | 'complete'
  let btState = $state("idle");
  let fileInputEl = $state(null);
  let selectedFile = $state(null);
  let progress = $state(0);
  
  // Device list and pairing
  let mockDevices = $state([]);
  let activeDevice = $state(null);
  let pairCode = $state(0);

  // Web Bluetooth support
  let isBtSupported = $state(false);

  onMount(() => {
    isBtSupported = typeof navigator !== "undefined" && !!navigator.bluetooth;
  });

  // Start bluetooth scan mock
  function startScan() {
    btState = "scanning";
    mockDevices = [];
    
    // Simulate finding bluetooth nodes around
    setTimeout(() => {
      mockDevices = [
        { id: "dev_1", name: "IPHONE-DOGG-X", type: "phone", strength: "Strong" },
        { id: "dev_2", name: "FRIDGE-DOG-5A", type: "appliance", strength: "Moderate" },
        { id: "dev_3", name: "JACUZZI-BASS-7", type: "spa", strength: "Weak" },
        { id: "dev_4", name: "TOASTER-RAP-9", type: "appliance", strength: "Strong" }
      ];
      btState = "idle"; // Scan finished, show results
    }, 2500);
  }

  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      selectedFile = file;
    }
  }

  // Request actual device lookup if supported
  async function triggerNativeBluetooth() {
    if (isBtSupported) {
      try {
        const device = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ["device_information"]
        });
        activeDevice = {
          id: device.id,
          name: device.name || "Bluetooth Node",
          type: "phone",
          strength: "Strong"
        };
        startPairing();
      } catch (err) {
        console.warn("Native Bluetooth cancel/fail:", err);
      }
    } else {
      startScan();
    }
  }

  function selectDevice(device) {
    activeDevice = device;
    startPairing();
  }

  function startPairing() {
    btState = "pairing";
    pairCode = Math.floor(100000 + Math.random() * 900000);
  }

  function confirmPairing() {
    btState = "connected";
  }

  function startTransfer() {
    if (!selectedFile) return;
    btState = "transmitting";
    progress = 0;

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        playChime();
        btState = "complete";
      }
    }, 300);
  }

  function playChime() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [293.66, 349.23, 440.00, 587.33]; // D4, F4, A4, D5
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + idx * 0.1 + 0.35);
        
        osc.start(audioCtx.currentTime + idx * 0.1);
        osc.stop(audioCtx.currentTime + idx * 0.1 + 0.35);
      });
    } catch (e) {
      console.error(e);
    }
  }

  function resetTransfer() {
    btState = "idle";
    activeDevice = null;
    selectedFile = null;
    progress = 0;
    mockDevices = [];
  }
</script>

<div class="bt-layout">
  <div class="bt-card">
    <div class="card-header">
      <Bluetooth class="text-blue-400 animate-pulse" size={18} />
      <h2>BLUE TRAIN DISPATCH</h2>
    </div>

    <!-- Interface Workboard states -->
    {#if btState === "scanning"}
      <div class="radar-slate">
        <div class="radar-circle animate-ping"></div>
        <div class="radar-pulse"></div>
        <Loader class="animate-spin text-blue-400 mb-2" size={24} />
        <span>SCANNING LOCAL FREQUENCIES...</span>
        <small>Searching for secure Bluetooth receivers</small>
      </div>

    {:else if btState === "pairing"}
      <div class="pairing-slate">
        <Smartphone class="text-blue-400 mb-2" size={32} />
        <h3>SECURE CHANNEL VERIFICATION</h3>
        <p>Confirm matching pairing code on target device:</p>
        
        <div class="pair-code-block">
          {pairCode}
        </div>

        <div class="slate-actions">
          <button class="confirm-btn" onclick={confirmPairing}>Confirm Code</button>
          <button class="cancel-btn" onclick={resetTransfer}>Cancel</button>
        </div>
      </div>

    {:else if btState === "connected" || btState === "transmitting"}
      <div class="active-slate">
        <div class="connection-pill">
          <span class="active-dot"></span>
          <span>Linked: {activeDevice.name}</span>
        </div>

        {#if btState === "connected"}
          <div class="file-uploader-box">
            {#if !selectedFile}
              <button class="upload-area-btn" onclick={() => fileInputEl.click()}>
                <span>Choose File to Send</span>
                <input 
                  bind:this={fileInputEl}
                  type="file" 
                  onchange={handleFileSelect} 
                  class="hidden-input" 
                />
              </button>
            {:else}
              <div class="staged-file-card">
                <span class="file-label">{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                <button class="remove" onclick={() => selectedFile = null}>✕</button>
              </div>

              <button class="dispatch-trigger" onclick={startTransfer}>
                Start Bluetooth Transfer
              </button>
            {/if}
          </div>
        {:else}
          <!-- Transmitting state progress -->
          <div class="transfer-dashboard">
            <span class="status-label">Pushing bytes over RFCOMM...</span>
            <div class="bar-track">
              <div class="bar-fill" style="width: {progress}%"></div>
              <span class="percent-label">{progress}%</span>
            </div>
            <small>Optimal bit rate throttled by Bluetooth protocol limits.</small>
          </div>
        {/if}
      </div>

    {:else if btState === "complete"}
      <div class="complete-slate">
        <CheckCircle class="text-green-400 mb-2" size={36} />
        <h3>Data Dispatched Successfully</h3>
        <p class="file-info">{selectedFile?.name}</p>
        <button class="finish-btn" onclick={resetTransfer}>Finish Connection</button>
      </div>

    {:else}
      <!-- Idle Search List -->
      <div class="idle-slate">
        <div class="action-bar-top">
          <button class="scan-trigger-btn" onclick={triggerNativeBluetooth}>
            <Bluetooth size={14} /> Scan for Receivers
          </button>
        </div>

        {#if mockDevices.length > 0}
          <div class="devices-scroller">
            <span class="section-title-label">NEARBY BLUETOOTH NODES</span>
            <div class="devices-list">
              {#each mockDevices as dev}
                <button class="device-row" onclick={() => selectDevice(dev)}>
                  <div class="row-left">
                    <Smartphone size={14} class="text-neutral-400" />
                    <span class="dev-name">{dev.name}</span>
                  </div>
                  <span class="dev-strength" class:strong-sig={dev.strength === "Strong"}>{dev.strength} Signal</span>
                </button>
              {/each}
            </div>
          </div>
        {:else}
          <div class="empty-results">
            <Smartphone class="text-neutral-600 mb-2" size={28} />
            <span>Search block empty</span>
            <small>Activate receivers in nearby proximity and click Scan above.</small>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  .bt-layout {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .bt-card {
    background: rgba(13, 13, 23, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 18px;
    width: 100%;
    max-width: 440px;
    min-height: 280px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    padding-bottom: 8px;

    h2 {
      font-size: 0.85rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin: 0;
      color: white;
    }
  }

  /* ── Radars & Slates ── */
  .radar-slate {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    padding: 20px;

    span {
      font-size: 0.72rem;
      font-weight: 750;
      color: #e2e8f0;
      margin-top: 10px;
    }

    small {
      font-size: 0.6rem;
      color: rgba(255, 255, 255, 0.4);
    }
  }

  .radar-circle {
    position: absolute;
    width: 80px;
    height: 80px;
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 50%;
  }

  .pairing-slate {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 10px;

    h3 {
      font-size: 0.8rem;
      font-weight: 750;
      color: white;
      margin: 4px 0;
    }

    p {
      font-size: 0.68rem;
      color: rgba(255, 255, 255, 0.55);
      margin-bottom: 12px;
    }
  }

  .pair-code-block {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 8px;
    font-size: 1.8rem;
    font-weight: 800;
    color: #3b82f6;
    letter-spacing: 0.1em;
    padding: 10px 24px;
    margin-bottom: 18px;
    box-shadow: 0 0 16px rgba(59, 130, 246, 0.1);
  }

  .slate-actions {
    display: flex;
    gap: 12px;

    button {
      border: none;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.72rem;
      padding: 8px 16px;
      cursor: pointer;
      outline: none;
    }

    .confirm-btn {
      background: #3b82f6;
      color: white;
    }

    .cancel-btn {
      background: rgba(255, 255, 255, 0.05);
      color: #cbd5e1;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
  }

  /* ── Active connection slate ── */
  .active-slate {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .connection-pill {
    background: rgba(74, 222, 128, 0.05);
    border: 1px solid rgba(74, 222, 128, 0.15);
    padding: 6px 12px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    align-self: center;
    font-size: 0.68rem;
    font-weight: 700;
    color: #4ade80;
  }

  .active-dot {
    width: 6px;
    height: 6px;
    background: #4ade80;
    border-radius: 50%;
    box-shadow: 0 0 6px #4ade80;
  }

  .file-uploader-box {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .upload-area-btn {
    background: rgba(255, 255, 255, 0.01);
    border: 1px dashed rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    padding: 30px 10px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 700;
    font-size: 0.72rem;
    outline: none;
    transition: all 0.2s;

    &:hover {
      background: rgba(59, 130, 246, 0.03);
      border-color: #3b82f6;
      color: white;
    }
  }

  .hidden-input {
    display: none;
  }

  .staged-file-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .file-label {
      font-size: 0.72rem;
      color: #f1f5f9;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 280px;
    }

    .remove {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      font-size: 0.72rem;

      &:hover {
        color: #ef4444;
      }
    }
  }

  .dispatch-trigger {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    font-weight: 750;
    font-size: 0.75rem;
    padding: 10px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);

    &:hover {
      box-shadow: 0 4px 18px rgba(59, 130, 246, 0.35);
    }
  }

  .transfer-dashboard {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    padding: 10px;

    .status-label {
      font-size: 0.68rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.55);
    }

    .bar-track {
      width: 100%;
      height: 12px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 6px;
      position: relative;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      background: #3b82f6;
      transition: width 0.15s;
    }

    .percent-label {
      position: absolute;
      right: 8px;
      top: 0;
      font-size: 0.52rem;
      font-weight: 850;
      color: white;
    }

    small {
      font-size: 0.58rem;
      color: rgba(255, 255, 255, 0.3);
    }
  }

  /* ── Completion slate ── */
  .complete-slate {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 20px;

    h3 {
      font-size: 0.82rem;
      font-weight: 750;
      color: white;
      margin: 4px 0;
    }

    .file-info {
      font-size: 0.68rem;
      color: rgba(255, 255, 255, 0.4);
      margin-bottom: 20px;
    }

    .finish-btn {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: white;
      font-weight: 700;
      font-size: 0.72rem;
      padding: 8px 24px;
      border-radius: 6px;
      cursor: pointer;
    }
  }

  /* ── Idle list slate ── */
  .idle-slate {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .action-bar-top {
    display: flex;
    justify-content: flex-end;
  }

  .scan-trigger-btn {
    background: #3b82f6;
    color: white;
    font-weight: 700;
    font-size: 0.68rem;
    padding: 6px 12px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .devices-scroller {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .section-title-label {
    font-size: 0.58rem;
    font-weight: 750;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.05em;
  }

  .devices-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: 160px;
    overflow-y: auto;
  }

  .device-row {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 6px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: all 0.2s;
    outline: none;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(59, 130, 246, 0.25);
    }
  }

  .row-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .dev-name {
    font-size: 0.72rem;
    font-weight: 700;
    color: white;
  }

  .dev-strength {
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.4);

    &.strong-sig {
      color: #3b82f6;
    }
  }

  .empty-results {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 30px 10px;
    color: rgba(255, 255, 255, 0.35);

    span {
      font-size: 0.68rem;
      font-weight: 700;
    }

    small {
      font-size: 0.58rem;
      color: rgba(255, 255, 255, 0.25);
      max-width: 220px;
      margin-top: 2px;
    }
  }
</style>
