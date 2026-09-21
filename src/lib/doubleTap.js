/**
 * Turns a handler into one that only fires on a double tap / double click.
 *
 * Every panel uses it on its backdrop: a single stray tap outside a panel no
 * longer closes it — it takes two in quick succession. Timed off `click`
 * rather than `dblclick`, which touch browsers don't reliably fire.
 *
 * The returned function owns the tap timer, so build it once per panel in the
 * component's <script> and pass that to `onclick`.
 */
const DOUBLE_TAP_MS = 400;

export function onDoubleTap(handler) {
  let lastTap = 0;
  return (e) => {
    const now = Date.now();
    if (now - lastTap < DOUBLE_TAP_MS) {
      // Reset so a triple tap doesn't fire the handler a second time
      lastTap = 0;
      handler(e);
      return;
    }
    lastTap = now;
  };
}
