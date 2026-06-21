<script>
  import translations from "../lib/translations.js";
  import { X, Search, Globe, TrendingUp, Palette, ChevronRight } from "lucide-svelte";

  let { isClosing = false, currentLang = $bindable(), onClose, onHoverLang, onSelectLang } = $props();

  const langs = Object.keys(translations);
  const userLocale = typeof navigator !== "undefined" ? navigator.language : "en";
  const langNames = new Intl.DisplayNames([userLocale], { type: "language" });
  const englishLangNames = new Intl.DisplayNames(["en"], { type: "language" });

  function langDisplayName(code) {
    try {
      return langNames.of(code) || code;
    } catch {
      return code;
    }
  }

  function langEnglishName(code) {
    try {
      return englishLangNames.of(code) || code;
    } catch {
      return code;
    }
  }

  const flagColorMap = {
    france: ["#00209F", "#FFFFFF", "#E0000F"],
    germany: ["#000000", "#FF0000", "#FFCC00"],
    italy: ["#009246", "#F1F2F1", "#CE2B37"],
    spain: ["#AD1519", "#FABD00", "#AD1519"],
    poland: ["#FFFFFF", "#DC143C", "#FFFFFF"],
    ukraine: ["#0057B7", "#FFD700", "#0057B7"],
    japan: ["#FFFFFF", "#BC002D", "#FFFFFF"],
    "united states": ["#0A3161", "#FFFFFF", "#B31942"],
    "united kingdom": ["#012169", "#FFFFFF", "#C8102E"],
    brazil: ["#009739", "#FEDF00", "#012169"],
    china: ["#DE2910", "#FFDE00", "#DE2910"],
    india: ["#FF9933", "#FFFFFF", "#128807"],
    ireland: ["#169B62", "#FFFFFF", "#FF883E"],
    netherlands: ["#AE1C28", "#FFFFFF", "#21468B"],
    sweden: ["#006AA7", "#FECC00", "#006AA7"],
    greece: ["#0D5EAF", "#FFFFFF", "#0D5EAF"],
    canada: ["#FF0000", "#FFFFFF", "#FF0000"],
    "south korea": ["#FFFFFF", "#CD2E3A", "#0F64CD"],
    russia: ["#FFFFFF", "#0039A6", "#D52B1E"],
    mexico: ["#006847", "#FFFFFF", "#CE1126"],
    belgium: ["#000033", "#FDDA24", "#EF3340"],
    austria: ["#ED2939", "#FFFFFF", "#ED2939"],
    switzerland: ["#D52B1E", "#FFFFFF", "#D52B1E"],
    portugal: ["#006600", "#FF0000", "#FFD700"],
    norway: ["#EF2B2D", "#002868", "#FFFFFF"],
    denmark: ["#C60C30", "#FFFFFF", "#C60C30"],
    finland: ["#FFFFFF", "#003580", "#FFFFFF"],
    turkey: ["#E30A17", "#FFFFFF", "#E30A17"],
    australia: ["#00008B", "#FFFFFF", "#FF0000"],
    "new zealand": ["#00008B", "#FFFFFF", "#FF0000"],
    "south africa": ["#E23D28", "#007A4D", "#002395"],
    "saudi arabia": ["#006C35", "#FFFFFF", "#006C35"],
    egypt: ["#C09307", "#FFFFFF", "#000000"],
    vietnam: ["#DA251D", "#FFFF00", "#DA251D"],
    thailand: ["#A51931", "#F4F5F8", "#2D2A4A"],
    philippines: ["#0038A8", "#FFFFFF", "#CE1126"],
    indonesia: ["#FF0000", "#FFFFFF", "#FF0000"],
    malaysia: ["#C8102E", "#FFFFFF", "#012169"],
    singapore: ["#ED2939", "#FFFFFF", "#ED2939"],
    argentina: ["#75AADB", "#FFFFFF", "#75AADB"],
    colombia: ["#FCD116", "#003893", "#CE1126"],
    chile: ["#0039A6", "#FFFFFF", "#D52B1E"],
    peru: ["#D91414", "#FFFFFF", "#D91414"],
    venezuela: ["#FCE300", "#0038A8", "#CE1126"],
    ecuador: ["#FEE11A", "#032A70", "#D61622"],
    bolivia: ["#F7141A", "#F7DE1A", "#279E47"],
    saudi: ["#006C35", "#FFFFFF", "#006C35"],
    uk: ["#012169", "#FFFFFF", "#C8102E"],
    us: ["#0A3161", "#FFFFFF", "#B31942"],
    usa: ["#0A3161", "#FFFFFF", "#B31942"]
  };

  function getHashColors(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
    }
    const h1 = Math.abs(hash) % 360;
    const h2 = (h1 + 120) % 360;
    const h3 = (h1 + 240) % 360;
    return [
      `hsl(${h1}, 85%, 55%)`,
      `hsl(${h2}, 85%, 60%)`,
      `hsl(${h3}, 85%, 55%)`
    ];
  }

  function getFlagColors(code) {
    const t = translations[code];
    if (!t || !t.country) return ["#FFFFFF", "#FFFFFF", "#FFFFFF"];
    const countryLower = t.country.toLowerCase();
    for (const [key, colors] of Object.entries(flagColorMap)) {
      if (countryLower.includes(key)) {
        return colors;
      }
    }
    return getHashColors(t.country);
  }

  // Active Tab state: 'dashboard' | 'explorer' | 'speakers' | 'dogs' | 'themes'
  let activeTab = $state("dashboard");

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

    // Parse speakers to numeric
    let speakersNum = 0;
    if (t.speakers && t.speakers !== "—") {
      let clean = t.speakers.replace(/,/g, "").toLowerCase().trim();
      let mult = 1;
      if (clean.includes("billion")) {
        mult = 1_000_000_000;
        clean = clean.replace("billion", "");
      } else if (clean.includes("million")) {
        mult = 1_000_000;
        clean = clean.replace("million", "");
      }
      const val = parseFloat(clean);
      if (!isNaN(val)) {
        speakersNum = val * mult;
      }
    }

    // Parse dogs count to numeric
    let dogsNum = 0;
    if (t.dogs_count && t.dogs_count !== "—") {
      let clean = t.dogs_count.replace(/,/g, "").toLowerCase().trim();
      let mult = 1;
      if (clean.includes("billion")) {
        mult = 1_000_000_000;
        clean = clean.replace("billion", "");
      } else if (clean.includes("million")) {
        mult = 1_000_000;
        clean = clean.replace("million", "");
      }
      const val = parseFloat(clean);
      if (!isNaN(val)) {
        dogsNum = val * mult;
      }
    }

    return {
      code,
      name,
      displayName: dispName,
      country: t.country || "—",
      dialect: t.dialect || "—",
      speakersText: t.speakers || "—",
      speakersNum,
      dogsText: t.dogs_count || "—",
      dogsNum,
      we: t.we,
      are: t.are,
      dogs: t.dogs,
      colors: getFlagColors(code)
    };
  });

  // Total global metrics calculation
  const totalSpeakers = allLangItems.reduce((acc, curr) => acc + curr.speakersNum, 0);
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
          item.dialect.toLowerCase().includes(q)
      );
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === "string") {
        return sortAscending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
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
    onSelectLang(code);
  }

  function handleHover(code) {
    onHoverLang(code);
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
  let activeLangItem = $derived(allLangItems.find((item) => item.code === currentLang) || allLangItems[0]);
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
        <svg viewBox="0 0 100 100" style="width: 24px; height: 24px; filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4)); flex-shrink: 0;">
          <path d="M 50,38 C 42,38 34,26 16,8 C 21,34 18,48 10,56 C 18,66 32,74 50,94 C 68,74 82,66 90,56 C 82,48 79,34 84,8 C 66,26 58,38 50,38 Z" fill="#ffffff"/>
          <path d="M 34,50 L 44,54 L 35,58 Z" fill="#000000"/>
          <path d="M 66,50 L 56,54 L 65,58 Z" fill="#000000"/>
        </svg>
        <h1>DOGS LLC | LINGUISTIC SYSTEM</h1>
        <span class="path-indicator">/ {activeTab.toUpperCase()}</span>
      </div>
      
      <button class="close-btn" onclick={onClose} aria-label="Close panel">
        <X size={20} />
      </button>
    </header>

    <!-- Inner Grid -->
    <div class="panel-body">
      <!-- Sidebar Navigation -->
      <nav class="panel-sidebar">
        <button class="nav-item" class:active={activeTab === 'dashboard'} onclick={() => activeTab = 'dashboard'}>
          <Globe size={16} />
          <span>Dashboard</span>
        </button>
        <button class="nav-item" class:active={activeTab === 'explorer'} onclick={() => activeTab = 'explorer'}>
          <Search size={16} />
          <span>Languages Explorer</span>
        </button>
        <button class="nav-item" class:active={activeTab === 'speakers'} onclick={() => activeTab = 'speakers'}>
          <TrendingUp size={16} />
          <span>Speakers Analytics</span>
        </button>
        <button class="nav-item" class:active={activeTab === 'dogs'} onclick={() => activeTab = 'dogs'}>
          <span style="font-size: 1.1rem; line-height: 1;">🐕</span>
          <span>Dog Populations</span>
        </button>
        <button class="nav-item" class:active={activeTab === 'themes'} onclick={() => activeTab = 'themes'}>
          <Palette size={16} />
          <span>Color Palettes</span>
        </button>

        <!-- Current selection overlay in sidebar -->
        <div class="current-selection-card">
          <div class="card-head">
            <span class="card-tag">ACTIVE VIEW</span>
            <h3>{activeLangItem.displayName}</h3>
          </div>
          <div class="color-track">
            <span style="background: {activeLangItem.colors[0]}"></span>
            <span style="background: {activeLangItem.colors[1]}"></span>
            <span style="background: {activeLangItem.colors[2]}"></span>
          </div>
          <div class="translation-preview">
            "{activeLangItem.we} {activeLangItem.are} {activeLangItem.dogs}"
          </div>
        </div>
      </nav>

      <!-- Content Area -->
      <main class="panel-content-pane scroll-container">
        <!-- 1. DASHBOARD VIEW -->
        {#if activeTab === 'dashboard'}
          <div class="tab-pane animated-pane">
            <!-- Metric grid showing total catalog sizes and DOGS tech details -->
            <div class="dashboard-stats-grid">
              <div class="metric-card">
                <span class="metric-icon">🌐</span>
                <div class="metric-details">
                  <span class="metric-label">Locales Cataloged</span>
                  <span class="metric-value">{langs.length}</span>
                </div>
              </div>
              <div class="metric-card">
                <span class="metric-icon">⚡</span>
                <div class="metric-details">
                  <span class="metric-label">DOGS LLC HQ</span>
                  <span class="metric-value">TX, USA</span>
                </div>
              </div>
              <div class="metric-card">
                <span class="metric-icon">🔥</span>
                <div class="metric-details">
                  <span class="metric-label">Founder & Architect</span>
                  <span class="metric-value">Capt. Brando</span>
                </div>
              </div>
            </div>

            <div class="dashboard-split">
              <!-- Left side: Interactive info block -->
              <div class="intro-block">
                <h2 style="font-family: 'Outfit', 'Inter', sans-serif; font-weight: 900; letter-spacing: -0.02em; color: #ff3366;">DOGS: PUNK ROCK TECHNOLOGY</h2>
                <p style="margin-bottom: 12px;">
                  We are <strong>DOGS</strong>—a high-profile, simple, insane, dope, bold, new tech company building for the web, apps, hardware, software, and everything awesome. We live to break this world from the inside out. Punk rock style more than anything.
                </p>
                <p style="margin-bottom: 20px; font-style: italic; color: rgba(255, 255, 255, 0.45); line-height: 1.4;">
                  "We live just to die. We have taxes in our eyes. Can't pay rent. Trying to stay alive. We're just doing things now."
                </p>

                <div class="quick-tips" style="border-left: 3px solid #ff3366; background: rgba(255, 51, 102, 0.03);">
                  <h4 style="color: #ff3366; font-weight: 700;">🎤 Project Scope & Stack</h4>
                  <ul style="list-style-type: square; color: rgba(255,255,255,0.65); padding-left: 20px;">
                    <li><strong>DOGS Rap Project:</strong> The official digital node and translation engine for Captain Brando's rap release.</li>
                    <li><strong>DOGS Stack:</strong> High-performance front-ends powered by Svelte, Vite, and absolute vanilla layouts.</li>
                    <li><strong>Oklahoma & Texas Indie Tech:</strong> Crafting custom frontends, hardware integrations, cloud servers, and local AI.</li>
                    <li><strong>Lighthouse Score:</strong> Fully optimized for maximum speed, accessibility, and clean SEO.</li>
                  </ul>
                </div>
              </div>

              <!-- Right side: Detail showcase card + LLC block -->
              <div style="display: flex; flex-direction: column; gap: 16px;">
                <div class="showcase-card">
                  <h3>Selected Locale Metrics</h3>
                  <div class="showcase-info">
                    <div class="info-row">
                      <span class="info-lbl">Country / Region</span>
                      <span class="info-val">{activeLangItem.country}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-lbl">Dialect / Variety</span>
                      <span class="info-val">{activeLangItem.dialect}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-lbl">Estimated Speakers</span>
                      <span class="info-val" style="color: #ffd700;">{activeLangItem.speakersText}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-lbl">Local Dog Population</span>
                      <span class="info-val" style="color: #ffd700;">{activeLangItem.dogsText}</span>
                    </div>
                  </div>
                </div>

                <div class="showcase-card" style="border: 1px solid rgba(255, 215, 0, 0.15); background: rgba(255, 215, 0, 0.02);">
                  <h3 style="color: #ffd700;">DOGS LLC Registry</h3>
                  <p style="font-size: 0.72rem; color: rgba(255,255,255,0.6); line-height: 1.5; margin: 0 0 10px 0;">
                    DOGS is a registered Texas Limited Liability Company (LLC) building next-gen web, app, and hardware platforms. Engineered to be fast, loud, and proud.
                  </p>
                  <div class="info-row">
                    <span class="info-lbl" style="color: rgba(255,215,0,0.5);">Main Portal</span>
                    <span class="info-val">
                      <a href="https://captainbrando.com" target="_blank" rel="noopener noreferrer" style="color: #ffd700; text-decoration: underline; font-weight: 700; font-family: monospace;">
                        captainbrando.com
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}

        <!-- 2. EXPLORER VIEW -->
        {#if activeTab === 'explorer'}
          <div class="tab-pane animated-pane explorer-pane">
            <div class="explorer-toolbar">
              <div class="search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search languages by name, region, dialect, code..."
                  bind:value={searchQuery}
                />
                {#if searchQuery}
                  <button class="clear-search" onclick={() => searchQuery = ""}>&times;</button>
                {/if}
              </div>
              <div class="results-count">
                Showing {filteredLangs.length} of {langs.length} locales
              </div>
            </div>

            <div class="table-wrapper scroll-container">
              <table class="explorer-table">
                <thead>
                  <tr>
                    <th onclick={() => toggleSort('name')} class="sortable">
                      Language {sortField === 'name' ? (sortAscending ? '▲' : '▼') : ''}
                    </th>
                    <th onclick={() => toggleSort('country')} class="sortable">
                      Primary Country / Region {sortField === 'country' ? (sortAscending ? '▲' : '▼') : ''}
                    </th>
                    <th>Dialect Info</th>
                    <th onclick={() => toggleSort('speakersNum')} class="sortable text-right">
                      Speakers {sortField === 'speakersNum' ? (sortAscending ? '▲' : '▼') : ''}
                    </th>
                    <th onclick={() => toggleSort('dogsNum')} class="sortable text-right">
                      Local Dogs {sortField === 'dogsNum' ? (sortAscending ? '▲' : '▼') : ''}
                    </th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {#each filteredLangs as item}
                    <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                    <tr
                      class:active={item.code === currentLang}
                      onmouseover={() => handleHover(item.code)}
                      onclick={() => handleSelect(item.code)}
                    >
                      <td>
                        <div class="lang-cell">
                          <span class="lang-flag-indicator" style="background: {item.colors[0]}"></span>
                          <div class="lang-text-grp">
                            <span class="lang-disp-name">{item.displayName}</span>
                            <span class="lang-code">{item.code.toUpperCase()}</span>
                          </div>
                        </div>
                      </td>
                      <td><span class="country-cell">{item.country}</span></td>
                      <td><span class="dialect-cell">{item.dialect}</span></td>
                      <td class="text-right"><span class="speakers-cell">{item.speakersText}</span></td>
                      <td class="text-right"><span class="dogs-cell">{item.dogsText}</span></td>
                      <td>
                        <button class="row-select-btn" onclick={(e) => { e.stopPropagation(); handleSelect(item.code); }}>
                          <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  {/each}
                  {#if filteredLangs.length === 0}
                    <tr>
                      <td colspan="6" class="empty-table-cell">
                        No languages found matching "{searchQuery}"
                      </td>
                    </tr>
                  {/if}
                </tbody>
              </table>
            </div>
          </div>
        {/if}

        <!-- 3. SPEAKERS ANALYTICS -->
        {#if activeTab === 'speakers'}
          <div class="tab-pane animated-pane">
            <h2>Speakers Distribution</h2>
            <p class="description">
              A breakdown of the top cataloged languages by approximate speaker counts worldwide.
            </p>

            <div class="speakers-chart-container">
              {#each topSpeakers as item}
                <div class="chart-row">
                  <div class="chart-row-lbl">
                    <span class="chart-lang-name">{item.displayName}</span>
                    <span class="chart-lang-val">{item.speakersText}</span>
                  </div>
                  <div class="chart-bar-outer">
                    <div
                      class="chart-bar-inner"
                      style="width: {(item.speakersNum / topSpeakers[0].speakersNum * 100)}%; background: linear-gradient(90deg, {item.colors[0]}, {item.colors[1] || item.colors[0]})"
                    ></div>
                  </div>
                </div>
              {/each}
            </div>

            <div class="linguistic-tiers-info">
              <h3>Database Linguistic Classification</h3>
              <div class="tiers-grid">
                <div class="tier-card">
                  <h5>Global Lingua Francas</h5>
                  <p>English, Spanish, French, Mandarin Chinese, and other primary international networks of trade and commerce.</p>
                </div>
                <div class="tier-card">
                  <h5>Regional Standards</h5>
                  <p>National and provincial standards like Hindi, Bengali, Vietnamese, Polish, and Ukrainian spanning Europe and Asia.</p>
                </div>
                <div class="tier-card">
                  <h5>Indigenous & Classical</h5>
                  <p>Sanskrit, Latin, Old Church Slavonic, Guarani, Navajo, and Quechua representing deep historical roots.</p>
                </div>
              </div>
            </div>
          </div>
        {/if}

        <!-- 4. DOG POPULATIONS -->
        {#if activeTab === 'dogs'}
          <div class="tab-pane animated-pane">
            <h2>Dog Populations by Region</h2>
            <p class="description">
              Analysis of domestic dog populations estimated within the primary geographic regions of each language.
            </p>

            <div class="speakers-chart-container">
              {#each topDogs as item}
                <div class="chart-row">
                  <div class="chart-row-lbl">
                    <span class="chart-lang-name">{item.displayName} ({item.country.split('&')[0].trim()})</span>
                    <span class="chart-lang-val">{item.dogsText}</span>
                  </div>
                  <div class="chart-bar-outer">
                    <div
                      class="chart-bar-inner"
                      style="width: {(item.dogsNum / topDogs[0].dogsNum * 100)}%; background: linear-gradient(90deg, {item.colors[1] || item.colors[0]}, {item.colors[2] || item.colors[0]})"
                    ></div>
                  </div>
                </div>
              {/each}
            </div>

            <div class="dog-facts-box">
              <h3>🐕 Global Canine Facts</h3>
              <div class="facts-list">
                <div class="fact-item">
                  <strong>United States:</strong> Boasts over 90 million domestic dogs, translating to dog ownership in roughly 45% of American households.
                </div>
                <div class="fact-item">
                  <strong>China:</strong> Rapidly growing urban pet ownership registers over 110 million dogs, primarily concentrated in metropolitan hubs.
                </div>
                <div class="fact-item">
                  <strong>Brazil:</strong> Possesses one of the highest dog-to-human ratios in South America, with an estimated 54 million canines.
                </div>
              </div>
            </div>
          </div>
        {/if}

        <!-- 5. PALETTES EXPLORER -->
        {#if activeTab === 'themes'}
          <div class="tab-pane animated-pane">
            <h2>Flag Color Palettes</h2>
            <p class="description">
              Each language features a signature tri-color gradient sweep based on national flags or HSL hash values.
            </p>

            <div class="palettes-grid">
              {#each allLangItems.slice(0, 36) as item}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div class="palette-card" onclick={() => handleSelect(item.code)}>
                  <div class="palette-swatch-box">
                    <div class="swatch-strip" style="background: {item.colors[0]}"></div>
                    <div class="swatch-strip" style="background: {item.colors[1]}"></div>
                    <div class="swatch-strip" style="background: {item.colors[2]}"></div>
                  </div>
                  <div class="palette-card-meta">
                    <span class="p-name">{item.displayName}</span>
                    <span class="p-code">{item.code}</span>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </main>
    </div>

    <!-- Footer / Status Bar -->
    <footer class="panel-footer">
      <div class="sys-status">
        <span class="status-indicator-green"></span>
        <span>DOGS LLC TECH SYSTEM ACTIVE</span>
      </div>
      <div class="stats-counter">
        <span>TX REGISTERED LLC</span>
        <span class="divider">|</span>
        <span>AUTHOR: CAPTAIN BRANDO</span>
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
    box-shadow: 0 32px 80px rgba(0, 0, 0, 0.7),
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

  /* ── Header ── */
  .panel-header {
    height: 64px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(0, 0, 0, 0.2);
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

  .path-indicator {
    font-size: 0.75rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.3);
    font-family: monospace;
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
    transform: rotate(90deg);
  }

  /* ── Body ── */
  .panel-body {
    flex-grow: 1;
    display: flex;
    height: calc(100% - 64px - 40px); /* Subtract header and footer */
  }

  /* ── Sidebar ── */
  .panel-sidebar {
    width: 250px;
    border-right: 1px solid rgba(255, 255, 255, 0.06);
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: rgba(0, 0, 0, 0.1);
  }

  .nav-item {
    background: transparent;
    border: none;
    padding: 12px 16px;
    border-radius: 10px;
    color: rgba(255, 255, 255, 0.6);
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.25s ease;
    text-align: left;
    width: 100%;
  }

  .nav-item:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }

  .nav-item.active {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }

  .current-selection-card {
    margin-top: auto;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 16px;
  }

  .card-head {
    margin-bottom: 12px;
  }

  .card-tag {
    font-size: 0.55rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.1em;
    display: block;
    margin-bottom: 2px;
  }

  .current-selection-card h3 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.9);
  }

  .color-track {
    display: flex;
    height: 4px;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 12px;
    gap: 1px;
  }

  .color-track span {
    flex-grow: 1;
    height: 100%;
  }

  .translation-preview {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.45);
    font-style: italic;
    line-height: 1.4;
    word-break: break-word;
  }

  /* ── Content Pane ── */
  .panel-content-pane {
    flex-grow: 1;
    padding: 28px;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.05);
  }



  /* Animated Entrance for tabs */
  .animated-pane {
    animation: paneFadeIn 0.3s ease forwards;
  }

  @keyframes paneFadeIn {
    0% { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  /* ── Dashboard Content ── */
  .dashboard-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 28px;
  }

  .metric-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 14px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .metric-icon {
    font-size: 2rem;
    opacity: 0.9;
  }

  .metric-details {
    display: flex;
    flex-direction: column;
  }

  .metric-label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.35);
  }

  .metric-value {
    font-size: 1.4rem;
    font-weight: 800;
    color: white;
    font-family: "Outfit", "Inter", sans-serif;
  }

  .dashboard-split {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 24px;
  }

  .intro-block h2 {
    margin: 0 0 12px 0;
    font-size: 1.3rem;
    font-weight: 700;
    color: white;
  }

  .intro-block p {
    font-size: 0.88rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.65);
    margin-bottom: 20px;
  }

  .quick-tips {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 12px;
    padding: 16px 20px;
  }

  .quick-tips h4 {
    margin: 0 0 8px 0;
    font-size: 0.8rem;
    font-weight: 700;
    color: white;
  }

  .quick-tips ul {
    margin: 0;
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .quick-tips li {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.55);
    line-height: 1.4;
  }

  .showcase-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 14px;
    padding: 20px;
  }

  .showcase-card h3 {
    margin: 0 0 16px 0;
    font-size: 0.95rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: white;
  }

  .showcase-info {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .info-row {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .info-lbl {
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.35);
  }

  .info-val {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.8);
  }

  /* ── Explorer Tab ── */
  .explorer-pane {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .explorer-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }

  .search-box {
    position: relative;
    flex-grow: 1;
    max-width: 500px;
    display: flex;
    align-items: center;
  }

  .search-box :global(svg) {
    position: absolute;
    left: 12px;
    color: rgba(255, 255, 255, 0.3);
    pointer-events: none;
  }

  .search-box input {
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    padding: 10px 36px 10px 38px;
    color: white;
    font-size: 0.85rem;
    transition: all 0.2s ease;
  }

  .search-box input:focus {
    border-color: rgba(255, 255, 255, 0.25);
    background: rgba(0, 0, 0, 0.5);
    outline: none;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.05);
  }

  .clear-search {
    position: absolute;
    right: 12px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.4);
    font-size: 1.2rem;
    cursor: pointer;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .clear-search:hover {
    color: white;
  }

  .results-count {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
    font-weight: 500;
  }

  .table-wrapper {
    flex-grow: 1;
    overflow-y: auto;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.15);
  }

  .explorer-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.85rem;
  }

  .explorer-table th {
    position: sticky;
    top: 0;
    background: rgba(20, 20, 25, 0.95);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding: 12px 16px;
    color: rgba(255, 255, 255, 0.45);
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    user-select: none;
    z-index: 10;
  }

  .explorer-table th.sortable {
    cursor: pointer;
  }

  .explorer-table th.sortable:hover {
    color: white;
    background: rgba(30, 30, 35, 0.98);
  }

  .explorer-table td {
    padding: 10px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    color: rgba(255, 255, 255, 0.75);
    vertical-align: middle;
  }

  .explorer-table tr {
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .explorer-table tr:hover td {
    background: rgba(255, 255, 255, 0.04);
    color: white;
  }

  .explorer-table tr.active td {
    background: rgba(255, 255, 255, 0.08);
    color: white;
  }

  .lang-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .lang-flag-indicator {
    width: 8px;
    height: 24px;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .lang-text-grp {
    display: flex;
    flex-direction: column;
  }

  .lang-disp-name {
    font-weight: 600;
    color: rgba(255, 255, 255, 0.95);
  }

  .lang-code {
    font-size: 0.65rem;
    font-family: monospace;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.05em;
  }

  .country-cell, .dialect-cell, .speakers-cell, .dogs-cell {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 220px;
  }

  .text-right {
    text-align: right;
  }

  .row-select-btn {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.25);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
  }

  .explorer-table tr:hover .row-select-btn {
    color: white;
    background: rgba(255, 255, 255, 0.08);
  }

  .empty-table-cell {
    text-align: center;
    padding: 40px !important;
    color: rgba(255, 255, 255, 0.35) !important;
    font-style: italic;
  }

  /* ── Speakers Chart ── */
  .description {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.5);
    margin: 4px 0 24px 0;
  }

  .speakers-chart-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 32px;
  }

  .chart-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .chart-row-lbl {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
  }

  .chart-lang-name {
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
  }

  .chart-lang-val {
    color: rgba(255, 255, 255, 0.5);
    font-family: monospace;
  }

  .chart-bar-outer {
    height: 8px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 4px;
    overflow: hidden;
    width: 100%;
  }

  .chart-bar-inner {
    height: 100%;
    border-radius: 4px;
    transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Tiers Info */
  .linguistic-tiers-info h3, .dog-facts-box h3 {
    font-size: 0.95rem;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 16px 0;
  }

  .tiers-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .tier-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 12px;
    padding: 16px;
  }

  .tier-card h5 {
    margin: 0 0 8px 0;
    font-size: 0.8rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.85);
  }

  .tier-card p {
    margin: 0;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.45);
    line-height: 1.4;
  }

  /* ── Dog Populations Tab ── */
  .dog-facts-box {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 12px;
    padding: 20px;
  }

  .facts-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .fact-item {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.45;
  }

  .fact-item strong {
    color: white;
  }

  /* ── Color Swatches Tab ── */
  .palettes-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
  }

  .palette-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .palette-card:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  .palette-swatch-box {
    height: 48px;
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    margin-bottom: 8px;
  }

  .swatch-strip {
    flex-grow: 1;
    height: 100%;
  }

  .palette-card-meta {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .p-name {
    font-size: 0.72rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.85);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .p-code {
    font-size: 0.55rem;
    font-family: monospace;
    color: rgba(255, 255, 255, 0.35);
    text-transform: uppercase;
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

  .divider {
    color: rgba(255, 255, 255, 0.15);
  }
</style>
