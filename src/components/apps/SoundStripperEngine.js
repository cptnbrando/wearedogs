/**
 * SoundStripperEngine.js
 * Browser-side DSP library for audio alignment, phase cancellation, 
 * spectral subtraction, high-pass filtering, and WAV file export.
 */

/**
 * Radix-2 Cooley-Tukey Decimation-in-Time FFT
 * @param {Float32Array} re Real part array (modified in place)
 * @param {Float32Array} im Imaginary part array (modified in place)
 */
export function fft(re, im) {
  const n = re.length;
  if ((n & (n - 1)) !== 0) throw new Error("FFT size must be a power of 2");

  // Bit reversal permutation
  let j = 0;
  for (let i = 0; i < n - 1; i++) {
    if (i < j) {
      let temp = re[i]; re[i] = re[j]; re[j] = temp;
      temp = im[i]; im[i] = im[j]; im[j] = temp;
    }
    let m = n >> 1;
    while (m >= 1 && j >= m) {
      j -= m;
      m >>= 1;
    }
    j += m;
  }

  // Decimation-in-time merges
  for (let size = 2; size <= n; size <<= 1) {
    const half = size >> 1;
    const theta = -2 * Math.PI / size;
    const wReal = Math.cos(theta);
    const wImag = Math.sin(theta);

    for (let i = 0; i < n; i += size) {
      let wr = 1.0;
      let wi = 0.0;
      for (let k = 0; k < half; k++) {
        const oddIdx = i + k + half;
        const evenIdx = i + k;

        // Complex multiply: t = w * odd
        const tr = re[oddIdx] * wr - im[oddIdx] * wi;
        const ti = re[oddIdx] * wi + im[oddIdx] * wr;

        re[oddIdx] = re[evenIdx] - tr;
        im[oddIdx] = im[evenIdx] - ti;
        re[evenIdx] += tr;
        im[evenIdx] += ti;

        // Update twiddle factor
        const nextWr = wr * wReal - wi * wImag;
        wi = wr * wImag + wi * wReal;
        wr = nextWr;
      }
    }
  }
}

/**
 * Radix-2 Cooley-Tukey IFFT
 * @param {Float32Array} re Real part array (modified in place)
 * @param {Float32Array} im Imaginary part array (modified in place)
 */
export function ifft(re, im) {
  const n = re.length;
  // Conjugate input
  for (let i = 0; i < n; i++) {
    im[i] = -im[i];
  }
  // Run forward FFT
  fft(re, im);
  // Conjugate and divide by N
  for (let i = 0; i < n; i++) {
    re[i] /= n;
    im[i] = -im[i] / n;
  }
}

/**
 * Downsamples channel data by averaging blocks of samples
 * @param {Float32Array} data Input sample array
 * @param {number} factor Decimation factor
 * @returns {Float32Array} Downsampled sample array
 */
function downsample(data, factor) {
  const len = Math.floor(data.length / factor);
  const result = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    let sum = 0;
    const start = i * factor;
    for (let j = 0; j < factor; j++) {
      sum += data[start + j];
    }
    result[i] = sum / factor;
  }
  return result;
}

export class SoundStripperEngine {
  /**
   * @param {AudioBuffer} mixBuffer Audio buffer with vocal + bleed
   * @param {AudioBuffer} instBuffer Audio buffer with clean backing track
   */
  constructor(mixBuffer, instBuffer) {
    this.mixBuffer = mixBuffer;
    this.instBuffer = instBuffer;
    this.cancelFlag = false;
  }

  /**
   * Coarse-to-fine cross correlation alignment
   * @returns {Promise<number>} Delay offset in samples (positive or negative)
   */
  async autoAlign() {
    const sampleRate = this.mixBuffer.sampleRate;
    const mixData = this.mixBuffer.getChannelData(0);
    const instData = this.instBuffer.getChannelData(0);

    // Select start and length of 20 seconds, adapting if files are shorter
    const startSample = Math.floor(mixData.length * 0.1);
    const alignDuration = Math.min(20 * sampleRate, mixData.length * 0.8);

    // Coarse alignment (downsampled search)
    const factor = 44; // Downsample from 44.1kHz to ~1000Hz
    const dsMix = downsample(mixData, factor);
    const dsInst = downsample(instData, factor);

    const dsStart = Math.floor(startSample / factor);
    const dsLen = Math.floor(alignDuration / factor);
    const maxLag = Math.floor(2 * 1000); // +/- 2 seconds search range (2000 lags at ~1000Hz)

    let maxCorr = -Infinity;
    let coarseLag = 0;

    for (let lag = -maxLag; lag <= maxLag; lag++) {
      let sum = 0;
      for (let i = 0; i < dsLen; i++) {
        const mixIdx = dsStart + i;
        const instIdx = dsStart + i - lag;
        if (mixIdx >= 0 && mixIdx < dsMix.length && instIdx >= 0 && instIdx < dsInst.length) {
          sum += dsMix[mixIdx] * dsInst[instIdx];
        }
      }
      const absSum = Math.abs(sum);
      if (absSum > maxCorr) {
        maxCorr = absSum;
        coarseLag = lag;
      }
    }

    // Fine alignment (sample-level search around coarse estimate)
    const coarseOffsetSamples = coarseLag * factor;
    const fineStart = startSample;
    const fineLen = Math.min(5 * sampleRate, mixData.length - fineStart - 1000);
    const searchRadius = 66; // +/- 1.5 milliseconds range at 44.1kHz

    let maxCorrFine = -Infinity;
    let bestSampleOffset = coarseOffsetSamples;

    for (let lag = coarseOffsetSamples - searchRadius; lag <= coarseOffsetSamples + searchRadius; lag++) {
      let sum = 0;
      for (let i = 0; i < fineLen; i++) {
        const mixIdx = fineStart + i;
        const instIdx = fineStart + i - lag;
        if (mixIdx >= 0 && mixIdx < mixData.length && instIdx >= 0 && instIdx < instData.length) {
          sum += mixData[mixIdx] * instData[instIdx];
        }
      }
      const absSum = Math.abs(sum);
      if (absSum > maxCorrFine) {
        maxCorrFine = absSum;
        bestSampleOffset = lag;
      }
    }

    return bestSampleOffset;
  }

  /**
   * Cancel bleed audio and generate output
   * @param {number} delaySamples Alignment delay offset in samples
   * @param {number} bleedVolume Subtraction scaling factor
   * @param {string} mode Processing mode ("spectral" or "phase")
   * @param {number} hpfFrequency High pass filter cutoff (0 = Bypass)
   * @param {Function} progressCallback Progress feedback callback
   * @returns {Promise<AudioBuffer>} Cleaned audio output buffer
   */
  async process(delaySamples, bleedVolume, mode, hpfFrequency, progressCallback) {
    this.cancelFlag = false;
    const numChannels = this.mixBuffer.numberOfChannels;
    const sampleRate = this.mixBuffer.sampleRate;
    const length = this.mixBuffer.length;

    // Create AudioContext buffer for output
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContextClass();
    const outputBuffer = ctx.createBuffer(numChannels, length, sampleRate);

    // Process each channel
    for (let c = 0; c < numChannels; c++) {
      const mixData = this.mixBuffer.getChannelData(c);

      // Use channel 0 instrumental if instBuffer has fewer channels
      const instChannelIdx = c < this.instBuffer.numberOfChannels ? c : 0;
      const instData = this.instBuffer.getChannelData(instChannelIdx);

      const outputData = outputBuffer.getChannelData(c);

      if (mode === "phase") {
        await this.processPhaseMode(mixData, instData, outputData, delaySamples, bleedVolume, progressCallback, c, numChannels);
      } else {
        await this.processSpectralMode(mixData, instData, outputData, delaySamples, bleedVolume, progressCallback, c, numChannels);
      }

      if (this.cancelFlag) break;

      // Apply High-Pass Filter if selected
      if (hpfFrequency > 0) {
        this.applyHighPassFilter(outputData, hpfFrequency, sampleRate);
      }
    }

    ctx.close();
    return outputBuffer;
  }

  /**
   * Abort current running task
   */
  cancel() {
    this.cancelFlag = true;
  }

  /**
   * Time-domain cancellation loop running in chunks
   */
  processPhaseMode(mixData, instData, outputData, delaySamples, bleedVolume, progressCallback, chanIdx, totalChan) {
    return new Promise((resolve) => {
      const length = mixData.length;
      const chunkSize = 262144; // Process in blocks of ~256k samples (approx 6 seconds)
      let offset = 0;

      const processChunk = () => {
        if (this.cancelFlag) {
          resolve();
          return;
        }

        const end = Math.min(offset + chunkSize, length);
        const intDelay = Math.floor(delaySamples);
        const fracDelay = delaySamples - intDelay;

        for (let i = offset; i < end; i++) {
          const mixVal = mixData[i];

          // Linear interpolation for sub-sample delay offset alignment
          const instIdx1 = i - intDelay;
          const instIdx2 = instIdx1 - 1;

          let instVal = 0;
          const val1 = (instIdx1 >= 0 && instIdx1 < instData.length) ? instData[instIdx1] : 0;
          const val2 = (instIdx2 >= 0 && instIdx2 < instData.length) ? instData[instIdx2] : 0;
          instVal = val1 * (1.0 - fracDelay) + val2 * fracDelay;

          outputData[i] = mixVal - bleedVolume * instVal;
        }

        offset = end;

        // Report progress
        const chanProgress = offset / length;
        const totalProgress = (chanIdx + chanProgress) / totalChan;
        progressCallback(Math.floor(totalProgress * 100));

        if (offset < length) {
          // Yield to UI thread
          setTimeout(processChunk, 0);
        } else {
          resolve();
        }
      };

      processChunk();
    });
  }

  /**
   * STFT-based Spectral Subtraction running in chunks
   */
  processSpectralMode(mixData, instData, outputData, delaySamples, bleedVolume, progressCallback, chanIdx, totalChan) {
    return new Promise((resolve) => {
      const length = mixData.length;
      const frameSize = 2048;
      const hopSize = 512; // 75% overlap

      // Hann analysis & synthesis window
      const win = new Float32Array(frameSize);
      for (let i = 0; i < frameSize; i++) {
        win[i] = 0.5 * (1.0 - Math.cos((2 * Math.PI * i) / (frameSize - 1)));
      }

      // Buffer accumulation for overlap-add
      const overlapBuffer = new Float32Array(length + frameSize);

      // Frame states
      const reMix = new Float32Array(frameSize);
      const imMix = new Float32Array(frameSize);
      const reInst = new Float32Array(frameSize);
      const imInst = new Float32Array(frameSize);

      const numFrames = Math.floor((length - frameSize) / hopSize) + 1;
      const chunkSize = 200; // Process 200 frames per event loop yield
      let frameIdx = 0;

      const intDelay = Math.floor(delaySamples);
      const fracDelay = delaySamples - intDelay;

      const processChunk = () => {
        if (this.cancelFlag) {
          resolve();
          return;
        }

        const endFrame = Math.min(frameIdx + chunkSize, numFrames);

        for (let f = frameIdx; f < endFrame; f++) {
          const mixStart = f * hopSize;

          // 1. Prepare Mix Frame (Apply Hann analysis window)
          for (let i = 0; i < frameSize; i++) {
            reMix[i] = mixData[mixStart + i] * win[i];
            imMix[i] = 0.0;
          }

          // 2. Prepare Aligned Instrumental Frame (Apply Hann analysis window)
          for (let i = 0; i < frameSize; i++) {
            const instIdx1 = mixStart + i - intDelay;
            const instIdx2 = instIdx1 - 1;
            const val1 = (instIdx1 >= 0 && instIdx1 < instData.length) ? instData[instIdx1] : 0;
            const val2 = (instIdx2 >= 0 && instIdx2 < instData.length) ? instData[instIdx2] : 0;
            const instVal = val1 * (1.0 - fracDelay) + val2 * fracDelay;

            reInst[i] = instVal * win[i];
            imInst[i] = 0.0;
          }

          // 3. Compute Forward FFT
          fft(reMix, imMix);
          fft(reInst, imInst);

          // 4. Spectral Magnitude Subtraction
          for (let i = 0; i < frameSize; i++) {
            const magMix = Math.sqrt(reMix[i] * reMix[i] + imMix[i] * imMix[i]);
            const magInst = Math.sqrt(reInst[i] * reInst[i] + imInst[i] * imInst[i]);

            // Subtract instrumental magnitude with bleed volume multiplier
            const subMag = magMix - bleedVolume * magInst;

            // Apply spectral floor (0.05 * magMix) to suppress annoying watery musical noise artifacts
            const magOut = subMag > 0 ? subMag : 0.05 * magMix;

            // Preserve phase of the mix by multiplying original coefficients by magnitude ratio
            const scale = magOut / (magMix + 1e-10);
            reMix[i] *= scale;
            imMix[i] *= scale;
          }

          // 5. Compute IFFT
          ifft(reMix, imMix);

          // 6. Apply synthesis window & overlap-add to output accumulator
          for (let i = 0; i < frameSize; i++) {
            overlapBuffer[mixStart + i] += reMix[i] * win[i];
          }
        }

        frameIdx = endFrame;

        // Progress update
        const chanProgress = frameIdx / numFrames;
        const totalProgress = (chanIdx + chanProgress) / totalChan;
        progressCallback(Math.floor(totalProgress * 100));

        if (frameIdx < numFrames) {
          setTimeout(processChunk, 0);
        } else {
          // Overlap-add final normalization
          // Since window overlap-add sum is roughly 0.75 for Hann (hop = frame / 4), we normalize the gain
          // Standard COLA constant factor = 0.75 * 2.0 = 1.5 when Hann analysis + Hann synthesis window is applied
          const windowScalingFactor = 1.5;
          for (let i = 0; i < length; i++) {
            outputData[i] = overlapBuffer[i] / windowScalingFactor;
          }
          resolve();
        }
      };

      processChunk();
    });
  }

  /**
   * Applies 1st-order High-Pass Filter (IIR) in-place to remove low frequency bleed/mud
   * @param {Float32Array} data Float32Array channel data
   * @param {number} cutoff Cutoff frequency in Hz
   * @param {number} sampleRate Sample rate in Hz
   */
  applyHighPassFilter(data, cutoff, sampleRate) {
    const dt = 1.0 / sampleRate;
    const rc = 1.0 / (2 * Math.PI * cutoff);
    const alpha = rc / (rc + dt);

    let prevInput = data[0];
    let prevOutput = data[0];

    for (let i = 1; i < data.length; i++) {
      const input = data[i];
      const output = alpha * (prevOutput + input - prevInput);
      prevInput = input;
      prevOutput = output;
      data[i] = output;
    }
  }

  /**
   * Exports an AudioBuffer as a 16-bit stereo/mono WAV file blob
   * @param {AudioBuffer} buffer Processed AudioBuffer
   * @returns {Blob} WAV file data Blob
   */
  static exportWav(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const bitDepth = 16;
    const format = 1; // Uncompressed LPCM

    let interleaved;
    if (numOfChan === 2) {
      const left = buffer.getChannelData(0);
      const right = buffer.getChannelData(1);

      // Interleave stereo channels: L R L R ...
      interleaved = new Float32Array(left.length + right.length);
      let idx = 0;
      for (let i = 0; i < left.length; i++) {
        interleaved[idx++] = left[i];
        interleaved[idx++] = right[i];
      }
    } else {
      interleaved = buffer.getChannelData(0);
    }

    const bufferLen = interleaved.length * 2; // 2 bytes per sample (16-bit)
    const arrayBuffer = new ArrayBuffer(44 + bufferLen);
    const view = new DataView(arrayBuffer);

    // 1. "RIFF" Header
    view.setUint8(0, 0x52); // R
    view.setUint8(1, 0x49); // I
    view.setUint8(2, 0x46); // F
    view.setUint8(3, 0x46); // F
    view.setUint32(4, 36 + bufferLen, true);

    // 2. "WAVE" format identifier
    view.setUint8(8, 0x57);  // W
    view.setUint8(9, 0x41);  // A
    view.setUint8(10, 0x56); // V
    view.setUint8(11, 0x45); // E

    // 3. "fmt " sub-chunk header
    view.setUint8(12, 0x66); // f
    view.setUint8(13, 0x6d); // m
    view.setUint8(14, 0x74); // t
    view.setUint8(15, 0x20); // (space)
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numOfChan, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numOfChan * (bitDepth / 8), true); // Byte rate
    view.setUint16(32, numOfChan * (bitDepth / 8), true);              // Block align
    view.setUint16(34, bitDepth, true);                                // Bits per sample

    // 4. "data" sub-chunk header
    view.setUint8(36, 0x64); // d
    view.setUint8(37, 0x61); // a
    view.setUint8(38, 0x74); // t
    view.setUint8(39, 0x61); // a
    view.setUint32(40, bufferLen, true);

    // 5. Write 16-bit LPCM samples
    let offset = 44;
    for (let i = 0; i < interleaved.length; i++) {
      // Clamp float sample to [-1.0, 1.0]
      let s = Math.max(-1.0, Math.min(1.0, interleaved[i]));
      // Convert to 16-bit signed integer
      const intVal = s < 0 ? s * 0x8000 : s * 0x7FFF;
      view.setInt16(offset, intVal, true);
      offset += 2;
    }

    return new Blob([arrayBuffer], { type: "audio/wav" });
  }
}
