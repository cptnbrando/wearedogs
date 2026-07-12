<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<script>
  import { onMount } from "svelte";
  import { 
    FileText, Copy, Download, Upload, X, Check, RefreshCw, Sliders, Play, Sparkles
  } from "lucide-svelte";
  import Tesseract from "tesseract.js";

  // App Reactive States
  let bulkFiles = $state([]); // array of { file, name, url, status, progress, text, error, sourceImage }
  let activeFileIndex = $state(-1);
  let isProcessing = $state(false);
  let isDragging = $state(false);
  let errorMsg = $state("");
  let ocrProgress = $state(0);
  let ocrStatus = $state("Idle");

  // Mobile Tab Navigation State ('capture' | 'output')
  let activeMobileTab = $state("capture");

  // Preprocessing filters
  let filterGrayscale = $state(true);
  let filterContrast = $state(130);   // range: 100 - 300%
  let filterBinarize = $state(128);   // range: 0 - 255. 0 means disabled.

  // DOM elements
  let fileInputRef = $state(null);
  let canvasElement = $state(null);

  // Clipboard copy temporary feedback
  let copyFeedback = $state(false);
  let copyAllFeedback = $state(false);

  // Derived active file references
  let activeItem = $derived(activeFileIndex >= 0 && activeFileIndex < bulkFiles.length ? bulkFiles[activeFileIndex] : null);
  let imageUrl = $derived(activeItem ? activeItem.url : "");
  let sourceImage = $derived(activeItem ? activeItem.sourceImage : null);
  let extractedText = $derived(activeItem ? activeItem.text : "");

  // Text metrics derived from active file text
  let charCount = $derived(extractedText.length);
  let wordCount = $derived(extractedText.trim() === "" ? 0 : extractedText.trim().split(/\s+/).length);

  // Reactively redraw the image when active image or filters change
  $effect(() => {
    if (sourceImage && canvasElement) {
      drawAndFilterImage();
    }
  });



  function handleFileChange(e) {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  }

  function processFiles(files) {
    errorMsg = "";
    // Limit to 25 files at once to maintain performance
    const filesList = Array.from(files).slice(0, 25);
    
    // Check for invalid file types
    const invalidFiles = filesList.filter(f => !f.type.startsWith("image/"));
    if (invalidFiles.length > 0) {
      errorMsg = "Some files were skipped. Only image formats (.png, .jpg, .webp) are supported.";
    }

    const validFiles = filesList.filter(f => f.type.startsWith("image/"));
    if (validFiles.length === 0) {
      if (!errorMsg) errorMsg = "Please upload valid image files.";
      return;
    }

    const newItems = validFiles.map(file => ({
      file,
      name: file.name,
      url: "",
      status: "idle",
      progress: 0,
      text: "",
      error: "",
      sourceImage: null
    }));

    const startIdx = bulkFiles.length;
    bulkFiles = [...bulkFiles, ...newItems];

    if (activeFileIndex === -1) {
      activeFileIndex = 0;
    }

    // Load URLs and HTMLImageElements reactively
    newItems.forEach((item, index) => {
      const targetIdx = startIdx + index;
      const reader = new FileReader();
      reader.onload = (event) => {
        bulkFiles[targetIdx].url = event.target.result;
        const img = new window.Image();
        img.src = event.target.result;
        img.onload = () => {
          bulkFiles[targetIdx].sourceImage = img;
          // Trigger initial canvas draw if active
          if (targetIdx === activeFileIndex) {
            drawAndFilterImage();
          }
        };
      };
      reader.readAsDataURL(item.file);
    });
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

  // Trigger OCR extraction on active file
  async function runOCR() {
    if (!canvasElement || isProcessing || activeFileIndex === -1) return;
    isProcessing = true;
    errorMsg = "";
    ocrProgress = 0;
    ocrStatus = "Initializing engine...";
    
    if (activeItem) {
      activeItem.status = "scanning";
      activeItem.progress = 0;
    }

    try {
      ocrStatus = "Starting scanning worker...";
      
      const { data: { text } } = await Tesseract.recognize(
        canvasElement,
        "eng",
        {
          logger: (m) => {
            if (m.status === "recognizing text") {
              ocrStatus = `Reading symbols: ${Math.round(m.progress * 100)}%`;
              ocrProgress = m.progress * 100;
              if (activeItem) activeItem.progress = ocrProgress;
            } else {
              ocrStatus = m.status.charAt(0).toUpperCase() + m.status.slice(1);
              ocrProgress = Math.max(ocrProgress, 12);
              if (activeItem) activeItem.progress = ocrProgress;
            }
          }
        }
      );

      if (activeItem) {
        activeItem.text = text || "No text detected.";
        activeItem.status = "done";
        activeItem.progress = 100;
      }
      
      ocrStatus = "Extraction completed successfully.";
      ocrProgress = 100;
      activeMobileTab = "output";
    } catch (err) {
      console.error(err);
      errorMsg = "Extraction failed: " + err.message;
      ocrStatus = "Scan error";
      ocrProgress = 0;
      if (activeItem) {
        activeItem.status = "error";
        activeItem.error = err.message;
      }
    } finally {
      isProcessing = false;
    }
  }

  // Batch process all files sequentially
  async function runBatchOCR() {
    if (isProcessing || bulkFiles.length === 0) return;
    isProcessing = true;
    errorMsg = "";
    ocrProgress = 0;

    try {

      for (let i = 0; i < bulkFiles.length; i++) {
        const item = bulkFiles[i];
        if (item.status === "done") continue; // Skip already completed files

        activeFileIndex = i;
        item.status = "scanning";
        item.progress = 0;

        // Briefly wait for Svelte reactivity to render canvas
        await new Promise(r => setTimeout(r, 60));

        try {
          const { data: { text } } = await Tesseract.recognize(
            canvasElement,
            "eng",
            {
              logger: (m) => {
                if (m.status === "recognizing text") {
                  ocrStatus = `Batch [${i+1}/${bulkFiles.length}]: ${Math.round(m.progress * 100)}%`;
                  ocrProgress = m.progress * 100;
                  item.progress = ocrProgress;
                } else {
                  ocrStatus = `Batch [${i+1}/${bulkFiles.length}]: preparing...`;
                }
              }
            }
          );

          item.text = text || "No text detected.";
          item.status = "done";
          item.progress = 100;
        } catch (err) {
          console.error(err);
          item.status = "error";
          item.error = err.message;
        }
      }

      ocrStatus = "Batch scan completed.";
      ocrProgress = 100;
      activeMobileTab = "output";
    } catch (err) {
      console.error(err);
      errorMsg = "Batch OCR failed: " + err.message;
    } finally {
      isProcessing = false;
    }
  }

  // Alphanumeric density filter to strip junk background noise characters
  function cleanText(rawText) {
    if (!rawText) return "";
    const lines = rawText.split("\n");
    
    const cleanedLines = lines.map(line => {
      let l = line.trim();
      if (l.length === 0) return "";
      
      // Calculate ratio of alphanumeric characters to overall characters in line
      const alphaNum = (l.match(/[a-zA-Z0-9]/g) || []).length;
      if (alphaNum / l.length < 0.35) {
        // Discard background/noise lines (e.g. "py / <) Wi" or "\ ) A HN:")
        return "";
      }
      
      // Strip stray symbols surrounded by spaces
      l = l.replace(/\s+[\W_]\s+/g, " ");
      // Strip blocks of consecutive symbols
      l = l.replace(/[\W_]{3,}/g, "");
      
      return l.trim();
    }).filter(line => line.length > 0);

    return cleanedLines.join("\n");
  }

  // Clean parsed text in active textbox
  function cleanActiveText() {
    if (activeItem && activeItem.text) {
      activeItem.text = cleanText(activeItem.text);
    }
  }

  // Copy active text
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

  // Save active text
  function downloadText() {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const namePrefix = activeItem ? activeItem.name.substring(0, activeItem.name.lastIndexOf('.')) : "ocr-text";
    a.download = `${namePrefix}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Combined text derived from all bulkFiles
  let combinedText = $derived(
    bulkFiles
      .map(item => `--- ${item.name} ---\n${item.text || "(No parsed text)"}\n`)
      .join("\n")
  );

  // Copy combined text
  async function copyAllToClipboard() {
    if (bulkFiles.length === 0) return;
    try {
      await navigator.clipboard.writeText(combinedText);
      copyAllFeedback = true;
      setTimeout(() => {
        copyAllFeedback = false;
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  }

  // Download combined txt file
  function downloadCombinedText() {
    if (bulkFiles.length === 0) return;
    const blob = new Blob([combinedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `combined-ocr-batch.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function removeFile(index) {
    if (isProcessing) return;
    bulkFiles = bulkFiles.filter((_, i) => i !== index);
    if (activeFileIndex >= bulkFiles.length) {
      activeFileIndex = bulkFiles.length - 1;
    }
  }

  function resetApp() {
    bulkFiles = [];
    activeFileIndex = -1;
    ocrProgress = 0;
    ocrStatus = "Idle";
    errorMsg = "";
    activeMobileTab = "capture";
    if (fileInputRef) fileInputRef.value = "";
  }

  function handleTextChange(e) {
    if (activeItem) {
      activeItem.text = e.target.value;
    }
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
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
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
    
    {#if bulkFiles.length > 0}
      <button class="reset-pill-btn flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition text-[10px] sm:text-[11px] text-white font-medium" onclick={resetApp}>
        <X size={11} /> Clear All ({bulkFiles.length})
      </button>
    {/if}
  </header>

  <!-- Main Viewports Split Layout -->
  <div class="flex-grow flex flex-col sm:flex-row gap-3.5 overflow-hidden relative min-h-0">
    
    <!-- LEFT PANEL: Image Input, Batch list, & Process Filters -->
    <div class="w-full sm:w-1/2 flex flex-col gap-3 min-h-0 flex-grow {activeMobileTab === 'capture' ? 'flex' : 'hidden'} sm:flex">
      
      <!-- Upload Drop Zone -->
      {#if bulkFiles.length === 0}
        <div 
          class="flex-grow flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-xl transition-all duration-200 text-center cursor-pointer min-h-[160px] sm:min-h-0 {isDragging ? 'border-red-500 bg-red-500/5' : 'border-white/10 hover:border-white/20 hover:bg-white/2'}"
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
            multiple
            class="hidden" 
          />
          
          <div class="upload-art-pulse relative flex items-center justify-center w-12 h-12 rounded-full bg-white/3 mb-3">
            <Upload class="text-white/60" size={20} />
          </div>
          
          <h3 class="text-xs font-bold text-white mb-0.5">Drag & drop images or tap to upload</h3>
          <p class="text-[10px] text-white/40 max-w-[240px] mx-auto mb-2.5">
            PNG, JPG, or WEBP. Upload up to 25 files at once for batch parsing.
          </p>
          
          <button class="select-btn-badge text-[10px] px-3.5 py-1 rounded bg-red-500 text-black font-extrabold shadow-md shadow-red-500/10">
            SELECT FILES
          </button>
        </div>
      {:else}
        <!-- Bulk List Badges Wrap Grid (no horizontal scrollbar violations) -->
        <div class="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto mb-1 border-b border-white/5 pb-2 flex-shrink-0">
          {#each bulkFiles as item, idx}
            <button 
              class="flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] border font-mono transition-all {activeFileIndex === idx ? 'border-red-500 bg-red-500/10 text-white font-extrabold shadow shadow-red-500/5' : 'border-white/5 bg-white/1 text-white/50 hover:border-white/15'}"
              onclick={() => {
                if (!isProcessing) activeFileIndex = idx;
              }}
            >
              <span class="truncate max-w-[85px]">{item.name}</span>
              {#if item.status === 'done'}
                <Check size={10} class="text-green-400" />
              {:else if item.status === 'scanning'}
                <RefreshCw size={10} class="text-red-400 animate-spin" />
              {:else if item.status === 'error'}
                <span class="text-red-500 text-[10px]">✕</span>
              {/if}
              <span 
                class="text-[9px] hover:text-red-500 ml-1.5 opacity-40 hover:opacity-100 font-bold"
                onclick={(e) => {
                  e.stopPropagation();
                  removeFile(idx);
                }}
              >✕</span>
            </button>
          {/each}
          
          <button 
            class="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] border border-dashed border-white/20 bg-transparent text-white/60 hover:text-white hover:border-white/40 font-mono transition-all"
            onclick={() => fileInputRef.click()}
            disabled={isProcessing}
          >
            + ADD
          </button>
          <input 
            type="file" 
            bind:this={fileInputRef}
            onchange={handleFileChange}
            accept="image/*"
            multiple
            class="hidden" 
          />
        </div>

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

            <div class="flex gap-2">
              {#if bulkFiles.length > 1}
                <button 
                  class="flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider bg-white/5 border border-white/10 hover:bg-white/10 text-white px-3 py-1.5 rounded transition disabled:opacity-50"
                  disabled={isProcessing}
                  onclick={runBatchOCR}
                >
                  SCAN ALL ({bulkFiles.filter(item => item.status !== 'done').length})
                </button>
              {/if}

              <button 
                class="launch-ocr-btn flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider bg-red-500 text-black px-3.5 py-1.5 rounded shadow-sm shadow-red-500/10 hover:shadow-red-500/25 transition disabled:opacity-50"
                disabled={isProcessing || activeFileIndex === -1}
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
        {#if activeFileIndex >= 0 && bulkFiles[activeFileIndex]}
          <textarea
            value={extractedText}
            oninput={handleTextChange}
            placeholder="Extracted text will appear here once scanning is finished."
            class="flex-grow w-full p-3.5 bg-transparent resize-none border-none outline-none font-mono text-xs text-white/95 leading-relaxed placeholder:text-white/20 focus:ring-0 overflow-y-auto"
            disabled={isProcessing}
          ></textarea>
        {:else}
          <div class="flex-grow flex items-center justify-center text-white/20 text-xs font-mono p-4 text-center">
            Upload an image to review transcription buffer
          </div>
        {/if}

        <!-- Actions Drawer -->
        {#if extractedText}
          <div class="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 flex-wrap justify-end">
            <!-- Magic Junk Cleaner Tool -->
            <button 
              class="action-pill-btn flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition text-[10px] text-white/80 hover:text-white font-medium"
              onclick={cleanActiveText}
              title="Strip noise and background symbols"
            >
              <Sparkles size={11} class="text-yellow-400" /> Clean Junk
            </button>

            <button 
              class="action-pill-btn flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition text-[10px] text-white/80 hover:text-white font-medium"
              onclick={copyToClipboard}
              title="Copy active file text"
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
              title="Save active file TXT"
            >
              <Download size={11} /> Save
            </button>
          </div>
        {/if}
      </div>

      <!-- Batch Combined Actions Console (shown when multiple files exist) -->
      {#if bulkFiles.length > 1}
        <div class="bg-white/2 border border-white/5 rounded-xl p-2.5 flex items-center justify-between text-[10px] font-mono flex-shrink-0">
          <span class="text-white/40">BATCH BUFFER ACTIONS ({bulkFiles.length} FILES)</span>
          <div class="flex gap-2">
            <button 
              class="action-pill-btn flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition text-[10px] text-white/80 hover:text-white font-medium"
              onclick={copyAllToClipboard}
            >
              {#if copyAllFeedback}
                <Check size={11} class="text-green-400" /> Copied All
              {:else}
                <Copy size={11} /> Copy All
              {/if}
            </button>
            <button 
              class="action-pill-btn flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition text-[10px] text-white/80 hover:text-white font-medium"
              onclick={downloadCombinedText}
            >
              <Download size={11} /> Save All (.txt)
            </button>
          </div>
        </div>
      {/if}
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
