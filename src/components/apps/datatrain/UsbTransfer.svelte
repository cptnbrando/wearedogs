<script>
  import { Usb, ArrowRight } from 'lucide-svelte';
  export let onAir;
</script>

<section class="dt-unavailable w-full flex flex-col sm:flex-row md:flex-col lg:flex-col xl:flex-row 2xl:flex-row">
  <Usb size={40} aria-hidden="true" />
  <div>
    <h2>A cable isn't a browser connection.</h2>
    <p>WebUSB does not give this app access to your phone's files or make it a USB drive. Use your computer's file manager for cable transfers.</p>
    <p>To share inside DOGS, connect with Air Train and choose the files you want to send.</p>
    <button class="dt-primary" onclick={onAir}>Open Air Train <ArrowRight size={16} /></button>
  </div>
</section>
