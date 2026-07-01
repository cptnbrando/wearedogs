<script>
  import { onMount } from "svelte";
  import { Trophy, Search, RefreshCw, AlertCircle, Grid, List } from "lucide-svelte";
  
  // Decoupled logic & components
  import { WorldCupController } from "../../lib/worldcup.js";
  import TournamentHub from "./worldcup/TournamentHub.svelte";
  import GroupStage from "./worldcup/GroupStage.svelte";
  import KnockoutBracket from "./worldcup/KnockoutBracket.svelte";
  import TeamStatusGrid from "./worldcup/TeamStatusGrid.svelte";

  // Hoisted constants
  const IS_DEV = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  const API_BASE = IS_DEV ? "/api-worldcup" : "https://worldcup26.ir";

  // Svelte 5 state variables
  let activeTab = $state("bracket"); // 'bracket' | 'standings' | 'teams'
  let searchQuery = $state("");
  let selectedRoundMobile = $state("r32");
  let isLoading = $state(true);
  let isRefreshing = $state(false);
  let isOffline = $state(false);
  let controller = $state(null);

  // Derived properties
  let standings = $derived(controller ? controller.calculateStandings() : {});
  let thirdPlaceStandings = $derived(controller ? controller.getThirdPlaceStandings(standings) : []);
  let teamStatuses = $derived(controller ? controller.getTeamStatuses() : {});
  let bracketMatches = $derived(controller ? controller.getBracketMatches() : { r32: [], r16: [], qf: [], sf: [], third: null, final: null });

  let currentMatch = $derived(getCurrentMatch());
  let currentStage = $derived.by(() => {
    if (!currentMatch) return "group";
    return currentMatch.type === "group" ? "group" : currentMatch.type === "final" || currentMatch.type === "third" ? "finals" : currentMatch.type;
  });

  /**
   * Identifies the current active or upcoming match in the tournament.
   * Prioritizes live matches, then the next unfinished match, falling back to the last game.
   * @returns {Object|null} The current match object or null.
   */
  function getCurrentMatch() {
    if (!controller) return null;
    const live = controller.games.find(g => g.finished !== "TRUE" && g.time_elapsed !== "notstarted");
    if (live) return live;
    const unfinished = controller.games.find(g => g.finished !== "TRUE");
    return unfinished || controller.games[controller.games.length - 1];
  }

  /**
   * Directs the viewport navigation to focus on the current match.
   * Changes active tabs, applies visual glows/highlights, and scrolls the element into view.
   */
  function jumpToCurrentMatch() {
    if (!controller || !currentMatch) return;
    
    if (currentMatch.type === "group") {
      activeTab = "standings";
      searchQuery = "";
      setTimeout(() => {
        const groupEl = document.getElementById(`group-card-${currentMatch.group}`);
        if (groupEl) {
          groupEl.scrollIntoView({ behavior: "smooth", block: "center" });
          groupEl.classList.add("highlight-flash");
          setTimeout(() => groupEl.classList.remove("highlight-flash"), 1600);
        }
      }, 100);
    } else {
      activeTab = "bracket";
      selectedRoundMobile = currentMatch.type === "third" ? "final" : currentMatch.type;
      setTimeout(() => {
        const cardEl = document.getElementById(`match-card-${currentMatch.id}`);
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
          cardEl.classList.add("searched-glow");
          setTimeout(() => cardEl.classList.remove("searched-glow"), 3000);
        }
      }, 100);
    }
  }

  onMount(async () => {
    await loadData(true);
  });

  /**
   * Loads fixtures and standings data from the API endpoint, falling back to the cached JSON.
   * On initial load, sets isLoading to trigger the full screen synchronizing overlay.
   * On background syncs, performs seamless updates in place without layout shifts.
   * @param {boolean} [isInitial=false] - True if this is the first load.
   */
  async function loadData(isInitial = false) {
    if (isInitial) {
      isLoading = true;
    }
    try {
      const [resTeams, resGames, resGroups] = await Promise.all([
        fetch(`${API_BASE}/get/teams`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE}/get/games`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE}/get/groups`).then(r => r.json()).catch(() => null)
      ]);

      if (resTeams?.teams && resGames?.games && resGroups?.groups) {
        controller = new WorldCupController(resGames.games, resTeams.teams, resGroups.groups);
        isOffline = false;
      } else {
        useFallback();
      }
    } catch (err) {
      console.warn("Failed fetching live api, loading fallback:", err);
      useFallback();
    } finally {
      if (isInitial) {
        isLoading = false;
      }
      isRefreshing = false;
    }
  }

  function useFallback() {
    controller = new WorldCupController();
    isOffline = true;
  }

  async function handleRefresh() {
    isRefreshing = true;
    await loadData(false);
  }

  // Touch gesture swiping for main tabs navigation
  let touchStartX = 0;
  let touchStartY = 0;

  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function handleMainTouchEnd(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
      const tabs = ["bracket", "standings", "teams"];
      const currentIndex = tabs.indexOf(activeTab);
      if (diffX > 0) {
        if (currentIndex > 0) activeTab = tabs[currentIndex - 1];
      } else {
        if (currentIndex < tabs.length - 1) activeTab = tabs[currentIndex + 1];
      }
    }
  }
</script>

<div class="wc-container flex flex-col w-full h-full overflow-hidden select-none">
  {#if isLoading}
    <div class="flex flex-col items-center justify-center grow gap-3 text-white/50 text-xs">
      <RefreshCw size={36} class="animate-spin text-neon-gold" />
      <p>Synchronizing fixtures and standings...</p>
    </div>
  {:else}
    <div class="wc-layout-wrapper flex flex-col w-full h-full overflow-hidden">
      <!-- Left Sidebar (Branding + Timeline Progress) -->
      <div class="wc-left-sidebar flex flex-col shrink-0">
        <!-- Sub Header with Controls -->
        <header class="flex justify-between items-center p-4 bg-black/25 border-b border-white/5 shrink-0">
          <div class="flex items-center gap-3">
            <div class="text-neon-gold animate-float flex items-center justify-center">
              <Trophy size={24} />
            </div>
            <div>
              <h3 class="m-0 text-sm font-extrabold tracking-wider uppercase text-white">FIFA World Cup 2026</h3>
              <p class="m-0 text-[10px] text-white/45">Live Standings, Bracket & Teams (48 Teams)</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            {#if isOffline}
              <span class="offline-badge text-[9px] font-extrabold tracking-wider bg-red-500/10 border border-red-500/30 text-red-500 px-2 py-1 rounded flex items-center gap-1">
                <AlertCircle size={12} /> CACHE LOADED
              </span>
            {/if}
            <button 
              class="refresh-btn bg-white/3 border border-white/8 hover:bg-white/8 hover:border-white/20 text-white/75 hover:text-white rounded-lg px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all duration-200"
              onclick={handleRefresh} 
              disabled={isRefreshing}
            >
              <RefreshCw size={12} class={isRefreshing ? "animate-spin" : ""} />
              <span>{isRefreshing ? "SYNCING..." : "SYNC"}</span>
            </button>
          </div>
        </header>

        <!-- Tournament Hub Timeline Banner -->
        <TournamentHub 
          {currentStage} 
          {currentMatch} 
          {controller} 
          onJumpToMatch={jumpToCurrentMatch} 
        />
      </div>

      <!-- Right Main Content Area -->
      <div class="wc-main-content flex flex-col grow overflow-hidden">
        <!-- Navigation Tab Bar -->
        <div class="wc-navigation-bar flex flex-col sm:flex-row justify-between items-stretch sm:items-center px-4 py-2 bg-black/15 border-b border-white/3 shrink-0 gap-3">
          <div class="flex gap-1.5 select-none justify-center sm:justify-start">
            <button 
              class="tab-btn" 
              class:active={activeTab === "bracket"} 
              onclick={() => activeTab = "bracket"}
            >
              <Trophy size={14} />
              <span>Bracket</span>
            </button>
            <button 
              class="tab-btn" 
              class:active={activeTab === "standings"} 
              onclick={() => activeTab = "standings"}
            >
              <Grid size={14} />
              <span>Standings</span>
            </button>
            <button 
              class="tab-btn" 
              class:active={activeTab === "teams"} 
              onclick={() => activeTab = "teams"}
            >
              <List size={14} />
              <span>Teams</span>
            </button>
          </div>

          <!-- Search Box -->
          <div class="relative flex items-center w-full sm:max-w-[200px]">
            <Search size={12} class="absolute left-2.5 text-white/35 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search team..." 
              bind:value={searchQuery}
              class="w-full bg-white/4 border border-white/8 rounded-lg pl-8 pr-7 py-1 text-[11px] text-white focus:outline-none focus:border-red-500/50 focus:bg-black/30 transition-all duration-200"
            />
            {#if searchQuery}
              <button 
                class="absolute right-2 bg-transparent border-none text-white/40 hover:text-white cursor-pointer text-[10px] p-0.5" 
                onclick={() => searchQuery = ""}
              >
                ✕
              </button>
            {/if}
          </div>
        </div>

        <!-- Main Content Area with Touch Swiping -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div 
          class="grow overflow-hidden flex flex-col"
          ontouchstart={handleTouchStart}
          ontouchend={(e) => {
            if (activeTab === "bracket") return; // Let bracket subcomponent handle swipe rounds
            handleMainTouchEnd(e);
          }}
        >
          {#if activeTab === "bracket"}
            <KnockoutBracket 
              {controller} 
              bind:searchQuery 
              {bracketMatches} 
              {teamStatuses} 
              bind:selectedRoundMobile 
              {currentMatch}
            />
          {:else if activeTab === "standings"}
            <GroupStage 
              {standings} 
              {thirdPlaceStandings} 
              {searchQuery} 
            />
          {:else if activeTab === "teams"}
            <TeamStatusGrid 
              {controller} 
              {teamStatuses} 
              {searchQuery} 
            />
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "../../styles/variables" as *;

  .wc-container {
    background: $bg-radial-overlay;
    font-family: $font-primary;
    color: white;
  }

  .animate-float {
    animation: trophyFloat 3s ease-in-out infinite alternate;
  }

  .text-neon-gold {
    color: $color-neon-gold;
  }

  .offline-badge {
    animation: pulseGlow 2s infinite alternate;
  }

  .tab-btn {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.55);
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all $transition-speed-fast cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      background: rgba(255, 255, 255, 0.03);
      color: white;
    }

    &.active {
      background: rgba(var(--color-neon-red-rgb, 255, 51, 68), 0.1);
      border: 1px solid rgba(var(--color-neon-red-rgb, 255, 51, 68), 0.3);
      color: $color-neon-red;
      text-shadow: 0 0 10px rgba(var(--color-neon-red-rgb, 255, 51, 68), 0.2);
    }
  }

  // Landscape View styling
  @media (max-height: 520px) {
    .wc-layout-wrapper {
      flex-direction: row !important;
    }

    .wc-left-sidebar {
      width: 350px !important;
      height: 100% !important;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      overflow: hidden !important;
      flex-shrink: 0 !important;
      zoom: 0.8;

      // Adjust header spacing inside sidebar
      header {
        padding: 10px !important;
      }

      // Force child sections inside the narrow sidebar to layout vertically
      :global(section) {
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 10px !important;
        padding: 10px !important;

        // Target the timeline progress wrapper
        > :global(div:first-child) {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
        }

        // Target the live match card wrapper
        > :global(div:nth-child(2)) {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
        }

        // Optimize timeline line spacing inside sidebar
        :global(.overflow-x-auto) {
          > :global(div:not(.flex-col)) {
            min-width: 10px !important;
            margin-left: 6px !important;
            margin-right: 6px !important;
          }
        }
      }
    }

    .wc-main-content {
      flex-grow: 1 !important;
      height: 100% !important;
      overflow: hidden;

      .wc-navigation-bar {
        padding-top: 3px !important;
        padding-bottom: 3px !important;
        gap: 6px !important;

        .tab-btn {
          padding: 4px 8px !important;
          font-size: 0.7rem !important;
        }

        :global(input) {
          padding-top: 2px !important;
          padding-bottom: 2px !important;
          font-size: 10px !important;
        }
      }
    }
  }
</style>
