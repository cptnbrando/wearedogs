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

  // Component reference for API calls
  let weAreDogsRef = $state();

  function openPage(page) {
    activePage = page;
    isClosing = false;
  }

  function closePage() {
    isClosing = true;
    setTimeout(() => {
      activePage = null;
      isClosing = false;
    }, 320); // match animation duration (0.32s)
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
    class="absolute bottom-6 left-6 border-2 border-white cursor-pointer p-2 bg-black/60 hover:bg-white hover:text-black transition-colors rounded-lg z-50 flex items-center justify-center"
    onclick={() => openPage("networking")}
    aria-label="Open Networking page"
  >
    <ChartNoAxesColumn />
  </button>

  <!-- Bottom Right: Toolbox Panel -->
  <button
    class="absolute bottom-6 right-6 border-2 border-white cursor-pointer p-2 bg-black/60 hover:bg-white hover:text-black transition-colors rounded-lg z-50 flex items-center justify-center"
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
  />
{/if}
