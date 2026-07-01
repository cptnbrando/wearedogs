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
    { id: "animals", label: "Animals", icon: TrendingUp },
    { id: "themes", label: "Palettes", icon: Palette },
  ];

  // ---------------------------------------------------------------------------
  // Map country selection mapping
  // ---------------------------------------------------------------------------
  const langToCountries = {
    en: [
      "us",
      "gb",
      "ca",
      "au",
      "nz",
      "ie",
      "za",
      "ke",
      "ug",
      "tz",
      "ng",
      "gh",
      "lr",
      "sl",
      "jm",
      "bs",
      "fk",
      "pr",
      "zw",
      "zm",
      "mw",
      "na",
      "ls",
      "sz",
      "bw",
      "gy",
      "pg",
      "fj",
      "vu",
      "sb",
      "fm",
      "mt",
      "cy",
      "ss",
      "sg",
      "my",
      "cm",
      "ph",
      "il",
      "sr",
    ],
    es: [
      "es",
      "mx",
      "ar",
      "co",
      "pe",
      "ve",
      "cl",
      "ec",
      "bo",
      "py",
      "uy",
      "gt",
      "hn",
      "sv",
      "ni",
      "cr",
      "pa",
      "do",
      "cu",
      "gq",
      "pr",
    ],
    fr: [
      "fr",
      "ca",
      "be",
      "ch",
      "sn",
      "ci",
      "cg",
      "cd",
      "cm",
      "mg",
      "ne",
      "ml",
      "bf",
      "tg",
      "bj",
      "ga",
      "dj",
      "gq",
      "cf",
      "km",
      "bi",
      "rw",
      "gf",
      "ht",
      "gn",
      "td",
      "mr",
      "cm",
    ],
    de: ["de", "at", "ch", "lu", "be"],
    ja: ["jp"],
    zh: ["cn", "tw", "sg", "my"],
    pt: ["pt", "br", "ao", "cv", "tl", "mz", "gw", "st"],
    it: ["it", "ch"],
    ru: ["ru"],
    ko: ["kr", "kp"],
    hi: ["in"],
    ar: [
      "eg",
      "sa",
      "ae",
      "dz",
      "ma",
      "sd",
      "iq",
      "ye",
      "sy",
      "td",
      "tn",
      "ly",
      "jo",
      "er",
      "lb",
      "mr",
      "kw",
      "om",
      "qa",
      "bh",
      "so",
      "ps",
      "dj",
      "km",
      "eh",
      "il",
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
    ta: ["in", "lk", "sg", "my"],
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
    nl: ["nl", "sr", "be"],
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
    ur: ["pk", "in"],
    kk: ["kz"],
    uz: ["uz"],
    tk: ["tk"],
    tg: ["tj"],
    ky: ["kg"],
    mn: ["mn"],
    ka: ["ge"],
    hy: ["am"],
    az: ["az"],
    ps: ["af", "pk"],
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
    ga: "#10B981",
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
        // Dominant language (first listed in langToCountries) sets the default color
        if (!map[c]) {
          map[c] = color;
        }
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
        if (map[c]) {
          // If the country speaks multiple languages in our database, aggregate them
          if (!map[c].includes(name)) {
            map[c] += " / " + name;
          }
        } else {
          map[c] = name;
        }
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
  // Mobile swipe gesture navigation
  // ---------------------------------------------------------------------------
  let touchStartX = 0;
  let touchStartY = 0;
  let shouldIgnoreSwipe = false;

  function isHorizontallyScrollable(el, root) {
    let current = el;
    while (current && current !== root) {
      if (
        current.tagName === "SVG" ||
        current.tagName === "path" ||
        current.tagName === "g"
      ) {
        current = current.parentElement;
        continue;
      }
      const style = window.getComputedStyle(current);
      const overflowX = style.overflowX;
      if (
        (overflowX === "auto" || overflowX === "scroll") &&
        current.scrollWidth > current.clientWidth
      ) {
        return true;
      }
      if (
        current.tagName === "TABLE" ||
        current.tagName === "INPUT" ||
        current.tagName === "BUTTON" ||
        current.classList.contains("table-wrapper") ||
        current.classList.contains("quick-comparisons") ||
        current.classList.contains("comparison-matrix")
      ) {
        return true;
      }
      current = current.parentElement;
    }
    return false;
  }

  function handleTouchStart(e) {
    if (e.touches && e.touches.length > 0) {
      shouldIgnoreSwipe = isHorizontallyScrollable(e.target, e.currentTarget);
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }

  function handleTouchEnd(e) {
    if (shouldIgnoreSwipe) {
      shouldIgnoreSwipe = false;
      return;
    }
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Horizontal swipe threshold: 75px, vertical max deviation: 50px
    if (Math.abs(diffX) > 75 && Math.abs(diffY) < 50) {
      const currentIndex = statsTabs.findIndex((t) => t.id === activeTab);
      if (currentIndex !== -1) {
        if (diffX < 0) {
          // Swipe left (finger moves left, show next content tab)
          if (currentIndex < statsTabs.length - 1) {
            activeTab = statsTabs[currentIndex + 1].id;
          }
        } else {
          // Swipe right (finger moves right, show previous content tab)
          if (currentIndex > 0) {
            activeTab = statsTabs[currentIndex - 1].id;
          }
        }
      }
    }
  }
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
    return (
      Math.round(
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
          stats.overdose_alcohol) *
          10,
      ) / 10
    );
  }

  function calculateLifeExpectancy(stats) {
    if (!stats) return 75;
    const base = 75;
    const acBonus = (stats.ac_adoption / 100) * 3.5;
    const vacBonus = (stats.vaccines / 100) * 4.2;
    const hcBonus = (stats.gov_healthcare / 100) * 5.0;
    const totalMortality = calculateTotalMortality(stats);
    const mortalityPenalty = totalMortality / 75;
    return (
      Math.round(
        (base + acBonus + vacBonus + hcBonus - mortalityPenalty) * 10,
      ) / 10
    );
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
      lifeExpectancy: calculateLifeExpectancy(stats),
    }));

    if (compareSearchQuery.trim() !== "") {
      const q = compareSearchQuery.toLowerCase().trim();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }

    return list;
  });

  // ---------------------------------------------------------------------------
  // Mobile Comparative Table explanation text and selection state
  // ---------------------------------------------------------------------------
  let selectedMobileMetric = $state(null);

  const metricDescriptions = {
    lifeExpectancy: {
      label: "Life Expectancy",
      desc: "Average lifespan of a newborn baby, calculated based on health boosts (A/C adoption, vaccines, healthcare) minus the combined mortality penalty."
    },
    totalMortality: {
      label: "Total CDR (Crude Death Rate)",
      desc: "Aggregated annual deaths from all tracked causes per 100,000 residents."
    },
    cancer: {
      label: "Cancer Rate",
      desc: "Annual cancer and tumor-related deaths per 100,000 residents."
    },
    old_age: {
      label: "Old Age & Cardio",
      desc: "Annual deaths from age-related degeneration and cardiovascular failure per 100,000 residents."
    },
    auto: {
      label: "Auto Accidents",
      desc: "Annual fatalities from motor vehicles, roads, and driving accidents per 100,000 residents."
    },
    suicide: {
      label: "Suicide Rate",
      desc: "Annual suicide deaths per 100,000 residents, reflecting mental health support index."
    },
    gun_violence: {
      label: "Gun Violence",
      desc: "Annual homicides and accidental deaths caused by firearms per 100,000 residents."
    },
    knife_violence: {
      label: "Knife Violence",
      desc: "Annual homicides and assaults involving blade weapons per 100,000 residents."
    },
    police_brutality: {
      label: "Police Brutality",
      desc: "Fatal incidents involving law enforcement intervention per 100,000 residents."
    },
    food_poisoning: {
      label: "Food Poisoning",
      desc: "Deaths due to foodborne illnesses, toxic ingestions, and poor sanitization per 100,000 residents."
    },
    overdose_heroin: {
      label: "Heroin Overdoses",
      desc: "Annual fatal overdoses specifically related to heroin and primary opioids per 100,000 residents."
    },
    overdose_meth: {
      label: "Meth Overdoses",
      desc: "Annual fatal overdoses related to methamphetamine and amphetamine stimulants per 100,000 residents."
    },
    overdose_cocaine: {
      label: "Cocaine Overdoses",
      desc: "Annual fatal overdoses related to cocaine and crack derivatives per 100,000 residents."
    },
    overdose_alcohol: {
      label: "Alcohol Overdoses",
      desc: "Annual fatal incidents directly caused by acute alcohol poisoning and toxicity per 100,000 residents."
    },
    ac_adoption: {
      label: "A/C Adoption",
      desc: "Percentage of homes equipped with air conditioning, heavily reducing heat-stroke mortality rates."
    },
    vaccines: {
      label: "Vaccination Rate",
      desc: "Percentage of children receiving primary federal vaccination requirements, preventing infectious outbreaks."
    },
    gov_healthcare: {
      label: "Gov Healthcare",
      desc: "Quality, funding, and scope of public health mandates and government-provided healthcare, scored out of 100."
    }
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="stats-panel-backdrop" onclick={onClose}>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="stats-panel-container"
    class:closing={isClosing}
    onclick={(e) => e.stopPropagation()}
  >
    <!-- Header -->
    <header class="panel-header">
      <div class="brand">
        <img
          src="/favicon.svg"
          alt="DOGS Logo"
          class="w-6 h-6 shrink-0 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
        />
        <h1>Demographics</h1>
      </div>

      <button
        class="close-btn"
        onclick={onClose}
        aria-label="Close panel"
      >
        <ArrowLeft size={20} />
      </button>
    </header>

    <!-- Unified top swipeable tab nav component -->
    <SwipeTabNav tabs={statsTabs} bind:activeTab />

    <!-- Inner Window Body (Full width, scroll container) -->
    <div class="panel-body flex-1 min-h-0 flex flex-col md:flex-row relative">
      <!-- Content Area -->
      <main
        class="panel-content-pane flex-1 p-6 md:p-8 overflow-y-auto scroll-container bg-black/10"
        ontouchstart={handleTouchStart}
        ontouchend={handleTouchEnd}
      >
        <!-- 1. EXPLORER VIEW -->
        {#if activeTab === "explorer"}
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
                    onclick={() => (searchQuery = "")}>&times;</button
                  >
                {/if}
              </div>
              <div class="results-count text-xs font-semibold text-white/40">
                Showing {filteredLangs.length} of {langs.length} locales
              </div>
            </div>

            <!-- Table Wrapper (Desktop/Tablet) -->
            <div
              class="table-wrapper hidden md:block border border-white/5 rounded-xl overflow-hidden bg-black/25"
            >
              <table
                class="explorer-table w-full text-left border-collapse text-sm"
              >
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
                      >Dialect</th
                    >
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
        {/if}

        <!-- 2. WORLD MAP VIEW -->
        {#if activeTab === "map"}
          <div class="tab-pane animated-pane flex flex-col gap-5 h-full">
            <div class="map-view-header">
              <h2
                class="text-base font-bold text-white uppercase tracking-wider"
              >
                Interactive Vector World Map
              </h2>
              <p class="text-xs text-white/50 mt-1">
                Currently highlighting target countries for: <span
                  class="font-bold text-white"
                  style="color: {activeColor}"
                  >{activeLangItem.displayName}</span
                >. Hover over the map to view statistics overlay, or click any
                country to inspect demographics dynamically.
              </p>
            </div>

            <div class="flex-1 min-h-[380px] w-full">
              <WorldMap
                {activeCountries}
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
              <h2
                class="text-base font-bold text-white uppercase tracking-wider"
              >
                Life & Death Demographics Comparative Matrix
              </h2>
              <p class="text-xs text-white/50 mt-1">
                Compare health metrics, violence coefficients, drug overdoses,
                and calculations that derive final life expectancies between
                nations. Gold highlighted values represent the greater stat
                between the two countries.
              </p>
            </div>

            <!-- Quick Compare Links -->
            <div
              class="quick-comparisons bg-white/[0.02] border border-white/5 p-4 rounded-xl"
            >
              <h4
                class="text-xs font-bold text-white/40 uppercase tracking-widest mb-3"
              >
                Quick Compare Shortcuts
              </h4>
              <div class="flex flex-wrap gap-2.5">
                <button
                  class="px-3 py-1.5 bg-black/40 border border-white/5 hover:border-white/25 rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-all cursor-pointer"
                  onclick={() => triggerQuickCompare("ca", "au")}
                >
                  🔫 Gun Violence: Canada vs Australia
                </button>
                <button
                  class="px-3 py-1.5 bg-black/40 border border-white/5 hover:border-white/25 rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-all cursor-pointer"
                  onclick={() => triggerQuickCompare("mx", "nz")}
                >
                  👮 Police Brutality: Mexico vs New Zealand
                </button>
                <button
                  class="px-3 py-1.5 bg-black/40 border border-white/5 hover:border-white/25 rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-all cursor-pointer"
                  onclick={() => triggerQuickCompare("us", "jp")}
                >
                  💊 Heroin & Overdoses: USA vs Japan
                </button>
                <button
                  class="px-3 py-1.5 bg-black/40 border border-white/5 hover:border-white/25 rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-all cursor-pointer"
                  onclick={() => triggerQuickCompare("th", "gb")}
                >
                  🚗 Road Safety: Thailand vs UK
                </button>
              </div>
            </div>

            <!-- Side by Side Comparative Widget (Desktop/Tablet) -->
            <div
              id="comparison-results"
              class="comparison-grid hidden lg:grid grid-cols-2 gap-6 mt-2"
            >
              <!-- Left selection card -->
              {#if enrichedCountryStats[compareA]}
                {@const statsA = enrichedCountryStats[compareA]}
                {@const statsB = enrichedCountryStats[compareB] || statsA}
                {@const lifeA = calculateLifeExpectancy(statsA)}
                {@const lifeB = calculateLifeExpectancy(statsB)}
                {@const deathsA = calculateTotalMortality(statsA)}
                {@const deathsB = calculateTotalMortality(statsB)}

                <div
                  class="compare-card p-5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-4 relative"
                >
                  <div
                    class="flex items-center justify-between border-b border-white/5 pb-3"
                  >
                    <h3
                      class="text-sm font-bold text-white/40 uppercase tracking-wider"
                    >
                      Country A
                    </h3>
                    <select
                      bind:value={compareA}
                      class="bg-black/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white outline-none cursor-pointer"
                    >
                      {#each Object.entries(enrichedCountryStats) as [code, data]}
                        <option value={code}>{data.name}</option>
                      {/each}
                    </select>
                  </div>

                  <div
                    class="stats-overview flex justify-between items-center bg-black/30 p-4 rounded-lg"
                  >
                    <div class="flex flex-col">
                      <span
                        class="text-[9px] uppercase tracking-wider text-white/30 font-bold"
                        >Life Expectancy</span
                      >
                      <span
                        class="text-xl font-bold font-mono"
                        class:highlighted-stat-green={lifeA > lifeB}
                        >{lifeA} years</span
                      >
                    </div>
                    <div class="flex flex-col text-right">
                      <span
                        class="text-[9px] uppercase tracking-wider text-white/30 font-bold"
                        >Total Deaths (per 100k)</span
                      >
                      <span
                        class="text-xl font-bold font-mono"
                        class:highlighted-stat-red={deathsA > deathsB}
                        >{deathsA}</span
                      >
                    </div>
                  </div>

                  <div
                    class="metrics-list flex flex-col gap-2.5 text-xs text-white/70"
                  >
                    <div
                      class="flex justify-between py-1.5 border-b border-white/[0.02]"
                    >
                      <span class="text-white/40">Cancer Rate</span><span
                        class="font-mono font-medium"
                        class:highlighted-stat={statsA.cancer > statsB.cancer}
                        >{statsA.cancer}</span
                      >
                    </div>
                    <div
                      class="flex justify-between py-1.5 border-b border-white/[0.02]"
                    >
                      <span class="text-white/40">Old Age / Cardiovascular</span
                      ><span
                        class="font-mono font-medium"
                        class:highlighted-stat={statsA.old_age > statsB.old_age}
                        >{statsA.old_age}</span
                      >
                    </div>
                    <div
                      class="flex justify-between py-1.5 border-b border-white/[0.02]"
                    >
                      <span class="text-white/40">Automobile Accidents</span
                      ><span
                        class="font-mono font-medium"
                        class:highlighted-stat={statsA.auto > statsB.auto}
                        >{statsA.auto}</span
                      >
                    </div>
                    <div
                      class="flex justify-between py-1.5 border-b border-white/[0.02]"
                    >
                      <span class="text-white/40">Suicide Rate</span><span
                        class="font-mono font-medium"
                        class:highlighted-stat={statsA.suicide > statsB.suicide}
                        >{statsA.suicide}</span
                      >
                    </div>
                    <div
                      class="flex justify-between py-1.5 border-b border-white/[0.02]"
                    >
                      <span class="text-white/40">Gun Violence</span><span
                        class="font-mono font-medium"
                        class:highlighted-stat={statsA.gun_violence >
                          statsB.gun_violence}>{statsA.gun_violence}</span
                      >
                    </div>
                    <div
                      class="flex justify-between py-1.5 border-b border-white/[0.02]"
                    >
                      <span class="text-white/40">Knife Violence</span><span
                        class="font-mono font-medium"
                        class:highlighted-stat={statsA.knife_violence >
                          statsB.knife_violence}>{statsA.knife_violence}</span
                      >
                    </div>
                    <div
                      class="flex justify-between py-1.5 border-b border-white/[0.02]"
                    >
                      <span class="text-white/40">Police Brutality</span><span
                        class="font-mono font-medium"
                        class:highlighted-stat={statsA.police_brutality >
                          statsB.police_brutality}
                        >{statsA.police_brutality}</span
                      >
                    </div>
                    <div
                      class="flex justify-between py-1.5 border-b border-white/[0.02]"
                    >
                      <span class="text-white/40">Food Poisoning</span><span
                        class="font-mono font-medium"
                        class:highlighted-stat={statsA.food_poisoning >
                          statsB.food_poisoning}>{statsA.food_poisoning}</span
                      >
                    </div>

                    <div
                      class="p-3 bg-black/20 rounded-lg flex flex-col gap-1.5"
                    >
                      <span
                        class="text-[9px] uppercase tracking-wider text-white/30 font-bold"
                        >Drug Overdoses Detail (per 100k)</span
                      >
                      <div class="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span class="text-white/40 mr-1">Heroin:</span>
                          <strong
                            class="font-mono"
                            class:highlighted-stat={statsA.overdose_heroin >
                              statsB.overdose_heroin}
                            >{statsA.overdose_heroin}</strong
                          >
                        </div>
                        <div>
                          <span class="text-white/40 mr-1">Meth:</span>
                          <strong
                            class="font-mono"
                            class:highlighted-stat={statsA.overdose_meth >
                              statsB.overdose_meth}
                            >{statsA.overdose_meth}</strong
                          >
                        </div>
                        <div>
                          <span class="text-white/40 mr-1">Cocaine:</span>
                          <strong
                            class="font-mono"
                            class:highlighted-stat={statsA.overdose_cocaine >
                              statsB.overdose_cocaine}
                            >{statsA.overdose_cocaine}</strong
                          >
                        </div>
                        <div>
                          <span class="text-white/40 mr-1">Alcohol:</span>
                          <strong
                            class="font-mono"
                            class:highlighted-stat={statsA.overdose_alcohol >
                              statsB.overdose_alcohol}
                            >{statsA.overdose_alcohol}</strong
                          >
                        </div>
                      </div>
                    </div>

                    <div
                      class="p-3 bg-black/20 rounded-lg flex flex-col gap-1.5"
                    >
                      <span
                        class="text-[9px] uppercase tracking-wider text-white/30 font-bold"
                        >Life Expectancy Drivers</span
                      >
                      <div
                        class="grid grid-cols-3 gap-2 text-[10px] text-center"
                      >
                        <div class="bg-black/30 p-1.5 rounded">
                          <span class="block text-white/30">A/C Adoption</span
                          ><strong
                            class="font-mono"
                            class:highlighted-stat={statsA.ac_adoption >
                              statsB.ac_adoption}>{statsA.ac_adoption}%</strong
                          >
                        </div>
                        <div class="bg-black/30 p-1.5 rounded">
                          <span class="block text-white/30">Vaccination</span
                          ><strong
                            class="font-mono"
                            class:highlighted-stat={statsA.vaccines >
                              statsB.vaccines}>{statsA.vaccines}%</strong
                          >
                        </div>
                        <div class="bg-black/30 p-1.5 rounded">
                          <span class="block text-white/30">Gov Healthcare</span
                          ><strong
                            class="font-mono"
                            class:highlighted-stat={statsA.gov_healthcare >
                              statsB.gov_healthcare}
                            >{statsA.gov_healthcare}/100</strong
                          >
                        </div>
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

                <div
                  class="compare-card p-5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-4 relative"
                >
                  <div
                    class="flex items-center justify-between border-b border-white/5 pb-3"
                  >
                    <h3
                      class="text-sm font-bold text-white/40 uppercase tracking-wider"
                    >
                      Country B
                    </h3>
                    <select
                      bind:value={compareB}
                      class="bg-black/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white outline-none cursor-pointer"
                    >
                      {#each Object.entries(enrichedCountryStats) as [code, data]}
                        <option value={code}>{data.name}</option>
                      {/each}
                    </select>
                  </div>

                  <div
                    class="stats-overview flex justify-between items-center bg-black/30 p-4 rounded-lg"
                  >
                    <div class="flex flex-col">
                      <span
                        class="text-[9px] uppercase tracking-wider text-white/30 font-bold"
                        >Life Expectancy</span
                      >
                      <span
                        class="text-xl font-bold font-mono"
                        class:highlighted-stat-green={lifeB > lifeA}
                        >{lifeB} years</span
                      >
                    </div>
                    <div class="flex flex-col text-right">
                      <span
                        class="text-[9px] uppercase tracking-wider text-white/30 font-bold"
                        >Total Deaths (per 100k)</span
                      >
                      <span
                        class="text-xl font-bold font-mono"
                        class:highlighted-stat-red={deathsB > deathsA}
                        >{deathsB}</span
                      >
                    </div>
                  </div>

                  <div
                    class="metrics-list flex flex-col gap-2.5 text-xs text-white/70"
                  >
                    <div
                      class="flex justify-between py-1.5 border-b border-white/[0.02]"
                    >
                      <span class="text-white/40">Cancer Rate</span><span
                        class="font-mono font-medium"
                        class:highlighted-stat={statsB.cancer > statsA.cancer}
                        >{statsB.cancer}</span
                      >
                    </div>
                    <div
                      class="flex justify-between py-1.5 border-b border-white/[0.02]"
                    >
                      <span class="text-white/40">Old Age / Cardiovascular</span
                      ><span
                        class="font-mono font-medium"
                        class:highlighted-stat={statsB.old_age > statsA.old_age}
                        >{statsB.old_age}</span
                      >
                    </div>
                    <div
                      class="flex justify-between py-1.5 border-b border-white/[0.02]"
                    >
                      <span class="text-white/40">Automobile Accidents</span
                      ><span
                        class="font-mono font-medium"
                        class:highlighted-stat={statsB.auto > statsA.auto}
                        >{statsB.auto}</span
                      >
                    </div>
                    <div
                      class="flex justify-between py-1.5 border-b border-white/[0.02]"
                    >
                      <span class="text-white/40">Suicide Rate</span><span
                        class="font-mono font-medium"
                        class:highlighted-stat={statsB.suicide > statsA.suicide}
                        >{statsB.suicide}</span
                      >
                    </div>
                    <div
                      class="flex justify-between py-1.5 border-b border-white/[0.02]"
                    >
                      <span class="text-white/40">Gun Violence</span><span
                        class="font-mono font-medium"
                        class:highlighted-stat={statsB.gun_violence >
                          statsA.gun_violence}>{statsB.gun_violence}</span
                      >
                    </div>
                    <div
                      class="flex justify-between py-1.5 border-b border-white/[0.02]"
                    >
                      <span class="text-white/40">Knife Violence</span><span
                        class="font-mono font-medium"
                        class:highlighted-stat={statsB.knife_violence >
                          statsA.knife_violence}>{statsB.knife_violence}</span
                      >
                    </div>
                    <div
                      class="flex justify-between py-1.5 border-b border-white/[0.02]"
                    >
                      <span class="text-white/40">Police Brutality</span><span
                        class="font-mono font-medium"
                        class:highlighted-stat={statsB.police_brutality >
                          statsA.police_brutality}
                        >{statsB.police_brutality}</span
                      >
                    </div>
                    <div
                      class="flex justify-between py-1.5 border-b border-white/[0.02]"
                    >
                      <span class="text-white/40">Food Poisoning</span><span
                        class="font-mono font-medium"
                        class:highlighted-stat={statsB.food_poisoning >
                          statsA.food_poisoning}>{statsB.food_poisoning}</span
                      >
                    </div>

                    <div
                      class="p-3 bg-black/20 rounded-lg flex flex-col gap-1.5"
                    >
                      <span
                        class="text-[9px] uppercase tracking-wider text-white/30 font-bold"
                        >Drug Overdoses Detail (per 100k)</span
                      >
                      <div class="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span class="text-white/40 mr-1">Heroin:</span>
                          <strong
                            class="font-mono"
                            class:highlighted-stat={statsB.overdose_heroin >
                              statsA.overdose_heroin}
                            >{statsB.overdose_heroin}</strong
                          >
                        </div>
                        <div>
                          <span class="text-white/40 mr-1">Meth:</span>
                          <strong
                            class="font-mono"
                            class:highlighted-stat={statsB.overdose_meth >
                              statsA.overdose_meth}
                            >{statsB.overdose_meth}</strong
                          >
                        </div>
                        <div>
                          <span class="text-white/40 mr-1">Cocaine:</span>
                          <strong
                            class="font-mono"
                            class:highlighted-stat={statsB.overdose_cocaine >
                              statsA.overdose_cocaine}
                            >{statsB.overdose_cocaine}</strong
                          >
                        </div>
                        <div>
                          <span class="text-white/40 mr-1">Alcohol:</span>
                          <strong
                            class="font-mono"
                            class:highlighted-stat={statsB.overdose_alcohol >
                              statsA.overdose_alcohol}
                            >{statsB.overdose_alcohol}</strong
                          >
                        </div>
                      </div>
                    </div>

                    <div
                      class="p-3 bg-black/20 rounded-lg flex flex-col gap-1.5"
                    >
                      <span
                        class="text-[9px] uppercase tracking-wider text-white/30 font-bold"
                        >Life Expectancy Drivers</span
                      >
                      <div
                        class="grid grid-cols-3 gap-2 text-[10px] text-center"
                      >
                        <div class="bg-black/30 p-1.5 rounded">
                          <span class="block text-white/30">A/C Adoption</span
                          ><strong
                            class="font-mono"
                            class:highlighted-stat={statsB.ac_adoption >
                              statsA.ac_adoption}>{statsB.ac_adoption}%</strong
                          >
                        </div>
                        <div class="bg-black/30 p-1.5 rounded">
                          <span class="block text-white/30">Vaccination</span
                          ><strong
                            class="font-mono"
                            class:highlighted-stat={statsB.vaccines >
                              statsA.vaccines}>{statsB.vaccines}%</strong
                          >
                        </div>
                        <div class="bg-black/30 p-1.5 rounded">
                          <span class="block text-white/30">Gov Healthcare</span
                          ><strong
                            class="font-mono"
                            class:highlighted-stat={statsB.gov_healthcare >
                              statsA.gov_healthcare}
                            >{statsB.gov_healthcare}/100</strong
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              {/if}
            </div>

            <!-- Mobile-Optimized Unified Comparison Table (Visible on mobile viewports) -->
            {#if enrichedCountryStats[compareA]}
              {@const statsA = enrichedCountryStats[compareA]}
              {@const statsB = enrichedCountryStats[compareB] || statsA}
              {@const lifeA = calculateLifeExpectancy(statsA)}
              {@const lifeB = calculateLifeExpectancy(statsB)}
              {@const deathsA = calculateTotalMortality(statsA)}
              {@const deathsB = calculateTotalMortality(statsB)}

              <div class="comparison-mobile-container block lg:hidden w-full mt-2 bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
                <!-- Mobile Select Row -->
                <div class="flex items-center justify-between border-b border-white/5 pb-4 mb-2 gap-4">
                  <div class="flex-1 flex flex-col gap-1">
                    <span class="text-[9px] font-bold text-white/30 tracking-widest uppercase">Country A</span>
                    <select bind:value={compareA} class="w-full bg-black/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white outline-none cursor-pointer">
                      {#each Object.entries(enrichedCountryStats) as [code, data]}
                        <option value={code}>{data.name}</option>
                      {/each}
                    </select>
                  </div>
                  
                  <div class="flex-none text-center font-bold text-white/30 text-xs self-end pb-2">VS</div>
                  
                  <div class="flex-1 flex flex-col gap-1 text-right">
                    <span class="text-[9px] font-bold text-white/30 tracking-widest uppercase">Country B</span>
                    <select bind:value={compareB} class="w-full bg-black/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white outline-none cursor-pointer">
                      {#each Object.entries(enrichedCountryStats) as [code, data]}
                        <option value={code}>{data.name}</option>
                      {/each}
                    </select>
                  </div>
                </div>

                <!-- Unified Table Rows -->
                <div class="flex flex-col">
                  <!-- Row 1: Life Expectancy -->
                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div 
                    class="grid grid-cols-[1fr_auto_1fr] items-center py-3 border-b border-white/5 hover:bg-white/[0.02] rounded-lg transition-all cursor-pointer {selectedMobileMetric === 'lifeExpectancy' ? 'bg-white/[0.03]' : ''}"
                    onclick={() => selectedMobileMetric = (selectedMobileMetric === 'lifeExpectancy' ? null : 'lifeExpectancy')}
                  >
                    <div class="text-left font-mono text-sm font-bold pl-3" class:highlighted-stat-green={lifeA > lifeB}>{lifeA} yrs</div>
                    <div class="flex flex-col items-center justify-center min-w-[120px] px-2 text-center">
                      <span class="text-sm mb-0.5">❤️</span>
                      <span class="text-[9px] uppercase tracking-wider text-white/40 font-extrabold">Life Expectancy</span>
                    </div>
                    <div class="text-right font-mono text-sm font-bold pr-3" class:highlighted-stat-green={lifeB > lifeA}>{lifeB} yrs</div>
                  </div>

                  <!-- Row 2: Total Deaths -->
                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div 
                    class="grid grid-cols-[1fr_auto_1fr] items-center py-3 border-b border-white/5 hover:bg-white/[0.02] rounded-lg transition-all cursor-pointer {selectedMobileMetric === 'totalMortality' ? 'bg-white/[0.03]' : ''}"
                    onclick={() => selectedMobileMetric = (selectedMobileMetric === 'totalMortality' ? null : 'totalMortality')}
                  >
                    <div class="text-left font-mono text-sm font-bold pl-3" class:highlighted-stat-red={deathsA > deathsB}>{deathsA}</div>
                    <div class="flex flex-col items-center justify-center min-w-[120px] px-2 text-center">
                      <span class="text-sm mb-0.5">⚰️</span>
                      <span class="text-[9px] uppercase tracking-wider text-white/40 font-extrabold">Total Deaths</span>
                    </div>
                    <div class="text-right font-mono text-sm font-bold pr-3" class:highlighted-stat-red={deathsB > deathsA}>{deathsB}</div>
                  </div>

                  <!-- Loop through rest of metrics -->
                  {#each [
                    { key: 'cancer', icon: '🎗️', label: 'Cancer Rate', raw: true },
                    { key: 'old_age', icon: '👵', label: 'Old Age', raw: true },
                    { key: 'auto', icon: '🚗', label: 'Auto Accidents', raw: true },
                    { key: 'suicide', icon: '🧠', label: 'Suicide Rate', raw: true },
                    { key: 'gun_violence', icon: '🔫', label: 'Gun Violence', raw: true },
                    { key: 'knife_violence', icon: '🔪', label: 'Knife Violence', raw: true },
                    { key: 'police_brutality', icon: '👮', label: 'Police Brutality', raw: true },
                    { key: 'food_poisoning', icon: '🤢', label: 'Food Poisoning', raw: true },
                    { key: 'overdose_heroin', icon: '💉', label: 'Heroin OD', raw: true },
                    { key: 'overdose_meth', icon: '💎', label: 'Meth OD', raw: true },
                    { key: 'overdose_cocaine', icon: '❄️', label: 'Cocaine OD', raw: true },
                    { key: 'overdose_alcohol', icon: '🍺', label: 'Alcohol OD', raw: true },
                    { key: 'ac_adoption', icon: '💨', label: 'A/C Adoption', suffix: '%' },
                    { key: 'vaccines', icon: '🛡️', label: 'Vaccination', suffix: '%' },
                    { key: 'gov_healthcare', icon: '🏥', label: 'Gov Healthcare', suffix: '/100' }
                  ] as m}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div 
                      class="grid grid-cols-[1fr_auto_1fr] items-center py-3 border-b border-white/5 hover:bg-white/[0.02] rounded-lg transition-all cursor-pointer {selectedMobileMetric === m.key ? 'bg-white/[0.03]' : ''}"
                      onclick={() => selectedMobileMetric = (selectedMobileMetric === m.key ? null : m.key)}
                    >
                      <div class="text-left font-mono text-sm font-semibold pl-3" class:highlighted-stat={statsA[m.key] > statsB[m.key]}>
                        {statsA[m.key]}{m.suffix || ''}
                      </div>
                      <div class="flex flex-col items-center justify-center min-w-[120px] px-2 text-center">
                        <span class="text-sm mb-0.5">{m.icon}</span>
                        <span class="text-[9px] uppercase tracking-wider text-white/40 font-extrabold">{m.label}</span>
                      </div>
                      <div class="text-right font-mono text-sm font-semibold pr-3" class:highlighted-stat={statsB[m.key] > statsA[m.key]}>
                        {statsB[m.key]}{m.suffix || ''}
                      </div>
                    </div>
                  {/each}
                </div>

                <!-- Active Metric Details Block -->
                {#if selectedMobileMetric && metricDescriptions[selectedMobileMetric]}
                  <div class="mt-2 p-4 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-1 transition-all duration-300">
                    <span class="text-xs font-bold text-white flex items-center gap-2">
                      <span>{metricDescriptions[selectedMobileMetric].label}</span>
                      <span class="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 uppercase tracking-widest font-mono">Info</span>
                    </span>
                    <p class="text-[11px] text-white/60 leading-relaxed mt-1">
                      {metricDescriptions[selectedMobileMetric].desc}
                    </p>
                  </div>
                {/if}
              </div>
            {/if}

            <!-- Full index lookup table -->
            <div class="country-search mt-4">
              <div class="flex justify-between items-center gap-4 mb-4">
                <h3
                  class="text-sm font-bold text-white uppercase tracking-wider"
                >
                  Search Country Index
                </h3>
                <input
                  type="text"
                  placeholder="Filter country table..."
                  bind:value={compareSearchQuery}
                  class="max-w-[300px] px-3.5 py-1.5 bg-black/40 border border-white/5 rounded-lg text-xs outline-none focus:border-white/20 transition-all"
                />
              </div>
              <div
                class="table-wrapper border border-white/5 rounded-xl overflow-x-auto bg-black/20 max-h-[350px] scroll-y"
              >
                <table class="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr
                      class="bg-white/[0.02] border-b border-white/5 sticky top-0 backdrop-blur"
                    >
                      <th class="p-3 pl-4 font-bold text-white/40 uppercase"
                        >Country</th
                      >
                      <th
                        class="p-3 font-bold text-white/40 uppercase text-center"
                        >Life Expectancy</th
                      >
                      <th
                        class="p-3 font-bold text-white/40 uppercase text-center"
                        >Total CDR</th
                      >
                      <th
                        class="p-3 font-bold text-white/40 uppercase text-center"
                        >Heroin</th
                      >
                      <th
                        class="p-3 font-bold text-white/40 uppercase text-center"
                        >Meth</th
                      >
                      <th
                        class="p-3 font-bold text-white/40 uppercase text-center"
                        >Cocaine</th
                      >
                      <th
                        class="p-3 font-bold text-white/40 uppercase text-center"
                        >Alcohol</th
                      >
                      <th
                        class="p-3 font-bold text-white/40 uppercase text-center"
                        >Auto</th
                      >
                      <th
                        class="p-3 font-bold text-white/40 uppercase text-center"
                        >Gun</th
                      >
                      <th
                        class="p-3 font-bold text-white/40 uppercase text-center"
                        >Police</th
                      >
                      <th
                        class="p-3 font-bold text-white/40 uppercase text-center"
                        >A/C (%)</th
                      >
                    </tr>
                  </thead>
                  <tbody>
                    {#each compareFilteredCountries as c}
                      <tr
                        class="border-b border-white/[0.02] hover:bg-white/[0.02] transition-all"
                      >
                        <td class="p-3 pl-4 font-semibold text-white/90"
                          >{c.name}</td
                        >
                        <td
                          class="p-3 text-center text-green-400 font-mono font-semibold"
                          >{c.lifeExpectancy}</td
                        >
                        <td class="p-3 text-center text-red-400 font-mono"
                          >{c.totalMortality}</td
                        >
                        <td class="p-3 text-center font-mono"
                          >{c.overdose_heroin}</td
                        >
                        <td class="p-3 text-center font-mono"
                          >{c.overdose_meth}</td
                        >
                        <td class="p-3 text-center font-mono"
                          >{c.overdose_cocaine}</td
                        >
                        <td class="p-3 text-center font-mono"
                          >{c.overdose_alcohol}</td
                        >
                        <td class="p-3 text-center font-mono">{c.auto}</td>
                        <td class="p-3 text-center font-mono"
                          >{c.gun_violence}</td
                        >
                        <td class="p-3 text-center font-mono"
                          >{c.police_brutality}</td
                        >
                        <td class="p-3 text-center font-mono text-green-400/80"
                          >{c.ac_adoption}%</td
                        >
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        {/if}

        <!-- Combined Animals Tab (Speakers and Dog Populations) -->
        {#if activeTab === "animals"}
          <div class="tab-pane animated-pane flex flex-col gap-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Section 1: Speakers (Humans) -->
              <div class="flex flex-col gap-4">
                <div>
                  <h2 class="text-base font-bold text-white uppercase tracking-wider">
                    Speakers Distribution
                  </h2>
                  <p class="description text-xs text-white/50 mt-1 mb-4">
                    A breakdown of the top cataloged languages by approximate L1 speaker counts worldwide.
                  </p>
                </div>

                <div class="speakers-chart-container flex flex-col gap-4 bg-white/[0.01] border border-white/5 p-5 rounded-2xl">
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

              <!-- Section 2: Dog Populations -->
              <div class="flex flex-col gap-4">
                <div>
                  <h2 class="text-base font-bold text-white uppercase tracking-wider">
                    Dog Populations by Region
                  </h2>
                  <p class="description text-xs text-white/50 mt-1 mb-4">
                    Analysis of domestic dog populations estimated within the primary geographic regions of each language.
                  </p>
                </div>

                <div class="speakers-chart-container flex flex-col gap-4 bg-white/[0.01] border border-white/5 p-5 rounded-2xl">
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
            </div>
          </div>
        {/if}

        {#if activeTab === "themes"}
          <div class="tab-pane animated-pane">
            <h2 class="text-base font-bold text-white uppercase tracking-wider">
              Flag Color Palettes
            </h2>
            <p class="description text-xs text-white/50 mt-1 mb-6">
              Each language features a signature tri-color gradient sweep based
              on national flags or HSL hash values.
            </p>

            <div
              class="palettes-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {#each allLangItems.slice(0, 36) as item}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  class="palette-card p-2 bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.06] rounded-xl cursor-pointer hover:-translate-y-0.5 transition-all duration-300"
                  onclick={() => handleSelect(item.code)}
                >
                  <div
                    class="palette-swatch-box h-12 rounded-lg overflow-hidden flex border border-white/10"
                  >
                    <div
                      class="flex-grow"
                      style="background: {item.colors[0]}"
                    ></div>
                    <div
                      class="flex-grow"
                      style="background: {item.colors[1]}"
                    ></div>
                    <div
                      class="flex-grow"
                      style="background: {item.colors[2]}"
                    ></div>
                  </div>
                  <div class="palette-card-meta flex flex-col mt-2 px-1">
                    <span
                      class="p-name text-xs font-bold text-white/85 truncate"
                      >{item.displayName}</span
                    >
                    <span
                      class="p-code text-[9px] uppercase tracking-wider font-mono text-white/30"
                      >{item.code}</span
                    >
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </main>

      <!-- Sidebar selection overlay display (Visible on desktop only) -->
      <div
        class="sidebar-selection-pane hidden xl:flex flex-col w-[280px] p-6 border-l border-white/5 bg-black/10 shrink-0 select-none"
      >
        <div
          class="current-selection-card mt-auto bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col gap-4"
        >
          <div class="card-head flex flex-col">
            <span
              class="card-tag text-[8px] font-bold text-white/30 tracking-widest uppercase"
              >ACTIVE LOCALE</span
            >
            <h3 class="text-sm font-bold text-white mt-0.5">
              {activeLangItem.displayName}
            </h3>
          </div>
          <div
            class="color-track h-1 flex border border-white/10 rounded-full overflow-hidden"
          >
            <span class="flex-1" style="background: {activeLangItem.colors[0]}"
            ></span>
            <span class="flex-1" style="background: {activeLangItem.colors[1]}"
            ></span>
            <span class="flex-1" style="background: {activeLangItem.colors[2]}"
            ></span>
          </div>
          <div
            class="translation-preview text-xs text-white/50 font-medium italic leading-relaxed"
          >
            "{activeLangItem.we}
            {activeLangItem.are}
            {activeLangItem.dogs}"
          </div>
        </div>
      </div>
    </div>

    <!-- Footer / Status Bar -->
    <footer class="panel-footer">
      <div class="sys-status">
        <span class="status-indicator-green"></span>
        <span>WE ARE DOGS STATUS: NOMINAL</span>
      </div>
      <div class="stats-counter">
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

  /* ── Container ── */
  .stats-panel-container {
    width: 94vw;
    height: 90vh;
    max-width: 1280px;
    max-height: 850px;
    background: rgba(10, 10, 14, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    box-shadow:
      0 32px 80px rgba(0, 0, 0, 0.7),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    backdrop-filter: blur(15px) saturate(160%);
    -webkit-backdrop-filter: blur(15px) saturate(160%);
    animation: panelSlideUpIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transform-origin: center bottom;
  }

  .stats-panel-container.closing {
    animation: panelSlideUpDown 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  /* ── Header ── */
  .panel-header {
    height: 64px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand h1 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.95);
    font-family: "Outfit", "Inter", sans-serif;
  }

  .close-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.5);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    transform: translateX(-4px);
  }

  /* ── Footer ── */
  .panel-footer {
    height: 40px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(0, 0, 0, 0.3);
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.35);
    font-weight: 500;
    letter-spacing: 0.05em;
    font-family: system-ui, -apple-system, sans-serif;
    flex-shrink: 0;
  }

  .sys-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: monospace;
  }

  .status-indicator-green {
    width: 6px;
    height: 6px;
    background: #00ff66;
    border-radius: 50%;
    display: inline-block;
  }

  .stats-counter {
    display: flex;
    align-items: center;
    gap: 8px;
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
    color: #ffb300 !important; /* Premium Gold/Yellow Highlight */
    font-weight: 700 !important;
    text-shadow: 0 0 8px rgba(255, 179, 0, 0.45);
  }

  :global(.highlighted-stat-green) {
    color: #00ff66 !important;
    font-weight: 700 !important;
    text-shadow: 0 0 10px rgba(0, 255, 102, 0.45);
  }

  :global(.highlighted-stat-red) {
    color: #ff3344 !important;
    font-weight: 700 !important;
    text-shadow: 0 0 10px rgba(255, 51, 68, 0.45);
  }

  /* ── Responsive Mobile Overrides matching BasePanel ── */
  @media (max-width: 768px) {
    .stats-panel-container {
      width: 100vw;
      height: 100%;
      max-height: 100%;
      border-radius: 0;
      border: none;
      animation: panelSlideUpInMobile 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .stats-panel-container.closing {
      animation: panelSlideUpDownMobile 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .panel-header {
      padding: 0 16px;
    }

    .panel-footer {
      height: auto;
      min-height: 48px;
      padding-top: 8px;
      padding-bottom: max(14px, env(safe-area-inset-bottom, 14px));
    }
  }

  @keyframes panelSlideUpInMobile {
    0% {
      transform: translateY(100%);
      backdrop-filter: blur(0px);
    }
    100% {
      transform: translateY(0);
      backdrop-filter: blur(15px) saturate(160%);
    }
  }

  @keyframes panelSlideUpDownMobile {
    0% {
      transform: translateY(0);
      backdrop-filter: blur(15px) saturate(160%);
    }
    100% {
      transform: translateY(100%);
      backdrop-filter: blur(0px);
    }
  }
</style>
