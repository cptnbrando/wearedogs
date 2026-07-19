<script>
  import { onMount, onDestroy } from "svelte";
  import {
    Play,
    Pause,
    ChevronLeft,
    ChevronRight,
    Camera,
    Upload,
    RotateCcw
  } from "lucide-svelte";

  const SCRUB_STEPS_PER_SECOND = 20; // Increased for smoother hold scrubbing
  const SCRUB_STEP_INTERVAL_MS = 1000 / SCRUB_STEPS_PER_SECOND;

  // State Variables (Svelte 4 style - no runes)
  let videoFile = null;
  let videoUrl = "";
  let videoEl = null;
  
  let isPlaying = false;
  let currentTime = 0;
  let seekTargetTime = 0;
  let duration = 0;
  let videoWidth = 0;
  let videoHeight = 0;
  
  let activeSeekDirection = 0; // -1 for left, 1 for right, 0 for none
  let repeatTimeout = null;
  let repeatTimer = null;
  let isShiftPressed = false;
  
  let stepSizeString = "1";
  let fpsPreset = "30";
  let fps = 30;
  let customFps = 30;
  
  let dragOver = false;
  
  let notificationText = "";
  let notificationTimeout = null;

  // Reactivity Calculations
  $: framesToMove = Number(stepSizeString) || 1;
  $: validatedStep = Math.max(1, Math.floor(framesToMove));

  $: {
    if (fpsPreset !== "custom") {
      fps = Number(fpsPreset);
    } else {
      fps = customFps > 0 ? customFps : 30;
    }
  }

  $: frameTime = 1 / fps;
  $: totalFrames = duration ? Math.round(duration * fps) : 0;
  $: currentFrame = currentTime ? Math.round(currentTime * fps) : 0;

  // Helper to format time into HH:MM:SS.mmm
  function formatTimeMs(timeSecs) {
    if (isNaN(timeSecs) || timeSecs < 0) return "00:00:00.000";
    const hours = Math.floor(timeSecs / 3600);
    const minutes = Math.floor((timeSecs % 3600) / 60);
    const seconds = Math.floor(timeSecs % 60);
    const ms = Math.floor((timeSecs % 1) * 1000);

    const pad = (n, len = 2) => String(n).padStart(len, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(ms, 3)}`;
  }

  function showNotification(text) {
    notificationText = text;
    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
      notificationText = "";
    }, 3000);
  }

  function nonPassiveTouch(node, params) {
    const onTouchStart = (e) => {
      e.preventDefault();
      params.start(e);
    };
    const onTouchEnd = (e) => {
      e.preventDefault();
      params.end(e);
    };

    node.addEventListener("touchstart", onTouchStart, { passive: false });
    node.addEventListener("touchend", onTouchEnd, { passive: false });
    node.addEventListener("touchcancel", onTouchEnd, { passive: false });

    return {
      destroy() {
        node.removeEventListener("touchstart", onTouchStart);
        node.removeEventListener("touchend", onTouchEnd);
        node.removeEventListener("touchcancel", onTouchEnd);
      }
    };
  }

  function startHoldScrub(stepAmount) {
    if (activeSeekDirection === stepAmount) return;
    stopHoldScrub();
    activeSeekDirection = stepAmount;
    
    if (videoEl) {
      seekTargetTime = videoEl.currentTime;
    }

    const initialStep = isShiftPressed ? stepAmount * 5 : stepAmount;
    stepFrames(initialStep);
    
    // Set 400ms delay before repeat seeks begin (standard repeat delay)
    repeatTimeout = setTimeout(() => {
      repeatTimer = setInterval(() => {
        const step = isShiftPressed ? stepAmount * 5 : stepAmount;
        stepFrames(step);
      }, SCRUB_STEP_INTERVAL_MS);
    }, 400);
  }

  function stopHoldScrub(stepAmount) {
    if (stepAmount && activeSeekDirection !== stepAmount) return;
    if (repeatTimeout) {
      clearTimeout(repeatTimeout);
      repeatTimeout = null;
    }
    if (repeatTimer) {
      clearInterval(repeatTimer);
      repeatTimer = null;
    }
    activeSeekDirection = 0;
    if (videoEl) {
      videoEl.currentTime = seekTargetTime;
    }
  }

  function handleMouseDownScrub(stepAmount, e) {
    isShiftPressed = e ? e.shiftKey : false;
    startHoldScrub(stepAmount);
  }

  // Keyboard Shortcuts Handler
  function handleKeydown(e) {
    isShiftPressed = e.shiftKey;

    // Prevent shortcut triggering when typing in inputs/textareas
    const activeEl = document.activeElement;
    if (
      activeEl &&
      (activeEl.tagName === "INPUT" ||
        activeEl.tagName === "TEXTAREA" ||
        activeEl.isContentEditable)
    ) {
      return;
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      startHoldScrub(validatedStep);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      startHoldScrub(-validatedStep);
    } else if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      if (!e.repeat) {
        togglePlay();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!e.repeat) {
        stepFrames(validatedStep * 10);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!e.repeat) {
        stepFrames(-validatedStep * 10);
      }
    }
  }

  function handleKeyup(e) {
    isShiftPressed = e.shiftKey;
    if (e.key === "ArrowRight") {
      stopHoldScrub(validatedStep);
    } else if (e.key === "ArrowLeft") {
      stopHoldScrub(-validatedStep);
    }
  }

  function handleBlur() {
    stopHoldScrub();
  }

  // Video navigation actions
  function togglePlay() {
    if (!videoEl) return;
    if (isPlaying) {
      videoEl.pause();
      isPlaying = false;
    } else {
      videoEl.play().then(() => {
        isPlaying = true;
      }).catch(err => console.error(err));
    }
  }

  function stepFrames(count) {
    if (!videoEl) return;
    if (isPlaying) {
      videoEl.pause();
      isPlaying = false;
    }
    seekTargetTime = Math.max(0, Math.min(duration, seekTargetTime + count * frameTime));
    if (!videoEl.seeking || activeSeekDirection === 0) {
      videoEl.currentTime = seekTargetTime;
    }
  }

  function jumpToStart() {
    if (!videoEl) return;
    if (isPlaying) {
      videoEl.pause();
      isPlaying = false;
    }
    seekTargetTime = 0;
    videoEl.currentTime = 0;
  }

  function jumpToEnd() {
    if (!videoEl) return;
    if (isPlaying) {
      videoEl.pause();
      isPlaying = false;
    }
    seekTargetTime = duration;
    videoEl.currentTime = duration;
  }

  function handleSliderInput(e) {
    if (!videoEl) return;
    if (isPlaying) {
      videoEl.pause();
      isPlaying = false;
    }
    const targetFrame = Number(e.target.value);
    seekTargetTime = Math.max(0, Math.min(duration, targetFrame * frameTime));
    videoEl.currentTime = seekTargetTime;
  }

  // Video State Events
  function handlePlayState() {
    isPlaying = true;
  }

  function handlePauseState() {
    isPlaying = false;
  }

  function handleTimeUpdate() {
    if (videoEl) {
      currentTime = videoEl.currentTime;
      if (activeSeekDirection === 0) {
        seekTargetTime = currentTime;
      }
    }
  }

  function handleLoadedMetadata() {
    if (videoEl) {
      duration = videoEl.duration;
      videoWidth = videoEl.videoWidth;
      videoHeight = videoEl.videoHeight;
      seekTargetTime = videoEl.currentTime;
    }
  }

  // File loading methods
  function loadVideo(file) {
    if (!file || !file.type.startsWith("video/")) {
      showNotification("Please upload a valid video file.");
      return;
    }
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    videoFile = file;
    videoUrl = URL.createObjectURL(file);
    isPlaying = false;
    currentTime = 0;
    duration = 0;
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      loadVideo(file);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    dragOver = true;
  }

  function handleDragLeave() {
    dragOver = false;
  }

  function handleDrop(e) {
    e.preventDefault();
    dragOver = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      loadVideo(file);
    }
  }

  function handleReset() {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    videoFile = null;
    videoUrl = "";
    videoEl = null;
    isPlaying = false;
    currentTime = 0;
    duration = 0;
    videoWidth = 0;
    videoHeight = 0;
  }

  // Snapshot functionality
  function captureSnapshot() {
    if (!videoEl) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoWidth || videoEl.videoWidth;
    canvas.height = videoHeight || videoEl.videoHeight;
    const ctxCanvas = canvas.getContext("2d");
    if (!ctxCanvas) return;

    ctxCanvas.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      const baseName = videoFile ? videoFile.name.substring(0, videoFile.name.lastIndexOf('.')) || videoFile.name : "video";
      a.href = dataUrl;
      a.download = `${baseName}_frame_${currentFrame}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showNotification(`Saved frame ${currentFrame}!`);
    } catch (err) {
      console.error(err);
      showNotification("Error exporting frame.");
    }
  }



  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("keyup", handleKeyup);
    window.addEventListener("blur", handleBlur);
  });

  onDestroy(() => {
    window.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("keyup", handleKeyup);
    window.removeEventListener("blur", handleBlur);
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    clearTimeout(notificationTimeout);
    stopHoldScrub();
  });
</script>

<div class="frame-app-container animated-pane">
  <!-- Notifications Banner -->
  {#if notificationText}
    <div class="notification-toast">
      {notificationText}
    </div>
  {/if}

  {#if !videoUrl}
    <!-- UPLOAD PLACEHOLDER STATE -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
      class="upload-zone {dragOver ? 'drag-over' : ''}"
      ondragover={handleDragOver}
      ondragleave={handleDragLeave}
      ondrop={handleDrop}
    >
      <div class="upload-content">
        <div class="icon-pulse">
          <Upload size={48} class="text-neon-gold" />
        </div>
        <h2 class="upload-title">FRAMES</h2>
        <p class="upload-subtitle">Drag & Drop a video or click below to browse</p>
        
        <label class="select-btn">
          CHOOSE VIDEO FILE
          <input 
            type="file" 
            accept="video/*" 
            onchange={handleFileChange} 
            class="hidden-file-input"
          />
        </label>
        
        <span class="file-limits">Supports MP4, WebM, MOV & Ogg formats. Processing is entirely local.</span>
      </div>
    </div>
  {:else}
    <!-- ACTIVE VIDEO VIEW STATE -->
    <div class="player-layout">
      
      <!-- COLUMN 1: VIDEO DISPLAY & TIMELINE -->
      <div class="main-video-panel">
        <!-- Video Header info -->
        <div class="video-meta-header">
          <div class="header-details">
            <span class="filename" title={videoFile ? videoFile.name : 'Uploaded Video'}>
              {videoFile ? (videoFile.name.length > 32 ? videoFile.name.substring(0, 30) + '...' : videoFile.name) : 'Video file'}
            </span>
            <span class="resolution">
              {videoWidth}x{videoHeight} | {(duration || 0).toFixed(2)}s
            </span>
          </div>
          <button onclick={handleReset} class="reset-app-btn">
            <RotateCcw size={14} class="mr-1" /> RESET
          </button>
        </div>

        <!-- Video Player Window -->
        <div class="video-wrapper">
          <!-- svelte-ignore a11y_media_has_caption -->
          <video
            bind:this={videoEl}
            src={videoUrl}
            onplay={handlePlayState}
            onpause={handlePauseState}
            ontimeupdate={handleTimeUpdate}
            onloadedmetadata={handleLoadedMetadata}
            class="video-display"
          ></video>
        </div>

        <!-- Custom Timeline Scrubbar -->
        <div class="scrub-container">
          <input 
            type="range"
            min="0"
            max={totalFrames}
            value={currentFrame}
            oninput={handleSliderInput}
            class="timeline-slider"
          />
          <div class="scrub-labels">
            <span class="time-readout">{formatTimeMs(currentTime)}</span>
            <span class="frame-readout">Frame {currentFrame} / {totalFrames}</span>
          </div>
        </div>
      </div>

      <!-- COLUMN 2: STEP & FPS CONTROLS -->
      <div class="controls-panel">
        <h3 class="panel-section-title">NAVIGATION CONTROLS</h3>

        <!-- Playback Controls -->
        <div class="playback-actions">
          <!-- Step -5 -->
          <button 
            use:nonPassiveTouch={{
              start: (e) => handleMouseDownScrub(-5, e),
              end: () => stopHoldScrub(-5)
            }}
            onmousedown={(e) => handleMouseDownScrub(-5, e)}
            onmouseup={() => stopHoldScrub(-5)}
            onmouseleave={() => stopHoldScrub(-5)}
            oncontextmenu={(e) => e.preventDefault()}
            class="control-icon-btn jump-btn" 
            title="Back 5 frames"
          >
            -5
          </button>
          
          <!-- Step Left -->
          <button 
            use:nonPassiveTouch={{
              start: (e) => handleMouseDownScrub(-validatedStep, e),
              end: () => stopHoldScrub(-validatedStep)
            }}
            onmousedown={(e) => handleMouseDownScrub(-validatedStep, e)}
            onmouseup={() => stopHoldScrub(-validatedStep)}
            onmouseleave={() => stopHoldScrub(-validatedStep)}
            oncontextmenu={(e) => e.preventDefault()}
            class="control-icon-btn step-btn" 
            title="Previous step (Left Arrow). Hold Shift to move faster."
          >
            <ChevronLeft size={24} />
          </button>

          <!-- Play/Pause -->
          <button onclick={togglePlay} class="control-icon-btn play-pause-btn" class:active-play={isPlaying} title="Play / Pause (Space)">
            {#if isPlaying}
              <Pause size={20} />
            {:else}
              <Play size={20} />
            {/if}
          </button>

          <!-- Step Right -->
          <button 
            use:nonPassiveTouch={{
              start: (e) => handleMouseDownScrub(validatedStep, e),
              end: () => stopHoldScrub(validatedStep)
            }}
            onmousedown={(e) => handleMouseDownScrub(validatedStep, e)}
            onmouseup={() => stopHoldScrub(validatedStep)}
            onmouseleave={() => stopHoldScrub(validatedStep)}
            oncontextmenu={(e) => e.preventDefault()}
            class="control-icon-btn step-btn" 
            title="Next step (Right Arrow). Hold Shift to move faster."
          >
            <ChevronRight size={24} />
          </button>

          <!-- Step +5 -->
          <button 
            use:nonPassiveTouch={{
              start: (e) => handleMouseDownScrub(5, e),
              end: () => stopHoldScrub(5)
            }}
            onmousedown={(e) => handleMouseDownScrub(5, e)}
            onmouseup={() => stopHoldScrub(5)}
            onmouseleave={(e) => stopHoldScrub(5)}
            oncontextmenu={(e) => e.preventDefault()}
            class="control-icon-btn jump-btn" 
            title="Forward 5 frames"
          >
            +5
          </button>
        </div>

        <div class="keyboard-helper">
          💡 Use <span class="kbd">←</span> <span class="kbd">→</span> (or hold down) for steps, hold <span class="kbd">Shift + ← / →</span> to scrub fast, <span class="kbd">↑</span> <span class="kbd">↓</span> for 10x jumps, and <span class="kbd">Space</span> to play/pause.
        </div>

        <!-- Configurations: Step Size and Framerate -->
        <div class="config-grid">
          <!-- Step Size Configurer -->
          <div class="config-item font-primary">
            <label for="step-size-select" class="config-label">STEP SIZE</label>
            <select id="step-size-select" bind:value={stepSizeString} class="step-size-dropdown">
              <option value="1">1 frame</option>
              <option value="2">2 frames</option>
              <option value="3">3 frames</option>
              <option value="4">4 frames</option>
              <option value="5">5 frames</option>
              <option value="6">6 frames</option>
              <option value="7">7 frames</option>
              <option value="8">8 frames</option>
              <option value="9">9 frames</option>
              <option value="10">10 frames</option>
            </select>
          </div>

          <!-- Framerate Configurer -->
          <div class="config-item font-primary">
            <label for="fps-select" class="config-label">FRAMERATE (FPS)</label>
            <div class="fps-selectors">
              <select id="fps-select" bind:value={fpsPreset} class="fps-dropdown">
                <option value="24">24 FPS (Film)</option>
                <option value="25">25 FPS (PAL)</option>
                <option value="29.97">29.97 FPS (NTSC)</option>
                <option value="30">30 FPS (Standard)</option>
                <option value="50">50 FPS</option>
                <option value="60">60 FPS (High-rate)</option>
                <option value="custom">Custom FPS...</option>
              </select>
            </div>
          </div>
        </div>

        {#if fpsPreset === 'custom'}
          <div class="custom-fps-input-wrapper font-primary">
            <label for="custom-fps-input" class="config-label">CUSTOM FPS</label>
            <div class="custom-fps-input-box">
              <input 
                id="custom-fps-input"
                type="number" 
                bind:value={customFps}
                min="0.1" 
                max="240" 
                step="0.001" 
                class="custom-fps-input"
              />
              <span class="custom-fps-suffix">fps</span>
            </div>
          </div>
        {/if}

        <!-- Snapshots / Quick Exports -->
        <div class="export-actions">
          <button onclick={captureSnapshot} class="snapshot-btn">
            <Camera size={16} class="mr-2" /> CAPTURE HIGH-RES FRAME
          </button>
        </div>
      </div>
     </div>
  {/if}
</div>

<style lang="scss">
  @use "../../styles/variables" as *;

  .frame-app-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    font-family: $font-primary;
    box-sizing: border-box;
    position: relative;
  }

  .animated-pane {
    animation: paneFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes paneFadeIn {
    0% {
      opacity: 0;
      transform: translateY(12px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  // Toast Notification
  .notification-toast {
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(15, 15, 22, 0.9);
    border: 1px solid $color-neon-gold;
    color: $color-neon-gold;
    padding: 8px 20px;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 700;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
    z-index: 100;
    pointer-events: none;
    animation: toastIn 0.2s ease forwards;
  }

  @keyframes toastIn {
    from {
      opacity: 0;
      top: 0;
    }
    to {
      opacity: 1;
      top: 16px;
    }
  }

  // 1. Upload Placeholder State
  .upload-zone {
    width: 90%;
    max-width: 580px;
    background: rgba(15, 15, 22, 0.45);
    border: 2px dashed rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 40px;
    text-align: center;
    box-sizing: border-box;
    transition: all 0.25s ease;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);

    &.drag-over {
      border-color: $color-neon-gold;
      background: rgba(230, 185, 0, 0.05);
      box-shadow: 0 0 30px rgba(230, 185, 0, 0.15);
    }

    .upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .icon-pulse {
      animation: pulseGlow 2s infinite alternate;
      border-radius: 50%;
      padding: 16px;
      margin-bottom: 24px;
      background: rgba(230, 185, 0, 0.05);
      border: 1px solid rgba(230, 185, 0, 0.15);
    }

    .upload-title {
      font-size: 1.6rem;
      font-weight: 900;
      letter-spacing: 0.15em;
      margin: 0 0 8px 0;
      color: white;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
    }

    .upload-subtitle {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.4);
      margin: 0 0 32px 0;
    }

    .select-btn {
      background: rgba(230, 185, 0, 0.12);
      border: 1px solid rgba(230, 185, 0, 0.3);
      color: $color-neon-gold;
      border-radius: 8px;
      padding: 14px 36px;
      font-size: 0.85rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-block;
      user-select: none;

      &:hover {
        background: rgba(230, 185, 0, 0.22);
        box-shadow: 0 0 20px rgba(230, 185, 0, 0.2);
        border-color: $color-neon-gold;
      }

      &:active {
        transform: scale(0.97);
      }
    }

    .hidden-file-input {
      display: none;
    }

    .file-limits {
      margin-top: 24px;
      font-size: 0.72rem;
      color: rgba(255, 255, 255, 0.25);
    }
  }

  // 2. Active Video Player Layout
  .player-layout {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    max-height: 100%;
    box-sizing: border-box;
    padding: 12px;
    gap: 12px;
    overflow: hidden; /* Avoid main body scrollbars completely */

    /* Viewports Matrix scaling */
    @media (min-width: 640px) and (max-height: 550px) {
      // Landscape mobile
      flex-direction: row;
      padding: 8px;
      gap: 12px;
    }

    @media (min-width: 768px) {
      // Tablet and desktop side-by-side grid
      display: grid;
      grid-template-columns: 1.6fr 1fr;
      gap: 20px;
      padding: 16px;
    }

    @media (min-width: 1200px) {
      // Desktop mode capped at max width/height
      grid-template-columns: 1.8fr 1fr;
      max-width: 1100px;
      margin: 0 auto;
    }
  }

  // Main video viewer (Column 1)
  .main-video-panel {
    display: flex;
    flex-direction: column;
    background: rgba(15, 15, 22, 0.45);
    border: 1px solid $border-light;
    border-radius: 12px;
    padding: 16px;
    box-sizing: border-box;
    min-height: 0;
    flex: 1 1 auto;

    @media (max-width: 768px) {
      padding: 10px;
    }

    @media (min-width: 640px) and (max-height: 550px) {
      flex: 1.3 1 0%;
      height: 100%;
      padding: 8px;
    }

    .video-meta-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      flex-shrink: 0;

      .header-details {
        display: flex;
        flex-direction: column;
      }

      .filename {
        font-weight: 800;
        font-size: 0.9rem;
        letter-spacing: 0.05em;
        color: white;
      }

      .resolution {
        font-size: 0.72rem;
        color: rgba(255, 255, 255, 0.35);
      }

      .reset-app-btn {
        background: rgba(255, 51, 68, 0.1);
        border: 1px solid rgba(255, 51, 68, 0.25);
        color: $color-neon-red;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 0.7rem;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: all 0.15s ease;

        &:hover {
          background: rgba(255, 51, 68, 0.22);
          border-color: $color-neon-red;
        }
      }
    }

    .video-wrapper {
      flex-grow: 1;
      flex-shrink: 1;
      flex-basis: 0%;
      min-height: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #000;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
      border: 1px solid rgba(255, 255, 255, 0.03);

      @media (max-width: 768px) {
        min-height: 140px;
      }
      
      .video-display {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        display: block;
        object-fit: contain;
      }
    }

    .scrub-container {
      margin-top: 14px;
      flex-shrink: 0;

      .timeline-slider {
        width: 100%;
        background: rgba(255, 255, 255, 0.1);
        height: 6px;
        border-radius: 3px;
        outline: none;
        cursor: pointer;
        -webkit-appearance: none;
        
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: $color-neon-gold;
          box-shadow: 0 0 10px rgba(230, 185, 0, 0.5);
          transition: transform 0.1s ease;

          &:hover {
            transform: scale(1.2);
          }
        }
      }

      .scrub-labels {
        display: flex;
        justify-content: space-between;
        margin-top: 6px;
        font-family: monospace;
        font-size: 0.75rem;

        .time-readout {
          color: $color-neon-gold;
          font-weight: 700;
        }

        .frame-readout {
          color: rgba(255, 255, 255, 0.45);
        }
      }
    }
  }

  // Controls Panel (Column 2)
  .controls-panel {
    display: flex;
    flex-direction: column;
    background: rgba(15, 15, 22, 0.45);
    border: 1px solid $border-light;
    border-radius: 12px;
    padding: 16px;
    box-sizing: border-box;
    flex: 0 0 auto;

    @media (max-width: 768px) {
      padding: 12px;

      .keyboard-helper {
        display: none;
      }

      .panel-section-title {
        font-size: 0.65rem;
        margin-bottom: 8px;
      }
    }

    @media (min-width: 640px) and (max-height: 550px) {
      flex: 1 1 0%;
      height: 100%;
      padding: 8px;
      overflow-y: auto;
      &::-webkit-scrollbar { display: none; }
    }

    @media (min-width: 768px) {
      height: 100%;
      overflow-y: auto;
    }

    .playback-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      margin-bottom: 12px;
      flex-shrink: 0;

      .control-icon-btn {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.85);
        width: 38px;
        height: 38px;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.15s ease;
        font-size: 0.75rem;
        font-weight: 800;
        font-family: monospace;

        &:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          color: white;
        }

        &:active {
          transform: scale(0.95);
        }

        &.step-btn {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
          touch-action: manipulation;
        }

        &.jump-btn {
          color: $color-neon-gold;
        }

        &.play-pause-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(230, 185, 0, 0.12);
          border-color: rgba(230, 185, 0, 0.35);
          color: $color-neon-gold;

          &:hover {
            background: rgba(230, 185, 0, 0.22);
            box-shadow: 0 0 15px rgba(230, 185, 0, 0.2);
          }

          &.active-play {
            background: rgba(255, 51, 68, 0.12);
            border-color: rgba(255, 51, 68, 0.35);
            color: $color-neon-red;

            &:hover {
              background: rgba(255, 51, 68, 0.22);
              box-shadow: 0 0 15px rgba(255, 51, 68, 0.2);
            }
          }
        }
      }
    }

    .keyboard-helper {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.3);
      line-height: 1.4;
      margin-bottom: 20px;
      background: rgba(255, 255, 255, 0.01);
      border-radius: 6px;
      padding: 8px;
      border: 1px dashed rgba(255, 255, 255, 0.04);
      flex-shrink: 0;

      .kbd {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 3px;
        padding: 1px 4px;
        font-family: monospace;
        font-weight: 800;
        font-size: 0.65rem;
      }
    }

    .config-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
      flex-shrink: 0;
    }

    .config-item {
      display: flex;
      flex-direction: column;
    }

    .config-label {
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: rgba(255, 255, 255, 0.45);
      display: block;
      margin-bottom: 6px;
    }

    .step-size-dropdown,
    .fps-dropdown {
      background: rgba(15, 15, 22, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: white;
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 0.8rem;
      outline: none;
      width: 100%;
      height: 38px;
      cursor: pointer;
      box-sizing: border-box;

      option {
        background: #0f0f16;
      }

      &:focus {
        border-color: $color-neon-gold;
      }
    }

    .custom-fps-input-wrapper {
      margin-top: -4px;
      margin-bottom: 16px;
      flex-shrink: 0;

      .custom-fps-input-box {
        display: flex;
        align-items: center;
        background: rgba(15, 15, 22, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 6px;
        padding: 8px 12px;
        height: 38px;
        box-sizing: border-box;

        &:focus-within {
          border-color: $color-neon-gold;
        }

        .custom-fps-input {
          background: transparent;
          border: none;
          color: white;
          width: 100%;
          outline: none;
          font-size: 0.8rem;
          font-family: monospace;
        }

        .custom-fps-suffix {
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.4);
          margin-left: 6px;
        }
      }
    }

    .export-actions {
      margin-top: auto;
      flex-shrink: 0;

      .snapshot-btn {
        background: rgba(230, 185, 0, 0.12);
        border: 1px solid rgba(230, 185, 0, 0.35);
        color: $color-neon-gold;
        border-radius: 6px;
        padding: 10px;
        width: 100%;
        font-size: 0.75rem;
        font-weight: 800;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(230, 185, 0, 0.22);
          box-shadow: 0 0 15px rgba(230, 185, 0, 0.15);
          border-color: $color-neon-gold;
        }
      }
    }
  }

  // Generic details
  .panel-section-title {
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    color: rgba(255, 255, 255, 0.35);
    margin: 0 0 12px 0;
    flex-shrink: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 6px;
  }
</style>
