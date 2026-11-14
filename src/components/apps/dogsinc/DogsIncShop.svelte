<script>
  import { UserPlus, MousePointerClick, Armchair, SprayCan, Building2, Coffee, Toilet, Lock } from 'lucide-svelte';
  import { BUY_MODES } from './dogsIncConfig.js';
  import { formatMoney } from './dogsIncEngine.js';

  /** @type {object} engine snapshot */
  export let snap;
  /** @type {(id: string) => void} */
  export let onBuy;
  /** @type {(modeId: string) => void} */
  export let onMode;

  const ICONS = {
    hire: UserPlus, mouse: MousePointerClick, chair: Armchair, janitor: SprayCan,
    floor: Building2, cafe: Coffee, restroom: Toilet,
  };
  const ICON_SIZE = 20;
  const LOCKED_TEXT = 'Locked';
  const LOCKED_HINT = 'Finish missions to unlock.';
  const MAX_TEXT = 'MAX';
</script>

<section class="dogsinc-shop w-full flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col 2xl:flex-col" aria-label="Upgrades">
  <div class="dogsinc-shop-head">
    <p class="dogsinc-shop-title">UPGRADES</p>
    <div class="dogsinc-modes" role="group" aria-label="Buy amount">
      {#each BUY_MODES as mode (mode.id)}
        <button
          type="button"
          class:is-active={snap.buyMode === mode.id}
          aria-pressed={snap.buyMode === mode.id}
          onclick={() => onMode(mode.id)}
        >{mode.label}</button>
      {/each}
    </div>
  </div>

  <ul class="dogsinc-shop-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-2">
    {#each snap.shop as item (item.id)}
      <li>
        {#if item.unlocked}
          <button
            type="button"
            class="dogsinc-card"
            class:is-ready={item.canBuy}
            class:is-maxed={item.maxed}
            disabled={!item.canBuy}
            onclick={() => onBuy(item.id)}
          >
            <span class="dogsinc-card-icon"><svelte:component this={ICONS[item.id]} size={ICON_SIZE} /></span>
            <span class="dogsinc-card-body">
              <span class="dogsinc-card-name">{item.name} <span class="dogsinc-owned">x{item.owned}</span></span>
              <span class="dogsinc-card-desc">{item.desc}</span>
            </span>
            <span class="dogsinc-card-cost">
              {#if item.maxed}{MAX_TEXT}{:else}
                {formatMoney(item.cost)}
                {#if item.qty > 1}<small>+{item.qty}</small>{/if}
              {/if}
            </span>
          </button>
        {:else}
          <div class="dogsinc-card is-locked" aria-disabled="true">
            <span class="dogsinc-card-icon"><Lock size={ICON_SIZE} /></span>
            <span class="dogsinc-card-body">
              <span class="dogsinc-card-name">{LOCKED_TEXT}</span>
              <span class="dogsinc-card-desc">{LOCKED_HINT}</span>
            </span>
          </div>
        {/if}
      </li>
    {/each}
  </ul>
</section>

<style lang="scss">
  @use "../../../styles/dogsinc-variables" as *;

  .dogsinc-shop {
    display: flex;
    flex-direction: column;
    min-height: 0;
    font-family: $dogsinc-mono;
    color: $dogsinc-ink;
    font-size: 13px;
  }

  .dogsinc-shop-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
  }

  .dogsinc-shop-title {
    margin: 0;
    font-size: 11px;
    letter-spacing: 0.14em;
    color: $dogsinc-gold;
  }

  .dogsinc-modes {
    display: flex;
    border: 1px solid $dogsinc-line;
    border-radius: 6px;
    overflow: hidden;

    button {
      min-width: 44px;
      min-height: 30px;
      padding: 4px 8px;
      border: 0;
      background: transparent;
      color: $dogsinc-dim;
      font: inherit;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;

      &.is-active {
        background: $dogsinc-gold-soft;
        color: $dogsinc-gold;
      }

      &:focus-visible {
        outline: 1px solid $dogsinc-gold;
        outline-offset: -1px;
      }
    }
  }

  .dogsinc-shop-grid {
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .dogsinc-card {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 52px;
    padding: 8px 10px;
    border: 1px solid $dogsinc-line;
    border-radius: 8px;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, transform 0.08s;

    &.is-ready {
      border-color: $dogsinc-gold;
      background: $dogsinc-gold-soft;

      .dogsinc-card-icon,
      .dogsinc-card-cost {
        color: $dogsinc-gold;
      }
    }

    &:hover:not(:disabled),
    &:focus-visible {
      background: $dogsinc-hover-bg;
      outline: none;
      border-color: $dogsinc-ink;
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }

    &:disabled {
      cursor: default;
      opacity: 0.55;
    }

    &.is-maxed {
      opacity: 0.4;
    }

    &.is-locked {
      opacity: 0.4;
      cursor: default;
      grid-template-columns: auto minmax(0, 1fr);
    }
  }

  .dogsinc-card-icon {
    display: flex;
    color: $dogsinc-ink;
  }

  .dogsinc-card-body {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .dogsinc-card-name {
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dogsinc-owned,
  .dogsinc-card-desc {
    color: $dogsinc-dim;
    font-weight: 400;
  }

  .dogsinc-card-desc {
    font-size: 11px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dogsinc-card-cost {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;

    small {
      font-size: 10px;
      color: $dogsinc-dim;
    }
  }

  @media (min-width: $dogsinc-bp-desktop) {
    .dogsinc-shop {
      font-size: 14px;
    }
  }

  @media (min-width: $dogsinc-bp-tv) {
    .dogsinc-shop {
      font-size: 18px;
    }

    .dogsinc-card {
      min-height: 68px;
    }

    .dogsinc-card-desc,
    .dogsinc-shop-title,
    .dogsinc-modes button {
      font-size: 14px;
    }
  }
</style>
