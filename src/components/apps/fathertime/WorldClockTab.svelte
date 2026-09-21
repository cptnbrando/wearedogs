<script>
  import { onMount, onDestroy } from "svelte";
  import { Search, Plus, Trash2, Globe, Clock, ArrowRight } from "lucide-svelte";
  import {
    searchPlaces,
    runZoneQuery,
    zoneAbbrev,
    offsetLabel,
  } from "../../../lib/timeMath.js";

  // Predefined major cities and timezones
  const CITY_DATABASE = [
    { name: "Chicago", country: "United States", tz: "America/Chicago" },
    { name: "New York", country: "United States", tz: "America/New_York" },
    {
      name: "Los Angeles",
      country: "United States",
      tz: "America/Los_Angeles",
    },
    { name: "London", country: "United Kingdom", tz: "Europe/London" },
    { name: "Oslo", country: "Norway", tz: "Europe/Oslo" },
    { name: "Tokyo", country: "Japan", tz: "Asia/Tokyo" },
    { name: "Sydney", country: "Australia", tz: "Australia/Sydney" },
    { name: "São Paulo", country: "Brazil", tz: "America/Sao_Paulo" },
    {
      name: "Johannesburg",
      country: "South Africa",
      tz: "Africa/Johannesburg",
    },
    { name: "New Delhi", country: "India", tz: "Asia/Kolkata" },
    { name: "Cairo", country: "Egypt", tz: "Africa/Cairo" },
    { name: "Paris", country: "France", tz: "Europe/Paris" },
    { name: "Dubai", country: "United Arab Emirates", tz: "Asia/Dubai" },
    { name: "Singapore", country: "Singapore", tz: "Asia/Singapore" },
  ];

  let trackedCities = $state([]);
  let searchQuery = $state("");
  let selectedBaseCity = $state("Local Time");
  let compareHour = $state(new Date().getHours()); // Slider value (0-23)
  let currentTime = $state(new Date());
  let timeUpdater = null;

  // A clock is a name + zone: "EST" and "New York" share a zone but are
  // different clocks, so the pair is the identity.
  const clockKey = (c) => `${c.name}|${c.tz}`;
  const isTracked = (c) => trackedCities.some((tc) => clockKey(tc) === clockKey(c));

  // The search bar doubles as a question box: "2pm est to cst"
  let quickAnswer = $derived.by(() => {
    const res = runZoneQuery(searchQuery);
    return res?.type === "zone" ? res : null;
  });

  // Search filter — the curated cities (they carry a country) first, then
  // every city, region and timezone acronym Father Time knows.
  let filteredCities = $derived.by(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || quickAnswer) return [];
    const curated = CITY_DATABASE.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q),
    );
    const seen = new Set();
    return [...curated, ...searchPlaces(q, 14)]
      .filter((c) => {
        if (seen.has(clockKey(c)) || isTracked(c)) return false;
        seen.add(clockKey(c));
        return true;
      })
      .slice(0, 14);
  });

  // Clocks a quick answer could add: its source and every target
  let answerClocks = $derived(
    quickAnswer
      ? [quickAnswer.src, quickAnswer.tgt, ...quickAnswer.others]
          .filter((p) => p.label !== "Local Time")
          .map((p) => ({ name: p.label, country: p.fullName || p.tz.replace(/_/g, " "), tz: p.tz }))
          .filter((c, i, all) => all.findIndex((x) => clockKey(x) === clockKey(c)) === i && !isTracked(c))
      : [],
  );

  function handleSearchKey(e) {
    if (e.key === "Enter" && filteredCities.length > 0) addCity(filteredCities[0]);
    if (e.key === "Escape") searchQuery = "";
  }

  function loadTrackedCities() {
    try {
      const stored = localStorage.getItem("father_time_tracked_cities");
      if (stored) {
        trackedCities = JSON.parse(stored);
      } else {
        // Defaults
        trackedCities = [
          { name: "Chicago", country: "United States", tz: "America/Chicago" },
          { name: "Oslo", country: "Norway", tz: "Europe/Oslo" },
          { name: "Tokyo", country: "Japan", tz: "Asia/Tokyo" },
        ];
        saveTrackedCities();
      }
    } catch (e) {
      console.error(e);
    }
  }

  function saveTrackedCities() {
    try {
      localStorage.setItem(
        "father_time_tracked_cities",
        JSON.stringify(trackedCities),
      );
    } catch (e) {
      console.error(e);
    }
  }

  function addCity(city, keepQuery = false) {
    if (isTracked(city)) return;
    trackedCities.push({ name: city.name, country: city.country, tz: city.tz });
    saveTrackedCities();
    if (!keepQuery) searchQuery = "";
  }

  function removeCity(city) {
    trackedCities = trackedCities.filter((c) => clockKey(c) !== clockKey(city));
    saveTrackedCities();
  }

  // "CDT · UTC-5" under each clock
  function zoneTag(date, tz) {
    return `${zoneAbbrev(date, tz)} · ${offsetLabel(date, tz)}`;
  }

  // Format absolute current time in targeted timezone
  function formatTimeInZone(date, tz) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  }

  function formatDateInZone(date, tz) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      month: "short",
      day: "numeric",
      weekday: "short",
    }).format(date);
  }

  // Calculate sliding comparisons
  // returns hour display details for slider mapping
  function getComparedTime(tz) {
    // Create date relative to target compared hour in base zone
    let baseDate = new Date(currentTime);

    if (selectedBaseCity === "Local Time") {
      baseDate.setHours(compareHour, 0, 0, 0);
    } else {
      // Find base timezone offset
      const baseTz = selectedBaseCity;
      // Force base hour in target baseTz timezone
      // Since changing hours in specific timezones is tricky in vanilla JS,
      // we format current date, find the offset, and shift minutes accordingly
      const localString = baseDate.toLocaleString("en-US", {
        timeZone: baseTz,
      });
      const tzHour = new Date(localString).getHours();
      const diffHours = compareHour - tzHour;
      baseDate.setHours(baseDate.getHours() + diffHours, 0, 0, 0);
    }

    const timeStr = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(baseDate);

    const dateStr = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      day: "numeric",
      month: "short",
    }).format(baseDate);

    return { timeStr, dateStr };
  }

  onMount(() => {
    loadTrackedCities();
    timeUpdater = setInterval(() => {
      currentTime = new Date();
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(timeUpdater);
  });
</script>

<div
  class="world-clock-tab animated-pane flex flex-col h-full p-4 md:p-6 w-full max-w-4xl mx-auto justify-between gap-5"
>
  <!-- Add / Search bar -->
  <div class="relative w-full">
    <div
      class="flex items-center gap-2 border border-white/8 bg-black/20 px-3 py-2 rounded-xl"
    >
      <Search size={16} class="text-white/40" />
      <input
        type="text"
        placeholder="Add a city or zone (Oslo, EST, UTC+5:30) — or ask “2pm est to cst”"
        bind:value={searchQuery}
        onkeydown={handleSearchKey}
        class="bg-transparent border-none text-xs text-white outline-none flex-1"
        aria-label="Search cities and timezones, or ask a timezone question"
      />
      <Globe size={15} class="text-white/20" />
    </div>

    <!-- Quick answer: the search bar understands "2pm est to cst" -->
    {#if quickAnswer}
      <div
        class="absolute left-0 right-0 top-full mt-1.5 border border-sky-400/25 bg-[#0c0c12] rounded-xl z-30 shadow-2xl p-3.5 flex flex-col gap-2.5 max-h-72 overflow-y-auto"
        role="status"
      >
        <div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
          <span class="text-[11px] text-white/55 font-mono">
            {quickAnswer.src.time}
            <span class="text-white/80 font-bold">{quickAnswer.src.label}</span>
          </span>
          <ArrowRight size={13} class="text-sky-400/60" />
          <span class="font-mono text-xl font-black text-sky-400">{quickAnswer.tgt.time}</span>
          <span class="text-[11px] text-white/80 font-bold">{quickAnswer.tgt.label}</span>
        </div>
        <p class="text-[9px] font-mono text-white/40 text-center">
          {quickAnswer.tgt.date} · {quickAnswer.tgt.abbrev} ({quickAnswer.tgt.offset}) ·
          {quickAnswer.tgt.diff}{quickAnswer.tgt.dayNote !== "same day" ? ` · ${quickAnswer.tgt.dayNote}` : ""}
        </p>
        {#if quickAnswer.others.length}
          <div class="flex flex-wrap gap-1.5 justify-center">
            {#each quickAnswer.others as o}
              <span class="bg-white/3 border border-white/8 px-2.5 py-1 rounded-lg text-[11px]">
                <span class="font-bold text-white/80">{o.label}</span>
                <span class="font-mono font-bold text-sky-400 ml-1.5">{o.time}</span>
                {#if o.dayNote !== "same day"}<span class="text-[9px] text-amber-300 ml-1">{o.dayNote}</span>{/if}
              </span>
            {/each}
          </div>
        {/if}
        {#each quickAnswer.notes as note}
          <p class="text-[9px] leading-relaxed text-amber-200/70 text-center">{note}</p>
        {/each}
        {#if answerClocks.length}
          <div class="flex flex-wrap gap-1.5 justify-center pt-1 border-t border-white/5">
            {#each answerClocks as clock}
              <button
                class="flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider text-sky-400 border border-sky-400/25 hover:bg-sky-400/10 px-2 py-1 rounded-full transition-colors cursor-pointer"
                onclick={() => addCity(clock, true)}
              >
                <Plus size={10} /> {clock.name} clock
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/if}

    <!-- Search Results dropdown -->
    {#if filteredCities.length > 0}
      <div
        class="absolute left-0 right-0 top-full mt-1.5 border border-white/10 bg-[#0c0c12] rounded-xl overflow-hidden z-30 max-h-48 overflow-y-auto shadow-2xl"
      >
        {#each filteredCities as city}
          <button
            class="w-full flex items-center justify-between text-left px-4 py-2 hover:bg-white/5 text-xs transition-colors"
            onclick={() => addCity(city)}
          >
            <div>
              <span class="font-bold text-white">{city.name}</span>
              <span class="text-white/40 text-[10px] ml-2">{city.country}</span>
            </div>
            <Plus size={14} class="text-sky-400" />
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Main Grid: Current tracked timezones -->
  <div
    class="flex-1 w-full overflow-y-auto border border-white/5 bg-black/15 rounded-2xl p-4 scroll-container relative min-h-[160px]"
  >
    {#if trackedCities.length === 0}
      <div
        class="absolute inset-0 flex flex-col items-center justify-center text-xs text-white/30 italic"
      >
        <Clock size={20} class="mb-1.5 text-white/10" />
        No cities tracked yet. Use the search bar above to add locations.
      </div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {#each trackedCities as city (clockKey(city))}
          <div
            class="city-card flex flex-col justify-between p-3.5 border border-white/5 bg-white/2 rounded-xl hover:border-white/10 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div>
                <h4 class="font-bold text-sm text-white">{city.name}</h4>
                <p class="text-[10px] text-white/40">{city.country}</p>
              </div>
              <button
                class="text-white/35 hover:text-red-400 p-1 transition-colors"
                onclick={() => removeCity(city)}
                aria-label={`Remove ${city.name}`}
              >
                <Trash2 size={13} />
              </button>
            </div>

            <div class="mt-4 flex flex-col">
              <span class="font-mono text-xl font-bold text-sky-400">
                {formatTimeInZone(currentTime, city.tz)}
              </span>
              <span class="text-[9px] text-white/45 mt-0.5">
                {formatDateInZone(currentTime, city.tz)}
                <span class="font-mono text-white/30 ml-1">{zoneTag(currentTime, city.tz)}</span>
              </span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Timezone Comparer Section -->
  {#if trackedCities.length > 0}
    <div class="border border-white/5 bg-black/25 p-4 rounded-2xl w-full">
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4"
      >
        <div>
          <h3 class="text-xs font-bold text-white uppercase tracking-wider">
            Timezone Comparer
          </h3>
          <p class="text-[10px] text-white/40 mt-0.5">
            Drag slider to test time conditions
          </p>
        </div>

        <!-- Base City Dropdown selector -->
        <div class="flex items-center gap-2 text-xs">
          <span class="text-white/45">Base Zone:</span>
          <select
            bind:value={selectedBaseCity}
            class="bg-white/5 border border-white/10 rounded px-2.5 py-1 text-white text-[11px] font-semibold outline-none cursor-pointer hover:bg-white/8"
            aria-label="Base city selector"
          >
            <option value="Local Time">Your Location (Local)</option>
            {#each trackedCities as city}
              <option value={city.tz}>{city.name}</option>
            {/each}
          </select>
        </div>
      </div>

      <!-- Comparison display sentence -->
      <div
        class="bg-white/2 border border-white/5 p-3 rounded-xl mb-4 text-center"
      >
        <p class="text-xs font-medium text-white">
          If it is
          <span class="text-sky-400 font-bold font-mono">
            {compareHour === 0
              ? "12:00 AM"
              : compareHour === 12
                ? "12:00 PM"
                : compareHour > 12
                  ? `${compareHour - 12}:00 PM`
                  : `${compareHour}:00 AM`}
          </span>
          in
          <span class="text-white underline decoration-sky-400/50 decoration-2">
            {selectedBaseCity === "Local Time"
              ? "your local timezone"
              : trackedCities.find((c) => c.tz === selectedBaseCity)?.name}
          </span>, then it is...
        </p>
      </div>

      <!-- Compare slider -->
      <div class="flex items-center gap-3 w-full mb-4">
        <span class="text-[10px] font-mono text-white/40">12 AM</span>
        <input
          type="range"
          min="0"
          max="23"
          bind:value={compareHour}
          class="flex-1 accent-sky-400 cursor-pointer h-1 rounded-lg bg-white/10"
          aria-label="Timezone compare slider"
        />
        <span class="text-[10px] font-mono text-white/40">11 PM</span>
      </div>

      <!-- Output values -->
      <div class="flex flex-wrap gap-2 justify-center">
        {#each trackedCities as city}
          {#if city.tz !== selectedBaseCity}
            {@const comp = getComparedTime(city.tz)}
            <div
              class="bg-white/3 border border-white/5 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs"
            >
              <span class="font-bold text-white/80">{city.name}:</span>
              <span class="font-mono text-sky-400 font-bold"
                >{comp.timeStr}</span
              >
              <span class="text-[9px] text-white/30">({comp.dateStr})</span>
            </div>
          {/if}
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .city-card {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
  }

  .scroll-container {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
  }
  .scroll-container::-webkit-scrollbar {
    width: 5px;
  }
  .scroll-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  select option {
    background: #0f0f15;
    color: white;
  }
</style>
