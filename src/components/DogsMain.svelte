<script>
  // The landing's second (and last) page: a two-sided card under the DOGS letters. Side one is the apps
  // (ProjectsSide.svelte), side two the dictionary entry and the dancing dogs (DogsSide.svelte). Scrolling down
  // past it turns the card over sideways instead of moving to a new page; scrolling up always goes back to the
  // letters. The side the visitor was on is remembered for the tab (cardFlip.js).
  import { onMount } from "svelte";
  import BinaryBackground from "./BinaryBackground.svelte";
  import ProjectsSide from "./ProjectsSide.svelte";
  import DogsSide from "./DogsSide.svelte";
  import { attachCardFlip, readSide, saveSide, SIDE_APPS, SIDE_DOGS } from "./cardFlip.js";

  const FLIP_MS = 850;            // One turn of the card; keep in step with --flip-ms below
  const ARRIVE_MS = 250;          // A beat after the page has snapped into place before a gesture can turn the card
  const REPEAT_MS = 600;          // Shortest time between two turns; a turn asked for sooner waits, it isn't lost
  const SETTLED_PX = 2;           // The page counts as arrived once its top is this close to the screen's top
  const LANDING_ID = "landing-page";
  const SIDE_NAMES = ["the DOGS apps", "the DOGS dictionary entry and dancing dogs"];

  /** Flag-colors mode from the first page. */
  export let isFlagColors = false;
  /** True while this page is the one on screen. */
  export let active = false;
  /** The open side panel, if any; the card holds still and its dogs and gallery pause under it. */
  export let activePage = null;

  let pageEl;
  let side = readSide();
  // Half-turns made so far: the card keeps turning the same way rather than winding back
  let turns = side;
  let turned = false;
  let arrivedAt = 0;

  $: if (active) arrivedAt = Date.now();
  $: ready = active && activePage === null;

  /** Turns the card over to its other side. */
  function flip() {
    turns += 1;
    turned = true;
    side = turns % 2;
    saveSide(side);
  }

  onMount(() => attachCardFlip(pageEl, {
    isEnabled: () => ready && Date.now() - arrivedAt > ARRIVE_MS && Math.abs(pageEl.getBoundingClientRect().top) < SETTLED_PX,
    onFlip: flip,
    onUp: () => document.getElementById(LANDING_ID)?.scrollIntoView({ behavior: "smooth" }),
    lockMs: REPEAT_MS,
  }));
</script>

<div
  bind:this={pageEl}
  class="dogs-main w-full h-full relative overflow-hidden select-none"
  style={`--flip-ms: ${FLIP_MS}ms;`}
  role="region"
  aria-roledescription="two-sided card"
  aria-label={`DOGS, showing ${SIDE_NAMES[side]}`}
>
  <div class="matrix-layer absolute inset-0 z-0 pointer-events-none overflow-hidden"><BinaryBackground {isFlagColors} /></div>

  <div class="deck absolute inset-0 z-10" class:turned class:odd={turns % 2 === 1}>
    <div class="card w-full h-full relative" style={`transform: rotateY(${turns * 180}deg);`}>
      <div class="face front" class:up={side === SIDE_APPS} inert={side !== SIDE_APPS}>
        <ProjectsSide {isFlagColors} shown={active} active={ready && side === SIDE_APPS} onflip={flip} />
      </div>
      <div class="face back" class:up={side === SIDE_DOGS} inert={side !== SIDE_DOGS}>
        <DogsSide {isFlagColors} shown={active} active={ready && side === SIDE_DOGS} flipMs={FLIP_MS} onflip={flip} />
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @use "../styles/gallery" as g;

  .dogs-main { background: g.$page-bg; color: g.$ink; font-family: g.$font; }
  .matrix-layer { opacity: 0.35; }

  // ---- The card: two faces back to back, turned about the vertical axis -------------------------------
  .deck { perspective: 2400px; }
  .card {
    transform-style: preserve-3d;
    transition: transform var(--flip-ms) g.$ease;
  }
  .face {
    position: absolute; top: 0; right: 0; bottom: 0; left: 0; overflow: hidden;
    -webkit-backface-visibility: hidden; backface-visibility: hidden;
    pointer-events: none;
  }
  .face.up { pointer-events: auto; }
  .back { transform: rotateY(180deg); }

  // While it turns, the card lifts off the page a little and settles back (two names so every turn replays)
  .deck.turned { animation: lift-a var(--flip-ms) g.$ease; }
  .deck.turned.odd { animation-name: lift-b; }
  @keyframes lift-a { 50% { transform: scale(0.9); } }
  @keyframes lift-b { 50% { transform: scale(0.9); } }

  // Reduced motion: the sides cross-fade in place
  @media (prefers-reduced-motion: reduce) {
    .card { transform: none !important; transition: none; }
    .deck.turned, .deck.turned.odd { animation: none; }
    .back { transform: none; }
    .face { opacity: 0; transition: opacity 0.25s linear; }
    .face.up { opacity: 1; }
  }
</style>
