<script>
  import { onMount, onDestroy } from "svelte";
  import QRCode from "qrcode";
  import jsQR from "jsqr";
  import {
    Share2,
    Camera,
    Download,
    FileText,
    CheckCircle,
    RefreshCw,
    AlertCircle,
    Copy,
    Check,
  } from "lucide-svelte";

  // App States: 'idle' | 'setup_send' | 'setup_receive' | 'connecting' | 'connected' | 'transmitting' | 'receiving' | 'complete'
  let role = $state("idle"); // 'idle' | 'send' | 'receive'
  let step = $state("idle"); // 'idle' | 'offer' | 'scan_offer' | 'answer' | 'wait_answer' | 'connected' | 'syncing' | 'complete'

  // Files
  let selectedFile = $state(null);
  let fileInputEl = $state(null);
  let receivedFileBlob = $state(null);
  let receivedFileName = $state("");
  let receivedFileSize = $state(0);

  // Connection Signaling Keys
  let sdpOfferString = $state("");
  let sdpAnswerString = $state("");
  let inputSdpString = $state("");
  let offerQrCanvas = $state(null);
  let answerQrCanvas = $state(null);

  // WebRTC Instance references
  let pc = null;
  let dataChannel = null;
  let iceCandidates = [];
  let isCopySuccess = $state(false);

  // Camera Scanner
  let videoEl = $state(null);
  let scanCanvasEl = $state(null);
  let isScanning = $state(false);
  let stream = null;
  let scanInterval = null;

  // Transfer stats
  let progress = $state(0);
  let bytesTransferred = $state(0);
  let totalBytes = $state(0);

  onMount(() => {
    // Check if WebRTC is supported
  });

  onDestroy(() => {
    cleanupConnection();
  });

  function cleanupConnection() {
    stopCamera();
    if (dataChannel) {
      dataChannel.close();
    }
    if (pc) {
      pc.close();
    }
  }

  // --- WebRTC Sender Flow ---
  async function initializeSender() {
    if (!selectedFile) return;
    role = "send";
    step = "offer";
    totalBytes = selectedFile.size;

    // Create RTCPeerConnection
    pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Create Data Channel
    dataChannel = pc.createDataChannel("fileShareChannel", { ordered: true });
    setupDataChannelEvents(dataChannel);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        iceCandidates.push(event.candidate);
      } else {
        // ICE gathering finished, generate SDP offer including candidates
        generateOfferQR();
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Backup safety timeout for SDP generation if ICE gathering hangs
    setTimeout(() => {
      if (!sdpOfferString) {
        generateOfferQR();
      }
    }, 1200);
  }

  function generateOfferQR() {
    const localSdp = pc.localDescription;
    const packet = {
      type: "offer",
      sdp: localSdp.sdp,
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      fileType: selectedFile.type,
    };

    sdpOfferString = btoa(JSON.stringify(packet));
    step = "wait_answer";

    // Draw QR Code
    setTimeout(() => {
      if (offerQrCanvas) {
        QRCode.toCanvas(
          offerQrCanvas,
          sdpOfferString,
          { margin: 1, scale: 4 },
          (err) => {
            if (err) console.error(err);
          },
        );
      }
    }, 100);
  }

  async function applyReceiverAnswer() {
    if (!inputSdpString) return;
    try {
      const decoded = JSON.parse(atob(inputSdpString));
      if (decoded.type !== "answer") {
        alert("Invalid connection key. Must be a receiver answer key.");
        return;
      }
      const remoteDesc = new RTCSessionDescription({
        type: "answer",
        sdp: decoded.sdp,
      });
      await pc.setRemoteDescription(remoteDesc);
      step = "connecting";
    } catch (e) {
      console.error(e);
      alert("Failed to parse remote answer code.");
    }
  }

  // --- WebRTC Receiver Flow ---
  function initializeReceiver() {
    role = "receive";
    step = "scan_offer";
    startCamera();
  }

  async function applySenderOffer(offerBase64) {
    try {
      const decoded = JSON.parse(atob(offerBase64));
      if (decoded.type !== "offer") {
        alert("Invalid connection key. Must be a sender offer key.");
        return;
      }

      receivedFileName = decoded.fileName;
      receivedFileSize = decoded.fileSize;
      totalBytes = decoded.fileSize;
      stopCamera();

      // Create RTCPeerConnection
      pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.ondatachannel = (event) => {
        setupDataChannelEvents(event.channel);
      };

      pc.onicecandidate = (event) => {
        if (!event.candidate) {
          generateAnswerQR();
        }
      };

      const remoteDesc = new RTCSessionDescription({
        type: "offer",
        sdp: decoded.sdp,
      });
      await pc.setRemoteDescription(remoteDesc);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Timeout safety
      setTimeout(() => {
        if (step !== "answer") {
          generateAnswerQR();
        }
      }, 1200);
    } catch (e) {
      console.error(e);
      alert("Failed to parse sender connection key.");
    }
  }

  function generateAnswerQR() {
    const packet = {
      type: "answer",
      sdp: pc.localDescription.sdp,
    };
    sdpAnswerString = btoa(JSON.stringify(packet));
    step = "answer";

    // Draw Answer QR
    setTimeout(() => {
      if (answerQrCanvas) {
        QRCode.toCanvas(
          answerQrCanvas,
          sdpAnswerString,
          { margin: 1, scale: 4 },
          (err) => {
            if (err) console.error(err);
          },
        );
      }
    }, 100);
  }

  // --- Peer Data Channel Event Setup ---
  let receivedChunks = [];

  function setupDataChannelEvents(channel) {
    channel.binaryType = "arraybuffer";

    channel.onopen = () => {
      step = "connected";
      if (role === "send") {
        transmitFileInChunks();
      }
    };

    channel.onmessage = (event) => {
      // Chunk received
      receivedChunks.push(event.data);
      bytesTransferred += event.data.byteLength;
      progress = Math.round((bytesTransferred / totalBytes) * 100);
      step = "syncing";

      if (bytesTransferred >= totalBytes) {
        completeTransferReceive();
      }
    };

    channel.onclose = () => {
      console.log("WebRTC Data Channel closed");
    };
  }

  // File chunking and transmission loop
  function transmitFileInChunks() {
    step = "syncing";
    const CHUNK_SIZE = 16384; // 16 KB chunk size
    const reader = new FileReader();

    reader.onload = (e) => {
      const buffer = e.target.result;
      let offset = 0;

      const sendNextChunk = () => {
        while (offset < buffer.byteLength) {
          // If bufferedAmount is high, pause and wait for queue clear
          if (dataChannel.bufferedAmount > 1048576) {
            // 1 MB buffer threshold
            setTimeout(sendNextChunk, 50);
            return;
          }
          const slice = buffer.slice(offset, offset + CHUNK_SIZE);
          dataChannel.send(slice);
          offset += slice.byteLength;
          bytesTransferred = offset;
          progress = Math.round((bytesTransferred / totalBytes) * 100);
        }

        playChime();
        step = "complete";
      };

      sendNextChunk();
    };

    reader.readAsArrayBuffer(selectedFile);
  }

  function completeTransferReceive() {
    receivedFileBlob = new Blob(receivedChunks);
    playChime();
    step = "complete";
  }

  function downloadReceivedFile() {
    if (!receivedFileBlob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(receivedFileBlob);
    a.download = receivedFileName;
    a.click();
  }

  function playChime() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [349.23, 440.0, 523.25, 698.46]; // F4, A4, C5, F5
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          audioCtx.currentTime + idx * 0.08 + 0.3,
        );

        osc.start(audioCtx.currentTime + idx * 0.08);
        osc.stop(audioCtx.currentTime + idx * 0.08 + 0.3);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // --- Camera QR Scanner logic ---
  async function startCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoEl) {
        videoEl.srcObject = stream;
        videoEl.setAttribute("playsinline", true);
        videoEl.play();
        isScanning = true;
        startScanning();
      }
    } catch (err) {
      console.error("Camera access failed:", err);
    }
  }

  function stopCamera() {
    isScanning = false;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
    if (scanInterval) {
      clearInterval(scanInterval);
      scanInterval = null;
    }
  }

  function startScanning() {
    if (scanInterval) clearInterval(scanInterval);
    scanInterval = setInterval(() => {
      if (!isScanning || !videoEl || !scanCanvasEl) return;

      const ctx = scanCanvasEl.getContext("2d");
      scanCanvasEl.width = videoEl.videoWidth;
      scanCanvasEl.height = videoEl.videoHeight;

      if (scanCanvasEl.width > 0 && scanCanvasEl.height > 0) {
        ctx.drawImage(videoEl, 0, 0, scanCanvasEl.width, scanCanvasEl.height);
        const imgData = ctx.getImageData(
          0,
          0,
          scanCanvasEl.width,
          scanCanvasEl.height,
        );
        const code = jsQR(imgData.data, imgData.width, imgData.height);
        if (code) {
          if (step === "scan_offer") {
            applySenderOffer(code.data);
          } else if (step === "wait_answer") {
            inputSdpString = code.data;
            applyReceiverAnswer();
          }
        }
      }
    }, 60);
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      isCopySuccess = true;
      setTimeout(() => (isCopySuccess = false), 1500);
    });
  }

  function resetAll() {
    cleanupConnection();
    role = "idle";
    step = "idle";
    selectedFile = null;
    receivedFileBlob = null;
    receivedFileName = "";
    sdpOfferString = "";
    sdpAnswerString = "";
    inputSdpString = "";
    progress = 0;
    bytesTransferred = 0;
    totalBytes = 0;
    receivedChunks = [];
  }
</script>

<div class="air-layout">
  <div class="air-card">
    <div class="card-header">
      <Share2 class="text-fuchsia-400 animate-pulse" size={18} />
      <h2>AIR TRAIN (WebRTC Peer Link)</h2>
    </div>

    <!-- Initial state: select Role -->
    {#if role === "idle"}
      <div class="setup-slate">
        <Share2 class="text-neutral-500 mb-2 animate-bounce" size={32} />
        <h3>DIRECT NEARBY SHARING</h3>
        <p>
          Transfer files directly between two devices in your browser without
          uploading to any server. Completely secure and encrypted.
        </p>

        <div class="role-selector">
          <div class="send-setup-block">
            <span class="step-label">TO SEND A FILE</span>
            <button
              class="role-btn sender-btn"
              onclick={() => fileInputEl.click()}
            >
              Select File to Share
            </button>
            <input
              bind:this={fileInputEl}
              type="file"
              onchange={(e) => {
                selectedFile = e.target.files[0];
                initializeSender();
              }}
              class="hidden-input"
            />
          </div>

          <div class="or-divider">OR</div>

          <div class="receive-setup-block">
            <span class="step-label">TO RECEIVE A FILE</span>
            <button class="role-btn receiver-btn" onclick={initializeReceiver}>
              Receive File
            </button>
          </div>
        </div>
      </div>

      <!-- SENDER STEPS -->
    {:else if role === "send" && step === "wait_answer"}
      <div class="signaling-slate">
        <span class="step-badge">Sender Step 1 of 2</span>
        <h3>Scan or Copy Connection Code</h3>
        <p>
          Open <strong>Air Train Receive</strong> on the other device and scan this
          QR code or copy the connection string.
        </p>

        <div class="qr-box">
          <canvas bind:this={offerQrCanvas}></canvas>
        </div>

        <div class="fallback-copy-paste">
          <button
            class="copy-code-btn"
            onclick={() => copyToClipboard(sdpOfferString)}
          >
            {#if isCopySuccess}
              <Check size={13} /> Copied!
            {:else}
              <Copy size={13} /> Copy Offer Key
            {/if}
          </button>
        </div>

        <div class="answer-verification-box">
          <label for="answer-pasted" class="input-label"
            >Paste Receiver's Answer Key:</label
          >
          <div class="input-row">
            <input
              id="answer-pasted"
              type="text"
              placeholder="Paste generated answer key here..."
              bind:value={inputSdpString}
              class="form-input"
            />
            <button class="apply-btn" onclick={applyReceiverAnswer}
              >Connect</button
            >
          </div>
        </div>

        <button class="abort-btn" onclick={resetAll}>Abort</button>
      </div>

      <!-- RECEIVER STEPS -->
    {:else if role === "receive" && step === "scan_offer"}
      <div class="scanner-slate">
        <span class="step-badge">Receiver Step 1 of 2</span>
        <h3>Scan Sender's QR Code</h3>
        <p>
          Position the sender's QR code in the viewfinder, or paste the
          connection offer key below.
        </p>

        <div class="viewfinder">
          <canvas bind:this={scanCanvasEl} class="hidden-canvas"></canvas>
          <!-- svelte-ignore a11y_media_has_caption -->
          <video bind:this={videoEl} class="scanner-video"></video>
          <div class="focus-brackets"></div>
        </div>

        <div class="manual-input-box">
          <label for="offer-pasted" class="input-label"
            >Or Paste Sender's Offer Key:</label
          >
          <div class="input-row">
            <input
              id="offer-pasted"
              type="text"
              placeholder="Paste offer key here..."
              bind:value={inputSdpString}
              class="form-input"
            />
            <button
              class="apply-btn"
              onclick={() => applySenderOffer(inputSdpString)}>Verify</button
            >
          </div>
        </div>

        <button class="abort-btn" onclick={resetAll}>Abort</button>
      </div>
    {:else if role === "receive" && step === "answer"}
      <div class="signaling-slate">
        <span class="step-badge">Receiver Step 2 of 2</span>
        <h3>Return Answer Code</h3>
        <p>
          Scan this answer QR code with the Sender device's camera (if
          available) or copy the answer key below to paste on the sender.
        </p>

        <div class="qr-box">
          <canvas bind:this={answerQrCanvas}></canvas>
        </div>

        <div class="fallback-copy-paste">
          <button
            class="copy-code-btn"
            onclick={() => copyToClipboard(sdpAnswerString)}
          >
            {#if isCopySuccess}
              <Check size={13} /> Copied!
            {:else}
              <Copy size={13} /> Copy Answer Key
            {/if}
          </button>
        </div>

        <div class="connection-hud">
          <span class="hud-label">Awaiting P2P Link...</span>
          <div class="hud-loader animate-pulse">Establishing tunnel</div>
        </div>

        <button class="abort-btn" onclick={resetAll}>Abort</button>
      </div>

      <!-- JOINT TRANSFER STATES -->
    {:else if step === "connecting"}
      <div class="radar-slate">
        <div class="radar-pulse"></div>
        <h3>ESTABLISHING PEER CONNECTION</h3>
        <p>Negotiating direct link over WebRTC...</p>
        <button class="abort-btn mt-6" onclick={resetAll}>Cancel</button>
      </div>
    {:else if step === "connected" || step === "syncing"}
      <div class="syncing-slate">
        <div class="pill-linked">
          <span class="dot-green"></span>
          <span>WebRTC Connected</span>
        </div>

        <div class="transfer-card">
          <FileText size={24} class="text-fuchsia-400 mb-2" />
          <span class="file-name"
            >{role === "send" ? selectedFile.name : receivedFileName}</span
          >
          <span class="file-size"
            >Size: {(totalBytes / 1024).toFixed(1)} KB</span
          >

          <div class="bar-container">
            <div class="bar-fill" style="width: {progress}%"></div>
            <span class="percentage">{progress}%</span>
          </div>

          <small
            >{role === "send"
              ? "Uploading chunks..."
              : "Downloading chunks..."}</small
          >
        </div>
      </div>
    {:else if step === "complete"}
      <div class="complete-slate">
        <CheckCircle class="text-green-400 mb-2" size={36} />
        <h3>Air Link Sync Complete</h3>

        {#if role === "send"}
          <p class="summary">File successfully transferred directly to peer.</p>
        {:else}
          <p class="summary">
            {receivedFileName} ({(totalBytes / 1024).toFixed(1)} KB)
          </p>
          <button
            class="action-btn-main confirm"
            onclick={downloadReceivedFile}
          >
            <Download size={13} /> Download File
          </button>
        {/if}

        <button class="action-btn-main reset mt-4" onclick={resetAll}>
          Finish Share
        </button>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  .air-layout {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .air-card {
    background: rgba(13, 13, 23, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 18px;
    width: 100%;
    max-width: 460px;
    min-height: 300px;
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

  /* ── Setup / Initial state ── */
  .setup-slate {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 10px;

    h3 {
      font-size: 0.82rem;
      font-weight: 750;
      color: white;
      margin: 4px 0;
    }

    p {
      font-size: 0.65rem;
      color: rgba(255, 255, 255, 0.45);
      margin-bottom: 24px;
      max-width: 320px;
    }
  }

  .role-selector {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 14px;

    @media (min-width: 640px) {
      flex-direction: row;
      align-items: stretch;
    }
  }

  .send-setup-block,
  .receive-setup-block {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.01);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    padding: 14px;
  }

  .step-label {
    font-size: 0.58rem;
    font-weight: 750;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.05em;
    margin-bottom: 8px;
  }

  .or-divider {
    align-self: center;
    font-size: 0.6rem;
    font-weight: 850;
    color: rgba(255, 255, 255, 0.2);
  }

  .role-btn {
    border: none;
    border-radius: 6px;
    font-weight: 750;
    font-size: 0.72rem;
    padding: 8px 16px;
    cursor: pointer;
    outline: none;
    width: 100%;
    transition: all 0.2s;
  }

  .sender-btn {
    background: linear-gradient(135deg, #d946ef, #a21caf);
    color: white;
    box-shadow: 0 4px 12px rgba(217, 70, 239, 0.2);

    &:hover {
      box-shadow: 0 4px 18px rgba(217, 70, 239, 0.35);
    }
  }

  .receiver-btn {
    background: rgba(255, 255, 255, 0.04);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.08);

    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }
  }

  .hidden-input {
    display: none;
  }

  /* ── Signaling slates ── */
  .signaling-slate,
  .scanner-slate {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .step-badge {
    background: rgba(217, 70, 239, 0.1);
    border: 1px solid rgba(217, 70, 239, 0.25);
    color: #e879f9;
    font-size: 0.58rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 10px;
    margin-bottom: 6px;
  }

  h3 {
    font-size: 0.85rem;
    font-weight: 750;
    color: white;
    margin: 4px 0;
  }

  p {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.45);
    margin-bottom: 12px;
    max-width: 320px;
  }

  .qr-box {
    background: white;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
    margin-bottom: 12px;

    canvas {
      display: block;
      width: 140px !important;
      height: 140px !important;
    }
  }

  .copy-code-btn {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    color: white;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 16px;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
    }
  }

  .answer-verification-box,
  .manual-input-box {
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    padding: 10px;
    width: 100%;
    margin-bottom: 16px;
    text-align: left;
  }

  .input-label {
    font-size: 0.58rem;
    font-weight: 750;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.03em;
    margin-bottom: 4px;
    display: block;
  }

  .input-row {
    display: grid;
    grid-template-columns: 1fr 80px;
    gap: 8px;
  }

  .form-input {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 4px;
    padding: 6px 10px;
    font-size: 0.72rem;
    color: white;
    outline: none;

    &:focus {
      border-color: #d946ef;
    }
  }

  .apply-btn {
    background: #d946ef;
    color: white;
    font-weight: 700;
    font-size: 0.7rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .abort-btn {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.35);
    cursor: pointer;
    font-size: 0.68rem;
    text-decoration: underline;

    &:hover {
      color: #ef4444;
    }
  }

  /* ── Web scanner viewfinder ── */
  .viewfinder {
    width: 220px;
    height: 165px;
    background: black;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    margin-bottom: 16px;
  }

  .hidden-canvas {
    display: none;
  }

  .scanner-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .focus-brackets {
    position: absolute;
    inset: 20px;
    border: 1px dashed rgba(217, 70, 239, 0.4);
    pointer-events: none;
    box-shadow: 0 0 100px rgba(0, 0, 0, 0.5);
  }

  /* ── syncing slate ── */
  .syncing-slate {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
  }

  .pill-linked {
    background: rgba(74, 222, 128, 0.05);
    border: 1px solid rgba(74, 222, 128, 0.15);
    padding: 4px 12px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.65rem;
    font-weight: 700;
    color: #4ade80;
    margin-bottom: 16px;
  }

  .dot-green {
    width: 6px;
    height: 6px;
    background: #4ade80;
    border-radius: 50%;
  }

  .transfer-card {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    padding: 14px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    .file-name {
      font-size: 0.72rem;
      font-weight: 700;
      color: white;
      max-width: 280px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .file-size {
      font-size: 0.6rem;
      color: rgba(255, 255, 255, 0.4);
      margin-bottom: 12px;
    }
  }

  .bar-container {
    width: 100%;
    height: 12px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    margin-bottom: 6px;
  }

  .bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #c084fc, #d946ef);
    transition: width 0.1s linear;
  }

  .percentage {
    position: absolute;
    right: 8px;
    top: 0;
    font-size: 0.52rem;
    font-weight: 850;
    color: white;
  }

  .transfer-card small {
    font-size: 0.58rem;
    color: rgba(255, 255, 255, 0.35);
  }

  /* ── complete slate ── */
  .complete-slate {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 20px;

    h3 {
      font-size: 0.85rem;
      font-weight: 750;
      color: white;
      margin: 4px 0;
    }

    .summary {
      font-size: 0.68rem;
      color: rgba(255, 255, 255, 0.45);
      margin-bottom: 20px;
    }
  }

  .action-btn-main {
    border: none;
    border-radius: 6px;
    font-weight: 750;
    font-size: 0.72rem;
    padding: 8px 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    outline: none;
    transition: all 0.2s;

    &.confirm {
      background: #d946ef;
      color: white;
      box-shadow: 0 4px 12px rgba(217, 70, 239, 0.2);

      &:hover {
        background: #c026d3;
      }
    }

    &.reset {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      color: white;

      &:hover {
        background: rgba(255, 255, 255, 0.06);
      }
    }
  }

  .radar-slate {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    padding: 20px;

    h3 {
      font-size: 0.75rem;
      font-weight: 750;
      color: white;
      margin: 10px 0 2px 0;
    }

    p {
      font-size: 0.62rem;
      color: rgba(255, 255, 255, 0.4);
    }
  }

  .radar-pulse {
    width: 60px;
    height: 60px;
    border: 1px solid rgba(217, 70, 239, 0.3);
    border-radius: 50%;
    animation: pingPulse 1.8s infinite ease-out;
  }

  @keyframes pingPulse {
    0% {
      transform: scale(0.6);
      opacity: 0.8;
    }
    100% {
      transform: scale(1.6);
      opacity: 0;
    }
  }

  .connection-hud {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 6px;
    padding: 8px 12px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .hud-label {
      font-size: 0.62rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.45);
    }

    .hud-loader {
      font-size: 0.62rem;
      font-weight: 700;
      color: #e879f9;
    }
  }
</style>
