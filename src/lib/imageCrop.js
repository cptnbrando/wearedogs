/**
 * imageCrop.js
 * Centre-crop presets for the Catalytic Converter's image outputs.
 * A crop is applied before resizing: the kept rectangle becomes the picture.
 */

export const NO_CROP = "none";

/** Aspect presets, in the order the picker shows them. ratio = width / height. */
export const CROP_PRESETS = [
  { id: NO_CROP, label: "None", ratio: 0 },
  { id: "1:1", label: "1:1", ratio: 1 },
  { id: "4:3", label: "4:3", ratio: 4 / 3 },
  { id: "3:4", label: "3:4", ratio: 3 / 4 },
  { id: "16:9", label: "16:9", ratio: 16 / 9 },
  { id: "9:16", label: "9:16", ratio: 9 / 16 },
];

const FULL = 100;

/**
 * Inline size for a thumbnail inside a square box so it shows exactly the
 * kept picture: the crop's shape (or the whole picture's, with no crop),
 * filled with object-fit: cover, which centres just like the crop does.
 * @param {number} width - picture width
 * @param {number} height - picture height
 * @param {string} cropId
 * @returns {string} CSS for the <img>, "" when the size is unknown
 */
export function thumbnailFit(width, height, cropId) {
  const preset = CROP_PRESETS.find((p) => p.id === cropId);
  const ratio = preset && preset.ratio ? preset.ratio : width && height ? width / height : 0;
  if (!ratio) return "";
  const w = ratio >= 1 ? FULL : FULL * ratio;
  const h = ratio >= 1 ? FULL / ratio : FULL;
  return `width:${w}%;height:${h}%;object-fit:cover`;
}

/**
 * The centred rectangle of the given aspect that fits a w×h picture, or null
 * when nothing is cropped (no preset, unknown size, or already that shape).
 * @param {number} width
 * @param {number} height
 * @param {string} cropId - one of CROP_PRESETS ids
 * @returns {{ x: number, y: number, width: number, height: number } | null}
 */
export function cropRect(width, height, cropId) {
  const preset = CROP_PRESETS.find((p) => p.id === cropId);
  if (!preset || !preset.ratio || !width || !height) return null;
  const cropW = width / height > preset.ratio ? Math.round(height * preset.ratio) : width;
  const cropH = width / height > preset.ratio ? height : Math.round(width / preset.ratio);
  if (cropW === width && cropH === height) return null;
  return {
    x: Math.round((width - cropW) / 2),
    y: Math.round((height - cropH) / 2),
    width: cropW,
    height: cropH,
  };
}
