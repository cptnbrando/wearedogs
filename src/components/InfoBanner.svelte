<script>
  // The banner under the info grid (DogsMain.svelte): what liking and joining send, the privacy policy, and a way
  // to email DOGS. Spans both grid columns.
  import { Mail } from "lucide-svelte";

  /** True while the info page is on screen; its links leave the tab order otherwise. */
  export let active = false;

  const NOTICE = "Liking sends hashed device signals and a Cloudflare check to limit repeat votes. Joining saves only your email.";
  const PRIVACY_LABEL = "privacy policy";
  const PRIVACY_URL = "/privacy.html";
  const EMAIL_LABEL = "email us";
  const EMAIL_URL = "mailto:brando@wearedogs.net?subject=Hello%20There!&body=BARK%20BARK%20BARK%20BARK%20BARK%20BARK%20BARK";
  const ICON_STROKE = 2;
</script>

<div
  class="info-banner col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2 max-lg:landscape:col-span-2 flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row max-lg:landscape:flex-row items-center justify-center gap-x-3 gap-y-1 2xl:gap-x-6 rounded-lg md:rounded-xl px-3 py-1.5 md:px-4 md:py-2 2xl:px-6 2xl:py-3 max-lg:landscape:px-2 max-lg:landscape:py-1 text-center md:text-left text-[10px] sm:text-[11px] md:text-xs lg:text-xs xl:text-sm 2xl:text-lg max-lg:landscape:text-[9px] leading-snug"
>
  <p class="notice m-0">{NOTICE}</p>
  <span class="links flex shrink-0 items-center gap-2.5 2xl:gap-4 whitespace-nowrap">
    <a href={PRIVACY_URL} target="_blank" rel="noopener" tabindex={active ? 0 : -1}>{PRIVACY_LABEL}</a>
    <a class="email-link inline-flex items-center gap-1 2xl:gap-2" href={EMAIL_URL} tabindex={active ? 0 : -1}>
      <Mail class="w-3 h-3 md:w-3.5 md:h-3.5 2xl:w-5 2xl:h-5" strokeWidth={ICON_STROKE} aria-hidden="true" />{EMAIL_LABEL}
    </a>
  </span>
</div>

<style lang="scss">
  @use "../styles/variables" as vars;

  .info-banner {
    color: vars.$color-consent-text-muted;
    background: vars.$color-info-banner-bg;
    border: 1px solid vars.$color-info-banner-line;
  }

  a {
    color: vars.$color-like-text;
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  a:focus-visible {
    outline: 2px solid vars.$color-like-ink;
    outline-offset: 2px;
  }
</style>
