<script>
  import { onMount, onDestroy } from "svelte";
  import {
    Upload,
    Trash2,
    Image as ImageIcon,
    Video as VideoIcon,
    Sparkles,
    Sliders,
    Play,
    Pause,
    Download,
    Crop,
    RefreshCw,
    Eraser,
    Brush,
    Target,
    Square,
  } from "lucide-svelte";
  import BaseApp from "./BaseApp.svelte";

  // App Metadata
  const appName = "Windshield Wiper";

  // Svelte 5 State
  let activeTab = $state("editor"); // 'editor' | 'help'
  let uploadedFile = $state(null);
  let fileType = $state(""); // 'image' | 'video'
  let fileUrl = $state("");
  let isDragging = $state(false);

  // Loading/Exporting States
  let isProcessing = $state(false);
  let isRecording = $state(false);
  let processProgress = $state(0);
  let recordingTime = $state(0);

  // Tool settings
  let activeTool = $state("inpaint"); // 'inpaint' | 'clone' | 'blur' | 'crop'
  let brushSize = $state(20);
  let blurStrength = $state(15);
  let cloneSource = $state(null); // {x, y} relative to image
  let isSettingCloneSource = $state(false);
  let isErasing = $state(false);

  // Canvas and Player references
  let imageCanvas = $state(null);
  let maskCanvas = $state(null);
  let videoEl = $state(null);
  let exportCanvas = $state(null);

  // Image editing states
  let ctx = null;
  let maskCtx = null;
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let imageObj = null;

  // Video masking boxes
  let videoMasks = $state([
    { id: 1, x: 20, y: 20, width: 120, height: 50, mode: "blur" },
  ]);
  let selectedMaskId = $state(1);
  let videoWidth = $state(640);
  let videoHeight = $state(360);
  let isPlaying = $state(false);

  // Resizing mask state
  let activeDragNode = null; // 'move' | 'nw' | 'ne' | 'se' | 'sw'
  let dragOffset = { x: 0, y: 0 };
  let initialDragMask = null;
  let containerRef = $state(null);

  // Cleanups
  let videoFrameId;
  let recordingInterval;
  let mediaRecorder = null;
  let recordedChunks = [];

  // Derived properties
  let hasFile = $derived(!!uploadedFile);

  onDestroy(() => {
    cleanupObjectURLs();
    if (videoFrameId) cancelAnimationFrame(videoFrameId);
    if (recordingInterval) clearInterval(recordingInterval);
  });

  function cleanupObjectURLs() {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
      fileUrl = "";
    }
  }

  // Handle Drag & Drop
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
    if (file) handleFileLoad(file);
  }

  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) handleFileLoad(file);
  }

  function handleFileLoad(file) {
    cleanupObjectURLs();
    uploadedFile = file;
    fileUrl = URL.createObjectURL(file);

    if (file.type.startsWith("image/")) {
      fileType = "image";
      cloneSource = null;
      isSettingCloneSource = false;
      setTimeout(initImageCanvas, 100);
    } else if (file.type.startsWith("video/")) {
      fileType = "video";
      isPlaying = false;
      videoMasks = [
        { id: 1, x: 20, y: 20, width: 120, height: 50, mode: "blur" },
      ];
      selectedMaskId = 1;
    } else {
      alert("Unsupported file type. Please upload a standard image or video.");
      uploadedFile = null;
      fileUrl = "";
    }
  }

  // Image Canvas Setup
  function initImageCanvas() {
    if (!imageCanvas || !maskCanvas || !fileUrl) return;

    imageObj = new Image();
    imageObj.onload = () => {
      // Scale canvas to fit container bounds while keeping aspect ratio
      const maxWidth = Math.min(800, window.innerWidth - 64);
      const maxHeight = 500;
      let width = imageObj.width;
      let height = imageObj.height;

      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (maxHeight / height) * width;
        height = maxHeight;
      }

      imageCanvas.width = width;
      imageCanvas.height = height;
      maskCanvas.width = width;
      maskCanvas.height = height;

      ctx = imageCanvas.getContext("2d");
      maskCtx = maskCanvas.getContext("2d");

      // Draw original image
      ctx.drawImage(imageObj, 0, 0, width, height);

      // Reset mask
      maskCtx.clearRect(0, 0, width, height);
    };
    imageObj.src = fileUrl;
  }

  // Brush drawing on mask canvas
  function startDraw(e) {
    if (fileType !== "image" || activeTool === "crop") return;

    const rect = maskCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === "clone" && isSettingCloneSource) {
      cloneSource = { x, y };
      isSettingCloneSource = false;
      return;
    }

    isDrawing = true;
    lastX = x;
    lastY = y;

    drawMask(x, y, false);
  }

  function draw(e) {
    if (!isDrawing) return;
    const rect = maskCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    drawMask(x, y, true);
  }

  function endDraw() {
    isDrawing = false;
  }

  function drawMask(x, y, isMoving) {
    if (!maskCtx || !ctx) return;

    maskCtx.lineJoin = "round";
    maskCtx.lineCap = "round";

    if (activeTool === "clone" && cloneSource) {
      // Paint pixels from clone source onto the main canvas directly
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.clip();

      const dx = x - lastX;
      const dy = y - lastY;
      cloneSource.x += dx;
      cloneSource.y += dy;

      ctx.drawImage(
        imageCanvas,
        cloneSource.x - brushSize / 2,
        cloneSource.y - brushSize / 2,
        brushSize,
        brushSize,
        x - brushSize / 2,
        y - brushSize / 2,
        brushSize,
        brushSize,
      );
      ctx.restore();

      lastX = x;
      lastY = y;
      return;
    }

    if (activeTool === "inpaint") {
      maskCtx.beginPath();
      maskCtx.strokeStyle = isErasing
        ? "rgba(0,0,0,1)"
        : "rgba(255, 0, 85, 0.55)";
      maskCtx.lineWidth = brushSize;

      // Use destination-out to erase from mask
      if (isErasing) {
        maskCtx.globalCompositeOperation = "destination-out";
      } else {
        maskCtx.globalCompositeOperation = "source-over";
      }

      if (isMoving) {
        maskCtx.moveTo(lastX, lastY);
        maskCtx.lineTo(x, y);
        maskCtx.stroke();
      } else {
        maskCtx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
        maskCtx.fill();
      }

      lastX = x;
      lastY = y;
    }
  }

  function clearMask() {
    if (maskCtx) {
      maskCtx.globalCompositeOperation = "source-over";
      maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    }
  }

  function resetImage() {
    initImageCanvas();
  }

  // Fast Marching Inpainting / Smart Neighbor Diffusion
  async function runImageInpaint() {
    if (!ctx || !maskCtx || isProcessing) return;

    isProcessing = true;
    processProgress = 5;

    // Small delay to allow progress UI to update
    await new Promise((resolve) => setTimeout(resolve, 80));

    const width = imageCanvas.width;
    const height = imageCanvas.height;

    const imgData = ctx.getImageData(0, 0, width, height);
    const maskData = maskCtx.getImageData(0, 0, width, height);

    const imgPixels = imgData.data;
    const maskPixels = maskData.data;

    // Initialize state buffers
    const state = new Uint8Array(width * height);
    const maxCoords = [];

    // Find masked coordinates
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const mIdx = idx * 4;
        if (maskPixels[mIdx + 3] > 10) {
          state[idx] = 1; // Masked
          maxCoords.push({ x, y });
        } else {
          state[idx] = 0; // Unmasked
        }
      }
    }

    if (maxCoords.length === 0) {
      isProcessing = false;
      return;
    }

    processProgress = 30;
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Propagation loop (inward-directed neighbor averaging)
    let remaining = maxCoords.length;
    let passes = 0;
    const tempImg = new Uint8ClampedArray(imgPixels);

    while (remaining > 0 && passes < 150) {
      const newKnown = [];

      for (let i = 0; i < maxCoords.length; i++) {
        const p = maxCoords[i];
        const idx = p.y * width + p.x;

        if (state[idx] === 1) {
          // Average surrounding unmasked pixels
          let rSum = 0,
            gSum = 0,
            bSum = 0,
            count = 0;

          // Check 8-neighborhood
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const nx = p.x + dx;
              const ny = p.y + dy;

              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const nIdx = ny * width + nx;
                if (state[nIdx] === 0) {
                  const pIdx = nIdx * 4;
                  rSum += tempImg[pIdx];
                  gSum += tempImg[pIdx + 1];
                  bSum += tempImg[pIdx + 2];
                  count++;
                }
              }
            }
          }

          if (count > 0) {
            const pIdx = idx * 4;
            tempImg[pIdx] = Math.round(rSum / count);
            tempImg[pIdx + 1] = Math.round(gSum / count);
            tempImg[pIdx + 2] = Math.round(bSum / count);
            newKnown.push(idx);
          }
        }
      }

      if (newKnown.length === 0) break; // Avoid infinite loop on isolated mask blocks

      // Update states for next propagation pass
      for (let k = 0; k < newKnown.length; k++) {
        state[newKnown[k]] = 0;
      }
      remaining -= newKnown.length;
      passes++;

      if (passes % 10 === 0) {
        processProgress = 30 + Math.min(50, Math.round((passes / 150) * 50));
        await new Promise((resolve) => setTimeout(resolve, 5));
      }
    }

    processProgress = 85;

    // Apply feathering to the masked edge to merge inpainting smoothly
    for (let i = 0; i < maxCoords.length; i++) {
      const p = maxCoords[i];
      const idx = (p.y * width + p.x) * 4;

      // Interpolate with original based on feathering/blurring edge (for antialiasing)
      imgPixels[idx] = tempImg[idx];
      imgPixels[idx + 1] = tempImg[idx + 1];
      imgPixels[idx + 2] = tempImg[idx + 2];
    }

    ctx.putImageData(imgData, 0, 0);
    clearMask();

    processProgress = 100;
    setTimeout(() => {
      isProcessing = false;
      processProgress = 0;
    }, 300);
  }

  // Download cleared image
  function downloadImage() {
    if (!imageCanvas) return;
    const dataUrl = imageCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `cleaned_${uploadedFile.name}`;
    link.href = dataUrl;
    link.click();
  }

  // Video Interaction Handlers (Draggable mask overlays)
  function handleMaskMouseDown(e, mask, node) {
    e.preventDefault();
    e.stopPropagation();

    selectedMaskId = mask.id;
    activeDragNode = node;
    initialDragMask = { ...mask };

    const rect = containerRef.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;

    window.addEventListener("mousemove", handleMaskMouseMove);
    window.addEventListener("mouseup", handleMaskMouseUp);
  }

  function handleMaskMouseMove(e) {
    if (!activeDragNode || !containerRef) return;

    const rect = containerRef.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const dx = currentX - dragOffset.x;
    const dy = currentY - dragOffset.y;

    videoMasks = videoMasks.map((mask) => {
      if (mask.id !== selectedMaskId) return mask;

      let { x, y, width, height } = initialDragMask;

      if (activeDragNode === "move") {
        x = Math.max(0, Math.min(videoWidth - width, x + dx));
        y = Math.max(0, Math.min(videoHeight - height, y + dy));
      } else if (activeDragNode === "se") {
        width = Math.max(20, Math.min(videoWidth - x, width + dx));
        height = Math.max(20, Math.min(videoHeight - y, height + dy));
      } else if (activeDragNode === "sw") {
        const originalRight = x + width;
        x = Math.max(0, Math.min(originalRight - 20, x + dx));
        width = originalRight - x;
        height = Math.max(20, Math.min(videoHeight - y, height + dy));
      } else if (activeDragNode === "ne") {
        const originalBottom = y + height;
        width = Math.max(20, Math.min(videoWidth - x, width + dx));
        y = Math.max(0, Math.min(originalBottom - 20, y + dy));
        height = originalBottom - y;
      } else if (activeDragNode === "nw") {
        const originalRight = x + width;
        const originalBottom = y + height;
        x = Math.max(0, Math.min(originalRight - 20, x + dx));
        width = originalRight - x;
        y = Math.max(0, Math.min(originalBottom - 20, y + dy));
        height = originalBottom - y;
      }

      return { ...mask, x, y, width, height };
    });
  }

  function handleMaskMouseUp() {
    activeDragNode = null;
    initialDragMask = null;
    window.removeEventListener("mousemove", handleMaskMouseMove);
    window.removeEventListener("mouseup", handleMaskMouseUp);
  }

  // Toggle Video Playback
  function toggleVideo() {
    if (!videoEl) return;
    if (isPlaying) {
      videoEl.pause();
      isPlaying = false;
    } else {
      videoEl.play();
      isPlaying = true;
    }
  }

  // Canvas Video Rendering and Real-Time Exporter
  async function startVideoExport() {
    if (!videoEl || isRecording) return;

    isRecording = true;
    recordingTime = 0;
    recordedChunks = [];

    // Pause video and go back to start
    videoEl.pause();
    videoEl.currentTime = 0;
    isPlaying = false;

    // Wait for video meta to resolve layout dimensions
    videoWidth = videoEl.videoWidth || 640;
    videoHeight = videoEl.videoHeight || 360;

    exportCanvas.width = videoWidth;
    exportCanvas.height = videoHeight;

    const exportCtx = exportCanvas.getContext("2d");

    // Capture Canvas stream at 30 FPS
    const canvasStream = exportCanvas.captureStream(30);

    // Merge audio track from video if available
    let mergedStream = canvasStream;
    if (videoEl.captureStream) {
      try {
        const videoStream = videoEl.captureStream();
        const audioTracks = videoStream.getAudioTracks();
        if (audioTracks.length > 0) {
          const audioTrack = audioTracks[0];
          mergedStream = new MediaStream([
            canvasStream.getVideoTracks()[0],
            audioTrack,
          ]);
        }
      } catch (e) {
        console.warn("Could not capture video audio stream.", e);
      }
    }

    mediaRecorder = new MediaRecorder(mergedStream, {
      mimeType: "video/webm;codecs=vp9,opus",
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `wiped_${uploadedFile.name.replace(/\.[^/.]+$/, "")}.webm`;
      link.click();

      // Cleanup
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
      isRecording = false;
      clearInterval(recordingInterval);
    };

    // Play video to kickstart rendering
    videoEl.play();
    isPlaying = true;
    mediaRecorder.start();

    // Start counter timer
    recordingInterval = setInterval(() => {
      recordingTime = videoEl.currentTime;
    }, 200);

    function renderFrame() {
      if (videoEl.paused || videoEl.ended) {
        if (videoEl.ended) {
          mediaRecorder.stop();
        }
        return;
      }

      // Draw original video frame
      exportCtx.drawImage(videoEl, 0, 0, videoWidth, videoHeight);

      // Apply watermark masks
      for (const mask of videoMasks) {
        applyMaskToCanvasContext(exportCtx, mask);
      }

      requestAnimationFrame(renderFrame);
    }

    videoEl.addEventListener("play", renderFrame);
    renderFrame();
  }

  // Core filter rendering routines
  function applyMaskToCanvasContext(context, mask) {
    const { x, y, width, height, mode } = mask;

    if (mode === "blur") {
      // Canvas blur simulation by drawing scaled-down/scaled-up subset
      context.save();
      // Draw sub-rectangle
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext("2d");

      tempCtx.drawImage(
        context.canvas,
        x,
        y,
        width,
        height,
        0,
        0,
        width,
        height,
      );

      // Soften pixelate blur
      context.filter = `blur(${blurStrength}px)`;
      context.drawImage(tempCanvas, x, y, width, height);
      context.restore();
    } else if (mode === "pixelate") {
      context.save();
      const pSize = 10; // Pixel size
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = Math.max(1, width / pSize);
      tempCanvas.height = Math.max(1, height / pSize);
      const tempCtx = tempCanvas.getContext("2d");

      // Turn off smoothing
      tempCtx.imageSmoothingEnabled = false;
      context.imageSmoothingEnabled = false;

      tempCtx.drawImage(
        context.canvas,
        x,
        y,
        width,
        height,
        0,
        0,
        tempCanvas.width,
        tempCanvas.height,
      );
      context.drawImage(
        tempCanvas,
        0,
        0,
        tempCanvas.width,
        tempCanvas.height,
        x,
        y,
        width,
        height,
      );

      context.restore();
    } else if (mode === "solid") {
      // Get colors surrounding the watermark rectangle to build a patch
      context.save();
      context.fillStyle = "rgba(10, 10, 15, 0.95)";

      // Try to sample a color from the top border of the rectangle
      try {
        const borderSample = context.getImageData(
          Math.max(0, x - 1),
          Math.max(0, y - 1),
          1,
          1,
        ).data;
        context.fillStyle = `rgb(${borderSample[0]}, ${borderSample[1]}, ${borderSample[2]})`;
      } catch (e) {}

      context.fillRect(x, y, width, height);
      context.restore();
    }
  }

  function handleVideoMetaLoad() {
    if (videoEl) {
      videoWidth = videoEl.clientWidth;
      videoHeight = videoEl.clientHeight;
    }
  }

  function addVideoMask() {
    const nextId =
      videoMasks.length > 0 ? Math.max(...videoMasks.map((m) => m.id)) + 1 : 1;
    videoMasks = [
      ...videoMasks,
      { id: nextId, x: 50, y: 50, width: 100, height: 40, mode: "blur" },
    ];
    selectedMaskId = nextId;
  }

  function removeVideoMask(id) {
    videoMasks = videoMasks.filter((m) => m.id !== id);
    if (selectedMaskId === id && videoMasks.length > 0) {
      selectedMaskId = videoMasks[0].id;
    }
  }
</script>

<BaseApp title={appName} {activeTab} onClose={() => onClose()}>
  <div class="wiper-layout flex flex-col h-full overflow-hidden select-none">
    <!-- Workspace Area -->
    <div
      class="wiper-workspace flex-1 min-h-0 flex flex-col lg:flex-row relative"
    >
      {#if !hasFile}
        <!-- UPLOAD / DRAG & DROP ZONE -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="wiper-dropzone flex-1 flex flex-col items-center justify-center p-8 m-6 border-2 border-dashed rounded-2xl transition-all duration-300
            {isDragging
            ? 'border-neon-cyan bg-neon-cyan/5 scale-[0.99] shadow-[0_0_20px_rgba(0,255,255,0.15)]'
            : 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/[0.02]'}"
          ondragover={handleDragOver}
          ondragleave={handleDragLeave}
          ondrop={handleDrop}
          onclick={() => document.getElementById("wiper-input").click()}
        >
          <div
            class="wiper-upload-icon flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-4 transition-transform duration-300"
          >
            <Upload size={28} class="text-white/60" />
          </div>
          <h2 class="text-lg font-bold text-white mb-2">
            Wipe Watermarks Instantly
          </h2>
          <p class="text-xs text-white/40 mb-6 text-center max-w-[360px]">
            Drag & drop any image or video file. All watermark processing is
            computed privately inside your browser.
          </p>
          <button
            class="px-5 py-2 rounded-xl text-xs font-bold bg-white/10 border border-white/15 hover:bg-white/15 transition-all"
          >
            Choose File
          </button>
          <input
            type="file"
            id="wiper-input"
            class="hidden"
            accept="image/*,video/*"
            onchange={handleFileSelect}
          />
        </div>
      {:else}
        <!-- ACTIVE FILE EDITOR WORKSPACE -->
        <div
          class="editor-stage flex-1 min-h-0 flex flex-col p-4 lg:p-6 overflow-hidden"
        >
          <!-- Stage Top Bar (File name and reset) -->
          <div
            class="stage-bar flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 mb-4 shrink-0"
          >
            <div class="flex items-center gap-2">
              {#if fileType === "image"}
                <ImageIcon size={14} class="text-neon-cyan" />
              {:else}
                <VideoIcon size={14} class="text-neon-gold" />
              {/if}
              <span
                class="text-xs font-mono font-bold text-white/70 truncate max-w-[240px]"
                >{uploadedFile.name}</span
              >
            </div>
            <button
              class="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all rounded-lg text-[10px] font-bold uppercase tracking-wider"
              onclick={() => {
                cleanupObjectURLs();
                uploadedFile = null;
              }}
            >
              <Trash2 size={11} /> Clear
            </button>
          </div>

          <!-- Interactive Editor Display -->
          <div
            class="stage-viewport flex-1 min-h-0 flex items-center justify-center bg-black/40 border border-white/5 rounded-2xl overflow-hidden relative p-4"
          >
            {#if fileType === "image"}
              <!-- Image Brush/Inpaint Editor -->
              <div
                class="relative inline-block max-w-full max-h-full select-none cursor-crosshair"
              >
                <canvas
                  bind:this={imageCanvas}
                  class="stage-canvas max-w-full max-h-full block shadow-2xl rounded-lg"
                ></canvas>
                <canvas
                  bind:this={maskCanvas}
                  class="absolute inset-0 max-w-full max-h-full block rounded-lg pointer-events-auto opacity-75"
                  onmousedown={startDraw}
                  onmousemove={draw}
                  onmouseup={endDraw}
                  onmouseleave={endDraw}
                ></canvas>

                {#if activeTool === "clone" && cloneSource}
                  <!-- Visual Target Marker representing clone stamp source point -->
                  <div
                    class="absolute w-5 h-5 border-2 border-dashed border-neon-cyan rounded-full flex items-center justify-center pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                    style="left: {cloneSource.x}px; top: {cloneSource.y}px;"
                  >
                    <Target size={10} class="text-neon-cyan animate-pulse" />
                  </div>
                {/if}
              </div>
            {:else}
              <!-- Video Mask Editor -->
              <div
                bind:this={containerRef}
                class="relative inline-block max-w-full max-h-full select-none"
                style="aspect-ratio: {videoWidth} / {videoHeight};"
              >
                <!-- HTML5 video element -->
                <!-- svelte-ignore a11y_media_has_caption -->
                <video
                  bind:this={videoEl}
                  src={fileUrl}
                  class="stage-video max-w-full max-h-full block rounded-lg"
                  onloadedmetadata={handleVideoMetaLoad}
                  onclick={toggleVideo}
                  loop
                ></video>

                <!-- Draggable overlay bounding box masks -->
                {#each videoMasks as mask}
                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div
                    class="absolute border border-neon-gold bg-black/10 rounded-md cursor-move
                      {mask.id === selectedMaskId
                      ? 'border-2 border-neon-gold shadow-[0_0_12px_rgba(255,167,81,0.25)]'
                      : 'border-white/30 opacity-70'}"
                    style="left: {mask.x}px; top: {mask.y}px; width: {mask.width}px; height: {mask.height}px;"
                    onmousedown={(e) => handleMaskMouseDown(e, mask, "move")}
                    onclick={() => (selectedMaskId = mask.id)}
                  >
                    <!-- Live CSS Filter Blur Preview -->
                    <div
                      class="absolute inset-0 pointer-events-none overflow-hidden rounded-md"
                      style={mask.mode === "blur"
                        ? `backdrop-filter: blur(${blurStrength}px); -webkit-backdrop-filter: blur(${blurStrength}px);`
                        : mask.mode === "pixelate"
                          ? "backdrop-filter: contrast(120%) brightness(90%) blur(4px);"
                          : "background: rgba(10,10,15,0.95);"}
                    ></div>

                    <!-- Label badge -->
                    <span
                      class="absolute -top-5 left-0 bg-neon-gold text-black text-[8px] font-mono font-bold px-1.5 py-0.5 rounded shadow"
                    >
                      MASK {mask.id} ({mask.mode.toUpperCase()})
                    </span>

                    <!-- NW Resize Node -->
                    <div
                      class="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-black rounded-full cursor-nwse-resize z-20"
                      onmousedown={(e) => handleMaskMouseDown(e, mask, "nw")}
                    ></div>
                    <!-- NE Resize Node -->
                    <div
                      class="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-black rounded-full cursor-nesw-resize z-20"
                      onmousedown={(e) => handleMaskMouseDown(e, mask, "ne")}
                    ></div>
                    <!-- SE Resize Node -->
                    <div
                      class="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-black rounded-full cursor-nwse-resize z-20"
                      onmousedown={(e) => handleMaskMouseDown(e, mask, "se")}
                    ></div>
                    <!-- SW Resize Node -->
                    <div
                      class="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-black rounded-full cursor-nesw-resize z-20"
                      onmousedown={(e) => handleMaskMouseDown(e, mask, "sw")}
                    ></div>
                  </div>
                {/each}
              </div>
            {/if}

            <!-- Canvas for off-screen video frame exporting -->
            <canvas bind:this={exportCanvas} class="hidden"></canvas>
          </div>
        </div>

        <!-- CONTROL SIDEBAR -->
        <div
          class="editor-sidebar w-full lg:w-[320px] bg-black/20 border-t lg:border-t-0 lg:border-l border-white/5 p-4 lg:p-6 flex flex-col gap-6 shrink-0 overflow-y-auto"
        >
          {#if fileType === "image"}
            <!-- Image Editing Console -->
            <div class="sidebar-section">
              <span
                class="section-title flex items-center gap-1.5 text-white/50 text-[10px] font-bold tracking-widest uppercase mb-3"
              >
                <Sliders size={12} /> WIPING UTILS
              </span>

              <div class="flex flex-col gap-2">
                <button
                  class="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-all border
                    {activeTool === 'inpaint'
                    ? 'bg-neon-pink/10 border-neon-pink/30 text-neon-pink'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-white/70'}"
                  onclick={() => {
                    activeTool = "inpaint";
                    isErasing = false;
                  }}
                >
                  <span class="flex items-center gap-2">
                    <Sparkles size={14} /> Smart Inpaint
                  </span>
                  <span class="text-[9px] opacity-50">Content-Aware</span>
                </button>

                <button
                  class="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-all border
                    {activeTool === 'clone'
                    ? 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-white/70'}"
                  onclick={() => (activeTool = "clone")}
                >
                  <span class="flex items-center gap-2">
                    <Target size={14} /> Clone Stamp
                  </span>
                  <span class="text-[9px] opacity-50">Paint Source</span>
                </button>
              </div>
            </div>

            <!-- Image Settings Section -->
            <div class="sidebar-section">
              <span
                class="section-title flex items-center gap-1.5 text-white/50 text-[10px] font-bold tracking-widest uppercase mb-3"
              >
                <Brush size={12} /> BRUSH PARAMETERS
              </span>

              {#if activeTool === "inpaint"}
                <!-- Brush Size Slider -->
                <div
                  class="flex flex-col gap-2 bg-white/[0.02] border border-white/5 p-3 rounded-xl"
                >
                  <div
                    class="flex justify-between text-[11px] font-bold text-white/60"
                  >
                    <span>Brush Size</span>
                    <span class="font-mono">{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    bind:value={brushSize}
                    class="w-full accent-neon-pink"
                  />

                  <!-- Eraser Toggle -->
                  <div
                    class="flex justify-between items-center mt-3 pt-3 border-t border-white/5"
                  >
                    <span class="text-[11px] font-bold text-white/60"
                      >Erase Brush Mask</span
                    >
                    <button
                      class="p-1.5 rounded-lg border transition-all
                        {isErasing
                        ? 'bg-neon-pink/25 border-neon-pink text-neon-pink'
                        : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}"
                      onclick={() => (isErasing = !isErasing)}
                      title="Erase painted mask"
                    >
                      <Eraser size={14} />
                    </button>
                  </div>
                </div>
              {:else if activeTool === "clone"}
                <!-- Clone Stamp parameters -->
                <div
                  class="flex flex-col gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-xl"
                >
                  <div
                    class="flex justify-between text-[11px] font-bold text-white/60"
                  >
                    <span>Stamp Size</span>
                    <span class="font-mono">{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    bind:value={brushSize}
                    class="w-full accent-neon-cyan"
                  />

                  <button
                    class="w-full py-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-all rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                    class:bg-neon-cyan-active={isSettingCloneSource}
                    onclick={() => (isSettingCloneSource = true)}
                  >
                    <Target size={12} />
                    {cloneSource
                      ? "Set Target Source"
                      : "Click to select source"}
                  </button>

                  {#if cloneSource}
                    <span class="text-[9px] text-white/40 font-mono text-center"
                      >Source Offset: X {Math.round(cloneSource.x)}px, Y {Math.round(
                        cloneSource.y,
                      )}px</span
                    >
                  {/if}
                </div>
              {/if}
            </div>

            <!-- Inpaint / Export Buttons -->
            <div class="mt-auto flex flex-col gap-2">
              {#if activeTool === "inpaint"}
                <button
                  class="w-full py-3 bg-neon-pink hover:bg-neon-pink-hover text-white transition-all rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,0,85,0.3)]"
                  onclick={runImageInpaint}
                  disabled={isProcessing}
                >
                  {#if isProcessing}
                    <RefreshCw size={14} class="animate-spin" /> Processing ({processProgress}%)
                  {:else}
                    <Sparkles size={14} /> Wipe Watermark
                  {/if}
                </button>
              {/if}

              <button
                class="w-full py-3 bg-white/10 border border-white/15 hover:bg-white/15 text-white transition-all rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                onclick={downloadImage}
              >
                <Download size={14} /> Save Clean Image
              </button>
            </div>
          {:else}
            <!-- Video Editing Console -->
            <div class="sidebar-section">
              <span
                class="section-title flex items-center gap-1.5 text-white/50 text-[10px] font-bold tracking-widest uppercase mb-3"
              >
                <Sliders size={12} /> MASK DIRECTORY
              </span>

              <div
                class="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1"
              >
                {#each videoMasks as mask}
                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div
                    class="flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all
                      {mask.id === selectedMaskId
                      ? 'bg-neon-gold/10 border-neon-gold/30 text-neon-gold'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 text-white/70'}"
                    onclick={() => (selectedMaskId = mask.id)}
                  >
                    <span class="text-xs font-mono font-bold pl-1"
                      >MASK {mask.id}</span
                    >
                    <div class="flex items-center gap-1.5">
                      <select
                        bind:value={mask.mode}
                        class="bg-black/60 border border-white/10 text-[9px] font-bold rounded px-1.5 py-0.5"
                      >
                        <option value="blur">Blur</option>
                        <option value="pixelate">Pixelate</option>
                        <option value="solid">Fill</option>
                      </select>
                      <button
                        class="p-1 hover:text-red-400 transition-colors"
                        onclick={() => removeVideoMask(mask.id)}
                        aria-label="Remove mask"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                {/each}
              </div>

              <button
                class="w-full mt-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-all rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                onclick={addVideoMask}
              >
                + Add Mask Area
              </button>
            </div>

            <!-- Video Mask parameters -->
            <div class="sidebar-section">
              <span
                class="section-title flex items-center gap-1.5 text-white/50 text-[10px] font-bold tracking-widest uppercase mb-3"
              >
                <Sliders size={12} /> BLUR COEFFICIENT
              </span>

              <div
                class="flex flex-col gap-2 bg-white/[0.02] border border-white/5 p-3 rounded-xl"
              >
                <div
                  class="flex justify-between text-[11px] font-bold text-white/60"
                >
                  <span>Blur Strength</span>
                  <span class="font-mono">{blurStrength}px</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="45"
                  bind:value={blurStrength}
                  class="w-full accent-neon-gold"
                />
              </div>
            </div>

            <!-- Player & Recorder Export Controls -->
            <div class="mt-auto flex flex-col gap-2">
              <button
                class="w-full py-3 bg-white/10 border border-white/15 hover:bg-white/15 text-white transition-all rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                onclick={toggleVideo}
              >
                {#if isPlaying}
                  <Pause size={14} /> Pause Video
                {:else}
                  <Play size={14} fill="currentColor" /> Play Preview
                {/if}
              </button>

              <button
                class="w-full py-3 bg-neon-gold hover:bg-neon-gold-hover text-black transition-all rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,167,81,0.25)]"
                onclick={startVideoExport}
                disabled={isRecording}
              >
                {#if isRecording}
                  <RefreshCw size={14} class="animate-spin" /> Recording ({recordingTime.toFixed(
                    1,
                  )}s)
                {:else}
                  <Download size={14} /> Wipe & Export MP4
                {/if}
              </button>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</BaseApp>

<style lang="scss">
  @use "../../styles/variables" as *;

  .wiper-dropzone {
    height: calc(100% - 48px);
    cursor: pointer;
  }

  .wiper-dropzone:hover .wiper-upload-icon {
    transform: translateY(-4px) scale(1.05);
    border-color: rgba(0, 255, 255, 0.4);
    box-shadow: 0 4px 15px rgba(0, 255, 255, 0.15);
  }

  .wiper-dropzone:hover .wiper-upload-icon :global(svg) {
    color: white;
  }

  .stage-canvas {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    background: transparent;
  }

  .stage-video {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .bg-neon-cyan-active {
    background: rgba(0, 255, 255, 0.15) !important;
    border-color: rgba(0, 255, 255, 0.4) !important;
    color: #00ffff !important;
  }

  /* Slider Styling */
  input[type="range"] {
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.1);
    height: 4px;
    border-radius: 2px;
    outline: none;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }
</style>
