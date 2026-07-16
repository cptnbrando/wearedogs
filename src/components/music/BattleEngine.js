/**
 * BattleEngine manages microphone input stream Web Audio context analysis,
 * MediaRecorder, duration timers, and canvas visualizer drawing loops.
 *
 * @class
 */
export class BattleEngine {
  /**
   * @constructor
   * @param {Object} options
   * @param {Function} [options.onDurationChange] - Fires every second with current duration
   * @param {Function} [options.onRecordingStop] - Fires when media recorder completes with the audio Blob
   */
  constructor(options = {}) {
    this.onDurationChange = options.onDurationChange || (() => {});
    this.onRecordingStop = options.onRecordingStop || (() => {});

    this.mediaRecorder = null;
    this.audioStream = null;
    this.micAudioCtx = null;
    this.micAnalyser = null;
    this.micSource = null;
    this.recordTimer = null;
    this.animationFrameId = null;
    this.recordingDuration = 0;
  }

  /**
   * Start microphone capture, setup Web Audio Analyser and MediaRecorder.
   *
   * @async
   * @param {HTMLCanvasElement} canvasEl - Canvas for visualization rendering
   * @returns {Promise<boolean>} Resolves to true when recording successfully started
   */
  async startRecording(canvasEl) {
    this.recordingDuration = 0;
    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.micAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.micAnalyser = this.micAudioCtx.createAnalyser();
      this.micAnalyser.fftSize = 64;
      this.micSource = this.micAudioCtx.createMediaStreamSource(this.audioStream);
      this.micSource.connect(this.micAnalyser);

      this.mediaRecorder = new MediaRecorder(this.audioStream);
      const chunks = [];

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(chunks, { type: "audio/webm" });
        this.onRecordingStop(recordedBlob);
      };

      this.mediaRecorder.start();

      this.recordTimer = setInterval(() => {
        this.recordingDuration++;
        this.onDurationChange(this.recordingDuration);
        if (this.recordingDuration >= 60) {
          this.stopRecording();
        }
      }, 1000);

      setTimeout(() => this.startVisualizer(canvasEl), 100);
      return true;
    } catch (e) {
      console.error("Mic access failed in BattleEngine:", e);
      throw e;
    }
  }

  /**
   * Stop the active recording and close audio nodes.
   *
   * @returns {void}
   */
  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }
    if (this.audioStream) {
      this.audioStream.getTracks().forEach((track) => track.stop());
      this.audioStream = null;
    }
    if (this.micAudioCtx) {
      this.micAudioCtx.close();
      this.micAudioCtx = null;
    }
    if (this.recordTimer) {
      clearInterval(this.recordTimer);
      this.recordTimer = null;
    }
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Loops visualizer bars on the HTML canvas.
   *
   * @param {HTMLCanvasElement} canvasEl
   * @returns {void}
   */
  startVisualizer(canvasEl) {
    if (!canvasEl || !this.micAnalyser) return;
    const ctx = canvasEl.getContext("2d");
    const bufferLength = this.micAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!this.mediaRecorder || this.mediaRecorder.state === "inactive") return;
      this.animationFrameId = requestAnimationFrame(draw);
      this.micAnalyser.getByteFrequencyData(dataArray);

      const width = canvasEl.width;
      const height = canvasEl.height;
      ctx.clearRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 1.5;

        // Gradient color: magenta to cyan
        const percent = i / bufferLength;
        const r = Math.floor(255 - percent * 150);
        const g = Math.floor(percent * 200);
        const b = 255;

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);

        x += barWidth;
      }
    };
    draw();
  }
}
