<script>
  import { X } from "lucide-svelte";

  let { 
    isClosing = false, 
    title = "Template Panel", 
    onClose, 
    children 
  } = $props();

  function handleKeydown(e) {
    if (e.key === "Escape") {
      onClose();
    }
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="template-panel-backdrop" onclick={onClose}>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="template-panel-container"
    class:closing={isClosing}
    onclick={(e) => e.stopPropagation()}
  >
    <!-- Header -->
    <header class="panel-header">
      <div class="brand">
        <img
          src="/favicon.svg"
          alt="DOGS Logo"
          style="width: 24px; height: 24px; filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4)); flex-shrink: 0;"
        />
        <h1>{title}</h1>
      </div>

      <button class="close-btn" onclick={onClose} aria-label="Close panel">
        <X size={20} />
      </button>
    </header>

    <!-- Inner Window (No tabs, single content pane) -->
    <div class="panel-body">
      <main class="panel-content-pane scroll-container">
        {#if children}
          {@render children()}
        {:else}
          <!-- Work In Progress Tape -->
          <div class="wip-container">
            <div class="wip-hazard-tape">
              <span>WORK IN PROGRESS</span>
            </div>
            <p class="wip-message">
              This panel is currently under construction. Check back soon for exciting updates!
            </p>
          </div>
        {/if}
      </main>
    </div>

    <!-- Footer / Status Bar -->
    <footer class="panel-footer">
      <div class="sys-status">
        <span class="status-indicator-green"></span>
        <span>WE ARE DOGS</span>
      </div>
      <div class="stats-counter">
        <span>TX REGISTERED LLC</span>
        <span class="divider">|</span>
        <span>AUTHOR: CAPTAIN BRANDO!</span>
      </div>
    </footer>
  </div>
</div>

<style>
  /* ── Backdrop ── */
  .template-panel-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  /* ── Container ── */
  .template-panel-container {
    width: 94vw;
    height: 90vh;
    max-width: 1280px;
    max-height: 850px;
    background: rgba(10, 10, 14, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    box-shadow:
      0 32px 80px rgba(0, 0, 0, 0.7),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    backdrop-filter: blur(15px) saturate(160%);
    -webkit-backdrop-filter: blur(15px) saturate(160%);
    animation: panelSlideUpIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transform-origin: center bottom;
  }

  .template-panel-container.closing {
    animation: panelSlideUpDown 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes panelSlideUpIn {
    0% {
      opacity: 0;
      transform: translateY(30px) scale(0.97);
      backdrop-filter: blur(0px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      backdrop-filter: blur(15px) saturate(160%);
    }
  }

  @keyframes panelSlideUpDown {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
      backdrop-filter: blur(15px) saturate(160%);
    }
    100% {
      opacity: 0;
      transform: translateY(20px) scale(0.97);
      backdrop-filter: blur(0px);
    }
  }

  /* ── Header ── */
  .panel-header {
    height: 64px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(0, 0, 0, 0.2);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand h1 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.95);
    font-family: "Outfit", "Inter", sans-serif;
  }

  .close-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.5);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    transform: rotate(90deg);
  }

  /* ── Body Layout ── */
  .panel-body {
    flex-grow: 1;
    display: flex;
    height: calc(100% - 64px - 40px); /* Subtract header and footer */
  }

  .panel-content-pane {
    flex-grow: 1;
    padding: 28px;
    overflow-y: auto;
    overflow-x: hidden;
    background: rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
  }

  /* Scrollbar utilities */
  .scroll-container::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .scroll-container::-webkit-scrollbar-track {
    background: transparent;
  }
  .scroll-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  .scroll-container::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  /* ── WIP tape styling ── */
  .wip-container {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 500px;
    padding: 40px 20px;
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
    font-size: 1.4rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    padding: 14px 40px;
    width: 110%;
    text-align: center;
    transform: rotate(-4deg);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    border: 3px solid #ffd700;
    font-family: "Outfit", "Courier New", monospace;
    user-select: none;
    margin-bottom: 24px;
    text-shadow: 0 0 4px rgba(255, 215, 0, 0.4);
    animation: tapeGlow 2.5s infinite alternate;
  }

  @keyframes tapeGlow {
    from {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    }
    to {
      box-shadow: 0 10px 30px rgba(255, 215, 0, 0.2), 0 0 15px rgba(255, 215, 0, 0.1);
    }
  }

  .wip-message {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.95rem;
    text-align: center;
    line-height: 1.6;
    margin: 0;
    font-family: "Inter", sans-serif;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  /* ── Footer ── */
  .panel-footer {
    height: 40px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(0, 0, 0, 0.3);
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.35);
    font-weight: 500;
    letter-spacing: 0.05em;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .sys-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: monospace;
  }

  .status-indicator-green {
    width: 6px;
    height: 6px;
    background: #00ff66;
    border-radius: 50%;
    display: inline-block;
  }

  .stats-counter {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .divider {
    color: rgba(255, 255, 255, 0.15);
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .template-panel-container {
      width: 100vw;
      height: 100%;
      max-height: 100%;
      border-radius: 0;
      border: none;
      animation: panelSlideUpInMobile 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .template-panel-container.closing {
      animation: panelSlideUpDownMobile 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .panel-header {
      padding: 0 16px;
    }

    .panel-content-pane {
      padding: 16px;
    }

    .panel-footer {
      height: auto;
      min-height: 48px;
      padding-top: 8px;
      padding-bottom: max(14px, env(safe-area-inset-bottom, 14px));
    }

    .wip-hazard-tape {
      font-size: 1.2rem;
      padding: 10px 20px;
    }
  }

  @keyframes panelSlideUpInMobile {
    0% {
      transform: translateY(100%);
      backdrop-filter: blur(0px);
    }
    100% {
      transform: translateY(0);
      backdrop-filter: blur(15px) saturate(160%);
    }
  }

  @keyframes panelSlideUpDownMobile {
    0% {
      transform: translateY(0);
      backdrop-filter: blur(15px) saturate(160%);
    }
    100% {
      transform: translateY(100%);
      backdrop-filter: blur(0px);
    }
  }
</style>
