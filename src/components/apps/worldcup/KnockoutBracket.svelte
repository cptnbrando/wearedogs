<script>
  import { onMount } from "svelte";
  import { Trophy, Calendar, ChevronLeft, ChevronRight } from "lucide-svelte";

  // Svelte 5 props with selectedRoundMobile as bindable
  let { 
    controller, 
    searchQuery = $bindable(), 
    bracketMatches = { r32: [], r16: [], qf: [], sf: [], third: null, final: null }, 
    teamStatuses = {}, 
    selectedRoundMobile = $bindable("r32") 
  } = $props();

  // Hoisted constants
  const MATCH_ORDER_LEFT_R32 = ["74", "77", "73", "75", "83", "84", "81", "82"];
  const MATCH_ORDER_LEFT_R16 = ["89", "90", "93", "94"];
  const MATCH_ORDER_LEFT_QF = ["97", "98"];
  const MATCH_ORDER_LEFT_SF = ["101"];

  const MATCH_ORDER_RIGHT_R32 = ["76", "78", "79", "80", "86", "88", "85", "87"];
  const MATCH_ORDER_RIGHT_R16 = ["91", "92", "95", "96"];
  const MATCH_ORDER_RIGHT_QF = ["99", "100"];
  const MATCH_ORDER_RIGHT_SF = ["102"];

  // Fast ID lookup map
  let gamesMap = $derived.by(() => {
    if (!controller) return new Map();
    return new Map(controller.games.map(g => [g.id.toString(), g]));
  });

  // Desktop scroll state
  let scrollContainer = $state(null);
  let canScrollLeft = $state(false);
  let canScrollRight = $state(false);

  function handleScroll() {
    if (!scrollContainer) return;
    canScrollLeft = scrollContainer.scrollLeft > 5;
    canScrollRight = scrollContainer.scrollLeft + scrollContainer.clientWidth < scrollContainer.scrollWidth - 5;
  }

  $effect(() => {
    if (scrollContainer) {
      setTimeout(handleScroll, 300);
      window.addEventListener("resize", handleScroll);
      return () => window.removeEventListener("resize", handleScroll);
    }
  });

  function scrollLeftBtn() {
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: -320, behavior: "smooth" });
    }
  }

  function scrollRightBtn() {
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: 320, behavior: "smooth" });
    }
  }

  // Touch Swipe for mobile rounds navigation
  let touchStartX = 0;
  let touchStartY = 0;

  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
      const rounds = ["r32", "r16", "qf", "sf", "final"];
      const currentIndex = rounds.indexOf(selectedRoundMobile);
      if (diffX > 0) {
        if (currentIndex > 0) selectedRoundMobile = rounds[currentIndex - 1];
      } else {
        if (currentIndex < rounds.length - 1) selectedRoundMobile = rounds[currentIndex + 1];
      }
    }
  }

  // Helpers
  function formatDate(dateStr) {
    if (!dateStr) return "TBD";
    const parts = dateStr.split(" ");
    const dateParts = parts[0].split("/");
    const time = parts[1] ? parts[1].substring(0, 5) : "";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const m = parseInt(dateParts[0]) - 1;
    const d = parseInt(dateParts[1]);
    if (isNaN(m) || isNaN(d)) return dateStr;
    return `${months[m]} ${d} - ${time}`;
  }

  function getTeamStatus(teamId) {
    if (!teamId || teamId === "0") return "TBD";
    return teamStatuses[teamId.toString()] || "IN";
  }

  function getMatchWinner(match) {
    if (match.finished !== "TRUE") return null;
    const hs = parseInt(match.home_score) || 0;
    const as = parseInt(match.away_score) || 0;
    if (hs > as) return "home";
    if (as > hs) return "away";
    
    const winnerId = controller.findProgressionWinner(match.id);
    if (winnerId) {
      return winnerId === match.home_team_id ? "home" : "away";
    }
    return null;
  }

  function isTeamSearched(teamName) {
    if (!searchQuery.trim()) return false;
    return teamName?.toLowerCase().includes(searchQuery.toLowerCase().trim());
  }

  function isMatchSearched(match) {
    if (!searchQuery.trim()) return false;
    const homeName = match.home_team_name_en || match.home_team_label || "";
    const awayName = match.away_team_name_en || match.away_team_label || "";
    return isTeamSearched(homeName) || isTeamSearched(awayName);
  }

  function handleFlagError(e) {
    e.target.style.display = "none";
  }

  function handleCardClick(team) {
    if (team?.name_en) {
      searchQuery = team.name_en;
    }
  }
</script>

<!-- Desktop Layout -->
<div class="hidden md:flex flex-col flex-grow min-height-0 relative w-full h-full">
  {#if canScrollLeft}
    <button class="scroll-arrow left" onclick={scrollLeftBtn} aria-label="Scroll Left">
      <ChevronLeft size={24} />
    </button>
  {/if}
  {#if canScrollRight}
    <button class="scroll-arrow right" onclick={scrollRightBtn} aria-label="Scroll Right">
      <ChevronRight size={24} />
    </button>
  {/if}

  <div 
    class="flex-grow overflow-x-auto overflow-y-auto p-6 scrollbar-none flex"
    bind:this={scrollContainer}
    onscroll={handleScroll}
  >
    <div class="flex items-stretch gap-6 min-w-[1480px] m-auto h-[620px]">
      <!-- LEFT SIDE BRACKET -->
      <!-- Round of 32 -->
      <div class="flex flex-col w-[170px] h-full shrink-0">
        <div class="r-title">Round of 32</div>
        <div class="flex flex-col justify-around grow min-h-0">
          {#each MATCH_ORDER_LEFT_R32 as mId}
            {@const match = gamesMap.get(mId)}
            {#if match}{@render matchCard(match)}{/if}
          {/each}
        </div>
      </div>

      <!-- Round of 16 -->
      <div class="flex flex-col w-[170px] h-full shrink-0">
        <div class="r-title">Round of 16</div>
        <div class="flex flex-col justify-around grow min-h-0">
          {#each MATCH_ORDER_LEFT_R16 as mId}
            {@const match = gamesMap.get(mId)}
            {#if match}{@render matchCard(match)}{/if}
          {/each}
        </div>
      </div>

      <!-- Quarterfinals -->
      <div class="flex flex-col w-[170px] h-full shrink-0">
        <div class="r-title">Quarterfinals</div>
        <div class="flex flex-col justify-around grow min-h-0">
          {#each MATCH_ORDER_LEFT_QF as mId}
            {@const match = gamesMap.get(mId)}
            {#if match}{@render matchCard(match)}{/if}
          {/each}
        </div>
      </div>

      <!-- Semifinals -->
      <div class="flex flex-col w-[170px] h-full shrink-0">
        <div class="r-title">Semifinals</div>
        <div class="flex flex-col justify-around grow min-h-0">
          {#each MATCH_ORDER_LEFT_SF as mId}
            {@const match = gamesMap.get(mId)}
            {#if match}{@render matchCard(match)}{/if}
          {/each}
        </div>
      </div>

      <!-- CENTER: FINALS -->
      <div class="flex flex-col w-[210px] h-full shrink-0 justify-center gap-10 items-center">
        <!-- CHAMPIONSHIP FINAL -->
        {#if bracketMatches.final}
          <div class="flex flex-col items-center w-full">
            <div class="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest text-neon-gold mb-2 text-glow">
              <Trophy size={14} class="animate-bounce" />
              <span>Championship Final</span>
            </div>
            {@render matchCard(bracketMatches.final, true)}
          </div>
        {/if}

        <!-- THIRD PLACE PLAYOFF -->
        {#if bracketMatches.third}
          <div class="flex flex-col items-center w-full mt-4">
            <div class="text-[10px] font-extrabold uppercase tracking-widest text-white/50 mb-2">
              Third Place Playoff
            </div>
            {@render matchCard(bracketMatches.third, true)}
          </div>
        {/if}
      </div>

      <!-- RIGHT SIDE BRACKET -->
      <!-- Semifinals -->
      <div class="flex flex-col w-[170px] h-full shrink-0">
        <div class="r-title text-right">Semifinals</div>
        <div class="flex flex-col justify-around grow min-h-0">
          {#each MATCH_ORDER_RIGHT_SF as mId}
            {@const match = gamesMap.get(mId)}
            {#if match}{@render matchCard(match)}{/if}
          {/each}
        </div>
      </div>

      <!-- Quarterfinals -->
      <div class="flex flex-col w-[170px] h-full shrink-0">
        <div class="r-title text-right">Quarterfinals</div>
        <div class="flex flex-col justify-around grow min-h-0">
          {#each MATCH_ORDER_RIGHT_QF as mId}
            {@const match = gamesMap.get(mId)}
            {#if match}{@render matchCard(match)}{/if}
          {/each}
        </div>
      </div>

      <!-- Round of 16 -->
      <div class="flex flex-col w-[170px] h-full shrink-0">
        <div class="r-title text-right">Round of 16</div>
        <div class="flex flex-col justify-around grow min-h-0">
          {#each MATCH_ORDER_RIGHT_R16 as mId}
            {@const match = gamesMap.get(mId)}
            {#if match}{@render matchCard(match)}{/if}
          {/each}
        </div>
      </div>

      <!-- Round of 32 -->
      <div class="flex flex-col w-[170px] h-full shrink-0">
        <div class="r-title text-right">Round of 32</div>
        <div class="flex flex-col justify-around grow min-h-0">
          {#each MATCH_ORDER_RIGHT_R32 as mId}
            {@const match = gamesMap.get(mId)}
            {#if match}{@render matchCard(match)}{/if}
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Mobile Layout -->
<div class="flex md:hidden flex-col grow min-h-0 w-full">
  <!-- Mobile Round Tab Header -->
  <div class="flex justify-around p-2 bg-black/25 border-b border-white/5 gap-1 shrink-0 select-none">
    {#each ["r32", "r16", "qf", "sf", "final"] as round}
      <button 
        class="grow bg-transparent border-none text-white/45 py-2 text-[10px] font-bold rounded-lg transition-all duration-150"
        class:active-mobile={selectedRoundMobile === round}
        onclick={() => selectedRoundMobile = round}
      >
        {round === "final" ? "Finals" : round.toUpperCase()}
      </button>
    {/each}
  </div>

  <div class="text-center text-[10px] font-bold uppercase tracking-widest text-neon-gold py-2 border-b border-white/2 shrink-0">
    {#if selectedRoundMobile === "r32"}Round of 32
    {:else if selectedRoundMobile === "r16"}Round of 16
    {:else if selectedRoundMobile === "qf"}Quarterfinals
    {:else if selectedRoundMobile === "sf"}Semifinals
    {:else}Finals & Playoff{/if}
  </div>

  <!-- Swipeable Matches List -->
  <div 
    class="grow overflow-y-auto p-3 flex flex-col gap-3 scrollbar-none"
    ontouchstart={handleTouchStart}
    ontouchend={handleTouchEnd}
  >
    {#if selectedRoundMobile === "r32"}
      {#each bracketMatches.r32 as match}
        {@render matchCard(match, false, true)}
      {/each}
    {:else if selectedRoundMobile === "r16"}
      {#each bracketMatches.r16 as match}
        {@render matchCard(match, false, true)}
      {/each}
    {:else if selectedRoundMobile === "qf"}
      {#each bracketMatches.qf as match}
        {@render matchCard(match, false, true)}
      {/each}
    {:else if selectedRoundMobile === "sf"}
      {#each bracketMatches.sf as match}
        {@render matchCard(match, false, true)}
      {/each}
    {:else if selectedRoundMobile === "final"}
      {#if bracketMatches.final}
        <div class="text-[9px] font-extrabold uppercase text-neon-gold pl-1">Championship Final</div>
        {@render matchCard(bracketMatches.final, true, true)}
      {/if}
      {#if bracketMatches.third}
        <div class="text-[9px] font-extrabold uppercase text-white/50 pl-1 mt-4">Third Place Playoff</div>
        {@render matchCard(bracketMatches.third, true, true)}
      {/if}
    {/if}
  </div>
</div>

<!-- Reusable Svelte snippet for match cards -->
{#snippet matchCard(match, isLarge = false, isMobile = false)}
  {@const homeTeam = controller?.getTeamById(match.home_team_id)}
  {@const awayTeam = controller?.getTeamById(match.away_team_id)}
  {@const winner = getMatchWinner(match)}
  {@const isSearched = isMatchSearched(match)}
  {@const homeName = homeTeam?.name_en || match.home_team_label}
  {@const awayName = awayTeam?.name_en || match.away_team_label}

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div 
    id="match-card-{match.id}"
    class="m-card flex flex-col p-2 rounded-xl border select-none transition-all duration-200" 
    class:searched-glow={isSearched}
    class:finished={match.finished === "TRUE"}
    class:large={isLarge}
    class:w-full={isMobile}
    onclick={() => {
      if (homeTeam) handleCardClick(homeTeam);
      else if (awayTeam) handleCardClick(awayTeam);
    }}
  >
    <!-- Card Top Header Info -->
    <div class="flex justify-between items-center text-[9px] text-white/35 mb-1.5 font-semibold">
      <span class="uppercase tracking-wider">
        {#if match.type === "r32"}R32
        {:else if match.type === "r16"}R16
        {:else if match.type === "qf"}QF
        {:else if match.type === "sf"}SF
        {:else if match.type === "third"}Third Place
        {:else}Final{/if}
        &bull; Match {match.id}
      </span>
      <div class="flex items-center gap-1">
        <Calendar size={8} />
        <span>{formatDate(match.local_date)}</span>
      </div>
    </div>

    <!-- Score Rows Block -->
    <div class="flex flex-col bg-black/20 rounded-lg overflow-hidden border border-white/2">
      <!-- Home Row -->
      <div class="m-row" class:winner={winner === "home"} class:loser={winner === "away"}>
        <div class="team-lbl">
          {#if homeTeam?.flag}
            <img src={homeTeam.flag} alt="" class="flag" onerror={handleFlagError} />
          {:else}
            <span class="text-[10px]">🏳️</span>
          {/if}
          <span class="name" class:searched-lbl={isTeamSearched(homeTeam?.name_en)}>
            {homeName}
          </span>
          {#if homeTeam && getTeamStatus(homeTeam.id) === "OUT"}
            <span class="elim" title="Eliminated"></span>
          {/if}
        </div>
        <span class="score">
          {match.finished === "TRUE" || match.time_elapsed !== "notstarted" ? match.home_score : "-"}
        </span>
      </div>

      <!-- Away Row -->
      <div class="m-row border-t border-white/5" class:winner={winner === "away"} class:loser={winner === "home"}>
        <div class="team-lbl">
          {#if awayTeam?.flag}
            <img src={awayTeam.flag} alt="" class="flag" onerror={handleFlagError} />
          {:else}
            <span class="text-[10px]">🏳️</span>
          {/if}
          <span class="name" class:searched-lbl={isTeamSearched(awayTeam?.name_en)}>
            {awayName}
          </span>
          {#if awayTeam && getTeamStatus(awayTeam.id) === "OUT"}
            <span class="elim" title="Eliminated"></span>
          {/if}
        </div>
        <span class="score">
          {match.finished === "TRUE" || match.time_elapsed !== "notstarted" ? match.away_score : "-"}
        </span>
      </div>
    </div>
  </div>
{/snippet}

<style lang="scss">
  @import "../../../styles/variables";

  .r-title {
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.3);
    margin-bottom: 12px;
    padding-bottom: 6px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    flex-shrink: 0;
  }

  // Scroll chevron buttons
  .scroll-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: rgba(15, 15, 22, 0.85);
    border: 1px solid rgba($color-neon-red, 0.35);
    color: $color-neon-red;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6), 0 0 12px rgba($color-neon-red, 0.15);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: all $transition-speed-normal cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      background-color: rgba($color-neon-red, 0.15);
      border-color: $color-neon-red;
      color: white;
      box-shadow: 0 4px 20px rgba($color-neon-red, 0.4);
      transform: translateY(-50%) scale(1.08);
    }

    &.left {
      left: 12px;
    }
    &.right {
      right: 12px;
    }
  }

  // Match Cards
  .m-card {
    background-color: $bg-card-dark;
    border-color: $border-light;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    width: 100%;

    &:hover {
      background-color: rgba(255, 255, 255, 0.04);
      border-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    }

    &.large {
      padding: 12px;
      .m-row {
        height: 34px;
        font-size: 0.8rem;
        padding: 8px 10px;
      }
    }

    &.searched-glow {
      animation: searchPulse 1.5s infinite alternate;
      box-shadow: 0 0 20px rgba($color-neon-gold, 0.25);
    }
  }

  .text-neon-gold {
    color: $color-neon-gold;
  }
  .text-glow {
    text-shadow: 0 0 10px rgba($color-neon-gold, 0.25);
  }

  // Score Row details
  .m-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 8px;
    height: 28px;
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.65);
    transition: background 0.15s ease;

    .score {
      font-family: monospace;
      font-weight: 800;
      color: rgba(255, 255, 255, 0.35);
      margin-left: 8px;
    }
  }

  .team-lbl {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    grow: 1;

    .flag {
      width: 16px;
      height: 12px;
      object-fit: cover;
      border-radius: 2px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.4);
    }

    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .searched-lbl {
      color: $color-neon-gold;
      font-weight: 800;
    }
  }

  .elim {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: $color-alert-red;
    box-shadow: 0 0 6px $color-alert-red;
  }

  // Winner / Loser stylings in finished cards
  .finished {
    .m-row.winner {
      background-color: rgba($color-neon-green, 0.04);
      .name {
        color: white;
        font-weight: 700;
      }
      .score {
        color: $color-neon-green;
        text-shadow: 0 0 8px rgba($color-neon-green, 0.35);
      }
    }

    .m-row.loser {
      background-color: rgba(0, 0, 0, 0.15);
      .name {
        color: rgba(255, 255, 255, 0.25);
        text-decoration: line-through;
        text-decoration-color: rgba(255, 255, 255, 0.15);
      }
      .score {
        color: rgba(255, 255, 255, 0.2);
      }
    }
  }

  // Mobile navigation button state
  .active-mobile {
    background-color: rgba($color-neon-red, 0.08) !important;
    border: 1px solid rgba($color-neon-red, 0.2) !important;
    color: $color-neon-red !important;
  }
</style>
