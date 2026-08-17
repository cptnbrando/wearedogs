<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<script>
  import {
    KeyRound,
    Copy,
    RefreshCw,
    Check,
    AlertCircle,
    ShieldCheck,
    Eye,
    EyeOff,
  } from "lucide-svelte";
  import {
    CHAR_SETS,
    MIN_PASSWORD_LENGTH,
    MAX_PASSWORD_LENGTH,
    DEFAULT_PASSWORD_LENGTH,
    READABILITY_MODES,
    STRENGTH_TIERS,
    buildPools,
    generatePassword,
    calculateEntropy,
    getStrengthTier,
  } from "./passwordEngine.js";

  // Generation options
  let length = $state(DEFAULT_PASSWORD_LENGTH);
  let mode = $state(READABILITY_MODES.ALL);
  let useLowercase = $state(true);
  let useUppercase = $state(true);
  let useNumbers = $state(true);
  let useSymbols = $state(true);
  let symbolPool = $state(CHAR_SETS.symbols);

  // Output state
  let password = $state("");
  let regenNonce = $state(0);
  let isRevealed = $state(true);

  // Toast notification state
  let toastMessage = $state("");
  let toastType = $state("success");
  let toastTimer = null;

  const isSayable = $derived(mode === READABILITY_MODES.SAYABLE);

  const options = $derived({
    length,
    mode,
    useLowercase,
    useUppercase,
    useNumbers,
    useSymbols,
    symbolPool,
  });

  const poolSize = $derived(buildPools(options).join("").length);
  const entropyBits = $derived(calculateEntropy(options));
  const tier = $derived(getStrengthTier(entropyBits));
  const meterPercent = $derived(Math.min(100, (entropyBits / 160) * 100));

  const modeChoices = [
    { id: READABILITY_MODES.ALL, label: "All", hint: "Every enabled character" },
    { id: READABILITY_MODES.READABLE, label: "Readable", hint: "No lookalikes (Il1 O0 B8...)" },
    { id: READABILITY_MODES.SAYABLE, label: "Sayable", hint: "Letters only, easy to read aloud" },
  ];

  // Regenerate whenever any option (or the nonce) changes
  $effect(() => {
    const _n = regenNonce;
    password = generatePassword(options);
  });

  function showToast(message, type = "success") {
    toastMessage = message;
    toastType = type;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMessage = "";
    }, 3000);
  }

  function regenerate() {
    regenNonce += 1;
  }

  async function copyToClipboard() {
    if (!password) {
      showToast("Nothing to copy — enable a character set.", "error");
      return;
    }
    try {
      await navigator.clipboard.writeText(password);
      showToast("Password copied to clipboard!", "success");
    } catch (err) {
      console.error(err);
      showToast("Copy failed. Select and copy manually.", "error");
    }
  }

  function clampLength() {
    if (!Number.isFinite(length)) {
      length = DEFAULT_PASSWORD_LENGTH;
      return;
    }
    length = Math.max(
      MIN_PASSWORD_LENGTH,
      Math.min(MAX_PASSWORD_LENGTH, Math.round(length)),
    );
  }

  function resetSymbols() {
    symbolPool = CHAR_SETS.symbols;
  }

  /** Bucket each glyph so the display can tint digits and symbols. */
  function charKind(char) {
    if (CHAR_SETS.numbers.indexOf(char) !== -1) return "digit";
    if (CHAR_SETS.lowercase.indexOf(char.toLowerCase()) !== -1) return "letter";
    return "symbol";
  }
</script>

<div class="passwords-layout animated-pane">
  <div class="workspace-grid">
    <!-- LEFT PANEL: Controls -->
    <div class="panel controls-panel">
      <div class="panel-tag"><KeyRound size={12} /> GENERATION RULES</div>

      <!-- Length Group -->
      <div class="config-group">
        <div class="label-row">
          <label for="length-slider" class="config-label">Password Length</label>
          <input
            id="length-input"
            type="number"
            min={MIN_PASSWORD_LENGTH}
            max={MAX_PASSWORD_LENGTH}
            bind:value={length}
            onblur={clampLength}
            class="length-number-input"
            aria-label="Password length"
          />
        </div>
        <input
          id="length-slider"
          type="range"
          min={MIN_PASSWORD_LENGTH}
          max={MAX_PASSWORD_LENGTH}
          step="1"
          bind:value={length}
          class="gen-slider"
        />
        <div class="slider-ticks">
          <span>{MIN_PASSWORD_LENGTH}</span>
          <span>100</span>
          <span>{MAX_PASSWORD_LENGTH}</span>
        </div>
      </div>

      <!-- Readability Mode Group -->
      <div class="config-group">
        <span class="config-label">Readability Mode</span>
        <div class="mode-row">
          {#each modeChoices as choice}
            <button
              class="mode-btn"
              class:active={mode === choice.id}
              onclick={() => (mode = choice.id)}
            >
              <span class="mode-name">{choice.label}</span>
              <span class="mode-hint">{choice.hint}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Character Sets Group -->
      <div class="config-group">
        <span class="config-label">Character Sets</span>
        <div class="charset-grid">
          <label class="charset-toggle" class:checked={useLowercase}>
            <input type="checkbox" bind:checked={useLowercase} />
            <span class="charset-name">Lowercase</span>
            <span class="charset-sample">abc</span>
          </label>
          <label class="charset-toggle" class:checked={useUppercase}>
            <input type="checkbox" bind:checked={useUppercase} />
            <span class="charset-name">Uppercase</span>
            <span class="charset-sample">ABC</span>
          </label>
          <label
            class="charset-toggle"
            class:checked={useNumbers && !isSayable}
            class:disabled={isSayable}
          >
            <input type="checkbox" bind:checked={useNumbers} disabled={isSayable} />
            <span class="charset-name">Numbers</span>
            <span class="charset-sample">123</span>
          </label>
          <label
            class="charset-toggle"
            class:checked={useSymbols && !isSayable}
            class:disabled={isSayable}
          >
            <input type="checkbox" bind:checked={useSymbols} disabled={isSayable} />
            <span class="charset-name">Symbols</span>
            <span class="charset-sample">#$%</span>
          </label>
        </div>
        {#if isSayable}
          <span class="sayable-note">Sayable mode sticks to letters only.</span>
        {/if}
      </div>

      <!-- Symbol Pool Group -->
      {#if useSymbols && !isSayable}
        <div class="config-group animated-fade">
          <div class="label-row">
            <label for="symbol-pool" class="config-label">Symbol Pool</label>
            {#if symbolPool !== CHAR_SETS.symbols}
              <button class="reset-symbols-btn" onclick={resetSymbols}>Reset</button>
            {/if}
          </div>
          <input
            id="symbol-pool"
            type="text"
            bind:value={symbolPool}
            placeholder="Allowed symbols..."
            class="neon-input mono"
            spellcheck="false"
            autocomplete="off"
          />
        </div>
      {/if}
    </div>

    <!-- RIGHT PANEL: Output -->
    <div class="panel output-panel">
      <div class="panel-tag"><ShieldCheck size={12} /> GENERATED OUTPUT</div>

      <!-- Password display -->
      <div class="password-frame" class:empty={!password}>
        {#if password}
          <div class="password-text" class:masked={!isRevealed}>
            {#if isRevealed}
              {#each password as char}<span class="pw-char {charKind(char)}">{char}</span>{/each}
            {:else}
              {"•".repeat(Math.min(password.length, 60))}
            {/if}
          </div>
        {:else}
          <div class="empty-hint">
            <AlertCircle size={18} />
            <span>Enable at least one character set to generate.</span>
          </div>
        {/if}
      </div>

      <!-- Strength meter -->
      <div class="strength-block">
        <div class="strength-header">
          <span class="strength-label" style="color: {tier.color}">{password ? tier.label : "—"}</span>
          <span class="entropy-readout">{Math.round(entropyBits)} bits of entropy</span>
        </div>
        <div class="strength-track">
          <div
            class="strength-fill"
            style="width: {password ? meterPercent : 0}%; background: {tier.color}; box-shadow: 0 0 12px {tier.color};"
          ></div>
        </div>
        <div class="tier-ticks">
          {#each STRENGTH_TIERS as t}
            <span class:reached={password && entropyBits >= t.minBits} style="--tier-color: {t.color}">
              {t.label}
            </span>
          {/each}
        </div>
      </div>

      <!-- Diagnostic stats -->
      <div class="spec-footer-stats">
        <div class="stat-bubble">
          <span class="lbl">Length</span>
          <span class="val">{password.length || 0}</span>
        </div>
        <div class="stat-bubble">
          <span class="lbl">Pool</span>
          <span class="val">{poolSize} chars</span>
        </div>
        <div class="stat-bubble">
          <span class="lbl">Source</span>
          <span class="val">CSPRNG</span>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="actions-wrapper">
        <div class="actions-row">
          <button class="gen-action-btn regen-btn" onclick={regenerate}>
            <RefreshCw size={16} /> Regenerate
          </button>
          <button
            class="gen-action-btn reveal-btn"
            onclick={() => (isRevealed = !isRevealed)}
            aria-label={isRevealed ? "Hide password" : "Show password"}
          >
            {#if isRevealed}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
          </button>
        </div>
        <button class="gen-action-btn copy-btn" onclick={copyToClipboard}>
          <Copy size={16} /> Copy Password
        </button>
      </div>
    </div>
  </div>

  <!-- Toast Notification Overlay -->
  {#if toastMessage}
    <div class="toast-popup" class:error={toastType === "error"}>
      {#if toastType === "error"}
        <AlertCircle size={16} />
      {:else}
        <Check size={16} />
      {/if}
      <span>{toastMessage}</span>
    </div>
  {/if}
</div>

<style>
  .passwords-layout {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #09090d;
    overflow: hidden;
    color: white;
  }

  /* ── Workspace ── */
  .workspace-grid {
    flex-grow: 1;
    display: grid;
    grid-template-columns: 0.9fr 1.1fr;
    height: 100%;
    overflow: hidden;
  }

  .panel {
    display: flex;
    flex-direction: column;
    padding: 20px;
    gap: 20px;
    overflow-y: auto;
    height: 100%;
  }

  .controls-panel {
    border-right: 1px solid rgba(255, 255, 255, 0.05);
  }

  .output-panel {
    background: rgba(0, 0, 0, 0.15);
  }

  .panel-tag {
    font-size: 0.58rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.08em;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: "Inter", sans-serif;
    margin-bottom: -4px;
    align-self: flex-start;
  }

  /* ── Form Inputs ── */
  .config-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .config-label {
    font-size: 0.72rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: "Inter", sans-serif;
  }

  .label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .length-number-input {
    width: 64px;
    background: rgba(0, 215, 95, 0.08);
    border: 1px solid rgba(0, 215, 95, 0.25);
    border-radius: 4px;
    color: #00d75f;
    font-size: 0.78rem;
    font-weight: 700;
    font-family: monospace;
    text-align: center;
    padding: 2px 4px;
    outline: none;
    -moz-appearance: textfield;
    appearance: textfield;
  }

  .length-number-input::-webkit-outer-spin-button,
  .length-number-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .length-number-input:focus {
    border-color: #00d75f;
    box-shadow: 0 0 10px rgba(0, 215, 95, 0.2);
  }

  .gen-slider {
    width: 100%;
    accent-color: #00d75f;
    cursor: pointer;
  }

  .slider-ticks {
    display: flex;
    justify-content: space-between;
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.3);
    font-family: monospace;
    margin-top: -4px;
  }

  .neon-input {
    width: 100%;
    background: #0d0d12;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    color: white;
    font-size: 0.85rem;
    padding: 12px 14px;
    outline: none;
    transition: all 0.2s;
    font-family: "Inter", sans-serif;
  }

  .neon-input.mono {
    font-family: monospace;
    letter-spacing: 0.08em;
  }

  .neon-input:focus {
    border-color: #00d75f;
    box-shadow: 0 0 10px rgba(0, 215, 95, 0.15);
    background: #111118;
  }

  .reset-symbols-btn {
    background: transparent;
    border: none;
    color: #00d75f;
    font-size: 0.68rem;
    font-weight: 700;
    cursor: pointer;
    padding: 0;
  }

  .reset-symbols-btn:hover {
    text-decoration: underline;
  }

  /* ── Readability Modes ── */
  .mode-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mode-btn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 10px 14px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .mode-btn:hover {
    background: rgba(0, 215, 95, 0.04);
    border-color: rgba(0, 215, 95, 0.3);
  }

  .mode-btn.active {
    background: rgba(0, 215, 95, 0.08);
    border-color: #00d75f;
    box-shadow: 0 0 12px rgba(0, 215, 95, 0.12);
  }

  .mode-name {
    font-size: 0.78rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.85);
    font-family: "Outfit", "Inter", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .mode-btn.active .mode-name {
    color: #00d75f;
  }

  .mode-hint {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.35);
    font-family: "Inter", sans-serif;
  }

  /* ── Charset Toggles ── */
  .charset-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .charset-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 10px 12px;
    cursor: pointer;
    transition: all 0.2s;
    user-select: none;
  }

  .charset-toggle input {
    accent-color: #00d75f;
    cursor: pointer;
  }

  .charset-toggle:hover:not(.disabled) {
    border-color: rgba(0, 215, 95, 0.3);
  }

  .charset-toggle.checked {
    background: rgba(0, 215, 95, 0.06);
    border-color: rgba(0, 215, 95, 0.4);
  }

  .charset-toggle.disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .charset-name {
    font-size: 0.72rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
    font-family: "Inter", sans-serif;
    flex-grow: 1;
  }

  .charset-sample {
    font-size: 0.68rem;
    font-family: monospace;
    color: rgba(255, 255, 255, 0.35);
  }

  .sayable-note {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.35);
    font-family: "Inter", sans-serif;
    font-style: italic;
  }

  /* ── Password Frame ── */
  .password-frame {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(0, 215, 95, 0.15);
    border-radius: 12px;
    padding: 16px;
    min-height: 92px;
    max-height: 38%;
    overflow-y: auto;
    box-shadow:
      0 20px 50px rgba(0, 0, 0, 0.5),
      inset 0 0 25px rgba(0, 215, 95, 0.02);
    transition: border-color 0.3s;
    flex-shrink: 0;
  }

  .password-frame:hover {
    border-color: rgba(0, 215, 95, 0.35);
  }

  .password-frame.empty {
    display: flex;
    align-items: center;
    justify-content: center;
    border-color: rgba(255, 51, 68, 0.25);
  }

  .password-text {
    font-family: "JetBrains Mono", "Fira Code", monospace;
    font-size: 0.95rem;
    line-height: 1.7;
    word-break: break-all;
    user-select: all;
    color: rgba(255, 255, 255, 0.92);
  }

  .password-text.masked {
    letter-spacing: 0.15em;
    color: rgba(255, 255, 255, 0.5);
  }

  .pw-char.digit {
    color: #00d7ff;
  }

  .pw-char.symbol {
    color: #ff55bb;
  }

  .empty-hint {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(255, 51, 68, 0.8);
    font-size: 0.75rem;
    font-family: "Inter", sans-serif;
  }

  /* ── Strength Meter ── */
  .strength-block {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .strength-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .strength-label {
    font-size: 0.85rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-family: "Outfit", "Inter", sans-serif;
  }

  .entropy-readout {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.4);
    font-family: monospace;
  }

  .strength-track {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    overflow: hidden;
  }

  .strength-fill {
    height: 100%;
    border-radius: 4px;
    transition:
      width 0.35s cubic-bezier(0.16, 1, 0.3, 1),
      background 0.35s;
  }

  .tier-ticks {
    display: flex;
    justify-content: space-between;
    font-size: 0.58rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.25);
    font-family: "Inter", sans-serif;
  }

  .tier-ticks span.reached {
    color: var(--tier-color);
  }

  /* ── Stats ── */
  .spec-footer-stats {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .stat-bubble {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 6px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    flex: 1;
    max-width: 120px;
  }

  .stat-bubble .lbl {
    font-size: 0.52rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-bubble .val {
    font-size: 0.68rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.85);
    font-family: monospace;
  }

  /* ── Action Buttons ── */
  .actions-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    max-width: 320px;
    margin: auto auto 0;
  }

  .actions-row {
    display: flex;
    gap: 10px;
  }

  .gen-action-btn {
    border: none;
    border-radius: 8px;
    padding: 12px;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
    font-family: "Outfit", "Inter", sans-serif;
  }

  .gen-action-btn.regen-btn {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: white;
    flex-grow: 1;
  }

  .gen-action-btn.regen-btn:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  .gen-action-btn.regen-btn:hover :global(svg) {
    transform: rotate(180deg);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .gen-action-btn.reveal-btn {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.6);
    width: 46px;
    flex-shrink: 0;
  }

  .gen-action-btn.reveal-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    color: white;
  }

  .gen-action-btn.copy-btn {
    background: #00d75f;
    color: black;
  }

  .gen-action-btn.copy-btn:hover {
    box-shadow: 0 4px 18px rgba(0, 215, 95, 0.35);
    transform: translateY(-1px);
  }

  /* ── Toast Popup ── */
  .toast-popup {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 215, 95, 0.12);
    border: 1px solid rgba(0, 215, 95, 0.35);
    color: #00d75f;
    border-radius: 8px;
    padding: 10px 18px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.78rem;
    font-weight: 700;
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.5),
      0 0 15px rgba(0, 215, 95, 0.08);
    backdrop-filter: blur(10px);
    z-index: 1000;
    font-family: "Inter", sans-serif;
    animation: toastIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards;
  }

  .toast-popup.error {
    background: rgba(255, 51, 68, 0.12);
    border-color: rgba(255, 51, 68, 0.35);
    color: #ff3344;
  }

  @keyframes toastIn {
    0% {
      transform: translate(-50%, 15px);
      opacity: 0;
    }
    100% {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }

  /* ── Animation Helpers ── */
  .animated-fade {
    animation: fadeIn 0.25s ease-out forwards;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(4px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ── Responsive Viewports ── */
  @media (max-width: 639px) {
    .workspace-grid {
      grid-template-columns: 1fr;
      height: auto;
      overflow-y: auto;
    }
    .panel {
      height: auto;
      overflow: visible;
      padding: 16px;
    }
    .controls-panel {
      border-right: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      order: 2;
    }
    .output-panel {
      order: 1;
    }
    .password-frame {
      max-height: 200px;
    }
    .actions-wrapper {
      max-width: 100%;
      margin-top: 16px;
    }
  }

  @media (min-width: 640px) and (max-width: 767px) {
    .workspace-grid {
      grid-template-columns: 1fr 1fr;
    }
    .panel {
      padding: 12px;
      gap: 12px;
    }
  }

  @media (min-width: 1024px) and (max-width: 1599px) {
    .workspace-grid {
      max-width: 1100px;
      margin: 0 auto;
      width: 100%;
      border-left: 1px solid rgba(255, 255, 255, 0.04);
      border-right: 1px solid rgba(255, 255, 255, 0.04);
    }
  }

  @media (min-width: 1600px) {
    .workspace-grid {
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      border-left: 1px solid rgba(255, 255, 255, 0.05);
      border-right: 1px solid rgba(255, 255, 255, 0.05);
    }
    .config-label {
      font-size: 0.85rem;
    }
    .password-text {
      font-size: 1.05rem;
    }
    .actions-wrapper {
      max-width: 380px;
    }
    .gen-action-btn {
      font-size: 0.95rem;
      padding: 14px;
    }
  }

  @media (max-height: 640px) {
    .panel {
      padding: 10px;
      gap: 10px;
    }
    .password-frame {
      min-height: 64px;
      padding: 10px;
    }
    .actions-wrapper {
      flex-direction: row;
      max-width: 100%;
    }
    .actions-row {
      flex-grow: 1;
    }
    .gen-action-btn.copy-btn {
      flex-grow: 1;
    }
    .gen-action-btn {
      padding: 8px;
      font-size: 0.75rem;
    }
  }
</style>
