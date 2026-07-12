<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<script>
  import { onMount } from "svelte";
  import { 
    FileText, Copy, Download, Upload, X, Check, RefreshCw, Sliders, Play
  } from "lucide-svelte";

  // App Reactive States
  let imageFile = $state(null);
  let imageUrl = $state("");
  let ocrProgress = $state(0);
  let ocrStatus = $state("Idle");
  let extractedText = $state("");
  let isProcessing = $state(false);
  let isDragging = $state(false);
  let tesseractLoaded = $state(false);
  let errorMsg = $state("");

  // Mobile Tab Navigation State ('capture' | 'output')
  let activeMobileTab = $state("capture");

  // Preprocessing filters
  let filterGrayscale = $state(true);
  let filterContrast = $state(130);   // range: 100 - 300%
  let filterBinarize = $state(128);   // range: 0 - 255. 0 means disabled.

  // DOM elements & HTMLImageElement caching
  let fileInputRef = $state(null);
  let canvasElement = $state(null);
  let sourceImage = $state(null);

  // Clipboard copy temporary feedback
  let copyFeedback = $state(false);

  // Derived metrics
  let charCount = $derived(extractedText.length);
  let wordCount = $derived(extractedText.trim() === "" ? 0 : extractedText.trim().split(/\s+/).length);
  let lineCount = $derived(extractedText.trim() === "" ? 0 : extractedText.split("\n").length);

  // Reactively redraw the image when image filters change
  $effect(() => {
    if (sourceImage && canvasElement) {
      drawAndFilterImage();
    }
  });

  // Dynamic Tesseract.js script loader to respect the Potato Target
  function loadTesseract() {
    return new Promise((resolve, reject) => {
      if (window.Tesseract) {
        tesseractLoaded = true;
        resolve(window.Tesseract);
        return;
      }
      ocrStatus = "Loading OCR library...";
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
      script.onload = () => {
        tesseractLoaded = true;
        ocrStatus = "OCR Engine ready.";
        resolve(window.Tesseract);
      };
      script.onerror = () => {
        ocrStatus = "Failed to load OCR library.";
        reject(new Error("Failed to load Tesseract.js from CDN"));
      };
      document.head.appendChild(script);
    });
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  }

  function processFile(file) {
    if (!file.type.startsWith("image/")) {
      errorMsg = "Unsupported file format. Please upload a PNG, JPG, or WEBP image.";
      return;
    }
    errorMsg = "";
    imageFile = file;
    ocrProgress = 0;
    ocrStatus = "Idle";
    extractedText = "";
    activeMobileTab = "capture"; // Keep on capture tab when new image uploaded

    const reader = new FileReader();
    reader.onload = (event) => {
      imageUrl = event.target.result;
      const img = new window.Image();
      img.src = imageUrl;
      img.onload = () => {
        sourceImage = img;
      };
    };
    reader.readAsDataURL(file);
  }

  // Draw image to canvas and apply selected preprocessing filters
  function drawAndFilterImage() {
    if (!canvasElement || !sourceImage) return;
    const ctx = canvasElement.getContext("2d");
    if (!ctx) return;

    // Constrain image size for performance while retaining OCR readability
    const maxDimension = 900;
    let w = sourceImage.naturalWidth || sourceImage.width;
    let h = sourceImage.naturalHeight || sourceImage.height;

    if (w > maxDimension || h > maxDimension) {
      if (w > h) {
        h = Math.round((h * maxDimension) / w);
        w = maxDimension;
      } else {
        w = Math.round((w * maxDimension) / h);
        h = maxDimension;
      }
    }

    canvasElement.width = w;
    canvasElement.height = h;
    ctx.clearRect(0, 0, w, h);

    // Apply native CSS context filters
    let filterString = "";
    if (filterGrayscale) {
      filterString += "grayscale(100%) ";
    }
    if (filterContrast !== 100) {
      filterString += `contrast(${filterContrast}%) `;
    }

    ctx.filter = filterString.trim() || "none";
    ctx.drawImage(sourceImage, 0, 0, w, h);

    // Apply manual pixel-level binarization if requested
    if (filterBinarize > 0) {
      // Draw image unfiltered first to manually perform custom thresholding
      ctx.filter = "none";
      ctx.drawImage(sourceImage, 0, 0, w, h);

      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      const threshold = filterBinarize;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];

        // Standard grayscale conversion using custom weights
        let v = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        // Apply contrast factor manually
        if (filterContrast !== 100) {
          const factor = (259 * (filterContrast + 255)) / (255 * (259 - filterContrast));
          v = factor * (v - 128) + 128;
        }

        // Binarize pixel
        const binarized = v >= threshold ? 255 : 0;
        data[i] = binarized;
        data[i+1] = binarized;
        data[i+2] = binarized;
      }
      ctx.putImageData(imgData, 0, 0);
    }
  }

  // Trigger OCR extraction
  async function runOCR() {
    if (!canvasElement || isProcessing) return;
    isProcessing = true;
    errorMsg = "";
    ocrProgress = 0;
    ocrStatus = "Initializing engine...";

    try {
      const Tesseract = await loadTesseract();
      ocrStatus = "Starting scanning worker...";
      
      const { data: { text } } = await Tesseract.recognize(
        canvasElement,
        "eng",
        {
          logger: (m) => {
            if (m.status === "recognizing text") {
              ocrStatus = `Reading symbols: ${Math.round(m.progress * 100)}%`;
              ocrProgress = m.progress * 100;
            } else {
              ocrStatus = m.status.charAt(0).toUpperCase() + m.status.slice(1);
              ocrProgress = Math.max(ocrProgress, 12);
            }
          }
        }
      );

      extractedText = text || "No text was detected in the image.";
      ocrStatus = "Extraction completed successfully.";
      ocrProgress = 100;
      
      // Auto-navigate to output tab on mobile for immediate results feedback
      activeMobileTab = "output";
    } catch (err) {
      console.error(err);
      errorMsg = "Extraction failed: " + err.message;
      ocrStatus = "Scan error";
      ocrProgress = 0;
    } finally {
      isProcessing = false;
    }
  }

  // Copy to clipboard
  async function copyToClipboard() {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      copyFeedback = true;
      setTimeout(() => {
        copyFeedback = false;
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  }

  // Save parsed file locally
  function downloadText() {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const namePrefix = imageFile ? imageFile.name.substring(0, imageFile.name.lastIndexOf('.')) : "ocr-text";
    a.download = `${namePrefix}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function resetApp() {
    imageFile = null;
    imageUrl = "";
    sourceImage = null;
    ocrProgress = 0;
    ocrStatus = "Idle";
    extractedText = "";
    errorMsg = "";
    activeMobileTab = "capture";
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
      processFile(file);
    }
  }
</script>

<div class="reader-app-container w-full h-full max-w-7xl mx-auto flex flex-col justify-start p-3 sm:p-5 overflow-hidden">
  
  <!-- App Branding Header -->
  <header class="app-header-block flex items-center justify-between border-b border-white/5 pb-2.5 mb-3 flex-shrink-0">
    <div class="flex items-center gap-3">
      <div class="header-icon-glow flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20">
        <FileText class="text-red-400" size={16} />
      </div>
      <div>
        <h2 class="text-xs sm:text-sm md:text-base font-extrabold uppercase tracking-widest text-white leading-none">Image Reader</h2>
        <span class="text-[9px] sm:text-[10px] text-white/40 font-mono tracking-wider">OPTICAL CHARACTER EXTRACTOR</span>
      </div>
    </div>
    
    {#if imageFile}
      <button class="reset-pill-btn flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition text-[10px] sm:text-[11px] text-white font-medium" onclick={resetApp}>
        <X size={11} /> Clear
      </button>
    {/if}
  </header>

  <!-- Main Viewports Split Layout -->
  <div class="flex-grow flex flex-col sm:flex-row gap-3.5 overflow-hidden relative min-h-0">
    
    <!-- LEFT PANEL: Image Input & Process Filters -->
    <div class="w-full sm:w-1/2 flex flex-col gap-3 min-h-0 flex-grow {activeMobileTab === 'capture' ? 'flex' : 'hidden'} sm:flex">
      
      {#if !imageUrl}
        <!-- Upload Slate -->
        <div 
          class="flex-grow flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-xl transition-all duration-200 text-center cursor-pointer min-h-[150px] sm:min-h-0 {isDragging ? 'border-red-500 bg-red-500/5' : 'border-white/10 hover:border-white/20 hover:bg-white/2'}"
          onclick={() => fileInputRef.click()}
          ondragover={handleDragOver}
          ondragleave={handleDragLeave}
          ondrop={handleDrop}
        >
          <input 
            type="file" 
            bind:this={fileInputRef}
            onchange={handleFileChange}
            accept="image/*"
            class="hidden" 
          />
          
          <div class="upload-art-pulse relative flex items-center justify-center w-12 h-12 rounded-full bg-white/3 mb-3">
            <Upload class="text-white/60" size={20} />
          </div>
          
          <h3 class="text-xs font-bold text-white mb-0.5">Drag & drop or tap to upload</h3>
          <p class="text-[10px] text-white/40 max-w-[240px] mx-auto mb-2.5">
            PNG, JPG, or WEBP. Local browser processing.
          </p>
          
          <button class="select-btn-badge text-[10px] px-3.5 py-1 rounded bg-red-500 text-black font-extrabold shadow-md shadow-red-500/10">
            CHOOSE FILE
          </button>
        </div>
      {:else}
        <!-- Preview Board with Canvas -->
        <div class="relative flex-grow flex items-center justify-center bg-black/40 border border-white/5 rounded-xl overflow-hidden min-h-[140px] sm:min-h-0">
          
          <!-- Image Scan Line Overlay -->
          {#if isProcessing}
            <div class="scan-laser-line"></div>
          {/if}
          
          <!-- Dynamic Canvas Rendering -->
          <canvas 
            bind:this={canvasElement}
            class="max-w-full max-h-full object-contain rounded p-2"
          ></canvas>
        </div>

        <!-- Filter Sliders Tray -->
        <div class="filters-card-wrapper p-3 bg-white/2 border border-white/5 rounded-xl flex-shrink-0">
          <div class="flex items-center gap-2 mb-2.5">
            <Sliders class="text-red-400" size={12} />
            <h4 class="text-[9px] font-extrabold uppercase tracking-wider text-white/60">Preprocessing Adjustments</h4>
          </div>

          <div class="grid grid-cols-1 xs:grid-cols-2 gap-3">
            <div class="flex flex-col gap-1">
              <div class="flex justify-between items-center text-[9px] font-mono">
                <span class="text-white/50">CONTRAST ACCENT</span>
                <span class="text-red-400">{filterContrast}%</span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="300" 
                bind:value={filterContrast}
                class="accent-slider-bar" 
              />
            </div>

            <div class="flex flex-col gap-1">
              <div class="flex justify-between items-center text-[9px] font-mono">
                <span class="text-white/50">BINARIZATION THRESHOLD</span>
                <span class="text-red-400">{filterBinarize > 0 ? filterBinarize : "OFF"}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="240" 
                bind:value={filterBinarize}
                class="accent-slider-bar" 
              />
            </div>
          </div>

          <!-- Bottom Option Toggles -->
          <div class="flex items-center justify-between border-t border-white/5 mt-2.5 pt-2.5">
            <label class="toggle-switch-wrapper flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                bind:checked={filterGrayscale}
                class="sr-only peer" 
              />
              <div class="w-7 h-4 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-red-500 relative"></div>
              <span class="text-[9px] font-mono text-white/50">MONOCHROME</span>
            </label>

            <button 
              class="launch-ocr-btn flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider bg-red-500 text-black px-3.5 py-1.5 rounded shadow-sm shadow-red-500/10 hover:shadow-red-500/25 transition disabled:opacity-50"
              disabled={isProcessing}
              onclick={runOCR}
            >
              {#if isProcessing}
                <RefreshCw size={11} class="animate-spin" /> SCANNING
              {:else}
                <Play size={9} fill="currentColor" /> EXTRACT TEXT
              {/if}
            </button>
          </div>
        </div>
      {/if}
    </div>

    <!-- RIGHT PANEL: Extraction Terminal & Clipboard Tools -->
    <div class="w-full sm:w-1/2 flex flex-col gap-3 min-h-0 flex-grow {activeMobileTab === 'output' ? 'flex' : 'hidden'} sm:flex">
      
      <!-- OCR Status Log Board -->
      <div class="status-console-card p-2.5 bg-black/60 border border-white/5 rounded-xl font-mono text-[9px] flex-shrink-0 flex items-center justify-between min-h-[44px]">
        <div class="flex flex-col gap-0.5">
          <span class="text-white/30 tracking-wider">SCANNER BUS:</span>
          <span class="text-white/80 font-bold flex items-center gap-1">
            {#if isProcessing}
              <span class="pulse-scanning-dot"></span>
            {/if}
            {ocrStatus}
          </span>
        </div>
        
        {#if isProcessing || ocrProgress > 0}
          <div class="flex flex-col items-end gap-1 w-20">
            <span class="text-[9px] text-red-400 font-bold">{Math.round(ocrProgress)}%</span>
            <div class="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div class="h-full bg-red-500" style="width: {ocrProgress}%"></div>
            </div>
          </div>
        {/if}
      </div>

      <!-- Output Editable Console -->
      <div class="flex-grow flex flex-col bg-white/2 border border-white/5 rounded-xl overflow-hidden min-h-[120px] sm:min-h-0 relative">
        <div class="console-sub-bar flex items-center justify-between px-3 py-1.5 border-b border-white/5 bg-white/1 flex-shrink-0 text-[9px] font-mono text-white/40">
          <span>PARSED TEXT OUTPUT</span>
          <div class="flex items-center gap-2">
            <span>CHARS: {charCount}</span>
            <span>WORDS: {wordCount}</span>
          </div>
        </div>

        <!-- Terminal textarea -->
        <textarea
          bind:value={extractedText}
          placeholder="Extracted text will appear here once scanning is finished."
          class="flex-grow w-full p-3.5 bg-transparent resize-none border-none outline-none font-mono text-xs text-white/95 leading-relaxed placeholder:text-white/20 focus:ring-0 overflow-y-auto"
          disabled={isProcessing}
        ></textarea>

        <!-- Actions Drawer -->
        {#if extractedText}
          <div class="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
            <button 
              class="action-pill-btn flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition text-[10px] text-white/80 hover:text-white font-medium"
              onclick={copyToClipboard}
              title="Copy to clipboard"
            >
              {#if copyFeedback}
                <Check size={11} class="text-green-400" /> Copied
              {:else}
                <Copy size={11} /> Copy
              {/if}
            </button>

            <button 
              class="action-pill-btn flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition text-[10px] text-white/80 hover:text-white font-medium"
              onclick={downloadText}
              title="Save as TXT file"
            >
              <Download size={11} /> Save
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Mobile Portrait Bottom Tabs Navigation -->
  <div class="flex sm:hidden justify-around items-center bg-black/60 border border-white/5 rounded-xl py-2 mt-3 flex-shrink-0">
    <button 
      class="flex flex-col items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider transition-colors px-4 py-1.5 rounded-lg {activeMobileTab === 'capture' ? 'text-red-500 bg-white/3' : 'text-white/40 hover:text-white/60'}"
      onclick={() => activeMobileTab = 'capture'}
    >
      <Upload size={14} />
      <span>Adjust & Scan</span>
    </button>
    <button 
      class="flex flex-col items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider transition-colors px-4 py-1.5 rounded-lg {activeMobileTab === 'output' ? 'text-red-500 bg-white/3' : 'text-white/40 hover:text-white/60'}"
      onclick={() => activeMobileTab = 'output'}
    >
      <FileText size={14} />
      <span>Extracted Text</span>
    </button>
  </div>

  <!-- TV & Ultra-wide empty bleed warning / footer support -->
  {#if errorMsg}
    <div class="mt-2.5 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-[9px] font-mono flex items-center gap-2 flex-shrink-0">
      <span class="inline-block w-1.5 h-1.5 bg-red-500 rounded-full"></span>
      {errorMsg}
    </div>
  {/if}
</div>

<style lang="scss">
  @use "../../styles/variables" as vars;

  // Scanner Laser scanning sweep effect
  .scan-laser-line {
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.8), transparent);
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.9);
    animation: scanLineSweep 2.2s infinite linear;
    z-index: 20;
    pointer-events: none;
  }

  @keyframes scanLineSweep {
    0% {
      top: 0%;
    }
    50% {
      top: 100%;
    }
    100% {
      top: 0%;
    }
  }

  // Scanner running state pulsing dot
  .pulse-scanning-dot {
    width: 6px;
    height: 6px;
    background: #ff3344;
    border-radius: 50%;
    box-shadow: 0 0 8px #ff3344;
    animation: simplePulseGlow 1s infinite alternate;
  }

  @keyframes simplePulseGlow {
    0% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }

  // Preprocessing slider customization
  .accent-slider-bar {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.08);
    outline: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #ff3344;
      cursor: pointer;
      border: 2px solid #050508;
      box-shadow: 0 0 5px rgba(255, 51, 68, 0.4);
      transition: transform 0.1s ease;

      &:hover {
        transform: scale(1.2);
      }
    }
    
    &::-moz-range-thumb {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #ff3344;
      cursor: pointer;
      border: 2px solid #050508;
      box-shadow: 0 0 5px rgba(255, 51, 68, 0.4);
      transition: transform 0.1s ease;

      &:hover {
        transform: scale(1.2);
      }
    }
  }

  // Standard layouts and styling overrides to match project aesthetics
  .reader-app-container {
    font-family: vars.$font-primary;
    background: transparent;
    
    // Make sure layouts adjust flawlessly to television scales
    @media (min-width: 1920px) {
      .select-btn-badge, .launch-ocr-btn {
        font-size: 0.85rem;
        padding: 0.75rem 1.5rem;
      }
      textarea {
        font-size: 0.95rem;
      }
      .app-header-block h2 {
        font-size: 1.15rem;
      }
    }
  }
</style>
