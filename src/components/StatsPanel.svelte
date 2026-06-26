<script>
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
    TrendingUp,
    Palette,
    ChevronRight,
  } from "lucide-svelte";

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

  // Active Tab state: 'explorer' | 'speakers' | 'dogs' | 'themes'
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
  let activeLangItem = $derived(
    allLangItems.find((item) => item.code === currentLang) || allLangItems[0],
  );

  const tabs = ["explorer", "speakers", "dogs", "themes"];
  let touchStartX = 0;
  let touchStartY = 0;

  function handleTouchStart(e) {
    if (e.touches && e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }

  function handleTouchEnd(e) {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    const threshold = 50;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > threshold) {
        const currentIndex = tabs.indexOf(activeTab);
        if (diffX < 0) {
          // Swipe Left -> Go to next tab
          if (currentIndex < tabs.length - 1) {
            activeTab = tabs[currentIndex + 1];
          }
        } else {
          // Swipe Right -> Go to prev tab
          if (currentIndex > 0) {
            activeTab = tabs[currentIndex - 1];
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
    ontouchstart={handleTouchStart}
    ontouchend={handleTouchEnd}
  >
    <!-- Header -->
    <header class="panel-header">
      <div class="brand">
        <img
          src="/favicon.svg"
          alt="DOGS Logo"
          class="w-6 h-6 shrink-0 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
        />
        <h1>DOGS</h1>
      </div>

      <button class="close-btn" onclick={onClose} aria-label="Close panel">
        <ArrowLeft size={20} />
      </button>
    </header>

    <!-- Inner Grid -->
    <div class="panel-body">
      <!-- Sidebar Navigation -->
      <nav class="panel-sidebar">
        <button
          class="nav-item"
          class:active={activeTab === "explorer"}
          onclick={() => (activeTab = "explorer")}
        >
          <Search size={16} />
          <span>Languages Explorer</span>
        </button>
        <button
          class="nav-item"
          class:active={activeTab === "speakers"}
          onclick={() => (activeTab = "speakers")}
        >
          <TrendingUp size={16} />
          <span>Speakers Analytics</span>
        </button>
        <button
          class="nav-item"
          class:active={activeTab === "dogs"}
          onclick={() => (activeTab = "dogs")}
        >
          <span class="text-[1.1rem] leading-none">🐕</span>
          <span>Dog Populations</span>
        </button>
        <button
          class="nav-item"
          class:active={activeTab === "themes"}
          onclick={() => (activeTab = "themes")}
        >
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
            "{activeLangItem.we}
            {activeLangItem.are}
            {activeLangItem.dogs}"
          </div>
        </div>
      </nav>

      <!-- Content Area -->
      <main class="panel-content-pane scroll-container">
        <!-- 2. EXPLORER VIEW -->
        {#if activeTab === "explorer"}
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
                  <button
                    class="clear-search"
                    onclick={() => (searchQuery = "")}>&times;</button
                  >
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
                    <th onclick={() => toggleSort("name")} class="sortable">
                      Language {sortField === "name"
                        ? sortAscending
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                    <th onclick={() => toggleSort("country")} class="sortable">
                      Primary Country / Region {sortField === "country"
                        ? sortAscending
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                    <th>Dialect Info</th>
                    <th
                      onclick={() => toggleSort("speakersNum")}
                      class="sortable text-right"
                    >
                      Speakers {sortField === "speakersNum"
                        ? sortAscending
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                    <th
                      onclick={() => toggleSort("dogsNum")}
                      class="sortable text-right"
                    >
                      Local Dogs {sortField === "dogsNum"
                        ? sortAscending
                          ? "▲"
                          : "▼"
                        : ""}
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
                          <span
                            class="lang-flag-indicator"
                            style="background: {item.colors[0]}"
                          ></span>
                          <div class="lang-text-grp">
                            <span class="lang-disp-name"
                              >{item.displayName}</span
                            >
                            <span class="lang-code-desc">
                              <span class="lang-code">
                                {item.code.toUpperCase()}
                              </span>
                              <span class="meta-tablet">
                                • {item.country}
                                {#if item.dialect}• {item.dialect}{/if}
                              </span>
                              <span class="meta-mobile">
                                • {item.speakersText} speakers • {item.dogsText}
                                dogs
                              </span>
                            </span>
                          </div>
                        </div>
                      </td>
                      <td><span class="country-cell">{item.country}</span></td>
                      <td><span class="dialect-cell">{item.dialect}</span></td>
                      <td class="text-right"
                        ><span class="speakers-cell">{item.speakersText}</span
                        ></td
                      >
                      <td class="text-right"
                        ><span class="dogs-cell">{item.dogsText}</span></td
                      >
                      <td>
                        <button
                          class="row-select-btn"
                          onclick={(e) => {
                            e.stopPropagation();
                            handleSelect(item.code);
                          }}
                        >
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

            <div class="explorer-cards-mobile scroll-container">
              {#each filteredLangs as item}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  class="lang-mobile-card"
                  class:active={item.code === currentLang}
                  onclick={() => handleSelect(item.code)}
                  style="--brand-color: {item.colors[0]}"
                >
                  <div class="card-header">
                    <div class="lang-title">
                      <span
                        class="flag-indicator"
                        style="background: {item.colors[0]}"
                      ></span>
                      <div class="lang-meta-text">
                        <span class="lang-disp-name">{item.displayName}</span>
                        <span class="lang-code-val"
                          >{item.code.toUpperCase()}</span
                        >
                      </div>
                    </div>
                    <button
                      class="select-btn"
                      onclick={(e) => {
                        e.stopPropagation();
                        handleSelect(item.code);
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div class="card-body-grid">
                    <div class="grid-item">
                      <span class="label">🌐 Country</span>
                      <span class="value" title={item.country}
                        >{item.country}</span
                      >
                    </div>
                    <div class="grid-item">
                      <span class="label">💬 Dialect</span>
                      <span class="value" title={item.dialect}
                        >{item.dialect || "—"}</span
                      >
                    </div>
                    <div class="grid-item">
                      <span class="label">🗣️ Speakers</span>
                      <span class="value">{item.speakersText}</span>
                    </div>
                    <div class="grid-item">
                      <span class="label">🐕 Local Dogs</span>
                      <span class="value">{item.dogsText}</span>
                    </div>
                  </div>
                </div>
              {/each}
              {#if filteredLangs.length === 0}
                <div class="empty-cards-cell">
                  No languages found matching "{searchQuery}"
                </div>
              {/if}
            </div>
          </div>
        {/if}

        <!-- 3. SPEAKERS ANALYTICS -->
        {#if activeTab === "speakers"}
          <div class="tab-pane animated-pane">
            <h2>Speakers Distribution</h2>
            <p class="description">
              A breakdown of the top cataloged languages by approximate speaker
              counts worldwide.
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
                      style="width: {(item.speakersNum /
                        topSpeakers[0].speakersNum) *
                        100}%; background: linear-gradient(90deg, {item
                        .colors[0]}, {item.colors[1] || item.colors[0]})"
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
                  <p>
                    English, Spanish, French, Mandarin Chinese, and other
                    primary international networks of trade and commerce.
                  </p>
                </div>
                <div class="tier-card">
                  <h5>Regional Standards</h5>
                  <p>
                    National and provincial standards like Hindi, Bengali,
                    Vietnamese, Polish, and Ukrainian spanning Europe and Asia.
                  </p>
                </div>
                <div class="tier-card">
                  <h5>Indigenous & Classical</h5>
                  <p>
                    Sanskrit, Latin, Old Church Slavonic, Guarani, Navajo, and
                    Quechua representing deep historical roots.
                  </p>
                </div>
              </div>
            </div>
          </div>
        {/if}

        <!-- 4. DOG POPULATIONS -->
        {#if activeTab === "dogs"}
          <div class="tab-pane animated-pane">
            <h2>Dog Populations by Region</h2>
            <p class="description">
              Analysis of domestic dog populations estimated within the primary
              geographic regions of each language.
            </p>

            <div class="speakers-chart-container">
              {#each topDogs as item}
                <div class="chart-row">
                  <div class="chart-row-lbl">
                    <span class="chart-lang-name"
                      >{item.displayName} ({item.country
                        .split("&")[0]
                        .trim()})</span
                    >
                    <span class="chart-lang-val">{item.dogsText}</span>
                  </div>
                  <div class="chart-bar-outer">
                    <div
                      class="chart-bar-inner"
                      style="width: {(item.dogsNum / topDogs[0].dogsNum) *
                        100}%; background: linear-gradient(90deg, {item
                        .colors[1] || item.colors[0]}, {item.colors[2] ||
                        item.colors[0]})"
                    ></div>
                  </div>
                </div>
              {/each}
            </div>

            <div class="dog-facts-box">
              <h3>🐕 Global Canine Facts</h3>
              <div class="facts-list">
                <div class="fact-item">
                  <strong>United States:</strong> Boasts over 90 million domestic
                  dogs, translating to dog ownership in roughly 45% of American households.
                </div>
                <div class="fact-item">
                  <strong>China:</strong> Rapidly growing urban pet ownership registers
                  over 110 million dogs, primarily concentrated in metropolitan hubs.
                </div>
                <div class="fact-item">
                  <strong>Brazil:</strong> Possesses one of the highest dog-to-human
                  ratios in South America, with an estimated 54 million canines.
                </div>
              </div>
            </div>
          </div>
        {/if}

        <!-- 5. PALETTES EXPLORER -->
        {#if activeTab === "themes"}
          <div class="tab-pane animated-pane">
            <h2>Flag Color Palettes</h2>
            <p class="description">
              Each language features a signature tri-color gradient sweep based
              on national flags or HSL hash values.
            </p>

            <div class="palettes-grid">
              {#each allLangItems.slice(0, 36) as item}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  class="palette-card"
                  onclick={() => handleSelect(item.code)}
                >
                  <div class="palette-swatch-box">
                    <div
                      class="swatch-strip"
                      style="background: {item.colors[0]}"
                    ></div>
                    <div
                      class="swatch-strip"
                      style="background: {item.colors[1]}"
                    ></div>
                    <div
                      class="swatch-strip"
                      style="background: {item.colors[2]}"
                    ></div>
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
        <span>WE ARE DOGS</span>
      </div>
      <div class="stats-counter">
        <span>BARKBARKBARKBARKBARKBBARKBARKBARKBARKBARKBARKBARKBBARKBARK</span>
        <span class="divider">|</span>
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
    border: 1px solid rgba(255, 255, 255, 0.15);
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
    overflow-x: hidden;
    background: rgba(0, 0, 0, 0.05);
  }

  /* Animated Entrance for tabs */
  .animated-pane {
    animation: paneFadeIn 0.3s ease forwards;
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
    overflow-x: hidden;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.15);
  }

  .explorer-cards-mobile {
    display: none;
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
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.15);
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

  .meta-tablet,
  .meta-mobile {
    display: none;
  }

  .country-cell,
  .dialect-cell,
  .speakers-cell,
  .dogs-cell {
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
  .linguistic-tiers-info h3,
  .dog-facts-box h3 {
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
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.1);
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
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
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

  @media (max-width: 1024px) {
    /* Hide Country and Dialect columns to prevent horizontal scroll on tablets */
    .explorer-table th:nth-child(2),
    .explorer-table td:nth-child(2),
    .explorer-table th:nth-child(3),
    .explorer-table td:nth-child(3) {
      display: none;
    }

    .meta-tablet {
      display: inline;
    }
  }

  /* ── Mobile Layout Bottom Sheet & Tab Bar ── */
  @media (max-width: 768px) {
    .stats-panel-backdrop {
      display: block;
      height: 100dvh;
    }

    .stats-panel-container {
      width: 100vw;
      height: 92vh;
      max-height: 92vh;
      border-radius: 20px 20px 0 0;
      border-bottom: none;
      position: fixed;
      bottom: 0;
      left: 0;
      transform-origin: center bottom;
      animation: panelSlideUpInMobile 0.38s cubic-bezier(0.16, 1, 0.3, 1)
        forwards;
    }

    :global(:fullscreen) .stats-panel-container,
    :global(:-webkit-full-screen) .stats-panel-container {
      height: 100dvh !important;
      max-height: 100dvh !important;
      border-radius: 0 !important;
    }

    .stats-panel-container.closing {
      animation: panelSlideUpDownMobile 0.32s cubic-bezier(0.16, 1, 0.3, 1)
        forwards;
    }

    .panel-body {
      flex-direction: column;
      flex-grow: 1;
      min-height: 0;
      height: auto;
    }

    .panel-sidebar {
      width: 100%;
      height: auto;
      flex-direction: row;
      overflow-x: auto;
      border-right: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding: 8px;
      gap: 8px;
      background: rgba(0, 0, 0, 0.2);
      flex-shrink: 0;
      scrollbar-width: none;
    }

    .panel-sidebar::-webkit-scrollbar {
      display: none;
    }

    .nav-item {
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 0.8rem;
      white-space: nowrap;
      width: auto;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .current-selection-card {
      display: none;
    }

    .panel-content-pane {
      padding: 16px;
    }

    .table-wrapper {
      display: none;
    }

    .explorer-cards-mobile {
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow-y: auto;
      flex-grow: 1;
      padding-bottom: 20px;
    }

    .lang-mobile-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      cursor: pointer;
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      box-sizing: border-box;
      width: 100%;
      -webkit-tap-highlight-color: transparent;
    }

    .lang-mobile-card:active {
      transform: scale(0.98);
      background: rgba(255, 255, 255, 0.06);
    }

    .lang-mobile-card.active {
      border-color: var(--brand-color);
      background: rgba(255, 255, 255, 0.06);
      box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .lang-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .flag-indicator {
      width: 8px;
      height: 24px;
      border-radius: 4px;
      flex-shrink: 0;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 0 4px rgba(255, 255, 255, 0.15);
    }

    .lang-meta-text {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .lang-disp-name {
      font-size: 0.9rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.95);
    }

    .lang-code-val {
      font-size: 0.65rem;
      font-family: monospace;
      color: rgba(255, 255, 255, 0.4);
    }

    .select-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.5);
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .lang-mobile-card.active .select-btn {
      background: var(--brand-color);
      color: white;
      border-color: transparent;
      box-shadow: 0 0 8px var(--brand-color);
    }

    .card-body-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      padding-top: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .grid-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .grid-item .label {
      font-size: 0.55rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: rgba(255, 255, 255, 0.3);
    }

    .grid-item .value {
      font-size: 0.72rem;
      color: rgba(255, 255, 255, 0.7);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .empty-cards-cell {
      text-align: center;
      padding: 30px;
      color: rgba(255, 255, 255, 0.35);
      font-style: italic;
      font-size: 0.8rem;
    }

    .explorer-toolbar {
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
    }

    .search-box {
      max-width: 100%;
    }

    .results-count {
      text-align: right;
    }

    .tiers-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .palettes-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .lang-code-desc {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-wrap: wrap;
    }

    .meta-mobile {
      display: inline;
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.4);
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
