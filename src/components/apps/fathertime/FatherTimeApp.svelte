<script>
  import { onMount } from "svelte";
  import {
    Hourglass as HourglassIcon,
    Watch,
    Timer as TimerIcon,
    AlarmClock,
    Globe,
    Server,
    History as HistoryIcon,
    Music,
    Mic,
    Home,
  } from "lucide-svelte";

  // Tab Views
  import Hourglass from "./Hourglass.svelte";
  import StopwatchTab from "./StopwatchTab.svelte";
  import TimerTab from "./TimerTab.svelte";
  import AlarmsTab from "./AlarmsTab.svelte";
  import WorldClockTab from "./WorldClockTab.svelte";
  import TimeServersTab from "./TimeServersTab.svelte";
  import HistoryTab from "./HistoryTab.svelte";
  import MetronomeTab from "./MetronomeTab.svelte";
  import TuningForkTab from "./TuningForkTab.svelte";
  import { Metronome } from "../../../lib/metronome.svelte.js";
  import MetronomeVisual from "./MetronomeVisual.svelte";

  let activeTab = $state("hourglass");
  let showMobileTiles = $state(true);
  let nowDate = $state(new Date());
  let hourglassMode = $state("minute");
  let sharedMetronome = $state(new Metronome());
  let digitalTime = $state("");
  let digitalDate = $state("");
  let timeTicker = null;

  // Tabs config
  const TABS_CONFIG = [
    { id: "hourglass", label: "Hourglass", icon: HourglassIcon },
    { id: "stopwatch", label: "Stopwatch", icon: Watch },
    { id: "timer", label: "Timer", icon: TimerIcon },
    { id: "alarms", label: "Alarms", icon: AlarmClock },
    { id: "worldclock", label: "World Clock", icon: Globe },
    { id: "servers", label: "Servers", icon: Server },
    { id: "history", label: "History", icon: HistoryIcon },
    { id: "metronome", label: "Metronome", icon: Music },
    { id: "tuner", label: "Tuning Fork", icon: Mic },
  ];

  function updateClock() {
    nowDate = new Date();
    digitalTime = nowDate.toLocaleTimeString("en-US", { hour12: true });
    digitalDate = nowDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  let isMobileViewport = $state(false);

  function handlePopState(e) {
    if (!isMobileViewport) return;
    const state = e.state;
    if (state && state.app === "stopwatch") {
      if (state.depth === 2) {
        showMobileTiles = true;
      } else if (state.depth === 3 && state.subTab) {
        activeTab = state.subTab;
        showMobileTiles = false;
      }
    }
  }

  onMount(() => {
    updateClock();
    timeTicker = setInterval(updateClock, 1000);

    isMobileViewport = window.innerWidth <= 768;
    const handleResize = () => {
      isMobileViewport = window.innerWidth <= 768;
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("popstate", handlePopState);

    return () => {
      clearInterval(timeTicker);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("popstate", handlePopState);
    };
  });

  // Touch swipe handling to swipe between tabs
  let touchStartX = 0;
  let touchStartY = 0;

  function handleTouchStart(e) {
    const target = e.target;
    // Prevent swipes from interrupting input components (sliders, selectors, maps)
    if (
      target.closest('input[type="range"]') ||
      target.closest("select") ||
      target.closest("button") ||
      target.closest("canvas") ||
      target.closest(".scroll-container") ||
      target.closest(".input-wheel") ||
      target.closest("svg") ||
      target.closest("path")
    ) {
      return;
    }

    if (e.touches && e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }

  function handleTouchEnd(e) {
    if (!touchStartX) return;

    if (e.changedTouches && e.changedTouches.length > 0) {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;

      touchStartX = 0;
      touchStartY = 0;

      // Swipe threshold check (mostly horizontal swipe)
      if (Math.abs(deltaX) > 85 && Math.abs(deltaY) < 55) {
        const currentIdx = TABS_CONFIG.findIndex((t) => t.id === activeTab);
        if (currentIdx !== -1) {
          if (deltaX < 0 && currentIdx < TABS_CONFIG.length - 1) {
            // Swiped left -> Go to next tab
            const prevShowTiles = showMobileTiles;
            activeTab = TABS_CONFIG[currentIdx + 1].id;
            showMobileTiles = false;
            if (isMobileViewport) {
              if (prevShowTiles) {
                history.pushState(
                  { view: "toolbox", app: "stopwatch", subTab: activeTab, depth: 3 },
                  "",
                  "/apps/stopwatch/" + activeTab
                );
              } else {
                history.replaceState(
                  { view: "toolbox", app: "stopwatch", subTab: activeTab, depth: 3 },
                  "",
                  "/apps/stopwatch/" + activeTab
                );
              }
            }
          } else if (deltaX > 0 && currentIdx > 0) {
            // Swiped right -> Go to previous tab
            const prevShowTiles = showMobileTiles;
            activeTab = TABS_CONFIG[currentIdx - 1].id;
            showMobileTiles = false;
            if (isMobileViewport) {
              if (prevShowTiles) {
                history.pushState(
                  { view: "toolbox", app: "stopwatch", subTab: activeTab, depth: 3 },
                  "",
                  "/apps/stopwatch/" + activeTab
                );
              } else {
                history.replaceState(
                  { view: "toolbox", app: "stopwatch", subTab: activeTab, depth: 3 },
                  "",
                  "/apps/stopwatch/" + activeTab
                );
              }
            }
          }
        }
      }
    }
  }
</script>

<div
  class="fathertime-app border-white/5 bg-[#07070b]/90 backdrop-blur-md rounded-2xl w-full h-full flex flex-col md:flex-row overflow-hidden relative shadow-2xl"
>
  <!-- Left Side-rail Navigation (Visible on Tablet & Desktop) -->
  <nav
    class="hidden md:flex flex-col w-48 border-r border-white/5 bg-black/30 p-4 shrink-0 justify-between select-none"
  >
    <div>
      <!-- <div class="flex items-center gap-2 px-2 py-1 mb-6 border-b border-white/5 pb-4">
        <HourglassIcon class="text-sky-400 animate-spin-slow" size={20} />
        <div>
          <h1 class="text-xs font-black uppercase text-white tracking-widest leading-none">Father Time</h1>
          <span class="text-[8px] font-bold text-sky-400/60 uppercase tracking-widest mt-0.5 block">Timekeeper App</span>
        </div>
      </div> -->

      <div class="flex flex-col gap-1">
        {#each TABS_CONFIG as tab}
          <button
            class="sidebar-nav-btn text-xs"
            class:active={activeTab === tab.id}
            onclick={() => (activeTab = tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            <tab.icon size={13} />
            <span>{tab.label}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Clock Widget inside sidebar -->
    <div class="border border-white/5 bg-white/2 rounded-xl p-3 text-center">
      <span class="font-mono text-xs font-extrabold text-sky-400 leading-none"
        >{digitalTime}</span
      >
      <span class="text-[8px] text-white/30 block mt-1 uppercase font-bold"
        >{digitalDate}</span
      >
    </div>
  </nav>

  <!-- Top bar (Visible on Mobile Viewports) -->
  <div
    class="md:hidden h-11 flex items-center justify-between border-b border-white/5 bg-black/40 px-4 select-none shrink-0 w-full"
  >
    <div class="flex items-center gap-2">
      {#if !showMobileTiles}
        <button
          onclick={() => {
            if (isMobileViewport) {
              history.back();
            } else {
              showMobileTiles = true;
            }
          }}
          class="flex items-center gap-1.5 px-2.5 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/30 rounded text-[9px] font-mono font-bold uppercase transition-all active:scale-95 cursor-pointer"
        >
          <Home size={10} /> TILES
        </button>
      {:else}
        <div class="flex items-center gap-1.5">
          <HourglassIcon class="text-sky-400 animate-spin-slow" size={12} />
          <span class="text-[10px] font-mono tracking-widest text-white/55 uppercase">FATHER TIME</span>
        </div>
      {/if}
    </div>
    <div class="text-right font-mono text-[10px] text-sky-400 font-bold">
      {digitalTime}
    </div>
  </div>

  <!-- Mobile Horizontal Scrollable Tab Bar (Visible on Mobile Viewports instead of vertical list) -->
  {#if !showMobileTiles}
    <div
      class="md:hidden flex overflow-x-auto scrollbar-none border-b border-white/5 bg-black/20 py-1.5 px-2 select-none gap-1 shrink-0 w-full"
    >
      {#each TABS_CONFIG as tab}
        <button
          class="mobile-nav-btn text-[10px]"
          class:active={activeTab === tab.id}
          onclick={() => (activeTab = tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
        >
          <tab.icon size={11} />
          <span>{tab.label}</span>
        </button>
      {/each}
    </div>
  {/if}

  <!-- Main Viewport Container -->
  <main
    class="flex-grow overflow-y-auto scrollbar-none p-4 md:p-6 w-full flex flex-col justify-between"
    ontouchstart={handleTouchStart}
    ontouchend={handleTouchEnd}
  >
    <!-- TV/Ultra-wide 2xl Master-Detail layout override: -->
    <!-- Displays hourglass clock AND active tab side-by-side to fill empty spaces -->
    <div
      class="hidden 2xl:flex gap-6 w-full h-full items-stretch justify-between"
    >
      <!-- Persistent dashboard info panel -->
      <div
        class="w-80 border border-white/5 bg-black/25 rounded-2xl p-5 flex flex-col justify-between select-none"
      >
        <div
          class="text-center flex flex-col items-center justify-center min-h-[280px]"
        >
          {#if activeTab === "metronome"}
            <MetronomeVisual
              bpm={sharedMetronome.bpm}
              isPlaying={sharedMetronome.isPlaying}
            />
          {:else}
            <Hourglass now={nowDate} bind:currentMode={hourglassMode} />
          {/if}
          <h2
            class="text-lg font-black text-white uppercase tracking-widest mt-4"
          >
            Father Time
          </h2>
          <p class="text-[10px] text-white/40 tracking-wider">
            Universal chronometer & audio suites
          </p>

          <div
            class="mt-8 border border-sky-400/20 bg-sky-400/5 p-4 rounded-xl w-full"
          >
            <span
              class="font-mono text-2xl font-black text-sky-400 block tracking-widest"
              >{digitalTime}</span
            >
            <span
              class="text-[9px] text-white/40 mt-1 uppercase font-bold block"
              >{digitalDate}</span
            >
          </div>
        </div>

        <div
          class="text-[8px] text-white/20 text-center tracking-wider uppercase"
        >
          Strata 1 Synced | wearedogs Node
        </div>
      </div>

      <!-- Active Tab Component (fills the rest of screen) -->
      <div
        class="flex-1 border border-white/5 bg-black/15 rounded-2xl p-2 relative overflow-hidden"
      >
        {#if activeTab === "hourglass"}
          <div
            class="flex flex-col items-center justify-center h-full text-center p-6"
          >
            <Hourglass now={nowDate} bind:currentMode={hourglassMode} />
            <h3 class="font-bold text-white text-sm mt-4">
              Universal Sands of Time
            </h3>
            <p class="text-[10px] text-white/40 max-w-xs mt-1">
              Simulated granular sand particles falling and shifting in perfect
              alignment with physical timeline seconds.
            </p>
          </div>
        {:else}
          {#if activeTab === "stopwatch"}<StopwatchTab />{/if}
          {#if activeTab === "timer"}<TimerTab />{/if}
          {#if activeTab === "alarms"}<AlarmsTab />{/if}
          {#if activeTab === "worldclock"}<WorldClockTab />{/if}
          {#if activeTab === "servers"}<TimeServersTab />{/if}
          {#if activeTab === "history"}<HistoryTab />{/if}
          {#if activeTab === "metronome"}<MetronomeTab
              metronome={sharedMetronome}
            />{/if}
          {#if activeTab === "tuner"}<TuningForkTab />{/if}
        {/if}
      </div>
    </div>

    <!-- Standard responsive single-tab layout for mobile & desktop views -->
    <div
      class="2xl:hidden w-full h-full flex flex-col items-stretch justify-center relative overflow-hidden"
    >
      <!-- Mobile Windows Phone-like Tile Launcher -->
      {#if showMobileTiles}
        <div class="md:hidden flex-grow flex flex-col justify-stretch items-stretch p-0.5 select-none w-full h-full">
          <!-- Windows Phone Grid: responsive 3 columns and 3 rows -->
          <div class="grid grid-cols-3 grid-rows-3 gap-2 w-full h-full flex-grow p-0.5">
            {#each TABS_CONFIG as tab, idx}
              {@const bgColors = [
                "bg-sky-600 hover:bg-sky-500",
                "bg-blue-600 hover:bg-blue-500",
                "bg-indigo-600 hover:bg-indigo-500",
                "bg-violet-600 hover:bg-violet-500",
                "bg-purple-600 hover:bg-purple-500",
                "bg-fuchsia-600 hover:bg-fuchsia-500",
                "bg-pink-600 hover:bg-pink-500",
                "bg-cyan-600 hover:bg-cyan-500",
                "bg-teal-600 hover:bg-teal-500"
              ]}
              <button
                onclick={() => {
                  activeTab = tab.id;
                  showMobileTiles = false;
                  if (isMobileViewport) {
                    history.pushState(
                      { view: "toolbox", app: "stopwatch", subTab: tab.id, depth: 3 },
                      "",
                      "/apps/stopwatch/" + tab.id
                    );
                  }
                }}
                class="flex flex-col justify-between p-2.5 rounded-lg border border-white/5 active:scale-95 transition-all text-left relative overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.3)] {bgColors[idx % bgColors.length]}"
              >
                <!-- Icon in top-left or centered -->
                <div class="text-white/95">
                  <tab.icon size={16} strokeWidth={2.5} />
                </div>
                <!-- Label in bottom-left -->
                <span class="text-[9px] font-black uppercase tracking-widest text-white leading-tight mt-auto select-none">
                  {tab.label}
                </span>
              </button>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Tab Content Area (hidden on mobile if tiles launcher is shown) -->
      <div class="w-full h-full flex-grow flex flex-col items-stretch justify-center {showMobileTiles ? 'hidden md:flex' : 'flex'}">
        {#if activeTab === "hourglass"}
          <div
            class="flex flex-col items-center justify-center text-center p-6 h-full select-none"
          >
            <Hourglass now={nowDate} bind:currentMode={hourglassMode} />
            <h3 class="font-bold text-white text-sm mt-4">Sands of Time</h3>
            <p class="text-[10px] text-white/40 max-w-xs mt-1">
              Particles settle dynamically every second. Click the glass to
              physically rotate it.
            </p>

            <div
              class="mt-6 border border-white/5 bg-white/2 rounded-xl py-2 px-5 text-center font-mono"
            >
              <span class="text-xl font-bold text-sky-400">{digitalTime}</span>
              <span
                class="text-[8px] text-white/30 block uppercase tracking-wider"
                >{digitalDate}</span
              >
            </div>
          </div>
        {:else}
          {#if activeTab === "stopwatch"}<StopwatchTab />{/if}
          {#if activeTab === "timer"}<TimerTab />{/if}
          {#if activeTab === "alarms"}<AlarmsTab />{/if}
          {#if activeTab === "worldclock"}<WorldClockTab />{/if}
          {#if activeTab === "servers"}<TimeServersTab />{/if}
          {#if activeTab === "history"}<HistoryTab />{/if}
          {#if activeTab === "metronome"}<MetronomeTab
              metronome={sharedMetronome}
            />{/if}
          {#if activeTab === "tuner"}<TuningForkTab />{/if}
        {/if}
      </div>
    </div>
  </main>
</div>

<style>
  .fathertime-app {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.45);
  }

  .sidebar-nav-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.45);
    cursor: pointer;
    text-align: left;
    width: 100%;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .sidebar-nav-btn:hover {
    color: white;
    background: rgba(255, 255, 255, 0.03);
  }

  .sidebar-nav-btn.active {
    color: white;
    background: rgba(56, 189, 248, 0.15);
    border: 1px solid rgba(56, 189, 248, 0.3);
    text-shadow: 0 0 8px rgba(56, 189, 248, 0.35);
  }

  .mobile-nav-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.45);
    cursor: pointer;
    font-weight: 600;
    white-space: nowrap;
    transition: all 0.2s ease;
  }

  .mobile-nav-btn.active {
    color: white;
    background: rgba(56, 189, 248, 0.15);
    border: 1px solid rgba(56, 189, 248, 0.3);
  }

  .scrollbar-none {
    scrollbar-width: none;
  }
  .scrollbar-none::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  :global(.animate-spin-slow) {
    animation: spinSlow 12s linear infinite;
  }

  @keyframes spinSlow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
