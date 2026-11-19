<script>
  import AppGallery from "./AppGallery.svelte";
  import LikeButton from "./LikeButton.svelte";
  import MailingList from "./MailingList.svelte";
  export let isFlagColors = false;
  export let active = false;
  export let activePage = null;
  let joining = false;
  $: if (!active) joining = false;
</script>

<div class="dogs-gallery w-full h-full flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col 2xl:flex-col" class:colored={isFlagColors}>
  <div class="gallery-shell">
    <header><h2>Made by DOGS<span>.</span></h2><p>Small team. Big ideas.</p></header>
    <AppGallery active={active && activePage === null} />
    <footer>
      <LikeButton {active} />
      <div class="community">
        <button class="join" on:click={() => { joining = !joining; }} aria-expanded={joining} tabindex={active ? 0 : -1}>{joining ? "Close signup" : "Stay in the loop ↗"}</button>
        {#if joining}<div class="signup"><MailingList {active} /></div>{/if}
      </div>
    </footer>
  </div>
</div>

<style lang="scss">
  @use "../styles/gallery" as g;
  .dogs-gallery { background: g.$background; color: g.$ink; font-family: g.$font; padding: 22px 20px 70px; box-sizing: border-box; }
  .gallery-shell { display: flex; flex-direction: column; width: 100%; height: 100%; max-width: 1280px; margin: auto; min-height: 0; }
  header { display: flex; align-items: baseline; justify-content: space-between; border-bottom: 1px solid g.$line; padding-bottom: 12px; margin-bottom: 18px; }
  h2 { margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -.03em; } h2 span { color: g.$accent; }
  header p { margin: 0; font-size: 10px; color: g.$muted; }
  footer { display: flex; flex: 0 0 auto; align-items: center; justify-content: space-between; gap: 12px; margin-top: 10px; padding-top: 8px; border-top: 1px solid g.$line; }
  .community { position: relative; flex: 0 0 auto; }
  .join { background: none; color: g.$ink; font: inherit; font-size: 11px; border: 0; min-height: 44px; cursor: pointer; }
  .join:focus { outline: 2px solid g.$ink; outline-offset: 3px; }
  .signup { position: absolute; bottom: 100%; right: 0; width: 280px; max-width: 80vw; z-index: 5; box-shadow: 0 8px 30px g.$background; }
  @media (min-width: 768px) { .dogs-gallery { padding: 32px 36px 65px; } h2 { font-size: 24px; } header p { font-size: 13px; } footer { margin-top: 20px; } .join { font-size: 13px; } }
  @media (min-width: 1280px) { .dogs-gallery { padding: 36px 64px 65px; } }
  @media (min-width: 1536px) and (min-height: 900px) { .dogs-gallery { padding-top: 48px; } header { margin-bottom: 30px; } h2 { font-size: 30px; } }
  @media (min-width: 2400px) { .gallery-shell { max-width: 1760px; } h2 { font-size: 40px; } header p, .join { font-size: 18px; } }
  @media (orientation: portrait) and (min-width: 1024px) { .dogs-gallery { padding: 64px 48px 90px; } }
  @media (orientation: landscape) and (max-height: 599px) { .dogs-gallery { padding: 12px 24px 36px; } header { margin-bottom: 8px; padding-bottom: 6px; } h2 { font-size: 16px; } footer { margin-top: 6px; padding-top: 4px; } }
  @media (max-width: 380px) { header p { display: none; } .dogs-gallery { padding-right: 14px; padding-left: 14px; } .join { font-size: 10px; } }
</style>
