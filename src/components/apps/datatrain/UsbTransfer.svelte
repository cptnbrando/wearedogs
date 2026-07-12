<script>
  import { onMount } from "svelte";
  import { Usb, RefreshCw, CheckCircle, AlertCircle, Folder, HardDrive, File, Play } from "lucide-svelte";

  // App States: 'disconnected' | 'connected' | 'copying' | 'complete'
  let usbState = $state("disconnected");
  let fileInputEl = $state(null);
  let selectedFile = $state(null);
  let progress = $state(0);
  let isUsbSupported = $state(false);

  // USB Devices / Partitions lists
  let activeDeviceName = $state("");
  let selectedFolder = $state("/music");

  const partitions = [
    { label: "DOGG-DRIVE-D:", format: "FAT32", capacity: "14.9 GB Free" },
    { label: "RAP-MASS-STORE-E:", format: "exFAT", capacity: "118.2 GB Free" }
  ];
  let activePartitionIndex = $state(0);

  const folders = [
    "/music",
    "/backups",
    "/freestyles",
    "/documents",
    "/sys/dogs"
  ];

  onMount(() => {
    isUsbSupported = typeof navigator !== "undefined" && !!navigator.usb;
  });

  // Call WebUSB request to trigger native UI if available
  async function triggerWebUsbConnect() {
    if (isUsbSupported) {
      try {
        const device = await navigator.usb.requestDevice({ filters: [] });
        activeDeviceName = device.productName || "Mass Storage Device";
        usbState = "connected";
      } catch (err) {
        console.warn("Native WebUSB connection fail/cancel:", err);
        // Fallback to mock interface connection
        activeDeviceName = "DOGG-USB-STICK-V1";
        usbState = "connected";
      }
    } else {
      activeDeviceName = "MOCK-DOGG-DRIVE-V1";
      usbState = "connected";
    }
  }

  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      selectedFile = file;
    }
  }

  function startCopying() {
    if (!selectedFile) return;
    usbState = "copying";
    progress = 0;

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 18) + 6;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        playChime();
        usbState = "complete";
      }
    }, 200);
  }

  function playChime() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [329.63, 392.00, 523.25, 659.25]; // E4, G4, C5, E5
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + idx * 0.08 + 0.3);
        
        osc.start(audioCtx.currentTime + idx * 0.08);
        osc.stop(audioCtx.currentTime + idx * 0.08 + 0.3);
      });
    } catch (e) {
      console.error(e);
    }
  }

  function resetUsb() {
    usbState = "disconnected";
    selectedFile = null;
    progress = 0;
    activeDeviceName = "";
  }
</script>

<div class="usb-layout">
  <div class="usb-card">
    <div class="card-header">
      <Usb class="text-emerald-400 animate-pulse" size={18} />
      <h2>USB TRAIN INTERFACE</h2>
    </div>

    <!-- Active viewboard slates -->
    {#if usbState === "disconnected"}
      <div class="unconnected-slate">
        <Usb class="text-neutral-500 mb-2 animate-bounce" size={32} />
        <h3>USB BUS NOT DETECTED</h3>
        <p>Connect a physical USB mass storage device or virtual volume to synchronize.</p>
        
        <button class="connect-btn" onclick={triggerWebUsbConnect}>
          Connect USB Device
        </button>
      </div>

    {:else if usbState === "connected"}
      <div class="connected-slate">
        <div class="header-pill">
          <HardDrive size={13} />
          <span>Active: {activeDeviceName}</span>
        </div>

        <!-- Target Volume & Directory selector -->
        <div class="partition-block">
          <label for="partition-select" class="field-label">TARGET LOGICAL MOUNT</label>
          <select 
            id="partition-select"
            class="usb-select" 
            bind:value={activePartitionIndex}
          >
            {#each partitions as part, idx}
              <option value={idx}>{part.label} ({part.capacity}) - {part.format}</option>
            {/each}
          </select>
        </div>

        <div class="directory-block">
          <label for="directory-select" class="field-label">TARGET DIRECTORY</label>
          <select 
            id="directory-select"
            class="usb-select" 
            bind:value={selectedFolder}
          >
            {#each folders as folder}
              <option value={folder}>{folder}</option>
            {/each}
          </select>
        </div>

        <!-- File dispatcher selection -->
        <div class="uploader-box">
          {#if !selectedFile}
            <button class="select-file-btn" onclick={() => fileInputEl.click()}>
              <File size={16} />
              <span>Choose File to Write</span>
              <input 
                bind:this={fileInputEl}
                type="file" 
                onchange={handleFileSelect} 
                class="hidden-input" 
              />
            </button>
          {:else}
            <div class="staged-file">
              <span class="name">{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              <button class="clear" onclick={() => selectedFile = null}>✕</button>
            </div>

            <button class="write-btn" onclick={startCopying}>
              Mount & Write to {partitions[activePartitionIndex].label}{selectedFolder}
            </button>
          {/if}
        </div>
      </div>

    {:else if usbState === "copying"}
      <div class="copying-slate">
        {@render LoaderGlow()}
        <span class="status-label">Mounting block storage & flushing sector cache...</span>
        
        <div class="progress-bar-container">
          <div class="progress-fill" style="width: {progress}%"></div>
          <span class="pct">{progress}%</span>
        </div>
        
        <small>Flashing block indices...</small>
      </div>

    {:else if usbState === "complete"}
      <div class="complete-slate">
        <CheckCircle class="text-green-400 mb-2" size={36} />
        <h3>Sector Sync Complete</h3>
        <p class="summary">{selectedFile?.name} successfully written to {partitions[activePartitionIndex].label}{selectedFolder}</p>
        
        <button class="dismiss-btn" onclick={resetUsb}>Eject Device</button>
      </div>
    {/if}
  </div>
</div>

{#snippet LoaderGlow()}
  <div class="flex flex-col items-center justify-center mb-4">
    <div class="relative flex items-center justify-center">
      <div class="absolute w-12 h-12 rounded-full bg-emerald-500/20 blur-md animate-pulse"></div>
      <RefreshCw class="text-emerald-400 animate-spin relative z-10" size={28} />
    </div>
  </div>
{/snippet}

<style lang="scss">
  .usb-layout {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .usb-card {
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

  /* ── Slate states ── */
  .unconnected-slate {
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

    p {
      font-size: 0.65rem;
      color: rgba(255, 255, 255, 0.45);
      margin-bottom: 16px;
      max-width: 280px;
    }
  }

  .connect-btn {
    background: #10b981;
    color: #041d14;
    font-weight: 750;
    font-size: 0.72rem;
    padding: 8px 24px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);

    &:hover {
      box-shadow: 0 4px 18px rgba(16, 185, 129, 0.4);
    }
  }

  .connected-slate {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .header-pill {
    background: rgba(16, 185, 129, 0.05);
    border: 1px solid rgba(16, 185, 129, 0.15);
    padding: 6px 12px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
    align-self: center;
    font-size: 0.68rem;
    font-weight: 700;
    color: #10b981;
  }

  .field-label {
    font-size: 0.58rem;
    font-weight: 750;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.05em;
    margin-bottom: 4px;
    display: block;
  }

  .usb-select {
    width: 100%;
    background: rgba(0,0,0,0.25);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 6px;
    padding: 8px 10px;
    color: white;
    font-size: 0.72rem;
    cursor: pointer;
    outline: none;

    &:focus {
      border-color: #10b981;
    }
  }

  .uploader-box {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 6px;
  }

  .select-file-btn {
    background: rgba(255,255,255,0.01);
    border: 1px dashed rgba(255,255,255,0.15);
    border-radius: 6px;
    padding: 20px 10px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.55);
    font-weight: 700;
    font-size: 0.7rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    outline: none;

    &:hover {
      background: rgba(16, 185, 129, 0.03);
      border-color: #10b981;
      color: white;
    }
  }

  .hidden-input {
    display: none;
  }

  .staged-file {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .name {
      font-size: 0.72rem;
      color: white;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 280px;
    }

    .clear {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.4);
      cursor: pointer;

      &:hover {
        color: #ef4444;
      }
    }
  }

  .write-btn {
    background: linear-gradient(135deg, #10b981, #047857);
    color: #041d14;
    font-weight: 750;
    font-size: 0.75rem;
    padding: 10px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);

    &:hover {
      box-shadow: 0 4px 18px rgba(16, 185, 129, 0.35);
    }
  }

  .copying-slate {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;

    .status-label {
      font-size: 0.68rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 12px;
      text-align: center;
    }

    .progress-bar-container {
      width: 100%;
      height: 12px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 6px;
      position: relative;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .progress-fill {
      height: 100%;
      background: #10b981;
      transition: width 0.1s linear;
    }

    .pct {
      position: absolute;
      right: 8px;
      top: 0;
      font-size: 0.52rem;
      font-weight: 850;
      color: white;
    }

    small {
      font-size: 0.58rem;
      color: rgba(255, 255, 255, 0.35);
    }
  }

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

    .summary {
      font-size: 0.68rem;
      color: rgba(255, 255, 255, 0.45);
      margin-bottom: 20px;
      max-width: 280px;
    }

    .dismiss-btn {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: white;
      font-weight: 700;
      font-size: 0.72rem;
      padding: 8px 24px;
      border-radius: 6px;
      cursor: pointer;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    }
  }
</style>
