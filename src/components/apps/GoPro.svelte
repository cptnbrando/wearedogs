<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<script>
  import { onMount, untrack } from "svelte";
  import { fade } from "svelte/transition";
  import { catalog } from "../../lib/videos.js";
  import { SHOW_SLUGS } from "../../lib/router.svelte.js";
  import DogsLogo from "../DogsLogo.svelte";
  import GoProCalculator from "./GoProCalculator.svelte";
  import {
    Play,
    Pause,
    SkipForward,
    SkipBack,
    Volume2,
    VolumeX,
    Maximize,
    ArrowRight,
    Plus,
    Trash2,
    Tv,
  } from "lucide-svelte";

  // Svelte 5 props
  let { goProShow = null, goProEpisode = null } = $props();

  // State management
  let isUnlocked = $state(false);
  let selectedShowKey = $state("Batman Beyond");
  let playingShowKey = $state("Batman Beyond");
  let playingEpisodeIndex = $state(0);
  let isPlaying = $state(false);
  let isMuted = $state(false);
  let currentTime = $state(0);
  let duration = $state(0);
  let isSamplerOpen = $state(false);
  let samples = $state([]);
  let password = $state("");
  let isVideoLoading = $state(false);
  let isShuffle = $state(false);
  let loopMode = $state("all"); // 'off' | 'single' | 'all'
  let isMoreControlsOpen = $state(false);
  let activeMobileView = $state("selector"); // 'selector' | 'player'
  let pendingSeekTime = $state(null); // number | null
  let showControls = $state(true);
  let controlsTimeout = null;

  // DOM bindings
  let videoElement = $state(null);
  let playerWrapperElement = $state(null);

  // Derived states
  const showData = $derived(catalog[selectedShowKey]);
  const playingShowData = $derived(catalog[playingShowKey]);
  const currentEpisode = $derived(playingShowData?.episodes[playingEpisodeIndex]);
  const videoUrl = $derived(
    playingShowData && currentEpisode && password
      ? `${playingShowData.baseUrl.replace("https://data.wearedogs.net", "")}${currentEpisode.file}?gopropass=${password}`
      : "",
  );

  /**
   * Format time in seconds to mm:ss format.
   * @param {number} seconds
   * @returns {string}
   */
  function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  /**
   * Load samples from localStorage or populate default presets.
   */
  function loadSamples() {
    const saved = localStorage.getItem("gopro_samples");
    if (saved) {
      try {
        samples = JSON.parse(saved);
      } catch (e) {
        console.warn("Error parsing samples from localStorage", e);
        loadDefaultSamples();
      }
    } else {
      loadDefaultSamples();
    }
  }

  /**
   * Populate default sampler triggers for the catalog.
   */
  function loadDefaultSamples() {
    samples = [
      {
        id: 1,
        name: "Batman Theme",
        showKey: "Batman Beyond",
        episodeIndex: 0,
        time: 0,
      },
      {
        id: 2,
        name: "Mr. Bean Math",
        showKey: "Mr. Bean",
        episodeIndex: 0,
        time: 30,
      },
      {
        id: 3,
        name: "Walking Dead Start",
        showKey: "The Walking Dead",
        episodeIndex: 0,
        time: 0,
      },
      {
        id: 4,
        name: "Bean Swimsuit",
        showKey: "Mr. Bean",
        episodeIndex: 0,
        time: 140,
      },
    ];
    localStorage.setItem("gopro_samples", JSON.stringify(samples));
  }

  /**
   * Toggle video playback (play / pause).
   */
  function togglePlay() {
    if (!videoElement) return;
    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement
        .play()
        .catch((err) => console.warn("Video play failed:", err));
    }
  }

  /**
   * Toggle video mute state.
   */
  function toggleMute() {
    if (!videoElement) return;
    videoElement.muted = !videoElement.muted;
    isMuted = videoElement.muted;
  }

  /**
   * Seek playback by relative offset.
   * @param {number} seconds - Positive or negative offset.
   */
  function skip(seconds) {
    if (!videoElement) return;
    videoElement.currentTime = Math.max(
      0,
      Math.min(duration, videoElement.currentTime + seconds),
    );
  }

  /**
   * Trigger native browser video element fullscreen.
   */
  function triggerFullscreen() {
    if (!playerWrapperElement) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.warn("Exit fullscreen failed:", err);
      });
    } else {
      playerWrapperElement.requestFullscreen().catch((err) => {
        console.warn("Fullscreen request failed:", err);
      });
    }
  }

  /**
   * Select a show for browsing, without affecting current ongoing playback.
   * @param {string} showKey
   */
  function selectShow(showKey) {
    selectedShowKey = showKey;
  }

  /**
   * Load and play a specific episode from the browsed show.
   * @param {number} index
   */
  /**
   * Core function to load and play an episode.
   * @param {string} showKey
   * @param {number} index
   */
  function loadAndPlayEpisode(showKey, index) {
    const targetShow = catalog[showKey];
    if (!targetShow || index < 0 || index >= targetShow.episodes.length) return;

    if (playingShowKey === showKey && playingEpisodeIndex === index) {
      if (videoElement) {
        videoElement.currentTime = 0;
        videoElement.play().catch((err) => console.warn(err));
      }
    } else {
      playingShowKey = showKey;
      playingEpisodeIndex = index;
      isPlaying = true;
    }
  }

  /**
   * Load and play a specific episode from the browsed show.
   * @param {number} index
   */
  function playEpisode(index) {
    activeMobileView = "player";
    loadAndPlayEpisode(selectedShowKey, index);
  }

  /**
   * Play the next episode in the current show, respecting shuffle and loop settings.
   */
  function playNextEpisode() {
    if (!playingShowData || playingShowData.episodes.length === 0) return;

    if (isShuffle) {
      if (playingShowData.episodes.length > 1) {
        let nextIdx = playingEpisodeIndex;
        while (nextIdx === playingEpisodeIndex) {
          nextIdx = Math.floor(Math.random() * playingShowData.episodes.length);
        }
        loadAndPlayEpisode(playingShowKey, nextIdx);
      } else {
        loadAndPlayEpisode(playingShowKey, 0);
      }
    } else {
      let nextIdx = playingEpisodeIndex + 1;
      if (nextIdx >= playingShowData.episodes.length) {
        if (loopMode === "all") {
          loadAndPlayEpisode(playingShowKey, 0);
        } else {
          isPlaying = false;
        }
      } else {
        loadAndPlayEpisode(playingShowKey, nextIdx);
      }
    }
  }

  /**
   * Play the previous episode in the current show, respecting shuffle and loop settings.
   */
  function playPrevEpisode() {
    if (!playingShowData || playingShowData.episodes.length === 0) return;

    if (isShuffle) {
      if (playingShowData.episodes.length > 1) {
        let prevIdx = playingEpisodeIndex;
        while (prevIdx === playingEpisodeIndex) {
          prevIdx = Math.floor(Math.random() * playingShowData.episodes.length);
        }
        loadAndPlayEpisode(playingShowKey, prevIdx);
      } else {
        loadAndPlayEpisode(playingShowKey, 0);
      }
    } else {
      let prevIdx = playingEpisodeIndex - 1;
      if (prevIdx < 0) {
        if (loopMode === "all") {
          loadAndPlayEpisode(playingShowKey, playingShowData.episodes.length - 1);
        } else {
          if (videoElement) {
            videoElement.currentTime = 0;
          }
        }
      } else {
        loadAndPlayEpisode(playingShowKey, prevIdx);
      }
    }
  }

  /**
   * Handle video ended events (automatic playlist transition).
   */
  function handleVideoEnded() {
    if (loopMode === "single") {
      if (videoElement) {
        videoElement.currentTime = 0;
        videoElement.play().catch((err) => console.warn(err));
      }
    } else {
      playNextEpisode();
    }
  }

  /**
   * Seek video playback to clicked progress percentage.
   * @param {MouseEvent} e
   */
  function handleSeek(e) {
    if (!videoElement || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = clickX / rect.width;
    videoElement.currentTime = pct * duration;
  }

  /**
   * Cycle loop mode between off, single episode, and all episodes.
   */
  function cycleLoopMode() {
    if (loopMode === "off") {
      loopMode = "single";
    } else if (loopMode === "single") {
      loopMode = "all";
    } else {
      loopMode = "off";
    }
  }

  /**
   * Seek and play a sample trigger.
   * @param {Object} sample
   */
  function playSample(sample) {
    const isShowChange = playingShowKey !== sample.showKey;
    const isEpChange = playingEpisodeIndex !== sample.episodeIndex;

    activeMobileView = "player";

    if (isEpChange || isShowChange) {
      playingShowKey = sample.showKey;
      playingEpisodeIndex = sample.episodeIndex;
      pendingSeekTime = sample.time;
      isPlaying = true;
    } else {
      if (videoElement) {
        videoElement.currentTime = sample.time;
        videoElement.play().catch((err) => console.warn(err));
        isPlaying = true;
      }
    }
  }

  /**
   * Capture current playback position as a new sample trigger.
   */
  function addSample() {
    if (!videoElement || !currentEpisode) return;
    const time = videoElement.currentTime;
    const newSample = {
      id: Date.now(),
      name: `Smp ${samples.length + 1} (${formatTime(time)})`,
      showKey: playingShowKey,
      episodeIndex: playingEpisodeIndex,
      time: time,
    };
    samples = [...samples, newSample];
    localStorage.setItem("gopro_samples", JSON.stringify(samples));
  }

  /**
   * Remove a sample trigger.
   * @param {number} id
   * @param {Event} e
   */
  function deleteSample(id, e) {
    e.stopPropagation();
    samples = samples.filter((s) => s.id !== id);
    localStorage.setItem("gopro_samples", JSON.stringify(samples));
  }

  /**
   * Unlock callback triggered by the calculator screen.
   * @param {string} pass
   */
  function handleUnlock(pass) {
    password = pass;
    isUnlocked = true;
    loadSamples();
  }

  /**
   * Handle global keyboard keydowns for sampler triggers and play/pause.
   * @param {KeyboardEvent} e
   */
  function handleGlobalKeyDown(e) {
    if (!isUnlocked) return;

    // Play/Pause shortcut (Space)
    if (e.key === " " && document.activeElement?.tagName !== "BUTTON") {
      e.preventDefault();
      togglePlay();
    }

    // Number keys 1-8 for sampler pads
    const num = parseInt(e.key, 10);
    if (!isNaN(num) && num >= 1 && num <= 8) {
      const sample = samples[num - 1];
      if (sample) {
        e.preventDefault();
        playSample(sample);
      }
    }
  }

  function resetControlsTimeout() {
    showControls = true;
    if (controlsTimeout) clearTimeout(controlsTimeout);
    if (isPlaying) {
      controlsTimeout = setTimeout(() => {
        showControls = false;
      }, 3000);
    }
  }

  function handleLoadedMetadata() {
    if (videoElement && pendingSeekTime !== null) {
      videoElement.currentTime = pendingSeekTime;
      pendingSeekTime = null;
    }
  }

  onMount(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/gopro-sw.js').then((reg) => {
        console.log('SW registered:', reg);
      }).catch((err) => {
        console.error('SW registration failed:', err);
      });
    }

    const savedPassword = localStorage.getItem("gopro_password");
    if (savedPassword) {
      password = savedPassword;
      isUnlocked = true;
      loadSamples();
    }
  });

  // Reactive trigger to play video when source changes
  $effect(() => {
    const url = videoUrl;
    untrack(() => {
      if (videoElement && url) {
        videoElement.load();
        if (isPlaying) {
          videoElement.play().catch((err) => console.warn("Play on source change failed:", err));
        }
      }
    });
  });

  // Reset controls timeout when isPlaying state changes
  $effect(() => {
    const playing = isPlaying;
    untrack(() => {
      resetControlsTimeout();
    });
  });

  // Deep link parsing reactive sync
  $effect(() => {
    if (isUnlocked && goProShow) {
      const resolvedShow =
        SHOW_SLUGS[goProShow.toLowerCase()] || SHOW_SLUGS[goProShow];
      if (resolvedShow && catalog[resolvedShow]) {
        selectedShowKey = resolvedShow;

        if (goProEpisode) {
          const episodes = catalog[resolvedShow].episodes;
          const matchIdx = episodes.findIndex((ep) =>
            ep.file.toLowerCase().includes(goProEpisode.toLowerCase()),
          );
          if (matchIdx !== -1) {
            playingShowKey = resolvedShow;
            playingEpisodeIndex = matchIdx;
            isPlaying = true;
            activeMobileView = "player";
          }
        }
      }
    }
  });
</script>

<svelte:window onkeydown={handleGlobalKeyDown} />

{#if !isUnlocked}
  <!-- Secure calculator gate -->
  <div
    class="w-full h-full bg-[#0a0a0f] flex items-center justify-center"
    transition:fade
  >
    <GoProCalculator onUnlock={handleUnlock} />
  </div>
{:else}
  <!-- Main Television-Friendly Streaming Interface -->
  <div
    class="gopro-app-layout w-full h-[100dvh] bg-gradient-to-br from-[#0c0d14] via-[#050608] to-[#0a0a0f] text-white p-3 sm:p-4 font-sans flex flex-col gap-3 sm:gap-4 overflow-hidden selection:bg-cyan-500 selection:text-black"
    transition:fade
  >
    <!-- TV Header -->
    <header
      class="flex-shrink-0 flex items-center justify-between border-b border-white/5 pb-2"
    >
      <div class="flex items-center gap-2 sm:gap-3">
        <div
          class="p-1.5 sm:p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg shadow-cyan-500/10 flex items-center justify-center"
        >
          <Tv class="w-4 h-4 sm:w-6 sm:h-6 text-white" />
        </div>
        <div class="flex items-center">
          <h1
            class="text-sm sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-cyan-400 2xl:text-3xl leading-none"
          >
            DOGS TV
          </h1>
        </div>
      </div>
      <div
        class="text-[9px] sm:text-[11px] font-mono text-cyan-400 font-semibold bg-cyan-950/30 border border-cyan-800/30 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wide"
      >
        Verified
      </div>
    </header>

    <!-- Five-Viewport Grid Setup -->
    <main
      class="flex-grow grid grid-cols-1 gap-4 w-full max-w-7xl mx-auto overflow-hidden xl:grid-cols-3"
    >
      <!-- LEFT SECTION: Shows List & Episode Selector (col-span-1) -->
      <section
        class="flex flex-col gap-3 sm:gap-4 overflow-hidden order-2 xl:order-1 xl:col-span-1 {activeMobileView ===
        'selector'
          ? 'flex'
          : 'hidden xl:flex'}"
      >
        <!-- Show Selection Carousel -->
        <div class="flex flex-col gap-1.5 flex-shrink-0">
          <h2 class="text-xs uppercase font-bold text-white/50 tracking-wider">
            Select Show
          </h2>

          <div
            class="flex flex-col gap-2 sm:grid sm:grid-cols-3 xl:flex xl:flex-col"
          >
            {#each Object.keys(catalog) as showKey}
              {@const show = catalog[showKey]}
              <button
                onclick={() => selectShow(showKey)}
                class="w-full text-left p-2.5 sm:p-3.5 rounded-xl flex items-center justify-between transition-all duration-200 border group focus:ring-2 focus:ring-cyan-400 focus:outline-none cursor-pointer {selectedShowKey ===
                showKey
                  ? 'bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border-cyan-500/50 shadow-md shadow-cyan-950/40'
                  : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}"
              >
                <div class="flex items-center gap-2.5">
                  <span
                    class="text-xl sm:text-2xl group-hover:scale-110 transition-transform"
                    >{show.symbol}</span
                  >
                  <div>
                    <div
                      class="font-bold text-xs sm:text-sm tracking-tight text-white"
                    >
                      {showKey}
                    </div>
                    <div
                      class="text-[9px] sm:text-[10px] text-white/40 font-mono mt-0.5"
                    >
                      {show.episodes.length} Episodes
                    </div>
                  </div>
                </div>
                <div
                  class="text-[10px] sm:text-xs font-mono text-cyan-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {selectedShowKey === showKey ? "Active" : "Open ➔"}
                </div>
              </button>
            {/each}
          </div>
        </div>

        <!-- Episode Selector List -->
        <div class="flex flex-col gap-1.5 flex-grow overflow-hidden">
          <h2 class="text-xs uppercase font-bold text-white/50 tracking-wider">
            Episodes ({showData?.episodes.length})
          </h2>

          <div
            class="flex-grow overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-cyan-500/20"
          >
            {#if showData}
              {#each showData.episodes as ep, i}
                <button
                  onclick={() => playEpisode(i)}
                  class="w-full text-left p-2.5 sm:p-3 rounded-lg flex items-center justify-between text-[11px] sm:text-xs transition-all duration-150 border focus:ring-2 focus:ring-cyan-400 focus:outline-none cursor-pointer {playingShowKey === selectedShowKey && playingEpisodeIndex === i
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-semibold'
                    : 'bg-black/20 border-white/5 text-white/80 hover:bg-white/5 hover:text-white'}"
                >
                  <div class="flex flex-col gap-0.5 pr-2 truncate">
                    <span class="font-bold truncate text-white"
                      >Ep {ep.id}: {ep.title}</span
                    >
                    {#if ep.description}
                      <span
                        class="text-[9px] sm:text-[10px] text-white/40 truncate font-normal"
                        >{ep.description}</span
                      >
                    {/if}
                  </div>
                  <span
                    class="font-mono text-[8px] sm:text-[9px] uppercase px-1 py-0.5 bg-white/5 rounded text-white/50"
                  >
                    {ep.file.split(".").pop()}
                  </span>
                </button>
              {/each}
            {/if}
          </div>
        </div>
      </section>

      <!-- RIGHT SECTION: Player & Sampler (col-span-2) -->
      <section
        class="flex flex-col gap-3 sm:gap-4 overflow-hidden order-1 xl:order-2 xl:col-span-2 {activeMobileView ===
        'player'
          ? 'flex'
          : 'hidden xl:flex'}"
      >
        <!-- Back to Episodes Button (mobile-only) -->
        <button
          onclick={() => {
            activeMobileView = "selector";
            if (videoElement) {
              videoElement.pause();
            }
          }}
          class="xl:hidden self-start flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-xs font-bold text-cyan-400 transition focus:outline-none focus:ring-1 focus:ring-cyan-400"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back to Episodes</span>
        </button>

        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- Video Player Wrapper -->
        <div
          bind:this={playerWrapperElement}
          onmousemove={resetControlsTimeout}
          onclick={resetControlsTimeout}
          class="relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col flex-shrink-0 transition-all duration-300 {isMoreControlsOpen
            ? '-translate-y-4 sm:-translate-y-8 xl:-translate-y-16'
            : ''}"
        >
          <!-- Responsive aspect-video container -->
          <div
            class="w-full aspect-video max-h-[52dvh] bg-black relative flex items-center justify-center"
          >
            {#if isVideoLoading}
              <div
                class="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-3 z-20"
                transition:fade
              >
                <div
                  class="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"
                ></div>
                <span
                  class="text-xs font-semibold tracking-wider text-cyan-400 font-mono uppercase"
                  >Loading Video...</span
                >
              </div>
            {/if}

            <!-- Skip Intro Overlay -->
            {#if showControls && showData && showData.introEnd > showData.introStart && currentTime >= showData.introStart && currentTime <= showData.introEnd}
              <button
                onclick={() => {
                  if (videoElement) {
                    videoElement.currentTime = showData.introEnd;
                  }
                }}
                class="absolute bottom-28 right-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-[10px] rounded-lg shadow-lg border border-cyan-300/30 z-30 transition-all duration-150 uppercase tracking-wider cursor-pointer"
                transition:fade
              >
                Skip Intro
              </button>
            {/if}

            <!-- Skip Outro Overlay -->
            {#if showControls && duration > 90 && currentTime >= duration - 90}
              <button
                onclick={handleVideoEnded}
                class="absolute bottom-28 right-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-[10px] rounded-lg shadow-lg border border-cyan-300/30 z-30 transition-all duration-150 uppercase tracking-wider cursor-pointer"
                transition:fade
              >
                Skip Outro / Next
              </button>
            {/if}

            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <video
              bind:this={videoElement}
              src={videoUrl}
              class="w-full h-full object-contain cursor-pointer"
              playsinline
              onclick={togglePlay}
              onplay={() => (isPlaying = true)}
              onpause={() => (isPlaying = false)}
              onended={handleVideoEnded}
              onwaiting={() => (isVideoLoading = true)}
              onplaying={() => (isVideoLoading = false)}
              onloadstart={() => (isVideoLoading = true)}
              oncanplay={() => (isVideoLoading = false)}
              onerror={() => (isVideoLoading = false)}
              onloadedmetadata={handleLoadedMetadata}
              ontimeupdate={() => {
                if (videoElement) currentTime = videoElement.currentTime;
              }}
              ondurationchange={() => {
                if (videoElement) duration = videoElement.duration;
              }}
            >
              <track kind="captions" />
            </video>

            <!-- Custom Controls Overlay (glued to bottom inside video container, disappears on inactivity) -->
            <div
              class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/80 to-transparent backdrop-blur-sm border-t border-white/10 flex flex-col gap-3 z-30 transition-all duration-300 {showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}"
            >
              <!-- Progress bar -->
              <div
                class="flex items-center justify-between text-[10px] font-mono text-white/50"
              >
                <span>{formatTime(currentTime)}</span>
                <button
                  type="button"
                  onclick={handleSeek}
                  class="flex-grow mx-3 h-1.5 bg-white/10 rounded-full overflow-hidden relative cursor-pointer hover:h-2 transition-all border-none focus:outline-none"
                  aria-label="Seek video"
                >
                  <div
                    class="h-full bg-cyan-400 rounded-full pointer-events-none"
                    style="width: {(currentTime / (duration || 1)) * 100}%"
                  ></div>
                </button>
                <span>{formatTime(duration)}</span>
              </div>

              <!-- Controls row -->
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-2">
                  <!-- Previous Episode -->
                  <button
                    onclick={playPrevEpisode}
                    class="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition focus:ring-2 focus:ring-cyan-400 focus:outline-none cursor-pointer"
                    aria-label="Previous Episode"
                  >
                    <SkipBack class="w-4 h-4 fill-current" />
                  </button>

                  <!-- Play/Pause -->
                  <button
                    onclick={togglePlay}
                    class="p-2.5 bg-white text-black hover:bg-cyan-400 hover:text-black rounded-full transition focus:ring-2 focus:ring-cyan-400 focus:outline-none cursor-pointer"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {#if isPlaying}
                      <Pause class="w-4 h-4 fill-current" />
                    {:else}
                      <Play class="w-4 h-4 fill-current" />
                    {/if}
                  </button>

                  <!-- Next Episode -->
                  <button
                    onclick={playNextEpisode}
                    class="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition focus:ring-2 focus:ring-cyan-400 focus:outline-none cursor-pointer"
                    aria-label="Next Episode"
                  >
                    <SkipForward class="w-4 h-4 fill-current" />
                  </button>
                </div>

                <!-- Episode Display Title -->
                {#if currentEpisode}
                  <div
                    class="text-xs font-semibold truncate max-w-[200px] text-white/80 hidden sm:block"
                  >
                    {currentEpisode.title}
                  </div>
                {/if}

                <!-- Volume & Fullscreen Controls -->
                <div class="flex items-center gap-2">
                  <button
                    onclick={triggerFullscreen}
                    class="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition focus:ring-2 focus:ring-cyan-400 focus:outline-none cursor-pointer"
                    aria-label="Enter fullscreen"
                  >
                    <Maximize class="w-4 h-4" />
                  </button>

                  <!-- Expand/Collapse More Controls -->
                  <button
                    onclick={() => (isMoreControlsOpen = !isMoreControlsOpen)}
                    class="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition focus:ring-2 focus:ring-cyan-400 focus:outline-none cursor-pointer"
                    aria-label="Toggle extra controls"
                  >
                    <svg
                      class="w-4 h-4 text-white/70 transition-transform duration-200 {isMoreControlsOpen
                        ? 'rotate-180'
                        : ''}"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- More Controls Panel (Collapsible) -->
              {#if isMoreControlsOpen}
                <div
                  class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5"
                  transition:fade
                >
                  <!-- Left: skip 10s backward / forward, Volume -->
                  <div class="flex items-center gap-2">
                    <button
                      onclick={() => skip(-10)}
                      class="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-mono transition cursor-pointer"
                      title="Rewind 10s"
                    >
                      -10s
                    </button>
                    <button
                      onclick={() => skip(10)}
                      class="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-mono transition cursor-pointer"
                      title="Forward 10s"
                    >
                      +10s
                    </button>

                    <span class="w-px h-4 bg-white/10 mx-1"></span>

                    <button
                      onclick={toggleMute}
                      class="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition cursor-pointer"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {#if isMuted}
                        <VolumeX class="w-3.5 h-3.5" />
                      {:else}
                        <Volume2 class="w-3.5 h-3.5" />
                      {/if}
                    </button>
                  </div>

                  <!-- Right: Shuffle, Loop, Sampler trigger -->
                  <div class="flex items-center gap-2">
                    <!-- Shuffle button -->
                    <button
                      onclick={() => (isShuffle = !isShuffle)}
                      class="px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer {isShuffle
                        ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                        : 'bg-white/5 text-white/70 border border-white/5 hover:bg-white/10'}"
                    >
                      Shuffle: {isShuffle ? "ON" : "OFF"}
                    </button>

                    <!-- Loop Mode button -->
                    <button
                      onclick={cycleLoopMode}
                      class="px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer {loopMode !==
                      'off'
                        ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                        : 'bg-white/5 text-white/70 border border-white/5 hover:bg-white/10'}"
                    >
                      Loop: {loopMode.toUpperCase()}
                    </button>

                    <span class="w-px h-4 bg-white/10 mx-1"></span>

                    <!-- Sampler Open Button -->
                    <button
                      onclick={() => (isSamplerOpen = !isSamplerOpen)}
                      class="px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer {isSamplerOpen
                        ? 'bg-cyan-500 text-black font-extrabold shadow-md shadow-cyan-500/20'
                        : 'bg-cyan-950/50 text-cyan-400 border border-cyan-800/30 hover:bg-cyan-900/30'}"
                    >
                      Sampler
                    </button>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>

        <!-- Scrollable Details & Sampler Pane -->
        <div class="flex-grow overflow-y-auto flex flex-col gap-3 sm:gap-4 scrollbar-thin pr-1 pb-4">
          <!-- Hidden Sampler Drawer -->
          {#if isSamplerOpen}
          <div
            class="bg-gradient-to-br from-[#0f111a] to-[#07070a] border border-cyan-500/20 rounded-2xl p-5 flex flex-col gap-4 shadow-xl shadow-cyan-950/10"
            transition:fade
          >
            <div
              class="flex items-center justify-between border-b border-cyan-500/10 pb-3"
            >
              <div>
                <h3
                  class="text-sm font-bold text-cyan-400 tracking-wide uppercase"
                >
                  Monkey Sampler Console
                </h3>
                <p class="text-[9px] text-white/30 font-semibold font-mono">
                  Press keys 1-8 to trigger samples
                </p>
              </div>
              <button
                onclick={addSample}
                class="px-3.5 py-1.5 bg-cyan-500 text-black hover:bg-cyan-400 transition text-[10px] font-bold rounded-lg flex items-center gap-1 focus:ring-2 focus:ring-cyan-400 focus:outline-none cursor-pointer"
              >
                <Plus class="w-3.5 h-3.5" />
                <span>Add Time Sample</span>
              </button>
            </div>

            <!-- Sampler Pad Grid -->
            {#if samples.length === 0}
              <div
                class="text-center py-6 text-xs text-white/30 font-semibold uppercase tracking-wider font-mono"
              >
                No custom samples. Click "+ Add Time Sample" above.
              </div>
            {:else}
              <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {#each samples as sample, idx}
                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                  <div
                    role="button"
                    tabindex="0"
                    onclick={() => playSample(sample)}
                    onkeydown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        playSample(sample);
                      }
                    }}
                    class="calc-btn text-left p-3 rounded-xl border relative overflow-hidden transition-all duration-150 flex flex-col justify-between h-20 group focus:ring-2 focus:ring-cyan-400 focus:outline-none cursor-pointer {playingShowKey ===
                      sample.showKey &&
                    playingEpisodeIndex === sample.episodeIndex
                      ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300'
                      : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:border-white/10'}"
                  >
                    <!-- Trigger Key Badge -->
                    <span
                      class="absolute top-2 right-2 text-[8px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-400/20 px-1 rounded"
                    >
                      Pad {idx + 1}
                    </span>

                    <span
                      class="text-[10px] font-bold truncate pr-6 text-white group-hover:text-cyan-300 transition-colors"
                    >
                      {sample.name}
                    </span>

                    <div class="flex items-center justify-between w-full mt-2">
                      <span
                        class="text-[9px] text-white/40 font-mono tracking-tighter"
                      >
                        {sample.showKey.split(" ")[0]}
                      </span>
                      <button
                        onclick={(e) => deleteSample(sample.id, e)}
                        class="p-1 rounded text-white/30 hover:text-red-400 hover:bg-red-950/20 transition focus:ring-1 focus:ring-red-400 focus:outline-none cursor-pointer"
                        title="Delete sample"
                      >
                        <Trash2 class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
        </div>
      </section>
    </main>

    <!-- TV Footer Watermark -->
    <div
      class="flex items-center justify-end gap-1 opacity-20 text-[9px] uppercase tracking-widest pointer-events-none mt-auto"
    >
      <span>dogs</span>
      <DogsLogo size="panel" class="w-3.5 h-3.5" />
    </div>
  </div>
{/if}

<style lang="scss">
  .gopro-app-layout {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
  }

  .calc-btn {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    &:active {
      transform: scale(0.97);
    }
  }
</style>
