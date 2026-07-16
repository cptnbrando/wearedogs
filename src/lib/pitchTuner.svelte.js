/**
 * Pitch Tuner logic module.
 * Uses Web Audio API and time-domain autocorrelation to detect musical note pitches from microphone input.
 */
export class PitchTuner {
  // Audio & Stream context
  audioCtx = null;
  analyser = null;
  stream = null;
  animationFrameId = null;

  // Svelte 5 Reactive runes states
  isTuning = $state(false);
  frequency = $state(0);
  noteName = $state("");
  noteOctave = $state(0);
  cents = $state(0);
  rms = $state(0); // Signal volume indicator

  // Tuning Constants
  A4 = 440.0;
  NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  constructor() { }

  /**
   * Request microphone permissions and initialize AudioContext Analyser
   */
  async start() {
    if (this.isTuning) return;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = this.audioCtx.createMediaStreamSource(this.stream);
      
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 2048; // Higher FFT size for better resolution at lower pitches
      
      source.connect(this.analyser);
      this.isTuning = true;
      
      // Begin analysis loop
      this.tick();
    } catch (err) {
      console.error("Microphone access failed for pitch tuner:", err);
      this.stop();
      throw err;
    }
  }

  /**
   * Stop analysis, release audio context, release microphone stream
   */
  stop() {
    this.isTuning = false;
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.audioCtx) {
      if (this.audioCtx.state !== "closed") {
        this.audioCtx.close();
      }
      this.audioCtx = null;
    }

    this.analyser = null;
    this.frequency = 0;
    this.noteName = "";
    this.cents = 0;
    this.rms = 0;
  }

  tick() {
    if (!this.isTuning || !this.analyser) return;

    const bufferLength = this.analyser.fftSize;
    const buffer = new Float32Array(bufferLength);
    this.analyser.getFloat32TimeDomainData(buffer);

    // Calculate RMS (volume level) to ignore background hum
    let sumOfSquares = 0;
    for (let i = 0; i < bufferLength; i++) {
      sumOfSquares += buffer[i] * buffer[i];
    }
    this.rms = Math.sqrt(sumOfSquares / bufferLength);

    // Signal threshold (must be loud enough to parse)
    if (this.rms > 0.012) {
      const freq = this.autoCorrelate(buffer, this.audioCtx.sampleRate);
      if (freq !== -1) {
        this.frequency = freq;
        this.updateNoteDetails(freq);
      }
    } else {
      this.frequency = 0;
      this.noteName = "";
      this.cents = 0;
    }

    this.animationFrameId = requestAnimationFrame(() => this.tick());
  }

  /**
   * Time-domain autocorrelation algorithm to find the fundamental frequency
   * @param {Float32Array} buffer - Time domain data
   * @param {number} sampleRate - AudioContext sample rate (Hz)
   * @returns {number} Detected frequency in Hz, or -1 if undetected
   */
  autoCorrelate(buffer, sampleRate) {
    const size = buffer.length;
    
    // 1. Calculate signal power (RMS alternative check)
    let totalPower = 0;
    for (let i = 0; i < size; i++) {
      totalPower += buffer[i] * buffer[i];
    }
    if (totalPower < 0.1) return -1; // Silent buffer

    // 2. Perform center clipping to filter secondary harmonics
    const r1 = 0;
    const r2 = size - 1;
    let thres = 0;
    for (let i = 0; i < size; i++) {
      thres = Math.max(thres, Math.abs(buffer[i]));
    }
    const clipLimit = thres * 0.2;
    const clippedBuffer = new Float32Array(size);
    for (let i = 0; i < size; i++) {
      if (Math.abs(buffer[i]) > clipLimit) {
        clippedBuffer[i] = buffer[i] > 0 ? buffer[i] - clipLimit : buffer[i] + clipLimit;
      }
    }

    // 3. Autocorrelation products
    const maxLag = Math.floor(sampleRate / 50); // min freq ~ 50Hz (e.g. low G)
    const minLag = Math.floor(sampleRate / 1000); // max freq ~ 1000Hz (e.g. high C)
    const r = new Float32Array(maxLag);
    
    for (let lag = minLag; lag < maxLag; lag++) {
      let sum = 0;
      for (let i = 0; i < size - lag; i++) {
        sum += clippedBuffer[i] * clippedBuffer[i + lag];
      }
      r[lag] = sum;
    }

    // 4. Find peak lag
    let bestLag = -1;
    let maxVal = -1;
    
    // Find absolute maximum peak in autocorrelation array
    for (let lag = minLag; lag < maxLag; lag++) {
      if (r[lag] > maxVal) {
        maxVal = r[lag];
        bestLag = lag;
      }
    }

    // Refine peak detection: look for local maximum near the best lag
    let peakLag = bestLag;
    if (bestLag > minLag && bestLag < maxLag - 1) {
      // Parabolic interpolation for sub-sample accuracy
      const alpha = r[bestLag - 1];
      const beta = r[bestLag];
      const gamma = r[bestLag + 1];
      const p = 0.5 * (alpha - gamma) / (alpha - 2 * beta + gamma);
      peakLag = bestLag + p;
    }

    if (peakLag > 0) {
      return sampleRate / peakLag;
    }
    return -1;
  }

  /**
   * Convert frequency to note name, octave, and cents deviation
   * @param {number} frequency - Hz
   */
  updateNoteDetails(frequency) {
    // n = 12 * log2(f / 440) + 69
    const noteNum = 12 * (Math.log(frequency / this.A4) / Math.log(2)) + 69;
    const roundedNoteNum = Math.round(noteNum);
    
    if (roundedNoteNum < 0 || roundedNoteNum > 127) return;

    const midiNoteIndex = roundedNoteNum % 12;
    this.noteName = this.NOTE_NAMES[midiNoteIndex];
    this.noteOctave = Math.floor(roundedNoteNum / 12) - 1;

    // Expected frequency for perfect note: f = 440 * 2^((n-69)/12)
    const expectedFreq = this.A4 * Math.pow(2, (roundedNoteNum - 69) / 12);
    // Cents offset: 1200 * log2(actual / expected)
    this.cents = Math.round(1200 * (Math.log(frequency / expectedFreq) / Math.log(2)));
  }
}
