<script>
  // PreviousRides: Air Train's quick reconnect list (rides.js), and its optional
  // four-digit PIN. It only asks; the parent opens rides and connects.
  import { RefreshCw, X, Lock, LockOpen } from 'lucide-svelte';

  const PIN_LENGTH = 4;
  const FAILED = 'That did not work. Try again.';
  const PIN_HELP = 'Four digits. With a PIN, saved rides are encrypted on this device and Reconnect asks for it. Set the same one on your other device if you want it there too.';

  /** @type {{ id: string, peerName: string, sealed: boolean }[]} */
  export let rides = [];
  /** A PIN is set on this device. */
  export let locked = false;
  /** This page can set one (it needs https). */
  export let canLock = false;
  /** @type {(ride: object, pin: string) => Promise<void>} rejects with words to show */
  export let onReconnect = async () => {};
  export let onForget = () => {};
  /** @type {(pin: string) => Promise<void>} */
  export let onLock = async () => {};
  /** @type {(pin: string) => Promise<void>} */
  export let onUnlock = async () => {};
  export let onReset = () => {};

  // What the PIN box is for right now: a ride's id, 'set', 'remove', or '' for closed
  let asking = '';
  let pin = '';
  let error = '';
  let busy = false;
  let confirmReset = false;
  let pinInput;

  function ask(what) {
    asking = what;
    pin = '';
    error = '';
    confirmReset = false;
    // The box exists after the next paint
    setTimeout(() => { if (pinInput) pinInput.focus(); }, 0);
  }

  function close() {
    asking = '';
    pin = '';
    error = '';
  }

  function press(ride) {
    if (ride.sealed) ask(ride.id);
    else run(() => onReconnect(ride, ''));
  }

  async function run(action) {
    if (busy) return;
    busy = true;
    error = '';
    try {
      await action();
      close();
    } catch (problem) {
      error = (problem && problem.message) || FAILED;
      pin = '';
    } finally {
      busy = false;
    }
  }

  function submit(event) {
    if (event) event.preventDefault();
    if (pin.length !== PIN_LENGTH) return;
    const entered = pin;
    if (asking === 'set') run(() => onLock(entered));
    else if (asking === 'remove') run(() => onUnlock(entered));
    else {
      const ride = rides.find((entry) => entry.id === asking);
      if (ride) run(() => onReconnect(ride, entered));
    }
  }

  /** Digits only, and the fourth one sends it. */
  function typed(event) {
    pin = event.target.value.replace(/[^0-9]/g, '').slice(0, PIN_LENGTH);
    event.target.value = pin;
    if (pin.length === PIN_LENGTH) submit();
  }
</script>

{#snippet pinBox(label)}
  <form class="dt-pin" onsubmit={submit}>
    <label for="dt-pin-input">{label}</label>
    <input
      id="dt-pin-input"
      bind:this={pinInput}
      value={pin}
      oninput={typed}
      type="password"
      inputmode="numeric"
      autocomplete="off"
      maxlength={PIN_LENGTH}
      placeholder="••••"
      disabled={busy}
      aria-describedby={error ? 'dt-pin-error' : undefined}
    />
    <button type="button" class="dt-icon-button" onclick={close} aria-label="Cancel"><X size={15} /></button>
  </form>
{/snippet}

<div class="dt-rides" role="group" aria-label="Previous rides">
  <div class="dt-rides-head">
    <p class="dt-rides-title">Previous rides</p>
    {#if canLock && !asking}
      {#if locked}
        <button type="button" class="dt-quiet dt-rides-lock" onclick={() => ask('remove')} title="Saved rides are encrypted with your PIN. Press to remove the PIN."><Lock size={13} />PIN on</button>
      {:else}
        <button type="button" class="dt-quiet dt-rides-lock" onclick={() => ask('set')} title={PIN_HELP}><LockOpen size={13} />Lock with a PIN</button>
      {/if}
    {/if}
  </div>

  {#if asking === 'set'}
    {@render pinBox('Choose a PIN')}
    <p class="dt-rides-help dt-pin-help">{PIN_HELP}</p>
  {:else if asking === 'remove'}
    {@render pinBox('Your PIN, to remove it')}
    {#if confirmReset}
      <p class="dt-rides-help dt-pin-help">Resetting forgets the PIN and every ride it locked. You pair those devices again with a QR code. <button type="button" class="dt-quiet" onclick={() => { onReset(); close(); }}>Reset and forget them</button></p>
    {:else}
      <p class="dt-rides-help dt-pin-help"><button type="button" class="dt-quiet" onclick={() => (confirmReset = true)}>Forgot the PIN?</button></p>
    {/if}
  {/if}

  {#each rides as ride (ride.id)}
    {#if asking === ride.id}
      {@render pinBox('PIN for ' + ride.peerName)}
    {:else}
      <div class="dt-ride">
        <button class="dt-secondary" type="button" disabled={busy} onclick={() => press(ride)}>{#if ride.sealed}<Lock size={15} />{:else}<RefreshCw size={15} />{/if}Reconnect to {ride.peerName}</button>
        <button class="dt-icon-button" type="button" onclick={() => onForget(ride)} aria-label={'Forget ' + ride.peerName}><X size={15} /></button>
      </div>
    {/if}
  {/each}

  {#if error}<p class="dt-item-error" id="dt-pin-error" role="alert">{error}</p>{/if}
  {#if !asking}
    <p class="dt-rides-help">Press Reconnect on both devices. The one that showed the QR code is asked to allow it again.</p>
  {/if}
</div>
