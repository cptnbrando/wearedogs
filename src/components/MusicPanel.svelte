<script>
  import { onMount } from "svelte";
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
    ArrowLeft,
    BoomBox,
    Music,
  } from "lucide-svelte";
  import { audioCore } from "../lib/AudioCore.svelte.js";

  import SwipeTabNav from "./SwipeTabNav.svelte";

  const title = "MUSIC";

  const musicTabs = [
    { id: "songs", label: "Songs", icon: Disc3 },
    { id: "samples", label: "Samples", icon: Mic2 },
    { id: "playlists", label: "Playlists", icon: Radio },
    { id: "radio", label: "Radio", icon: BoomBox },
  ];

  let { isClosing = false, onClose, initialTrackId = null } = $props();

  // Tab: 'songs' | 'samples' | 'playlists' | 'radio'
  let activeTab = $state("songs");
  let sortBy = $state("default"); // 'default' | 'artist' | 'album' | 'year' | 'filename' | 'genre' | 'season'
  let showMobileTracklist = $state(false);
  let isBouncing = $state(false);
  let vinylLoaded = $state(false);

  const library = [
    {
      id: "hollywood",
      title: "HOLLYWOOD",
      artist: "YG",
      album: "THE GENTLEMEN'S CLUB",
      cover: "/img/covers/yg.webp",
      altCover: "/img/covers/yg.jpg",
      src: "/music/YG/THE GENTLEMEN'S CLUB/HOLLYWOOD.mp3",
      instrumental: "/music/YG/THE GENTLEMEN'S CLUB/HOLLYWOOD-FREE.mp3",
      hasInstrumental: true,
      dateAdded: "2026-06-24T03:00:00-05:00",
      year: 2026,
      genre: "Hip-Hop"
    },
    {
      id: "chicago",
      title: "Chicago",
      artist: "Michael Jackson",
      album: "Xscape",
      cover: "/img/covers/mj.webp",
      altCover: "/img/covers/mj.jpg",
      src: "/music/Michael Jackson/Xscape/Chicago.mp3",
      instrumental: "/music/Michael Jackson/Xscape/Chicago-free.mp3",
      hasInstrumental: true,
      dateAdded: "2026-06-24T03:00:00-05:00",
      year: 2014,
      genre: "Pop"
    }
  ];

  // Derive sort values
  function getTrackFilename(track) {
    if (!track.src) return "";
    return track.src.split("/").pop();
  }

  function getTrackSeason(track) {
    if (!track.dateAdded) return "Summer";
    const date = new Date(track.dateAdded);
    const month = date.getMonth();
    if (month === 11 || month === 0 || month === 1) return "Winter";
    if (month >= 2 && month <= 4) return "Spring";
    if (month >= 5 && month <= 7) return "Summer";
    return "Fall";
  }

  let sortedLibrary = $derived.by(() => {
    let list = [...library];
    if (sortBy === "artist") {
      list.sort((a, b) => a.artist.localeCompare(b.artist));
    } else if (sortBy === "album") {
      list.sort((a, b) => a.album.localeCompare(b.album));
    } else if (sortBy === "year") {
      list.sort((a, b) => (a.year || 0) - (b.year || 0));
    } else if (sortBy === "filename") {
      list.sort((a, b) => getTrackFilename(a).localeCompare(getTrackFilename(b)));
    } else if (sortBy === "genre") {
      list.sort((a, b) => (a.genre || "").localeCompare(b.genre || ""));
    } else if (sortBy === "season") {
      list.sort((a, b) => getTrackSeason(a).localeCompare(getTrackSeason(b)));
    }
    return list;
  });

  let currentTrack = $derived(library[audioCore.currentTrackIndex]);

  onMount(() => {
    audioCore.init(library);
    if (initialTrackId) {
      const idx = library.findIndex(t => t.id === initialTrackId);
      if (idx !== -1) {
        audioCore.loadTrack(idx, true);
      }
    }
  });

  function selectSortedTrack(track) {
    const idx = library.findIndex(t => t.id === track.id);
    if (audioCore.currentTrackIndex === idx) {
      audioCore.togglePlay();
    } else {
      audioCore.loadTrack(idx, true);
    }
  }

  function handleCrossfadeInput(e) {
    const val = parseFloat(e.target.value);
    const success = audioCore.setCrossfade(val);
    if (!success) {
      e.target.value = 0;
      if (!isBouncing) {
        isBouncing = true;
        setTimeout(() => { isBouncing = false; }, 400);
      }
    }
  }

  function fmtTime(s) {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60)
      .toString()
      .padStart(2, "0")}`;
  }

  function handleKeydown(e) {
    if (e.code === "Space" || e.key === " ") {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.isContentEditable)
      ) {
        return;
      }
      if (activeTab === "songs") {
        e.preventDefault();
        togglePlay();
      }
    }
  }

  let touchStartX = 0;
  let touchStartY = 0;

  function handleBodyTouchStart(e) {
    if (
      e.target &&
      (e.target.tagName === "INPUT" ||
        e.target.closest("button") ||
        e.target.closest(".ctrl"))
    ) {
      touchStartX = 0;
      touchStartY = 0;
      return;
    }
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function handleBodyTouchEnd(e) {
    if (touchStartX === 0) return;
    if (!e.changedTouches || e.changedTouches.length === 0) return;

    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(diffX) <= Math.abs(diffY) || Math.abs(diffX) <= 60) return;

    const idx = musicTabs.findIndex((t) => t.id === activeTab);
    if (idx === -1) return;

    if (diffX < 0 && idx < musicTabs.length - 1) {
      activeTab = musicTabs[idx + 1].id;
    } else if (diffX > 0 && idx > 0) {
      activeTab = musicTabs[idx - 1].id;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="mp-backdrop" onclick={onClose}>
  <div
    class="mp-container"
    class:closing={isClosing}
    onclick={(e) => e.stopPropagation()}
  >
    <!-- Header -->
    <header class="panel-header">
      <div class="brand">
        <img
          src="/favicon.svg"
          alt="DOGS Logo"
          class="w-6 h-6 shrink-0 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
        />
        <h1>{title}</h1>
      </div>

      <button class="close-btn" onclick={onClose} aria-label="Close panel">
        <ArrowLeft size={20} />
      </button>
    </header>

    <SwipeTabNav tabs={musicTabs} bind:activeTab />

    <div
      class="mp-body"
      ontouchstart={handleBodyTouchStart}
      ontouchend={handleBodyTouchEnd}
    >
      {#if activeTab === "songs"}
        <div class="songs-layout">
          <!-- Left side player details -->
          <div class="player-side" class:hidden-mobile={showMobileTracklist}>
            <!-- Vinyl disc button to toggle tracklist on mobile -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
            <div 
              class="vinyl-wrapper cursor-pointer" 
              onclick={() => { showMobileTracklist = true; }}
              role="button"
              tabindex="0"
              aria-label="Open tracklist"
            >
              <div class="vinyl-record" class:spinning={audioCore.isPlaying}>
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
              <div class="tonearm" class:playing={audioCore.isPlaying}></div>
            </div>

            <div class="track-info mt-2">
              <div class="version-badge" class:inst={audioCore.crossfadeValue > 0.5}>
                {audioCore.crossfadeValue > 0.5 ? "INSTRUMENTAL" : "ORIGINAL"}
              </div>
              <h2 class="track-title">{currentTrack.title}</h2>
              <p class="track-artist">{currentTrack.artist}</p>
              <p class="track-album">{currentTrack.album}</p>
            </div>

            <!-- Seek bar -->
            <div class="progress-row">
              <span class="ptime">{fmtTime(audioCore.currentTime)}</span>
              <div class="progress-wrap">
                <div class="progress-fill" style="width:{(audioCore.duration > 0 ? (audioCore.currentTime / audioCore.duration) * 100 : 0)}%"></div>
                <input
                  type="range"
                  class="seek-input"
                  min="0"
                  max={audioCore.duration || 100}
                  step="0.1"
                  value={audioCore.currentTime}
                  oninput={(e) => { audioCore.currentTime = parseFloat(e.target.value); }}
                  onchange={(e) => { audioCore.play(parseFloat(e.target.value)); }}
                  aria-label="Seek"
                />
              </div>
              <span class="ptime">{fmtTime(audioCore.duration)}</span>
            </div>

            <!-- Player main buttons -->
            <div class="controls-row">
              <button
                class="ctrl ctrl-sm"
                class:active-ctrl={audioCore.isShuffled}
                onclick={() => (audioCore.isShuffled = !audioCore.isShuffled)}
                aria-label="Shuffle"
              >
                <Shuffle size={15} />
              </button>
              <button
                class="ctrl ctrl-md"
                onclick={() => audioCore.prevTrack()}
                aria-label="Previous"
              >
                <SkipBack size={19} />
              </button>
              <button
                class="ctrl ctrl-play"
                onclick={() => audioCore.togglePlay()}
                aria-label={audioCore.isPlaying ? "Pause" : "Play"}
              >
                {#if audioCore.isLoading}
                  <div class="spin-ring"></div>
                {:else if audioCore.isPlaying}
                  <Pause size={22} fill="currentColor" />
                {:else}
                  <Play size={22} fill="currentColor" />
                {/if}
              </button>
              <button
                class="ctrl ctrl-md"
                onclick={() => audioCore.nextTrack()}
                aria-label="Next"
              >
                <SkipForward size={19} />
              </button>
              <button
                class="ctrl ctrl-sm"
                class:active-ctrl={audioCore.repeatMode > 0}
                onclick={() => { audioCore.repeatMode = (audioCore.repeatMode + 1) % 3; }}
                aria-label="Repeat"
              >
                {#if audioCore.repeatMode === 2}<Repeat1 size={15} />{:else}<Repeat
                    size={15}
                  />{/if}
              </button>
            </div>

            <!-- Custom Animated Digital Crossfader slider -->
            <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1">
              <span class="text-[10px] font-bold tracking-wider text-white/30 uppercase font-sans">Vocals / Inst Crossfader</span>
              <div 
                class="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-white/5 bg-white/[0.02]"
                class:animate-wiggle={isBouncing}
              >
                <div class="flex items-center gap-1.5" class:text-purple-400={audioCore.crossfadeValue < 0.5} class:text-white/20={audioCore.crossfadeValue >= 0.5}>
                  <Mic2 size={14} />
                  <span class="text-[10px] font-bold">VOCAL</span>
                </div>
                <div class="flex-1 relative flex items-center h-4">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={audioCore.crossfadeValue}
                    oninput={handleCrossfadeInput}
                    class="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    aria-label="Vocals to Instrumental Crossfader"
                  />
                </div>
                <div class="flex items-center gap-1.5" class:text-cyan-400={audioCore.crossfadeValue >= 0.5} class:text-white/20={audioCore.crossfadeValue < 0.5}>
                  <Music size={14} />
                  <span class="text-[10px] font-bold">INST</span>
                </div>
              </div>
            </div>

            <!-- Volume controls -->
            <div class="vol-row mt-2">
              <button
                class="ctrl ctrl-xs"
                onclick={() => audioCore.toggleMute()}
                aria-label="Mute"
              >
                {#if audioCore.isMuted || audioCore.volume === 0}
                  <VolumeX size={13} />
                {:else}
                  <Volume2 size={13} />
                {/if}
              </button>
              <input
                type="range"
                class="vol-slider"
                min="0"
                max="1"
                step="0.01"
                value={audioCore.volume}
                oninput={(e) => audioCore.setVolume(parseFloat(e.target.value))}
                aria-label="Volume"
              />
            </div>
          </div>

          <!-- Right side tracklist -->
          <div class="tracklist-side" class:show-mobile={showMobileTracklist}>
            <!-- Mobile back button to close tracklist drawer -->
            <div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between">
              <span class="text-xs font-bold text-white/50">Track Library</span>
              <button 
                class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold"
                onclick={() => { showMobileTracklist = false; }}
              >
                Back to player
              </button>
            </div>

            <div class="tl-header flex justify-between items-center gap-3">
              <div class="flex items-center gap-2">
                <List size={13} /><span>TRACKS</span>
                <span class="tl-count">{library.length}</span>
              </div>
              
              <!-- Sorting selector dropdown -->
              <div class="flex items-center gap-1.5 ml-auto">
                <span class="text-[9px] text-white/30 font-bold font-sans">SORT BY:</span>
                <select 
                  bind:value={sortBy}
                  class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans"
                >
                  <option value="default">DEFAULT</option>
                  <option value="artist">ARTIST</option>
                  <option value="album">ALBUM</option>
                  <option value="year">YEAR</option>
                  <option value="filename">FILENAME</option>
                  <option value="genre">GENRE</option>
                  <option value="season">SEASON</option>
                </select>
              </div>
            </div>

            <div class="tracklist scroll-y">
              {#each sortedLibrary as track, i}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  class="track-row"
                  class:active={library[audioCore.currentTrackIndex].id === track.id}
                  onclick={() => selectSortedTrack(track)}
                >
                  <div class="tr-num">
                    {#if library[audioCore.currentTrackIndex].id === track.id && audioCore.isPlaying}
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
                    <span class="tr-meta">{track.artist} · {track.album} ({track.year || ""})</span>
                  </div>
                  {#if library[audioCore.currentTrackIndex].id === track.id && audioCore.crossfadeValue > 0.5}
                    <span class="inst-chip">INST</span>
                  {/if}
                  {#if track.artist === "YG"}
                    <span class="inst-chip-link">
                      <a href="https://the-gentlemens-club.com/" target="_blank" onclick={(e) => e.stopPropagation()}>YG</a>
                    </span>
                  {/if}
                </div>
              {/each}
              <div class="add-hint">
                <Plus size={12} />
                <span>Add tracks to <code>public/music/[artist]/[album]/</code></span>
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
          <div class="empty-state mx-auto max-w-[380px] text-center">
            <div class="wip-tape">COMING SOON</div>
            <p>
              Connect Spotify to see your playlists, automatically transcribed
              across all services.
            </p>
          </div>
        </div>
      {:else if activeTab === "radio"}
        <div class="tab-scroll scroll-y">
          <div class="sec-head">
            <h2 class="sec-title">Radio</h2>
            <p class="sec-sub">Stream live broadcasts, dog shows, and podcast feeds</p>
          </div>
          <div class="empty-state mx-auto max-w-[380px] text-center">
            <div class="wip-tape">COMING SOON</div>
            <p>Live radio feeds will appear here once connected.</p>
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

<style lang="scss">
  @import "../styles/music-panel.scss";

<<<<<<< HEAD
  // Wiggle bounce keyframes for locked crossfader
  @keyframes wiggle {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px) rotate(-1.5deg); }
    75% { transform: translateX(6px) rotate(1.5deg); }
  }
  .animate-wiggle {
    animation: wiggle 0.2s ease-in-out 2;
=======
  /* ── Header ── */
  .panel-header {
    height: 64px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(0, 0, 0, 0.2);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand h1 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.95);
    font-family: "Outfit", "Inter", sans-serif;
  }

  .close-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.5);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    transform: translateX(-4px);
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
    transform: rotate(-16deg);
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
    transform: rotate(20deg);
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
    .songs-layout {
      flex-direction: column;
      overflow: hidden;
    }
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
    .tracklist-side {
      flex: 1;
      min-height: 0;
      max-height: none;
    }
    .track-title {
      font-size: 1rem;
    }
    .track-artist,
    .track-album {
      font-size: 0.72rem;
    }
    .ctrl-play {
      width: 46px;
      height: 46px;
    }
  }
</style>

<style lang="scss">
  @import "../styles/music-panel.scss";

  @keyframes wiggle {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px) rotate(-1.5deg); }
    75% { transform: translateX(6px) rotate(1.5deg); }
  }
  .animate-wiggle {
    animation: wiggle 0.2s ease-in-out 2;
  }
</style>
