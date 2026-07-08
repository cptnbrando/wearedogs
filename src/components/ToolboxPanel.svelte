<script>
  import { onMount, onDestroy } from "svelte";
  import {
    ArrowLeft,
    Undo,
    Award,
    Volume2,
    Paintbrush,
    Watch,
    Video,
    QrCode,
    Radio,
    Smile,
    Trophy,
    Terminal,
    BookOpen,
    Settings,
    Zap,
    Hourglass,
    Scissors,
    Sparkles,
  } from "lucide-svelte";
  import SnakeApp from "./apps/SnakeApp.svelte";
  import DogsLogo from "./DogsLogo.svelte";
  import { audioCore } from "../lib/AudioCore.svelte.js";
  import SoundboardApp from "./apps/SoundboardApp.svelte";
  import PaintApp from "./apps/PaintApp.svelte";
  import FatherTimeApp from "./apps/fathertime/FatherTimeApp.svelte";
  import GoPro from "./apps/GoPro.svelte";
  import DataFlash from "./apps/DataFlash.svelte";
  import QRGenerator from "./apps/QRGenerator.svelte";
  import Rescue from "./apps/Rescue.svelte";
  import MemesApp from "./apps/MemesApp.svelte";
  import WorldCupApp from "./apps/WorldCupApp.svelte";
  import ChangelogApp from "./apps/ChangelogApp.svelte";
  import BlogApp from "./apps/BlogApp.svelte";
  import SettingsApp from "./apps/SettingsApp.svelte";
  import SoundStripper from "./apps/SoundStripper.svelte";
  import WindshieldWiper from "./apps/WindshieldWiper.svelte";

  const title = "Toolbox";

  let {
    isClosing = false,
    onClose,
    activeApp = $bindable(null),
    isFlagColors = false,
    initialApp = null,
    blogPostSlug = $bindable(null),
    depth = $bindable(0),
  } = $props();

  let isReadingPost = $state(false);
  let appsGridEl = $state(null);
  let appCount = $state(15);

  // Scan apps grid to count apps dynamically
  $effect(() => {
    if (appsGridEl) {
      const cards = appsGridEl.querySelectorAll(".app-card");
      if (cards.length > 0) {
        appCount = cards.length;
      }
    }
  });

  // Sync initial deep-linked app on mount
  $effect(() => {
    if (initialApp && activeApp === null) {
      activeApp = initialApp;
    }
  });

  function handleBack() {
    if (activeApp === "blog" && isReadingPost) {
      isReadingPost = false;
    } else if (history.state?.app) {
      history.back();
    } else {
      activeApp = null;
    }
  }

  const appIds = [
    "gopro",
    "dataflash",
    "qrgenerator",
    "soundboard",
    "snake",
    "paint",
    "stopwatch",
    "rescue",
    "memes",
    "worldcup",
    "changelog",
    "blog",
    "soundstripper",
    "windshieldwiper",
    "settings",
  ];

  let focusedIdx = $state(0);

  function scrollFocusedCardIntoView() {
    const el = document.querySelector(`.app-card[data-app-idx="${focusedIdx}"]`);
    if (el) {
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  function handleKeydown(e) {
    if (e.key === "Escape") {
      const tag = document.activeElement?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        document.activeElement?.isContentEditable
      )
        return;
      if (activeApp !== null) {
        handleBack();
      }
      return;
    }

    if (activeApp !== null) {
      // Sub-app is open, let the sub-app handle its own keyboard navigation
      return;
    }

    const isMobile = window.innerWidth <= 768;
    const cols = isMobile ? 1 : 2;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusedIdx = (focusedIdx + 1) % appCount;
      scrollFocusedCardIntoView();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusedIdx = (focusedIdx - 1 + appCount) % appCount;
      scrollFocusedCardIntoView();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      focusedIdx = (focusedIdx + cols) % appCount;
      scrollFocusedCardIntoView();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusedIdx = (focusedIdx - cols + appCount) % appCount;
      scrollFocusedCardIntoView();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIdx >= 0 && focusedIdx < appIds.length) {
        activeApp = appIds[focusedIdx];
      }
    }
  }

  onMount(() => window.addEventListener("keydown", handleKeydown));
  onDestroy(() => window.removeEventListener("keydown", handleKeydown));
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="toolbox-panel-backdrop" onclick={onClose}>
  <div
    class="toolbox-panel-container"
    class:closing={isClosing}
    class:colored={isFlagColors}
    onclick={(e) => e.stopPropagation()}
  >
    <!-- Header -->
    <header class="panel-header">
      <div class="brand">
        <button
          class="logo-btn"
          onclick={() =>
            window.dispatchEvent(
              new CustomEvent(
                audioCore.isPlaying ? "open-music-panel" : "open-info-panel",
              ),
            )}
          aria-label="Open DOGS Info"
        >
          <DogsLogo size="panel" />
        </button>
        <h1>{title}</h1>
      </div>

      <button
        class="close-btn"
        onclick={activeApp !== null ? handleBack : onClose}
        aria-label="Close panel"
      >
        <ArrowLeft size={20} />
      </button>
    </header>

    <!-- Main Content App Canvas -->
    <div class="panel-body">
      {#if activeApp === null}
        <!-- APPS LAUNCHER GRID VIEW -->
        <div class="launcher-view animated-pane">
          <div class="apps-grid" bind:this={appsGridEl}>

            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="app-card border-neon-purple"
              class:focused={focusedIdx === 0}
              data-app-idx="0"
              onclick={() => {
                activeApp = "gopro";
                focusedIdx = 0;
              }}
              onmouseenter={() => {
                focusedIdx = 0;
              }}
            >
              <div class="app-visual">
                <div class="video-preview-mini">
                  <span class="lens"></span>
                  <span class="tape t1"></span>
                  <span class="tape t2"></span>
                </div>
              </div>
              <div class="app-meta">
                <span class="app-title"><Video size={14} /> GoPro Cinema</span>
                <span class="app-desc"
                  >Stream retro TV series and clip custom audio loops.</span
                >
              </div>
            </div>

            <!-- App 2: DataFlash Visual Transfer -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="app-card border-neon-cyan"
              class:focused={focusedIdx === 1}
              data-app-idx="1"
              onclick={() => {
                activeApp = "dataflash";
                focusedIdx = 1;
              }}
              onmouseenter={() => {
                focusedIdx = 1;
              }}
            >
              <div class="app-visual">
                <Zap
                  size={28}
                  style="color: var(--color-neon-cyan, #00d7ff); filter: drop-shadow(0 0 6px rgba(0, 215, 255, 0.4));"
                />
              </div>
              <div class="app-meta">
                <span class="app-title"><Zap size={14} /> DataFlash</span>
                <span class="app-desc"
                  >Visual file transfer protocol over flashing QR codes.</span
                >
              </div>
            </div>

            <!-- App: QR Generator -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="app-card border-neon-blue"
              class:focused={focusedIdx === 2}
              data-app-idx="2"
              onclick={() => {
                activeApp = "qrgenerator";
                focusedIdx = 2;
              }}
              onmouseenter={() => {
                focusedIdx = 2;
              }}
            >
              <div class="app-visual">
                <div class="qr-preview-mini">
                  <span class="corner c1"></span>
                  <span class="corner c2"></span>
                  <span class="corner c3"></span>
                  <div
                    style="width: 4px; height: 4px; background: #00d7ff; border-radius: 50%; box-shadow: 0 0 6px #00d7ff;"
                  ></div>
                </div>
              </div>
              <div class="app-meta">
                <span class="app-title"><QrCode size={14} /> QR Generator</span>
                <span class="app-desc"
                  >Generate resizable QR codes with custom center logo overlays.</span
                >
              </div>
            </div>

            <!-- App 3: Dog Soundboard -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="app-card border-neon-pink"
              class:focused={focusedIdx === 3}
              data-app-idx="3"
              onclick={() => {
                activeApp = "soundboard";
                focusedIdx = 3;
              }}
              onmouseenter={() => {
                focusedIdx = 3;
              }}
            >
              <div class="app-visual">
                <div class="wave-preview">
                  <span></span><span></span><span></span><span></span><span
                  ></span>
                </div>
              </div>
              <div class="app-meta">
                <span class="app-title"
                  ><Volume2 size={14} /> Dog Soundboard</span
                >
                <span class="app-desc"
                  >Play high fidelity dog bark synthesizers.</span
                >
              </div>
            </div>

            <!-- App 4: Snake Game -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="app-card border-neon-blue"
              class:focused={focusedIdx === 4}
              data-app-idx="4"
              onclick={() => {
                activeApp = "snake";
                focusedIdx = 4;
              }}
              onmouseenter={() => {
                focusedIdx = 4;
              }}
            >
              <div class="app-visual">
                <div class="snake-mini-preview">
                  <span class="dot d1"></span>
                  <span class="dot d2"></span>
                  <span class="dot d3"></span>
                  <span class="dot d4"></span>
                </div>
              </div>
              <div class="app-meta">
                <span class="app-title"><Award size={14} /> Snake</span>
                <span class="app-desc"
                  >Retro snake game, runs inside grid. Use Arrow Keys.</span
                >
              </div>
            </div>

            <!-- App 5: Sketch Canvas -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="app-card border-neon-yellow"
              class:focused={focusedIdx === 5}
              data-app-idx="5"
              onclick={() => {
                activeApp = "paint";
                focusedIdx = 5;
              }}
              onmouseenter={() => {
                focusedIdx = 5;
              }}
            >
              <div class="app-visual">
                <div class="brush-preview">
                  <Paintbrush size={32} />
                  <span class="drip"></span>
                </div>
              </div>
              <div class="app-meta">
                <span class="app-title"
                  ><Paintbrush size={14} /> Sketch Canvas</span
                >
                <span class="app-desc"
                  >Draw and paint illustrations on a canvas.</span
                >
              </div>
            </div>

            <!-- App 6: Father Time -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="app-card border-neon-green"
              class:focused={focusedIdx === 6}
              data-app-idx="6"
              onclick={() => {
                activeApp = "stopwatch";
                focusedIdx = 6;
              }}
              onmouseenter={() => {
                focusedIdx = 6;
              }}
            >
              <div class="app-visual">
                <div class="stopwatch-preview">
                  <Hourglass size={32} />
                </div>
              </div>
              <div class="app-meta">
                <span class="app-title"
                  ><Hourglass size={14} /> Father Time</span
                >
                <span class="app-desc"
                  >Sands of time: stopwatch, timer, alarms, world clock,
                  metronome & pitch tuner.</span
                >
              </div>
            </div>

            <!-- App 7: Rescue -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="app-card border-neon-cyan"
              class:focused={focusedIdx === 7}
              data-app-idx="7"
              onclick={() => {
                activeApp = "rescue";
                focusedIdx = 7;
              }}
              onmouseenter={() => {
                focusedIdx = 7;
              }}
            >
              <div class="app-visual">
                <div class="rescue-preview">
                  <Radio size={32} />
                </div>
              </div>
              <div class="app-meta">
                <span class="app-title"><Radio size={14} /> Rescue Ops</span>
                <span class="app-desc"
                  >Coordinate search-and-rescue beacons and flight paths.</span
                >
              </div>
            </div>

            <!-- App 8: Dog Memes -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="app-card border-neon-pink"
              class:focused={focusedIdx === 8}
              data-app-idx="8"
              onclick={() => {
                activeApp = "memes";
                focusedIdx = 8;
              }}
              onmouseenter={() => {
                focusedIdx = 8;
              }}
            >
              <div class="app-visual">
                <div class="memes-preview">
                  <Smile size={32} />
                </div>
              </div>
              <div class="app-meta">
                <span class="app-title"><Smile size={14} /> Canine Memes</span>
                <span class="app-desc"
                  >Explore and share high-fidelity, hilarious dog memes.</span
                >
              </div>
            </div>

            <!-- App 9: World Cup Bracket -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="app-card border-neon-gold-hover"
              class:focused={focusedIdx === 9}
              data-app-idx="9"
              onclick={() => {
                activeApp = "worldcup";
                focusedIdx = 9;
              }}
              onmouseenter={() => {
                focusedIdx = 9;
              }}
            >
              <div class="app-visual">
                <div class="wc-bracket-preview">
                  <Trophy size={32} />
                </div>
              </div>
              <div class="app-meta">
                <span class="app-title"
                  ><Trophy size={14} /> FIFA World Cup</span
                >
                <span class="app-desc"
                  >Track matches, group stage standings, and the responsive
                  bracket.</span
                >
              </div>
            </div>

            <!-- App 10: Changelog -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="app-card border-neon-green"
              class:focused={focusedIdx === 10}
              data-app-idx="10"
              onclick={() => {
                activeApp = "changelog";
                focusedIdx = 10;
              }}
              onmouseenter={() => {
                focusedIdx = 10;
              }}
            >
              <div class="app-visual">
                <div class="terminal-preview-mini">
                  <span class="prompt-symbol">&gt;_</span>
                  <span class="cursor-blink"></span>
                </div>
              </div>
              <div class="app-meta">
                <span class="app-title"><Terminal size={14} /> Changelog</span>
                <span class="app-desc"
                  >View the system changelog and repository development metrics.</span
                >
              </div>
            </div>

            <!-- App 11: DOG BLOG -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="app-card border-neon-purple"
              class:focused={focusedIdx === 11}
              data-app-idx="11"
              onclick={() => {
                activeApp = "blog";
                focusedIdx = 11;
              }}
              onmouseenter={() => {
                focusedIdx = 11;
              }}
            >
              <div class="app-visual">
                <div class="blog-preview-mini">
                  <span class="line l1"></span>
                  <span class="line l2"></span>
                  <span class="line l3"></span>
                </div>
              </div>
              <div class="app-meta">
                <span class="app-title"><BookOpen size={14} /> DOG BLOG</span>
                <span class="app-desc"
                  >Read articles about punk rock tech, development, and music.</span
                >
              </div>
            </div>

            <!-- App: Sound Stripper -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="app-card border-neon-pink"
              class:focused={focusedIdx === 12}
              data-app-idx="12"
              onclick={() => {
                activeApp = "soundstripper";
                focusedIdx = 12;
              }}
              onmouseenter={() => {
                focusedIdx = 12;
              }}
            >
              <div class="app-visual">
                <div class="flex items-center justify-center h-full">
                  <Scissors
                    size={28}
                    style="color: var(--color-neon-pink, #ff007f); filter: drop-shadow(0 0 6px rgba(255, 0, 127, 0.4));"
                  />
                </div>
              </div>
              <div class="app-meta">
                <span class="app-title"
                  ><Scissors size={14} /> Sound Stripper</span
                >
                <span class="app-desc"
                  >Extract vocal acapellas by subtracting reference instrumental
                  bleed.</span
                >
              </div>
            </div>

            <!-- App 13: Windshield Wiper -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="app-card border-neon-cyan"
              class:focused={focusedIdx === 13}
              data-app-idx="13"
              onclick={() => {
                activeApp = "windshieldwiper";
                focusedIdx = 13;
              }}
              onmouseenter={() => {
                focusedIdx = 13;
              }}
            >
              <div class="app-visual">
                <div
                  class="flex items-center justify-center h-full relative overflow-hidden"
                >
                  <div class="wiper-icon-container">
                    <svg viewBox="0 0 100 100" class="w-12 h-12">
                      <path
                        d="M 15 80 A 45 45 0 0 1 85 80"
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        stroke-width="6"
                        stroke-linecap="round"
                      />
                      <line
                        x1="50"
                        y1="85"
                        x2="50"
                        y2="40"
                        stroke="#00ffff"
                        stroke-width="4"
                        stroke-linecap="round"
                        class="wiper-blade-animate"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div class="app-meta">
                <span class="app-title"
                  ><Sparkles size={14} /> Windshield Wiper</span
                >
                <span class="app-desc"
                  >Clean watermarks and logos from images and videos using
                  canvas magic.</span
                >
              </div>
            </div>

            <!-- App 14: Settings -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="app-card border-neon-red"
              class:focused={focusedIdx === 14}
              data-app-idx="14"
              onclick={() => {
                activeApp = "settings";
                focusedIdx = 14;
              }}
              onmouseenter={() => {
                focusedIdx = 14;
              }}
            >
              <div class="app-visual">
                <div class="settings-preview-mini">
                  <Settings size={28} class="animate-spin-slow text-white/50" />
                </div>
              </div>
              <div class="app-meta">
                <span class="app-title"><Settings size={14} /> Settings</span>
                <span class="app-desc"
                  >Customize site-wide themes and UI profiles.</span
                >
              </div>
            </div>
          </div>
        </div>
      {:else if activeApp === "snake"}
        <SnakeApp />
      {:else if activeApp === "soundboard"}
        <SoundboardApp />
      {:else if activeApp === "paint"}
        <PaintApp />
      {:else if activeApp === "stopwatch"}
        <FatherTimeApp />
      {:else if activeApp === "gopro"}
        <GoPro />
      {:else if activeApp === "dataflash"}
        <DataFlash />
      {:else if activeApp === "qrgenerator"}
        <QRGenerator />
      {:else if activeApp === "rescue"}
        <Rescue />
      {:else if activeApp === "memes"}
        <MemesApp />
      {:else if activeApp === "worldcup"}
        <WorldCupApp />
      {:else if activeApp === "changelog"}
        <ChangelogApp />
      {:else if activeApp === "blog"}
        <BlogApp
          bind:initialSlug={blogPostSlug}
          bind:isReading={isReadingPost}
          bind:depth
          {isFlagColors}
        />
      {:else if activeApp === "settings"}
        <SettingsApp />
      {:else if activeApp === "soundstripper"}
        <SoundStripper />
      {:else if activeApp === "windshieldwiper"}
        <WindshieldWiper onClose={() => (activeApp = null)} />
      {/if}
    </div>

    <!-- Footer -->
    <footer class="panel-footer">
      <div class="sys-status">
        <span>/util</span>
      </div>
      <div class="stats-counter">
        <span>APPS LOADED: {appCount}</span>
      </div>
    </footer>
  </div>
</div>
<style>
  /* ── Backdrop ── */
  .toolbox-panel-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  /* ── Container ── */
  .toolbox-panel-container {
    width: 94vw;
    height: 90vh;
    max-width: 1280px;
    max-height: 850px;
    background: rgba(10, 10, 14, 0.45); /* Slightly transparent mandatory */
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    box-shadow:
      0 32px 80px rgba(0, 0, 0, 0.7),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    backdrop-filter: blur(15px) saturate(160%);
    -webkit-backdrop-filter: blur(15px) saturate(160%);
    animation: panelSlideUpIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transform-origin: center bottom;
  }

  .toolbox-panel-container:not(.colored) .launcher-view {
    filter: grayscale(100%);
  }

  .toolbox-panel-container.closing {
    animation: panelSlideUpDown 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes panelSlideUpIn {
    0% {
      opacity: 0;
      transform: translateY(30px) scale(0.97);
      backdrop-filter: blur(0px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      backdrop-filter: blur(15px) saturate(160%);
    }
  }

  @keyframes panelSlideUpDown {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
      backdrop-filter: blur(15px) saturate(160%);
    }
    100% {
      opacity: 0;
      transform: translateY(20px) scale(0.97);
      backdrop-filter: blur(0px);
    }
  }

  /* ── Header ── */
  .panel-header {
    height: 64px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  @keyframes pulseDot {
    0%,
    100% {
      opacity: 0.6;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
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

  /* ── Body Layout ── */
  .panel-body {
    flex-grow: 1;
    height: calc(100% - 64px - 40px);
    overflow: hidden;
    background: rgba(0, 0, 0, 0.15);
  }

  .animated-pane {
    animation: paneFadeIn 0.3s ease forwards;
  }

  @keyframes paneFadeIn {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ── Launcher View ── */
  .launcher-view {
    padding: 24px;
    overflow-y: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .apps-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .app-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 20px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .app-card:hover,
  .app-card.focused {
    background: rgba(255, 255, 255, 0.06);
    transform: scale(1.01) translateY(-2px);
    border-color: rgba(255, 255, 255, 0.12);
  }

  /* Neon Borders */
  .border-neon-blue:hover,
  .border-neon-blue.focused {
    border-color: rgba(0, 191, 255, 0.6);
    box-shadow: 0 8px 30px rgba(0, 191, 255, 0.1);
  }
  .border-neon-pink:hover,
  .border-neon-pink.focused {
    border-color: rgba(255, 85, 187, 0.6);
    box-shadow: 0 8px 30px rgba(255, 85, 187, 0.1);
  }
  .border-neon-yellow:hover,
  .border-neon-yellow.focused {
    border-color: rgba(255, 204, 0, 0.6);
    box-shadow: 0 8px 30px rgba(255, 204, 0, 0.1);
  }
  .border-neon-green:hover,
  .border-neon-green.focused {
    border-color: rgba(0, 255, 102, 0.6);
    box-shadow: 0 8px 30px rgba(0, 255, 102, 0.1);
  }
  .border-neon-purple:hover,
  .border-neon-purple.focused {
    border-color: rgba(180, 85, 255, 0.6);
    box-shadow: 0 8px 30px rgba(180, 85, 255, 0.1);
  }
  .border-neon-cyan:hover,
  .border-neon-cyan.focused {
    border-color: rgba(0, 191, 255, 0.6);
    box-shadow: 0 8px 30px rgba(0, 191, 255, 0.1);
  }
  .border-neon-gold-hover:hover,
  .border-neon-gold-hover.focused {
    border-color: rgba(230, 185, 0, 0.6);
    box-shadow: 0 8px 30px rgba(230, 185, 0, 0.15);
  }
  .border-neon-red:hover,
  .border-neon-red.focused {
    border-color: rgba(255, 51, 68, 0.6);
    box-shadow: 0 8px 30px rgba(255, 51, 68, 0.1);
  }

  .app-visual {
    width: 64px;
    height: 64px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }

  .app-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .app-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: white;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .app-desc {
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.45);
    line-height: 1.3;
  }

  /* App Previews */
  .snake-mini-preview {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
    width: 32px;
    height: 32px;
  }

  .snake-mini-preview .dot {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1px;
    width: 6px;
    height: 6px;
  }

  .snake-mini-preview .dot.d1 {
    background: #00ff66;
    animation: snakeMove1 1.6s infinite step-end;
  }
  .snake-mini-preview .dot.d2 {
    background: #00ff66;
    animation: snakeMove2 1.6s infinite step-end;
  }
  .snake-mini-preview .dot.d3 {
    background: #00ff66;
    animation: snakeMove3 1.6s infinite step-end;
  }
  .snake-mini-preview .dot.d4 {
    background: #ff3344;
    animation: snakeFood 1.6s infinite step-end;
  }

  @keyframes snakeMove1 {
    0% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(8px, 0);
    }
    50% {
      transform: translate(8px, 8px);
    }
    75% {
      transform: translate(0, 8px);
    }
  }
  @keyframes snakeMove2 {
    0% {
      transform: translate(0, 8px);
    }
    25% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(8px, 0);
    }
    75% {
      transform: translate(8px, 8px);
    }
  }
  @keyframes snakeMove3 {
    0% {
      transform: translate(8px, 8px);
    }
    25% {
      transform: translate(0, 8px);
    }
    50% {
      transform: translate(0, 0);
    }
    75% {
      transform: translate(8px, 0);
    }
  }
  @keyframes snakeFood {
    0%,
    50% {
      transform: translate(16px, 8px);
      opacity: 1;
    }
    51%,
    100% {
      transform: translate(0px, 16px);
      opacity: 1;
    }
  }

  .wave-preview {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 24px;
  }

  .wave-preview span {
    width: 3px;
    background: #ff55bb;
    border-radius: 1.5px;
    animation: barBounce 1s infinite ease-in-out;
  }

  .wave-preview span:nth-child(1) {
    height: 8px;
    animation-delay: 0.1s;
  }
  .wave-preview span:nth-child(2) {
    height: 16px;
    animation-delay: 0.2s;
  }
  .wave-preview span:nth-child(3) {
    height: 24px;
    animation-delay: 0.3s;
  }
  .wave-preview span:nth-child(4) {
    height: 14px;
    animation-delay: 0.4s;
  }
  .wave-preview span:nth-child(5) {
    height: 6px;
    animation-delay: 0.5s;
  }

  @keyframes barBounce {
    0%,
    100% {
      transform: scaleY(0.4);
    }
    50% {
      transform: scaleY(1);
    }
  }

  .brush-preview {
    position: relative;
    color: #ffcc00;
  }
  .brush-preview .drip {
    position: absolute;
    width: 6px;
    height: 6px;
    background: #ffcc00;
    border-radius: 50%;
    bottom: -6px;
    left: 8px;
    animation: paintDrip 2s infinite ease-in;
  }

  @keyframes paintDrip {
    0% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    80% {
      transform: translateY(12px) scale(0.6);
      opacity: 0.8;
    }
    100% {
      transform: translateY(18px) scale(0.2);
      opacity: 0;
    }
  }

  .stopwatch-preview {
    color: #00ff66;
    animation: radarScan 4s infinite linear;
  }

  @keyframes radarScan {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* ── Footer ── */
  .panel-footer {
    height: 40px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(0, 0, 0, 0.3);
    flex-shrink: 0;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.35);
    font-weight: 500;
    letter-spacing: 0.05em;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .sys-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: monospace;
  }

  .stats-counter {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Custom App Previews */
  .rescue-preview {
    color: #00bfff;
    animation: signalPing 2s infinite ease-in-out;
  }

  @keyframes signalPing {
    0%,
    100% {
      transform: scale(0.9);
      filter: drop-shadow(0 0 0px rgba(0, 191, 255, 0));
    }
    50% {
      transform: scale(1.15);
      filter: drop-shadow(0 0 10px rgba(0, 191, 255, 0.7));
    }
  }

  .memes-preview {
    color: #ff55bb;
    animation: dogLaugh 0.8s infinite ease-in-out;
  }

  @keyframes dogLaugh {
    0%,
    100% {
      transform: rotate(0deg) scale(1);
    }
    25% {
      transform: rotate(-8deg) scale(1.08);
    }
    75% {
      transform: rotate(8deg) scale(1.08);
    }
  }

  .wc-bracket-preview {
    color: #e6b900;
    animation: trophyFloat 3s ease-in-out infinite alternate;
  }

  @keyframes trophyFloat {
    0% {
      transform: translateY(0) scale(1);
    }
    100% {
      transform: translateY(-4px) scale(1.08);
    }
  }

  .video-preview-mini {
    position: relative;
    width: 24px;
    height: 24px;
    border: 2px solid #ff55bb;
    border-radius: 4px;
    color: #ff55bb;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .video-preview-mini .lens {
    width: 6px;
    height: 6px;
    background: #ff55bb;
    border-radius: 50%;
  }
  .video-preview-mini .tape {
    position: absolute;
    width: 10px;
    height: 10px;
    border: 2px solid #ff55bb;
    border-radius: 50%;
    top: -8px;
  }
  .video-preview-mini .tape.t1 {
    left: -3px;
    animation: tapeRoll 2s infinite linear;
  }
  .video-preview-mini .tape.t2 {
    right: -3px;
    animation: tapeRoll 2s infinite linear;
  }

  @keyframes tapeRoll {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .qr-preview-mini {
    position: relative;
    width: 20px;
    height: 20px;
    color: #00bfff;
  }
  .qr-preview-mini .corner {
    position: absolute;
    width: 5px;
    height: 5px;
    border: 2px solid #00bfff;
  }
  .qr-preview-mini .corner.c1 {
    top: 0;
    left: 0;
  }
  .qr-preview-mini .corner.c2 {
    top: 0;
    right: 0;
  }
  .qr-preview-mini .corner.c3 {
    bottom: 0;
    left: 0;
  }


  .terminal-preview-mini {
    position: relative;
    width: 24px;
    height: 24px;
    background: #000;
    border: 1px solid #00ff66;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: monospace;
    font-size: 10px;
    color: #00ff66;
    overflow: hidden;
  }
  .terminal-preview-mini .prompt-symbol {
    margin-right: 2px;
  }
  .terminal-preview-mini .cursor-blink {
    width: 4px;
    height: 8px;
    background: #00ff66;
    animation: terminalCursorBlink 1s infinite steps(2);
  }
  @keyframes terminalCursorBlink {
    0%,
    100% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }

  /* ── Mobile Layout Full Screen & App Grid ── */
  @media (max-width: 768px) {
    .toolbox-panel-container {
      width: 100vw;
      height: 100dvh;
      max-height: 100dvh;
      border-radius: 0;
      border-bottom: none;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      transform-origin: center bottom;
      animation: panelSlideUpInMobile 0.38s cubic-bezier(0.16, 1, 0.3, 1)
        forwards;
    }

    .toolbox-panel-container.closing {
      animation: panelSlideUpDownMobile 0.32s cubic-bezier(0.16, 1, 0.3, 1)
        forwards;
    }

    .panel-body {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-height: 0;
      height: auto;
      overflow-y: auto;
    }

    .apps-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .app-card {
      padding: 12px;
      gap: 12px;
    }

    .panel-footer {
      height: auto;
      min-height: 48px;
      padding-top: 8px;
      padding-bottom: max(14px, env(safe-area-inset-bottom, 14px));
    }
  }

  @keyframes panelSlideUpInMobile {
    0% {
      transform: translateY(100%);
      backdrop-filter: blur(0px);
    }
    100% {
      transform: translateY(0);
      backdrop-filter: blur(15px) saturate(160%);
    }
  }

  @keyframes panelSlideUpDownMobile {
    0% {
      transform: translateY(0);
      backdrop-filter: blur(15px) saturate(160%);
    }
    100% {
      transform: translateY(100%);
      backdrop-filter: blur(0px);
    }
  }

  @media (max-height: 580px) {
    .panel-body {
      overflow-y: auto;
    }
  }

  /* ── Blog Preview Mini ── */
  .blog-preview-mini {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 28px;
    height: 28px;
    justify-content: center;
  }
  .blog-preview-mini .line {
    height: 2px;
    background: rgba(180, 85, 255, 0.4);
    border-radius: 1px;
    transition: all 0.3s ease;
  }
  .blog-preview-mini .line.l1 {
    width: 24px;
    background: rgba(180, 85, 255, 0.9);
  }
  .blog-preview-mini .line.l2 {
    width: 18px;
  }
  .blog-preview-mini .line.l3 {
    width: 22px;
  }
  .app-card:hover .blog-preview-mini .line {
    background: #b455ff;
    box-shadow: 0 0 8px rgba(180, 85, 255, 0.8);
  }

  /* ── Settings Preview Mini ── */
  .settings-preview-mini {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    transition: all 0.3s ease;
  }
  .app-card:hover .settings-preview-mini :global(svg) {
    color: var(--color-neon-red, #ff3344);
    filter: drop-shadow(
      0 0 8px rgba(var(--color-neon-red-rgb, 255, 51, 68), 0.8)
    );
  }

  /* ── Windshield Wiper Preview ── */
  .wiper-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
  }
  .wiper-blade-animate {
    transform-origin: 50px 85px;
    animation: wiper-sweep 2.5s ease-in-out infinite alternate;
  }
  @keyframes wiper-sweep {
    0% {
      transform: rotate(-55deg);
    }
    100% {
      transform: rotate(55deg);
    }
  }
  .app-card:hover .wiper-blade-animate {
    animation: wiper-sweep 1s ease-in-out infinite alternate;
    stroke: #00ffff;
    filter: drop-shadow(0 0 4px rgba(0, 255, 255, 0.8));
  }
</style>
