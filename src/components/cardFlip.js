// Gestures for the landing's second page (DogsMain.svelte), a two-sided card: scrolling down past the
// bottom of the site flips the card sideways, scrolling up always goes back to the DOGS letters.
// Wheel, touch and PageDown/PageUp all land on the same two callbacks. The side the visitor was on is kept
// for the tab's session, so a reload or a trip up to the letters comes back to the same side.

export const SIDE_APPS = 0;
export const SIDE_DOGS = 1;

const STORAGE_KEY = "dogs-card-side";
const WHEEL_GAP_MS = 180;      // Quiet time that ends one wheel or trackpad gesture (and its inertia)
const WHEEL_MIN_DELTA = 4;     // Ignores trackpad jitter
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
 * Wires the card's gestures. Scroll down flips; scroll up goes home.
 * @param {HTMLElement} root The card's page element
 * @param {{ isEnabled: () => boolean, onFlip: () => void, onUp: () => void, lockMs: number }} options
 * @returns {() => void} Removes every listener
 */
export function attachCardFlip(root, { isEnabled, onFlip, onUp, lockMs }) {
  let lastWheelAt = 0;
  let gestureUsed = false;
  let lockedUntil = 0;
  let touchX = null;
  let touchY = 0;

  const act = (direction) => {
    if (direction < 0) {
      onUp();
      return;
    }
    const now = Date.now();
    if (now < lockedUntil) return;
    lockedUntil = now + lockMs;
    onFlip();
  };

  // Every wheel event on the site keeps the gesture clock running, and a gesture that began before the card
  // was ready counts as spent, so the inertia of the scroll that brought the visitor here can't flip it.
  const trackWheel = () => {
    const now = Date.now();
    if (now - lastWheelAt > WHEEL_GAP_MS) gestureUsed = false;
    lastWheelAt = now;
    if (!isEnabled()) gestureUsed = true;
  };

  const onWheel = (event) => {
    if (!isEnabled() || Math.abs(event.deltaY) < WHEEL_MIN_DELTA || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
    const direction = event.deltaY > 0 ? 1 : -1;
    if (innerScrollTakes(event.target, root, direction)) return;
    if (event.cancelable) event.preventDefault();
    if (gestureUsed) return;
    gestureUsed = true;
    act(direction);
  };

  const onTouchStart = (event) => {
    touchX = event.touches[0].clientX;
    touchY = event.touches[0].clientY;
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

  const onKey = (event) => {
    if (!isEnabled() || (event.key !== "PageDown" && event.key !== "PageUp")) return;
    event.preventDefault();
    act(event.key === "PageDown" ? 1 : -1);
  };

  window.addEventListener("wheel", trackWheel, { passive: true, capture: true });
  root.addEventListener("wheel", onWheel, { passive: false });
  root.addEventListener("touchstart", onTouchStart, { passive: true });
  root.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("keydown", onKey);

  return () => {
    window.removeEventListener("wheel", trackWheel, { capture: true });
    root.removeEventListener("wheel", onWheel);
    root.removeEventListener("touchstart", onTouchStart);
    root.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("keydown", onKey);
  };
}
