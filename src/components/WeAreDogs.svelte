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
  import "../lib/i18n.js";
  import {
    Pause,
    Play,
    ChevronLeft,
    ChevronRight,
    Flag,
    Component,
    ChartNoAxesColumn,
    Music,
    ShoppingCart,
    Map,
  } from "lucide-svelte";
  import { untrack } from "svelte";

  function getRegionIdentity(lang) {
    const t = translations[lang];
    if (!t || !t.country) return "default";
    const country = t.country.toLowerCase();

    if (
      country.includes("switzerland") ||
      country.includes("nepal") ||
      country.includes("tibet") ||
      country.includes("austria") ||
      country.includes("peru") ||
      country.includes("bolivia") ||
      country.includes("greece") ||
      country.includes("norway") ||
      country.includes("chile") ||
      country.includes("ecuador") ||
      country.includes("georgia") ||
      country.includes("armenia") ||
      country.includes("bhutan") ||
      country.includes("kashmir")
    ) {
      return "mountain";
    }

    if (
      country.includes("germany") ||
      country.includes("japan") ||
      country.includes("china") ||
      country.includes("united states") ||
      country.includes("us") ||
      country.includes("usa") ||
      country.includes("south korea") ||
      country.includes("united kingdom") ||
      country.includes("uk") ||
      country.includes("belgium") ||
      country.includes("russia") ||
      country.includes("singapore") ||
      country.includes("taiwan")
    ) {
      return "industrial";
    }

    return "agricultural";
  }

  // Detect initial language from browser
  const browserLang =
    typeof navigator !== "undefined" ? navigator.language.split("-")[0] : "en";
  const userLocale =
    typeof navigator !== "undefined" ? navigator.language : "en";
  const initialLang = langs.includes(browserLang) ? browserLang : "en";

  /** Get full display name for a language code, falling back to friendly name or dialect */
  function langDisplayName(code) {
    return getLangDisplayName(code, userLocale);
  }

  function langEnglishName(code) {
    return getLangEnglishName(code);
  }

  let {
    isFaded = false,
    onOpenStats,
    onOpenPage,
    currentLang = $bindable(initialLang),
    isPaused = $bindable(false),
    isFlagColors = $bindable(false),
    children,
  } = $props();

  let refreshKey = $state(0);

  // This is the genesis for the death calculation stats
  // Time elapsed since this will be used to calculate mortality
  // TODO You oughta change this on every push to the repo
  const TIME_LOCK = new Date("2026-06-21T18:28:24Z").getTime();
  let utcStartStr = new Date(TIME_LOCK).toUTCString();
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

  // 2026 demographic growth factors from translations baseline to active 2026 counts
  const HUMAN_GROWTH_FACTOR_2026 = 1.031; // ~3.1% human population growth
  const DOG_GROWTH_FACTOR_2026 = 1.052; // ~5.2% canine population growth

  let baseSpeakers = $derived(
    refreshKey >= 0
      ? parseSpeakers(translations[currentLang]?.speakers) *
          HUMAN_GROWTH_FACTOR_2026
      : 0,
  );
  let baseDogs = $derived(
    refreshKey >= 0
      ? parseDogs(translations[currentLang]?.dogs_count) *
          DOG_GROWTH_FACTOR_2026
      : 0,
  );

  // Find the maximum scaled speaker and dog populations across all languages in translations (calculated once)
  const maxSpeakersInDataset =
    Math.max(
      ...Object.keys(translations).map((code) =>
        parseSpeakers(translations[code]?.speakers),
      ),
    ) * HUMAN_GROWTH_FACTOR_2026;
  const maxDogsInDataset =
    Math.max(
      ...Object.keys(translations).map((code) =>
        parseDogs(translations[code]?.dogs_count),
      ),
    ) * DOG_GROWTH_FACTOR_2026;

  const SECONDS_IN_YEAR = 31536000;

  let activeDemographics = $derived(
    translations[currentLang] || {
      humanCBR: 12.0,
      humanCDR: 8.0,
      dogCBR: 95.0,
      dogCDR: 90.0,
    },
  );

  let speakerBirthRatePerSecond = $derived(
    (baseSpeakers * (activeDemographics.humanCBR / 1000)) / SECONDS_IN_YEAR,
  );
  let speakerDeathRatePerSecond = $derived(
    (baseSpeakers * (activeDemographics.humanCDR / 1000)) / SECONDS_IN_YEAR,
  );

  let dogBirthRatePerSecond = $derived(
    (baseDogs * (activeDemographics.dogCBR / 1000)) / SECONDS_IN_YEAR,
  );
  let dogDeathRatePerSecond = $derived(
    (baseDogs * (activeDemographics.dogCDR / 1000)) / SECONDS_IN_YEAR,
  );

  let birthAccumulatorSpeakers = $derived(
    elapsedSeconds * speakerBirthRatePerSecond,
  );
  let deathAccumulatorSpeakers = $derived(
    elapsedSeconds * speakerDeathRatePerSecond,
  );
  let liveSpeakers = $derived(
    Math.max(
      0,
      baseSpeakers +
        Math.floor(birthAccumulatorSpeakers) -
        Math.floor(deathAccumulatorSpeakers),
    ),
  );

  let birthAccumulatorDogs = $derived(elapsedSeconds * dogBirthRatePerSecond);
  let deathAccumulatorDogs = $derived(elapsedSeconds * dogDeathRatePerSecond);
  let liveDogs = $derived(
    Math.max(
      0,
      baseDogs +
        Math.floor(birthAccumulatorDogs) -
        Math.floor(deathAccumulatorDogs),
    ),
  );

  let speakerPercentage = $derived(
    baseSpeakers > 0 ? (liveSpeakers / 8_300_000_000) * 100 : 0,
  );
  let dogPercentage = $derived(
    baseDogs > 0 ? (liveDogs / 900_000_000) * 100 : 0,
  );

  let intSpeakers = $derived(Math.floor(liveSpeakers));
  let intDogs = $derived(Math.floor(liveDogs));

  let intBirthSpeakers = $derived(Math.floor(birthAccumulatorSpeakers));
  let intDeathSpeakers = $derived(Math.floor(deathAccumulatorSpeakers));
  let intBirthDogs = $derived(Math.floor(birthAccumulatorDogs));
  let intDeathDogs = $derived(Math.floor(deathAccumulatorDogs));

  let speakersFlashType = $state("none"); // 'none' | 'birth' | 'death'
  let dogsFlashType = $state("none");

  let prevBirthSpeakers = $state(0);
  let prevDeathSpeakers = $state(0);
  let prevBirthDogs = $state(0);
  let prevDeathDogs = $state(0);

  let prevLang = $state(currentLang);
  let prevLangDogs = $state(currentLang);

  let speakersFlashTimeout;
  let dogsFlashTimeout;

  $effect(() => {
    const val = intBirthSpeakers;
    const lang = currentLang;
    if (lang === prevLang) {
      if (prevBirthSpeakers > 0 && val > prevBirthSpeakers) {
        speakersFlashType = "birth";
        if (speakersFlashTimeout) clearTimeout(speakersFlashTimeout);
        speakersFlashTimeout = setTimeout(() => {
          speakersFlashType = "none";
        }, 200);
      }
    }
    prevBirthSpeakers = val;
    prevLang = lang;
  });

  $effect(() => {
    const val = intDeathSpeakers;
    const lang = currentLang;
    if (lang === prevLang) {
      if (prevDeathSpeakers > 0 && val > prevDeathSpeakers) {
        speakersFlashType = "death";
        if (speakersFlashTimeout) clearTimeout(speakersFlashTimeout);
        speakersFlashTimeout = setTimeout(() => {
          speakersFlashType = "none";
        }, 200);
      }
    }
    prevDeathSpeakers = val;
  });

  $effect(() => {
    const val = intBirthDogs;
    const lang = currentLang;
    if (lang === prevLangDogs) {
      if (prevBirthDogs > 0 && val > prevBirthDogs) {
        dogsFlashType = "birth";
        if (dogsFlashTimeout) clearTimeout(dogsFlashTimeout);
        dogsFlashTimeout = setTimeout(() => {
          dogsFlashType = "none";
        }, 200);
      }
    }
    prevBirthDogs = val;
    prevLangDogs = lang;
  });

  $effect(() => {
    const val = intDeathDogs;
    const lang = currentLang;
    if (lang === prevLangDogs) {
      if (prevDeathDogs > 0 && val > prevDeathDogs) {
        dogsFlashType = "death";
        if (dogsFlashTimeout) clearTimeout(dogsFlashTimeout);
        dogsFlashTimeout = setTimeout(() => {
          dogsFlashType = "none";
        }, 200);
      }
    }
    prevDeathDogs = val;
  });

  function formatRate(rate) {
    if (rate === 0) return ".00";

    // If it's positive but below your threshold, explicitly show it's too low
    if (rate > 0 && rate < 0.001) return "~0";

    const str = rate < 0.01 ? rate.toFixed(3) : rate.toFixed(2);

    // Strip the leading zero for consistency (e.g., "0.005" -> ".005")
    return str.startsWith("0.") ? str.substring(1) : str;
  }

  // Current word states derived from translations + refreshKey dependency
  let currentWe = $derived(
    refreshKey >= 0 ? translations[currentLang]?.we || "" : "",
  );
  let currentAre = $derived(
    refreshKey >= 0 ? translations[currentLang]?.are || "" : "",
  );
  let currentDogs = $derived(
    refreshKey >= 0 ? translations[currentLang]?.dogs || "" : "",
  );

  // Pronunciation state
  let pronWe = $derived(
    refreshKey >= 0 ? translations[currentLang]?.we_p || "" : "",
  );
  let pronAre = $derived(
    refreshKey >= 0 ? translations[currentLang]?.are_p || "" : "",
  );
  let pronDogs = $derived(
    refreshKey >= 0 ? translations[currentLang]?.dogs_p || "" : "",
  );

  // Animation generation counters — incrementing triggers {#key} remount
  let weGen = $state(0);
  let areGen = $state(0);
  let dogsGen = $state(0);

  // Watch currentLang reactive updates and trigger animation remount
  $effect(() => {
    currentLang;
    untrack(() => {
      weGen++;
      areGen++;
      dogsGen++;
    });
  });

  let hoverTimer = $state(null);
  let isHovering = $state(false);

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

  let flagColors = $derived(getFlagColors(currentLang));

  // Letter navigation memory state
  let lastPressedLetter = $state("");
  let lastPressedLetterIndex = $state(-1);

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
    lastPressedLetter = "";
    lastPressedLetterIndex = -1;
    history = history.slice(0, historyIndex + 1);
    history.push(next);
    goToIndex(history.length - 1);
  }

  function startCycling() {
    clearInterval(hoverTimer);
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
      lastPressedLetter = "";
      lastPressedLetterIndex = -1;
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
      lastPressedLetter = "";
      lastPressedLetterIndex = -1;
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

  let lastClickTime = 0;
  function handleMainClick(e) {
    e.stopPropagation();
    if (isFaded) return;

    // Ignore clicks on controls or badges
    if (
      e.target.closest(".lang-display") ||
      e.target.closest(".top-right-trigger")
    ) {
      return;
    }

    const now = Date.now();
    if (now - lastClickTime < 300) {
      toggleFullscreen();
    } else {
      onClick();
    }
    lastClickTime = now;
  }

  function handleBackgroundClick(e) {
    if (isFaded) return;

    // Ignore clicks on controls or badges
    if (
      e.target.closest(".lang-display") ||
      e.target.closest(".top-right-trigger")
    ) {
      return;
    }

    const now = Date.now();
    if (now - lastClickTime < 300) {
      toggleFullscreen();
    } else {
      // Reset to original state
      isPaused = false;
      isHovering = false;
      stopCycling();
      setLang(initialLang);
      history = [initialLang];
      historyIndex = 0;
      lastPressedLetter = "";
      lastPressedLetterIndex = -1;
    }
    lastClickTime = now;
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn("Fullscreen request failed:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => console.warn(err));
      }
    }
  }

  function handleWheel(e) {
    if (isFaded) return;
    if (e.deltaY > 0) {
      toggleFlagColors(false); // Scroll down -> Flag Colors OFF
    } else if (e.deltaY < 0) {
      toggleFlagColors(true); // Scroll up -> Flag Colors ON
    }
  }

  /** Get metadata for the current language */
  function getMeta(lang) {
    const t = translations[lang];
    if (!t)
      return { country: "—", dialect: "—", speakers: "—", dogs_count: "—" };
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

  let meta = $derived(refreshKey >= 0 ? getMeta(currentLang) : null);

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
      lastPressedLetter = "";
      lastPressedLetterIndex = -1;
      goToIndex(historyIndex - 1);
    }
  }

  function handleRightArrow() {
    isPaused = true;
    stopCycling();
    triggerFlash("forward");
    lastPressedLetter = "";
    lastPressedLetterIndex = -1;
    if (historyIndex < history.length - 1) {
      goToIndex(historyIndex + 1);
    } else {
      cycle();
    }
  }

  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let currentTouchX = 0;
  let holdAnchorX = 0;
  let holdTimer = null;
  let isSwipeHoldActive = $state(false);
  let scrollOffset = $state(0);
  let lastTickTime = 0;
  let tickIntervalId = null;
  let isTouchDevice = $state(false);

  function startScrollLoop() {
    if (tickIntervalId) clearInterval(tickIntervalId);
    lastTickTime = Date.now();
    tickIntervalId = setInterval(tickScroll, 16);
  }

  function stopScrollLoop() {
    if (tickIntervalId) {
      clearInterval(tickIntervalId);
      tickIntervalId = null;
    }
  }

  function tickScroll() {
    if (!isSwipeHoldActive) {
      stopScrollLoop();
      return;
    }

    const now = Date.now();
    const dt = now - lastTickTime;
    lastTickTime = now;

    // Center scrolling relative to the anchor point where swipe-hold was activated
    const diffX = currentTouchX - holdAnchorX;
    
    // Normalize drag offset to a standard 375px viewport reference width
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 375;
    const scaleFactor = 375 / Math.max(280, screenWidth); // clamp screenWidth to avoid division by zero
    const normDiffX = diffX * scaleFactor;
    const absNormDiffX = Math.abs(normDiffX);
    const deadzone = 12;

    if (absNormDiffX > deadzone) {
      const excess = absNormDiffX - deadzone;
      // Faster base speed factor: excess * 0.00009
      const speed = Math.sign(diffX) * -1 * excess * 0.00009;
      scrollOffset += speed * dt;
    } else {
      // Spring snap to nearest integer index
      const target = Math.round(scrollOffset);
      const diff = target - scrollOffset;
      if (Math.abs(diff) < 0.01) {
        scrollOffset = target;
      } else {
        scrollOffset += diff * 0.15;
      }
    }

    // Wrap scrollOffset to keep it in valid index range [0, langs.length)
    if (scrollOffset < 0) {
      scrollOffset += langs.length;
    } else if (scrollOffset >= langs.length) {
      scrollOffset -= langs.length;
    }

    let roundedOffset = Math.round(scrollOffset);
    let targetIndex = roundedOffset % langs.length;
    if (targetIndex < 0) {
      targetIndex += langs.length;
    }

    const nextLang = langs[targetIndex];
    if (currentLang !== nextLang) {
      currentLang = nextLang;
    }
  }

  function getLangAtOffset(offset) {
    let currentIndex = Math.round(scrollOffset);
    let targetIndex = (currentIndex + offset) % langs.length;
    if (targetIndex < 0) targetIndex += langs.length;
    return langs[targetIndex];
  }

  $effect(() => {
    return () => {
      stopScrollLoop();
    };
  });

  function handleTouchStart(e) {
    isTouchDevice = true;
    if (e.touches && e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      currentTouchX = touchStartX;
    }
    touchStartTime = Date.now();

    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }

    // Start cycling on first touch if not paused and touch is on words
    if (!isPaused && !hoverTimer && e.target.closest(".words-wrapper")) {
      startCycling();
    }
  }

  function handleTouchMove(e) {
    if (e.touches && e.touches.length > 0) {
      currentTouchX = e.touches[0].clientX;
    }

    const diffX = currentTouchX - touchStartX;
    const diffY = e.touches[0].clientY - touchStartY;

    if (!isSwipeHoldActive) {
      // Cancel the holdTimer if clear vertical swipe occurs
      if (Math.abs(diffY) > Math.abs(diffX) * 1.2 && Math.abs(diffY) > 20) {
        if (holdTimer) {
          clearTimeout(holdTimer);
          holdTimer = null;
        }
        return;
      }

      // Check for swipe horizontal movement to queue scroll dial
      if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
        if (!holdTimer) {
          holdTimer = setTimeout(() => {
            isSwipeHoldActive = true;
            isPaused = true;
            stopCycling();
            holdAnchorX = currentTouchX; // Anchor the scroll center at the hold point
            scrollOffset = langs.indexOf(currentLang);
            if (scrollOffset === -1) scrollOffset = 0;
            startScrollLoop();
          }, 180); // 180ms delay to distinguish swift swipe vs. swipe & hold
        }
      }
    } else {
      if (e.cancelable) {
        e.preventDefault();
      }
    }
  }

  function handleTouchEnd(e) {
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
    stopScrollLoop();

    if (isSwipeHoldActive) {
      isSwipeHoldActive = false;
      // Quick swipe and release -> step once in the swipe direction
      if (Date.now() - touchStartTime < 250) {
        const diffX = currentTouchX - touchStartX;
        if (diffX > 0) {
          handleLeftArrow(); // swiped right -> backward
        } else {
          handleRightArrow(); // swiped left -> forward
        }
      } else {
        // They held and scrubbed: stay on active language, add to history
        if (history[historyIndex] !== currentLang) {
          history = history.slice(0, historyIndex + 1);
          history.push(currentLang);
          historyIndex = history.length - 1;
        }
        triggerFlash("forward");
      }
      return;
    }

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

  function handleLetterPress(letter) {
    const matches = langs
      .map((code) => {
        const name = langEnglishName(code).trim();
        const t = translations[code];
        const dialect = t.dialect || "";
        const country = t.country || "";
        return { code, name, dialect, country };
      })
      .filter((item) => {
        // Strip parenthetical text (e.g. '(Jopará)', '(Patwa)') before splitting into words
        const nameClean = item.name
          .replace(/\([^)]*\)/g, "")
          .toLowerCase()
          .trim();
        const nameWords = nameClean.split(/[\s&,-]+/);
        return nameWords.some((w) => w.startsWith(letter));
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    if (matches.length === 0) {
      // Flash the letter anyway for visual feedback
      triggerFlash(letter.toUpperCase());
      return;
    }

    // Pause cycling
    isPaused = true;
    stopCycling();

    let nextIndex = 0;
    if (lastPressedLetter === letter) {
      nextIndex = (lastPressedLetterIndex + 1) % matches.length;
    } else {
      nextIndex = 0;
    }

    lastPressedLetter = letter;
    lastPressedLetterIndex = nextIndex;

    const selectedCode = matches[nextIndex].code;
    triggerFlash(letter.toUpperCase());

    history = history.slice(0, historyIndex + 1);
    history.push(selectedCode);
    goToIndex(history.length - 1);
  }

  function handleKeydown(e) {
    if (isFaded) return; // bypass all navigation keys when details Panel is open
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
    } else if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
      handleLetterPress(e.key.toLowerCase());
    }
  }

  export function forceLanguage(code) {
    currentLang = code;
    history = [code];
    historyIndex = 0;
    lastPressedLetter = "";
    lastPressedLetterIndex = -1;
  }

  export function refreshLanguage() {
    refreshKey++;
    weGen++;
    areGen++;
    dogsGen++;
  }
</script>

<svelte:window onkeydown={handleKeydown} onwheel={handleWheel} />

<!-- Ambient background gradient & textures -->
<div
  class="ambient-bg"
  style="--dominant-color: {flagColors[0] || '#000000'}"
  data-region-type={getRegionIdentity(currentLang)}
>
  <div class="ambient-texture"></div>
</div>

<!-- Top Right Status Flash Overlay -->
{#key flashKey}
  {#if flashVisible}
    <div class="status-flash">
      {#if flashIcon.length === 1}
        <span class="flash-text">{flashIcon}</span>
      {:else if flashIcon === "pause"}
        <Pause size={20} />
      {:else if flashIcon === "play"}
        <Play size={20} />
      {:else if flashIcon === "forward"}
        <ChevronRight size={20} />
      {:else if flashIcon === "backward"}
        <ChevronLeft size={20} />
      {:else if flashIcon === "flag_on"}
        <Flag size={20} style="fill: currentColor;" />
      {:else if flashIcon === "flag_off"}
        <div
          style="position: relative; display: flex; align-items: center; justify-content: center;"
        >
          <Flag size={20} />
          <div
            style="position: absolute; width: 22px; height: 1.5px; background: currentColor; transform: rotate(-45deg); opacity: 0.85;"
          ></div>
        </div>
      {/if}
    </div>
  {/if}
{/key}

{#if !isFaded}
  <!-- Top Right Corner Click/Tap Target (Flag Colors Toggle) -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="top-right-trigger" onclick={() => toggleFlagColors()}></div>
{/if}

<!-- Language indicator — full name + expandable info Panel -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="lang-display"
  class:paused={isPaused}
  class:faded={isFaded}
  onclick={onOpenStats}
>
  <div class="lang-header">
    <span
      class="lang-name"
      class:flash-life={speakersFlashType === "birth" ||
        dogsFlashType === "birth"}
      class:flash-death={speakersFlashType === "death" ||
        dogsFlashType === "death"}
    >
      {langDisplayName(currentLang)}
    </span>
  </div>

  {#if isPaused && !isFaded}
    <div class="lang-meta">
      <div class="live-stats">
        <!-- Speakers -->
        <div class="stat-item">
          <div class="stat-info">
            <span class="stat-icon">🗣️</span>
            <span class="stat-lbl">Speakers:</span>
            <span
              class="stat-val"
              class:flashing-death={speakersFlashType === "death"}
              class:flashing-birth={speakersFlashType === "birth"}
            >
              {intSpeakers === 0 ? "—" : intSpeakers.toLocaleString()}
            </span>
          </div>
          {#if baseSpeakers > 0}
            <div class="stat-bar-container">
              <div
                class="stat-bar-fill"
                style="width: {liveSpeakers > 0
                  ? (liveSpeakers / maxSpeakersInDataset) * 100
                  : 0}%; background: linear-gradient(90deg, {flagColors[0]}, {flagColors[1] ||
                  flagColors[0]}, {flagColors[2] || flagColors[0]});"
              ></div>
            </div>
            <div class="stat-sub-info">
              {#if baseSpeakers > 0}
                <div class="pct-container">
                  <span class="gold-pct">[{speakerPercentage.toFixed(2)}%]</span
                  >
                  <span class="pct-label">of all people</span>
                </div>
              {/if}
              <div class="rates-container">
                <span
                  class:highlight-green={speakerBirthRatePerSecond >
                    speakerDeathRatePerSecond}
                  >+{formatRate(speakerBirthRatePerSecond)}/s</span
                >
                <span class="comma">,</span>
                <span
                  class:highlight-red={speakerDeathRatePerSecond >
                    speakerBirthRatePerSecond}
                  >-{formatRate(speakerDeathRatePerSecond)}/s</span
                >
              </div>
            </div>
          {/if}
        </div>

        <!-- Dogs -->
        <div class="stat-item">
          <div class="stat-info">
            <span class="stat-icon">🐕</span>
            <span class="stat-lbl">Dogs:</span>
            <span
              class="stat-val"
              class:flashing-death={dogsFlashType === "death"}
              class:flashing-birth={dogsFlashType === "birth"}
            >
              {intDogs === 0 ? "—" : intDogs.toLocaleString()}
            </span>
          </div>
          {#if baseDogs > 0}
            <div class="stat-bar-container">
              <div
                class="stat-bar-fill"
                style="width: {liveDogs > 0
                  ? (liveDogs / maxDogsInDataset) * 100
                  : 0}%; background: linear-gradient(90deg, {flagColors[2] ||
                  flagColors[0]}, {flagColors[1] ||
                  flagColors[0]}, {flagColors[0]});"
              ></div>
            </div>
            <div class="stat-sub-info">
              {#if baseDogs > 0}
                <div class="pct-container">
                  <span class="gold-pct">[{dogPercentage.toFixed(2)}%]</span>
                  <span class="pct-label">of all dogs</span>
                </div>
              {/if}
              <div class="rates-container">
                <span
                  class:highlight-green={dogBirthRatePerSecond >
                    dogDeathRatePerSecond}
                  >+{formatRate(dogBirthRatePerSecond)}/s</span
                >
                <span class="comma"> , </span>
                <span
                  class:highlight-red={dogDeathRatePerSecond >
                    dogBirthRatePerSecond}
                  >-{formatRate(dogDeathRatePerSecond)}/s</span
                >
              </div>
            </div>
          {/if}
        </div>
      </div>

      <div class="meta-row" style="animation-delay: 0ms">
        <span class="meta-label">🌐 Region</span>
        <span class="meta-value">{meta?.country || "—"}</span>
      </div>
      <div class="meta-row" style="animation-delay: 60ms">
        <span class="meta-label">💬 Dialect</span>
        <span class="meta-value">{meta?.dialect || "—"}</span>
      </div>
    </div>
  {/if}
</div>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="wad-container"
  class:faded={isFaded}
  class:colored={isFlagColors}
  onclick={handleBackgroundClick}
  ontouchstart={handleTouchStart}
  ontouchmove={handleTouchMove}
  ontouchend={handleTouchEnd}
  ontouchcancel={handleTouchEnd}
  role="presentation"
>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="words-wrapper"
    onmouseenter={onEnter}
    onmouseleave={onLeave}
    onclick={handleMainClick}
    role="presentation"
  >
    <!-- WORD 1: "We" -->
    {#key weGen}
      <h1 class="word" aria-label={currentWe}>
        {#each toLetters(currentWe) as letter, i}
          <span
            class="letter"
            style="{letterStyle(
              i,
              toLetters(currentWe).length,
            )} --trans-delay: {i * 30}ms; color: {isFlagColors
              ? flagColors[0]
              : 'white'}; text-shadow: {isFlagColors
              ? `0 0 15px ${flagColors[0]}44`
              : 'none'}"
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
            style="{letterStyle(
              i,
              toLetters(currentAre).length,
            )} --trans-delay: {i * 30}ms; color: {isFlagColors
              ? flagColors[1]
              : 'white'}; text-shadow: {isFlagColors
              ? `0 0 15px ${flagColors[1]}44`
              : 'none'}"
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
            style="{letterStyle(
              i,
              toLetters(currentDogs).length,
            )} --trans-delay: {i * 30}ms; color: {isFlagColors
              ? flagColors[2]
              : 'white'}; text-shadow: {isFlagColors
              ? `0 0 15px ${flagColors[2]}44`
              : 'none'}"
          >
            {letter}
          </span>
        {/each}
      </h1>
    {/key}

    <!-- Pronunciation -->
    <p class="pronunciation">({pronWe} {pronAre} {pronDogs})</p>

    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

{#if isSwipeHoldActive}
  <div class="language-scroller-ribbon">
    <div class="scroller-instruction">Drag left/right to scroll past languages</div>
    <div class="scroller-track">
      <div class="scroller-track-inner" style="--scroller-shift: {-(scrollOffset - Math.round(scrollOffset)) * 130}">
        {#each [-4, -3, -2, -1, 0, 1, 2, 3, 4] as offset}
          {@const langCode = getLangAtOffset(offset)}
          <div
            class="scroller-item"
            class:active={offset === 0}
            style="--opacity: {1 - Math.abs(offset) * 0.22}; --scale: {1.2 - Math.abs(offset) * 0.15}; --flag-color: {getFlagColors(langCode)[0]};"
          >
            <div class="scroller-flag-pill">
              <span class="flag-stripe" style="background-color: {getFlagColors(langCode)[0]}"></span>
              <span class="flag-stripe" style="background-color: {getFlagColors(langCode)[1] || getFlagColors(langCode)[0]}"></span>
              <span class="flag-stripe" style="background-color: {getFlagColors(langCode)[2] || getFlagColors(langCode)[0]}"></span>
            </div>
            <div class="scroller-lang-code">{langCode.toUpperCase()}</div>
            <div class="scroller-lang-name">{langDisplayName(langCode)}</div>
          </div>
        {/each}
      </div>
    </div>
    <div class="scroller-indicator">▲</div>
  </div>
{/if}

<style>
  /* ── Language Display & Info Panel ── */
  .lang-display {
    position: fixed;
    top: 0.75rem;
    left: 0.75rem;
    z-index: 50;
    width: auto;
    padding: 0;
    background: transparent;
    border: 1px solid transparent;
    box-shadow: none;
    cursor: pointer;
    transition: all 0.38s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .lang-display.paused {
    width: 270px;
    padding: 12px;
    background: rgba(10, 10, 15, 0.45);
    backdrop-filter: blur(12px) saturate(160%);
    -webkit-backdrop-filter: blur(12px) saturate(160%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    box-shadow:
      0 12px 36px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  @media (max-width: 480px) {
    .lang-display {
      top: 0.75rem;
      left: 0.75rem;
      max-width: 62vw;
      word-wrap: wrap;
    }
    .lang-display.paused {
      width: 62vw;
      padding: 8px 10px;
      box-sizing: border-box;
      word-break: break-word;
    }

    .live-stats {
      max-width: 100%;
    }

    .stat-info {
      flex-wrap: wrap;
      margin-bottom: 2px;
      font-size: 0.5rem !important;
    }

    .stat-item {
      margin-bottom: 8px;
    }

    .stat-bar-container {
      height: 2px;
      margin-bottom: 2px;
    }

    .lang-meta {
      margin-bottom: 3px;
      gap: 3px;
    }

    .lang-display.paused .lang-name {
      font-size: 0.75rem;
    }
  }

  .lang-display.faded {
    opacity: 0;
    transform: translateY(-10px);
    pointer-events: none;
  }

  .lang-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2px;
  }

  .lang-name {
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: rgba(255, 255, 255, 0.4);
    transition:
      all 0.3s ease,
      color 0.1s ease,
      text-shadow 0.1s ease;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  /* Make language title always flash life/death even when stats widget is open and paused */
  .lang-display .lang-name.flash-life {
    color: #5c7a69 !important; /* Muted, earthier sage green */
    text-shadow: 0 0 6px rgba(92, 122, 105, 0.3) !important; /* Softened glow */
    transition: none;
  }

  .lang-display .lang-name.flash-death {
    color: #6e464c !important;
    text-shadow: 0 0 4px rgba(110, 70, 76, 0.4) !important;
    transition: none;
  }

  .lang-display.paused .lang-name {
    font-size: 0.8rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.95);
  }

  .live-stats {
    display: flex;
    flex-direction: column;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
  }

  .stat-info {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.85);
    font-family: monospace;
  }

  .stat-icon {
    font-size: 0.8rem;
    line-height: 1;
  }

  .stat-lbl {
    font-weight: 500;
    color: rgba(255, 255, 255, 0.45);
  }

  .stat-val {
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
    transition:
      color 0.3s ease,
      text-shadow 0.3s ease;
    display: inline-block;
  }

  .stat-val.flashing-death {
    color: #d03040;
    text-shadow:
      0 0 10px rgba(208, 48, 64, 0.9),
      0 0 20px rgba(208, 48, 64, 0.5);
    transition: none; /* Instant flash on */
  }

  .stat-val.flashing-birth {
    color: #1b8a5a;
    text-shadow:
      0 0 10px rgba(27, 138, 90, 0.9),
      0 0 20px rgba(27, 138, 90, 0.5);
    transition: none; /* Instant flash on */
  }

  .stat-bar-container {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 2px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
  }

  .stat-bar-fill {
    height: 100%;
    border-radius: 2px;
  }

  .stat-sub-info {
    font-family: monospace;
    margin-top: 2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .pct-container {
    display: flex;
    align-items: baseline;
    gap: 4px;
    text-align: left;
  }

  .gold-pct {
    color: #ffd700;
    font-weight: 700;
    font-size: 0.6rem;
    text-shadow: 0 0 6px rgba(255, 215, 0, 0.25);
  }

  .pct-label {
    font-size: 0.45rem;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .rates-container {
    display: flex;
    gap: 2px;
    text-align: right;
    font-size: 0.55rem;
    color: rgba(255, 255, 255, 0.3);
  }

  .rates-container .comma {
    color: rgba(255, 255, 255, 0.2);
  }

  .stat-sub-info span.highlight-green {
    color: #00ff66;
    font-weight: 600;
  }

  .stat-sub-info span.highlight-red {
    color: #ff4d4d;
    font-weight: 600;
  }

  /* Fade out background title when stats or other Panels are active */
  .wad-container.faded {
    opacity: 0.15;
    filter: blur(12px) saturate(0.8);
    transform: scale(0.95);
    pointer-events: none;
    transition:
      opacity 0.5s ease,
      filter 0.5s ease,
      transform 0.5s ease;
  }

  .wad-container.faded:not(.colored) {
    filter: blur(12px) grayscale(1);
  }

  /* ── Metadata slide-out Panel ── */
  .lang-meta {
    margin-top: 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    padding-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .meta-row {
    display: flex;
    flex-direction: column;
    gap: 0px;
    animation: metaSlideIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) both;
    transform-style: preserve-3d;
  }

  .meta-label {
    font-size: 0.5rem;
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
    font-size: 0.68rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.65);
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
    font-size: clamp(0.6rem, 1.5vw, 0.8rem);
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
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
    /* cursor: pointer; */
    perspective: 900px;
    user-select: none;
    -webkit-user-select: none;
    z-index: 10;
  }

  .words-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .word {
    display: flex;
    align-items: baseline;
    justify-content: center;
    flex-wrap: nowrap;
    margin: 0;
    padding: 0;
    font-size: clamp(3rem, 12vw, 9rem);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: white;
    white-space: nowrap;
    cursor: pointer;
  }

  .letter {
    display: inline-block;
    transform-style: preserve-3d;
    animation: matrixFlip 0.32s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: var(--delay, 0ms);
    will-change: transform, opacity;
    transition:
      color 0.5s cubic-bezier(0.25, 1, 0.5, 1),
      text-shadow 0.5s cubic-bezier(0.25, 1, 0.5, 1);
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

  /* ── Top-Right Status Flash Indicator (Bookmark Tab) ── */
  .status-flash {
    position: fixed;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 100;
    pointer-events: none;
    color: rgba(255, 255, 255, 0.85);
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    width: 3.2rem;
    height: 3.2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:
      0 10px 24px rgba(0, 0, 0, 0.5),
      inset 0 -1px 0 rgba(255, 255, 255, 0.1);
    transform-origin: top center;
    animation: bookmarkFlash 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
  }

  .status-flash :global(svg),
  .status-flash .flash-text {
    animation: bookmarkIconPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .flash-text {
    font-size: 1.1rem;
    font-weight: 800;
    line-height: 1;
    font-family: "Outfit", "Inter", system-ui, sans-serif;
    color: rgba(255, 255, 255, 0.95);
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  }

  @keyframes bookmarkFlash {
    0% {
      transform: translateY(-100%);
      opacity: 0;
    }
    15% {
      transform: translateY(0);
      opacity: 1;
    }
    80% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(-100%);
      opacity: 0;
    }
  }

  @keyframes bookmarkIconPop {
    0% {
      transform: scale(0.6) rotate(-15deg);
      opacity: 0;
    }
    15% {
      transform: scale(1.15) rotate(5deg);
      opacity: 1;
    }
    30% {
      transform: scale(1) rotate(0deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
    }
  }

  .ambient-texture {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.03;
    transition:
      background-image 0.8s ease,
      opacity 0.8s ease;
  }

  [data-region-type="mountain"] .ambient-texture {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 l50 50 l50 -50 M50 50 l0 50 M0 100 l50 -50 l50 50' fill='none' stroke='white' stroke-width='1.5' stroke-opacity='0.25'/%3E%3C/svg%3E");
    background-size: 80px 80px;
  }

  [data-region-type="industrial"] .ambient-texture {
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='6' cy='6' r='2' fill='white' fill-opacity='0.3'/%3E%3C/svg%3E");
    background-size: 12px 12px;
  }

  [data-region-type="agricultural"] .ambient-texture {
    background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40 Q 20 20, 40 40 T 80 40 M0 20 Q 20 0, 40 20 T 80 20 M0 60 Q 20 40, 40 60 T 80 60' fill='none' stroke='white' stroke-width='1' stroke-opacity='0.25'/%3E%3C/svg%3E");
    background-size: 60px 60px;
  }

  /* ── Language Scroller Ribbon ── */
  .language-scroller-ribbon {
    position: fixed;
    bottom: 12%;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw;
    max-width: 100%;
    z-index: 90;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    background: rgba(10, 10, 15, 0.7);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding: 20px 0;
    box-shadow: 
      0 -15px 35px rgba(0, 0, 0, 0.6),
      0 15px 35px rgba(0, 0, 0, 0.6);
    overflow: hidden;
    animation: slideUpRibbon 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes slideUpRibbon {
    from {
      opacity: 0;
      transform: translate(-50%, 25px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  .scroller-instruction {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.45);
    font-family: monospace;
  }

  .scroller-track {
    position: relative;
    width: 100%;
    height: 75px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .scroller-track-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0) translateX(calc(var(--scroller-shift, 0) * 1px));
    will-change: transform;
  }

  .scroller-item {
    width: 130px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    text-align: center;
    opacity: var(--opacity, 0.5);
    transform: scale(var(--scale, 0.9));
    transition: opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .scroller-item.active {
    opacity: 1 !important;
    transform: scale(1.22) !important;
  }

  .scroller-flag-pill {
    display: flex;
    width: 28px;
    height: 17px;
    border-radius: 4px;
    overflow: hidden;
    border: 1.5px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .scroller-item.active .scroller-flag-pill {
    border-color: rgba(255, 255, 255, 0.7);
    box-shadow: 0 0 15px var(--flag-color);
  }

  .flag-stripe {
    flex: 1;
    height: 100%;
  }

  .scroller-lang-code {
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.85);
    font-family: monospace;
    line-height: 1;
  }

  .scroller-item.active .scroller-lang-code {
    color: #ffffff;
    text-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
  }

  .scroller-lang-name {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.4);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 110px;
    font-family: system-ui, -apple-system, sans-serif;
    font-weight: 500;
  }

  .scroller-item.active .scroller-lang-name {
    color: rgba(255, 255, 255, 0.9);
  }

  .scroller-indicator {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.75rem;
    margin-top: 2px;
    animation: pulseIndicator 1.5s infinite ease-in-out;
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
  }

  @keyframes pulseIndicator {
    0%, 100% {
      transform: scale(1) translateY(0);
      opacity: 0.7;
    }
    50% {
      transform: scale(1.15) translateY(-3px);
      opacity: 1;
    }
  }
</style>
