<script>
  import { onMount, onDestroy } from "svelte";
  import QRCode from "qrcode";
  import jsQR from "jsqr";
  import { 
    Upload, Play, Square, RefreshCw, Camera, Download, FileText, CheckCircle, Clock, Zap, Cpu
  } from "lucide-svelte";

  // App States: 'idle' | 'transmitting' | 'receiving' | 'complete'
  let transferMode = $state("idle"); // 'idle' | 'transmit' | 'receive'
  
  // Transmitter State
  let transmitterCanvas = $state(null);
  let textInput = $state("");
  let uploadedFile = $state(null);
  let transmitterStatus = $state("ready"); // 'ready' | 'countdown' | 'playing' | 'paused' | 'done'
  let countdown = $state(3);
  let framesPerSecond = $state(12); // Speed: 5 to 30 FPS
  let currentFrameIndex = $state(0);
  let totalFrames = $derived(txPackets.length);
  let txPackets = $state([]);
  let currentFileId = $state("");

  // Receiver State
  let receiverVideo = $state(null);
  let receiverCanvas = $state(null);
  let isCameraActive = $state(false);
  let cameraStream = null;
  let scanInterval = null;
  let loopbackActive = $state(false);
  let loopbackFrameRequest = null;
  
  // Received packets buffer
  let receivedFileId = $state("");
  let receivedFileName = $state("");
  let receivedFileType = $state("");
  let rxBuffer = $state([]); // Array of strings (base64 chunks)
  let rxCount = $derived(rxBuffer.filter(Boolean).length);
  let rxProgress = $derived(rxTotal > 0 ? Math.round((rxCount / rxTotal) * 100) : 0);
  let rxTotal = $state(0);
  
  // Stats
  let transferStartTime = $state(null);
  let transferDuration = $state(0); // in ms
  let finalFileBlob = $state(null);
  let finalFileSize = $state(0);
  let averageSpeed = $state(0); // bytes / sec

  // Chunking configuration
  const CHUNK_SIZE = 180; // Bytes of base64 data per QR frame to maintain low density (quick reading)

  // Web Audio Success Chime
  function playSuccessChime() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.1);
        
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + idx * 0.1 + 0.3);
        
        osc.start(audioCtx.currentTime + idx * 0.1);
        osc.stop(audioCtx.currentTime + idx * 0.1 + 0.3);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // File Upload Handlers
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    uploadedFile = file;
    textInput = ""; // clear text
    prepareChunks();
  }

  function handleTextInput() {
    uploadedFile = null;
    if (textInput.trim().length > 0) {
      prepareChunks();
    } else {
      txPackets = [];
    }
  }

  // Package generator
  function prepareChunks() {
    let payload = "";
    let fileName = "text_message.txt";
    let fileType = "text/plain";
    
    if (uploadedFile) {
      fileName = uploadedFile.name;
      fileType = uploadedFile.type || "application/octet-stream";
      
      const reader = new FileReader();
      reader.onload = function(e) {
        const binary = e.target.result;
        // Convert to base64
        const base64 = btoa(
          new Uint8Array(binary).reduce((data, byte) => data + String.fromCharCode(byte), "")
        );
        generatePackets(base64, fileName, fileType);
      };
      reader.readAsArrayBuffer(uploadedFile);
    } else {
      // Encode standard text
      payload = btoa(unescape(encodeURIComponent(textInput)));
      generatePackets(payload, fileName, fileType);
    }
  }

  function generatePackets(base64Payload, name, type) {
    currentFileId = Math.floor(1000 + Math.random() * 9000).toString();
    const cleanName = btoa(name); // safe encode filename
    const total = Math.ceil(base64Payload.length / CHUNK_SIZE);
    
    const packets = [];
    for (let i = 0; i < total; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, base64Payload.length);
      const chunk = base64Payload.slice(start, end);
      // Format: QRF|[fileId]|[fileType]|[fileName]|[index]|[total]|[chunk]
      packets.push(`QRF|${currentFileId}|${type}|${cleanName}|${i}|${total}|${chunk}`);
    }
    txPackets = packets;
    currentFrameIndex = 0;
  }

  // Transmitter Core Loop
  let txInterval = null;
  
  function startTransmission() {
    if (txPackets.length === 0) return;
    transmitterStatus = "countdown";
    countdown = 3;
    
    const countTimer = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(countTimer);
        transmitterStatus = "playing";
        runTxLoop();
      }
    }, 1000);
  }

  function runTxLoop() {
    if (txInterval) clearInterval(txInterval);
    txInterval = setInterval(() => {
      if (transmitterStatus !== "playing") return;
      
      renderQRFrame();
      
      currentFrameIndex++;
      if (currentFrameIndex >= txPackets.length) {
        currentFrameIndex = 0; // loop forever so camera has time to catch up
      }
    }, 1000 / framesPerSecond);
  }

  function renderQRFrame() {
    if (!transmitterCanvas || txPackets.length === 0) return;
    const packet = txPackets[currentFrameIndex];
    QRCode.toCanvas(
      transmitterCanvas, 
      packet, 
      { 
        margin: 2, 
        scale: 6,
        color: {
          dark: "#000000",
          light: "#ffffff"
        }
      }, 
      (err) => {
        if (err) console.error(err);
      }
    );
  }

  function pauseTransmission() {
    transmitterStatus = "paused";
    if (txInterval) {
      clearInterval(txInterval);
      txInterval = null;
    }
  }

  function stopTransmission() {
    transmitterStatus = "ready";
    currentFrameIndex = 0;
    if (txInterval) {
      clearInterval(txInterval);
      txInterval = null;
    }
  }

  // Camera Reader Setup
  async function startCamera() {
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      if (receiverVideo) {
        receiverVideo.srcObject = cameraStream;
        receiverVideo.setAttribute("playsinline", true); // iOS compatibility
        receiverVideo.play();
        isCameraActive = true;
        startScanning();
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      alert("webcam access denied or unavailable. You can use the local loopback demo instead.");
    }
  }

  function stopCamera() {
    isCameraActive = false;
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
    if (scanInterval) {
      clearInterval(scanInterval);
      scanInterval = null;
    }
  }

  // Camera Scanning Loop
  function startScanning() {
    if (scanInterval) clearInterval(scanInterval);
    scanInterval = setInterval(() => {
      if (!isCameraActive || !receiverVideo || !receiverCanvas) return;
      
      const ctx = receiverCanvas.getContext("2d");
      receiverCanvas.width = receiverVideo.videoWidth;
      receiverCanvas.height = receiverVideo.videoHeight;
      
      if (receiverCanvas.width > 0 && receiverCanvas.height > 0) {
        ctx.drawImage(receiverVideo, 0, 0, receiverCanvas.width, receiverCanvas.height);
        const imgData = ctx.getImageData(0, 0, receiverCanvas.width, receiverCanvas.height);
        const code = jsQR(imgData.data, imgData.width, imgData.height);
        if (code) {
          processDecodedQR(code.data);
        }
      }
    }, 45); // ~22 scans per second
  }

  // Loopback (In-memory loop loop)
  function toggleLoopback() {
    loopbackActive = !loopbackActive;
    if (loopbackActive) {
      transferStartTime = Date.now();
      runLoopbackFrame();
    } else {
      if (loopbackFrameRequest) {
        cancelAnimationFrame(loopbackFrameRequest);
        loopbackFrameRequest = null;
      }
    }
  }

  function runLoopbackFrame() {
    if (!loopbackActive) return;
    
    // Copy the transmitter's canvas content directly to the reader
    if (transmitterCanvas && transmitterStatus === "playing") {
      const ctx = transmitterCanvas.getContext("2d");
      const imgData = ctx.getImageData(0, 0, transmitterCanvas.width, transmitterCanvas.height);
      const code = jsQR(imgData.data, imgData.width, imgData.height);
      if (code) {
        processDecodedQR(code.data);
      }
    }
    
    loopbackFrameRequest = requestAnimationFrame(runLoopbackFrame);
  }

  // Packet Decoder
  function processDecodedQR(qrText) {
    if (!qrText.startsWith("QRF|")) return;
    
    const parts = qrText.split("|");
    if (parts.length < 7) return;
    
    const [_, fileId, fileType, encodedName, frameIndexStr, totalFramesStr, chunkData] = parts;
    const frameIndex = parseInt(frameIndexStr);
    const total = parseInt(totalFramesStr);
    
    // Check if we are receiving a new transmission
    if (receivedFileId !== fileId) {
      // Start of a new download
      receivedFileId = fileId;
      receivedFileType = fileType;
      try {
        receivedFileName = atob(encodedName);
      } catch {
        receivedFileName = "downloaded_file";
      }
      
      rxTotal = total;
      rxBuffer = new Array(total).fill(null);
      transferStartTime = Date.now();
      transferDuration = 0;
    }
    
    // Store in buffer if we haven't already received it
    if (rxBuffer[frameIndex] === null) {
      rxBuffer[frameIndex] = chunkData;
      
      // Check if complete
      if (rxBuffer.filter(Boolean).length === rxTotal) {
        completeTransfer();
      }
    }
  }

  function completeTransfer() {
    transferDuration = Date.now() - transferStartTime;
    playSuccessChime();
    
    // Reassemble payload
    const assembledBase64 = rxBuffer.join("");
    
    // Convert base64 back to binary Blob
    try {
      const binaryStr = atob(assembledBase64);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      
      finalFileBlob = new Blob([bytes], { type: receivedFileType });
      finalFileSize = finalFileBlob.size;
      
      // Calculate statistics
      const secs = transferDuration / 1000 || 0.1;
      averageSpeed = Math.round(finalFileSize / secs);
      
      // Stop looping transmitters or loopback modes
      loopbackActive = false;
      if (loopbackFrameRequest) cancelAnimationFrame(loopbackFrameRequest);
      
      transferMode = "complete";
      transmitterStatus = "done";
      if (txInterval) {
        clearInterval(txInterval);
        txInterval = null;
      }
    } catch (e) {
      console.error("Data reassembly failed:", e);
      alert("Failed to reconstruct file binary data. Check sum/format errors.");
    }
  }

  function resetReceiver() {
    receivedFileId = "";
    receivedFileName = "";
    receivedFileType = "";
    rxTotal = 0;
    rxBuffer = [];
    finalFileBlob = null;
    finalFileSize = 0;
    averageSpeed = 0;
    transferMode = "idle";
    loopbackActive = false;
    if (loopbackFrameRequest) cancelAnimationFrame(loopbackFrameRequest);
  }

  function triggerDownload() {
    if (!finalFileBlob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(finalFileBlob);
    a.download = receivedFileName;
    a.click();
  }

  function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  onDestroy(() => {
    stopCamera();
    if (txInterval) clearInterval(txInterval);
    if (loopbackFrameRequest) cancelAnimationFrame(loopbackFrameRequest);
  });
</script>

<div class="qrflash-layout animated-pane">
  <!-- Mode selector top bar -->
  <header class="flash-header">
    <div class="header-branding">
      <span class="flash-pulse-dot"></span>
      <h1>QRFlash visual transfer</h1>
    </div>
    
    <div class="mode-toggles">
      <button 
        class="mode-btn" 
        class:active={transferMode === "transmit" || (transferMode === "idle" && rxTotal === 0)}
        onclick={() => { 
          transferMode = "idle"; 
          stopCamera();
          loopbackActive = false;
        }}
      >
        Transmitter View
      </button>
      <button 
        class="mode-btn" 
        class:active={transferMode === "receive" || transferMode === "complete"}
        onclick={() => {
          transferMode = "receive";
          startCamera();
        }}
      >
        Receiver Canvas
      </button>
    </div>
  </header>

  <!-- Core split screen work boards -->
  <div class="workspace-split">
    <!-- LEFT SIDE: Transmitter -->
    <div class="pane transmitter-pane" class:faded={transferMode === "receive" || transferMode === "complete"}>
      <div class="pane-tag"><Zap size={12} /> DATAFEED TRANSMITTER</div>

      <!-- File upload & text area configuration box -->
      <div class="upload-control-panel">
        <div class="upload-options">
          <label class="file-drop-target">
            <Upload size={20} />
            <span>Upload File (Any Type)</span>
            <input type="file" onchange={handleFileSelect} class="hidden-file-input" />
          </label>
          <div class="text-or-divider">OR</div>
          <textarea 
            placeholder="Type text message or quick URL to flash..." 
            bind:value={textInput}
            oninput={handleTextInput}
            class="text-flash-area"
          ></textarea>
        </div>

        <!-- File details -->
        {#if uploadedFile}
          <div class="loaded-file-meta">
            <FileText size={14} color="#00ff66" />
            <span class="meta-name">{uploadedFile.name} ({formatBytes(uploadedFile.size)})</span>
            <button class="clear-file" onclick={() => { uploadedFile = null; txPackets = []; }}>✕</button>
          </div>
        {/if}
      </div>

      <!-- Flash configuration and controls -->
      <div class="flash-workbench">
        <div class="speed-slider-box">
          <label for="fps-range">FLASH VELOCITY: {framesPerSecond} FPS</label>
          <input 
            id="fps-range" 
            type="range" 
            min="5" 
            max="30" 
            step="1" 
            bind:value={framesPerSecond}
            onchange={() => { if (transmitterStatus === "playing") runTxLoop(); }}
            class="speed-slider"
          />
        </div>

        <div class="control-actions-row">
          {#if transmitterStatus === "ready" || transmitterStatus === "done"}
            <button class="action-btn play-btn" onclick={startTransmission} disabled={txPackets.length === 0}>
              <Play size={14} /> Start Flashing
            </button>
          {:else if transmitterStatus === "playing"}
            <button class="action-btn pause-btn" onclick={pauseTransmission}>
              <Square size={14} /> Pause Flash
            </button>
          {:else if transmitterStatus === "paused"}
            <button class="action-btn play-btn" onclick={() => { transmitterStatus = "playing"; runTxLoop(); }}>
              <Play size={14} /> Resume Flash
            </button>
          {/if}
          
          <button class="action-btn stop-btn" onclick={stopTransmission} disabled={transmitterStatus === "ready"}>
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </div>

      <!-- Transmitter Visual canvas projection area -->
      <div class="screen-canvas-box">
        {#if transmitterStatus === "countdown"}
          <div class="countdown-overlay">
            <span class="count-num">{countdown}</span>
            <span class="count-tag">SYNCHRONIZING RECEIVER...</span>
          </div>
        {/if}

        <canvas bind:this={transmitterCanvas} width="320" height="320" class="qr-canvas-element"></canvas>
        
        <div class="tx-stats">
          <span>PACKETS READY: {txPackets.length}</span>
          <span class="tx-frame-cnt">CURRENT FRAME: {currentFrameIndex + 1} / {txPackets.length || 1}</span>
        </div>
      </div>
    </div>

    <!-- RIGHT SIDE: Receiver & Reassembler -->
    <div class="pane receiver-pane" class:faded={transferMode === "idle" && rxTotal === 0}>
      <div class="pane-tag"><Camera size={12} /> PHOTON SCANNER RECEIVER</div>

      <!-- Loops camera or loopback options -->
      <div class="receiver-controls-bar">
        <div class="btn-group">
          {#if !isCameraActive}
            <button class="rec-control-btn" onclick={startCamera}>
              <Camera size={14} /> Start Webcam
            </button>
          {:else}
            <button class="rec-control-btn active" onclick={stopCamera}>
              <Square size={14} /> Stop Webcam
            </button>
          {/if}

          <button class="rec-control-btn reset-r" onclick={resetReceiver}>
            <RefreshCw size={14} /> Reset Receiver
          </button>
        </div>

        <!-- Loopback Demo mode WOW switch -->
        <button 
          class="loopback-demo-toggle"
          class:active={loopbackActive}
          onclick={toggleLoopback}
        >
          <Cpu size={14} /> {loopbackActive ? "Loopback Active" : "Start Local Loopback (60fps)"}
        </button>
      </div>

      <!-- Camera Feed / Decoder screen -->
      <div class="receiver-camera-frame">
        <!-- Hidden canvas for image analysis -->
        <canvas bind:this={receiverCanvas} class="hidden-scan-canvas"></canvas>
        
        <!-- Video feedback -->
        <!-- svelte-ignore a11y_media_has_caption -->
        <video 
          bind:this={receiverVideo}
          class="video-feed"
          class:hidden={loopbackActive || !isCameraActive}
        ></video>

        {#if loopbackActive}
          <div class="loopback-hud">
            <div class="scanning-lines"></div>
            <span>IN-MEMORY BUS STREAM ACTIVE</span>
            <small>Looping left transmitter output directly into the reader at high frame rate.</small>
          </div>
        {:else if !isCameraActive}
          <div class="loopback-hud camera-inactive">
            <span>WEBCAM STREAM INACTIVE</span>
            <small>Turn on webcam or enable the 60fps local loopback demo above to begin.</small>
          </div>
        {/if}
      </div>

      <!-- Assembly indicators grid matrix -->
      <div class="assembly-workbench">
        <div class="assembly-meta">
          <div class="rx-file-details">
            <span class="file-name-label">{receivedFileName || "Awaiting signal..."}</span>
            {#if rxTotal > 0}
              <span class="file-packets-count">{rxCount} / {rxTotal} packets received</span>
            {/if}
          </div>
          
          <div class="rx-progress-bar-container">
            <div class="rx-progress-fill" style="width: {rxProgress}%"></div>
            <span class="progress-pct">{rxProgress}%</span>
          </div>
        </div>

        <!-- Glowing Status grid -->
        <div class="matrix-grid-outer">
          {#if rxTotal === 0}
            <div class="empty-matrix">
              🔴 READY TO RECEIVE FLASH LIGHT DATAFEED
            </div>
          {:else}
            <div class="matrix-grid">
              {#each rxBuffer as packet, idx}
                <div 
                  class="matrix-cell" 
                  class:filled={packet !== null}
                  title="Frame {idx+1}"
                ></div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <!-- Complete overlay -->
  {#if transferMode === "complete"}
    <div class="complete-fullscreen-overlay">
      <div class="complete-modal">
        <div class="complete-badge"><CheckCircle size={38} /></div>
        <h2>Visual Transfer Stable</h2>
        <p class="complete-file-info">{receivedFileName} ({formatBytes(finalFileSize)})</p>
        
        <div class="stats-grid-modal">
          <div class="stat-cell">
            <span class="s-label"><Clock size={12} /> TRANSFER DURATION</span>
            <span class="s-val">{((transferDuration) / 1000).toFixed(2)}s</span>
          </div>
          <div class="stat-cell">
            <span class="s-label"><Zap size={12} /> AVERAGE BANDWIDTH</span>
            <span class="s-val">{formatBytes(averageSpeed)}/s</span>
          </div>
        </div>

        <div class="modal-buttons">
          <button class="modal-btn download-btn" onclick={triggerDownload}>
            <Download size={14} /> Download File
          </button>
          <button class="modal-btn dismiss-btn" onclick={resetReceiver}>
            Done
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .qrflash-layout {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #09090d;
    overflow: hidden;
  }

  /* ── Header ── */
  .flash-header {
    height: 52px;
    padding: 0 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(0, 0, 0, 0.3);
  }

  .header-branding {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .flash-pulse-dot {
    width: 8px;
    height: 8px;
    background: #00bfff;
    border-radius: 50%;
    box-shadow: 0 0 8px #00bfff;
    animation: flashDot 1.5s infinite alternate;
  }

  .header-branding h1 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: white;
  }

  .mode-toggles {
    display: flex;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 6px;
    overflow: hidden;
  }

  .mode-btn {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.72rem;
    font-weight: 700;
    padding: 6px 14px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .mode-btn.active {
    background: rgba(255, 255, 255, 0.08);
    color: white;
  }

  /* ── Split screen workspace ── */
  .workspace-split {
    flex-grow: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: calc(100% - 52px);
    overflow: hidden;
  }

  .pane {
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 16px;
    overflow-y: auto;
    height: 100%;
    transition: opacity 0.3s, filter 0.3s;
  }

  .pane.faded {
    opacity: 0.15;
    filter: blur(8px) grayscale(0.5);
    pointer-events: none;
  }

  .transmitter-pane {
    border-right: 1px solid rgba(255, 255, 255, 0.05);
  }

  .pane-tag {
    font-size: 0.58rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.08em;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* ── Upload Box ── */
  .upload-control-panel {
    background: rgba(255, 255, 255, 0.01);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 12px;
  }

  .upload-options {
    display: grid;
    grid-template-columns: 140px 30px 1fr;
    gap: 12px;
    align-items: center;
  }

  .file-drop-target {
    background: rgba(255, 255, 255, 0.02);
    border: 1px dashed rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    padding: 16px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.55);
    transition: all 0.2s;
  }

  .file-drop-target:hover {
    background: rgba(0, 191, 255, 0.04);
    border-color: #00bfff;
    color: #00bfff;
  }

  .hidden-file-input {
    display: none;
  }

  .text-or-divider {
    font-size: 0.65rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.2);
    text-align: center;
  }

  .text-flash-area {
    background: #0d0d12;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    color: white;
    font-size: 0.78rem;
    padding: 10px;
    resize: none;
    height: 76px;
  }

  .loaded-file-meta {
    margin-top: 10px;
    background: rgba(0, 255, 102, 0.05);
    border: 1px solid rgba(0, 255, 102, 0.15);
    border-radius: 6px;
    padding: 6px 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.72rem;
  }


  .loaded-file-meta .meta-name {
    flex-grow: 1;
    color: rgba(255, 255, 255, 0.85);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .clear-file {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
  }

  /* ── Flash controls ── */
  .flash-workbench {
    background: rgba(255, 255, 255, 0.01);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .speed-slider-box {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .speed-slider-box label {
    font-size: 0.65rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.35);
  }

  .speed-slider {
    width: 100%;
    accent-color: #00bfff;
  }

  .control-actions-row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 10px;
  }

  .action-btn {
    border: none;
    border-radius: 8px;
    padding: 10px;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
  }

  .action-btn.play-btn {
    background: #00bfff;
    color: black;
  }

  .action-btn.play-btn:hover:not(:disabled) {
    box-shadow: 0 4px 15px rgba(0, 191, 255, 0.3);
    transform: translateY(-1px);
  }

  .action-btn.play-btn:disabled {
    background: rgba(255, 255, 255, 0.04);
    color: rgba(255, 255, 255, 0.15);
    cursor: not-allowed;
  }

  .action-btn.pause-btn {
    background: rgba(255, 51, 68, 0.15);
    border: 1px solid rgba(255, 51, 68, 0.3);
    color: #ff3344;
  }

  .action-btn.pause-btn:hover {
    background: rgba(255, 51, 68, 0.25);
  }

  .action-btn.stop-btn {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: white;
  }

  .action-btn.stop-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
  }

  /* ── Canvas projection ── */
  .screen-canvas-box {
    position: relative;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    flex-grow: 1;
    overflow: hidden;
  }

  .qr-canvas-element {
    background: white;
    border: 8px solid white;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
    max-width: 200px;
    max-height: 200px;
  }

  .countdown-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(9, 9, 13, 0.95);
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .count-num {
    font-size: 5rem;
    font-weight: 800;
    color: #00bfff;
    text-shadow: 0 0 30px rgba(0, 191, 255, 0.4);
    animation: zoomPulse 1s infinite alternate;
  }

  @keyframes zoomPulse {
    0% { transform: scale(0.9); }
    100% { transform: scale(1.1); }
  }

  .count-tag {
    font-size: 0.65rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.45);
    letter-spacing: 0.1em;
  }

  .tx-stats {
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 0.65rem;
    font-family: monospace;
    color: rgba(255, 255, 255, 0.35);
    margin-top: 16px;
  }

  /* ── Receiver Pane ── */
  .receiver-controls-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .rec-control-btn {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: white;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 0.72rem;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
  }

  .rec-control-btn:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  .rec-control-btn.active {
    background: rgba(0, 255, 102, 0.12);
    border-color: rgba(0, 255, 102, 0.3);
    color: #00ff66;
  }

  .loopback-demo-toggle {
    background: rgba(255, 85, 187, 0.05);
    border: 1px solid rgba(255, 85, 187, 0.2);
    color: rgba(255, 85, 187, 0.8);
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 0.72rem;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
  }

  .loopback-demo-toggle:hover {
    background: rgba(255, 85, 187, 0.12);
  }

  .loopback-demo-toggle.active {
    background: #ff55bb;
    color: white;
    border-color: #ff55bb;
    box-shadow: 0 0 15px rgba(255, 85, 187, 0.3);
  }

  .receiver-camera-frame {
    position: relative;
    background: black;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .video-feed {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hidden-scan-canvas {
    display: none;
  }

  .loopback-hud {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(9, 9, 13, 0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    text-align: center;
    color: #ff55bb;
    font-family: monospace;
  }

  .loopback-hud span {
    font-weight: 700;
    font-size: 0.78rem;
    margin-bottom: 6px;
  }

  .loopback-hud small {
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.65rem;
    line-height: 1.4;
    max-width: 240px;
  }

  .loopback-hud.camera-inactive {
    color: rgba(255, 255, 255, 0.3);
  }

  .scanning-lines {
    position: absolute;
    width: 100%;
    height: 2px;
    background: rgba(255, 85, 187, 0.5);
    box-shadow: 0 0 8px #ff55bb;
    top: 0;
    animation: scanLine 2s infinite linear;
  }

  @keyframes scanLine {
    0% { top: 0; }
    100% { top: 100%; }
  }

  /* ── Assembly grid matrix ── */
  .assembly-workbench {
    background: rgba(255, 255, 255, 0.01);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 12px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow: hidden;
  }

  .rx-file-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.72rem;
  }

  .file-name-label {
    font-weight: 700;
    color: white;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file-packets-count {
    font-family: monospace;
    color: rgba(255, 255, 255, 0.4);
  }

  .rx-progress-bar-container {
    height: 14px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    margin-top: 8px;
    display: flex;
    align-items: center;
  }

  .rx-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #00ff66, #00bfff);
    transition: width 0.1s ease;
    box-shadow: 0 0 10px rgba(0, 255, 102, 0.3);
  }

  .progress-pct {
    position: absolute;
    right: 8px;
    font-size: 0.62rem;
    font-weight: 700;
    font-family: monospace;
    color: white;
  }

  .matrix-grid-outer {
    flex-grow: 1;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .empty-matrix {
    font-size: 0.68rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.2);
    font-family: monospace;
    letter-spacing: 0.05em;
  }

  .matrix-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 4px;
    padding: 12px;
    width: 100%;
    align-self: flex-start;
  }

  .matrix-cell {
    aspect-ratio: 1;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 2px;
    transition: all 0.2s ease;
  }

  .matrix-cell.filled {
    background: #00ff66;
    border-color: #00ff66;
    box-shadow: 0 0 8px rgba(0, 255, 102, 0.5);
  }

  /* ── Complete Overlay Modal ── */
  .complete-fullscreen-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(9, 9, 13, 0.92);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(12px);
    animation: modalFadeIn 0.3s ease forwards;
  }

  @keyframes modalFadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  .complete-modal {
    width: 90%;
    max-width: 420px;
    background: rgba(18, 18, 25, 0.8);
    border: 1px solid rgba(0, 255, 102, 0.2);
    border-radius: 24px;
    padding: 30px;
    text-align: center;
    box-shadow: 
      0 30px 80px rgba(0, 0, 0, 0.8),
      0 0 30px rgba(0, 255, 102, 0.05);
    animation: scaleUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes scaleUp {
    0% { transform: scale(0.95) translateY(10px); }
    100% { transform: scale(1) translateY(0); }
  }

  .complete-badge {
    color: #00ff66;
    filter: drop-shadow(0 0 10px rgba(0, 255, 102, 0.3));
    margin-bottom: 16px;
    animation: floatBadge 2s infinite alternate ease-in-out;
  }

  @keyframes floatBadge {
    0% { transform: translateY(0); }
    100% { transform: translateY(-4px); }
  }

  .complete-modal h2 {
    margin: 0 0 8px 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: white;
    letter-spacing: 0.02em;
  }

  .complete-file-info {
    font-size: 0.82rem;
    color: rgba(255, 255, 255, 0.55);
    margin: 0 0 24px 0;
    word-break: break-all;
  }

  .stats-grid-modal {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 28px;
  }

  .stat-cell {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .stat-cell .s-label {
    font-size: 0.56rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .stat-cell .s-val {
    font-size: 0.95rem;
    font-weight: 700;
    color: white;
    font-family: monospace;
  }

  .modal-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .modal-btn {
    border: none;
    border-radius: 10px;
    padding: 12px;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
  }

  .modal-btn.download-btn {
    background: #00ff66;
    color: black;
  }

  .modal-btn.download-btn:hover {
    box-shadow: 0 8px 25px rgba(0, 255, 102, 0.25);
    transform: translateY(-1px);
  }

  .modal-btn.dismiss-btn {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.7);
  }

  .modal-btn.dismiss-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    color: white;
  }
</style>
