/**
 * siteChipsLayout.js
 * Measuring for SiteChips.svelte. The chips hang off the landing tile row (TitlePage.svelte's
 * .hieroglyphic-nav), and where that row sits depends on the phrase (WE ARE DOGS vs the four-line
 * DOGS RUN THIS %#$@) and the screen, so the chips read it from the page instead of guessing.
 */

/** Two-line chips with blurbs, under the tiles. */
export const FIT_ROOMY = "roomy";
/** One line per chip, closer to the tiles. */
export const FIT_COMPACT = "compact";
/** One line per chip, level with the tile row at the screen edges. */
export const FIT_CORNERS = "corners";

const NAV_SELECTOR = ".hieroglyphic-nav";
const LANG_CARD_SELECTOR = ".lang-display";
// Same as $EDGE_WIDE in SiteChips.svelte, plus a little air between the chips and the tiles
const CORNER_EDGE_PX = 24;
const CORNER_GAP_PX = 12;

/** @typedef {{ navTop: number, navBottom: number, cardBottom: number }} ChipAnchors */

/**
 * Where the chips anchor. Tile row offsets are layout values relative to the letters' wrapper,
 * so the tiles' own entrance animation never skews them.
 * @param {HTMLElement} root the chips container, rendered inside the letters' wrapper
 * @returns {ChipAnchors}
 */
export function readAnchors(root) {
  const nav = root.parentElement ? root.parentElement.querySelector(NAV_SELECTOR) : null;
  const card = document.querySelector(LANG_CARD_SELECTOR);
  return {
    navTop: nav ? nav.offsetTop : 0,
    navBottom: nav ? nav.offsetTop + nav.offsetHeight : 0,
    cardBottom: card ? Math.round(card.getBoundingClientRect().bottom) : 0,
  };
}

/**
 * True when both chip groups fit beside the tile row without touching it.
 * @param {HTMLElement} root
 */
export function fitsBesideTiles(root) {
  const nav = root.parentElement ? root.parentElement.querySelector(NAV_SELECTOR) : null;
  if (!nav) return false;
  const room = nav.getBoundingClientRect().left - CORNER_EDGE_PX - CORNER_GAP_PX;
  return Array.prototype.every.call(root.children, (group) => group.getBoundingClientRect().width <= room);
}

/**
 * Calls `onChange` whenever the letters, the tiles, the language card or the screen change size.
 * @param {HTMLElement} root
 * @param {() => void} onChange
 * @returns {() => void} stops watching
 */
export function watchLayout(root, onChange) {
  const wrapper = root.parentElement;
  const targets = [wrapper, wrapper && wrapper.querySelector(NAV_SELECTOR), document.querySelector(LANG_CARD_SELECTOR)];
  const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(onChange);
  if (observer) targets.filter(Boolean).forEach((target) => observer.observe(target));
  window.addEventListener("resize", onChange);
  return () => {
    if (observer) observer.disconnect();
    window.removeEventListener("resize", onChange);
  };
}
