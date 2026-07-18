/**
 * WiretapEngine.js
 * Decoupled logic engine for capturing audio, Web Speech API transcription,
 * live analysis, and audio playback waveform generation.
 */

const DEFAULT_FFT_SIZE = 64;
const DEFAULT_LANG = "en-US";
const WAVEFORM_BARS_COUNT = 100;

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

    this.setupPlaybackListeners();
  }

  /**
   * Set up audio element event listeners.
   */
  setupPlaybackListeners() {
    this.audioElement.addEventListener("timeupdate", () => {
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
    });

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
    this.finalTranscript = "";
    this.interimTranscript = "";
    this.playbackProgress = 0;

    const constraints = {
      audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true,
    };

    try {
      this.liveStream = await navigator.mediaDevices.getUserMedia(constraints);
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
        
        await this.decodeWaveform();
        this.triggerStateChange();
      };

      // Set up real-time audio analysis
      this.startAnalyser();

      // Start speech recognition
      this.startSpeechRecognition();

      this.mediaRecorder.start();
      this.isRecording = true;
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
    this.analyser.fftSize = DEFAULT_FFT_SIZE;
    this.source = this.audioContext.createMediaStreamSource(this.liveStream);
    this.source.connect(this.analyser);

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const tick = () => {
      if (!this.isRecording) return;
      this.analyser.getByteFrequencyData(dataArray);
      if (this.onLiveWaveform) {
        this.onLiveWaveform(Array.from(dataArray));
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
