<script>
  import { onMount, tick } from "svelte";
  import { hasJoined, joinMailingList } from "./mailClient.js";

  const FREQUENCY = "about one email a year. that's it.";
  const JOIN_LABEL = "📬 join the mailing list";
  const JOINED_LABEL = "you're on the list. talk soon!";
  const MAX_EMAIL_LENGTH = 254;

  export let active = false;
  let joined = false;
  let expanded = false;
  let busy = false;
  let email = "";
  let error = "";
  let input;
  let trigger;
  let confirmation;
  $: if (!active) expanded = false;

  onMount(() => { joined = hasJoined(); });

  /** Opens the in-place form and focuses its labelled email input. */
  async function openForm() {
    expanded = true;
    error = "";
    await tick();
    if (input) input.focus();
  }

  /** Escape returns keyboard focus without changing the card footprint. */
  async function collapse(event) {
    if (!expanded) return;
    if (event.key !== "Escape") return;
    event.stopPropagation();
    expanded = false;
    error = "";
    await tick();
    if (trigger) trigger.focus();
  }

  /** Keeps request handling in the client; only presentation state lives here. */
  async function submit() {
    if (busy) return;
    busy = true;
    error = "";
    try {
      await joinMailingList(email);
      joined = true;
      expanded = false;
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

<svelte:window on:keydown={collapse} />

<div class="info-card mailing-card col-span-2 w-full flex flex-col sm:col-span-2 max-lg:landscape:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2 rounded-xl md:rounded-2xl text-xs sm:text-sm md:text-sm lg:text-base xl:text-base 2xl:text-lg" class:mail-error={error !== ""}>
  <div class="mail-main">
    {#if joined}
      <p class="joined font-bold" bind:this={confirmation} tabindex="-1">{JOINED_LABEL}</p>
    {:else if expanded}
      <form class="mail-form" on:submit|preventDefault={submit} aria-busy={busy}>
        <label class="sr-only" for="mailing-list-email">email address</label>
        <input bind:this={input} bind:value={email} id="mailing-list-email" type="email" autocomplete="email" inputmode="email" maxlength={MAX_EMAIL_LENGTH} required placeholder="your email" aria-describedby="mail-frequency mail-status" readonly={busy} tabindex={active ? 0 : -1} />
        <button class="submit font-bold" type="submit" disabled={busy} tabindex={active ? 0 : -1}>{busy ? "joining…" : "join"}</button>
      </form>
    {:else}
      <button class="mail-trigger font-bold" type="button" bind:this={trigger} on:click={openForm} tabindex={active ? 0 : -1} aria-expanded={expanded}>{JOIN_LABEL}</button>
    {/if}
  </div>
  <p id="mail-frequency" class="frequency">{FREQUENCY}</p>
  <div class="mail-status" id="mail-status" aria-live="polite" aria-atomic="true">
    {#if error}<span class="error">{error}</span>
    {:else if joined}<span class="sr-only">{JOINED_LABEL}</span>
    {:else}<span>no sharing. <a href="/privacy.html" tabindex={active ? 0 : -1}>privacy</a></span>{/if}
  </div>
</div>

<style lang="scss">
  @use "../styles/variables" as v;

  .mailing-card {
    box-sizing: border-box;
    height: 88px;
    min-width: 0;
    padding: 7px 10px !important;
    justify-content: center;
    background: v.$color-mail-card;
    color: v.$color-mail-ink;
    border: 1px solid v.$color-mail-line;
    transform: none !important;
  }
  .mail-main { height: 34px; flex: 0 0 34px; min-width: 0; }
  .mail-trigger, .joined { width: 100%; height: 100%; margin: 0; }
  .mail-trigger { border: 0; background: transparent; cursor: pointer; }
  .joined { display: flex; align-items: center; justify-content: center; }
  .mail-form { display: flex; width: 100%; height: 100%; }
  input {
    min-width: 0;
    width: 0;
    flex: 1 1 auto;
    padding: 4px 8px;
    background: v.$color-mail-input;
    color: v.$color-mail-ink;
    border: 1px solid v.$color-mail-line;
    border-radius: 6px;
    user-select: text;
    font-size: 16px;
  }
  input::placeholder { color: v.$color-mail-muted; opacity: 1; }
  button { color: inherit; font: inherit; }
  .mail-trigger, .submit { font-weight: 700; }
  .submit { margin-left: 6px; padding: 4px 12px; border: 0; border-radius: 6px; background: v.$color-mail-ink; color: v.$color-mail-input; cursor: pointer; }
  .submit:disabled { opacity: 0.65; cursor: wait; }
  input:focus, button:focus, a:focus { outline: 2px solid v.$color-mail-ink; outline-offset: 2px; }
  .frequency { margin: 3px 0 0; font-size: 11px; line-height: 15px; color: v.$color-mail-muted; }
  .mail-status { height: 14px; flex: 0 0 14px; font-size: 10px; line-height: 14px; color: v.$color-mail-muted; }
  .mail-status a { color: inherit; text-decoration: underline; }
  .error { color: v.$color-mail-error; }
  .mail-error .mail-main { animation: mail-shake 240ms ease-out; }
  @keyframes mail-shake { 25%, 75% { transform: translateX(-3px); } 50% { transform: translateX(3px); } }
  @media (min-width: 768px) { .mailing-card { height: 100px; } .frequency { font-size: 12px; } }
  @media (min-width: 1024px) { .mailing-card { height: 104px; } }
  @media (min-width: 1280px) { .mail-form { max-width: 460px; margin: 0 auto; } }
  @media (min-width: 1536px) { .mailing-card { height: 120px; } .mail-main { height: 40px; flex-basis: 40px; } .frequency { font-size: 14px; line-height: 20px; } .mail-status { font-size: 12px; height: 18px; flex-basis: 18px; line-height: 18px; } }
  @media (min-width: 2560px) { .mailing-card { font-size: 24px; } .frequency { font-size: 16px; } }
  @media (max-width: 1023px) and (orientation: landscape) {
    .mailing-card { height: 76px; padding: 4px 8px !important; font-size: 12px; }
    .mail-main { height: 32px; flex-basis: 32px; }
    .frequency { font-size: 10px; margin-top: 1px; }
    .mail-status { font-size: 9px; }
  }
  @media (prefers-reduced-motion: reduce) { .mailing-card { transition: none !important; } .mail-error .mail-main { animation: none; } }
</style>
