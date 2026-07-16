/**
 * Metronome controller using Web Audio API for precise click timing scheduling.
 * Integrates swing timing, subdivisions, synthesised sound types, and device vibration.
 */
export class Metronome {
  // Config & Audio State
  audioCtx = null;
  isPlaying = $state(false);
  bpm = $state(120);
  timeSignature = $state(4); // Beats per measure (e.g. 4/4)
  subdivision = $state(1); // 1 = quarter, 2 = eighth, 4 = sixteenth, 3 = triplet
  soundType = $state("woodblock"); // 'woodblock' | 'cowbell' | 'electronic' | 'tick'
  vibrate = $state(false);
  swing = $state(0); // 0 (none) to 100 (maximum swing)

  // Scheduling variables
  nextNoteTime = 0.0;
  beatCount = 0; // 0 to (timeSignature * subdivision - 1)
  timerId = null;
  lookahead = 25.0; // How frequently to call scheduling function (in ms)
  scheduleAheadTime = 0.1; // How far ahead to schedule audio (in sec)
  
  // Callback for UI flashes
  onBeatCallback = null;

  constructor() {
    // Left empty. Initialization occurs upon start.
  }

  /**
   * Initialize Web Audio context
   */
  initAudio() {
    if (this.audioCtx) return;
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  /**
   * Start or stop the metronome loop
   */
  async toggle() {
    this.initAudio();
    if (this.audioCtx.state === "suspended") {
      await this.audioCtx.resume();
    }

    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  start() {
    this.isPlaying = true;
    this.beatCount = 0;
    this.nextNoteTime = this.audioCtx.currentTime + 0.05;
    
    // Start lookahead loop
    this.runScheduler();
  }

  stop() {
    this.isPlaying = false;
    clearTimeout(this.timerId);
  }

  runScheduler() {
    if (!this.isPlaying) return;

    while (this.nextNoteTime < this.audioCtx.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.beatCount, this.nextNoteTime);
      this.advanceNote();
    }

    this.timerId = setTimeout(() => this.runScheduler(), this.lookahead);
  }

  /**
   * Advance to the next beat/subdivision, accounting for swing
   */
  advanceNote() {
    const secondsPerBeat = 60.0 / this.bpm;
    // Base step is the duration of a single subdivision note
    const baseStep = secondsPerBeat / this.subdivision;

    // Apply swing to even-numbered subdivisions (0-indexed: 1, 3, 5, etc.)
    let currentStep = baseStep;
    if (this.subdivision > 1) {
      const isEvenSubdivision = this.beatCount % 2 === 1;
      const swingFraction = (this.swing / 100) * (baseStep * 0.33); // max swing delays beat by 1/3
      
      if (isEvenSubdivision) {
        currentStep = baseStep + swingFraction;
      } else {
        currentStep = baseStep - swingFraction;
      }
    }

    this.nextNoteTime += currentStep;
    
    // Cycle beat count
    const totalSubdivisions = this.timeSignature * this.subdivision;
    this.beatCount = (this.beatCount + 1) % totalSubdivisions;
  }

  /**
   * Schedule synthesised audio click at the exact Web Audio time
   * @param {number} beat - Current subdivision index
   * @param {number} time - Absolute audio timeline execution time
   */
  scheduleNote(beat, time) {
    const isPrimaryBeat = beat % this.subdivision === 0;
    const isDownbeat = beat === 0;

    // Trigger UI visual flashes via callback
    if (this.onBeatCallback) {
      // Calculate delay in ms from current time to schedule time
      const delayMs = Math.max(0, (time - this.audioCtx.currentTime) * 1000);
      setTimeout(() => {
        if (this.isPlaying && this.onBeatCallback) {
          this.onBeatCallback({
            isDownbeat,
            isPrimaryBeat,
            beatIndex: Math.floor(beat / this.subdivision) + 1,
            subIndex: (beat % this.subdivision) + 1
          });
        }
      }, delayMs);
    }

    // Handle tactile vibration if requested and supported
    if (this.vibrate && typeof navigator !== "undefined" && navigator.vibrate) {
      const delayMs = Math.max(0, (time - this.audioCtx.currentTime) * 1000);
      setTimeout(() => {
        if (this.isPlaying && this.vibrate) {
          navigator.vibrate(isDownbeat ? 60 : isPrimaryBeat ? 35 : 15);
        }
      }, delayMs);
    }

    // Play click sound if not in vibration-only silent mode
    this.playClickOscillator(time, isDownbeat, isPrimaryBeat);
  }

  /**
   * Synthesize click sounds using AudioContext nodes
   */
  playClickOscillator(time, isDownbeat, isPrimaryBeat) {
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    // Audio click parameters
    let frequency = 440;
    let duration = 0.05;
    let volume = 0.8;

    if (this.soundType === "electronic") {
      frequency = isDownbeat ? 1000 : isPrimaryBeat ? 750 : 500;
      osc.type = "sine";
      gainNode.gain.setValueAtTime(volume, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);
    } 
    else if (this.soundType === "woodblock") {
      // High pitch sine, very fast pitch envelope
      frequency = isDownbeat ? 1500 : isPrimaryBeat ? 1200 : 900;
      osc.type = "sine";
      
      // Pitch slide to mimic woodblock pop
      osc.frequency.setValueAtTime(frequency * 1.5, time);
      osc.frequency.exponentialRampToValueAtTime(frequency, time + 0.008);
      
      gainNode.gain.setValueAtTime(volume, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
      duration = 0.03;
    } 
    else if (this.soundType === "cowbell") {
      // Cowbell is a blend of frequencies: 800Hz and 540Hz
      frequency = isDownbeat ? 880 : isPrimaryBeat ? 700 : 550;
      osc.type = "triangle";
      
      gainNode.gain.setValueAtTime(volume * 0.7, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
      duration = 0.12;
    } 
    else if (this.soundType === "tick") {
      // Mechanical tick using a noise click or highpass square wave
      frequency = isDownbeat ? 6000 : isPrimaryBeat ? 4500 : 3000;
      osc.type = "square";
      
      gainNode.gain.setValueAtTime(volume * 0.4, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.015);
      duration = 0.015;
    }

    osc.frequency.setValueAtTime(frequency, time);
    osc.start(time);
    osc.stop(time + duration);
  }

  setBpm(newBpm) {
    this.bpm = Math.min(Math.max(newBpm, 30), 300);
  }
}
