<script>
  import { Info } from "lucide-svelte";

  // Svelte 5 props
  let { standings = {}, thirdPlaceStandings = [], searchQuery = "" } = $props();

  function isTeamSearched(teamName) {
    if (!searchQuery.trim()) return false;
    return teamName?.toLowerCase().includes(searchQuery.toLowerCase().trim());
  }

  function handleFlagError(e) {
    e.target.style.display = "none";
  }
</script>

<div class="flex-grow overflow-y-auto p-4 md:p-6 scrollbar-none">
  <!-- Standings Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {#each Object.keys(standings) as groupLetter}
      <div id="group-card-{groupLetter}" class="group-card p-3 xs:p-4 rounded-2xl border transition-all duration-200">
        <h4 class="m-0 mb-3 text-sm font-extrabold text-neon-red uppercase tracking-wider">
          Group {groupLetter}
        </h4>
        <table class="w-full border-collapse text-[11px] text-center">
          <thead>
            <tr class="text-white/40 font-bold border-b border-white/5 uppercase text-[9px]">
              <th class="w-6 py-1.5 text-left">Pos</th>
              <th class="text-left">Team</th>
              <th class="w-6">MP</th>
              <th class="w-8">GD</th>
              <th class="w-8">Pts</th>
            </tr>
          </thead>
          <tbody>
            {#each standings[groupLetter] as row, index}
              {@const isSearched = isTeamSearched(row.name)}
              <tr 
                class="transition-colors duration-150 border-b border-white/2 hover:bg-white/1 font-medium"
                class:bg-searched={isSearched}
                class:bg-advancing={!isSearched && index < 2}
                class:bg-third={!isSearched && index === 2}
                class:bg-eliminated={!isSearched && index === 3}
              >
                <td class="py-2 text-left">
                  <span 
                    class="w-4 h-4 rounded text-[9px] font-extrabold flex items-center justify-center"
                    class:badge-adv={index < 2}
                    class:badge-third={index === 2}
                    class:badge-elim={index === 3}
                  >
                    {index + 1}
                  </span>
                </td>
                <td class="text-left">
                  <div class="flex items-center gap-2">
                    {#if row.flag}
                      <img src={row.flag} alt="" class="w-3.5 h-2.5 object-cover rounded-sm shadow-sm" onerror={handleFlagError} />
                    {/if}
                    <span 
                      class="truncate max-w-[90px] text-white/80"
                      class:text-neon-gold={isSearched}
                      class:font-black={isSearched}
                      class:line-through={index === 3 && !isSearched}
                      class:text-white-30={index === 3 && !isSearched}
                    >
                      {row.name}
                    </span>
                  </div>
                </td>
                <td class="text-white/70">{row.mp}</td>
                <td class="font-semibold" class:text-green-400={row.gd > 0} class:text-red-400={row.gd < 0} class:text-white-30={row.gd === 0}>
                  {row.gd > 0 ? `+${row.gd}` : row.gd}
                </td>
                <td class="font-extrabold text-white">{row.pts}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/each}
  </div>

  <!-- Best 3rd Place Standings Rules Table -->
  <div class="mt-8 max-w-2xl mx-auto">
    <div class="group-card p-3 xs:p-5 rounded-2xl border">
      <div class="flex items-center gap-2 mb-2">
        <Info size={14} class="text-neon-gold" />
        <h4 class="m-0 text-sm font-extrabold text-white/90 uppercase tracking-wide">
          Best 3rd-Place Teams Standings
        </h4>
      </div>
      <p class="text-[10px] text-white/50 mb-4 leading-relaxed">
        The top 8 third-place teams across all 12 groups advance to the Round of 32. Green indicates qualifying, red is eliminated.
      </p>
      <table class="w-full border-collapse text-[11px] text-center">
        <thead>
          <tr class="text-white/40 font-bold border-b border-white/5 uppercase text-[9px]">
            <th class="w-6 py-1.5 text-left">Pos</th>
            <th class="w-12 text-left">Group</th>
            <th class="text-left">Team</th>
            <th class="w-6">MP</th>
            <th class="w-8">GD</th>
            <th class="w-8">Pts</th>
          </tr>
        </thead>
        <tbody>
          {#each thirdPlaceStandings as row, index}
            {@const isSearched = isTeamSearched(row.name)}
            <tr 
              class="transition-colors duration-150 border-b border-white/2 hover:bg-white/1 font-medium"
              class:bg-searched={isSearched}
              class:bg-advancing={!isSearched && index < 8}
              class:bg-eliminated={!isSearched && index >= 8}
            >
              <td class="py-2 text-left">
                <span 
                  class="w-4 h-4 rounded text-[9px] font-extrabold flex items-center justify-center"
                  class:badge-adv={index < 8}
                  class:badge-elim={index >= 8}
                >
                  {index + 1}
                </span>
              </td>
              <td class="text-left font-bold text-neon-gold text-[10px]">G-{row.group}</td>
              <td class="text-left">
                <div class="flex items-center gap-2">
                  {#if row.flag}
                    <img src={row.flag} alt="" class="w-3.5 h-2.5 object-cover rounded-sm shadow-sm" onerror={handleFlagError} />
                  {/if}
                  <span 
                    class="truncate max-w-[120px] text-white/80"
                    class:text-neon-gold={isSearched}
                    class:font-black={isSearched}
                    class:line-through={index >= 8 && !isSearched}
                    class:text-white-30={index >= 8 && !isSearched}
                  >
                    {row.name}
                  </span>
                </div>
              </td>
              <td class="text-white/70">{row.mp}</td>
              <td class="font-semibold" class:text-green-400={row.gd > 0} class:text-red-400={row.gd < 0} class:text-white-30={row.gd === 0}>
                {row.gd > 0 ? `+${row.gd}` : row.gd}
              </td>
              <td class="font-extrabold text-white">{row.pts}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

<style lang="scss">
  @use "../../../styles/variables" as *;

  .group-card {
    background-color: $bg-card-dark;
    border-color: $border-light;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    
    &:hover {
      border-color: rgba(255, 255, 255, 0.08);
    }
  }

  .text-neon-red {
    color: $color-neon-red;
  }
  .text-neon-gold {
    color: $color-neon-gold;
  }

  // Row status highlights
  .bg-searched {
    background-color: rgba($color-neon-gold, 0.1) !important;
  }
  .bg-advancing {
    background-color: rgba($color-neon-green, 0.015);
  }
  .bg-third {
    background-color: rgba($color-neon-gold, 0.01);
  }
  .bg-eliminated {
    background-color: rgba($color-alert-red, 0.015);
  }

  // Badge stylings
  .badge-adv {
    background-color: rgba($color-neon-green, 0.12);
    border: 1px solid rgba($color-neon-green, 0.25);
    color: $color-neon-green;
  }
  .badge-third {
    background-color: rgba($color-neon-gold, 0.12);
    border: 1px solid rgba($color-neon-gold, 0.25);
    color: $color-neon-gold;
  }
  .badge-elim {
    background-color: rgba($color-alert-red, 0.12);
    border: 1px solid rgba($color-alert-red, 0.25);
    color: $color-alert-red;
  }

  .text-white-30 {
    color: rgba(255, 255, 255, 0.3) !important;
  }
</style>
