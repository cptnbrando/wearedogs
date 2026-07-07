<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<script>
  import { onMount } from "svelte";
  import QRCode from "qrcode";
  import { 
    QrCode, Copy, Download, Upload, Image, X, Check, AlertCircle, RefreshCw
  } from "lucide-svelte";

  // App States
  let urlText = $state("https://wearedogs.net");
  let qrSize = $state(512); // Default size 512px
  let logoSrc = $state(null); // DataURL of center logo
  let logoName = $state("");
  let logoScale = $state(0.20); // Default scale: 20% of QR size

  // DOM bindings
  let canvasElement = $state(null);
  let fileInputRef = $state(null);
  let isDragging = $state(false);

  // Toast notification state
  let toastMessage = $state("");
  let toastType = $state("success"); // 'success' | 'error'
  let toastTimer = null;

  function showToast(message, type = "success") {
    toastMessage = message;
    toastType = type;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMessage = "";
    }, 3000);
  }

  // Trigger QR Code generation when reactive properties change
  $effect(() => {
    generateQRCode(urlText, qrSize, logoSrc, logoScale);
  });

  // Base64 logo loader
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    loadLogoFile(file);
  }

  function loadLogoFile(file) {
    if (!file.type.startsWith("image/")) {
      showToast("Invalid file type. Please upload an image.", "error");
      return;
    }
    logoName = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      logoSrc = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    logoSrc = null;
    logoName = "";
    if (fileInputRef) fileInputRef.value = "";
  }

  // Drag and drop handlers
  function handleDragOver(e) {
    e.preventDefault();
    isDragging = true;
  }

  function handleDragLeave() {
    isDragging = false;
  }

  function handleDrop(e) {
    e.preventDefault();
    isDragging = false;
    const file = e.dataTransfer.files[0];
    if (file) {
      loadLogoFile(file);
    }
  }

  // Draw rounded rect function for high compatibility
  function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // Main generator function
  function generateQRCode(text, size, logo, scale) {
    if (!canvasElement) return;

    const textToEncode = text.trim() || " ";

    QRCode.toCanvas(
      canvasElement,
      textToEncode,
      {
        width: size,
        errorCorrectionLevel: "H", // High correction to handle overlapping logos securely
        margin: 0,
        color: {
          dark: "#000000",
          light: "#ffffff"
        }
      },
      (err) => {
        if (err) {
          console.error(err);
          showToast("Failed to generate QR Code.", "error");
          return;
        }

        // Draw overlay logo if provided
        if (logo) {
          const ctx = canvasElement.getContext("2d");
          const img = new window.Image();
          img.src = logo;
          img.onload = () => {
            const cx = size / 2;
            const cy = size / 2;

            // Dimensions of logo
            const logoWidth = size * scale;
            const logoHeight = size * scale;

            // Rounded container dimensions
            const padding = logoWidth * 0.12;
            const containerWidth = logoWidth + padding * 2;
            const containerHeight = logoHeight + padding * 2;
            const radius = containerWidth * 0.15;

            // 1. Draw rounded container background (white to isolate modules)
            ctx.fillStyle = "#ffffff";
            drawRoundedRect(ctx, cx - containerWidth / 2, cy - containerHeight / 2, containerWidth, containerHeight, radius);
            ctx.fill();

            // 2. Draw actual logo image inside container
            ctx.save();
            ctx.beginPath();
            drawRoundedRect(ctx, cx - logoWidth / 2, cy - logoHeight / 2, logoWidth, logoHeight, radius * 0.85);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(img, cx - logoWidth / 2, cy - logoHeight / 2, logoWidth, logoHeight);
            ctx.restore();
          };
          img.onerror = () => {
            showToast("Failed to load center logo image.", "error");
          };
        }
      }
    );
  }

  // Action: Copy to clipboard
  async function copyToClipboard() {
    if (!canvasElement) return;
    try {
      canvasElement.toBlob(async (blob) => {
        if (!blob) {
          showToast("Failed to copy image data.", "error");
          return;
        }
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob })
        ]);
        showToast("QR Code copied to clipboard!", "success");
      }, "image/png");
    } catch (err) {
      console.error(err);
      showToast("Copy failed. Try downloading instead.", "error");
    }
  }

  // Action: Download
  function downloadQRCode() {
    if (!canvasElement) return;
    try {
      const url = canvasElement.toDataURL("image/png");
      const a = document.createElement("a");
      let hostname = "qrcode";
      try {
        if (urlText.trim()) {
          const parsed = new URL(urlText.startsWith("http") ? urlText : "http://" + urlText);
          hostname = parsed.hostname.replace("www.", "") || "qrcode";
        }
      } catch (e) {
        hostname = "qrcode";
      }
      
      a.download = `qr-${hostname}-${qrSize}px.png`;
      a.href = url;
      a.click();
      showToast("Download started!", "success");
    } catch (err) {
      console.error(err);
      showToast("Download failed.", "error");
    }
  }
</script>

<div class="qrgenerator-layout animated-pane">
  <!-- Header Bar -->
  <header class="gen-header">
    <div class="header-branding">
      <span class="pulse-dot"></span>
      <h1>QR Code Generator</h1>
    </div>
  </header>

  <!-- Workspace Grid -->
  <div class="workspace-grid">
    
    <!-- LEFT PANEL: Controls -->
    <div class="panel controls-panel">
      <div class="panel-tag"><QrCode size={12} /> CONFIGURATION PANEL</div>

      <!-- URL Input Group -->
      <div class="config-group">
        <label for="url-input" class="config-label">Target Link / URL</label>
        <div class="input-wrapper">
          <input 
            id="url-input"
            type="text" 
            bind:value={urlText} 
            placeholder="Type a web link or text..." 
            class="neon-input" 
          />
          {#if urlText}
            <button class="clear-input-btn" onclick={() => urlText = ""}>✕</button>
          {/if}
        </div>
      </div>

      <!-- Size Selection Group -->
      <div class="config-group">
        <div class="label-row">
          <span class="config-label">QR Resolution</span>
          <span class="value-badge">{qrSize} x {qrSize} px</span>
        </div>
        <input 
          type="range" 
          min="128" 
          max="1024" 
          step="16" 
          bind:value={qrSize} 
          class="gen-slider"
        />
        <div class="slider-ticks">
          <span>128px</span>
          <span>512px</span>
          <span>1024px</span>
        </div>
      </div>

      <!-- Logo Selection Group -->
      <div class="config-group">
        <span class="config-label">Center Logo (Optional)</span>
        
        <!-- Drag & Drop Zone -->
        <div 
          class="dropzone" 
          class:dragging={isDragging}
          ondragover={handleDragOver}
          ondragleave={handleDragLeave}
          ondrop={handleDrop}
          onclick={() => fileInputRef.click()}
        >
          <input 
            type="file" 
            accept="image/*" 
            bind:this={fileInputRef} 
            onchange={handleFileChange} 
            class="hidden-file-input" 
          />
          
          {#if logoSrc}
            <div class="logo-preview-box" onclick={(e) => e.stopPropagation()}>
              <img src={logoSrc} alt="Uploaded logo" class="uploaded-logo-thumb" />
              <div class="logo-meta">
                <span class="logo-name-text">{logoName}</span>
                <button class="remove-logo-btn" onclick={removeLogo}>
                  <X size={12} /> Remove
                </button>
              </div>
            </div>
          {:else}
            <div class="upload-prompt">
              <Upload size={22} class="upload-icon" />
              <span class="prompt-text">Drag & Drop Image or Click to Browse</span>
              <span class="formats-text">PNG, JPG, SVG, WEBP</span>
            </div>
          {/if}
        </div>
      </div>

      <!-- Logo Scale Group (Visible only when logo uploaded) -->
      {#if logoSrc}
        <div class="config-group scale-group animated-fade">
          <div class="label-row">
            <span class="config-label">Logo Ratio (Center Size)</span>
            <span class="value-badge">{Math.round(logoScale * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="0.10" 
            max="0.25" 
            step="0.01" 
            bind:value={logoScale} 
            class="gen-slider"
          />
          <div class="slider-ticks">
            <span>10% (Small)</span>
            <span>25% (Max readable)</span>
          </div>
        </div>
      {/if}

    </div>

    <!-- RIGHT PANEL: Live Preview & Actions -->
    <div class="panel preview-panel flex flex-col justify-between items-center h-full p-4 md:p-6 overflow-hidden gap-4">
      <div class="panel-tag"><Image size={12} /> LIVE EXPORT PREVIEW</div>

      <!-- Preview Frame -->
      <div class="preview-stage-container flex flex-col items-center justify-center flex-1 min-h-0 w-full gap-4">
        <div class="preview-neon-frame aspect-square w-full">
          <canvas bind:this={canvasElement} class="qr-preview-canvas"></canvas>
        </div>
        
        <!-- Diagnostic specifications -->
        <div class="spec-footer-stats">
          <div class="stat-bubble">
            <span class="lbl">Size</span>
            <span class="val">{qrSize}px</span>
          </div>
          <div class="stat-bubble">
            <span class="lbl">Correction</span>
            <span class="val">High (30%)</span>
          </div>
          <div class="stat-bubble">
            <span class="lbl">Logo</span>
            <span class="val">{logoSrc ? "Embedded" : "None"}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons Row -->
      <div class="actions-wrapper">
        <button class="gen-action-btn copy-btn" onclick={copyToClipboard}>
          <Copy size={16} /> Copy to Clipboard
        </button>
        
        <button class="gen-action-btn download-btn" onclick={downloadQRCode}>
          <Download size={16} /> Download PNG
        </button>
      </div>

    </div>

  </div>

  <!-- Toast Notification Overlay -->
  {#if toastMessage}
    <div class="toast-popup" class:error={toastType === "error"}>
      {#if toastType === "error"}
        <AlertCircle size={16} />
      {:else}
        <Check size={16} />
      {/if}
      <span>{toastMessage}</span>
    </div>
  {/if}
</div>

<style>
  .qrgenerator-layout {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #09090d;
    overflow: hidden;
    color: white;
  }

  /* ── Header ── */
  .gen-header {
    height: 52px;
    padding: 0 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.3);
    flex-shrink: 0;
  }

  .header-branding {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .pulse-dot {
    width: 8px;
    height: 8px;
    background: #00d7ff;
    border-radius: 50%;
    box-shadow: 0 0 8px #00d7ff;
    animation: flashDot 1.5s infinite alternate;
  }

  @keyframes flashDot {
    0% { opacity: 0.3; }
    100% { opacity: 1; }
  }

  .header-branding h1 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: white;
    font-family: "Outfit", "Inter", sans-serif;
  }

  /* ── Workspace ── */
  .workspace-grid {
    flex-grow: 1;
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    height: calc(100% - 52px);
    overflow: hidden;
  }

  .panel {
    display: flex;
    flex-direction: column;
    padding: 20px;
    gap: 20px;
    overflow-y: auto;
    height: 100%;
  }

  .controls-panel {
    border-right: 1px solid rgba(255, 255, 255, 0.05);
  }

  .preview-panel {
    align-items: center;
    background: rgba(0, 0, 0, 0.15);
  }

  .panel-tag {
    font-size: 0.58rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.08em;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: "Inter", sans-serif;
    margin-bottom: -4px;
    align-self: flex-start;
  }

  /* ── Form Inputs ── */
  .config-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .config-label {
    font-size: 0.72rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: "Inter", sans-serif;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .neon-input {
    width: 100%;
    background: #0d0d12;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    color: white;
    font-size: 0.85rem;
    padding: 12px 35px 12px 14px;
    outline: none;
    transition: all 0.2s;
    font-family: "Inter", sans-serif;
  }

  .neon-input:focus {
    border-color: #00d7ff;
    box-shadow: 0 0 10px rgba(0, 215, 255, 0.15);
    background: #111118;
  }

  .clear-input-btn {
    position: absolute;
    right: 12px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.35);
    cursor: pointer;
    font-size: 0.85rem;
  }

  .clear-input-btn:hover {
    color: white;
  }

  .label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .value-badge {
    font-size: 0.68rem;
    font-weight: 700;
    color: #00d7ff;
    background: rgba(0, 215, 255, 0.08);
    padding: 2px 8px;
    border-radius: 4px;
    font-family: monospace;
  }

  .gen-slider {
    width: 100%;
    accent-color: #00d7ff;
    cursor: pointer;
  }

  .slider-ticks {
    display: flex;
    justify-content: space-between;
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.3);
    font-family: monospace;
    margin-top: -4px;
  }

  /* ── Drag & Drop Uploader ── */
  .dropzone {
    background: rgba(255, 255, 255, 0.01);
    border: 1px dashed rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.25s ease;
    min-height: 100px;
  }

  .dropzone:hover, .dropzone.dragging {
    background: rgba(0, 215, 255, 0.03);
    border-color: #00d7ff;
  }

  .hidden-file-input {
    display: none;
  }

  .upload-prompt {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
  }

  .upload-icon {
    color: rgba(255, 255, 255, 0.3);
    transition: color 0.2s;
  }

  .dropzone:hover .upload-icon {
    color: #00d7ff;
    transform: translateY(-2px);
  }

  .prompt-text {
    font-size: 0.78rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.75);
    font-family: "Inter", sans-serif;
  }

  .formats-text {
    font-size: 0.62rem;
    color: rgba(255, 255, 255, 0.35);
    font-family: monospace;
  }

  .logo-preview-box {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 8px 12px;
  }

  .uploaded-logo-thumb {
    width: 38px;
    height: 38px;
    object-fit: contain;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .logo-meta {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .logo-name-text {
    font-size: 0.75rem;
    font-weight: 500;
    color: white;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .remove-logo-btn {
    align-self: flex-start;
    background: transparent;
    border: none;
    color: #ff3344;
    font-size: 0.68rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0;
  }

  .remove-logo-btn:hover {
    color: #ff5566;
    text-decoration: underline;
  }

  /* ── Preview Stage ── */
  .preview-stage-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .preview-neon-frame {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.06);
    padding: 12px; /* Small neon box padding */
    border-radius: 16px;
    box-shadow: 
      0 20px 50px rgba(0, 0, 0, 0.5),
      0 0 25px rgba(0, 215, 255, 0.02);
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1 / 1 !important;
    width: 100%;
    max-width: min(280px, 35vh);
    max-height: min(280px, 35vh);
    transition: all 0.3s;
    overflow: hidden;
  }

  .preview-neon-frame:hover {
    border-color: rgba(0, 215, 255, 0.3);
    box-shadow: 
      0 20px 50px rgba(0, 0, 0, 0.6),
      0 0 35px rgba(0, 215, 255, 0.08);
  }

  .qr-preview-canvas {
    aspect-ratio: 1 / 1 !important;
    width: 100% !important;
    height: 100% !important;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    background: #ffffff; /* White surrounding background */
    padding: 10px;        /* Surrounding whitespace border */
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.35);
  }

  .spec-footer-stats {
    display: flex;
    gap: 12px;
    margin-top: 20px;
    justify-content: center;
  }

  .stat-bubble {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 6px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .stat-bubble .lbl {
    font-size: 0.52rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-bubble .val {
    font-size: 0.68rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.85);
    font-family: monospace;
  }

  /* ── Action Buttons ── */
  .actions-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    max-width: 280px;
    margin-top: auto;
  }

  .gen-action-btn {
    border: none;
    border-radius: 8px;
    padding: 12px;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
    font-family: "Outfit", "Inter", sans-serif;
  }

  .gen-action-btn.copy-btn {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: white;
  }

  .gen-action-btn.copy-btn:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  .gen-action-btn.download-btn {
    background: #00d7ff;
    color: black;
  }

  .gen-action-btn.download-btn:hover {
    box-shadow: 0 4px 18px rgba(0, 215, 255, 0.35);
    transform: translateY(-1px);
  }

  /* ── Toast Popup ── */
  .toast-popup {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 215, 255, 0.12);
    border: 1px solid rgba(0, 215, 255, 0.35);
    color: #00d7ff;
    border-radius: 8px;
    padding: 10px 18px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.78rem;
    font-weight: 700;
    box-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.5),
      0 0 15px rgba(0, 215, 255, 0.08);
    backdrop-filter: blur(10px);
    z-index: 1000;
    font-family: "Inter", sans-serif;
    animation: toastIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards;
  }

  .toast-popup.error {
    background: rgba(255, 51, 68, 0.12);
    border-color: rgba(255, 51, 68, 0.35);
    color: #ff3344;
  }

  @keyframes toastIn {
    0% { transform: translate(-50%, 15px); opacity: 0; }
    100% { transform: translate(-50%, 0); opacity: 1; }
  }

  /* ── Animation Helpers ── */
  .animated-fade {
    animation: fadeIn 0.25s ease-out forwards;
  }

  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(4px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  /* ── Responsive Viewports ── */

  /* Viewport Mode 1: Mobile Portrait */
  @media (max-width: 639px) {
    .workspace-grid {
      grid-template-columns: 1fr;
      height: auto;
      overflow-y: auto;
    }
    .panel {
      height: auto;
      overflow: visible;
      padding: 16px;
    }
    .controls-panel {
      border-right: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .preview-neon-frame {
      max-width: min(220px, 30vh);
      max-height: min(220px, 30vh);
      padding: 8px;
    }
    .actions-wrapper {
      max-width: 100%;
      margin-top: 16px;
    }
  }

  /* Viewport Mode 2: Mobile Landscape */
  @media (min-width: 640px) and (max-width: 767px) {
    .workspace-grid {
      grid-template-columns: 1fr 1fr;
      height: calc(100% - 52px);
    }
    .panel {
      padding: 12px;
      gap: 12px;
    }
    .preview-neon-frame {
      max-width: min(180px, 35vh);
      max-height: min(180px, 35vh);
      padding: 8px;
    }
    .actions-wrapper {
      max-width: 100%;
    }
  }

  /* Viewport Mode 3: Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    .workspace-grid {
      grid-template-columns: 1.1fr 0.9fr;
    }
    .panel {
      padding: 16px;
      gap: 16px;
    }
    .preview-neon-frame {
      max-width: min(240px, 35vh);
      max-height: min(240px, 35vh);
      padding: 8px;
    }
  }

  /* Viewport Mode 4: Desktop */
  @media (min-width: 1024px) and (max-width: 1599px) {
    .workspace-grid {
      max-width: 1100px;
      margin: 0 auto;
      width: 100%;
      border-left: 1px solid rgba(255, 255, 255, 0.04);
      border-right: 1px solid rgba(255, 255, 255, 0.04);
    }
  }

  /* Viewport Mode 5: TV / Ultra-wide */
  @media (min-width: 1600px) {
    .workspace-grid {
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      border-left: 1px solid rgba(255, 255, 255, 0.05);
      border-right: 1px solid rgba(255, 255, 255, 0.05);
    }
    .header-branding h1 {
      font-size: 1.25rem;
    }
    .config-label {
      font-size: 0.85rem;
    }
    .neon-input {
      font-size: 1rem;
    }
    .value-badge {
      font-size: 0.8rem;
    }
    .preview-neon-frame {
      max-width: min(380px, 35vh);
      max-height: min(380px, 35vh);
      padding: 12px;
    }
    .actions-wrapper {
      max-width: 380px;
    }
    .gen-action-btn {
      font-size: 0.95rem;
      padding: 14px;
    }
  }

  /* Short screen height styles (to eliminate vertical scrollbars) */
  @media (max-height: 640px) {
    .panel {
      padding: 10px;
      gap: 10px;
    }
    .preview-panel {
      padding: 10px;
      gap: 10px;
    }
    .preview-stage-container {
      gap: 8px;
    }
    .spec-footer-stats {
      margin-top: 8px;
      gap: 8px;
    }
    .stat-bubble {
      padding: 4px 8px;
    }
    .actions-wrapper {
      flex-direction: row;
      gap: 8px;
      max-width: 100%;
    }
    .gen-action-btn {
      padding: 8px;
      font-size: 0.75rem;
      flex: 1;
    }
  }
</style>
