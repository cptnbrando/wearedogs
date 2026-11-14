<script>
  import { Bone } from 'lucide-svelte';
  import { buildTowerRows, TOWER_SKY_ROWS } from './dogsIncArt.js';
  import { MAX_DRAWN_FLOORS } from './dogsIncConfig.js';

  /** @type {object} engine snapshot */
  export let snap;
  /** @type {() => void} taps the golden bone */
  export let onCatch;
  /** @type {number} floors shown in the tower window */
  export let floorsShown = MAX_DRAWN_FLOORS;

  // INK code -> CSS class. Kept beside the markup that uses it; colors live in _dogsinc-variables.
  const INK_CLASS = {
    f: 'ink-frame', i: 'ink-desk', e: 'ink-worker', s: 'ink-sun', m: 'ink-moon',
    w: 'ink-cloud', a: 'ink-janitor', c: 'ink-cafe', r: 'ink-restroom', d: 'ink-ghost',
  };
  const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
  const BONE_SIZE = 18;
  const BONE_LABEL = 'Catch the golden bone for a bonus';
  /** Bone bob: half a sky row up and down while it crosses. */
  const BOB_CYCLES = 3;

  /**
   * Turns painted rows into HTML, one span per run of same-colored glyphs.
   * Every glyph comes from dogsIncArt constants or numbers, but it is escaped anyway.
   * @param {{t:string,c:string}[]} rows
   * @returns {string}
   */
  function toHtml(rows) {
    return rows.map((row) => {
      let html = '';
      let start = 0;
      for (let i = 1; i <= row.t.length; i += 1) {
        if (i < row.t.length && row.c[i] === row.c[start]) continue;
        const text = row.t.slice(start, i).replace(/[&<>]/g, (ch) => ESCAPES[ch]);
        html += '<span class="' + INK_CLASS[row.c[start]] + '">' + text + '</span>';
        start = i;
      }
      return html;
    }).join('\n');
  }

  $: html = toHtml(buildTowerRows(snap, floorsShown));
  $: boneLeft = snap.flier === null ? 0 : snap.flier * 100;
  $: boneTop = snap.flier === null ? 0 : (Math.sin(snap.flier * Math.PI * 2 * BOB_CYCLES) + 1) / 2;
</script>

<div class="dogsinc-tower-wrap" class:is-night={snap.isNight} class:is-rush={snap.boost && snap.boost.id === 'rush'}>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- escaped, built only from art constants -->
  <pre class="dogsinc-tower" aria-hidden="true">{@html html}</pre>
  {#if snap.flier !== null}
    <button
      type="button"
      class="dogsinc-bone"
      style="left: {boneLeft}%; top: {boneTop * TOWER_SKY_ROWS * 0.6}em;"
      onclick={onCatch}
      aria-label={BONE_LABEL}
      title={BONE_LABEL}
    >
      <Bone size={BONE_SIZE} />
    </button>
  {/if}
</div>

<style lang="scss">
  @use "../../../styles/dogsinc-variables" as *;

  .dogsinc-tower-wrap {
    position: relative;
    font-size: $dogsinc-tower-size-mobile;
  }

  .dogsinc-tower {
    margin: 0;
    font-family: $dogsinc-mono;
    font-size: 1em;
    line-height: $dogsinc-tower-line-height;
    color: $dogsinc-ink;
    white-space: pre;
    overflow: hidden;
    user-select: none;
  }

  // ── Tower paint (classes come from INK_CLASS, injected as HTML, so they are :global) ──
  .dogsinc-tower :global(.ink-frame) { color: $dogsinc-frame; }
  .dogsinc-tower :global(.ink-desk) { color: $dogsinc-ink; }
  .dogsinc-tower :global(.ink-worker) { color: $dogsinc-ink; font-weight: 700; }
  .dogsinc-tower :global(.ink-sun) { color: $dogsinc-gold; text-shadow: 0 0 6px $dogsinc-gold-glow; }
  .dogsinc-tower :global(.ink-moon) { color: $dogsinc-night-ink; }
  .dogsinc-tower :global(.ink-cloud) { color: $dogsinc-cloud; }
  .dogsinc-tower :global(.ink-janitor) { color: $dogsinc-accent; font-weight: 700; }
  .dogsinc-tower :global(.ink-cafe) { color: $dogsinc-cafe; }
  .dogsinc-tower :global(.ink-restroom) { color: $dogsinc-restroom; }
  .dogsinc-tower :global(.ink-ghost) { color: $dogsinc-dim; }

  .is-night .dogsinc-tower :global(.ink-frame) { color: $dogsinc-frame-night; }
  .is-rush .dogsinc-tower :global(.ink-worker) { color: $dogsinc-rush; }

  // The bone flies over the two sky rows only; it never covers the building.
  .dogsinc-bone {
    position: absolute;
    top: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin: -12px 0 0 -20px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: $dogsinc-gold;
    filter: drop-shadow(0 0 6px $dogsinc-gold-glow);
    cursor: pointer;
    animation: dogsinc-bone-spin 1.2s linear infinite;

    &:focus-visible {
      outline: 2px solid $dogsinc-gold;
      outline-offset: 2px;
    }
  }

  @keyframes dogsinc-bone-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    .dogsinc-bone {
      animation: none;
    }
  }

  // Every layout except phone portrait: the stage is a size container (DogsIncApp), so the
  // tower takes the largest font where its full width AND height fit, leaving room for the
  // click box below (--dogsinc-click-reserve). Browsers without container queries keep the vh size.
  @media (min-width: $dogsinc-bp-landscape), (orientation: landscape) and (max-height: 500px) {
    .dogsinc-tower-wrap {
      font-size: $dogsinc-tower-size-landscape;
      font-size: min(
        calc((100cqw - #{$dogsinc-stage-pad-x} - var(--dogsinc-click-reserve-x, 0px)) / #{$dogsinc-tower-em-wide}),
        calc((100cqh - var(--dogsinc-click-reserve)) / var(--dogsinc-tower-em-tall, #{$dogsinc-tower-em-tall}))
      );
    }
  }

  @media (min-width: $dogsinc-bp-desktop) {
    .dogsinc-bone {
      width: 48px;
      height: 48px;
      margin: -14px 0 0 -24px;
    }
  }

</style>
