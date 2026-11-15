/**
 * converterHold.js
 * Copies freshly picked files into memory before anything else awaits.
 * Mobile browsers hand over a borrowed handle (Android content:// URIs from
 * Drive, Gmail, Downloads...) that can vanish seconds later, so a read after
 * a lazy engine import fails with NotFoundError / NotReadableError.
 */
// Bigger files stay on disk: video and audio stream from there on purpose
const HOLD_MAX_FILE_BYTES = 64 * 1024 * 1024;
const HOLD_MAX_TOTAL_BYTES = 256 * 1024 * 1024;

/**
 * In-memory copies of the files, up to the size budget. A file that cannot be
 * read, or does not fit the budget, comes back as picked, so the normal error
 * path still reports it.
 * @param {File[]} files
 * @returns {Promise<File[]>}
 */
export async function holdFiles(files) {
  let budget = HOLD_MAX_TOTAL_BYTES;
  const held = [];
  for (const f of files) {
    if (f.size > HOLD_MAX_FILE_BYTES || f.size > budget) {
      held.push(f);
      continue;
    }
    try {
      held.push(new File([await f.arrayBuffer()], f.name, { type: f.type, lastModified: f.lastModified }));
      budget -= f.size;
    } catch {
      held.push(f);
    }
  }
  return held;
}
