<script>
  import { X, Info, Shield, Zap, Layers } from "lucide-svelte";
  import { onMount } from "svelte";

  let { onClose } = $props();

  let isClosing = $state(false);

  function handleClose() {
    isClosing = true;
    setTimeout(() => {
      onClose();
    }, 300);
  }

  function handleKeydown(e) {
    if (e.key === "Escape") {
      handleClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="info-panel-backdrop" onclick={handleClose}>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="info-panel-container"
    class:closing={isClosing}
    onclick={(e) => e.stopPropagation()}
  >
    <header class="info-header">
      <div class="info-brand">
        <Info class="text-neon-gold" size={20} />
        <h2>DOGS</h2>
      </div>
      <button
        class="info-close"
        onclick={handleClose}
        aria-label="Close Info Panel"
      >
        <X size={18} />
      </button>
    </header>

    <main class="info-content">
      <p class="company-intro">
        DOGS is a high-velocity, punk-rock technology company building resilient
        software, built for the rocks. We design lightweight, semantic, and
        highly optimized platforms operating at the edge.
      </p>

      <h3 class="section-title">Core Projects</h3>

      <div class="projects-list">
        <div class="project-item">
          <div class="project-icon-wrapper border-castle">
            <Shield size={20} class="text-castle" />
          </div>
          <div class="project-meta">
            <h4>castle</h4>
            <p>
              Our secure, decentralized sandbox engine designed to host modules,
              manage infrastructure, control security, host storage, and manage
              a network with AI.
            </p>
          </div>
        </div>

        <div class="project-item">
          <div class="project-icon-wrapper border-wax">
            <Zap size={20} class="text-wax" />
          </div>
          <div class="project-meta">
            <h4>wax</h4>
            <p>A social media site for Vinyl collectors.</p>
          </div>
        </div>

        <div class="project-item">
          <div class="project-icon-wrapper border-forty">
            <Layers size={20} class="text-forty" />
          </div>
          <div class="project-meta">
            <h4>forty (40)</h4>
            <p>A social media site that deletes itself every 40 days.</p>
          </div>
        </div>
      </div>
    </main>

    <footer class="info-footer">
      <span>© 2026 DOGS. All rights reserved.</span>
    </footer>
  </div>
</div>

<style lang="scss">
  .info-panel-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .info-panel-container {
    width: 100%;
    max-width: 480px;
    background: var(--bg-card, rgba(10, 10, 15, 0.85));
    border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
    border-radius: 20px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: infoSlideIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .info-panel-container.closing {
    animation: infoSlideOut 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .info-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.06));
    background: rgba(0, 0, 0, 0.2);
  }

  .info-brand {
    display: flex;
    align-items: center;
    gap: 10px;

    h2 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-family: "Outfit", "Inter", sans-serif;
    }
  }

  .text-neon-gold {
    color: var(--color-neon-gold, #e6b900);
  }

  .info-close {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.5);
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      transform: scale(1.05);
    }
  }

  .info-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .company-intro {
    margin: 0;
    font-size: 0.8rem;
    line-height: 1.5;
    color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  }

  .section-title {
    margin: 4px 0 0 0;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-neon-gold, #e6b900);
  }

  .projects-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .project-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .project-icon-wrapper {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.02);
    border: 1.5px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;

    &.border-castle {
      border-color: rgba(0, 215, 255, 0.3);
    }
    &.border-wax {
      border-color: rgba(160, 0, 235, 0.3);
    }
    &.border-forty {
      border-color: rgba(0, 215, 95, 0.3);
    }
  }

  .text-castle {
    color: var(--color-neon-cyan, #00d7ff);
  }
  .text-wax {
    color: var(--color-neon-purple, #a000eb);
  }
  .text-forty {
    color: var(--color-neon-green, #00d75f);
  }

  .project-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;

    h4 {
      margin: 0;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    p {
      margin: 0;
      font-size: 0.7rem;
      line-height: 1.4;
      color: var(--color-text-muted, rgba(255, 255, 255, 0.5));
    }
  }

  .info-footer {
    padding: 12px 20px;
    border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.05));
    background: rgba(0, 0, 0, 0.1);
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.3);
    text-align: center;
  }

  @keyframes infoSlideIn {
    0% {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes infoSlideOut {
    0% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    100% {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
  }
</style>
