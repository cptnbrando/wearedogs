<script>
  import translations from "../lib/translations.js";
  import "../lib/i18n.js";
  import { Pause, Play, ChevronLeft, ChevronRight, Flag } from "lucide-svelte";
  import { untrack } from "svelte";

  const langs = Object.keys(translations);

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
    usa: ["#0A3161", "#FFFFFF", "#B31942"],
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
      `hsl(${h3}, 85%, 55%)`,
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

  // Intl.DisplayNames in English for stable, localized keyboard letter matching
  const englishLangNames = new Intl.DisplayNames(["en"], { type: "language" });

  function langEnglishName(code) {
    try {
      return englishLangNames.of(code) || code;
    } catch {
      return code;
    }
  }

  let {
    isFaded = false,
    onOpenStats,
    currentLang = $bindable(initialLang),
  } = $props();

  let refreshKey = $state(0);

  function parseSpeakers(text) {
    if (!text || text === "—") return 0;
    let clean = text.replace(/,/g, "").toLowerCase().trim();
    let multiplier = 1;
    if (clean.includes("billion")) {
      multiplier = 1_000_000_000;
      clean = clean.replace("billion", "");
    } else if (clean.includes("million")) {
      multiplier = 1_000_000;
      clean = clean.replace("million", "");
    }
    const val = parseFloat(clean);
    return isNaN(val) ? 0 : val * multiplier;
  }

  function parseDogs(text) {
    if (!text || text === "—") return 0;
    let clean = text.replace(/,/g, "").toLowerCase().trim();
    let multiplier = 1;
    if (clean.includes("billion")) {
      multiplier = 1_000_000_000;
      clean = clean.replace("billion", "");
    } else if (clean.includes("million")) {
      multiplier = 1_000_000;
      clean = clean.replace("million", "");
    } else if (clean.includes("sleigh dogs")) {
      clean = clean.replace("sleigh dogs", "");
    }
    const val = parseFloat(clean);
    return isNaN(val) ? 0 : val * multiplier;
  }

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

  // Deterministic helper to generate country/region-specific demographics (births and deaths per 1000)
  function getDemographics(lang) {
    const t = translations[lang];
    if (!t)
      return { humanCBR: 12.0, humanCDR: 8.0, dogCBR: 95.0, dogCDR: 90.0 };

    let humanCBR = 12.0;
    let humanCDR = 8.0;
    let dogCBR = 95.0;
    let dogCDR = 90.0;

    const str = t.country || lang;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);

    // Human CBR: 8.0 + (hash % 150) / 10 (gives 8.0 to 23.0 per 1,000)
    humanCBR = 8.0 + (hash % 150) / 10;
    // Human CDR: 5.5 + (hash % 80) / 10 (gives 5.5 to 13.5 per 1,000)
    humanCDR = 5.5 + (hash % 80) / 10;

    // Dog CBR: 80.0 + (hash % 40) (gives 80 to 120 per 1,000)
    dogCBR = 80.0 + (hash % 40);
    // Dog CDR: 75.0 + (hash % 35) (gives 75 to 110 per 1,000)
    dogCDR = 75.0 + (hash % 35);

    // Specific major country mappings
    const countryLower = (t.country || "").toLowerCase();
    if (countryLower.includes("united states") || countryLower.includes("us")) {
      humanCBR = 11.0;
      humanCDR = 8.8;
      dogCBR = 93.0;
      dogCDR = 91.0;
    } else if (countryLower.includes("japan")) {
      humanCBR = 7.0;
      humanCDR = 11.1; // shrinking
      dogCBR = 80.0;
      dogCDR = 83.0;
    } else if (countryLower.includes("china")) {
      humanCBR = 6.7;
      humanCDR = 7.1; // shrinking
      dogCBR = 92.0;
      dogCDR = 95.0;
    } else if (countryLower.includes("germany")) {
      humanCBR = 9.3;
      humanCDR = 11.5;
      dogCBR = 86.0;
      dogCDR = 88.0;
    } else if (countryLower.includes("ukraine")) {
      humanCBR = 6.0;
      humanCDR = 14.5;
      dogCBR = 98.0;
      dogCDR = 105.0;
    } else if (countryLower.includes("brazil")) {
      humanCBR = 12.9;
      humanCDR = 6.8;
      dogCBR = 102.0;
      dogCDR = 98.0;
    } else if (countryLower.includes("india")) {
      humanCBR = 16.5;
      humanCDR = 7.3;
      dogCBR = 105.0;
      dogCDR = 100.0;
    }

    return { humanCBR, humanCDR, dogCBR, dogCDR };
  }

  const SECONDS_IN_YEAR = 31536000;

  let activeDemographics = $derived(getDemographics(currentLang));

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
    const str = rate < 0.01 ? rate.toFixed(3) : rate.toFixed(2);
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
    if (isFaded) return; // bypass all navigation keys when details panel is open
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

<!-- Persistent Paused Indicator in Top Right -->
{#if isPaused && !isFaded && !flashVisible}
  <div class="paused-indicator">
    <Pause size={28} />
  </div>
{/if}

<!-- Top Right Status Flash Overlay -->
{#key flashKey}
  {#if flashVisible}
    <div class="status-flash">
      {#if flashIcon.length === 1}
        <span class="flash-text">{flashIcon}</span>
      {:else if flashIcon === "pause"}
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
        <div
          style="position: relative; display: flex; align-items: center; justify-content: center;"
        >
          <Flag size={28} />
          <div
            style="position: absolute; width: 30px; height: 2px; background: currentColor; transform: rotate(-45deg); opacity: 0.85;"
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

<!-- Language indicator — full name + expandable info panel -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="lang-display"
  class:paused={isPaused}
  class:faded={isFaded}
  onclick={onOpenStats}
>
  <div class="lang-header">
    <span class="lang-name">
      {langDisplayName(currentLang)}
    </span>
    <span class="stats-badge">📊 DATA PANEL</span>
  </div>

  {#if isPaused && !isFaded}
    <div class="lang-meta">
      <!-- <div class="utc-clock">
        <span>UTC START: {utcStartStr}</span>
      </div> -->

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
            {#if baseSpeakers > 0}
              <span class="stat-pct">({speakerPercentage.toFixed(4)}%)</span>
            {/if}
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
              <span
                class:highlight-green={speakerBirthRatePerSecond >
                  speakerDeathRatePerSecond}
                >+{formatRate(speakerBirthRatePerSecond)}/s</span
              >
              <span> , </span>
              <span
                class:highlight-red={speakerDeathRatePerSecond >
                  speakerBirthRatePerSecond}
                >-{formatRate(speakerDeathRatePerSecond)}/s</span
              >
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
            {#if baseDogs > 0}
              <span class="stat-pct">({dogPercentage.toFixed(4)}%)</span>
            {/if}
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
              <span
                class:highlight-green={dogBirthRatePerSecond >
                  dogDeathRatePerSecond}
                >+{formatRate(dogBirthRatePerSecond)}/s</span
              >
              <span> , </span>
              <span
                class:highlight-red={dogDeathRatePerSecond >
                  dogBirthRatePerSecond}
                >-{formatRate(dogDeathRatePerSecond)}/s</span
              >
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
  onmouseenter={onEnter}
  onmouseleave={onLeave}
  onclick={handleMainClick}
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
</div>

<style>
  /* ── Language Display & Info Panel ── */
  /* ── Language Display & Info Panel ── */
  .lang-display {
    position: fixed;
    top: 1.25rem;
    left: 1.25rem;
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
    }
    .lang-display.paused {
      width: calc(100vw - 1.5rem);
      box-sizing: border-box;
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
    transition: all 0.3s ease;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .lang-display.paused .lang-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.95);
  }

  .stats-badge {
    display: inline-block;
    font-size: 0.55rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.45);
    padding: 1px 4px;
    border-radius: 3px;
    opacity: 0;
    transform: translateX(4px);
    transition: all 0.2s ease;
  }

  .lang-display:hover .stats-badge {
    opacity: 1;
    transform: translateX(0);
    background: rgba(255, 255, 255, 0.15);
    color: white;
  }

  .utc-clock {
    font-size: 0.55rem;
    font-family: monospace;
    color: rgba(255, 255, 255, 0.3);
    margin-bottom: 6px;
    letter-spacing: 0.01em;
  }

  .live-stats {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 6px;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .stat-info {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 0.68rem;
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

  .stat-pct {
    font-size: 0.65rem;
    font-weight: 600;
    color: #ffd700; /* Gold */
    margin-left: auto;
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.2);
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
    font-size: 0.55rem;
    font-family: monospace;
    color: rgba(255, 255, 255, 0.3);
    text-align: right;
    margin-top: 1px;
  }

  .stat-sub-info span {
    color: rgba(255, 255, 255, 0.3);
  }

  .stat-sub-info span.highlight-green {
    color: #00ff66;
    font-weight: 600;
  }

  .stat-sub-info span.highlight-red {
    color: #ff4d4d;
    font-weight: 600;
  }

  /* Fade out background title when stats or other panels are active */
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

  /* ── Metadata slide-out panel ── */
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
    margin: 4rem 0 0 0;
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
    cursor: pointer;
    perspective: 900px;
    user-select: none;
    -webkit-user-select: none;
    z-index: 10;
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
    width: 3.2rem;
    height: 3.2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    animation: flashFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .flash-text {
    font-size: 1.5rem;
    font-weight: 800;
    line-height: 1;
    font-family: "Outfit", "Inter", system-ui, sans-serif;
    color: rgba(255, 255, 255, 0.95);
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  }

  /* ── Persistent Paused Indicator ── */
  .paused-indicator {
    position: fixed;
    top: 1.5rem;
    right: 1.5rem;
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
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    animation: pausedIndicatorFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes pausedIndicatorFadeIn {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
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

  /* ── Ambient Background & Textures ── */
  .ambient-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100dvh;
    z-index: 0;
    pointer-events: none;
    background-color: #000000;
  }
  .ambient-bg::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 50% 50%,
      var(--dominant-color, transparent) 0%,
      transparent 70%
    );
    opacity: 0.18;
    transition: background 1.2s cubic-bezier(0.16, 1, 0.3, 1);
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
</style>
