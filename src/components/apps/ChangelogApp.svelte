<script>
  import { onMount, onDestroy } from "svelte";
  import { Terminal, Shield, Cpu, Clock, Code, ChevronLeft, ChevronRight, Activity } from "lucide-svelte";

  let changelogData = $state({ metrics: {}, entries: [] });
  let currentPage = $state(1);
  const itemsPerPage = 3;

  let elapsedSeconds = $state(0);
  let timerInterval = null;

  // Fetch changelog data
  onMount(async () => {
    try {
      const res = await fetch("/changelog.json");
      if (res.ok) {
        changelogData = await res.json();
      }
    } catch (err) {
      console.error("Failed to load changelog.json:", err);
    }

    // Start live clock for elapsed time from project inception (June 20, 2026 23:18:50)
    const inceptionTime = new Date('2026-06-20T23:18:50-05:00').getTime();
    const updateElapsed = () => {
      elapsedSeconds = Math.max(0, Math.floor((Date.now() - inceptionTime) / 1000));
    };
    updateElapsed();
    timerInterval = setInterval(updateElapsed, 1000);
  });

  onDestroy(() => {
    if (timerInterval) clearInterval(timerInterval);
  });

  // Format elapsed time
  let formattedElapsed = $derived(() => {
    const days = Math.floor(elapsedSeconds / 86400);
    const hours = Math.floor((elapsedSeconds % 86400) / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  });

  // Format helper for intervals (seconds -> human readable)
  function formatInterval(secs) {
    if (!secs) return "0s";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0) parts.push(`${s}s`);
    return parts.join(" ") || "0s";
  }

  // Format epoch timestamp to locale string
  function formatEpoch(ts) {
    if (!ts) return "N/A";
    return new Date(ts * 1000).toLocaleString();
  }

  // Format commit epoch timestamp to YYYY-MM-DD HH:MM
  function formatCommitTimestamp(ts) {
    if (!ts) return "";
    const date = new Date(ts * 1000);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hr = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d} ${hr}:${min}`;
  }

  // Pagination logic
  let totalPages = $derived(Math.max(1, Math.ceil((changelogData.entries?.length || 0) / itemsPerPage)));
  let paginatedEntries = $derived(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return (changelogData.entries || []).slice(start, end);
  });

  function prevPage() {
    if (currentPage > 1) currentPage--;
  }

  function nextPage() {
    if (currentPage < totalPages) currentPage++;
  }
</script>

<div class="changelog-container p-6 overflow-y-auto h-full flex flex-col gap-6 text-green-400 font-mono bg-black select-none">
  <!-- Title / Header -->
  <div class="header border-b border-green-800 pb-4 flex justify-between items-center">
    <div class="flex items-center gap-2 text-green-500 font-bold text-lg tracking-wider">
      <Terminal class="animate-pulse" size={24} />
      <span>SYSTEM_LOG://CHANGELOG.SYS</span>
    </div>
    <div class="text-[10px] text-green-600 flex items-center gap-2">
      <Shield size={12} /> SECURE TERMINAL CONNECTION ACTIVE
    </div>
  </div>

  <!-- Metrics Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="metric-card border border-green-800 p-4 bg-green-950/20 rounded relative overflow-hidden group hover:border-green-500 transition-colors duration-300">
      <div class="absolute right-2 top-2 text-green-900 group-hover:text-green-700 transition-colors duration-300">
        <Clock size={40} />
      </div>
      <div class="text-xs text-green-600 font-semibold tracking-wider">ELAPSED TIME</div>
      <div class="text-lg font-bold text-green-300 mt-1 tabular-nums">{formattedElapsed()}</div>
      <div class="text-[9px] text-green-700 mt-2">SINCE INCEPTION (JUNE 20, 2026)</div>
    </div>

    <div class="metric-card border border-green-800 p-4 bg-green-950/20 rounded relative overflow-hidden group hover:border-green-500 transition-colors duration-300">
      <div class="absolute right-2 top-2 text-green-900 group-hover:text-green-700 transition-colors duration-300">
        <Cpu size={40} />
      </div>
      <div class="text-xs text-green-600 font-semibold tracking-wider">INITIAL COMMIT</div>
      <div class="text-sm font-bold text-green-300 mt-1.5 break-all">{formatEpoch(changelogData.metrics?.firstCommitTimestamp)}</div>
      <div class="text-[9px] text-green-700 mt-2">REPOSITORY GENESIS STAMP</div>
    </div>

    <div class="metric-card border border-green-800 p-4 bg-green-950/20 rounded relative overflow-hidden group hover:border-green-500 transition-colors duration-300">
      <div class="absolute right-2 top-2 text-green-900 group-hover:text-green-700 transition-colors duration-300">
        <Activity size={40} />
      </div>
      <div class="text-xs text-green-600 font-semibold tracking-wider">COMMIT METRICS</div>
      <div class="text-sm font-bold text-green-300 mt-1 flex flex-col gap-0.5">
        <div>Gross Avg: <span class="text-white">{formatInterval(changelogData.metrics?.grossAverageDurationSeconds)}</span></div>
        <div>Active Avg: <span class="text-white">{formatInterval(changelogData.metrics?.averageInnerDurationSeconds)}</span></div>
      </div>
      <div class="text-[9px] text-green-700 mt-2">ACTIVE: COMMIT SPACING &lt; 60 MINS</div>
    </div>

    <div class="metric-card border border-green-800 p-4 bg-green-950/20 rounded relative overflow-hidden group hover:border-green-500 transition-colors duration-300">
      <div class="absolute right-2 top-2 text-green-900 group-hover:text-green-700 transition-colors duration-300">
        <Code size={40} />
      </div>
      <div class="text-xs text-green-600 font-semibold tracking-wider">AVG LINES ALTERED</div>
      <div class="text-lg font-bold text-green-300 mt-1">{changelogData.metrics?.averageLinesAltered || 0} <span class="text-xs text-green-500">lines</span></div>
      <div class="text-[9px] text-green-700 mt-2">PER COMMIT ITERATION</div>
    </div>
  </div>

  <!-- Changelog Entries -->
  <div class="flex-1 flex flex-col gap-4 min-h-0">
    <div class="text-xs text-green-600 font-semibold border-b border-green-900/60 pb-1">COMMITS LOG</div>
    <div class="flex-1 overflow-y-auto flex flex-col gap-4 pr-1">
      {#each paginatedEntries() as entry}
        <div class="entry-block border border-green-900/80 bg-black p-4 rounded hover:border-green-700 transition-colors duration-200">
          <div class="flex items-center justify-between border-b border-green-950 pb-2 mb-3">
            <div class="flex items-center gap-3">
              <span class="text-white bg-green-900 px-2 py-0.5 rounded text-xs font-bold">v{entry.version}</span>
              <span class="text-green-300 font-bold text-sm">{entry.name}</span>
            </div>
            <span class="text-xs text-green-600 font-mono">{formatEpoch(entry.timestamp)}</span>
          </div>

          <ul class="flex flex-col gap-2">
            {#each entry.commits as commit}
              <li class="flex items-start gap-2.5 text-xs text-green-400 group">
                <a href={commit.url} target="_blank" rel="noopener noreferrer" 
                   class="text-cyan-400 font-bold hover:text-cyan-300 hover:underline shrink-0">
                  [{commit.hash}]
                </a>
                <span class="text-green-600 font-mono shrink-0">[{formatCommitTimestamp(commit.timestamp)}]</span>
                <span class="text-green-500 select-all">{commit.message}</span>
                {#if commit.linesChanged > 0}
                  <span class="text-[9px] text-green-700 font-sans ml-auto shrink-0 bg-green-950/40 px-1 py-0.5 rounded">
                    +/- {commit.linesChanged}
                  </span>
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </div>

  <!-- Pagination -->
  <div class="footer flex justify-between items-center border-t border-green-900/60 pt-4 mt-auto">
    <div class="text-xs text-green-600">
      Showing page {currentPage} of {totalPages} ({changelogData.entries?.length || 0} versions total)
    </div>
    <div class="flex gap-2">
      <button class="nav-btn p-1.5 rounded border border-green-800 text-green-400 hover:bg-green-950 disabled:opacity-30 disabled:hover:bg-transparent transition-colors duration-200" 
              onclick={prevPage} disabled={currentPage === 1}>
        <ChevronLeft size={16} />
      </button>
      <button class="nav-btn p-1.5 rounded border border-green-800 text-green-400 hover:bg-green-950 disabled:opacity-30 disabled:hover:bg-transparent transition-colors duration-200" 
              onclick={nextPage} disabled={currentPage === totalPages}>
        <ChevronRight size={16} />
      </button>
    </div>
  </div>
</div>

<style>
  .changelog-container::-webkit-scrollbar {
    width: 6px;
  }
  .changelog-container::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.1);
  }
  .changelog-container::-webkit-scrollbar-thumb {
    background: #1f3f27;
    border-radius: 3px;
  }
  .changelog-container::-webkit-scrollbar-thumb:hover {
    background: #0f9f30;
  }

  .metric-card {
    box-shadow: 0 4px 12px rgba(0, 255, 102, 0.03);
  }

  .entry-block {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }
</style>
