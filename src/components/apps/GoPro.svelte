<script>
  import { onMount } from "svelte";
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
    Tv
  } from "lucide-svelte";

  // Svelte 5 props
  let { goProShow = null, goProEpisode = null } = $props();

  // State management
  let isUnlocked = $state(false);
  let selectedShowKey = $state("Batman Beyond");
  let selectedEpisodeIndex = $state(0);
  let isPlaying = $state(false);
  let isMuted = $state(false);
  let currentTime = $state(0);
  let duration = $state(0);
  let isSamplerOpen = $state(false);
  let samples = $state([]);

  // DOM bindings
  let videoElement = $state(null);

  // Derived states
  const showData = $derived(catalog[selectedShowKey]);
  const currentEpisode = $derived(showData?.episodes[selectedEpisodeIndex]);
  const videoUrl = $derived(
    showData && currentEpisode
      ? `${showData.baseUrl}${currentEpisode.file}`
      : ""
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
      videoElement.play().catch((err) => console.warn("Video play failed:", err));
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
      Math.min(duration, videoElement.currentTime + seconds)
    );
  }

  /**
   * Trigger native browser video element fullscreen.
   */
  function triggerFullscreen() {
    if (!videoElement) return;
    videoElement.requestFullscreen().catch((err) => {
      console.warn("Fullscreen request failed:", err);
    });
  }

  /**
   * Select a show and reset the current episode index.
   * @param {string} showKey
   */
  function selectShow(showKey) {
    selectedShowKey = showKey;
    selectedEpisodeIndex = 0;
    isPlaying = false;
    if (videoElement) {
      videoElement.currentTime = 0;
    }
  }

  /**
   * Load and play a specific episode.
   * @param {number} index
   */
  function playEpisode(index) {
    if (!showData || index < 0 || index >= showData.episodes.length) return;
    selectedEpisodeIndex = index;
    isPlaying = true;
    if (videoElement) {
      videoElement.currentTime = 0;
      // Small timeout to allow state/source bind sync
      setTimeout(() => {
        if (videoElement) {
          videoElement.load();
          videoElement.play().catch((err) => console.warn(err));
        }
      }, 50);
    }
  }

  /**
   * Seek and play a sample trigger.
   * @param {Object} sample
   */
  function playSample(sample) {
    const isShowChange = selectedShowKey !== sample.showKey;
    const isEpChange = selectedEpisodeIndex !== sample.episodeIndex;

    if (isShowChange) {
      selectedShowKey = sample.showKey;
    }
    if (isEpChange || isShowChange) {
      selectedEpisodeIndex = sample.episodeIndex;
    }

    setTimeout(() => {
      if (videoElement) {
        videoElement.currentTime = sample.time;
        videoElement.play().catch((err) => console.warn(err));
        isPlaying = true;
      }
    }, isShowChange || isEpChange ? 350 : 0);
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
      showKey: selectedShowKey,
      episodeIndex: selectedEpisodeIndex,
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
   */
  function handleUnlock() {
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

  onMount(() => {
    const savedPassword = localStorage.getItem("gopro_password");
    if (savedPassword) {
      isUnlocked = true;
      loadSamples();
    }
  });

  // Deep link parsing reactive sync
  $effect(() => {
    if (isUnlocked && goProShow) {
      const resolvedShow = SHOW_SLUGS[goProShow.toLowerCase()] || SHOW_SLUGS[goProShow];
      if (resolvedShow && catalog[resolvedShow]) {
        selectedShowKey = resolvedShow;

        if (goProEpisode) {
          const episodes = catalog[resolvedShow].episodes;
          const matchIdx = episodes.findIndex((ep) =>
            ep.file.toLowerCase().includes(goProEpisode.toLowerCase())
          );
          if (matchIdx !== -1) {
            selectedEpisodeIndex = matchIdx;
            isPlaying = true;
          }
        }
      }
    }
  });
</script>

<svelte:window onkeydown={handleGlobalKeyDown} />

{#if !isUnlocked}
  <!-- Secure calculator gate -->
  <div class="w-full h-full bg-[#0a0a0f] flex items-center justify-center" transition:fade>
    <GoProCalculator onUnlock={handleUnlock} />
  </div>
{:else}
  <!-- Main Television-Friendly Streaming Interface -->
  <div
    class="gopro-app-layout w-full min-h-full bg-gradient-to-br from-[#0c0d14] via-[#050608] to-[#0a0a0f] text-white p-4 font-sans flex flex-col gap-6 overflow-y-auto selection:bg-cyan-500 selection:text-black"
    transition:fade
  >
    <!-- TV Header -->
    <header class="flex flex-col gap-2 border-b border-white/5 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/10">
          <Tv class="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 class="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-cyan-400 2xl:text-3xl">
            WEAREDOGS STREAM
          </h1>
          <p class="text-[10px] text-white/40 tracking-wider font-semibold font-mono uppercase">
            Grandpa and Monkey Media Player
          </p>
        </div>
      </div>
      <div class="text-[11px] font-mono text-cyan-400 font-semibold bg-cyan-950/30 border border-cyan-800/30 px-3 py-1 rounded-full self-start sm:self-auto uppercase tracking-wide">
        Passcode Verified
      </div>
    </header>

    <!-- Five-Viewport Grid Setup -->
    <main class="grid grid-cols-1 gap-6 w-full max-w-7xl mx-auto xl:grid-cols-3">
      
      <!-- LEFT SECTION: Shows List & Episode Selector (col-span-1) -->
      <section class="flex flex-col gap-6 xl:col-span-1">
        
        <!-- Show Selection Carousel -->
        <div class="flex flex-col gap-2">
          <h2 class="text-xs uppercase font-bold text-white/50 tracking-wider">Select Show</h2>
          
          <div class="flex flex-col gap-3 sm:grid sm:grid-cols-3 xl:flex xl:flex-col">
            {#each Object.keys(catalog) as showKey}
              {@const show = catalog[showKey]}
              <button
                onclick={() => selectShow(showKey)}
                class="w-full text-left p-4 rounded-xl flex items-center justify-between transition-all duration-200 border group focus:ring-2 focus:ring-cyan-400 focus:outline-none {selectedShowKey === showKey
                  ? 'bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border-cyan-500/50 shadow-md shadow-cyan-950/40'
                  : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}"
              >
                <div class="flex items-center gap-3">
                  <span class="text-2xl group-hover:scale-110 transition-transform">{show.symbol}</span>
                  <div>
                    <div class="font-bold text-sm tracking-tight text-white">{showKey}</div>
                    <div class="text-[10px] text-white/40 font-mono mt-0.5">{show.episodes.length} Episodes</div>
                  </div>
                </div>
                <div class="text-xs font-mono text-cyan-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {selectedShowKey === showKey ? "Active" : "Open ➔"}
                </div>
              </button>
            {/each}
          </div>
        </div>

        <!-- Episode Selector List -->
        <div class="flex flex-col gap-2 flex-grow">
          <h2 class="text-xs uppercase font-bold text-white/50 tracking-wider">Episodes ({showData?.episodes.length})</h2>
          
          <div class="max-h-[300px] xl:max-h-[420px] overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-cyan-500/20">
            {#if showData}
              {#each showData.episodes as ep, i}
                <button
                  onclick={() => playEpisode(i)}
                  class="w-full text-left p-3 rounded-lg flex items-center justify-between text-xs transition-all duration-150 border focus:ring-2 focus:ring-cyan-400 focus:outline-none {selectedEpisodeIndex === i
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-semibold'
                    : 'bg-black/20 border-white/5 text-white/80 hover:bg-white/5 hover:text-white'}"
                >
                  <div class="flex flex-col gap-1 pr-2 truncate">
                    <span class="font-bold truncate text-white">Ep {ep.id}: {ep.title}</span>
                    {#if ep.description}
                      <span class="text-[10px] text-white/40 truncate font-normal">{ep.description}</span>
                    {/if}
                  </div>
                  <span class="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-white/5 rounded text-white/50">
                    {ep.file.split(".").pop()}
                  </span>
                </button>
              {/each}
            {/if}
          </div>
        </div>
      </section>

      <!-- RIGHT SECTION: Player & Sampler (col-span-2) -->
      <section class="flex flex-col gap-6 xl:col-span-2">
        
        <!-- Video Player Wrapper -->
        <div class="relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col">
          
          <!-- Responsive aspect-video container -->
          <div class="w-full aspect-video bg-black relative flex items-center justify-center">
            <!-- Source dynamically loaded using videoUrl -->
            <video
              bind:this={videoElement}
              src={videoUrl}
              class="w-full h-full object-contain"
              playsinline
              controls
              onplay={() => (isPlaying = true)}
              onpause={() => (isPlaying = false)}
              ontimeupdate={() => {
                if (videoElement) currentTime = videoElement.currentTime;
              }}
              ondurationchange={() => {
                if (videoElement) duration = videoElement.duration;
              }}
            >
              <track kind="captions" />
            </video>
          </div>

          <!-- Grandpa-Friendly Control Bar -->
          <div class="p-4 bg-gradient-to-t from-black/80 to-black/20 backdrop-blur border-t border-white/5 flex flex-col gap-3">
            <!-- Progress bar -->
            <div class="flex items-center justify-between text-[10px] font-mono text-white/50">
              <span>{formatTime(currentTime)}</span>
              <div class="flex-grow mx-3 h-1 bg-white/10 rounded-full overflow-hidden relative">
                <div
                  class="h-full bg-cyan-400 rounded-full"
                  style="width: {(currentTime / (duration || 1)) * 100}%"
                ></div>
              </div>
              <span>{formatTime(duration)}</span>
            </div>

            <!-- Controls row -->
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <!-- Play/Pause -->
                <button
                  onclick={togglePlay}
                  class="p-2.5 bg-white text-black hover:bg-cyan-400 hover:text-black rounded-full transition focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {#if isPlaying}
                    <Pause class="w-4 h-4 fill-current" />
                  {:else}
                    <Play class="w-4 h-4 fill-current" />
                  {/if}
                </button>

                <!-- Backward 10s -->
                <button
                  onclick={() => skip(-10)}
                  class="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  aria-label="Skip back 10 seconds"
                >
                  <SkipBack class="w-4 h-4" />
                </button>

                <!-- Forward 10s -->
                <button
                  onclick={() => skip(10)}
                  class="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  aria-label="Skip forward 10 seconds"
                >
                  <SkipForward class="w-4 h-4" />
                </button>
              </div>

              <!-- Episode Display Title -->
              {#if currentEpisode}
                <div class="text-xs font-semibold truncate max-w-[200px] text-white/80 hidden sm:block">
                  {currentEpisode.title}
                </div>
              {/if}

              <!-- Volume & Fullscreen Controls -->
              <div class="flex items-center gap-2">
                <button
                  onclick={toggleMute}
                  class="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {#if isMuted}
                    <VolumeX class="w-4 h-4" />
                  {:else}
                    <Volume2 class="w-4 h-4" />
                  {/if}
                </button>

                <button
                  onclick={triggerFullscreen}
                  class="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  aria-label="Enter fullscreen"
                >
                  <Maximize class="w-4 h-4" />
                </button>

                <!-- Sampler Open Button -->
                <button
                  onclick={() => (isSamplerOpen = !isSamplerOpen)}
                  class="px-3.5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-1 focus:ring-2 focus:ring-cyan-400 focus:outline-none {isSamplerOpen
                    ? 'bg-cyan-500 text-black font-extrabold'
                    : 'bg-cyan-950/50 text-cyan-400 border border-cyan-800/30'}"
                  aria-label="Toggle Sampler Panel"
                >
                  <span>Sampler</span>
                  <ArrowRight class="w-3 h-3 transition-transform duration-200 {isSamplerOpen ? 'rotate-90' : ''}" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Hidden Sampler Drawer -->
        {#if isSamplerOpen}
          <div
            class="bg-gradient-to-br from-[#0f111a] to-[#07070a] border border-cyan-500/20 rounded-2xl p-5 flex flex-col gap-4 shadow-xl shadow-cyan-950/10"
            transition:fade
          >
            <div class="flex items-center justify-between border-b border-cyan-500/10 pb-3">
              <div>
                <h3 class="text-sm font-bold text-cyan-400 tracking-wide uppercase">Monkey Sampler Console</h3>
                <p class="text-[9px] text-white/30 font-semibold font-mono">Press keys 1-8 to trigger samples</p>
              </div>
              <button
                onclick={addSample}
                class="px-3.5 py-1.5 bg-cyan-500 text-black hover:bg-cyan-400 transition text-[10px] font-bold rounded-lg flex items-center gap-1 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              >
                <Plus class="w-3.5 h-3.5" />
                <span>Add Time Sample</span>
              </button>
            </div>

            <!-- Sampler Pad Grid -->
            {#if samples.length === 0}
              <div class="text-center py-6 text-xs text-white/30 font-semibold uppercase tracking-wider font-mono">
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
                    class="calc-btn text-left p-3 rounded-xl border relative overflow-hidden transition-all duration-150 flex flex-col justify-between h-20 group focus:ring-2 focus:ring-cyan-400 focus:outline-none cursor-pointer {selectedShowKey === sample.showKey && selectedEpisodeIndex === sample.episodeIndex
                      ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300'
                      : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:border-white/10'}"
                  >
                    <!-- Trigger Key Badge -->
                    <span class="absolute top-2 right-2 text-[8px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-400/20 px-1 rounded">
                      Pad {idx + 1}
                    </span>

                    <span class="text-[10px] font-bold truncate pr-6 text-white group-hover:text-cyan-300 transition-colors">
                      {sample.name}
                    </span>

                    <div class="flex items-center justify-between w-full mt-2">
                      <span class="text-[9px] text-white/40 font-mono tracking-tighter">
                        {sample.showKey.split(" ")[0]}
                      </span>
                      <button
                        onclick={(e) => deleteSample(sample.id, e)}
                        class="p-1 rounded text-white/30 hover:text-red-400 hover:bg-red-950/20 transition focus:ring-1 focus:ring-red-400 focus:outline-none"
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

        <!-- Show Meta Info -->
        {#if showData?.meta}
          <div class="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
            <h3 class="text-xs font-bold uppercase tracking-wider text-white/50">Show Details</h3>
            <div class="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
              <div>
                <span class="text-white/40 font-mono block uppercase text-[9px]">Release</span>
                <span class="font-bold text-white/80">{showData.meta.release || "N/A"}</span>
              </div>
              <div>
                <span class="text-white/40 font-mono block uppercase text-[9px]">Rating</span>
                <span class="font-bold text-white/80">{showData.meta.rating || "N/A"}</span>
              </div>
              <div>
                <span class="text-white/40 font-mono block uppercase text-[9px]">Runtime</span>
                <span class="font-bold text-white/80">{showData.meta.runtime || "N/A"}</span>
              </div>
              <div>
                <span class="text-white/40 font-mono block uppercase text-[9px]">Score</span>
                <span class="font-bold text-cyan-400">{showData.meta.score || "N/A"}</span>
              </div>
            </div>

            {#if showData.meta.actors}
              <div>
                <span class="text-white/40 font-mono block uppercase text-[9px] mb-1">Starring</span>
                <div class="flex flex-wrap gap-1.5">
                  {#each showData.meta.actors as actor}
                    <span class="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[10px] text-white/70">
                      {actor}
                    </span>
                  {/each}
                </div>
              </div>
            {/if}

            {#if showData.meta.facts}
              <div class="text-xs border-t border-white/5 pt-3">
                <span class="text-white/40 font-mono block uppercase text-[9px] mb-1">Trivia / Fact</span>
                <p class="text-white/60 leading-relaxed text-[11px]">{showData.meta.facts}</p>
              </div>
            {/if}
          </div>
        {/if}
      </section>
    </main>

    <!-- TV Footer Watermark -->
    <div class="flex items-center justify-end gap-1 opacity-20 text-[9px] uppercase tracking-widest pointer-events-none mt-auto">
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
