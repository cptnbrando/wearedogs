/**
 * Core Web Audio Engine manages gain nodes, crossfaders, and ducking states.
 * Uses HTMLMediaElement streaming connected to Web Audio Context for native OS Media Session,
 * hardware key, and Bluetooth controls integration.
 */
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
  isShuffled = $state(false);
  repeatMode = $state(1); // 0 = Off, 1 = Repeat All, 2 = Repeat One
  activeAudioType = $state("music"); // 'music' | 'video'

  progressInterval = null;
  library = [];

  constructor() { }

  init(lib) {
    this.library = lib;
    this.setupMediaSession();
  }

  initContext() {
    if (this.audioCtx) return;
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.musicGain = this.audioCtx.createGain();

    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 256;

    this.musicGain.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);

    // Initialize HTML Audio elements
    this.trackAudio = new Audio();
    this.trackAudio.crossOrigin = "anonymous";
    this.instAudio = new Audio();
    this.instAudio.crossOrigin = "anonymous";

    // Bind event listeners for ending and duration changes
    this.trackAudio.addEventListener("ended", () => {
      this.onEnded();
    });
    this.trackAudio.addEventListener("durationchange", () => {
      this.duration = this.trackAudio.duration;
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
    this.currentTrackIndex = index;
    const track = this.library[index];
    if (track && track.hasInstrumental) {
      this.isInstrumental = this.userPrefersInstrumental || false;
    } else {
      this.isInstrumental = (track && (track.id === "rain" || track.id === "denchai"));
    }
    this.currentTime = 0;
    this.isLoading = true;

    this.initContext();
    if (this.audioCtx.state === "suspended") {
      try { await this.audioCtx.resume(); } catch (e) { }
    }

    try {
      this.trackAudio.src = track.src;
      this.trackAudio.load();
      if (track.instrumental) {
        this.instAudio.src = track.instrumental;
        this.instAudio.load();
      } else {
        this.instAudio.removeAttribute("src");
        this.instAudio.load();
      }

      // Wait briefly for metadata to resolve duration
      await new Promise((resolve) => {
        const handler = () => {
          this.duration = this.trackAudio.duration;
          this.trackAudio.removeEventListener("loadedmetadata", handler);
          resolve();
        };
        if (this.trackAudio.readyState >= 1) {
          this.duration = this.trackAudio.duration;
          resolve();
        } else {
          this.trackAudio.addEventListener("loadedmetadata", handler);
          // Safety timeout
          setTimeout(resolve, 1500);
        }
      });
    } catch (err) {
      console.error("Error loading track channels:", err);
      this.isPlaying = false;
    } finally {
      this.isLoading = false;
    }

    if (autoplay) {
      this.play(0);
    }
    this.updateMediaSession();
  }

  play(offset = this.currentTime) {
    if (!this.trackAudio) return;
    this.initContext();
    this.activeAudioType = "music";

    this.applyCrossfade();
    this.applyVolume();

    // Set current time of HTML Audio elements
    this.trackAudio.currentTime = offset;
    if (this.instAudio && this.instAudio.src) {
      this.instAudio.currentTime = offset;
    }

    // Play
    this.trackAudio.play().catch(e => console.error("Error playing trackAudio:", e));
    if (this.instAudio && this.instAudio.src) {
      this.instAudio.play().catch(e => console.error("Error playing instAudio:", e));
    }

    this.isPlaying = true;
    this.startProgressTimer();
    this.updateMediaSession();
  }

  pause() {
    clearInterval(this.progressInterval);
    if (this.trackAudio) this.trackAudio.pause();
    if (this.instAudio) this.instAudio.pause();
    this.isPlaying = false;
    this.updateMediaSession();
  }

  async togglePlay() {
    this.initContext();
    if (this.audioCtx.state === "suspended") {
      try { await this.audioCtx.resume(); } catch (e) { }
    }

    if (!this.trackAudio.src && !this.isLoading) {
      await this.loadTrack(this.currentTrackIndex, true);
      return;
    }

    if (this.isPlaying) {
      this.pause();
    } else {
      this.play(this.currentTime);
    }
    this.updateMediaSession();
  }

  prevTrack() {
    if (this.currentTime > 3) {
      this.currentTime = 0;
      this.play(0);
      return;
    }
    const idx = this.isShuffled
      ? Math.floor(Math.random() * this.library.length)
      : this.currentTrackIndex > 0
        ? this.currentTrackIndex - 1
        : this.library.length - 1;
    this.loadTrack(idx, this.isPlaying);
  }

  nextTrack() {
    const idx = this.isShuffled
      ? Math.floor(Math.random() * this.library.length)
      : this.currentTrackIndex < this.library.length - 1
        ? this.currentTrackIndex + 1
        : 0;
    this.loadTrack(idx, this.isPlaying);
  }

  startProgressTimer() {
    clearInterval(this.progressInterval);
    this.progressInterval = setInterval(() => {
      if (this.isPlaying && this.trackAudio) {
        this.currentTime = this.trackAudio.currentTime;

        // Keep instrumental in sync with the main track (within 50ms tolerance)
        if (this.instAudio && this.instAudio.src && !this.instAudio.paused) {
          const diff = Math.abs(this.instAudio.currentTime - this.trackAudio.currentTime);
          if (diff > 0.05) {
            this.instAudio.currentTime = this.trackAudio.currentTime;
          }
        }

        if (this.currentTime >= this.duration) {
          clearInterval(this.progressInterval);
          this.onEnded();
        }
      }
    }, 150);
  }

  onEnded() {
    if (this.repeatMode === 2) {
      this.currentTime = 0;
      this.isPlaying = false;
      this.play(0);
    } else if (this.repeatMode === 1 || this.currentTrackIndex < this.library.length - 1) {
      this.nextTrack();
    } else {
      this.isPlaying = false;
      this.pause();
      this.currentTime = 0;
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
    if (track && !track.hasInstrumental) {
      return false; // indicates locked
    }
    this.isInstrumental = isInst;
    this.userPrefersInstrumental = isInst;
    this.applyCrossfade();
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
        this.currentTime = details.seekTime;
        if (this.trackAudio) {
          this.trackAudio.currentTime = details.seekTime;
        }
        if (this.instAudio && this.instAudio.src) {
          this.instAudio.currentTime = details.seekTime;
        }
        this.updateMediaSessionPositionState();
      });
      navigator.mediaSession.setActionHandler("seekbackward", (details) => {
        const offset = details.seekOffset || 10;
        const newTime = Math.max(0, this.currentTime - offset);
        this.currentTime = newTime;
        if (this.trackAudio) {
          this.trackAudio.currentTime = newTime;
        }
        if (this.instAudio && this.instAudio.src) {
          this.instAudio.currentTime = newTime;
        }
        this.updateMediaSessionPositionState();
      });
      navigator.mediaSession.setActionHandler("seekforward", (details) => {
        const offset = details.seekOffset || 10;
        const newTime = Math.min(this.duration, this.currentTime + offset);
        this.currentTime = newTime;
        if (this.trackAudio) {
          this.trackAudio.currentTime = newTime;
        }
        if (this.instAudio && this.instAudio.src) {
          this.instAudio.currentTime = newTime;
        }
        this.updateMediaSessionPositionState();
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
