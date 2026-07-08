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
  import AppCard from "./AppCard.svelte";

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
  let isKeyboardNav = $state(false);

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

  // CRITICAL: The changelog and settings apps MUST always remain next to each other at the bottom of the toolbox list, with settings last.
  const apps = [
    {
      id: "gopro",
      title: "GoPro Cinema",
      desc: "Stream retro TV series and clip custom audio loops.",
      icon: Video,
    },
    {
      id: "dataflash",
      title: "DataFlash",
      desc: "Visual file transfer protocol over flashing QR codes.",
      icon: Zap,
    },
    {
      id: "qrgenerator",
      title: "QR Generator",
      desc: "Generate resizable QR codes with custom center logo overlays.",
      icon: QrCode,
    },
    {
      id: "soundboard",
      title: "Dog Soundboard",
      desc: "Play high fidelity dog bark synthesizers.",
      icon: Volume2,
    },
    {
      id: "snake",
      title: "Snake",
      desc: "Retro snake game, runs inside grid. Use Arrow Keys.",
      icon: Award,
    },
    {
      id: "paint",
      title: "Sketch Canvas",
      desc: "Draw and paint illustrations on a canvas.",
      icon: Paintbrush,
    },
    {
      id: "stopwatch",
      title: "Father Time",
      desc: "Sands of time: stopwatch, timer, alarms, world clock, metronome & pitch tuner.",
      icon: Hourglass,
    },
    {
      id: "rescue",
      title: "Rescue Ops",
      desc: "Coordinate search-and-rescue beacons and flight paths.",
      icon: Radio,
    },
    {
      id: "memes",
      title: "Canine Memes",
      desc: "Explore and share high-fidelity, hilarious dog memes.",
      icon: Smile,
    },
    {
      id: "worldcup",
      title: "FIFA World Cup",
      desc: "Track matches, group stage standings, and the responsive bracket.",
      icon: Trophy,
    },
    {
      id: "blog",
      title: "DOG BLOG",
      desc: "Read articles about punk rock tech, development, and music.",
      icon: BookOpen,
    },
    {
      id: "soundstripper",
      title: "Sound Stripper",
      desc: "Extract vocal acapellas by subtracting reference instrumental bleed.",
      icon: Scissors,
    },
    {
      id: "windshieldwiper",
      title: "Windshield Wiper",
      desc: "Clean watermarks and logos from images and videos using canvas magic.",
      icon: Sparkles,
    },
    {
      id: "changelog",
      title: "Changelog",
      desc: "View the system changelog and repository development metrics.",
      icon: Terminal,
    },
    {
      id: "settings",
      title: "Settings",
      desc: "Customize site-wide themes and UI profiles.",
      icon: Settings,
    },
  ];

  const appIds = $derived(apps.map(a => a.id));
  const appCount = $derived(apps.length);

  let focusedIdx = $state(0);

  function scrollFocusedCardIntoView() {
    const el = document.querySelector(
      `.app-card[data-app-idx="${focusedIdx}"]`,
    );
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
      isKeyboardNav = true;
      focusedIdx = (focusedIdx + 1) % appCount;
      scrollFocusedCardIntoView();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      isKeyboardNav = true;
      focusedIdx = (focusedIdx - 1 + appCount) % appCount;
      scrollFocusedCardIntoView();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      isKeyboardNav = true;
      focusedIdx = (focusedIdx + cols) % appCount;
      scrollFocusedCardIntoView();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      isKeyboardNav = true;
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
            {#each apps as app, i}
              <AppCard
                {app}
                index={i}
                isFocused={focusedIdx === i}
                {isKeyboardNav}
                onclick={() => {
                  activeApp = app.id;
                  focusedIdx = i;
                }}
                onmouseenter={() => {
                  focusedIdx = i;
                  isKeyboardNav = false;
                }}
                onfocus={() => {
                  focusedIdx = i;
                }}
              />
            {/each}
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
    overflow-x: hidden;
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
    overflow-x: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .apps-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
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
      overflow-x: hidden;
    }

    .apps-grid {
      grid-template-columns: 1fr;
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
      overflow-x: hidden;
    }
  }
</style>
