<script>
  import "../lib/i18n.js";
  import { ChartNoAxesColumn, Component } from "lucide-svelte";
  import WeAreDogs from "./WeAreDogs.svelte";
  import StatsPanel from "./StatsPanel.svelte";
  import NetworkingPanel from "./NetworkingPanel.svelte";
  import ToolboxPanel from "./ToolboxPanel.svelte";

  // Active view state: 'stats' | 'networking' | 'toolbox' | null
  let activePage = $state(null);
  let isClosing = $state(false);
  let activeLang = $state("en");
  let activeApp = $state(null);

  // Component reference for API calls
  let weAreDogsRef = $state();

  // History stack depth
  let depth = 0;

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
    if (depth > 0) {
      history.go(-depth);
      depth = 0;
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
  isFaded={activePage !== null}
  onOpenStats={() => openPage("stats")}
/>

<!-- Bottom Buttons (Only visible when no overlays are active) -->
{#if activePage === null}
  <!-- Bottom Left: Networking Panel -->
  <button
    class="fixed bottom-6 left-6 border-2 border-white cursor-pointer p-2 bg-black/60 hover:bg-white hover:text-black transition-colors rounded-lg z-50 flex items-center justify-center"
    style="bottom: max(1.5rem, calc(1.5rem + env(safe-area-inset-bottom, 0px)))"
    onclick={() => openPage("networking")}
    aria-label="Open Networking page"
  >
    <ChartNoAxesColumn />
  </button>

  <!-- Bottom Right: Toolbox Panel -->
  <button
    class="fixed bottom-6 right-6 border-2 border-white cursor-pointer p-2 bg-black/60 hover:bg-white hover:text-black transition-colors rounded-lg z-50 flex items-center justify-center"
    style="bottom: max(1.5rem, calc(1.5rem + env(safe-area-inset-bottom, 0px)))"
    onclick={() => openPage("toolbox")}
    aria-label="Open Toolbox page"
  >
    <Component />
  </button>
{/if}

<!-- Overlay panels -->
{#if activePage === "stats"}
  <StatsPanel
    isClosing={isClosing}
    currentLang={activeLang}
    onClose={closePage}
    onHoverLang={(code) => { activeLang = code; }}
    onSelectLang={(code) => {
      activeLang = code;
      if (weAreDogsRef) {
        weAreDogsRef.forceLanguage(code);
      }
    }}
  />
{:else if activePage === "networking"}
  <NetworkingPanel
    isClosing={isClosing}
    onClose={closePage}
  />
{:else if activePage === "toolbox"}
  <ToolboxPanel
    isClosing={isClosing}
    onClose={closePage}
    bind:activeApp={activeApp}
  />
{/if}
