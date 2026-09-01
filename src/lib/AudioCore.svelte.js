/**
 * Core Web Audio Engine manages gain nodes, crossfaders, and ducking states.
 * Uses HTMLMediaElement streaming connected to Web Audio Context for native OS Media Session,
 * hardware key, and Bluetooth controls integration.
 */
import { musicLock } from "./musicLock.svelte.js";

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

  // Shuffle queue state
  shuffledQueue = [];

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
  repeatMode = $state(1); // 0 = Off, 1 = Repeat All, 2 = Repeat One, 3 = X (stop after current)
  activeAudioType = $state("music"); // 'music' | 'video'
  fetchErrors = $state({});
  waveformPeaks = $state({});
  /** Per-track instrumental load failures — set when inst fetch fails but vocal succeeds */
  instFailed = $state({});

  progressInterval = null;
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

  shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  initShuffleQueue() {
    const indices = Array.from({ length: this.library.length }, (_, i) => i);
    const filtered = indices.filter(idx => idx !== this.currentTrackIndex);
    this.shuffledQueue = this.shuffleArray(filtered);
  }

  setShuffle(val) {
    this.isShuffled = val;
    if (val) {
      this.initShuffleQueue();
    } else {
      this.shuffledQueue = [];
    }
  }


  async getAudioSource(url, type, trackId = null) {
    if (!url) return "";
    // Lockup files are gated server-side behind the calculator passcode, so
    // they must be fetched with the auth header and played from a blob.
    if (url.startsWith("https://data.wearedogs.net/") && url.includes("/lockup/")) {
      try {
        const fetchOpts = {};
        if (musicLock.password) {
          fetchOpts.headers = { Authorization: `password=${musicLock.password}` };
        }
        const res = await fetch(url, fetchOpts);
        if (res.ok) {
          const blob = await res.blob();
          const blobUrl = URL.createObjectURL(blob);
          if (type === "track") {
            this.activeTrackBlobUrl = blobUrl;
            if (trackId) {
              this.decodeTrackWaveform(trackId, blob);
            }
          } else if (type === "inst") {
            this.activeInstBlobUrl = blobUrl;
          }
          return blobUrl;
        } else {
          throw new Error(`Fetch failed with status ${res.status}`);
        }
      } catch (e) {
        console.warn(`Failed to fetch remote audio source for ${url}:`, e);
        throw e;
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
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const tempContext = new AudioContextClass();
      const audioBuffer = await tempContext.decodeAudioData(arrayBuffer);
      const channelData = audioBuffer.getChannelData(0);

      const barsCount = 60;
      const step = Math.ceil(channelData.length / barsCount);
      const computedPeaks = [];

      for (let i = 0; i < barsCount; i++) {
        let max = 0;
        const start = i * step;
        const end = Math.min(start + step, channelData.length);

        for (let j = start; j < end; j++) {
          const val = Math.abs(channelData[j]);
          if (val > max) max = val;
        }
        computedPeaks.push(max);
      }

      const maxPeak = Math.max(...computedPeaks) || 1.0;
      const finalPeaks = computedPeaks.map((p) => {
        const val = p / maxPeak;
        return Math.max(10, Math.round(val * 80 + 15));
      });

      this.waveformPeaks[trackId] = finalPeaks;
      tempContext.close();
    } catch (err) {
      console.warn(`Failed to decode audio buffer for ${trackId}:`, err);
    }
  }

  init(lib) {
    this.library = lib;
    this.setupMediaSession();
    if (this.isShuffled) {
      this.initShuffleQueue();
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

    // Streaming surfaces load failures on the element, not a fetch()
    this.trackAudio.addEventListener("error", () => {
      if (!this.trackAudio.src) return;
      const track = this.library[this.currentTrackIndex];
      if (track) this.fetchErrors[track.id] = true;
      this.isLoading = false;
    });
    this.instAudio.addEventListener("error", () => {
      if (!this.instAudio.src) return;
      const track = this.library[this.currentTrackIndex];
      if (track) {
        this.instFailed[track.id] = true;
        // A dead instrumental side shouldn't mute the song
        if (this.isInstrumental && track.src) {
          this.isInstrumental = false;
          this.applyCrossfade();
        }
      }
    });

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
      if (track && !track.src && track.instrumental) this.onEnded();
    });
    this.instAudio.addEventListener("durationchange", () => {
      // Update duration from instAudio only for inst-only tracks
      const track = this.library[this.currentTrackIndex];
      if (track && !track.src && !isNaN(this.instAudio.duration)) {
        this.duration = this.instAudio.duration;
      }
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

  async loadTrack(index, autoplay = false) {
    if (index < 0 || index >= this.library.length) return;

    // Stop current playback immediately
    this.pause();

    this.currentTrackIndex = index;
    const track = this.library[index];

    // Clear all error state on retry
    delete this.fetchErrors[track.id];
    delete this.instFailed[track.id];

    this.currentTime = 0;
    this.isLoading = true;

    this.initContext();
    await this.resumeContextSoon();

    if (this.activeTrackBlobUrl) {
      URL.revokeObjectURL(this.activeTrackBlobUrl);
      this.activeTrackBlobUrl = null;
    }
    if (this.activeInstBlobUrl) {
      URL.revokeObjectURL(this.activeInstBlobUrl);
      this.activeInstBlobUrl = null;
    }

    // --- Fetch vocal track (required) ---
    let loadFailed = false;
    let resolvedTrackSrc = "";
    try {
      resolvedTrackSrc = await this.getAudioSource(track.src, "track", track.id);
    } catch (err) {
      console.error("Error loading vocal track:", err);
      this.isPlaying = false;
      this.fetchErrors[track.id] = true;
      loadFailed = true;
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

    // Set isInstrumental: if only inst loaded (no vocal src), force inst mode.
    // If both available, respect user preference. Otherwise vocal mode.
    const instAvailable = !!(track.instrumental && resolvedInstSrc && !this.instFailed[track.id]);
    if (!track.src && instAvailable) {
      // Inst-only track (e.g. sleepless) — always instrumental
      this.isInstrumental = true;
    } else if (instAvailable) {
      this.isInstrumental = this.userPrefersInstrumental || false;
    } else {
      this.isInstrumental = false;
    }

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
        const handler = () => {
          this.duration = durationSource.duration;
          durationSource.removeEventListener("loadedmetadata", handler);
          resolve();
        };
        if (durationSource.readyState >= 1) {
          this.duration = durationSource.duration;
          resolve();
        } else {
          durationSource.addEventListener("loadedmetadata", handler);
          setTimeout(resolve, 1500);
        }
      });
    }

    this.isLoading = false;

    if (!loadFailed && autoplay) {
      this.play(0);
    }
    this.updateMediaSession();

    if (!this.isSyncing) {
      this.broadcastState("state_change");
    }
  }

  // Guards async play() starts: pause() or a newer play() invalidates any
  // start still waiting on buffering.
  _playToken = 0;

  // Resolves when every element can play (readyState >= HAVE_FUTURE_DATA),
  // bounded so a stalled stream can't park playback forever.
  waitForPlayable(els, timeoutMs = 6000) {
    const ready = (el) =>
      el.readyState >= 3
        ? Promise.resolve()
        : new Promise((resolve) => {
          const done = () => {
            el.removeEventListener("canplay", done);
            el.removeEventListener("error", done);
            resolve();
          };
          el.addEventListener("canplay", done);
          el.addEventListener("error", done);
        });
    return Promise.race([
      Promise.all(els.map(ready)),
      new Promise((r) => setTimeout(r, timeoutMs)),
    ]);
  }

  async play(offset = this.currentTime) {
    if (!this.trackAudio) return;
    this.initContext();
    this.resumeContextSoon();
    this.activeAudioType = "music";

    if (!this.isSyncing) {
      this.masterTabId = this.tabId;
    }

    this.applyCrossfade();
    this.applyVolume();

    const isSelfMaster = (!this.masterTabId || this.masterTabId === this.tabId);
    this.isPlaying = true;
    const token = ++this._playToken;

    // Set current time of HTML Audio elements
    if (isSelfMaster) {
      // Vocal + instrumental are one transport: never start one before the
      // other, or the crossfader stops being a beat-perfect DJ switch. Wait
      // until both streams can actually play, then launch them in one tick.
      const dual = !!(this.trackAudio.src && this.instAudio && this.instAudio.src);
      if (dual && (this.trackAudio.readyState < 3 || this.instAudio.readyState < 3)) {
        await this.waitForPlayable([this.trackAudio, this.instAudio]);
        if (token !== this._playToken) return; // paused/superseded mid-wait
      }

      if (this.trackAudio.src) this.trackAudio.currentTime = offset;
      if (this.instAudio && this.instAudio.src) {
        this.instAudio.currentTime = offset;
      }

      // Play — only play elements that have a loaded source
      if (this.trackAudio.src) {
        this.trackAudio.play().catch(e => console.error("Error playing trackAudio:", e));
      }
      if (this.instAudio && this.instAudio.src) {
        this.instAudio.play().catch(e => console.error("Error playing instAudio:", e));
      }
    }

    this.startProgressTimer();
    this.updateMediaSession();

    if (!this.isSyncing) {
      this.broadcastState("state_change");
    }
  }

  pause() {
    this._playToken++;
    clearInterval(this.progressInterval);
    if (this.trackAudio) this.trackAudio.pause();
    if (this.instAudio) this.instAudio.pause();
    this.isPlaying = false;
    this.updateMediaSession();

    if (!this.isSyncing) {
      this.broadcastState("state_change");
    }
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
      if (this.masterTabId && this.masterTabId !== this.tabId) {
        this.broadcast({ type: "cmd_pause" });
      } else {
        this.pause();
      }
    } else {
      this.masterTabId = this.tabId;
      this.play(this.currentTime);
    }
    this.updateMediaSession();
  }

  prevTrack() {
    if (this.currentTime > 3) {
      this.seek(0);
      return;
    }
    if (this.masterTabId && this.masterTabId !== this.tabId) {
      this.broadcast({ type: "cmd_prev" });
      return;
    }
    const idx = this.isShuffled
      ? (this.shuffledQueue.length > 0 ? this.shuffledQueue.shift() : Math.floor(Math.random() * this.library.length))
      : this.currentTrackIndex > 0
        ? this.currentTrackIndex - 1
        : this.library.length - 1;
    this.loadTrack(idx, this.isPlaying);
  }

  nextTrack() {
    if (this.masterTabId && this.masterTabId !== this.tabId) {
      this.broadcast({ type: "cmd_next" });
      return;
    }
    let idx;
    if (this.isShuffled) {
      if (this.shuffledQueue.length === 0) {
        if (this.repeatMode === 1) {
          this.initShuffleQueue();
        } else {
          this.pause();
          this.seek(0);
          return;
        }
      }
      idx = this.shuffledQueue.length > 0 ? this.shuffledQueue.shift() : 0;
    } else {
      idx = this.currentTrackIndex < this.library.length - 1
        ? this.currentTrackIndex + 1
        : 0;
    }
    this.loadTrack(idx, this.isPlaying);
  }

  seek(val) {
    this.currentTime = val;
    const isSelfMaster = (!this.masterTabId || this.masterTabId === this.tabId);
    if (isSelfMaster) {
      if (this.trackAudio && this.trackAudio.src) this.trackAudio.currentTime = val;
      if (this.instAudio && this.instAudio.src) this.instAudio.currentTime = val;
      this.broadcastState("state_change");
    } else {
      this.broadcast({ type: "cmd_seek", currentTime: val });
    }
  }

  startProgressTimer() {
    clearInterval(this.progressInterval);
    this.progressInterval = setInterval(() => {
      if (this.isPlaying && this.trackAudio) {
        const isSelfMaster = (!this.masterTabId || this.masterTabId === this.tabId);

        if (isSelfMaster) {
          const track = this.library[this.currentTrackIndex];
          const isInstOnly = track && !track.src && track.instrumental;
          const dual = !isInstOnly && this.trackAudio.src && this.instAudio?.src;

          // The AUDIBLE element is the clock; the muted one gets snapped to
          // it (within 50ms), so drift corrections never stutter what the
          // listener actually hears — the crossfade switch stays beat-perfect.
          const clock =
            (isInstOnly || (dual && this.isInstrumental)) && this.instAudio?.src
              ? this.instAudio
              : this.trackAudio;
          this.currentTime = clock.currentTime;

          if (dual && !this.trackAudio.paused && !this.instAudio.paused) {
            const follower = clock === this.trackAudio ? this.instAudio : this.trackAudio;
            const diff = Math.abs(follower.currentTime - clock.currentTime);
            if (diff > 0.05) {
              follower.currentTime = clock.currentTime;
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
    }, 150);
  }

  onEnded() {
    // The native ended event and the progress timer's currentTime check can
    // both land here for the same song — a second call while the next track
    // is already loading would skip a track.
    if (this.isLoading) return;
    if (this.repeatMode === 3) {
      // X mode: stop after the current track. Play restarts it from the top;
      // picking a track, prev, and next all behave as usual.
      this.isPlaying = false;
      this.pause();
      this.seek(0);
    } else if (this.repeatMode === 2) {
      this.seek(0);
      this.play(0);
    } else if (this.repeatMode === 1 || this.currentTrackIndex < this.library.length - 1 || this.isShuffled) {
      this.nextTrack();
    } else {
      this.isPlaying = false;
      this.pause();
      this.seek(0);
    }
    this.updateMediaSession();
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
    if (!isInst && track && !track.src) return false;
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

  setupMediaSession() {
    if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () => this.togglePlay());
      navigator.mediaSession.setActionHandler("pause", () => this.togglePlay());
      navigator.mediaSession.setActionHandler("previoustrack", () => this.prevTrack());
      navigator.mediaSession.setActionHandler("nexttrack", () => this.nextTrack());
      navigator.mediaSession.setActionHandler("seekto", (details) => {
        this.seek(details.seekTime);
      });
      navigator.mediaSession.setActionHandler("seekbackward", (details) => {
        const offset = details.seekOffset || 10;
        const newTime = Math.max(0, this.currentTime - offset);
        this.seek(newTime);
      });
      navigator.mediaSession.setActionHandler("seekforward", (details) => {
        const offset = details.seekOffset || 10;
        const newTime = Math.min(this.duration, this.currentTime + offset);
        this.seek(newTime);
      });
    }
  }

  updateMediaSession() {
    if (typeof navigator !== "undefined" && "mediaSession" in navigator && this.library[this.currentTrackIndex]) {
      const track = this.library[this.currentTrackIndex];
      const origin = typeof window !== "undefined" ? window.location.origin : "";

      const coverUrl = (track.cover.startsWith("data:") || track.cover.startsWith("http://") || track.cover.startsWith("https://"))
        ? track.cover
        : origin + track.cover;

      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album,
        artwork: [
          { src: coverUrl, sizes: "512x512", type: "image/webp" }
        ]
      });
      navigator.mediaSession.playbackState = this.isPlaying ? "playing" : "paused";
      this.updateMediaSessionPositionState();
    }
  }

  updateMediaSessionPositionState() {
    if (typeof navigator !== "undefined" && "mediaSession" in navigator && "setPositionState" in navigator.mediaSession) {
      try {
        navigator.mediaSession.setPositionState({
          duration: this.duration || 0,
          playbackRate: 1.0,
          position: this.currentTime || 0
        });
      } catch (e) {
        console.error("Error setting position state:", e);
      }
    }
  }
}

export const audioCore = new AudioCore();

