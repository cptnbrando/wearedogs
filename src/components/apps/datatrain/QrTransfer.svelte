<script>
  import { onMount, onDestroy } from "svelte";
  import QRCode from "qrcode";
  import jsQR from "jsqr";
  import {
    Upload,
    Play,
    Square,
    RefreshCw,
    Camera,
    Download,
    FileText,
    CheckCircle,
    Clock,
    Zap,
    Cpu,
  } from "lucide-svelte";
  import "./qrReceiver.scss";
  import "./qrTransfer.scss";

  // Dispatch clarity: sparse codes scan easily, dense codes send faster.
  const CLARITY_MODES = [
    { id: "low", label: "Easy scan", hint: "Sparse QR codes. Easiest to scan." },
    { id: "balanced", label: "Standard", hint: "Balanced density." },
    { id: "high", label: "Fast", hint: "Dense QR codes. Fastest, needs a sharp camera." },
  ];

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
    clarityMode === "low" ? 90 : clarityMode === "high" ? 300 : 180,
  );
  let qrScale = $derived(
    clarityMode === "low" ? 8 : clarityMode === "high" ? 4 : 6,
  );

  // Device Specifications State
  let deviceSpecs = $state({
    screenSize: "Unknown",
    dpr: 1,
    browser: "Unknown",
    network: "Unknown",
    hasCamera: false,
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
  let rxProgress = $derived(
    rxTotal > 0 ? Math.round((rxCount / rxTotal) * 100) : 0,
  );
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
        cameraDetected = devices.some((d) => d.kind === "videoinput");
      } catch (e) {
        console.warn("Could not list video devices", e);
      }

      deviceSpecs = {
        screenSize: `${width} x ${height}`,
        dpr: window.devicePixelRatio || 1,
        browser: browserName,
        network: navigator.onLine ? "Online" : "Offline",
        hasCamera: cameraDetected,
      };
    }
  }

  // Web Audio Success Chime
  function playSuccessChime() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0.3, audioCtx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          audioCtx.currentTime + idx * 0.1 + 0.3,
        );

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
      reader.onload = function (e) {
        const binary = e.target.result;
        // Convert to base64
        const base64 = btoa(
          new Uint8Array(binary).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
          ),
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
      packets.push(
        `QRF|${currentFileId}|${type}|${cleanName}|${i}|${total}|${chunk}`,
      );
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
          light: "#ffffff",
        },
      },
      (err) => {
        if (err) console.error(err);
      },
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
        video: { facingMode: "environment" },
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
      alert(
        "webcam access denied or unavailable. You can use the local loopback demo instead.",
      );
    }
  }

  function stopCamera() {
    isCameraActive = false;
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
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
        ctx.drawImage(
          receiverVideo,
          0,
          0,
          receiverCanvas.width,
          receiverCanvas.height,
        );
        const imgData = ctx.getImageData(
          0,
          0,
          receiverCanvas.width,
          receiverCanvas.height,
        );
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
      const imgData = ctx.getImageData(
        0,
        0,
        transmitterCanvas.width,
        transmitterCanvas.height,
      );
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

    const [
      _,
      fileId,
      fileType,
      encodedName,
      frameIndexStr,
      totalFramesStr,
      chunkData,
    ] = parts;
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
      Transmit
    </button>
    <button
      class="mode-switch-btn"
      class:active={transferMode === "receive" || transferMode === "complete"}
      onclick={() => {
        transferMode = "receive";
        startCamera();
      }}
    >
      Receive
    </button>
  </div>

  <!-- Workspace Grid -->
  <div class="workspace-grid">
    <!-- Transmitter Workspace -->
    <div
      class="pane tx-pane"
      class:active-view={transferMode === "idle" || transferMode === "transmit"}
      class:faded={transferMode === "receive" || transferMode === "complete"}
    >
      <div class="pane-indicator">
        <Zap size={11} /> SCANNER TRANSMITTER DOCK
      </div>

      <div class="panel-card input-block">
        <div class="uploader-fields">
          <label class="dropzone-label">
            <Upload size={18} class="text-cyan" />
            <span>Select File to Dispatch</span>
            <input
              type="file"
              onchange={handleFileSelect}
              class="hidden-input"
            />
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
            <span class="file-details"
              >{uploadedFile.name} ({formatBytes(uploadedFile.size)})</span
            >
            <button
              class="clear-btn"
              onclick={() => {
                uploadedFile = null;
                txPackets = [];
              }}>✕</button
            >
          </div>
        {/if}
      </div>

      <div class="panel-card engine-controls">
        <div class="slider-group">
          <label for="velocity-range" class="control-label"
            >DISPATCH VELOCITY: {framesPerSecond} FPS</label
          >
          <input
            id="velocity-range"
            type="range"
            min="5"
            max="30"
            step="1"
            bind:value={framesPerSecond}
            onchange={() => {
              if (transmitterStatus === "playing") runTxLoop();
            }}
            class="clarity-slider"
          />
        </div>

        <div class="buttons-row">
          {#if transmitterStatus === "ready" || transmitterStatus === "done"}
            <button
              class="action-btn start"
              onclick={startTransmission}
              disabled={txPackets.length === 0}
            >
              <Play size={13} /> Start Flashing
            </button>
          {:else if transmitterStatus === "playing"}
            <button class="action-btn pause" onclick={pauseTransmission}>
              <Square size={13} /> Pause Flash
            </button>
          {:else if transmitterStatus === "paused"}
            <button
              class="action-btn start"
              onclick={() => {
                transmitterStatus = "playing";
                runTxLoop();
              }}
            >
              <Play size={13} /> Resume Flash
            </button>
          {/if}

          <button
            class="action-btn reset"
            aria-label="Clear"
            onclick={stopTransmission}
            disabled={transmitterStatus === "ready"}
          >
            <RefreshCw size={13} /> <span class="btn-text">Clear</span>
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

        <canvas
          bind:this={transmitterCanvas}
          width="320"
          height="320"
          class="qrcode-output-canvas"
        ></canvas>

        <div class="projection-meta">
          <span>PACKETS: {txPackets.length}</span>
          <span>FRAME: {currentFrameIndex + 1} / {txPackets.length || 1}</span>
        </div>
      </div>
    </div>

    <!-- Scanner Workspace -->
    <div
      class="pane rx-pane"
      class:active-view={transferMode === "receive" ||
        transferMode === "complete"}
      class:faded={transferMode === "idle" || transferMode === "transmit"}
    >
      <div class="pane-indicator">
        <Camera size={11} /> SCANNER RECEIVER DOCK
      </div>

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
          <Cpu size={13} />
          {loopbackActive ? "Loopback Connected" : "Local Bus Loopback (60fps)"}
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
            <small
              >Transmitting visual packets inside browser frame memory.</small
            >
          </div>
        {:else if !isCameraActive}
          <div class="virtual-hud offline">
            <span>OPTICAL PORT INACTIVE</span>
            <small
              >Wake your camera or launch the Local Bus Loopback above to sync.</small
            >
          </div>
        {/if}
      </div>

      <!-- Reassembly Grid status -->
      <div class="reassembly-dashboard">
        <div class="progress-info-row">
          <div class="file-labels">
            <span class="name"
              >{receivedFileName || "Waiting for signal..."}</span
            >
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
            <div class="grid-status-alert">🔴 WAITING ON DATA TRANSMISSION</div>
          {:else}
            <div class="packet-grid">
              {#each rxBuffer as packet, idx}
                <div
                  class="packet-cell"
                  class:filled={packet !== null}
                  title="Chunk {idx + 1}"
                ></div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <!-- Device specs and dispatch clarity, condensed to one row -->
  <section class="qr-status-row" aria-label="Device and clarity">
    <p class="qr-specs" title="Screen, browser, connection and camera">
      <span>{deviceSpecs.screenSize} @{deviceSpecs.dpr}x</span>
      <span>{deviceSpecs.browser}</span>
      <span class:online-glow={deviceSpecs.network === "Online"}>{deviceSpecs.network}</span>
      <span>{deviceSpecs.hasCamera ? "Camera ready" : "No camera"}</span>
    </p>
    <div class="qr-clarity">
      <span class="control-label">CLARITY</span>
      <div class="toggles-row">
        {#each CLARITY_MODES as mode (mode.id)}
          <button
            class="clarity-btn"
            class:active={clarityMode === mode.id}
            title={mode.hint}
            aria-pressed={clarityMode === mode.id}
            onclick={() => {
              clarityMode = mode.id;
              prepareChunks();
            }}
          >
            {mode.label}
          </button>
        {/each}
      </div>
    </div>
  </section>

  <!-- Complete overlay Modal -->
  {#if transferMode === "complete"}
    <div class="completion-dialog-curtain">
      <div class="dialog-card">
        <div class="check-badge"><CheckCircle size={36} /></div>
        <h2>Visual Sync Complete</h2>
        <p class="file-meta-label">
          {receivedFileName} ({formatBytes(finalFileSize)})
        </p>

        <div class="dialog-stats">
          <div class="stat-cell">
            <span class="title"><Clock size={11} /> TIME SPENT</span>
            <span class="val">{(transferDuration / 1000).toFixed(2)}s</span>
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
          <button class="dismiss" onclick={resetReceiver}> Done </button>
        </div>
      </div>
    </div>
  {/if}
</div>
