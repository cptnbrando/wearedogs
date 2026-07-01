<script>
  import { onMount } from "svelte";
  import {
    translations,
    langs,
    parseSpeakers,
    parseDogs,
    langDisplayName as getLangDisplayName,
    langEnglishName as getLangEnglishName,
    getFlagColors,
  } from "../lib/langUtils.js";
  import {
    ArrowLeft,
    Search,
    Globe,
    Scale,
    Timer,
    TrendingUp,
    Palette,
    ChevronRight,
    Info,
    HelpCircle,
  } from "lucide-svelte";
  import SwipeTabNav from "./SwipeTabNav.svelte";
  import WorldMap from "./WorldMap.svelte";
  import countryStats from "../lib/countryStats.json" with { type: "json" };

  let {
    isClosing = false,
    currentLang = $bindable(),
    onClose,
    onHoverLang,
    onSelectLang,
  } = $props();

  const userLocale =
    typeof navigator !== "undefined" ? navigator.language : "en";

  function langDisplayName(code) {
    return getLangDisplayName(code, userLocale);
  }

  function langEnglishName(code) {
    return getLangEnglishName(code);
  }

  // Active Tab state: 'explorer' | 'map' | 'comparison' | 'countdown' | 'speakers' | 'dogs' | 'themes'
  let activeTab = $state("explorer");

  // Search state for Language Explorer
  let searchQuery = $state("");

  // Sorting state for Language Explorer table
  let sortField = $state("name"); // 'name', 'country', 'speakersNum', 'dogsNum'
  let sortAscending = $state(true);

  // Pre-calculate language item objects once for efficiency
  const allLangItems = langs.map((code) => {
    const t = translations[code];
    const name = langEnglishName(code);
    const dispName = langDisplayName(code);

    return {
      code,
      name,
      displayName: dispName,
      country: t.country || "—",
      dialect: t.dialect || "—",
      speakersText: t.speakers || "—",
      speakersNum: parseSpeakers(t.speakers),
      dogsText: t.dogs_count || "—",
      dogsNum: parseDogs(t.dogs_count),
      we: t.we,
      are: t.are,
      dogs: t.dogs,
      colors: getFlagColors(code),
      humanCBR: t.humanCBR || 0,
      humanCDR: t.humanCDR || 0,
      dogCBR: t.dogCBR || 0,
      dogCDR: t.dogCDR || 0,
    };
  });

  // Total global metrics calculation
  const totalSpeakers = allLangItems.reduce(
    (acc, curr) => acc + curr.speakersNum,
    0,
  );
  const totalDogs = allLangItems.reduce((acc, curr) => acc + curr.dogsNum, 0);

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

  // Top 8 languages by speakers for the charts tab
  const topSpeakers = [...allLangItems]
    .filter((item) => item.speakersNum > 0)
    .sort((a, b) => b.speakersNum - a.speakersNum)
    .slice(0, 8);

  // Top 8 regions by dog populations for the dogs tab
  const topDogs = [...allLangItems]
    .filter((item) => item.dogsNum > 0)
    .sort((a, b) => b.dogsNum - a.dogsNum)
    .slice(0, 8);

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

  function toggleSort(field) {
    if (sortField === field) {
      sortAscending = !sortAscending;
    } else {
      sortField = field;
      sortAscending = true;
    }
  }

  // Active language detailed info card details
  let activeLangItem = $derived(
    allLangItems.find((item) => item.code === currentLang) || allLangItems[0],
  );

  // ---------------------------------------------------------------------------
  // Tab configuration
  // ---------------------------------------------------------------------------
  const statsTabs = [
    { id: "explorer", label: "Explorer", icon: Search },
    { id: "map", label: "World Map", icon: Globe },
    { id: "comparison", label: "Life & Death", icon: Scale },
    { id: "countdown", label: "69 Ticker", icon: Timer },
    { id: "speakers", label: "Speakers", icon: TrendingUp },
    { id: "dogs", label: "Local Dogs", icon: null },
    { id: "themes", label: "Palettes", icon: Palette },
  ];

  // ---------------------------------------------------------------------------
  // Map zoom and country highlighting mapping
  // ---------------------------------------------------------------------------
  const langToCountries = {
    en: ["us", "gb", "ca", "au", "nz"],
    es: ["es", "mx", "ar", "co", "pe", "ve", "cl", "ec", "bo", "py", "uy", "gt", "hn", "sv", "ni", "cr", "pa", "do", "cu"],
    fr: ["fr", "ca", "be", "ch", "sn", "ci", "cg", "cd", "cm", "mg", "ne", "ml", "bf", "tg", "bj", "ga", "dj", "gq", "cf", "km", "bi", "rw"],
    de: ["de", "at", "ch", "lu"],
    ja: ["jp"],
    zh: ["cn", "tw", "sg"],
    pt: ["pt", "br", "ao", "cv", "tl"],
    it: ["it", "ch"],
    ru: ["ru"],
    ko: ["kr", "kp"],
    hi: ["in"],
    ar: ["eg", "sa", "ae", "dz", "ma", "sd", "iq", "ye", "sy", "td", "tn", "ly", "jo", "er", "lb", "mr", "kw", "om", "qa", "bh", "dj", "km", "so", "ps"],
    bn: ["bd", "in"],
    pa: ["in", "pk"],
    jv: ["id"],
    ms: ["my", "bn", "sg"],
    id: ["id"],
    vi: ["vn"],
    th: ["th"],
    te: ["in"],
    mr: ["in"],
    ta: ["in", "lk", "sg"],
    gu: ["in"],
    kn: ["in"],
    ml: ["in"],
    or: ["in"],
    as: ["in"],
    ne: ["np", "in"],
    si: ["lk"],
    sd: ["pk", "in"],
    my: ["mm"],
    km: ["kh"],
    lo: ["la"],
    su: ["id"],
    ceb: ["ph"],
    tl: ["ph"],
    hmn: ["la", "vn", "cn", "th"]
  };

  let activeCountries = $derived(langToCountries[currentLang] || []);
  let activeColor = $derived(getFlagColors(currentLang)[0]);

  function findLangByCountry(countryId) {
    const code = countryId.toLowerCase();
    for (const [lang, countries] of Object.entries(langToCountries)) {
      if (countries.includes(code)) {
        return lang;
      }
    }
    return null;
  }

  function handleCountrySelect(countryId) {
    const lang = findLangByCountry(countryId);
    if (lang) {
      currentLang = lang;
      handleHover(lang);
    }
  }

  // ---------------------------------------------------------------------------
  // Comparison Tab Calculations and Logic
  // ---------------------------------------------------------------------------
  let compareSearchQuery = $state("");
  let compareA = $state("us");
  let compareB = $state("ca");

  function calculateTotalMortality(stats) {
    if (!stats) return 0;
    return Math.round(
      (stats.cancer +
        stats.old_age +
        stats.auto +
        stats.suicide +
        stats.gun_violence +
        stats.knife_violence +
        stats.police_brutality +
        stats.food_poisoning +
        stats.overdose_heroin +
        stats.overdose_meth +
        stats.overdose_cocaine +
        stats.overdose_alcohol) * 10
    ) / 10;
  }

  function calculateLifeExpectancy(stats) {
    if (!stats) return 75;
    const base = 75;
    const acBonus = (stats.ac_adoption / 100) * 3.5;
    const vacBonus = (stats.vaccines / 100) * 4.2;
    const hcBonus = (stats.gov_healthcare / 100) * 5.0;
    const totalMortality = calculateTotalMortality(stats);
    // Subtraction multiplier representing standard mortality index penalty
    const mortalityPenalty = totalMortality / 75;
    return Math.round((base + acBonus + vacBonus + hcBonus - mortalityPenalty) * 10) / 10;
  }

  // Quick comparison shortcuts
  function triggerQuickCompare(a, b) {
    compareA = a;
    compareB = b;
  }

  // Derived filtered country list for search/sort
  let compareFilteredCountries = $derived.by(() => {
    let list = Object.entries(countryStats).map(([code, stats]) => ({
      code,
      ...stats,
      totalMortality: calculateTotalMortality(stats),
      lifeExpectancy: calculateLifeExpectancy(stats)
    }));

    if (compareSearchQuery.trim() !== "") {
      const q = compareSearchQuery.toLowerCase().trim();
      list = list.filter(c => c.name.toLowerCase().includes(q));
    }

    return list;
  });

  // ---------------------------------------------------------------------------
  // Live ticking 69 countdown ticker logic
  // ---------------------------------------------------------------------------
  const TIME_LOCK = new Date("2026-06-21T18:28:24Z").getTime();
  const HUMAN_GROWTH_FACTOR_2026 = 1.031;
  const DOG_GROWTH_FACTOR_2026 = 1.052;
  let elapsedSeconds = $state((Date.now() - TIME_LOCK) / 1000);

  $effect(() => {
    let animFrame;
    const update = () => {
      elapsedSeconds = (Date.now() - TIME_LOCK) / 1000;
      animFrame = requestAnimationFrame(update);
    };
    animFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animFrame);
  });

  // Calculate live values for a country
  function getLivePopulation(code, type = "human") {
    // Map country code back to a primary language entry in translations
    let lang = "en";
    for (const [l, countries] of Object.entries(langToCountries)) {
      if (countries.includes(code)) {
        lang = l;
        break;
      }
    }

    const t = translations[lang] || translations.en;
    const basePop = type === "human"
      ? parseSpeakers(t.speakers) * HUMAN_GROWTH_FACTOR_2026
      : parseDogs(t.dogs_count) * DOG_GROWTH_FACTOR_2026;

    const cbr = type === "human" ? (t.humanCBR || 11) : (t.dogCBR || 93);
    const cdr = type === "human" ? (t.humanCDR || 8.8) : (t.dogCDR || 91);
    const netRatePerYear = (cbr - cdr) / 1000; // net growth rate
    // Calculate growth rate per second
    const ratePerSecond = (basePop * netRatePerYear) / (365.25 * 24 * 3600);

    const liveVal = Math.max(10, basePop + elapsedSeconds * ratePerSecond);
    return {
      value: Math.floor(liveVal),
      rate: ratePerSecond
    };
  }

  function getCountdown(liveVal, ratePerSec) {
    if (Math.abs(ratePerSec) < 0.000001) {
      return { target: "—", minutes: 0, seconds: 0, rawSeconds: Infinity };
    }

    let target;
    if (ratePerSec > 0) {
      target = Math.ceil((liveVal - 69) / 100) * 100 + 69;
      if (target <= liveVal) target += 100;
    } else {
      target = Math.floor((liveVal - 69) / 100) * 100 + 69;
      if (target >= liveVal) target -= 100;
    }

    const diff = target - liveVal;
    const rawSeconds = diff / ratePerSec;
    const mins = Math.floor(rawSeconds / 60);
    const secs = rawSeconds % 60;

    return {
      target,
      minutes: mins,
      seconds: secs,
      rawSeconds
    };
  }

  // Active country for ticker
  let tickerCountryCode = $state("us");
  let liveHuman = $derived(getLivePopulation(tickerCountryCode, "human"));
  let liveDog = $derived(getLivePopulation(tickerCountryCode, "dog"));

  let humanCountdown = $derived(getCountdown(liveHuman.value, liveHuman.rate));
  let dogCountdown = $derived(getCountdown(liveDog.value, liveDog.rate));

  // Ticker countries options (only those in countryStats)
  const tickerOptions = Object.entries(countryStats).map(([code, data]) => ({
    code,
    name: data.name
  }));
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="stats-panel-backdrop" onclick={onClose}>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="stats-panel-container flex flex-col h-[90vh] w-[94vw] max-w-[1280px] max-h-[850px] bg-black/45 border border-white/5 rounded-[20px] overflow-hidden backdrop-blur-xl transition-all duration-300"
    class:closing={isClosing}
    onclick={(e) => e.stopPropagation()}
  >
    <!-- Header -->
    <header class="panel-header px-6 py-4 flex items-center justify-between border-b border-white/5 bg-black/20 shrink-0">
      <div class="brand flex items-center gap-3">
        <img
          src="/favicon.svg"
          alt="DOGS Logo"
          class="w-6 h-6 shrink-0 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
        />
        <h1 class="text-lg font-bold tracking-widest text-white/95 uppercase font-sans">DEMOGRAPHICS</h1>
      </div>

      <button class="close-btn p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all" onclick={onClose} aria-label="Close panel">
        <ArrowLeft size={20} />
      </button>
    </header>

    <!-- Unified top swipeable tab nav component -->
    <SwipeTabNav tabs={statsTabs} bind:activeTab={activeTab} />

    <!-- Inner Window Body (Full width, scroll container) -->
    <div class="panel-body flex-1 min-h-0 flex flex-col md:flex-row relative">
      <!-- Content Area -->
      <main class="panel-content-pane flex-1 p-6 md:p-8 overflow-y-auto scroll-container bg-black/10">
        
        <!-- 1. EXPLORER VIEW -->
        {#if activeTab === "explorer"}
          <div class="tab-pane animated-pane flex flex-col gap-6">
            <div class="explorer-toolbar flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
              <div class="search-box relative flex-1 max-w-[400px]">
                <Search size={16} class="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="Search languages, countries, codes..."
                  bind:value={searchQuery}
                  class="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/5 rounded-xl text-white text-sm outline-none focus:border-white/20 focus:bg-black/60 transition-all"
                />
                {#if searchQuery}
                  <button
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-lg font-bold"
                    onclick={() => (searchQuery = "")}>&times;</button
                  >
                {/if}
              </div>
              <div class="results-count text-xs font-semibold text-white/40">
                Showing {filteredLangs.length} of {langs.length} locales
              </div>
            </div>

            <!-- Table Wrapper (Desktop/Tablet) -->
            <div class="table-wrapper hidden md:block border border-white/5 rounded-xl overflow-hidden bg-black/25">
              <table class="explorer-table w-full text-left border-collapse text-sm">
                <thead>
                  <tr class="bg-white/[0.02] border-b border-white/5">
                    <th onclick={() => toggleSort("name")} class="p-3.5 pl-5 font-semibold text-xs text-white/40 uppercase tracking-wider cursor-pointer hover:bg-white/5 hover:text-white transition-all select-none">
                      Language {sortField === "name" ? (sortAscending ? "▲" : "▼") : ""}
                    </th>
                    <th onclick={() => toggleSort("country")} class="p-3.5 font-semibold text-xs text-white/40 uppercase tracking-wider cursor-pointer hover:bg-white/5 hover:text-white transition-all select-none">
                      Primary Country / Region {sortField === "country" ? (sortAscending ? "▲" : "▼") : ""}
                    </th>
                    <th class="p-3.5 font-semibold text-xs text-white/40 uppercase tracking-wider select-none">Dialect</th>
                    <th onclick={() => toggleSort("speakersNum")} class="p-3.5 font-semibold text-xs text-white/40 uppercase tracking-wider cursor-pointer hover:bg-white/5 hover:text-white transition-all select-none text-right">
                      Speakers {sortField === "speakersNum" ? (sortAscending ? "▲" : "▼") : ""}
                    </th>
                    <th onclick={() => toggleSort("dogsNum")} class="p-3.5 font-semibold text-xs text-white/40 uppercase tracking-wider cursor-pointer hover:bg-white/5 hover:text-white transition-all select-none text-right pr-5">
                      Dogs {sortField === "dogsNum" ? (sortAscending ? "▲" : "▼") : ""}
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
                            <span class="font-semibold text-white/95">{item.displayName}</span>
                            <span class="text-[10px] text-white/30 uppercase tracking-widest">{item.code}</span>
                          </div>
                        </div>
                      </td>
                      <td class="p-3.5 text-white/70">{item.country}</td>
                      <td class="p-3.5 text-white/50">{item.dialect}</td>
                      <td class="p-3.5 text-right font-mono text-white/70">{item.speakersText}</td>
                      <td class="p-3.5 text-right font-mono text-white/70 pr-5">{item.dogsText}</td>
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
                      <span class="w-2.5 h-6 rounded border border-white/10" style="background: {item.colors[0]}"></span>
                      <div class="flex flex-col">
                        <span class="font-bold text-white">{item.displayName}</span>
                        <span class="text-[9px] text-white/40 tracking-wider uppercase font-mono">{item.code}</span>
                      </div>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3 text-xs border-t border-white/5 pt-3">
                    <div class="flex flex-col gap-0.5">
                      <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Region</span>
                      <span class="text-white/70 font-medium truncate">{item.country}</span>
                    </div>
                    <div class="flex flex-col gap-0.5">
                      <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Dialect</span>
                      <span class="text-white/70 font-medium truncate">{item.dialect || "—"}</span>
                    </div>
                    <div class="flex flex-col gap-0.5">
                      <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Speakers</span>
                      <span class="text-white/70 font-mono">{item.speakersText}</span>
                    </div>
                    <div class="flex flex-col gap-0.5">
                      <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Local Dogs</span>
                      <span class="text-white/70 font-mono">{item.dogsText}</span>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- 2. WORLD MAP VIEW -->
        {#if activeTab === "map"}
          <div class="tab-pane animated-pane flex flex-col gap-5 h-full">
            <div class="map-view-header">
              <h2 class="text-base font-bold text-white uppercase tracking-wider">Interactive Vector World Map</h2>
              <p class="text-xs text-white/50 mt-1">
                Currently highlighting target countries for: <span class="font-bold text-white" style="color: {activeColor}">{activeLangItem.displayName}</span>. 
                Hover over the map or click any country to inspect demographics dynamically.
              </p>
            </div>
            
            <div class="flex-1 min-h-[380px] w-full">
              <WorldMap
                activeCountries={activeCountries}
                highlightColor={activeColor}
                onCountrySelect={handleCountrySelect}
              />
            </div>
          </div>
        {/if}

        <!-- 3. LIFE & DEATH ANALYTICS AND COMPARISON -->
        {#if activeTab === "comparison"}
          <div class="tab-pane animated-pane flex flex-col gap-6">
            
            <!-- Intro comparison section -->
            <div class="comparison-header">
              <h2 class="text-base font-bold text-white uppercase tracking-wider">Life & Death Demographics Comparative Matrix</h2>
              <p class="text-xs text-white/50 mt-1">
                Compare health metrics, violence coefficients, drug overdoses, and calculations that derive final life expectancies between nations.
              </p>
            </div>

            <!-- Quick Compare Links -->
            <div class="quick-comparisons bg-white/[0.02] border border-white/5 p-4 rounded-xl">
              <h4 class="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Quick Compare Shortcuts</h4>
              <div class="flex flex-wrap gap-2.5">
                <button class="px-3 py-1.5 bg-black/40 border border-white/5 hover:border-white/25 rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-all cursor-pointer" onclick={() => triggerQuickCompare("ca", "au")}>
                  🔫 Gun Violence: Canada vs Australia
                </button>
                <button class="px-3 py-1.5 bg-black/40 border border-white/5 hover:border-white/25 rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-all cursor-pointer" onclick={() => triggerQuickCompare("mx", "nz")}>
                  👮 Police Brutality: Mexico vs New Zealand
                </button>
                <button class="px-3 py-1.5 bg-black/40 border border-white/5 hover:border-white/25 rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-all cursor-pointer" onclick={() => triggerQuickCompare("us", "jp")}>
                  💊 Heroin & Overdoses: USA vs Japan
                </button>
                <button class="px-3 py-1.5 bg-black/40 border border-white/5 hover:border-white/25 rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-all cursor-pointer" onclick={() => triggerQuickCompare("th", "gb")}>
                  🚗 Road Safety: Thailand vs UK
                </button>
              </div>
            </div>

            <!-- Side by Side Comparative Widget -->
            <div id="comparison-results" class="comparison-grid grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
              <!-- Left selection card -->
              <div class="compare-card p-5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-4 relative">
                <div class="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 class="text-sm font-bold text-white/40 uppercase tracking-wider">Country A</h3>
                  <select bind:value={compareA} class="bg-black/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white outline-none cursor-pointer">
                    {#each Object.entries(countryStats) as [code, data]}
                      <option value={code}>{data.name}</option>
                    {/each}
                  </select>
                </div>
                
                {#if countryStats[compareA]}
                  {@const stats = countryStats[compareA]}
                  {@const life = calculateLifeExpectancy(stats)}
                  {@const deaths = calculateTotalMortality(stats)}
                  <div class="stats-overview flex justify-between items-center bg-black/30 p-4 rounded-lg">
                    <div class="flex flex-col">
                      <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Life Expectancy</span>
                      <span class="text-xl font-bold text-green-400 font-mono">{life} years</span>
                    </div>
                    <div class="flex flex-col text-right">
                      <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Total Deaths (per 100k)</span>
                      <span class="text-xl font-bold text-red-400 font-mono">{deaths}</span>
                    </div>
                  </div>

                  <div class="metrics-list flex flex-col gap-2.5 text-xs text-white/70">
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Cancer Rate</span><span class="font-mono font-medium">{stats.cancer}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Old Age / Cardiovascular</span><span class="font-mono font-medium">{stats.old_age}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Automobile Accidents</span><span class="font-mono font-medium" class:text-orange-400={stats.auto > 15}>{stats.auto}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Suicide Rate</span><span class="font-mono font-medium">{stats.suicide}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Gun Violence</span><span class="font-mono font-medium" class:text-red-400={stats.gun_violence > 5}>{stats.gun_violence}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Knife Violence</span><span class="font-mono font-medium">{stats.knife_violence}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Police Brutality</span><span class="font-mono font-medium" class:text-red-400={stats.police_brutality > 1}>{stats.police_brutality}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Food Poisoning</span><span class="font-mono font-medium">{stats.food_poisoning}</span></div>
                    <div class="p-3 bg-black/20 rounded-lg flex flex-col gap-1.5">
                      <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Drug Overdoses Detail (per 100k)</span>
                      <div class="grid grid-cols-2 gap-2 text-[11px]">
                        <div><span class="text-white/40 mr-1">Heroin:</span> <strong class="font-mono text-white/90">{stats.overdose_heroin}</strong></div>
                        <div><span class="text-white/40 mr-1">Meth:</span> <strong class="font-mono text-white/90">{stats.overdose_meth}</strong></div>
                        <div><span class="text-white/40 mr-1">Cocaine:</span> <strong class="font-mono text-white/90">{stats.overdose_cocaine}</strong></div>
                        <div><span class="text-white/40 mr-1">Alcohol:</span> <strong class="font-mono text-white/90">{stats.overdose_alcohol}</strong></div>
                      </div>
                    </div>
                    <div class="p-3 bg-black/20 rounded-lg flex flex-col gap-1.5">
                      <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Life Expectancy Drivers</span>
                      <div class="grid grid-cols-3 gap-2 text-[10px] text-center">
                        <div class="bg-black/30 p-1.5 rounded"><span class="block text-white/30">A/C Adoption</span><strong class="font-mono text-green-400">{stats.ac_adoption}%</strong></div>
                        <div class="bg-black/30 p-1.5 rounded"><span class="block text-white/30">Vaccination</span><strong class="font-mono text-green-400">{stats.vaccines}%</strong></div>
                        <div class="bg-black/30 p-1.5 rounded"><span class="block text-white/30">Gov Healthcare</span><strong class="font-mono text-green-400">{stats.gov_healthcare}/100</strong></div>
                      </div>
                    </div>
                  </div>
                {/if}
              </div>

              <!-- Right selection card -->
              <div class="compare-card p-5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-4 relative">
                <div class="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 class="text-sm font-bold text-white/40 uppercase tracking-wider">Country B</h3>
                  <select bind:value={compareB} class="bg-black/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white outline-none cursor-pointer">
                    {#each Object.entries(countryStats) as [code, data]}
                      <option value={code}>{data.name}</option>
                    {/each}
                  </select>
                </div>
                
                {#if countryStats[compareB]}
                  {@const stats = countryStats[compareB]}
                  {@const life = calculateLifeExpectancy(stats)}
                  {@const deaths = calculateTotalMortality(stats)}
                  <div class="stats-overview flex justify-between items-center bg-black/30 p-4 rounded-lg">
                    <div class="flex flex-col">
                      <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Life Expectancy</span>
                      <span class="text-xl font-bold text-green-400 font-mono">{life} years</span>
                    </div>
                    <div class="flex flex-col text-right">
                      <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Total Deaths (per 100k)</span>
                      <span class="text-xl font-bold text-red-400 font-mono">{deaths}</span>
                    </div>
                  </div>

                  <div class="metrics-list flex flex-col gap-2.5 text-xs text-white/70">
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Cancer Rate</span><span class="font-mono font-medium">{stats.cancer}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Old Age / Cardiovascular</span><span class="font-mono font-medium">{stats.old_age}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Automobile Accidents</span><span class="font-mono font-medium" class:text-orange-400={stats.auto > 15}>{stats.auto}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Suicide Rate</span><span class="font-mono font-medium">{stats.suicide}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Gun Violence</span><span class="font-mono font-medium" class:text-red-400={stats.gun_violence > 5}>{stats.gun_violence}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Knife Violence</span><span class="font-mono font-medium">{stats.knife_violence}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Police Brutality</span><span class="font-mono font-medium" class:text-red-400={stats.police_brutality > 1}>{stats.police_brutality}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Food Poisoning</span><span class="font-mono font-medium">{stats.food_poisoning}</span></div>
                    <div class="p-3 bg-black/20 rounded-lg flex flex-col gap-1.5">
                      <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Drug Overdoses Detail (per 100k)</span>
                      <div class="grid grid-cols-2 gap-2 text-[11px]">
                        <div><span class="text-white/40 mr-1">Heroin:</span> <strong class="font-mono text-white/90">{stats.overdose_heroin}</strong></div>
                        <div><span class="text-white/40 mr-1">Meth:</span> <strong class="font-mono text-white/90">{stats.overdose_meth}</strong></div>
                        <div><span class="text-white/40 mr-1">Cocaine:</span> <strong class="font-mono text-white/90">{stats.overdose_cocaine}</strong></div>
                        <div><span class="text-white/40 mr-1">Alcohol:</span> <strong class="font-mono text-white/90">{stats.overdose_alcohol}</strong></div>
                      </div>
                    </div>
                    <div class="p-3 bg-black/20 rounded-lg flex flex-col gap-1.5">
                      <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Life Expectancy Drivers</span>
                      <div class="grid grid-cols-3 gap-2 text-[10px] text-center">
                        <div class="bg-black/30 p-1.5 rounded"><span class="block text-white/30">A/C Adoption</span><strong class="font-mono text-green-400">{stats.ac_adoption}%</strong></div>
                        <div class="bg-black/30 p-1.5 rounded"><span class="block text-white/30">Vaccination</span><strong class="font-mono text-green-400">{stats.vaccines}%</strong></div>
                        <div class="bg-black/30 p-1.5 rounded"><span class="block text-white/30">Gov Healthcare</span><strong class="font-mono text-green-400">{stats.gov_healthcare}/100</strong></div>
                      </div>
                    </div>
                  </div>
                {/if}
              </div>
            </div>

            <!-- Full index lookup table -->
            <div class="country-search mt-4">
              <div class="flex justify-between items-center gap-4 mb-4">
                <h3 class="text-sm font-bold text-white uppercase tracking-wider">Search Country Index</h3>
                <input
                  type="text"
                  placeholder="Filter country table..."
                  bind:value={compareSearchQuery}
                  class="max-w-[300px] px-3.5 py-1.5 bg-black/40 border border-white/5 rounded-lg text-xs outline-none focus:border-white/20 transition-all"
                />
              </div>
              <div class="table-wrapper border border-white/5 rounded-xl overflow-x-auto bg-black/20 max-h-[350px] scroll-y">
                <table class="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr class="bg-white/[0.02] border-b border-white/5 sticky top-0 backdrop-blur">
                      <th class="p-3 pl-4 font-bold text-white/40 uppercase">Country</th>
                      <th class="p-3 font-bold text-white/40 uppercase text-center">Life Expectancy</th>
                      <th class="p-3 font-bold text-white/40 uppercase text-center">Total CDR</th>
                      <th class="p-3 font-bold text-white/40 uppercase text-center">Heroin</th>
                      <th class="p-3 font-bold text-white/40 uppercase text-center">Meth</th>
                      <th class="p-3 font-bold text-white/40 uppercase text-center">Cocaine</th>
                      <th class="p-3 font-bold text-white/40 uppercase text-center">Alcohol</th>
                      <th class="p-3 font-bold text-white/40 uppercase text-center">Auto</th>
                      <th class="p-3 font-bold text-white/40 uppercase text-center">Gun</th>
                      <th class="p-3 font-bold text-white/40 uppercase text-center">Police</th>
                      <th class="p-3 font-bold text-white/40 uppercase text-center">A/C (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each compareFilteredCountries as c}
                      <tr class="border-b border-white/[0.02] hover:bg-white/[0.02] transition-all">
                        <td class="p-3 pl-4 font-semibold text-white/90">{c.name}</td>
                        <td class="p-3 text-center text-green-400 font-mono font-semibold">{c.lifeExpectancy}</td>
                        <td class="p-3 text-center text-red-400 font-mono">{c.totalMortality}</td>
                        <td class="p-3 text-center font-mono">{c.overdose_heroin}</td>
                        <td class="p-3 text-center font-mono">{c.overdose_meth}</td>
                        <td class="p-3 text-center font-mono">{c.overdose_cocaine}</td>
                        <td class="p-3 text-center font-mono">{c.overdose_alcohol}</td>
                        <td class="p-3 text-center font-mono">{c.auto}</td>
                        <td class="p-3 text-center font-mono">{c.gun_violence}</td>
                        <td class="p-3 text-center font-mono">{c.police_brutality}</td>
                        <td class="p-3 text-center font-mono text-green-400/80">{c.ac_adoption}%</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        {/if}

        <!-- 4. LIVE 69 TICKING COUNTDOWN TICKER -->
        {#if activeTab === "countdown"}
          <div class="tab-pane animated-pane flex flex-col gap-6">
            <div class="countdown-header">
              <h2 class="text-base font-bold text-white uppercase tracking-wider">Ticking Population Countdown Ticker (ends in 69)</h2>
              <p class="text-xs text-white/50 mt-1">
                Real-time mathematical prediction of when human and canine populations will hit coordinates ending exactly in the string "69".
              </p>
            </div>

            <!-- Target selection -->
            <div class="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
              <span class="text-xs font-semibold text-white/40 uppercase tracking-wider">Selected Country:</span>
              <select bind:value={tickerCountryCode} class="bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white outline-none cursor-pointer">
                {#each tickerOptions as opt}
                  <option value={opt.code}>{opt.name}</option>
                {/each}
              </select>
            </div>

            <!-- Countdown Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Human Counter Card -->
              <div class="p-5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-4">
                <div class="flex justify-between items-center">
                  <h3 class="text-xs font-bold text-white/40 uppercase tracking-wider">Human Population Ticker</h3>
                  <span class="px-2 py-0.5 bg-white/5 text-[9px] font-bold text-white/60 rounded">TICKING LIVE</span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-2xl font-bold font-mono tracking-wider text-white select-all">
                    {liveHuman.value.toLocaleString()}
                  </span>
                  <span class="text-[10px] text-white/30 font-semibold uppercase">
                    Growth: {liveHuman.rate >= 0 ? "+" : ""}{liveHuman.rate.toFixed(4)} / sec
                  </span>
                </div>
                <div class="p-4 bg-black/30 rounded-lg border border-white/5 flex flex-col gap-2">
                  <span class="text-[9px] font-bold uppercase tracking-widest text-orange-400">Countdown to Next 69 Target</span>
                  <div class="text-sm font-semibold text-white">
                    Target: <span class="font-mono text-orange-400 font-bold">{humanCountdown.target}</span>
                  </div>
                  <div class="text-xs text-white/70">
                    Remaining: <span class="font-mono text-orange-400 font-bold">{humanCountdown.minutes} mins {humanCountdown.seconds.toFixed(2)} secs</span>
                  </div>
                </div>
              </div>

              <!-- Dog Counter Card -->
              <div class="p-5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-4">
                <div class="flex justify-between items-center">
                  <h3 class="text-xs font-bold text-white/40 uppercase tracking-wider">Dog Population Ticker</h3>
                  <span class="px-2 py-0.5 bg-white/5 text-[9px] font-bold text-white/60 rounded">TICKING LIVE</span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-2xl font-bold font-mono tracking-wider text-white select-all">
                    {liveDog.value.toLocaleString()}
                  </span>
                  <span class="text-[10px] text-white/30 font-semibold uppercase">
                    Growth: {liveDog.rate >= 0 ? "+" : ""}{liveDog.rate.toFixed(4)} / sec
                  </span>
                </div>
                <div class="p-4 bg-black/30 rounded-lg border border-white/5 flex flex-col gap-2">
                  <span class="text-[9px] font-bold uppercase tracking-widest text-orange-400">Countdown to Next 69 Target</span>
                  <div class="text-sm font-semibold text-white">
                    Target: <span class="font-mono text-orange-400 font-bold">{dogCountdown.target}</span>
                  </div>
                  <div class="text-xs text-white/70">
                    Remaining: <span class="font-mono text-orange-400 font-bold">{dogCountdown.minutes} mins {dogCountdown.seconds.toFixed(2)} secs</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mathematical explainer box -->
            <div class="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex gap-3 text-xs text-white/60 leading-relaxed mt-2">
              <Info size={18} class="shrink-0 text-white/40 mt-0.5" />
              <div>
                <strong class="text-white">Algorithmic Countdown Details:</strong> Calculating using CBR/CDR ratios mapped directly to standard birth rates per country. Shrinking populations (like Japan) anticipate target bounds decreasing sequentially to reach values ending in 69.
              </div>
            </div>
          </div>
        {/if}

        <!-- 5. SPEAKERS ANALYTICS -->
        {#if activeTab === "speakers"}
          <div class="tab-pane animated-pane">
            <h2 class="text-base font-bold text-white uppercase tracking-wider">Speakers Distribution</h2>
            <p class="description text-xs text-white/50 mt-1 mb-6">
              A breakdown of the top cataloged languages by approximate speaker counts worldwide.
            </p>

            <div class="speakers-chart-container flex flex-col gap-4 mb-8">
              {#each topSpeakers as item}
                <div class="chart-row flex flex-col gap-1.5">
                  <div class="chart-row-lbl flex justify-between text-xs font-semibold">
                    <span class="chart-lang-name text-white/90">{item.displayName}</span>
                    <span class="chart-lang-val font-mono text-white/40">{item.speakersText}</span>
                  </div>
                  <div class="chart-bar-outer h-2 w-full bg-white/[0.02] rounded-full overflow-hidden">
                    <div
                      class="chart-bar-inner h-full rounded-full transition-all duration-1000 ease-out"
                      style="width: {(item.speakersNum / topSpeakers[0].speakersNum) * 100}%; background: linear-gradient(90deg, {item.colors[0]}, {item.colors[1] || item.colors[0]})"
                    ></div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- 6. DOG POPULATIONS -->
        {#if activeTab === "dogs"}
          <div class="tab-pane animated-pane">
            <h2 class="text-base font-bold text-white uppercase tracking-wider">Dog Populations by Region</h2>
            <p class="description text-xs text-white/50 mt-1 mb-6">
              Analysis of domestic dog populations estimated within the primary geographic regions of each language.
            </p>

            <div class="speakers-chart-container flex flex-col gap-4 mb-8">
              {#each topDogs as item}
                <div class="chart-row flex flex-col gap-1.5">
                  <div class="chart-row-lbl flex justify-between text-xs font-semibold">
                    <span class="chart-lang-name text-white/90">{item.displayName} ({item.country.split("&")[0].trim()})</span>
                    <span class="chart-lang-val font-mono text-white/40">{item.dogsText}</span>
                  </div>
                  <div class="chart-bar-outer h-2 w-full bg-white/[0.02] rounded-full overflow-hidden">
                    <div
                      class="chart-bar-inner h-full rounded-full transition-all duration-1000 ease-out"
                      style="width: {(item.dogsNum / topDogs[0].dogsNum) * 100}%; background: linear-gradient(90deg, {item.colors[1] || item.colors[0]}, {item.colors[2] || item.colors[0]})"
                    ></div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- 7. PALETTES EXPLORER -->
        {#if activeTab === "themes"}
          <div class="tab-pane animated-pane">
            <h2 class="text-base font-bold text-white uppercase tracking-wider">Flag Color Palettes</h2>
            <p class="description text-xs text-white/50 mt-1 mb-6">
              Each language features a signature tri-color gradient sweep based on national flags or HSL hash values.
            </p>

            <div class="palettes-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {#each allLangItems.slice(0, 36) as item}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  class="palette-card p-2 bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.06] rounded-xl cursor-pointer hover:-translate-y-0.5 transition-all duration-300"
                  onclick={() => handleSelect(item.code)}
                >
                  <div class="palette-swatch-box h-12 rounded-lg overflow-hidden flex border border-white/10">
                    <div class="flex-grow" style="background: {item.colors[0]}"></div>
                    <div class="flex-grow" style="background: {item.colors[1]}"></div>
                    <div class="flex-grow" style="background: {item.colors[2]}"></div>
                  </div>
                  <div class="palette-card-meta flex flex-col mt-2 px-1">
                    <span class="p-name text-xs font-bold text-white/85 truncate">{item.displayName}</span>
                    <span class="p-code text-[9px] uppercase tracking-wider font-mono text-white/30">{item.code}</span>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Mandatory Explanation and Copy for Demographics tab/explorer section -->
        <div class="expandable-explanation-card bg-white/[0.02] border border-white/5 p-4 rounded-xl flex gap-3 text-xs text-white/60 leading-relaxed mt-6">
          <HelpCircle size={18} class="shrink-0 text-white/40 mt-0.5" />
          <div class="flex flex-col gap-1.5">
            <span class="font-bold text-white">L1 Linguistic Demographics Data Methodologies</span>
            <p>
              All statistics correspond to native birth L1 language speaker distributions (learning native tongue first in home environments) and represent a 1-to-1 reflection of current physical residents within that country.
            </p>
            <p class="font-bold text-white/90">
              "Population is people and this is a people world worldwide dogs."
            </p>
          </div>
        </div>
      </main>

      <!-- Sidebar selection overlay display (Visible on desktop only) -->
      <div class="sidebar-selection-pane hidden xl:flex flex-col w-[280px] p-6 border-l border-white/5 bg-black/10 shrink-0 select-none">
        <div class="current-selection-card mt-auto bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col gap-4">
          <div class="card-head flex flex-col">
            <span class="card-tag text-[8px] font-bold text-white/30 tracking-widest uppercase">ACTIVE LOCALE</span>
            <h3 class="text-sm font-bold text-white mt-0.5">{activeLangItem.displayName}</h3>
          </div>
          <div class="color-track h-1 flex border border-white/10 rounded-full overflow-hidden">
            <span class="flex-1" style="background: {activeLangItem.colors[0]}"></span>
            <span class="flex-1" style="background: {activeLangItem.colors[1]}"></span>
            <span class="flex-1" style="background: {activeLangItem.colors[2]}"></span>
          </div>
          <div class="translation-preview text-xs text-white/50 font-medium italic leading-relaxed">
            "{activeLangItem.we} {activeLangItem.are} {activeLangItem.dogs}"
          </div>
        </div>
      </div>
    </div>

    <!-- Footer / Status Bar -->
    <footer class="panel-footer px-6 h-10 border-t border-white/5 bg-black/30 flex items-center justify-between shrink-0 text-[10px] text-white/30 tracking-wider">
      <div class="sys-status flex items-center gap-2 font-mono">
        <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
        <span>WE ARE DOGS STATUS: NOMINAL</span>
      </div>
      <div class="stats-counter flex items-center gap-3 font-mono">
        <span>AUTHOR: CAPTAIN BRANDO!</span>
      </div>
    </footer>
  </div>
</div>

<style>
  /* ── Backdrop ── */
  .stats-panel-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  /* ── Container slide-up entry animations ── */
  .stats-panel-container {
    animation: panelSlideUpIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transform-origin: center bottom;
  }

  .stats-panel-container.closing {
    animation: panelSlideUpDown 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes panelSlideUpIn {
    0% {
      opacity: 0;
      transform: translateY(30px) scale(0.97);
      backdrop-filter: blur(0px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      backdrop-filter: blur(15px) saturate(160%);
    }
  }

  @keyframes panelSlideUpDown {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
      backdrop-filter: blur(15px) saturate(160%);
    }
    100% {
      opacity: 0;
      transform: translateY(20px) scale(0.97);
      backdrop-filter: blur(0px);
    }
  }

  /* ── Animated Tab Fade-In ── */
  .animated-pane {
    animation: paneFadeIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes paneFadeIn {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Table styling */
  .active-row td {
    background: rgba(255, 255, 255, 0.06);
    color: white !important;
  }

  /* 69 ticker specific card scaling */
  .active-mobile {
    border-color: var(--brand-color);
    background: rgba(255, 255, 255, 0.05);
  }
</style>
