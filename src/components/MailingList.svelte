<script>
  // The top row of the info grid (DogsMain.svelte): an always-open email field that saves the address to D1
  // through mailClient.js. The line under it says how rarely we write, and turns into the error when one happens.
  // The card is a fixed height in every state, so nothing around it moves.
  import { onMount, tick } from "svelte";
  import { hasJoined, joinMailingList } from "./mailClient.js";

  const FREQUENCY = "about one email a year. that's it.";
  const LABEL = "email address";
  const PLACEHOLDER = "your email";
  const JOIN = "join";
  const JOINING = "joining…";
  const JOINED_LABEL = "📬 you're on the list. talk soon!";
  const MAX_EMAIL_LENGTH = 254;

  /** True while the info page is on screen; its controls leave the tab order otherwise. */
  export let active = false;

  let joined = false;
  let busy = false;
  let email = "";
  let error = "";
  /** @type {HTMLParagraphElement} */
  let confirmation;

  onMount(() => {
    joined = hasJoined();
  });

  /** Sends the address; request handling stays in mailClient.js. */
  async function submit() {
    if (busy) return;
    busy = true;
    error = "";
    try {
      await joinMailingList(email);
      joined = true;
      email = "";
      await tick();
      if (active && confirmation) confirmation.focus();
    } catch (failure) {
      error = failure.message;
    } finally {
      busy = false;
    }
  }
</script>

<div
  class="info-card mailing-card col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2 max-lg:landscape:col-span-2 flex w-full flex-col justify-center rounded-xl md:rounded-2xl px-2.5 md:px-3 xl:px-4 2xl:px-6 h-[72px] sm:h-[72px] md:h-20 lg:h-20 xl:h-[88px] 2xl:h-32 max-lg:landscape:h-[60px] text-sm md:text-base 2xl:text-2xl max-lg:landscape:text-xs"
  class:mail-error={error !== ""}
>
  {#if joined}
    <p class="joined flex flex-1 items-center justify-center font-bold" bind:this={confirmation} tabindex="-1">{JOINED_LABEL}</p>
  {:else}
    <form class="mail-form flex flex-1 items-stretch gap-1.5 md:gap-2 2xl:gap-3" on:submit|preventDefault={submit} aria-busy={busy}>
      <label class="sr-only" for="mailing-list-email">{LABEL}</label>
      <input
        id="mailing-list-email"
        class="mail-input min-w-0 flex-1 rounded-md md:rounded-lg 2xl:rounded-xl px-2.5 md:px-3 2xl:px-5"
        type="email"
        autocomplete="email"
        inputmode="email"
        maxlength={MAX_EMAIL_LENGTH}
        required
        placeholder={PLACEHOLDER}
        aria-describedby="mail-status"
        readonly={busy}
        tabindex={active ? 0 : -1}
        bind:value={email}
      />
      <button class="mail-submit shrink-0 rounded-md md:rounded-lg 2xl:rounded-xl px-3 md:px-4 2xl:px-7 font-bold" type="submit" disabled={busy} tabindex={active ? 0 : -1}>{busy ? JOINING : JOIN}</button>
    </form>
  {/if}
  <p class="mail-status mt-1 truncate text-center text-[10px] sm:text-[11px] md:text-xs lg:text-xs xl:text-xs 2xl:text-base max-lg:landscape:mt-0.5 max-lg:landscape:text-[9px]" id="mail-status" aria-live="polite">
    {#if error}<span class="error">{error}</span>{:else}{FREQUENCY}{/if}
  </p>
</div>

<style lang="scss">
  @use "../styles/variables" as v;

  // Fixed height in every state; the grid's shared hover lift stays off so the field never jumps while typing
  .mailing-card {
    box-sizing: border-box;
    min-width: 0;
    padding-top: 0.5rem !important;
    padding-bottom: 0.375rem !important;
    background: v.$color-mail-card;
    color: v.$color-mail-ink;
    border: 1px solid v.$color-mail-line;
    transform: none !important;
  }

  .mail-form,
  .joined {
    min-height: 0;
    margin: 0;
  }

  .mail-input {
    width: 0;
    background: v.$color-mail-input;
    color: v.$color-mail-ink;
    border: 1px solid v.$color-mail-line;
    user-select: text;
    // 16px keeps phones from zooming into the field
    font-size: 16px;
  }

  .mail-input::placeholder {
    color: v.$color-mail-muted;
    opacity: 1;
  }

  .mail-submit {
    border: 0;
    background: v.$color-mail-ink;
    color: v.$color-mail-input;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  .mail-submit:disabled {
    opacity: 0.65;
    cursor: wait;
  }

  .mail-input:focus,
  .mail-submit:focus,
  .joined:focus {
    outline: 2px solid v.$color-mail-ink;
    outline-offset: 2px;
  }

  .mail-status {
    flex: 0 0 auto;
    color: v.$color-mail-muted;
    line-height: 1.3;
  }

  .error {
    color: v.$color-mail-error;
  }

  .mail-error .mail-form {
    animation: mail-shake 240ms ease-out;
  }

  @keyframes mail-shake {
    25%,
    75% {
      transform: translateX(-3px);
    }
    50% {
      transform: translateX(3px);
    }
  }

  @media (min-width: 1536px) {
    .mail-input {
      font-size: 1.5rem;
    }
  }

  @media (max-width: 1023px) and (orientation: landscape) {
    .mailing-card {
      padding-top: 0.3rem !important;
      padding-bottom: 0.25rem !important;
    }

    .mail-input {
      font-size: 14px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .mailing-card {
      transition: none !important;
    }

    .mail-error .mail-form {
      animation: none;
    }
  }
</style>
