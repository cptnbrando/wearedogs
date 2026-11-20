// Gestures for the landing's second page (DogsMain.svelte), a two-sided card: scrolling down past the
// bottom of the site flips the card sideways, scrolling up always goes back to the DOGS letters.
// Wheel, touch and PageDown/PageUp all land on the same two callbacks. The side the visitor was on is kept
// for the tab's session, so a reload or a trip up to the letters comes back to the same side.
//
// What makes it dependable:
//   one gesture is one turn: a wheel or trackpad gesture (and its inertia) turns the card once, never twice;
//   a fresh push during the inertia of the last one still counts, so a quick second swipe isn't swallowed;
//   gestures made while the card is still turning are kept and play one after another, so every scroll counts;
//   the scroll that brought the visitor down here can't turn the card when it lands.

export const SIDE_APPS = 0;
export const SIDE_DOGS = 1;

const STORAGE_KEY = "dogs-card-side";
const WHEEL_GAP_MS = 180;      // Quiet time that ends one wheel or trackpad gesture (and its inertia)
const WHEEL_MIN_DELTA = 4;     // Ignores trackpad jitter (px)
const LINE_PX = 16;            // Wheel deltas given in lines (deltaMode 1) become pixels
const FRESH_RISE = 1.6;        // A delta this many times the last one...
const FRESH_EASED = 0.5;       // ...once the stream has eased below this share of its peak...
const FRESH_MIN_PX = 12;       // ...and at least this big, is a new push inside old inertia
const FRESH_AFTER_MS = 300;    // ...but only this long after the gesture began (a finger drag wobbles at first)
const MAX_QUEUED = 3;          // Turns that can wait behind the one playing; more than that are a slip
const SWIPE_PX = 48;           // Vertical finger travel that counts as a page swipe
const SWIPE_RATIO = 1.2;       // Vertical travel must beat sideways travel by this much (the gallery swipes sideways)
const SCROLLABLE = /(auto|scroll)/;

/** @returns {number} The side saved for this tab, apps by default. */
export function readSide() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === String(SIDE_DOGS) ? SIDE_DOGS : SIDE_APPS;
  } catch {
    return SIDE_APPS;
  }
}

/** @param {number} side */
export function saveSide(side) {
  try {
    sessionStorage.setItem(STORAGE_KEY, String(side));
  } catch {
    // Private modes can refuse storage; the side is still remembered until the tab closes.
  }
}

/**
 * True when an element between the target and the card can still scroll in that direction, so the
 * gesture belongs to that list rather than to the card.
 * @param {Node} target
 * @param {HTMLElement} root
 * @param {number} direction 1 for down, -1 for up
 */
function innerScrollTakes(target, root, direction) {
  for (let node = target; node && node !== root; node = node.parentNode) {
    if (node.nodeType !== 1 || node.scrollHeight <= node.clientHeight) continue;
    if (!SCROLLABLE.test(getComputedStyle(node).overflowY)) continue;
    const roomBelow = node.scrollHeight - node.clientHeight - node.scrollTop > 1;
    if (direction > 0 ? roomBelow : node.scrollTop > 0) return true;
  }
  return false;
}

/**
 * Vertical wheel travel in pixels, whatever unit the browser reports it in.
 * @param {WheelEvent} event
 */
function wheelPixels(event) {
  const delta = event.deltaY;
  if (event.deltaMode === 1) return delta * LINE_PX;
  if (event.deltaMode === 2) return delta * window.innerHeight;
  return delta;
}

/**
 * Wires the card's gestures. Scroll down flips; scroll up goes home.
 * @param {HTMLElement} root The card's page element
 * @param {{ isEnabled: () => boolean, onFlip: () => void, onUp: () => void, lockMs: number }} options
 *   lockMs is the shortest time between two turns; a turn asked for sooner waits for it rather than being lost.
 * @returns {() => void} Removes every listener
 */
export function attachCardFlip(root, { isEnabled, onFlip, onUp, lockMs }) {
  let lastWheelAt = 0;
  let gestureStartedAt = 0;
  let gestureUsed = false;
  let lastSize = 0;
  let peakSize = 0;
  let lockedUntil = 0;
  let queuedTimer = 0;
  let queued = 0;
  let touchX = null;
  let touchY = 0;

  const clearQueue = () => {
    clearTimeout(queuedTimer);
    queuedTimer = 0;
    queued = 0;
  };

  const flipNow = () => {
    lockedUntil = Date.now() + lockMs;
    onFlip();
  };

  // Plays the waiting turns one lock apart; drops them if the card stopped listening (scrolled away, panel open)
  const playQueue = () => {
    queuedTimer = 0;
    if (!isEnabled()) {
      queued = 0;
      return;
    }
    queued -= 1;
    flipNow();
    if (queued > 0) queuedTimer = setTimeout(playQueue, lockMs);
  };

  const act = (direction) => {
    if (direction < 0) {
      clearQueue();
      onUp();
      return;
    }
    const wait = lockedUntil - Date.now();
    if (wait <= 0 && !queued) {
      flipNow();
      return;
    }
    // Still turning: the turn waits its place instead of being dropped
    if (queued >= MAX_QUEUED) return;
    queued += 1;
    if (!queuedTimer) queuedTimer = setTimeout(playQueue, Math.max(wait, 0));
  };

  // Every wheel event on the site runs the gesture clock. A new gesture starts after a quiet gap, or when a
  // fresh push rises out of the easing inertia of the last one. A gesture that began before the card was
  // ready counts as spent, so the inertia of the scroll that brought the visitor here can't flip it.
  const trackWheel = (event) => {
    const now = Date.now();
    const size = Math.abs(wheelPixels(event));
    const quiet = now - lastWheelAt > WHEEL_GAP_MS;
    const freshPush = now - gestureStartedAt > FRESH_AFTER_MS && size >= FRESH_MIN_PX
      && size > lastSize * FRESH_RISE && lastSize < peakSize * FRESH_EASED;
    if (quiet || freshPush) {
      gestureUsed = false;
      gestureStartedAt = now;
      peakSize = 0;
    }
    peakSize = Math.max(peakSize, size);
    lastSize = size;
    lastWheelAt = now;
    if (!isEnabled()) gestureUsed = true;
  };

  const onWheel = (event) => {
    if (!isEnabled()) return;
    const pixels = wheelPixels(event);
    if (Math.abs(pixels) < WHEEL_MIN_DELTA || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
    const direction = pixels > 0 ? 1 : -1;
    if (innerScrollTakes(event.target, root, direction)) return;
    if (event.cancelable) event.preventDefault();
    if (gestureUsed) return;
    gestureUsed = true;
    act(direction);
  };

  const onTouchStart = (event) => {
    touchX = event.touches.length === 1 ? event.touches[0].clientX : null;
    touchY = event.touches.length === 1 ? event.touches[0].clientY : 0;
  };

  // Only the upward swipe is handled here: a downward swipe scrolls the page back up by itself.
  const onTouchEnd = (event) => {
    if (touchX === null || !isEnabled()) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchX;
    const dy = touch.clientY - touchY;
    touchX = null;
    if (dy > -SWIPE_PX || Math.abs(dy) < Math.abs(dx) * SWIPE_RATIO) return;
    if (innerScrollTakes(event.target, root, 1)) return;
    act(1);
  };

  const onTouchCancel = () => { touchX = null; };

  const onKey = (event) => {
    if (!isEnabled() || (event.key !== "PageDown" && event.key !== "PageUp")) return;
    event.preventDefault();
    act(event.key === "PageDown" ? 1 : -1);
  };

  window.addEventListener("wheel", trackWheel, { passive: true, capture: true });
  root.addEventListener("wheel", onWheel, { passive: false });
  root.addEventListener("touchstart", onTouchStart, { passive: true });
  root.addEventListener("touchend", onTouchEnd, { passive: true });
  root.addEventListener("touchcancel", onTouchCancel, { passive: true });
  window.addEventListener("keydown", onKey);

  return () => {
    clearQueue();
    window.removeEventListener("wheel", trackWheel, { capture: true });
    root.removeEventListener("wheel", onWheel);
    root.removeEventListener("touchstart", onTouchStart);
    root.removeEventListener("touchend", onTouchEnd);
    root.removeEventListener("touchcancel", onTouchCancel);
    window.removeEventListener("keydown", onKey);
  };
}
