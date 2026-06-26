<script>
  import { onMount } from "svelte";

  let {
    tabs = [], // Array of { id: string, label: string, icon: Component }
    activeTab = $bindable(),
    onTabChange
  } = $props();

  let containerRef = $state();
  let tabRefs = $state({});

  // Auto-scroll the active tab to the center of the viewport/container
  $effect(() => {
    const activeId = activeTab;
    if (!activeId) return;

    // Run after DOM updates
    setTimeout(() => {
      const activeEl = tabRefs[activeId];
      const containerEl = containerRef;
      if (!activeEl || !containerEl) return;

      // Compatibility check for smooth centering
      if (typeof activeEl.scrollIntoView === "function") {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      } else {
        // Fallback calculation for older browsers (Potato Target)
        const containerWidth = containerEl.clientWidth;
        const activeWidth = activeEl.clientWidth;
        const activeLeft = activeEl.offsetLeft;
        containerEl.scrollLeft = activeLeft - containerWidth / 2 + activeWidth / 2;
      }
    }, 50);
  });

  function selectTab(id) {
    activeTab = id;
    if (onTabChange) onTabChange(id);
  }
</script>

<div
  bind:this={containerRef}
  class="swipe-tab-nav scroll-container"
  class:evenly-spaced={tabs.length <= 4}
  class:fluid-scrolling={tabs.length > 4}
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
