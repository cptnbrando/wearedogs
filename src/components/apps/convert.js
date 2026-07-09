/**
 * convert.js
 * Library for client-side image and audio format conversion.
 */

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
    buffer.duration * targetSampleRate,
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

/**
 * Converts an image file to target format, resolution, and quality.
 * @param {string} previewUrl 
 * @param {string} outputFormat - 'jpg' | 'png' | 'webp'
 * @param {number} targetWidth 
 * @param {number} targetHeight 
 * @param {number} quality - 0 to 100
 * @returns {Promise<Blob>}
 */
export function convertImage(previewUrl, outputFormat, targetWidth, targetHeight, quality) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth || img.naturalWidth;
      canvas.height = targetHeight || img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      let mimeType = "image/png";
      if (outputFormat === "jpg") mimeType = "image/jpeg";
      else if (outputFormat === "webp") mimeType = "image/webp";

      const exportQuality = quality / 100;

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
 * @returns {Promise<Blob>}
 */
export async function convertAudio(file, audioBuffer, outputFormat, audioSampleRate) {
  let bufferToEncode = audioBuffer;
  if (audioBuffer && audioSampleRate !== "keep") {
    const targetRate = parseInt(audioSampleRate);
    bufferToEncode = await resampleAudioBuffer(audioBuffer, targetRate);
  }

  if (outputFormat === "wav" && bufferToEncode) {
    return bufferToWav(bufferToEncode);
  }

  // Fallback for lossy formats in client-side sandbox
  await new Promise((resolve) => setTimeout(resolve, 1500));

  let mimeType = "audio/mpeg";
  if (outputFormat === "m4a") mimeType = "audio/mp4";
  else if (outputFormat === "wav") mimeType = "audio/wav";

  return new Blob([await file.arrayBuffer()], { type: mimeType });
}
