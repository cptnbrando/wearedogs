<script>
  import { CONSOLE_LABELS, getFriendlyKeyName } from "./controlsConfig.js";
  import { X, RefreshCw, Keyboard } from "lucide-svelte";

  let {
    isOpen = $bindable(false),
    userMappings = $bindable({}),
    onClose,
    onReset,
  } = $props();

  let activeConsole = $state("n64");
  let recordingAction = $state(null); // { console: string, action: string } | null

  // Capture keyboard events when recording is active
  function handleKeyDown(e) {
    if (!recordingAction) return;
    
    // Block standard keys like Escape/Tab from closing/focusing during record
    e.preventDefault();
    e.stopPropagation();

    const { console: consoleType, action } = recordingAction;
    
    // Update local bindings state
    userMappings[consoleType][action] = e.code;
    recordingAction = null;
  }

  function startRecording(consoleType, action) {
    recordingAction = { console: consoleType, action };
  }

  function handleClose() {
    isOpen = false;
    if (onClose) {
      onClose();
    }
  }

  function handleReset() {
    if (onReset) {
      onReset(activeConsole);
    }
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="controls-modal-backdrop hidden md:flex" onclick={handleClose}>
    <div class="controls-modal-container" onclick={(e) => e.stopPropagation()}>
      
      <!-- Modal Header -->
      <header class="modal-header">
        <div class="header-title">
          <Keyboard style="color: #e6b900;" size={20} />
          <h2>Keyboard Bindings Configuration</h2>
        </div>
        <button class="close-btn" onclick={handleClose} aria-label="Close settings">
          <X size={16} />
        </button>
      </header>

      <div class="modal-body-layout">
        <!-- Sidebar Navigation (Console Tabs) -->
        <nav class="console-tabs-sidebar">
          {#each Object.keys(CONSOLE_LABELS) as consoleKey}
            <button
              class="console-tab-btn"
              class:active={activeConsole === consoleKey}
              onclick={() => {
                activeConsole = consoleKey;
                recordingAction = null;
              }}
            >
              <span class="badge {consoleKey}">{consoleKey.toUpperCase()}</span>
              <span class="tab-title">{CONSOLE_LABELS[consoleKey].title}</span>
            </button>
          {/each}
        </nav>

        <!-- Main Configuration Panel -->
        <nav class="bindings-panel">
          <div class="panel-header-bar">
            <h3>{CONSOLE_LABELS[activeConsole].title} Controls</h3>
            <button class="reset-defaults-btn" onclick={handleReset}>
              <RefreshCw size={12} />
              Reset Defaults
            </button>
          </div>

          <p class="panel-instruction-text">
            Click on any button slot below, then press a key on your keyboard to assign it.
          </p>

          <div class="bindings-scroll-area">
            {#each CONSOLE_LABELS[activeConsole].groups as group}
              <div class="button-group-section">
                <h4>{group.name}</h4>
                <div class="bindings-grid">
                  {#each group.buttons as btn}
                    {@const currentKey = userMappings[activeConsole]?.[btn.action]}
                    {@const isThisRecording = recordingAction && recordingAction.console === activeConsole && recordingAction.action === btn.action}
                    
                    <div class="binding-item">
                      <span class="action-label">{btn.label}</span>
                      <button
                        class="key-assign-btn"
                        class:recording={isThisRecording}
                        onclick={() => startRecording(activeConsole, btn.action)}
                      >
                        {#if isThisRecording}
                          <span class="pulse-dot"></span>
                          <span style="color: #ffd633; font-weight: 600;" class="animate-pulse">PRESS ANY KEY...</span>
                        {:else}
                          {getFriendlyKeyName(currentKey)}
                        {/if}
                      </button>
                    </div>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        </nav>
      </div>

      <!-- Modal Footer -->
      <footer class="modal-footer">
        <p class="footer-tip">Mappings are automatically saved locally.</p>
        <button class="done-btn" onclick={handleClose}>Done</button>
      </footer>

    </div>
  </div>
{/if}

<style>
  .controls-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .controls-modal-container {
    width: 90vw;
    height: 80vh;
    max-width: 800px;
    max-height: 600px;
    background: rgba(12, 12, 18, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: modalScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes modalScaleIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .modal-header {
    height: 56px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(0, 0, 0, 0.3);
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .header-title h2 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    color: rgba(255, 255, 255, 0.95);
  }

  .close-btn {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    padding: 6px;
    border-radius: 50%;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.06);
    color: white;
  }

  .modal-body-layout {
    flex-grow: 1;
    display: flex;
    overflow: hidden;
    min-height: 0;
  }

  .console-tabs-sidebar {
    width: 180px;
    background: rgba(0, 0, 0, 0.2);
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow-y: auto;
  }

  .console-tab-btn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 10px 12px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 8px;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
  }

  .tab-title {
    font-size: 0.72rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.45);
  }

  .badge {
    font-size: 0.58rem;
    font-weight: 800;
    padding: 1px 5px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.85);
  }

  .badge.n64 { background: rgba(230, 185, 0, 0.15); color: #e6b900; }
  .badge.nds { background: rgba(255, 51, 68, 0.15); color: #ff3344; }
  .badge.gba { background: rgba(0, 215, 95, 0.15); color: #00d75f; }
  .badge.sega { background: rgba(160, 0, 235, 0.15); color: #b13df2; }
  .badge.psx { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }

  .console-tab-btn:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  .console-tab-btn.active {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .console-tab-btn.active .tab-title {
    color: white;
  }

  .bindings-panel {
    flex-grow: 1;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
  }

  .panel-header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .panel-header-bar h3 {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 700;
    color: white;
  }

  .reset-defaults-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 0.65rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.2s;
  }

  .reset-defaults-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border-color: rgba(255, 255, 255, 0.15);
  }

  .panel-instruction-text {
    margin: 0 0 16px 0;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.4);
  }

  .bindings-scroll-area {
    flex-grow: 1;
    overflow-y: auto;
    padding-right: 8px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .button-group-section h4 {
    margin: 0 0 10px 0;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.35);
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    padding-bottom: 4px;
  }

  .bindings-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px 16px;
  }

  .binding-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.01);
    border: 1px solid rgba(255, 255, 255, 0.02);
    padding: 6px 12px;
    border-radius: 8px;
  }

  .action-label {
    font-size: 0.72rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
  }

  .key-assign-btn {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #e6b900;
    font-family: monospace;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 6px;
    cursor: pointer;
    min-width: 70px;
    text-align: center;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .key-assign-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .key-assign-btn.recording {
    background: rgba(230, 185, 0, 0.08);
    border-color: #e6b900;
    color: #e6b900;
  }

  .pulse-dot {
    width: 6px;
    height: 6px;
    background: #e6b900;
    border-radius: 50%;
    box-shadow: 0 0 6px #e6b900;
    animation: keyRecordingPulse 1s infinite alternate;
  }

  @keyframes keyRecordingPulse {
    from { opacity: 0.4; }
    to { opacity: 1; }
  }

  .modal-footer {
    height: 52px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(0, 0, 0, 0.3);
  }

  .footer-tip {
    margin: 0;
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.3);
  }

  .done-btn {
    background: #e6b900;
    border: none;
    color: black;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 6px 18px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .done-btn:hover {
    background: #ffd633;
    transform: translateY(-1px);
  }
</style>
