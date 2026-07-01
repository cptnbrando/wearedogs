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
    TrendingUp,
    Palette,
    ChevronRight,
    Info,
    HelpCircle,
  } from "lucide-svelte";
  import SwipeTabNav from "./SwipeTabNav.svelte";
  import WorldMap from "./WorldMap.svelte";
  import countryStats from "../lib/countryStats.js";

  let {
    isClosing = false,
    currentLang = $bindable(),
    onClose,
    onHoverLang,
    onSelectLang,
  } = $props();

  let activeTab = $state("explorer");

  const userLocale =
    typeof navigator !== "undefined" ? navigator.language : "en";

  function langDisplayName(code) {
    return getLangDisplayName(code, userLocale);
  }

  // Pre-calculate language item objects once for efficiency
  const allLangItems = langs.map((code) => {
    const t = translations[code];
    const name = getLangEnglishName(code);
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

  // ---------------------------------------------------------------------------
  // Demographics Database Access
  // ---------------------------------------------------------------------------
  let enrichedCountryStats = countryStats;

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
    { id: "speakers", label: "Speakers", icon: TrendingUp },
    { id: "dogs", label: "Local Dogs", icon: null },
    { id: "themes", label: "Palettes", icon: Palette },
  ];

  // ---------------------------------------------------------------------------
  // Map country selection mapping
  // ---------------------------------------------------------------------------
  const langToCountries = {
    en: [
      "us", "gb", "ca", "au", "nz", "ie", "za", "ke", "ug", "tz", "ng", "gh", "lr", "sl", "jm", "bs", "fk", "pr", 
      "zw", "zm", "mw", "na", "ls", "sz", "bw", "gy", "pg", "fj", "vu", "sb", "fm", "mt", "cy", "ss"
    ],
    es: ["es", "mx", "ar", "co", "pe", "ve", "cl", "ec", "bo", "py", "uy", "gt", "hn", "sv", "ni", "cr", "pa", "do", "cu", "gq", "pr"],
    fr: [
      "fr", "ca", "be", "ch", "sn", "ci", "cg", "cd", "cm", "mg", "ne", "ml", "bf", "tg", "bj", "ga", "dj", "gq", "cf", 
      "km", "bi", "rw", "gf", "ht", "gn", "td", "mr"
    ],
    de: ["de", "at", "ch", "lu"],
    ja: ["jp"],
    zh: ["cn", "tw", "sg"],
    pt: ["pt", "br", "ao", "cv", "tl", "mz", "gw", "st"],
    it: ["it", "ch"],
    ru: ["ru"],
    ko: ["kr", "kp"],
    hi: ["in"],
    ar: [
      "eg", "sa", "ae", "dz", "ma", "sd", "iq", "ye", "sy", "td", "tn", "ly", "jo", "er", "lb", "mr", "kw", "om", "qa", 
      "bh", "so", "ps", "dj", "km", "eh"
    ],
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
    hmn: ["la", "vn", "cn", "th"],
    sv: ["se"],
    no: ["no"],
    da: ["dk", "gl"],
    fi: ["fi"],
    is: ["is"],
    pl: ["pl"],
    nl: ["nl", "sr"],
    ga: ["ie"],
    dz: ["bt"],
    uk: ["ua"],
    be: ["by"],
    cs: ["cz"],
    sk: ["sk"],
    hu: ["hu"],
    ro: ["ro", "md"],
    bg: ["bg"],
    hr: ["hr"],
    sr: ["rs", "me"],
    sl: ["si"],
    bs: ["ba"],
    sq: ["al"],
    mk: ["mk"],
    el: ["gr", "cy"],
    tr: ["tr"],
    fa: ["ir", "af"],
    he: ["il"],
    ur: ["pk"],
    kk: ["kz"],
    uz: ["uz"],
    tk: ["tk"],
    tg: ["tj"],
    ky: ["kg"],
    mn: ["mn"],
    ka: ["ge"],
    hy: ["am"],
    az: ["az"]
  };

  const customColors = {
    en: "#3B82F6",
    es: "#FABD00", // Weld-yellow for Spanish Spanish & Latin America
    fr: "#2563EB",
    de: "#EF4444",
    ja: "#BC002D", // Japanese Crimson Circle Red
    zh: "#DE2910",
    pt: "#009739",
    it: "#009246",
    ru: "#8B5CF6", // Purple/Violet for Russia (highly distinct)
    ko: "#EC4899",
    hi: "#FF9933",
    ar: "#06B6D4",
    bn: "#047857",
    tr: "#DC2626",
    se: "#0284C7",
    no: "#E11D48",
    da: "#C60C30", // Danish Red (used for Greenland)
    fi: "#1E3A8A",
    is: "#1E40AF",
    pl: "#E11D48",
    nl: "#F59E0B",
    ga: "#10B981"
  };

  function getLanguageColor(code) {
    if (customColors[code]) return customColors[code];
    const colors = getFlagColors(code);
    if (!colors || colors.length === 0) return "#3B82F6";
    let color = colors[0];
    if (color.toLowerCase() === "#ffffff" || color.toLowerCase() === "#fff") {
      color = colors[1] || color;
      if (color.toLowerCase() === "#ffffff" || color.toLowerCase() === "#fff") {
        color = colors[2] || color;
      }
    }
    return color;
  }

  let activeCountries = $derived(langToCountries[currentLang] || []);
  let activeColor = $derived(getLanguageColor(currentLang));

  // Construct a reactive map of country -> signature language color
  let countryColorsMap = $derived.by(() => {
    const map = {};
    for (const [lang, countries] of Object.entries(langToCountries)) {
      const color = getLanguageColor(lang);
      countries.forEach((c) => {
        map[c] = color;
      });
    }
    return map;
  });

  // Construct a reactive map of country -> language name for tooltip display
  let countryLanguagesMap = $derived.by(() => {
    const map = {};
    for (const [lang, countries] of Object.entries(langToCountries)) {
      const name = getLangEnglishName(lang) || lang;
      countries.forEach((c) => {
        map[c] = name;
      });
    }
    return map;
  });

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

  let searchQuery = $state("");
  let sortField = $state("name");
  let sortAscending = $state(true);

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
    const mortalityPenalty = totalMortality / 75;
    return Math.round((base + acBonus + vacBonus + hcBonus - mortalityPenalty) * 10) / 10;
  }

  function triggerQuickCompare(a, b) {
    compareA = a;
    compareB = b;
  }

  let compareFilteredCountries = $derived.by(() => {
    let list = Object.entries(enrichedCountryStats).map(([code, stats]) => ({
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
                Hover over the map to view statistics overlay, or click any country to inspect demographics dynamically.
              </p>
            </div>
            
            <div class="flex-1 min-h-[380px] w-full">
              <WorldMap
                activeCountries={activeCountries}
                countryStats={enrichedCountryStats}
                countryColors={countryColorsMap}
                countryLanguages={countryLanguagesMap}
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
                Compare health metrics, violence coefficients, drug overdoses, and calculations that derive final life expectancies between nations. Gold highlighted values represent the greater stat between the two countries.
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
              {#if enrichedCountryStats[compareA]}
                {@const statsA = enrichedCountryStats[compareA]}
                {@const statsB = enrichedCountryStats[compareB] || statsA}
                {@const lifeA = calculateLifeExpectancy(statsA)}
                {@const lifeB = calculateLifeExpectancy(statsB)}
                {@const deathsA = calculateTotalMortality(statsA)}
                {@const deathsB = calculateTotalMortality(statsB)}
                
                <div class="compare-card p-5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-4 relative">
                  <div class="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 class="text-sm font-bold text-white/40 uppercase tracking-wider">Country A</h3>
                    <select bind:value={compareA} class="bg-black/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white outline-none cursor-pointer">
                      {#each Object.entries(enrichedCountryStats) as [code, data]}
                        <option value={code}>{data.name}</option>
                      {/each}
                    </select>
                  </div>
                  
                  <div class="stats-overview flex justify-between items-center bg-black/30 p-4 rounded-lg">
                    <div class="flex flex-col">
                      <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Life Expectancy</span>
                      <span class="text-xl font-bold font-mono" class:highlighted-stat-green={lifeA > lifeB}>{lifeA} years</span>
                    </div>
                    <div class="flex flex-col text-right">
                      <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Total Deaths (per 100k)</span>
                      <span class="text-xl font-bold font-mono" class:highlighted-stat-red={deathsA > deathsB}>{deathsA}</span>
                    </div>
                  </div>

                  <div class="metrics-list flex flex-col gap-2.5 text-xs text-white/70">
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Cancer Rate</span><span class="font-mono font-medium" class:highlighted-stat={statsA.cancer > statsB.cancer}>{statsA.cancer}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Old Age / Cardiovascular</span><span class="font-mono font-medium" class:highlighted-stat={statsA.old_age > statsB.old_age}>{statsA.old_age}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Automobile Accidents</span><span class="font-mono font-medium" class:highlighted-stat={statsA.auto > statsB.auto}>{statsA.auto}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Suicide Rate</span><span class="font-mono font-medium" class:highlighted-stat={statsA.suicide > statsB.suicide}>{statsA.suicide}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Gun Violence</span><span class="font-mono font-medium" class:highlighted-stat={statsA.gun_violence > statsB.gun_violence}>{statsA.gun_violence}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Knife Violence</span><span class="font-mono font-medium" class:highlighted-stat={statsA.knife_violence > statsB.knife_violence}>{statsA.knife_violence}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Police Brutality</span><span class="font-mono font-medium" class:highlighted-stat={statsA.police_brutality > statsB.police_brutality}>{statsA.police_brutality}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Food Poisoning</span><span class="font-mono font-medium" class:highlighted-stat={statsA.food_poisoning > statsB.food_poisoning}>{statsA.food_poisoning}</span></div>
                    
                    <div class="p-3 bg-black/20 rounded-lg flex flex-col gap-1.5">
                      <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Drug Overdoses Detail (per 100k)</span>
                      <div class="grid grid-cols-2 gap-2 text-[11px]">
                        <div><span class="text-white/40 mr-1">Heroin:</span> <strong class="font-mono" class:highlighted-stat={statsA.overdose_heroin > statsB.overdose_heroin}>{statsA.overdose_heroin}</strong></div>
                        <div><span class="text-white/40 mr-1">Meth:</span> <strong class="font-mono" class:highlighted-stat={statsA.overdose_meth > statsB.overdose_meth}>{statsA.overdose_meth}</strong></div>
                        <div><span class="text-white/40 mr-1">Cocaine:</span> <strong class="font-mono" class:highlighted-stat={statsA.overdose_cocaine > statsB.overdose_cocaine}>{statsA.overdose_cocaine}</strong></div>
                        <div><span class="text-white/40 mr-1">Alcohol:</span> <strong class="font-mono" class:highlighted-stat={statsA.overdose_alcohol > statsB.overdose_alcohol}>{statsA.overdose_alcohol}</strong></div>
                      </div>
                    </div>
                    
                    <div class="p-3 bg-black/20 rounded-lg flex flex-col gap-1.5">
                      <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Life Expectancy Drivers</span>
                      <div class="grid grid-cols-3 gap-2 text-[10px] text-center">
                        <div class="bg-black/30 p-1.5 rounded"><span class="block text-white/30">A/C Adoption</span><strong class="font-mono" class:highlighted-stat={statsA.ac_adoption > statsB.ac_adoption}>{statsA.ac_adoption}%</strong></div>
                        <div class="bg-black/30 p-1.5 rounded"><span class="block text-white/30">Vaccination</span><strong class="font-mono" class:highlighted-stat={statsA.vaccines > statsB.vaccines}>{statsA.vaccines}%</strong></div>
                        <div class="bg-black/30 p-1.5 rounded"><span class="block text-white/30">Gov Healthcare</span><strong class="font-mono" class:highlighted-stat={statsA.gov_healthcare > statsB.gov_healthcare}>{statsA.gov_healthcare}/100</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              {/if}

              <!-- Right selection card -->
              {#if enrichedCountryStats[compareB]}
                {@const statsB = enrichedCountryStats[compareB]}
                {@const statsA = enrichedCountryStats[compareA] || statsB}
                {@const lifeB = calculateLifeExpectancy(statsB)}
                {@const lifeA = calculateLifeExpectancy(statsA)}
                {@const deathsB = calculateTotalMortality(statsB)}
                {@const deathsA = calculateTotalMortality(statsA)}
                
                <div class="compare-card p-5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-4 relative">
                  <div class="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 class="text-sm font-bold text-white/40 uppercase tracking-wider">Country B</h3>
                    <select bind:value={compareB} class="bg-black/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white outline-none cursor-pointer">
                      {#each Object.entries(enrichedCountryStats) as [code, data]}
                        <option value={code}>{data.name}</option>
                      {/each}
                    </select>
                  </div>
                  
                  <div class="stats-overview flex justify-between items-center bg-black/30 p-4 rounded-lg">
                    <div class="flex flex-col">
                      <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Life Expectancy</span>
                      <span class="text-xl font-bold font-mono" class:highlighted-stat-green={lifeB > lifeA}>{lifeB} years</span>
                    </div>
                    <div class="flex flex-col text-right">
                      <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Total Deaths (per 100k)</span>
                      <span class="text-xl font-bold font-mono" class:highlighted-stat-red={deathsB > deathsA}>{deathsB}</span>
                    </div>
                  </div>

                  <div class="metrics-list flex flex-col gap-2.5 text-xs text-white/70">
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Cancer Rate</span><span class="font-mono font-medium" class:highlighted-stat={statsB.cancer > statsA.cancer}>{statsB.cancer}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Old Age / Cardiovascular</span><span class="font-mono font-medium" class:highlighted-stat={statsB.old_age > statsA.old_age}>{statsB.old_age}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Automobile Accidents</span><span class="font-mono font-medium" class:highlighted-stat={statsB.auto > statsA.auto}>{statsB.auto}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Suicide Rate</span><span class="font-mono font-medium" class:highlighted-stat={statsB.suicide > statsA.suicide}>{statsB.suicide}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Gun Violence</span><span class="font-mono font-medium" class:highlighted-stat={statsB.gun_violence > statsA.gun_violence}>{statsB.gun_violence}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Knife Violence</span><span class="font-mono font-medium" class:highlighted-stat={statsB.knife_violence > statsA.knife_violence}>{statsB.knife_violence}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Police Brutality</span><span class="font-mono font-medium" class:highlighted-stat={statsB.police_brutality > statsA.police_brutality}>{statsB.police_brutality}</span></div>
                    <div class="flex justify-between py-1.5 border-b border-white/[0.02]"><span class="text-white/40">Food Poisoning</span><span class="font-mono font-medium" class:highlighted-stat={statsB.food_poisoning > statsA.food_poisoning}>{statsB.food_poisoning}</span></div>
                    
                    <div class="p-3 bg-black/20 rounded-lg flex flex-col gap-1.5">
                      <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Drug Overdoses Detail (per 100k)</span>
                      <div class="grid grid-cols-2 gap-2 text-[11px]">
                        <div><span class="text-white/40 mr-1">Heroin:</span> <strong class="font-mono" class:highlighted-stat={statsB.overdose_heroin > statsA.overdose_heroin}>{statsB.overdose_heroin}</strong></div>
                        <div><span class="text-white/40 mr-1">Meth:</span> <strong class="font-mono" class:highlighted-stat={statsB.overdose_meth > statsA.overdose_meth}>{statsB.overdose_meth}</strong></div>
                        <div><span class="text-white/40 mr-1">Cocaine:</span> <strong class="font-mono" class:highlighted-stat={statsB.overdose_cocaine > statsA.overdose_cocaine}>{statsB.overdose_cocaine}</strong></div>
                        <div><span class="text-white/40 mr-1">Alcohol:</span> <strong class="font-mono" class:highlighted-stat={statsB.overdose_alcohol > statsA.overdose_alcohol}>{statsB.overdose_alcohol}</strong></div>
                      </div>
                    </div>
                    
                    <div class="p-3 bg-black/20 rounded-lg flex flex-col gap-1.5">
                      <span class="text-[9px] uppercase tracking-wider text-white/30 font-bold">Life Expectancy Drivers</span>
                      <div class="grid grid-cols-3 gap-2 text-[10px] text-center">
                        <div class="bg-black/30 p-1.5 rounded"><span class="block text-white/30">A/C Adoption</span><strong class="font-mono" class:highlighted-stat={statsB.ac_adoption > statsA.ac_adoption}>{statsB.ac_adoption}%</strong></div>
                        <div class="bg-black/30 p-1.5 rounded"><span class="block text-white/30">Vaccination</span><strong class="font-mono" class:highlighted-stat={statsB.vaccines > statsA.vaccines}>{statsB.vaccines}%</strong></div>
                        <div class="bg-black/30 p-1.5 rounded"><span class="block text-white/30">Gov Healthcare</span><strong class="font-mono" class:highlighted-stat={statsB.gov_healthcare > statsA.gov_healthcare}>{statsB.gov_healthcare}/100</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              {/if}
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

        <!-- Speakers, Local Dogs, Palettes and methodologies sections -->
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

  /* Side-by-side comparative greater statistics highlight */
  :global(.highlighted-stat) {
    color: #FFB300 !important; /* Premium Gold/Yellow Highlight */
    font-weight: 700 !important;
    text-shadow: 0 0 8px rgba(255, 179, 0, 0.45);
  }

  :global(.highlighted-stat-green) {
    color: #00FF66 !important;
    font-weight: 700 !important;
    text-shadow: 0 0 10px rgba(0, 255, 102, 0.45);
  }

  :global(.highlighted-stat-red) {
    color: #FF3344 !important;
    font-weight: 700 !important;
    text-shadow: 0 0 10px rgba(255, 51, 68, 0.45);
  }
</style>
