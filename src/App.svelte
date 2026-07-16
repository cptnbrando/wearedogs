<script>
  import { onMount } from "svelte";
  import { themeManager } from "./lib/themeManager.svelte.js";

  // Bindable states from TitlePage to control scroll locking
  let activePage = $state(null);
  let showInfo = $state(false);
  let weAreDogsColored = $state(false);
  let isLandingPage = $state(true);

  // Lazy load TitlePage as well to ensure maximum code-splitting
  let TitlePage = $state(null);
  import("./components/TitlePage.svelte").then((m) => { TitlePage = m.default; });

  // Lazy loaded DogsMain component
  let DogsMainComponent = $state(null);

  const loadDogsMain = () => {
    if (DogsMainComponent) return;
    import("./components/DogsMain.svelte").then((m) => {
      DogsMainComponent = m.default;
    });
  };

  // Preload when scrolling shifts page state
  $effect(() => {
    if (!isLandingPage) {
      loadDogsMain();
    }
  });

  let mainContainer = $state();

  $effect(() => {
    if (activePage !== null) {
      isLandingPage = true;
      document
        .getElementById("landing-page")
        ?.scrollIntoView({ behavior: "instant" });
    }
  });

  onMount(() => {
    // Check initial pathname on mount
    const checkInitialPath = () => {
      if (window.location.pathname === "/info") {
        isLandingPage = false;
        const infoEl = document.getElementById("info-page");
        if (infoEl) {
          infoEl.scrollIntoView({ behavior: "auto" }); // Instant jump on load
        }
      } else {
        isLandingPage = true;
      }
    };

    // Delay slightly to ensure elements are rendered and sized
    setTimeout(checkInitialPath, 50);

    // Scroll listener to preload DogsMain earlier (as soon as user scrolls)
    const handleScrollPreload = () => {
      if (mainContainer && mainContainer.scrollTop > 10) {
        loadDogsMain();
        mainContainer.removeEventListener("scroll", handleScrollPreload);
      }
    };
    mainContainer?.addEventListener("scroll", handleScrollPreload, { passive: true });

    // Idle fallback to preload if user remains inactive
    if (typeof requestIdleCallback !== "undefined") {
      requestIdleCallback(loadDogsMain, { timeout: 15000 });
    } else {
      setTimeout(loadDogsMain, 4000);
    }

    const handleScroll = () => {
      if (!mainContainer || activePage !== null || showInfo) return;

      const scrollTop = mainContainer.scrollTop;
      const height = window.innerHeight;
      const currentPath = window.location.pathname;

      if (scrollTop >= height * 0.5) {
        if (isLandingPage) {
          isLandingPage = false;
        }
        if (currentPath !== "/info") {
          window.history.replaceState({ path: "/info" }, "", "/info");
        }
      } else {
        if (!isLandingPage) {
          isLandingPage = true;
        }
        if (currentPath !== "/") {
          window.history.replaceState({ path: "/" }, "", "/");
        }
      }
    };

    mainContainer?.addEventListener("scroll", handleScroll, { passive: true });

    // Track touch positions to prevent pull-to-refresh when dragging down at scrollTop === 0
    let touchStartY = 0;
    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (!mainContainer || activePage !== null || showInfo) return;
      if (e.touches && e.touches.length > 0) {
        const currentY = e.touches[0].clientY;
        const diffY = currentY - touchStartY;

        // If at the top of the container and pulling down, block refresh
        if (mainContainer.scrollTop === 0 && diffY > 0) {
          if (e.cancelable) {
            e.preventDefault();
          }
        }
      }
    };

    mainContainer?.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    mainContainer?.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    // Handle back/forward buttons
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath === "/info") {
        isLandingPage = false;
        document
          .getElementById("info-page")
          ?.scrollIntoView({ behavior: "smooth" });
      } else {
        isLandingPage = true;
        document
          .getElementById("landing-page")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      mainContainer?.removeEventListener("scroll", handleScroll);
      mainContainer?.removeEventListener("touchstart", handleTouchStart);
      mainContainer?.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("popstate", handlePopState);
    };
  });
</script>

<main
  bind:this={mainContainer}
  class="w-screen h-dvh"
  class:overflow-y-auto={activePage === null && !showInfo}
  class:snap-y={activePage === null && !showInfo}
  class:snap-mandatory={activePage === null && !showInfo}
  class:overflow-hidden={activePage !== null || showInfo}
  style="background: var(--bg-main, #000000); color: var(--color-text, #ffffff); font-family: var(--font-primary, inherit); overscroll-behavior: none;"
>
  <div
    id="landing-page"
    class="w-full h-dvh snap-start snap-always relative flex items-center justify-center overflow-hidden"
  >
    {#if TitlePage}
      {@const Page = TitlePage}
      <Page
        bind:activePage
        bind:showInfo
        bind:weAreDogsColored
        {isLandingPage}
      />
    {/if}
  </div>

  <div
    id="info-page"
    class="w-full h-dvh snap-start snap-always relative overflow-hidden"
  >
    {#if DogsMainComponent}
      {@const Main = DogsMainComponent}
      <Main isFlagColors={weAreDogsColored} active={!isLandingPage} {activePage} />
    {:else}
      <div class="w-full h-full flex items-center justify-center bg-transparent pointer-events-none">
        <div class="text-white/20 text-xs font-mono tracking-widest uppercase animate-pulse">
          Initializing 3D Visualizer...
        </div>
      </div>
    {/if}
  </div>
</main>
