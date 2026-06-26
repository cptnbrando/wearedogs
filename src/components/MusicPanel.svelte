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
    Guitar,
    Waves,
    Maximize2,
    Minimize2,
  } from "lucide-svelte";
  import { audioCore } from "../lib/AudioCore.svelte.js";
  import { VisualizerEngine } from "../lib/visualizer/VisualizerEngine.js";
  import { PRESETS } from "../lib/visualizer/presets.js";

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
  let showVolumeSlider = $state(false);
  let volumePopoverEl = $state(null);

  let showVisualizer = $state(false);
  let activePresetIdx = $state(0);
  let isFullscreenVisualizer = $state(false);
  let canvasEl = $state(null);
  let visualizerEngine = null;

  // Manage Visualizer instantiation and destruction
  $effect(() => {
    if (showVisualizer && canvasEl && audioCore.analyser) {
      visualizerEngine = new VisualizerEngine(canvasEl, audioCore.analyser);

      // Initial preset load
      const preset = PRESETS[activePresetIdx];
      if (preset) {
        visualizerEngine.init(preset.fragmentShader);
        visualizerEngine.start();
      }
    }

    return () => {
      if (visualizerEngine) {
        visualizerEngine.destroy();
        visualizerEngine = null;
      }
    };
  });

  // Manage Preset switches (without destroying WebGL context)
  $effect(() => {
    const presetIdx = activePresetIdx; // track dependency
    if (visualizerEngine && showVisualizer) {
      const preset = PRESETS[presetIdx];
      if (preset) {
        visualizerEngine.setPreset(preset.fragmentShader);
        visualizerEngine.start();
      }
    }
  });

  // Sync tracklist state with browser history (back button closes tracklist)
  $effect(() => {
    if (showMobileTracklist) {
      if (!history.state?.tracklistOpen) {
        history.pushState({ tracklistOpen: true }, "");
      }
    } else {
      if (history.state?.tracklistOpen) {
        history.back();
      }
    }

    return () => {
      // Clean up history state if modal closes while tracklist is open
      if (history.state?.tracklistOpen) {
        history.back();
      }
    };
  });

  function handlePopState(e) {
    if (!e.state?.tracklistOpen && showMobileTracklist) {
      showMobileTracklist = false;
    }
  }

  function handleWindowClick(e) {
    if (
      showVolumeSlider &&
      volumePopoverEl &&
      !volumePopoverEl.contains(e.target) &&
      !e.target.closest(".vol-toggle-btn")
    ) {
      showVolumeSlider = false;
    }
  }

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
      genre: "Hip-Hop",
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
      genre: "Pop",
    },
  ];

  // Derive sort values
  function getTrackFilename(track) {
    if (!track.src) return "";
    return track.src.split("/").pop();
  }

  // Derive sort values by season
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
      list.sort((a, b) =>
        getTrackFilename(a).localeCompare(getTrackFilename(b)),
      );
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
      const idx = library.findIndex((t) => t.id === initialTrackId);
      if (idx !== -1) {
        audioCore.loadTrack(idx, true);
      }
    }
  });

  function selectSortedTrack(track) {
    const idx = library.findIndex((t) => t.id === track.id);
    if (audioCore.currentTrackIndex === idx) {
      audioCore.togglePlay();
    } else {
      audioCore.loadTrack(idx, true);
    }
  }

  function handleRecordClick() {
    const isMobile = window.innerWidth <= 640;
    if (isMobile) {
      showMobileTracklist = true;
    } else {
      showVisualizer = !showVisualizer;
    }
  }

  function toggleCrossfade() {
    const newVal = !audioCore.isInstrumental;
    const success = audioCore.setCrossfade(newVal);
    if (!success) {
      if (!isBouncing) {
        isBouncing = true;
        setTimeout(() => {
          isBouncing = false;
        }, 400);
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
        audioCore.togglePlay();
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

  // Handle swipe gestures
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

<svelte:window
  onkeydown={handleKeydown}
  onpopstate={handlePopState}
  onclick={handleWindowClick}
/>

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
          <div class="player-side" class:tracklist-open={showMobileTracklist}>
            <!-- Top block (Vinyl & track info) - disappears on mobile tracklist active -->
            <div
              class="player-top-block transition-all duration-300 ease-in-out"
              class:opacity-0={showMobileTracklist}
              class:scale-95={showMobileTracklist}
              class:pointer-events-none={showMobileTracklist}
            >
              <!-- Vinyl disc OR Visualizer (Exactly same dimensions!) -->
              <div class="vinyl-wrapper relative">
                {#if showVisualizer}
                  <!-- Visualizer Container -->
                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div 
                    class="visualizer-container cursor-pointer" 
                    class:fullscreen={isFullscreenVisualizer}
                    onclick={() => { if (!isFullscreenVisualizer) isFullscreenVisualizer = true; }}
                  >
                    <canvas bind:this={canvasEl} class="visualizer-canvas"></canvas>
                    
                    <!-- Floating Overlay controls: Only show when fullscreen or on hover -->
                    {#if isFullscreenVisualizer}
                      <!-- Floating Top-Right Exit Fullscreen Button -->
                      <button 
                        class="absolute top-6 right-6 z-[2100] ctrl ctrl-md bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:scale-105 active:scale-95 transition-all"
                        onclick={() => isFullscreenVisualizer = false}
                        aria-label="Exit Fullscreen"
                      >
                        <Minimize2 size={16} />
                      </button>

                      <div class="visualizer-overlay" onclick={(e) => e.stopPropagation()}>
                        <div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10">
                          {#each PRESETS as preset, index}
                            <button 
                              class="px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono
                                {activePresetIdx === index
                                ? 'bg-purple-600 text-white'
                                : 'text-white/40 hover:text-white/80'}"
                              onclick={() => activePresetIdx = index}
                            >
                              {preset.name}
                            </button>
                          {/each}
                        </div>

                        <button 
                          class="ctrl ctrl-xs bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-white"
                          onclick={() => isFullscreenVisualizer = false}
                          aria-label="Exit Fullscreen"
                        >
                          <Minimize2 size={12} />
                        </button>
                      </div>
                    {:else}
                      <!-- Subtle maximize icon on hover -->
                      <div class="visualizer-hover-overlay">
                        <Maximize2 size={16} class="text-white/70" />
                      </div>
                    {/if}
                  </div>
                {:else}
                  <!-- Vinyl disc button to toggle tracklist on mobile -->
                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
                  <div
                    class="vinyl-record-clicker cursor-pointer w-full h-full"
                    onclick={handleRecordClick}
                    role="button"
                    tabindex="0"
                    aria-label="Open tracklist"
                  >
                    <div
                      class="vinyl-record"
                      class:spinning={audioCore.isPlaying}
                    >
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
                    <div
                      class="tonearm"
                      class:playing={audioCore.isPlaying}
                    ></div>
                  </div>
                {/if}
              </div>

              <!-- Track info (Always visible!) -->
              <div class="track-info mt-2">
                <div
                  class="version-badge"
                  class:inst={audioCore.isInstrumental}
                >
                  {audioCore.isInstrumental ? "INSTRUMENTAL" : "ORIGINAL"}
                </div>
                <h2 class="track-title">{currentTrack.title}</h2>
                <p class="track-artist">{currentTrack.artist}</p>
                <p class="track-album">{currentTrack.album}</p>
              </div>
            </div>

            <!-- Bottom block (Controls & Faders) - persistent on mobile -->
            <div class="player-controls-block">
              <!-- Seek bar -->
              <div class="progress-row">
                <span class="ptime">{fmtTime(audioCore.currentTime)}</span>
                <div class="progress-wrap">
                  <div
                    class="progress-fill"
                    style="width:{audioCore.duration > 0
                      ? (audioCore.currentTime / audioCore.duration) * 100
                      : 0}%"
                  ></div>
                  <input
                    type="range"
                    class="seek-input"
                    min="0"
                    max={audioCore.duration || 100}
                    step="0.1"
                    value={audioCore.currentTime}
                    oninput={(e) => {
                      audioCore.currentTime = parseFloat(e.target.value);
                    }}
                    onchange={(e) => {
                      audioCore.play(parseFloat(e.target.value));
                    }}
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
                  onclick={() => {
                    audioCore.repeatMode = (audioCore.repeatMode + 1) % 3;
                  }}
                  aria-label="Repeat"
                >
                  {#if audioCore.repeatMode === 2}<Repeat1
                      size={15}
                    />{:else}<Repeat size={15} />{/if}
                </button>
              </div>

              <!-- Custom DJ Crossfader -->
              <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1">
                <span
                  class="text-[10px] font-bold tracking-wider text-white/30 uppercase font-sans"
                  >Crossfader</span
                >
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  class="dj-crossfader"
                  class:animate-wiggle={isBouncing}
                  onclick={toggleCrossfade}
                >
                  <span
                    class="fader-label left-label flex items-center gap-1"
                    class:active={!audioCore.isInstrumental}
                  >
                    <Mic2 size={12} />
                    <span>VOCAL</span>
                  </span>
                  <div class="dj-fader-slot">
                    <div
                      class="dj-fader-knob"
                      class:right={audioCore.isInstrumental}
                    ></div>
                  </div>
                  <span
                    class="fader-label right-label flex items-center gap-1"
                    class:active={audioCore.isInstrumental}
                  >
                    <Guitar size={12} />
                    <span>INST</span>
                  </span>
                </div>
              </div>

              <!-- Volume & Visualizer controls wrapper -->
              <div
                class="relative flex justify-center items-center gap-3 mt-2 w-full"
              >
                <!-- Visualizer Toggle Button -->
                <button
                  class="ctrl ctrl-xs"
                  class:active-ctrl={showVisualizer}
                  onclick={() => {
                    showVisualizer = !showVisualizer;
                  }}
                  aria-label="Toggle Visualizer"
                >
                  <Waves size={13} />
                </button>

                <!-- Volume controls wrapper -->
                <div class="relative">
                  {#if showVolumeSlider}
                    <div class="volume-popover" bind:this={volumePopoverEl}>
                      <button
                        class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10"
                        onclick={() => audioCore.toggleMute()}
                        aria-label="Mute"
                      >
                        {#if audioCore.isMuted || audioCore.volume === 0}
                          <VolumeX size={12} class="text-red-400" />
                        {:else}
                          <Volume2 size={12} />
                        {/if}
                      </button>
                      <input
                        type="range"
                        class="vol-slider-pop"
                        min="0"
                        max="1"
                        step="0.01"
                        value={audioCore.volume}
                        oninput={(e) =>
                          audioCore.setVolume(parseFloat(e.target.value))}
                        aria-label="Volume"
                      />
                      <span
                        class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none"
                      >
                        {Math.round(audioCore.volume * 100)}%
                      </span>
                    </div>
                  {/if}
                  <button
                    class="ctrl ctrl-xs vol-toggle-btn"
                    onclick={() => {
                      showVolumeSlider = !showVolumeSlider;
                    }}
                    aria-label="Toggle volume slider"
                  >
                    {#if audioCore.isMuted || audioCore.volume === 0}
                      <VolumeX size={13} class="text-red-400" />
                    {:else}
                      <Volume2 size={13} />
                    {/if}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right side tracklist -->
          <div class="tracklist-side" class:show-mobile={showMobileTracklist}>
            <!-- Mobile back button to close tracklist drawer -->
            <div
              class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between"
            >
              <span class="text-xs font-bold text-white/50">Track Library</span>
              <button
                class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold"
                onclick={() => {
                  showMobileTracklist = false;
                }}
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
                <span class="text-[9px] text-white/30 font-bold font-sans"
                  >SORT BY:</span
                >
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
                  class:active={library[audioCore.currentTrackIndex].id ===
                    track.id}
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
                    <span class="tr-meta"
                      >{track.artist} · {track.album} ({track.year || ""})</span
                    >
                  </div>
                  {#if library[audioCore.currentTrackIndex].id === track.id && audioCore.isInstrumental}
                    <span class="inst-chip">INST</span>
                  {/if}
                  {#if track.artist === "YG"}
                    <span class="inst-chip-link">
                      <a
                        href="https://the-gentlemens-club.com/"
                        target="_blank"
                        onclick={(e) => e.stopPropagation()}>YG</a
                      >
                    </span>
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
            <p class="sec-sub">
              Stream live broadcasts, dog shows, and podcast feeds
            </p>
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
  @use "../styles/music-panel.scss";

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

  @keyframes wiggle {
    0%,
    100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-6px) rotate(-1.5deg);
    }
    75% {
      transform: translateX(6px) rotate(1.5deg);
    }
  }
  .animate-wiggle {
    animation: wiggle 0.2s ease-in-out 2;
  }

  /* ── DJ Crossfader ── */
  .dj-crossfader {
    position: relative;
    width: 100%;
    height: 34px;
    background: linear-gradient(180deg, #1e1e24 0%, #121215 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    box-sizing: border-box;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.05),
      0 8px 24px rgba(0, 0, 0, 0.5);
    gap: 12px;
    user-select: none;
  }

  .fader-label {
    font-size: 0.65rem;
    font-weight: 800;
    font-family: monospace;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.2);
    transition: color 0.2s ease;
  }

  .fader-label.left-label.active {
    color: #a855f7; /* Vocal side active */
    text-shadow: 0 0 8px rgba(168, 85, 247, 0.4);
  }

  .fader-label.right-label.active {
    color: #06b6d4; /* Inst side active */
    text-shadow: 0 0 8px rgba(6, 182, 212, 0.4);
  }

  .dj-fader-slot {
    flex: 1;
    height: 4px;
    background: #000;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 2px;
    position: relative;
  }

  .dj-fader-knob {
    position: absolute;
    top: 50%;
    left: 0%;
    width: 24px;
    height: 18px;
    transform: translate(0, -50%);
    background: linear-gradient(135deg, #666 0%, #333 50%, #222 100%);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 3px;
    box-shadow:
      0 4px 10px rgba(0, 0, 0, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    transition: left 0.18s cubic-bezier(0.25, 0.8, 0.25, 1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dj-fader-knob::after {
    content: "";
    width: 2px;
    height: 100%;
    background: #fff;
    box-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
  }

  .dj-fader-knob.right {
    left: calc(100% - 24px);
  }

  /* ── Volume Popover ── */
  .volume-popover {
    position: absolute;
    bottom: 38px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(15, 15, 20, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 6px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
    z-index: 50;
    min-width: 150px;
    pointer-events: auto;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .vol-slider-pop {
    flex: 1;
    height: 3px;
    accent-color: #a855f7;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    outline: none;
  }

  /* ── WebGL Audio Visualizer ── */
  .visualizer-container {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 50%; /* Make it match vinyl disk shape initially */
    overflow: hidden;
    background: #050508;
    border: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    flex-direction: column;
    transition: border-radius 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .visualizer-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    z-index: 1;
  }

  .visualizer-overlay {
    position: absolute;
    bottom: 16px;
    left: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    z-index: 10;
  }

  .visualizer-container.fullscreen {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    border-radius: 0 !important; /* Full rectangle in fullscreen */
    border: none;
    z-index: 2000;
  }

  .visualizer-hover-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.22s ease;
    border-radius: 50%;
  }

  .visualizer-container:hover .visualizer-hover-overlay {
    opacity: 1;
  }
</style>
