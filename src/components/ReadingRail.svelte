<script>
  // Reading rail — the blog reader's scrollbar, and the post's timeline.
  //
  // Three states, by how much attention the reader is giving it:
  //   idle   a hairline, with a short brighter run for where you are. Nothing else.
  //   peek   scrolling fast: the timeline ghosts in, faded, with one readout.
  //   full   pointer or finger on the rail: the ticks sharpen, the readout follows
  //          the pointer, and the rail can be dragged, or clicked to jump.
  //
  // The only text it ever shows is that single two-line readout:
  //   03/10  The Quesarito      where you are: counter, chapter
  //   AUG 17 2026               when that stretch was written
  //
  // Chapters are the blocks tagged data-chapter (named in
  // src/data/blog/chapters.json, so the writing itself is never touched), or
  // failing that the content's top-level headings. The writing days come from
  // git history (scripts/vite-plugin-blog-timeline.js), stamped on the blocks as
  // data-w. The counter counts chapters, or — in a post without at least two —
  // the writing sessions themselves. All of it is read straight off the DOM, so
  // the rail works on any scroll container: `scroller` just has to be positioned
  // (it is walked as an offsetParent) and is expected to hide its native scrollbar.

  // `mirrored`: the post has the music volume slider pinned on the left
  // (BlogMusic.svelte), so the rail takes the matching spot on the right instead
  // of hugging the edge. It wears that slider's crimson either way.
  let { scroller, content, mirrored = false } = $props();

  // BlogMusic is a column of --col (24px, 36px on TV-size screens) sitting
  // `left-2` in, so its track runs down the middle of that: 8 + col / 2.
  const mirroredInset = () => (window.innerWidth >= 1920 ? 26 : 20);

  // px/ms, smoothed. One wheel notch peaks around 1; a flick, a fling or
  // Page Down clears it easily.
  const FAST_SCROLL = 1.4;
  const LEAP = 0.5; // of a viewport, covered by a single scroll event
  const PEEK_LINGER_MS = 900;
  const TOUCH_LINGER_MS = 1400; // a finger covers the rail: leave it up to be read
  const SNAP_PX = 7;
  const MIN_THUMB_PX = 24;
  const JUMP_MARGIN_PX = 12; // breathing room above a heading that was jumped to
  const READING_LINE = 0.3; // how far down the viewport "what I'm reading" sits
  const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  let railEl = $state(null);
  let trackEl = $state(null);
  let trackHeight = $state(0);

  // Sharpness. The panel is centered at fractional offsets, so a 1px line
  // placed in whole CSS pixels straddles two device pixels and goes soft.
  // Everything thin is therefore snapped to the DEVICE pixel grid instead.
  let dpr = $state(1);
  let trackRight = $state(6); // px in from the rail's right edge, snapped
  let trackInset = $state(10); // px down from the rail's top edge, snapped
  let trackFoot = $state(10); // px up from its bottom edge, snapped
  const crisp = (v) => Math.round(v * dpr) / dpr;
  // One hairline: a whole number of device pixels, never less than one
  const hair = $derived(Math.max(1, Math.round(dpr)) / dpr);
  let viewport = $state(0);
  let maxScroll = $state(0);
  let scrollTop = $state(0);

  // Replaced wholesale on every measure, never mutated — so raw, not deep proxies
  let chapters = $state.raw([]); // { y, title }
  let subheads = $state.raw([]); // { y }
  let sessions = $state.raw([]); // { y, day } — each place the writing day changes
  let blocks = $state.raw([]); // { y, day } for every dated block

  let hovering = $state(false);
  let dragging = $state(false);
  let moved = $state(false); // the press turned into a drag
  let peeking = $state(false);
  let pointerY = $state(null); // px down the track, while the pointer is on the rail

  const mode = $derived(hovering || dragging ? "full" : peeking ? "peek" : "idle");
  const scrollable = $derived(maxScroll > 4 && trackHeight > 0);

  const thumbHeight = $derived(
    Math.min(
      trackHeight,
      Math.max(MIN_THUMB_PX, (viewport / (maxScroll + viewport || 1)) * trackHeight),
    ),
  );
  const travel = $derived(Math.max(1, trackHeight - thumbHeight));
  const thumbTop = $derived((scrollTop / (maxScroll || 1)) * travel);

  // Content y → px down the track. A tick lines up with the top of the thumb
  // exactly when its block reaches the top of the viewport.
  const toTrack = (y) => crisp(Math.min(1, Math.max(0, y / (maxScroll || 1))) * travel);

  // What the counter counts. Headings, when the author made at least two of
  // them; otherwise the writing sessions, which for a journal are the chapters.
  // One of anything is not worth counting.
  const divisions = $derived(
    chapters.length > 1 ? chapters : sessions.length > 1 ? sessions : [],
  );

  // Pointing at the rail without dragging it: the readout describes the target.
  // A press that hasn't moved yet still counts, so a click doesn't blink it off.
  const probing = $derived(hovering && pointerY !== null && !(dragging && moved));

  // The tick under the pointer, chapters winning ties — a click jumps to it
  const snapped = $derived.by(() => {
    if (!probing) return null;
    let best = null;
    let bestDist = SNAP_PX + 1;
    for (const tick of [...chapters, ...subheads, ...sessions]) {
      const dist = Math.abs(toTrack(tick.y) - pointerY);
      if (dist < bestDist) {
        best = tick;
        bestDist = dist;
      }
    }
    return best;
  });

  // Where a plain click on the track would scroll to
  const pointedScroll = $derived(
    pointerY === null
      ? 0
      : Math.min(1, Math.max(0, (pointerY - thumbHeight / 2) / travel)) * maxScroll,
  );

  // The readout describes the pointer's target while probing, else the reading line
  const readout = $derived.by(() => {
    const y = probing
      ? snapped
        ? snapped.y
        : pointedScroll + viewport * READING_LINE
      : scrollTop + viewport * READING_LINE;

    let at = 0;
    for (const division of divisions) if (division.y <= y + 1) at++;
    at = Math.max(1, at);

    let day = null;
    for (const b of blocks) {
      if (b.y > y + 1) break;
      day = b.day;
    }
    if (!day && blocks.length) day = blocks[0].day;

    const pad = (n) => String(n).padStart(2, "0");
    return {
      count: divisions.length ? `${pad(at)}/${pad(divisions.length)}` : "",
      // A writing session has no name of its own: its day is already the readout
      title: divisions === chapters ? chapters[at - 1].title : "",
      day: day ? formatDay(day) : "",
    };
  });

  const readoutTop = $derived(
    Math.min(
      trackHeight - 6,
      Math.max(6, probing ? (snapped ? toTrack(snapped.y) : pointerY) : thumbTop + thumbHeight / 2),
    ),
  );

  // Always with its year: this book will run on into 2027 and beyond
  function formatDay(day) {
    const [year, month, date] = day.split("-");
    return `${MONTHS[+month - 1]} ${+date} ${year}`;
  }

  // offsetTop chains ignore CSS transforms; bounding rects don't, and the
  // article opens with a skew/scale glitch that would throw every tick off.
  function offsetWithin(el) {
    let y = 0;
    let node = el;
    while (node && node !== scroller) {
      y += node.offsetTop;
      node = node.offsetParent;
    }
    if (node === scroller) return y;
    return el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
  }

  // Runs inside the $effect below as well as from the observers, so it only ever
  // WRITES state: reading any of it back here would make that effect depend on
  // what it sets, and loop.
  function measure() {
    if (!scroller || !content || !trackEl || !railEl) return;

    const ratio = window.devicePixelRatio || 1;
    const snap = (v) => Math.round(v * ratio) / ratio;
    const box = railEl.getBoundingClientRect();
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const inset = mirrored ? mirroredInset() : coarse ? 4 : 6;
    dpr = ratio;
    trackRight = box.right - snap(box.right - inset);
    trackInset = snap(box.top + 10) - box.top;
    trackFoot = box.bottom - snap(box.bottom - 10);

    const height = scroller.clientHeight;
    viewport = height;
    maxScroll = Math.max(0, scroller.scrollHeight - height);
    trackHeight = trackEl.clientHeight;
    scrollTop = scroller.scrollTop;

    const heads = [...content.querySelectorAll("h1, h2, h3, h4")].map((el) => ({
      y: offsetWithin(el),
      level: +el.tagName[1],
      title: el.textContent.trim(),
    }));
    const named = [...content.querySelectorAll("[data-chapter]")].map((el) => ({
      y: offsetWithin(el),
      title: el.dataset.chapter,
    }));
    if (named.length) {
      // Named chapters outrank headings, which drop to the minor ticks
      chapters = named;
      subheads = heads;
    } else {
      const top = Math.min(...heads.map((h) => h.level));
      chapters = heads.filter((h) => h.level === top);
      subheads = heads.filter((h) => h.level === top + 1);
    }

    const dated = [...content.querySelectorAll("[data-w]")].map((el) => ({
      y: offsetWithin(el),
      day: el.dataset.w,
    }));
    blocks = dated;
    sessions = dated.filter((block, i) => i === 0 || block.day !== dated[i - 1].day);
  }

  // ── Scroll: position, and how fast ────────────────────────────────────────
  let frame = 0;
  let lastTop = 0;
  let lastTime = 0;
  let speed = 0;
  let peekTimer = null;

  function onScroll() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const top = scroller.scrollTop;
      const now = performance.now();
      const elapsed = now - lastTime;
      const distance = Math.abs(top - lastTop);
      // A gap means the scroll just started: nothing to average against yet
      speed = elapsed > 0 && elapsed < 120 ? speed * 0.6 + (distance / elapsed) * 0.4 : 0;
      // With smooth scrolling off, Page Down or a hard wheel spin lands as ONE
      // event with no frames to measure a speed across — but it is a leap
      const leapt = distance > scroller.clientHeight * LEAP;
      lastTop = top;
      lastTime = now;
      scrollTop = top;

      if ((speed > FAST_SCROLL || leapt) && !dragging) {
        peeking = true;
        clearTimeout(peekTimer);
        peekTimer = setTimeout(() => (peeking = false), PEEK_LINGER_MS);
      }
    });
  }

  $effect(() => {
    if (!scroller || !content || !trackEl || !railEl) return;
    measure();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    // Images, fonts, a resized panel, a different post: all move the ticks
    const resized = new ResizeObserver(measure);
    resized.observe(scroller);
    resized.observe(content);
    resized.observe(trackEl);
    const rewritten = new MutationObserver(measure);
    rewritten.observe(content, { childList: true, subtree: true });
    // The panel slides and scales in. Measured mid-flight, the pixel snapping
    // locks onto a geometry that is gone a moment later, and no observer fires
    // for a transform — so measure again when an ancestor's animation lands.
    const settled = (e) => {
      if (e.target.contains?.(railEl)) measure();
    };
    document.addEventListener("animationend", settled);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      document.removeEventListener("animationend", settled);
      resized.disconnect();
      rewritten.disconnect();
      cancelAnimationFrame(frame);
      frame = 0;
      clearTimeout(peekTimer);
      clearTimeout(lingerTimer);
    };
  });

  // ── Pointer: hover to read it, drag to scrub, click to jump ───────────────
  let downY = 0;
  let grab = 0;
  let lingerTimer = null;

  function trackY(e) {
    const rect = trackEl.getBoundingClientRect();
    return Math.min(rect.height, Math.max(0, e.clientY - rect.top));
  }

  function onPointerEnter(e) {
    clearTimeout(lingerTimer);
    hovering = true;
    pointerY = trackY(e);
  }

  function onPointerLeave(e) {
    if (dragging) return;
    if (e.pointerType === "touch") {
      lingerTimer = setTimeout(() => (hovering = false), TOUCH_LINGER_MS);
    } else {
      hovering = false;
    }
    pointerY = null;
  }

  function onPointerDown(e) {
    if (e.button !== 0) return;
    e.preventDefault(); // no text selection, no focus theft
    e.currentTarget.setPointerCapture(e.pointerId);
    clearTimeout(lingerTimer);
    hovering = true;
    pointerY = trackY(e);
    downY = e.clientY;
    moved = false;
    // Grabbed by the thumb: keep the grip where it was. Anywhere else: by its middle.
    const onThumb = pointerY >= thumbTop && pointerY <= thumbTop + thumbHeight;
    grab = onThumb ? pointerY - thumbTop : thumbHeight / 2;
    dragging = true;
  }

  function onPointerMove(e) {
    pointerY = trackY(e);
    if (!dragging) return;
    if (!moved && Math.abs(e.clientY - downY) < 3) return;
    moved = true;
    scroller.scrollTop = Math.min(1, Math.max(0, (pointerY - grab) / travel)) * maxScroll;
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    if (moved) return;
    // A click, not a drag: jump to the tick under the pointer, else to that spot
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollTo({
      top: snapped ? Math.max(0, snapped.y - JUMP_MARGIN_PX) : pointedScroll,
      behavior: reduced ? "auto" : "smooth",
    });
  }

  function onPointerCancel() {
    dragging = false;
  }
</script>

<!-- A redundant pointer affordance: the pane itself still scrolls natively with
     wheel, touch and keys, and its headings stay navigable, so assistive tech
     loses nothing by skipping this. -->
<div
  bind:this={railEl}
  class="rail"
  class:scrollable
  class:mirrored
  data-mode={mode}
  style="--hair: {hair}px; --track-right: {trackRight}px; --track-inset: {trackInset}px; --track-foot: {trackFoot}px"
  aria-hidden="true"
  onpointerenter={onPointerEnter}
  onpointerleave={onPointerLeave}
  onpointerdown={onPointerDown}
  onpointermove={onPointerMove}
  onpointerup={onPointerUp}
  onpointercancel={onPointerCancel}
>
  <div class="track" bind:this={trackEl}>
    <div class="ticks">
      {#each subheads as tick}
        <span class="tick sub" class:snapped={snapped === tick} style="top: {toTrack(tick.y)}px"></span>
      {/each}
      {#each sessions as tick}
        <span class="tick session" class:snapped={snapped === tick} style="top: {toTrack(tick.y)}px"></span>
      {/each}
      {#each chapters as tick}
        <span class="tick chapter" class:snapped={snapped === tick} style="top: {toTrack(tick.y)}px"></span>
      {/each}
    </div>

    <div
      class="thumb"
      style="height: {crisp(thumbHeight)}px; transform: translateY({crisp(thumbTop)}px)"
    ></div>

    {#if readout.count || readout.day}
      <div class="readout" style="top: {crisp(readoutTop)}px">
        {#if readout.count}
          <div class="readout-where">
            <span class="count">{readout.count}</span>
            {#if readout.title}<span class="title">{readout.title}</span>{/if}
          </div>
        {/if}
        {#if readout.day}
          <div class="readout-when">{readout.day}</div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .rail {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 22px; /* the hit area; what shows is the 1px track inside it */
    z-index: 30;
    visibility: hidden;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .rail.scrollable {
    visibility: visible;
  }

  /* Placed and sized in device pixels (see `crisp` above): a hairline that lands
     between pixels goes soft */
  .track {
    position: absolute;
    top: var(--track-inset);
    bottom: var(--track-foot);
    right: var(--track-right);
    width: var(--hair);
    /* The volume slider's palette (BlogMusic.svelte): crimson on a faint-red track */
    background: rgba(220, 20, 60, 0.22);
    transition: background 0.3s ease;
  }

  .rail[data-mode="peek"] .track {
    background: rgba(220, 20, 60, 0.3);
  }

  .rail[data-mode="full"] .track {
    background: rgba(220, 20, 60, 0.45);
  }

  .thumb {
    position: absolute;
    top: 0;
    left: calc(var(--hair) * -1);
    width: calc(var(--hair) * 2);
    background: rgba(220, 20, 60, 0.75);
    transition:
      background 0.3s ease,
      width 0.15s ease,
      box-shadow 0.3s ease;
    will-change: transform;
  }

  .rail[data-mode="peek"] .thumb {
    background: #dc143c;
  }

  /* In hand it gets the slider's glow as well */
  .rail[data-mode="full"] .thumb {
    width: calc(var(--hair) * 3);
    background: #dc143c;
    box-shadow: 0 0 8px rgba(220, 20, 60, 0.55);
  }

  /* ── Ticks: idle shows none of this ── */
  .ticks {
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  /* Scrolling fast: a ghost of the timeline, not a thing to read */
  .rail[data-mode="peek"] .ticks {
    opacity: 0.2;
    transition-duration: 0.18s;
  }

  .rail[data-mode="full"] .ticks {
    opacity: 1;
    transition-duration: 0.18s;
  }

  .tick {
    position: absolute;
    right: 0;
    height: var(--hair);
    transition:
      width 0.12s ease,
      background 0.12s ease;
  }

  /* Lengths in hairlines too, so both ends of a tick land on the pixel grid */
  /* One colour; length tells them apart. Longest: a chapter. */
  .tick.chapter {
    width: calc(var(--hair) * 11);
    background: #dc143c;
  }

  .tick.sub {
    width: calc(var(--hair) * 7);
    background: rgba(220, 20, 60, 0.55);
  }

  /* A change of writing day: the git half of the timeline */
  .tick.session {
    width: calc(var(--hair) * 6);
    background: rgba(220, 20, 60, 0.8);
  }

  /* The one a click would jump to */
  .tick.snapped {
    width: calc(var(--hair) * 18);
    background: #ffffff;
  }

  /* ── The one piece of text ── */
  .readout {
    position: absolute;
    right: 20px;
    transform: translateY(-50%);
    padding: 3px 7px;
    background: rgba(6, 6, 10, 0.88);
    border: 1px solid rgba(220, 20, 60, 0.28);
    text-align: right;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.5s ease;
    font-family: ui-monospace, "JetBrains Mono", "Fira Code", monospace;
  }

  .rail[data-mode="peek"] .readout {
    opacity: 0.28;
    transition-duration: 0.18s;
  }

  .rail[data-mode="full"] .readout {
    opacity: 1;
    transition-duration: 0.12s;
  }

  /* Line one: where you are */
  .readout-where {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    gap: 0.7em;
    font-size: 10px;
    line-height: 1.35;
    letter-spacing: 0.1em;
  }

  .count {
    color: rgba(255, 255, 255, 0.5);
  }

  .title {
    max-width: 170px;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: 0.04em;
    color: rgba(255, 255, 255, 0.95);
  }

  /* Line two: when it was written. The slider's lighter red (its pulse dot):
     plain crimson is too dim to read at this size on black. */
  .readout-when {
    margin-top: 1px;
    font-size: 9px;
    line-height: 1.35;
    letter-spacing: 0.14em;
    color: #ff2a4d;
  }

  /* A finger needs a little more to aim at (the track's inset follows in JS) */
  @media (pointer: coarse) {
    .rail {
      width: 24px;
    }
  }

  /* Mirroring the volume slider: the line sits 20px in, so the hit area has to
     reach past it. The article pads this side 48px to match, so it covers no text. */
  .rail.mirrored {
    width: 40px;
  }

  @media (min-width: 1920px) {
    .rail.mirrored {
      width: 52px;
    }
  }
</style>
