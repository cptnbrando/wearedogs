<script>
  // Svelte 5 props
  let { controller, teamStatuses = {}, searchQuery = "" } = $props();

  let filterStatus = $state("all"); // 'all' | 'in' | 'out'

  function getTeamStatus(teamId) {
    if (!teamId) return "TBD";
    return teamStatuses[teamId.toString()] || "IN";
  }

  function handleFlagError(e) {
    e.target.style.display = "none";
  }

  // Filtered teams list based on search and status
  let filteredTeams = $derived.by(() => {
    if (!controller) return [];
    return controller.teams.filter(t => {
      const nameMatch = searchQuery.trim() === "" || t.name_en.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const status = getTeamStatus(t.id);
      const statusMatch = filterStatus === "all" || (filterStatus === "in" && status === "IN") || (filterStatus === "out" && status === "OUT");
      return nameMatch && statusMatch;
    });
  });
</script>

<div class="flex-grow overflow-y-auto p-4 md:p-6 flex flex-col gap-5 scrollbar-none">
  <!-- Filter Controls -->
  <div class="flex gap-2 flex-wrap select-none">
    <button 
      class="filter-btn" 
      class:active={filterStatus === "all"} 
      onclick={() => filterStatus = "all"}
    >
      ALL TEAMS ({controller ? controller.teams.length : 0})
    </button>
    <button 
      class="filter-btn text-neon-green border-green-500/20" 
      class:active-green={filterStatus === "in"} 
      onclick={() => filterStatus = "in"}
    >
      IN RUNNING ({controller ? Object.values(teamStatuses).filter(s => s === "IN").length : 0})
    </button>
    <button 
      class="filter-btn text-neon-red border-red-500/20" 
      class:active-red={filterStatus === "out"} 
      onclick={() => filterStatus = "out"}
    >
      ELIMINATED ({controller ? Object.values(teamStatuses).filter(s => s === "OUT").length : 0})
    </button>
  </div>

  <!-- Teams Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {#each filteredTeams as team}
      {@const status = getTeamStatus(team.id)}
      <div 
        class="team-card p-3 rounded-xl border flex justify-between items-center transition-all duration-200" 
        class:eliminated={status === "OUT"}
      >
        <div class="flex items-center gap-3 min-w-0">
          {#if team.flag}
            <img src={team.flag} alt="" class="w-6 h-4.5 object-cover rounded shadow" onerror={handleFlagError} />
          {/if}
          <div class="truncate">
            <h5 class="m-0 text-xs font-bold text-white/90 truncate max-w-[110px]" class:line-through={status === "OUT"}>
              {team.name_en}
            </h5>
            <span class="text-[9px] text-white/40">{team.fifa_code} &bull; Group {team.groups}</span>
          </div>
        </div>
        <span 
          class="text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded border flex-shrink-0"
          class:status-in={status === "IN"}
          class:status-out={status === "OUT"}
        >
          {status}
        </span>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  @import "../../../styles/variables";

  .filter-btn {
    background-color: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.6);
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 0.72rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.06);
      color: white;
    }

    &.active {
      background-color: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
      color: white;
      box-shadow: 0 0 12px rgba(255, 255, 255, 0.05);
    }

    &.active-green {
      background-color: rgba($color-neon-green, 0.08);
      border-color: rgba($color-neon-green, 0.3);
      color: $color-neon-green;
      box-shadow: 0 0 12px rgba($color-neon-green, 0.05);
    }

    &.active-red {
      background-color: rgba($color-neon-red, 0.08);
      border-color: rgba($color-neon-red, 0.3);
      color: $color-neon-red;
      box-shadow: 0 0 12px rgba($color-neon-red, 0.05);
    }
  }

  .text-neon-green {
    color: $color-neon-green;
  }
  .text-neon-red {
    color: $color-neon-red;
  }

  .team-card {
    background-color: $bg-card-dark;
    border-color: $border-light;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

    &:hover {
      transform: translateY(-2px);
      border-color: rgba(255, 255, 255, 0.12);
    }

    &.eliminated {
      opacity: 0.55;
      background-color: rgba(10, 10, 15, 0.3);
    }
  }

  .status-in {
    background-color: rgba($color-neon-green, 0.1);
    border-color: rgba($color-neon-green, 0.25);
    color: $color-neon-green;
    box-shadow: 0 0 8px rgba($color-neon-green, 0.15);
  }

  .status-out {
    background-color: rgba($color-alert-red, 0.1);
    border-color: rgba($color-alert-red, 0.25);
    color: $color-alert-red;
  }
</style>
