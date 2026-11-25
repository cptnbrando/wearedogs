<script>
  /**
   * Settings > Owner, unlocked: how many times each DOGS song has been played
   * (src/lib/playCounts.svelte.js). Only the owner's session can read these.
   */
  import { RefreshCw } from "lucide-svelte";
  import { admin } from "../../../lib/admin.svelte.js";
  import { loadPlayCounts } from "../../../lib/playCounts.svelte.js";

  const STATUS_SIGNED_OUT = 401;
  const DATE_FORMAT = { day: "numeric", month: "short", year: "numeric" };

  /** @type {import("../../../lib/playCounts.svelte.js").PlayRow[]} */
  let rows = $state([]);
  let loading = $state(false);
  let loaded = $state(false);
  let error = $state("");
  let total = $derived(rows.reduce((sum, row) => sum + row.count, 0));

  async function load() {
    if (loading) return;
    loading = true;
    const answer = await loadPlayCounts(admin.token);
    loading = false;
    // The Worker no longer takes the session: back to the PIN
    if (answer.status === STATUS_SIGNED_OUT) return admin.lock();
    error = answer.ok ? "" : answer.error;
    if (!answer.ok) return;
    rows = answer.rows;
    loaded = true;
  }

  load();

  const lastPlayed = (row) => (row.lastAt ? new Date(row.lastAt).toLocaleDateString([], DATE_FORMAT) : "");
</script>

<div class="plays flex flex-col gap-3 md:gap-4 2xl:gap-5">
  <div class="flex flex-row items-center justify-between gap-3">
    <h4 class="plays-title text-xs md:text-sm 2xl:text-base">
      Plays{#if loaded}: {total}{/if}
    </h4>
    <button type="button" class="plays-refresh p-2 2xl:p-3" aria-label="Refresh the play counts" disabled={loading} onclick={load}>
      <RefreshCw size={16} />
    </button>
  </div>

  {#if error}
    <p class="plays-note text-xs md:text-sm 2xl:text-base" role="alert">{error}</p>
  {:else if loaded && !rows.length}
    <p class="plays-note text-xs md:text-sm 2xl:text-base">No plays counted yet. A play is thirty seconds of a DOGS song.</p>
  {:else if loaded}
    <ul class="plays-list grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 2xl:gap-x-10">
      {#each rows as row (row.id)}
        <li class="plays-row flex flex-row items-baseline gap-2 text-xs md:text-sm 2xl:text-base" title={lastPlayed(row) ? `Last played ${lastPlayed(row)}` : ""}>
          <span class="plays-song min-w-0 flex-1 truncate">{row.title}</span>
          <span class="plays-count shrink-0">{row.count}</span>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="plays-note text-xs md:text-sm 2xl:text-base" aria-live="polite">Loading the play counts…</p>
  {/if}
</div>

<style lang="scss">
  @use "../../../styles/variables" as *;

  .plays {
    padding-top: 12px;
    border-top: 1px solid $border-light;
  }

  .plays-title {
    margin: 0;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $color-neon-green;
  }

  .plays-refresh {
    display: inline-flex;
    border-radius: 8px;
    border: 1px solid $border-light;
    background: transparent;
    color: var(--color-text-muted, rgba(255, 255, 255, 0.55));
    cursor: pointer;

    &:hover,
    &:focus-visible {
      background: $bg-input-dark;
    }

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }
  }

  .plays-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .plays-row {
    padding: 4px 0;
    border-bottom: 1px solid $border-light;
  }

  .plays-count {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--color-text, #ffffff);
  }

  .plays-note,
  .plays-song {
    margin: 0;
    color: var(--color-text-muted, rgba(255, 255, 255, 0.55));
  }
</style>
