<script>
  import { onMount, onDestroy } from "svelte";
  import { 
    Mic, Square, Play, Pause, Flame, Search, Swords, UploadCloud, Volume2, Trash2, Check, AlertCircle 
  } from "lucide-svelte";
  import mockFreestyles from "./mockFreestyles.json";

  // Svelte 5 props
  let { audioCore } = $props();

  // App state
  let searchQuery = $state("");
  let rapTag = $state("");
  let isRecording = $state(false);
  let recordingDuration = $state(0);
  let recordedBlob = $state(null);
  let recordedUrl = $state(null);
  let isPlayingPreview = $state(false);
  let syncBeatWithPreview = $state(true);
  let permissionError = $state(false);

  // Community feed state
  let localFreestyles = $state([]);
  let votedIds = $state([]);
  let searchInputRef = $state(null);

  // Audio recording nodes
  let mediaRecorder = null;
  let audioStream = null;
  let micAudioCtx = null;
  let micAnalyser = null;
  let micSource = null;
  let recordTimer = null;
  
  // Waveform canvas
  let canvasEl = $state(null);
  let animationFrameId = null;

  // Selected beat tracking
  let selectedTrackIndex = $state(0);
  let useInstrumental = $state(true);

  // Load from local storage on mount
  onMount(() => {
    selectedTrackIndex = audioCore.currentTrackIndex;
    const stored = localStorage.getItem("wearedogs_local_freestyles");
    if (stored) {
      try {
        localFreestyles = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }

    const storedVotes = localStorage.getItem("wearedogs_freestyle_votes");
    if (storedVotes) {
      try {
        votedIds = JSON.parse(storedVotes);
      } catch (e) {
        console.error(e);
      }
    }
  });

  onDestroy(() => {
    cleanupRecording();
  });

  // Derived community list: merges static mock and local storage list
  let allFreestyles = $derived.by(() => {
    const list = [...localFreestyles, ...mockFreestyles];
    // Dynamic search filtering
    if (!searchQuery.trim()) return list;
    const query = searchQuery.toLowerCase();
    return list.filter(f => 
      f.rapTag.toLowerCase().includes(query) || 
      f.trackTitle.toLowerCase().includes(query)
    );
  });

  // Currently selected track in the music player
  let currentTrack = $derived(audioCore.library[selectedTrackIndex] || audioCore.library[0]);

  // Audio visualizer loop for microphone input
  function startVisualizer() {
    if (!canvasEl || !micAnalyser) return;
    const ctx = canvasEl.getContext("2d");
    const bufferLength = micAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isRecording) return;
      animationFrameId = requestAnimationFrame(draw);
      micAnalyser.getByteFrequencyData(dataArray);

      const width = canvasEl.width;
      const height = canvasEl.height;
      ctx.clearRect(0, 0, width, height);

      // Draw custom cyberpunk mic visualization bars
      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 1.5;
        
        // Gradient color: magenta to cyan
        const percent = i / bufferLength;
        const r = Math.floor(255 - percent * 150);
        const g = Math.floor(percent * 200);
        const b = 255;
        
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
        
        x += barWidth;
      }
    };
    draw();
  }

  // Request mic permission and setup recorder
  async function startRecording() {
    permissionError = false;
    try {
      audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Initialize Web Audio for live visualization
      micAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      micAnalyser = micAudioCtx.createAnalyser();
      micAnalyser.fftSize = 64;
      micSource = micAudioCtx.createMediaStreamSource(audioStream);
      micSource.connect(micAnalyser);

      // Initialize media recorder
      mediaRecorder = new MediaRecorder(audioStream);
      const chunks = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        recordedBlob = new Blob(chunks, { type: "audio/webm" });
        recordedUrl = URL.createObjectURL(recordedBlob);
      };

      // Reset states
      recordedBlob = null;
      recordedUrl = null;
      recordingDuration = 0;
      isRecording = true;

      // Start recording & sync with beat player
      mediaRecorder.start();
      
      // Setup instrumental toggle in audioCore if supported
      if (currentTrack.hasInstrumental) {
        audioCore.isInstrumental = useInstrumental;
      }
      
      // Force beat to play from beginning
      audioCore.loadTrack(selectedTrackIndex, true);
      
      // Start duration counter
      recordTimer = setInterval(() => {
        recordingDuration++;
        if (recordingDuration >= 60) {
          stopRecording();
        }
      }, 1000);

      // Start visualizer canvas loop
      setTimeout(startVisualizer, 100);

    } catch (e) {
      console.error("Mic access failed:", e);
      permissionError = true;
    }
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
    }
    if (micAudioCtx) {
      micAudioCtx.close();
    }
    if (recordTimer) {
      clearInterval(recordTimer);
    }
    
    isRecording = false;
    audioCore.pause();
    
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  }

  function cleanupRecording() {
    stopRecording();
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
  }

  // Local audio element for preview
  let previewAudio = null;

  function togglePreview() {
    if (!recordedUrl) return;

    if (isPlayingPreview) {
      previewAudio.pause();
      isPlayingPreview = false;
      audioCore.pause();
    } else {
      if (!previewAudio) {
        previewAudio = new Audio(recordedUrl);
        previewAudio.addEventListener("ended", () => {
          isPlayingPreview = false;
          audioCore.pause();
        });
      }
      isPlayingPreview = true;
      previewAudio.currentTime = 0;
      previewAudio.play();

      if (syncBeatWithPreview) {
        if (currentTrack.hasInstrumental) {
          audioCore.isInstrumental = useInstrumental;
        }
        audioCore.play(0);
      }
    }
  }

  // Save freestyle locally
  function submitFreestyle() {
    if (!recordedBlob) return;
    
    const tag = rapTag.trim() || "ANONYMOUS_DOG";
    
    // We convert audio blob to Base64 to store in localStorage for local demo persistence
    const reader = new FileReader();
    reader.readAsDataURL(recordedBlob);
    reader.onloadend = () => {
      const base64Audio = reader.result;
      const newFreestyle = {
        id: "fs_local_" + Date.now(),
        rapTag: tag,
        trackId: currentTrack.id,
        trackTitle: currentTrack.title,
        duration: recordingDuration || 30,
        votes: 0,
        dateAdded: new Date().toISOString(),
        src: base64Audio // Embedded local audio
      };

      localFreestyles = [newFreestyle, ...localFreestyles];
      localStorage.setItem("wearedogs_local_freestyles", JSON.stringify(localFreestyles));

      // Reset recording workflow states
      recordedBlob = null;
      recordedUrl = null;
      rapTag = "";
      recordingDuration = 0;
    };
  }

  function deleteLocalFreestyle(id) {
    localFreestyles = localFreestyles.filter(f => f.id !== id);
    localStorage.setItem("wearedogs_local_freestyles", JSON.stringify(localFreestyles));
  }

  // Double-vote prevention logic
  function upvoteFreestyle(id) {
    if (votedIds.includes(id)) return;
    
    votedIds = [...votedIds, id];
    localStorage.setItem("wearedogs_freestyle_votes", JSON.stringify(votedIds));

    // Update vote locally
    const idx = localFreestyles.findIndex(f => f.id === id);
    if (idx !== -1) {
      localFreestyles[idx].votes += 1;
      localStorage.setItem("wearedogs_local_freestyles", JSON.stringify(localFreestyles));
    } else {
      // It's a mock freestyle. We mock the vote counter inside the mock list.
      const mockIdx = mockFreestyles.findIndex(f => f.id === id);
      if (mockIdx !== -1) {
        mockFreestyles[mockIdx].votes += 1;
      }
    }
  }

  // Active playing item in the feed
  let activeFeedId = $state(null);
  let feedAudio = null;

  function playFeedFreestyle(freestyle) {
    if (activeFeedId === freestyle.id) {
      if (feedAudio) {
        feedAudio.pause();
      }
      activeFeedId = null;
    } else {
      if (feedAudio) {
        feedAudio.pause();
      }
      activeFeedId = freestyle.id;
      feedAudio = new Audio(freestyle.src);
      feedAudio.play();
      feedAudio.addEventListener("ended", () => {
        activeFeedId = null;
      });
    }
  }

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }
</script>

<div class="battle-container">
  <!-- Interactive Arena Grid -->
  <div class="battle-grid">
    
    <!-- Left Column: Recording & Preview -->
    <div class="battle-card record-zone">
      <div class="card-header">
        <Swords class="icon-swords text-magenta animate-pulse" size={20} />
        <h2>FREESTYLE STUDIO</h2>
      </div>
      
      <!-- Beat Selector Section -->
      <div class="selector-section">
        <label for="beat-select" class="field-label">CHOOSE A CYPHER BEAT</label>
        <div class="select-wrapper">
          <select 
            id="beat-select"
            class="beat-dropdown"
            bind:value={selectedTrackIndex}
            disabled={isRecording}
          >
            {#each audioCore.library as track, idx}
              <option value={idx}>{track.title} ({track.artist})</option>
            {/each}
          </select>
        </div>

        {#if currentTrack.hasInstrumental}
          <div class="instrumental-toggle">
            <span class="toggle-label">USE INSTRUMENTAL TRACK</span>
            <button 
              class="glow-switch" 
              class:active={useInstrumental}
              onclick={() => useInstrumental = !useInstrumental}
              disabled={isRecording}
              aria-label="Toggle instrumental track"
            >
              <span class="switch-nob"></span>
            </button>
          </div>
        {:else}
          <p class="warning-alert">
            <AlertCircle size={12} /> Beat only supports vocal master playback.
          </p>
        {/if}
      </div>

      <!-- Live Mic Visualization Area -->
      <div class="mic-visualization-board" class:active-rec={isRecording}>
        {#if permissionError}
          <div class="error-slate">
            <AlertCircle size={32} class="text-rose-500 mb-2" />
            <p>Microphone Permission Denied</p>
            <small>Enable mic access in settings to lay down bars.</small>
          </div>
        {:else if isRecording}
          <canvas bind:this={canvasEl} width="280" height="90" class="visualizer-canvas"></canvas>
          <div class="live-rec-badge">
            <span class="pulsing-red-circle"></span>
            <span>RECORDING: {formatTime(recordingDuration)} / 1:00</span>
          </div>
        {:else if recordedUrl}
          <div class="success-slate">
            <Check size={36} class="text-green-400 mb-2" />
            <p>Freestyle Cut Finished!</p>
            <small>{formatTime(recordingDuration)} of audio stored in memory buffer.</small>
          </div>
        {:else}
          <div class="empty-slate">
            <Mic size={36} class="text-neutral-500 mb-2 animate-bounce" />
            <p>STUDIO BOOTH IDLE</p>
            <small>Select beat & click Record to start your flow.</small>
          </div>
        {/if}
      </div>

      <!-- Action Control Room -->
      <div class="action-dock">
        {#if !isRecording && !recordedUrl}
          <button class="battle-btn record-trigger-btn" onclick={startRecording}>
            <Mic size={16} /> Tap to Record
          </button>
        {:else if isRecording}
          <button class="battle-btn stop-trigger-btn" onclick={stopRecording}>
            <Square size={16} /> End Recording
          </button>
        {:else}
          <!-- Re-record & Preview panel -->
          <div class="post-rec-actions">
            <button class="battle-btn preview-btn" class:playing={isPlayingPreview} onclick={togglePreview}>
              {#if isPlayingPreview}
                <Pause size={16} /> Pause Preview
              {:else}
                <Play size={16} /> Preview Mix
              {/if}
            </button>
            <button class="battle-btn discard-btn" onclick={() => { recordedUrl = null; recordedBlob = null; }}>
              Redo Wrap
            </button>
          </div>

          <div class="sync-preference">
            <input id="sync-beat" type="checkbox" bind:checked={syncBeatWithPreview} />
            <label for="sync-beat">Blend cypher beat into preview playback</label>
          </div>
        {/if}
      </div>

      <!-- Upload Station Form -->
      {#if recordedBlob && !isRecording}
        <div class="upload-station">
          <label for="rap-tag" class="field-label">RAP TAG NAME (ANONYMOUS)</label>
          <div class="input-glow-group">
            <input 
              id="rap-tag"
              type="text" 
              placeholder="e.g. BARK_LORD_99" 
              bind:value={rapTag} 
              maxlength="20"
              class="form-input-text"
            />
            <button class="upload-submit-btn" onclick={submitFreestyle}>
              <UploadCloud size={16} /> Upload Cypher
            </button>
          </div>
        </div>
      {/if}
    </div>

    <!-- Right Column: Battle Feed -->
    <div class="battle-card feed-zone">
      <div class="card-header">
        <Flame class="icon-flame text-cyan animate-pulse" size={20} />
        <h2>COMMUNITY CYPHER FEED</h2>
      </div>

      <!-- Feed filter block -->
      <div class="search-block">
        <div class="search-input-wrapper">
          <Search class="search-icon" size={14} />
          <input 
            type="text" 
            placeholder="Search by rap tag or beat title..." 
            bind:value={searchQuery}
            bind:this={searchInputRef}
            class="search-bar"
          />
          {#if searchQuery}
            <button class="clear-search" onclick={() => searchQuery = ""}>✕</button>
          {/if}
        </div>
      </div>

      <!-- Freestyle Card Feed Container -->
      <div class="feed-scroller">
        {#if allFreestyles.length === 0}
          <div class="no-battles">
            <AlertCircle size={28} />
            <span>No cyphers found matching search bounds.</span>
          </div>
        {:else}
          {#each allFreestyles as freestyle (freestyle.id)}
            <div class="freestyle-item" class:is-playing={activeFeedId === freestyle.id}>
              <!-- Play details -->
              <div class="fs-card-left">
                <button 
                  class="fs-play-btn" 
                  onclick={() => playFeedFreestyle(freestyle)}
                  aria-label={activeFeedId === freestyle.id ? "Pause" : "Play"}
                >
                  {#if activeFeedId === freestyle.id}
                    <Pause size={14} />
                  {:else}
                    <Play size={14} />
                  {/if}
                </button>
                <div class="fs-card-meta">
                  <span class="fs-rap-tag">🎤 @{freestyle.rapTag}</span>
                  <span class="fs-track-origin">Beat: {freestyle.trackTitle} ({formatTime(freestyle.duration)})</span>
                </div>
              </div>

              <!-- Interactive controls -->
              <div class="fs-card-right">
                <button 
                  class="fs-vote-btn" 
                  class:voted={votedIds.includes(freestyle.id)}
                  onclick={() => upvoteFreestyle(freestyle.id)}
                  disabled={votedIds.includes(freestyle.id)}
                >
                  <Flame size={14} />
                  <span>{freestyle.votes}</span>
                </button>

                {#if freestyle.id.startsWith("fs_local_")}
                  <button 
                    class="fs-delete-btn" 
                    onclick={() => deleteLocalFreestyle(freestyle.id)}
                    aria-label="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                {/if}
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
    
  </div>
</div>

<style lang="scss">
  .battle-container {
    width: 100%;
    height: 100%;
    color: #e2e8f0;
    overflow-y: auto;
  }

  .battle-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;

    @media (min-width: 1280px) {
      grid-template-columns: 1fr 1fr;
      height: 100%;
      align-items: stretch;
    }
  }

  .battle-card {
    background: rgba(13, 13, 23, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
    transition: border 0.3s;

    &:hover {
      border: 1px solid rgba(0, 240, 255, 0.15);
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    padding-bottom: 8px;

    h2 {
      font-size: 0.95rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin: 0;
    }
  }


  /* ── Selector Section ── */
  .selector-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }

  .field-label {
    font-size: 0.65rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.05em;
  }

  .select-wrapper {
    position: relative;
    width: 100%;
  }

  .beat-dropdown {
    width: 100%;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 0.8rem;
    cursor: pointer;
    outline: none;
    appearance: none;
    
    &:focus {
      border-color: #00f0ff;
      box-shadow: 0 0 8px rgba(0, 240, 255, 0.2);
    }
  }

  .instrumental-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.01);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 6px;
    padding: 8px 12px;
  }

  .toggle-label {
    font-size: 0.72rem;
    font-weight: 550;
    color: rgba(255, 255, 255, 0.7);
  }

  .glow-switch {
    width: 38px;
    height: 20px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    position: relative;
    border: none;
    cursor: pointer;
    transition: background 0.2s;

    &.active {
      background: #ff007f;
      box-shadow: 0 0 8px rgba(255, 0, 127, 0.4);

      .switch-nob {
        left: 20px;
      }
    }
  }

  .switch-nob {
    width: 14px;
    height: 14px;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 3px;
    left: 4px;
    transition: left 0.2s;
  }

  .warning-alert {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.65rem;
    color: #eab308;
    background: rgba(234, 179, 8, 0.08);
    border: 1px solid rgba(234, 179, 8, 0.15);
    padding: 6px 10px;
    border-radius: 4px;
  }

  /* ── Recording visualization Board ── */
  .mic-visualization-board {
    height: 110px;
    background: rgba(0, 0, 0, 0.2);
    border: 1px dashed rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    margin-bottom: 16px;
    transition: border-color 0.3s;

    &.active-rec {
      border: 1px solid #ff007f;
      box-shadow: inset 0 0 10px rgba(255, 0, 127, 0.1);
    }
  }

  .visualizer-canvas {
    width: 100%;
    height: 100%;
    display: block;
  }

  .live-rec-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(255, 0, 127, 0.15);
    border: 1px solid rgba(255, 0, 127, 0.3);
    color: #ff007f;
    font-size: 0.62rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
    letter-spacing: 0.05em;
  }

  .pulsing-red-circle {
    width: 6px;
    height: 6px;
    background: #ff007f;
    border-radius: 50%;
    box-shadow: 0 0 6px #ff007f;
    animation: pulseCircle 1s infinite alternate;
  }

  @keyframes pulseCircle {
    0% { opacity: 0.3; }
    100% { opacity: 1; }
  }

  .empty-slate, .error-slate, .success-slate {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    p {
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      margin: 2px 0;
    }

    small {
      font-size: 0.6rem;
      color: rgba(255, 255, 255, 0.4);
    }
  }

  /* ── Action Control Dock ── */
  .action-dock {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }

  .battle-btn {
    width: 100%;
    padding: 10px;
    border-radius: 6px;
    font-weight: 700;
    font-size: 0.78rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    border: none;
    transition: transform 0.15s, box-shadow 0.2s;
  }

  .record-trigger-btn {
    background: linear-gradient(135deg, #ff007f, #b30059);
    color: white;
    box-shadow: 0 4px 12px rgba(255, 0, 127, 0.25);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 18px rgba(255, 0, 127, 0.4);
    }
  }

  .stop-trigger-btn {
    background: #e11d48;
    color: white;
    box-shadow: 0 4px 12px rgba(225, 29, 72, 0.25);
    animation: flashBorder 1.5s infinite alternate;

    &:hover {
      transform: translateY(-1px);
    }
  }

  @keyframes flashBorder {
    0% { box-shadow: 0 0 4px #e11d48; }
    100% { box-shadow: 0 0 14px #e11d48; }
  }

  .post-rec-actions {
    display: grid;
    grid-template-columns: 1fr 100px;
    gap: 10px;
  }

  .preview-btn {
    background: linear-gradient(135deg, #00f0ff, #008fa3);
    color: #0b1329;
    box-shadow: 0 4px 12px rgba(0, 240, 255, 0.2);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 18px rgba(0, 240, 255, 0.35);
    }
    
    &.playing {
      background: #eab308;
      color: #09090b;
      box-shadow: 0 4px 12px rgba(234, 179, 8, 0.2);
    }
  }

  .discard-btn {
    background: rgba(255, 255, 255, 0.05);
    color: #cbd5e1;
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      color: white;
    }
  }

  .sync-preference {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.68rem;
    color: rgba(255, 255, 255, 0.5);

    input {
      accent-color: #00f0ff;
      cursor: pointer;
    }
  }

  /* ── Upload Station ── */
  .upload-station {
    background: rgba(255, 0, 127, 0.02);
    border: 1px solid rgba(255, 0, 127, 0.08);
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .input-glow-group {
    display: grid;
    grid-template-columns: 1fr 120px;
    gap: 8px;
  }

  .form-input-text {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    padding: 8px 10px;
    font-size: 0.78rem;
    color: white;
    outline: none;
    width: 100%;

    &:focus {
      border-color: #ff007f;
    }
  }

  .upload-submit-btn {
    background: #ff007f;
    color: white;
    font-weight: 700;
    font-size: 0.72rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: background 0.2s;

    &:hover {
      background: #e60073;
    }
  }

  /* ── Right Column: Feed Zone ── */
  .search-block {
    margin-bottom: 12px;
  }

  .search-input-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
  }


  .search-bar {
    width: 100%;
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 6px;
    padding: 8px 30px 8px 30px;
    color: white;
    font-size: 0.75rem;
    outline: none;

    &:focus {
      border-color: #00f0ff;
    }
  }

  .clear-search {
    position: absolute;
    right: 10px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    font-size: 0.75rem;

    &:hover {
      color: white;
    }
  }

  .feed-scroller {
    flex-grow: 1;
    overflow-y: auto;
    max-height: 380px;
    padding-right: 4px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    /* Scrollbar customization */
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 2px;
    }
  }

  .no-battles {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.3);
    padding: 40px 0;
    gap: 8px;
    font-size: 0.75rem;
  }

  .freestyle-item {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 8px;
    padding: 10px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(0, 240, 255, 0.1);
    }

    &.is-playing {
      background: rgba(0, 240, 255, 0.03);
      border-color: rgba(0, 240, 255, 0.25);
    }
  }

  .fs-card-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .fs-play-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, border-color 0.2s;

    &:hover {
      background: #00f0ff;
      border-color: #00f0ff;
      color: #0b1329;
    }
  }

  .fs-card-meta {
    display: flex;
    flex-direction: column;
  }

  .fs-rap-tag {
    font-size: 0.75rem;
    font-weight: 700;
    color: #e2e8f0;
  }

  .fs-track-origin {
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.4);
  }

  .fs-card-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .fs-vote-btn {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    padding: 4px 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    font-size: 0.65rem;
    font-weight: 600;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      border-color: #ff007f;
      color: #ff007f;
      background: rgba(255, 0, 127, 0.05);
    }

    &.voted {
      border-color: #ff007f;
      color: #ff007f;
      background: rgba(255, 0, 127, 0.1);
      cursor: default;
    }
  }

  .fs-delete-btn {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: #ef4444;
    }
  }
</style>
