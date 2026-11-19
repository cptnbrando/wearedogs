<script>
  /**
   * Fingerprint: the identifier half of DOGS's privacy tools, and the test bed
   * for DOGS ID (recognising a device without a sign-in page). Collects nothing
   * until the visitor accepts the consent banner. All logic lives in
   * fingerprintEngine.js; this file only renders its state.
   */
  import { tick, onMount } from "svelte";
  import {
    Fingerprint,
    Cookie,
    RotateCcw,
    Trash2,
    Wifi,
    Monitor,
    Cpu,
    ServerCrash,
    UserCheck,
    UserPlus,
    LoaderCircle,
  } from "lucide-svelte";
  import { FingerprintSession } from "./fingerprintEngine.js";
  import "./fingerprint.scss";

  const GROUP_ICONS = { network: Wifi, browser: Monitor, hardware: Cpu };
  const SERVER_ICONS = { pending: LoaderCircle, unavailable: ServerCrash, new: UserPlus, returning: UserCheck, forgotten: Trash2, forgetFailed: ServerCrash };
  const PRIVACY_URL = "/privacy.html#fingerprint";
  const INTRO_POINTS = [
    { icon: Wifi, title: "Network", text: "IP, ISP, city, TLS and HTTP details, as our Cloudflare server sees them." },
    { icon: Monitor, title: "Browser", text: "User agent, client hints, languages, time zone, permissions, codecs and more." },
    { icon: Cpu, title: "Hardware", text: "Screen, CPU, memory, GPU, canvas, audio, fonts, voices and math quirks." },
  ];

  let view = null;
  const session = new FingerprintSession((next) => {
    view = next;
  });
  view = session.state;

  let triggerButton = null;
  let acceptButton = null;
  let resultsEl = null;

  $: consentOpen = view.phase === "consent";
  $: hasReport = view.groups.length > 0 || view.phase === "collecting";
  $: collecting = view.phase === "collecting";
  $: serverIcon = SERVER_ICONS[view.server.status] || LoaderCircle;
  $: if (consentOpen) focusAccept();

  async function focusAccept() {
    await tick();
    if (acceptButton) acceptButton.focus();
  }

  async function closeConsent(accepted) {
    if (accepted) session.accept();
    else session.decline();
    await tick();
    if (triggerButton) triggerButton.focus();
  }

  // Capture phase, so Escape declines the banner instead of also reaching the
  // toolbox's own Escape handler, which would close the whole app
  function onKeydown(event) {
    if (!consentOpen || event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    closeConsent(false);
  }

  onMount(() => {
    window.addEventListener("keydown", onKeydown, true);
    return () => window.removeEventListener("keydown", onKeydown, true);
  });

  function jumpTo(groupId) {
    if (!resultsEl) return;
    const target = resultsEl.querySelector(`[data-group="${groupId}"]`);
    if (target) target.scrollIntoView(true);
  }
</script>

{#snippet actions()}
  <button class="fp-btn fp-btn-ghost" type="button" on:click={() => session.askConsent()} disabled={collecting}>
    <RotateCcw size={16} aria-hidden="true" /> Run again
  </button>
  <button
    class="fp-btn fp-btn-danger"
    type="button"
    on:click={() => session.forget()}
    disabled={collecting || view.forgetting}
  >
    <Trash2 size={16} aria-hidden="true" /> {view.forgetting ? "Forgetting…" : "Forget me"}
  </button>
{/snippet}

<div class="fp-shell flex flex-col w-full h-full text-[14px] 2xl:text-[16px]" aria-busy={collecting}>
  {#if !hasReport}
    <!-- Intro: what this is, and the single button that asks for consent -->
    <section
      class="fp-intro flex flex-col gap-4 p-5 sm:p-6 md:p-10 xl:p-12 2xl:p-14 [@media(max-height:500px)]:flex-row [@media(max-height:500px)]:items-center [@media(max-height:500px)]:gap-6 [@media(max-height:500px)]:p-4"
      aria-labelledby="fp-intro-title"
    >
      <div class="fp-intro-copy flex flex-col gap-3 md:gap-4 [@media(max-height:500px)]:flex-1 [@media(max-height:500px)]:gap-2">
        <div class="flex items-center gap-3">
          <span class="fp-mark"><Fingerprint size={30} aria-hidden="true" /></span>
          <h2 id="fp-intro-title" class="fp-title text-[22px] md:text-[28px] xl:text-[32px] 2xl:text-[38px] [@media(max-height:500px)]:text-[20px]">
            Fingerprint
          </h2>
        </div>
        <p class="fp-lede max-w-[60ch] md:text-[16px] 2xl:text-[19px] [@media(max-height:500px)]:text-[13px]">
          Sites can recognise you without cookies or a login, just from how your device and browser describe
          themselves. This tool runs the documented tracking techniques on you and shows every result. It is also how
          DOGS ID will one day know it's you without a sign-in page.
        </p>
        <p class="fp-note max-w-[60ch] hidden sm:block [@media(max-height:500px)]:hidden 2xl:text-[16px]">
          It tries to recognise this device on a later visit even after you clear cookies and storage. It won't always
          manage it, and identical devices can look alike.
        </p>
        {#if view.phase === "declined"}
          <p class="fp-declined" role="status">No problem. Nothing was read, stored or sent.</p>
        {/if}
      </div>

      <div class="flex flex-col gap-4 [@media(max-height:500px)]:w-[44%] [@media(max-height:500px)]:gap-3">
        <ul class="fp-points grid grid-cols-1 gap-2 sm:grid-cols-3 md:gap-3 xl:gap-4 [@media(max-height:500px)]:gap-2">
          {#each INTRO_POINTS as point}
            <li class="fp-point flex gap-3 p-3 md:flex-col md:p-4 2xl:p-5 [@media(max-height:500px)]:flex-row [@media(max-height:500px)]:items-center [@media(max-height:500px)]:gap-2 [@media(max-height:500px)]:p-2">
              <svelte:component this={point.icon} size={18} aria-hidden="true" />
              <span>
                <strong>{point.title}</strong>
                <span class="fp-point-text block [@media(max-height:500px)]:hidden">{point.text}</span>
              </span>
            </li>
          {/each}
        </ul>
        <button
          class="fp-btn fp-btn-primary fp-cta self-stretch sm:self-start md:text-[16px] 2xl:text-[19px] [@media(max-height:500px)]:self-stretch"
          type="button"
          bind:this={triggerButton}
          on:click={() => session.askConsent()}
          aria-haspopup="dialog"
        >
          <Fingerprint size={20} aria-hidden="true" /> Fingerprint me
        </button>
      </div>
    </section>
  {:else}
    <!-- Report: summary rail beside (or above, on phones) the grouped results -->
    <div class="fp-report flex flex-col flex-1 min-h-0">
      <div class="fp-body flex-1 min-h-0">
        <aside class="fp-rail" aria-label="Summary">
          <div class="fp-card fp-id">
            <span class="fp-kicker">Visitor ID</span>
            <span class="fp-id-value text-[18px] md:text-[17px] xl:text-[19px] 2xl:text-[24px]">{view.visitorId || "Computing…"}</span>
            <span class="fp-small fp-hint">From the signals that survive incognito and cleared storage.</span>
          </div>

          <div class="fp-card fp-server fp-server-{view.server.status}" role="status" aria-live="polite">
            <span class="fp-server-head">
              <svelte:component this={serverIcon} size={18} aria-hidden="true" class={view.server.status === "pending" ? "fp-spin" : ""} />
              <strong>{view.server.headline}</strong>
            </span>
            <span class="fp-small">{view.server.detail}</span>
            {#if view.server.facts.length}
              <dl class="fp-facts">
                {#each view.server.facts as fact}
                  <div><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
                {/each}
              </dl>
            {/if}
            {#if view.hadLocalId && view.server.status === "pending"}
              <span class="fp-small">An ID from an earlier run is in this browser's storage.</span>
            {/if}
          </div>

          {#if view.bits}
            <div class="fp-card">
              <span class="fp-kicker">Identifying power</span>
              <span class="fp-bits text-[18px] 2xl:text-[22px]">~{view.bits} bits</span>
              <span class="fp-small fp-hint">{view.rarity}</span>
            </div>
          {/if}

          <nav class="fp-nav hidden md:flex [@media(max-height:500px)]:flex" aria-label="Jump to group">
            {#each view.groups as group}
              <button type="button" on:click={() => jumpTo(group.id)}>
                <svelte:component this={GROUP_ICONS[group.id]} size={15} aria-hidden="true" />
                {group.title}
                <span class="fp-count">{group.notice ? "offline" : `${group.rows.filter((r) => !r.missing).length}/${group.rows.length}`}</span>
              </button>
            {/each}
          </nav>

          <div class="fp-rail-actions hidden md:flex [@media(max-height:500px)]:flex">
            {@render actions()}
          </div>
        </aside>

        <div class="fp-results" bind:this={resultsEl}>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 2xl:gap-4 [@media(max-height:500px)]:grid-cols-2">
            {#each view.groups as group (group.id)}
              <section class="fp-group" data-group={group.id} aria-labelledby="fp-group-{group.id}">
                <header class="fp-group-head">
                  <svelte:component this={GROUP_ICONS[group.id]} size={18} aria-hidden="true" />
                  <h3 id="fp-group-{group.id}" class="text-[15px] 2xl:text-[19px]">{group.title}</h3>
                </header>
                <p class="fp-small fp-group-blurb">{group.blurb}</p>
                {#if group.notice}
                  <p class="fp-group-notice">{group.notice}</p>
                {/if}
                <ul class="fp-rows">
                  {#each group.rows as row (row.key)}
                    <li class="fp-row" class:fp-missing={row.missing}>
                      <div class="fp-row-head">
                        <span class="fp-label">{row.label}</span>
                        {#if group.id !== "network" && !row.missing}
                          <span class="fp-level fp-level-{row.level}" title="Rough identifying power">{row.level}</span>
                        {/if}
                      </div>
                      <div class="fp-value">{row.value}</div>
                      {#if group.id !== "network"}
                        <div class="fp-bar" aria-hidden="true">
                          <span class="fp-level-{row.level}" style="transform: scaleX({row.bar})"></span>
                        </div>
                      {/if}
                      <p class="fp-why">{row.why}</p>
                    </li>
                  {/each}
                </ul>
              </section>
            {/each}
          </div>
        </div>
      </div>

      <div class="fp-bottom-actions flex md:hidden [@media(max-height:500px)]:hidden">
        {@render actions()}
      </div>
    </div>
  {/if}

  {#if consentOpen}
    <!-- Cookie-banner style consent. Nothing above has run until Accept. -->
    <div class="fp-scrim">
      <div
        class="fp-consent p-4 sm:p-5 md:p-6 2xl:p-8 [@media(max-height:500px)]:p-3"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fp-consent-title"
        aria-describedby="fp-consent-body"
      >
        <div class="fp-consent-text">
          <h3 id="fp-consent-title" class="flex items-center gap-2 text-[17px] md:text-[19px] 2xl:text-[24px] [@media(max-height:500px)]:text-[15px]">
            <Cookie size={20} aria-hidden="true" /> Fingerprint this device?
          </h3>
          <div id="fp-consent-body" class="fp-consent-body">
            <p>If you accept, this page will:</p>
            <ul>
              <li>read your network, browser and hardware details (everything listed on the last screen) and show them here;</li>
              <li>set a <strong>persistent cookie</strong> (<code>__Host-dogs_id</code>, HttpOnly, one year) from our API server, and a random ID in this browser's localStorage (<code>wad-fp-id</code>);</li>
              <li>send <strong>hashes</strong> of those signals, never the raw values, to DOGS servers on Cloudflare, which store them with a hash of your IP, first and last visit times and a visit count;</li>
              <li>run Cloudflare Turnstile, an invisible bot check.</li>
            </ul>
            <p>The record is deleted a year after your last visit, or whenever you press <strong>Forget me</strong>. <a href={PRIVACY_URL} target="_blank" rel="noopener">Privacy policy</a></p>
          </div>
        </div>
        <div class="fp-consent-buttons flex flex-col-reverse gap-2 sm:flex-row sm:justify-end [@media(max-height:500px)]:flex-col-reverse [@media(max-height:500px)]:justify-end">
          <button class="fp-btn fp-btn-ghost" type="button" on:click={() => closeConsent(false)}>Decline</button>
          <button class="fp-btn fp-btn-primary" type="button" bind:this={acceptButton} on:click={() => closeConsent(true)}>
            Accept and fingerprint me
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
