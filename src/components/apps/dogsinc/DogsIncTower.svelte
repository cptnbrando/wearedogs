<script>
  import { buildTowerRows } from './dogsIncArt.js';

  /** @type {object} engine snapshot */
  export let snap;

  $: rows = buildTowerRows(snap);
</script>

<pre class="dogsinc-tower" aria-hidden="true">{rows.join('\n')}</pre>

<style lang="scss">
  @use "../../../styles/dogsinc-variables" as *;

  .dogsinc-tower {
    margin: 0;
    font-family: $dogsinc-mono;
    font-size: $dogsinc-tower-size-mobile;
    line-height: $dogsinc-tower-line-height;
    color: $dogsinc-ink;
    white-space: pre;
    overflow: hidden;
    user-select: none;
  }

  @media (min-width: $dogsinc-bp-landscape) {
    .dogsinc-tower {
      font-size: $dogsinc-tower-size-landscape;
    }
  }

  @media (min-width: $dogsinc-bp-tablet) {
    .dogsinc-tower {
      font-size: $dogsinc-tower-size-tablet;
    }
  }

  @media (min-width: $dogsinc-bp-desktop) {
    .dogsinc-tower {
      font-size: $dogsinc-tower-size-desktop;
    }
  }

  @media (min-width: $dogsinc-bp-tv) {
    .dogsinc-tower {
      font-size: $dogsinc-tower-size-tv;
    }
  }
</style>
