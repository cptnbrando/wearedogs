<script>
  let {
    title = "App Template",
    description = "Application placeholder.",
    graphicSrc = "",
    themeColor = "#ffd700", // Default to WIP yellow
    children
  } = $props();
</script>

<div class="base-app-layout animated-pane" style="--app-theme-color: {themeColor}">
  <div class="app-header">
    <div class="title-section">
      <h2>{title}</h2>
      {#if description}
        <p class="description">{description}</p>
      {/if}
    </div>
  </div>

  <div class="app-body">
    {#if children}
      {@render children()}
    {:else}
      <!-- Work In Progress / Preview Showcase -->
      <div class="wip-container">
        <div class="wip-hazard-tape">
          <span>WORK IN PROGRESS</span>
        </div>
        
        {#if graphicSrc}
          <div class="graphic-wrapper">
            <img src={graphicSrc} alt="{title} Preview" class="app-graphic-preview" />
            <div class="graphic-glow"></div>
          </div>
        {/if}

        <p class="wip-message">
          This application is currently under construction. Check back soon for exciting updates!
        </p>
      </div>
    {/if}
  </div>
</div>

<style>
  .base-app-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 24px;
    box-sizing: border-box;
    overflow-y: auto;
  }

  .app-header {
    margin-bottom: 24px;
    flex-shrink: 0;
    border-left: 3px solid var(--app-theme-color);
    padding-left: 14px;
  }

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 800;
    color: white;
    letter-spacing: 0.05em;
    font-family: "Outfit", "Inter", sans-serif;
    text-transform: uppercase;
  }

  .description {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.45);
    margin: 6px 0 0 0;
    font-family: "Inter", sans-serif;
  }

  .app-body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    position: relative;
    justify-content: center;
    align-items: center;
  }

  /* ── WIP tape styling ── */
  .wip-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 550px;
    padding: 20px;
    margin: auto;
  }

  .wip-hazard-tape {
    background: repeating-linear-gradient(
      -45deg,
      #ffd700,
      #ffd700 15px,
      #111111 15px,
      #111111 30px
    );
    color: #111111;
    font-size: 1.2rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    padding: 10px 30px;
    width: 100%;
    max-width: 400px;
    text-align: center;
    transform: rotate(-3deg);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    border: 3px solid #ffd700;
    font-family: "Outfit", "Courier New", monospace;
    user-select: none;
    margin-bottom: 32px;
    text-shadow: 0 0 4px rgba(255, 215, 0, 0.4);
    animation: tapeGlow 2.5s infinite alternate;
  }

  @keyframes tapeGlow {
    from {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    }
    to {
      box-shadow:
        0 10px 30px rgba(255, 215, 0, 0.2),
        0 0 15px rgba(255, 215, 0, 0.1);
    }
  }

  /* Graphic Showcase */
  .graphic-wrapper {
    position: relative;
    width: 100%;
    max-width: 320px;
    aspect-ratio: 16 / 10;
    margin-bottom: 24px;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  }

  .app-graphic-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
  }

  .graphic-wrapper:hover .app-graphic-preview {
    transform: scale(1.05);
  }

  .graphic-glow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.6);
    background: linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.4) 100%);
  }

  .wip-message {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
    text-align: center;
    line-height: 1.6;
    margin: 0;
    font-family: "Inter", sans-serif;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    max-width: 420px;
  }

  .animated-pane {
    animation: paneFadeIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes paneFadeIn {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive tweaks */
  @media (max-width: 768px) {
    .base-app-layout {
      padding: 16px;
    }
    h2 {
      font-size: 1.25rem;
    }
    .wip-hazard-tape {
      font-size: 1rem;
      padding: 8px 20px;
    }
  }
</style>
