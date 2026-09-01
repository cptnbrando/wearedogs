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
    Search,
    Mic,
    Film,
    Calculator,
    KeyRound,
  } from "lucide-svelte";
  import DogsLogo from "./DogsLogo.svelte";
  import AppCard from "./AppCard.svelte";
  import { unsupportedReason } from "../lib/browserSupport.js";
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
    goProShow = null,
    goProEpisode = null,
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
    calculator: "./apps/Calculator.svelte",
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
    missingcreatures: "./apps/MissingCreatures.svelte",
    wiretap: "./apps/Wiretap.svelte",
    frames: "./apps/Frames.svelte",
    passwords: "./apps/passwords/PasswordsApp.svelte",
  };

  // Lazy loaded app components caching. $state.raw + reassignment writes:
  // raw state never wraps the object in a Proxy, so this boot path can run
  // (far enough to show an error) even on engines without Proxy support.
  let loadedApps = $state.raw({});

  // Which app id (if any) failed to load — primitive string on purpose so
  // the error path itself is Proxy-free.
  let appLoadError = $state("");

  $effect(() => {
    if (activeApp && !loadedApps[activeApp]) {
      const path = appPathMap[activeApp];
      const loader = appModules[path];
      if (loader) {
        loader()
          .then((m) => {
            loadedApps = { ...loadedApps, [activeApp]: m.default };
          })
          .catch((err) => {
            console.error("Failed to load app:", activeApp, err);
            appLoadError = activeApp;
          });
      } else {
        console.error("No loader found for app path:", path);
        appLoadError = activeApp;
      }
    }
  });

  function retryAppLoad() {
    const failed = appLoadError;
    appLoadError = "";
    // Drop any half-cached entry and re-trigger the effect
    if (failed && loadedApps[failed]) {
      const next = { ...loadedApps };
      delete next[failed];
      loadedApps = next;
    }
    const current = activeApp;
    activeApp = null;
    setTimeout(() => (activeApp = current), 0);
  }

  let displayedTitle = $state("TOOLBOX");
  let dummyTitle = $state("TOOLBOX");
  let typewriterTimeout = null;

  let headerContainerWidth = $state(0);
  let headerTextWidth = $state(0);

  let isMobile = $state(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false,
  );

  function handleResize() {
    isMobile = window.innerWidth <= 768;
  }

  const hiddenApps = {
    gopro: { id: "gopro", title: "DOGS TV", icon: Video }
  };

  // Derive the active header state (icon, title, etc) from active or focused app
  const currentHeaderDetails = $derived.by(() => {
    let appInfo = null;
    if (activeApp) {
      appInfo = apps.find((a) => a.id === activeApp) || hiddenApps[activeApp];
    } else if (focusedIdx >= 0 && focusedIdx < apps.length) {
      appInfo = apps[focusedIdx];
    }

    if (appInfo) {
      let title = appInfo.title;
      if (appInfo.id === "missingcreatures") {
        title = isMobile ? "Missing" : "Missing Creatures";
      }
      if (appInfo.id === "converter") {
        title = isMobile ? "Converter" : "Catalytic Converter";
      }
      if (appInfo.id === "windshieldwiper") {
        title = isMobile ? "Windshield" : "Windshield Wiper";
      }
      if (appInfo.id === "soundboard") {
        title = isMobile ? "Soundboard" : "Dog Soundboard";
      }
      return {
        title,
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

    if (current === target) {
      dummyTitle = target;
      return;
    }

    // Animate characters (backspace first, then type in)
    if (target.startsWith(current)) {
      dummyTitle = target;
      displayedTitle = target.slice(0, current.length + 1);
      typewriterTimeout = setTimeout(stepTypewriter, 24);
    } else {
      displayedTitle = current.slice(0, -1);
      if (displayedTitle === "") {
        // Only update dummyTitle (which shifts container width and center)
        // after the old name has been fully backspaced / deleted.
        dummyTitle = target;
      }
      typewriterTimeout = setTimeout(stepTypewriter, 10);
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

  function confirmClose() {
    if (typeof window === "undefined" || !window.hasUnsavedData) return true;
    const confirmed = confirm(
      "Wait, all your data will be lost, are you sure you want to leave?",
    );
    if (!confirmed) return false;
    window.hasUnsavedData = false;
    return true;
  }

  function handleBack() {
    if (activeApp === "blog" && isReadingPost) {
      isReadingPost = false;
    } else if (history.state?.app) {
      if (confirmClose()) {
        history.back();
      }
    } else {
      if (confirmClose()) {
        activeApp = null;
      }
    }
  }

  function handleBackdropClick() {
    if (confirmClose()) {
      onClose();
    }
  }

  function handleCloseClick() {
    if (confirmClose()) {
      onClose();
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
    calculator: "#ff55bb",
    dataflash: "#00d7ff",
    rescue: "#00bfff",
    changelog: "#00ff66",
    settings: "#ff3344",
    wiretap: "#00ff66",
    frames: "#ff5e00",
    passwords: "#00d75f",
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
      id: "converter",
      title: "Catalytic Converter",
      desc: "A way to convert img, vid, audio files.",
      icon: RefreshCw,
    },
    {
      id: "qrgenerator",
      title: "QR Generator",
      desc: "Generate resizable QR codes with optional center logos.",
      icon: QrCode,
    },
    {
      id: "reader",
      title: "Image Reader",
      desc: "Extract editable text from images.",
      icon: FileText,
    },
    {
      id: "wiretap",
      title: "Wiretap",
      desc: "Record audio and video streams with live transcriptions and waveforms.",
      icon: Mic,
    },
    {
      id: "passwords",
      title: "Password Generator",
      desc: "Generate secure random passwords up to 200 characters with entropy analysis.",
      icon: KeyRound,
    },
    {
      id: "dataflash",
      title: "Data Train",
      desc: "Multi-protocol secure data dispatcher (QR, BT, USB, AirRTC).",
      icon: Zap,
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
      desc: "Clean watermarks, logos, and text from images and videos using canvas magic.",
      icon: Sparkles,
    },
    {
      id: "soundboard",
      title: "Dog Soundboard",
      desc: "Bark bark bark.",
      icon: Volume2,
    },
    {
      id: "snake",
      title: "Snake",
      desc: "The classic. AI mode included.",
      icon: Award,
    },
    {
      id: "arcade",
      title: "Arcade",
      desc: "Play retro consoles (GBA, N64, NDS, Genesis).",
      icon: Gamepad2,
    },
    {
      id: "stopwatch",
      title: "Father Time",
      desc: "Explore the sounds and sands of time.",
      icon: Hourglass,
    },
    {
      id: "paint",
      title: "Sketch",
      desc: "Draw and paint.",
      icon: Paintbrush,
    },
    // {
    //   id: "missingcreatures",
    //   title: "Missing Creatures",
    //   desc: "Investigate missing people and dogs.",
    //   icon: Search,
    // },
    {
      id: "memes",
      title: "MEMES",
      desc: "Create custom memes and explore pop culture.",
      icon: Smile,
    },
    {
      id: "frames",
      title: "Frames",
      desc: "Upload a video and step through it precisely frame-by-frame.",
      icon: Film,
    },
    {
      id: "worldcup",
      title: "2026 World Cup",
      desc: "Archived matches, group stage standings, and the responsive bracket.",
      icon: Trophy,
    },
    // RESCUE, GOPRO, DATAFLASH, CHANGELOG, AND SETTINGS MUST ALWAYS BE LAST IN THIS LIST
    {
      id: "calculator",
      title: "Calculator",
      desc: "A secure digital calculator for standard mathematical operations.",
      icon: Calculator,
    },
    {
      id: "rescue",
      title: "Rescue Ops",
      desc: "Coordinate search-and-rescue beacons.",
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
      desc: "Customize this website.",
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

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("resize", handleResize);
    handleResize();
  });
  onDestroy(() => {
    window.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("resize", handleResize);
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="toolbox-panel-backdrop" onclick={handleBackdropClick}>
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
        <span
          class="app-indicator-icon flex items-center justify-center w-6 mr-1.5 shrink-0"
        >
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
            <span class="invisible-dummy">{dummyTitle}</span>
            <span class="typewriter-content">{displayedTitle}</span>
          </h1>
        </div>
        <div class="w-6 ml-1.5 shrink-0 pointer-events-none"></div>
      </div>

      <button
        class="close-btn"
        onclick={activeApp !== null ? handleBack : handleCloseClick}
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
              {@const reason = unsupportedReason(app.id)}
              <AppCard
                {app}
                index={i}
                isFocused={focusedIdx === i}
                {isKeyboardNav}
                disabledReason={reason || ""}
                tabIndex={focusedIdx === i || (i === 0 && focusedIdx === -1)
                  ? 0
                  : -1}
                onclick={() => {
                  focusedIdx = i;
                  if (!reason) activeApp = app.id;
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
        {#if appLoadError === activeApp}
          <!-- Chunk failed to load or evaluate — never leave the spinner up -->
          <div class="app-load-error">
            <p class="err-title">This app couldn't start on this browser.</p>
            <p class="err-sub">
              It may need features this browser doesn't have, or the
              connection hiccupped.
            </p>
            <button class="err-retry" onclick={retryAppLoad}>Retry</button>
            {#if activeApp === "gopro"}
              <a class="err-tv" href="/gopro/">Watch on the TV version →</a>
            {/if}
          </div>
        {:else if loadedApps[activeApp]}
          {@const App = loadedApps[activeApp]}
          <svelte:boundary>
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
            {:else if activeApp === "calculator"}
              <!-- The calculator persists the passcode under the unlocked
                   app's own key before calling this — no storage writes here -->
              <App onUnlock={(targetApp) => {
                activeApp = targetApp;
              }} />
            {:else if activeApp === "gopro"}
              <App {goProShow} {goProEpisode} />
            {:else}
              <App />
            {/if}
            {#snippet failed(error, reset)}
              <!-- Mount/effect threw inside the app (missing API, etc.) -->
              <div class="app-load-error">
                <p class="err-title">This app crashed on this browser.</p>
                <p class="err-sub">{error?.message || error}</p>
                <button class="err-retry" onclick={reset}>Retry</button>
                {#if activeApp === "gopro"}
                  <a class="err-tv" href="/gopro/">Watch on the TV version →</a>
                {/if}
              </div>
            {/snippet}
          </svelte:boundary>
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

  /* ── App load error (replaces the eternal spinner) ── */
  .app-load-error {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    text-align: center;
    padding: 24px;
  }

  .err-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.9);
  }

  .err-sub {
    margin: 0;
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.45);
    max-width: 46ch;
  }

  .err-retry {
    margin-top: 6px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    color: #fff;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 8px 26px;
    cursor: pointer;
  }

  .err-retry:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .err-tv {
    font-size: 0.8rem;
    color: #6ea8ea;
  }

  /* ── Mobile Layout Full Screen & App Grid ── */
  @media (max-width: 768px) {
    .toolbox-panel-container {
      width: 100vw;
      height: 100vh; /* pre-dvh fallback */
      height: 100dvh;
      max-height: 100vh;
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
