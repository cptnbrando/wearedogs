<script>
  import { Trophy } from "lucide-svelte";

  // Svelte 5 component props
  let { currentStage, currentMatch, controller, onJumpToMatch } = $props();

  const stageOrder = ["group", "r32", "r16", "qf", "sf", "finals"];

  function isStageCompleted(stage) {
    const currentIndex = stageOrder.indexOf(currentStage);
    const targetIndex = stageOrder.indexOf(stage);
    return targetIndex < currentIndex;
  }

  // Handle flag image load error
  function handleFlagError(e) {
    e.target.style.display = "none";
  }
</script>

<section class="flex flex-col md:flex-row justify-between items-center p-3 md:p-4 bg-[rgba(255,51,68,0.02)] border-b border-[rgba(255,51,68,0.08)] flex-shrink-0 gap-4 w-full">
  <!-- Left: Timeline Progress -->
  <div class="flex flex-col gap-1.5 w-full md:w-auto flex-grow min-w-0">
    <div class="text-[10px] font-extrabold uppercase tracking-widest text-white/40">
      Tournament Progress
    </div>
    <div class="flex items-center w-full max-w-[580px] overflow-x-auto py-1 scrollbar-none">
      {#each stageOrder as stage, idx}
        {@const isActive = currentStage === stage}
        {@const isCompleted = isStageCompleted(stage)}
        <div class="flex flex-col items-center relative gap-1 select-none">
          <span 
            class="w-2.5 h-2.5 rounded-full transition-all duration-200 border {isActive ? 'bg-neon-red border-red-500/20 shadow-red-glow scale-110' : ''} {isCompleted ? 'bg-neon-green border-green-500/20' : ''} {!isActive && !isCompleted ? 'bg-white/10 border-white/5' : ''}"
          ></span>
          <span 
            class="text-[9px] font-bold uppercase tracking-wider transition-colors duration-200 {isActive ? 'text-neon-red' : ''} {isCompleted ? 'text-neon-green' : ''} {!isActive && !isCompleted ? 'text-white/30' : ''}"
          >
            {stage === "finals" ? "Finals" : stage.toUpperCase()}
          </span>
        </div>
        {#if idx < stageOrder.length - 1}
          {@const isNextStageCompleted = isStageCompleted(stageOrder[idx + 1]) || currentStage === stageOrder[idx + 1]}
          <div 
            class="flex-grow h-[2px] min-w-[20px] mx-2 mb-3.5 transition-colors duration-200 {isNextStageCompleted ? 'bg-green-500/30' : 'bg-white/5'}"
          ></div>
        {/if}
      {/each}
    </div>
  </div>

  <!-- Right: Tonight's Match / Most Recent -->
  {#if currentMatch && controller}
    {@const homeTeam = controller.getTeamById(currentMatch.home_team_id)}
    {@const awayTeam = controller.getTeamById(currentMatch.away_team_id)}
    {@const isFinished = currentMatch.finished === "TRUE"}
    {@const isLive = currentMatch.time_elapsed !== "notstarted" && !isFinished}
    <div class="flex items-center gap-1.5 sm:gap-3 p-1.5 px-2 sm:px-3 bg-[#0f0f16]/65 border border-[rgba(255,51,68,0.15)] rounded-xl shadow-lg backdrop-blur-md flex-shrink-0 max-w-full">
      <div class="flex items-center gap-1 sm:gap-1.5 text-[10px] font-extrabold tracking-wider bg-neon-red/10 border border-red-500/25 text-neon-red px-1.5 py-0.5 rounded">
        {#if isLive}
          <span class="w-1 h-1 rounded-full bg-neon-red animate-pulse shadow-red-glow"></span>
          <span>LIVE</span>
        {:else}
          <span>{isFinished ? "RECENT" : "TONIGHT"}</span>
        {/if}
      </div>
      <div class="flex items-center gap-1.5 sm:gap-2 text-[11px] font-semibold text-white/90">
        {#if homeTeam?.flag}
          <img src={homeTeam.flag} alt="" class="w-3.5 h-2.5 object-cover rounded-sm shadow-md flex-shrink-0" onerror={handleFlagError} />
        {/if}
        <span class="truncate max-w-[55px] min-w-[35px] sm:max-w-[85px]">{homeTeam?.name_en || currentMatch.home_team_label}</span>
        
        <span class="font-mono font-extrabold text-neon-gold bg-neon-gold/5 border border-neon-gold/20 px-1.5 py-0.5 rounded text-[10px]">
          {isFinished || isLive ? `${currentMatch.home_score} - ${currentMatch.away_score}` : "vs"}
        </span>

        <span class="truncate max-w-[55px] min-w-[35px] sm:max-w-[85px]">{awayTeam?.name_en || currentMatch.away_team_label}</span>
        {#if awayTeam?.flag}
          <img src={awayTeam.flag} alt="" class="w-3.5 h-2.5 object-cover rounded-sm shadow-md flex-shrink-0" onerror={handleFlagError} />
        {/if}
      </div>
      <button 
        class="bg-neon-red hover:bg-[#e02233] text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg shadow-md hover:shadow-red-glow transition-all duration-200"
        onclick={onJumpToMatch}
      >
        JUMP
      </button>
    </div>
  {/if}
</section>

<style lang="scss">
  // Custom definitions referencing _variables.scss if needed
  @use "../../../styles/variables" as *;

  .bg-neon-red {
    background-color: $color-neon-red;
  }
  .text-neon-red {
    color: $color-neon-red;
  }
  .bg-neon-green {
    background-color: $color-neon-green;
  }
  .text-neon-green {
    color: $color-neon-green;
  }
  .text-neon-gold {
    color: $color-neon-gold;
  }
  .bg-neon-gold\/5 {
    background-color: rgba(var(--color-neon-gold-rgb, 230, 185, 0), 0.05);
  }
  .border-neon-gold\/20 {
    border-color: rgba(var(--color-neon-gold-rgb, 230, 185, 0), 0.2);
  }
  .shadow-red-glow {
    box-shadow: 0 0 8px rgba(var(--color-neon-red-rgb, 255, 51, 68), 0.6);
  }
  .shadow-md {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  }
</style>
