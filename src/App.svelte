<script>
  import { onMount } from "svelte";
  import TitlePage from "./components/TitlePage.svelte";
  import DogsMain from "./components/DogsMain.svelte";
  import { themeManager } from "./lib/themeManager.svelte.js";

  // Bindable states from TitlePage to control scroll locking
  let activePage = $state(null);
  let showInfo = $state(false);
  let weAreDogsColored = $state(false);

  let mainContainer = $state();

  onMount(() => {
    // Check initial pathname on mount
    const checkInitialPath = () => {
      if (window.location.pathname === "/info") {
        const infoEl = document.getElementById("info-page");
        if (infoEl) {
          infoEl.scrollIntoView({ behavior: "auto" }); // Instant jump on load
        }
      }
    };

    // Delay slightly to ensure elements are rendered and sized
    setTimeout(checkInitialPath, 50);

    // Scroll listener to update the URL between '/' and '/info'
    const handleScroll = () => {
      if (!mainContainer || activePage !== null || showInfo) return;

      const scrollTop = mainContainer.scrollTop;
      const height = window.innerHeight;
      const currentPath = window.location.pathname;

      if (scrollTop >= height * 0.5) {
        if (currentPath !== "/info") {
          window.history.replaceState({ path: "/info" }, "", "/info");
        }
      } else {
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
      if (!mainContainer) return;
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

    mainContainer?.addEventListener("touchstart", handleTouchStart, { passive: true });
    mainContainer?.addEventListener("touchmove", handleTouchMove, { passive: false });

    // Handle back/forward buttons
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath === "/info") {
        document.getElementById("info-page")?.scrollIntoView({ behavior: "smooth" });
      } else {
        document.getElementById("landing-page")?.scrollIntoView({ behavior: "smooth" });
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
  class="w-screen h-dvh scroll-smooth"
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
    <TitlePage
      bind:activePage={activePage}
      bind:showInfo={showInfo}
      bind:weAreDogsColored={weAreDogsColored}
    />
  </div>

  <div
    id="info-page"
    class="w-full h-dvh snap-start snap-always relative overflow-hidden"
  >
    <DogsMain isFlagColors={weAreDogsColored} />
  </div>
</main>
