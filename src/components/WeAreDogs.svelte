<script>
  import translations from "../lib/translations.js";
  import "../lib/i18n.js";
  import { Pause, Play, ChevronLeft, ChevronRight, Flag } from "lucide-svelte";

  const langs = Object.keys(translations);

  const flagColorMap = {
    "france": ["#00209F", "#FFFFFF", "#E0000F"],
    "germany": ["#000000", "#FF0000", "#FFCC00"],
    "italy": ["#009246", "#F1F2F1", "#CE2B37"],
    "spain": ["#AD1519", "#FABD00", "#AD1519"],
    "poland": ["#FFFFFF", "#DC143C", "#FFFFFF"],
    "ukraine": ["#0057B7", "#FFD700", "#0057B7"],
    "japan": ["#FFFFFF", "#BC002D", "#FFFFFF"],
    "united states": ["#0A3161", "#FFFFFF", "#B31942"],
    "united kingdom": ["#012169", "#FFFFFF", "#C8102E"],
    "brazil": ["#009739", "#FEDF00", "#012169"],
    "china": ["#DE2910", "#FFDE00", "#DE2910"],
    "india": ["#FF9933", "#FFFFFF", "#128807"],
    "ireland": ["#169B62", "#FFFFFF", "#FF883E"],
    "netherlands": ["#AE1C28", "#FFFFFF", "#21468B"],
    "sweden": ["#006AA7", "#FECC00", "#006AA7"],
    "greece": ["#0D5EAF", "#FFFFFF", "#0D5EAF"],
    "canada": ["#FF0000", "#FFFFFF", "#FF0000"],
    "south korea": ["#FFFFFF", "#CD2E3A", "#0F64CD"],
    "russia": ["#FFFFFF", "#0039A6", "#D52B1E"],
    "mexico": ["#006847", "#FFFFFF", "#CE1126"],
    "belgium": ["#000000", "#FDDA24", "#EF3340"],
    "austria": ["#ED2939", "#FFFFFF", "#ED2939"],
    "switzerland": ["#D52B1E", "#FFFFFF", "#D52B1E"],
    "portugal": ["#006600", "#FF0000", "#FFD700"],
    "norway": ["#EF2B2D", "#002868", "#FFFFFF"],
    "denmark": ["#C60C30", "#FFFFFF", "#C60C30"],
    "finland": ["#FFFFFF", "#003580", "#FFFFFF"],
    "turkey": ["#E30A17", "#FFFFFF", "#E30A17"],
    "australia": ["#00008B", "#FFFFFF", "#FF0000"],
    "new zealand": ["#00008B", "#FFFFFF", "#FF0000"],
    "south africa": ["#E23D28", "#007A4D", "#002395"],
    "saudi arabia": ["#006C35", "#FFFFFF", "#006C35"],
    "egypt": ["#C09307", "#FFFFFF", "#000000"],
    "vietnam": ["#DA251D", "#FFFF00", "#DA251D"],
    "thailand": ["#A51931", "#F4F5F8", "#2D2A4A"],
    "philippines": ["#0038A8", "#FFFFFF", "#CE1126"],
    "indonesia": ["#FF0000", "#FFFFFF", "#FF0000"],
    "malaysia": ["#C8102E", "#FFFFFF", "#012169"],
    "singapore": ["#ED2939", "#FFFFFF", "#ED2939"],
    "argentina": ["#75AADB", "#FFFFFF", "#75AADB"],
    "colombia": ["#FCD116", "#003893", "#CE1126"],
    "chile": ["#0039A6", "#FFFFFF", "#D52B1E"],
    "peru": ["#D91414", "#FFFFFF", "#D91414"],
    "venezuela": ["#FCE300", "#0038A8", "#CE1126"],
    "ecuador": ["#FEE11A", "#032A70", "#D61622"],
    "bolivia": ["#F7141A", "#F7DE1A", "#279E47"],
    "saudi": ["#006C35", "#FFFFFF", "#006C35"],
    "uk": ["#012169", "#FFFFFF", "#C8102E"],
    "us": ["#0A3161", "#FFFFFF", "#B31942"],
    "usa": ["#0A3161", "#FFFFFF", "#B31942"]
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

  function getFlagColors(lang) {
    const t = translations[lang];
    if (!t || !t.country) return ["#FFFFFF", "#FFFFFF", "#FFFFFF"];
    const countryLower = t.country.toLowerCase();
    for (const [key, colors] of Object.entries(flagColorMap)) {
      if (countryLower.includes(key)) {
        return colors;
      }
    }
    return getHashColors(t.country);
  }

  // Detect initial language from browser
  const browserLang =
    typeof navigator !== "undefined" ? navigator.language.split("-")[0] : "en";
  const userLocale =
    typeof navigator !== "undefined" ? navigator.language : "en";
  const initialLang = langs.includes(browserLang) ? browserLang : "en";

  // Intl.DisplayNames gives us full language names in the user's locale
  const langNames = new Intl.DisplayNames([userLocale], { type: "language" });

  /** Get full display name for a language code, falling back to the code itself */
  function langDisplayName(code) {
    try {
      return langNames.of(code) || code;
    } catch {
      return code;
    }
  }

  // Current word states — all three words use the same language
  let currentLang = $state(initialLang);
  let currentWe = $state(translations[initialLang].we);
  let currentAre = $state(translations[initialLang].are);
  let currentDogs = $state(translations[initialLang].dogs);

  // Pronunciation state
  let pronWe = $state(translations[initialLang].we_p);
  let pronAre = $state(translations[initialLang].are_p);
  let pronDogs = $state(translations[initialLang].dogs_p);

  // Animation generation counters — incrementing triggers {#key} remount
  let weGen = $state(0);
  let areGen = $state(0);
  let dogsGen = $state(0);

  let hoverTimer = $state(null);
  let isHovering = $state(false);
  let isPaused = $state(false);

  // Navigation history tracking
  let history = $state([initialLang]);
  let historyIndex = $state(0);

  // Flashing indicator in top-right
  let flashIcon = $state(null); // 'pause', 'play', 'forward', 'backward', 'flag_on', 'flag_off'
  let flashVisible = $state(false);
  let flashTimeout = null;
  let flashKey = $state(0);

  function triggerFlash(type) {
    if (flashTimeout) clearTimeout(flashTimeout);
    flashIcon = type;
    flashVisible = true;
    flashKey++;
    flashTimeout = setTimeout(() => {
      flashVisible = false;
    }, 800); // 800ms flash duration
  }

  // Flag Colors toggle state and derived colors list
  let isFlagColors = $state(false);
  let flagColors = $derived(getFlagColors(currentLang));

  function toggleFlagColors(val) {
    const nextVal = typeof val === "boolean" ? val : !isFlagColors;
    if (isFlagColors === nextVal) return;
    isFlagColors = nextVal;
    if (isFlagColors) {
      triggerFlash("flag_on");
    } else {
      triggerFlash("flag_off");
    }
  }

  function randLang() {
    const available = langs.filter((l) => l !== currentLang);
    return available[Math.floor(Math.random() * available.length)];
  }

  /** Set all words to a given language */
  function setLang(lang) {
    currentLang = lang;
    currentWe = translations[lang].we;
    currentAre = translations[lang].are;
    currentDogs = translations[lang].dogs;
    pronWe = translations[lang].we_p;
    pronAre = translations[lang].are_p;
    pronDogs = translations[lang].dogs_p;
    weGen++;
    areGen++;
    dogsGen++;
  }

  /** Go to index in the navigation history */
  function goToIndex(idx) {
    if (idx < 0 || idx >= history.length) return;
    historyIndex = idx;
    setLang(history[historyIndex]);
  }

  /** Swap all words to a random language */
  function cycle() {
    const next = randLang();
    history = history.slice(0, historyIndex + 1);
    history.push(next);
    goToIndex(history.length - 1);
  }

  function startCycling() {
    clearInterval(hoverTimer);
    cycle();
    hoverTimer = setInterval(cycle, 1000);
  }

  function stopCycling() {
    clearInterval(hoverTimer);
  }

  function onEnter() {
    isHovering = true;
    if (!isPaused) {
      startCycling();
    }
  }

  function onLeave() {
    isHovering = false;
    stopCycling();
    if (!isPaused) {
      // Snap back to user locale
      setLang(initialLang);
      history = [initialLang];
      historyIndex = 0;
    }
    // If paused, language stays locked
  }

  function onClick() {
    if (!isPaused) {
      // PAUSE — freeze on current language
      isPaused = true;
      stopCycling();
      triggerFlash("pause");
    } else {
      // UNPAUSE — resume cycling
      isPaused = false;
      triggerFlash("play");
      if (isHovering || isTouchDevice) {
        startCycling();
      } else {
        // Mouse already left while paused — snap back
        setLang(initialLang);
        history = [initialLang];
        historyIndex = 0;
      }
    }
  }

  /** Get metadata for the current language */
  function getMeta(lang) {
    const t = translations[lang];
    return {
      country: t.country || "—",
      dialect: t.dialect || "—",
      speakers:
        t.speakers && t.speakers !== "—"
          ? (() => {
              let clean = t.speakers.replace(/,/g, "").toLowerCase();
              let multiplier = 1;

              if (clean.includes("billion")) {
                multiplier = 1_000_000_000;
                clean = clean.replace("billion", "");
              } else if (clean.includes("million")) {
                multiplier = 1_000_000;
                clean = clean.replace("million", "");
              }

              const numValue = parseFloat(clean) * multiplier;

              if (isNaN(numValue)) return t.speakers;
              const percentage = ((numValue / 8_300_000_000) * 100).toFixed(3);
              return `${t.speakers} (${percentage}%)`;
            })()
          : "—",

      dogs_count:
        t.dogs_count && t.dogs_count !== "—"
          ? (() => {
              // 1. Remove commas and lowercase everything for parsing
              let clean = t.dogs_count.replace(/,/g, "").toLowerCase();
              let multiplier = 1;

              // 2. Detect scale suffixes and assign exact math multipliers
              if (clean.includes("billion")) {
                multiplier = 1_000_000_000;
                clean = clean.replace("billion", "");
              } else if (clean.includes("million")) {
                multiplier = 1_000_000;
                clean = clean.replace("million", "");
              } else if (clean.includes("sleigh dogs")) {
                clean = clean.replace("sleigh dogs", "");
              }

              // 3. Convert remaining string to a float number
              const numValue = parseFloat(clean) * multiplier;

              // 4. Calculate percentage based on ~900,000,000 global dogs
              if (isNaN(numValue)) return t.dogs_count;
              const percentage = ((numValue / 900_000_000) * 100).toFixed(3);
              return `${t.dogs_count} (${percentage}%)`;
            })()
          : "—",
    };
  }

  let meta = $derived(getMeta(currentLang));

  /** Split a word into grapheme clusters (handles CJK, emoji, diacritics) */
  function toLetters(word) {
    try {
      const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
      return [...seg.segment(word)].map((s) => s.segment);
    } catch {
      return [...word];
    }
  }

  /** Random stagger offset per letter for chaotic feel */
  function stagger(i, len) {
    const base = i * 25;
    const jitter = Math.random() * 30;
    return Math.round(base + jitter);
  }

  /** Random subtle rotation axis variation per letter */
  function letterStyle(i, len) {
    const delay = stagger(i, len);
    const tiltX = 75 + Math.random() * 30;
    const tiltZ = -8 + Math.random() * 16;
    return `animation-delay:${delay}ms;--flip-x:${tiltX.toFixed(1)}deg;--flip-z:${tiltZ.toFixed(1)}deg;`;
  }

  // Define the functions you want to run
  function handleLeftArrow() {
    if (historyIndex > 0) {
      isPaused = true;
      stopCycling();
      triggerFlash("backward");
      goToIndex(historyIndex - 1);
    }
  }

  function handleRightArrow() {
    isPaused = true;
    stopCycling();
    triggerFlash("forward");
    if (historyIndex < history.length - 1) {
      goToIndex(historyIndex + 1);
    } else {
      cycle();
    }
  }

  let touchStartX = 0;
  let touchStartY = 0;
  let isTouchDevice = $state(false);

  function handleTouchStart(e) {
    isTouchDevice = true;
    if (e.touches && e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
    // Start cycling on first touch if not paused
    if (!isPaused && !hoverTimer) {
      startCycling();
    }
  }

  function handleTouchEnd(e) {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    const threshold = 40;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (Math.abs(diffX) > threshold) {
        if (diffX < 0) {
          // Swipe Left -> Next
          handleRightArrow();
        } else {
          // Swipe Right -> Prev
          handleLeftArrow();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(diffY) > threshold) {
        if (diffY < 0) {
          // Swipe Up -> Flag Colors ON
          toggleFlagColors(true);
        } else {
          // Swipe Down -> Flag Colors OFF
          toggleFlagColors(false);
        }
      }
    }
  }

  function handleKeydown(e) {
    if (e.key === "ArrowLeft") {
      handleLeftArrow();
    } else if (e.key === "ArrowRight") {
      handleRightArrow();
    } else if (e.key === "ArrowUp") {
      toggleFlagColors(true);
    } else if (e.key === "ArrowDown") {
      toggleFlagColors(false);
    } else if (e.key === " ") {
      e.preventDefault();
      onClick();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Top Right Status Flash Overlay -->
{#key flashKey}
  {#if flashVisible}
    <div class="status-flash">
      {#if flashIcon === "pause"}
        <Pause size={28} />
      {:else if flashIcon === "play"}
        <Play size={28} />
      {:else if flashIcon === "forward"}
        <ChevronRight size={28} />
      {:else if flashIcon === "backward"}
        <ChevronLeft size={28} />
      {:else if flashIcon === "flag_on"}
        <Flag size={28} style="fill: currentColor;" />
      {:else if flashIcon === "flag_off"}
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <Flag size={28} />
          <div style="position: absolute; width: 30px; height: 2px; background: currentColor; transform: rotate(-45deg); opacity: 0.85;"></div>
        </div>
      {/if}
    </div>
  {/if}
{/key}

<!-- Top Right Corner Click/Tap Target (Flag Colors Toggle) -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="top-right-trigger" onclick={() => toggleFlagColors()}></div>

<!-- Language indicator — full name + expandable info panel -->
<div class="lang-display" class:paused={isPaused}>
  <span class="lang-name">{langDisplayName(currentLang)}</span>

  {#if isPaused}
    <div class="lang-meta">
      <div class="meta-row" style="animation-delay: 0ms">
        <span class="meta-label">🌐 Region</span>
        <span class="meta-value">{meta.country}</span>
      </div>
      <div class="meta-row" style="animation-delay: 60ms">
        <span class="meta-label">💬 Dialect</span>
        <span class="meta-value">{meta.dialect}</span>
      </div>
      <div class="meta-row" style="animation-delay: 120ms">
        <span class="meta-label">🗣️ Speakers</span>
        <span class="meta-value">{meta.speakers}</span>
      </div>
      <div class="meta-row" style="animation-delay: 180ms">
        <span class="meta-label">🐕 Dogs</span>
        <span class="meta-value">{meta.dogs_count}</span>
      </div>
    </div>
  {/if}
</div>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="wad-container"
  onmouseenter={onEnter}
  onmouseleave={onLeave}
  onclick={onClick}
  ontouchstart={handleTouchStart}
  ontouchend={handleTouchEnd}
  role="presentation"
>
  <!-- WORD 1: "We" -->
  {#key weGen}
    <h1 class="word" aria-label={currentWe}>
      {#each toLetters(currentWe) as letter, i}
        <span
          class="letter"
          style="{letterStyle(i, toLetters(currentWe).length)} --trans-delay: {i * 30}ms; color: {isFlagColors ? flagColors[0] : 'white'}; text-shadow: {isFlagColors ? `0 0 15px ${flagColors[0]}44` : 'none'}"
        >
          {letter}
        </span>
      {/each}
    </h1>
  {/key}

  <!-- WORD 2: "Are" -->
  {#key areGen}
    <h1 class="word" aria-label={currentAre}>
      {#each toLetters(currentAre) as letter, i}
        <span
          class="letter"
          style="{letterStyle(i, toLetters(currentAre).length)} --trans-delay: {i * 30}ms; color: {isFlagColors ? flagColors[1] : 'white'}; text-shadow: {isFlagColors ? `0 0 15px ${flagColors[1]}44` : 'none'}"
        >
          {letter}
        </span>
      {/each}
    </h1>
  {/key}

  <!-- WORD 3: "Dogs" -->
  {#key dogsGen}
    <h1 class="word" aria-label={currentDogs}>
      {#each toLetters(currentDogs) as letter, i}
        <span
          class="letter"
          style="{letterStyle(i, toLetters(currentDogs).length)} --trans-delay: {i * 30}ms; color: {isFlagColors ? flagColors[2] : 'white'}; text-shadow: {isFlagColors ? `0 0 15px ${flagColors[2]}44` : 'none'}"
        >
          {letter}
        </span>
      {/each}
    </h1>
  {/key}

  <!-- Pronunciation -->
  <p class="pronunciation">({pronWe} {pronAre} {pronDogs})</p>
</div>

<style>
  /* ── Language Display & Info Panel ── */
  .lang-display {
    position: fixed;
    top: 1.25rem;
    left: 1.25rem;
    z-index: 50;
    max-width: 280px;
  }

  .lang-name {
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: rgba(255, 255, 255, 0.4);
    transition: color 0.25s ease;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .lang-display.paused .lang-name {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
  }

  .lang-display:hover .lang-name {
    color: rgba(255, 255, 255, 0.75);
  }

  /* ── Metadata slide-out panel ── */
  .lang-meta {
    margin-top: 0.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .meta-row {
    display: flex;
    flex-direction: column;
    gap: 0.05rem;
    animation: metaSlideIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) both;
    transform-style: preserve-3d;
  }

  .meta-label {
    font-size: 0.55rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.3);
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .meta-value {
    font-size: 0.75rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.7);
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
    line-height: 1.3;
  }

  @keyframes metaSlideIn {
    0% {
      transform: rotateX(70deg) translateY(-8px);
      opacity: 0;
      filter: blur(4px);
    }
    50% {
      opacity: 0.6;
      filter: blur(1px);
    }
    100% {
      transform: rotateX(0deg) translateY(0);
      opacity: 1;
      filter: blur(0);
    }
  }

  /* ── Pronunciation ── */
  .pronunciation {
    margin: 3rem 0 0 0;
    padding: 0;
    font-size: clamp(0.7rem, 2vw, 1rem);
    font-weight: 400;
    font-style: italic;
    color: rgba(255, 255, 255, 0.35);
    text-align: center;
    letter-spacing: 0.06em;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  /* ── Main Container ── */
  .wad-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
    cursor: pointer;
    perspective: 900px;
    user-select: none;
    -webkit-user-select: none;
  }

  .word {
    display: flex;
    align-items: baseline;
    justify-content: center;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
    font-size: clamp(3rem, 12vw, 9rem);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: white;
    white-space: nowrap;
  }

  .letter {
    display: inline-block;
    transform-style: preserve-3d;
    animation: matrixFlip 0.32s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: var(--delay, 0ms);
    will-change: transform, opacity;
    transition: color 0.5s cubic-bezier(0.25, 1, 0.5, 1), text-shadow 0.5s cubic-bezier(0.25, 1, 0.5, 1);
    transition-delay: var(--trans-delay, 0ms);
  }

  @keyframes matrixFlip {
    0% {
      transform: rotateX(var(--flip-x, 90deg)) rotateZ(var(--flip-z, 0deg))
        scale(0.3);
      opacity: 0;
      filter: blur(6px) brightness(2.5);
    }
    35% {
      opacity: 0.4;
      filter: blur(2px) brightness(1.8);
    }
    65% {
      transform: rotateX(-6deg) rotateZ(0deg) scale(1.04);
      opacity: 1;
      filter: blur(0) brightness(1.2);
    }
    100% {
      transform: rotateX(0deg) rotateZ(0deg) scale(1);
      opacity: 1;
      filter: blur(0) brightness(1);
    }
  }

  /* ── Top-Right Corner Click/Tap Target ── */
  .top-right-trigger {
    position: fixed;
    top: 0;
    right: 0;
    width: 80px;
    height: 80px;
    z-index: 95;
    cursor: pointer;
  }

  /* ── Top-Right Status Flash Indicator ── */
  .status-flash {
    position: fixed;
    top: 1.5rem;
    right: 1.5rem;
    z-index: 100;
    pointer-events: none;
    color: rgba(255, 255, 255, 0.85);
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 0.8rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    animation: flashFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes flashFade {
    0% {
      transform: scale(0.6) rotate(-15deg);
      opacity: 0;
    }
    15% {
      transform: scale(1.1) rotate(5deg);
      opacity: 1;
    }
    30% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
    75% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: scale(0.8) rotate(10deg);
      opacity: 0;
    }
  }
</style>
