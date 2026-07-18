/**
 * zip.js
 * In-memory lightweight ZIP file generator for compressing/packaging files.
 * Uses STORE compression (method 0) which is perfect for already-compressed WebM media streams.
 */

/**
 * Calculate CRC32 of a Uint8Array.
 * @param {Uint8Array} data
 * @returns {number}
 */
export function crc32(data) {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

/**
 * Package a list of files into a ZIP archive Blob.
 * @param {Array<{ name: string, data: Uint8Array }>} files
 * @returns {Blob}
 */
export function createZip(files) {
  let offset = 0;
  const localHeaders = [];
  const centralHeaders = [];
  const textEncoder = new TextEncoder();

  for (const file of files) {
    const nameBytes = textEncoder.encode(file.name);
    const crc = crc32(file.data);
    const size = file.data.length;

    // Local Header
    const lh = new Uint8Array(30 + nameBytes.length + file.data.length);
    const view = new DataView(lh.buffer);

    view.setUint32(0, 0x04034b50, true); // Local file header signature
    view.setUint16(4, 10, true);         // Version needed to extract
    view.setUint16(6, 0, true);          // General purpose bit flag
    view.setUint16(8, 0, true);          // Compression method (0 = store)
    view.setUint16(10, 0, true);         // Last mod file time
    view.setUint16(12, 0, true);         // Last mod file date
    view.setUint32(14, crc, true);       // CRC-32
    view.setUint32(18, size, true);      // Compressed size
    view.setUint32(22, size, true);      // Uncompressed size
    view.setUint16(26, nameBytes.length, true); // File name length
    view.setUint16(28, 0, true);         // Extra field length
    lh.set(nameBytes, 30);
    lh.set(file.data, 30 + nameBytes.length);

    localHeaders.push(lh);

    // Central Directory Header
    const ch = new Uint8Array(46 + nameBytes.length);
    const chView = new DataView(ch.buffer);

    chView.setUint32(0, 0x02014b50, true); // Central directory file header signature
    chView.setUint16(4, 10, true);         // Version made by
    chView.setUint16(6, 10, true);         // Version needed to extract
    chView.setUint16(8, 0, true);          // General purpose bit flag
    chView.setUint16(10, 0, true);         // Compression method (0 = store)
    chView.setUint16(12, 0, true);         // Last mod file time
    chView.setUint16(14, 0, true);         // Last mod file date
    chView.setUint32(16, crc, true);       // CRC-32
    chView.setUint32(20, size, true);      // Compressed size
    chView.setUint32(24, size, true);      // Uncompressed size
    chView.setUint16(28, nameBytes.length, true); // File name length
    chView.setUint16(30, 0, true);         // Extra field length
    chView.setUint16(32, 0, true);         // File comment length
    chView.setUint16(34, 0, true);         // Disk number start
    chView.setUint16(36, 0, true);         // Internal file attributes
    chView.setUint32(38, 0, true);         // External file attributes
    chView.setUint32(42, offset, true);     // Relative offset of local header
    ch.set(nameBytes, 46);

    centralHeaders.push(ch);

    offset += lh.length;
  }

  // Calculate central directory size
  let cdSize = 0;
  for (const ch of centralHeaders) {
    cdSize += ch.length;
  }

  // End of Central Directory (EOCD)
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);
  eocdView.setUint32(0, 0x06054b50, true); // End of central directory signature
  eocdView.setUint16(4, 0, true);          // Number of this disk
  eocdView.setUint16(6, 0, true);          // Disk where central directory starts
  eocdView.setUint16(8, files.length, true); // Number of central directory records on this disk
  eocdView.setUint16(10, files.length, true); // Total number of central directory records
  eocdView.setUint32(12, cdSize, true);     // Size of central directory
  eocdView.setUint32(16, offset, true);     // Offset of start of central directory, relative to start of archive
  eocdView.setUint16(20, 0, true);          // Comment length

  const blobs = [...localHeaders, ...centralHeaders, eocd];
  return new Blob(blobs, { type: "application/zip" });
}
