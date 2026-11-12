<script>
  import { GOALS } from './dogsIncConfig.js';
  import { buildBarRow } from './dogsIncArt.js';
  import { formatMoney } from './dogsIncEngine.js';

  /** @type {object} engine snapshot */
  export let snap;
  /** @type {(id: string) => void} */
  export let onBuy;

  const LOCKED_TEXT = '???';
  const LOCKED_HINT = 'Finish the goals to unlock.';
  const MAX_TEXT = 'MAX';

  $: checklist = GOALS.map((goal, index) => ({
    text: goal.text,
    done: index < snap.goalsDone,
    current: index === snap.goalsDone,
  }));
  $: ratio = snap.goal.min > 0 ? snap.goal.value / snap.goal.min : 1;
  $: bar = buildBarRow(ratio);
</script>

<section class="dogsinc-side" aria-label="Goals and shop">
  <div class="dogsinc-goal">
    <p class="dogsinc-label">NOW</p>
    <p class="dogsinc-goal-text">{snap.goal.text}</p>
    <p class="dogsinc-bar" aria-hidden="true">{bar}</p>
    <p class="dogsinc-dim">{Math.min(snap.goal.value, snap.goal.min)} / {snap.goal.min}</p>
  </div>

  <ol class="dogsinc-checklist">
    {#each checklist as item, index (index)}
      <li class="dogsinc-check" class:is-done={item.done} class:is-current={item.current}>
        <span aria-hidden="true">{item.done ? '[x]' : item.current ? '[>]' : '[ ]'}</span>
        <span>{item.text}</span>
      </li>
    {/each}
  </ol>

  <p class="dogsinc-label">SHOP</p>
  <ul class="dogsinc-shop">
    {#each snap.shop as item (item.id)}
      <li>
        {#if item.unlocked}
          <button
            type="button"
            class="dogsinc-shop-item"
            disabled={!item.canBuy}
            onclick={() => onBuy(item.id)}
          >
            <span class="dogsinc-shop-name">
              {item.name}
              <span class="dogsinc-dim">x{item.owned}</span>
            </span>
            <span class="dogsinc-dim">{item.desc}</span>
            <span class="dogsinc-cost">{item.maxed ? MAX_TEXT : formatMoney(item.cost)}</span>
          </button>
        {:else}
          <div class="dogsinc-shop-item is-locked" aria-disabled="true">
            <span class="dogsinc-shop-name">{LOCKED_TEXT}</span>
            <span class="dogsinc-dim">{LOCKED_HINT}</span>
          </div>
        {/if}
      </li>
    {/each}
  </ul>
</section>

<style lang="scss">
  @use "../../../styles/dogsinc-variables" as *;

  .dogsinc-side {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow-y: auto;
    font-family: $dogsinc-mono;
    color: $dogsinc-ink;
    font-size: 13px;
  }

  .dogsinc-label {
    margin: 10px 0 4px;
    font-size: 11px;
    letter-spacing: 0.12em;
    color: $dogsinc-dim;
  }

  .dogsinc-goal {
    padding: 10px;
    border: 1px solid $dogsinc-line;
  }

  .dogsinc-goal-text {
    margin: 0 0 6px;
    color: $dogsinc-gold;
  }

  .dogsinc-bar {
    margin: 0 0 4px;
    white-space: pre;
  }

  .dogsinc-dim {
    color: $dogsinc-dim;
  }

  .dogsinc-checklist {
    margin: 8px 0 0;
    padding: 0;
    list-style: none;
  }

  .dogsinc-check {
    display: flex;
    margin: 2px 0;
    color: $dogsinc-dim;
    font-size: 12px;

    & > span:first-child {
      width: 3em;
      flex-shrink: 0;
    }

    &.is-done {
      color: $dogsinc-ink;
    }

    &.is-current {
      color: $dogsinc-gold;
    }
  }

  .dogsinc-shop {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .dogsinc-shop-item {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 4px 0;
    padding: 8px 10px;
    border: 1px solid $dogsinc-line;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;

    &:hover:not(:disabled),
    &:focus-visible {
      background: $dogsinc-hover-bg;
      outline: 1px solid $dogsinc-ink;
      outline-offset: -1px;
    }

    &:disabled {
      opacity: 0.45;
      cursor: default;
    }

    &.is-locked {
      opacity: 0.5;
    }
  }

  .dogsinc-shop-name {
    font-weight: 600;
  }

  .dogsinc-cost {
    margin-top: 2px;
    color: $dogsinc-gold;
  }

  @media (min-width: $dogsinc-bp-desktop) {
    .dogsinc-side {
      font-size: 15px;
    }
  }

  @media (min-width: $dogsinc-bp-tv) {
    .dogsinc-side {
      font-size: 20px;
    }

    .dogsinc-label {
      font-size: 14px;
    }
  }
</style>
