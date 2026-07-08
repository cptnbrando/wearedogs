<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<script>
  import { onDestroy, onMount } from "svelte";
  import { 
    Upload, Play, Pause, Download, Volume2, 
    Settings2, Scissors, Waves, HelpCircle, 
    RefreshCw, Check, ArrowLeft 
  } from "lucide-svelte";
  import { SoundStripperEngine } from "./SoundStripperEngine.js";
  import BaseApp from "./BaseApp.svelte";

  // State Variables
  let mixFile = $state(null);
  let instFile = $state(null);
  let mixFileName = $state("");
  let instFileName = $state("");
  let isDecodingMix = $state(false);
  let isDecodingInst = $state(false);

  let mixBuffer = $state(null);
  let instBuffer = $state(null);
  let processedBuffer = $state(null);

  let isAligning = $state(false);
  let isProcessing = $state(false);
  let processProgress = $state(0);
  let alignmentMessage = $state("");

  // DSP Tuning States
  let delayMs = $state(0);
  let bleedVolume = $state(1.0);
  let mode = $state("spectral"); // "spectral" or "phase"
  let hpfFrequency = $state(0);  // 0 (Bypass), 80, 120 (Hz)

  // Waveform visualization data
  let mixWaveformData = $state(null);
  let instWaveformData = $state(null);
  let canvasElement = $state(null);

  // Audio Playback States
  let isPlaying = $state(false);
  let currentTime = $state(0);
  let duration = $derived(mixBuffer ? mixBuffer.duration : 0);
  let playbackSource = $state("mix"); // "mix" | "inst" | "processed"
  let showHelp = $state(false);

  // Audio context and nodes
  let audioContext = null;
  let sourceNode = null;
  let gainNode = null;
  let playStartTime = 0;
  let playStartOffset = 0;
  let animFrameId = null;
  let activeEngine = null;

  // Cleanup helper
  onDestroy(() => {
    stopPlayback();
    if (audioContext) {
      audioContext.close();
    }
    if (activeEngine) {
      activeEngine.cancel();
    }
  });

  // Decode file to AudioBuffer
  async function decodeAudioFile(file) {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContextClass();
    }
    const arrayBuffer = await file.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
  }

  // Generate downsampled waveform array for visualization
  function generateWaveformData(buffer, points = 350) {
    const data = buffer.getChannelData(0);
    const step = Math.floor(data.length / points);
    const minMax = [];
    for (let i = 0; i < points; i++) {
      let min = 1.0;
      let max = -1.0;
      const start = i * step;
      for (let j = 0; j < step; j++) {
        const val = data[start + j];
        if (val < min) min = val;
        if (val > max) max = val;
      }
      minMax.push({ min, max });
    }
    return minMax;
  }

  // Handle mix file upload
  async function handleMixUpload(file) {
    if (!file) return;
    stopPlayback();
    mixFile = file;
    mixFileName = file.name;
    isDecodingMix = true;
    processedBuffer = null;
    try {
      mixBuffer = await decodeAudioFile(file);
      mixWaveformData = generateWaveformData(mixBuffer);
      currentTime = 0;
      playStartOffset = 0;
    } catch (e) {
      console.error(e);
      alert("Error decoding recording file. Ensure it is a valid audio file (WAV/MP3).");
      mixFile = null;
      mixFileName = "";
      mixBuffer = null;
      mixWaveformData = null;
    } finally {
      isDecodingMix = false;
    }
  }

  // Handle instrumental file upload
  async function handleInstUpload(file) {
    if (!file) return;
    stopPlayback();
    instFile = file;
    instFileName = file.name;
    isDecodingInst = true;
    processedBuffer = null;
    try {
      instBuffer = await decodeAudioFile(file);
      instWaveformData = generateWaveformData(instBuffer);
    } catch (e) {
      console.error(e);
      alert("Error decoding backing track. Ensure it is a valid audio file (WAV/MP3).");
      instFile = null;
      instFileName = "";
      instBuffer = null;
      instWaveformData = null;
    } finally {
      isDecodingInst = false;
    }
  }

  // Drag and drop events
  function handleDragOver(e) {
    e.preventDefault();
  }

  // Auto align tracks using downsampled cross correlation
  async function runAutoAlign() {
    if (!mixBuffer || !instBuffer) return;
    isAligning = true;
    alignmentMessage = "Aligning tracks via cross-correlation...";
    try {
      const engine = new SoundStripperEngine(mixBuffer, instBuffer);
      const delaySamples = await engine.autoAlign();
      const delaySeconds = delaySamples / mixBuffer.sampleRate;
      delayMs = Math.round(delaySeconds * 1000 * 10) / 10; // Round to 0.1ms
      alignmentMessage = `Successfully aligned! Offset: ${delayMs > 0 ? "+" : ""}${delayMs} ms`;
    } catch (e) {
      console.error(e);
      alignmentMessage = "Error aligning tracks automatically. Adjust offset manually.";
    } finally {
      isAligning = false;
    }
  }

  // Start processing audio in a chunked, non-blocking manner
  async function runProcess() {
    if (!mixBuffer || !instBuffer) return;
    isProcessing = true;
    processProgress = 0;
    processedBuffer = null;
    stopPlayback();

    try {
      activeEngine = new SoundStripperEngine(mixBuffer, instBuffer);
      const delaySamples = (delayMs / 1000) * mixBuffer.sampleRate;
      
      const result = await activeEngine.process(
        delaySamples,
        bleedVolume,
        mode,
        hpfFrequency,
        (progress) => {
          processProgress = progress;
        }
      );

      if (!activeEngine.cancelFlag) {
        processedBuffer = result;
        playbackSource = "processed"; // Autoplay the acapella
        processProgress = 100;
      }
    } catch (e) {
      console.error(e);
      alert("Error processing audio: " + e.message);
    } finally {
      isProcessing = false;
      activeEngine = null;
    }
  }

  // Custom WAV export triggering
  function handleDownload() {
    if (!processedBuffer) return;
    try {
      const wavBlob = SoundStripperEngine.exportWav(processedBuffer);
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement("a");
      a.href = url;
      
      // Filename decoration
      const originalNameWithoutExt = mixFileName.replace(/\.[^/.]+$/, "");
      a.download = `${originalNameWithoutExt}_acapella.wav`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Export failed: " + e.message);
    }
  }

  // Web Audio Playback Management
  function handlePlayPause() {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  }

  function getActiveBuffer() {
    if (playbackSource === "processed") return processedBuffer;
    if (playbackSource === "inst") return instBuffer;
    return mixBuffer;
  }

  function startPlayback() {
    const buffer = getActiveBuffer();
    if (!buffer) return;

    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    stopPlayback();

    sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = buffer;

    gainNode = audioContext.createGain();
    sourceNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Limit starting range in bounds
    if (playStartOffset >= buffer.duration) {
      playStartOffset = 0;
    }

    sourceNode.start(0, playStartOffset);
    playStartTime = audioContext.currentTime;
    isPlaying = true;

    // Loop callback for timeline updates
    const updateTime = () => {
      if (!isPlaying) return;
      const elapsed = audioContext.currentTime - playStartTime;
      currentTime = playStartOffset + elapsed;
      
      if (currentTime >= buffer.duration) {
        isPlaying = false;
        currentTime = 0;
        playStartOffset = 0;
        cancelAnimationFrame(animFrameId);
      } else {
        animFrameId = requestAnimationFrame(updateTime);
      }
    };
    animFrameId = requestAnimationFrame(updateTime);
  }

  function stopPlayback() {
    if (sourceNode) {
      try {
        sourceNode.stop();
      } catch (e) {}
      sourceNode.disconnect();
      sourceNode = null;
    }
    if (gainNode) {
      gainNode.disconnect();
      gainNode = null;
    }
    if (isPlaying) {
      playStartOffset = currentTime;
      isPlaying = false;
    }
    cancelAnimationFrame(animFrameId);
  }

  // Seek timeline position
  function handleSeek(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = clickX / rect.width;
    const targetBuffer = getActiveBuffer();
    if (!targetBuffer) return;
    
    playStartOffset = pct * targetBuffer.duration;
    currentTime = playStartOffset;

    if (isPlaying) {
      startPlayback();
    }
  }

  // Smooth playback source swapping at accurate position
  function handleSourceChange(src) {
    if (playbackSource === src) return;
    const isRunning = isPlaying;
    stopPlayback();
    playbackSource = src;
    if (isRunning) {
      startPlayback();
    }
  }

  // Micro adjustments sliders values
  function adjustDelay(amount) {
    delayMs = Math.max(-2000, Math.min(2000, Math.round((delayMs + amount) * 10) / 10));
    processedBuffer = null;
  }

  // Canvas waveform redrawing loop
  function drawWaveforms() {
    if (!canvasElement || !mixWaveformData) return;
    const ctx = canvasElement.getContext("2d");
    const w = canvasElement.width;
    const h = canvasElement.height;

    // Clear
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#09090f";
    ctx.fillRect(0, 0, w, h);

    const midYMix = h * 0.25;
    const hMix = h * 0.5;
    const midYInst = h * 0.75;
    const hInst = h * 0.5;

    // Center divider
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.5);
    ctx.lineTo(w, h * 0.5);
    ctx.stroke();

    // Render mix track (top canvas half)
    ctx.strokeStyle = "#00d7ff"; // neon cyan
    ctx.lineWidth = 1.5;
    const mixPoints = mixWaveformData;
    ctx.beginPath();
    for (let i = 0; i < mixPoints.length; i++) {
      const x = (i / mixPoints.length) * w;
      const yMin = midYMix + mixPoints[i].min * (hMix * 0.45);
      const yMax = midYMix + mixPoints[i].max * (hMix * 0.45);
      ctx.moveTo(x, yMin);
      ctx.lineTo(x, yMax);
    }
    ctx.stroke();

    // Track label mix
    ctx.fillStyle = "rgba(0, 215, 255, 0.75)";
    ctx.font = "8px monospace";
    ctx.fillText("MIX (VOCAL + BLEED)", 10, 16);

    // Render backing track (bottom canvas half)
    if (instWaveformData) {
      ctx.strokeStyle = "#ff007f"; // neon magenta
      ctx.lineWidth = 1.5;
      const instPoints = instWaveformData;

      // Translate delayMs into pixel offset shifting inst track
      const shiftPx = ((delayMs / 1000) / mixBuffer.duration) * w;

      ctx.beginPath();
      for (let i = 0; i < instPoints.length; i++) {
        const x = (i / instPoints.length) * w + shiftPx;
        if (x >= 0 && x <= w) {
          const yMin = midYInst + instPoints[i].min * (hInst * 0.45);
          const yMax = midYInst + instPoints[i].max * (hInst * 0.45);
          ctx.moveTo(x, yMin);
          ctx.lineTo(x, yMax);
        }
      }
      ctx.stroke();

      // Track label inst
      ctx.fillStyle = "rgba(255, 0, 127, 0.75)";
      ctx.fillText("BACKING TRACK (ALIGNED)", 10, h * 0.5 + 16);
    } else {
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.font = "10px sans-serif";
      ctx.fillText("Awaiting backing track upload...", w * 0.5 - 70, h * 0.75 + 4);
    }

    // Render timeline indicator cursor
    if (duration > 0 && currentTime > 0) {
      const playX = (currentTime / duration) * w;
      ctx.strokeStyle = "#e6b900"; // neon gold
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(playX, 0);
      ctx.lineTo(playX, h);
      ctx.stroke();

      ctx.fillStyle = "#e6b900";
      ctx.beginPath();
      ctx.moveTo(playX - 4, 0);
      ctx.lineTo(playX + 4, 0);
      ctx.lineTo(playX, 5);
      ctx.fill();
    }
  }

  // Keep drawing in sync with state changes
  $effect(() => {
    const _d = delayMs;
    const _t = currentTime;
    const _m = mixWaveformData;
    const _i = instWaveformData;
    drawWaveforms();
  });

  // Time format utility
  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m}:${s.toString().padStart(2, "0")}.${ms}`;
  }
</script>

<BaseApp title="Sound Stripper" description="Acapella extraction and audio bleed cancellation console" themeColor="#ff007f">
  <div class="stripper-console">
    <!-- Viewport 1-5 Responsive Layout Engine Grid -->
    <div class="stripper-grid">
      
      <!-- LEFT SECTION: Uploaders & Param Tuning grouped in a responsive panel -->
      <div class="left-panel">
        
        <!-- Column 1: Uploaders (stacked vertically on desktop/mobile) -->
        <div class="upload-column flex flex-col gap-3">
          <!-- Dropzone Box File 1 -->
          <div class="control-box border-neon-cyan relative">
            <h3 class="box-title text-neon-cyan"><Scissors size={14} class="mr-2 inline" /> 1. Upload Mix</h3>
            <p class="box-desc">Mix file with vocals + backing bleed</p>
            
            <label 
              class="upload-dropzone" 
              class:loading={isDecodingMix}
              ondragover={handleDragOver}
              ondrop={async (e) => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) await handleMixUpload(e.dataTransfer.files[0]);
              }}
            >
              <input type="file" accept="audio/*" class="hidden" onchange={async (e) => {
                if (e.target.files[0]) await handleMixUpload(e.target.files[0]);
              }} />
              {#if isDecodingMix}
                <RefreshCw size={18} class="animate-spin text-neon-cyan mb-1.5" />
                <span class="text-[11px]">Decoding audio...</span>
              {:else if mixBuffer}
                <Check size={18} class="text-neon-cyan mb-1.5" />
                <span class="text-[11px] font-semibold text-white truncate max-w-full px-1.5">{mixFileName}</span>
                <span class="text-[9px] text-white/50">{formatTime(mixBuffer.duration)} | {mixBuffer.sampleRate}Hz</span>
              {:else}
                <Upload size={18} class="text-white/30 mb-1.5" />
                <span class="text-[11px] font-medium text-white/70">Recording Mix</span>
                <span class="text-[9px] text-white/40">MP3 / WAV</span>
              {/if}
            </label>
          </div>

          <!-- Dropzone Box File 2 -->
          <div class="control-box border-neon-pink">
            <h3 class="box-title text-neon-pink"><Waves size={14} class="mr-2 inline" /> 2. Upload Backing</h3>
            <p class="box-desc">Clean reference backing track</p>
            
            <label 
              class="upload-dropzone" 
              class:loading={isDecodingInst}
              ondragover={handleDragOver}
              ondrop={async (e) => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) await handleInstUpload(e.dataTransfer.files[0]);
              }}
            >
              <input type="file" accept="audio/*" class="hidden" onchange={async (e) => {
                if (e.target.files[0]) await handleInstUpload(e.target.files[0]);
              }} />
              {#if isDecodingInst}
                <RefreshCw size={18} class="animate-spin text-neon-pink mb-1.5" />
                <span class="text-[11px]">Decoding audio...</span>
              {:else if instBuffer}
                <Check size={18} class="text-neon-pink mb-1.5" />
                <span class="text-[11px] font-semibold text-white truncate max-w-full px-1.5">{instFileName}</span>
                <span class="text-[9px] text-white/50">{formatTime(instBuffer.duration)} | {instBuffer.sampleRate}Hz</span>
              {:else}
                <Upload size={18} class="text-white/30 mb-1.5" />
                <span class="text-[11px] font-medium text-white/70">Backing Track</span>
                <span class="text-[9px] text-white/40">MP3 / WAV</span>
              {/if}
            </label>
          </div>
        </div>

        <!-- Column 2: Tuning sliders console (Only enabled when files uploaded) -->
        <div class="control-box border-neon-gold">
          <div class="flex justify-between items-center mb-2">
            <h3 class="box-title text-neon-gold"><Settings2 size={14} class="mr-2 inline" /> 3. Bleed Alignment Tuning</h3>
            <button class="help-toggle" onclick={() => showHelp = !showHelp} aria-label="Show DSP explanation">
              <HelpCircle size={15} />
            </button>
          </div>

          {#if showHelp}
            <div class="help-box animated-pane">
              <p><strong>Auto-Align:</strong> Downsamples signals and estimates speaker-to-microphone delay using cross-correlation.</p>
              <p><strong>Bleed Gain:</strong> Adjusts scale multiplier of reference track subtraction to account for room volume differences.</p>
              <p><strong>Spectral Stripping:</strong> Uses STFT/FFT spectral subtraction. Best for microphone recordings with wall reverb.</p>
              <p><strong>Phase Cancellation:</strong> Sample-level subtraction. Requires perfect delay alignment and is best for clean digital stems.</p>
            </div>
          {/if}

          <div class="align-panel">
            <button 
              class="align-btn border-neon-gold" 
              disabled={!mixBuffer || !instBuffer || isAligning}
              onclick={runAutoAlign}
            >
              {#if isAligning}
                <RefreshCw size={14} class="animate-spin mr-2" /> Auto-Aligning...
              {:else}
                Auto-Align Waveforms
              {/if}
            </button>
            {#if alignmentMessage}
              <div class="alignment-status text-neon-gold">{alignmentMessage}</div>
            {/if}
          </div>

          <!-- Alignment Delay Offset Slider -->
          <div class="slider-field mt-3">
            <div class="slider-labels">
              <span>Delay Offset:</span>
              <span class="val font-mono">{delayMs > 0 ? "+" : ""}{delayMs} ms</span>
            </div>
            <div class="flex gap-2 items-center">
              <button class="adj-btn" disabled={!mixBuffer || !instBuffer} onclick={() => adjustDelay(-10)}>-10ms</button>
              <button class="adj-btn" disabled={!mixBuffer || !instBuffer} onclick={() => adjustDelay(-0.1)}>-0.1ms</button>
              <input 
                type="range" 
                min="-2000" 
                max="2000" 
                step="0.1" 
                class="stripper-slider" 
                disabled={!mixBuffer || !instBuffer}
                bind:value={delayMs}
                oninput={() => processedBuffer = null}
              />
              <button class="adj-btn" disabled={!mixBuffer || !instBuffer} onclick={() => adjustDelay(0.1)}>+0.1ms</button>
              <button class="adj-btn" disabled={!mixBuffer || !instBuffer} onclick={() => adjustDelay(10)}>+10ms</button>
            </div>
          </div>

          <!-- Bleed volume multiplier slider -->
          <div class="slider-field mt-3">
            <div class="slider-labels">
              <span>Bleed Volume Multiplier:</span>
              <span class="val font-mono">{bleedVolume.toFixed(2)}x</span>
            </div>
            <input 
              type="range" 
              min="0.0" 
              max="3.0" 
              step="0.02" 
              class="stripper-slider" 
              disabled={!mixBuffer || !instBuffer}
              bind:value={bleedVolume}
              oninput={() => processedBuffer = null}
            />
          </div>

          <!-- DSP Processing Settings (Mode & Cutoffs) -->
          <div class="flex flex-wrap gap-4 items-center justify-between border-t border-white/5 mt-3 pt-3">
            <!-- Mode Switcher -->
            <div class="flex flex-col gap-1">
              <span class="field-title">Stripper Mode</span>
              <div class="toggle-group">
                <button 
                  class="toggle-opt" 
                  class:active={mode === "spectral"}
                  disabled={!mixBuffer || !instBuffer}
                  onclick={() => { mode = "spectral"; processedBuffer = null; }}
                >
                  Spectral
                </button>
                <button 
                  class="toggle-opt" 
                  class:active={mode === "phase"}
                  disabled={!mixBuffer || !instBuffer}
                  onclick={() => { mode = "phase"; processedBuffer = null; }}
                >
                  Phase
                </button>
              </div>
            </div>

            <!-- HPF cutoffs -->
            <div class="flex flex-col gap-1">
              <span class="field-title">Voice High-Pass Clean</span>
              <div class="toggle-group">
                <button 
                  class="toggle-opt" 
                  class:active={hpfFrequency === 0}
                  disabled={!mixBuffer || !instBuffer}
                  onclick={() => { hpfFrequency = 0; processedBuffer = null; }}
                >
                  Bypass
                </button>
                <button 
                  class="toggle-opt" 
                  class:active={hpfFrequency === 80}
                  disabled={!mixBuffer || !instBuffer}
                  onclick={() => { hpfFrequency = 80; processedBuffer = null; }}
                >
                  80Hz
                </button>
                <button 
                  class="toggle-opt" 
                  class:active={hpfFrequency === 120}
                  disabled={!mixBuffer || !instBuffer}
                  onclick={() => { hpfFrequency = 120; processedBuffer = null; }}
                >
                  120Hz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT SECTION: Waveform Alignment Graph, Processing, & Custom Playback Player -->
      <div class="stripper-workspace flex flex-col gap-4">
        
        <!-- Multi-Track visual Waveform Display -->
        <div class="waveform-box flex-grow flex flex-col border border-white/5 bg-[#09090f] rounded-xl overflow-hidden p-2 min-h-[140px]">
          <canvas 
            bind:this={canvasElement} 
            width="600" 
            height="180" 
            class="w-full flex-grow block rounded-lg cursor-pointer"
            onclick={handleSeek}
          ></canvas>
        </div>

        <!-- Render Playback and Extract console -->
        <div class="output-preview-box border-neon-gold bg-black/40 rounded-xl p-3 flex flex-col gap-3">
          
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <!-- Extraction action trigger -->
            <button 
              class="process-btn text-neon-pink border-neon-pink flex-grow sm:flex-grow-0"
              disabled={!mixBuffer || !instBuffer || isProcessing}
              onclick={runProcess}
            >
              {#if isProcessing}
                <RefreshCw size={16} class="animate-spin mr-2 inline" /> Processing ({processProgress}%)
              {:else}
                Strip Bleed Audio
              {/if}
            </button>

            <!-- Export Download WAV -->
            <button 
              class="download-btn border-neon-green" 
              disabled={!processedBuffer || isProcessing}
              onclick={handleDownload}
            >
              <Download size={16} class="mr-2 inline" /> Download Acapella WAV
            </button>
          </div>

          <!-- Progress loading bar (processing state only) -->
          {#if isProcessing}
            <div class="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div class="bg-gradient-to-r from-neon-pink to-neon-gold h-full transition-all duration-150" style="width: {processProgress}%"></div>
            </div>
          {/if}

          <!-- CUSTOM AUDIO PLAYER -->
          <div class="custom-player flex flex-col gap-2.5 border-t border-white/5 pt-3 mt-1" class:disabled={!mixBuffer}>
            <!-- Playback Switcher Source A/B Tabs -->
            <div class="flex flex-wrap items-center gap-2 justify-between">
              <div class="toggle-group max-w-full overflow-x-auto whitespace-nowrap">
                <button 
                  class="toggle-opt" 
                  class:active={playbackSource === "mix"}
                  disabled={!mixBuffer}
                  onclick={() => handleSourceChange("mix")}
                >
                  Original
                </button>
                <button 
                  class="toggle-opt" 
                  class:active={playbackSource === "inst"}
                  disabled={!instBuffer}
                  onclick={() => handleSourceChange("inst")}
                >
                  Backing
                </button>
                <button 
                  class="toggle-opt" 
                  class:active={playbackSource === "processed"}
                  disabled={!processedBuffer}
                >
                  {#if processedBuffer}
                    Acapella <Check size={10} class="inline ml-1 text-neon-green" />
                  {:else}
                    Acapella
                  {/if}
                </button>
              </div>

              <!-- Time Counter -->
              <span class="time-counter font-mono text-xs text-white/50">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <!-- Custom Playback Slider -->
            <div class="player-timeline" onclick={mixBuffer ? handleSeek : null}>
              <div class="timeline-bar bg-white/5 w-full h-2 rounded-full cursor-pointer relative overflow-hidden">
                <div 
                  class="play-progress bg-neon-gold h-full rounded-full" 
                  style="width: {duration > 0 ? (currentTime / duration) * 100 : 0}%"
                ></div>
              </div>
            </div>

            <!-- Player Controls -->
            <div class="flex items-center gap-4 justify-center sm:justify-start">
              <button 
                class="play-btn-circle border border-white/10 text-white hover:bg-white/5 transition-all"
                disabled={!mixBuffer}
                onclick={handlePlayPause}
                aria-label={isPlaying ? "Pause playback" : "Start playback"}
              >
                {#if isPlaying}
                  <Pause size={18} class="fill-white" />
                {:else}
                  <Play size={18} class="fill-white ml-0.5" />
                {/if}
              </button>
              
              <span class="text-xs text-white/30 italic hidden sm:inline">
                {#if isPlaying}
                  Listening to: {playbackSource === "mix" ? "Original Mix" : (playbackSource === "inst" ? "Backing Track" : "Cleaned Acapella")}
                {:else}
                  Playback paused
                {/if}
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  </div>
</BaseApp>

<style lang="scss">
  @use "../../styles/variables" as *;

  .stripper-console {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    font-family: $font-primary;
    color: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  .stripper-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    flex-grow: 1;
    min-height: 0;
    
    // Viewport 3: Tablet multi-column
    @media (min-width: 768px) {
      grid-template-columns: 320px 1fr;
      height: 100%;
    }
    
    // Viewport 4-5: Desktop / TV consoles
    @media (min-width: 1024px) {
      grid-template-columns: 636px 1fr;
      height: 100%;
    }
  }

  .left-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 0;

    @media (min-width: 1024px) {
      display: grid;
      grid-template-columns: 280px 340px;
      gap: 16px;
      height: 100%;
    }
  }

  .upload-column {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .control-box {
    background: $bg-card-dark;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;

    &.border-neon-cyan {
      border-color: rgba(0, 215, 255, 0.2);
      &:hover { border-color: rgba(0, 215, 255, 0.5); }
    }
    &.border-neon-pink {
      border-color: rgba(255, 0, 127, 0.2);
      &:hover { border-color: rgba(255, 0, 127, 0.5); }
    }
    &.border-neon-gold {
      border-color: rgba(230, 185, 0, 0.2);
    }
  }

  .box-title {
    margin: 0 0 4px 0;
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    font-family: "Outfit", sans-serif;
    text-transform: uppercase;
  }

  .box-desc {
    margin: 0 0 12px 0;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
    line-height: 1.3;
  }

  .upload-dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px dashed rgba(255, 255, 255, 0.1);
    background: $bg-input-dark;
    border-radius: 8px;
    padding: 20px 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    box-sizing: border-box;
    width: 100%;

    &:hover {
      border-color: rgba(255, 255, 255, 0.25);
      background: rgba(255, 255, 255, 0.05);
    }

    &.loading {
      border-color: rgba(255, 255, 255, 0.05);
      background: rgba(0, 0, 0, 0.15);
      cursor: not-allowed;
    }
  }

  .align-panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
  }

  .align-btn {
    width: 100%;
    background: rgba(230, 185, 0, 0.05);
    border: 1px solid rgba(230, 185, 0, 0.3);
    color: #e6b900;
    padding: 10px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    &:hover:not(:disabled) {
      background: rgba(230, 185, 0, 0.15);
      box-shadow: 0 0 10px rgba(230, 185, 0, 0.1);
    }

    &:disabled {
      border-color: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.25);
      background: transparent;
      cursor: not-allowed;
    }
  }

  .alignment-status {
    font-size: 0.75rem;
    font-family: monospace;
    text-align: center;
    background: rgba(0, 0, 0, 0.2);
    padding: 6px;
    border-radius: 6px;
    border: 1px solid rgba(230, 185, 0, 0.1);
  }

  .slider-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .slider-labels {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);

    .val {
      color: white;
      font-weight: bold;
    }
  }

  .stripper-slider {
    flex-grow: 1;
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255, 255, 255, 0.08);
    height: 5px;
    border-radius: 10px;
    outline: none;
    cursor: pointer;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #e6b900;
      box-shadow: 0 0 8px rgba(230, 185, 0, 0.4);
      cursor: pointer;
    }
    
    &::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #e6b900;
      border: none;
      box-shadow: 0 0 8px rgba(230, 185, 0, 0.4);
      cursor: pointer;
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  .adj-btn {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.6);
    border-radius: 4px;
    font-size: 0.65rem;
    font-family: monospace;
    padding: 3px 6px;
    cursor: pointer;
    transition: all 0.1s ease;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.08);
      color: white;
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  .field-title {
    font-size: 0.7rem;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.04em;
    font-weight: 700;
  }

  .toggle-group {
    display: flex;
    background: rgba(0, 0, 0, 0.25);
    padding: 2px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .toggle-opt {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.45);
    padding: 5px 10px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s ease;

    &.active {
      background: rgba(255, 255, 255, 0.08);
      color: white;
    }

    &:disabled {
      color: rgba(255, 255, 255, 0.15);
      cursor: not-allowed;
    }
  }

  .help-toggle {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    padding: 2px;
    border-radius: 4px;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: #e6b900;
    }
  }

  .help-box {
    background: rgba(0, 0, 0, 0.25);
    border: 1px dashed rgba(230, 185, 0, 0.25);
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 12px;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.65);
    line-height: 1.4;

    p {
      margin: 0 0 6px 0;
      &:last-child { margin: 0; }
    }
  }

  .process-btn {
    background: rgba(255, 0, 127, 0.05);
    border: 1px solid rgba(255, 0, 127, 0.3);
    color: #ff007f;
    padding: 12px 28px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    &:hover:not(:disabled) {
      background: rgba(255, 0, 127, 0.15);
      box-shadow: 0 0 15px rgba(255, 0, 127, 0.15);
    }

    &:disabled {
      border-color: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.25);
      background: transparent;
      cursor: not-allowed;
    }
  }

  .download-btn {
    background: rgba(0, 215, 95, 0.05);
    border: 1px solid rgba(0, 215, 95, 0.3);
    color: #00d75f;
    padding: 12px 28px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    &:hover:not(:disabled) {
      background: rgba(0, 215, 95, 0.15);
      box-shadow: 0 0 15px rgba(0, 215, 95, 0.15);
    }

    &:disabled {
      border-color: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.25);
      background: transparent;
      cursor: not-allowed;
    }
  }

  .custom-player {
    &.disabled {
      opacity: 0.25;
      pointer-events: none;
    }
  }

  .play-btn-circle {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  .timeline-bar {
    transition: background 0.2s;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  .animated-pane {
    animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
