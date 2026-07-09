<script>
  import { onDestroy, onMount } from "svelte";
  import {
    Upload,
    Download,
    FileImage,
    FileAudio,
    RefreshCw,
    Flame,
    CheckCircle,
    ArrowLeft,
    Keyboard,
    AlertCircle,
    Link2,
    Link2Off,
    FileVideo,
    Undo,
  } from "lucide-svelte";
  import { convertImage, convertAudio, convertVideo } from "./convert.js";

  // State variables
  let isDragging = $state(false);
  let file = $state(null);
  let fileType = $state(""); // 'image' | 'audio' | 'unsupported'
  let inputFormat = $state(""); // e.g. 'jpg', 'png', 'webp', 'mp3', 'wav', 'm4a'
  let outputFormat = $state(""); // selected output format
  let conversionStatus = $state("idle"); // 'idle' | 'converting' | 'done' | 'error'
  let progress = $state(0);
  let previewUrl = $state("");
  let convertedBlob = $state(null);
  let convertedFileName = $state("");
  let errorMessage = $state("");
  let currentNotice = $state("Refining Format Molecules");

  // Image size parameters
  let originalWidth = $state(0);
  let originalHeight = $state(0);
  let targetWidth = $state(0);
  let targetHeight = $state(0);
  let keepAspectRatio = $state(true);
  let keepTens = $state(true);

  // Quality & compression parameters
  let quality = $state(92); // 0 to 100
  let compression = $state(15); // 0 to 100

  // Audio parameters
  let audioBitrate = $state("192"); // kbps
  let audioSampleRate = $state("keep"); // 'keep' | sample rate number

  // Audio preview helper
  let audioContext = null;
  let audioBuffer = null;

  // Available output formats based on detected type
  const formatMap = {
    image: ["png", "jpg", "webp", "avif", "svg"],
    audio: ["mp3", "wav", "m4a", "aac", "webm"],
    video: ["mp4", "mov", "mkv", "avi"],
  };

  let availableFormats = $derived(fileType ? formatMap[fileType] || [] : []);

  const notices = [
    "Refining Format Molecules",
    "Microwaving the Pizza",
    "Flipping the Pancakes",
    "Flapping the Flapjacks",
    "Cheesing the Cheesecake",
    "Moving the Needle",
    "Baking the Goods",
    "Baking the Cookies",
    "Painting the Painting",
    "Doing the Laundry",
    "Spinning the Gears",
    "vacuuming the Car",
    "Investigating 311",
    "Playing Polymerization",
    "Popping the Popcorn",
    "Teabagging the Teabag",
    "Lickin my Fingers",
    "Feeding to Ditto",
    "Roasting the Marshmallows",
    "Bending the Spoon",
    "Surfing the Big One",
    "Petting the Dog",
    "Layering the Lasagna",
    "Chopping the Onion",
    "Shifting the Shapes",
    "Sanding the Silverware",
    "Firing the Clay",
    "Heating up the Kiln",
    "Microwaving the Leftovers",
    "Chasing the Mailman",
    "Pushing the Limits",
    "Bursting the Bubbles",
    "Ironing the Pants",
    "Paying the 'LectricBill",
    "Bribing the Policemen",
    "Karate Chopping the Salad",
    "Tipping the Waitress",
    "Pressure Washin the Winder",
    "Lickin the Lightbulbs",
    "Eating the Bologna",
    "Tuning the Pianos",
    "Feeding the Pidgeons",
    "Fighting the Fake News",
    "Kicking the Nazis",
    "Doing git push-ups",
    "Doing Sit-Ups",
    "Doing git pull-ups",
    `Doing git revert --no-commit "HEAD~$c..HEAD"-Ups`,
  ];

  // Keyboard shortcut listener
  function handleKeydown(e) {
    if (conversionStatus !== "idle" || !file) return;

    // Numbers 1-5 to select formats
    if (e.key === "1" && availableFormats[0]) {
      outputFormat = availableFormats[0];
    } else if (e.key === "2" && availableFormats[1]) {
      outputFormat = availableFormats[1];
    } else if (e.key === "3" && availableFormats[2]) {
      outputFormat = availableFormats[2];
    } else if (e.key === "4" && availableFormats[3]) {
      outputFormat = availableFormats[3];
    } else if (e.key === "5" && availableFormats[4]) {
      outputFormat = availableFormats[4];
    } else if (e.key === "Enter" && outputFormat) {
      startConversion();
    }
  }

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
  });

  onDestroy(() => {
    window.removeEventListener("keydown", handleKeydown);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  });

  // Handle Drag/Drop events
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }

  function handleFileSelect(e) {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }

  // Detect and analyze file type/format
  async function processFile(selectedFile) {
    resetState();
    file = selectedFile;
    const name = file.name.toLowerCase();
    const ext = name.split(".").pop();

    if (
      file.type.startsWith("image/") ||
      ["jpg", "jpeg", "png", "webp", "gif", "avif", "svg"].includes(ext)
    ) {
      fileType = "image";
      inputFormat = ext === "jpeg" ? "jpg" : ext;
      previewUrl = URL.createObjectURL(file);
      // Auto-select a default different format
      outputFormat = inputFormat === "png" ? "jpg" : "png";

      // Read dimensions
      const img = new Image();
      img.src = previewUrl;
      img.onload = () => {
        originalWidth = img.naturalWidth;
        originalHeight = img.naturalHeight;
        targetWidth = originalWidth;
        targetHeight = originalHeight;
      };
    } else if (
      file.type.startsWith("audio/") ||
      ["mp3", "wav", "m4a", "ogg", "aac", "webm"].includes(ext)
    ) {
      fileType = "audio";
      inputFormat = ext;
      previewUrl = URL.createObjectURL(file);
      outputFormat = inputFormat === "mp3" ? "wav" : "mp3";

      // Load audio data in background for actual WAV encoding if needed
      try {
        const arrayBuffer = await file.arrayBuffer();
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      } catch (err) {
        console.error("Failed to decode audio data:", err);
      }
    } else if (
      file.type.startsWith("video/") ||
      ["mp4", "mov", "mkv", "avi", "webm"].includes(ext)
    ) {
      fileType = "video";
      inputFormat = ext;
      previewUrl = URL.createObjectURL(file);
      outputFormat = inputFormat === "mp4" ? "mov" : "mp4";
    } else {
      fileType = "unsupported";
      errorMessage =
        "Unsupported file type. Please upload an image, audio, or video file.";
      conversionStatus = "error";
    }
  }

  function handleWidthChange(e) {
    targetWidth = parseInt(e.target.value) || 10;
    if (keepAspectRatio && originalWidth > 0) {
      targetHeight = Math.round(targetWidth / (originalWidth / originalHeight));
    }
  }

  function handleHeightChange(e) {
    targetHeight = parseInt(e.target.value) || 10;
    if (keepAspectRatio && originalHeight > 0) {
      targetWidth = Math.round(targetHeight * (originalWidth / originalHeight));
    }
  }

  function handleAspectRatioToggle() {
    keepAspectRatio = !keepAspectRatio;
    if (keepAspectRatio && originalWidth > 0) {
      targetHeight = Math.round(targetWidth / (originalWidth / originalHeight));
    }
  }

  function handleTensToggle() {
    keepTens = !keepTens;
    if (keepTens && originalWidth > 0) {
      // Snap width and height to the nearest 10% increment of original
      const stepW = Math.round(originalWidth * 0.1);
      targetWidth = Math.max(stepW, Math.round(targetWidth / stepW) * stepW);
      if (keepAspectRatio) {
        targetHeight = Math.round(
          targetWidth / (originalWidth / originalHeight),
        );
      } else if (originalHeight > 0) {
        const stepH = Math.round(originalHeight * 0.1);
        targetHeight = Math.max(
          stepH,
          Math.round(targetHeight / stepH) * stepH,
        );
      }
    }
  }

  function resetToOriginal() {
    if (originalWidth > 0 && originalHeight > 0) {
      targetWidth = originalWidth;
      targetHeight = originalHeight;
    }
  }

  function resetState() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    file = null;
    fileType = "";
    inputFormat = "";
    outputFormat = "";
    conversionStatus = "idle";
    progress = 0;
    previewUrl = "";
    convertedBlob = null;
    convertedFileName = "";
    errorMessage = "";
    audioBuffer = null;
    originalWidth = 0;
    originalHeight = 0;
    targetWidth = 0;
    targetHeight = 0;
    keepAspectRatio = true;
    keepTens = true;
    quality = 92;
    compression = 15;
    audioBitrate = "192";
    audioSampleRate = "keep";
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
  }

  // Run Conversion
  async function startConversion() {
    if (!file || !outputFormat) return;
    conversionStatus = "converting";
    progress = 0;
    currentNotice = notices[Math.floor(Math.random() * notices.length)];

    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 90) clearInterval(interval);
    }, 150);

    try {
      if (fileType === "image") {
        convertedBlob = await convertImage(
          previewUrl,
          outputFormat,
          targetWidth,
          targetHeight,
          quality,
        );
        const originalBase = file.name.substring(0, file.name.lastIndexOf("."));
        convertedFileName = `${originalBase}.${outputFormat}`;
      } else if (fileType === "audio") {
        if (!audioBuffer) {
          try {
            const arrayBuffer = await file.arrayBuffer();
            audioContext = new (window.AudioContext ||
              window.webkitAudioContext)();
            audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          } catch (err) {
            console.error("Failed to decode audio data on-the-fly:", err);
          }
        }
        convertedBlob = await convertAudio(
          file,
          audioBuffer,
          outputFormat,
          audioSampleRate,
          compression,
        );
        const originalBase = file.name.substring(0, file.name.lastIndexOf("."));
        convertedFileName = `${originalBase}_converted.${outputFormat}`;
      } else if (fileType === "video") {
        convertedBlob = await convertVideo(file, outputFormat);
        const originalBase = file.name.substring(0, file.name.lastIndexOf("."));
        convertedFileName = `${originalBase}_converted.${outputFormat}`;
      }
      clearInterval(interval);
      progress = 100;
      setTimeout(() => {
        conversionStatus = "done";
      }, 300);
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      errorMessage =
        err.message || "An error occurred during format conversion.";
      conversionStatus = "error";
    }
  }

  function downloadFile() {
    if (!convertedBlob) return;
    const url = URL.createObjectURL(convertedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = convertedFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
</script>

<div class="converter-app animated-pane">
  <div class="app-header">
    <div class="title-wrap">
      <span class="converter-flame-icon"><Flame size={24} /></span>
      <h2>Catalytic Converter</h2>
    </div>
    <p class="description">
      a way to convert anything into anything. all data stays in your browser.
    </p>
  </div>

  <div class="app-content-scroll">
    {#if conversionStatus === "idle" && !file}
      <!-- UPLOAD ZONE -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
      <div
        class="upload-dropzone"
        class:dragging={isDragging}
        ondragover={handleDragOver}
        ondragleave={handleDragLeave}
        ondrop={handleDrop}
        onclick={() => document.getElementById("file-input").click()}
        role="button"
        tabindex="0"
      >
        <input
          type="file"
          id="file-input"
          class="hidden"
          accept="image/*,audio/*,video/*"
          onchange={handleFileSelect}
        />
        <div class="icon-wrap">
          <Upload size={38} />
        </div>
        <h3>Drop file or click to select</h3>
        <p class="upload-sub">
          Supports JPG, PNG, WEBP, AVIF, SVG, MP3, WAV, M4A, AAC, WEBM, MP4,
          MOV, MKV, AVI
        </p>
      </div>

      <!-- Supported formats legend -->
      <div
        class="supported-formats-legend mt-4 p-4 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col gap-2.5"
      >
        <h4
          class="text-xs font-bold text-white/40 uppercase tracking-wider font-mono"
        >
          SUPPORTED CONVERSIONS
        </h4>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-sans text-white/70"
        >
          <div class="flex flex-col gap-1.5">
            <span class="font-bold text-[#ff5e00]">🖼️ IMG</span>
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >JPG</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >PNG</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >WEBP</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >AVIF</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >SVG</span
              >
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <span class="font-bold text-[#00ffff]">🎵 SOUND</span>
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >MP3</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >WAV</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >M4A</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >AAC</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >WEBM</span
              >
            </div>
          </div>
          <div
            class="flex flex-col gap-1.5 col-span-1 sm:col-span-2 md:col-span-1"
          >
            <span class="font-bold text-[#a855f7]">🎞️ MOTION PICTURE</span>
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >MP4</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >MOV</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >MKV</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >AVI</span
              >
            </div>
          </div>
        </div>
      </div>
    {:else if conversionStatus === "converting"}
      <!-- CONVERTING STATE -->
      <div class="converting-panel">
        <div class="engine-wrap">
          <div class="catalytic-canister">
            <div class="honeycomb-grid">
              <span class="spark s1"></span>
              <span class="spark s2"></span>
              <span class="spark s3"></span>
            </div>
            <span class="cylinder-flame"><Flame size={48} /></span>
          </div>
        </div>
        <h3>{currentNotice}...</h3>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width: {progress}%"></div>
        </div>
        <p class="progress-text">{progress}% Completed</p>
      </div>
    {:else if conversionStatus === "done"}
      <!-- SUCCESS PANEL -->
      <div class="success-panel">
        <CheckCircle class="text-green-400" size={54} />
        <h3>Conversion Complete!</h3>
        <div class="converted-info-card">
          <span class="filename">{convertedFileName}</span>
          <span class="filesize">{formatBytes(convertedBlob?.size || 0)}</span>
        </div>
        <div class="success-actions">
          <button class="action-btn download" onclick={downloadFile}>
            <Download size={16} /> DOWNLOAD
          </button>
          <button class="action-btn secondary" onclick={resetState}>
            CONVERT ANOTHER
          </button>
        </div>
      </div>
    {:else if conversionStatus === "error"}
      <!-- ERROR PANEL -->
      <div class="error-panel">
        <AlertCircle class="text-red-400" size={54} />
        <h3>Refinement Failed</h3>
        <p class="error-msg">{errorMessage}</p>
        <button class="action-btn secondary" onclick={resetState}>
          TRY AGAIN
        </button>
      </div>
    {:else}
      <!-- FILE LOADED, CHOOSE OUTPUT -->
      <div class="file-loaded-panel">
        <div class="back-bar">
          <button class="back-btn" onclick={resetState}>
            <ArrowLeft size={14} /> Back
          </button>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-12 gap-5 md:gap-6 items-start w-full"
        >
          <!-- Left Column -->
          <div class="sm:col-span-6 flex flex-col gap-4">
            <div class="meta-section">
              {#if fileType === "image"}
                <div class="preview-box image-preview">
                  <img src={previewUrl} alt="Upload preview" />
                </div>
              {:else if fileType === "audio"}
                <div class="preview-box audio-preview">
                  <FileAudio size={48} class="text-[#00ffff]" />
                  <span class="audio-badge">Audio Wave Decoded</span>
                </div>
              {:else if fileType === "video"}
                <div class="preview-box audio-preview">
                  <FileVideo size={48} class="text-[#a855f7]" />
                  <span class="audio-badge">Video Frame Decoded</span>
                </div>
              {/if}

              <div class="details">
                <span class="file-name-label">{file.name}</span>
                <span class="file-size-label">{formatBytes(file.size)}</span>
                <div class="badge-row">
                  <span class="format-badge input"
                    >{inputFormat.toUpperCase()}</span
                  >
                  <span class="arrow-trans">➔</span>
                  <span class="format-badge output"
                    >{outputFormat ? outputFormat.toUpperCase() : "?"}</span
                  >
                </div>
              </div>
            </div>

            <!-- Settings Panel (Quality, Compression, Dimensions) -->
            {#if fileType === "image" || fileType === "audio"}
              <div class="settings-control-panel">
                <h3>Configuration Parameters</h3>

                {#if fileType === "image"}
                  <!-- Dimensions Control -->
                  <div class="settings-group">
                    <div
                      class="settings-group-header flex items-center justify-between gap-3 mb-2.5"
                    >
                      <span
                        class="text-xs font-bold text-white/50 uppercase tracking-wide"
                        >Resolution</span
                      >
                      <div class="flex items-center gap-2">
                        <button
                          class="aspect-link-btn"
                          class:linked={keepTens}
                          onclick={handleTensToggle}
                          type="button"
                        >
                          {#if keepTens}
                            <span>10%</span>
                          {:else}
                            <span class="opacity-40">Free</span>
                          {/if}
                        </button>

                        <button
                          class="aspect-link-btn"
                          class:linked={keepAspectRatio}
                          onclick={handleAspectRatioToggle}
                          type="button"
                        >
                          {#if keepAspectRatio}
                            <Link2 size={12} class="mr-1 inline" /><span
                              >Fixed Aspect</span
                            >
                          {:else}
                            <Link2Off
                              size={12}
                              class="mr-1 inline opacity-40"
                            /><span>Unlinked (Free)</span>
                          {/if}
                        </button>

                        <button
                          class="aspect-link-btn"
                          onclick={resetToOriginal}
                          type="button"
                          title="Reset to original dimensions"
                        >
                          <Undo size={12} class="mr-1 inline" /><span
                            >Reset</span
                          >
                        </button>
                      </div>
                    </div>

                    <div
                      class="sliders-row grid grid-cols-2 gap-3.5 max-sm:grid-cols-1"
                    >
                      <div class="slider-field">
                        <div
                          class="slider-label flex justify-between items-center text-[11px] mb-1 font-mono"
                        >
                          <span class="text-white/40">Width</span>
                          <div class="flex items-center gap-0.5">
                            <input
                              type="number"
                              min="10"
                              max={Math.max(5000, originalWidth * 2)}
                              value={targetWidth}
                              oninput={handleWidthChange}
                              class="value-input"
                            />
                            <span class="text-white/30">px</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min={keepTens && originalWidth > 0
                            ? Math.round(originalWidth * 0.1)
                            : 10}
                          max={keepTens && originalWidth > 0
                            ? Math.round(originalWidth * 2)
                            : Math.max(5000, originalWidth * 2)}
                          step={keepTens && originalWidth > 0
                            ? Math.round(originalWidth * 0.1)
                            : 1}
                          bind:value={targetWidth}
                          oninput={handleWidthChange}
                          class="param-slider"
                        />
                      </div>

                      <div class="slider-field">
                        <div
                          class="slider-label flex justify-between items-center text-[11px] mb-1 font-mono"
                        >
                          <span class="text-white/40">Height</span>
                          <div class="flex items-center gap-0.5">
                            <input
                              type="number"
                              min="10"
                              max={Math.max(5000, originalHeight * 2)}
                              value={targetHeight}
                              oninput={handleHeightChange}
                              class="value-input"
                            />
                            <span class="text-white/30">px</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min={keepTens && originalHeight > 0
                            ? Math.round(originalHeight * 0.1)
                            : 10}
                          max={keepTens && originalHeight > 0
                            ? Math.round(originalHeight * 2)
                            : Math.max(5000, originalHeight * 2)}
                          step={keepTens && originalHeight > 0
                            ? Math.round(originalHeight * 0.1)
                            : 1}
                          bind:value={targetHeight}
                          oninput={handleHeightChange}
                          class="param-slider"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Quality & Compression Sliders -->
                  <div class="settings-group">
                    <div
                      class="sliders-row grid grid-cols-2 gap-3.5 mt-2 max-sm:grid-cols-1"
                    >
                      <div
                        class="slider-field"
                        class:opacity-30={!(
                          outputFormat === "jpg" || outputFormat === "webp"
                        )}
                      >
                        <div
                          class="slider-label flex justify-between items-center text-[11px] mb-1 font-mono"
                        >
                          <span class="text-white/40">Quality Factor</span>
                          <div class="flex items-center gap-0.5">
                            <input
                              type="number"
                              min="1"
                              max="100"
                              bind:value={quality}
                              class="value-input quality-input"
                              disabled={!(
                                outputFormat === "jpg" ||
                                outputFormat === "webp"
                              )}
                            />
                            <span class="text-white/30">%</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          bind:value={quality}
                          class="param-slider"
                          disabled={!(
                            outputFormat === "jpg" || outputFormat === "webp"
                          )}
                        />
                      </div>

                      <div
                        class="slider-field"
                        class:opacity-30={!(
                          outputFormat === "png" || outputFormat === "webp"
                        )}
                      >
                        <div
                          class="slider-label flex justify-between items-center text-[11px] mb-1 font-mono"
                        >
                          <span class="text-white/40">Compression Level</span>
                          <div class="flex items-center gap-0.5">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              bind:value={compression}
                              class="value-input compression-input"
                              disabled={!(
                                outputFormat === "png" ||
                                outputFormat === "webp"
                              )}
                            />
                            <span class="text-white/30">%</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          bind:value={compression}
                          class="param-slider"
                          disabled={!(
                            outputFormat === "png" || outputFormat === "webp"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                {/if}

                {#if fileType === "audio"}
                  <div class="settings-group">
                    <div
                      class="sliders-row grid grid-cols-2 gap-3.5 max-sm:grid-cols-1"
                    >
                      {#if outputFormat === "mp3"}
                        <div class="slider-field">
                          <div
                            class="slider-label flex justify-between items-center text-[11px] mb-1 font-mono"
                          >
                            <span class="text-white/40">MP3 Compression</span>
                            <div class="flex items-center gap-0.5">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                bind:value={compression}
                                class="value-input compression-input"
                              />
                              <span class="text-white/30">%</span>
                            </div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            bind:value={compression}
                            class="param-slider"
                          />
                        </div>
                      {:else if outputFormat === "m4a" || outputFormat === "aac" || outputFormat === "webm"}
                        <div class="slider-field">
                          <div
                            class="slider-label flex justify-between text-[11px] mb-1 font-mono"
                          >
                            <span class="text-white/40">Target Bitrate</span>
                          </div>
                          <select
                            bind:value={audioBitrate}
                            class="param-select"
                          >
                            <option value="96">96 kbps (Low)</option>
                            <option value="128">128 kbps (Standard)</option>
                            <option value="192">192 kbps (Medium)</option>
                            <option value="256">256 kbps (High)</option>
                            <option value="320">320 kbps (Extreme)</option>
                          </select>
                        </div>
                      {/if}

                      <div class="slider-field">
                        <div
                          class="slider-label flex justify-between text-[11px] mb-1 font-mono"
                        >
                          <span class="text-white/40"
                            >Sample Rate Resampler</span
                          >
                        </div>
                        <select
                          bind:value={audioSampleRate}
                          class="param-select"
                        >
                          <option value="keep">Keep Original Rate</option>
                          <option value="44100">44.1 kHz (CD Quality)</option>
                          <option value="32000">32.0 kHz (FM Radio)</option>
                          <option value="22050">22.05 kHz (AM Radio)</option>
                          <option value="11025">11.025 kHz (Low Quality)</option
                          >
                        </select>
                      </div>
                    </div>
                  </div>
                {/if}
              </div>
            {/if}
          </div>

          <!-- Right Column -->
          <div class="sm:col-span-6 flex flex-col justify-between gap-5 h-full">
            <div class="selection-section">
              <h3>Select Output Format</h3>
              <div
                class="format-options-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-2 md:gap-3"
              >
                {#each availableFormats as format, index}
                  <button
                    class="format-opt-btn"
                    class:selected={outputFormat === format}
                    onclick={() => (outputFormat = format)}
                  >
                    <span class="format-num">{index + 1}</span>
                    <span class="format-label">{format.toUpperCase()}</span>
                  </button>
                {/each}
              </div>

              <div
                class="shortcut-tip flex items-center justify-center gap-1.5 mt-4 text-[10px] text-white/30 font-mono"
              >
                <Keyboard size={12} />
                <span>Press [1-5] to select, [Enter] to convert</span>
              </div>
            </div>

            <button
              class="action-btn convert-launch"
              disabled={!outputFormat}
              onclick={startConversion}
            >
              <RefreshCw size={16} /> CONVERT
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  .converter-app {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    overflow: hidden;
    background: rgba(7, 7, 11, 0.4);
  }

  .app-content-scroll {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;

    /* Webkit scrollbar customization to look clean and premium */
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }

  .app-header {
    margin-bottom: 24px;
    flex-shrink: 0;

    .title-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    h2 {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 800;
      color: #fff;
      font-family: "Outfit", sans-serif;
    }

    .converter-flame-icon {
      color: #ff5e00;
      filter: drop-shadow(0 0 8px rgba(255, 94, 0, 0.5));
    }

    .description {
      margin: 4px 0 0 0;
      font-size: 0.78rem;
      color: rgba(255, 255, 255, 0.4);
      font-family: "Inter", sans-serif;
    }
  }

  /* ── UPLOAD ZONE ── */
  .upload-dropzone {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px dashed rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.01);
    cursor: pointer;
    transition: all 0.22s cubic-bezier(0.25, 0.8, 0.25, 1);
    padding: 40px 20px;
    gap: 12px;

    .icon-wrap {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.03);
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.3);
      transition: all 0.22s;
    }

    h3 {
      font-size: 1rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      font-family: "Outfit", sans-serif;
    }

    .upload-sub {
      font-size: 0.72rem;
      color: rgba(255, 255, 255, 0.3);
      margin: 0;
      font-family: monospace;
    }

    &:hover,
    &.dragging {
      border-color: #ff5e00;
      background: rgba(255, 94, 0, 0.03);

      .icon-wrap {
        background: rgba(255, 94, 0, 0.1);
        color: #ff5e00;
        transform: translateY(-4px) scale(1.05);
        box-shadow: 0 8px 24px rgba(255, 94, 0, 0.15);
      }

      h3 {
        color: #fff;
      }
    }
  }

  /* ── FILE LOADED PANEL ── */
  .file-loaded-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .back-bar {
      .back-btn {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.4);
        font-size: 0.75rem;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: color 0.18s;
        padding: 0;

        &:hover {
          color: #fff;
        }
      }
    }

    .meta-section {
      display: flex;
      gap: 16px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 14px;
      padding: 16px;

      .preview-box {
        width: 80px;
        height: 80px;
        border-radius: 10px;
        overflow: hidden;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.06);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &.audio-preview {
          flex-direction: column;
          gap: 6px;
          padding: 8px;
          text-align: center;

          .audio-badge {
            font-size: 0.5rem;
            font-weight: 800;
            color: rgba(255, 255, 255, 0.3);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
        }
      }

      .details {
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-width: 0;
        flex: 1;

        .file-name-label {
          font-size: 0.95rem;
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-size-label {
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 2px;
          font-family: monospace;
        }

        .badge-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;

          .format-badge {
            font-size: 0.65rem;
            font-weight: 800;
            font-family: monospace;
            padding: 3px 8px;
            border-radius: 6px;

            &.input {
              background: rgba(255, 255, 255, 0.08);
              color: rgba(255, 255, 255, 0.8);
            }

            &.output {
              background: rgba(255, 94, 0, 0.15);
              border: 1px solid rgba(255, 94, 0, 0.3);
              color: #ff7700;
            }
          }

          .arrow-trans {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.25);
          }
        }
      }
    }

    /* ── SETTINGS PANEL ── */
    .settings-control-panel {
      background: rgba(255, 255, 255, 0.01);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 14px;
      padding: 18px;

      h3 {
        font-size: 0.72rem;
        font-weight: 800;
        color: rgba(255, 255, 255, 0.35);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin: 0 0 16px 0;
        font-family: monospace;
      }

      .settings-group {
        border-bottom: 1px dashed rgba(255, 255, 255, 0.04);
        padding-bottom: 14px;
        margin-bottom: 14px;

        &:last-child {
          border-bottom: none;
          padding-bottom: 0;
          margin-bottom: 0;
        }

        .aspect-link-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          color: rgba(255, 255, 255, 0.6);
          font-size: 10px;
          font-weight: 700;
          border-radius: 6px;
          padding: 4px 8px;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            background: rgba(255, 255, 255, 0.07);
            color: #fff;
          }

          &.linked {
            border-color: rgba(255, 94, 0, 0.4);
            color: #ff8800;
            background: rgba(255, 94, 0, 0.07);
          }
        }
      }

      .value-input {
        width: 48px;
        background: transparent;
        border: none;
        border-bottom: 1px dashed rgba(255, 255, 255, 0.15);
        color: #ff5e00;
        font-weight: 700;
        text-align: right;
        font-family: monospace;
        font-size: 11px;
        outline: none;
        padding: 0 2px;

        &:focus {
          border-color: #ff5e00;
          border-bottom-style: solid;
        }

        &.quality-input {
          color: #4ade80;
          &:focus {
            border-color: #4ade80;
          }
        }

        &.compression-input {
          color: #60a5fa;
          &:focus {
            border-color: #60a5fa;
          }
        }

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      }

      .param-slider {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 2px;
        outline: none;
        accent-color: #ff5e00;
        cursor: pointer;
        transition: opacity 0.2s;

        &:hover {
          background: rgba(255, 255, 255, 0.12);
        }
      }

      .param-select {
        width: 100%;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        padding: 8px 12px;
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.7);
        outline: none;
        cursor: pointer;
        font-family: "Outfit", sans-serif;

        &:focus {
          border-color: #ff5e00;
        }

        option {
          background: #0d0d12;
          color: #fff;
        }
      }
    }

    .selection-section {
      h3 {
        font-size: 0.8rem;
        font-weight: 800;
        color: rgba(255, 255, 255, 0.45);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin: 0 0 12px 0;
      }

      .format-options-grid {
        .format-opt-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          cursor: pointer;
          transition: all 0.2s;
          position: relative;

          .format-num {
            position: absolute;
            top: 6px;
            left: 8px;
            font-size: 0.58rem;
            font-weight: 800;
            font-family: monospace;
            color: rgba(255, 255, 255, 0.25);
            background: rgba(255, 255, 255, 0.05);
            width: 14px;
            height: 14px;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .format-label {
            font-size: 1.1rem;
            font-weight: 800;
            font-family: monospace;
            color: rgba(255, 255, 255, 0.5);
            transition: color 0.2s;
          }

          &:hover {
            border-color: rgba(255, 94, 0, 0.3);
            background: rgba(255, 94, 0, 0.02);

            .format-label {
              color: rgba(255, 255, 255, 0.85);
            }
          }

          &.selected {
            border-color: #ff5e00;
            background: rgba(255, 94, 0, 0.08);
            box-shadow: 0 0 16px rgba(255, 94, 0, 0.1);

            .format-num {
              background: #ff5e00;
              color: #000;
            }

            .format-label {
              color: #ff8800;
            }
          }
        }
      }
    }
  }

  /* ── CONVERTING STATE ── */
  .converting-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .engine-wrap {
      margin-bottom: 24px;

      .catalytic-canister {
        position: relative;
        width: 90px;
        height: 90px;
        border-radius: 50%;
        background: linear-gradient(135deg, #1f1f2e 0%, #0d0d12 100%);
        border: 2px solid rgba(255, 94, 0, 0.25);
        box-shadow: 0 0 35px rgba(255, 94, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;

        .cylinder-flame {
          color: #ff5e00;
          animation: flame-pulse 0.4s infinite alternate ease-in-out;
        }

        .honeycomb-grid {
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          border: 1px dashed rgba(255, 94, 0, 0.15);
          animation: spin 6s linear infinite;

          .spark {
            position: absolute;
            width: 5px;
            height: 5px;
            background: #ffaa00;
            border-radius: 50%;
            box-shadow: 0 0 8px #ffaa00;

            &.s1 {
              top: 15%;
              left: 20%;
              animation: float-spark 1.2s infinite ease-out;
            }
            &.s2 {
              top: 50%;
              right: 15%;
              animation: float-spark 1s infinite 0.3s ease-out;
            }
            &.s3 {
              bottom: 20%;
              left: 45%;
              animation: float-spark 1.5s infinite 0.6s ease-out;
            }
          }
        }
      }
    }

    h3 {
      font-size: 1.05rem;
      font-weight: 700;
      color: #fff;
      margin: 0 0 16px 0;
      font-family: "Outfit", sans-serif;
      letter-spacing: 0.02em;
    }

    .progress-bar-wrap {
      width: 260px;
      height: 6px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 8px;

      .progress-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #ff3c00 0%, #ffaa00 100%);
        box-shadow: 0 0 8px rgba(255, 94, 0, 0.4);
        transition: width 0.15s ease-out;
      }
    }

    .progress-text {
      font-size: 0.72rem;
      font-family: monospace;
      color: rgba(255, 255, 255, 0.4);
      margin: 0;
    }
  }

  .success-panel,
  .error-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 16px;

    h3 {
      font-size: 1.2rem;
      font-weight: 800;
      color: #fff;
      margin: 0;
      font-family: "Outfit", sans-serif;
    }
  }

  .success-panel {
    .converted-info-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 14px 20px;
      display: flex;
      flex-direction: column;
      gap: 3px;
      max-width: 280px;

      .filename {
        font-size: 0.85rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.85);
        word-break: break-all;
      }

      .filesize {
        font-size: 0.7rem;
        font-family: monospace;
        color: rgba(255, 255, 255, 0.45);
      }
    }

    .success-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
      max-width: 240px;
      margin-top: 10px;
    }
  }

  .error-panel {
    .error-msg {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.45);
      margin: 0;
      max-width: 280px;
      line-height: 1.4;
    }
  }

  /* ── BUTTON STYLES ── */
  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 10px;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    font-family: "Outfit", sans-serif;
    letter-spacing: 0.05em;

    &.convert-launch {
      width: 100%;
      background: linear-gradient(135deg, #ff3c00 0%, #ff8800 100%);
      color: #fff;
      border: none;
      box-shadow: 0 6px 20px rgba(255, 94, 0, 0.2);
      margin-top: auto;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(255, 94, 0, 0.3);
      }

      &:disabled {
        opacity: 0.35;
        cursor: not-allowed;
        box-shadow: none;
      }
    }

    &.download {
      background: #fff;
      color: #000;
      border: none;

      &:hover {
        background: rgba(255, 255, 255, 0.9);
        transform: translateY(-1.5px);
        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15);
      }
    }

    &.secondary {
      background: rgba(255, 255, 255, 0.04);
      color: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #fff;
      }
    }
  }

  /* ── ANIMATIONS ── */
  @keyframes flame-pulse {
    0% {
      transform: scale(1) translateY(0);
      opacity: 0.85;
    }
    100% {
      transform: scale(1.15) translateY(-2px);
      opacity: 1;
      filter: drop-shadow(0 0 10px rgba(255, 94, 0, 0.7));
    }
  }

  @keyframes float-spark {
    0% {
      transform: scale(0.5) translateY(10px);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: scale(1) translateY(-20px);
      opacity: 0;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* ── RESPONSIVE VIEWPORT BREAKPOINTS ── */
  @media (max-width: 640px) {
    /* MOBILE PORTRAIT */
    .converter-app {
      padding: 14px;
    }

    .settings-control-panel {
      padding: 12px;
    }
  }

  @media (min-width: 1200px) {
    /* DESKTOP */
    .converter-app {
      max-width: 720px;
      margin: 0 auto;
      justify-content: center;
    }
  }
</style>
