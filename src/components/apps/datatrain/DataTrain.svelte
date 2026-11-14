<script>
  import NearbyTransfer from './NearbyTransfer.svelte';
  import QrTransfer from './QrTransfer.svelte';
  import BluetoothTransfer from './BluetoothTransfer.svelte';
  import UsbTransfer from './UsbTransfer.svelte';
  import { Radio, QrCode, Bluetooth, Usb } from 'lucide-svelte';
  import './dataTrain.scss';

  const TABS = [
    { id: 'air', label: 'Air Train', icon: Radio },
    { id: 'qr', label: 'QR Train', icon: QrCode },
    { id: 'bluetooth', label: 'Blue Train', icon: Bluetooth },
    { id: 'usb', label: 'USB Train', icon: Usb },
  ];
  let activeTab = 'air';
</script>

<div class="dt-shell w-full flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row">
  <nav class="dt-nav" aria-label="Transfer methods">
    {#each TABS as tab}
      <button class:dt-active={activeTab === tab.id} aria-pressed={activeTab === tab.id} onclick={() => activeTab = tab.id}>
        <svelte:component this={tab.icon} size={18} />
        <span>{tab.label}</span>
      </button>
    {/each}
  </nav>
  <div class="dt-content">
    <div class="dt-air-container" hidden={activeTab !== 'air'}><NearbyTransfer /></div>
    {#if activeTab === 'qr'}
      <div class="dt-legacy">
        <p class="dt-optical-note">QR Train sends tiny files through flashing images. For photos, audio, and text between devices, use <button onclick={() => activeTab = 'air'}>Air Train →</button></p>
        <QrTransfer />
      </div>
    {:else if activeTab === 'bluetooth'}
      <BluetoothTransfer onAir={() => activeTab = 'air'} />
    {:else if activeTab === 'usb'}
      <UsbTransfer onAir={() => activeTab = 'air'} />
    {/if}
  </div>
</div>
