// A finger can't flick through a million-character paste, and phone scrollbars
// can't be dragged at all. This rail sits beside the test pad: a tap jumps
// there and a drag scrubs, with the thumb's middle held under the finger.

const MIN_THUMB_PX = 44;

/**
 * Svelte action: turns `rail` into a drag-to-scroll track for the element
 * with id `targetId`. The rail's first child is the thumb. Pass the scrolled
 * text as `content`, so the thumb also follows changes that fire no input
 * event (Clear).
 *
 * @param {HTMLElement} rail
 * @param {{ targetId: string, content: string }} params
 */
export function scrollRail(rail, params) {
  const target = /** @type {HTMLElement} */ (document.getElementById(params.targetId));
  const thumb = /** @type {HTMLElement} */ (rail.firstElementChild);
  let dragging = false;

  const measure = () => {
    const travel = target.scrollHeight - target.clientHeight;
    const thumbPx = Math.max(MIN_THUMB_PX, (rail.clientHeight * target.clientHeight) / target.scrollHeight);
    return { travel, thumbPx, track: rail.clientHeight - thumbPx };
  };

  const sync = () => {
    const { travel, thumbPx, track } = measure();
    rail.classList.toggle("is-idle", travel <= 0);
    if (travel <= 0) return;
    thumb.style.height = `${thumbPx}px`;
    thumb.style.transform = `translateY(${(target.scrollTop / travel) * track}px)`;
  };

  /** @param {PointerEvent} e */
  const scrub = (e) => {
    const { travel, thumbPx, track } = measure();
    if (track <= 0) return;
    const y = e.clientY - rail.getBoundingClientRect().top - thumbPx / 2;
    target.scrollTop = Math.min(1, Math.max(0, y / track)) * travel;
  };

  // The pad's height follows its container, which can change without a
  // window resize; browsers without ResizeObserver fall back to resize
  const resizer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(sync);

  rail.addEventListener("pointerdown", (e) => {
    dragging = true;
    rail.setPointerCapture(e.pointerId);
    scrub(e);
  });
  rail.addEventListener("pointermove", (e) => dragging && scrub(e));
  rail.addEventListener("pointerup", () => (dragging = false));
  rail.addEventListener("pointercancel", () => (dragging = false));
  target.addEventListener("scroll", sync, { passive: true });
  target.addEventListener("input", sync);
  if (resizer) resizer.observe(target);
  else window.addEventListener("resize", sync);
  sync();

  return {
    // Svelte calls this before it writes the new text into the textarea, so
    // measure once that write has landed
    update: () => Promise.resolve().then(sync),
    destroy() {
      target.removeEventListener("scroll", sync);
      target.removeEventListener("input", sync);
      if (resizer) resizer.disconnect();
      else window.removeEventListener("resize", sync);
    },
  };
}
