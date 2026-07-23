/**
 * WiretapEngine.js
 * Decoupled logic engine for capturing audio, Web Speech API transcription,
 * live analysis, and audio playback waveform generation.
 */

const DEFAULT_FFT_SIZE = 64;
const DEFAULT_LANG = "en-US";
const WAVEFORM_BARS_COUNT = 100;

/**
 * Resample a list of amplitudes to targetLength and normalize them.
 */
function resamplePeaks(array, targetLength) {
  let resampled = [];
  if (array.length <= targetLength) {
    resampled = [...array];
    while (resampled.length < targetLength) {
      resampled.push(0);
    }
  } else {
    const step = array.length / targetLength;
    for (let i = 0; i < targetLength; i++) {
      let max = 0;
      const start = Math.floor(i * step);
      const end = Math.min(Math.floor((i + 1) * step), array.length);
      for (let j = start; j < end; j++) {
        if (array[j] > max) max = array[j];
      }
      resampled.push(max);
    }
  }

  const maxPeak = Math.max(...resampled) || 1.0;
  const scale = maxPeak > 0.05 ? maxPeak : 1.0;
  return resampled.map((p) => p / scale);
}

/**
 * Resample a list of peaks to targetLength by stretching/interpolating, and normalize them.
 */
function resamplePeaksStretched(array, targetLength) {
  if (array.length === 0) {
    return Array(targetLength).fill(0);
  }
  let resampled = [];
  const step = array.length / targetLength;
  for (let i = 0; i < targetLength; i++) {
    let max = 0;
    const start = Math.floor(i * step);
    const end = Math.max(start + 1, Math.min(Math.floor((i + 1) * step), array.length));
    for (let j = start; j < end; j++) {
      if (array[j] > max) max = array[j];
    }
    resampled.push(max);
  }
  const maxPeak = Math.max(...resampled) || 1.0;
  const scale = maxPeak > 0.05 ? maxPeak : 1.0;
  return resampled.map((p) => p / scale);
}

/**
 * Downsample a list of peaks by half, taking the maximum of each pair.
 */
function downsamplePeaksHalf(array) {
  const result = [];
  for (let i = 0; i < array.length; i += 2) {
    if (i + 1 < array.length) {
      result.push(Math.max(array[i], array[i + 1]));
    } else {
      result.push(array[i]);
    }
  }
  return result;
}

export class WiretapEngine {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.audioBlob = null;
    this.audioUrl = null;
    this.audioElement = new Audio();

    // Audio Context & Analyser
    this.audioContext = null;
    this.analyser = null;
    this.source = null;
    this.liveStream = null;
    this.animationFrameId = null;

    // Monitoring State
    this.isMonitoring = false;
    this.monitorStream = null;
    this.recordingDuration = 0;

    // Speech Recognition
    this.recognition = null;
    this.finalTranscript = "";
    this.interimTranscript = "";
    this.isRecognizing = false;

    // Decoded peaks for playback waveform
    this.peaks = [];
    this.isDecoding = false;
    this.livePeaks = [];

    // Listeners and state flags
    this.isRecording = false;
    this.isPlaying = false;
    this.playbackProgress = 0; // 0 to 1

    // Prick Mode state
    this.mode = "recorder"; // "recorder" or "prick"
    this.threshold = 0.15;
    this.clipLength = 3; // buffer length in seconds (before and after snap)
    this.clips = [];
    this.cameraStream = null; // reference set by Svelte UI
    this.clipCapturingState = "idle"; // "idle" or "capturing"
    this.rollingChunks = []; // last clipLength seconds of media chunks: { chunk, timestamp }
    this.rollingPeaks = []; // last clipLength seconds of peak values: { val, timestamp }
    this.activeClipChunks = []; // chunks accumulated for the current clip
    this.activeClipPeaks = []; // peaks accumulated for the current clip
    this.headerChunk = null; // WebM header chunk of the current session
    this.clipEndTime = 0;
    this.clipStartTime = null;
    this.clipStartPerformanceTime = null;
    this.burstStartTime = 0;
    this.burstEndTime = 0;
    this.mimeType = "audio/webm";

    // Callbacks
    this.onStateChange = null;     // (state) => {}
    this.onLiveTranscript = null;  // ({ final, interim }) => {}
    this.onLiveWaveform = null;    // (array) => {}
    this.onPlaybackProgress = null;// (progress, currentTime, duration) => {}
    this.onAudioDecoded = null;    // (peaks) => {}
    this.onLivePeaksUpdate = null; // (peaks, count, duration) => {}
    this.onClipAdded = null;       // (newClip, clips) => {}
    this.onClipsCleared = null;    // () => {}
    this.onLiveVolumeUpdate = null;// (amp) => {}

    // Downsampling & timing for long recordings
    this.sampleIntervalMs = 100;
    this.recordingStartTime = 0;

    this.setupPlaybackListeners();
  }

  /**
   * Set up audio element event listeners.
   */
  setupPlaybackListeners() {
    const updateProgress = () => {
      let dur = this.audioElement.duration;
      if (!dur || dur === Infinity) {
        dur = this.recordingDuration || 0;
      }
      if (dur) {
        this.playbackProgress = this.audioElement.currentTime / dur;
        if (this.onPlaybackProgress) {
          this.onPlaybackProgress(
            this.playbackProgress,
            this.audioElement.currentTime,
            dur
          );
        }
      }
    };

    this.audioElement.addEventListener("timeupdate", updateProgress);
    this.audioElement.addEventListener("loadedmetadata", updateProgress);

    this.audioElement.addEventListener("play", () => {
      this.isPlaying = true;
      if (!this.isRecording && !this.isRecognizing) {
        this.startSpeechRecognition();
      }
      this.triggerStateChange();
    });

    this.audioElement.addEventListener("pause", () => {
      this.isPlaying = false;
      this.triggerStateChange();
    });

    this.audioElement.addEventListener("ended", () => {
      this.isPlaying = false;
      this.playbackProgress = 0;
      this.triggerStateChange();
      if (this.onPlaybackProgress) {
        let dur = this.audioElement.duration;
        if (!dur || dur === Infinity) {
          dur = this.recordingDuration || 0;
        }
        this.onPlaybackProgress(0, 0, dur);
      }
    });
  }

  /**
   * Notify of any internal state changes.
   */
  triggerStateChange() {
    if (this.onStateChange) {
      this.onStateChange({
        isRecording: this.isRecording,
        isPlaying: this.isPlaying,
        isDecoding: this.isDecoding,
        hasRecording: !!this.audioBlob,
        clipCapturingState: this.clipCapturingState,
      });
    }
  }

  /**
   * Enumerate connected hardware devices.
   */
  async getDevices() {
    if (!navigator.mediaDevices?.enumerateDevices) {
      return { audio: [], video: [] };
    }
    const devices = await navigator.mediaDevices.enumerateDevices();
    return {
      audio: devices.filter((d) => d.kind === "audioinput"),
      video: devices.filter((d) => d.kind === "videoinput"),
    };
  }

  /**
   * Ask for permissions to get valid device labels.
   */
  async requestPermissions() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    stream.getTracks().forEach((track) => track.stop());
  }

  /**
   * Start live background monitoring.
   */
  async startMonitoring(audioDeviceId) {
    this.stopMonitoring();

    const constraints = {
      audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true,
    };

    try {
      this.monitorStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.isMonitoring = true;
      this.startAnalyser();
    } catch (err) {
      console.error("Failed to start monitoring:", err);
      throw err;
    }
  }

  /**
   * Stop background monitoring.
   */
  stopMonitoring() {
    this.stopAnalyser();
    if (this.monitorStream) {
      this.monitorStream.getTracks().forEach((t) => t.stop());
      this.monitorStream = null;
    }
    this.isMonitoring = false;
  }

  /**
   * Starts microphone and video recording and speech recognition.
   */
  async startRecording(audioDeviceId, videoTrack = null) {
    if (this.isRecording) return;

    // Reset transcripts, chunks, buffers, and states
    this.audioChunks = [];
    this.audioBlob = null;
    this.audioUrl = null;
    this.peaks = [];
    this.livePeaks = [];
    this.finalTranscript = this.finalTranscript ? this.finalTranscript.trim() + " " : "";
    this.interimTranscript = "";
    this.playbackProgress = 0;
    this.sampleIntervalMs = 100;

    this.rollingChunks = [];
    this.rollingPeaks = [];
    this.activeClipChunks = [];
    this.activeClipPeaks = [];
    this.headerChunk = null;
    this.clipCapturingState = "idle";
    this.burstStartTime = 0;
    this.burstEndTime = 0;

    // Start speech recognition synchronously in the user gesture call stack
    this.startSpeechRecognition();
    this.isRecording = true;
    this.triggerStateChange();

    const constraints = {
      audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true,
    };

    if (videoTrack) {
      this.mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
        ? "video/webm;codecs=vp8,opus"
        : "video/webm";
    } else {
      this.mimeType = "audio/webm";
    }

    try {
      // Reuse monitoring stream audio track if active, otherwise fetch new stream
      if (this.isMonitoring && this.monitorStream) {
        this.liveStream = new MediaStream();
        const audioTrack = this.monitorStream.getAudioTracks()[0];
        if (audioTrack) {
          this.liveStream.addTrack(audioTrack);
        } else {
          const tempStream = await navigator.mediaDevices.getUserMedia(constraints);
          this.liveStream.addTrack(tempStream.getAudioTracks()[0]);
        }
      } else {
        this.liveStream = await navigator.mediaDevices.getUserMedia(constraints);
      }

      if (videoTrack) {
        this.liveStream.addTrack(videoTrack);
      }

      this.recordingStartTime = performance.now();

      const options = { mimeType: this.mimeType };
      this.mediaRecorder = new MediaRecorder(this.liveStream, options);

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.audioChunks.push(e.data);

          if (!this.headerChunk) {
            this.headerChunk = e.data;
          }

          const now = performance.now();

          // Push to rolling chunks for pre-record buffer
          this.rollingChunks.push({ chunk: e.data, timestamp: now });

          // Filter rolling chunks to keep only those within clipLength
          const preRecordLimit = now - this.clipLength * 1000;
          this.rollingChunks = this.rollingChunks.filter((c) => c.timestamp >= preRecordLimit);

          // If capturing post-snap chunks for a clip
          if (this.clipCapturingState === "capturing") {
            this.activeClipChunks.push(e.data);

            if (now >= this.clipEndTime) {
              this.finalizeClip();
            }
          }
        }
      };

      this.mediaRecorder.onstop = async () => {
        this.audioBlob = new Blob(this.audioChunks, { type: this.mimeType });
        this.audioUrl = URL.createObjectURL(this.audioBlob);
        this.audioElement.src = this.audioUrl;

        if (this.livePeaks.length > 0) {
          this.peaks = resamplePeaksStretched(this.livePeaks, WAVEFORM_BARS_COUNT);
          if (this.onAudioDecoded) {
            this.onAudioDecoded(this.peaks);
          }
        } else {
          await this.decodeWaveform();
        }
        this.triggerStateChange();
      };

      // Request data every 250ms to feed the circular buffer
      this.mediaRecorder.start(250);
    } catch (err) {
      console.error("Failed to start recording:", err);
      this.stopSpeechRecognition();
      this.isRecording = false;
      this.triggerStateChange();
      throw err;
    }
  }

  /**
   * Stop the current recording, but keep monitoring running.
   */
  stopRecording() {
    if (!this.isRecording) return;

    this.recordingDuration = (performance.now() - this.recordingStartTime) / 1000;

    if (this.clipCapturingState === "capturing") {
      this.finalizeClip();
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }

    // Stop only tracks that are not part of monitorStream
    if (this.liveStream) {
      this.liveStream.getTracks().forEach((t) => {
        const isMonitorTrack = this.monitorStream && this.monitorStream.getTracks().includes(t);
        if (!isMonitorTrack) {
          t.stop();
        }
      });
      this.liveStream = null;
    }

    this.stopSpeechRecognition();

    this.isRecording = false;
    this.triggerStateChange();
  }

  /**
   * Set up Web Audio context and real-time analyser.
   */
  startAnalyser() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const streamSource = this.monitorStream || this.liveStream;
    if (!streamSource) return;

    this.audioContext = new AudioContextClass();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 1024;
    this.source = this.audioContext.createMediaStreamSource(streamSource);
    this.source.connect(this.analyser);

    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    const bufferLength = this.analyser.frequencyBinCount;
    const freqDataArray = new Uint8Array(bufferLength);
    const timeDomainArray = new Uint8Array(this.analyser.fftSize);

    let lastSampleTime = performance.now();
    let currentWindowMax = 0;

    const tick = () => {
      if (!this.isMonitoring && !this.isRecording) return;

      // 1. Get live time-domain peak amplitude
      this.analyser.getByteTimeDomainData(timeDomainArray);
      let localMax = 0;
      for (let i = 0; i < timeDomainArray.length; i++) {
        const val = Math.abs(timeDomainArray[i] - 128);
        if (val > localMax) localMax = val;
      }
      const amp = localMax / 128;
      if (amp > currentWindowMax) {
        currentWindowMax = amp;
      }

      if (this.onLiveVolumeUpdate) {
        this.onLiveVolumeUpdate(amp);
      }

      if (this.mode === "prick" && this.isRecording) {
        const now = performance.now();
        if (amp > this.threshold) {
          if (this.clipCapturingState === "idle") {
            this.clipCapturingState = "capturing";
            this.triggerStateChange();
            this.clipStartTime = new Date(Date.now() - this.clipLength * 1000);
            this.clipStartPerformanceTime = now - this.clipLength * 1000;
            this.burstStartTime = now;
            this.burstEndTime = now;

            // Collect the pre-recorded chunks & peaks
            this.activeClipChunks = this.rollingChunks.map((c) => c.chunk);
            this.activeClipPeaks = this.rollingPeaks.map((p) => p.val);

            this.clipEndTime = now + this.clipLength * 1000;
          } else if (this.clipCapturingState === "capturing") {
            this.burstEndTime = now;
            // Extend the clip recording, but cap it to prevent infinite capture loops
            const maxClipEndTime = this.clipStartPerformanceTime + (this.clipLength * 4) * 1000;
            this.clipEndTime = Math.min(now + this.clipLength * 1000, maxClipEndTime);
          }
        } else if (this.clipCapturingState === "capturing") {
          if (amp > this.threshold * 0.35) {
            this.burstEndTime = now;
          }
        }
      }

      // 2. Accumulate peak every sampleIntervalMs using a drift-free accumulator
      const now = performance.now();
      let pushedAny = false;
      while (now - lastSampleTime >= this.sampleIntervalMs) {
        const peakVal = currentWindowMax;

        if (this.isRecording) {
          this.livePeaks.push(peakVal);

          // Keep rolling peaks for pre-record buffer
          this.rollingPeaks.push({ val: peakVal, timestamp: now });
          const preRecordLimit = now - this.clipLength * 1000;
          this.rollingPeaks = this.rollingPeaks.filter((p) => p.timestamp >= preRecordLimit);

          if (this.clipCapturingState === "capturing") {
            this.activeClipPeaks.push(peakVal);
          }

          // Downsample dynamically to protect performance if recording is long-running
          if (this.livePeaks.length >= 1000) {
            this.livePeaks = downsamplePeaksHalf(this.livePeaks);
            this.sampleIntervalMs *= 2;
          }
        }

        lastSampleTime += this.sampleIntervalMs;
        currentWindowMax = 0;
        pushedAny = true;
      }

      if (pushedAny && this.onLivePeaksUpdate && this.isRecording) {
        const duration = (performance.now() - this.recordingStartTime) / 1000;
        let displayPeaks;
        let activeCount;
        if (this.livePeaks.length <= WAVEFORM_BARS_COUNT) {
          displayPeaks = resamplePeaks(this.livePeaks, WAVEFORM_BARS_COUNT);
          activeCount = this.livePeaks.length;
        } else {
          displayPeaks = this.livePeaks.slice(-WAVEFORM_BARS_COUNT);
          const maxVal = Math.max(...displayPeaks) || 1.0;
          const scale = maxVal > 0.05 ? maxVal : 1.0;
          displayPeaks = displayPeaks.map(p => p / scale);
          activeCount = WAVEFORM_BARS_COUNT;
        }
        this.onLivePeaksUpdate(
          displayPeaks,
          activeCount,
          duration
        );
      }

      // 3. Keep standard frequency update for compatibility
      this.analyser.getByteFrequencyData(freqDataArray);
      if (this.onLiveWaveform) {
        this.onLiveWaveform(Array.from(freqDataArray).slice(0, 32));
      }

      this.animationFrameId = requestAnimationFrame(tick);
    };

    tick();
  }

  /**
   * Clean up AudioContext and analyser.
   */
  stopAnalyser() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.analyser = null;
  }

  /**
   * Initialize and start Web Speech Recognition.
   */
  startSpeechRecognition() {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }

    this.recognition = new SpeechRecognitionClass();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = DEFAULT_LANG;

    this.recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.finalTranscript += transcript + " ";
        } else {
          interim += transcript;
        }
      }
      this.interimTranscript = interim;

      if (this.onLiveTranscript) {
        this.onLiveTranscript({
          final: this.finalTranscript.trim(),
          interim: this.interimTranscript.trim(),
        });
      }
    };

    this.recognition.onerror = (e) => {
      console.warn("Speech recognition error:", e.error);
    };

    this.recognition.onend = () => {
      if (this.isRecording && this.isRecognizing) {
        // SpeechRecognition can time out; restart if we're still recording with a slight delay.
        setTimeout(() => {
          if (this.isRecording && this.isRecognizing) {
            try {
              this.recognition.start();
            } catch (e) {
              console.warn("Speech recognition failed to restart automatically:", e);
            }
          }
        }, 100);
      }
    };

    this.isRecognizing = true;
    this.recognition.start();
  }

  /**
   * Stop the speech recogniser.
   */
  stopSpeechRecognition() {
    this.isRecognizing = false;
    if (this.recognition) {
      this.recognition.onend = null;
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn("Speech recognition stop error:", e);
      }
      this.recognition = null;
    }
  }

  /**
   * Decode the recorded audio blob to calculate peaks.
   */
  async decodeWaveform() {
    if (!this.audioBlob) return;

    this.isDecoding = true;
    this.triggerStateChange();

    try {
      const arrayBuffer = await this.audioBlob.arrayBuffer();
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const tempContext = new AudioContextClass();

      const audioBuffer = await tempContext.decodeAudioData(arrayBuffer);
      const channelData = audioBuffer.getChannelData(0);
      if (audioBuffer.duration) {
        this.recordingDuration = audioBuffer.duration;
      }

      const step = Math.ceil(channelData.length / WAVEFORM_BARS_COUNT);
      const computedPeaks = [];

      for (let i = 0; i < WAVEFORM_BARS_COUNT; i++) {
        let max = 0;
        const start = i * step;
        const end = Math.min(start + step, channelData.length);

        for (let j = start; j < end; j++) {
          const val = Math.abs(channelData[j]);
          if (val > max) max = val;
        }
        computedPeaks.push(max);
      }

      // Normalize peaks
      const maxPeak = Math.max(...computedPeaks) || 1.0;
      this.peaks = computedPeaks.map((p) => p / maxPeak);

      if (this.onAudioDecoded) {
        this.onAudioDecoded(this.peaks);
      }
      tempContext.close();
    } catch (err) {
      console.warn("Failed to decode audio buffer, falling back to dummy waveform:", err);
      // Fallback: Generate a nice dummy cyberpunk-style waveform
      this.peaks = Array.from({ length: WAVEFORM_BARS_COUNT }, () => 0.1 + Math.random() * 0.8);
      if (this.onAudioDecoded) {
        this.onAudioDecoded(this.peaks);
      }
    } finally {
      this.isDecoding = false;
      this.triggerStateChange();
    }
  }

  /**
   * Finalizes the current clip, concatenates the headers, and fires the callback.
   */
  finalizeClip() {
    this.clipCapturingState = "idle";
    this.triggerStateChange();
    if (this.activeClipChunks.length === 0) return;

    // Filter duplicate header chunks to prevent EBML structural issues
    let chunksToCombine = [...this.activeClipChunks];
    if (chunksToCombine[0] === this.headerChunk) {
      chunksToCombine.shift();
    }
    chunksToCombine.unshift(this.headerChunk);

    const clipBlob = new Blob(chunksToCombine, { type: this.mimeType });
    const clipUrl = URL.createObjectURL(clipBlob);
    const clipDuration = (performance.now() - this.clipStartPerformanceTime) / 1000;
    const clipPeaks = resamplePeaksStretched(this.activeClipPeaks, WAVEFORM_BARS_COUNT);

    // Calculate sound burst duration (a prick is a sudden burst < 1.0s)
    const rawBurstDuration = (this.burstEndTime && this.burstStartTime && this.burstEndTime >= this.burstStartTime)
      ? (this.burstEndTime - this.burstStartTime) / 1000
      : 0;

    let peakAboveCount = 0;
    for (const p of this.activeClipPeaks) {
      if (p > this.threshold * 0.35) {
        peakAboveCount++;
      }
    }
    const peakBurstDuration = peakAboveCount * (this.sampleIntervalMs / 1000);
    const burstDuration = Math.max(rawBurstDuration, peakBurstDuration);
    const isPrick = burstDuration < 1.0;
    const isNotJustAPrick = !isPrick;

    const newClip = {
      id: Date.now() + Math.random(),
      timestamp: this.clipStartTime,
      duration: clipDuration,
      burstDuration: burstDuration,
      isPrick: isPrick,
      isNotJustAPrick: isNotJustAPrick,
      mode: this.mode,
      blob: clipBlob,
      url: clipUrl,
      isVideo: this.mimeType.startsWith("video"),
      peaks: clipPeaks,
    };

    this.clips.push(newClip);
    if (this.onClipAdded) {
      this.onClipAdded(newClip, this.clips);
    }

    // Reset chunks, peaks, and timing counters to clear state
    this.activeClipChunks = [];
    this.activeClipPeaks = [];
    this.burstStartTime = 0;
    this.burstEndTime = 0;
  }

  /**
   * Start playback.
   */
  play() {
    if (this.audioBlob) {
      this.audioElement.play().catch((err) => console.error("Playback failed:", err));
    }
  }

  /**
   * Pause playback.
   */
  pause() {
    this.audioElement.pause();
  }

  /**
   * Scrub to a given percentage of the audio.
   */
  seek(percent) {
    let dur = this.audioElement.duration;
    if (!dur || dur === Infinity) {
      dur = this.recordingDuration || 0;
    }
    if (dur) {
      const boundedPercent = Math.max(0, Math.min(1, percent));
      this.audioElement.currentTime = boundedPercent * dur;
      this.playbackProgress = boundedPercent;
    }
  }

  /**
   * Download the recorded webm file.
   */
  download(filename = "wiretap-recording.webm") {
    if (!this.audioBlob) return;

    const anchor = document.createElement("a");
    anchor.href = this.audioUrl;
    anchor.download = filename;
    anchor.click();
  }

  /**
   * Load an external audio file (e.g. MP3, WAV, WebM) for playback, waveform generation, and transcription.
   * @param {File|Blob} file 
   */
  async loadAudioFile(file) {
    this.reset();

    this.audioBlob = file;
    this.audioUrl = URL.createObjectURL(file);
    this.audioElement.src = this.audioUrl;
    this.mimeType = file.type || "audio/mp3";

    await new Promise((resolve) => {
      const onLoaded = () => {
        if (this.audioElement.duration && this.audioElement.duration !== Infinity) {
          this.recordingDuration = this.audioElement.duration;
        }
        this.audioElement.removeEventListener("loadedmetadata", onLoaded);
        resolve();
      };
      if (this.audioElement.readyState >= 1) {
        if (this.audioElement.duration && this.audioElement.duration !== Infinity) {
          this.recordingDuration = this.audioElement.duration;
        }
        resolve();
      } else {
        this.audioElement.addEventListener("loadedmetadata", onLoaded);
      }
    });

    await this.decodeWaveform();
    this.triggerStateChange();
  }

  /**
   * Transcribe an uploaded audio file directly in-browser using WebAudio and a dedicated Web Worker.
   * Completely silent (no speaker playback), off main thread (zero UI freeze), and offline (no mic).
   * @param {File|Blob} file 
   * @param {Function} onProgress 
   */
  async transcribeAudioFileOffline(file, onProgress) {
    this.stopRecording();
    this.stopMonitoring();
    this.stopSpeechRecognition();
    this.pause();

    if (onProgress) onProgress(5, "Reading audio file...");

    const arrayBuffer = await file.arrayBuffer();
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const tempContext = new AudioContextClass();

    const audioBuffer = await tempContext.decodeAudioData(arrayBuffer);
    tempContext.close();

    if (onProgress) onProgress(15, "Resampling audio to 16kHz...");

    const sampleRate = 16000;
    const offlineCtx = new OfflineAudioContext(1, Math.ceil(audioBuffer.duration * sampleRate), sampleRate);
    const bufferSource = offlineCtx.createBufferSource();
    bufferSource.buffer = audioBuffer;
    bufferSource.connect(offlineCtx.destination);
    bufferSource.start(0);

    const renderedBuffer = await offlineCtx.startRendering();
    const pcmData = renderedBuffer.getChannelData(0);

    if (onProgress) onProgress(25, "Spawning background Web Worker...");

    return new Promise((resolve, reject) => {
      try {
        const worker = new Worker(new URL("./transcriberWorker.js", import.meta.url), { type: "module" });

        worker.onmessage = (e) => {
          const { status, progress, text, error } = e.data;
          if (status === "progress") {
            if (onProgress) onProgress(progress || 50, text);
          } else if (status === "complete") {
            worker.terminate();
            if (onProgress) onProgress(100, "Transcription complete.");
            resolve(text);
          } else if (status === "error") {
            worker.terminate();
            reject(new Error(error));
          }
        };

        worker.onerror = (err) => {
          worker.terminate();
          reject(new Error("Worker thread error: " + err.message));
        };

        worker.postMessage({ type: "transcribe", pcmData });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Reset the engine state.
   */
  reset() {
    this.stopRecording();
    this.stopMonitoring();
    this.pause();
    this.audioBlob = null;
    this.audioUrl = null;
    this.peaks = [];
    this.finalTranscript = "";
    this.interimTranscript = "";
    this.playbackProgress = 0;
    this.isPlaying = false;
    this.clips = [];
    if (this.onClipsCleared) {
      this.onClipsCleared();
    }
    this.triggerStateChange();
  }
}
