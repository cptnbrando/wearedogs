<script>
  import { ArrowUpRight, ChevronLeft, ChevronRight, Play, X } from "lucide-svelte";
  import { APP_GALLERY } from "../data/appGallery.js";
  const SWIPE_DISTANCE = 50;
  export let active = false;
  let selected = 0;
  let playing = false;
  let mediaFailed = false;
  let touchX = null;
  let touchY = null;
  $: app = APP_GALLERY[selected];
  $: if (!active) playing = false;
  /** Keep media and failure state scoped to the selected app. */
  function select(index) {
    selected = (index + APP_GALLERY.length) % APP_GALLERY.length;
    playing = false;
    mediaFailed = false;
  }
  /** Horizontal swipes change apps; vertical swipes still navigate the landing. */
  function swipe(event) {
    if (touchX === null) return;
    const distance = event.changedTouches[0].clientX - touchX;
    const vertical = event.changedTouches[0].clientY - touchY;
    touchX = null;
    if (Math.abs(distance) < SWIPE_DISTANCE || Math.abs(distance) <= Math.abs(vertical)) return;
    select(selected + (distance < 0 ? 1 : -1));
  }
</script>

<!-- DOGS' dark canvas frames real software. A fixed preview, a compact app rail,
     and short notes reflow across orientations without adding a third page. -->
<section class="gallery flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row" aria-label="Apps made by DOGS">
  <nav class="app-rail" aria-label="Choose an app">
    {#each APP_GALLERY as item, index}
      <button class:chosen={selected === index} aria-pressed={selected === index} on:click={() => select(index)} tabindex={active ? 0 : -1}>
        <span class="app-number">0{index + 1}</span><span>{item.name}</span><ArrowUpRight size={16} aria-hidden="true" />
      </button>
    {/each}
  </nav>
  <div class="exhibit">
    <div class="app-heading" aria-live="polite" aria-atomic="true">
      <div><h3>{app.name}</h3><p>{app.tagline}</p></div>
      <div class="arrows">
        <button on:click={() => select(selected - 1)} aria-label="Previous app" tabindex={active ? 0 : -1}><ChevronLeft size={20} /></button>
        <button on:click={() => select(selected + 1)} aria-label="Next app" tabindex={active ? 0 : -1}><ChevronRight size={20} /></button>
      </div>
    </div>
    <div class="preview" on:touchstart|passive={(event) => { touchX = event.touches[0].clientX; touchY = event.touches[0].clientY; }} on:touchend|passive={swipe}>
      {#key app.id}
        {#if playing && !mediaFailed}
          <video src={app.video} poster={app.image} controls autoplay muted playsinline preload="none" on:error={() => { mediaFailed = true; playing = false; }}><track kind="captions" /></video>
          <button class="close-video" on:click={() => { playing = false; }} aria-label="Close demo video" tabindex={active ? 0 : -1}><X size={18} /></button>
        {:else if !mediaFailed}
          <img src={app.image} alt={`${app.name} public demo, showing sample data`} width="1280" height="800" loading="lazy" on:error={() => { mediaFailed = true; }} />
          {#if app.video}<button class="play" on:click={() => { playing = true; }} tabindex={active ? 0 : -1}><Play size={16} aria-hidden="true" /> Watch demo</button>{/if}
        {:else}
          <p class="media-error">Preview unavailable. Explore the live demo below.</p>
        {/if}
      {/key}
      <span class="capture-label">Demo capture · sample data</span>
    </div>
    <div class="app-details">
      <div class="description"><p>{app.description}</p><span class="status">{app.status}</span></div>
      <dl>{#each app.features as feature}<div><dt>{feature[0]}</dt><dd>{feature[1]}</dd></div>{/each}</dl>
      <div class="app-links">
        <a href={app.demo} target="_blank" rel="noopener noreferrer" tabindex={active ? 0 : -1}>Explore demo <ArrowUpRight size={16} aria-hidden="true" /></a>
        <a href={app.url} target="_blank" rel="noopener noreferrer" tabindex={active ? 0 : -1}>Visit {app.name} <ArrowUpRight size={16} aria-hidden="true" /></a>
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  @use "../styles/gallery" as g;
  .gallery { min-height: 0; min-width: 0; flex: 1; gap: 18px; }
  .app-rail { display: flex; flex: 0 0 auto; order: 2; border-top: 1px solid g.$line; }
  button, a { color: inherit; font: inherit; } button { background: none; cursor: pointer; }
  button:focus, a:focus { outline: 2px solid g.$ink; outline-offset: 3px; }
  .app-rail button { flex: 1; display: flex; align-items: center; justify-content: center; min-height: 44px; padding: 8px; border: 0; border-bottom: 2px solid transparent; font-size: 13px; color: g.$muted; }
  .app-rail button.chosen { color: g.$ink; border-color: g.$accent; }
  .app-number, .app-rail :global(svg) { display: none; }
  .exhibit { display: flex; flex-direction: column; min-height: 0; min-width: 0; flex: 1; }
  .app-heading { display: flex; justify-content: space-between; align-items: center; flex: 0 0 auto; margin-bottom: 12px; }
  h3 { font-size: 28px; font-weight: 800; line-height: 1.1; margin: 0; letter-spacing: -.03em; }
  .app-heading p { margin: 5px 0 0; color: g.$muted; font-size: 13px; }
  .arrows { display: flex; }
  .arrows button { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border: 1px solid g.$line; }
  .arrows button + button { border-left: 0; }
  .preview { position: relative; min-height: 80px; flex: 1 1 220px; background: g.$surface; border: 1px solid g.$line; overflow: hidden; }
  .preview img, video { width: 100%; height: 100%; position: absolute; top: 0; left: 0; object-fit: contain; }
  .preview img { animation: develop 280ms g.$ease; }
  .play, .close-video { position: absolute; display: flex; align-items: center; justify-content: center; gap: 8px; background: g.$paper; color: g.$pencil; border: 0; padding: 10px 14px; min-height: 44px; }
  .play { bottom: 28px; left: 12px; font-size: 12px; font-weight: 700; } .close-video { right: 8px; top: 8px; }
  .capture-label { position: absolute; bottom: 0; left: 0; font-size: 10px; padding: 3px 8px; background: g.$surface; color: g.$muted; pointer-events: none; }
  .media-error { padding: 24px; } .app-details { flex: 0 0 auto; padding-top: 12px; }
  .description p { font-size: 12px; line-height: 1.5; margin: 0; max-width: 65ch; }
  .status { display: block; color: g.$muted; font-size: 10px; margin-top: 5px; }
  dl { display: none; margin: 16px 0; } dt { font-size: 12px; font-weight: 700; margin-bottom: 4px; }
  dd { font-size: 11px; line-height: 1.5; color: g.$muted; margin: 0; }
  .app-links { display: flex; gap: 24px; }
  .app-links a { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; font-size: 12px; text-underline-offset: 5px; }
  .app-links a:first-child { font-weight: 700; }
  @keyframes develop { from { opacity: .5; transform: translateY(5px); } to { opacity: 1; transform: none; } }
  @media (min-width: 768px) and (min-height: 600px) {
    .app-rail { order: 0; width: 140px; flex-direction: column; border-top: 0; border-right: 1px solid g.$line; padding-right: 16px; }
    .app-rail button { flex: 0 0 auto; justify-content: flex-start; padding: 16px 0; text-align: left; }
    .app-number { display: inline; font-size: 10px; margin-right: 10px; }
    h3 { font-size: 40px; } .app-heading p { font-size: 16px; }
    dl { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
    .description p { font-size: 14px; } .status { font-size: 11px; }
  }
  @media (min-width: 1280px) { .app-rail { width: 190px; } h3 { font-size: 48px; } .app-rail button { font-size: 16px; } .app-rail :global(svg) { display: block; margin-left: auto; } dt { font-size: 14px; } dd { font-size: 13px; } }
  @media (min-width: 1536px) and (min-height: 900px) { .gallery { gap: 32px; } .app-rail { width: 210px; } h3 { font-size: 56px; } .description p, .app-links a { font-size: 16px; } }
  @media (min-width: 2400px) { .app-heading p { font-size: 22px; } dt { font-size: 20px; } dd { font-size: 17px; } }
  @media (orientation: portrait) and (min-width: 768px) { .gallery { gap: 24px; } .preview { flex-basis: 360px; } dl { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 767px) and (min-height: 760px) { dl { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 16px; margin: 10px 0 0; } }
  @media (orientation: landscape) and (max-height: 599px) {
    .gallery { flex-direction: row; gap: 12px; } .app-rail { order: 0; flex-direction: column; width: 92px; border-top: 0; border-right: 1px solid g.$line; padding-right: 8px; } .app-rail button { flex: 0 0 auto; font-size: 12px; }
    .exhibit { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); grid-template-rows: auto minmax(0, 1fr); gap: 8px 14px; }
    .app-heading { grid-column: 1 / -1; margin: 0; } h3 { font-size: 24px; } .app-heading p { display: none; }
    .preview { min-height: 0; } .app-details { padding: 0; overflow-y: auto; } .description p { font-size: 11px; } .status { font-size: 10px; } .app-links { gap: 12px; flex-wrap: wrap; } .app-links a { font-size: 11px; }
    .play { padding: 6px 10px; left: 6px; bottom: 22px; }
  }
  @media (prefers-reduced-motion: reduce) { .preview img { animation: none; } }
</style>
