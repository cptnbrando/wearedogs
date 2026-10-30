<script>
  import { onMount, onDestroy } from "svelte";
  import { Check, AlertCircle } from "lucide-svelte";
  import { SANDBAGS } from "./sandbags.js";
  import { copyText } from "../../../lib/clipboard.js";

  const TOAST_MS = 2600;
  const PREVIEW_CHARS = 160;
  const LOADING_PREVIEW = "Loading…";
  const FAILED_PREVIEW = "Couldn't reach the source. Reopen the app to retry.";
  const ENCODER = new TextEncoder();
  const NUMBER_FORMAT = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  // Sizes are measured once: code points (what a human calls characters) and
  // UTF-8 bytes (what a database column actually stores)
  const measure = (bag) => ({
    ...bag,
    preview: bag.text ? bag.text.slice(0, PREVIEW_CHARS) : LOADING_PREVIEW,
    chars: Array.from(bag.text).length,
    bytes: ENCODER.encode(bag.text).length,
  });

  let bags = SANDBAGS.map(measure);
  let failedIds = [];
  let toast = null;
  let toastTimer = null;
  let thrownId = null;

  /** @param {boolean} ok @param {string} text @param {string | null} id */
  function showToast(ok, text, id = null) {
    clearTimeout(toastTimer);
    thrownId = id;
    toast = { ok, text };
    toastTimer = setTimeout(() => {
      toast = null;
      thrownId = null;
    }, TOAST_MS);
  }

  /** @param {typeof bags[number]} bag */
  async function throwSand(bag) {
    if (failedIds.includes(bag.id)) return showToast(false, `Couldn't load ${bag.title}`);
    if (!bag.text) return showToast(false, `${bag.title} is still loading`);
    if (!(await copyText(bag.text))) return showToast(false, `Couldn't copy ${bag.title}`);
    showToast(true, `${bag.title} copied · ${bag.chars.toLocaleString()} chars`, bag.id);
  }

  // Remote bags are fetched up front, so a tap copies from memory and stays
  // inside the user gesture the clipboard demands. The HTTP cache keeps
  // repeat visits off the network.
  onMount(() => {
    for (const { id, src, strip } of SANDBAGS.filter((bag) => bag.src)) {
      src
        .reduce(
          (prev, url) => prev.catch(() => fetch(url).then((res) => (res.ok ? res.text() : Promise.reject(res.status)))),
          Promise.reject(),
        )
        .then((raw) => {
          const text = strip ? raw.replace(strip, "") : raw;
          bags = bags.map((bag) => (bag.id === id ? measure({ ...bag, text }) : bag));
        })
        .catch(() => {
          failedIds = [...failedIds, id];
          bags = bags.map((bag) => (bag.id === id ? { ...bag, preview: FAILED_PREVIEW } : bag));
        });
    }
  });

  onDestroy(() => clearTimeout(toastTimer));
</script>

<!-- Sized by @container queries: the Toolbox shell caps its own width, so
     viewport breakpoints would misjudge how much room the grid really has -->
<div class="pocket-sand @container relative flex h-full w-full flex-col overflow-hidden">
  <p
    class="sand-hint shrink-0 px-4 pt-3 pb-2 text-[0.65rem] @3xl:px-5 @3xl:pt-4 @6xl:px-8 @6xl:text-xs [@media(max-height:500px)]:hidden"
  >
    Tap a bag to copy it · {bags.length} payloads for stress testing text boxes you own
  </p>

  <div class="sand-scroll min-h-0 grow overflow-x-hidden overflow-y-auto">
    <ul
      class="mx-auto grid w-full max-w-7xl grid-cols-2 gap-2.5 px-4 pb-20 @lg:grid-cols-3 @3xl:grid-cols-4 @3xl:gap-3 @3xl:px-5 @6xl:grid-cols-5 @6xl:gap-4 @6xl:px-8 @[110rem]:grid-cols-6 [@media(max-height:500px)]:grid-cols-4 [@media(max-height:500px)]:gap-2 [@media(max-height:500px)]:pt-2"
    >
      {#each bags as bag (bag.id)}
        <li class="min-w-0">
          <button
            class="sand-card flex w-full flex-col text-left"
            class:thrown={thrownId === bag.id}
            onclick={() => throwSand(bag)}
            aria-label="Copy {bag.title} ({bag.chars} characters)"
          >
            <span
              class="sand-sheet relative block h-24 overflow-hidden @3xl:h-28 @6xl:h-36 [@media(max-height:500px)]:h-14"
              aria-hidden="true"
            >
              <span class="sand-preview block p-2 text-[0.55rem] @6xl:p-3 @6xl:text-[0.65rem]">{bag.preview}</span>
              <span class="sand-tag absolute top-1.5 right-1.5 px-1.5 text-[0.55rem] @6xl:text-[0.65rem]">{bag.tag}</span>
            </span>
            <span class="flex min-w-0 items-center gap-2 px-2.5 py-2 @6xl:gap-3 @6xl:px-3 @6xl:py-2.5">
              <span class="sand-glyph shrink-0 text-base @6xl:text-xl">{bag.glyph}</span>
              <span class="flex min-w-0 flex-col">
                <span class="sand-title truncate text-xs font-bold @6xl:text-sm">{bag.title}</span>
                <span class="sand-meta truncate text-[0.6rem] @6xl:text-[0.7rem]">
                  {NUMBER_FORMAT.format(bag.chars)} chars · {NUMBER_FORMAT.format(bag.bytes)}B
                </span>
              </span>
            </span>
          </button>
        </li>
      {/each}
    </ul>
  </div>

  <div class="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4 @6xl:bottom-6" aria-live="polite">
    {#if toast}
      <div
        class="sand-toast flex max-w-full items-center gap-2 px-4 py-2.5 text-xs font-bold @6xl:text-sm"
        class:error={!toast.ok}
      >
        {#if toast.ok}<Check size={16} />{:else}<AlertCircle size={16} />{/if}
        <span class="truncate">{toast.text}</span>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  @use "../../../styles/variables" as *;

  .pocket-sand {
    background: $bg-app-dark;
    color: #fff;
    font-family: $font-primary;
  }

  .sand-hint {
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.04em;
  }

  .sand-scroll {
    scrollbar-width: thin;
  }

  .sand-card {
    background: $bg-card-dark;
    border: 1px solid $border-light;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    color: inherit;
    font: inherit;
    transition:
      border-color $transition-speed-fast,
      transform $transition-speed-fast,
      box-shadow $transition-speed-normal;

    &:hover,
    &:focus-visible {
      border-color: $color-sand-line;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45);
      outline: none;
    }

    &:active {
      transform: scale(0.97);
    }

    &.thrown {
      border-color: $color-sand;
      box-shadow: 0 0 18px $color-sand-glow;
    }
  }

  // The "file thumbnail": a dark sheet with the payload's first lines on it
  .sand-sheet {
    background: $bg-input-dark;
    border-bottom: 1px solid $border-light;
  }

  .sand-preview {
    color: rgba(255, 255, 255, 0.45);
    font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
    line-height: 1.35;
    white-space: pre-wrap;
    word-break: break-all;
    // Payloads include RTL overrides and zalgo — keep them inside the sheet
    unicode-bidi: isolate;
    direction: ltr;
  }

  .sand-tag {
    // Soft tint over an opaque base, so preview text never shows through
    background: linear-gradient($color-sand-soft, $color-sand-soft), $bg-app-dark;
    box-shadow: -6px 0 8px $bg-app-dark;
    color: $color-sand;
    border-radius: 4px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .sand-glyph {
    line-height: 1;
  }

  .sand-meta {
    color: rgba(255, 255, 255, 0.4);
  }

  .sand-toast {
    background: $color-sand-soft;
    border: 1px solid $color-sand-line;
    color: $color-sand;
    border-radius: 8px;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    animation: sandToastIn $transition-speed-normal ease-out;

    &.error {
      background: rgba(255, 51, 68, 0.12);
      border-color: rgba(255, 51, 68, 0.35);
      color: $color-neon-red;
    }
  }

  @keyframes sandToastIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
