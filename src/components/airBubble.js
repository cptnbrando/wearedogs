/**
 * Where Air Train's floating bubble sits (components/AirBubble.svelte): on
 * the left or right edge, some way down the screen. Kept on this device, so
 * it comes back where it was left.
 */
const STORAGE_KEY = "airtrain_bubble_v1";
const SIDES = ["left", "right"];
/** Space between the bubble and the edge of the screen. */
const EDGE_GAP_PX = 12;
/** Where it starts: the right edge, a little below the middle. */
const DEFAULT_PLACE = { side: "right", rise: 0.62 };

/** @typedef {{ side: "left" | "right", rise: number }} BubblePlace rise: 0 at the top, 1 at the bottom */

/** @returns {BubblePlace} */
export function loadPlace() {
  try {
    const kept = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (kept && SIDES.indexOf(kept.side) !== -1 && kept.rise >= 0 && kept.rise <= 1) return kept;
  } catch (e) {
    // Nothing kept, or storage is blocked: the bubble starts where it always does
  }
  return DEFAULT_PLACE;
}

/** @param {BubblePlace} place */
export function savePlace(place) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(place));
  } catch (e) {
    // Not kept: it goes back to its usual place next time
  }
}

/**
 * The screen point of a place, for a bubble this big on a screen this big.
 * @param {BubblePlace} place @param {number} size @param {number} width @param {number} height
 * @returns {{ x: number, y: number }}
 */
export function placeToPoint(place, size, width, height) {
  const x = place.side === "left" ? EDGE_GAP_PX : width - size - EDGE_GAP_PX;
  const y = Math.min(Math.max(place.rise * (height - size), EDGE_GAP_PX), height - size - EDGE_GAP_PX);
  return { x, y };
}

/**
 * The place a bubble let go of here snaps to: the nearer edge, at the same height.
 * @param {number} x @param {number} y @param {number} size @param {number} width @param {number} height
 * @returns {BubblePlace}
 */
export function pointToPlace(x, y, size, width, height) {
  const side = x + size / 2 < width / 2 ? "left" : "right";
  const rise = Math.min(Math.max(y / Math.max(height - size, 1), 0), 1);
  return { side, rise };
}
