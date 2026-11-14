<script>
  import { onMount, onDestroy } from 'svelte';
  import { ChevronDown } from 'lucide-svelte';
  import { DogsIncEngine, formatMoney } from './dogsIncEngine.js';
  import { buildClickBoxRows } from './dogsIncArt.js';
  import DogsIncTower from './DogsIncTower.svelte';
  import DogsIncMissions from './DogsIncMissions.svelte';
  import DogsIncShop from './DogsIncShop.svelte';
  import DogsIncDrawer from './DogsIncDrawer.svelte';

  // Phones (portrait, or landscape of any width) get the pull-down upgrades drawer;
  // tablets and up keep the shop in the side panel.
  const COMPACT_QUERY = '(max-width: 767px), (max-height: 500px)';
  const PARTICLE_MS = 900;
  const MAX_PARTICLES = 14;
  /** Click particles start somewhere across the middle of the box (percent of its width). */
  const PARTICLE_SPREAD = 60;
  const PARTICLE_OFFSET = 20;
  const TOAST_MS = 2600;
  const BUZZ_BUY_MS = 12;
  const BUZZ_BONE = [20, 40, 20];
  const BOOST_TAGS = { frenzy: 'FRENZY', rush: 'RUSH' };

  const engine = new DogsIncEngine();
  const game = engine.store;

  let compact = true;
  let drawerOpen = false;
  let particles = [];
  let particleSeq = 0;
  let toast = null;
  let toastTimer = null;
  let lastEventId = 0;
  let media = null;

  const syncCompact = () => {
    compact = media.matches;
    if (!compact) drawerOpen = false;
  };

  onMount(() => {
    engine.start();
    media = window.matchMedia(COMPACT_QUERY);
    syncCompact();
    if (media.addEventListener) media.addEventListener('change', syncCompact);
    else media.addListener(syncCompact);
  });

  onDestroy(() => {
    engine.stop();
    clearTimeout(toastTimer);
    if (!media) return;
    if (media.removeEventListener) media.removeEventListener('change', syncCompact);
    else media.removeListener(syncCompact);
  });

  /** Short haptic tick where the device supports it. */
  const buzz = (pattern) => {
    if (navigator.vibrate) navigator.vibrate(pattern);
  };

  /** Click: pay out, and float a "+$N" up from a random spot on the box. */
  function handleClick() {
    engine.click();
    particleSeq += 1;
    const id = particleSeq;
    const x = PARTICLE_OFFSET + Math.random() * PARTICLE_SPREAD;
    particles = particles.concat([{ id, x, text: '+' + formatMoney($game.clickValue) }]).slice(-MAX_PARTICLES);
    setTimeout(() => {
      particles = particles.filter((p) => p.id !== id);
    }, PARTICLE_MS);
  }

  function handleBuy(id) {
    if (engine.buy(id)) buzz(BUZZ_BUY_MS);
  }

  function handleCatch() {
    if (engine.catchFlier()) buzz(BUZZ_BONE);
  }

  const handleMode = (modeId) => engine.setBuyMode(modeId);
  const handleDismiss = () => engine.dismissWelcome();
  const closeDrawer = () => {
    drawerOpen = false;
  };

  /** Shows each new engine event once, then fades it out. */
  function showEvent(event) {
    if (!event || event.id === lastEventId) return;
    lastEventId = event.id;
    toast = event;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast = null;
    }, TOAST_MS);
  }

  $: showEvent($game.event);
  $: clickRows = buildClickBoxRows('+' + formatMoney($game.clickValue));
  $: clickLabel = 'Click the box. Earn ' + formatMoney($game.clickValue) + ' per click.';
  $: boostTag = $game.boost ? BOOST_TAGS[$game.boost.id] + ' ' + $game.boost.secondsLeft + 's' : '';
  $: timeLabel = $game.isNight ? 'NIGHT' : 'DAY';
  $: perSecLabel = formatMoney($game.perSec) + '/s';
  $: welcome = $game.welcomeGain >= 1 ? '+' + formatMoney($game.welcomeGain) : '';
  $: affordable = $game.shop.filter((item) => item.canBuy).length;
  $: tabLabel = (drawerOpen ? 'Close' : 'Open') + ' upgrades' + (affordable ? ', ' + affordable + ' affordable' : '');
</script>

<section class="dogsinc" aria-label="DOGS INC">
  <header class="dogsinc-topbar">
    <span class="dogsinc-cash">{formatMoney($game.cash)}</span>
    <span class="dogsinc-dim dogsinc-rate">{perSecLabel}</span>
    {#if boostTag}
      <span class="dogsinc-badge is-boost" class:is-frenzy={$game.boost.id === 'frenzy'}>{boostTag}</span>
    {:else}
      <span class="dogsinc-badge">{timeLabel}</span>
    {/if}
    <button
      type="button"
      class="dogsinc-tab"
      class:is-open={drawerOpen}
      class:has-deals={affordable > 0}
      aria-expanded={drawerOpen}
      aria-controls="dogsinc-upgrades"
      aria-label={tabLabel}
      onclick={() => (drawerOpen = !drawerOpen)}
    >
      <span>UPGRADES</span>
      {#if affordable}<span class="dogsinc-tab-count">{affordable}</span>{/if}
      <span class="dogsinc-tab-arrow"><ChevronDown size={16} /></span>
    </button>
  </header>

  <div class="dogsinc-body">
    <aside class="dogsinc-rail" aria-label="Company stats">
      <p class="dogsinc-label">CASH</p>
      <p class="dogsinc-cash-big">{formatMoney($game.cash)}</p>
      <p class="dogsinc-dim">{perSecLabel} · {timeLabel}</p>
      {#if boostTag}<p class="dogsinc-rail-boost" class:is-frenzy={$game.boost.id === 'frenzy'}>{$game.boost.label} x{$game.boost.mult} · {$game.boost.secondsLeft}s</p>{/if}
      <dl class="dogsinc-stats">
        <div><dt>Floors</dt><dd>{$game.floors}</dd></div>
        <div><dt>Employees</dt><dd>{$game.owned.hire}</dd></div>
        <div><dt>Janitors</dt><dd>{$game.owned.janitor}</dd></div>
        <div><dt>Cafes</dt><dd>{$game.owned.cafe}</dd></div>
        <div><dt>Restrooms</dt><dd>{$game.owned.restroom}</dd></div>
        <div><dt>Nights</dt><dd>{$game.nights}</dd></div>
        <div><dt>Clicks</dt><dd>{$game.clicks}</dd></div>
        <div><dt>Golden bones</dt><dd>{$game.bones}</dd></div>
      </dl>
    </aside>

    <div class="dogsinc-stage">
      {#if welcome}
        <button type="button" class="dogsinc-welcome" onclick={handleDismiss}>
          While you were away: {welcome}
        </button>
      {/if}
      <DogsIncTower snap={$game} onCatch={handleCatch} />
      <div class="dogsinc-click-wrap">
        <button
          type="button"
          class="dogsinc-click"
          class:is-frenzy={$game.boost && $game.boost.id === 'frenzy'}
          onclick={handleClick}
          aria-label={clickLabel}
        >
          <pre aria-hidden="true">{clickRows.join('\n')}</pre>
        </button>
        <div class="dogsinc-particles" aria-hidden="true">
          {#each particles as p (p.id)}
            <span style="left: {p.x}%">{p.text}</span>
          {/each}
        </div>
        {#if toast}
          <p class="dogsinc-toast" class:is-goal={toast.kind === 'goal'} role="status">{toast.text}</p>
        {/if}
      </div>
    </div>

    <div class="dogsinc-side-wrap">
      <DogsIncMissions snap={$game} />
      {#if !compact}
        <div class="dogsinc-side-shop">
          <DogsIncShop snap={$game} onBuy={handleBuy} onMode={handleMode} />
        </div>
      {/if}
    </div>
  </div>

  {#if compact}
    <DogsIncDrawer open={drawerOpen} onClose={closeDrawer}>
      <p class="dogsinc-drawer-stats">
        <span>Floors {$game.floors}</span><span>Staff {$game.owned.hire}</span><span>Janitors {$game.owned.janitor}</span><span>Bones {$game.bones}</span>
      </p>
      <DogsIncShop snap={$game} onBuy={handleBuy} onMode={handleMode} />
    </DogsIncDrawer>
  {/if}
</section>

<style lang="scss">
  @use "../../../styles/dogsinc-variables" as *;

  // Layout modes: phone portrait (base) · phone landscape / small tablet (row) ·
  // tablet & up with real height (rail | stage | side panel) · desktop · TV.
  $tablet-up: "(min-width: #{$dogsinc-bp-tablet}) and (min-height: 501px)";

  .dogsinc {
    position: relative;
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

  // ── Topbar: fixed height so the upgrades tab can never push the click box down.
  .dogsinc-topbar {
    position: relative;
    z-index: 6;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    height: $dogsinc-topbar-h;
    padding: 0 8px 0 12px;
    border-bottom: 1px solid $dogsinc-line;
    background: $dogsinc-stage-bg;
    font-size: 14px;
  }

  .dogsinc-cash {
    color: $dogsinc-gold;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    min-width: 8ch;
  }

  .dogsinc-rate {
    font-variant-numeric: tabular-nums;
  }

  .dogsinc-badge {
    padding: 0 6px;
    border: 1px solid $dogsinc-line;
    font-size: 11px;
    letter-spacing: 0.1em;
    white-space: nowrap;

    &.is-boost {
      border-color: $dogsinc-rush;
      color: $dogsinc-rush;
    }

    &.is-frenzy {
      border-color: $dogsinc-frenzy;
      color: $dogsinc-frenzy;
    }
  }

  // The pull tab: same gold as the click box, glowing when something is affordable.
  .dogsinc-tab {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 28px;
    margin-left: auto;
    padding: 0 8px 0 10px;
    border: 0;
    border-radius: 6px;
    background: $dogsinc-gold;
    color: $dogsinc-on-gold;
    font: inherit;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: box-shadow 0.2s;

    &.has-deals {
      animation: dogsinc-tab-glow 1.6s ease-in-out infinite;
    }

    &:focus-visible {
      outline: 2px solid $dogsinc-ink;
      outline-offset: 2px;
    }
  }

  .dogsinc-tab-count {
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    border-radius: 9px;
    background: $dogsinc-on-gold;
    color: $dogsinc-gold;
    font-size: 11px;
    line-height: 18px;
    text-align: center;
  }

  .dogsinc-tab-arrow {
    display: flex;
    transition: transform $dogsinc-drawer-ms ease-out;
  }

  .is-open .dogsinc-tab-arrow {
    transform: rotate(180deg);
  }

  @keyframes dogsinc-tab-glow {
    0%, 100% { box-shadow: 0 0 0 transparent; }
    50% { box-shadow: 0 0 12px $dogsinc-gold-glow; }
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

  // ── Stage: tower + click box. Phone portrait keeps it at the top, missions below.
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

  .dogsinc-click-wrap {
    position: relative;
    margin-top: 6px;
  }

  .dogsinc-click {
    display: block;
    padding: 0;
    border: 0;
    background: transparent;
    color: $dogsinc-gold;
    cursor: pointer;
    text-shadow: 0 0 10px $dogsinc-gold-glow;
    transition: transform 0.05s ease-out;
    touch-action: manipulation;

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
      transform: scale(0.96);
    }

    &:focus-visible {
      outline: 1px solid $dogsinc-ink;
      outline-offset: 4px;
    }

    &.is-frenzy {
      color: $dogsinc-frenzy;
      text-shadow: 0 0 12px $dogsinc-frenzy;
      animation: dogsinc-frenzy-shake 0.25s linear infinite;
    }
  }

  @keyframes dogsinc-frenzy-shake {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(1px, -1px); }
    75% { transform: translate(-1px, 1px); }
  }

  .dogsinc-particles {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 0;
    pointer-events: none;

    span {
      position: absolute;
      top: 0;
      color: $dogsinc-gold;
      font-size: 13px;
      font-weight: 800;
      white-space: nowrap;
      text-shadow: 0 0 8px $dogsinc-gold-glow;
      animation: dogsinc-float $dogsinc-particle-ms ease-out forwards;
    }
  }

  @keyframes dogsinc-float {
    from { opacity: 1; transform: translate(-50%, 0); }
    to { opacity: 0; transform: translate(-50%, -70px); }
  }

  .dogsinc-toast {
    position: absolute;
    bottom: 100%;
    left: 50%;
    z-index: 3;
    width: max-content;
    max-width: 92vw;
    margin: 0 0 10px;
    padding: 6px 12px;
    border: 1px solid $dogsinc-gold;
    border-radius: 999px;
    background: $dogsinc-drawer-bg;
    color: $dogsinc-gold;
    font-size: 12px;
    font-weight: 700;
    text-align: center;
    box-shadow: 0 0 14px $dogsinc-gold-glow;
    transform: translateX(-50%);
    animation: dogsinc-toast-in 0.25s ease-out;

    &.is-goal {
      border-color: $dogsinc-ink;
      color: $dogsinc-ink;
      box-shadow: 0 0 14px rgba(0, 215, 95, 0.35);
    }
  }

  @keyframes dogsinc-toast-in {
    from { opacity: 0; transform: translate(-50%, 8px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }

  .dogsinc-welcome {
    position: absolute;
    top: 4px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    padding: 4px 10px;
    border: 1px solid $dogsinc-gold;
    background: $dogsinc-stage-bg;
    color: $dogsinc-gold;
    font: inherit;
    font-size: 12px;
    white-space: nowrap;
    cursor: pointer;
  }

  // ── Missions: full width at the bottom of a phone, filling the rest of the screen.
  .dogsinc-side-wrap {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    padding: 10px 0 0;
    border-top: 1px solid $dogsinc-line;

    > :global(.dogsinc-missions) {
      flex: 1 1 auto;
      padding: 0 10px 10px;
    }
  }

  .dogsinc-side-shop {
    flex-shrink: 0;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid $dogsinc-line;
  }

  .dogsinc-drawer-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 14px;
    margin: 0 0 10px;
    font-size: 11px;
    color: $dogsinc-dim;
  }

  // ── Stats rail: tablets and up only.
  .dogsinc-rail {
    display: none;
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

  .dogsinc-rail-boost {
    margin: 6px 0 0;
    color: $dogsinc-rush;
    font-weight: 700;

    &.is-frenzy {
      color: $dogsinc-frenzy;
    }
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

  // Very narrow phones: the per-second rate yields its space to the tab.
  @media (max-width: 359px) {
    .dogsinc-rate {
      display: none;
    }
  }

  // ── Landscape phones and small tablets: stage left, missions right (saves height).
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
      padding: 8px 0 0;
      border-top: 0;
      border-left: 1px solid $dogsinc-line;
    }

    .dogsinc-click pre {
      font-size: 11px;
    }
  }

  // ── Tablet+: stats rail | stage | missions + shop. The topbar and drawer give way to the rail.
  @media #{$tablet-up} {
    .dogsinc-topbar {
      display: none;
    }

    .dogsinc-rail {
      display: flex;
    }

    .dogsinc-side-wrap {
      flex: 0 0 18rem;
      padding: 12px;
      overflow-y: auto;

      > :global(.dogsinc-missions) {
        flex: 0 0 auto;
        padding: 0;
      }
    }

    .dogsinc-click pre {
      font-size: 14px;
    }
  }

  // ── Desktop: wider rail and panel, content capped at max-w-7xl.
  @media (min-width: $dogsinc-bp-desktop) and (min-height: 501px) {
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

  // ── TV / ultra-wide: scale type and panels so nothing floats in empty space.
  @media (min-width: $dogsinc-bp-tv) and (min-height: 501px) {
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

    .dogsinc-particles span,
    .dogsinc-toast {
      font-size: 18px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .dogsinc-tab.has-deals,
    .dogsinc-click.is-frenzy {
      animation: none;
    }
  }
</style>
