<script>
  import AppNails from "./AppNails.svelte";

  let {
    app,
    index,
    isFocused,
    isKeyboardNav,
    tabIndex = -1,
    onclick,
    onmouseenter,
    onfocus,
    // Capability gating: non-empty reason = this browser can't run the app.
    // Card stays focusable (keyboard-nav indexing untouched) but is greyed
    // and clicking shows the reason instead of loading.
    disabledReason = "",
  } = $props();

  const Icon = $derived(app.icon);
  let buttonEl = $state(null);

  // Sync focus state programmatically for keyboard navigation
  $effect(() => {
    if (isFocused && isKeyboardNav && buttonEl) {
      buttonEl.focus();
    }
  });
</script>

<button
  bind:this={buttonEl}
  class="app-card"
  class:focused={isFocused && isKeyboardNav}
  class:unsupported={!!disabledReason}
  data-app-idx={index}
  tabindex={tabIndex}
  aria-disabled={disabledReason ? "true" : undefined}
  {onclick}
  {onmouseenter}
  {onfocus}
>
  <div class="app-visual">
    <AppNails appId={app.id} />
  </div>

  <div class="app-meta">
    <span class="app-title"><Icon size={14} /> {app.title}</span>
    <span class="app-desc">{app.desc}</span>
    {#if disabledReason}
      <span class="app-unsupported">{disabledReason}</span>
    {/if}
  </div>
</button>

<style>
  button.app-card {
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
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    box-sizing: border-box;
  }

  button.app-card:hover,
  button.app-card:focus-visible,
  button.app-card.focused {
    background: rgba(255, 255, 255, 0.06);
    transform: scale(1.01) translateY(-2px);
    border-color: rgba(150, 150, 150, 0.45);
    box-shadow: 0 8px 30px rgba(150, 150, 150, 0.08);
    outline: none;
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
  }

  .app-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: white;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .app-desc {
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.45);
    line-height: 1.3;
  }

  /* Capability-gated: greyed but still focusable/readable */
  button.app-card.unsupported {
    opacity: 0.45;
    filter: grayscale(0.8);
  }

  button.app-card.unsupported:hover,
  button.app-card.unsupported:focus-visible {
    transform: none;
    box-shadow: none;
  }

  .app-unsupported {
    font-size: 0.66rem;
    color: #c98500;
  }

  @media (max-width: 768px) {
    button.app-card {
      padding: 12px;
      gap: 12px;
    }
  }
</style>
