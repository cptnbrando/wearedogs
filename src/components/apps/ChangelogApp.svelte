<script>
  import { onMount, onDestroy } from "svelte";
  import { Terminal, Shield, Cpu, Clock, Code, Activity } from "lucide-svelte";

  let changelogData = $state({ metrics: {}, entries: [] });

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
    const inceptionTime = new Date("2026-06-20T23:18:50-05:00").getTime();
    const updateElapsed = () => {
      elapsedSeconds = Math.max(
        0,
        Math.floor((Date.now() - inceptionTime) / 1000),
      );
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
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const hr = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${d} ${hr}:${min}`;
  }

  // Entries list derivation
  let entries = $derived(changelogData.entries || []);
</script>

<div
  class="changelog-container p-3 sm:p-4 md:p-6 overflow-y-auto overflow-x-hidden sm:overflow-hidden h-full flex flex-col gap-3 md:gap-6 text-green-400 font-mono bg-black select-none"
>
  <!-- Title / Header -->
  <div
    class="header border-b border-green-800 pb-2 md:pb-4 flex justify-between items-center shrink-0"
  >
    <div
      class="flex items-center gap-1 text-green-500 font-bold text-xs md:text-lg tracking-wider"
    >
      <Terminal class="animate-pulse w-5 h-5 md:w-6 md:h-6" />
      <span>SYSTEM_LOG://CHANGELOG.SYS</span>
    </div>
    <div
      class="text-[9px] md:text-[10px] text-green-600 flex items-center gap-1.5 shrink-0"
    ></div>
  </div>

  <!-- Main Content Layout -->
  <div
    class="main-layout flex-1 flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 md:gap-6 min-h-0"
  >
    <!-- Left Column (Blurb + Metrics) -->
    <div
      class="left-section sm:col-span-5 flex flex-col gap-3 md:gap-6 shrink-0 sm:overflow-y-auto sm:h-full sm:max-h-full sm:pr-1"
    >
      <!-- Blurb Section -->
      <div
        class="blurb-box border border-green-800/40 p-3 md:p-4 bg-green-950/5 rounded text-[10px] md:text-xs text-green-500/90 leading-relaxed font-mono"
      >
        This website was created with Antigravity IDE and <a
          href="https://gemini.google.com"
          target="_blank"
          rel="noopener noreferrer"
          class="text-cyan-400 hover:text-cyan-300 underline transition-colors duration-200"
          >Gemini Ultra</a
        > with Google. I have written very little code here. Antigravity and similar
        agentic AI dev workflows offer very different ways of creating things. It
        is remarkable, and I am learning and embracing everything I can about these
        new tools. I am currently focused on swarm development, where Antigravity
        spins up dozens of AI Agents to accomplish hundreds of tasks simultaneously.
        I find that the slowest part of the creation process now is writing the notes
        for all the changes, standardizing UI and ensuring a polished experience,
        pull request code review, and trying to whip the AIs into the right kinda
        shape. But wow, is it a beautiful thing to witness the machine create 20
        pages in the blink of an eye. We're entering a new era! And this is just
        the beginning. Insanity. This page offers some metrics to help me stay on
        top of things, as a man with 2 arms, armed with a goliath that uses one million
        keyboards.
      </div>

      <!-- Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <div
          class="metric-card border border-green-800 p-2.5 md:p-4 bg-green-950/20 rounded relative overflow-hidden group hover:border-green-500 transition-colors duration-300"
        >
          <div
            class="absolute right-2 top-2 text-green-900 group-hover:text-green-700 transition-colors duration-300"
          >
            <Clock class="w-6 h-6 md:w-10 md:h-10" />
          </div>
          <div
            class="text-[8px] md:text-xs text-green-600 font-semibold tracking-wider"
          >
            ELAPSED TIME
          </div>
          <div
            class="text-sm md:text-lg font-bold text-green-300 mt-1 tabular-nums"
          >
            {formattedElapsed()}
          </div>
          <div class="text-[8px] md:text-[9px] text-green-700 mt-1 md:mt-2">
            SINCE INCEPTION (JUNE 20, 2026)
          </div>
        </div>

        <div
          class="metric-card border border-green-800 p-2.5 md:p-4 bg-green-950/20 rounded relative overflow-hidden group hover:border-green-500 transition-colors duration-300"
        >
          <div
            class="absolute right-2 top-2 text-green-900 group-hover:text-green-700 transition-colors duration-300"
          >
            <Cpu class="w-6 h-6 md:w-10 md:h-10" />
          </div>
          <div
            class="text-[8px] md:text-xs text-green-600 font-semibold tracking-wider"
          >
            INITIAL COMMIT
          </div>
          <div
            class="text-[10px] md:text-sm font-bold text-green-300 mt-1.5 break-all"
          >
            {formatEpoch(changelogData.metrics?.firstCommitTimestamp)}
          </div>
          <div class="text-[8px] md:text-[9px] text-green-700 mt-1 md:mt-2">
            REPOSITORY GENESIS STAMP
          </div>
        </div>

        <div
          class="metric-card border border-green-800 p-2.5 md:p-4 bg-green-950/20 rounded relative overflow-hidden group hover:border-green-500 transition-colors duration-300"
        >
          <div
            class="absolute right-2 top-2 text-green-900 group-hover:text-green-700 transition-colors duration-300"
          >
            <Activity class="w-6 h-6 md:w-10 md:h-10" />
          </div>
          <div
            class="text-[8px] md:text-xs text-green-600 font-semibold tracking-wider"
          >
            COMMIT METRICS
          </div>
          <div
            class="text-[10px] md:text-sm font-bold text-green-300 mt-1 flex flex-col gap-0.5"
          >
            <div>
              Gross Avg: <span class="text-white"
                >{formatInterval(
                  changelogData.metrics?.grossAverageDurationSeconds,
                )}</span
              >
            </div>
            <div>
              Active Avg: <span class="text-white"
                >{formatInterval(
                  changelogData.metrics?.averageInnerDurationSeconds,
                )}</span
              >
            </div>
          </div>
          <div class="text-[8px] md:text-[9px] text-green-700 mt-1 md:mt-2">
            ACTIVE: COMMIT SPACING &lt; 60 MINS
          </div>
        </div>

        <div
          class="metric-card border border-green-800 p-2.5 md:p-4 bg-green-950/20 rounded relative overflow-hidden group hover:border-green-500 transition-colors duration-300"
        >
          <div
            class="absolute right-2 top-2 text-green-900 group-hover:text-green-700 transition-colors duration-300"
          >
            <Code class="w-6 h-6 md:w-10 md:h-10" />
          </div>
          <div
            class="text-[8px] md:text-xs text-green-600 font-semibold tracking-wider"
          >
            AVG LINES ALTERED
          </div>
          <div class="text-sm md:text-lg font-bold text-green-300 mt-1">
            {changelogData.metrics?.averageLinesAltered || 0}
            <span class="text-[10px] text-green-500">lines</span>
          </div>
          <div class="text-[8px] md:text-[9px] text-green-700 mt-1 md:mt-2">
            PER COMMIT ITERATION
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column (Commits Log + Pagination) -->
    <div
      class="right-section sm:col-span-7 flex-1 flex flex-col gap-3 md:gap-4 min-h-0 sm:overflow-hidden"
    >
      <!-- Commits Log Panel -->
      <div
        class="commits-container flex-1 flex flex-col gap-2 md:gap-4 min-h-0"
      >
        <div
          class="text-[10px] md:text-xs text-green-600 font-semibold border-b border-green-900/60 pb-1 shrink-0"
        >
          COMMITS LOG
        </div>
        <div
          class="commits-list flex-1 overflow-y-visible sm:overflow-y-auto flex flex-col gap-3 pr-1 min-h-0"
        >
          {#each entries as entry}
            <div
              class="entry-block border border-green-900/80 bg-black p-3 md:p-4 rounded hover:border-green-700 transition-colors duration-200"
            >
              <div
                class="flex items-center justify-between border-b border-green-950 pb-2 mb-3"
              >
                <div class="flex items-center gap-3">
                  <span
                    class="text-white bg-green-900 px-2 py-0.5 rounded text-[10px] md:text-xs font-bold"
                    >v{entry.version}</span
                  >
                  <span class="text-green-300 font-bold text-xs md:text-sm"
                    >{entry.name}</span
                  >
                </div>
                <span class="text-[10px] md:text-xs text-green-600 font-mono"
                  >{formatEpoch(entry.timestamp)}</span
                >
              </div>

              <ul class="flex flex-col gap-2">
                {#each entry.commits as commit}
                  <li
                    class="flex flex-col md:flex-row md:items-start gap-1 md:gap-2 text-[10px] md:text-xs text-green-400 group border-b border-green-950/40 pb-2 md:pb-0 md:border-0 last:border-0 last:pb-0"
                  >
                    <div class="flex items-center gap-1.5 shrink-0">
                      <a
                        href={commit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-cyan-400 font-bold hover:text-cyan-300 hover:underline shrink-0"
                      >
                        [{commit.hash}]
                      </a>
                      <span class="text-green-600 font-mono shrink-0"
                        >[{formatCommitTimestamp(commit.timestamp)}]</span
                      >
                    </div>
                    <span
                      class="text-green-500 select-all leading-normal break-all min-w-0 flex-1 pl-1 md:pl-0"
                      >{commit.message}</span
                    >
                    {#if commit.linesChanged > 0}
                      <span
                        class="text-[9px] text-green-700 font-sans ml-auto md:ml-0 shrink-0 bg-green-950/40 px-1 py-0.5 rounded"
                      >
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
    </div>
  </div>
</div>

<style>
  .changelog-container::-webkit-scrollbar,
  .left-section::-webkit-scrollbar,
  .commits-list::-webkit-scrollbar {
    width: 6px;
  }
  .changelog-container::-webkit-scrollbar-track,
  .left-section::-webkit-scrollbar-track,
  .commits-list::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }
  .changelog-container::-webkit-scrollbar-thumb,
  .left-section::-webkit-scrollbar-thumb,
  .commits-list::-webkit-scrollbar-thumb {
    background: #1f3f27;
    border-radius: 3px;
  }
  .changelog-container::-webkit-scrollbar-thumb:hover,
  .left-section::-webkit-scrollbar-thumb:hover,
  .commits-list::-webkit-scrollbar-thumb:hover {
    background: #0f9f30;
  }

  .metric-card {
    box-shadow: 0 4px 12px rgba(0, 255, 102, 0.03);
  }

  .entry-block {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }
</style>
