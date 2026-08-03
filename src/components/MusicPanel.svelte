<script>
  import { onMount, onDestroy } from "svelte";
  import * as THREE from "three";
  import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Shuffle,
    Repeat,
    Repeat1,
    List,
    Mic2,
    Radio,
    Disc3,
    ExternalLink,
    Plus,
    ChevronRight,
    ArrowLeft,
    BoomBox,
    Music,
    Guitar,
    Waves,
    Maximize2,
    Minimize2,
    Share2,
    Check,
    AlertTriangle,
    Swords,
  } from "lucide-svelte";
  import { audioCore } from "../lib/AudioCore.svelte.js";
  import { musicLock } from "../lib/musicLock.svelte.js";
  import { settingsManager } from "../lib/settingsManager.svelte.js";
  import { VisualizerEngine } from "../lib/visualizer/VisualizerEngine.js";
  import DogsLogo from "./DogsLogo.svelte";
  import { PRESETS, NO_SIGNAL_PRESET } from "../lib/visualizer/presets.js";

  import SwipeTabNav from "./SwipeTabNav.svelte";
  import { fade } from "svelte/transition";
  import arigatoText from "./music/arigato.txt?raw";

  const title = "MUSIC";

  const musicTabs = [
    { id: "songs", label: "Songs", icon: Disc3 },
    { id: "samples", label: "Samples", icon: Mic2 },
    { id: "playlists", label: "Playlists", icon: Radio },
    { id: "radio", label: "Radio", icon: BoomBox },
    { id: "battle", label: "Battle", icon: Swords },
  ];

  const ERROR_COVER = "/img/error_cover.png";

  function handleCoverError(e) {
    if (!e.target.src.endsWith(ERROR_COVER)) {
      e.target.src = ERROR_COVER;
    }
  }

  let { isClosing = false, onClose, initialTrackId = null } = $props();

  // Tab: 'songs' | 'samples' | 'playlists' | 'radio'
  let activeTab = $state("songs");
  let sortBy = $state("default"); // 'default' | 'artist' | 'album' | 'year' | 'filename' | 'genre' | 'season'

  // Lazy loaded BattlePanel component caching
  let loadedBattlePanel = $state(null);

  $effect(() => {
    if (activeTab === "battle" && !loadedBattlePanel) {
      import("./music/BattlePanel.svelte").then((m) => {
        loadedBattlePanel = m.default;
      });
    }
  });
  let showMobileTracklist = $state(false);
  let isBouncing = $state(false);
  let vinylLoaded = $state(false);
  let showVolumeSlider = $state(false);
  let volumePopoverEl = $state(null);
  let isAnimating = $derived(audioCore.isPlaying && !isClosing);

  let showVisualizer = $state(false);
  let activePresetIdx = $state(0);
  let isFullscreenVisualizer = $state(false);
  let canvasEl = $state(null);
  let visualizerEngine = null;
  let tracklistHistoryPushed = false;
  let hasMusicPlayed = $state(false);

  let showArigatoModal = $state(false);

  // Parse arigato text into [intro, termsOfService, outro]
  const arigatoParts = $derived.by(() => {
    const parts = arigatoText.split(/`{5,}/);
    return {
      intro: parts[0] || "",
      tos: parts[1] || "",
      outro: parts[2] || "",
    };
  });

  function linkify(text) {
    if (!text) return "";
    // The source is a plain-text file, so escape any markup characters first —
    // this string is rendered with {@html}, and only the anchors and <br> tags
    // built below should ever reach the DOM as structure.
    let formatted = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    formatted = formatted.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
    );
    formatted = formatted.replace(
      /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g,
      '<a href="mailto:$1">$1</a>',
    );
    return formatted.replace(/\n/g, "<br>");
  }

  // Generate deterministic peaks for the current track to show a mock waveform
  let waveformPeaks = $derived.by(() => {
    const track = currentTrack;
    if (!track) return Array(60).fill(10);
    if (audioCore.waveformPeaks[track.id]) {
      return audioCore.waveformPeaks[track.id];
    }
    const trackId = track.id;
    const peaks = [];
    let hash = 0;
    for (let i = 0; i < trackId.length; i++) {
      hash = (hash << 5) - hash + trackId.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash) % 1000;
    for (let i = 0; i < 60; i++) {
      const t = i / 59;
      const w1 = Math.sin(seed + t * Math.PI * 4); // 2 cycles
      const w2 = Math.cos(seed * 1.5 + t * Math.PI * 10) * 0.4;
      const w3 = Math.sin(seed * 2.3 + t * Math.PI * 22) * 0.15;
      const wave = Math.abs(w1 + w2 + w3) / 1.55;
      const envelope = Math.sin(t * Math.PI);
      const height = (wave * 70 + 15) * envelope;
      peaks.push(Math.max(10, Math.round(height)));
    }
    return peaks;
  });

  // If on mobile and kaleidoscope is turned on while tracks page is active, close tracks page
  $effect(() => {
    const isMobile = window.innerWidth <= 640;
    if (
      isMobile &&
      showVisualizer &&
      activePresetIdx === 0 &&
      showMobileTracklist
    ) {
      showMobileTracklist = false;
    }
  });

  // Track if music starts playing to flip hasMusicPlayed to true
  $effect(() => {
    if (audioCore.isPlaying) {
      hasMusicPlayed = true;
    }
  });

  // Dynamically derive current fragment shader to compile
  let currentShader = $derived.by(() => {
    if (!audioCore.isPlaying && !hasMusicPlayed) {
      return NO_SIGNAL_PRESET.fragmentShader;
    }
    return PRESETS[activePresetIdx].fragmentShader;
  });

  // Manage Visualizer instantiation and destruction
  $effect(() => {
    const analyser = audioCore.analyser; // track dependency
    if (showVisualizer && canvasEl && !isClosing) {
      // Re-instantiate engine when analyser becomes available or changes
      visualizerEngine = new VisualizerEngine(canvasEl, analyser);
      visualizerEngine.init(currentShader);
      visualizerEngine.start();
    }

    return () => {
      if (visualizerEngine) {
        visualizerEngine.destroy();
        visualizerEngine = null;
      }
    };
  });

  // Manage Preset switches / shader changes (without destroying WebGL context)
  $effect(() => {
    const shader = currentShader; // track dependency
    if (visualizerEngine && showVisualizer) {
      visualizerEngine.setPreset(shader);
      visualizerEngine.start();
    }
  });

  // Sync tracklist state with browser history (back button closes tracklist)
  $effect(() => {
    if (showMobileTracklist) {
      if (!history.state?.tracklistOpen && !tracklistHistoryPushed) {
        history.pushState({ tracklistOpen: true }, "");
        tracklistHistoryPushed = true;
      }
    } else {
      if (tracklistHistoryPushed) {
        history.back();
        tracklistHistoryPushed = false;
      }
    }
  });

  onDestroy(() => {
    // Clean up history state if modal closes while tracklist is open
    if (tracklistHistoryPushed) {
      history.back();
      tracklistHistoryPushed = false;
    }
  });

  function handlePopState(e) {
    if (!e.state?.tracklistOpen && showMobileTracklist) {
      showMobileTracklist = false;
      tracklistHistoryPushed = false;
    }
  }

  function handleWindowClick(e) {
    if (
      showVolumeSlider &&
      volumePopoverEl &&
      !volumePopoverEl.contains(e.target) &&
      !e.target.closest(".vol-toggle-btn")
    ) {
      showVolumeSlider = false;
    }
  }

  const fullLibrary = [
    {
      id: "hollywood",
      title: "HOLLYWOOD",
      artist: "YG",
      album: "THE GENTLEMEN'S CLUB",
      cover: "https://data.wearedogs.net/img/covers/2026/yg.webp",
      altCover: "https://data.wearedogs.net/img/covers/2026/yg.jpg",
      src: "https://data.wearedogs.net/music/lockup/hollywood.mp3",
      instrumental: "https://data.wearedogs.net/music/lockup/hollywood-free.mp3",
      dateAdded: "2026-06-24T03:00:00-05:00",
      year: 2026,
      genre: "Hip-Hop",
      attrib: "https://the-gentlemens-club.com/",
      public: false
    },
    {
      id: "chicago",
      title: "Chicago",
      artist: "Michael Jackson",
      album: "Xscape",
      cover: "https://data.wearedogs.net/img/covers/2026/mj.webp",
      altCover: "https://data.wearedogs.net/img/covers/2026/mj.jpg",
      src: "https://data.wearedogs.net/music/lockup/chicago.mp3",
      instrumental: "https://data.wearedogs.net/music/lockup/chicago-free.mp3",
      dateAdded: "2026-06-24T03:00:00-05:00",
      year: 2014,
      genre: "Pop",
      public: false
    },
    {
      id: "rain",
      title: "Pourin Rain (ft. Skratch Bastid)",
      artist: "Zeds Dead",
      album:
        "Return to the Return (of the Spectrum of Intergalactic Happiness)",
      cover: "https://data.wearedogs.net/img/covers/2026/zd.webp",
      altCover: "https://data.wearedogs.net/img/covers/2026/zd.jpg",
      src: "https://data.wearedogs.net/music/2026/Pourin.mp3",
      instrumental: "",
      dateAdded: "2026-07-07T018:12:00-05:00",
      year: 2026,
      genre: "Electronic",
      attrib: "https://shop.zedsdead.net/",
      public: true
    },
    {
      id: "denchai",
      title: "Den Chai",
      artist: "The Buddha-Bar Lounge",
      album: "Den Chai",
      cover: "https://data.wearedogs.net/img/covers/2026/buddha.webp",
      altCover: "https://data.wearedogs.net/img/covers/2026/buddha.png",
      src: "",
      instrumental: "https://data.wearedogs.net/music/2026/DENCHAI.mp3",
      dateAdded: "2026-07-07T22:34:00-05:00",
      year: 2008,
      genre: "Lounge",
      attrib:
        "https://open.spotify.com/artist/0du3MpnxBOpQEie1IV3u9v?si=2UO722ntTE--Ck_Ji7Go7Q",
      public: true
    },
    {
      id: "rainbow",
      title: "Rainbow in the Dark",
      artist: "Das Racist",
      album: "Shut Up, Dude",
      cover: "https://data.wearedogs.net/img/covers/2026/rainbow.webp",
      altCover: "https://data.wearedogs.net/img/covers/2026/rainbow.png",
      src: "https://data.wearedogs.net/music/lockup/rainbow.mp3",
      instrumental: "https://data.wearedogs.net/music/lockup/rainbow-free.mp3",
      dateAdded: "2026-07-08T16:35:00-05:00",
      year: 2010,
      genre: "Hip-Hop",
      attrib: "https://dasracist.bandcamp.com/album/shut-up-dude",
      public: false
    },
    {
      id: "hipsong",
      title: "Hip Song",
      artist: "Toby Fox / Trevor Alan Gomes",
      album: "Deltarune",
      cover: "https://data.wearedogs.net/img/covers/2026/deltarune.webp",
      altCover: "https://data.wearedogs.net/img/covers/2026/deltarune.png",
      src: "https://data.wearedogs.net/music/2026/shop.mp3",
      instrumental: "https://data.wearedogs.net/music/2026/shop-free.mp3",
      dateAdded: "2026-07-09T01:22:00-05:00",
      year: 2021,
      genre: "Video Game",
      attrib: "https://deltarune.com/",
      public: true
    },
    {
      id: "sleepless",
      title: "Sleepless",
      artist: "deadmau5",
      album: "> album title goes here <",
      cover: "https://data.wearedogs.net/img/covers/2026/sleepless.webp",
      altCover: "https://data.wearedogs.net/img/covers/2026/sleepless.png",
      src: "",
      instrumental: "https://data.wearedogs.net/music/lockup/sleepless.mp3",
      dateAdded: "2026-07-12T04:22:00-05:00",
      year: 2026,
      genre: "Electronic",
      attrib: "https://deadmau5.com/",
      public: false
    },
    {
      id: "skitzo",
      title: "Skitzo (ft. Young Thug)",
      artist: "Travis Scott",
      album: "UTOPIA",
      cover: "https://data.wearedogs.net/img/covers/2026/utopia.webp",
      altCover: "https://data.wearedogs.net/img/covers/2026/utopia.png",
      src: "https://data.wearedogs.net/music/lockup/skitzo.mp3",
      instrumental: "https://data.wearedogs.net/music/lockup/skitzo-free.mp3",
      dateAdded: "2026-07-16T01:56:00-05:00",
      year: 2023,
      genre: "Hip-Hop",
      attrib: "https://shop.travisscott.com/",
      public: false
    },
    {
      id: "slow",
      title: "SLOW FT. DOGS",
      artist: "Sweet Boy Sonnet",
      album: "Where do I put my love?",
      cover: "https://data.wearedogs.net/img/covers/2026/slow.webp",
      altCover: "https://data.wearedogs.net/img/covers/2026/slow.png",
      src: "https://data.wearedogs.net/music/2026/SLOW-FT-DOGS.mp3",
      instrumental: "",
      dateAdded: "2026-07-20T02:49:34-05:00",
      year: 2026,
      genre: "Electronic",
      attrib: "https://sweetboysonnet.com/",
      public: true
    },
    {
      id: "arigato",
      title: "ARIGATO",
      artist: "Nxnja",
      album: "ARIGATO",
      cover: "https://data.wearedogs.net/img/covers/2026/arigato.webp",
      altCover: "https://data.wearedogs.net/img/covers/2026/arigato.png",
      src: "",
      instrumental: "https://data.wearedogs.net/music/lockup/arigato.mp3",
      dateAdded: "2026-07-23T00:39:56-05:00",
      year: 2026,
      genre: "Hip-Hop",
      attrib: "https://nxnjaa.beatstars.com/",
      public: false
    },
    {
      id: "exile",
      title: "What's Beneath the Chicken Coop",
      artist: "Trevor Sensor",
      album: "On Account of Exile, Vol. 2",
      cover: "https://data.wearedogs.net/img/covers/2026/exile.webp",
      altCover: "https://data.wearedogs.net/img/covers/2026/exile.png",
      src: "https://data.wearedogs.net/music/2026/exile.mp3",
      instrumental: "",
      dateAdded: "2026-07-23T00:52:43-05:00",
      year: 2021,
      genre: "Indie Rock",
      attrib: "https://trevorsensorofficial.com/",
      public: true
    },
  ];

  // Non-public tracks live in the server's lockup folder and stay hidden until
  // the calculator passcode unlocks them (persisted in localStorage)
  let library = $derived(
    musicLock.unlocked
      ? fullLibrary
      : fullLibrary.filter((t) => t.public !== false),
  );

  // Derive sort values
  function getTrackFilename(track) {
    if (!track.src) return "";
    return track.src.split("/").pop();
  }

  // Derive sort values by season
  function getTrackSeason(track) {
    if (!track.dateAdded) return "Summer";
    const date = new Date(track.dateAdded);
    const month = date.getMonth();
    if (month === 11 || month === 0 || month === 1) return "Winter";
    if (month >= 2 && month <= 4) return "Spring";
    if (month >= 5 && month <= 7) return "Summer";
    return "Fall";
  }

  let sortedLibrary = $derived.by(() => {
    let list = [...library];
    if (sortBy === "artist") {
      list.sort((a, b) => a.artist.localeCompare(b.artist));
    } else if (sortBy === "album") {
      list.sort((a, b) => a.album.localeCompare(b.album));
    } else if (sortBy === "year") {
      list.sort((a, b) => (a.year || 0) - (b.year || 0));
    } else if (sortBy === "filename") {
      list.sort((a, b) =>
        getTrackFilename(a).localeCompare(getTrackFilename(b)),
      );
    } else if (sortBy === "genre") {
      list.sort((a, b) => (a.genre || "").localeCompare(b.genre || ""));
    } else if (sortBy === "season") {
      list.sort((a, b) => getTrackSeason(a).localeCompare(getTrackSeason(b)));
    }
    return list;
  });

  let currentTrack = $derived(
    library[audioCore.currentTrackIndex] ?? library[0],
  );

  // Re-sync the player if the lockup gate opens (or is revoked) while mounted
  $effect(() => {
    const lib = library;
    if (audioCore.library === lib || audioCore.library.length === 0) return;
    const playingId = audioCore.library[audioCore.currentTrackIndex]?.id;
    audioCore.init(lib);
    const newIdx = lib.findIndex((t) => t.id === playingId);
    if (newIdx !== -1) {
      audioCore.currentTrackIndex = newIdx;
    } else {
      audioCore.pause();
      audioCore.loadTrack(0, false);
    }
  });

  let titleContainerWidth = $state(0);
  let titleTextWidth = $state(0);
  let artistContainerWidth = $state(0);
  let artistTextWidth = $state(0);
  let albumContainerWidth = $state(0);
  let albumTextWidth = $state(0);

  let copiedTrackId = $state(null);
  let copyTimeout = null;

  function handleShareTrack(e, track) {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/music/${track.id}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        copiedTrackId = track.id;
        if (copyTimeout) clearTimeout(copyTimeout);
        copyTimeout = setTimeout(() => {
          copiedTrackId = null;
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy share link:", err);
      });
  }

  onDestroy(() => {
    if (copyTimeout) clearTimeout(copyTimeout);
  });

  onMount(() => {
    musicLock.revalidate();
    audioCore.init(library);
    if (initialTrackId) {
      const idx = library.findIndex((t) => t.id === initialTrackId);
      if (idx !== -1) {
        audioCore.loadTrack(idx, true);
      }
    } else if (!audioCore.hasPickedRandomTrack) {
      audioCore.hasPickedRandomTrack = true;
      const randomIdx = Math.floor(Math.random() * library.length);
      audioCore.loadTrack(randomIdx, false);
    }
  });

  let focusedTrackId = $state(null);

  function scrollFocusedTrackIntoView() {
    const el = document.querySelector(
      `.track-row[data-track-id="${focusedTrackId}"]`,
    );
    if (el) {
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  function selectSortedTrack(track) {
    focusedTrackId = track.id;
    const idx = library.findIndex((t) => t.id === track.id);
    if (
      audioCore.currentTrackIndex === idx &&
      !audioCore.fetchErrors[track.id]
    ) {
      audioCore.togglePlay();
    } else {
      audioCore.loadTrack(idx, true);
    }
  }

  function handleRecordClick() {
    const isMobile = window.innerWidth <= 640;
    if (isMobile) {
      showMobileTracklist = true;
    } else {
      showVisualizer = !showVisualizer;
    }
  }

  function toggleCrossfade() {
    const newVal = !audioCore.isInstrumental;
    const success = audioCore.setCrossfade(newVal);
    if (!success) {
      crossfadeFailCount++;

      if (!isKnobJiggling) {
        isKnobJiggling = true;
        setTimeout(() => {
          isKnobJiggling = false;
        }, 300);
      }

      if (crossfadeFailCount === 5) {
        triggerSparkBurst();
        isFlashActive = true;
        setTimeout(() => {
          isFlashActive = false;
        }, 150);
      } else if (crossfadeFailCount === 10) {
        triggerSparkBurst(35);
      } else if (crossfadeFailCount > 5 && crossfadeFailCount < 10) {
        triggerSparkBurst(8);
      } else if (crossfadeFailCount > 10) {
        if (Math.random() < 0.4) triggerSparkBurst(3);
      }
    }
  }

  function fmtTime(s) {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60)
      .toString()
      .padStart(2, "0")}`;
  }

  function handleKeydown(e) {
    const activeEl = document.activeElement;
    if (
      activeEl &&
      (activeEl.tagName === "INPUT" ||
        activeEl.tagName === "TEXTAREA" ||
        activeEl.isContentEditable)
    ) {
      return;
    }

    if (e.shiftKey) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const currentIdx = musicTabs.findIndex((t) => t.id === activeTab);
        const nextIdx = (currentIdx + 1) % musicTabs.length;
        activeTab = musicTabs[nextIdx].id;
        return;
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const currentIdx = musicTabs.findIndex((t) => t.id === activeTab);
        const prevIdx = (currentIdx - 1 + musicTabs.length) % musicTabs.length;
        activeTab = musicTabs[prevIdx].id;
        return;
      }
    }

    if (e.code === "Space" || e.key === " ") {
      if (activeTab === "songs") {
        e.preventDefault();
        audioCore.togglePlay();
      }
    } else if (e.key === "ArrowDown") {
      if (activeTab === "songs" && sortedLibrary.length > 0) {
        e.preventDefault();
        let currentIdx = sortedLibrary.findIndex(
          (t) => t.id === focusedTrackId,
        );
        if (currentIdx === -1) {
          const playingTrack = library[audioCore.currentTrackIndex];
          currentIdx = sortedLibrary.findIndex(
            (t) => t.id === playingTrack?.id,
          );
        }
        const nextIdx = (currentIdx + 1) % sortedLibrary.length;
        focusedTrackId = sortedLibrary[nextIdx].id;
        scrollFocusedTrackIntoView();
      }
    } else if (e.key === "ArrowUp") {
      if (activeTab === "songs" && sortedLibrary.length > 0) {
        e.preventDefault();
        let currentIdx = sortedLibrary.findIndex(
          (t) => t.id === focusedTrackId,
        );
        if (currentIdx === -1) {
          const playingTrack = library[audioCore.currentTrackIndex];
          currentIdx = sortedLibrary.findIndex(
            (t) => t.id === playingTrack?.id,
          );
        }
        const prevIdx =
          (currentIdx - 1 + sortedLibrary.length) % sortedLibrary.length;
        focusedTrackId = sortedLibrary[prevIdx].id;
        scrollFocusedTrackIntoView();
      }
    } else if (e.key === "Enter") {
      if (activeTab === "songs" && focusedTrackId) {
        e.preventDefault();
        const track = sortedLibrary.find((t) => t.id === focusedTrackId);
        if (track) {
          selectSortedTrack(track);
        }
      }
    }
  }

  let touchStartX = 0;
  let touchStartY = 0;

  function handleBodyTouchStart(e) {
    if (
      e.target &&
      (e.target.tagName === "INPUT" ||
        e.target.closest("button") ||
        e.target.closest(".ctrl"))
    ) {
      touchStartX = 0;
      touchStartY = 0;
      return;
    }
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  // Handle swipe gestures
  function handleBodyTouchEnd(e) {
    if (touchStartX === 0) return;
    if (!e.changedTouches || e.changedTouches.length === 0) return;

    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(diffX) <= Math.abs(diffY) || Math.abs(diffX) <= 60) return;

    const idx = musicTabs.findIndex((t) => t.id === activeTab);
    if (idx === -1) return;

    if (diffX < 0 && idx < musicTabs.length - 1) {
      activeTab = musicTabs[idx + 1].id;
    } else if (diffX > 0 && idx > 0) {
      activeTab = musicTabs[idx - 1].id;
    }
  }

  // DJ Crossfader Easter Egg States & WebGL Particle Logic
  let faderFxCanvas = $state(null);
  let crossfadeFailCount = $state(0);
  let isKnobJiggling = $state(false);
  let isFlashActive = $state(false);

  let fxScene, fxCamera, fxRenderer;
  let fxSparks = [];
  let fxSmoke = [];
  let fxAnimId;
  let hasSmokeStarted = $state(false);

  // Monitor canvas ref to instantiate/cleanup WebGL
  $effect(() => {
    if (faderFxCanvas) {
      initThreeFx();
    }
    return () => {
      if (fxAnimId) cancelAnimationFrame(fxAnimId);
      window.removeEventListener("resize", handleResize);
      if (fxRenderer) {
        fxRenderer.dispose();
        fxRenderer = null;
      }
      fxScene = null;
      fxCamera = null;
      fxSparks = [];
      fxSmoke = [];
    };
  });

  // Reset fail counts and clear meshes when track changes, tab changes, or leaving the player
  $effect(() => {
    const trackIdx = audioCore.currentTrackIndex;
    const tab = activeTab;
    const closing = isClosing;
    crossfadeFailCount = 0;
    hasSmokeStarted = false;
    if (fxScene) {
      for (const p of fxSparks) fxScene.remove(p.mesh);
      for (const p of fxSmoke) fxScene.remove(p.mesh);
    }
    fxSparks = [];
    fxSmoke = [];
  });

  function getKnobCoords() {
    const knobEl = document.querySelector(".dj-fader-knob");
    if (!knobEl) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const knobRect = knobEl.getBoundingClientRect();

    // Center coordinates on the fader knob
    const x = knobRect.left + knobRect.width / 2;
    const y = window.innerHeight - (knobRect.top + knobRect.height / 2);
    return { x, y };
  }

  function initThreeFx() {
    if (!faderFxCanvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    faderFxCanvas.width = width;
    faderFxCanvas.height = height;

    fxScene = new THREE.Scene();
    fxCamera = new THREE.OrthographicCamera(0, width, height, 0, -1, 1);

    fxRenderer = new THREE.WebGLRenderer({
      canvas: faderFxCanvas,
      alpha: true,
      antialias: true,
    });
    fxRenderer.setSize(width, height, false);
    fxRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    window.addEventListener("resize", handleResize);
    animateThreeFx();
  }

  function handleResize() {
    if (!faderFxCanvas || !fxRenderer || !fxCamera) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    faderFxCanvas.width = width;
    faderFxCanvas.height = height;
    fxRenderer.setSize(width, height, false);
    fxCamera.right = width;
    fxCamera.top = height;
    fxCamera.updateProjectionMatrix();
  }

  function animateThreeFx() {
    fxAnimId = requestAnimationFrame(animateThreeFx);
    if (!fxScene || !fxCamera || !fxRenderer || !faderFxCanvas) return;

    // Spawn smoke continuously once threshold met
    if (crossfadeFailCount >= 10) {
      hasSmokeStarted = true;
      if (Math.random() < 0.22) {
        const coords = getKnobCoords();
        spawnSmokeParticle(coords.x, coords.y);
      }
    }

    // Update sparks
    for (let i = fxSparks.length - 1; i >= 0; i--) {
      const p = fxSparks[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.ay; // gravity gravity
      p.life -= p.decay;

      p.mesh.position.set(p.x, p.y, 0);
      p.mesh.material.opacity = p.life;

      if (p.life <= 0) {
        fxScene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        fxSparks.splice(i, 1);
      }
    }

    // Update smoke
    for (let i = fxSmoke.length - 1; i >= 0; i--) {
      const p = fxSmoke[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      // Expand smoke into very large, soft, floating clouds as it goes up the screen
      const scale = p.startScale + (1.0 - p.life) * 88;
      p.mesh.scale.set(scale, scale, 1);
      p.mesh.position.set(p.x, p.y, 0);
      p.mesh.material.opacity = p.life * 0.16;

      if (p.life <= 0) {
        fxScene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        fxSmoke.splice(i, 1);
      }
    }

    fxRenderer.render(fxScene, fxCamera);
  }

  function spawnSmokeParticle(x, y) {
    if (!fxScene) return;

    const geom = new THREE.CircleGeometry(5.0, 8);
    // Whitish-grey color parameters
    const colorVal = 0.85 + Math.random() * 0.12;
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colorVal, colorVal, colorVal * 1.01),
      transparent: true,
      opacity: 0.06,
      blending: THREE.NormalBlending,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(x, y, 0);
    fxScene.add(mesh);

    fxSmoke.push({
      mesh,
      x,
      y,
      vx: (Math.random() - 0.5) * 0.55 + Math.sin(Date.now() * 0.001) * 0.22, // wind drift
      vy: Math.random() * 0.7 + 1.25, // rise upwards faster
      startScale: 1.0,
      life: 1.0,
      decay: 0.0006 + Math.random() * 0.0004, // extremely slow decay to rise completely past the top of the screen!
    });
  }

  function triggerSparkBurst(count = 25) {
    if (!fxScene || !faderFxCanvas) return;
    const coords = getKnobCoords();
    const knobX = coords.x;
    const knobY = coords.y;

    for (let i = 0; i < count; i++) {
      const geom = new THREE.CircleGeometry(1.3, 4);
      const isPink = Math.random() < 0.4;
      const color = isPink ? 0xff0055 : 0xffaa00;

      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(knobX, knobY, 0);
      fxScene.add(mesh);

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.0 + 2.0;

      fxSparks.push({
        mesh,
        x: knobX,
        y: knobY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        ay: -0.15,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.02,
      });
    }
  }
</script>

<svelte:window
  onkeydown={handleKeydown}
  onpopstate={handlePopState}
  onclick={handleWindowClick}
/>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="mp-backdrop" onclick={onClose}>
  <div
    class="mp-container"
    class:closing={isClosing}
    class:theme-inst={audioCore.isInstrumental}
    onclick={(e) => e.stopPropagation()}
  >
    <!-- Header -->
    <header class="panel-header">
      <div class="brand">
        <button
          class="logo-btn"
          onclick={() => {
            if (audioCore.isPlaying) return;
            window.dispatchEvent(new CustomEvent("open-info-panel"));
          }}
          aria-label="Open DOGS Info"
        >
          <DogsLogo size="panel" />
        </button>
        <h1>{title}</h1>
      </div>

      <button class="close-btn" onclick={onClose} aria-label="Close panel">
        <ArrowLeft size={20} />
      </button>
    </header>

    <SwipeTabNav tabs={musicTabs} bind:activeTab />

    <div
      class="mp-body"
      ontouchstart={handleBodyTouchStart}
      ontouchend={handleBodyTouchEnd}
    >
      {#if activeTab === "songs"}
        <div
          class="songs-layout"
          in:fade={{ duration: 120, delay: 120 }}
          out:fade={{ duration: 120 }}
        >
          <!-- Left side player details -->
          <div class="player-side" class:tracklist-open={showMobileTracklist}>
            <!-- Top block (Vinyl & track info) - disappears on mobile tracklist active -->
            <div
              class="player-top-block transition-all duration-300 ease-in-out"
              class:opacity-0={showMobileTracklist}
              class:scale-95={showMobileTracklist}
              class:pointer-events-none={showMobileTracklist}
            >
              <!-- Vinyl disc OR Cassette OR Visualizer -->
              <div class="vinyl-wrapper relative overflow-hidden">
                {#if showVisualizer && !isFullscreenVisualizer}
                  <!-- Compact Visualizer Container -->
                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div
                    class="visualizer-container cursor-pointer"
                    onclick={() => {
                      isFullscreenVisualizer = true;
                    }}
                  >
                    <canvas bind:this={canvasEl} class="visualizer-canvas"
                    ></canvas>

                    {#if !audioCore.isPlaying && !hasMusicPlayed}
                      <div
                        class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse"
                      >
                        <div
                          class="bg-black/75 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] select-none"
                        >
                          NO SIGNAL
                        </div>
                      </div>
                    {/if}

                    <!-- Subtle maximize icon on hover -->
                    <div class="visualizer-hover-overlay">
                      <Maximize2 size={16} class="text-white/70" />
                    </div>
                  </div>
                {:else if showVisualizer && isFullscreenVisualizer}
                  <!-- Placeholder keeping layout static when visualizer is fullscreen -->
                  <div
                    class="visualizer-container bg-[#050508]/40 border border-white/5 flex items-center justify-center"
                  >
                    <Maximize2 size={16} class="text-white/20" />
                  </div>
                {:else}
                  <!-- Dynamic Deck Media Model -->
                  {#if settingsManager.musicDeckModel === "vinyl"}
                    <!-- Vinyl view clicker -->
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
                    <div
                      class="vinyl-record-clicker cursor-pointer w-full h-full"
                      onclick={handleRecordClick}
                      role="button"
                      tabindex="0"
                      aria-label="Open tracklist"
                    >
                      <div class="vinyl-record" class:spinning={isAnimating}>
                        <div class="groove g1"></div>
                        <div class="groove g2"></div>
                        <div class="groove g3"></div>
                        <div class="groove g4"></div>
                        <div class="record-label">
                          <img
                            src={audioCore.fetchErrors[currentTrack.id] ||
                            !currentTrack.cover
                              ? ERROR_COVER
                              : currentTrack.cover}
                            alt={currentTrack.album}
                            loading="lazy"
                            class="record-art"
                            class:loaded={vinylLoaded}
                            onload={() => (vinylLoaded = true)}
                            onerror={handleCoverError}
                          />
                        </div>
                        <div class="spindle"></div>
                      </div>
                      <div class="tonearm" class:playing={isAnimating}></div>
                    </div>
                  {:else if settingsManager.musicDeckModel === "cassette"}
                    {@const leftSpoolRatio =
                      audioCore.duration > 0
                        ? (1 - audioCore.currentTime / audioCore.duration) *
                            0.45 +
                          0.25
                        : 0.48}
                    {@const rightSpoolRatio =
                      audioCore.duration > 0
                        ? (audioCore.currentTime / audioCore.duration) * 0.45 +
                          0.25
                        : 0.48}
                    <!-- Cassette view clicker -->
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
                    <div
                      class="cassette-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative"
                      onclick={handleRecordClick}
                      role="button"
                      tabindex="0"
                      aria-label="Open tracklist"
                    >
                      <div class="cassette-tape">
                        <div
                          class="cassette-label bg-gradient-to-r from-purple-800 to-pink-700"
                        >
                          <span class="cassette-track-title"
                            >{currentTrack.title}</span
                          >
                          <span class="cassette-brand">WEAREDOGS AUDIO</span>
                        </div>
                        <div class="cassette-window bg-zinc-950/80">
                          <div
                            class="spindle-left bg-zinc-900"
                            class:spinning={isAnimating}
                          ></div>
                          <div
                            class="tape-roll-left bg-amber-950/70"
                            class:spinning={isAnimating}
                            style="width: {leftSpoolRatio *
                              46}px; height: {leftSpoolRatio * 46}px;"
                          ></div>
                          <div
                            class="spindle-right bg-zinc-900"
                            class:spinning={isAnimating}
                          ></div>
                          <div
                            class="tape-roll-right bg-amber-950/70"
                            class:spinning={isAnimating}
                            style="width: {rightSpoolRatio *
                              46}px; height: {rightSpoolRatio * 46}px;"
                          ></div>
                        </div>
                      </div>
                    </div>
                  {:else if settingsManager.musicDeckModel === "floppy"}
                    <!-- Floppy Disk view clicker -->
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
                    <div
                      class="floppy-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative"
                      onclick={handleRecordClick}
                      role="button"
                      tabindex="0"
                      aria-label="Open tracklist"
                    >
                      <div class="floppy-disk">
                        <div class="floppy-corner"></div>
                        <div class="floppy-write-protect"></div>

                        <div class="floppy-label bg-slate-100 text-slate-900">
                          <div class="floppy-label-stripe bg-red-600"></div>
                          <div
                            class="floppy-label-stripe-blue bg-blue-600"
                          ></div>
                          <div class="floppy-label-content">
                            <div class="floppy-song truncate font-mono">
                              {currentTrack.title}
                            </div>
                            <div class="floppy-artist truncate font-mono">
                              {currentTrack.artist || "WEAREDOGS"}
                            </div>
                          </div>
                        </div>

                        <div class="floppy-shutter-door bg-zinc-700">
                          <div
                            class="floppy-shutter-slider bg-zinc-400"
                            class:open={isAnimating}
                          ></div>
                          <div class="floppy-shutter-opening bg-zinc-950">
                            <div
                              class="floppy-magnetic-disc bg-zinc-900"
                              class:spinning={isAnimating}
                            ></div>
                          </div>
                        </div>

                        <div
                          class="floppy-drive-led"
                          class:active={isAnimating}
                        ></div>
                      </div>
                    </div>
                  {:else if settingsManager.musicDeckModel === "musicbox"}
                    <!-- Music Box view clicker -->
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
                    <div
                      class="musicbox-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative"
                      onclick={handleRecordClick}
                      role="button"
                      tabindex="0"
                      aria-label="Open tracklist"
                    >
                      <div class="music-box">
                        <div
                          class="music-box-key"
                          class:spinning={isAnimating}
                        ></div>

                        <div
                          class="music-box-interior border border-amber-900/40"
                        >
                          <div class="music-box-gears">
                            <div
                              class="music-box-gear gear-1"
                              class:spinning={isAnimating}
                            ></div>
                            <div
                              class="music-box-gear gear-2"
                              class:spinning={isAnimating}
                            ></div>
                          </div>

                          <div class="music-box-drum-wrap">
                            <div
                              class="music-box-drum bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700"
                              class:spinning={isAnimating}
                            >
                              <div class="music-box-pins">
                                <div class="pin pin-1"></div>
                                <div class="pin pin-2"></div>
                                <div class="pin pin-3"></div>
                                <div class="pin pin-4"></div>
                                <div class="pin pin-5"></div>
                                <div class="pin pin-6"></div>
                              </div>
                            </div>
                          </div>

                          <div class="music-box-comb">
                            {#each Array(10) as _, idx}
                              <div
                                class="comb-tooth"
                                class:vibrating={isAnimating &&
                                  idx % 3 ===
                                    Math.floor(audioCore.currentTime * 4) % 3}
                              ></div>
                            {/each}
                          </div>
                        </div>
                      </div>
                    </div>
                  {/if}
                {/if}
              </div>

              <!-- Track info (Always visible!) -->
              <div class="track-info mt-2">
                <div class="flex items-center justify-center mb-1.5">
                  <button
                    class="player-share-btn"
                    onclick={(e) => handleShareTrack(e, currentTrack)}
                    title="Copy track link"
                    aria-label="Share track"
                  >
                    {#if copiedTrackId === currentTrack.id}
                      <Check size={12} class="text-[#22c55e]" />
                    {:else}
                      <Share2 size={12} />
                    {/if}
                  </button>
                </div>
                <div
                  class="scroll-container"
                  bind:clientWidth={titleContainerWidth}
                  class:overflowing={titleTextWidth > titleContainerWidth}
                  style="--scroll-dist: -{titleTextWidth -
                    titleContainerWidth}px"
                >
                  <h2
                    class="track-title scroll-text"
                    bind:clientWidth={titleTextWidth}
                    class:animate-scroll={titleTextWidth > titleContainerWidth}
                  >
                    {currentTrack.title}
                  </h2>
                </div>
                <div
                  class="scroll-container"
                  bind:clientWidth={artistContainerWidth}
                  class:overflowing={artistTextWidth > artistContainerWidth}
                  style="--scroll-dist: -{artistTextWidth -
                    artistContainerWidth}px"
                >
                  <p
                    class="track-artist scroll-text"
                    bind:clientWidth={artistTextWidth}
                    class:animate-scroll={artistTextWidth >
                      artistContainerWidth}
                  >
                    {currentTrack.artist}
                  </p>
                </div>
                <div
                  class="scroll-container"
                  bind:clientWidth={albumContainerWidth}
                  class:overflowing={albumTextWidth > albumContainerWidth}
                  style="--scroll-dist: -{albumTextWidth -
                    albumContainerWidth}px"
                >
                  <p
                    class="track-album scroll-text"
                    bind:clientWidth={albumTextWidth}
                    class:animate-scroll={albumTextWidth > albumContainerWidth}
                  >
                    {currentTrack.album}
                  </p>
                </div>
              </div>
            </div>

            <!-- Bottom block (Controls & Faders) - persistent on mobile -->
            <div class="player-controls-block">
              <!-- Seek bar -->
              <div class="progress-row">
                <span class="ptime">{fmtTime(audioCore.currentTime)}</span>
                <div
                  class="progress-wrap waveform-slider-wrap relative h-9 flex items-end"
                >
                  <!-- Waveform bars -->
                  <div
                    class="waveform-bars flex items-end justify-between absolute inset-0 pointer-events-none px-1 h-full"
                  >
                    {#each waveformPeaks as peak, idx}
                      {@const progress =
                        audioCore.duration > 0
                          ? audioCore.currentTime / audioCore.duration
                          : 0}
                      {@const barProgress = idx / 60}
                      <span
                        class="waveform-bar transition-colors duration-100 rounded-full"
                        class:active={barProgress <= progress}
                        style="height: {peak}%; width: 3px;"
                      ></span>
                    {/each}
                  </div>

                  <input
                    type="range"
                    class="seek-input absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    min="0"
                    max={audioCore.duration || 100}
                    step="0.1"
                    value={audioCore.currentTime}
                    oninput={(e) => {
                      audioCore.seek(parseFloat(e.target.value));
                    }}
                    onchange={(e) => {
                      if (!audioCore.isPlaying) {
                        audioCore.play(parseFloat(e.target.value));
                      }
                    }}
                    aria-label="Seek"
                  />
                </div>
                <span class="ptime">{fmtTime(audioCore.duration)}</span>
              </div>

              <!-- Player main buttons -->
              <div class="controls-row">
                <button
                  class="ctrl ctrl-sm"
                  class:active-ctrl={audioCore.isShuffled}
                  onclick={() => audioCore.setShuffle(!audioCore.isShuffled)}
                  aria-label="Shuffle"
                >
                  <Shuffle size={15} />
                </button>
                <button
                  class="ctrl ctrl-md"
                  onclick={() => audioCore.prevTrack()}
                  aria-label="Previous"
                >
                  <SkipBack size={19} />
                </button>
                <button
                  class="ctrl ctrl-play"
                  class:ctrl-error={audioCore.fetchErrors[currentTrack.id]}
                  onclick={() => audioCore.togglePlay()}
                  aria-label={audioCore.isPlaying ? "Pause" : "Play"}
                >
                  {#if audioCore.fetchErrors[currentTrack.id]}
                    <AlertTriangle size={22} />
                  {:else if audioCore.isLoading}
                    <div class="spin-ring"></div>
                  {:else if audioCore.isPlaying}
                    <Pause size={22} fill="currentColor" />
                  {:else}
                    <Play size={22} fill="currentColor" />
                  {/if}
                </button>
                <button
                  class="ctrl ctrl-md"
                  onclick={() => audioCore.nextTrack()}
                  aria-label="Next"
                >
                  <SkipForward size={19} />
                </button>
                <button
                  class="ctrl ctrl-sm"
                  class:active-ctrl={audioCore.repeatMode > 0}
                  onclick={() => {
                    audioCore.repeatMode = (audioCore.repeatMode + 1) % 3;
                  }}
                  aria-label="Repeat"
                >
                  {#if audioCore.repeatMode === 2}<Repeat1
                      size={15}
                    />{:else}<Repeat size={15} />{/if}
                </button>
              </div>

              <!-- Custom DJ Crossfader -->
              <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1">
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  class="dj-crossfader"
                  class:fader-flash={isFlashActive}
                  class:fader-fried={crossfadeFailCount >= 10}
                  onclick={toggleCrossfade}
                >
                  <span
                    class="fader-label left-label flex items-center gap-1"
                    class:active={!audioCore.isInstrumental}
                  >
                    <Mic2 size={12} />
                    <span>VOCAL</span>
                  </span>
                  <div class="dj-fader-slot relative">
                    <div
                      class="dj-fader-knob"
                      class:right={audioCore.isInstrumental}
                      class:knob-jiggle={isKnobJiggling}
                      class:fried={crossfadeFailCount >= 10}
                    ></div>
                  </div>
                  <span
                    class="fader-label right-label flex items-center gap-1"
                    class:active={audioCore.isInstrumental}
                  >
                    <Guitar size={12} />
                    <span>INST</span>
                  </span>
                </div>
              </div>

              <!-- Volume & Visualizer controls wrapper -->
              <div
                class="relative flex justify-center items-center gap-3 mt-2 w-full"
              >
                {#if showVolumeSlider}
                  <div class="volume-popover" bind:this={volumePopoverEl}>
                    <button
                      class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10"
                      onclick={() => audioCore.toggleMute()}
                      aria-label="Mute"
                    >
                      {#if audioCore.isMuted || audioCore.volume === 0}
                        <VolumeX size={12} class="text-red-400" />
                      {:else}
                        <Volume2 size={12} />
                      {/if}
                    </button>
                    <input
                      type="range"
                      class="vol-slider-pop"
                      min="0"
                      max="1"
                      step="0.01"
                      value={audioCore.volume}
                      oninput={(e) =>
                        audioCore.setVolume(parseFloat(e.target.value))}
                      aria-label="Volume"
                    />
                    <span
                      class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none"
                    >
                      {Math.round(audioCore.volume * 100)}%
                    </span>
                  </div>
                {/if}

                <!-- Visualizer Toggle Button & Preset Cycler -->
                <div class="flex items-center gap-1.5">
                  <button
                    class="ctrl ctrl-xs"
                    class:active-ctrl={showVisualizer}
                    onclick={() => {
                      showVisualizer = !showVisualizer;
                    }}
                    aria-label="Toggle Visualizer"
                  >
                    <Waves size={13} />
                  </button>
                  <button
                    class="w-[90px] h-[20px] flex items-center justify-center rounded text-[9px] font-bold transition-all font-mono uppercase tracking-wider select-none cursor-pointer
                      {showVisualizer
                      ? 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 active:scale-95'
                      : 'bg-transparent border border-white/5 text-white/20 hover:text-white/40 hover:border-white/10'}"
                    onclick={() => {
                      if (!showVisualizer) {
                        showVisualizer = true;
                      } else {
                        activePresetIdx =
                          (activePresetIdx + 1) % PRESETS.length;
                      }
                    }}
                    title={showVisualizer
                      ? "Click to cycle presets"
                      : "Click to enable visualizer"}
                  >
                    {PRESETS[activePresetIdx].name}
                  </button>
                </div>

                <!-- Volume controls wrapper -->
                <div class="relative">
                  <button
                    class="ctrl ctrl-xs vol-toggle-btn"
                    onclick={() => {
                      showVolumeSlider = !showVolumeSlider;
                    }}
                    aria-label="Toggle volume slider"
                  >
                    {#if audioCore.isMuted || audioCore.volume === 0}
                      <VolumeX size={13} class="text-red-400" />
                    {:else}
                      <Volume2 size={13} />
                    {/if}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right side tracklist -->
          <div class="tracklist-side" class:show-mobile={showMobileTracklist}>
            <!-- Mobile back button to close tracklist drawer -->
            <div
              class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between"
            >
              <span class="text-xs font-bold text-white/50">Track Library</span>
              <button
                class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold"
                onclick={() => {
                  showMobileTracklist = false;
                }}
              >
                Back to player
              </button>
            </div>

            <div class="tl-header flex justify-between items-center gap-3">
              <div class="flex items-center gap-2">
                <List size={13} /><span>TRACKS</span>
                <span class="tl-count">{library.length}</span>
              </div>

              <!-- Sorting selector dropdown -->
              <div class="flex items-center gap-1.5 ml-auto">
                <span class="text-[9px] text-white/30 font-bold font-sans"
                  >SORT BY:</span
                >
                <select
                  bind:value={sortBy}
                  class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans"
                >
                  <option value="default">DEFAULT</option>
                  <option value="artist">ARTIST</option>
                  <option value="album">ALBUM</option>
                  <option value="year">YEAR</option>
                  <option value="filename">FILENAME</option>
                  <option value="genre">GENRE</option>
                  <option value="season">SEASON</option>
                </select>
              </div>
            </div>

            <div class="tracklist scroll-y">
              {#each sortedLibrary as track, i}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  class="track-row"
                  class:active={currentTrack.id ===
                    track.id}
                  class:kb-focused={focusedTrackId === track.id}
                  class:fetch-error={audioCore.fetchErrors[track.id]}
                  data-track-id={track.id}
                  onclick={() => selectSortedTrack(track)}
                >
                  <div class="tr-num">
                    {#if currentTrack.id === track.id && audioCore.isPlaying}
                      <div class="eq">
                        <div class="eq-b"></div>
                        <div class="eq-b"></div>
                        <div class="eq-b"></div>
                      </div>
                    {:else}
                      <span>{i + 1}</span>
                    {/if}
                  </div>
                  <img
                    src={audioCore.fetchErrors[track.id] || !track.cover
                      ? ERROR_COVER
                      : track.cover}
                    alt={track.album}
                    loading="lazy"
                    class="tr-art"
                    onerror={handleCoverError}
                  />
                  <div class="tr-info">
                    <div class="flex items-center gap-1.5 min-w-0">
                      <span
                        class="tr-title"
                        class:line-through={audioCore.fetchErrors[track.id]}
                        class:opacity-50={audioCore.fetchErrors[track.id]}
                        >{track.title}</span
                      >
                      {#if audioCore.fetchErrors[track.id]}
                        <span
                          class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0"
                          title="Failed to fetch music source from remote database"
                        >
                          <AlertTriangle size={10} /> Error Fetching
                        </span>
                      {/if}
                    </div>
                    <span class="tr-meta"
                      >{track.artist} · {track.album} ({track.year || ""})</span
                    >
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    {#if track.attrib}
                      <span class="inst-chip-link">
                        {#if track.id === "arigato"}
                          <button
                            onclick={(e) => {
                              e.stopPropagation();
                              showArigatoModal = true;
                            }}
                            class="cursor-pointer"
                            style="background: none; border: none; padding: 0; color: inherit; font: inherit;"
                          >
                            i
                          </button>
                        {:else}
                          <a
                            href={track.attrib}
                            target="_blank"
                            onclick={(e) => e.stopPropagation()}>i</a
                          >
                        {/if}
                      </span>
                    {/if}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <button
                      class="tr-share-btn"
                      onclick={(e) => handleShareTrack(e, track)}
                      title="Copy track link"
                      aria-label="Share track"
                    >
                      {#if copiedTrackId === track.id}
                        <Check size={12} class="text-[#22c55e]" />
                      {:else}
                        <Share2 size={12} />
                      {/if}
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {:else if activeTab === "samples"}
        <div
          class="tab-scroll scroll-y"
          in:fade={{ duration: 120, delay: 120 }}
          out:fade={{ duration: 120 }}
        >
          <div class="sec-head">
            <h2 class="sec-title">Samples</h2>
            <p class="sec-sub">
              MP3 · MP4 · WAV · OGG · YouTube · Instagram · TikTok
            </p>
          </div>
          <div class="drop-zone">
            <Mic2 size={36} />
            <p class="drop-title">Drop files or paste a link</p>
            <p class="drop-sub">
              Supports all major audio, video, and streaming links
            </p>
            <div class="link-row">
              <input
                type="url"
                class="link-input"
                placeholder="https://youtube.com/watch?v=..."
                aria-label="Paste link"
              />
              <button class="add-btn"><Plus size={15} />Add</button>
            </div>
          </div>
          <div class="empty-state">
            <div class="wip-tape">COMING SOON</div>
            <p>Your samples will appear here once added.</p>
          </div>
        </div>
      {:else if activeTab === "playlists"}
        <div
          class="tab-scroll scroll-y"
          in:fade={{ duration: 120, delay: 120 }}
          out:fade={{ duration: 120 }}
        >
          <div class="sec-head">
            <h2 class="sec-title">Playlists</h2>
            <p class="sec-sub">
              Connect Spotify to sync playlists across all services
              automatically
            </p>
          </div>
          <div class="spotify-card">
            <div class="sp-icon">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="30"
                height="30"
              >
                <path
                  d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                />
              </svg>
            </div>
            <div class="sp-info">
              <h3>Connect Spotify</h3>
              <p>Import your playlists and sync across services</p>
            </div>
            <button class="sp-btn">Connect <ChevronRight size={15} /></button>
          </div>
          <div class="svc-chips">
            {#each [{ name: "Apple Music", color: "#fc3c44", icon: "🎵" }, { name: "YouTube Music", color: "#ff0000", icon: "▶" }, { name: "Amazon Music", color: "#00a8e0", icon: "♪" }, { name: "Tidal", color: "#00d4f5", icon: "〰" }] as svc}
              <div class="svc-chip" style="--sc:{svc.color}">
                <span>{svc.icon}</span><span>{svc.name}</span><ExternalLink
                  size={11}
                />
              </div>
            {/each}
          </div>
          <div class="empty-state mx-auto max-w-[380px] text-center">
            <div class="wip-tape">COMING SOON</div>
            <p>
              Connect Spotify to see your playlists, automatically transcribed
              across all services.
            </p>
          </div>
        </div>
      {:else if activeTab === "radio"}
        <div
          class="tab-scroll scroll-y"
          in:fade={{ duration: 120, delay: 120 }}
          out:fade={{ duration: 120 }}
        >
          <div class="sec-head">
            <h2 class="sec-title">Radio</h2>
            <p class="sec-sub">
              Stream live broadcasts, dog shows, and podcast feeds
            </p>
          </div>
          <div class="empty-state mx-auto max-w-[380px] text-center">
            <div class="wip-tape">COMING SOON</div>
            <p>Live radio feeds will appear here once connected.</p>
          </div>
        </div>
      {:else if activeTab === "battle"}
        <div
          class="tab-scroll scroll-y"
          in:fade={{ duration: 120, delay: 120 }}
          out:fade={{ duration: 120 }}
        >
          {#if loadedBattlePanel}
            {@const Panel = loadedBattlePanel}
            <Panel {audioCore} />
          {:else}
            <div class="app-loading-spinner" aria-label="Loading..."></div>
          {/if}
        </div>
      {/if}
    </div>

    <footer class="mp-footer">
      <div class="mp-status">
        <span class="mp-dot"></span><span>🐕</span>
      </div>
      <span>MUSIC</span>
    </footer>
  </div>

  {#if showVisualizer && isFullscreenVisualizer}
    <!-- Fullscreen Visualizer Container -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="visualizer-container fullscreen cursor-pointer"
      onclick={(e) => {
        e.stopPropagation();
        isFullscreenVisualizer = false;
      }}
    >
      <canvas bind:this={canvasEl} class="visualizer-canvas"></canvas>

      {#if !audioCore.isPlaying && !hasMusicPlayed}
        <div
          class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse"
        >
          <div
            class="bg-black/75 border border-red-500/30 px-4 py-2 rounded text-[12px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_20px_rgba(239,68,68,0.3)] select-none"
          >
            NO SIGNAL
          </div>
        </div>
      {/if}

      <div class="visualizer-overlay" onclick={(e) => e.stopPropagation()}>
        <div
          class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10"
        >
          {#each PRESETS as preset, index}
            <button
              class="px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono
                {activePresetIdx === index
                ? 'bg-purple-600 text-white'
                : 'text-white/40 hover:text-white/80'}"
              onclick={() => (activePresetIdx = index)}
            >
              {preset.name}
            </button>
          {/each}
        </div>
      </div>
    </div>
  {/if}
  <canvas bind:this={faderFxCanvas} class="fader-fx-canvas pointer-events-none"
  ></canvas>

  {#if showArigatoModal}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="arigato-modal-backdrop"
      onclick={() => (showArigatoModal = false)}
      transition:fade={{ duration: 150 }}
    >
      <div class="arigato-modal-content" onclick={(e) => e.stopPropagation()}>
        <header class="arigato-modal-header">
          <h2>ARIGATO INFO</h2>
          <button
            class="arigato-close-btn"
            onclick={() => (showArigatoModal = false)}
          >
            <ArrowLeft size={16} />
          </button>
        </header>
        <div class="arigato-modal-body scroll-y">
          <div class="merch-link-container">
            <a
              href="https://nxnjaa.beatstars.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="merch-link-btn"
            >
              <ExternalLink size={14} /> NXNJA MERCH & MUSIC
            </a>
          </div>
          <p class="intro-text">{@html linkify(arigatoParts.intro)}</p>
          <div class="tos-box">
            <div class="tos-microtext">
              {@html linkify(arigatoParts.tos)}
            </div>
          </div>
          <p class="outro-text">{@html linkify(arigatoParts.outro)}</p>
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "../styles/music-panel.scss";

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

  /* ── DJ Crossfader ── */
  .dj-crossfader {
    position: relative;
    width: 100%;
    height: 34px;
    background: linear-gradient(180deg, #1e1e24 0%, #121215 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    box-sizing: border-box;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.05),
      0 8px 24px rgba(0, 0, 0, 0.5);
    gap: 12px;
    user-select: none;
  }

  .fader-label {
    font-size: 0.65rem;
    font-weight: 800;
    font-family: monospace;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.2);
    transition: color 0.2s ease;
  }

  .fader-label.left-label.active {
    color: #a855f7; /* Vocal side active */
    text-shadow: 0 0 8px rgba(168, 85, 247, 0.4);
  }

  .fader-label.right-label.active {
    color: #06b6d4; /* Inst side active */
    text-shadow: 0 0 8px rgba(6, 182, 212, 0.4);
  }

  .dj-fader-slot {
    flex: 1;
    height: 4px;
    background: #000;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 2px;
    position: relative;
  }

  .dj-fader-knob {
    position: absolute;
    top: 50%;
    left: 0%;
    width: 24px;
    height: 18px;
    transform: translate(0, -50%);
    background: linear-gradient(135deg, #666 0%, #333 50%, #222 100%);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 3px;
    box-shadow:
      0 4px 10px rgba(0, 0, 0, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    transition: left 0.18s cubic-bezier(0.25, 0.8, 0.25, 1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dj-fader-knob::after {
    content: "";
    width: 2px;
    height: 100%;
    background: #fff;
    box-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
  }

  .dj-fader-knob.right {
    left: calc(100% - 24px);
  }

  /* ── Volume Popover ── */
  .volume-popover {
    position: absolute;
    bottom: 38px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(15, 15, 20, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 6px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
    z-index: 50;
    min-width: 150px;
    pointer-events: auto;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .vol-slider-pop {
    flex: 1;
    height: 3px;
    accent-color: #a855f7;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    outline: none;
  }

  /* ── WebGL Audio Visualizer ── */
  .visualizer-container {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 50%; /* Make it match vinyl disk shape initially */
    overflow: hidden;
    background: #050508;
    border: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    flex-direction: column;
    transition: border-radius 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .visualizer-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    z-index: 1;
  }

  .visualizer-overlay {
    position: absolute;
    bottom: 16px;
    left: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    z-index: 10;
  }

  .visualizer-container.fullscreen {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    border-radius: 0 !important; /* Full rectangle in fullscreen */
    border: none;
    z-index: 2000;
  }

  .visualizer-hover-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.22s ease;
    border-radius: 50%;
  }

  .visualizer-container:hover .visualizer-hover-overlay {
    opacity: 1;
  }

  /* ── DJ Crossfader Easter Egg Animations & FX ── */
  @keyframes knob-wiggle {
    0%,
    100% {
      transform: translate(0, -50%) scale(1);
    }
    20%,
    60% {
      transform: translate(-3.5px, -50%) rotate(-4deg);
    }
    40%,
    80% {
      transform: translate(3.5px, -50%) rotate(4deg);
    }
  }

  .knob-jiggle {
    animation: knob-wiggle 0.3s ease-in-out;
  }

  .dj-fader-knob.fried {
    background: linear-gradient(
      135deg,
      #2c2222 0%,
      #1a1212 50%,
      #0f0505 100%
    ) !important;
    border-color: rgba(239, 68, 68, 0.35) !important;
    box-shadow:
      0 4px 10px rgba(0, 0, 0, 0.9),
      0 0 8px rgba(239, 68, 68, 0.25) !important;
  }

  .dj-fader-knob.fried::after {
    background: #ef4444 !important;
    box-shadow: 0 0 5px #ef4444 !important;
    animation: fader-flicker 0.15s infinite alternate;
  }

  @keyframes fader-flicker {
    0% {
      opacity: 0.35;
    }
    100% {
      opacity: 1;
    }
  }

  .dj-crossfader.fader-flash {
    animation: fader-flash-anim 0.15s ease-out;
  }

  @keyframes fader-flash-anim {
    0% {
      background: #ff0055;
      box-shadow: 0 0 25px rgba(255, 0, 85, 0.8);
      border-color: #ffffff;
    }
    100% {
      background: linear-gradient(180deg, #1e1e24 0%, #121215 100%);
      border-color: rgba(255, 255, 255, 0.08);
    }
  }

  .dj-crossfader.fader-fried {
    border-color: rgba(239, 68, 68, 0.25) !important;
    box-shadow:
      inset 0 0 8px rgba(239, 68, 68, 0.08),
      0 8px 24px rgba(0, 0, 0, 0.5) !important;
  }

  .fader-fx-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 99999;
  }

  /* ── Cassette Tape Visual ── */
  .cassette-tape {
    width: 200px;
    height: 125px;
    background: linear-gradient(135deg, #1f1f23 0%, #0d0d0f 100%);
    border: 3px solid #2d2d34;
    border-radius: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    box-sizing: border-box;

    @media (min-width: 640px) {
      width: 240px;
      height: 150px;
      border-width: 4px;
      padding: 12px;
    }
  }

  .cassette-label {
    width: 100%;
    height: 38px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    font-family: monospace;
    font-weight: bold;
    padding: 2px;
    box-sizing: border-box;
    text-transform: uppercase;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);

    @media (min-width: 640px) {
      height: 46px;
    }
  }

  .cassette-track-title {
    font-size: 9px;
    letter-spacing: 0.05em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 90%;

    @media (min-width: 640px) {
      font-size: 11px;
    }
  }

  .cassette-brand {
    font-size: 7px;
    opacity: 0.8;
    margin-top: 1px;
    letter-spacing: 0.1em;

    @media (min-width: 640px) {
      font-size: 8px;
      margin-top: 2px;
    }
  }

  .cassette-window {
    width: 110px;
    height: 40px;
    border: 2px solid #3f3f46;
    border-radius: 5px;
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 6px;
    overflow: hidden;

    @media (min-width: 640px) {
      width: 130px;
      height: 48px;
      margin-top: 8px;
    }
  }

  .spindle-left,
  .spindle-right {
    width: 18px;
    height: 18px;
    border: 3px dashed #71717a;
    border-radius: 50%;
    box-sizing: border-box;
    z-index: 5;

    @media (min-width: 640px) {
      width: 22px;
      height: 22px;
      border-width: 4px;
    }

    &.spinning {
      animation: rotate-spindle 4s linear infinite;
    }
  }

  .tape-roll-left,
  .tape-roll-right {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
    z-index: 1;
    opacity: 0.85;

    &.spinning {
      animation: rotate-spindle 6s linear infinite;
    }
  }

  .tape-roll-left {
    left: 12px;
    transform: translate(0, -50%);
    @media (min-width: 640px) {
      left: 16px;
    }
  }

  .tape-roll-right {
    right: 12px;
    transform: translate(0, -50%);
    @media (min-width: 640px) {
      right: 16px;
    }
  }

  @keyframes rotate-spindle {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* ── Waveform seek slider styling ── */
  .waveform-slider-wrap {
    height: 36px;
    background: rgba(0, 0, 0, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    transition:
      border-color 0.2s,
      background 0.2s;

    .seek-input {
      height: 100% !important;
      inset: 0 !important;
      margin: 0;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.55);
      border-color: rgba(255, 255, 255, 0.2);

      .waveform-bar:not(.active) {
        background-color: rgba(255, 255, 255, 0.22);
      }
      .waveform-bar.active {
        box-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
      }
    }
  }

  .waveform-bar {
    background-color: rgba(255, 255, 255, 0.12);
    border-radius: 9999px;
    transition:
      background-color 0.2s,
      background 0.2s,
      box-shadow 0.2s;

    &.active {
      background: linear-gradient(180deg, #ff007f 0%, #00f0ff 100%);
      box-shadow: 0 0 4px rgba(0, 240, 255, 0.4);
    }
  }

  /* ── Floppy Disk Visual ── */
  .floppy-disk {
    width: 160px;
    height: 160px;
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border: 3px solid #334155;
    border-radius: 8px;
    position: relative;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.65);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 8px;
    box-sizing: border-box;
    clip-path: polygon(0 0, 88% 0, 100% 12%, 100% 100%, 0 100%);

    @media (min-width: 640px) {
      width: 190px;
      height: 190px;
      border-width: 4px;
      padding: 10px;
    }
  }

  .floppy-corner {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background: transparent;
    z-index: 10;
  }

  .floppy-write-protect {
    position: absolute;
    bottom: 8px;
    left: 8px;
    width: 10px;
    height: 10px;
    background: #020617;
    border: 1px solid #334155;
    border-radius: 1px;

    @media (min-width: 640px) {
      bottom: 10px;
      left: 10px;
      width: 12px;
      height: 12px;
    }
  }

  .floppy-label {
    width: 100%;
    height: 65px;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);

    @media (min-width: 640px) {
      height: 80px;
    }
  }

  .floppy-label-stripe {
    height: 6px;
    width: 100%;
  }

  .floppy-label-stripe-blue {
    height: 3px;
    width: 100%;
  }

  .floppy-label-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 4px;
    background: #f8fafc;
  }

  .floppy-song {
    font-size: 8px;
    font-weight: 800;
    color: #0f172a;
    width: 90%;
    text-align: center;
    text-transform: uppercase;

    @media (min-width: 640px) {
      font-size: 10px;
    }
  }

  .floppy-artist {
    font-size: 7px;
    color: #475569;
    width: 90%;
    text-align: center;
    margin-top: 1px;
    text-transform: uppercase;

    @media (min-width: 640px) {
      font-size: 8px;
      margin-top: 2px;
    }
  }

  .floppy-shutter-door {
    width: 60px;
    height: 40px;
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 3px;
    overflow: hidden;
    border: 1px solid #1e293b;

    @media (min-width: 640px) {
      width: 72px;
      height: 48px;
      bottom: 10px;
    }
  }

  .floppy-shutter-slider {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #64748b 0%, #cbd5e1 50%, #64748b 100%);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);

    &.open {
      transform: translateX(32px);
      @media (min-width: 640px) {
        transform: translateX(38px);
      }
    }
  }

  .floppy-shutter-opening {
    width: 24px;
    height: 32px;
    position: absolute;
    left: 8px;
    top: 4px;
    z-index: 1;
    border-radius: 2px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (min-width: 640px) {
      width: 28px;
      height: 38px;
      left: 10px;
      top: 5px;
    }
  }

  .floppy-magnetic-disc {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px dashed #475569;

    &.spinning {
      animation: floppy-spin 2s linear infinite;
    }

    @media (min-width: 640px) {
      width: 24px;
      height: 24px;
    }
  }

  .floppy-drive-led {
    position: absolute;
    bottom: 8px;
    right: 8px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #dc2626;
    box-shadow: 0 0 3px #dc2626;

    &.active {
      animation: floppy-led-blink 0.4s ease-in-out infinite alternate;
    }

    @media (min-width: 640px) {
      bottom: 10px;
      right: 10px;
      width: 7px;
      height: 7px;
    }
  }

  /* ── Music Box Visual ── */
  .music-box {
    width: 160px;
    height: 110px;
    background: linear-gradient(135deg, #78350f 0%, #451a03 100%);
    border: 3px solid #d97706;
    border-radius: 10px;
    position: relative;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    box-sizing: border-box;

    @media (min-width: 640px) {
      width: 190px;
      height: 130px;
      border-width: 4px;
      padding: 8px;
    }
  }

  .music-box-key {
    position: absolute;
    left: -18px;
    top: calc(50% - 13px);
    width: 15px;
    height: 26px;
    z-index: -1;
    transform-origin: right center;
    display: flex;
    align-items: center;

    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px.5 solid #f59e0b;
      background: transparent;
      position: absolute;
      left: -6px;
      box-shadow: 0 0 4px rgba(245, 158, 11, 0.4);
    }

    &::after {
      content: "";
      width: 12px;
      height: 3px;
      background: #b45309;
      position: absolute;
      right: 0;
    }

    &.spinning {
      animation: key-spin 3s linear infinite;
    }

    @media (min-width: 640px) {
      left: -22px;
      top: calc(50% - 15px);
      width: 18px;
      height: 30px;

      &::before {
        width: 14px;
        height: 14px;
        border-width: 3px;
        left: -8px;
      }
      &::after {
        width: 14px;
        height: 4px;
      }
    }
  }

  .music-box-interior {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.55);
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    padding: 6px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .music-box-gears {
    position: absolute;
    top: 6px;
    left: 6px;
    width: 40px;
    height: 40px;
  }

  .music-box-gear {
    border-radius: 50%;
    border: 2px dashed #d97706;
    background: transparent;
    position: absolute;

    &.gear-1 {
      width: 22px;
      height: 22px;
      top: 2px;
      left: 2px;

      &.spinning {
        animation: gear-rotate 5s linear infinite;
      }
    }

    &.gear-2 {
      width: 14px;
      height: 14px;
      top: 16px;
      left: 18px;

      &.spinning {
        animation: gear-rotate-reverse 4.2s linear infinite;
      }
    }

    @media (min-width: 640px) {
      &.gear-1 {
        width: 26px;
        height: 26px;
      }
      &.gear-2 {
        width: 18px;
        height: 18px;
        top: 18px;
        left: 22px;
      }
    }
  }

  .music-box-drum-wrap {
    width: 70px;
    height: 32px;
    position: absolute;
    top: 50%;
    right: 14px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;

    @media (min-width: 640px) {
      width: 90px;
      height: 38px;
      right: 18px;
    }
  }

  .music-box-drum {
    width: 100%;
    height: 12px;
    border-radius: 6px;
    border: 1px solid #d97706;
    position: relative;
    background: linear-gradient(180deg, #d97706 0%, #b45309 50%, #78350f 100%);
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 200%;
      height: 100%;
      background: repeating-linear-gradient(
        90deg,
        transparent,
        transparent 12px,
        #fef08a 14px,
        #f59e0b 15px,
        transparent 17px
      );

      @media (min-width: 640px) {
        background: repeating-linear-gradient(
          90deg,
          transparent,
          transparent 15px,
          #fef08a 17px,
          #f59e0b 18px,
          transparent 20px
        );
      }
    }

    &.spinning::after {
      animation: drum-roll 2.2s linear infinite;
    }

    @media (min-width: 640px) {
      height: 16px;
      border-radius: 8px;
    }
  }

  .music-box-comb {
    position: absolute;
    bottom: 6px;
    right: 18px;
    display: flex;
    gap: 2.5px;

    @media (min-width: 640px) {
      bottom: 8px;
      right: 22px;
      gap: 3.5px;
    }
  }

  .comb-tooth {
    width: 3px;
    height: 18px;
    background: linear-gradient(180deg, #cbd5e1 0%, #475569 100%);
    border-radius: 0.5px;
    transform-origin: top center;

    &.vibrating {
      animation: tooth-vibrate 0.12s ease-in-out infinite alternate;
    }

    @media (min-width: 640px) {
      width: 4px;
      height: 24px;
      border-radius: 1px;
    }
  }

  /* ── Keyframes ── */
  @keyframes floppy-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes floppy-led-blink {
    from {
      background: #22c55e;
      box-shadow: 0 0 5px #22c55e;
    }
    to {
      background: #166534;
      box-shadow: 0 0 1px #166534;
    }
  }

  @keyframes key-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes gear-rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes gear-rotate-reverse {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }

  @keyframes drum-roll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(50%);
    }
  }

  @keyframes tooth-vibrate {
    0% {
      transform: scaleY(1);
    }
    100% {
      transform: scaleY(0.85) skewX(2deg);
    }
  }

  /* Arigato modal details styles */
  .arigato-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.75);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .arigato-modal-content {
    background: linear-gradient(135deg, #121214 0%, #0a0a0c 100%);
    border: 1px solid rgba(239, 68, 68, 0.2);
    box-shadow:
      0 20px 50px rgba(0, 0, 0, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    width: 90vw;
    max-width: 600px;
    height: 80vh;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    color: #e4e4e7;
    font-family: monospace;

    @media (max-width: 640px) {
      width: 95vw;
      height: 85vh;
    }
  }

  .arigato-modal-header {
    padding: 16px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.02);

    h2 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #ef4444;
      text-transform: uppercase;
    }
  }

  .arigato-close-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.6);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(239, 68, 68, 0.2);
      color: white;
      border-color: rgba(239, 68, 68, 0.4);
      transform: translateX(-2px);
    }
  }

  .arigato-modal-body {
    padding: 24px;
    flex: 1;
    overflow-y: auto;
    font-size: 0.85rem;
    line-height: 1.5;
    color: #a1a1aa;

    .intro-text,
    .outro-text {
      margin-bottom: 16px;
      white-space: pre-wrap;
      :global(a) {
        color: #ef4444;
        text-decoration: underline;
        &:hover {
          color: white;
        }
      }
    }

    .tos-box {
      background: rgba(0, 0, 0, 0.4);
      border: 1px dashed rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 12px;
      margin: 16px 0;
      max-height: 300px;
      overflow-y: auto;
    }

    .tos-microtext {
      font-size: 5px;
      line-height: 1.2;
      letter-spacing: 0;
      color: #71717a;
      word-break: break-all;
      white-space: pre-wrap;
      text-transform: none;
      font-family: monospace;

      :global(a) {
        color: #ef4444;
        text-decoration: underline;
        &:hover {
          color: white;
        }
      }
    }
  }

  .merch-link-container {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
  }

  .merch-link-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
    color: white;
    font-weight: 850;
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    padding: 8px 18px;
    border-radius: 9999px;
    text-decoration: none;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    transition: all 0.2s ease;

    &:hover {
      background: linear-gradient(135deg, #ff6b6b 0%, #ef4444 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
      color: white;
    }

    &:active {
      transform: translateY(0);
    }
  }
</style>
