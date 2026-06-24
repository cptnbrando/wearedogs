<script>
  import "../lib/i18n.js";
  import {
    ChartNoAxesColumn,
    Component,
    Music,
    ShoppingCart,
    Map,
    ChevronUp,
    ChevronDown,
  } from "lucide-svelte";
  import WeAreDogs from "./WeAreDogs.svelte";
  import StatsPanel from "./StatsPanel.svelte";
  import ToolboxPanel from "./ToolboxPanel.svelte";
  import MusicPanel from "./MusicPanel.svelte";
  import StorePanel from "./StorePanel.svelte";
  import MapPanel from "./MapPanel.svelte";

  // Active view state: 'stats' | 'networking' | 'toolbox' | 'music' | 'store' | 'map' | null
  let activePage = $state(null);
  let isClosing = $state(false);
  let activeLang = $state("en");
  let activeApp = $state(null);
  let textIsPaused = $state(false);
  let weAreDogsColored = $state(false);

  // Component reference for API calls
  let weAreDogsRef = $state();

  // History stack depth
  let depth = 0;

  // Track document-level fullscreen state to catch back button events
  let wasMainFullscreen = $state(false);

  $effect(() => {
    const handleFSChange = () => {
      const isMainFS = document.fullscreenElement === document.documentElement;
      if (isMainFS) {
        wasMainFullscreen = true;
      } else if (!document.fullscreenElement) {
        // Exited fullscreen. If we were previously in main fullscreen and a page is still active,
        // it means the browser exited fullscreen first due to back gesture.
        // We close the panel and immediately re-request fullscreen for the main view.
        if (wasMainFullscreen && activePage !== null) {
          closePageInternal();
          document.documentElement.requestFullscreen().catch((err) => {
            console.warn("Re-entering fullscreen failed:", err);
          });
        }
        wasMainFullscreen = false;
      }
    };
    document.addEventListener("fullscreenchange", handleFSChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFSChange);
  });

  // Sync activeApp pushes and pops procedurally/reactively
  $effect(() => {
    const page = activePage;
    const app = activeApp;

    if (page === "toolbox") {
      if (app) {
        if (depth < 2) {
          history.pushState({ view: page, app: app, depth: 2 }, "");
          depth = 2;
        }
      } else {
        if (depth > 1) {
          history.back();
          depth = 1;
        }
      }
    }
  });

  // Listen to popstate event for browser/device back key navigation
  $effect(() => {
    const handlePop = (e) => {
      const state = e.state;
      const targetView = state?.view || null;
      const targetApp = state?.app || null;
      const targetDepth = state?.depth || 0;

      // Update depth to match popped state
      depth = targetDepth;

      const wasFS = !!document.fullscreenElement;

      if (activePage === "toolbox" && activeApp && !targetApp) {
        // Go back to app launcher
        activeApp = null;
      } else if (activePage && !targetView) {
        // Close overlay panel
        closePageInternal();
      } else {
        activePage = targetView;
        activeApp = targetApp;
      }

      if (wasFS) {
        setTimeout(() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
        }, 50);
      }
    };

    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  });

  function openPage(page) {
    activePage = page;
    activeApp = null;
    isClosing = false;

    // Push the state procedurally
    history.pushState({ view: page, app: null, depth: 1 }, "");
    depth = 1;
  }

  function closePage() {
    const wasFS = !!document.fullscreenElement;
    if (depth > 0) {
      history.go(-depth);
      depth = 0;
      if (wasFS) {
        setTimeout(() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
        }, 50);
      }
    } else {
      closePageInternal();
    }
  }

  function closePageInternal() {
    isClosing = true;
    setTimeout(() => {
      activePage = null;
      isClosing = false;
      activeApp = null;
    }, 320);
  }

  function handleKeydown(e) {
    if (e.key === "Escape" && activePage !== null) {
      closePage();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Background Content -->
<WeAreDogs
  bind:this={weAreDogsRef}
  bind:currentLang={activeLang}
  bind:isPaused={textIsPaused}
  bind:isFlagColors={weAreDogsColored}
  isFaded={activePage !== null}
  onOpenStats={() => openPage("stats")}
  onOpenPage={(page) => openPage(page)}
>
  {#if textIsPaused && activePage === null}
    <div class="hieroglyphic-nav" class:colored={weAreDogsColored}>
      <!-- Button 4: Store -->
      <button
        class="runic-btn border-neon-red"
        onclick={(e) => {
          e.stopPropagation();
          openPage("store");
        }}
        title="Dog Store"
        aria-label="Dog Store"
      >
        <ShoppingCart size={28} />
      </button>

      <!-- Button 1: App Launcher -->
      <button
        class="runic-btn border-neon-orange"
        onclick={(e) => {
          e.stopPropagation();
          openPage("toolbox");
        }}
        title="App Launcher"
        aria-label="App Launcher"
      >
        <Component size={28} />
      </button>

      <!-- Button 2: Networking -->
      <!-- <button
        class="runic-btn border-neon-cyan"
        onclick={(e) => {
          e.stopPropagation();
          openPage("networking");
        }}
        title="Mesh Network"
        aria-label="Mesh Network"
      >
        <ChartNoAxesColumn size={28} />
      </button> -->

      <!-- Button 3: Music -->
      <button
        class="runic-btn border-neon-purple"
        onclick={(e) => {
          e.stopPropagation();
          openPage("music");
        }}
        title="Music"
        aria-label="Music"
      >
        <Music size={28} />
      </button>

      <!-- Button 5: Map -->
      <button
        class="runic-btn border-neon-green"
        onclick={(e) => {
          e.stopPropagation();
          openPage("map");
        }}
        title="World Map"
        aria-label="World Map"
      >
        <Map size={28} />
      </button>
    </div>
  {/if}
</WeAreDogs>

<!-- Overlay Panels -->
{#if activePage === "stats"}
  <StatsPanel
    {isClosing}
    currentLang={activeLang}
    onClose={closePage}
    onHoverLang={(code) => {
      activeLang = code;
    }}
    onSelectLang={(code) => {
      activeLang = code;
      if (weAreDogsRef) {
        weAreDogsRef.forceLanguage(code);
      }
    }}
  />
{:else if activePage === "networking"}
  <NetworkingPanel {isClosing} onClose={closePage} />
{:else if activePage === "toolbox"}
  <ToolboxPanel {isClosing} onClose={closePage} bind:activeApp />
{:else if activePage === "music"}
  <MusicPanel {isClosing} onClose={closePage} />
{:else if activePage === "store"}
  <StorePanel {isClosing} onClose={closePage} />
{:else if activePage === "map"}
  <MapPanel {isClosing} onClose={closePage} />
{/if}

<style>
  .hieroglyphic-nav {
    position: absolute;
    top: calc(100% + 2.5rem);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    width: max-content;
    z-index: 80;
    animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes slideUpFade {
    from {
      opacity: 0;
      transform: translate(-50%, 20px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  .runic-btn {
    width: 72px;
    height: 72px;
    border-radius: 16px;
    background: rgba(10, 10, 15, 0.45);
    backdrop-filter: blur(12px) saturate(160%);
    -webkit-backdrop-filter: blur(12px) saturate(160%);
    border: 2px solid var(--border-color, rgba(255, 255, 255, 0.15));
    color: var(--icon-color, rgba(255, 255, 255, 0.7));
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .runic-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    transform: translateY(-4px) scale(1.08);
    border-color: var(--icon-color);
    box-shadow: 0 0 20px var(--shadow-color, rgba(255, 255, 255, 0.15));
  }

  .runic-btn:active {
    transform: translateY(-1px) scale(0.98);
  }

  .hieroglyphic-nav.colored .runic-btn.border-neon-orange {
    --border-color: rgba(200, 160, 0, 0.35);
    --icon-color: #c8a000;
    --shadow-color: rgba(200, 160, 0, 0.3);
  }

  .hieroglyphic-nav.colored .runic-btn.border-neon-purple {
    --border-color: rgba(130, 0, 200, 0.35);
    --icon-color: #8200c8;
    --shadow-color: rgba(130, 0, 200, 0.3);
  }

  .hieroglyphic-nav.colored .runic-btn.border-neon-red {
    --border-color: rgba(180, 0, 0, 0.35);
    --icon-color: #b40000;
    --shadow-color: rgba(180, 0, 0, 0.3);
  }

  .hieroglyphic-nav.colored .runic-btn.border-neon-green {
    --border-color: rgba(0, 180, 80, 0.35);
    --icon-color: #00b450;
    --shadow-color: rgba(0, 180, 80, 0.3);
  }

  @media (max-width: 600px) {
    .hieroglyphic-nav {
      gap: 1rem;
      top: calc(100% + 3.5rem);
    }

    .runic-btn {
      width: 52px;
      height: 52px;
      border-radius: 12px;
    }

    .runic-btn :global(svg) {
      width: 20px !important;
      height: 20px !important;
    }
  }
</style>
