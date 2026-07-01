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
  } from "lucide-svelte";
  import SwipeTabNav from "./SwipeTabNav.svelte";
  import countryStats from "../lib/countryStats.js";
  import ExplorerTab from "./stats/ExplorerTab.svelte";
  import MapTab from "./stats/MapTab.svelte";
  import ComparisonTab from "./stats/ComparisonTab.svelte";
  import AnimalsTab from "./stats/AnimalsTab.svelte";
  import ThemesTab from "./stats/ThemesTab.svelte";

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

  let enrichedCountryStats = countryStats;

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

  // Active language detailed info card details
  let activeLangItem = $derived(
    allLangItems.find((item) => item.code === currentLang) || allLangItems[0],
  );

  // Tab configuration
  const statsTabs = [
    { id: "explorer", label: "Explorer", icon: Search },
    { id: "map", label: "World Map", icon: Globe },
    { id: "comparison", label: "Life & Death", icon: Scale },
    { id: "animals", label: "Animals", icon: TrendingUp },
    { id: "themes", label: "Palettes", icon: Palette },
  ];

  // Map country selection mapping
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
    es: "#FABD00",
    fr: "#2563EB",
    de: "#EF4444",
    ja: "#BC002D",
    zh: "#DE2910",
    pt: "#009739",
    it: "#009246",
    ru: "#8B5CF6",
    ko: "#EC4899",
    hi: "#FF9933",
    ar: "#06B6D4",
    bn: "#047857",
    tr: "#DC2626",
    se: "#0284C7",
    no: "#E11D48",
    da: "#C60C30",
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

  // Mobile swipe gesture navigation
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

    if (Math.abs(diffX) > 75 && Math.abs(diffY) < 50) {
      const currentIndex = statsTabs.findIndex((t) => t.id === activeTab);
      if (currentIndex !== -1) {
        if (diffX < 0) {
          if (currentIndex < statsTabs.length - 1) {
            activeTab = statsTabs[currentIndex + 1].id;
          }
        } else {
          if (currentIndex > 0) {
            activeTab = statsTabs[currentIndex - 1].id;
          }
        }
      }
    }
  }
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
        <button
          class="logo-btn"
          onclick={() => window.dispatchEvent(new CustomEvent("open-info-panel"))}
          aria-label="Open DOGS Info"
        >
          <img
            src="/favicon.svg"
            alt="DOGS Logo"
            class="w-6 h-6 shrink-0 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          />
        </button>
        <h1>stats</h1>
      </div>

      <button class="close-btn" onclick={onClose} aria-label="Close panel">
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
        {#if activeTab === "explorer"}
          <ExplorerTab
            {allLangItems}
            bind:currentLang
            {handleHover}
            {handleSelect}
          />
        {:else if activeTab === "map"}
          <MapTab
            {activeColor}
            {activeLangItem}
            {activeCountries}
            {enrichedCountryStats}
            {countryColorsMap}
            {countryLanguagesMap}
            {handleCountrySelect}
          />
        {:else if activeTab === "comparison"}
          <ComparisonTab {enrichedCountryStats} />
        {:else if activeTab === "animals"}
          <AnimalsTab {allLangItems} />
        {:else if activeTab === "themes"}
          <ThemesTab {allLangItems} {onSelectLang} />
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
            <span class="flex-1" style="background: {activeLangItem.colors[0]}"></span>
            <span class="flex-1" style="background: {activeLangItem.colors[1]}"></span>
            <span class="flex-1" style="background: {activeLangItem.colors[2]}"></span>
          </div>
          <div
            class="translation-preview text-xs text-white/50 font-medium italic leading-relaxed"
          >
            "{activeLangItem.we} {activeLangItem.are} {activeLangItem.dogs}"
          </div>
        </div>
      </div>
    </div>

    <!-- Footer / Status Bar -->
    <footer class="panel-footer">
      <div class="sys-status">
        <span class="status-indicator-green"></span>
        <span>WE ARE DOGS</span>
      </div>
      <div class="stats-counter">
        <span>BARKBARKBARKBARK</span>
      </div>
    </footer>
  </div>
</div>

<style lang="scss">
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
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
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

  /* ── Mobile Layout Bottom Sheet & Tab Bar ── */
  @media (max-width: 768px) {
    .stats-panel-backdrop {
      display: block;
      height: 100dvh;
    }
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

  /* ── Responsive Mobile Overrides matching BasePanel ── */
  @media (max-width: 768px) {
    .stats-panel-container {
      width: 100vw;
      height: 100%;
      max-height: 100%;
      border-radius: 0;
      border: none;
      animation: panelSlideUpInMobile 0.38s cubic-bezier(0.16, 1, 0.3, 1)
        forwards;
    }

    .stats-panel-container.closing {
      animation: panelSlideUpDownMobile 0.32s cubic-bezier(0.16, 1, 0.3, 1)
        forwards;
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
