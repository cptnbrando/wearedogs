<script>
  /**
   * CropPicker — centre-crop aspect chooser for image outputs.
   * @prop {string} value - selected CROP_PRESETS id
   * @prop {(id: string) => void} onpick
   * @prop {boolean} [disabled]
   * @prop {string} [label]
   */
  import { CROP_PRESETS } from "../../lib/imageCrop.js";

  export let value;
  export let onpick;
  export let disabled = false;
  export let label = "Crop";
</script>

<div
  class="crop-picker flex flex-row flex-wrap sm:flex-wrap md:flex-wrap lg:flex-wrap xl:flex-wrap 2xl:flex-wrap items-center gap-1.5 sm:gap-1.5 md:gap-2 lg:gap-2 xl:gap-2 2xl:gap-3 min-w-0"
  role="radiogroup"
  aria-label="{label} aspect"
>
  <span class="crop-label text-[10px] sm:text-[10px] md:text-[11px] lg:text-[11px] xl:text-xs 2xl:text-sm shrink-0">{label}</span>
  {#each CROP_PRESETS as preset (preset.id)}
    <button
      type="button"
      role="radio"
      aria-checked={value === preset.id}
      class="crop-chip text-[10px] sm:text-[10px] md:text-[11px] lg:text-[11px] xl:text-[11px] 2xl:text-sm px-2 sm:px-1.5 md:px-2 lg:px-2 xl:px-2.5 2xl:px-3 py-1 sm:py-0.5 md:py-1 lg:py-1 xl:py-1 2xl:py-1.5"
      class:selected={value === preset.id}
      {disabled}
      onclick={() => onpick(preset.id)}
    >
      {preset.label}
    </button>
  {/each}
</div>

<style lang="scss">
  @use "../../styles/variables" as vars;

  .crop-label {
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.5);
  }

  .crop-chip {
    border-radius: 6px;
    font-family: monospace;
    font-weight: 700;
    line-height: 1.2;
    color: rgba(255, 255, 255, 0.55);
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition:
      color vars.$transition-speed-fast,
      border-color vars.$transition-speed-fast,
      background vars.$transition-speed-fast;

    &:hover:not(:disabled) {
      color: #fff;
    }

    &:focus-visible {
      outline: 2px solid vars.$color-image-orange;
      outline-offset: 1px;
    }

    &.selected {
      color: vars.$color-image-orange;
      border-color: vars.$color-image-orange;
      background: vars.$color-image-orange-soft;
    }

    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }
</style>
