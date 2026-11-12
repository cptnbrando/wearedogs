<script>
  import { onMount, onDestroy } from 'svelte';
  import { DogsIncEngine, formatMoney } from './dogsIncEngine.js';
  import { buildClickBoxRows } from './dogsIncArt.js';
  import DogsIncTower from './DogsIncTower.svelte';
  import DogsIncSidePanel from './DogsIncSidePanel.svelte';

  const engine = new DogsIncEngine();
  const game = engine.store;

  onMount(() => engine.start());
  onDestroy(() => engine.stop());

  const handleClick = () => engine.click();
  const handleBuy = (id) => engine.buy(id);
  const handleDismiss = () => engine.dismissWelcome();

  $: clickRows = buildClickBoxRows('+' + formatMoney($game.clickValue));
  $: clickLabel = 'Click the box. Earn ' + formatMoney($game.clickValue) + ' per click.';
  $: timeLabel = $game.isNight ? 'NIGHT' : 'DAY';
  $: perSecLabel = formatMoney($game.perSec) + '/s';
  $: welcome = $game.welcomeGain >= 1 ? '+' + formatMoney($game.welcomeGain) : '';
</script>

<section class="dogsinc" aria-label="DOGS INC">
  <header class="dogsinc-topbar flex md:hidden">
    <span class="dogsinc-cash">{formatMoney($game.cash)}</span>
    <span class="dogsinc-dim">{perSecLabel}</span>
    <span class="dogsinc-badge">{timeLabel}</span>
  </header>

  <div class="dogsinc-body">
    <aside class="dogsinc-rail hidden md:flex" aria-label="Company stats">
      <p class="dogsinc-label">CASH</p>
      <p class="dogsinc-cash-big">{formatMoney($game.cash)}</p>
      <p class="dogsinc-dim">{perSecLabel} · {timeLabel}</p>
      <dl class="dogsinc-stats">
        <div><dt>Floors</dt><dd>{$game.floors}</dd></div>
        <div><dt>Employees</dt><dd>{$game.owned.hire}</dd></div>
        <div><dt>Janitors</dt><dd>{$game.owned.janitor}</dd></div>
        <div><dt>Cafes</dt><dd>{$game.owned.cafe}</dd></div>
        <div><dt>Restrooms</dt><dd>{$game.owned.restroom}</dd></div>
        <div><dt>Nights</dt><dd>{$game.nights}</dd></div>
        <div><dt>Clicks</dt><dd>{$game.clicks}</dd></div>
      </dl>
    </aside>

    <div class="dogsinc-stage">
      {#if welcome}
        <button type="button" class="dogsinc-welcome" onclick={handleDismiss}>
          While you were away: {welcome}
        </button>
      {/if}
      <DogsIncTower snap={$game} />
      <button type="button" class="dogsinc-click" onclick={handleClick} aria-label={clickLabel}>
        <pre aria-hidden="true">{clickRows.join('\n')}</pre>
      </button>
    </div>

    <div class="dogsinc-side-wrap">
      <DogsIncSidePanel snap={$game} onBuy={handleBuy} />
    </div>
  </div>
</section>

<style lang="scss">
  @use "../../../styles/dogsinc-variables" as *;

  .dogsinc {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    background: $dogsinc-stage-bg;
    color: $dogsinc-ink;
    font-family: $dogsinc-mono;
  }

  .dogsinc-topbar {
    align-items: baseline;
    justify-content: space-between;
    flex-shrink: 0;
    padding: 8px 12px;
    border-bottom: 1px solid $dogsinc-line;
    font-size: 14px;
  }

  .dogsinc-cash {
    color: $dogsinc-gold;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    min-width: 8ch;
  }

  .dogsinc-badge {
    padding: 0 6px;
    border: 1px solid $dogsinc-line;
    font-size: 11px;
    letter-spacing: 0.1em;
  }

  .dogsinc-dim {
    color: $dogsinc-dim;
  }

  .dogsinc-label {
    margin: 0 0 4px;
    font-size: 11px;
    letter-spacing: 0.12em;
    color: $dogsinc-dim;
  }

  .dogsinc-body {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
  }

  // ── Stage: tower + click box. Mobile keeps it at the top, the panel sits below.
  .dogsinc-stage {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    min-width: 0;
    padding: 6px;
  }

  .dogsinc-click {
    margin-top: 6px;
    padding: 0;
    border: 0;
    background: transparent;
    color: $dogsinc-gold;
    cursor: pointer;
    transition: transform 0.05s ease-out;

    pre {
      margin: 0;
      font-family: $dogsinc-mono;
      font-size: 14px;
      line-height: 1.15;
      white-space: pre;
    }

    &:hover {
      color: $dogsinc-ink;
    }

    &:active {
      transform: scale(0.97);
    }

    &:focus-visible {
      outline: 1px solid $dogsinc-ink;
      outline-offset: 4px;
    }
  }

  .dogsinc-welcome {
    position: absolute;
    top: 4px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    padding: 4px 10px;
    border: 1px solid $dogsinc-gold;
    background: $dogsinc-stage-bg;
    color: $dogsinc-gold;
    font: inherit;
    font-size: 12px;
    white-space: nowrap;
    cursor: pointer;
  }

  .dogsinc-side-wrap {
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
    padding: 0 10px 10px;
  }

  // ── Stats rail (tablet and up)
  .dogsinc-rail {
    flex-direction: column;
    flex: 0 0 auto;
    width: 13rem;
    padding: 12px;
    border-right: 1px solid $dogsinc-line;
    font-size: 13px;
  }

  .dogsinc-cash-big {
    margin: 0;
    color: $dogsinc-gold;
    font-size: 1.6em;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .dogsinc-stats {
    margin: 12px 0 0;
    padding: 0;

    div {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      border-bottom: 1px dashed $dogsinc-line;
    }

    dt {
      color: $dogsinc-dim;
    }

    dd {
      margin: 0;
      font-variant-numeric: tabular-nums;
    }
  }

  // ── Landscape phones: stage left, panel right (two columns to save height)
  @media (min-width: $dogsinc-bp-landscape) {
    .dogsinc-body {
      flex-direction: row;
    }

    .dogsinc-stage {
      flex: 1 1 0;
      justify-content: center;
    }

    .dogsinc-side-wrap {
      flex: 0 0 42%;
      padding: 8px 8px 8px 0;
    }

    .dogsinc-click pre {
      font-size: 11px;
    }
  }

  // ── Tablet+: stats rail | stage | side panel
  @media (min-width: $dogsinc-bp-tablet) {
    .dogsinc-stage {
      flex: 1 1 0;
    }

    .dogsinc-side-wrap {
      flex: 0 0 18rem;
      padding: 12px;
      border-left: 1px solid $dogsinc-line;
    }

    .dogsinc-click pre {
      font-size: 14px;
    }
  }

  // ── Desktop: wider rail and panel, content capped at max-w-7xl
  @media (min-width: $dogsinc-bp-desktop) {
    .dogsinc-body {
      max-width: 80rem;
      margin: 0 auto;
      width: 100%;
    }

    .dogsinc-rail {
      width: 16rem;
      font-size: 15px;
    }

    .dogsinc-side-wrap {
      flex: 0 0 24rem;
    }

    .dogsinc-click pre {
      font-size: 16px;
    }
  }

  // ── TV / ultra-wide: scale type and panels up so nothing floats in empty space
  @media (min-width: $dogsinc-bp-tv) {
    .dogsinc-body {
      max-width: 120rem;
    }

    .dogsinc-rail {
      width: 22rem;
      font-size: 20px;
    }

    .dogsinc-side-wrap {
      flex: 0 0 34rem;
    }

    .dogsinc-click pre {
      font-size: 22px;
    }

    .dogsinc-topbar {
      font-size: 20px;
    }
  }
</style>
