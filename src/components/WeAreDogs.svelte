<script>
  import translations from "../lib/translations.js";
  import "../lib/i18n.js";
  import { Pause, Play, ChevronLeft, ChevronRight } from "lucide-svelte";

  const langs = Object.keys(translations);

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
  let flashIcon = $state(null); // 'pause', 'play', 'forward', 'backward'
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

    // Minimum swipe distance
    const threshold = 40;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      if (diffX < 0) {
        // Swipe Left -> Next
        handleRightArrow();
      } else {
        // Swipe Right -> Prev
        handleLeftArrow();
      }
    }
  }

  function handleKeydown(e) {
    if (e.key === "ArrowLeft") {
      handleLeftArrow();
    } else if (e.key === "ArrowRight") {
      handleRightArrow();
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
      {/if}
    </div>
  {/if}
{/key}

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
          style={letterStyle(i, toLetters(currentWe).length)}
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
          style={letterStyle(i, toLetters(currentAre).length)}
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
          style={letterStyle(i, toLetters(currentDogs).length)}
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
