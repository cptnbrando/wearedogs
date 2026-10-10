/**
 * Core Web Audio Engine manages gain nodes, crossfaders, and ducking states.
 * Uses HTMLMediaElement streaming connected to Web Audio Context for native OS Media Session,
 * hardware key, and Bluetooth controls integration.
 */
import { musicLock, isLockupUrl } from "./musicLock.svelte.js";
import { StreamGuard } from "./StreamGuard.js";
import { bindMediaSession, syncMediaSession } from "./mediaSession.js";
import { decodePeaks } from "./waveformPeaks.js";
import { ShuffleQueue } from "./shuffleQueue.js";

// With the screen off there's nobody to press play on a dead track, so the
// player skips past it and never gives up. The first few skips are instant;
// past that the network is probably gone (tunnel, dead zone), so it waits a
// little longer before each try instead of racing through the library.
const FREE_HIDDEN_SKIPS = 3;
const SKIP_WAIT_MS = 5000;
const MAX_SKIP_WAIT_MS = 30000;

// repeatMode values; the repeat button cycles them in this order
const REPEAT_OFF = 0;
const REPEAT_ALL = 1;
const REPEAT_ONE = 2;
const REPEAT_DIAMOND = 3; // "show performance mode": play this song, then stop

// "Previous" restarts the song once it's this far in
const RESTART_THRESHOLD_S = 3;
// A lockup song downloads whole before it plays. A fetch frozen by a dead
// network would otherwise hold the player in "loading" forever.
const LOCKUP_FETCH_TIMEOUT_MS = 60000;
const METADATA_WAIT_MS = 1500;
const PROGRESS_TICK_MS = 150;
const INST_DRIFT_TOLERANCE_S = 0.05;
// Element events that move the lock-screen scrubber
const POSITION_EVENTS = ["loadedmetadata", "durationchange", "ratechange", "seeked", "playing"];

export class AudioCore {
  audioCtx = null;
  musicGain = null;
  trackAudio = null;
  instAudio = null;
  trackSourceNode = null;
  instSourceNode = null;
  trackGainNode = null;
  instGainNode = null;
  analyser = $state(null);

  // Sync state
  tabId = Math.random().toString(36).substring(2, 11);
  channel = null;
  masterTabId = null;
  isSyncing = false;

  shuffle = new ShuffleQueue();
  // Bumped by every loadTrack(); an older load that wakes up after a newer
  // one started drops its result instead of overwriting the newer track
  loadSeq = 0;

  // Reactive Svelte 5 Runes States
  isPlaying = $state(false);
  currentTime = $state(0);
  duration = $state(0);
  volume = $state(1);
  isMuted = $state(false);
  isInstrumental = $state(false);
  userPrefersInstrumental = $state(false);
  currentTrackIndex = $state(0);
  isLoading = $state(false);
  isShuffled = $state(true);
  repeatMode = $state(REPEAT_ALL); // REPEAT_OFF | REPEAT_ALL | REPEAT_ONE | REPEAT_DIAMOND
  activeAudioType = $state("music"); // 'music' | 'video'
  fetchErrors = $state({});
  waveformPeaks = $state({});
  /** Per-track instrumental load failures — set when inst fetch fails but vocal succeeds */
  instFailed = $state({});
  /** Per-track vocal load failures — the song carries on as instrumental-only */
  vocalFailed = $state({});

  progressInterval = null;
  trackGuard = null;
  instGuard = null;
  // loadTrack() pauses while it swaps sources; this remembers it means to play
  autoplayPending = false;
  hiddenSkips = 0;
  skipTimer = null;
  library = [];
  activeTrackBlobUrl = null;
  activeInstBlobUrl = null;
  hasPickedRandomTrack = false;

  // True when the currently loaded track has an instrumental URL AND it loaded successfully
  trackHasInstrumental = $derived(
    !!(this.library[this.currentTrackIndex]?.instrumental) &&
    !this.instFailed[this.library[this.currentTrackIndex]?.id]
  );

  constructor() {
    if (typeof window !== "undefined" && typeof BroadcastChannel !== "undefined") {
      this.channel = new BroadcastChannel("wearedogs_music_sync");
      this.channel.onmessage = (e) => this.handleSyncMessage(e.data);

      // Ping to find existing master after small delay
      setTimeout(() => {
        this.broadcast({ type: "ping" });
      }, 500);
    }
  }

  broadcast(data) {
    if (this.channel) {
      data.uuid = this.tabId;
      this.channel.postMessage(data);
    }
  }

  broadcastState(type = "state_change") {
    this.broadcast({
      type,
      masterTabId: this.masterTabId,
      trackIndex: this.currentTrackIndex,
      isPlaying: this.isPlaying,
      isInstrumental: this.isInstrumental,
      currentTime: this.currentTime,
      duration: this.duration
    });
  }

  handleSyncMessage(msg) {
    if (!msg || msg.uuid === this.tabId) return;

    this.isSyncing = true;
    try {
      switch (msg.type) {
        case "ping":
          if (this.isPlaying && this.masterTabId === this.tabId) {
            this.broadcastState("pong");
          }
          break;
        case "pong":
        case "state_change":
          this.masterTabId = msg.masterTabId;
          this.isInstrumental = msg.isInstrumental;
          if (this.currentTrackIndex !== msg.trackIndex) {
            this.currentTrackIndex = msg.trackIndex;
            const isSelfMaster = this.masterTabId === this.tabId;
            this.loadTrack(msg.trackIndex, isSelfMaster && msg.isPlaying);
          } else {
            const isSelfMaster = this.masterTabId === this.tabId;
            this.isPlaying = msg.isPlaying;
            if (isSelfMaster) {
              if (msg.isPlaying) {
                this.play(msg.currentTime);
              } else {
                this.pause();
              }
            } else {
              this.currentTime = msg.currentTime;
              if (this.trackAudio && !this.trackAudio.paused) this.trackAudio.pause();
              if (this.instAudio && !this.instAudio.paused) this.instAudio.pause();
            }
          }
          break;
        case "time_update":
          if (this.masterTabId !== this.tabId) {
            this.currentTime = msg.currentTime;
            this.duration = msg.duration;
            this.isPlaying = msg.isPlaying;
          }
          break;
        case "cmd_play":
          this.masterTabId = this.tabId;
          this.play(msg.currentTime);
          break;
        case "cmd_pause":
          this.pause();
          break;
        case "cmd_seek":
          this.seek(msg.currentTime);
          break;
        case "cmd_next":
          this.nextTrack();
          break;
        case "cmd_prev":
          this.prevTrack();
          break;
      }
    } catch (e) {
      console.warn("Failed to process sync message:", e);
    } finally {
      this.isSyncing = false;
    }
  }

  setShuffle(val) {
    this.isShuffled = val;
    if (val) {
      this.shuffle.deal(this.library.length, this.currentTrackIndex);
    } else {
      this.shuffle.upcoming = [];
    }
  }

  /**
   * Resolves a track URL to something the element can play. Lockup files
   * come back as a blob: URL that the caller owns and must revoke.
   * @param {string} url
   * @param {"track" | "inst"} type
   * @param {string | null} trackId set to decode the waveform from this side
   * @returns {Promise<string>}
   */
  async getAudioSource(url, type, trackId = null) {
    if (!url) return "";
    // Lockup files are gated server-side behind the calculator passcode, so
    // they must be fetched with the auth header and played from a blob.
    if (isLockupUrl(url)) {
      const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
      const options = Object.assign({}, musicLock.fetchOptionsFor(url), controller ? { signal: controller.signal } : {});
      const timer = controller ? setTimeout(() => controller.abort(), LOCKUP_FETCH_TIMEOUT_MS) : null;
      try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
        const blob = await res.blob();
        if (type === "track" && trackId) this.decodeTrackWaveform(trackId, blob);
        return URL.createObjectURL(blob);
      } catch (e) {
        console.warn(`Failed to fetch remote audio source for ${url}:`, e);
        throw e;
      } finally {
        clearTimeout(timer);
      }
    }

    // Everything else streams straight off its URL. The old code fetched the
    // whole MP3 into a blob first — with the screen off, the tab loses its
    // media exemption in the silent gap between songs and the fetch freezes
    // mid-download, killing auto-advance. The element's own streaming is done
    // by the browser's media stack, which keeps loading while the page is
    // throttled.
    if (type === "track" && trackId) {
      this.scheduleWaveformDecode(trackId, url);
    }
    return url;
  }

  // Waveform bars are decoration: fetch lazily, only while visible, and never
  // let them block or fail playback. (The response comes from HTTP cache when
  // the stream already pulled it.)
  scheduleWaveformDecode(trackId, url) {
    if (this.waveformPeaks[trackId]) return;
    if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
    fetch(url)
      .then((res) => (res.ok ? res.blob() : null))
      .then((blob) => {
        if (blob) this.decodeTrackWaveform(trackId, blob);
      })
      .catch(() => {});
  }

  async decodeTrackWaveform(trackId, blob) {
    if (this.waveformPeaks[trackId]) return;
    const peaks = await decodePeaks(blob);
    if (peaks) this.waveformPeaks[trackId] = peaks;
  }

  init(lib) {
    this.library = lib;
    // Indices into the old library mean nothing in a new one
    this.shuffle.history = [];
    bindMediaSession(this);
    if (this.isShuffled) {
      this.shuffle.deal(lib.length, this.currentTrackIndex);
    }
  }

  initContext() {
    if (this.audioCtx) return;
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.musicGain = this.audioCtx.createGain();

    // Phones suspend/interrupt the context on screen lock; all sound routes
    // through it, so playback dies silently unless it resumes itself.
    this.audioCtx.addEventListener("statechange", () => {
      if (this.isPlaying && this.audioCtx && this.audioCtx.state !== "running") {
        this.audioCtx.resume().catch(() => {});
      }
    });

    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 256;

    this.musicGain.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);

    // Initialize HTML Audio elements
    this.trackAudio = new Audio();
    this.trackAudio.crossOrigin = "anonymous";
    this.trackAudio.preload = "auto";
    this.instAudio = new Audio();
    this.instAudio.crossOrigin = "anonymous";
    this.instAudio.preload = "auto";

    // Streaming surfaces load failures on the element, not a fetch(). The
    // guards retry dropped connections and stalls first (screen-off networking
    // drops them all the time); only a stream they can't revive lands here.
    // A dead vocal side falls back to the instrumental before the track dies.
    const wantsPlayback = () => this.isPlaying || this.autoplayPending;
    this.trackGuard = new StreamGuard(this.trackAudio, wantsPlayback, () => this.failVocalSide());
    this.instGuard = new StreamGuard(this.instAudio, wantsPlayback, () => {
      const track = this.library[this.currentTrackIndex];
      if (track) {
        this.instFailed[track.id] = true;
        // An instrumental-only track has no other side to fall back on
        if (this.isInstOnly(track)) return this.handleDeadTrack();
        // A dead instrumental side shouldn't mute the song
        if (this.isInstrumental) {
          this.isInstrumental = false;
          this.applyCrossfade();
        }
      }
    });
    // Sound is coming out again, so the skip streak is over
    this.trackAudio.addEventListener("playing", () => { this.hiddenSkips = 0; });
    this.instAudio.addEventListener("playing", () => { this.hiddenSkips = 0; });

    // Bind event listeners for ending and duration changes
    this.trackAudio.addEventListener("ended", () => {
      // Only handle ended from trackAudio if it has a src (not inst-only tracks)
      if (this.trackAudio.src) this.onEnded();
    });
    this.trackAudio.addEventListener("durationchange", () => {
      if (this.trackAudio.src && !isNaN(this.trackAudio.duration)) {
        this.duration = this.trackAudio.duration;
      }
    });
    this.instAudio.addEventListener("ended", () => {
      // Handle ended from instAudio for inst-only tracks
      const track = this.library[this.currentTrackIndex];
      if (track && this.isInstOnly(track) && track.instrumental) this.onEnded();
    });
    this.instAudio.addEventListener("durationchange", () => {
      // Update duration from instAudio only for inst-only tracks
      const track = this.library[this.currentTrackIndex];
      if (track && this.isInstOnly(track) && !isNaN(this.instAudio.duration)) {
        this.duration = this.instAudio.duration;
      }
    });
    // Registered after the duration listeners above so the lock screen sees
    // the new duration. Element events, not the progress timer: they still
    // fire in a hidden, throttled tab.
    POSITION_EVENTS.forEach((type) => {
      this.trackAudio.addEventListener(type, () => this.syncSession());
      this.instAudio.addEventListener(type, () => this.syncSession());
    });

    // Create gain nodes for crossfading
    this.trackGainNode = this.audioCtx.createGain();
    this.trackGainNode.connect(this.musicGain);

    this.instGainNode = this.audioCtx.createGain();
    this.instGainNode.connect(this.musicGain);

    // Create source nodes from Audio elements
    this.trackSourceNode = this.audioCtx.createMediaElementSource(this.trackAudio);
    this.trackSourceNode.connect(this.trackGainNode);

    this.instSourceNode = this.audioCtx.createMediaElementSource(this.instAudio);
    this.instSourceNode.connect(this.instGainNode);

    this.applyVolume();
  }

  /**
   * True when a track plays from its instrumental alone: it never had a vocal
   * file, or the vocal file failed to load (e.g. deleted from R2).
   * @param {{ id: string, src?: string }} track
   * @returns {boolean}
   */
  isInstOnly(track) {
    return !track.src || !!this.vocalFailed[track.id];
  }

  // The vocal side can't be fetched or decoded. If the instrumental is still
  // good, demote the song to instrumental-only instead of killing it.
  failVocalSide() {
    const track = this.library[this.currentTrackIndex];
    if (!track || this.vocalFailed[track.id]) return;
    if (!track.instrumental || this.instFailed[track.id] || !this.instAudio?.src) {
      return this.handleDeadTrack();
    }
    console.warn(`Vocal file failed for "${track.id}", playing instrumental only`);
    this.vocalFailed[track.id] = true;
    this.trackGuard.reset();
    this.trackAudio.removeAttribute("src");
    this.trackAudio.load();
    this.isInstrumental = true;
    this.applyCrossfade();
    if (!isNaN(this.instAudio.duration)) this.duration = this.instAudio.duration;
    if (!this.isSyncing) this.broadcastState("state_change");
  }

  // The current track can't be fetched or decoded: flag it and make sure
  // nothing is left "playing" — no spinning deck, no running progress timer.
  failCurrentTrack() {
    const track = this.library[this.currentTrackIndex];
    if (track) this.fetchErrors[track.id] = true;
    this.isLoading = false;
    const wasPlaying = this.isPlaying;
    clearInterval(this.progressInterval);
    if (this.trackAudio) this.trackAudio.pause();
    if (this.instAudio) this.instAudio.pause();
    this.isPlaying = false;
    if (wasPlaying) {
      this.syncSession();
      if (!this.isSyncing) this.broadcastState("state_change");
    }
  }

  /**
   * The current track's stream is gone for good. On screen, stop and let the
   * deck glitch so the listener sees it. With the screen off nobody can press
   * play, so flag it and keep moving on to the next song, forever.
   */
  handleDeadTrack() {
    const track = this.library[this.currentTrackIndex];
    // Mid-load failures are picked up by loadTrack() itself once its
    // metadata wait resolves
    if (this.isLoading) {
      if (track) this.fetchErrors[track.id] = true;
      return;
    }
    // Diamond mode means "this song, then silence": no skipping onward
    if (this.repeatMode === REPEAT_DIAMOND || !this.shouldSkipDeadTrack(this.isPlaying)) {
      return this.failCurrentTrack();
    }
    if (track) this.fetchErrors[track.id] = true;
    this.skipDeadTrack();
  }

  /**
   * @param {boolean} meantToPlay whether playback was running (or starting)
   * @param {boolean} [auto] the player moved on by itself (song ended, dead-song
   *   skip): nobody picked this song, so skip it on screen too
   */
  shouldSkipDeadTrack(meantToPlay, auto = false) {
    if (!meantToPlay) return false;
    if (auto) return true;
    return typeof document !== "undefined" && document.visibilityState === "hidden";
  }

  // Next song, now for the first few dead ones in a row, then with a growing
  // wait (5s, 10s, 20s, 30s, 30s...) while the network is out. Any track load
  // in the meantime (a tap, a lock-screen button) cancels the pending skip.
  skipDeadTrack() {
    // Repeat off at the end of the run: there's nothing left to skip to
    if (this.runIsOver()) return this.failCurrentTrack();
    this.hiddenSkips++;
    if (this.hiddenSkips <= FREE_HIDDEN_SKIPS) return this.nextTrack(true, true);
    const wait = Math.min(MAX_SKIP_WAIT_MS, SKIP_WAIT_MS * Math.pow(2, this.hiddenSkips - FREE_HIDDEN_SKIPS - 1));
    clearTimeout(this.skipTimer);
    this.skipTimer = setTimeout(() => this.nextTrack(true, true), wait);
  }

  /**
   * @param {number} index library index
   * @param {boolean} [autoplay]
   * @param {{ auto?: boolean, fromHistory?: boolean }} [opts] auto: the player
   *   advanced by itself; fromHistory: "previous" is stepping back
   */
  async loadTrack(index, autoplay = false, opts = {}) {
    if (index < 0 || index >= this.library.length) return;
    const seq = ++this.loadSeq;

    clearTimeout(this.skipTimer);
    this.autoplayPending = autoplay;
    // Stop current playback immediately
    this.pause();

    this.shuffle.noteChange(index, this.currentTrackIndex, !!opts.fromHistory);
    this.currentTrackIndex = index;
    const track = this.library[index];

    // Clear all error state on retry
    delete this.fetchErrors[track.id];
    delete this.instFailed[track.id];
    delete this.vocalFailed[track.id];

    this.currentTime = 0;
    // The old song's length would let the progress timer end this one early
    this.duration = 0;
    this.isLoading = true;

    this.initContext();
    this.trackGuard.reset();
    this.instGuard.reset();
    // Not awaited: the elements start without it and the graph opens up when
    // it lands. Waiting on a timer here stalls auto-advance in a hidden tab.
    this.resumeContextSoon();

    // --- Fetch vocal track (the instrumental can stand in for it) ---
    let loadFailed = false;
    let resolvedTrackSrc = "";
    try {
      resolvedTrackSrc = await this.getAudioSource(track.src, "track", track.id);
    } catch (err) {
      console.error("Error loading vocal track:", err);
      // (isPlaying is already false from the pause() above; setting it here
      // could stop a newer load that's already playing)
      if (track.instrumental) {
        this.vocalFailed[track.id] = true;
      } else {
        this.fetchErrors[track.id] = true;
        loadFailed = true;
      }
    }

    // --- Fetch instrumental (optional — failure only disables that side) ---
    let resolvedInstSrc = "";
    if (!loadFailed && track.instrumental) {
      try {
        resolvedInstSrc = await this.getAudioSource(track.instrumental, "inst", track.id);
      } catch (err) {
        console.warn("Instrumental fetch failed, disabling inst side:", err);
        this.instFailed[track.id] = true;
        resolvedInstSrc = "";
      }
    }

    // A newer load took over while this one was fetching (a quick double
    // tap, a lock-screen skip during a lockup download): its track wins, and
    // this load's blobs would otherwise never be freed. Only blobs made here
    // are ours to free: a source that came back unchanged belongs to the
    // library, whatever its scheme.
    const ownedBlobs = [
      resolvedTrackSrc && resolvedTrackSrc !== track.src ? resolvedTrackSrc : null,
      resolvedInstSrc && resolvedInstSrc !== track.instrumental ? resolvedInstSrc : null,
    ];
    if (seq !== this.loadSeq) {
      ownedBlobs.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      return;
    }

    // Neither side resolved: nothing left to play
    if (!loadFailed && !resolvedTrackSrc && !resolvedInstSrc) {
      this.fetchErrors[track.id] = true;
      loadFailed = true;
    }

    // Set isInstrumental: if only inst loaded (no vocal src), force inst mode.
    // If both available, respect user preference. Otherwise vocal mode.
    const instAvailable = !!(track.instrumental && resolvedInstSrc && !this.instFailed[track.id]);
    if (this.isInstOnly(track) && instAvailable) {
      // Inst-only track (e.g. sleepless) — always instrumental
      this.isInstrumental = true;
    } else if (instAvailable) {
      this.isInstrumental = this.userPrefersInstrumental || false;
    } else {
      this.isInstrumental = false;
    }

    // The previous song's blobs (lockup files held whole in memory) go now
    // that their element is about to change source; hours of play would
    // otherwise keep every song ever played.
    [this.activeTrackBlobUrl, this.activeInstBlobUrl].forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });
    this.activeTrackBlobUrl = ownedBlobs[0];
    this.activeInstBlobUrl = ownedBlobs[1];

    if (!loadFailed) {
      if (resolvedTrackSrc) {
        this.trackAudio.src = resolvedTrackSrc;
        this.trackAudio.load();
      } else {
        this.trackAudio.removeAttribute("src");
        this.trackAudio.load();
      }
      if (resolvedInstSrc) {
        this.instAudio.src = resolvedInstSrc;
        this.instAudio.load();
      } else {
        this.instAudio.removeAttribute("src");
        this.instAudio.load();
      }

      // For inst-only tracks, resolve duration from instAudio; otherwise trackAudio
      const durationSource = resolvedTrackSrc ? this.trackAudio : this.instAudio;
      await new Promise((resolve) => {
        const done = () => {
          durationSource.removeEventListener("loadedmetadata", handler);
          durationSource.removeEventListener("error", done);
          resolve();
        };
        const handler = () => {
          this.duration = durationSource.duration;
          done();
        };
        if (durationSource.readyState >= 1) {
          this.duration = durationSource.duration;
          resolve();
        } else {
          durationSource.addEventListener("loadedmetadata", handler);
          // a dead URL errors instead of loading — don't sit out the timeout
          durationSource.addEventListener("error", done);
          setTimeout(done, METADATA_WAIT_MS);
        }
      });
      // A newer load swapped the source mid-wait and owns the player now
      if (seq !== this.loadSeq) return;
      // Streamed sources fail on the element, after the fetch step "succeeded"
      if (this.fetchErrors[track.id]) loadFailed = true;
    }

    this.isLoading = false;

    if (!loadFailed && autoplay) {
      this.play(0);
    }
    this.autoplayPending = false;
    // Auto-advancing (or screen off) into a track that won't load: keep the
    // music going with the next one
    if (loadFailed && this.shouldSkipDeadTrack(autoplay, !!opts.auto)) {
      this.skipDeadTrack();
      return;
    }
    this.syncSession();

    if (!this.isSyncing) {
      this.broadcastState("state_change");
    }
  }

  play(offset = this.currentTime) {
    if (!this.trackAudio) return;
    // A track that failed to fetch has nothing to play. togglePlay() retries
    // it through loadTrack(), which clears the flag first.
    const current = this.library[this.currentTrackIndex];
    if (current && this.fetchErrors[current.id]) return;
    this.initContext();
    this.resumeContextSoon();
    this.activeAudioType = "music";

    if (!this.isSyncing) {
      this.masterTabId = this.tabId;
    }

    this.applyCrossfade();
    this.applyVolume();

    const isSelfMaster = (!this.masterTabId || this.masterTabId === this.tabId);

    // Set current time of HTML Audio elements
    if (isSelfMaster) {
      if (this.trackAudio.src) this.trackAudio.currentTime = offset;
      if (this.instAudio && this.instAudio.src) {
        this.instAudio.currentTime = offset;
      }

      // Play — only play elements that have a loaded source
      if (this.trackAudio.src) {
        this.trackAudio.play().catch((e) => {
          console.error("Error playing trackAudio:", e);
          // No decodable source (slow 404, bad file) — not an ordinary
          // AbortError from a pause() landing mid-play. When the element
          // itself errored, its StreamGuard already dealt with it.
          if (e?.name === "NotSupportedError" && !this.trackAudio.error) this.failVocalSide();
        });
      }
      if (this.instAudio && this.instAudio.src) {
        this.instAudio.play().catch(e => console.error("Error playing instAudio:", e));
      }
    }

    this.isPlaying = true;
    this.startProgressTimer();
    this.syncSession();

    if (!this.isSyncing) {
      this.broadcastState("state_change");
    }
  }

  pause() {
    clearInterval(this.progressInterval);
    if (this.trackAudio) this.trackAudio.pause();
    if (this.instAudio) this.instAudio.pause();
    this.isPlaying = false;
    this.syncSession();

    if (!this.isSyncing) {
      this.broadcastState("state_change");
    }
  }

  /**
   * A listener's pause (button, lock screen, headset): also calls off a
   * pending dead-song skip, which would otherwise start the music again.
   * In a follower tab it asks the playing tab instead.
   */
  requestPause() {
    clearTimeout(this.skipTimer);
    if (this.masterTabId && this.masterTabId !== this.tabId) {
      this.broadcast({ type: "cmd_pause" });
      return;
    }
    this.pause();
  }

  // Kick a suspended/interrupted context without letting the caller hang on
  // it: resume() can stall indefinitely (iOS interruptions, some Androids),
  // and the audio elements can start playing regardless — the graph opens up
  // whenever the resume finally lands.
  resumeContextSoon(maxWaitMs = 300) {
    if (!this.audioCtx || this.audioCtx.state === "running") return Promise.resolve();
    const resume = this.audioCtx.resume().catch(() => { });
    return Promise.race([resume, new Promise((r) => setTimeout(r, maxWaitMs))]);
  }

  async togglePlay() {
    this.initContext();
    await this.resumeContextSoon();

    const track = this.library[this.currentTrackIndex];
    const hasFetchError = track ? this.fetchErrors[track.id] : false;
    const hasSrc = this.trackAudio.src || this.instAudio.src;

    if ((!hasSrc && !this.isLoading) || hasFetchError) {
      await this.loadTrack(this.currentTrackIndex, true);
      return;
    }

    if (this.isPlaying) {
      this.requestPause();
    } else {
      this.masterTabId = this.tabId;
      this.play(this.currentTime);
    }
    this.syncSession();
  }

  prevTrack() {
    if (this.currentTime > RESTART_THRESHOLD_S) {
      this.seek(0);
      return;
    }
    if (this.masterTabId && this.masterTabId !== this.tabId) {
      this.broadcast({ type: "cmd_prev" });
      return;
    }
    const len = this.library.length;
    // Shuffle goes back to the song that actually played before this one;
    // with nothing to go back to, this one starts over
    const idx = this.isShuffled
      ? this.shuffle.back(len, this.currentTrackIndex)
      : (this.currentTrackIndex - 1 + len) % len;
    if (idx < 0) {
      this.seek(0);
      return;
    }
    this.loadTrack(idx, this.isPlaying, { fromHistory: true });
  }

  /**
   * @param {boolean} [autoplay] play the next track (defaults to whether this one is playing)
   * @param {boolean} [auto] the player is moving on by itself (song ended, dead-song skip)
   */
  nextTrack(autoplay = this.isPlaying, auto = false) {
    if (this.masterTabId && this.masterTabId !== this.tabId) {
      this.broadcast({ type: "cmd_next" });
      return;
    }
    const len = this.library.length;
    if (len === 0) return;
    // Shuffle deals a fresh order once the queue runs out, never starting
    // with the song that just played
    const idx = this.isShuffled
      ? this.shuffle.next(len, this.currentTrackIndex)
      : (this.currentTrackIndex + 1) % len;
    this.loadTrack(idx, autoplay, { auto });
  }

  /**
   * @param {number} val seconds
   * @param {boolean} [fast] lock-screen scrubbing: fastSeek() where the element has it
   */
  seek(val, fast = false) {
    if (!isFinite(val)) return;
    const target = Math.max(0, this.duration > 0 ? Math.min(val, this.duration) : val);
    this.currentTime = target;
    const isSelfMaster = (!this.masterTabId || this.masterTabId === this.tabId);
    if (!isSelfMaster) {
      this.broadcast({ type: "cmd_seek", currentTime: target });
      return;
    }
    // The progress timer pulls the instrumental back within tolerance of the
    // vocal if fastSeek lands them on slightly different frames
    [this.trackAudio, this.instAudio].forEach((el) => {
      if (!el || !el.src) return;
      if (fast && typeof el.fastSeek === "function") el.fastSeek(target);
      else el.currentTime = target;
    });
    this.broadcastState("state_change");
    this.syncSession();
  }

  /** The element whose clock the song follows: the instrumental for inst-only tracks. */
  primaryAudio() {
    const track = this.library[this.currentTrackIndex];
    const instOnly = track && track.instrumental && this.isInstOnly(track);
    return instOnly && this.instAudio && this.instAudio.src ? this.instAudio : this.trackAudio;
  }

  /** Tells the OS (lock screen, notification, headset) what's playing and where. */
  syncSession() {
    const el = this.primaryAudio();
    const isSelfMaster = (!this.masterTabId || this.masterTabId === this.tabId);
    syncMediaSession({
      track: this.library[this.currentTrackIndex],
      isPlaying: this.isPlaying,
      duration: this.duration,
      position: isSelfMaster && el && el.src ? el.currentTime : this.currentTime,
      rate: el ? el.playbackRate : 1,
    });
  }

  startProgressTimer() {
    clearInterval(this.progressInterval);
    this.progressInterval = setInterval(() => {
      if (this.isPlaying && this.trackAudio) {
        const isSelfMaster = (!this.masterTabId || this.masterTabId === this.tabId);

        if (isSelfMaster) {
          const primaryAudio = this.primaryAudio();
          const isInstOnly = primaryAudio === this.instAudio;
          this.currentTime = primaryAudio.currentTime;

          // Keep instrumental in sync with the main track
          if (!isInstOnly && this.instAudio && this.instAudio.src && !this.instAudio.paused) {
            const diff = Math.abs(this.instAudio.currentTime - this.trackAudio.currentTime);
            if (diff > INST_DRIFT_TOLERANCE_S) {
              this.instAudio.currentTime = this.trackAudio.currentTime;
            }
          }

          if (this.duration > 0 && this.currentTime >= this.duration) {
            clearInterval(this.progressInterval);
            this.onEnded();
          }

          // Broadcast time update to follower tabs
          this.broadcast({
            type: "time_update",
            currentTime: this.currentTime,
            duration: this.duration,
            isPlaying: this.isPlaying
          });
        }
      }
    }, PROGRESS_TICK_MS);
  }

  /**
   * The song finished. Driven by the element's "ended" event, which fires
   * in a hidden tab too; the progress timer is only a backup.
   */
  onEnded() {
    // The native ended event and the progress timer's currentTime check can
    // both land here for the same song — a second call while the next track
    // is already loading would skip a track.
    if (this.isLoading) return;
    if (this.repeatMode === REPEAT_ONE) {
      this.seek(0);
      this.play(0);
      return;
    }
    // Diamond mode stops after the current track; play restarts it from the
    // top, and picking a track, prev and next all behave as usual.
    if (this.repeatMode === REPEAT_DIAMOND || this.runIsOver()) {
      this.pause();
      this.seek(0);
      return;
    }
    this.nextTrack(true, true);
  }

  /**
   * Repeat off stops once every song has had its turn: the last one in
   * library order, or an empty shuffle queue.
   * @returns {boolean}
   */
  runIsOver() {
    if (this.repeatMode !== REPEAT_OFF) return false;
    if (this.isShuffled) return this.shuffle.upcoming.length === 0;
    return this.currentTrackIndex >= this.library.length - 1;
  }

  applyCrossfade() {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const isInst = this.isInstrumental;
    const track = this.library[this.currentTrackIndex];
    const hasInstFile = track && track.instrumental;

    if (this.trackGainNode) {
      this.trackGainNode.gain.setValueAtTime((isInst && hasInstFile) ? 0 : 1, now);
    }
    if (this.instGainNode) {
      this.instGainNode.gain.setValueAtTime((isInst && hasInstFile) ? 1 : 0, now);
    }
  }

  setCrossfade(isInst) {
    const track = this.library[this.currentTrackIndex];
    // Block toggle to instrumental if: no instrumental URL, or the inst fetch failed
    if (isInst && (!track?.instrumental || this.instFailed[track?.id])) return false;
    // Block toggle to vocal if: no vocal src (inst-only track)
    if (!isInst && track && this.isInstOnly(track)) return false;
    this.isInstrumental = isInst;
    this.userPrefersInstrumental = isInst;
    this.applyCrossfade();

    if (!this.isSyncing) {
      this.broadcastState("state_change");
    }
    return true;
  }

  applyVolume() {
    const targetVol = this.isMuted ? 0 : this.volume;
    if (this.musicGain && this.audioCtx) {
      this.musicGain.gain.setValueAtTime(targetVol, this.audioCtx.currentTime);
    }
    if (this.trackAudio) {
      this.trackAudio.volume = targetVol;
    }
    if (this.instAudio) {
      this.instAudio.volume = targetVol;
    }
  }

  setVolume(vol) {
    this.volume = vol;
    if (vol > 0) this.isMuted = false;
    this.applyVolume();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.applyVolume();
  }

  duckMusic() {
    this.initContext();
    if (this.musicGain && this.audioCtx) {
      this.musicGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);
    }
    this.activeAudioType = "video";
  }

  unduckMusic() {
    this.initContext();
    if (this.musicGain && this.audioCtx) {
      this.musicGain.gain.exponentialRampToValueAtTime(this.volume, this.audioCtx.currentTime + 0.3);
    }
    this.activeAudioType = "music";
  }
}

export const audioCore = new AudioCore();

