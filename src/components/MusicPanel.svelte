<script>
  import { onMount, onDestroy, untrack, tick } from "svelte";
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
    ExternalLink,
    ArrowLeft,
    Music,
    Guitar,
    Tv,
    Maximize,
    Speech,
    Share2,
    Download,
    Cable,
    Unplug,
    Check,
    AlertTriangle,
    Diamond,
  } from "lucide-svelte";
  import { audioCore } from "../lib/AudioCore.svelte.js";
  import { goHome } from "../lib/goHome.js";
  import { musicLock } from "../lib/musicLock.svelte.js";
  import { onDoubleTap } from "../lib/doubleTap.js";
  import { playerLibrary, currentTrackId } from "../data/music/tracks.js";
  import { downloadChoice } from "../lib/trackDownload.js";
  import { musicCatalog, libraryWithCatalog } from "../lib/musicCatalog.svelte.js";
  import { tether } from "../lib/tether.svelte.js";
  import { musicPaletteStyle } from "../lib/musicPalettes.js";
  import { linkOrigin } from "../lib/homeOrigin.js";
  import { settingsManager } from "../lib/settingsManager.svelte.js";
  import { VisualizerEngine, shadersSupported } from "../lib/visualizer/VisualizerEngine.js";
  import DogsLogo from "./DogsLogo.svelte";
  import { PRESETS, NO_SIGNAL_PRESET } from "../lib/visualizer/presets.js";
  import { MilkdropEngine, milkdropSupported } from "../lib/visualizer/MilkdropEngine.js";
  import MilkdropControls from "./music/MilkdropControls.svelte";
  import PresetList from "./music/PresetList.svelte";
  import LyricLine from "./music/LyricLine.svelte";
  import StrikeToggle from "./music/StrikeToggle.svelte";
  import SortCycler from "./music/SortCycler.svelte";
  import StageLyricControls from "./music/StageLyricControls.svelte";
  import { presetDeck } from "../lib/visualizer/presetDeck.svelte.js";
  import { lyrics } from "../lib/lyrics.svelte.js";
  import { trackMonthYear } from "../lib/trackDate.js";

  import { fade } from "svelte/transition";
  import arigatoText from "./music/arigato.txt?raw";

  const title = "MUSIC";

  const ERROR_COVER = "/img/error_cover.png";
  // How long a downloaded track's blob URL lives before it's freed
  const DOWNLOAD_REVOKE_DELAY_MS = 60000;
  // A song whose file was replaced swaps to the new one only this early in it;
  // further in, it plays out and the new file is used from the next play on
  const SWAP_GRACE_S = 5;

  function handleCoverError(e) {
    if (!e.target.src.endsWith(ERROR_COVER)) {
      e.target.src = ERROR_COVER;
    }
  }

  // depth takes part in TitlePage's history model: 1 = the player, 2 = the
  // song list (phones) or the full-screen visualizer on top of it. Closing the
  // player from there then goes back past both entries.
  // initialTrackId is the song a /music/<id> link asked for: taken once, on
  // mount, then cleared so reopening the player does not start it again.
  let { isClosing = false, onClose, initialTrackId = $bindable(null), depth = $bindable(1) } = $props();

  // Tapping outside the panel only closes it on a double tap
  const handleBackdropTap = onDoubleTap(() => onClose());

  let sortBy = $state("default"); // 'default' | 'artist' | 'album' | 'year' | 'filename' | 'genre' | 'season'

  let showMobileTracklist = $state(false);
  let isBouncing = $state(false);
  let vinylLoaded = $state(false);
  let showVolumeSlider = $state(false);
  let volumePopoverEl = $state(null);
  // A track that can't be fetched never spins the deck — it glitches instead
  let trackErrored = $derived(
    !!audioCore.fetchErrors[audioCore.library[audioCore.currentTrackIndex]?.id],
  );
  let isAnimating = $derived(
    audioCore.isPlaying && !isClosing && !trackErrored,
  );

  // The visualizer is MilkDrop, its own engine with its own canvas
  // (src/lib/visualizer/MilkdropEngine.js). A browser that cannot run it (it
  // needs WebGL 2) gets the built-in shaders instead, cycled by the name button.
  const MILKDROP_ID = "milkdrop";
  const ENGINE_MILKDROP = "milkdrop";
  const ENGINE_SHADER = "shader";
  const HAS_MILKDROP = milkdropSupported();
  const VISUALIZERS = HAS_MILKDROP
    ? [{ id: MILKDROP_ID, name: "MilkDrop" }]
    : PRESETS;
  // A browser with no WebGL at all keeps the record: there is no picture to switch on
  const CAN_VISUALIZE = HAS_MILKDROP || shadersSupported();

  const TV_KEY = "music_tv_v1";
  const TV_ON = "on";
  const TV_OFF = "off";
  /** A second tap on the circle this soon after the first is a double tap. */
  const DOUBLE_TAP_MS = 300;
  /** Full screen: the controls fade this long after the last touch or move. */
  const STAGE_IDLE_MS = 3200;
  const TAB_TRACKS = "tracks";
  const TAB_PRESETS = "presets";
  const VIEW_MUSIC = "music";
  const OVERLAY_DEPTH = 2;
  const MOBILE_MAX_WIDTH = 640;

  /** @returns {boolean} the TV button as the listener left it: on unless they switched it off */
  function readTv() {
    try {
      return localStorage.getItem(TV_KEY) !== TV_OFF;
    } catch {
      return true;
    }
  }

  let tvOn = $state(readTv());
  let activePresetIdx = $state(0);
  let isMilkdrop = $derived(VISUALIZERS[activePresetIdx].id === MILKDROP_ID);
  let isFullscreenVisualizer = $state(false);
  let canvasEl = $state(null);
  let stageEl = $state(null);
  let stageIdle = $state(false);
  let stageIdleTimer = null;
  let circleTapTimer = null;
  let listTab = $state(TAB_TRACKS);
  let visualizerEngine = null;
  let overlayPushed = false;
  let hasMusicPlayed = $state(false);
  // The record is the visualizer whenever the TV is on. MilkDrop only needs
  // the player's audio graph to exist; the plain shaders wait for a song.
  let showVisualizer = $derived(CAN_VISUALIZE && tvOn && (isMilkdrop ? !!audioCore.analyser : hasMusicPlayed));

  function setTv(on) {
    tvOn = on;
    try {
      localStorage.setItem(TV_KEY, on ? TV_ON : TV_OFF);
    } catch {
      // Not kept: the choice lasts until the page closes
    }
  }

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

  // Track if music starts playing to flip hasMusicPlayed to true
  $effect(() => {
    if (audioCore.isPlaying) {
      hasMusicPlayed = true;
    }
  });

  // Dynamically derive current fragment shader to compile
  let currentShader = $derived.by(() => {
    if (isMilkdrop) return null;
    if (!audioCore.isPlaying && !hasMusicPlayed) {
      return NO_SIGNAL_PRESET.fragmentShader;
    }
    return VISUALIZERS[activePresetIdx].fragmentShader;
  });

  // Manage Visualizer instantiation and destruction
  $effect(() => {
    const analyser = audioCore.analyser; // track dependency
    const engineKind = isMilkdrop ? ENGINE_MILKDROP : ENGINE_SHADER;
    // Each engine draws on a canvas of its own kind (WebGL 2 or WebGL 1): wait
    // for the right one when the kind has just changed.
    if (showVisualizer && canvasEl && !isClosing && canvasEl.dataset.engine === engineKind) {
      if (!isMilkdrop) {
        // Re-instantiate engine when analyser becomes available or changes
        visualizerEngine = new VisualizerEngine(canvasEl, analyser);
        visualizerEngine.init(currentShader);
        visualizerEngine.start();
      } else if (analyser && audioCore.audioCtx) {
        // MilkDrop reads the sound itself, so it waits for the first song
        const engine = new MilkdropEngine(canvasEl, analyser, audioCore.audioCtx, presetDeck.listeners());
        // Untracked: the listener changing shuffle or a heart must not rebuild the engine
        untrack(() => presetDeck.attach(engine));
        visualizerEngine = engine;
        engine.start();
      }
    }

    return () => {
      if (visualizerEngine) {
        presetDeck.detach(visualizerEngine);
        visualizerEngine.destroy();
        visualizerEngine = null;
      }
    };
  });

  // The song playing brings its lyrics; the list of songs that have any is asked for once.
  $effect(() => {
    lyrics.load(currentTrack ? currentTrack.id : null);
  });

  // Manage Preset switches / shader changes (without destroying WebGL context)
  $effect(() => {
    const shader = currentShader; // track dependency
    if (shader && visualizerEngine && showVisualizer && !isMilkdrop) {
      visualizerEngine.setPreset(shader);
      visualizerEngine.start();
    }
  });

  // The phone's song list and the full-screen visualizer sit on top of the
  // player, so the back button closes them first. They share one history
  // entry, which carries the player's own view and a depth of 2: TitlePage
  // reads both, and closing the player from here unwinds the whole way.
  $effect(() => {
    const open = showMobileTracklist || isFullscreenVisualizer;
    if (open === overlayPushed) return;
    overlayPushed = open;
    if (!open) {
      history.back();
      return;
    }
    history.pushState({ ...(history.state || {}), view: VIEW_MUSIC, depth: OVERLAY_DEPTH, musicOverlay: true }, "");
    depth = OVERLAY_DEPTH;
  });

  function handlePopState(e) {
    if (!overlayPushed || e.state?.musicOverlay) return;
    overlayPushed = false;
    showMobileTracklist = false;
    isFullscreenVisualizer = false;
  }

  // Full screen: the browser's own full screen where it has one, and controls
  // that fade once the listener stops touching.
  function wakeStage() {
    stageIdle = false;
    clearTimeout(stageIdleTimer);
    stageIdleTimer = setTimeout(() => (stageIdle = true), STAGE_IDLE_MS);
  }

  function enterFullscreen() {
    setTv(true);
    // The fader's smoke would hang over the picture: put it out, and the count starts again
    resetFaderFx();
    isFullscreenVisualizer = true;
  }

  function leaveFullscreen() {
    // Leaving the browser's full screen first: its change event closes the stage
    if (stageEl && document.fullscreenElement === stageEl) {
      document.exitFullscreen().catch(() => (isFullscreenVisualizer = false));
      return;
    }
    isFullscreenVisualizer = false;
  }

  const leaveOnDoubleTap = onDoubleTap(leaveFullscreen);

  function handleStageTap(e) {
    e.stopPropagation();
    leaveOnDoubleTap(e);
  }

  $effect(() => {
    const el = stageEl;
    if (!el) return;
    wakeStage();
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    const onChange = () => {
      if (!document.fullscreenElement) isFullscreenVisualizer = false;
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      clearTimeout(stageIdleTimer);
      if (document.fullscreenElement === el) document.exitFullscreen().catch(() => {});
    };
  });

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

  // Track data lives in src/data/music/tracks.js with the rest of the data.

  // Non-public tracks live in the server's lockup folder and stay hidden until
  // the calculator passcode unlocks them (persisted in localStorage). Songs
  // from the catalog on the data host (lib/musicCatalog.svelte.js) join the
  // built-in ones when it arrives.
  let library = $derived(
    libraryWithCatalog(playerLibrary(musicLock.unlocked), musicLock.unlocked),
  );

  // A /music/<id> link to a song that only the catalog has: played once the
  // catalog brings it.
  let pendingTrackId = null;

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

  // Hidden tracks (another app's soundtrack) never show in the list
  let sortedLibrary = $derived.by(() => {
    let list = library.filter((t) => !t.hidden);
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

  // Re-sync the player if the library changes while mounted: the lockup gate
  // opens (or is revoked), or the catalog arrives
  $effect(() => {
    const lib = library;
    if (audioCore.library === lib || audioCore.library.length === 0) return;
    const loaded = audioCore.library[audioCore.currentTrackIndex];
    const playingId = loaded?.id;
    audioCore.init(lib);
    const pendingIdx = pendingTrackId
      ? lib.findIndex((t) => t.id === pendingTrackId)
      : -1;
    const newIdx = lib.findIndex((t) => t.id === playingId);
    if (pendingIdx !== -1) {
      pendingTrackId = null;
      audioCore.loadTrack(pendingIdx, true);
    } else if (newIdx !== -1) {
      audioCore.currentTrackIndex = newIdx;
      // The catalog has a newer file for the song that is loaded (a new mix
      // posted since this visitor's last visit): swap to it, unless they are
      // already well into the old one. A tab that only follows another tab's
      // player leaves that to the tab with the sound.
      const next = lib[newIdx];
      const replaced = next.src !== loaded.src || next.instrumental !== loaded.instrumental;
      const following = audioCore.masterTabId && audioCore.masterTabId !== audioCore.tabId;
      const early = !audioCore.isPlaying || audioCore.currentTime < SWAP_GRACE_S;
      if (replaced && early && !following) audioCore.loadTrack(newIdx, audioCore.isPlaying);
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

  // The tether icon's explanation, opened by a tap (a touch screen has no hover)
  const TETHER_REMOTE = "This device is the remote: the sound is on the other one.";
  const TETHER_SPEAKER = "Both players are in step.";
  const TETHER_ABOUT =
    "It stays on until you close this window, disconnect in Air Train, or nothing happens for 10 minutes.";
  const TETHER_LOST =
    "The tether dropped: a screen turned off, or the network changed. This player is on its own until the devices find each other again, which they do by themselves.";
  let tetherHintOpen = $state(false);
  let tetherHint = $derived(
    tether.holding
      ? TETHER_LOST
      : `Tethered to ${tether.peerName || "your other device"}. ${audioCore.masterIsRemote ? TETHER_REMOTE : TETHER_SPEAKER} ${TETHER_ABOUT}`,
  );

  let copiedTrackId = $state(null);
  let copyTimeout = null;

  function handleShareTrack(e, track) {
    e.stopPropagation();
    const shareUrl = `${linkOrigin()}/music/${track.id}`;
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

  let downloadingTrackId = $state(null);

  // The playing song is on whichever mix is audible; any other song would
  // start on the switch's last setting.
  function downloadFor(track) {
    const playing = track.id === audioCore.library[audioCore.currentTrackIndex]?.id;
    return downloadChoice(track, playing ? audioCore.isInstrumental : audioCore.userPrefersInstrumental);
  }

  // Which mix is saved is decided in lib/trackDownload.js. Fetched as a blob
  // because the files are cross-origin (and lockup files need the auth
  // header), so a plain <a download> won't save.
  async function handleDownloadTrack(e, track) {
    e.stopPropagation();
    const url = downloadFor(track).url;
    if (!url || downloadingTrackId) return;
    downloadingTrackId = track.id;
    try {
      const res = await fetch(url, musicLock.fetchOptionsFor(url));
      if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
      const blobUrl = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = decodeURIComponent(url.split("/").pop() || "") || `${track.id}.mp3`;
      // Old Firefox ignores clicks on detached anchors; revoking right away
      // cancels the save in Safari/Firefox, so give the download a head start.
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), DOWNLOAD_REVOKE_DELAY_MS);
    } catch (err) {
      console.error("Failed to download track:", err);
    } finally {
      downloadingTrackId = null;
    }
  }

  onDestroy(() => {
    if (copyTimeout) clearTimeout(copyTimeout);
  });

  onMount(() => {
    musicLock.revalidate();
    audioCore.init(library);
    musicCatalog.refresh();
    lyrics.refreshList();
    const linkedTrackId = currentTrackId(initialTrackId);
    initialTrackId = null;
    if (linkedTrackId) {
      const idx = library.findIndex((t) => t.id === linkedTrackId);
      if (idx !== -1) {
        audioCore.loadTrack(idx, true);
      } else {
        pendingTrackId = linkedTrackId;
      }
    } else if (!audioCore.hasPickedRandomTrack) {
      audioCore.hasPickedRandomTrack = true;
      const listed = library.filter((t) => !t.hidden);
      const pick = listed[Math.floor(Math.random() * listed.length)];
      audioCore.loadTrack(library.indexOf(pick), false);
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

  // The circle (record, tape or visualizer): one tap opens the song list, two
  // go full screen. The single tap waits a moment to see whether a second comes.
  function handleRecordClick() {
    if (circleTapTimer) {
      clearTimeout(circleTapTimer);
      circleTapTimer = null;
      enterFullscreen();
      return;
    }
    circleTapTimer = setTimeout(() => {
      circleTapTimer = null;
      openSongList();
    }, DOUBLE_TAP_MS);
  }

  // Phones open the list as its own page. Wider screens already show it, so
  // there the song that is playing is brought into view.
  function openSongList() {
    listTab = TAB_TRACKS;
    if (window.innerWidth <= MOBILE_MAX_WIDTH) {
      showMobileTracklist = true;
      return;
    }
    focusedTrackId = currentTrack.id;
    tick().then(scrollFocusedTrackIntoView);
  }

  // The title / artist / album text opens the song list too, same as the
  // circle. The share button lives in the same block, so only taps on the
  // text rows count.
  function handleTrackInfoClick(e) {
    if (!e.target.closest(".scroll-container")) return;
    openSongList();
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

    if (e.code === "Space" || e.key === " ") {
      e.preventDefault();
      audioCore.togglePlay();
    } else if (e.key === "ArrowDown") {
      if (sortedLibrary.length > 0) {
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
      if (sortedLibrary.length > 0) {
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
      if (focusedTrackId) {
        e.preventDefault();
        const track = sortedLibrary.find((t) => t.id === focusedTrackId);
        if (track) {
          selectSortedTrack(track);
        }
      }
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
      window.visualViewport?.removeEventListener("resize", handleResize);
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

  // Puts the fader's sparks and smoke out and starts its fail count again
  function resetFaderFx() {
    crossfadeFailCount = 0;
    hasSmokeStarted = false;
    if (fxScene) {
      for (const p of fxSparks) fxScene.remove(p.mesh);
      for (const p of fxSmoke) fxScene.remove(p.mesh);
    }
    fxSparks = [];
    fxSmoke = [];
  }

  // Reset fail counts and clear meshes when track changes or leaving the player
  $effect(() => {
    const trackIdx = audioCore.currentTrackIndex;
    const closing = isClosing;
    resetFaderFx();
  });

  // The canvas is fixed over the whole viewport; the fx camera spans its CSS
  // box. Sizing and knob coords both come from the canvas rect — window.inner*
  // drifts from 100vh on mobile when the browser toolbar collapses.
  function getFxSize() {
    if (!faderFxCanvas) return { width: window.innerWidth, height: window.innerHeight };
    const rect = faderFxCanvas.getBoundingClientRect();
    return { width: rect.width || window.innerWidth, height: rect.height || window.innerHeight };
  }

  function getKnobCoords() {
    const { width, height } = getFxSize();
    const knobEl = document.querySelector(".dj-fader-knob");
    if (!knobEl) return { x: width / 2, y: height / 2 };

    const canvasRect = faderFxCanvas
      ? faderFxCanvas.getBoundingClientRect()
      : { left: 0, top: 0 };
    const knobRect = knobEl.getBoundingClientRect();

    // Center coordinates on the fader knob, relative to the canvas box,
    // flipped to the camera's bottom-left origin
    const x = knobRect.left + knobRect.width / 2 - canvasRect.left;
    const y = height - (knobRect.top + knobRect.height / 2 - canvasRect.top);
    return { x, y };
  }

  function initThreeFx() {
    if (!faderFxCanvas) return;

    const { width, height } = getFxSize();

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
    // Mobile toolbars collapsing/expanding resize the visual viewport without
    // always firing a window resize
    window.visualViewport?.addEventListener("resize", handleResize);
    animateThreeFx();
  }

  function handleResize() {
    if (!faderFxCanvas || !fxRenderer || !fxCamera) return;
    const { width, height } = getFxSize();
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
<div class="mp-backdrop" onclick={handleBackdropTap}>
  <div
    class="mp-container"
    class:closing={isClosing}
    class:theme-inst={audioCore.isInstrumental}
    style={musicPaletteStyle(settingsManager.musicPalette)}
    onclick={(e) => e.stopPropagation()}
  >
    <!-- Header -->
    <header class="panel-header">
      <div class="brand">
        <button
          class="logo-btn"
          onclick={goHome}
          aria-label="Go to the DOGS home page"
        >
          <DogsLogo size="panel" />
        </button>
        <h1>{title}</h1>
      </div>

      <button class="close-btn" onclick={onClose} aria-label="Close panel">
        <ArrowLeft size={20} />
      </button>
    </header>

    <div class="mp-body">
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
              <div
                class="vinyl-wrapper relative overflow-hidden"
                class:deck-glitch={trackErrored}
              >
                {#if showVisualizer}
                  <!-- The record as a visualizer: the picture moves where the
                       grooves were, and the label still turns in the middle.
                       While it is full screen the canvas is over there. -->
                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <div
                    class="visualizer-container viz-disc cursor-pointer"
                    onclick={handleRecordClick}
                    role="button"
                    tabindex="0"
                    aria-label="Open the song list. Double tap for full screen."
                  >
                    {#if !isFullscreenVisualizer}
                      {#key isMilkdrop}
                        <canvas
                          bind:this={canvasEl}
                          class="visualizer-canvas"
                          data-engine={isMilkdrop ? ENGINE_MILKDROP : ENGINE_SHADER}
                        ></canvas>
                      {/key}
                    {/if}
                    <div class="viz-label" class:spinning={isAnimating}>
                      <img
                        src={audioCore.fetchErrors[currentTrack.id] ||
                        !currentTrack.cover
                          ? ERROR_COVER
                          : currentTrack.cover}
                        alt={currentTrack.album}
                        class="viz-art"
                        onerror={handleCoverError}
                      />
                    </div>
                    <div class="viz-spindle"></div>
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
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div class="track-info mt-2" onclick={handleTrackInfoClick}>
                <div class="flex items-center justify-center gap-1.5 mb-1.5">
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
                  {#if currentTrack.instrumental || currentTrack.src}
                    <button
                      class="player-download-btn"
                      class:downloading={downloadingTrackId === currentTrack.id}
                      onclick={(e) => handleDownloadTrack(e, currentTrack)}
                      title={downloadFor(currentTrack).label}
                      aria-label={downloadFor(currentTrack).label}
                    >
                      <Download size={12} />
                    </button>
                  {/if}
                  {#if tether.linked || tether.holding}
                    <span class="player-tether">
                      <button
                        class="player-tether-btn"
                        class:player-tether-lost={tether.holding}
                        onclick={(e) => {
                          e.stopPropagation();
                          tetherHintOpen = !tetherHintOpen;
                        }}
                        onblur={() => (tetherHintOpen = false)}
                        title={tetherHint}
                        aria-label={tetherHint}
                        aria-expanded={tetherHintOpen}
                      >
                        {#if tether.holding}<Unplug size={12} />{:else}<Cable size={12} />{/if}
                      </button>
                      {#if tetherHintOpen}
                        <span class="player-tether-hint" role="status">{tetherHint}</span>
                      {/if}
                    </span>
                  {/if}
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
              <!-- The lyric line: one row, where the seek bar starts -->
              <LyricLine />

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
                  onclick={() => audioCore.cycleRepeat()}
                  aria-label="Repeat"
                  title={audioCore.repeatMode === 1
                    ? "Repeat: all"
                    : audioCore.repeatMode === 2
                      ? "Repeat: one"
                      : audioCore.repeatMode === 3
                        ? "Stop after current track"
                        : "Repeat: off"}
                >
                  {#if audioCore.repeatMode === 2}<Repeat1
                      size={15}
                    />{:else if audioCore.repeatMode === 3}<Diamond
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

                <!-- TV: the visualizer, struck through when off. Full screen. Lyrics. -->
                {#if CAN_VISUALIZE}
                  <StrikeToggle
                    on={tvOn}
                    accent
                    label={tvOn ? "Visualizer: on" : "Visualizer: off"}
                    onclick={() => setTv(!tvOn)}
                  >
                    <Tv size={14} />
                  </StrikeToggle>
                {/if}
                <button
                  class="ctrl ctrl-xs"
                  onclick={enterFullscreen}
                  aria-label="Full screen"
                  title="Full screen"
                >
                  <Maximize size={14} />
                </button>
                <StrikeToggle
                  on={lyrics.shown}
                  accent
                  dim={!lyrics.has(currentTrack.id)}
                  label={!lyrics.shown
                    ? "Lyrics: off"
                    : lyrics.has(currentTrack.id)
                      ? "Lyrics: on"
                      : "Lyrics: on. This song has none yet."}
                  onclick={() => lyrics.setPrefs({ shown: !lyrics.shown })}
                >
                  <Speech size={14} />
                </StrikeToggle>

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

            <!-- Phones: TRACKS on the left, the sort symbol in the middle, PRESETS on the
                 right. Wider screens: the tabs, then the SORT BY menu at the end. -->
            <div class="tl-header relative flex justify-between items-center gap-3">
              <div class="flex flex-1 items-center justify-between gap-1 sm:flex-none sm:justify-start" role="tablist" aria-label="Songs or visualizer presets">
                <button
                  class="tl-tab"
                  class:tl-tab-on={listTab === TAB_TRACKS}
                  role="tab"
                  aria-selected={listTab === TAB_TRACKS}
                  onclick={() => (listTab = TAB_TRACKS)}
                >
                  <List size={13} /><span>TRACKS</span>
                  <span class="tl-count hidden sm:inline">{sortedLibrary.length}</span>
                </button>
                {#if isMilkdrop}
                  <button
                    class="tl-tab"
                    class:tl-tab-on={listTab === TAB_PRESETS}
                    role="tab"
                    aria-selected={listTab === TAB_PRESETS}
                    onclick={() => (listTab = TAB_PRESETS)}
                  >
                    <Tv size={13} /><span>PRESETS</span>
                    {#if presetDeck.names.length}
                      <span class="tl-count hidden sm:inline">{presetDeck.names.length}</span>
                    {/if}
                  </button>
                {/if}
              </div>

              {#if listTab === TAB_TRACKS}
                <SortCycler
                  class="tl-sort-cycler sm:hidden"
                  value={sortBy}
                  onchange={(id) => (sortBy = id)}
                />
              {/if}

              <!-- Sorting selector dropdown -->
              <div class="hidden sm:flex items-center gap-1.5 ml-auto" class:invisible={listTab !== TAB_TRACKS}>
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

            {#if listTab === TAB_PRESETS}
              <PresetList />
            {/if}
            <div class="tracklist scroll-y" class:hidden={listTab !== TAB_TRACKS}>
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
                      >{track.artist} · {track.album}{trackMonthYear(track) ? ` (${trackMonthYear(track)})` : ""}</span
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
                    {#if track.instrumental || track.src}
                      <button
                        class="tr-download-btn"
                        class:downloading={downloadingTrackId === track.id}
                        onclick={(e) => handleDownloadTrack(e, track)}
                        title={downloadFor(track).label}
                        aria-label={downloadFor(track).label}
                      >
                        <Download size={12} />
                      </button>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
    </div>

    <footer class="mp-footer">
      <div class="mp-status">
        <span class="mp-dot"></span><span>🐕</span>
      </div>
      <span>MUSIC</span>
    </footer>
  </div>

  {#if isFullscreenVisualizer}
    <!-- The stage: the visualizer over the whole screen, the lyric line on it.
         Controls fade when nobody is touching; a double tap leaves. -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="visualizer-container fullscreen"
      class:stage-idle={stageIdle}
      bind:this={stageEl}
      onclick={handleStageTap}
      onpointerdown={wakeStage}
      onpointermove={wakeStage}
    >
      <!-- The picture and its lyric line share a frame, which the line is sized by -->
      <div class="stage-frame">
        {#if showVisualizer}
          {#key isMilkdrop}
            <canvas
              bind:this={canvasEl}
              class="visualizer-canvas"
              data-engine={isMilkdrop ? ENGINE_MILKDROP : ENGINE_SHADER}
            ></canvas>
          {/key}
        {:else}
          <!-- No picture to draw here (the plain shaders before a song): the cover fills in -->
          <img
            src={currentTrack.cover || ERROR_COVER}
            alt=""
            class="stage-cover"
            onerror={handleCoverError}
          />
        {/if}

        <LyricLine variant="stage" />
      </div>

      <div
        class="visualizer-overlay flex-col items-center sm:flex-row sm:items-end"
        onclick={(e) => e.stopPropagation()}
      >
        <StageLyricControls
          hasLyrics={lyrics.has(currentTrack.id)}
          onExit={leaveFullscreen}
        />
        {#if VISUALIZERS.length > 1}
        <div
          class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10"
        >
          {#each VISUALIZERS as preset, index}
            <button
              class="px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono 2xl:px-3 2xl:py-2 2xl:text-[13px]
                {activePresetIdx === index
                ? 'bg-white text-black'
                : 'text-white/40 hover:text-white/80'}"
              onclick={() => (activePresetIdx = index)}
            >
              {preset.name}
            </button>
          {/each}
        </div>
        {/if}
        {#if isMilkdrop}
          <MilkdropControls />
        {/if}
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
    color: rgb(var(--mp-vox-rgb)); /* Vocal side active */
    text-shadow: 0 0 8px rgba(var(--mp-vox-rgb), 0.4);
  }

  .fader-label.right-label.active {
    color: rgb(var(--mp-ins-rgb)); /* Inst side active */
    text-shadow: 0 0 8px rgba(var(--mp-ins-rgb), 0.4);
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
    accent-color: rgb(var(--mp-accent-rgb));
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

  /* The full-screen controls: two rows on phones, one on wider screens, centred either way */
  .visualizer-overlay {
    position: absolute;
    bottom: 16px;
    left: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
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

  /* The stage's controls fade once nobody is touching, and the pointer with them */
  .visualizer-overlay {
    transition: opacity 0.45s ease;
  }

  .visualizer-container.stage-idle {
    cursor: none;
  }

  .visualizer-container.stage-idle .visualizer-overlay {
    opacity: 0;
    pointer-events: none;
  }

  /* The picture's frame: the whole stage. The lyric line is sized by it (container units). */
  .stage-frame {
    position: absolute;
    inset: 0;
    overflow: hidden;
    container-type: size;
  }

  .stage-cover {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(28px) brightness(0.5);
    transform: scale(1.15);
  }

  /* The record's label, kept in the middle of the visualizer and still turning */
  .viz-label {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 24%;
    height: 24%;
    margin: -12% 0 0 -12%;
    border-radius: 50%;
    overflow: hidden;
    z-index: 2;
    border: 2px solid rgba(255, 255, 255, 0.14);
    box-shadow:
      0 0 0 1px rgba(0, 0, 0, 0.8),
      0 2px 14px rgba(0, 0, 0, 0.65);
    animation: viz-label-spin 5s linear infinite;
    animation-play-state: paused;
  }

  .viz-label.spinning {
    animation-play-state: running;
  }

  .viz-art {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .viz-spindle {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 7px;
    height: 7px;
    margin: -3.5px 0 0 -3.5px;
    border-radius: 50%;
    background: rgba(5, 5, 8, 0.92);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.28);
    z-index: 3;
  }

  @keyframes viz-label-spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* TRACKS | PRESETS, in the list's header */
  .tl-tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 6px;
    font: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    color: rgba(255, 255, 255, 0.28);
    cursor: pointer;
    transition:
      color 0.15s ease,
      background 0.15s ease;
  }

  .tl-tab:hover {
    color: rgba(255, 255, 255, 0.6);
  }

  .tl-tab-on,
  .tl-tab-on:hover {
    color: rgba(255, 255, 255, 0.85);
    background: rgba(255, 255, 255, 0.06);
  }

  .tl-tab .tl-count {
    margin-left: 0;
  }

  /* Phones: the sort symbol sits in the middle of the header, between the two tabs */
  .tl-header :global(.tl-sort-cycler) {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .tl-header :global(.tl-sort-cycler:active) {
    transform: translate(-50%, -50%) scale(0.88);
  }

  @media (prefers-reduced-motion: reduce) {
    .viz-label {
      animation: none;
    }
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
    /* Match the visible viewport on mobile — 100vh overshoots when the
       browser toolbar is collapsed, shifting the fx off the fader knob */
    height: 100dvh;
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
