<script>
  import NearbyTransfer from './NearbyTransfer.svelte';
  import QrTransfer from './QrTransfer.svelte';
  import DropTransfer from './DropTransfer.svelte';
  import { Radio, QrCode, Share2 } from 'lucide-svelte';
  import './dataTrain.scss';

  const TABS = [
    { id: 'air', label: 'Air Train', icon: Radio },
    { id: 'drop', label: 'Drop Train', icon: Share2 },
    { id: 'qr', label: 'QR Train', icon: QrCode },
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
    <div class="dt-air-container" hidden={activeTab !== 'drop'}><DropTransfer onUseAir={() => activeTab = 'air'} /></div>
    {#if activeTab === 'qr'}
      <div class="dt-legacy">
        <QrTransfer />
        <p class="dt-optical-note">Tiny files via flashing QR codes. Photos, audio, text: <button onclick={() => activeTab = 'air'}>Air Train →</button></p>
      </div>
    {/if}
  </div>
</div>
