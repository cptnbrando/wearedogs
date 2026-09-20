/**
 * convert.js
 * Library for client-side image and audio format conversion.
 */
import { encodeMp3, nearestMp3Rate } from "./mp3Pool.js";

/**
 * Resamples an AudioBuffer to a target sample rate.
 * @param {AudioBuffer} buffer
 * @param {number} targetSampleRate
 * @returns {Promise<AudioBuffer>}
 */
export async function resampleAudioBuffer(buffer, targetSampleRate) {
  if (buffer.sampleRate === targetSampleRate) return buffer;
  const offlineCtx = new OfflineAudioContext(
    buffer.numberOfChannels,
    Math.max(1, Math.ceil(buffer.duration * targetSampleRate)),
    targetSampleRate
  );
  const bufferSource = offlineCtx.createBufferSource();
  bufferSource.buffer = buffer;
  bufferSource.connect(offlineCtx.destination);
  bufferSource.start();
  return await offlineCtx.startRendering();
}

/**
 * Encodes an AudioBuffer to a 16-bit PCM WAV Blob.
 * @param {AudioBuffer} buffer 
 * @returns {Blob}
 */
export function bufferToWav(buffer) {
  let numOfChan = buffer.numberOfChannels,
    length = buffer.length * numOfChan * 2 + 44,
    bufferArr = new ArrayBuffer(length),
    view = new DataView(bufferArr),
    channels = [],
    i,
    sample,
    offset = 0,
    pos = 0;

  // write WAV header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // chunk length
  setUint16(1); // sample format (raw)
  setUint16(numOfChan);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * numOfChan); // byte rate
  setUint16(numOfChan * 2); // block align
  setUint16(16); // bits per sample
  setUint32(0x61746164); // "data" - chunk
  setUint32(length - pos - 4); // chunk length

  for (i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < length) {
    for (i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff; // scale to 16-bit signed
      view.setInt16(pos, sample, true); // write 16-bit sample
      pos += 2;
    }
    offset++;
  }

  return new Blob([bufferArr], { type: "audio/wav" });

  function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}

/** Anything above stereo folds down: fronts, plus centre and surrounds at -3 dB. */
export function downmixToStereo(planes) {
  if (planes.length <= 2) return planes;
  const n = planes[0].length;
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  const c = planes[2];
  const sl = planes.length >= 6 ? planes[4] : planes[3];
  const sr = planes.length >= 6 ? planes[5] : planes[3];
  for (let i = 0; i < n; i++) {
    L[i] = (planes[0][i] + 0.707 * c[i] + 0.707 * (sl ? sl[i] : 0)) * 0.5;
    R[i] = (planes[1][i] + 0.707 * c[i] + 0.707 * (sr ? sr[i] : 0)) * 0.5;
  }
  return [L, R];
}

/**
 * Encodes an AudioBuffer to MP3 — in parallel on the worker pool (mp3Pool.js),
 * or on the single-thread encoder where workers aren't available.
 * @param {AudioBuffer} buffer  at an MP3-legal sample rate (see nearestMp3Rate)
 * @param {number} kbps  constant bitrate, e.g. 320
 * @param {(fraction:number)=>void} [onProgress]
 * @returns {Promise<Blob>}
 */
export async function bufferToMp3(buffer, kbps, onProgress) {
  // MP3 exists at a handful of rates, 48 kHz at most (an audio device running
  // at 96 kHz decodes to 96 kHz buffers)
  const rate = nearestMp3Rate(buffer.sampleRate);
  if (rate !== buffer.sampleRate) buffer = await resampleAudioBuffer(buffer, rate);
  const planes = [];
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) planes.push(buffer.getChannelData(ch));
  return encodeMp3(downmixToStereo(planes), buffer.sampleRate, kbps, onProgress);
}

/**
 * Converts an image file to target format, resolution, quality, and compression.
 * @param {string} previewUrl 
 * @param {string} outputFormat - 'jpg' | 'png' | 'webp'
 * @param {number} targetWidth 
 * @param {number} targetHeight 
 * @param {number} quality - 0 to 100
 * @param {number} compression - 0 to 100
 * @returns {Promise<Blob>}
 */
export function convertImage(previewUrl, outputFormat, targetWidth, targetHeight, quality, compression) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth || img.naturalWidth;
      canvas.height = targetHeight || img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (outputFormat === "svg") {
        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
          <image href="${canvas.toDataURL()}" width="${canvas.width}" height="${canvas.height}" />
        </svg>`;
        resolve(new Blob([svgContent], { type: "image/svg+xml" }));
        return;
      }

      // If compression is requested, apply color quantization to reduce size
      const comp = Number(compression) || 0;
      if (comp > 0) {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        // Use quadratic curve for smooth control over step size
        const step = Math.round(1 + Math.pow(comp / 100, 2) * 31);
        if (step > 1) {
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.round(data[i] / step) * step);
            data[i + 1] = Math.min(255, Math.round(data[i + 1] / step) * step);
            data[i + 2] = Math.min(255, Math.round(data[i + 2] / step) * step);
          }
          ctx.putImageData(imgData, 0, 0);
        }
      }

      let mimeType = "image/png";
      if (outputFormat === "jpg") mimeType = "image/jpeg";
      else if (outputFormat === "webp") mimeType = "image/webp";
      else if (outputFormat === "avif") mimeType = "image/avif";

      // Combine quality and compression to determine export quality for lossy formats
      const exportQuality = Math.max(0.01, (quality * (1 - comp / 100)) / 100);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas export failed."));
          }
        },
        mimeType,
        exportQuality
      );
    };
    img.onerror = () => reject(new Error("Failed to load image."));
  });
}

/**
 * Converts audio buffer or wraps original file to targeted format/sample rate.
 * @param {File} file 
 * @param {AudioBuffer} audioBuffer 
 * @param {string} outputFormat - 'mp3' | 'wav' | 'm4a'
 * @param {string|number} audioSampleRate - 'keep' | sample rate number
 * @param {number} kbps - MP3 bitrate (only MP3 has one to choose)
 * @param {(fraction:number)=>void} [onProgress] - real encode progress, 0..1
 * @returns {Promise<Blob>}
 */
export async function convertAudio(file, audioBuffer, outputFormat, audioSampleRate, kbps = 320, onProgress) {
  let bufferToEncode = audioBuffer;
  if (audioBuffer && (outputFormat === "mp3" || outputFormat === "wav")) {
    let targetRate = audioSampleRate === "keep" ? audioBuffer.sampleRate : parseInt(audioSampleRate);
    // MP3 exists at a handful of rates, 48 kHz at most: a 96 kHz source drops to 48
    if (outputFormat === "mp3") targetRate = nearestMp3Rate(targetRate);
    bufferToEncode = await resampleAudioBuffer(audioBuffer, targetRate);
  }

  if (outputFormat === "wav" && bufferToEncode) {
    return bufferToWav(bufferToEncode);
  }

  if (outputFormat === "mp3" && bufferToEncode) {
    return await bufferToMp3(bufferToEncode, Number(kbps) || 320, onProgress);
  }

  let mimeType = "audio/mpeg";
  if (outputFormat === "m4a") mimeType = "audio/mp4";
  else if (outputFormat === "wav") mimeType = "audio/wav";
  else if (outputFormat === "aac") mimeType = "audio/aac";
  else if (outputFormat === "webm") mimeType = "audio/webm";

  // slice() relabels the same bytes without pulling them into memory —
  // file.arrayBuffer() throws NotReadableError on multi-GB inputs.
  return file.slice(0, file.size, mimeType);
}

/**
 * Converts video file by wrapping or simulating conversion.
 * @param {File} file 
 * @param {string} outputFormat - 'mp4' | 'mov' | 'mkv' | 'avi'
 * @returns {Promise<Blob>}
 */
export async function convertVideo(file, outputFormat) {
  let mimeType = "video/mp4";
  if (outputFormat === "mov") mimeType = "video/quicktime";
  else if (outputFormat === "mkv") mimeType = "video/x-matroska";
  else if (outputFormat === "avi") mimeType = "video/x-msvideo";

  // slice() relabels the same bytes without pulling them into memory —
  // file.arrayBuffer() throws NotReadableError on multi-GB inputs.
  return file.slice(0, file.size, mimeType);
}

/**
 * Converts an AudioBuffer into a video Blob (black screen with audio).
 * @param {AudioBuffer} audioBuffer
 * @param {string} outputFormat - 'mp4' | 'mov' | 'mkv' | 'avi'
 * @param {function} [onProgress] - progress callback
 * @returns {Promise<Blob>}
 */
export function convertAudioToVideo(audioBuffer, outputFormat, onProgress) {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const fps = 10;
      const canvasStream = canvas.captureStream(fps);

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      const dest = audioCtx.createMediaStreamDestination();

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(dest);

      const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...dest.stream.getAudioTracks()
      ]);

      let mimeType = "video/webm";
      if (outputFormat === "mp4") {
        if (MediaRecorder.isTypeSupported("video/mp4")) {
          mimeType = "video/mp4";
        } else if (MediaRecorder.isTypeSupported("video/mp4;codecs=avc1,aac")) {
          mimeType = "video/mp4;codecs=avc1,aac";
        }
      } else {
        if (MediaRecorder.isTypeSupported("video/webm")) {
          mimeType = "video/webm";
        }
      }

      const options = { mimeType };
      const mediaRecorder = new MediaRecorder(combinedStream, options);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      let progressInterval;
      const duration = audioBuffer.duration;
      const startTime = Date.now();

      // Periodically redraw black frame to keep the canvas stream alive
      let frameCount = 0;
      const drawInterval = setInterval(() => {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = frameCount % 2 === 0 ? "#000000" : "#000001";
        ctx.fillRect(0, 0, 1, 1);
        frameCount++;
      }, 1000 / fps);

      mediaRecorder.onstop = () => {
        clearInterval(progressInterval);
        clearInterval(drawInterval);
        audioCtx.close();
        
        canvasStream.getTracks().forEach((t) => t.stop());
        dest.stream.getTracks().forEach((t) => t.stop());

        const blob = new Blob(chunks, { type: mimeType });
        resolve(blob);
      };

      mediaRecorder.onerror = (err) => {
        clearInterval(progressInterval);
        clearInterval(drawInterval);
        audioCtx.close();
        canvasStream.getTracks().forEach((t) => t.stop());
        dest.stream.getTracks().forEach((t) => t.stop());
        reject(err);
      };

      mediaRecorder.start();
      source.start(0);

      if (onProgress) {
        progressInterval = setInterval(() => {
          const elapsed = (Date.now() - startTime) / 1000;
          let pct = Math.min(99, Math.round((elapsed / duration) * 100));
          if (isNaN(pct)) pct = 0;
          onProgress(pct);
        }, 200);
      }

      source.onended = () => {
        if (mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
        }
      };

    } catch (err) {
      reject(err);
    }
  });
}


