<script>
  import { onMount, onDestroy, untrack } from "svelte";
  import {
    ArrowLeft,
    Award,
    Volume2,
    Paintbrush,
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
    RefreshCw,
    FileText,
    Gamepad2,
    Component,
  } from "lucide-svelte";
  import DogsLogo from "./DogsLogo.svelte";
  import AppCard from "./AppCard.svelte";
  import { audioCore } from "../lib/AudioCore.svelte.js";

  let {
    isClosing = false,
    onClose,
    activeApp = $bindable(null),
    isFlagColors = false,
    initialApp = null,
    blogPostSlug = $bindable(null),
    depth = $bindable(0),
    deepLinkArcadeGame = null,
  } = $props();

  const TITLE_DEFAULT = "Toolbox";

  let isReadingPost = $state(false);
  let appsGridEl = $state(null);
  let isKeyboardNav = $state(false);

  // 1. Tell Vite to code-split and find all .svelte apps inside apps/ recursively
  const appModules = import.meta.glob("./apps/**/*.svelte");

  // 2. Map app ids to their actual relative paths from this file
  const appPathMap = {
    snake: "./apps/SnakeApp.svelte",
    arcade: "./apps/arcade/ArcadeApp.svelte",
    soundboard: "./apps/SoundboardApp.svelte",
    paint: "./apps/PaintApp.svelte",
    stopwatch: "./apps/fathertime/FatherTimeApp.svelte",
    gopro: "./apps/GoPro.svelte",
    dataflash: "./apps/datatrain/DataTrain.svelte",
    qrgenerator: "./apps/QRGenerator.svelte",
    rescue: "./apps/Rescue.svelte",
    memes: "./apps/MemesApp.svelte",
    worldcup: "./apps/WorldCupApp.svelte",
    changelog: "./apps/ChangelogApp.svelte",
    blog: "./apps/BlogApp.svelte",
    settings: "./apps/SettingsApp.svelte",
    soundstripper: "./apps/SoundStripper.svelte",
    converter: "./apps/CatalyticConverter.svelte",
    reader: "./apps/ImageReader.svelte",
    windshieldwiper: "./apps/WindshieldWiper.svelte",
  };

  // Lazy loaded app components caching
  let loadedApps = $state({});

  $effect(() => {
    if (activeApp && !loadedApps[activeApp]) {
      const path = appPathMap[activeApp];
      const loader = appModules[path];
      if (loader) {
        loader().then((m) => {
          loadedApps[activeApp] = m.default;
        });
      }
    }
  });

  let displayedTitle = $state("TOOLBOX");
  let typewriterTimeout = null;

  let headerContainerWidth = $state(0);
  let headerTextWidth = $state(0);

  // Derive the active header state (icon, title, etc) from active or focused app
  const currentHeaderDetails = $derived.by(() => {
    let appInfo = null;
    if (activeApp) {
      appInfo = apps.find((a) => a.id === activeApp);
    } else if (focusedIdx >= 0 && focusedIdx < apps.length) {
      appInfo = apps[focusedIdx];
    }

    if (appInfo) {
      return {
        title: appInfo.title,
        icon: appInfo.icon,
        isEmoji: appInfo.id === "converter",
        id: appInfo.id,
      };
    }

    return {
      title: "TOOLBOX",
      icon: Component,
      isEmoji: false,
      id: "toolbox",
    };
  });

  const currentTargetTitle = $derived(currentHeaderDetails.title);

  function stepTypewriter() {
    clearTimeout(typewriterTimeout);

    const target = currentTargetTitle;
    const current = displayedTitle;

    if (current === target) return;

    // Animate characters (backspace first, then type in)
    if (target.startsWith(current)) {
      displayedTitle = target.slice(0, current.length + 1);
      typewriterTimeout = setTimeout(stepTypewriter, 35);
    } else {
      displayedTitle = current.slice(0, -1);
      typewriterTimeout = setTimeout(stepTypewriter, 15);
    }
  }

  $effect(() => {
    // Trigger typewriter step on target change
    const _t = currentTargetTitle;
    untrack(() => {
      stepTypewriter();
    });
    return () => clearTimeout(typewriterTimeout);
  });

  // Reset focus/hover when returning to the apps grid view
  $effect(() => {
    if (activeApp === null) {
      focusedIdx = -1;
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

  const appColors = {
    blog: "#b455ff",
    qrgenerator: "#00d7ff",
    converter: "#ff5e00",
    stopwatch: "#00ff66",
    worldcup: "#e6b900",
    soundstripper: "#ff007f",
    windshieldwiper: "#00ffff",
    snake: "#00ff66",
    arcade: "#e6b900",
    paint: "#ffcc00",
    soundboard: "#ff55bb",
    reader: "#ff3344",
    gopro: "#ff55bb",
    dataflash: "#00d7ff",
    rescue: "#00bfff",
    changelog: "#00ff66",
    settings: "#ff3344",
  };

  // CRITICAL: The changelog and settings apps MUST always remain next to each other at the bottom of the toolbox list, with settings last.
  const apps = [
    {
      id: "blog",
      title: "Dog Blog",
      desc: "Read articles about punk rock tech, development, and music.",
      icon: BookOpen,
    },
    {
      id: "qrgenerator",
      title: "QR Generator",
      desc: "Generate resizable QR codes with custom center logo overlays.",
      icon: QrCode,
    },
    {
      id: "converter",
      title: "Catalytic Converter",
      desc: "A way to convert img, vid, audio files.",
      icon: RefreshCw,
    },
    {
      id: "stopwatch",
      title: "Father Time",
      desc: "Sands of time: stopwatch, timer, alarms, world clock, metronome & tuning fork.",
      icon: Hourglass,
    },
    {
      id: "worldcup",
      title: "FIFA World Cup",
      desc: "Track matches, group stage standings, and the responsive bracket.",
      icon: Trophy,
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
      id: "snake",
      title: "Snake",
      desc: "Retro snake game, runs inside grid. Use Arrow Keys.",
      icon: Award,
    },
    {
      id: "arcade",
      title: "Arcade",
      desc: "Play retro consoles (GBA, N64, NDS, Genesis) with virtual touch gamepads.",
      icon: Gamepad2,
    },
    {
      id: "paint",
      title: "Sketch",
      desc: "Draw and paint illustrations on a canvas.",
      icon: Paintbrush,
    },
    {
      id: "soundboard",
      title: "Dog Soundboard",
      desc: "Play high fidelity dog bark synthesizers.",
      icon: Volume2,
    },
    /* {
      id: "memes",
      title: "Canine Memes",
      desc: "Explore and share high-fidelity, hilarious dog memes.",
      icon: Smile,
    }, */
    {
      id: "reader",
      title: "Image Reader",
      desc: "Extract editable text from uploaded images in any format.",
      icon: FileText,
    },
    // RESCUE, GOPRO, DATAFLASH, CHANGELOG, AND SETTINGS MUST ALWAYS BE LAST IN THIS LIST
    {
      id: "gopro",
      title: "GoPro Cinema",
      desc: "Stream retro TV series and clip custom audio loops.",
      icon: Video,
    },
    {
      id: "dataflash",
      title: "Data Train",
      desc: "Multi-protocol secure data dispatcher (QR, BT, USB, AirRTC).",
      icon: Zap,
    },
    {
      id: "rescue",
      title: "Rescue Ops",
      desc: "Coordinate search-and-rescue beacons and flight paths.",
      icon: Radio,
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

  const appIds = $derived(apps.map((a) => a.id));
  const appCount = $derived(apps.length);

  let focusedIdx = $state(-1);

  function scrollFocusedCardIntoView() {
    if (focusedIdx === -1) return;
    const el = document.querySelector(
      `.app-card[data-app-idx="${focusedIdx}"]`,
    );
    if (el) {
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  function handleKeydown(e) {
    if (e.key === "Escape" || e.key === "Backspace") {
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
      focusedIdx = focusedIdx === -1 ? 0 : (focusedIdx + 1) % appCount;
      scrollFocusedCardIntoView();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      isKeyboardNav = true;
      focusedIdx =
        focusedIdx === -1
          ? appCount - 1
          : (focusedIdx - 1 + appCount) % appCount;
      scrollFocusedCardIntoView();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      isKeyboardNav = true;
      focusedIdx = focusedIdx === -1 ? 0 : (focusedIdx + cols) % appCount;
      scrollFocusedCardIntoView();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      isKeyboardNav = true;
      focusedIdx =
        focusedIdx === -1
          ? appCount - 1
          : (focusedIdx - cols + appCount) % appCount;
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

      <div class="active-app-header-box">
        <span class="app-indicator-icon flex items-center justify-center">
          {#if currentHeaderDetails.isEmoji}
            🔥
          {:else}
            {@const IconComp = currentHeaderDetails.icon}
            {@const color = appColors[currentHeaderDetails.id] || "#b455ff"}
            <IconComp
              size={16}
              style="color: {color}; filter: drop-shadow(0 0 5px {color}66);"
              class={currentHeaderDetails.id === "stopwatch"
                ? "animated-hourglass"
                : ""}
            />
          {/if}
        </span>
        <div
          class="header-scroll-container"
          bind:clientWidth={headerContainerWidth}
          class:overflowing={headerTextWidth > headerContainerWidth}
          style="--scroll-dist: -{headerTextWidth - headerContainerWidth}px"
        >
          <h1
            class="header-title-text"
            bind:clientWidth={headerTextWidth}
            class:animate-scroll={headerTextWidth > headerContainerWidth}
          >
            <span class="invisible-dummy">{currentTargetTitle}</span>
            <span class="typewriter-content">{displayedTitle}</span>
          </h1>
        </div>
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
          <div
            class="apps-grid"
            bind:this={appsGridEl}
            onmouseleave={() => {
              if (!isKeyboardNav) focusedIdx = -1;
            }}
          >
            {#each apps as app, i}
              <AppCard
                {app}
                index={i}
                isFocused={focusedIdx === i}
                {isKeyboardNav}
                tabIndex={focusedIdx === i || (i === 0 && focusedIdx === -1)
                  ? 0
                  : -1}
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
      {:else if activeApp}
        {#if loadedApps[activeApp]}
          {@const App = loadedApps[activeApp]}
          {#if activeApp === "arcade"}
            <App initialGameId={deepLinkArcadeGame} />
          {:else if activeApp === "blog"}
            <App
              bind:initialSlug={blogPostSlug}
              bind:isReading={isReadingPost}
              bind:depth
              {isFlagColors}
            />
          {:else if activeApp === "windshieldwiper"}
            <App onClose={() => (activeApp = null)} />
          {:else}
            <App />
          {/if}
        {:else}
          <div class="app-loading-spinner" aria-label="Loading..."></div>
        {/if}
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
    min-width: 0;
  }

  .logo-btn {
    display: flex;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    flex-shrink: 0;
  }

  .active-app-header-box {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-width: 0;
    flex: 1;
    text-align: center;
  }

  .app-indicator-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .header-scroll-container {
    overflow: hidden;
    white-space: nowrap;
    min-width: 0;
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .header-scroll-container.overflowing {
    justify-content: flex-start;
  }

  .header-title-text {
    display: inline-block;
    position: relative;
    white-space: nowrap;
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.95);
    font-family: "Outfit", "Inter", sans-serif;
  }

  .invisible-dummy {
    visibility: hidden;
    display: inline-block;
    pointer-events: none;
    user-select: none;
  }

  .typewriter-content {
    position: absolute;
    left: 0;
    top: 0;
    white-space: nowrap;
    display: flex;
    align-items: center;
  }

  @media (max-width: 768px) {
    .header-scroll-container.overflowing {
      mask-image: linear-gradient(
        to right,
        transparent,
        black 12px,
        black 90%,
        transparent
      );
      -webkit-mask-image: linear-gradient(
        to right,
        transparent,
        black 12px,
        black 90%,
        transparent
      );
    }

    .header-title-text.animate-scroll {
      animation: header-scroll-text 8s linear infinite alternate;
    }
  }

  @keyframes header-scroll-text {
    0%,
    15% {
      transform: translateX(0);
    }
    85%,
    100% {
      transform: translateX(var(--scroll-dist));
    }
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

  /* ── App Loading Spinner ── */
  .app-loading-spinner {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .app-loading-spinner::after {
    content: "";
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.08);
    border-top-color: rgba(255, 255, 255, 0.6);
    animation: appSpinner 0.7s linear infinite;
  }

  @keyframes appSpinner {
    to {
      transform: rotate(360deg);
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
  .active-app-header-box {
    display: flex;
    align-items: center;
    gap: 0px;
    max-width: 92.5%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 6px 14px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    animation: boxFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes boxFadeIn {
    from {
      opacity: 0;
      transform: scale(0.96) translateX(-5px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateX(0);
    }
  }

  .header-title-text {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.9);
    font-family: "Outfit", "Inter", sans-serif;
  }

  .app-indicator-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    animation: indicatorIconFadeIn 0.3s ease-out;
  }

  @keyframes indicatorIconFadeIn {
    from {
      opacity: 0;
      transform: scale(0.85);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Animated Hourglass rotation */
  :global(.animated-hourglass) {
    animation: hourglass-flip 3s infinite ease-in-out;
  }

  @keyframes hourglass-flip {
    0% {
      transform: rotate(0deg);
    }
    45% {
      transform: rotate(0deg);
    }
    55% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(180deg);
    }
  }

  /* Responsive styling for active app title */
  @media (max-width: 640px) {
    .active-app-header-box {
      padding: 4px 10px;
      gap: 10px;
      max-width: 220px;
      margin: 0 auto;
    }
    .header-title-text {
      font-size: 0.8rem;
    }
  }
</style>
