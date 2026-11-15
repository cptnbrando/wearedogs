<script>
  import { ArrowUpRight } from "lucide-svelte";
  import AppNails from "./AppNails.svelte";

  let {
    app,
    index,
    isFocused,
    isKeyboardNav,
    tabIndex = -1,
    accent = null,
    onclick,
    onmouseenter,
    onfocus,
  } = $props();

  const EXTERNAL_REL = "noopener noreferrer";
  const EXTERNAL_TARGET = "_blank";

  const Icon = $derived(app.icon);
  // Apps on their own site render as links so middle-click, long-press and "open in new tab" all work.
  const isExternal = $derived(!!app.href);
  let buttonEl = $state(null);

  // Sync focus state programmatically for keyboard navigation
  $effect(() => {
    if (isFocused && isKeyboardNav && buttonEl) {
      buttonEl.focus();
    }
  });
</script>

{#snippet cardBody()}
  <div class="app-visual">
    <AppNails appId={app.id} />
  </div>

  <div class="app-meta">
    <span class="app-title">
      <Icon size={14} /> {app.title}
      {#if isExternal}
        <ArrowUpRight size={14} class="app-external-mark" aria-hidden="true" />
      {/if}
    </span>
    <span class="app-desc">{app.desc}</span>
  </div>
{/snippet}

{#if isExternal}
  <a
    bind:this={buttonEl}
    class="app-card external"
    class:focused={isFocused && isKeyboardNav}
    style={accent ? `--tile-accent: ${accent}` : undefined}
    data-app-idx={index}
    tabindex={tabIndex}
    href={app.href}
    target={EXTERNAL_TARGET}
    rel={EXTERNAL_REL}
    aria-label={`${app.title} (opens in a new tab)`}
    {onclick}
    {onmouseenter}
    {onfocus}
  >
    {@render cardBody()}
  </a>
{:else}
  <button
    bind:this={buttonEl}
    class="app-card"
    class:focused={isFocused && isKeyboardNav}
    data-app-idx={index}
    tabindex={tabIndex}
    {onclick}
    {onmouseenter}
    {onfocus}
  >
    {@render cardBody()}
  </button>
{/if}

<style>
  .app-card {
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%;
    text-align: left;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 16px;
    cursor: pointer;
    color: inherit;
    font: inherit;
    text-decoration: none;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    box-sizing: border-box;
  }

  .app-card:hover,
  .app-card:focus-visible,
  .app-card.focused {
    background: rgba(255, 255, 255, 0.06);
    transform: scale(1.01) translateY(-2px);
    border-color: rgba(150, 150, 150, 0.45);
    box-shadow: 0 8px 30px rgba(150, 150, 150, 0.08);
    outline: none;
  }

  /* DOGS apps on their own site: a colored border at rest sets them apart.
     The accent comes from ToolboxPanel's appColors. Plain var() colors (no
     color-mix) so older browsers still draw the border. */
  /* Padding drops by the extra border width so every tile keeps the same size. */
  .app-card.external {
    border: 2px solid var(--tile-accent, rgba(255, 255, 255, 0.5));
    padding: 15px;
  }

  .app-card.external:hover,
  .app-card.external:focus-visible,
  .app-card.external.focused {
    border-color: var(--tile-accent, rgba(255, 255, 255, 0.5));
    box-shadow:
      0 0 0 1px var(--tile-accent, rgba(255, 255, 255, 0.5)),
      0 8px 30px rgba(0, 0, 0, 0.35);
  }

  .app-visual {
    width: 64px;
    height: 64px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }

  .app-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .app-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: white;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .app-title :global(.app-external-mark) {
    color: var(--tile-accent, rgba(255, 255, 255, 0.5));
    opacity: 0.85;
    flex-shrink: 0;
  }

  .app-desc {
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.45);
    line-height: 1.3;
  }

  @media (max-width: 768px) {
    .app-card {
      padding: 12px;
      gap: 12px;
    }

    .app-card.external {
      padding: 11px;
    }
  }

  @media (min-width: 1920px) {
    .app-card.external {
      border-width: 3px;
      padding: 14px;
    }
  }
</style>
