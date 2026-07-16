<script>
  import { onMount } from "svelte";
  import { initialLocale } from "../lib/i18n.js";
  import { locale } from "svelte-i18n";
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
  import { parsePath, panelToUrl, appToUrl } from "../lib/router.svelte.js";
  import { audioCore } from "../lib/AudioCore.svelte.js";

  // Active view state: 'stats' | 'networking' | 'toolbox' | 'music' | 'store' | 'map' | null
  let {
    activePage = $bindable(null),
    showInfo = $bindable(false),
    weAreDogsColored = $bindable(false),
    isLandingPage = true,
  } = $props();
  let isClosing = $state(false);
  let activeLang = $state(initialLocale);
  let activeApp = $state(null);
  let textIsPaused = $state(false);

  // 1. Tell Vite to code-split all sibling panel components in this directory
  const panelModules = import.meta.glob("./*.svelte");

  // 2. Map panel keys to their relative paths from this file
  const panelPathMap = {
    stats: "./StatsPanel.svelte",
    toolbox: "./ToolboxPanel.svelte",
    music: "./MusicPanel.svelte",
    store: "./StorePanel.svelte",
    map: "./MapPanel.svelte",
    info: "./InfoPanel.svelte"
  };

  // Lazy loaded panel components caching
  let loadedPanels = $state({});

  $effect(() => {
    if (activePage && !loadedPanels[activePage]) {
      const path = panelPathMap[activePage];
      const loader = panelModules[path];
      if (loader) {
        loader().then((m) => {
          loadedPanels[activePage] = m.default;
        });
      }
    }
  });

  $effect(() => {
    if (showInfo && !loadedPanels.info) {
      const loader = panelModules["./InfoPanel.svelte"];
      if (loader) {
        loader().then((m) => {
          loadedPanels.info = m.default;
        });
      }
    }
  });

  function preloadPanel(page) {
    if (loadedPanels[page]) return;
    const path = panelPathMap[page];
    const loader = panelModules[path];
    if (loader) {
      loader().then((m) => {
        loadedPanels[page] = m.default;
      });
    }
  }

  let prevIsLandingPage = $state(true);
  $effect(() => {
    const current = isLandingPage;
    if (current && !prevIsLandingPage) {
      textIsPaused = true;
    }
    prevIsLandingPage = current;
  });

  $effect(() => {
    locale.set(activeLang);
  });

  $effect(() => {
    if (activePage !== null || showInfo) {
      document.body.style.overflow = "hidden";

      const handleGlobalWheel = (e) => {
        const backdrop = document.querySelector(".toolbox-panel-backdrop");
        if (!backdrop) return;

        let scrollContainer = null;

        // Case 1: GoPro App is active
        const gopro = document.querySelector(".gopro-layout");
        if (gopro) {
          const episodes = document.querySelector(".episodes-swipe-wrapper");
          if (episodes && episodes.clientHeight > 0) {
            scrollContainer = episodes;
          }
        }

        // Case 2: Main launcher grid
        if (!scrollContainer) {
          const launcher = document.querySelector(".launcher-view");
          if (launcher && launcher.clientHeight > 0) {
            scrollContainer = launcher;
          }
        }

        // Case 3: Other apps (like rescue, settings, changelog, soundboard)
        if (!scrollContainer) {
          const body = document.querySelector(".panel-body");
          if (body) {
            const scrollables = body.querySelectorAll("*");
            for (const el of scrollables) {
              const style = window.getComputedStyle(el);
              if (
                (style.overflowY === "auto" || style.overflowY === "scroll" || el.classList.contains("shows-list-flow")) &&
                el.scrollHeight > el.clientHeight &&
                el.clientHeight > 0
              ) {
                scrollContainer = el;
                break;
              }
            }
          }
        }

        if (scrollContainer && !scrollContainer.contains(e.target)) {
          scrollContainer.scrollTop += e.deltaY;
          e.preventDefault();
        }
      };

      window.addEventListener("wheel", handleGlobalWheel, { passive: false });
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("wheel", handleGlobalWheel);
      };
    }
  });

  $effect(() => {
    const handleOpenInfo = () => {
      showInfo = true;
      const currentState = history.state || {};
      history.pushState({ ...currentState, showInfo: true }, "");
    };
    const handleOpenMusic = () => {
      showInfo = false;
      openPage("music");
    };
    window.addEventListener("open-info-panel", handleOpenInfo);
    window.addEventListener("open-music-panel", handleOpenMusic);
    return () => {
      window.removeEventListener("open-info-panel", handleOpenInfo);
      window.removeEventListener("open-music-panel", handleOpenMusic);
    };
  });

  // Component reference for API calls
  let weAreDogsRef = $state();

  // History stack depth
  let depth = $state(0);

  // Track document-level fullscreen state to catch back button events
  let wasMainFullscreen = $state(false);

  // Deep-link params set on initial page load, cleared after panel mounts
  let initialTrackId = $state(null);
  let deepLinkApp = $state(null);
  let deepLinkGoProShow = $state(null);
  let deepLinkGoProEp = $state(null);
  let deepLinkBlogPostSlug = $state(null);
  let deepLinkArcadeGame = $state(null);

  // ---------------------------------------------------------------------------
  // URL Routing — parse deep-link on first mount
  // ---------------------------------------------------------------------------
  onMount(() => {
    const path = window.location.pathname;
    // Normalise the initial history entry so that closePage()'s history.go(-depth)
    // always returns the browser to '/' rather than the original deep-link URL.
    if (path !== "/info") {
      history.replaceState({ view: null, app: null, depth: 0 }, "", "/");
    } else {
      history.replaceState({ view: null, app: null, depth: 0 }, "", "/info");
    }

    const params = parsePath(path);
    // null  or 'home' type  → already at home, nothing to open
    if (!params || params.type === "home" || params.type === "info") return;

    if (params.type === "lang") {
      // Language is a preference, not a navigation step — set and stay at home.
      activeLang = params.lang;
      setTimeout(() => weAreDogsRef?.forceLanguage(params.lang), 0);
      return;
    }

    if (params.type === "panel") {
      openPage(params.panel);
      return;
    }

    if (params.type === "music-track") {
      initialTrackId = params.trackId; // passed as prop to MusicPanel
      openPage("music");
      // Clear after MusicPanel has mounted and consumed the prop
      setTimeout(() => {
        initialTrackId = null;
      }, 500);
      return;
    }

    if (params.type === "app") {
      deepLinkApp = params.app;
      openPage("toolbox");
      setTimeout(() => {
        deepLinkApp = null;
      }, 400);
      return;
    }

    if (params.type === "arcade-game") {
      deepLinkApp = "arcade";
      deepLinkArcadeGame = params.game;
      openPage("toolbox");
      setTimeout(() => {
        deepLinkApp = null;
        deepLinkArcadeGame = null;
      }, 400);
      return;
    }

    if (params.type === "gopro-episode") {
      deepLinkApp = "gopro";
      deepLinkGoProShow = params.show;
      deepLinkGoProEp = params.episode;
      openPage("toolbox");
      setTimeout(() => {
        deepLinkApp = null;
        deepLinkGoProShow = null;
        deepLinkGoProEp = null;
      }, 400);
      return;
    }

    if (params.type === "blog-post") {
      deepLinkApp = "blog";
      deepLinkBlogPostSlug = params.slug;

      activePage = "toolbox";
      activeApp = "blog";
      isClosing = false;

      // Seed the history stack sequentially to depth 2 (blog list)
      history.pushState({ view: "toolbox", app: null, depth: 1 }, "", "/apps");
      history.pushState(
        { view: "toolbox", app: "blog", depth: 2 },
        "",
        "/apps/blog",
      );
      depth = 2; // selectPost in BlogApp will push depth 3 for the slug

      setTimeout(() => {
        deepLinkApp = null;
      }, 400);
      return;
    }
    // Any other parsePath result: home (already set up above)
  });

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
    if (isClosing) return;
    const page = activePage;
    const app = activeApp;

    if (app !== "blog") {
      deepLinkBlogPostSlug = null;
    }

    if (page === "toolbox") {
      if (app) {
        if (depth < 2) {
          history.pushState(
            { view: page, app: app, depth: 2 },
            "",
            appToUrl(app),
          );
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
      if (showInfo) {
        showInfo = false;
        return;
      }
      const state = e.state;

      // If state is null, it could be a hashchange on the current panel page.
      // Do not close the page if the pathname still matches the active page URL prefix.
      if (state === null && activePage && window.location.pathname.startsWith(panelToUrl(activePage))) {
        return;
      }

      const targetView = state?.view || null;
      const targetApp = state?.app || null;
      const targetDepth = state?.depth || 0;

      depth = targetDepth;
      const wasFS = !!document.fullscreenElement;

      if (wasFS) {
        setTimeout(() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
        }, 50);
      }

      if (
        activePage === "toolbox" &&
        activeApp &&
        !targetApp &&
        targetView === "toolbox"
      ) {
        activeApp = null;
        return;
      }

      if (activePage && !targetView) {
        closePageInternal();
        return;
      }

      if (targetView === "toolbox" && targetApp === "blog") {
        deepLinkBlogPostSlug = state?.slug || null;
      }

      isClosing = false;
      activePage = targetView;
      activeApp = targetApp;
    };

    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  });

  function openPage(page) {
    activePage = page;
    activeApp = null;
    isClosing = false;

    // Push the state procedurally — include the canonical URL for bookmarking
    history.pushState(
      { view: page, app: null, depth: 1 },
      "",
      panelToUrl(page),
    );
    depth = 1;
  }

  function closePage() {
    const wasFS = !!document.fullscreenElement;
    if (depth > 0) {
      isClosing = true;
      history.go(-depth);
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
    // Guard: don't steal keys from actual text inputs
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || document.activeElement?.isContentEditable) return;

    if (e.key === "Escape" || e.key === "Backspace") {
      // If inside a toolbox sub-app, ToolboxPanel's Escape handler takes the first press
      // (app → grid). We only close the panel once the grid is showing (activeApp === null).
      if (activePage === "toolbox" && activeApp !== null) return;
      if (activePage !== null) closePage();
      return;
    }

    // Homepage shortcuts — only when no panel is open
    if (activePage !== null) return;

    if (e.key === ",") { e.preventDefault(); openPage("store"); }
    else if (e.key === ".") { e.preventDefault(); openPage("music"); }
    else if (e.key === "/") { e.preventDefault(); openPage("toolbox"); }
    else if (e.key === "'" || e.key === "\'") { e.preventDefault(); openPage("map"); }
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
  {isLandingPage}
  onOpenStats={() => openPage("stats")}
  onOpenPage={(page) => openPage(page)}
>
  {#if textIsPaused && activePage === null}
    <div class="hieroglyphic-nav" class:colored={weAreDogsColored}>
      <!-- Store -->
      <button
        class="runic-btn border-neon-red"
        onmouseenter={() => preloadPanel("store")}
        ontouchstart={() => preloadPanel("store")}
        onclick={(e) => {
          e.stopPropagation();
          openPage("store");
        }}
        title="Dog Store"
        aria-label="Dog Store"
      >
        <ShoppingCart size={28} />
      </button>

      <!-- Music -->
      <button
        class="runic-btn border-neon-purple"
        class:rune-dancing={audioCore.isPlaying}
        onmouseenter={() => preloadPanel("music")}
        ontouchstart={() => preloadPanel("music")}
        onclick={(e) => {
          e.stopPropagation();
          openPage("music");
        }}
        title="Music"
        aria-label="Music"
      >
        <Music size={28} />
      </button>

      <!-- App Launcher -->
      <button
        class="runic-btn border-neon-orange"
        onmouseenter={() => preloadPanel("toolbox")}
        ontouchstart={() => preloadPanel("toolbox")}
        onclick={(e) => {
          e.stopPropagation();
          openPage("toolbox");
        }}
        title="App Launcher"
        aria-label="App Launcher"
      >
        <Component size={28} />
      </button>

      <!-- Networking -->
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

      <!-- Map -->
      <button
        class="runic-btn border-neon-green"
        onmouseenter={() => preloadPanel("map")}
        ontouchstart={() => preloadPanel("map")}
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
{#if activePage === "networking"}
  <NetworkingPanel {isClosing} onClose={closePage} />
{:else if activePage}
  {#if loadedPanels[activePage]}
    {@const Panel = loadedPanels[activePage]}
    {#if activePage === "stats"}
      <Panel
        {isClosing}
        currentLang={activeLang}
        onClose={closePage}
        onHoverLang={(code) => { activeLang = code; }}
        onSelectLang={(code) => {
          activeLang = code;
          if (weAreDogsRef) weAreDogsRef.forceLanguage(code);
        }}
      />
    {:else if activePage === "toolbox"}
      <Panel
        {isClosing}
        onClose={closePage}
        bind:activeApp
        initialApp={deepLinkApp}
        goProShow={deepLinkGoProShow}
        goProEpisode={deepLinkGoProEp}
        bind:blogPostSlug={deepLinkBlogPostSlug}
        bind:depth
        isFlagColors={weAreDogsColored}
        {deepLinkArcadeGame}
      />
    {:else if activePage === "music"}
      <Panel {isClosing} onClose={closePage} {initialTrackId} />
    {:else if activePage === "store" || activePage === "map"}
      <Panel {isClosing} onClose={closePage} />
    {/if}
  {:else}
    <div class="panel-loading-spinner" aria-label="Loading..."></div>
  {/if}
{/if}

{#if showInfo}
  {#if loadedPanels.info}
    {@const Panel = loadedPanels.info}
    <Panel onClose={() => { if (showInfo) history.back(); }} />
  {:else}
    <div class="panel-loading-spinner" aria-label="Loading..."></div>
  {/if}
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
    --border-color: rgba(230, 185, 0, 0.4);
    --icon-color: #e6b900;
    --shadow-color: rgba(230, 185, 0, 0.35);
  }

  .hieroglyphic-nav.colored .runic-btn.border-neon-purple {
    --border-color: rgba(160, 0, 235, 0.4);
    --icon-color: #a000eb;
    --shadow-color: rgba(160, 0, 235, 0.35);
  }

  .hieroglyphic-nav.colored .runic-btn.border-neon-red {
    --border-color: rgba(220, 0, 0, 0.4);
    --icon-color: #dc0000;
    --shadow-color: rgba(220, 0, 0, 0.35);
  }

  .hieroglyphic-nav.colored .runic-btn.border-neon-green {
    --border-color: rgba(0, 215, 95, 0.4);
    --icon-color: #00d75f;
    --shadow-color: rgba(0, 215, 95, 0.35);
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

  @media (max-height: 500px) {
    .hieroglyphic-nav {
      gap: 1rem;
      top: calc(100% + 1rem);
    }

    .runic-btn {
      width: 44px;
      height: 44px;
      border-radius: 10px;
    }

    .runic-btn :global(svg) {
      width: 16px !important;
      height: 16px !important;
    }
  }

  @media (max-height: 350px) {
    .hieroglyphic-nav {
      gap: 0.75rem;
      top: calc(100% + 0.5rem);
    }

    .runic-btn {
      width: 36px;
      height: 36px;
      border-radius: 8px;
    }

    .runic-btn :global(svg) {
      width: 14px !important;
      height: 14px !important;
    }
  }

  @keyframes runeDance {
    0%, 100% {
      transform: scale(1) rotate(0deg);
    }
    25% {
      transform: scale(1.1) rotate(-8deg);
    }
    75% {
      transform: scale(1.1) rotate(8deg);
    }
  }

  .rune-dancing :global(svg) {
    animation: runeDance 1s ease-in-out infinite;
    color: #a000eb !important;
    filter: drop-shadow(0 0 8px rgba(160, 0, 237, 0.6));
  }

  /* Panel lazy-load spinner */
  .panel-loading-spinner {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .panel-loading-spinner::after {
    content: "";
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: rgba(255, 255, 255, 0.7);
    animation: panelSpinner 0.7s linear infinite;
  }

  @keyframes panelSpinner {
    to { transform: rotate(360deg); }
  }
</style>
