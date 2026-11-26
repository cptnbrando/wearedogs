<script>
  /**
   * Settings > Owner: the owner's key sign-in (src/lib/admin.svelte.js).
   *
   * To a visitor this is one quiet card that says it is not for them. It asks
   * the API nothing until somebody presses its button. For the owner it walks
   * through whichever step applies: making the key, bringing the key file to
   * a new browser, unlocking with the PIN, and, once unlocked, the play counts.
   */
  import { onDestroy } from "svelte";
  import { Lock, LockOpen, Download, Upload, Trash2 } from "lucide-svelte";
  import { admin } from "../../../lib/admin.svelte.js";
  import { ADMIN_KEY_FILE_NAME, MAX_PIN_LENGTH } from "../../../lib/adminKey.js";
  import PlayCounts from "./PlayCounts.svelte";

  // How long "tap again to confirm" stays armed before it disarms itself
  const FORGET_CONFIRM_WINDOW_MS = 4000;
  const KEY_FILE_TYPE = "application/json";
  const NO_FILE = "Choose the key file first.";
  const TIME_FORMAT = { hour: "2-digit", minute: "2-digit" };
  const CARD_CLASS = "owner-card flex flex-col gap-3 md:gap-4 2xl:gap-5 2xl:p-6";
  const DESC_CLASS = "owner-desc text-xs md:text-sm 2xl:text-base";
  const FORM_CLASS = "grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-5";
  const FIELD_CLASS = "owner-field flex flex-col gap-1 text-xs md:text-sm 2xl:text-base";
  const BUTTON_CLASS = "owner-btn shrink-0 px-4 py-3 text-xs sm:py-2 md:text-sm 2xl:px-6 2xl:py-3 2xl:text-base";
  // In a form the button sits on the fields' baseline: the bottom of its grid cell
  const SUBMIT_CLASS = BUTTON_CLASS + " self-end";
  const ACTIONS_CLASS = "flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center md:gap-4";

  let opened = $state(false);
  let message = $state("");
  let pin = $state("");
  let keyFile = $state(null);
  let forgetArmed = $state(false);
  let forgetTimer = null;

  /** Which step shows: one of these, top to bottom, the first that applies. */
  let step = $derived.by(() => {
    if (!admin.supported) return "unsupported";
    if (admin.unlocked) return "unlocked";
    if (admin.enrolled === false && (opened || admin.hasKey)) return "none";
    if (admin.hasKey) return "locked";
    if (!opened) return "closed";
    return admin.enrolled ? "bring" : "checking";
  });
  let until = $derived(admin.expires ? new Date(admin.expires).toLocaleTimeString([], TIME_FORMAT) : "");

  // A session held from earlier in this browser session is checked once, when the card shows
  if (admin.unlocked) admin.check();

  onDestroy(() => clearTimeout(forgetTimer));

  function clearFields() {
    pin = "";
    keyFile = null;
  }

  /** Shows what a step's request came back with; a success clears the typed secrets. */
  function settle(outcome) {
    message = outcome.ok ? "" : outcome.error;
    if (outcome.ok) clearFields();
    return outcome.ok;
  }

  async function open() {
    opened = true;
    message = "";
    const outcome = await admin.check();
    if (outcome.ok) return;
    opened = false;
    message = outcome.error;
  }

  async function unlock(event) {
    event.preventDefault();
    settle(await admin.unlock(pin));
  }

  async function bringKey(event) {
    event.preventDefault();
    if (!keyFile) return (message = NO_FILE);
    settle(await admin.importKey(await keyFile.text(), pin));
  }

  function saveKeyFile() {
    const url = URL.createObjectURL(new Blob([admin.exportKey()], { type: KEY_FILE_TYPE }));
    const link = document.createElement("a");
    link.href = url;
    link.download = ADMIN_KEY_FILE_NAME;
    link.click();
    URL.revokeObjectURL(url);
  }

  function forget() {
    if (!forgetArmed) {
      forgetArmed = true;
      forgetTimer = setTimeout(() => (forgetArmed = false), FORGET_CONFIRM_WINDOW_MS);
      return;
    }
    clearTimeout(forgetTimer);
    forgetArmed = false;
    opened = false;
    message = "";
    admin.forget();
  }
</script>

<section class="settings-section mt-8 2xl:mt-12">
  <h3 class="owner-title">Owner</h3>

  <div class={CARD_CLASS}>
    {#if step === "unsupported"}
      <p class={DESC_CLASS}>This part is for the site's owner. It only works on a secure page (https).</p>
    {:else if step === "closed"}
      <div class="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center md:gap-4 xl:gap-6">
        <p class="{DESC_CLASS} flex-1">
          This part is for the site's owner. There is nothing here for visitors.
        </p>
        <button type="button" class="owner-quiet-btn shrink-0 px-3 py-2 text-xs md:text-sm 2xl:text-base" onclick={open}>
          Owner sign-in
        </button>
      </div>
    {:else if step === "checking"}
      <p class={DESC_CLASS} aria-live="polite">Asking the site…</p>
    {:else if step === "none"}
      <p class={DESC_CLASS}>
        No owner key is registered, and none can be registered from this page. The owner's key is made on the
        owner's own computer.
      </p>
    {:else if step === "bring"}
      <p class={DESC_CLASS}>
        The owner's key is not on this device. Bring its key file and the PIN it was made with.
      </p>
      <form class={FORM_CLASS} onsubmit={bringKey}>
        <label class={FIELD_CLASS}>
          Key file
          <input class="owner-input" type="file" accept=".json,application/json" onchange={(event) => (keyFile = event.currentTarget.files[0] || null)} />
        </label>
        <label class={FIELD_CLASS}>
          PIN
          <input class="owner-input" type="password" autocomplete="off" maxlength={MAX_PIN_LENGTH} required bind:value={pin} />
        </label>
        <button type="submit" class={SUBMIT_CLASS} disabled={admin.busy}>
          <Upload size={16} />
          {admin.busy ? "Opening…" : "Bring the key"}
        </button>
      </form>
    {:else if step === "locked"}
      <p class={DESC_CLASS}>The owner's key is on this device, locked. The PIN is checked here and is never sent.</p>
      <form class={FORM_CLASS} onsubmit={unlock}>
        <label class={FIELD_CLASS}>
          PIN
          <input class="owner-input" type="password" autocomplete="off" maxlength={MAX_PIN_LENGTH} required bind:value={pin} />
        </label>
        <button type="submit" class={SUBMIT_CLASS} disabled={admin.busy}>
          <LockOpen size={16} />
          {admin.busy ? "Unlocking…" : "Unlock"}
        </button>
        <button type="button" class="owner-danger-btn self-end px-4 py-3 text-xs sm:py-2 md:text-sm 2xl:px-6 2xl:py-3 2xl:text-base" class:armed={forgetArmed} onclick={forget}>
          <Trash2 size={16} />
          {forgetArmed ? "Tap again to confirm" : "Forget this device"}
        </button>
      </form>
    {:else}
      <p class={DESC_CLASS} aria-live="polite">
        Unlocked on this browser until {until}. Closing the browser locks it too.
      </p>
      <div class={ACTIONS_CLASS}>
        <button type="button" class={BUTTON_CLASS} onclick={() => admin.lock()}>
          <Lock size={16} />
          Lock
        </button>
        <button type="button" class={BUTTON_CLASS} disabled={!admin.hasKey} onclick={saveKeyFile}>
          <Download size={16} />
          Save key file
        </button>
        <button type="button" class="owner-danger-btn px-4 py-3 text-xs sm:py-2 md:text-sm 2xl:px-6 2xl:py-3 2xl:text-base" class:armed={forgetArmed} onclick={forget}>
          <Trash2 size={16} />
          {forgetArmed ? "Tap again to confirm" : "Forget this device"}
        </button>
      </div>
      <PlayCounts />
    {/if}

    {#if message}
      <p class="owner-message text-xs md:text-sm 2xl:text-base" role="alert">{message}</p>
    {/if}
  </div>
</section>

<style lang="scss">
  @use "../../../styles/variables" as *;
  @use "./cards" as cards;

  // The section and its heading repeat SettingsApp's: styles there are scoped to that file
  .settings-section {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .owner-title {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-muted, rgba(255, 255, 255, 0.55));
  }

  .owner-card {
    @include cards.settings-card;
  }

  .owner-desc {
    @include cards.settings-desc;
  }

  .owner-btn {
    @include cards.settings-button;
  }

  // Looks like nothing much: a visitor has no reason to press it
  .owner-quiet-btn {
    border-radius: 8px;
    border: 1px solid $border-light;
    background: transparent;
    color: var(--color-text-muted, rgba(255, 255, 255, 0.55));
    cursor: pointer;
    transition: background $transition-speed-fast ease;

    &:hover,
    &:focus-visible {
      background: $bg-input-dark;
    }
  }

  .owner-danger-btn {
    @include cards.settings-button;
    border-color: $color-alert-red;
    color: $color-alert-red;

    &.armed {
      background: $color-alert-red;
      color: var(--color-text, #ffffff);
    }
  }

  .owner-field {
    min-width: 0;
    color: var(--color-text-muted, rgba(255, 255, 255, 0.55));
  }

  .owner-input {
    width: 100%;
    min-width: 0;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid $border-light;
    background: $bg-input-dark;
    color: var(--color-text, #ffffff);
    font: inherit;

    &:focus-visible {
      outline: 1px solid $color-neon-green;
    }
  }

  .owner-message {
    margin: 0;
    color: $color-alert-red;
  }
</style>
