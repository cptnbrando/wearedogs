<script>
  import { Search } from "lucide-svelte";

  let {
    allLangItems = [],
    currentLang = $bindable(),
    onHoverLang,
    onSelectLang,
  } = $props();

  let searchQuery = $state("");
  let sortField = $state("name");
  let sortAscending = $state(true);

  // Derived filtered languages for Language Explorer
  let filteredLangs = $derived.by(() => {
    let result = allLangItems;

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.displayName.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.country.toLowerCase().includes(q) ||
          item.dialect.toLowerCase().includes(q),
      );
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === "string") {
        return sortAscending
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else {
        return sortAscending ? aVal - bVal : bVal - aVal;
      }
    });

    return result;
  });

  function toggleSort(field) {
    if (sortField === field) {
      sortAscending = !sortAscending;
    } else {
      sortField = field;
      sortAscending = true;
    }
  }

  function handleSelect(code) {
    if (onSelectLang) {
      onSelectLang(code);
    }
  }

  function handleHover(code) {
    if (onHoverLang) {
      onHoverLang(code);
    }
  }
</script>

<div class="tab-pane animated-pane flex flex-col gap-6">
  <div
    class="explorer-toolbar flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4"
  >
    <div class="search-box relative flex-1 max-w-[400px]">
      <Search
        size={16}
        class="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
      />
      <input
        type="text"
        placeholder="Search languages, countries, codes..."
        bind:value={searchQuery}
        class="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/5 rounded-xl text-white text-sm outline-none focus:border-white/20 focus:bg-black/60 transition-all"
      />
      {#if searchQuery}
        <button
          class="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-lg font-bold"
          onclick={() => (searchQuery = "")}
        >
          &times;
        </button>
      {/if}
    </div>
    <div class="results-count text-xs font-semibold text-white/40">
      Showing {filteredLangs.length} of {allLangItems.length} locales
    </div>
  </div>

  <!-- Table Wrapper (Desktop/Tablet) -->
  <div
    class="table-wrapper hidden md:block border border-white/5 rounded-xl overflow-hidden bg-black/25"
  >
    <table class="explorer-table w-full text-left border-collapse text-sm">
      <thead>
        <tr class="bg-white/[0.02] border-b border-white/5">
          <th
            onclick={() => toggleSort("name")}
            class="p-3.5 pl-5 font-semibold text-xs text-white/40 uppercase tracking-wider cursor-pointer hover:bg-white/5 hover:text-white transition-all select-none"
          >
            Language {sortField === "name"
              ? sortAscending
                ? "▲"
                : "▼"
              : ""}
          </th>
          <th
            onclick={() => toggleSort("country")}
            class="p-3.5 font-semibold text-xs text-white/40 uppercase tracking-wider cursor-pointer hover:bg-white/5 hover:text-white transition-all select-none"
          >
            Primary Country / Region {sortField === "country"
              ? sortAscending
                ? "▲"
                : "▼"
              : ""}
          </th>
          <th
            class="p-3.5 font-semibold text-xs text-white/40 uppercase tracking-wider select-none"
          >
            Dialect
          </th>
          <th
            onclick={() => toggleSort("speakersNum")}
            class="p-3.5 font-semibold text-xs text-white/40 uppercase tracking-wider cursor-pointer hover:bg-white/5 hover:text-white transition-all select-none text-right"
          >
            Speakers {sortField === "speakersNum"
              ? sortAscending
                ? "▲"
                : "▼"
              : ""}
          </th>
          <th
            onclick={() => toggleSort("dogsNum")}
            class="p-3.5 font-semibold text-xs text-white/40 uppercase tracking-wider cursor-pointer hover:bg-white/5 hover:text-white transition-all select-none text-right pr-5"
          >
            Dogs {sortField === "dogsNum"
              ? sortAscending
                ? "▲"
                : "▼"
              : ""}
          </th>
        </tr>
      </thead>
      <tbody>
        {#each filteredLangs as item}
          <!-- svelte-ignore a11y_mouse_events_have_key_events -->
          <tr
            class="cursor-pointer border-b border-white/[0.02] hover:bg-white/[0.03] transition-all"
            class:active-row={item.code === currentLang}
            onmouseover={() => handleHover(item.code)}
            onclick={() => handleSelect(item.code)}
          >
            <td class="p-3.5 pl-5">
              <div class="flex items-center gap-3">
                <span
                  class="w-2 h-6 rounded border border-white/10 shrink-0"
                  style="background: {item.colors[0]}"
                ></span>
                <div class="flex flex-col">
                  <span class="font-semibold text-white/95"
                    >{item.displayName}</span
                  >
                  <span
                    class="text-[10px] text-white/30 uppercase tracking-widest"
                    >{item.code}</span
                  >
                </div>
              </div>
            </td>
            <td class="p-3.5 text-white/70">{item.country}</td>
            <td class="p-3.5 text-white/50">{item.dialect}</td>
            <td class="p-3.5 text-right font-mono text-white/70"
              >{item.speakersText}</td
            >
            <td class="p-3.5 text-right font-mono text-white/70 pr-5"
              >{item.dogsText}</td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Mobile cards -->
  <div class="explorer-cards-mobile flex md:hidden flex-col gap-3">
    {#each filteredLangs as item}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-3 transition-all"
        class:active-mobile={item.code === currentLang}
        onclick={() => handleSelect(item.code)}
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span
              class="w-2.5 h-6 rounded border border-white/10"
              style="background: {item.colors[0]}"
            ></span>
            <div class="flex flex-col">
              <span class="font-bold text-white"
                >{item.displayName}</span
              >
              <span
                class="text-[9px] text-white/40 tracking-wider uppercase font-mono"
                >{item.code}</span
              >
            </div>
          </div>
        </div>
        <div
          class="grid grid-cols-2 gap-3 text-xs border-t border-white/5 pt-3"
        >
          <div class="flex flex-col gap-0.5">
            <span
              class="text-[9px] uppercase tracking-wider text-white/30 font-bold"
              >Region</span
            >
            <span class="text-white/70 font-medium truncate"
              >{item.country}</span
            >
          </div>
          <div class="flex flex-col gap-0.5">
            <span
              class="text-[9px] uppercase tracking-wider text-white/30 font-bold"
              >Dialect</span
            >
            <span class="text-white/70 font-medium truncate"
              >{item.dialect || "—"}</span
            >
          </div>
          <div class="flex flex-col gap-0.5">
            <span
              class="text-[9px] uppercase tracking-wider text-white/30 font-bold"
              >Speakers</span
            >
            <span class="text-white/70 font-mono"
              >{item.speakersText}</span
            >
          </div>
          <div class="flex flex-col gap-0.5">
            <span
              class="text-[9px] uppercase tracking-wider text-white/30 font-bold"
              >Local Dogs</span
            >
            <span class="text-white/70 font-mono"
              >{item.dogsText}</span
            >
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  /* Table styling */
  .active-row td {
    background: rgba(255, 255, 255, 0.06);
    color: white !important;
  }

  @media (max-width: 1024px) {
    /* Hide Country and Dialect columns to prevent horizontal scroll on tablets */
    .explorer-table th:nth-child(2),
    .explorer-table td:nth-child(2),
    .explorer-table th:nth-child(3),
    .explorer-table td:nth-child(3) {
      display: none;
    }
  }

  .active-mobile {
    border-color: rgba(255, 255, 255, 0.25) !important;
    background: rgba(255, 255, 255, 0.05) !important;
  }
</style>
