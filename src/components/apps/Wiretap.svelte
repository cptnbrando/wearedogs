<script>
  import { onMount, onDestroy } from "svelte";
  import BaseApp from "./BaseApp.svelte";
  import { WiretapEngine } from "./WiretapEngine.js";
  import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    Play,
    Pause,
    Download,
    RefreshCw,
    Camera,
    Info,
    AlertCircle,
    Copy,
    Check,
  } from "lucide-svelte";

  // State Management
  const engine = new WiretapEngine();
  
  let audioDevices = $state([]);
  let videoDevices = $state([]);
  let selectedAudioDevice = $state("");
  let selectedVideoDevice = $state("");
  let isPermissionsGranted = $state(false);
  let isCheckingPermissions = $state(true);
  
  // Real-time Visuals
  let liveTranscript = $state({ final: "", interim: "" });
  let liveWaveform = $state(Array(32).fill(0));
  let decodedPeaks = $state([]);
  let livePeaks = $state(Array(100).fill(0));
  let livePeaksCount = $state(0);
  let livePeaksDuration = $state(0);
  
  // Playback Info
  let playbackProgress = $state(0);
  let currentTime = $state(0);
  let duration = $state(0);
  let isCopied = $state(false);

  // Live Camera preview variables
  let enableVideo = $state(false);
  let videoEl = $state(null);
  let cameraStream = null;

  // Engine state representation
  let engineState = $state({
    isRecording: false,
    isPlaying: false,
    isDecoding: false,
    hasRecording: false,
  });

  // Track state changes from the engine
  engine.onStateChange = (state) => {
    engineState = state;
  };

  engine.onLiveTranscript = (transcript) => {
    liveTranscript = transcript;
    scrollTranscriptIntoView();
  };

  engine.onLiveWaveform = (data) => {
    liveWaveform = data.slice(0, 32).map((val) => val / 255);
  };

  engine.onAudioDecoded = (peaks) => {
    decodedPeaks = peaks;
  };

  engine.onLivePeaksUpdate = (peaks, count, dur) => {
    livePeaks = peaks;
    livePeaksCount = count;
    livePeaksDuration = dur;
  };

  engine.onPlaybackProgress = (progress, time, dur) => {
    playbackProgress = progress;
    currentTime = time;
    duration = dur;
  };

  // Autoscroll transcript container during live recording
  let transcriptContainer = $state(null);
  function scrollTranscriptIntoView() {
    if (transcriptContainer) {
      transcriptContainer.scrollTop = transcriptContainer.scrollHeight;
    }
  }

  // Enumerate hardware devices
  async function initDevices() {
    try {
      isCheckingPermissions = true;
      await engine.requestPermissions();
      isPermissionsGranted = true;
      
      const { audio, video } = await engine.getDevices();
      audioDevices = audio;
      videoDevices = video;
      
      if (audio.length > 0) selectedAudioDevice = audio[0].deviceId;
      if (video.length > 0) selectedVideoDevice = video[0].deviceId;
    } catch (err) {
      console.warn("Permissions denied or device list unavailable:", err);
      isPermissionsGranted = false;
    } finally {
      isCheckingPermissions = false;
    }
  }

  // Handle camera preview stream update
  async function updateCameraStream() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      cameraStream = null;
    }

    if (enableVideo && selectedVideoDevice) {
      try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedVideoDevice } },
        });
        if (videoEl) {
          videoEl.srcObject = cameraStream;
        }
      } catch (err) {
        console.error("Webcam stream access failed:", err);
        enableVideo = false;
      }
    }
  }

  // Reactive updates to video toggle or device selector change
  $effect(() => {
    if (enableVideo || !enableVideo) {
      updateCameraStream();
    }
  });

  // Start recording voice and transcription
  async function startRecording() {
    try {
      await engine.startRecording(selectedAudioDevice);
      liveTranscript = { final: "", interim: "" };
      playbackProgress = 0;
      currentTime = 0;
      duration = 0;
    } catch (err) {
      console.error("Start recording failed:", err);
    }
  }

  // Stop recording voice and transcription
  function stopRecording() {
    engine.stopRecording();
  }

  // Custom pointer drag scrubbing logic
  function handleWaveformPointerDown(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    
    function updateProgress(clientX) {
      const clickX = clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      engine.seek(pct);
    }

    updateProgress(e.clientX);

    function onPointerMove(moveEvent) {
      updateProgress(moveEvent.clientX);
    }

    function onPointerUp() {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  // Copy transcript text to clipboard
  function copyTranscript() {
    const text = liveTranscript.final || "No transcript available.";
    navigator.clipboard.writeText(text).then(() => {
      isCopied = true;
      setTimeout(() => {
        isCopied = false;
      }, 2000);
    });
  }

  // Reset recording state
  function reset() {
    engine.reset();
    liveTranscript = { final: "", interim: "" };
    liveWaveform = Array(32).fill(0);
    decodedPeaks = [];
    livePeaks = Array(100).fill(0);
    livePeaksCount = 0;
    livePeaksDuration = 0;
  }

  // Format seconds to readable timer format (MM:SS or H:MM:SS)
  function formatTime(secs) {
    if (isNaN(secs)) return "0:00";
    const totalSeconds = Math.round(secs);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  onMount(() => {
    initDevices();
  });

  onDestroy(() => {
    engine.reset();
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
  });
</script>

<BaseApp
  title="Wiretap"
  description="Hacker-style voice recorder with live transcripts and responsive camera monitoring."
  themeColor="#00ff66"
>
  <div class="wiretap-layout w-full h-full flex flex-col justify-between">
    <!-- Permissions Block -->
    {#if isCheckingPermissions}
      <div class="flex-1 flex flex-col items-center justify-center text-center p-6">
        <RefreshCw class="w-8 h-8 text-[#00ff66] animate-spin mb-4" />
        <p class="text-sm font-mono text-white/50 tracking-wider">ENUMERATING RECORDING DEVICES...</p>
      </div>
    {:else if !isPermissionsGranted}
      <div class="flex-1 flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto">
        <AlertCircle class="w-12 h-12 text-[#ff3344] mb-4 animate-pulse" />
        <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wider mb-2">ACCESS REQUIRED</h3>
        <p class="text-xs text-white/60 mb-6 leading-relaxed">
          Wiretap requires camera and microphone permissions to capture surveillance streams and generate transcriptions.
        </p>
        <button
          onclick={initDevices}
          class="px-6 py-3 bg-[#00ff66] text-black font-mono font-bold text-xs uppercase rounded hover:bg-[#00d75f] active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)] hover:shadow-[0_0_25px_rgba(0,255,102,0.5)] cursor-pointer"
        >
          GRANT ACCESS
        </button>
      </div>
    {:else}
      <!-- Responsive Dashboard -->
      <div class="dashboard-grid w-full h-full flex flex-col xl:grid xl:grid-cols-12 gap-4 flex-grow overflow-hidden p-2">
        
        <!-- Left Panel: Device Setup & Live Video Feed (Col 1-5 on Desktop) -->
        <div class="xl:col-span-5 flex flex-col gap-4 min-h-0">
          
          <!-- Device Settings Panel -->
          <div class="glass-card flex flex-col gap-3 p-4">
            <h3 class="panel-header">
              <span class="pulse-indicator"></span> SURVEILLANCE INPUTS
            </h3>

            <!-- Audio Input -->
            <div class="flex flex-col gap-1">
              <label for="mic-select" class="input-label">MICROPHONE SOURCE</label>
              <div class="flex items-center gap-2 bg-black/35 border border-white/10 rounded px-2 py-1">
                <Mic class="w-4 h-4 text-[#00ff66]" />
                <select
                  id="mic-select"
                  bind:value={selectedAudioDevice}
                  disabled={engineState.isRecording}
                  class="flex-1 bg-transparent text-white text-xs font-mono border-none outline-none py-1 cursor-pointer disabled:opacity-50"
                >
                  {#each audioDevices as dev}
                    <option value={dev.deviceId} class="bg-neutral-900">{dev.label || `Microphone ${dev.deviceId.slice(0, 5)}`}</option>
                  {/each}
                </select>
              </div>
            </div>

            <!-- Video Input -->
            <div class="flex flex-col gap-1">
              <label for="camera-select" class="input-label">CAMERA SOURCE</label>
              <div class="flex items-center gap-2 bg-black/35 border border-white/10 rounded px-2 py-1">
                <Camera class="w-4 h-4 text-[#00ff66]" />
                <select
                  id="camera-select"
                  bind:value={selectedVideoDevice}
                  disabled={engineState.isRecording}
                  class="flex-1 bg-transparent text-white text-xs font-mono border-none outline-none py-1 cursor-pointer disabled:opacity-50"
                >
                  {#each videoDevices as dev}
                    <option value={dev.deviceId} class="bg-neutral-900">{dev.label || `Webcam ${dev.deviceId.slice(0, 5)}`}</option>
                  {/each}
                </select>
              </div>
            </div>

            <!-- Video Toggle -->
            <div class="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
              <span class="input-label">MONITOR LIVE VIDEO FEED</span>
              <button
                onclick={() => enableVideo = !enableVideo}
                class="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono uppercase transition-all duration-200 border cursor-pointer {enableVideo ? 'bg-[#00ff66] text-black border-[#00ff66]' : 'bg-transparent text-white/60 border-white/10'}"
              >
                {#if enableVideo}
                  <Video class="w-3.5 h-3.5" /> VIDEO ON
                {:else}
                  <VideoOff class="w-3.5 h-3.5" /> VIDEO OFF
                {/if}
              </button>
            </div>
          </div>

          <!-- Live Video Viewport (toggles in/out of layout) -->
          {#if enableVideo}
            <div class="glass-card flex-1 min-h-[160px] md:min-h-[220px] relative overflow-hidden flex flex-col justify-between bg-black/60 border-2 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
              <!-- Grid overlay for camera monitoring look -->
              <div class="absolute inset-0 scanlines pointer-events-none opacity-25"></div>
              
              <!-- Live Monitor label -->
              <div class="absolute top-3 left-3 bg-red-600/90 text-white text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded flex items-center gap-1 z-10 animate-pulse">
                <span class="w-1.5 h-1.5 rounded-full bg-white"></span> LIVE CAM FEED
              </div>
              
              <!-- Video stream element -->
              <!-- svelte-ignore a11y_media_has_caption -->
              <video
                bind:this={videoEl}
                autoplay
                playsinline
                muted
                class="w-full h-full object-cover flex-grow bg-neutral-950"
              ></video>
            </div>
          {/if}
        </div>

        <!-- Right Panel: Recorder controls, Visualizer & Transcription (Col 6-12 on Desktop) -->
        <div class="xl:col-span-7 flex flex-col gap-4 min-h-0">
          
          <!-- Live Transcript Card -->
          <div class="glass-card flex-1 flex flex-col p-4 min-h-[180px] overflow-hidden">
            <div class="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
              <h3 class="panel-header uppercase">
                <span class="pulse-indicator bg-[#00ff66]" class:recording={engineState.isRecording}></span> 
                Live Transcript
              </h3>
              
              <button
                onclick={copyTranscript}
                disabled={!liveTranscript.final}
                class="flex items-center gap-1.5 text-[10px] text-white/50 hover:text-[#00ff66] font-mono bg-white/5 border border-white/10 hover:border-[#00ff66]/35 rounded px-2.5 py-1 transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
              >
                {#if isCopied}
                  <Check class="w-3 h-3 text-[#00ff66]" /> COPIED
                {:else}
                  <Copy class="w-3 h-3" /> COPY
                {/if}
              </button>
            </div>

            <!-- Scrolling Transcript Content -->
            <div
              bind:this={transcriptContainer}
              class="flex-grow overflow-y-auto bg-black/40 border border-white/5 rounded p-3 font-mono text-sm leading-relaxed text-white/85 max-h-[220px] xl:max-h-none"
            >
              {#if engineState.isRecording}
                <span class="text-white">{liveTranscript.final}</span>
                <span class="text-[#00ff66]/80 italic">{liveTranscript.interim}</span>
                {#if !liveTranscript.final && !liveTranscript.interim}
                  <span class="text-white/20 animate-pulse block text-center py-8">Awaiting transcription capture...</span>
                {/if}
              {:else}
                <span class="text-white">{liveTranscript.final || "Press Record to capture speech-to-text transcript."}</span>
              {/if}
            </div>
          </div>

          <!-- Audio Stream Control & Visualizer Card -->
          <div class="glass-card p-4 flex flex-col justify-between gap-4">
            
            <!-- Controls / Waveform layout -->
            <div class="flex flex-col gap-3">
              
              <!-- Live Waveform & Timeline Player -->
              {#if engineState.isRecording || decodedPeaks.length > 0}
                {@const totalTime = engineState.isRecording ? Math.max(10, livePeaksDuration) : duration}
                {@const peaksToRender = engineState.isRecording ? livePeaks : decodedPeaks}
                <div class="flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <span class="input-label text-[10px] {engineState.isRecording ? 'text-[#ff3344]' : ''}">
                      {#if engineState.isRecording}
                        LIVE SURVEILLANCE AUDIO MONITOR
                      {:else}
                        PLAYBACK TIMELINE & AUDIO WAVEFORM
                      {/if}
                    </span>
                    <span class="text-[10px] font-mono tracking-wider {engineState.isRecording ? 'text-[#ff3344]' : 'text-white/50'}">
                      {#if engineState.isRecording}
                        RECORDING: {formatTime(livePeaksDuration)}
                      {:else}
                        {formatTime(currentTime)} / {formatTime(duration)}
                      {/if}
                    </span>
                  </div>
                  
                  <!-- Waveform grid -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div
                    class="flex items-center justify-between w-full h-16 gap-[2px] bg-black/45 border rounded px-2 relative select-none {engineState.isRecording ? 'border-[#ff3344]/30' : 'border-white/10 hover:border-white/20 cursor-ew-resize'}"
                    onpointerdown={!engineState.isRecording ? handleWaveformPointerDown : null}
                  >
                    {#each peaksToRender as peak, idx}
                      {@const isActive = engineState.isRecording 
                        ? (idx < livePeaksCount) 
                        : ((idx / decodedPeaks.length) <= playbackProgress)}
                      <div
                        class="flex-1 rounded-sm transition-colors duration-100 {isActive ? 'bg-[#00ff66]' : 'bg-white/20'}"
                        style="height: {Math.max(4, peak * 80)}%;"
                      ></div>
                    {/each}
                  </div>

                  <!-- Waveform Timestamps -->
                  <div class="flex justify-between text-[9px] font-mono text-white/40 mt-1 px-1 select-none border-t border-white/5 pt-1.5">
                    <span>0:00</span>
                    <span>{formatTime(totalTime * 0.25)}</span>
                    <span>{formatTime(totalTime * 0.5)}</span>
                    <span>{formatTime(totalTime * 0.75)}</span>
                    <span>{formatTime(totalTime)}</span>
                  </div>
                </div>
              {/if}
            </div>

            <!-- Lower action bar -->
            <div class="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-3">
              
              <!-- Status info -->
              <div class="flex items-center gap-2">
                {#if engineState.isRecording}
                  <span class="flex items-center gap-1 text-xs text-red-500 font-mono font-bold tracking-widest uppercase">
                    <span class="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping mr-1"></span> RECORDING
                  </span>
                {:else if engineState.isDecoding}
                  <span class="text-xs text-[#00ff66] font-mono font-bold animate-pulse tracking-wide uppercase">
                    DECODING AUDIO BUFFER...
                  </span>
                {:else if decodedPeaks.length > 0}
                  <span class="text-xs text-white/50 font-mono tracking-wider uppercase">
                    RECORDING SAVED
                  </span>
                {:else}
                  <span class="text-xs text-white/30 font-mono tracking-wider uppercase">
                    SYSTEM IDLE
                  </span>
                {/if}
              </div>

              <!-- Main Interactive buttons -->
              <div class="flex items-center gap-2">
                <!-- Record / Stop Button -->
                {#if engineState.isRecording}
                  <button
                    onclick={stopRecording}
                    class="px-5 py-2.5 bg-[#ff3344] text-white font-mono text-xs font-bold uppercase rounded hover:bg-red-600 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,51,68,0.2)] cursor-pointer"
                  >
                    STOP
                  </button>
                {:else}
                  <button
                    onclick={startRecording}
                    disabled={engineState.isDecoding || engineState.isPlaying}
                    class="px-5 py-2.5 bg-[#00ff66] text-black font-mono text-xs font-bold uppercase rounded hover:bg-[#00d75f] active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,102,0.25)] cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    RECORD
                  </button>
                {/if}

                <!-- Playback toggle -->
                {#if decodedPeaks.length > 0}
                  {#if engineState.isPlaying}
                    <button
                      onclick={() => engine.pause()}
                      class="p-2.5 bg-white/10 hover:bg-white/15 text-white rounded active:scale-95 transition-all cursor-pointer"
                      title="Pause"
                    >
                      <Pause class="w-4 h-4" />
                    </button>
                  {:else}
                    <button
                      onclick={() => engine.play()}
                      disabled={engineState.isDecoding}
                      class="p-2.5 bg-[#00ff66] hover:bg-[#00d75f] text-black rounded active:scale-95 transition-all cursor-pointer"
                      title="Play"
                    >
                      <Play class="w-4 h-4" />
                    </button>
                  {/if}

                  <!-- Save Recording -->
                  <button
                    onclick={() => engine.download()}
                    class="p-2.5 bg-white/10 hover:bg-white/15 text-white rounded active:scale-95 transition-all cursor-pointer"
                    title="Download recorded file"
                  >
                    <Download class="w-4 h-4" />
                  </button>

                  <!-- Reset -->
                  <button
                    onclick={reset}
                    class="p-2.5 border border-white/10 hover:bg-white/5 text-white/50 hover:text-white rounded active:scale-95 transition-all cursor-pointer"
                    title="Reset wiretap"
                  >
                    <RefreshCw class="w-4 h-4" />
                  </button>
                {/if}
              </div>
            </div>

          </div>
        </div>

      </div>
    {/if}
  </div>
</BaseApp>

<style lang="scss">
  @use "../../styles/variables" as *;

  .wiretap-layout {
    color: var(--color-text, #ffffff);
    background: rgba(0, 0, 0, 0.15);
    font-family: $font-primary;
    height: 100%;
  }

  .glass-card {
    background: $bg-card-dark;
    border: 1px solid $border-light;
    border-radius: 12px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: border-color $transition-speed-normal ease, box-shadow $transition-speed-normal ease;

    &:hover {
      border-color: rgba(0, 255, 102, 0.15);
      box-shadow: 0 8px 32px 0 rgba(0, 255, 102, 0.05);
    }
  }

  .panel-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    font-family: "Outfit", sans-serif;
    color: rgba(255, 255, 255, 0.9);
  }

  .pulse-indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ef4444;

    &.recording {
      animation: indicatorPulse 1.2s infinite alternate;
    }
  }

  @keyframes indicatorPulse {
    from {
      transform: scale(0.9);
      opacity: 0.4;
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    to {
      transform: scale(1.2);
      opacity: 1;
      box-shadow: 0 0 10px 3px rgba(239, 68, 68, 0.7);
    }
  }

  .input-label {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.45);
    font-family: "Outfit", sans-serif;
  }

  .scanlines {
    background: linear-gradient(
      rgba(18, 16, 16, 0) 50%,
      rgba(0, 0, 0, 0.25) 50%
    );
    background-size: 100% 4px;
  }

  /* ── VIEWPORT SPECIFIC MATRIX SCYLING ── */

  /* 1. MOBILE PORTRAIT (Default style handles grid stacking dynamically) */
  .dashboard-grid {
    flex-grow: 1;
    overflow-y: auto;
  }

  /* 2. MOBILE LANDSCAPE */
  @media (max-width: 768px) and (orientation: landscape) {
    .dashboard-grid {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 8px !important;
      padding: 4px !important;
    }
  }

  /* 3. TABLET (Landscape/Portrait) */
  @media (min-width: 768px) and (max-width: 1200px) {
    .dashboard-grid {
      display: grid !important;
      grid-template-columns: repeat(12, minmax(0, 1fr)) !important;
      gap: 12px !important;
    }
    
    .xl\:col-span-5 {
      grid-column: span 5 / span 5 !important;
    }

    .xl\:col-span-7 {
      grid-column: span 7 / span 7 !important;
    }
  }

  /* 5. TV / ULTRA-WIDE DISPLAYS (Scaling scaling and dashboard layouts) */
  @media (min-width: 2000px) {
    .wiretap-layout {
      max-width: 1400px;
      margin: 0 auto;
    }
    .panel-header {
      font-size: 0.95rem;
    }
    .input-label {
      font-size: 0.8rem;
    }
    .glass-card {
      padding: 24px !important;
    }
  }
</style>
