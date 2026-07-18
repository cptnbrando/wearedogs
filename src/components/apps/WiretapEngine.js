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
    
    // Callbacks
    this.onStateChange = null;     // (state) => {}
    this.onLiveTranscript = null;  // ({ final, interim }) => {}
    this.onLiveWaveform = null;    // (array) => {}
    this.onPlaybackProgress = null;// (progress, currentTime, duration) => {}
    this.onAudioDecoded = null;    // (peaks) => {}
    this.onLivePeaksUpdate = null; // (peaks, count, duration) => {}
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
      if (this.audioElement.duration) {
        this.playbackProgress = this.audioElement.currentTime / this.audioElement.duration;
        if (this.onPlaybackProgress) {
          this.onPlaybackProgress(
            this.playbackProgress,
            this.audioElement.currentTime,
            this.audioElement.duration
          );
        }
      }
    };

    this.audioElement.addEventListener("timeupdate", updateProgress);
    this.audioElement.addEventListener("loadedmetadata", updateProgress);

    this.audioElement.addEventListener("play", () => {
      this.isPlaying = true;
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
        this.onPlaybackProgress(0, 0, this.audioElement.duration || 0);
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
   * Starts microphone recording and speech recognition.
   */
  async startRecording(audioDeviceId) {
    if (this.isRecording) return;

    // Reset transcripts and chunks
    this.audioChunks = [];
    this.audioBlob = null;
    this.audioUrl = null;
    this.peaks = [];
    this.livePeaks = [];
    this.finalTranscript = "";
    this.interimTranscript = "";
    this.playbackProgress = 0;
    this.sampleIntervalMs = 100;

    const constraints = {
      audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true,
    };

    try {
      this.liveStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.recordingStartTime = performance.now();
      this.mediaRecorder = new MediaRecorder(this.liveStream);
      
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.audioChunks.push(e.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        this.audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
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

      this.mediaRecorder.start();
      this.isRecording = true;

      // Set up real-time audio analysis
      this.startAnalyser();

      // Start speech recognition
      this.startSpeechRecognition();

      this.triggerStateChange();
    } catch (err) {
      console.error("Failed to start recording:", err);
      throw err;
    }
  }

  /**
   * Stop the current recording, live streaming tracks, analysis, and SpeechRecognition.
   */
  stopRecording() {
    if (!this.isRecording) return;

    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }

    if (this.liveStream) {
      this.liveStream.getTracks().forEach((t) => t.stop());
      this.liveStream = null;
    }

    this.stopAnalyser();
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

    this.audioContext = new AudioContextClass();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 1024;
    this.source = this.audioContext.createMediaStreamSource(this.liveStream);
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
      if (!this.isRecording) return;

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

      // 2. Accumulate peak every sampleIntervalMs
      const now = performance.now();
      if (now - lastSampleTime >= this.sampleIntervalMs) {
        this.livePeaks.push(currentWindowMax);
        lastSampleTime = now;
        currentWindowMax = 0;

        // Downsample dynamically to protect performance if recording is long-running
        if (this.livePeaks.length >= 1000) {
          this.livePeaks = downsamplePeaksHalf(this.livePeaks);
          this.sampleIntervalMs *= 2;
        }

        if (this.onLivePeaksUpdate) {
          const duration = (performance.now() - this.recordingStartTime) / 1000;
          this.onLivePeaksUpdate(
            resamplePeaks(this.livePeaks, WAVEFORM_BARS_COUNT),
            Math.min(WAVEFORM_BARS_COUNT, this.livePeaks.length),
            duration
          );
        }
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
        // SpeechRecognition can time out; restart if we're still recording.
        try {
          this.recognition.start();
        } catch (e) {
          console.warn("Speech recognition failed to restart automatically:", e);
        }
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
    if (this.audioElement.duration) {
      const boundedPercent = Math.max(0, Math.min(1, percent));
      this.audioElement.currentTime = boundedPercent * this.audioElement.duration;
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
   * Reset the engine state.
   */
  reset() {
    this.stopRecording();
    this.pause();
    this.audioBlob = null;
    this.audioUrl = null;
    this.peaks = [];
    this.finalTranscript = "";
    this.interimTranscript = "";
    this.playbackProgress = 0;
    this.isPlaying = false;
    this.triggerStateChange();
  }
}
