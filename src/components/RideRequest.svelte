<script>
  /**
   * RideRequest: "Connection requested", dropping down from the top middle of
   * any page of dogs.red when another of your devices rings this one from
   * Air Train (lib/rideBell.svelte.js). Accept joins it in the background, so
   * whatever plays keeps playing; Deny tells the other device no. Once
   * connected it offers Air Train, where the files are.
   */
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { Radio, Check, X, ArrowUpRight } from "lucide-svelte";
  import { rideBell, STEP_ASKING, STEP_CONNECTING, STEP_CONNECTED } from "../lib/rideBell.svelte.js";

  const DROP_FROM_PX = -96;
  const DROP_MS = 260;
  const PIN_LENGTH = 4;
  const TITLES = {
    asking: "Connection requested",
    connecting: "Connecting…",
    connected: "Connected",
    failed: "Could not connect",
  };
  const FAILED_TEXT = "The connection did not go through. Try Reconnect again on the other device.";
  const BUTTON_CLASS = "ride-btn flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold sm:py-1.5 md:text-sm 2xl:px-5 2xl:py-3 2xl:text-lg";

  let pin = $state("");
  let busy = $state(false);
  let request = $derived(rideBell.request);
  let asking = $derived(!!request && request.step === STEP_ASKING);

  onMount(() => rideBell.start());

  /** @param {SubmitEvent} event */
  async function accept(event) {
    event.preventDefault();
    if (busy) return;
    busy = true;
    await rideBell.accept(pin);
    busy = false;
    pin = "";
  }
</script>

{#if request}
  <div class="ride-layer pointer-events-none fixed inset-x-0 top-0 flex justify-center px-3 pt-3 sm:pt-2 md:pt-4 2xl:pt-8">
    <div
      class="ride-card pointer-events-auto flex w-full max-w-sm flex-col gap-2 rounded-2xl p-3 sm:max-w-md sm:flex-row sm:items-center sm:gap-3 sm:p-2.5 md:max-w-md md:p-3.5 lg:max-w-lg xl:max-w-lg 2xl:max-w-2xl 2xl:gap-5 2xl:p-6"
      role={asking ? "alertdialog" : "status"}
      aria-labelledby="ride-request-title"
      transition:fly={{ y: DROP_FROM_PX, duration: DROP_MS }}
    >
      <div class="flex min-w-0 flex-1 items-center gap-3 2xl:gap-5">
        <span class="ride-icon flex shrink-0 items-center justify-center rounded-full" class:ride-icon-live={request.step === STEP_CONNECTED}>
          <Radio size={18} aria-hidden="true" />
        </span>
        <div class="min-w-0">
          <p id="ride-request-title" class="ride-title text-sm font-bold md:text-base 2xl:text-2xl">{TITLES[request.step]}</p>
          <p class="ride-text truncate text-xs md:text-sm 2xl:text-lg">
            {#if asking}
              <strong>{request.peerName}</strong> wants to connect in Air Train.
            {:else if request.step === STEP_CONNECTING}
              Joining <strong>{request.peerName}</strong>.
            {:else if request.step === STEP_CONNECTED}
              <strong>{request.peerName}</strong> is here. The files are in Air Train.
            {:else}
              {request.error || FAILED_TEXT}
            {/if}
          </p>
          {#if request.error && asking}<p class="ride-error text-xs md:text-sm 2xl:text-base" role="alert">{request.error}</p>{/if}
        </div>
      </div>

      {#if asking}
        <form class="flex shrink-0 items-center gap-2 2xl:gap-3" onsubmit={accept}>
          {#if request.sealed}
            <input
              class="ride-pin w-16 rounded-lg px-2 py-2 text-center text-sm sm:py-1.5 2xl:w-24 2xl:py-3 2xl:text-lg"
              bind:value={pin}
              type="password"
              inputmode="numeric"
              autocomplete="off"
              maxlength={PIN_LENGTH}
              placeholder="PIN"
              aria-label="The PIN of your saved rides"
            />
          {/if}
          <button type="submit" class="{BUTTON_CLASS} ride-accept flex-1 sm:flex-none" disabled={busy || (request.sealed && pin.length < PIN_LENGTH)}>
            <Check size={15} aria-hidden="true" />Accept
          </button>
          <button type="button" class="{BUTTON_CLASS} ride-deny flex-1 sm:flex-none" onclick={() => rideBell.deny()}>
            <X size={15} aria-hidden="true" />Deny
          </button>
        </form>
      {:else}
        <div class="flex shrink-0 items-center gap-2 2xl:gap-3">
          {#if request.step === STEP_CONNECTED}
            <button type="button" class="{BUTTON_CLASS} ride-accept flex-1 sm:flex-none" onclick={() => rideBell.openAirTrain()}>
              <ArrowUpRight size={15} aria-hidden="true" />Open Air Train
            </button>
          {/if}
          <button type="button" class="ride-close flex shrink-0 items-center justify-center rounded-full" aria-label="Close" onclick={() => rideBell.dismiss()}>
            <X size={16} />
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style lang="scss">
  @use "../styles/variables" as *;

  .ride-layer {
    z-index: $z-ride-request;
  }

  .ride-card {
    background: $bg-ride-request;
    border: 1px solid $border-ride-request;
    box-shadow: $shadow-ride-request;
    color: $color-blog-ink-strong;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .ride-icon {
    width: 36px;
    height: 36px;
    background: $bg-blog-hover;
    color: $color-neon-red;
  }

  .ride-icon-live {
    color: $color-neon-green;
  }

  .ride-title {
    margin: 0;
    line-height: 1.25;
  }

  .ride-text {
    margin: 0;
    color: $color-blog-ink;
    line-height: 1.35;
  }

  .ride-error {
    margin: 2px 0 0;
    color: $color-neon-red;
  }

  .ride-btn {
    border: 1px solid $border-ride-request;
    background: transparent;
    color: $color-blog-ink-strong;
    cursor: pointer;
    white-space: nowrap;
    transition: background $transition-speed-fast ease, transform $transition-speed-fast ease;

    &:hover,
    &:focus-visible {
      background: $bg-blog-hover;
    }

    &:active {
      transform: scale(0.95);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .ride-accept {
    border-color: $color-neon-green;
    color: $color-neon-green;
  }

  .ride-pin {
    border: 1px solid $border-ride-request;
    background: $bg-input-dark;
    color: $color-blog-ink-strong;
    letter-spacing: 0.3em;
  }

  .ride-close {
    width: 32px;
    height: 32px;
    border: 0;
    background: transparent;
    color: $color-blog-ink;
    cursor: pointer;

    &:hover,
    &:focus-visible {
      background: $bg-blog-hover;
      color: $color-blog-ink-strong;
    }
  }

  // TV and ultra-wide: a bigger icon to match the type
  @media (min-width: 1536px) {
    .ride-icon {
      width: 56px;
      height: 56px;
    }

    .ride-close {
      width: 48px;
      height: 48px;
    }
  }
</style>
