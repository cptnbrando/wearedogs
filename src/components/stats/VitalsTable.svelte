<script>
  import {
    languageVitals,
    formatCompact,
    formatRate,
  } from "../../data/stats/languageVitals.js";
  import {
    RATE_UNITS,
    rateUnitState,
  } from "../../data/stats/rateUnits.svelte.js";

  let { currentLang = "", onSelect } = $props();

  let query = $state("");
  let sortKey = $state("speakers");
  let sortDir = $state(-1); // -1 desc, 1 asc

  let unit = $derived(RATE_UNITS[rateUnitState.idx]);

  // Rate columns re-label and re-scale with the global unit toggle; sorting
  // stays on the daily values (same ordering under any unit).
  let columns = $derived([
    { key: "rank", label: "#", numeric: true },
    { key: "name", label: "Language", numeric: false },
    { key: "speakers", label: "Speakers", numeric: true },
    { key: "birthRate", label: "CBR ‰", numeric: true },
    { key: "deathRate", label: "CDR ‰", numeric: true },
    { key: "dailyBirths", label: `Births / ${unit.short}`, numeric: true },
    { key: "dailyDeaths", label: `Deaths / ${unit.short}`, numeric: true },
    { key: "dailyNet", label: `Net / ${unit.short}`, numeric: true },
  ]);

  function setSort(key) {
    if (sortKey === key) {
      sortDir = -sortDir;
    } else {
      sortKey = key;
      // Text sorts ascending first; numbers descending first
      sortDir = key === "name" ? 1 : -1;
    }
  }

  let rows = $derived.by(() => {
    const q = query.trim().toLowerCase();
    let out = languageVitals;
    if (q) {
      out = out.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.country.toLowerCase().includes(q) ||
          v.code.toLowerCase().includes(q),
      );
    }
    return [...out].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string") return av.localeCompare(bv) * sortDir;
      return (av - bv) * sortDir;
    });
  });
</script>

<div class="table-tools">
  <input
    type="search"
    placeholder="Search {languageVitals.length} languages…"
    bind:value={query}
    aria-label="Search languages"
  />
  <span class="row-count">{rows.length} shown</span>
</div>

<div class="table-scroll">
  <table>
    <thead>
      <tr>
        {#each columns as col (col.key)}
          <th
            class:numeric={col.numeric}
            aria-sort={sortKey === col.key
              ? sortDir === 1
                ? "ascending"
                : "descending"
              : undefined}
          >
            <button onclick={() => setSort(col.key)}>
              {col.label}
              {#if sortKey === col.key}
                <span class="sort-arrow">{sortDir === 1 ? "▲" : "▼"}</span>
              {/if}
            </button>
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as v (v.code)}
        <tr
          class:selected={v.code === currentLang}
          onclick={() => onSelect?.(v.code)}
        >
          <td class="numeric muted">{v.rank}</td>
          <td>
            <span class="lang-name">{v.name}</span>
            <span class="lang-country">{v.country}</span>
          </td>
          <td class="numeric">{formatCompact(v.speakers)}</td>
          <td class="numeric">{v.birthRate.toFixed(1)}</td>
          <td class="numeric">{v.deathRate.toFixed(1)}</td>
          <td class="numeric">{formatRate(v.dailyBirths * unit.perDay)}</td>
          <td class="numeric">{formatRate(v.dailyDeaths * unit.perDay)}</td>
          <td class="numeric net" class:positive={v.dailyNet >= 0} class:negative={v.dailyNet < 0}>
            {v.dailyNet >= 0 ? "+" : "−"}{formatRate(Math.abs(v.dailyNet) * unit.perDay)}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style lang="scss">
  .table-tools {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;

    input {
      flex: 1;
      max-width: 320px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 7px 12px;
      font-size: 0.78rem;
      color: var(--viz-ink);
      outline: none;

      &::placeholder {
        color: var(--viz-muted);
      }

      &:focus {
        border-color: rgba(255, 255, 255, 0.2);
      }
    }
  }

  .row-count {
    font-size: 0.7rem;
    color: var(--viz-muted);
    font-variant-numeric: tabular-nums;
  }

  .table-scroll {
    overflow: auto;
    flex: 1;
    min-height: 0;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
  }

  table {
    width: 100%;
    min-width: 720px;
    border-collapse: collapse;
    font-size: 0.75rem;
  }

  thead th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: #16161c;
    text-align: left;
    padding: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

    button {
      width: 100%;
      background: none;
      border: none;
      color: var(--viz-ink-2);
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      padding: 10px 12px;
      cursor: pointer;
      text-align: inherit;
      white-space: nowrap;

      &:hover {
        color: var(--viz-ink);
      }
    }

    &.numeric {
      text-align: right;

      button {
        text-align: right;
      }
    }
  }

  .sort-arrow {
    font-size: 0.55rem;
    margin-left: 2px;
  }

  tbody tr {
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    transition: background 0.12s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.04);
    }

    &.selected {
      background: rgba(57, 135, 229, 0.12);
      box-shadow: inset 2px 0 0 var(--viz-births);
    }
  }

  td {
    padding: 7px 12px;
    color: var(--viz-ink-2);
    white-space: nowrap;

    &.numeric {
      text-align: right;
      font-variant-numeric: tabular-nums;
      color: var(--viz-ink);
    }

    &.muted {
      color: var(--viz-muted);
    }
  }

  .lang-name {
    color: var(--viz-ink);
    font-weight: 600;
    display: block;
  }

  .lang-country {
    display: block;
    font-size: 0.65rem;
    color: var(--viz-muted);
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .net.positive {
    color: var(--viz-good);
  }

  .net.negative {
    color: var(--viz-deaths);
  }
</style>
