<script>
  import { onMount } from "svelte";

  let {
    tabs = [], // Array of { id: string, label: string, icon: Component }
    activeTab = $bindable(),
    onTabChange
  } = $props();

  let containerRef = $state();
  let tabRefs = $state({});

  // Mouse & Touch drag variables for swipe/scroll gestures
  let isDown = $state(false);
  let startX = $state(0);
  let scrollLeft = $state(0);

  let touchStartX = 0;
  let touchStartY = 0;
  let mouseStartX = 0;
  let mouseStartY = 0;

  // Auto-scroll the active tab to the center of the viewport/container locally
  $effect(() => {
    const activeId = activeTab;
    if (!activeId) return;

    // Run after DOM updates
    setTimeout(() => {
      const activeEl = tabRefs[activeId];
      const containerEl = containerRef;
      if (!activeEl || !containerEl) return;

      const containerWidth = containerEl.clientWidth;
      const activeWidth = activeEl.clientWidth;
      const activeLeft = activeEl.offsetLeft;
      const targetScrollLeft = activeLeft - containerWidth / 2 + activeWidth / 2;

      // Use local container scrolling instead of global scrollIntoView to avoid parent window shifting
      if (typeof containerEl.scrollTo === "function") {
        containerEl.scrollTo({
          left: targetScrollLeft,
          behavior: "smooth",
        });
      } else {
        containerEl.scrollLeft = targetScrollLeft;
      }
    }, 50);
  });

  function selectTab(id) {
    activeTab = id;
    if (onTabChange) onTabChange(id);
  }

  // Mouse drag handlers
  function handleMouseDown(e) {
    isDown = true;
    startX = e.pageX - containerRef.offsetLeft;
    scrollLeft = containerRef.scrollLeft;
    mouseStartX = e.clientX;
    mouseStartY = e.clientY;
  }

  function handleMouseLeave() {
    isDown = false;
  }

  // Handle global mouse up to ensure drag finishes cleanly
  function handleMouseUp(e) {
    if (!isDown) return;
    isDown = false;
    const diffX = e.clientX - mouseStartX;
    const diffY = e.clientY - mouseStartY;
    if (Math.abs(diffX) <= Math.abs(diffY) || Math.abs(diffX) <= 60) return;

    const idx = tabs.findIndex(t => t.id === activeTab);
    if (idx === -1) return;

    if (diffX < 0 && idx < tabs.length - 1) {
      selectTab(tabs[idx + 1].id);
    } else if (diffX > 0 && idx > 0) {
      selectTab(tabs[idx - 1].id);
    }
  }

  function handleMouseMove(e) {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - containerRef.offsetLeft;
    const walk = (x - startX) * 1.5; // multiplier for speed
    containerRef.scrollLeft = scrollLeft - walk;
  }

  // Touch drag handlers
  function handleTouchStart(e) {
    isDown = true;
    startX = e.touches[0].pageX - containerRef.offsetLeft;
    scrollLeft = containerRef.scrollLeft;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    if (!isDown) return;
    isDown = false;
    if (!e.changedTouches || e.changedTouches.length === 0) return;

    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(diffX) <= Math.abs(diffY) || Math.abs(diffX) <= 60) return;

    const idx = tabs.findIndex(t => t.id === activeTab);
    if (idx === -1) return;

    if (diffX < 0 && idx < tabs.length - 1) {
      selectTab(tabs[idx + 1].id);
    } else if (diffX > 0 && idx > 0) {
      selectTab(tabs[idx - 1].id);
    }
  }

  function handleTouchMove(e) {
    if (!isDown) return;
    const x = e.touches[0].pageX - containerRef.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.scrollLeft = scrollLeft - walk;
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role a11y_interactive_supports_focus a11y_no_static_element_interactions -->
<div
  bind:this={containerRef}
  class="swipe-tab-nav scroll-container"
  class:evenly-spaced={tabs.length <= 4}
  class:fluid-scrolling={tabs.length > 4}
  class:dragging={isDown}
  role="tablist"
  tabindex="-1"
  aria-label="Tab navigation"
  onmousedown={handleMouseDown}
  onmouseleave={handleMouseLeave}
  onmouseup={handleMouseUp}
  onmousemove={handleMouseMove}
  ontouchstart={handleTouchStart}
  ontouchend={handleTouchEnd}
  ontouchmove={handleTouchMove}
>
  {#each tabs as tab}
    <button
      bind:this={tabRefs[tab.id]}
      class="tab-btn"
      class:active={activeTab === tab.id}
      onclick={() => selectTab(tab.id)}
      role="tab"
      aria-selected={activeTab === tab.id}
    >
      {#if tab.icon}
        <span class="tab-icon">
          <tab.icon size={15} />
        </span>
      {/if}
      <span class="tab-label">{tab.label}</span>
    </button>
  {/each}
</div>

<style>
  .swipe-tab-nav {
    display: flex;
    width: 100%;
    background: rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding: 2px;
    box-sizing: border-box;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    cursor: grab;
    user-select: none;
  }

  .swipe-tab-nav.dragging {
    cursor: grabbing;
  }

  /* Hide scrollbars */
  .swipe-tab-nav::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
  .swipe-tab-nav {
    scrollbar-width: none;
  }

  .swipe-tab-nav.evenly-spaced {
    justify-content: space-around;
  }

  .swipe-tab-nav.fluid-scrolling {
    justify-content: flex-start;
    gap: 0.5rem;
  }

  .tab-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.45);
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    white-space: nowrap;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .tab-btn:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.03);
  }

  .tab-btn.active {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 
      0 0 10px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
  }

  .tab-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
