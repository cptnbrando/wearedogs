<script>
  import { onMount, onDestroy } from "svelte";
  import QRCode from "qrcode";
  import jsQR from "jsqr";
  import { 
    Upload, Play, Square, RefreshCw, Camera, Download, FileText, CheckCircle, Clock, Zap, Cpu, Sliders 
  } from "lucide-svelte";

  // App States: 'idle' | 'transmit' | 'receive' | 'complete'
  let transferMode = $state("idle"); // 'idle' | 'transmit' | 'receive'
  
  // Transmitter State
  let transmitterCanvas = $state(null);
  let textInput = $state("");
  let uploadedFile = $state(null);
  let transmitterStatus = $state("ready"); // 'ready' | 'countdown' | 'playing' | 'paused' | 'done'
  let countdown = $state(3);
  let framesPerSecond = $state(12); // Speed: 5 to 30 FPS
  let currentFrameIndex = $state(0);
  let txPackets = $state([]);
  let currentFileId = $state("");

  // Clarity Configuration: 'low' (compatibility) | 'balanced' | 'high' (density)
  let clarityMode = $state("balanced"); // 'low' | 'balanced' | 'high'
  let chunkSize = $derived(
    clarityMode === "low" ? 90 : clarityMode === "high" ? 300 : 180
  );
  let qrScale = $derived(
    clarityMode === "low" ? 8 : clarityMode === "high" ? 4 : 6
  );

  // Device Specifications State
  let deviceSpecs = $state({
    screenSize: "Unknown",
    dpr: 1,
    browser: "Unknown",
    network: "Unknown",
    hasCamera: false
  });

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

  onMount(() => {
    detectSpecs();
  });

  onDestroy(() => {
    stopCamera();
    if (txInterval) clearInterval(txInterval);
    if (loopbackFrameRequest) cancelAnimationFrame(loopbackFrameRequest);
  });

  // Specs Detection
  async function detectSpecs() {
    if (typeof window !== "undefined") {
      const width = window.screen.width;
      const height = window.screen.height;
      
      let browserName = "Unknown Browser";
      const ua = navigator.userAgent;
      if (ua.indexOf("Firefox") > -1) browserName = "Firefox";
      else if (ua.indexOf("Chrome") > -1) browserName = "Chrome";
      else if (ua.indexOf("Safari") > -1) browserName = "Safari";
      
      let cameraDetected = false;
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        cameraDetected = devices.some(d => d.kind === "videoinput");
      } catch (e) {
        console.warn("Could not list video devices", e);
      }

      deviceSpecs = {
        screenSize: `${width} x ${height}`,
        dpr: window.devicePixelRatio || 1,
        browser: browserName,
        network: navigator.onLine ? "Online" : "Offline",
        hasCamera: cameraDetected
      };
    }
  }

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
    const total = Math.ceil(base64Payload.length / chunkSize);
    
    const packets = [];
    for (let i = 0; i < total; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, base64Payload.length);
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
        scale: qrScale,
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

  // Trigger download of the completed transfer
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
</script>

<div class="qr-layout">
  <!-- Specifications & Settings Header Board -->
  <section class="diag-header-panel">
    <div class="specs-grid">
      <div class="spec-node">
        <span class="node-title">Screen specs</span>
        <span class="node-val">{deviceSpecs.screenSize} ({deviceSpecs.dpr}x dpr)</span>
      </div>
      <div class="spec-node">
        <span class="node-title">Browser</span>
        <span class="node-val">{deviceSpecs.browser}</span>
      </div>
      <div class="spec-node">
        <span class="node-title">Link state</span>
        <span class="node-val" class:online-glow={deviceSpecs.network === "Online"}>{deviceSpecs.network}</span>
      </div>
      <div class="spec-node">
        <span class="node-title">Optics (Camera)</span>
        <span class="node-val">{deviceSpecs.hasCamera ? "Ready" : "None detected"}</span>
      </div>
    </div>

    <!-- Adjust Clarity Control -->
    <div class="clarity-dashboard">
      <div class="clarity-title-row">
        <Sliders size={12} class="text-cyan animate-pulse" />
        <span class="control-label">ADJUST DISPATCH CLARITY</span>
      </div>
      <div class="toggles-row">
        <button 
          class="clarity-btn" 
          class:active={clarityMode === "low"}
          onclick={() => { clarityMode = "low"; prepareChunks(); }}
        >
          LOW (Sparse QR / Easy Scan)
        </button>
        <button 
          class="clarity-btn" 
          class:active={clarityMode === "balanced"}
          onclick={() => { clarityMode = "balanced"; prepareChunks(); }}
        >
          BALANCED (Standard)
        </button>
        <button 
          class="clarity-btn" 
          class:active={clarityMode === "high"}
          onclick={() => { clarityMode = "high"; prepareChunks(); }}
        >
          HIGH (Dense QR / Max Speed)
        </button>
      </div>
    </div>
  </section>

  <!-- Top bar mode toggles -->
  <div class="view-toggles-bar">
    <button 
      class="mode-switch-btn" 
      class:active={transferMode === "idle" || transferMode === "transmit"}
      onclick={() => { 
        transferMode = "idle"; 
        stopCamera();
        loopbackActive = false;
      }}
    >
      Transmitter Screen
    </button>
    <button 
      class="mode-switch-btn" 
      class:active={transferMode === "receive" || transferMode === "complete"}
      onclick={() => {
        transferMode = "receive";
        startCamera();
      }}
    >
      Scanner Optic (Receive)
    </button>
  </div>

  <!-- Workspace Grid -->
  <div class="workspace-grid">
    <!-- Transmitter Workspace -->
    <div class="pane tx-pane" class:active-view={transferMode === "idle" || transferMode === "transmit"} class:faded={transferMode === "receive" || transferMode === "complete"}>
      <div class="pane-indicator"><Zap size={11} /> SCANNER TRANSMITTER DOCK</div>

      <div class="panel-card input-block">
        <div class="uploader-fields">
          <label class="dropzone-label">
            <Upload size={18} class="text-cyan" />
            <span>Select File to Dispatch</span>
            <input type="file" onchange={handleFileSelect} class="hidden-input" />
          </label>
          <div class="divider">OR</div>
          <textarea 
            placeholder="Type short text message to flash..." 
            bind:value={textInput}
            oninput={handleTextInput}
            class="text-input-field"
          ></textarea>
        </div>

        {#if uploadedFile}
          <div class="file-descriptor">
            <FileText size={13} class="text-green-400" />
            <span class="file-details">{uploadedFile.name} ({formatBytes(uploadedFile.size)})</span>
            <button class="clear-btn" onclick={() => { uploadedFile = null; txPackets = []; }}>✕</button>
          </div>
        {/if}
      </div>

      <div class="panel-card engine-controls">
        <div class="slider-group">
          <label for="velocity-range" class="control-label">DISPATCH VELOCITY: {framesPerSecond} FPS</label>
          <input 
            id="velocity-range"
            type="range" 
            min="5" 
            max="30" 
            step="1" 
            bind:value={framesPerSecond}
            onchange={() => { if (transmitterStatus === "playing") runTxLoop(); }}
            class="clarity-slider"
          />
        </div>

        <div class="buttons-row">
          {#if transmitterStatus === "ready" || transmitterStatus === "done"}
            <button class="action-btn start" onclick={startTransmission} disabled={txPackets.length === 0}>
              <Play size={13} /> Start Flashing
            </button>
          {:else if transmitterStatus === "playing"}
            <button class="action-btn pause" onclick={pauseTransmission}>
              <Square size={13} /> Pause Flash
            </button>
          {:else if transmitterStatus === "paused"}
            <button class="action-btn start" onclick={() => { transmitterStatus = "playing"; runTxLoop(); }}>
              <Play size={13} /> Resume Flash
            </button>
          {/if}
          
          <button class="action-btn reset" onclick={stopTransmission} disabled={transmitterStatus === "ready"}>
            <RefreshCw size={13} /> Clear
          </button>
        </div>
      </div>

      <!-- Projection Display canvas -->
      <div class="projection-board">
        {#if transmitterStatus === "countdown"}
          <div class="countdown-curtain">
            <span class="number">{countdown}</span>
            <span class="label">LOCKING ON RECEIVER...</span>
          </div>
        {/if}

        <canvas bind:this={transmitterCanvas} width="320" height="320" class="qrcode-output-canvas"></canvas>
        
        <div class="projection-meta">
          <span>PACKETS: {txPackets.length}</span>
          <span>FRAME: {currentFrameIndex + 1} / {txPackets.length || 1}</span>
        </div>
      </div>
    </div>

    <!-- Scanner Workspace -->
    <div class="pane rx-pane" class:active-view={transferMode === "receive" || transferMode === "complete"} class:faded={transferMode === "idle" || transferMode === "transmit"}>
      <div class="pane-indicator"><Camera size={11} /> SCANNER RECEIVER DOCK</div>

      <div class="receiver-controls">
        <div class="btn-group">
          {#if !isCameraActive}
            <button class="control-btn run" onclick={startCamera}>
              <Camera size={13} /> Wake Camera
            </button>
          {:else}
            <button class="control-btn halt" onclick={stopCamera}>
              <Square size={13} /> Halt Camera
            </button>
          {/if}

          <button class="control-btn clear" onclick={resetReceiver}>
            <RefreshCw size={13} /> Reset
          </button>
        </div>

        <button 
          class="loopback-btn"
          class:active={loopbackActive}
          onclick={toggleLoopback}
        >
          <Cpu size={13} /> {loopbackActive ? "Loopback Connected" : "Local Bus Loopback (60fps)"}
        </button>
      </div>

      <!-- Viewfinder Feed screen -->
      <div class="viewfinder-window">
        <canvas bind:this={receiverCanvas} class="analyzer-canvas"></canvas>
        
        <!-- svelte-ignore a11y_media_has_caption -->
        <video 
          bind:this={receiverVideo}
          class="live-viewfinder"
          class:hidden={loopbackActive || !isCameraActive}
        ></video>

        {#if loopbackActive}
          <div class="virtual-hud">
            <div class="scanner-sweep-bar"></div>
            <span>LOCAL LOOPBACK BUS ENGAGED</span>
            <small>Transmitting visual packets inside browser frame memory.</small>
          </div>
        {:else if !isCameraActive}
          <div class="virtual-hud offline">
            <span>OPTICAL PORT INACTIVE</span>
            <small>Wake your camera or launch the Local Bus Loopback above to sync.</small>
          </div>
        {/if}
      </div>

      <!-- Reassembly Grid status -->
      <div class="reassembly-dashboard">
        <div class="progress-info-row">
          <div class="file-labels">
            <span class="name">{receivedFileName || "Waiting for signal..."}</span>
            {#if rxTotal > 0}
              <span class="count">{rxCount} / {rxTotal} packets synced</span>
            {/if}
          </div>
          
          <div class="progressbar-track">
            <div class="progressbar-fill" style="width: {rxProgress}%"></div>
            <span class="pct-val">{rxProgress}%</span>
          </div>
        </div>

        <!-- Packet Grid visual map -->
        <div class="grid-card">
          {#if rxTotal === 0}
            <div class="grid-status-alert">
              🔴 WAITING ON DATA TRANSMISSION
            </div>
          {:else}
            <div class="packet-grid">
              {#each rxBuffer as packet, idx}
                <div 
                  class="packet-cell" 
                  class:filled={packet !== null}
                  title="Chunk {idx+1}"
                ></div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <!-- Complete overlay Modal -->
  {#if transferMode === "complete"}
    <div class="completion-dialog-curtain">
      <div class="dialog-card">
        <div class="check-badge"><CheckCircle size={36} /></div>
        <h2>Visual Sync Complete</h2>
        <p class="file-meta-label">{receivedFileName} ({formatBytes(finalFileSize)})</p>
        
        <div class="dialog-stats">
          <div class="stat-cell">
            <span class="title"><Clock size={11} /> TIME SPENT</span>
            <span class="val">{((transferDuration) / 1000).toFixed(2)}s</span>
          </div>
          <div class="stat-cell">
            <span class="title"><Zap size={11} /> AVERAGE RATE</span>
            <span class="val">{formatBytes(averageSpeed)}/s</span>
          </div>
        </div>

        <div class="buttons">
          <button class="confirm" onclick={triggerDownload}>
            <Download size={13} /> Download File
          </button>
          <button class="dismiss" onclick={resetReceiver}>
            Done
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .qr-layout {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  }

  /* ── Diag Header specs ── */
  .diag-header-panel {
    background: rgba(13, 13, 23, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 14px;

    @media (min-width: 1024px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .specs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 20px;
    flex-grow: 1;

    @media (min-width: 640px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .spec-node {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .node-title {
    font-size: 0.58rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .node-val {
    font-size: 0.72rem;
    font-weight: 700;
    color: #e2e8f0;
    white-space: nowrap;
    
    &.online-glow {
      color: #00f0ff;
      text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
    }
  }

  .clarity-dashboard {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 12px;

    @media (min-width: 1024px) {
      border-top: none;
      border-left: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 0;
      padding-left: 20px;
      width: 420px;
      flex-shrink: 0;
    }
  }

  .clarity-title-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .control-label {
    font-size: 0.6rem;
    font-weight: 750;
    color: rgba(255, 255, 255, 0.45);
    letter-spacing: 0.05em;
  }

  .toggles-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 6px;
    overflow: hidden;
  }

  .clarity-btn {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.62rem;
    font-weight: 700;
    padding: 6px 4px;
    cursor: pointer;
    transition: all 0.2s;
    outline: none;

    &:hover {
      color: white;
    }

    &.active {
      background: rgba(0, 240, 255, 0.1);
      color: #00f0ff;
    }
  }

  /* ── View toggles bar ── */
  .view-toggles-bar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 8px;
    overflow: hidden;

    @media (min-width: 768px) {
      display: none; // Hidden on wide views since they will have columns
    }
  }

  .mode-switch-btn {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.72rem;
    font-weight: 750;
    padding: 10px 0;
    cursor: pointer;
    transition: all 0.2s;
    outline: none;

    &.active {
      background: rgba(255, 255, 255, 0.05);
      color: white;
    }
  }

  /* ── Workspace grid ── */
  .workspace-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    flex-grow: 1;

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .pane {
    display: none;
    flex-direction: column;
    gap: 14px;
    background: rgba(13, 13, 23, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(8px);

    @media (min-width: 768px) {
      display: flex !important; // show columns on wide screens
      opacity: 1 !important;
      filter: none !important;
      pointer-events: auto !important;
    }

    &.active-view {
      display: flex;
    }

    &.faded {
      opacity: 0.15;
      filter: blur(8px) grayscale(0.5);
      pointer-events: none;
    }
  }

  .pane-indicator {
    font-size: 0.58rem;
    font-weight: 750;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.08em;
    display: flex;
    align-items: center;
    gap: 6px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    padding-bottom: 6px;
  }

  /* ── Panel Cards ── */
  .panel-card {
    background: rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    padding: 12px;
  }

  .uploader-fields {
    display: grid;
    grid-template-columns: 130px 24px 1fr;
    gap: 8px;
    align-items: center;
  }

  .dropzone-label {
    background: rgba(255, 255, 255, 0.02);
    border: 1px dashed rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    padding: 14px 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.5);
    transition: all 0.2s;
    font-size: 0.65rem;
    font-weight: 600;
    text-align: center;

    &:hover {
      background: rgba(0, 240, 255, 0.03);
      border-color: #00f0ff;
      color: white;
    }
  }

  .hidden-input {
    display: none;
  }

  .divider {
    text-align: center;
    font-size: 0.55rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.25);
  }

  .text-input-field {
    width: 100%;
    height: 60px;
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 6px;
    padding: 8px;
    color: white;
    font-size: 0.72rem;
    resize: none;
    outline: none;

    &:focus {
      border-color: #00f0ff;
    }
  }

  .file-descriptor {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    background: rgba(74, 222, 128, 0.04);
    border: 1px solid rgba(74, 222, 128, 0.1);
    padding: 6px 10px;
    border-radius: 4px;
  }

  .file-details {
    font-size: 0.68rem;
    color: #e2e8f0;
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .clear-btn {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    font-size: 0.72rem;

    &:hover {
      color: #f43f5e;
    }
  }

  .slider-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
  }

  .clarity-slider {
    width: 100%;
    accent-color: #00f0ff;
    cursor: pointer;
  }

  .buttons-row {
    display: grid;
    grid-template-columns: 1fr 90px;
    gap: 8px;
  }

  .action-btn {
    border: none;
    border-radius: 6px;
    font-weight: 750;
    font-size: 0.72rem;
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.2s;
    outline: none;

    &.start {
      background: linear-gradient(135deg, #00f0ff, #008fa3);
      color: #080c14;
      box-shadow: 0 4px 12px rgba(0, 240, 255, 0.2);

      &:hover:not(:disabled) {
        box-shadow: 0 4px 16px rgba(0, 240, 255, 0.35);
      }
    }

    &.pause {
      background: #eab308;
      color: #09090b;
    }

    &.reset {
      background: rgba(255, 255, 255, 0.05);
      color: #cbd5e1;
      border: 1px solid rgba(255, 255, 255, 0.08);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: white;
      }
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none !important;
    }
  }

  /* ── Projection board ── */
  .projection-board {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    aspect-ratio: 1;
    max-width: 260px;
    margin: 0 auto;
  }

  .countdown-curtain {
    position: absolute;
    inset: 0;
    background: rgba(6, 6, 10, 0.95);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    z-index: 10;

    .number {
      font-size: 2.8rem;
      font-weight: 800;
      color: #00f0ff;
      text-shadow: 0 0 16px rgba(0, 240, 255, 0.5);
    }

    .label {
      font-size: 0.58rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 0.05em;
    }
  }

  .qrcode-output-canvas {
    width: 100%;
    height: auto;
    max-width: 200px;
    background: white;
    border-radius: 6px;
    padding: 6px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  }

  .projection-meta {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 0.58rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.3);
    margin-top: 10px;
  }

  /* ── Scanner components ── */
  .receiver-controls {
    display: flex;
    flex-direction: column;
    gap: 8px;

    @media (min-width: 640px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .btn-group {
    display: flex;
    gap: 8px;
  }

  .control-btn {
    border: none;
    border-radius: 6px;
    font-weight: 700;
    font-size: 0.68rem;
    padding: 6px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
    outline: none;

    &.run {
      background: #00f0ff;
      color: #09090b;
    }

    &.halt {
      background: #e11d48;
      color: white;
    }

    &.clear {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
    }
  }

  .loopback-btn {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.5);
    border-radius: 6px;
    font-weight: 700;
    font-size: 0.65rem;
    padding: 6px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    outline: none;
    transition: all 0.2s;

    &.active {
      background: rgba(74, 222, 128, 0.08);
      border-color: rgba(74, 222, 128, 0.25);
      color: #4ade80;
    }
  }

  .viewfinder-window {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    aspect-ratio: 4/3;
    max-width: 320px;
    margin: 0 auto;
    width: 100%;
  }

  .analyzer-canvas {
    display: none;
  }

  .live-viewfinder {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .virtual-hud {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 20px;
    z-index: 5;
    background: rgba(6, 6, 10, 0.4);

    &.offline {
      background: rgba(6, 6, 10, 0.85);
    }

    span {
      font-size: 0.72rem;
      font-weight: 750;
      letter-spacing: 0.05em;
      color: #e2e8f0;
      margin-bottom: 4px;
    }

    small {
      font-size: 0.6rem;
      color: rgba(255, 255, 255, 0.35);
      max-width: 220px;
    }
  }

  .scanner-sweep-bar {
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00f0ff, transparent);
    position: absolute;
    top: 0;
    left: 0;
    box-shadow: 0 0 8px #00f0ff;
    animation: scanBar 2.5s linear infinite;
  }

  @keyframes scanBar {
    0% { top: 0%; }
    100% { top: 100%; }
  }

  /* ── Reassembly specs ── */
  .reassembly-dashboard {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .progress-info-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .file-labels {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .name {
      font-size: 0.72rem;
      font-weight: 700;
      color: #f1f5f9;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 180px;
    }

    .count {
      font-size: 0.6rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.4);
    }
  }

  .progressbar-track {
    height: 14px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    position: relative;
    overflow: hidden;
  }

  .progressbar-fill {
    height: 100%;
    background: linear-gradient(90deg, #008fa3, #00f0ff);
    box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
    transition: width 0.1s linear;
  }

  .pct-val {
    position: absolute;
    right: 8px;
    top: 1px;
    font-size: 0.58rem;
    font-weight: 850;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  }

  .grid-card {
    background: rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    padding: 10px;
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .grid-status-alert {
    font-size: 0.65rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.03em;
  }

  .packet-grid {
    display: grid;
    grid-template-columns: repeat(10, 18px);
    gap: 4px;
    justify-content: center;
    max-height: 100px;
    overflow-y: auto;
    width: 100%;
    padding: 4px;
  }

  .packet-cell {
    aspect-ratio: 1;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 2px;
    transition: background 0.1s;

    &.filled {
      background: #00f0ff;
      border-color: #00f0ff;
      box-shadow: 0 0 6px rgba(0, 240, 255, 0.6);
    }
  }

  /* ── Completion Dialog ── */
  .completion-dialog-curtain {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 100;
  }

  .dialog-card {
    background: #09090f;
    border: 1px solid rgba(0, 240, 255, 0.2);
    border-radius: 12px;
    padding: 24px;
    width: 100%;
    max-width: 380px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 10px 40px rgba(0, 240, 255, 0.15);

    h2 {
      margin: 12px 0 4px 0;
      font-size: 1rem;
      font-weight: 750;
      letter-spacing: 0.05em;
    }
  }

  .check-badge {
    color: #4ade80;
    filter: drop-shadow(0 0 10px rgba(74, 222, 128, 0.4));
  }

  .file-meta-label {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 20px;
    word-break: break-all;
  }

  .dialog-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    width: 100%;
    margin-bottom: 24px;
  }

  .stat-cell {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 6px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;

    .title {
      font-size: 0.55rem;
      font-weight: 700;
      color: rgba(255,255,255,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }

    .val {
      font-size: 0.8rem;
      font-weight: 750;
      color: white;
    }
  }

  .buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    width: 100%;

    button {
      border: none;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.75rem;
      padding: 10px 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s;
      outline: none;
    }

    .confirm {
      background: #00f0ff;
      color: #09090b;

      &:hover {
        background: #00d2e0;
      }
    }

    .dismiss {
      background: rgba(255,255,255,0.05);
      color: #cbd5e1;
      border: 1px solid rgba(255,255,255,0.08);

      &:hover {
        background: rgba(255,255,255,0.08);
        color: white;
      }
    }
  }
</style>
