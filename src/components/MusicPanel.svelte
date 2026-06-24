<script>
  import { onMount, onDestroy } from "svelte";
  import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Shuffle,
    Repeat,
    Repeat1,
    List,
    Mic2,
    Radio,
    Disc3,
    ExternalLink,
    Plus,
    ChevronRight,
    X,
  } from "lucide-svelte";

  let { isClosing = false, onClose } = $props();

  // Tab: 'songs' | 'samples' | 'playlists'
  let activeTab = $state("songs");

  // Music library - path: /music/[artist]/[album]/[file]
  const library = [
    {
      id: "hollywood",
      title: "HOLLYWOOD",
      artist: "YG",
      album: "THE GENTLEMEN'S CLUB",
      cover: "/img/covers/yg.jpg",
      src: "/music/YG/THE GENTLEMEN'S CLUB/HOLLYWOOD.mp3",
      instrumental: "/music/YG/THE GENTLEMEN'S CLUB/HOLLYWOOD-FREE.mp3",
      hasInstrumental: true,
    },
  ];

  let currentTrackIndex = $state(0);
  let isPlaying = $state(false);
  let isInstrumental = $state(false);
  let currentTime = $state(0);
  let duration = $state(0);
  let volume = $state(0.8);
  let isMuted = $state(false);
  let isShuffled = $state(false);
  let repeatMode = $state(0);
  let isLoading = $state(false);
  let vinylLoaded = $state(false);
  let isSeeking = $state(false);
  let seekPreview = $state(0);

  // Two audio elements: full (leader) + instrumental (follower)
  let fullEl = $state(null); // drives timeupdate / ended
  let instEl = $state(null); // kept in sync, muted when inactive

  let currentTrack = $derived(library[currentTrackIndex]);

  // Returns [leader, follower] based on which version is active
  function both() {
    return [fullEl, instEl].filter(Boolean);
  }

  onMount(() => {
    if (fullEl) {
      fullEl.volume = volume;
      fullEl.addEventListener("timeupdate", onTimeUpdate);
      fullEl.addEventListener("loadedmetadata", onMetadata);
      fullEl.addEventListener("ended", onEnded);
      fullEl.addEventListener("waiting", () => (isLoading = true));
      fullEl.addEventListener("canplay", () => (isLoading = false));
      fullEl.addEventListener("error", () => {
        isLoading = false;
        isPlaying = false;
      });
    }
    if (instEl) {
      instEl.volume = 0; // starts silent
    }
  });

  onDestroy(() => {
    both().forEach((el) => {
      el.pause();
      el.src = "";
    });
  });

  function onTimeUpdate() {
    if (!isSeeking && fullEl) currentTime = fullEl.currentTime;
  }
  function onMetadata() {
    if (fullEl) {
      duration = fullEl.duration;
      isLoading = false;
    }
  }
  function onEnded() {
    if (repeatMode === 2) {
      both().forEach((el) => {
        el.currentTime = 0;
        el.play().catch(() => {});
      });
    } else if (repeatMode === 1 || currentTrackIndex < library.length - 1) {
      nextTrack();
    } else {
      isPlaying = false;
    }
  }

  // Apply correct volumes: active = user volume, inactive = 0
  function applyVolumes() {
    if (!fullEl || !instEl) return;
    if (isMuted) {
      fullEl.volume = volume;
      instEl.volume = volume;
    } else if (isInstrumental) {
      fullEl.volume = 0; // silent
      instEl.volume = volume; // audible
    } else {
      fullEl.volume = volume; // audible
      instEl.volume = 0; // silent
    }
  }

  // Instant volume toggle — no reload, no interruption
  function toggleInstrumental() {
    if (!currentTrack.hasInstrumental) return;
    isInstrumental = !isInstrumental;
    applyVolumes();
    // Resync follower time in case of minor drift
    if (fullEl && instEl) instEl.currentTime = fullEl.currentTime;
  }

  function togglePlay() {
    if (!fullEl) return;
    if (isPlaying) {
      both().forEach((el) => el.pause());
      isPlaying = false;
    } else {
      // Sync before playing
      if (instEl) instEl.currentTime = fullEl.currentTime;
      applyVolumes();
      Promise.all(both().map((el) => el.play().catch(() => {}))).then(() => {});
      isPlaying = true;
    }
  }

  function loadTrack(index, autoplay = false) {
    currentTrackIndex = index;
    isInstrumental = false;
    currentTime = 0;
    const track = library[index];
    if (fullEl) {
      fullEl.src = track.src;
      fullEl.load();
    }
    if (instEl) {
      instEl.src = track.instrumental || "";
      instEl.load();
    }
    applyVolumes();
    if (autoplay) {
      isLoading = true;
      const ready = () => {
        if (instEl) instEl.currentTime = fullEl?.currentTime || 0;
        applyVolumes();
        Promise.all(both().map((el) => el.play().catch(() => {}))).then(
          () => {},
        );
        isPlaying = true;
        isLoading = false;
        fullEl?.removeEventListener("canplay", ready);
      };
      fullEl?.addEventListener("canplay", ready);
    }
  }

  function prevTrack() {
    if (currentTime > 3 && fullEl) {
      both().forEach((el) => {
        el.currentTime = 0;
      });
      return;
    }
    const idx = isShuffled
      ? Math.floor(Math.random() * library.length)
      : currentTrackIndex > 0
        ? currentTrackIndex - 1
        : library.length - 1;
    loadTrack(idx, isPlaying);
  }
  function nextTrack() {
    const idx = isShuffled
      ? Math.floor(Math.random() * library.length)
      : currentTrackIndex < library.length - 1
        ? currentTrackIndex + 1
        : 0;
    loadTrack(idx, isPlaying);
  }
  function selectTrack(i) {
    if (currentTrackIndex === i) {
      togglePlay();
      return;
    }
    loadTrack(i, true);
  }

  function cycleRepeat() {
    repeatMode = (repeatMode + 1) % 3;
  }

  function toggleMute() {
    isMuted = !isMuted;
    applyVolumes();
  }
  function setVolume(v) {
    volume = parseFloat(v);
    if (volume > 0) isMuted = false;
    applyVolumes();
  }
  function handleSeekStart(e) {
    isSeeking = true;
    seekPreview = parseFloat(e.target.value);
  }
  function handleSeekMove(e) {
    seekPreview = parseFloat(e.target.value);
  }
  function handleSeekEnd(e) {
    const t = parseFloat(e.target.value);
    both().forEach((el) => {
      el.currentTime = t;
    });
    currentTime = t;
    isSeeking = false;
  }
  function fmtTime(s) {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60)
      .toString()
      .padStart(2, "0")}`;
  }
  let displayTime = $derived(isSeeking ? seekPreview : currentTime);
  let progress = $derived(duration > 0 ? (displayTime / duration) * 100 : 0);
</script>

<!-- Two audio elements: full (leader) + instrumental (follower, always muted unless active) -->
<audio bind:this={fullEl} src={currentTrack.src} preload="none"></audio>
<audio bind:this={instEl} src={currentTrack.instrumental ?? ""} preload="none"
></audio>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="mp-backdrop" onclick={onClose}>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="mp-container"
    class:closing={isClosing}
    onclick={(e) => e.stopPropagation()}
  >
    <header class="mp-header">
      <div class="mp-brand">
        <img src="/favicon.svg" alt="DOGS" loading="lazy" class="mp-logo" />
        <span class="mp-title">MUSIC</span>
      </div>
      <button class="mp-close-btn" onclick={onClose} aria-label="Close"
        ><X size={18} /></button
      >
    </header>

    <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
    <nav class="mp-tabs" role="tablist">
      <button
        class="mp-tab"
        class:active={activeTab === "songs"}
        onclick={() => (activeTab = "songs")}
        role="tab"
      >
        <Disc3 size={15} /><span>Songs</span>
      </button>
      <button
        class="mp-tab"
        class:active={activeTab === "samples"}
        onclick={() => (activeTab = "samples")}
        role="tab"
      >
        <Mic2 size={15} /><span>Samples</span>
      </button>
      <button
        class="mp-tab"
        class:active={activeTab === "playlists"}
        onclick={() => (activeTab = "playlists")}
        role="tab"
      >
        <Radio size={15} /><span>Playlists</span>
      </button>
    </nav>

    <div class="mp-body">
      {#if activeTab === "songs"}
        <div class="songs-layout">
          <div class="player-side">
            <div class="vinyl-wrapper">
              <div class="vinyl-record" class:spinning={isPlaying}>
                <div class="groove g1"></div>
                <div class="groove g2"></div>
                <div class="groove g3"></div>
                <div class="groove g4"></div>
                <div class="record-label">
                  <img
                    src={currentTrack.cover}
                    alt={currentTrack.album}
                    loading="lazy"
                    class="record-art"
                    class:loaded={vinylLoaded}
                    onload={() => (vinylLoaded = true)}
                  />
                </div>
                <div class="spindle"></div>
              </div>
              <div class="tonearm" class:playing={isPlaying}></div>
            </div>

            <div class="track-info">
              <div class="version-badge" class:inst={isInstrumental}>
                {isInstrumental ? "INSTRUMENTAL" : "ORIGINAL"}
              </div>
              <h2 class="track-title">{currentTrack.title}</h2>
              <p class="track-artist">{currentTrack.artist}</p>
              <p class="track-album">{currentTrack.album}</p>
            </div>

            <div class="progress-row">
              <span class="ptime">{fmtTime(displayTime)}</span>
              <div class="progress-wrap">
                <div class="progress-fill" style="width:{progress}%"></div>
                <input
                  type="range"
                  class="seek-input"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={displayTime}
                  oninput={handleSeekMove}
                  onmousedown={handleSeekStart}
                  ontouchstart={handleSeekStart}
                  onchange={handleSeekEnd}
                  aria-label="Seek"
                />
              </div>
              <span class="ptime">{fmtTime(duration)}</span>
            </div>

            <div class="controls-row">
              <button
                class="ctrl ctrl-sm"
                class:active-ctrl={isShuffled}
                onclick={() => (isShuffled = !isShuffled)}
                aria-label="Shuffle"
              >
                <Shuffle size={15} />
              </button>
              <button
                class="ctrl ctrl-md"
                onclick={prevTrack}
                aria-label="Previous"
              >
                <SkipBack size={19} />
              </button>
              <button
                class="ctrl ctrl-play"
                onclick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {#if isLoading}
                  <div class="spin-ring"></div>
                {:else if isPlaying}
                  <Pause size={22} fill="currentColor" />
                {:else}
                  <Play size={22} fill="currentColor" />
                {/if}
              </button>
              <button
                class="ctrl ctrl-md"
                onclick={nextTrack}
                aria-label="Next"
              >
                <SkipForward size={19} />
              </button>
              <button
                class="ctrl ctrl-sm"
                class:active-ctrl={repeatMode > 0}
                onclick={cycleRepeat}
                aria-label="Repeat"
              >
                {#if repeatMode === 2}<Repeat1 size={15} />{:else}<Repeat
                    size={15}
                  />{/if}
              </button>
            </div>

            {#if currentTrack.hasInstrumental}
              <button
                class="inst-toggle"
                class:on={isInstrumental}
                onclick={toggleInstrumental}
              >
                <Mic2 size={13} />
                <span
                  >{isInstrumental ? "← Full Version" : "Instrumental →"}</span
                >
              </button>
            {/if}

            <div class="vol-row">
              <button
                class="ctrl ctrl-xs"
                onclick={toggleMute}
                aria-label="Mute"
              >
                {#if isMuted || volume === 0}<VolumeX
                    size={13}
                  />{:else}<Volume2 size={13} />{/if}
              </button>
              <input
                type="range"
                class="vol-slider"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                oninput={(e) => setVolume(e.target.value)}
                aria-label="Volume"
              />
            </div>
          </div>

          <div class="tracklist-side">
            <div class="tl-header">
              <List size={13} /><span>TRACKS</span>
              <span class="tl-count">{library.length}</span>
            </div>
            <div class="tracklist scroll-y">
              {#each library as track, i}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  class="track-row"
                  class:active={currentTrackIndex === i}
                  onclick={() => selectTrack(i)}
                >
                  <div class="tr-num">
                    {#if currentTrackIndex === i && isPlaying}
                      <div class="eq">
                        <div class="eq-b"></div>
                        <div class="eq-b"></div>
                        <div class="eq-b"></div>
                      </div>
                    {:else}
                      <span>{i + 1}</span>
                    {/if}
                  </div>
                  <img
                    src={track.cover}
                    alt={track.album}
                    loading="lazy"
                    class="tr-art"
                  />
                  <div class="tr-info">
                    <span class="tr-title">{track.title}</span>
                    <span class="tr-meta">{track.artist} · {track.album}</span>
                  </div>
                  {#if currentTrackIndex === i && isInstrumental}
                    <span class="inst-chip">INST</span>
                  {/if}
                  {#if currentTrackIndex === 0}
                    <span class="inst-chip-link"
                      ><a
                        href="https://the-gentlemens-club.com/"
                        target="_blank">YG</a
                      ></span
                    >
                  {/if}
                </div>
              {/each}
              <div class="add-hint">
                <Plus size={12} />
                <span
                  >Add tracks to <code>public/music/[artist]/[album]/</code
                  ></span
                >
              </div>
            </div>
          </div>
        </div>
      {:else if activeTab === "samples"}
        <div class="tab-scroll scroll-y">
          <div class="sec-head">
            <h2 class="sec-title">Samples</h2>
            <p class="sec-sub">
              MP3 · MP4 · WAV · OGG · YouTube · Instagram · TikTok
            </p>
          </div>
          <div class="drop-zone">
            <Mic2 size={36} />
            <p class="drop-title">Drop files or paste a link</p>
            <p class="drop-sub">
              Supports all major audio, video, and streaming links
            </p>
            <div class="link-row">
              <input
                type="url"
                class="link-input"
                placeholder="https://youtube.com/watch?v=..."
                aria-label="Paste link"
              />
              <button class="add-btn"><Plus size={15} />Add</button>
            </div>
          </div>
          <div class="empty-state">
            <div class="wip-tape">COMING SOON</div>
            <p>Your samples will appear here once added.</p>
          </div>
        </div>
      {:else if activeTab === "playlists"}
        <div class="tab-scroll scroll-y">
          <div class="sec-head">
            <h2 class="sec-title">Playlists</h2>
            <p class="sec-sub">
              Connect Spotify to sync playlists across all services
              automatically
            </p>
          </div>
          <div class="spotify-card">
            <div class="sp-icon">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="30"
                height="30"
              >
                <path
                  d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                />
              </svg>
            </div>
            <div class="sp-info">
              <h3>Connect Spotify</h3>
              <p>Import your playlists and sync across services</p>
            </div>
            <button class="sp-btn">Connect <ChevronRight size={15} /></button>
          </div>
          <div class="svc-chips">
            {#each [{ name: "Apple Music", color: "#fc3c44", icon: "🎵" }, { name: "YouTube Music", color: "#ff0000", icon: "▶" }, { name: "Amazon Music", color: "#00a8e0", icon: "♪" }, { name: "Tidal", color: "#00d4f5", icon: "〰" }] as svc}
              <div class="svc-chip" style="--sc:{svc.color}">
                <span>{svc.icon}</span><span>{svc.name}</span><ExternalLink
                  size={11}
                />
              </div>
            {/each}
          </div>
          <div
            class="empty-state"
            style="margin:auto;max-width:380px;text-align:center"
          >
            <div class="wip-tape">COMING SOON</div>
            <p>
              Connect Spotify to see your playlists, automatically transcribed
              across all services.
            </p>
          </div>
        </div>
      {/if}
    </div>

    <footer class="mp-footer">
      <div class="mp-status">
        <span class="mp-dot"></span><span>WE ARE DOGS</span>
      </div>
      <span>MUSIC</span>
    </footer>
  </div>
</div>

<style>
  .mp-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  .mp-container {
    width: 94vw;
    height: 90vh;
    max-width: 1080px;
    max-height: 820px;
    background: rgba(7, 7, 11, 0.94);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 22px;
    box-shadow:
      0 40px 100px rgba(0, 0, 0, 0.9),
      inset 0 1px 0 rgba(255, 255, 255, 0.06);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    animation: mpIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .mp-container.closing {
    animation: mpOut 0.3s cubic-bezier(0.4, 0, 1, 1) forwards;
  }
  @keyframes mpIn {
    from {
      opacity: 0;
      transform: translateY(28px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
  @keyframes mpOut {
    from {
      opacity: 1;
      transform: none;
    }
    to {
      opacity: 0;
      transform: translateY(18px) scale(0.97);
    }
  }

  .mp-header {
    height: 58px;
    padding: 0 22px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(0, 0, 0, 0.22);
  }
  .mp-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .mp-logo {
    width: 21px;
    height: 21px;
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.25));
  }
  .mp-title {
    font-family: "Outfit", "Inter", sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.88);
  }
  .mp-close-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.42);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  .mp-close-btn:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    transform: rotate(90deg);
  }

  .mp-tabs {
    display: flex;
    padding: 0 18px;
    gap: 2px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(0, 0, 0, 0.14);
    flex-shrink: 0;
  }
  .mp-tab {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 11px 16px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.32);
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.18s;
    font-family: "Outfit", "Inter", sans-serif;
    margin-bottom: -1px;
  }
  .mp-tab:hover {
    color: rgba(255, 255, 255, 0.62);
  }
  .mp-tab.active {
    color: rgba(255, 255, 255, 0.92);
    border-bottom-color: rgba(165, 90, 255, 0.85);
  }

  .mp-body {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .songs-layout {
    display: flex;
    height: 100%;
    overflow: hidden;
  }

  .player-side {
    width: 320px;
    min-width: 260px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 22px 18px 16px;
    gap: 13px;
    overflow-y: auto;
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(0, 0, 0, 0.12);
    overflow-x: hidden;
  }

  .vinyl-wrapper {
    position: relative;
    width: 210px;
    height: 210px;
    flex-shrink: 0;
  }
  .vinyl-record {
    width: 210px;
    height: 210px;
    border-radius: 50%;
    background: radial-gradient(
      circle at 50%,
      #1a1a1a 0%,
      #111 17%,
      #0d0d0d 18.5%,
      #1a1a1a 20%,
      #0d0d0d 22%,
      #1c1c1c 38%,
      #0d0d0d 39%,
      #1c1c1c 55%,
      #0d0d0d 56%,
      #1c1c1c 70%,
      #0a0a0a 100%
    );
    box-shadow:
      0 0 0 1.5px rgba(255, 255, 255, 0.03),
      0 8px 40px rgba(0, 0, 0, 0.85),
      inset 0 0 24px rgba(0, 0, 0, 0.5);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .vinyl-record.spinning {
    animation: vspin 2.6s linear infinite;
  }
  @keyframes vspin {
    to {
      transform: rotate(360deg);
    }
  }

  .groove {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.032);
    pointer-events: none;
  }
  .g1 {
    width: 72%;
    height: 72%;
  }
  .g2 {
    width: 56%;
    height: 56%;
  }
  .g3 {
    width: 40%;
    height: 40%;
    border-color: rgba(255, 255, 255, 0.022);
  }
  .g4 {
    width: 86%;
    height: 86%;
    border-color: rgba(255, 255, 255, 0.018);
  }

  .record-label {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    overflow: hidden;
    background: #111;
    border: 2px solid rgba(255, 255, 255, 0.1);
    position: relative;
    z-index: 2;
    box-shadow: 0 2px 14px rgba(0, 0, 0, 0.65);
  }
  .record-art {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.4s;
  }
  .record-art.loaded {
    opacity: 1;
  }
  .spindle {
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: radial-gradient(circle, #777 0%, #333 100%);
    z-index: 3;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
  }

  .tonearm {
    position: absolute;
    top: 6px;
    right: -6px;
    width: 4px;
    height: 96px;
    background: linear-gradient(to bottom, #888 0%, #555 60%, #333 100%);
    transform-origin: top center;
    transform: rotate(-36deg);
    border-radius: 2px;
    transition: transform 0.9s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    z-index: 5;
  }
  .tonearm::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: -2px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(170, 90, 255, 0.85);
    box-shadow: 0 0 8px rgba(170, 90, 255, 0.6);
  }
  .tonearm.playing {
    transform: rotate(-19deg);
  }

  .track-info {
    text-align: center;
    width: 100%;
  }
  .version-badge {
    display: inline-block;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 20px;
    margin-bottom: 7px;
    background: rgba(170, 90, 255, 0.13);
    border: 1px solid rgba(170, 90, 255, 0.28);
    color: rgba(180, 110, 255, 0.9);
    font-family: "Outfit", monospace;
    transition: all 0.3s;
  }
  .version-badge.inst {
    background: rgba(90, 210, 255, 0.1);
    border-color: rgba(90, 210, 255, 0.28);
    color: rgba(90, 210, 255, 0.9);
  }
  .track-title {
    margin: 0 0 4px;
    font-size: 1.2rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    color: rgba(255, 255, 255, 0.94);
    font-family: "Outfit", "Inter", sans-serif;
  }
  .track-artist {
    margin: 0 0 2px;
    font-size: 0.82rem;
    color: rgba(255, 255, 255, 0.55);
    font-family: "Inter", sans-serif;
  }
  .track-album {
    margin: 0;
    font-size: 0.68rem;
    color: rgba(255, 255, 255, 0.28);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-family: "Outfit", monospace;
  }

  .progress-row {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }
  .ptime {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.3);
    font-family: monospace;
    min-width: 28px;
    text-align: center;
  }
  .progress-wrap {
    flex: 1;
    height: 3px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    position: relative;
    cursor: pointer;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(170, 90, 255, 0.9) 0%,
      rgba(90, 180, 255, 0.8) 100%
    );
    border-radius: 3px;
    transition: width 0.1s linear;
    pointer-events: none;
  }
  .seek-input {
    position: absolute;
    inset: -10px 0;
    width: 100%;
    height: 24px;
    opacity: 0;
    cursor: pointer;
    margin: 0;
  }

  .controls-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
  }
  .ctrl {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.15s;
    padding: 0;
  }
  .ctrl:hover {
    color: rgba(255, 255, 255, 0.9);
    transform: scale(1.1);
  }
  .ctrl:active {
    transform: scale(0.95);
  }
  .ctrl-xs {
    width: 26px;
    height: 26px;
  }
  .ctrl-sm {
    width: 30px;
    height: 30px;
  }
  .ctrl-md {
    width: 38px;
    height: 38px;
    color: rgba(255, 255, 255, 0.72);
  }
  .ctrl-md:hover {
    color: #fff;
  }
  .ctrl-play {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    color: #fff;
    background: linear-gradient(
      135deg,
      rgba(170, 90, 255, 0.92) 0%,
      rgba(90, 130, 255, 0.92) 100%
    );
    box-shadow: 0 4px 22px rgba(140, 80, 255, 0.5);
    transition: all 0.2s;
  }
  .ctrl-play:hover {
    transform: scale(1.07);
    box-shadow: 0 6px 30px rgba(140, 80, 255, 0.7);
  }
  .ctrl-play:active {
    transform: scale(0.97);
  }
  .active-ctrl {
    color: rgba(170, 90, 255, 0.9) !important;
  }
  .spin-ring {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: sr 0.7s linear infinite;
  }
  @keyframes sr {
    to {
      transform: rotate(360deg);
    }
  }

  .inst-toggle {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 7px 16px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    color: rgba(255, 255, 255, 0.48);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.22s;
    font-family: "Outfit", sans-serif;
  }
  .inst-toggle:hover {
    background: rgba(170, 90, 255, 0.1);
    border-color: rgba(170, 90, 255, 0.32);
    color: rgba(170, 90, 255, 0.9);
    transform: translateY(-1px);
  }
  .inst-toggle.on {
    background: rgba(90, 210, 255, 0.1);
    border-color: rgba(90, 210, 255, 0.3);
    color: rgba(90, 210, 255, 0.88);
  }

  .vol-row {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }
  .vol-slider {
    flex: 1;
    height: 3px;
    accent-color: rgba(170, 90, 255, 0.9);
    cursor: pointer;
  }

  .tracklist-side {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
  }
  .tl-header {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 14px 22px 10px;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.28);
    font-family: "Outfit", monospace;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    flex-shrink: 0;
  }
  .tl-count {
    margin-left: auto;
    background: rgba(255, 255, 255, 0.07);
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.62rem;
  }
  .tracklist {
    flex: 1;
    overflow-y: auto;
    padding: 6px 0;
  }

  .track-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 22px;
    cursor: pointer;
    transition: background 0.14s;
    position: relative;
  }
  .track-row:hover {
    background: rgba(255, 255, 255, 0.04);
  }
  .track-row.active {
    background: rgba(170, 90, 255, 0.07);
  }
  .track-row.active::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(
      to bottom,
      rgba(170, 90, 255, 0.9),
      rgba(90, 150, 255, 0.7)
    );
    border-radius: 0 2px 2px 0;
  }
  .tr-num {
    width: 18px;
    text-align: center;
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.28);
    font-family: monospace;
    flex-shrink: 0;
  }
  .tr-art {
    width: 42px;
    height: 42px;
    border-radius: 6px;
    object-fit: cover;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.05);
  }
  .tr-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .tr-title {
    font-size: 0.86rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.86);
    font-family: "Outfit", "Inter", sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .track-row.active .tr-title {
    color: rgba(200, 155, 255, 0.95);
  }
  .tr-meta {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.33);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: "Inter", sans-serif;
  }
  .inst-chip {
    font-size: 0.56rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    padding: 2px 7px;
    border-radius: 10px;
    background: rgba(90, 210, 255, 0.1);
    border: 1px solid rgba(90, 210, 255, 0.22);
    color: rgba(90, 210, 255, 0.82);
    font-family: monospace;
    flex-shrink: 0;
  }

  .inst-chip-link {
    font-size: 0.56rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    padding: 2px 2px; /* Reduced side padding since it's no longer a badge */
    flex-shrink: 0;

    /* Hyperlink Styles */
    color: #22c55e; /* A clean, vibrant green (Tailwind green-500) */
    text-decoration: underline;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  /* Optional: Make it slightly darker/brighter when hovered */
  .inst-chip-link:hover {
    color: #16a34a; /* Slightly darker green on hover */
  }

  .eq {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 15px;
  }
  .eq-b {
    width: 3px;
    background: rgba(170, 90, 255, 0.85);
    border-radius: 1px;
    animation: eq 0.55s ease infinite alternate;
  }
  .eq-b:nth-child(1) {
    height: 60%;
    animation-delay: 0s;
  }
  .eq-b:nth-child(2) {
    height: 100%;
    animation-delay: 0.15s;
  }
  .eq-b:nth-child(3) {
    height: 45%;
    animation-delay: 0.3s;
  }
  @keyframes eq {
    from {
      transform: scaleY(0.35);
    }
    to {
      transform: scaleY(1);
    }
  }

  .add-hint {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 13px 22px;
    color: rgba(255, 255, 255, 0.16);
    font-size: 0.68rem;
    font-family: monospace;
    border-top: 1px dashed rgba(255, 255, 255, 0.06);
    margin-top: 6px;
  }
  .add-hint code {
    font-size: 0.65rem;
    color: rgba(170, 90, 255, 0.38);
  }

  .tab-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 26px;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }
  .sec-head {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .sec-title {
    font-size: 1.3rem;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    font-family: "Outfit", "Inter", sans-serif;
  }
  .sec-sub {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.35);
    margin: 0;
    font-family: "Inter", sans-serif;
  }

  .drop-zone {
    background: rgba(255, 255, 255, 0.02);
    border: 2px dashed rgba(255, 255, 255, 0.09);
    border-radius: 14px;
    padding: 36px 22px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    transition: all 0.2s;
  }
  .drop-zone:hover {
    border-color: rgba(170, 90, 255, 0.28);
    background: rgba(170, 90, 255, 0.03);
  }
  .drop-zone :global(svg) {
    color: rgba(255, 255, 255, 0.18);
  }
  .drop-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.5);
    font-family: "Outfit", sans-serif;
    margin: 4px 0 0;
  }
  .drop-sub {
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.22);
    font-family: monospace;
    letter-spacing: 0.04em;
    margin: 0;
  }
  .link-row {
    display: flex;
    gap: 8px;
    width: 100%;
    max-width: 460px;
    margin-top: 7px;
  }
  .link-input {
    flex: 1;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 10px;
    padding: 9px 13px;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.78);
    outline: none;
    font-family: "Inter", sans-serif;
    transition: border-color 0.18s;
  }
  .link-input::placeholder {
    color: rgba(255, 255, 255, 0.18);
  }
  .link-input:focus {
    border-color: rgba(170, 90, 255, 0.38);
  }
  .add-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 9px 16px;
    white-space: nowrap;
    background: linear-gradient(
      135deg,
      rgba(170, 90, 255, 0.85) 0%,
      rgba(90, 130, 255, 0.85) 100%
    );
    border: none;
    border-radius: 10px;
    color: #fff;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
    font-family: "Outfit", sans-serif;
  }
  .add-btn:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }

  .spotify-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 18px 22px;
    background: rgba(30, 215, 96, 0.05);
    border: 1px solid rgba(30, 215, 96, 0.16);
    border-radius: 13px;
  }
  .sp-icon {
    color: #1db954;
    flex-shrink: 0;
  }
  .sp-info {
    flex: 1;
  }
  .sp-info h3 {
    margin: 0 0 3px;
    font-size: 0.92rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.86);
    font-family: "Outfit", sans-serif;
  }
  .sp-info p {
    margin: 0;
    font-size: 0.76rem;
    color: rgba(255, 255, 255, 0.38);
    font-family: "Inter", sans-serif;
  }
  .sp-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 9px 18px;
    background: #1db954;
    border: none;
    border-radius: 22px;
    color: #000;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.18s;
    font-family: "Outfit", sans-serif;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .sp-btn:hover {
    background: #1ed760;
    transform: translateY(-1px);
  }

  .svc-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
  }
  .svc-chip {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 7px 14px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 22px;
    font-size: 0.76rem;
    color: rgba(255, 255, 255, 0.46);
    cursor: pointer;
    transition: all 0.18s;
    font-family: "Inter", sans-serif;
  }
  .svc-chip:hover {
    border-color: var(--sc, rgba(255, 255, 255, 0.3));
    color: var(--sc, rgba(255, 255, 255, 0.85));
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    padding: 36px 20px;
    color: rgba(255, 255, 255, 0.32);
    font-size: 0.8rem;
    font-family: "Inter", sans-serif;
  }
  .wip-tape {
    background: repeating-linear-gradient(
      -45deg,
      #ffd700,
      #ffd700 11px,
      #111 11px,
      #111 22px
    );
    color: #111;
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.2em;
    padding: 7px 28px;
    border-radius: 4px;
    font-family: "Outfit", monospace;
    user-select: none;
  }

  .mp-footer {
    height: 36px;
    padding: 0 22px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(0, 0, 0, 0.22);
    font-size: 0.62rem;
    color: rgba(255, 255, 255, 0.22);
    letter-spacing: 0.06em;
    font-family: monospace;
  }
  .mp-status {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .mp-dot {
    width: 5px;
    height: 5px;
    background: #00ff66;
    border-radius: 50%;
    box-shadow: 0 0 5px rgba(0, 255, 102, 0.55);
  }

  .scroll-y {
    overflow-y: auto;
    overflow-x: hidden;
  }
  .scroll-y::-webkit-scrollbar {
    width: 4px;
  }
  .scroll-y::-webkit-scrollbar-track {
    background: transparent;
  }
  .scroll-y::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.07);
    border-radius: 2px;
  }
  .scroll-y::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.16);
  }

  @media (max-width: 640px) {
    .mp-container {
      width: 100vw;
      height: 100%;
      max-height: 100%;
      border-radius: 0;
    }
    /* Stack vertically, player on top, tracklist fills rest */
    .songs-layout {
      flex-direction: column;
      overflow: hidden;
    }
    /* Player scrolls internally so controls are never clipped */
    .player-side {
      width: 100%;
      min-width: unset;
      border-right: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding: 10px 14px 12px;
      max-height: none;
      flex-shrink: 0;
      overflow-y: auto;
      gap: 8px;
    }
    /* Smaller vinyl so controls fit without scrolling */
    .vinyl-wrapper {
      width: 120px;
      height: 120px;
    }
    .vinyl-record {
      width: 120px;
      height: 120px;
    }
    .record-label {
      width: 48px;
      height: 48px;
    }
    .tonearm {
      height: 64px;
    }
    /* Tracklist takes remaining space */
    .tracklist-side {
      flex: 1;
      min-height: 0;
      max-height: none;
    }
    .mp-tab {
      padding: 9px 11px;
      font-size: 0.7rem;
    }
    .mp-tabs {
      padding: 0 8px;
    }
    /* Tighten track-info text on small screens */
    .track-title {
      font-size: 1rem;
    }
    .track-artist,
    .track-album {
      font-size: 0.72rem;
    }
    /* Slightly smaller play button */
    .ctrl-play {
      width: 46px;
      height: 46px;
    }
  }
</style>
