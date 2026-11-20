<script>
  // The app gallery on the landing's second page (DogsMain.svelte): one DOGS app at a time, its features as
  // slides of real demo captures, a recorded walk-through where there is one, and links out to the app.
  // Swipe the picture sideways (or use the arrows) for the next feature; the last feature hands over to the
  // next app. Data and media paths live in src/data/appGallery.js.
  import { ArrowUpRight, ChevronLeft, ChevronRight, Play, X } from "lucide-svelte";
  import { APP_GALLERY } from "../data/appGallery.js";
  import { openDogsPage } from "../lib/openDogsPage.js";

  const SWIPE_PX = 40;
  const ICON_STROKE = 2;
  const SAMPLE_LABEL = "demo capture · sample data";
  const TOOLBOX = { panel: "toolbox" };
  const OPEN_PREFIX = "Open ";

  /** True while the second page is on screen with no panel over it. */
  export let active = false;

  let appIndex = 0;
  let slideIndex = 0;
  let playing = false;
  let failed = false;
  let touchX = null;
  let touchY = null;

  $: app = APP_GALLERY[appIndex];
  $: slide = app.slides[slideIndex];
  $: if (!active) playing = false;
  // DOGS HOME lives on this site: its main button opens the tool on show, in place
  $: target = app.inPlace ? slide.open || TOOLBOX : null;
  $: tryHref = !target ? app.demo : target.app ? `/apps/${target.app}` : target.panel === TOOLBOX.panel ? app.demo : `/${target.panel}`;
  $: tryLabel = target && slide.open ? OPEN_PREFIX + slide.title : app.demoLabel;

  /**
   * Opens a DOGS HOME link over the page instead of following it; other apps' links leave as usual,
   * and a modified click (new tab) is left to the browser.
   * @param {MouseEvent} event
   * @param {{ panel?: string, app?: string } | null} where
   */
  function openInPlace(event, where) {
    if (!where || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    openDogsPage(where);
  }

  /** Opens an app at its first feature. */
  function pickApp(index) {
    appIndex = (index + APP_GALLERY.length) % APP_GALLERY.length;
    slideIndex = 0;
    playing = false;
    failed = false;
  }

  /**
   * Steps one feature, rolling over into the neighbouring app at either end.
   * @param {number} step 1 or -1
   */
  function stepSlide(step) {
    playing = false;
    failed = false;
    const next = slideIndex + step;
    if (next >= 0 && next < app.slides.length) {
      slideIndex = next;
      return;
    }
    appIndex = (appIndex + step + APP_GALLERY.length) % APP_GALLERY.length;
    slideIndex = step > 0 ? 0 : APP_GALLERY[appIndex].slides.length - 1;
  }

  /** Sideways swipes change the feature; vertical ones are left to the landing's page scroll. */
  function swipeEnd(event) {
    if (touchX === null) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchX;
    const dy = touch.clientY - touchY;
    touchX = null;
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) <= Math.abs(dy)) return;
    stepSlide(dx < 0 ? 1 : -1);
  }
</script>

<section class="gallery flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col 2xl:flex-col" aria-label="Apps made by DOGS">
  <div class="apps flex flex-row sm:flex-row md:flex-row lg:flex-row xl:flex-row 2xl:flex-row" role="group" aria-label="Choose an app" style={`--app-count: ${APP_GALLERY.length}`}>
    {#each APP_GALLERY as item, index}
      <button type="button" class="app-pick" class:chosen={appIndex === index} aria-pressed={appIndex === index} tabindex={active ? 0 : -1} on:click={() => pickApp(index)}>
        <span class="app-number" aria-hidden="true">0{index + 1}</span><span class="app-name">{item.name}</span>
      </button>
    {/each}
  </div>

  <div class="exhibit">
    <div class="stage" role="group" aria-label={`${app.name} demo pictures. Swipe sideways for the next feature.`} on:touchstart|passive={(event) => { touchX = event.touches[0].clientX; touchY = event.touches[0].clientY; }} on:touchend|passive={swipeEnd}>
      {#key `${app.id}-${slideIndex}-${playing}`}
        {#if playing && !failed}
          <!-- svelte-ignore a11y_media_has_caption -->
          <video class="capture" src={app.video} poster={app.poster} autoplay muted loop playsinline preload="none" on:error={() => { failed = true; playing = false; }}></video>
        {:else if !failed}
          <img class="capture" src={slide.image} alt={`${app.name}: ${slide.title}. ${slide.text}`} width="1600" height="1000" loading="lazy" decoding="async" on:error={() => { failed = true; }} />
        {:else}
          <p class="media-missing">The preview didn't load. The live demo is one tap away.</p>
        {/if}
      {/key}
      <span class="corner corner-tl" aria-hidden="true"></span><span class="corner corner-br" aria-hidden="true"></span>
      <span class="sample">{app.captureLabel || SAMPLE_LABEL}</span>
      {#if app.video && !playing}
        <button type="button" class="play" tabindex={active ? 0 : -1} on:click={() => { failed = false; playing = true; }}>
          <Play size={14} strokeWidth={ICON_STROKE} aria-hidden="true" />watch the demo
        </button>
      {:else if playing}
        <button type="button" class="play" tabindex={active ? 0 : -1} aria-label="Close the demo video" on:click={() => { playing = false; }}>
          <X size={14} strokeWidth={ICON_STROKE} aria-hidden="true" />close
        </button>
      {/if}
      <div class="arrows">
        <button type="button" aria-label="Previous feature" tabindex={active ? 0 : -1} on:click={() => stepSlide(-1)}><ChevronLeft size={18} strokeWidth={ICON_STROKE} /></button>
        <button type="button" aria-label="Next feature" tabindex={active ? 0 : -1} on:click={() => stepSlide(1)}><ChevronRight size={18} strokeWidth={ICON_STROKE} /></button>
      </div>
    </div>

    <div class="details">
      <header class="app-head" aria-live="polite" aria-atomic="true">
        <h3>{app.name}</h3>
        <p class="tagline">{app.tagline}</p>
      </header>
      <p class="summary">{app.summary}</p>
      <ol class="features" aria-label={`${app.name} features`}>
        {#each app.slides as feature, index}
          <li>
            <button type="button" class="feature" class:current={slideIndex === index} aria-current={slideIndex === index} tabindex={active ? 0 : -1} on:click={() => { slideIndex = index; playing = false; failed = false; }}>
              <span class="feature-title">{feature.title}</span>
              <span class="feature-text">{feature.text}</span>
            </button>
          </li>
        {/each}
      </ol>
      <p class="current-text" aria-hidden="true">{slide.text}</p>
      <div class="links">
        <a class="try" href={tryHref} target={app.inPlace ? null : "_blank"} rel="noopener" tabindex={active ? 0 : -1} on:click={(event) => openInPlace(event, target)}>{tryLabel}<ArrowUpRight size={15} strokeWidth={ICON_STROKE} aria-hidden="true" /></a>
        <a class="visit" href={app.url} target={app.inPlace ? null : "_blank"} rel="noopener" tabindex={active ? 0 : -1} on:click={(event) => openInPlace(event, app.inPlace ? TOOLBOX : null)}>{app.urlLabel || app.url.replace("https://", "").replace(/\/$/, "")}</a>
        <span class="status">{app.status}</span>
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  @use "../styles/gallery" as g;

  // ---- Mobile portrait (default): app picker, picture, then the words ---------------------------------
  .gallery { min-width: 0; min-height: 0; height: 100%; gap: 10px; color: g.$ink; font-family: g.$font; }

  button, a { color: inherit; font: inherit; }
  button { background: none; border: 0; padding: 0; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  button:focus-visible, a:focus-visible { outline: 2px solid g.$ink; outline-offset: 3px; }

  .apps { flex: 0 0 auto; justify-content: space-between; border-bottom: 1px solid g.$line; }
  .app-pick {
    position: relative; flex: 1 1 0; min-height: 40px; padding: 0 2px 2px;
    font-size: 13px; font-weight: 700; color: g.$faint; white-space: nowrap;
    transition: color 0.3s g.$ease;

    &::after {
      content: ""; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px;
      background: g.$accent; transform: scaleX(0); transition: transform 0.4s g.$ease;
    }
    &.chosen { color: g.$ink; }
    &.chosen::after { transform: scaleX(1); }
  }
  .app-number { display: none; margin-right: 8px; font-family: g.$mono; font-size: 0.7em; font-weight: 400; color: g.$faint; }

  .exhibit { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; gap: 10px; }

  .stage { position: relative; flex: 1 1 auto; min-height: 120px; background: g.$stage-bg; overflow: hidden; }
  .capture {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    object-fit: cover; object-position: left top;
    animation: develop 0.6s g.$ease both;
  }
  video.capture { object-fit: contain; background: g.$stage-bg; }
  .media-missing { padding: 20px; font-size: 13px; color: g.$muted; }

  // Two pencil corner marks frame the stage like a photo pinned to a sketchbook
  .corner { position: absolute; width: 18px; height: 18px; pointer-events: none; border: 0 solid g.$stage-line; }
  .corner-tl { top: 6px; left: 6px; border-top-width: 1.5px; border-left-width: 1.5px; }
  .corner-br { right: 6px; bottom: 6px; border-right-width: 1.5px; border-bottom-width: 1.5px; }

  .sample, .play {
    position: absolute; left: 8px; bottom: 8px; display: inline-flex; align-items: center; gap: 6px;
    background: g.$chip-bg; color: g.$ink; font-family: g.$mono; font-size: 10px; letter-spacing: 0.04em;
    padding: 4px 8px; pointer-events: none;
  }
  .sample { left: auto; right: 8px; top: 8px; bottom: auto; }
  .play { left: 8px; bottom: 8px; min-height: 32px; padding: 0 10px; pointer-events: auto; font-size: 11px; }
  .arrows { position: absolute; right: 8px; bottom: 8px; display: flex; gap: 4px; }
  .arrows button {
    width: 36px; height: 32px; display: flex; align-items: center; justify-content: center;
    background: g.$chip-bg; color: g.$ink; transition: background-color 0.2s;
  }
  @media (hover: hover) { .arrows button:hover { background: g.$link-bg; color: g.$link-ink; } }

  .details { display: flex; flex-direction: column; flex: 0 0 auto; min-width: 0; gap: 6px; }
  .app-head { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
  h3 { margin: 0; font-size: 26px; font-weight: 900; line-height: 1; letter-spacing: -0.03em; }
  .tagline { margin: 0; font-size: 13px; color: g.$muted; }
  .summary { display: none; margin: 0; font-size: 13px; line-height: 1.5; color: g.$ink; max-width: 60ch; }

  .features { display: flex; flex-wrap: wrap; gap: 4px 14px; margin: 0; padding: 0; list-style: none; }
  .feature { display: block; text-align: left; min-height: 32px; }
  .feature-title {
    position: relative; font-size: 12px; font-weight: 700; color: g.$faint; transition: color 0.3s;

    &::after {
      content: ""; position: absolute; left: 0; right: 0; bottom: -3px; height: 1.5px; background: g.$ink;
      transform: scaleX(0); transform-origin: left; transition: transform 0.45s g.$ease;
    }
  }
  .feature.current .feature-title { color: g.$ink; }
  .feature.current .feature-title::after { transform: scaleX(1); }
  .feature-text { display: none; }
  .current-text { margin: 0; font-size: 12px; line-height: 1.45; color: g.$muted; min-height: 2.9em; }

  .links { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 14px; }
  .try {
    display: inline-flex; align-items: center; gap: 6px; min-height: 40px; padding: 0 14px;
    background: g.$link-bg; color: g.$link-ink; font-size: 13px; font-weight: 800; text-decoration: none;
    transition: transform 0.3s g.$ease;
  }
  @media (hover: hover) { .try:hover { transform: translateY(-2px); } }
  .visit { font-family: g.$mono; font-size: 11px; color: g.$ink; text-underline-offset: 4px; }
  .status { display: none; font-family: g.$mono; font-size: 10px; color: g.$faint; }

  @keyframes develop {
    from { opacity: 0; -webkit-filter: grayscale(1) blur(4px); filter: grayscale(1) blur(4px); transform: scale(1.02); }
    to { opacity: 1; -webkit-filter: none; filter: none; transform: none; }
  }

  // ---- Short phones in portrait: the picture gives up height first ------------------------------------
  @media (orientation: portrait) and (max-height: 700px) {
    h3 { font-size: 22px; }
    .tagline { display: none; }
    .try { min-height: 36px; }
  }

  // ---- Phones: the apps as equal segments, each name centred under its number, a hairline between ------
  // A long name (DOGS HOME) breaks onto a second line inside its own segment instead of crowding the next one.
  @media (orientation: portrait) and (max-width: 767px), (orientation: landscape) and (max-height: 599px) {
    .apps { display: grid; grid-template-columns: repeat(var(--app-count), minmax(0, 1fr)); }
    .app-pick {
      display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 3px;
      min-height: 46px; padding: 2px 3px 9px; font-size: 11px; line-height: 1.15; text-align: center; white-space: normal;
    }
    .app-pick + .app-pick { box-shadow: inset 1px 0 0 g.$line; }
    .app-number { display: block; margin: 0; font-size: 9px; letter-spacing: 0.06em; }
    .app-name { text-wrap: balance; }
  }
  @media (orientation: portrait) and (max-width: 374px) { .app-pick { font-size: 10px; } }

  // Short phones in portrait: one-line tabs, the features in one swipeable row (the arrows on the picture
  // page through them too) and a shorter picture, so the gallery never runs into the like below it
  @media (orientation: portrait) and (max-height: 700px) {
    .app-number { display: none; }
    .app-pick { min-height: 36px; padding-top: 6px; }
    .stage { min-height: 96px; }
    .features { flex-wrap: nowrap; overflow-x: auto; overflow-y: hidden; scrollbar-width: none; -ms-overflow-style: none; }
    .features::-webkit-scrollbar { display: none; }
    .features li { flex: 0 0 auto; }
    .feature-title { white-space: nowrap; }
  }
  // The smallest phones (iPhone SE 1st gen): a shorter picture still, and the note held to three lines
  @media (orientation: portrait) and (max-height: 600px) {
    .gallery, .exhibit { gap: 6px; }
    .stage { min-height: 72px; }
    .app-pick { min-height: 32px; padding-bottom: 6px; }
    .try { min-height: 32px; }
    .feature { min-height: 28px; }
    .current-text { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; }
  }

  // ---- Mobile landscape: picture left, words right ----------------------------------------------------
  @media (orientation: landscape) and (max-height: 599px) {
    .gallery { gap: 6px; }
    .app-pick { min-height: 30px; padding-top: 4px; padding-bottom: 6px; font-size: 12px; }
    .app-number { display: none; }
    .exhibit { flex-direction: row; gap: 12px; }
    .stage { flex: 1.25 1 0; min-height: 0; }
    .details { flex: 1 1 0; gap: 4px; min-height: 0; overflow: hidden; }
    h3 { font-size: 20px; }
    .tagline { font-size: 11px; }
    .feature { min-height: 26px; }
    .feature-title { font-size: 11px; }
    .current-text { font-size: 11px; min-height: 0; }
    .try { min-height: 32px; font-size: 12px; padding: 0 10px; }
    .visit { display: none; }
    .sample { display: none; }
    .play { left: 6px; bottom: 6px; min-height: 28px; }
    .arrows { right: 6px; bottom: 6px; }
    .arrows button { width: 32px; height: 28px; }
  }

  // ---- Tablet portrait: tall picture, the features as tabs with the picked one's note under them --------
  @media (min-width: 768px) and (orientation: portrait) {
    .gallery { gap: 16px; }
    .app-pick { min-height: 48px; font-size: 16px; }
    .app-number { display: inline; }
    .exhibit { gap: 18px; }
    .stage { min-height: 200px; }
    .details { gap: 10px; }
    h3 { font-size: 40px; }
    .tagline { font-size: 16px; }
    .summary { display: block; font-size: 15px; }
    .features { gap: 6px 26px; }
    .feature-title { font-size: 15px; }
    .current-text { font-size: 15px; line-height: 1.5; max-width: 60ch; }
    .try { min-height: 46px; font-size: 15px; padding: 0 18px; }
    .visit { font-size: 13px; }
    .status { display: inline; font-size: 11px; }
  }

  // ---- Tablet landscape and desktop: the picture full width, the notes in a row beneath --------------
  @media (min-width: 1024px) and (orientation: landscape) and (min-height: 600px) {
    .gallery { gap: 16px; }
    .app-pick { flex: 0 0 auto; min-height: 44px; margin-right: 28px; font-size: 15px; }
    .app-number { display: inline; }
    .apps { justify-content: flex-start; }
    .exhibit { gap: 18px; }
    .stage { min-height: 0; }
    .details {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.7fr);
      grid-template-areas: "head features" "summary features" "links features";
      grid-template-rows: auto auto 1fr;
      gap: 6px 36px;
    }
    .app-head { grid-area: head; flex-direction: column; gap: 4px; }
    .summary { grid-area: summary; display: block; font-size: 13px; }
    .links { grid-area: links; align-self: end; }
    .features { grid-area: features; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 24px; align-content: start; }
    .feature { width: 100%; padding-left: 12px; border-left: 1.5px solid g.$line; transition: border-color 0.3s; }
    .feature.current { border-left-color: g.$ink; }
    .feature-title::after { display: none; }
    .feature-title { font-size: 14px; }
    .feature-text { display: block; margin-top: 3px; font-size: 12px; line-height: 1.4; color: g.$muted; }
    .current-text { display: none; }
    h3 { font-size: 36px; }
    .tagline { font-size: 14px; }
    .try { min-height: 40px; font-size: 14px; }
    .status { display: block; width: 100%; }
  }

  // Short desktop windows: the summary goes and only the picked feature keeps its note
  @media (min-width: 1024px) and (orientation: landscape) and (min-height: 600px) and (max-height: 760px) {
    .summary { display: none; }
    .feature-text { display: none; }
    .feature.current .feature-text { display: block; }
  }

  // Ultra-wide: show the whole capture rather than cropping its bottom away
  @media (min-aspect-ratio: 21/9) and (min-height: 600px) { img.capture { object-fit: contain; object-position: center; } }

  // ---- Wide desktop -----------------------------------------------------------------------------------
  @media (min-width: 1280px) and (min-height: 760px) {
    h3 { font-size: 52px; }
    .tagline { font-size: 17px; }
    .summary { font-size: 15px; }
    .feature-title { font-size: 15px; }
    .feature-text { font-size: 13px; }
  }

  // ---- TV and ultra-wide ------------------------------------------------------------------------------
  @media (min-width: 1920px) and (min-height: 1000px) {
    .gallery { gap: 28px; }
    .app-pick { min-height: 64px; font-size: 22px; margin-right: 44px; }
    .exhibit { gap: 44px; }
    h3 { font-size: 80px; }
    .tagline { font-size: 24px; }
    .summary { font-size: 21px; }
    .details { gap: 18px; }
    .features { gap: 18px; }
    .feature { padding-left: 20px; border-left-width: 2px; }
    .feature-title { font-size: 21px; }
    .feature-text { font-size: 17px; }
    .try { min-height: 64px; padding: 0 28px; font-size: 20px; }
    .visit { font-size: 17px; }
    .status { font-size: 15px; }
    .sample, .play { font-size: 15px; padding: 8px 14px; }
    .sample { right: 14px; top: 14px; }
    .play { left: 14px; bottom: 14px; min-height: 48px; }
    .arrows { right: 14px; bottom: 14px; gap: 6px; }
    .arrows button { width: 52px; height: 48px; }
    .corner { width: 30px; height: 30px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .capture { animation: none; }
    .app-pick::after, .feature-title::after, .try { transition: none; }
  }
</style>
