<script>
  import { Bluetooth, ArrowRight } from 'lucide-svelte';
  export let onAir;
</script>

<section class="dt-unavailable w-full flex flex-col sm:flex-row md:flex-col lg:flex-col xl:flex-row 2xl:flex-row">
  <Bluetooth size={40} aria-hidden="true" />
  <div>
    <h2>Bluetooth has a different job.</h2>
    <p>Browsers can talk to some Bluetooth accessories, but they cannot share files with another phone or laptop browser over Bluetooth.</p>
    <p>Air Train connects your devices with a QR code and sends files and text over Wi-Fi. No Bluetooth pairing needed.</p>
    <button class="dt-primary" onclick={onAir}>Open Air Train <ArrowRight size={16} /></button>
  </div>
</section>
