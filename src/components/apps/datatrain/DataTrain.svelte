<script>
  import { onMount } from "svelte";
  import { Zap, Bluetooth, Usb, Share2 } from "lucide-svelte";
  import QrTransfer from "./QrTransfer.svelte";
  import BluetoothTransfer from "./BluetoothTransfer.svelte";
  import UsbTransfer from "./UsbTransfer.svelte";
  import NearbyTransfer from "./NearbyTransfer.svelte";

  // Data Train Tabs
  const tabs = [
    { id: "qr", label: "QR Train", icon: Zap, desc: "Visual Flash data transfer" },
    { id: "bluetooth", label: "Blue Train", icon: Bluetooth, desc: "Web Bluetooth peer transfer" },
    { id: "usb", label: "USB Train", icon: Usb, desc: "WebUSB device storage" },
    { id: "air", label: "Air Train", icon: Share2, desc: "Nearby WebRTC P2P direct share" }
  ];

  let activeTab = $state("qr");
</script>

<div class="datatrain-layout">
  <!-- Interactive Navigation Header -->
  <header class="datatrain-header">
    <!-- <div class="header-brand">
      <div class="glow-pulse-circle"></div>
      <h2>DATA TRAIN</h2>
    </div> -->

    <!-- Responsive Toggles Grid -->
    <div class="tab-scroller">
      <div class="tabs-grid">
        {#each tabs as tab}
          <button 
            class="tab-link-btn" 
            class:active={activeTab === tab.id}
            onclick={() => activeTab = tab.id}
            title={tab.desc}
          >
            <tab.icon size={13} class="tab-icon-svg" />
            <span class="btn-text">{tab.label}</span>
          </button>
        {/each}
      </div>
    </div>
  </header>

  <!-- Component work boards -->
  <main class="datatrain-viewport">
    {#if activeTab === "qr"}
      <QrTransfer />
    {:else if activeTab === "bluetooth"}
      <BluetoothTransfer />
    {:else if activeTab === "usb"}
      <UsbTransfer />
    {:else if activeTab === "air"}
      <NearbyTransfer />
    {/if}
  </main>
</div>

<style lang="scss">
  .datatrain-layout {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #06060a;
    overflow: hidden;
    font-family: inherit;
  }

  .datatrain-header {
    display: flex;
    flex-direction: column;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(0, 0, 0, 0.2);
    gap: 12px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 54px;
      padding: 0 20px;
    }
  }



  .tab-scroller {
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .tabs-grid {
    display: flex;
    gap: 8px;
  }

  .tab-link-btn {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.55);
    border-radius: 6px;
    padding: 6px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
    outline: none;

    &:hover {
      background: rgba(255, 255, 255, 0.04);
      color: white;
      border-color: rgba(255, 255, 255, 0.1);
    }

    &.active {
      background: rgba(0, 240, 255, 0.08);
      color: #00f0ff;
      border-color: rgba(0, 240, 255, 0.25);
      box-shadow: 0 0 10px rgba(0, 240, 255, 0.1);
    }
  }


  .btn-text {
    font-size: 0.72rem;
    font-weight: 750;
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .datatrain-viewport {
    flex-grow: 1;
    overflow: hidden;
    position: relative;
    height: calc(100% - 94px);

    @media (min-width: 768px) {
      height: calc(100% - 54px);
    }
  }
</style>
