<script>
  import { themeManager } from "../../lib/themeManager.svelte.js";
  import themesData from "../../lib/themes.json";
  import { Settings, Check, Shuffle } from "lucide-svelte";

  let themes = themeManager.getThemesList();
  let activeThemeId = $derived(themeManager.currentThemeId);

  function selectTheme(id) {
    themeManager.setTheme(id);
  }

  // Pre-extract variables for display swatches
  function getThemeColors(id) {
    if (id === "random") return [];
    const t = themesData[id];
    if (!t || !t.variables) return [];
    return [
      t.variables["--color-neon-red"] || "#ff3344",
      t.variables["--color-neon-gold"] || "#e6b900",
      t.variables["--color-neon-green"] || "#00d75f",
      t.variables["--color-neon-purple"] || "#a000eb",
    ];
  }
</script>

<div class="settings-layout animated-pane">
  <header class="settings-header">
    <div class="title-block">
      <Settings class="text-neon-red animate-spin-slow" size={24} />
      <div>
        <h2>System Settings</h2>
        <p class="description">Configure site-wide visual themes and UI aesthetics.</p>
      </div>
    </div>
  </header>

  <main class="settings-body scroll-container">
    <section class="settings-section">
      <h3 class="section-title">Select Theme Profile</h3>
      
      <div class="themes-grid">
        {#each themes as theme}
          {@const isSelected = activeThemeId === theme.id}
          {@const colors = getThemeColors(theme.id)}
          
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="theme-card"
            class:selected={isSelected}
            onclick={() => selectTheme(theme.id)}
          >
            {#if theme.id === "random"}
              <div class="theme-swatch-box random-swatch">
                <Shuffle size={20} class="text-white/70" />
              </div>
            {:else}
              <div class="theme-swatch-box">
                {#each colors as color}
                  <span class="swatch-color" style="background: {color}"></span>
                {/each}
              </div>
            {/if}
            
            <div class="theme-info">
              <span class="theme-name">{theme.name}</span>
              {#if isSelected}
                <span class="active-badge">
                  <Check size={12} /> Active
                </span>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </section>
  </main>
</div>

<style lang="scss">
  @use "../../styles/variables" as *;

  .settings-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    color: var(--color-text, #ffffff);
    background: rgba(0, 0, 0, 0.1);
  }

  .settings-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  }

  .title-block {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  h2 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-family: "Outfit", "Inter", sans-serif;
  }

  .description {
    margin: 2px 0 0 0;
    font-size: 0.72rem;
    color: var(--color-text-muted, rgba(255, 255, 255, 0.5));
  }

  .settings-body {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
  }

  .settings-section {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .section-title {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-neon-red, #ff3344);
  }

  .themes-grid {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 12px;

    @media (min-width: 480px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  .theme-card {
    background: var(--bg-card, rgba(15, 15, 22, 0.45));
    border: 1px solid var(--border-light, rgba(255, 255, 255, 0.05));
    border-radius: 12px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    gap: 10px;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    }

    &.selected {
      border-color: var(--color-neon-red, #ff3344);
      background: rgba(255, 255, 255, 0.04);
      box-shadow: 0 0 15px rgba(255, 51, 68, 0.15);
    }
  }

  .theme-swatch-box {
    height: 36px;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    border: 1px solid rgba(255, 255, 255, 0.1);

    .swatch-color {
      flex-grow: 1;
      height: 100%;
    }

    &.random-swatch {
      background: linear-gradient(135deg, #ff3344, #e6b900, #00d75f, #a000eb);
      align-items: center;
      justify-content: center;
    }
  }

  .theme-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .theme-name {
    font-size: 0.8rem;
    font-weight: 600;
  }

  .active-badge {
    font-size: 0.65rem;
    font-weight: 700;
    color: var(--color-neon-green, #00d75f);
    display: flex;
    align-items: center;
    gap: 2px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .text-neon-red {
    color: var(--color-neon-red, #ff3344);
  }

  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  :global(.animate-spin-slow) {
    animation: spin-slow 12s linear infinite;
  }

  .animated-pane {
    animation: paneFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes paneFadeIn {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
</style>
