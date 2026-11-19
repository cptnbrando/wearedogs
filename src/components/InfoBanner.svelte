<script>
  // The footnote under the like on the landing's second page (DogsMain.svelte): what liking and joining send,
  // the privacy policy, and a way to email DOGS. Plain text, no box, so it never competes with the gallery.
  /** True while the second page is on screen; its links leave the tab order otherwise. */
  export let active = false;

  const NOTICE = "A like sends hashed device signals and a Cloudflare check to keep it to one like per device. Joining saves only your email.";
  const PRIVACY_LABEL = "privacy";
  const PRIVACY_URL = "/privacy.html";
  const EMAIL_LABEL = "email us";
  const EMAIL_URL = "mailto:brando@wearedogs.net?subject=Hello%20There!&body=BARK%20BARK%20BARK%20BARK%20BARK%20BARK%20BARK";
</script>

<p class="footnote m-0 leading-snug text-[10px] sm:text-[10px] md:text-[11px] lg:text-[11px] xl:text-xs 2xl:text-lg max-lg:landscape:text-[9px]">
  {NOTICE}
  <span class="links whitespace-nowrap">
    <a href={PRIVACY_URL} target="_blank" rel="noopener" tabindex={active ? 0 : -1}>{PRIVACY_LABEL}</a>
    · <a href={EMAIL_URL} tabindex={active ? 0 : -1}>{EMAIL_LABEL}</a>
  </span>
</p>

<style lang="scss">
  @use "../styles/gallery" as g;

  .footnote { color: g.$muted; max-width: 46ch; }

  a {
    color: g.$ink;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  a:focus-visible {
    outline: 2px solid g.$ink;
    outline-offset: 2px;
  }
</style>
