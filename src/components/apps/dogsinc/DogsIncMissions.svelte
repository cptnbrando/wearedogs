<script>
  import { CircleCheck, Target, Circle } from 'lucide-svelte';
  import { GOALS, SHOP_ITEMS } from './dogsIncConfig.js';

  /** @type {object} engine snapshot */
  export let snap;

  const ICON_SIZE = 14;
  const PERCENT = 100;

  $: checklist = GOALS.map((goal, index) => ({
    text: goal.text,
    done: index < snap.goalsDone,
    current: index === snap.goalsDone,
  }));
  $: ratio = snap.goal.min > 0 ? Math.min(1, snap.goal.value / snap.goal.min) : 1;
  $: missionNo = Math.min(snap.goalsDone + 1, GOALS.length);
  $: inTutorial = snap.goalsDone < GOALS.length;
  $: unlocks = SHOP_ITEMS.filter((item) => item.unlockGoal === snap.goalsDone + 1).map((item) => item.name);
</script>

<section class="dogsinc-missions w-full flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col 2xl:flex-col" aria-label="Missions">
  <div class="dogsinc-now">
    <p class="dogsinc-now-label">
      <span>{inTutorial ? 'MISSION ' + missionNo + ' / ' + GOALS.length : 'BONUS MISSION'}</span>
      <span class="dogsinc-now-count">{Math.floor(Math.min(snap.goal.value, snap.goal.min))} / {snap.goal.min}</span>
    </p>
    <p class="dogsinc-now-text">{snap.goal.text}</p>
    <div
      class="dogsinc-meter"
      role="progressbar"
      aria-label="Mission progress"
      aria-valuemin="0"
      aria-valuemax={PERCENT}
      aria-valuenow={Math.round(ratio * PERCENT)}
    >
      <span style="width: {ratio * PERCENT}%"></span>
    </div>
    {#if unlocks.length}<p class="dogsinc-unlocks">Unlocks {unlocks.join(' + ')}</p>{/if}
  </div>

  <ol class="dogsinc-checklist">
    {#each checklist as item, index (index)}
      <li class:is-done={item.done} class:is-current={item.current}>
        {#if item.done}<CircleCheck size={ICON_SIZE} />{:else if item.current}<Target size={ICON_SIZE} />{:else}<Circle size={ICON_SIZE} />{/if}
        <span>{item.text}</span>
      </li>
    {/each}
  </ol>
</section>

<style lang="scss">
  @use "../../../styles/dogsinc-variables" as *;

  .dogsinc-missions {
    display: flex;
    flex-direction: column;
    min-height: 0;
    font-family: $dogsinc-mono;
    color: $dogsinc-ink;
    font-size: 13px;
  }

  .dogsinc-now {
    flex-shrink: 0;
    padding: 10px 12px;
    border: 1px solid $dogsinc-gold;
    border-radius: 8px;
    background: $dogsinc-gold-soft;
  }

  .dogsinc-now-label {
    display: flex;
    justify-content: space-between;
    margin: 0 0 4px;
    font-size: 10px;
    letter-spacing: 0.14em;
    color: $dogsinc-dim;
  }

  .dogsinc-now-count {
    letter-spacing: 0;
    font-variant-numeric: tabular-nums;
  }

  .dogsinc-now-text {
    margin: 0 0 8px;
    color: $dogsinc-gold;
    font-weight: 700;
  }

  .dogsinc-meter {
    height: 8px;
    border-radius: 4px;
    background: $dogsinc-line;
    overflow: hidden;

    span {
      display: block;
      height: 100%;
      background: $dogsinc-gold;
      box-shadow: 0 0 8px $dogsinc-gold-glow;
      transition: width 0.25s ease-out;
    }
  }

  .dogsinc-unlocks {
    margin: 6px 0 0;
    font-size: 11px;
    color: $dogsinc-dim;
  }

  .dogsinc-checklist {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    margin: 8px 0 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 3px 0;
      color: $dogsinc-dim;
      font-size: 12px;

      :global(svg) {
        flex-shrink: 0;
      }

      &.is-done {
        color: $dogsinc-ink;
      }

      &.is-current {
        color: $dogsinc-gold;
      }
    }
  }

  // Landscape phones: two checklist columns so more of the list shows in the short panel.
  @media (orientation: landscape) and (max-height: 500px) {
    .dogsinc-checklist {
      columns: 2;
      column-gap: 12px;

      li {
        break-inside: avoid;
      }
    }
  }

  @media (min-width: $dogsinc-bp-desktop) {
    .dogsinc-missions {
      font-size: 15px;
    }

    .dogsinc-checklist li {
      font-size: 13px;
    }
  }

  @media (min-width: $dogsinc-bp-tv) {
    .dogsinc-missions {
      font-size: 20px;
    }

    .dogsinc-checklist li {
      font-size: 17px;
    }

    .dogsinc-now-label {
      font-size: 13px;
    }
  }
</style>
