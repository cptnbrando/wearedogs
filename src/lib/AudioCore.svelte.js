/**
 * Core Web Audio Engine manages gain nodes, crossfaders, and ducking states.
 * Operates independently of Svelte view files, exposing Svelte 5 reactive states.
 */
export class AudioCore {
  audioCtx = null;
  musicGain = null;
  trackSourceNode = null;
  instSourceNode = null;
  trackGainNode = null;
  instGainNode = null;
  analyser = null;
  
  trackBuffer = null;
  instBuffer = null;
  
  // Reactive Svelte 5 Runes States
  isPlaying = $state(false);
  currentTime = $state(0);
  duration = $state(0);
  volume = $state(0.8);
  isMuted = $state(false);
  isInstrumental = $state(false);
  currentTrackIndex = $state(0);
  isLoading = $state(false);
  isShuffled = $state(false);
  repeatMode = $state(0); // 0 = Off, 1 = Repeat All, 2 = Repeat One
  activeAudioType = $state("music"); // 'music' | 'video'

  startTime = 0;
  pauseTime = 0;
  progressInterval = null;
  library = [];

  constructor() {}

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
    
    this.applyVolume();
  }

  async loadTrack(index, autoplay = false) {
    if (index < 0 || index >= this.library.length) return;
    this.currentTrackIndex = index;
    this.isInstrumental = false;
    this.currentTime = 0;
    this.pauseTime = 0;
    this.isLoading = true;

    this.initContext();
    if (this.audioCtx.state === "suspended") {
      try { await this.audioCtx.resume(); } catch (e) {}
    }
    this.stopNodes();

    const track = this.library[index];
    try {
      const [tBuf, iBuf] = await Promise.all([
        this.fetchAndDecode(track.src),
        this.fetchAndDecode(track.instrumental)
      ]);
      this.trackBuffer = tBuf;
      this.instBuffer = iBuf;
      this.duration = this.trackBuffer ? this.trackBuffer.duration : 0;
    } catch (err) {
      console.error("Error loading track channels:", err);
      this.isPlaying = false;
    } finally {
      this.isLoading = false;
    }

    if (autoplay && this.trackBuffer) {
      this.play();
    }
    this.updateMediaSession();
  }

  async fetchAndDecode(url) {
    if (!url) return null;
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    return await this.audioCtx.decodeAudioData(arrayBuffer);
  }

  stopNodes() {
    try { this.trackSourceNode?.stop(); } catch {}
    try { this.instSourceNode?.stop(); } catch {}
    this.trackSourceNode = null;
    this.instSourceNode = null;
    this.trackGainNode = null;
    this.instGainNode = null;
  }

  play(offset = this.pauseTime) {
    if (!this.trackBuffer) return;
    this.initContext();
    this.stopNodes();
    
    this.activeAudioType = "music";
    
    this.trackSourceNode = this.audioCtx.createBufferSource();
    this.trackSourceNode.buffer = this.trackBuffer;
    this.trackGainNode = this.audioCtx.createGain();
    this.trackSourceNode.connect(this.trackGainNode);
    this.trackGainNode.connect(this.musicGain);

    if (this.instBuffer) {
      this.instSourceNode = this.audioCtx.createBufferSource();
      this.instSourceNode.buffer = this.instBuffer;
      this.instGainNode = this.audioCtx.createGain();
      this.instSourceNode.connect(this.instGainNode);
      this.instGainNode.connect(this.musicGain);
    }

    this.applyCrossfade();
    this.applyVolume();

    const now = this.audioCtx.currentTime;
    this.startTime = now - offset;
    this.pauseTime = offset;

    this.trackSourceNode.start(now, offset);
    if (this.instSourceNode) {
      this.instSourceNode.start(now, offset);
    }

    this.isPlaying = true;
    this.startProgressTimer();
    this.updateMediaSession();
  }

  async togglePlay() {
    this.initContext();
    if (this.audioCtx.state === "suspended") {
      try { await this.audioCtx.resume(); } catch (e) {}
    }

    if (!this.trackBuffer && !this.isLoading) {
      await this.loadTrack(this.currentTrackIndex, true);
      return;
    }

    if (this.isPlaying) {
      clearInterval(this.progressInterval);
      this.pauseTime = this.audioCtx.currentTime - this.startTime;
      this.stopNodes();
      this.isPlaying = false;
    } else {
      this.play();
    }
    this.updateMediaSession();
  }

  prevTrack() {
    if (this.currentTime > 3) {
      this.pauseTime = 0;
      if (this.isPlaying) this.play();
      else this.currentTime = 0;
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
      if (this.isPlaying && this.audioCtx) {
        this.currentTime = this.audioCtx.currentTime - this.startTime;
        if (this.currentTime >= this.duration) {
          clearInterval(this.progressInterval);
          this.onEnded();
        }
      }
    }, 100);
  }

  onEnded() {
    if (this.repeatMode === 2) {
      this.pauseTime = 0;
      this.isPlaying = false;
      this.play();
    } else if (this.repeatMode === 1 || this.currentTrackIndex < this.library.length - 1) {
      this.nextTrack();
    } else {
      this.isPlaying = false;
      this.stopNodes();
      this.pauseTime = 0;
      this.currentTime = 0;
    }
    this.updateMediaSession();
  }

  applyCrossfade() {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const isInst = this.isInstrumental;

    if (this.trackGainNode) {
      this.trackGainNode.gain.setValueAtTime(isInst ? 0 : 1, now);
    }
    if (this.instGainNode) {
      this.instGainNode.gain.setValueAtTime(isInst ? 1 : 0, now);
    }
  }

  setCrossfade(isInst) {
    const track = this.library[this.currentTrackIndex];
    if (track && !track.hasInstrumental) {
      this.isInstrumental = false;
      return false; // indicates locked
    }
    this.isInstrumental = isInst;
    this.applyCrossfade();
    return true;
  }

  applyVolume() {
    if (this.musicGain && this.audioCtx) {
      const targetVol = this.isMuted ? 0 : this.volume;
      this.musicGain.gain.setValueAtTime(targetVol, this.audioCtx.currentTime);
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
        this.pauseTime = details.seekTime;
        if (this.isPlaying) this.play();
      });
    }
  }

  updateMediaSession() {
    if (typeof navigator !== "undefined" && "mediaSession" in navigator && this.library[this.currentTrackIndex]) {
      const track = this.library[this.currentTrackIndex];
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album,
        artwork: [
          { src: track.cover, sizes: "512x512", type: "image/webp" }
        ]
      });
      navigator.mediaSession.playbackState = this.isPlaying ? "playing" : "paused";
    }
  }
}

export const audioCore = new AudioCore();
